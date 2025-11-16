import React, { useCallback } from "react";
import type { Event } from "../types/types";
import { EventItem } from "./EventItem";

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

export const DayCell = React.memo(function DayCell({
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
