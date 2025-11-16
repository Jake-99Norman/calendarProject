import React, { useMemo } from "react";
import type { Event } from "../types/types";

type EventItemProps = {
  ev: Event;
  onEventClick: (event: Event) => void;
  formatTime: (time?: string) => string;
};

export const EventItem = React.memo(function EventItem({
  ev,
  onEventClick,
  formatTime,
}: EventItemProps) {
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
