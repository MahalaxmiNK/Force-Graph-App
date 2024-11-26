import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" aria-hidden={!isOpen}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
