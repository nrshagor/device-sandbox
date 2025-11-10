import { useEffect, useState } from "react";
import "./App.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import type { Device, Preset } from "./types";
import PresetModal from "./components/PresetModal/PresetModal";
import Toast from "./components/Toast/Toast";
import { deletePreset, getPresets, savePreset } from "./utils/api";
import Canvas from "./components/Canvas/Canvas";

const App: React.FC = () => {
  // --- State management ---
  const [devices, setDevices] = useState<Device[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // --- Load all presets from backend once ---
  useEffect(() => {
    (async () => {
      try {
        const data = await getPresets();
        setPresets(data || []);
      } catch (error) {
        console.error("Failed to load presets:", error);
      }
    })();
  }, []);

  // --- Device handlers ---
  const addDevice = (device: Device) => setDevices((prev) => [...prev, device]);

  const updateDevice = (id: string, changes: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...changes } : d))
    );
  };

  const clearDevices = () => setDevices([]);

  // --- Preset Handlers ---
  const handleSavePreset = async (name: string) => {
    try {
      if (devices.length === 0) {
        setToastMsg("No devices to save!");
        setTimeout(() => setToastMsg(""), 2500);
        return;
      }

      const devicesCopy = JSON.parse(JSON.stringify(devices));
      const newPreset: Preset = { name, devices: devicesCopy };

      await savePreset(newPreset);
      const updated = await getPresets();
      setPresets(updated);

      setShowModal(false);
      setToastMsg("Preset saved");
      // setTimeout(() => setToastMsg(""), 3000);
      clearDevices();
    } catch (error) {
      console.error("Error saving preset:", error);
      setToastMsg("Failed to save preset");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  const handleLoadPreset = (i: number) => {
    const selected = presets[i];
    if (selected && selected.devices?.length > 0) {
      setDevices(selected.devices);
      setToastMsg(`Loaded preset: ${selected.name}`);
    } else {
      setToastMsg("Preset is empty!");
    }
    setTimeout(() => setToastMsg(""), 2500);
  };

  const handleDeletePreset = async (i: number) => {
    try {
      const name = presets[i].name;
      await deletePreset(name);
      const updated = await getPresets();
      setPresets(updated);
      setToastMsg(`Deleted preset: ${name}`);
      setTimeout(() => setToastMsg(""), 2500);
    } catch (error) {
      console.error("Error deleting preset:", error);
      setToastMsg("Failed to delete preset");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        setShowModal={setShowModal}
        presets={presets}
        onLoadPreset={handleLoadPreset}
        onRemovePreset={handleDeletePreset}
        devices={devices}
      />

      <Canvas
        devices={devices}
        addDevice={addDevice}
        updateDevice={updateDevice}
        clearDevices={clearDevices}
        onSave={() => setShowModal(true)}
      />

      {showModal && (
        <PresetModal
          onSave={handleSavePreset}
          onCancel={() => setShowModal(false)}
        />
      )}

      {toastMsg && <Toast message={toastMsg} />}
    </div>
  );
};

export default App;
