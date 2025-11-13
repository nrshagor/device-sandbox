import type { Preset } from "../types";

// export const API_URL = "http://localhost/device-sandbox/backend/api.php";
export const API_URL =
  "https://devicesandboxsimulator.datazily.com/backend/api.php";
// --- getPresets ---
export async function getPresets(): Promise<Preset[]> {
  const res = await fetch(`${API_URL}?action=get`);
  if (!res.ok) throw new Error("Failed to fetch presets");
  return (await res.json()) as Preset[];
}

// --- savePreset ---
export async function savePreset(preset: Preset): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}?action=save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preset),
  });
  if (!res.ok) throw new Error("Failed to save preset");
  return (await res.json()) as { message: string };
}

// --- deletePreset ---
export async function deletePreset(name: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}?action=delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to delete preset");
  return (await res.json()) as { message: string };
}
