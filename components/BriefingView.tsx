"use client";

import { useState, useMemo, useEffect } from "react";
import AISummary from "./AISummary";
import FilterBar from "./FilterBar";
import StoryRow from "./StoryRow";
import type { FlatFirm, Story, MarketPulse } from "@/lib/types";

interface BriefingViewProps {
  firms: FlatFirm[];
  stories: Story[];
  viewMode: string;
  setViewMode: (m: string) => void;
  expandedStory: string | null;
  setExpandedStory: (id: string | null) => void;
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BriefingView({
  firms,
  stories,
  viewMode,
  setViewMode,
  expandedStory,
  setExpandedStory,
}: BriefingViewProps) {
  const [filter, setFilter] = useState("All");
  const [pulse, setPulse] = useState<MarketPulse | null>(null);

  useEffect(() => {
    fetch("/api/market-pulse")
      .then((r) => r.json())
      .then(setPulse)
      .catch(() => {});
  }, []);

  const watched = firms.filter((f) => f.watched);
  const watchedIds = new Set(watched.map((f) => f.id));
  const watchedStories = stories.filter((s) => watchedIds.has(s.firmId));

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: watchedStories.length };
    watchedStories.forEach((s) => {
      c[s.type] = (c[s.type] || 0) + 1;
    });
    return c;
  }, [watchedStories]);

  const filtered =
    filter === "All"
      ? watchedStories
      : watchedStories.filter((s) => s.type === filter);

  return (
    <>
      <div className="briefing-header">
        <div className="kicker">Morning briefing · {today()}</div>
        <h1 className="briefing-title">
          Good morning. Here is your{" "}
          <span className="accent">daily PE briefing.</span>
        </h1>
        <div className="briefing-meta">
          <span>
            Clients <b>{watched.length}</b>
          </span>
          <span>
            Stories <b>{watchedStories.length}</b>
          </span>
          <span>
            High-impact{" "}
            <b>{watchedStories.filter((s) => s.impact === "high").length}</b>
          </span>
          <span>
            Sources <b>14</b>
          </span>
        </div>
      </div>

      <div className="briefing-stats">
        <div className="stat">
          <div className="stat-label">Deals 24h</div>
          <div className="stat-value">{pulse?.dealCount24h ?? 47}</div>
          <div className="stat-delta pos">{pulse?.dealCount24hDelta ?? "+12"} vs 7d avg</div>
        </div>
        <div className="stat">
          <div className="stat-label">Fund closes</div>
          <div className="stat-value">{pulse?.fundCloseCount ?? 3}</div>
          <div className="stat-delta pos">{pulse?.fundCloseCountDelta ?? "+1"} vs 7d</div>
        </div>
        <div className="stat">
          <div className="stat-label">Senior moves</div>
          <div className="stat-value">{pulse?.seniorHires ?? 8}</div>
          <div className="stat-delta neg">{pulse?.seniorHiresDelta ?? "-2"} vs 7d</div>
        </div>
        <div className="stat">
          <div className="stat-label">Agg. deal value</div>
          <div className="stat-value">{pulse ? `$${pulse.aggregateDealValue}` : "$14.8B"}</div>
          <div className="stat-delta pos">{pulse ? `+$${pulse.aggregateDealValueDelta}` : "+$3.2B"}</div>
        </div>
      </div>

      <AISummary firms={firms} stories={stories} />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="story-list">
        {filtered.map((s) => {
          const firm = firms.find((f) => f.id === s.firmId);
          if (!firm) return null;
          return (
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
          );
        })}
      </div>
    </>
  );
}
