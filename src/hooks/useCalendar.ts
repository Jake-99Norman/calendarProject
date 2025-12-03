import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
} from "date-fns";
import type { Event } from "../types/types";

// Type guard for Date objects
function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function useCalendar(month: number, year: number, events: Event[]) {
  return useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(monthStart);

    const calendarDays = eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
    });

    const eventsByDate = new Map<string, Event[]>();

    events.forEach((evt) => {
      if (!evt.date) {
        console.warn("Skipping event with missing date:", evt);
        return;
      }

      let eventDate: Date;

      if (typeof evt.date === "string") {
        try {
          eventDate = parseISO(evt.date);
          if (isNaN(eventDate.getTime())) throw new Error("Invalid date");
        } catch {
          console.warn("Skipping event with invalid date:", evt.date, evt);
          return;
        }
      } else if (isDate(evt.date)) {
        eventDate = evt.date;
      } else {
        console.warn("Skipping event with unknown date type:", evt);
        return;
      }

      const key = format(eventDate, "yyyy-MM-dd");
      if (!eventsByDate.has(key)) eventsByDate.set(key, []);
      eventsByDate.get(key)!.push(evt);
    });

    const calendarCells = calendarDays.map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");

      return {
        date,
        dateKey,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === month,
      };
    });

    return { calendarCells, eventsByDate };
  }, [month, year, events]);
}
