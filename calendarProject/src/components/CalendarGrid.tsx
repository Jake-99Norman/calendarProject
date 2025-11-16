import React, { useMemo, useCallback } from "react";
import type { Event } from "../types/types";

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

type DayCellProps = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  dayEvents: Event[];
  onDayClick: (date: string) => void;
  onEventClick: (event: Event) => void;
  onOverflowClick?: (date: string, events: Event[]) => void;
  formatTime: (time?: string) => string;
  maxEvents: number;
};

const EventItem = React.memo(function EventItem({
  ev,
  onEventClick,
  formatTime,
}: {
  ev: Event;
  onEventClick: (event: Event) => void;
  formatTime: (time?: string) => string;
}) {
  const style = useMemo(() => ({ backgroundColor: ev.color ?? "#888" }), [ev.color]);
  return (
    <div
      className="event"
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(ev);
      }}
    >
      {ev.title}{" "}
      {(ev.allDay || ev.startTime) && (
        <span className="event-meta">
          {ev.allDay ? "(All Day Event)" : `(${formatTime(ev.startTime)})`}
        </span>
      )}
    </div>
  );
});

const DayCell = React.memo(function DayCell({
  day,
  month,
  year,
  isCurrentMonth,
  isToday,
  isPast,
  dayEvents,
  onDayClick,
  onEventClick,
  onOverflowClick,
  formatTime,
  maxEvents,
}: DayCellProps) {
  const dateKey = `${year}-${month + 1}-${day}`;
  const hasOverflow = dayEvents.length > maxEvents;

  const handleDayClick = useCallback(() => {
    if (!isPast) onDayClick(dateKey);
  }, [dateKey, isPast, onDayClick]);

  const handleOverflowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onOverflowClick?.(dateKey, dayEvents);
    },
    [dateKey, dayEvents, onOverflowClick]
  );

  return (
    <div
      className={`day ${!isCurrentMonth ? "faded" : ""} ${isToday ? "today" : ""} ${
        isPast ? "past-day" : ""
      }`}
      onClick={handleDayClick}
    >
      <div className="day-number">{day}</div>

      {!isPast && (
        <button
          className="add-event-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDayClick(dateKey);
          }}
        >
          +
        </button>
      )}

      {dayEvents.slice(0, maxEvents).map((ev) => (
        <EventItem key={ev.id} ev={ev} onEventClick={onEventClick} formatTime={formatTime} />
      ))}

      {hasOverflow && onOverflowClick && (
        <button className="overflow-btn" onClick={handleOverflowClick}>
          +{dayEvents.length - maxEvents} more
        </button>
      )}
    </div>
  );
});

export default function CalendarGrid({
  month,
  year,
  today,
  events,
  onDayClick,
  onEventClick,
  onOverflowClick,
}: CalendarGridProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
  const totalCells = 42;

  const calendarCells = useMemo(() => {
    const trailingDays = totalCells - (firstDayOfWeek + daysInMonth);
    return [
      ...Array.from({ length: firstDayOfWeek }, (_, i) => ({
        day: daysInPrevMonth - firstDayOfWeek + 1 + i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
      })),
      ...Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        month,
        year,
        isCurrentMonth: true,
      })),
      ...Array.from({ length: trailingDays }, (_, i) => ({
        day: i + 1,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      })),
    ];
  }, [month, year]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
        if (a.startTime && !b.startTime) return 1;
        if (!a.startTime && b.startTime) return -1;
        return 0;
      });
    }
    return map;
  }, [events]);

  const formatTime = useCallback((time?: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    let hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }, []);

  const maxEvents = 5;

  return (
    <div className="calendar-container">
      <div className="calendar">
        {/* Weekdays */}
        <div className="weekday-row">
          {WEEKDAYS.map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
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
