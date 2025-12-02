import { useState } from "react";
import type { Event } from "../../types/types";
import modalStyles from "../Modal/Modal.module.css"; // shared modal styles
import styles from "./EditEventModal.module.css";    // only delete button
import { useModalAnimation } from "../../hooks/useModalAnimation";
import "../../styles/modalAnimation.css";
import {format} from "date-fns" 

type EditModalProps = {
  event: Event;
  onClose: () => void;
  onSave: (updatedEvent: Event) => void;
  onDelete: (id: string) => void;
};

export default function EditModal({
  event,
  onClose,
  onSave,
  onDelete,
}: EditModalProps) {
  const [title, setTitle] = useState(event.title);
  const [isAllDay, setIsAllDay] = useState(event.allDay ?? false);
  const [startTime, setStartTime] = useState(event.startTime ?? "");
  const [endTime, setEndTime] = useState(event.endTime ?? "");
  const [color, setColor] = useState(event.color ?? "hsl(200, 80%, 50%)");
  const [error, setError] = useState("");

  const { closing, animateClose } = useModalAnimation(onClose);
  const handleClose = () => animateClose();

  const formattedDate = format(new Date(event.date), "EEE, MMM d")

  const handleSave = () => {
    setError("");

    if (!title.trim()) {
      setError("Event name is required.");
      return;
    }

    if (!isAllDay && (!startTime || !endTime)) {
      setError("Start and End times are required if All Day is not selected.");
      return;
    }

    if (!isAllDay && startTime >= endTime) {
      setError("Start time must be before End time.");
      return;
    }

    const updatedEvent: Event = {
      ...event,
      title: title.trim(),
      allDay: isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      color,
    };

    onSave(updatedEvent);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(event.id);
    handleClose();
  };

  return (
    <div className={modalStyles.modalOverlay} onClick={handleClose}>
      <div
        className={`${modalStyles.modalContainer} ${
          closing ? "modal-close" : "modal-open"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={modalStyles.modalHeader}>
          <h1>Edit Event</h1>
          <span>{formattedDate}</span>
          <button className={modalStyles.modalCloseBtn} onClick={handleClose}>
            X
          </button>
        </header>

        <form
          className={modalStyles.modalBody}
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Event Name */}
          <div className={modalStyles.modalEventInput}>
            <label htmlFor="event-title">Name</label>
            <input
              type="text"
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* All Day Checkbox */}
          <div className={modalStyles.daySelector}>
            <input
              type="checkbox"
              id="all-day"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
            <label htmlFor="all-day">All Day?</label>
          </div>

          {/* Time Inputs */}
          <div className={modalStyles.modalTime}>
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

          {error && <p className={modalStyles.errorMessage}>{error}</p>}

          {/* Color Selector */}
          <div className={modalStyles.modalColorSelectorContainer}>
            <span>Color</span>
            <div className={modalStyles.colorOptions}>
              {[
                { id: "color-red", value: "hsl(0, 75%, 60%)", className: "red" },
                { id: "color-blue", value: "hsl(200, 80%, 50%)", className: "blue" },
                { id: "color-green", value: "hsl(150, 80%, 30%)", className: "green" },
              ].map((c) => (
                <>
                  <input
                    key={c.id}
                    type="radio"
                    id={c.id}
                    name="color"
                    value={c.value}
                    checked={color === c.value}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <label htmlFor={c.id} className={`${modalStyles.colorBox} ${modalStyles[c.className]}`}></label>
                </>
              ))}
            </div>
          </div>
        </form>

        <footer className={modalStyles.modalFooter}>
          <button
            type="button"
            className={modalStyles.modalAddBtn}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className={styles.modalDeleteBtn} // uses EditEventModal.module.css
            onClick={handleDelete}
          >
            Delete
          </button>
        </footer>
      </div>
    </div>
  );
}
