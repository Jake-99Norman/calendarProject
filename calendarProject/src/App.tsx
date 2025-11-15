import { useState } from "react";
import { CalendarHeader } from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import type { Event } from "./components/types";
import AddEventModal from "./components/AddEventModal";
import EditEventModal from "./components/EditEventModal";

export default function App() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);

  // --- Modal state ---
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  // --- Month Navigation ---
  function handlePrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function returnToToday() {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }

  // --- Event Handlers ---
  function handleAddEvent(newEvent: Event) {
    setEvents((prev) => [...prev, newEvent]);
    setSelectedDate(null);
  }

  function handleUpdateEvent(updatedEvent: Event) {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    setEditingEvent(null);
  }

  function handleDeleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setEditingEvent(null);
  }

  function onDayClick(date: string) {
    setSelectedDate(date); // Open AddEventModal
  }

  function onEventClick(event: Event) {
    setEditingEvent(event); // Open EditEventModal
  }

  function onOverflowClick(date: string) {
    console.log("Overflow clicked for:", date);
    // Optional: open overflow modal
  }

  return (
    <div>
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={returnToToday}
      />

      <CalendarGrid
        month={month}
        year={year}
        today={today}
        events={events}
        onDayClick={onDayClick}
        onEventClick={onEventClick}
        onOverflowClick={onOverflowClick}
      />

      {/* --- Add Event Modal --- */}
      {selectedDate && (
        <AddEventModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          addEvent={handleAddEvent}
        />
      )}

      {/* --- Edit Event Modal --- */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}
