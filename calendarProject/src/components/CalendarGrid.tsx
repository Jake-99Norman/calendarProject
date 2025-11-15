// CalendarGrid.tsx
import type { Event } from "./types";

type CalendarGridProps = {
  month: number;
  year: number;
  today: Date;
  events: Event[];
  onDayClick: (date: string) => void;
  onEventClick: (event: Event) => void;
  onOverflowClick?: (date: string, events: Event[]) => void; // <- updated
};

export default function CalendarGrid({
  month,
  year,
  today,
  events,
  onDayClick,
  onEventClick,
  onOverflowClick,
}: CalendarGridProps) {
  // Get number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper to get events for a specific day
  function eventsForDay(day: number) {
    const dateStr = `${year}-${month + 1}-${day}`;
    return events.filter((e) => e.date === dateStr);
  }

  // Max events to show directly in the cell
  const maxEventsToShow = 3;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-grid">
      {days.map((day) => {
        const dayEvents = eventsForDay(day);
        const hasOverflow = dayEvents.length > maxEventsToShow;

        return (
          <div key={day} className="calendar-day" onClick={() => onDayClick(`${year}-${month + 1}-${day}`)}>
            <div className="day-number">{day}</div>

            {/* Show events up to max */}
            {dayEvents.slice(0, maxEventsToShow).map((event) => (
              <div
                key={event.id}
                className="calendar-event"
                style={{ backgroundColor: event.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {event.title}
              </div>
            ))}

            {/* Overflow button */}
            {hasOverflow && onOverflowClick && (
              <button
                className="overflow-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOverflowClick(`${year}-${month + 1}-${day}`, dayEvents);
                }}
              >
                +{dayEvents.length - maxEventsToShow} more
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
