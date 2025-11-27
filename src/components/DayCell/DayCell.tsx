import type { Event } from "../../types/types";
import EventItem from "../EventItem/EventItem";
import styles from "./DayCell.module.css"; // CSS Modules import

type DayCellProps = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  events: Event[];
  maxEvents: number;
  weekdayLabel?: string; // optional
  onDayClick: (date: string) => void;
  onEventClick: (event: Event) => void;
  onOverflowClick: (date: string, events: Event[]) => void;
};

export default function DayCell({
  day,
  month,
  year,
  isCurrentMonth,
  isToday,
  isPast,
  events,
  maxEvents,
  weekdayLabel,
  onDayClick,
  onEventClick,
  onOverflowClick,
}: DayCellProps) {
  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  const visibleEvents = events.slice(0, maxEvents);
  const overflowCount = events.length - maxEvents;

  // Handlers
  const handleDayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onDayClick(dateKey);
  };

  const handleOverflowClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onOverflowClick(dateKey, events);
  };

  // Compose class names using CSS Modules
  const dayCellClass = [
    styles.dayCell,
    !isCurrentMonth ? styles.notCurrent : "",
    isToday ? styles.today : "",
    isPast ? styles.past : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={dayCellClass} onClick={handleDayClick}>
      {/* Weekday label above day number if provided */}
      {weekdayLabel && <div className={styles.weekday}>{weekdayLabel}</div>}

      <div className={styles.dayNumber}>{day}</div>

      <div className={styles.eventsContainer}>
        {visibleEvents.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          />
        ))}
      </div>

      {overflowCount > 0 && (
        <button className={styles.overflowBtn} onClick={handleOverflowClick}>
          +{overflowCount} more
        </button>
      )}
    </div>
  );
}
