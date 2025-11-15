export type CalendarHeaderProps = {
  monthName: string
  year: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export default function CalendarHeader({
  monthName,
  year,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="calendar-header">
      <button className="btn today-btn" onClick={onToday}>Today</button>
      <button className="btn prev-btn" onClick={onPrev}>{"<"}</button>
      <button className="btn next-btn" onClick={onNext}>{">"}</button>

      <h2>
        {monthName} {year}
      </h2>
    </div>
  )
}
