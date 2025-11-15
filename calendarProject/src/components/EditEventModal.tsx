import { useState } from "react";
import type { Event } from "./types";
import BaseModal from "./BaseModal";

type EditEventModalProps = {
  event: Event;
  onClose: () => void;
  onSave: (updatedEvent: Event) => void;
  onDelete: (id: string) => void;
};

export default function EditEventModal({ event, onClose, onSave, onDelete }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title);
  const [isAllDay, setIsAllDay] = useState(event.allDay);
  const [startTime, setStartTime] = useState(event.startTime || "");
  const [endTime, setEndTime] = useState(event.endTime || "");
  const [color, setColor] = useState(event.color);
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    if (!title.trim()) return setError("Event name required");
    if (!isAllDay && (!startTime || !endTime)) return setError("Start and End required");
    if (!isAllDay && startTime >= endTime) return setError("Start must be before End");

    const updatedEvent: Event = {
      ...event,
      title,
      allDay: isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      color,
    };
    onSave(updatedEvent);
    onClose();
  };

  return (
    <BaseModal onClose={onClose} title="Edit Event">
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
      <button onClick={handleSave}>Save</button>
      <button onClick={() => onDelete(event.id)} style={{ background: "red", color: "white" }}>Delete</button>
      {error && <p className="error">{error}</p>}
    </BaseModal>
  );
}
