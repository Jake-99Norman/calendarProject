import { useState } from "react"
import CalendarHeader from "./components/CalendarHeader/CalendarHeader"
import CalendarGrid from "./components/CalendarGrid/CalendarGrid"
import EditEventModal from "./components/EditEventModal"
import OverflowModal from "./components/OverflowModal/OverflowModal"
import Modal from "./components/Modal"
import { useLocalStorage } from "./hooks/useLocalStorage"
import type { Event } from "./types/types"

export default function App() {
  const today = new Date()

  // Global State
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [events, setEvents] = useLocalStorage<Event[]>("calendar-events", [])

  // Modal state
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // Add Event
  const [editingEvent, setEditingEvent] = useState<Event | null>(null) // Edit Event
  const [overflowDate, setOverflowDate] = useState<string | null>(null) // Overflow Modal
  const [overflowEvents, setOverflowEvents] = useState<Event[]>([])

  // Month Name
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  })

  //  Month Navigation
  function handlePrevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function handleNextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  function returnToToday() {
    setMonth(today.getMonth())
    setYear(today.getFullYear())
  }

  // Event Handlers
  function handleAddEvent(newEvent: Event) {
    setEvents((prev) => [...prev, newEvent])
    setSelectedDate(null)
  }

  function handleUpdateEvent(updatedEvent: Event) {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    )
    setEditingEvent(null)
  }

  function handleDeleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setEditingEvent(null)
  }

  function onDayClick(date: string) {
    setSelectedDate(date)
  }

  function onEventClick(event: Event) {
    setEditingEvent(event)
  }

  function onOverflowClick(date: string, dayEvents: Event[]) {
    setOverflowDate(date)
    setOverflowEvents(dayEvents)
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
            setEditingEvent(event)
            setOverflowDate(null)
          }}
        />
      )}
    </div>
  )
}
