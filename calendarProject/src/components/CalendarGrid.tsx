import { useCallback } from "react";
import type { Event } from "../types/types";
import { DayCell } from "./DayCell";
import { useCalendar } from "../hooks/useCalendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarGridProps = {
  month: number;
  year: number;
  today: Date;
  events: Event[];
  onDayClick: (date: string) => void;
  onEventClick: (event: Event) => void;
  onOverflowClick?: (date: string, events: Event[]) => void;
};

export default function CalendarGrid({
  month,
  year,
  today,
  events,
  onDayClick,
  onEventClick,
  onOverflowClick,
}: CalendarGridProps) {
  const { calendarCells, eventsByDate } = useCalendar(month, year, events);
  const maxEvents = 5;

  const formatTime = useCallback((time?: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }, []);

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="weekday-row">
          {WEEKDAYS.map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarCells.map((cell) => {
            const { day, month: m, year: y, isCurrentMonth } = cell;
            const dateKey = `${y}-${m + 1}-${day}`;
            const dayEvents = eventsByDate.get(dateKey) ?? [];
            const cellDate = new Date(y, m, day);
            const isToday =
              today.getFullYear() === y &&
              today.getMonth() === m &&
              today.getDate() === day;
            const isPast =
              isCurrentMonth &&
              cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

            return (
              <DayCell
                key={dateKey}
                day={day}
                month={m}
                year={y}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                isPast={isPast}
                dayEvents={dayEvents}
                onDayClick={onDayClick}
                onEventClick={onEventClick}
                onOverflowClick={onOverflowClick}
                formatTime={formatTime}
                maxEvents={maxEvents}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
