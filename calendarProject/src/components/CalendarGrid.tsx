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

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const prevMonth = month === 0 ? 11 : month - 1
  const prevMonthYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

  const leadingDays = firstDayOfWeek
  const totalCells = 42
  const trailingDays = totalCells - (leadingDays + daysInMonth)

  const calendarCells = [
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

  function eventsForDate(y: number, m: number, d: number) {
    const key = `${y}-${m + 1}-${d}`
    const dayEvents = events.filter((e) => e.date === key)

    return dayEvents.sort((a, b) => {
        if(a.allDay && !b.allDay) return -1
        if( !a.allDay && b.allDay) return 1
        if(a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime)
            return 0
    })
}

  const maxEvents = 5

  return (
    <div className="calendar-container">
      <div className="calendar">

        {/* Weekday Headers */}
        <div className="weekday-row">
          {WEEKDAYS.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        {/* 42-Day Grid */}
        <div className="calendar-grid">
          {calendarCells.map((cell, i) => {
            const { day, month: m, year: y, isCurrentMonth } = cell
            const dayEvents = eventsForDate(y, m, day)
            const isToday =
              day === today.getDate() &&
              m === today.getMonth() &&
              y === today.getFullYear()

            const hasOverflow = dayEvents.length > maxEvents

            return (
              <div
                key={i}
                className={`day ${!isCurrentMonth ? "faded" : ""} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => onDayClick(`${y}-${m + 1}-${day}`)}
              >
                <div className="day-number">{day}</div>

                {dayEvents.slice(0, maxEvents).map((event) => (
                  <div
                    key={event.id}
                    className="event"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}

                {hasOverflow && onOverflowClick && (
                  <button
                    className="overflow-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOverflowClick(`${y}-${m + 1}-${day}`, dayEvents)
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
