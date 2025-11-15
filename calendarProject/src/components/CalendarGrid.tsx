import type { Event } from "./types"
import "./Calendar.css"

export type DateState = {
  month: number
  year: number
}

export type CalendarGridProps = {
  month: number
  year: number
  today: Date
  events: Event[]
  onDayClick: (date: string) => void
  onEventClick: (event: Event) => void
  onOverflowClick?: (date: string) => void
}

type DayInfo = {
  day: number
  type: "prev" | "current" | "next"
  fullDate: string
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
  const MAX_VISIBLE_EVENTS = 5

  // --- Helpers ---
  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = new Date(year, month, 1).getDay()

  const prevMonth = month === 0 ? 11 : month - 1
  const nextMonth = month === 11 ? 0 : month + 1
  const prevYear = month === 0 ? year - 1 : year
  const nextYear = month === 11 ? year + 1 : year
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

  // --- Prev month days ---
  const prevDays: DayInfo[] = Array.from({ length: firstDay }, (_, i) => ({
    day: daysInPrevMonth - firstDay + i + 1,
    type: "prev",
    fullDate: new Date(
      prevYear,
      prevMonth,
      daysInPrevMonth - firstDay + i + 1
    ).toISOString(),
  }))

  // --- Current month days ---
  const currentDays: DayInfo[] = Array.from(
    { length: daysInMonth },
    (_, i) => ({
      day: i + 1,
      type: "current",
      fullDate: new Date(year, month, i + 1).toISOString(),
    })
  )

  // --- Next month days ---
  const totalDisplayed = prevDays.length + currentDays.length
  const totalCells = 42
  const nextDaysCount = totalCells - totalDisplayed

  const nextDays: DayInfo[] = Array.from({ length: nextDaysCount }, (_, i) => ({
    day: i + 1,
    type: "next",
    fullDate: new Date(nextYear, nextMonth, i + 1).toISOString(),
  }))

  // --- 42 Day Cells ---
  const allDays: DayInfo[] = [...prevDays, ...currentDays, ...nextDays]

  return (
    <div className="calendar-grid-container">
      <div className="calendar-grid">
        {/* Weekday Labels */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}

        {/* Actual Days */}
        {allDays.map(({ day, type, fullDate }) => {
          const currentDate = new Date(fullDate)
          currentDate.setHours(0, 0, 0, 0)

          const todayDate = new Date(today)
          todayDate.setHours(0, 0, 0, 0)

          const isPast = type === "current" && currentDate < todayDate

          const dayEvents = events.filter(
            (e) => e.date.slice(0, 10) === fullDate.slice(0, 10)
          )

          return (
            <div
              key={fullDate}
              className={`day 
                ${type !== "current" ? "faded" : ""}
                ${isPast ? "past-day" : ""}
                ${
                  type === "current" &&
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear()
                    ? "today"
                    : ""
                }`}
              onClick={() => !isPast && onDayClick(fullDate)}
            >
              <div className="day-number">
                <span
                  className={`day-number-inner ${
                    type === "current" &&
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                      ? "today-number"
                      : ""
                  }`}
                >
                  {day}
                </span>

                {type === "current" && !isPast && (
                  <button
                    className="add-on"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDayClick(fullDate)
                    }}
                  >
                    +
                  </button>
                )}
              </div>

              <div className="event-list">
                {dayEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) => (
                  <div
                    key={event.id}
                    className="event"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  >
                    {event.allDay ? "(All Day) " : ""}
                    {event.title}{" "}
                    {!event.allDay && event.startTime
                      ? `(${event.startTime})`
                      : ""}
                  </div>
                ))}

                {dayEvents.length > MAX_VISIBLE_EVENTS && onOverflowClick && (
                  <div
                    className="event-overflow"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOverflowClick(fullDate)
                    }}
                  >
                    +{dayEvents.length - MAX_VISIBLE_EVENTS} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
