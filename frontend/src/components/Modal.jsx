// src/components/Modal.js
import React from "react";
import "../css/Modal.css"; // We'll create basic styles

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
