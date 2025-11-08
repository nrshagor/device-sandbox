import React, { useRef, useState } from "react";
import "./Canvas.scss";
import Fan from "../Fan/Fan";
import Light from "../Light/Light";
import type { Device } from "../../types";
import Toast from "../Toast/Toast";

interface CanvasProps {
  devices: Device[];
  addDevice: (device: Device) => void;
  updateDevice: (id: string, changes: Partial<Device>) => void;
  clearDevices: () => void;
  onSave: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  devices,
  addDevice,
  updateDevice,
  clearDevices,
  onSave,
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("deviceType");
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const id = crypto.randomUUID();

    //validation: only one device at a time
    if (devices.length > 0) {
      // show warning toast
      setToastMsg("Only one device allowed at a time. Replaced existing one!");
      setTimeout(() => setToastMsg(""), 2500);

      // replace old device
      const newDevice: Device = {
        id,
        type: type as "light" | "fan",
        position: { x: centerX, y: centerY },
        settings:
          type === "light"
            ? { power: true, brightness: 70, color: "#fde68a" }
            : { power: true, speed: 50 },
      };
      clearDevices();
      addDevice(newDevice);
      return;
    }

    // if empty canvas
    const newDevice: Device = {
      id,
      type: type as "light" | "fan",
      position: { x: centerX, y: centerY },
      settings:
        type === "light"
          ? { power: true, brightness: 70, color: "#fde68a" }
          : { power: true, speed: 50 },
    };

    addDevice(newDevice);
  };

  const handleSave = () => {
    if (devices.length === 0) {
      setToastMsg("Nothing to save!");
      setTimeout(() => setToastMsg(""), 2500);
      return;
    }
    onSave();
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas-header">
        <h4>Testing Canvas</h4>
        <div className="actions">
          <button className="clear" onClick={clearDevices}>
            Clear
          </button>
          <button className="save" onClick={handleSave}>
            Save Preset
          </button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="canvas-body"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {devices.length === 0 && (
          <div className="placeholder">Drag anything here</div>
        )}

        {devices.map((d) =>
          d.type === "fan" ? (
            <Fan key={d.id} device={d} updateDevice={updateDevice} />
          ) : (
            <Light key={d.id} device={d} updateDevice={updateDevice} />
          )
        )}
      </div>

      {toastMsg && <Toast message={toastMsg} />}
    </div>
  );
};

export default Canvas;
