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

  // Update CSS variable dynamically
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--value", `${speed}%`);
    }
  }, [speed]);

  // Update parent device state whenever speed/power changes
  useEffect(() => {
    updateDevice(device.id, {
      settings: { power, speed },
    });
  }, [power, speed]);

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
        {/* 4 Blades */}
        <div className="blade blade1" />
        <div className="blade blade2" />
        <div className="blade blade3" />
        <div className="blade blade4" />

        {/* Center Circle */}
        <div className="center-outer">
          <div className="center-inner" />
        </div>
      </div>

      <div className="fan-panel">
        <div className="control-row">
          <label>Power</label>
          <div
            className={`toggle ${power ? "active" : ""}`}
            onClick={() => setPower(!power)}
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
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="speed-slider"
        />
      </div>
    </div>
  );
};

export default Fan;
