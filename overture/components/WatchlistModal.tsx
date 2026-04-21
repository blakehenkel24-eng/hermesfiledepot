"use client";

import { useState } from "react";
import { IconSearch, IconX, IconCheck, IconPlus } from "./Icons";
import type { FlatFirm } from "@/lib/types";

interface WatchlistModalProps {
  firms: FlatFirm[];
  onClose: () => void;
  toggleWatch?: (firmId: string) => void;
}

export default function WatchlistModal({ firms, onClose, toggleWatch }: WatchlistModalProps) {
  const [q, setQ] = useState("");
  const [localFirms, setLocalFirms] = useState<FlatFirm[]>(firms);

  const handleToggle = (id: string) => {
    setLocalFirms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, watched: !f.watched } : f))
    );
  };

  const filtered = localFirms.filter(
    (f) =>
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.short.toLowerCase().includes(q.toLowerCase()) ||
      f.strategy.toLowerCase().includes(q.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (a.watched !== b.watched) return a.watched ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  const watchedCount = localFirms.filter((f) => f.watched).length;

  const handleSave = () => {
    // Apply all changes via toggleWatch for each changed firm
    if (toggleWatch) {
      for (const original of firms) {
        const current = localFirms.find((f) => f.id === original.id);
        if (current && current.watched !== original.watched) {
          toggleWatch(original.id);
        }
      }
    }
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Manage watchlist</h2>
            <div className="modal-subtitle">
              Firms tracked for the morning briefing
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <IconX />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-search">
            <IconSearch />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by firm, ticker, or strategy…"
            />
          </div>
          {sorted.map((f) => (
            <div
              key={f.id}
              className={`firm-picker-row ${f.watched ? "watched" : ""}`}
              onClick={() => handleToggle(f.id)}
            >
              <div className="check">
                {f.watched && <IconCheck />}
              </div>
              <div className="firm-picker-name">
                <div className="name">{f.name}</div>
                <div className="short">
                  {f.short} · {f.strategy}
                </div>
              </div>
              <div className="firm-picker-meta">
                {f.hq.split(",")[0]}
              </div>
              <div>
                <div className="aum">${f.aum}</div>
                <div className="aum-label">AUM</div>
              </div>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(f.id);
                }}
                title={f.watched ? "Remove" : "Add"}
              >
                {f.watched ? <IconX /> : <IconPlus />}
              </button>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <div className="modal-footer-count">
            <b>{watchedCount}</b> OF {localFirms.length} TRACKED
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
