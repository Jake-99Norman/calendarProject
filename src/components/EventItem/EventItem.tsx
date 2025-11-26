import type { Event } from "../../types/types"

type EventItemProps = {
  event: Event
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export default function EventItem({ event, onClick }: EventItemProps) {
  // Format time from "HH:MM" to "h:mm AM/PM"
  function formatTime(time?: string) {
    if (!time) return ""
    const [h, m] = time.split(":")
    let hour = parseInt(h, 10)
    const minute = parseInt(m, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`
  }

  return (
    <div
      className="event-item"
      style={{ borderLeftColor: event.color || "var(--event-blue)" }}
      onClick={onClick} // MouseEvent is handled by parent (DayCell)
    >
      <div className="event-title">{event.title}</div>

      {/* Show time only if not all-day */}
      {!event.allDay && (
        <div className="event-time">
          {event.startTime && formatTime(event.startTime)}
          {event.endTime && ` - ${formatTime(event.endTime)}`}
        </div>
      )}

      {event.allDay && <div className="event-time">All Day</div>}
    </div>
  )
}
