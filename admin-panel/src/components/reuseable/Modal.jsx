import React, { useState } from "react";
import "../../styles/modal.css";

function Modal(props) {
  const [showModal, setShowModal] = useState(false);

  function toggleModal() {
    setShowModal(!showModal);
  }

  return (
    <div>
      <button onClick={toggleModal}>Open Modal</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{props.title}</h2>
              <button className="close-button" onClick={toggleModal}>
                &times;
              </button>
            </div>
            <div className="modal-content">{props.children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
