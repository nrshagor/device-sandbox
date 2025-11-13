import React, { useState, useEffect, useRef } from "react";
import "./Light.scss";
import type { Device, LightSettings } from "../../types";

interface LightProps {
  device: Device;
  updateDevice: (id: string, changes: Partial<Device>) => void;
}

const Light: React.FC<LightProps> = ({ device, updateDevice }) => {
  const settings = device.settings as LightSettings;

  const [power, setPower] = useState(settings.power);
  const [brightness, setBrightness] = useState(settings.brightness);
  const [color, setColor] = useState(settings.color);
  const [glowLevel, setGlowLevel] = useState(settings.brightness);

  const sliderRef = useRef<HTMLInputElement>(null);

  /* Sync parent */
  useEffect(() => {
    updateDevice(device.id, { settings: { power, brightness, color } });

    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--value", `${brightness}%`);
    }

    if (power) {
      setGlowLevel(brightness); // brightness change হলে glow update হবে
    } else {
      setGlowLevel(0);
    }
  }, [power, brightness, color]);

  /* Handlers */
  const handlePowerToggle = () => setPower((prev) => !prev);

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBrightness(val);

    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--value", `${val}%`);
    }
  };

  const handleColorChange = (c: string) => setColor(c);

  /* Light style */
  const getLightStyle = (): React.CSSProperties => {
    if (!power) {
      return {
        background:
          "radial-gradient(112.05% 89.64% at 30% 30%, #4A5568 0%, #2D3748 50%, #1A202C 100%)",
        boxShadow: "inset 0 0 10px 2px #1f2937",
        opacity: 0.7,
      };
    }

    const glow = Math.max(10, glowLevel * 0.7);

    return {
      background: color,
      boxShadow: `0 0 ${glow}px ${glow / 2}px ${color}`,
      opacity: 1,
      transition: "box-shadow 0.2s ease, background 0.2s ease",
    };
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getGlowLineStyle = (): React.CSSProperties => {
    if (!power) return { display: "none" };

    const intensity = brightness / 100;
    const mainColor = hexToRgba(color, 0.9);
    const white = hexToRgba("#ffffff", 1);

    return {
      background: `linear-gradient(
        180deg,
        ${mainColor} 10%,
        ${white} 80%
      )`,
      boxShadow: `0 0 ${20 + intensity * 30}px ${white}`,
      opacity: 0.85,
      transition: "all 0.2s ease",
    };
  };

  // Render
  return (
    <div className="light-container">
      <div className="light-section">
        <div className="light-holder">
          <div className="light-holder-top" />
          <div className="light-holder-bottom">
            <div className="part" />
            <div className="part" />
            <div className="part" />
            <div className="part" />
          </div>
        </div>

        <div className="light-body" style={getLightStyle()}>
          {power && (
            <div className="light-glow-line" style={getGlowLineStyle()} />
          )}
        </div>
      </div>

      <div className="light-panel">
        <div className="control-row">
          <label>Power</label>
          <div
            className={`toggle ${power ? "active" : ""}`}
            onClick={handlePowerToggle}
          >
            <div className="circle" />
          </div>
        </div>

        <div className="control-row">
          <label>Color Temperature</label>
        </div>

        <div className="color-palette">
          {["#FFE5B4", "#F0F8FF", "#87CEEB", "#FFB6C1"].map((c) => (
            <button
              key={c}
              onClick={() => handleColorChange(c)}
              style={{
                background: power ? c : `${c}66`,
                border:
                  color === c
                    ? "2px solid rgba(43,127,255,1)"
                    : "2px solid rgba(74,85,101,1)",
              }}
            />
          ))}
        </div>

        <div className="control-row">
          <label>Brightness</label>
          <span>{brightness}%</span>
        </div>

        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={handleBrightnessChange}
          data-id={device.id}
        />
      </div>
    </div>
  );
};

export default Light;
