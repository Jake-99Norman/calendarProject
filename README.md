GitHub Repo 
https://github.com/Jake-99Norman/calendarProject/tree/main

to run locally
npm install
npm start
npm run build

for CodeSandbox
Open https://codesandbox.io/

Create a new React project.

Copy the src/ folder and package.json dependencies.

The calendar should work immediately.


An interactive React/typescript calendar which lets you add events, edit events, view any overflows and traverse the calendar for future events.
- Month view calendar with previous/next month dates.
- Highlight current day.
- Display up to a certain number of events per day, with an overflow button for extra events.
- Support for all day events and events with specific start and end times.
- Memoized componets for performance optimization.
- Reusable components: CalendarGrid, DayCell, EventItem.
- Customizable weekday, event colors and max events per day.

Dependencies 
React 18+
React DOM 
TypeScript (optional but recommended for type safety)


# Using npm
npm install react react-dom

# If using TypeScript
npm install --save-dev typescript @types/react @types/react-dom

CodeSandbox these are usually pre-installed



File Structure
src/
 ├─ components/
 │   ├─ CalendarGrid.tsx
 │   ├─ DayCell.tsx
 │   └─ EventItem.tsx
 ├─ hooks/
 │   └─ useCalendar.ts
 ├─ types/
 │   └─ types.ts
 ├─ App.tsx
 └─ index.tsx

 import calendar component
-import CalendarGrid from "./components/CalendarGrid";
-import type { Event } from "./types/types";

Prepare events data
const events: Event[] = [
  {
    id: "1",
    title: "Meeting with team",
    date: "2025-11-15",
    startTime: "14:30",
    allDay: false,
    color: "#f00",
  },
  {
    id: "2",
    title: "All-day conference",
    date: "2025-11-16",
    allDay: true,
    color: "#0a0",
  },
];


Add handlers for interaction

function handleDayClick(date: string) {
  console.log("Clicked day:", date);
}

function handleEventClick(event: Event) {
  console.log("Clicked event:", event);
}

function handleOverflowClick(date: string, events: Event[]) {
  console.log("Overflow events for", date, events);
}


Render the calendar
<CalendarGrid
  month={10} // November (0-based)
  year={2025}
  today={new Date()}
  events={events}
  onDayClick={handleDayClick}
  onEventClick={handleEventClick}
  onOverflowClick={handleOverflowClick}
/>



