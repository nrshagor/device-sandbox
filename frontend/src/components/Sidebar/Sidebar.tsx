import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import type { Preset, Device } from "../../types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

interface SidebarProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  presets: Preset[];
  onLoadPreset: (i: number) => void;
  onRemovePreset: (i: number) => void;
  devices: Device[];
}

const Sidebar: React.FC<SidebarProps> = ({
  presets,
  onLoadPreset,
  onRemovePreset,
  devices,
}) => {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);
  const [activeDeviceType, setActiveDeviceType] = useState<string | null>(null);
  const [activePresetName, setActivePresetName] = useState<string | null>(null);

  // detect current device (fan/light)
  useEffect(() => {
    if (devices.length > 0) {
      setActiveDeviceType(devices[0].type);
    } else {
      setActiveDeviceType(null);
    }
  }, [devices]);

  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("deviceType", type);
    setActiveDeviceType(type);
    setActivePresetName(null);
  };

  const handleConfirm = () => {
    if (confirmIndex !== null) {
      onRemovePreset(confirmIndex);
      setConfirmIndex(null);
    }
  };

  const handleCancel = () => setConfirmIndex(null);

  const LightIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 11.6667C12.6667 10.8333 13.0833 10.25 13.75 9.58333C14.5833 8.83333 15 7.75 15 6.66666C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66666 10 1.66666C8.67392 1.66666 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66666C5 7.5 5.16667 8.5 6.25 9.58333C6.83333 10.1667 7.33333 10.8333 7.5 11.6667"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 15H12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33334 18.3333H11.6667"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const FanIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M9.02249 13.6492C8.14929 14.0904 7.16703 14.2695 6.19428 14.1649C5.22152 14.0602 4.29986 13.6762 3.54053 13.0592C2.7812 12.4423 2.21666 11.6188 1.91505 10.688C1.61345 9.75733 1.58767 8.75921 1.84083 7.81416L6.35082 9.02249C5.90956 8.14929 5.73045 7.16703 5.83513 6.19428C5.93981 5.22152 6.32379 4.29986 6.94074 3.54053C7.55768 2.7812 8.38122 2.21666 9.31194 1.91505C10.2427 1.61345 11.2408 1.58767 12.1858 1.84083L10.9775 6.35082C11.8507 5.90956 12.833 5.73045 13.8057 5.83513C14.7785 5.93981 15.7001 6.32379 16.4595 6.94074C17.2188 7.55768 17.7833 8.38122 18.0849 9.31194C18.3865 10.2427 18.4123 11.2408 18.1592 12.1858L13.6492 10.9775C14.0904 11.8507 14.2695 12.833 14.1649 13.8057C14.0602 14.7785 13.6762 15.7001 13.0592 16.4595C12.4423 17.2188 11.6188 17.7833 10.688 18.0849C9.75733 18.3865 8.75921 18.4123 7.81416 18.1592L9.02249 13.6492Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10V10.0083"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <aside className="sidebar">
      <div>
        <h3>Devices</h3>
        <div className="drag-items">
          <div
            className={`drag-item ${
              activeDeviceType === "light" && !activePresetName ? "active" : ""
            }`}
            draggable
            onDragStart={(e) => onDragStart(e, "light")}
          >
            {LightIcon}
            <p>Light</p>
          </div>

          <div
            className={`drag-item ${
              activeDeviceType === "fan" && !activePresetName ? "active" : ""
            }`}
            draggable
            onDragStart={(e) => onDragStart(e, "fan")}
          >
            {FanIcon}
            <p>Fan</p>
          </div>
        </div>
      </div>

      <div className="presets">
        <h3>Saved Presets</h3>
        {presets.length === 0 ? (
          <div className="empty">Nothing added yet</div>
        ) : (
          presets.map((p, i) => (
            <div
              className={`preset-item ${
                p.name === activePresetName ? "active" : ""
              }`}
              key={i}
            >
              <button
                className="preset-btn"
                onClick={() => {
                  onLoadPreset(i);
                  setActivePresetName(p.name);
                  setActiveDeviceType(p.devices[0]?.type || null);
                }}
              >
                <div className="preset-icon">
                  {p.devices.length > 0 && p.devices[0].type === "fan"
                    ? FanIcon
                    : LightIcon}
                </div>
                <span>{p.name}</span>
              </button>

              {/* Hover visible delete button */}
              <button
                className="del"
                title="Delete preset"
                onClick={() => setConfirmIndex(i)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="white"
                >
                  <path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"></path>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {confirmIndex !== null && (
        <ConfirmModal
          title="Delete Preset"
          message={`Are you sure you want to delete "${presets[confirmIndex].name}"?`}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </aside>
  );
};

export default Sidebar;
