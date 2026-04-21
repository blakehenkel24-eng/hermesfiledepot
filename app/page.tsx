"use client";

import { useApp } from "@/components/AppShell";
import BriefingView from "@/components/BriefingView";

export default function HomePage() {
  const { firms, stories, viewMode, setViewMode, expandedStory, setExpandedStory } =
    useApp();

  if (firms.length === 0) {
    return (
      <div style={{ padding: 48 }}>
        <div className="kicker">Loading…</div>
      </div>
    );
  }

  return (
    <BriefingView
      firms={firms}
      stories={stories}
      viewMode={viewMode}
      setViewMode={setViewMode}
      expandedStory={expandedStory}
      setExpandedStory={setExpandedStory}
    />
  );
}
