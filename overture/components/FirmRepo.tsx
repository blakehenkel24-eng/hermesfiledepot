"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "./Icons";
import type { FlatFirm } from "@/lib/types";

interface FirmRepoProps {
  firms: FlatFirm[];
}

export default function FirmRepo({ firms }: FirmRepoProps) {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filter, setFilter] = useState("All");
  const router = useRouter();

  const filters = ["All", "Watched", "Mid-market", "Large-cap"];

  let filtered = firms.filter(
    (f) =>
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.short.toLowerCase().includes(q.toLowerCase()) ||
      f.strategy.toLowerCase().includes(q.toLowerCase()) ||
      f.sectors.join(" ").toLowerCase().includes(q.toLowerCase())
  );
  if (filter === "Watched") filtered = filtered.filter((f) => f.watched);
  if (filter === "Mid-market") filtered = filtered.filter((f) => f.aumNum < 15);
  if (filter === "Large-cap") filtered = filtered.filter((f) => f.aumNum >= 15);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "aum") return b.aumNum - a.aumNum;
    if (sortBy === "founded") return a.founded - b.founded;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="repo">
      <div className="briefing-header">
        <div className="kicker">
          Database · {firms.length} firms on file
        </div>
        <h1 className="briefing-title">
          Private equity <span className="accent">firm profiles.</span>
        </h1>
        <div className="briefing-meta">
          <span>
            Total AUM tracked{" "}
            <b>
              $
              {firms
                .reduce((s, f) => s + f.aumNum, 0)
                .toFixed(1)}
              B
            </b>
          </span>
          <span>
            Watched <b>{firms.filter((f) => f.watched).length}</b>
          </span>
          <span>
            Mid-market <b>{firms.filter((f) => f.aumNum < 15).length}</b>
          </span>
          <span>
            Large-cap <b>{firms.filter((f) => f.aumNum >= 15).length}</b>
          </span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-bar-left">
          <div className="repo-search">
            <IconSearch />
            <input
              placeholder="Search by firm, strategy, sector…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="filter-bar-right">
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              marginRight: 8,
            }}
          >
            Sort
          </span>
          <div className="view-toggle">
            <button
              className={sortBy === "name" ? "active" : ""}
              onClick={() => setSortBy("name")}
            >
              A–Z
            </button>
            <button
              className={sortBy === "aum" ? "active" : ""}
              onClick={() => setSortBy("aum")}
            >
              AUM
            </button>
            <button
              className={sortBy === "founded" ? "active" : ""}
              onClick={() => setSortBy("founded")}
            >
              VINTAGE
            </button>
          </div>
        </div>
      </div>

      <div className="repo-grid">
        {sorted.map((f) => (
          <div
            key={f.id}
            className="firm-card"
            onClick={() => router.push(`/firm/${f.slug}`)}
          >
            <div className="firm-card-top">
              <div className="firm-card-short">{f.short}</div>
              {f.watched && <span className="watched-badge">★ WATCH</span>}
            </div>
            <h3 className="firm-card-name">{f.name}</h3>
            <div className="firm-card-strategy">{f.strategy}</div>
            <div className="firm-card-sectors">
              {f.sectors.slice(0, 3).map((s) => (
                <span key={s} className="sector-chip">
                  {s}
                </span>
              ))}
            </div>
            <div className="firm-card-stats">
              <div>
                <div className="v">${f.aum}</div>
                <div className="l">AUM</div>
              </div>
              <div>
                <div className="v">{f.founded}</div>
                <div className="l">Founded</div>
              </div>
              <div>
                <div className="v">{f.hq.split(",")[0]}</div>
                <div className="l">HQ</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
