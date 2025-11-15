import type { Event } from "../types/types"
import "../styles/OverflowModal.css"
import { useModalAnimation } from "../hooks/useModalAnimation"
import "../styles/modalAnimation.css"

type OverflowModalProps = {
  events: Event[]
  date: string
  onClose: () => void
}

export default function OverflowModal({
  events,
  date,
  onClose,
}: OverflowModalProps) {
  const d = new Date(date)
  const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`

  const { closing, animateClose } = useModalAnimation(onClose)

  const handleClose = () => animateClose()

  return (
    <div className="overflow-modal-overlay" onClick={handleClose}>
      <div
        className={`overflow-modal-container ${
          closing ? "modal-close" : "modal-open"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="overflow-modal-header">
          <h2>{formattedDate}</h2>
          <button className="close-btn" onClick={handleClose}>
            X
          </button>
        </header>

        <div className="modal-body">
          {events.map((event) => (
            <div
              key={event.id}
              className="overflow-event"
              style={{ backgroundColor: event.color }}
            >
              {event.allDay ? "(All Day) " : ""}
              {event.title} {event.startTime ? `(${event.startTime})` : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
