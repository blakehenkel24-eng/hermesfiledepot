"use client";

import { IconX } from "./Icons";

interface TweaksPanelProps {
  layout: string;
  setLayout: (l: string) => void;
  density: string;
  setDensity: (d: string) => void;
  onClose: () => void;
}

export default function TweaksPanel({
  layout,
  setLayout,
  density,
  setDensity,
  onClose,
}: TweaksPanelProps) {
  return (
    <div className="tweaks-panel">
      <div className="tweaks-header">
        <div className="tweaks-title">TWEAKS</div>
        <button
          className="modal-close"
          onClick={onClose}
          style={{ width: 20, height: 20 }}
        >
          <IconX />
        </button>
      </div>
      <div className="tweaks-body">
        <div className="tweak-group">
          <div className="tweak-group-label">Layout</div>
          <div className="tweak-options">
            <button
              className={layout === "dashboard" ? "active" : ""}
              onClick={() => setLayout("dashboard")}
            >
              DASH
            </button>
            <button
              className={layout === "digest" ? "active" : ""}
              onClick={() => setLayout("digest")}
            >
              DIGEST
            </button>
          </div>
        </div>
        <div className="tweak-group">
          <div className="tweak-group-label">Density</div>
          <div className="tweak-options">
            <button
              className={density === "comfortable" ? "active" : ""}
              onClick={() => setDensity("comfortable")}
            >
              COMFORT
            </button>
            <button
              className={density === "compact" ? "active" : ""}
              onClick={() => setDensity("compact")}
            >
              COMPACT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
