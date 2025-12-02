import type { Event } from "../../types/types";
import DayCell from "../DayCell/DayCell";
import { useCalendar } from "../../hooks/useCalendar";
import styles from "./CalendarGrid.module.css";
import { isSameDay, isBefore, startOfDay } from "date-fns";

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
  const todayStart = startOfDay(today);

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarGrid}>
        {calendarCells.map((cell, index) => {
          const { date, dateKey, day, month: m, year: y, isCurrentMonth } = cell;

          const dayEvents = eventsByDate.get(dateKey) ?? [];

          // date-fns checks
          const isToday = isSameDay(date, today);
          const isPast = isCurrentMonth && isBefore(date, todayStart);

          // Labels only in the first row
          const weekdayLabel = index < 7 ? WEEKDAYS[date.getDay()] : undefined;

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
              weekdayLabel={weekdayLabel}
              onDayClick={onDayClick}
              onEventClick={onEventClick}
              onOverflowClick={onOverflowClick}
            />
          );
        })}
      </div>
    </div>
  );
}
