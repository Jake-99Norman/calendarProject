import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import CalendarHeader from "./components/CalendarHeader/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid/CalendarGrid";
import EditEventModal from "./components/EditEventModal/EditEventModal";
import OverflowModal from "./components/OverflowModal/OverflowModal";
import Modal from "./components/Modal/Modal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Event } from "./types/types";

export default function App() {
  const today = new Date();

  // Global State
  const [currentDate, setCurrentDate] = useState(today); // Single state for month/year
  const [events, setEvents] = useLocalStorage<Event[]>("calendar-events", []);

  // Modal state
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Add Event
  const [editingEvent, setEditingEvent] = useState<Event | null>(null); // Edit Event
  const [overflowDate, setOverflowDate] = useState<string | null>(null); // Overflow Modal
  const [overflowEvents, setOverflowEvents] = useState<Event[]>([]);

  // Month Name
  const monthName = format(currentDate, "MMMM");

  // Month Navigation
  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const returnToToday = () => setCurrentDate(today);

  // Event Handlers
  const handleAddEvent = (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent]);
    setSelectedDate(null);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setEditingEvent(null);
  };

  const onDayClick = (date: string) => setSelectedDate(date);
  const onEventClick = (event: Event) => setEditingEvent(event);
  const onOverflowClick = (date: string, dayEvents: Event[]) => {
    setOverflowDate(date);
    setOverflowEvents(dayEvents);
  };

  return (
    <div>
      <CalendarHeader
        monthName={monthName}
        year={currentDate.getFullYear()}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={returnToToday}
      />

      <CalendarGrid
        month={currentDate.getMonth()}
        year={currentDate.getFullYear()}
        today={today}
        events={events}
        onDayClick={onDayClick}
        onEventClick={onEventClick}
        onOverflowClick={onOverflowClick}
      />

      {selectedDate && (
        <Modal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          addEvent={handleAddEvent}
        />
      )}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {overflowDate && (
        <OverflowModal
          date={overflowDate}
          events={overflowEvents}
          onClose={() => setOverflowDate(null)}
          onEventClick={(event) => {
            setEditingEvent(event);
            setOverflowDate(null);
          }}
        />
      )}
    </div>
  );
}
