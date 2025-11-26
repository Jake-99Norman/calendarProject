import type { Event } from "../../types/types"
import EventItem from "../EventItem/EventItem"

type DayCellProps = {
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
  isPast: boolean
  events: Event[]
  maxEvents: number
  onDayClick: (date: string) => void
  onEventClick: (event: Event) => void
  onOverflowClick: (date: string, events: Event[]) => void
}

export default function DayCell({
  day,
  month,
  year,
  isCurrentMonth,
  isToday,
  isPast,
  events,
  maxEvents,
  onDayClick,
  onEventClick,
  onOverflowClick,
}: DayCellProps) {
  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`

  const visibleEvents = events.slice(0, maxEvents)
  const overflowCount = events.length - maxEvents

  // Handlers

  const handleDayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    onDayClick(dateKey)
  }

  const handleOverflowClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation()
    onOverflowClick(dateKey, events)
  }

  // Render

  return (
    <div
      className={`day-cell 
        ${isCurrentMonth ? "" : "not-current"} 
        ${isToday ? "today" : ""} 
        ${isPast ? "past" : ""}`}
      onClick={handleDayClick}
    >
      <div className="day-number">{day}</div>

      <div className="events-container">
        {visibleEvents.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation() // Prevent triggering day click
              onEventClick(event)
            }}
          />
        ))}
      </div>

      {overflowCount > 0 && (
        <button className="overflow-btn" onClick={handleOverflowClick}>
          +{overflowCount} more
        </button>
      )}
    </div>
  )
}
