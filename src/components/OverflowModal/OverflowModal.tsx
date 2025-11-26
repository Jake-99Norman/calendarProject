import type { Event } from "../../types/types"
import "./OverflowModal.css"
import { useModalAnimation } from "../../hooks/useModalAnimation"
import "../../styles/modalAnimation.css"

type OverflowModalProps = {
  events: Event[]
  date: string
  onClose: () => void
  onEventClick: (event: Event) => void
}

export default function OverflowModal({
  events,
  date,
  onClose,
  onEventClick,
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
              onClick={() => {
                onEventClick(event) // OPEN EDIT MODAL
                handleClose() // Close overflow modal
              }}
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
