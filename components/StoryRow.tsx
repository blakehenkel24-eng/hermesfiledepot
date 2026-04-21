"use client";

import { IconChev } from "./Icons";
import type { FlatFirm, Story } from "@/lib/types";

const impactWord: Record<string, string> = {
  high: "HIGH",
  med: "MED",
  low: "LOW",
};

const timeMap: Record<string, string> = {
  "2h": "05:42",
  "4h": "03:51",
  "5h": "02:38",
  "6h": "01:45",
  "8h": "23:20",
  "10h": "21:18",
  "12h": "19:04",
  "14h": "17:20",
  "1d": "YDAY",
};

interface StoryRowProps {
  story: Story;
  firm: FlatFirm;
  expanded: boolean;
  onToggle: () => void;
  viewMode: string;
}

export default function StoryRow({
  story,
  firm,
  expanded,
  onToggle,
  viewMode,
}: StoryRowProps) {
  return (
    <>
      <div
        className={`story-row ${expanded ? "expanded" : ""}`}
        onClick={onToggle}
      >
        <div className="story-time">
          <div className="time-main">{timeMap[story.timeAgo] || story.timeAgo}</div>
          <div className="time-ago">{story.timeAgo} AGO</div>
        </div>
        <div>
          <div className="story-firm">{firm.short}</div>
          <div className="story-firm-line">
            <span className={`rel-dot ${firm.relationship}`}></span>
            {firm.relationship.toUpperCase()}
          </div>
        </div>
        <div className="story-content">
          <div className="story-type-row">
            <span className={`type-tag ${story.type}`}>{story.type}</span>
            <span className={`impact-mark ${story.impact}`}>
              <span className="bar"></span>
              {impactWord[story.impact]} IMPACT
            </span>
          </div>
          <h3 className="story-headline">{story.headline}</h3>
          {viewMode !== "compact" && <p className="story-dek">{story.dek}</p>}
          {viewMode !== "compact" && (
            <div className="story-tags">
              {story.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="story-metric">
          <div className="story-metric-value">{story.metric.value}</div>
          <div className="story-metric-label">{story.metric.label}</div>
        </div>
        <div className="story-source">
          <span
            className={`tier ${
              story.sourceTier === 2
                ? "t2"
                : story.sourceTier === 3
                ? "t3"
                : ""
            }`}
          ></span>
          {story.source}
        </div>
        <div className="story-chev">
          <IconChev />
        </div>
      </div>
      {expanded && (
        <div
          className="story-row expanded"
          style={{ paddingTop: 0, borderTop: "none", cursor: "default" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div></div>
          <div></div>
          <div className="story-expanded-body">
            {story.body.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="story-expanded-actions">
              <button>★ SAVE</button>
              <button>SHARE</button>
              <button>OPEN SOURCE</button>
              <button>ADD TO MEMO</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
