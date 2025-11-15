import type { ReactNode } from "react";
import "./Modal.css";

type BaseModalProps = {
  children: ReactNode;
  onClose: () => void;
  title?: string;
};

export default function BaseModal({ children, onClose, title }: BaseModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>X</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
