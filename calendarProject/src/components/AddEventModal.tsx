import { useState } from "react";
import type { Event } from "./types";
import BaseModal from "./BaseModal";
import "./BaseModal.css";

type AddEventModalProps = {
  date: string;
  onClose: () => void;
  addEvent: (event: Event) => void;
};

export default function AddEventModal({ date, onClose, addEvent }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("hsl(200, 80%, 50%)");
  const [error, setError] = useState("");

  const handleAdd = () => {
    setError("");
    if (!title.trim()) return setError("Event name required");
    if (!isAllDay && (!startTime || !endTime)) return setError("Start and End required");
    if (!isAllDay && startTime >= endTime) return setError("Start must be before End");

    const newEvent: Event = {
      id: crypto.randomUUID(),
      date,
      title,
      allDay: isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      color,
    };
    addEvent(newEvent);
    onClose();
  };

  return (
    <BaseModal onClose={onClose} title="Add Event">
      {/* Form content */}
      <label>Name
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        <input type="checkbox" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} /> All Day
      </label>
      {!isAllDay && (
        <>
          <label>Start <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></label>
          <label>End <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></label>
        </>
      )}
      <button onClick={handleAdd}>Add Event</button>
      {error && <p className="error">{error}</p>}
    </BaseModal>
  );
}
