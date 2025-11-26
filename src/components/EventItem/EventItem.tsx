import type { Event } from "../../types/types";
import styles from "./EventItem.module.css";

type EventItemProps = {
  event: Event;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function EventItem({ event, onClick }: EventItemProps) {
  function formatTime(time?: string) {
    if (!time) return "";
    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
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
