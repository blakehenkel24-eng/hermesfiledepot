"use client";

import { useEffect, useState } from "react";
import { IconSearch, IconBell, IconSettings } from "./Icons";
import type { MarketPulse } from "@/lib/types";

function todayShort(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).toUpperCase();
}

function timeNow(): string {
  const h = new Date().getHours();
  const m = new Date().getMinutes().toString().padStart(2, "0");
  return `${h.toString().padStart(2, "0")}:${m} ET`;
}

export default function Topbar() {
  const [pulse, setPulse] = useState<MarketPulse | null>(null);

  useEffect(() => {
    fetch("/api/market-pulse")
      .then((r) => r.json())
      .then(setPulse)
      .catch(() => {});
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="date-chip">
          <span className="dot"></span>
          LIVE · {todayShort()} · {timeNow()}
        </div>
        {pulse && (
          <div className="market-pill">
            DEALS 24H <b>{pulse.dealCount24h}</b>{" "}
            <span
              className={
                pulse.dealCount24hDelta.startsWith("+")
                  ? "delta-pos"
                  : "delta-neg"
              }
            >
              {pulse.dealCount24hDelta}
            </span>
            <span className="sep">│</span>
            FUND CLOSES <b>{pulse.fundCloseCount}</b>{" "}
            <span
              className={
                pulse.fundCloseCountDelta.startsWith("+")
                  ? "delta-pos"
                  : "delta-neg"
              }
            >
              {pulse.fundCloseCountDelta}
            </span>
            <span className="sep">│</span>
            SR. MOVES <b>{pulse.seniorHires}</b>{" "}
            <span
              className={
                pulse.seniorHiresDelta.startsWith("+")
                  ? "delta-pos"
                  : "delta-neg"
              }
            >
              {pulse.seniorHiresDelta}
            </span>
          </div>
        )}
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <IconSearch />
          <input placeholder="Search firms, deals, people…" />
          <span className="kbd">⌘K</span>
        </div>
        <button className="topbar-icon-btn" title="Alerts">
          <IconBell />
          <span className="badge"></span>
        </button>
        <button className="topbar-icon-btn" title="Settings">
          <IconSettings />
        </button>
        <div className="user-chip">
          <div className="avatar">MR</div>
          <div className="user-name">m.reyes</div>
        </div>
      </div>
    </div>
  );
}
