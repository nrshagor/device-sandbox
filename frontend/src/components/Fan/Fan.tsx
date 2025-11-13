import React, { useState, useEffect, useRef } from "react";
import "./Fan.scss";
import type { Device, FanSettings } from "../../types";

interface FanProps {
  device: Device;
  updateDevice: (id: string, changes: Partial<Device>) => void;
}

const Fan: React.FC<FanProps> = ({ device, updateDevice }) => {
  const settings = device.settings as FanSettings;
  const [power, setPower] = useState(settings.power);
  const [speed, setSpeed] = useState(settings.speed);
  const sliderRef = useRef<HTMLInputElement>(null);

  // update range bar color
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--value", `${speed}%`);
    }
  }, [speed]);

  // update parent only when user stops dragging
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  const handleSpeedCommit = () => {
    updateDevice(device.id, { settings: { power, speed } });
  };

  const getAnimationSpeed = (): string => {
    if (!power || speed <= 0) return "none";
    const duration = (1.5 - speed / 100).toFixed(2);
    return `${duration}s`;
  };

  return (
    <div className="fan-container">
      <div
        className={`fan-body ${power ? "on" : "off"}`}
        style={{ animationDuration: getAnimationSpeed() }}
      >
        <div className="blade blade1" />
        <div className="blade blade2" />
        <div className="blade blade3" />
        <div className="blade blade4" />
        <div className="center-outer">
          <div className="center-inner" />
        </div>
      </div>

      <div className="fan-panel">
        <div className="control-row">
          <label>Power</label>
          <div
            className={`toggle ${power ? "active" : ""}`}
            onClick={() => {
              const newPower = !power;
              setPower(newPower);
              updateDevice(device.id, { settings: { power: newPower, speed } });
            }}
          >
            <div className="circle" />
          </div>
        </div>

        <div className="control-row speed">
          <label>Speed</label>
          <span>{speed}%</span>
        </div>

        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={speed}
          onInput={handleSpeedChange}
          onMouseUp={handleSpeedCommit}
          onTouchEnd={handleSpeedCommit}
          className="speed-slider"
        />
      </div>
    </div>
  );
};

export default Fan;
