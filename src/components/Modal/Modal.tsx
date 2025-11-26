import { useState } from "react";
import type { Event } from "../../types/types";
import styles from "./Modal.module.css";
import { useModalAnimation } from "../../hooks/useModalAnimation";

type ModalProps = {
  date: string;
  onClose: () => void;
  addEvent: (newEvent: Event) => void;
};

export default function Modal({ date, onClose, addEvent }: ModalProps) {
  const [title, setTitle] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [color, setColor] = useState<string | null>(null);

  const { closing, animateClose } = useModalAnimation(onClose);

  const d = new Date(date);
  const formattedDate = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}/${d.getFullYear()}`;

  const handleClose = () => animateClose();

  const handleAdd = () => {
    setError("");
    if (!title.trim()) return setError("Event name is required.");
    if (!isAllDay && (!startTime || !endTime))
      return setError("Start and End times required.");
    if (!isAllDay && startTime >= endTime)
      return setError("Start time must be before End time.");

    const newEvent: Event = {
      id: crypto.randomUUID(),
      date,
      title: title.trim(),
      allDay: isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      color: color ?? "",
    };

    addEvent(newEvent);
    handleClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={`${styles.modalContainer} ${
          closing ? styles.modalClose : styles.modalOpen
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h1>Add Event</h1>
          <span>{formattedDate}</span>
          <button className={styles.modalCloseBtn} onClick={handleClose}>
            X
          </button>
        </header>

        <form className={styles.modalBody} onSubmit={(e) => e.preventDefault()}>
          {/* Event Name */}
          <div className={styles.modalEventInput}>
            <label htmlFor="event-title">Name</label>
            <input
              type="text"
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* All Day */}
          <div className={styles.daySelector}>
            <input
              type="checkbox"
              id="all-day"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
            <label htmlFor="all-day">All Day?</label>
          </div>

          {/* Time Inputs */}
          <div className={styles.modalTime}>
            <div>
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                id="start-time"
                disabled={isAllDay}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-time">End Time</label>
              <input
                type="time"
                id="end-time"
                disabled={isAllDay}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          {/* Color Selector */}
          <div className={styles.modalColorSelectorContainer}>
            <span>Color</span>
            <div className={styles.colorOptions}>
              <input
                type="radio"
                id="color-red"
                name="color"
                value="hsl(0, 75%, 60%)"
                checked={color === "hsl(0, 75%, 60%)"}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor="color-red" className={`${styles.colorBox} ${styles.red}`}></label>

              <input
                type="radio"
                id="color-blue"
                name="color"
                value="hsl(200, 80%, 50%)"
                checked={color === "hsl(200, 80%, 50%)"}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor="color-blue" className={`${styles.colorBox} ${styles.blue}`}></label>

              <input
                type="radio"
                id="color-green"
                name="color"
                value="hsl(150, 80%, 30%)"
                checked={color === "hsl(150, 80%, 30%)"}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor="color-green" className={`${styles.colorBox} ${styles.green}`}></label>

              <input
                type="radio"
                id="color-none"
                name="color"
                value=""
                checked={color === null}
                onChange={() => setColor(null)}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </form>

        <footer className={styles.modalFooter}>
          <button className={styles.modalAddBtn} type="button" onClick={handleAdd}>
            Add
          </button>
        </footer>
      </div>
    </div>
  );
}
