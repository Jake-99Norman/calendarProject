import { useState } from "react";
import type { Event } from "../types/types";
import "../styles/Modal.css";
import { useModalAnimation } from "../hooks/useModalAnimation";


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
  const [color, setColor] = useState("hsl(200, 80%, 50%)");

  const { closing, animateClose } = useModalAnimation(onClose);

  const d = new Date(date);
  const formattedDate = `${String(d.getMonth() + 1).padStart(2, "0")}/${
    String(d.getDate()).padStart(2, "0")
  }/${d.getFullYear()}`;

  const handleClose = () => animateClose();

  const handleAdd = () => {
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

    const newEvent: Event = {
      id: crypto.randomUUID(),
      date,
      title: title.trim(),
      allDay: isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      color,
    };

    addEvent(newEvent);
    handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className={`modal-container ${closing ? "modal-close" : "modal-open"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h1>Add Event</h1>
          <span>{formattedDate}</span>
          <button className="modal-close-btn" onClick={handleClose}>
            X
          </button>
        </header>

        <form className="modal-body" onSubmit={(e) => e.preventDefault()}>
          {/* Event Name */}
          <div className="modal-event-input">
            <label htmlFor="event-title">Name</label>
            <input
              type="text"
              id="event-title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* All Day Checkbox */}
          <div className="day-selector">
            <input
              type="checkbox"
              id="all-day"
              name="allDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
            <label htmlFor="all-day">All Day?</label>
          </div>

          {/* Time Inputs */}
          <div className="modal-time">
            <div>
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                id="start-time"
                name="startTime"
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
                name="endTime"
                disabled={isAllDay}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          {/* Color Selector */}
          <div className="modal-color-selector-container">
            <span>Color</span>
            <div className="color-options">
              <input
                type="radio"
                id="color-red"
                name="color"
                value="hsl(0, 75%, 60%)"
                checked={color === "hsl(0, 75%, 60%)"}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor="color-red" className="color-box red"></label>

              <input
                type="radio"
                id="color-blue"
                name="color"
                value="hsl(200, 80%, 50%)"
                checked={color === "hsl(200, 80%, 50%)"}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor="color-blue" className="color-box blue"></label>

              <input
                type="radio"
                id="color-green"
                name="color"
                value="hsl(150, 80%, 30%)"
                checked={color === "hsl(150, 80%, 30%)"}
                onChange={(e) => setColor(e.target.value)}
              />
              <label htmlFor="color-green" className="color-box green"></label>
            </div>
          </div>
        </form>

        <footer className="modal-footer">
          <button className="modal-add-btn" type="button" onClick={handleAdd}>
            Add
          </button>
        </footer>
      </div>
    </div>
  );
}
