import type { Event } from "../../types/types";
import styles from "./EventItem.module.css";
import { parse, format } from "date-fns";

type EventItemProps = {
  event: Event;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function EventItem({ event, onClick }: EventItemProps) {
  function formatTime(time?: string) {
    if (!time) return "";
    
    // Parses "HH:mm" into a Date object
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a"); // → "3:05 PM"
  }

  const eventColorClass =
    event.color === "red"
      ? styles.red
      : event.color === "green"
      ? styles.green
      : styles.blue;

  return (
    <div
      className={`${styles.eventItem} ${eventColorClass}`}
      onClick={onClick}
    >
      <div className={styles.eventTitle}>{event.title}</div>

      {!event.allDay ? (
        <div className={styles.eventTime}>
          {event.startTime && formatTime(event.startTime)}
          {event.endTime && ` - ${formatTime(event.endTime)}`}
        </div>
      ) : (
        <div className={styles.eventTime}>All Day</div>
      )}
    </div>
  );
}
