import { useMemo } from "react";
import type { Event } from "../types/types";

export function useCalendar(month: number, year: number, events: Event[]) {
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
    events.forEach((e) => {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    });
    map.forEach((arr) =>
      arr.sort((a, b) => {
        if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
        if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
        if (a.startTime && !b.startTime) return 1;
        if (!a.startTime && b.startTime) return -1;
        return 0;
      })
    );
    return map;
  }, [events]);

  return { calendarCells, eventsByDate };
}
