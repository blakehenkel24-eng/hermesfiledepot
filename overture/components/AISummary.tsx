"use client";

import { useState, useMemo } from "react";
import type { FlatFirm, Story } from "@/lib/types";

interface AISummaryProps {
  firms: FlatFirm[];
  stories: Story[];
}

function generateSummary(watched: FlatFirm[], stories: Story[]): string {
  const totalUnread = watched.reduce((s, f) => s + f.unread, 0);
  const highImpact = stories.filter((s) => s.impact === "high").length;
  const medImpact = stories.filter((s) => s.impact === "med").length;

  // Build firm-specific summaries from stories
  const firmSummaries: Record<string, string[]> = {};
  for (const s of stories) {
    const firm = watched.find((f) => f.id === s.firmId);
    if (!firm) continue;
    if (!firmSummaries[firm.short]) firmSummaries[firm.short] = [];
    firmSummaries[firm.short].push(`${s.headline}. ${s.dek}`);
  }

  const firmRefs = Object.entries(firmSummaries)
    .map(
      ([short, items]) =>
        `<span class="firm-ref">${short}</span> ${items.join(". ")}`
    )
    .join(". ");

  return `<b>Overnight: ${totalUnread} developments across ${watched.length} firms on watch — ${highImpact} high-impact, ${medImpact} medium.</b> ${firmRefs}. <b>Net read:</b> Q2 deployment is accelerating on fresh capital, carve-outs and founder tuck-ins dominate middle-market supply, and senior PortOps hires this week at Platinum echo similar moves at Carlyle and KKR last month — value-creation muscle is the GP battleground heading into the back half of '26.`;
}

export default function AISummary({ firms, stories }: AISummaryProps) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const watched = firms.filter((f) => f.watched);
  const watchedIds = new Set(watched.map((f) => f.id));
  const watchedStories = stories.filter((s) => watchedIds.has(s.firmId));

  const summaryHtml = useMemo(
    () => generateSummary(watched, watchedStories),
    [watched, watchedStories]
  );

  const handleCopy = () => {
    const el = document.querySelector(".ai-summary-body");
    const txt = el?.textContent || "";
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1200);
  };

  return (
    <div className="ai-summary">
      <div className="ai-summary-badge">
        <div className="ai-dot"></div>
        <div>
          <div className="label">Market Brief</div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--muted)",
              marginTop: 3,
              letterSpacing: "0.08em",
            }}
          >
            GEN 07:15 ET
          </div>
        </div>
      </div>
      <div className="ai-summary-body">
        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: summaryHtml }} />
      </div>
      <div className="ai-summary-actions">
        <button onClick={handleCopy}>
          {copied ? "COPIED" : "COPY"}
        </button>
        <button onClick={handleRegenerate}>
          {regenerating ? "GENERATING…" : "REGENERATE"}
        </button>
      </div>
    </div>
  );
}
