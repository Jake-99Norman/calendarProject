import type { Event } from "../../types/types";
import DayCell from "../DayCell/DayCell";
import { useCalendar } from "../../hooks/useCalendar";
import styles from "./CalendarGrid.module.css"; // CSS Modules import

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarGridProps = {
  month: number;
  year: number;
  today: Date;
  events: Event[];
  onDayClick: (date: string) => void;
  onEventClick: (event: Event) => void;
  onOverflowClick: (date: string, events: Event[]) => void;
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

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendar}>
        {/* Weekday headings */}
        <div className={styles.weekdayRow}>
          {WEEKDAYS.map((d) => (
            <div key={d} className={styles.weekday}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={styles.calendarGrid}>
          {calendarCells.map((cell) => {
            const { day, month: m, year: y, isCurrentMonth } = cell;

            const dateKey = `${y}-${String(m + 1).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

            const dayEvents = eventsByDate.get(dateKey) ?? [];

            const cellDate = new Date(y, m, day);

            const isToday =
              today.getFullYear() === y &&
              today.getMonth() === m &&
              today.getDate() === day;

            const isPast =
              isCurrentMonth &&
              cellDate <
                new Date(today.getFullYear(), today.getMonth(), today.getDate());

            return (
              <DayCell
                key={dateKey}
                day={day}
                month={m}
                year={y}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                isPast={isPast}
                events={dayEvents}
                maxEvents={maxEvents}
                onDayClick={onDayClick}
                onEventClick={onEventClick}
                onOverflowClick={onOverflowClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
