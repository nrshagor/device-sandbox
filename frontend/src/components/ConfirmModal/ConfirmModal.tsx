import React from "react";
import "./ConfirmModal.scss";

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="actions">
          <button className="cancel" onClick={onCancel}>
            No
          </button>
          <button className="confirm" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
