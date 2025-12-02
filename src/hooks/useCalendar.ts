import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import type { Event } from "../types/types";

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
      const key = evt.date; 
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
