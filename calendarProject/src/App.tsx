import { useState } from "react"
import { CalendarHeader } from "./components/CalendarHeader"
import CalendarGrid from "./components/CalendarGrid"
import type { Event } from "./components/types"

export default function App() {
  const today = new Date()

  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())

  // Example event data
  const [events, setEvents] = useState<Event[]>([])

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  })

  // --- Month Navigation ---
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

  // --- Event Handlers ---
  function onDayClick(date: string) {
    console.log("Clicked day:", date)
    // Open add-event modal here
  }

  function onEventClick(event: Event) {
    console.log("Clicked event:", event)
    // Open edit-event modal here
  }

  function onOverflowClick(date: string) {
    console.log("Overflow clicked for:", date)
    // Open overflow modal here
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
    </div>
  )
}
