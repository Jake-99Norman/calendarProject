import { useState } from "react"
import { CalendarHeader } from "./components/CalendarHeader"

export default function App() {
  const today = new Date()

  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  })

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

  return (
    <div>
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={returnToToday}
      />
    </div>
  )
}
