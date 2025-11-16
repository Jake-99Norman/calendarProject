import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import type { Event } from "../types/types"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type CalendarGridProps = {
  month: number
  year: number
  today: Date
  events: Event[]
  onDayClick: (date: string) => void
  onEventClick: (event: Event) => void
  onOverflowClick?: (date: string, events: Event[]) => void
}

export default function CalendarGrid({
  month,
  year,
  today,
  events,
  onDayClick,
  onEventClick,
  onOverflowClick,
}: CalendarGridProps) {
  const calendarRef = useRef<HTMLDivElement>(null)
  const [cellWidth, setCellWidth] = useState(0)

  useEffect(() => {
    if (!calendarRef.current) return
    const ro = new ResizeObserver(() => {
      const width = calendarRef.current!.clientWidth / 7
      setCellWidth(width)
    })
    ro.observe(calendarRef.current)
    return () => ro.disconnect()
  }, [])

  /* ----------------------------------------
     Build 42 calendar cells
  ---------------------------------------- */
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const prevMonth = month === 0 ? 11 : month - 1
  const prevMonthYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

  const leadingDays = firstDayOfWeek
  const totalCells = 42

  const calendarCells = useMemo(() => {
    const trailingDays = totalCells - (leadingDays + daysInMonth)

    return [
      ...Array.from({ length: leadingDays }, (_, i) => ({
        day: daysInPrevMonth - leadingDays + 1 + i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
      })),
      ...Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        month,
        year,
        isCurrentMonth: true,
      })),
      ...Array.from({ length: trailingDays }, (_, i) => ({
        day: i + 1,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      })),
    ]
  }, [month, year])

  /* ----------------------------------------
     Memoize events by date (1 filter pass)
  ---------------------------------------- */
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>()

    for (const e of events) {
      const key = e.date
      const arr = map.get(key) ?? []
      arr.push(e)
      map.set(key, arr)
    }

    for (const arr of map.values()) {
      arr.sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1

        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime)
        }

        if (a.startTime && !b.startTime) return 1
        if (!a.startTime && b.startTime) return -1

        return 0
      })
    }

    return map
  }, [events])

  const formatTime = useCallback((time?: string) => {
    if (!time) return ""
    const [h, m] = time.split(":")
    let hour = parseInt(h, 10)
    const minute = parseInt(m, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`
  }, [])

  /* ----------------------------------------
     Dynamic overflow: fits N rows per height
  ---------------------------------------- */
  const estimatedEventHeight = 30
  const estimatedHeaderHeight = 30

  const maxEvents = cellWidth
    ? Math.max(
        1,
        Math.floor((cellWidth - estimatedHeaderHeight) / estimatedEventHeight)
      )
    : 5

  return (
    <div className="calendar-container">
      <div className="calendar" ref={calendarRef}>
        {/* Weekdays */}
        <div className="weekday-row">
          {WEEKDAYS.map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="calendar-grid">
          {calendarCells.map((cell) => {
            const { day, month: m, year: y, isCurrentMonth } = cell
            const dateKey = `${y}-${m + 1}-${day}`

            const dayEvents = eventsByDate.get(dateKey) ?? []

            const cellDate = new Date(y, m, day)
            const isToday =
              today.getFullYear() === y &&
              today.getMonth() === m &&
              today.getDate() === day

            const isPast =
              isCurrentMonth &&
              cellDate <
                new Date(today.getFullYear(), today.getMonth(), today.getDate())

            const hasOverflow = dayEvents.length > maxEvents

            return (
              <div
                key={dateKey}
                className={`day ${!isCurrentMonth ? "faded" : ""} ${
                  isToday ? "today" : ""
                } ${isPast ? "past-day" : ""}`}
                onClick={() => !isPast && onDayClick(dateKey)}
              >
                <div className="day-number">{day}</div>

                {!isPast && (
                  <button
                    className="add-event-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDayClick(dateKey)
                    }}
                  >
                    +
                  </button>
                )}

                {dayEvents.slice(0, maxEvents).map((ev) => (
                  <div
                    key={ev.id}
                    className="event"
                    style={{ backgroundColor: ev.color ?? "#888" }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(ev)
                    }}
                  >
                    {ev.title}{" "}
                    {(ev.allDay || ev.startTime) && (
                      <span className="event-meta">
                        {ev.allDay
                          ? "(All Day Event)"
                          : `(${formatTime(ev.startTime)})`}
                      </span>
                    )}
                  </div>
                ))}

                {hasOverflow && onOverflowClick && (
                  <button
                    className="overflow-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOverflowClick(dateKey, dayEvents)
                    }}
                  >
                    +{dayEvents.length - maxEvents} more
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
