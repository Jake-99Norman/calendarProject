import type { Event } from "../../types/types";
import styles from "./OverflowModal.module.css";
import { useModalAnimation } from "../../hooks/useModalAnimation";

type OverflowModalProps = {
  events: Event[];
  date: string;
  onClose: () => void;
  onEventClick: (event: Event) => void;
};

export default function OverflowModal({
  events,
  date,
  onClose,
  onEventClick,
}: OverflowModalProps) {
  const d = new Date(date);
  const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

  const { closing, animateClose } = useModalAnimation(onClose);

  const handleClose = () => animateClose();

  return (
    <div className={styles.overflowModalOverlay} onClick={handleClose}>
      <div
        className={`${styles.overflowModalContainer} ${
          closing ? styles.modalClose : styles.modalOpen
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.overflowModalHeader}>
          <h2>{formattedDate}</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            X
          </button>
        </header>

        <div className={styles.modalBody}>
          {events.map((event) => (
            <div
              key={event.id}
              className={styles.overflowEvent}
              style={{ backgroundColor: event.color }}
              onClick={() => {
                onEventClick(event); // OPEN EDIT MODAL
                handleClose(); // Close overflow modal
              }}
            >
              {event.allDay ? "(All Day) " : ""}
              {event.title} {event.startTime ? `(${event.startTime})` : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
