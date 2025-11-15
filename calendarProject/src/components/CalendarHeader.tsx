export type CalendarHeaderProps = {
  monthName: string
  year: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function CalendarHeader({
  monthName,
  year,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="calendar-header">
      <button onClick={onToday}>Today</button>
      <button onClick={onPrev}>{"<"}</button>
      <button onClick={onNext}>{">"}</button>

      <h2>
        {monthName} {year}
      </h2>
    </div>
  )
}
