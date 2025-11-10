import React, { useState } from "react";
import "./PresetModal.scss";

interface PresetModalProps {
  onSave: (name: string) => void;
  onCancel: () => void;
}

const PresetModal: React.FC<PresetModalProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
  };

  return (
    <div className="preset-modal-backdrop">
      <div className="preset-modal">
        <div className="modal-header">
          <h3>Give me a name</h3>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name it"
            autoFocus
          />
          <p className="hint">
            By adding this effect as a preset you can reuse this anytime.
          </p>
          <div className="actions">
            <button type="button" onClick={onCancel} className="cancel">
              Cancel
            </button>
            <button type="submit" className="save">
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresetModal;
