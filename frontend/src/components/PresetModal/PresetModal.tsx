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
        <h3>Save Preset</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter preset name"
            autoFocus
          />
          <div className="actions">
            <button type="button" onClick={onCancel} className="cancel">
              Cancel
            </button>
            <button type="submit" className="save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresetModal;
