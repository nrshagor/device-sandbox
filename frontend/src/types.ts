export interface DevicePosition {
  x: number;
  y: number;
}

export interface FanSettings {
  power: boolean;
  speed: number;
}

export interface LightSettings {
  power: boolean;
  brightness: number;
  color: string;
}

export type DeviceType = "fan" | "light";

export interface Device {
  id: string;
  type: DeviceType;
  position: DevicePosition;
  settings: FanSettings | LightSettings;
}

export interface Preset {
  name: string;
  devices: Device[];
}
