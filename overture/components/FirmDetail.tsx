"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import FilterBar from "./FilterBar";
import StoryRow from "./StoryRow";
import type { FlatFirm, Story } from "@/lib/types";

interface FirmDetailProps {
  firm: FlatFirm;
  stories: Story[];
  allFirms: FlatFirm[];
  viewMode: string;
  setViewMode: (m: string) => void;
  expandedStory: string | null;
  setExpandedStory: (id: string | null) => void;
  toggleWatch?: (firmId: string) => void;
}

export default function FirmDetail({
  firm,
  stories,
  allFirms,
  viewMode,
  setViewMode,
  expandedStory,
  setExpandedStory,
  toggleWatch,
}: FirmDetailProps) {
  const [filter, setFilter] = useState("All");
  const router = useRouter();

  const firmStories = stories.filter((s) => s.firmId === firm.id);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: firmStories.length };
    firmStories.forEach((s) => {
      c[s.type] = (c[s.type] || 0) + 1;
    });
    return c;
  }, [firmStories]);

  const filtered =
    filter === "All" ? firmStories : firmStories.filter((s) => s.type === filter);

  const handleToggleWatch = () => {
    if (toggleWatch) {
      toggleWatch(firm.id);
    }
  };

  return (
    <div className="firm-detail">
      <div className="firm-detail-header">
        <div>
          <div className="firm-crumb">
            <a onClick={() => router.push("/")}>DAILY BRIEFING</a>
            <span className="sep">/</span>
            <a onClick={() => router.push("/repo")}>PROFILES</a>
            <span className="sep">/</span>
            <span style={{ color: "var(--accent)" }}>{firm.short}</span>
          </div>
          <h1 className="firm-detail-name">{firm.name}</h1>
          <div className="firm-short-label">
            {firm.short} · {firm.strategy}
          </div>
          <div className="firm-actions">
            <button
              className={`watch-btn ${firm.watched ? "on" : ""}`}
              onClick={handleToggleWatch}
            >
              <span className="watch-star">
                {firm.watched ? "★" : "☆"}
              </span>
              {firm.watched ? "On watchlist" : "Add to watchlist"}
            </button>
            <button className="firm-action-btn">Share</button>
            <button className="firm-action-btn">Export profile</button>
          </div>
        </div>
        <div className="firm-facts">
          <div className="firm-fact">
            <div className="firm-fact-value">${firm.aum}</div>
            <div className="firm-fact-label">AUM</div>
          </div>
          <div className="firm-fact">
            <div className="firm-fact-value">{firm.founded}</div>
            <div className="firm-fact-label">Founded</div>
          </div>
          <div className="firm-fact">
            <div className="firm-fact-value">{firmStories.length}</div>
            <div className="firm-fact-label">Stories 30d</div>
          </div>
          <div className="firm-fact">
            <div className="firm-fact-value">{firm.unread}</div>
            <div className="firm-fact-label">Unread</div>
          </div>
        </div>
      </div>

      <div className="profile-panel">
        <div className="profile-col">
          <h4>Firm at a glance</h4>
          <div className="profile-line">
            <span className="k">HQ</span>
            <span className="v">{firm.hq}</span>
          </div>
          <div className="profile-line">
            <span className="k">Founded</span>
            <span className="v">{firm.founded}</span>
          </div>
          <div className="profile-line">
            <span className="k">AUM</span>
            <span className="v">${firm.aum}B</span>
          </div>
          <div className="profile-line">
            <span className="k">Employees</span>
            <span className="v">{firm.employees}</span>
          </div>
          <div className="profile-line">
            <span className="k">Active fund</span>
            <span className="v">{firm.activeFunds}</span>
          </div>
          <div className="profile-line">
            <span className="k">Strategy</span>
            <span className="v">{firm.strategy}</span>
          </div>
          <div className="profile-line sectors-line">
            <span className="k">Sectors</span>
            <span className="v">
              {firm.sectors.map((s) => (
                <span key={s} className="sector-chip">
                  {s}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="profile-col">
          <h4>Investment focus</h4>
          <p className="profile-focus">{firm.focus}</p>
          <h4 style={{ marginTop: 20 }}>Key people</h4>
          {(firm.keyPeople || []).map((p) => (
            <div key={p} className="profile-person">
              {p}
            </div>
          ))}
        </div>
        <div className="profile-col">
          <h4>Recent funds</h4>
          {(firm.recentFunds || []).map((f) => (
            <div key={f.name} className="profile-fund">
              <div className="pf-name">{f.name}</div>
              <div className="pf-meta">
                Vintage {f.vintage} · {f.size}
              </div>
            </div>
          ))}
          <h4 style={{ marginTop: 20 }}>Notable portfolio</h4>
          <div className="profile-portfolio">
            {(firm.notablePortfolio || []).map((p) => (
              <span key={p} className="portfolio-pill">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="story-list">
        {filtered.map((s) => (
          <StoryRow
            key={s.id}
            story={s}
            firm={firm}
            expanded={expandedStory === s.id}
            onToggle={() =>
              setExpandedStory(expandedStory === s.id ? null : s.id)
            }
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
