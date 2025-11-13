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

  /* ---  slider UI only --- */
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--value", `${speed}%`);
    }
  }, [speed]);

  /* ---  parent only after user releases slider --- */
  const handleSpeedCommit = () => {
    updateDevice(device.id, { settings: { power, speed } });
  };

  /* ---  rotation speed --- */
  const getAnimationSpeed = () => {
    if (!power || speed <= 0) return "none";

    // Ease-out curve (more smooth!)
    const ease = Math.pow(speed / 100, 1.8);

    const minSpeed = 0.25; // fastest rotation
    const maxSpeed = 2.2; // slowest rotation

    const duration = maxSpeed - ease * (maxSpeed - minSpeed);

    return `${duration.toFixed(2)}s`;
  };

  return (
    <div className="fan-container">
      <div
        className={`fan-body ${power ? "on" : "off"}`}
        style={{
          animationDuration: getAnimationSpeed(),
          transition: "animation-duration 0.28s ease-out",
        }}
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
              updateDevice(device.id, {
                settings: { power: newPower, speed },
              });
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
          onInput={(e) => setSpeed(Number(e.currentTarget.value))}
          onMouseUp={handleSpeedCommit}
          onTouchEnd={handleSpeedCommit}
          className="speed-slider"
        />
      </div>
    </div>
  );
};

export default Fan;
