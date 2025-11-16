import { useEffect, useRef, useState } from "react";
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

export default function CalendarGrid({
  month,
  year,
  today,
  events,
  onDayClick,
  onEventClick,
  onOverflowClick,
}: CalendarGridProps) {
  const [resizeTick, setResizeTick] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarRef.current) return;
    const observer = new ResizeObserver(() => setResizeTick((prev) => prev + 1));
    observer.observe(calendarRef.current);
    return () => observer.disconnect();
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  const leadingDays = firstDayOfWeek;
  const totalCells = 42;
  const trailingDays = totalCells - (leadingDays + daysInMonth);

  const calendarCells = [
    ...Array.from({ length: leadingDays }, (_, i) => ({
      day: daysInPrevMonth - leadingDays + 1 + i,
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

  // Convert military time ("HH:mm") to 12-hour format
  function formatTimeTo12Hour(time?: string) {
    if (!time) return "";
    const [hourStr, minStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 => 12
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  // sorts events by all day first and start time next
  function eventsForDate(y: number, m: number, d: number) {
    const key = `${y}-${m + 1}-${d}`;
    const dayEvents = events.filter((e) => e.date === key);

    return dayEvents.sort((a, b) => {
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
      return 0;
    });
  }

  const maxEvents = 5;

  return (
    <div className="calendar-container" ref={calendarRef}>
      <div className="calendar">
        {/* Weekday Headers */}
        <div className="weekday-row">
          {WEEKDAYS.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        {/* 42-Day Grid */}
        <div className="calendar-grid">
          {calendarCells.map((cell, i) => {
            const { day, month: m, year: y, isCurrentMonth } = cell;
            const dayEvents = eventsForDate(y, m, day);

            const cellDate = new Date(y, m, day);
            const isToday =
              day === today.getDate() &&
              m === today.getMonth() &&
              y === today.getFullYear();

            const isPast =
              isCurrentMonth &&
              cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const hasOverflow = dayEvents.length > maxEvents;

            return (
              <div
                key={`${i}-${resizeTick}`}
                className={`day ${!isCurrentMonth ? "faded" : ""} ${isToday ? "today" : ""} ${
                  isPast ? "past-day" : ""
                }`}
                onClick={() => !isPast && onDayClick(`${y}-${m + 1}-${day}`)}
              >
                <div className="day-number">{day}</div>

                {!isPast && (
                  <button
                    className="add-event-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDayClick(`${y}-${m + 1}-${day}`);
                    }}
                  >
                    +
                  </button>
                )}

                {dayEvents.slice(0, maxEvents).map((event) => (
                  <div
                    key={event.id}
                    className="event"
                    style={{ backgroundColor: event.color ?? "#888" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}{" "}
                    {(event.allDay || event.startTime) && (
                      <span className="event-meta">
                        {event.allDay ? "(All Day Event)" : `(${formatTimeTo12Hour(event.startTime)})`}
                      </span>
                    )}
                  </div>
                ))}

                {hasOverflow && onOverflowClick && (
                  <button
                    className="overflow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOverflowClick(`${y}-${m + 1}-${day}`, dayEvents);
                    }}
                  >
                    +{dayEvents.length - maxEvents} more
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
