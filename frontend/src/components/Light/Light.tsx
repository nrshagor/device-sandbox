import React, { useState, useEffect } from "react";
import "./Light.scss";
import type { Device, LightSettings } from "../../types";

interface LightProps {
  device: Device;
  updateDevice: (id: string, changes: Partial<Device>) => void;
}

const Light: React.FC<LightProps> = ({ device, updateDevice }) => {
  const settings = device.settings as LightSettings;

  const [power, setPower] = useState<boolean>(settings.power);
  const [brightness, setBrightness] = useState<number>(settings.brightness);
  const [color, setColor] = useState<string>(settings.color);
  const [glowLevel, setGlowLevel] = useState<number>(0);

  useEffect(() => {
    updateDevice(device.id, { settings: { power, brightness, color } });
  }, [power, brightness, color]);

  useEffect(() => {
    if (power) {
      setGlowLevel(0);
      const interval = setInterval(() => {
        setGlowLevel((prev) => {
          if (prev >= brightness) {
            clearInterval(interval);
            return brightness;
          }
          return prev + 5;
        });
      }, 20);
      return () => clearInterval(interval);
    } else {
      setGlowLevel(0);
    }
  }, [power, brightness]);

  const handlePowerToggle = () => setPower((prev) => !prev);
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBrightness(val);
    e.target.style.setProperty("--value", `${val}%`);
  };

  const handleColorChange = (color: string) => setColor(color);

  const getLightStyle = (): React.CSSProperties => {
    if (!power) {
      return {
        background:
          "radial-gradient(112.05% 89.64% at 30% 30%, #4A5568 0%, #2D3748 50%, #1A202C 100%)",
        boxShadow: "inset 0 0 10px 2px #1f2937",
        opacity: 0.7,
      };
    }

    const glow = Math.max(20, glowLevel * 0.8);
    return {
      background: color,
      boxShadow: `0 0 ${glow}px ${glow / 3}px ${color}`,
      opacity: 1,
      transition: "box-shadow 0.4s ease, background 0.3s ease",
    };
  };

  const paletteColors = ["#FFE5B4", "#F0F8FF", "#87CEEB", "#FFB6C1"];

  return (
    <div className="light-container">
      {/* Light section (center) */}
      <div className="light-section">
        <div className="light-holder">
          <div className="light-holder-top" />
          <div className="light-holder-bottom" />
        </div>
        <div className="light-body" style={getLightStyle()} />
      </div>

      {/* Control panel (bottom) */}
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
          {paletteColors.map((c) => {
            const bg = power ? c : `${c}66`;
            const border =
              color === c
                ? "2px solid rgba(43,127,255,1)"
                : "2px solid rgba(74,85,101,1)";
            return (
              <button
                key={c}
                style={{
                  background: bg,
                  border,
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleColorChange(c)}
              />
            );
          })}
        </div>

        <div className="control-row">
          <label>Brightness</label>
          <span>{brightness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={handleBrightnessChange}
        />
      </div>
    </div>
  );
};

export default Light;
