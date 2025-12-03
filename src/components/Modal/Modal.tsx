import { useState, useEffect } from "react";
import type { Event } from "../../types/types";
import styles from "./Modal.module.css";
import { useModalAnimation } from "../../hooks/useModalAnimation";
import { format, parseISO } from "date-fns";

type ModalProps = {
  date: string; // "yyyy-MM-dd"
  onClose: () => void;
  addEvent: (event: Event) => void;
  editEvent?: Event; // optional: if editing an event
  deleteEvent?: (id: string) => void;
};

export default function Modal({
  date,
  onClose,
  addEvent,
  editEvent,
  deleteEvent,
}: ModalProps) {
  const [title, setTitle] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { closing, animateClose } = useModalAnimation(onClose);

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setIsAllDay(editEvent.allDay ?? false);
      setStartTime(editEvent.startTime ?? "");
      setEndTime(editEvent.endTime ?? "");
      setColor(editEvent.color || null);
    } else {
      setTitle("");
      setIsAllDay(false);
      setStartTime("");
      setEndTime("");
      setColor(null);
    }
    setError("");
    document.getElementById("event-title")?.focus();
  }, [date, editEvent]);

  const handleClose = () => animateClose();

  const handleAddOrEdit = () => {
    setError("");
    if (!title.trim()) return setError("Event name is required.");
    if (!isAllDay && (!startTime || !endTime))
      return setError("Start and End times are required.");
    if (!isAllDay && startTime >= endTime)
      return setError("Start time must be before End time.");

    const event: Event = {
      id: editEvent?.id ?? crypto.randomUUID(),
      date: format(new Date(date), "yyyy-MM-dd"),
      title: title.trim(),
      allDay: isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      color: color ?? "",
    };

    addEvent(event);
    handleClose();
  };

  const handleDelete = () => {
    if (deleteEvent && editEvent) {
      deleteEvent(editEvent.id);
      handleClose();
    }
  };

  const eventDate = parseISO(date + "T00:00:00");
  const formattedDate = format(eventDate, "MM/dd/yyyy");

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={`${styles.modalContainer} ${
          closing ? styles.modalClose : styles.modalOpen
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h1>{editEvent ? "Edit Event" : "Add Event"}</h1>
          <span>{formattedDate}</span>
          <button className={styles.modalCloseBtn} onClick={handleClose}>
            X
          </button>
        </header>

        <form
          className={styles.modalBody}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={styles.modalEventInput}>
            <label htmlFor="event-title">Name</label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.daySelector}>
            <input
              type="checkbox"
              id="all-day"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
            <label htmlFor="all-day">All Day?</label>
          </div>

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

          {error && <p className={styles["error-message"]}>{error}</p>}

          <div className={styles.modalColorSelectorContainer}>
            <span>Color</span>
            <div className={styles.colorOptions}>
              {["red", "green", "blue"].map((c) => {
                const colorValue =
                  c === "red"
                    ? "hsl(0, 75%, 60%)"
                    : c === "green"
                    ? "hsl(150, 80%, 30%)"
                    : "hsl(200, 80%, 50%)";
                return (
                  <div key={c}>
                    <input
                      type="radio"
                      id={`color-${c}`}
                      name="color"
                      value={colorValue}
                      checked={color === colorValue}
                      onChange={(e) => setColor(e.target.value)}
                    />
                    <label
                      htmlFor={`color-${c}`}
                      className={`${styles.colorBox} ${styles[c]}`}
                    ></label>
                  </div>
                );
              })}

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
          <button
            type="button"
            className={styles.modalAddBtn}
            onClick={handleAddOrEdit}
          >
            {editEvent ? "Save" : "Add"}
          </button>
          {editEvent && deleteEvent && (
            <button
              type="button"
              className={styles.modalDeleteBtn}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
