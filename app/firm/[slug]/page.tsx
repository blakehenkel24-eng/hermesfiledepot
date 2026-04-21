"use client";

import { use } from "react";
import { useApp } from "@/components/AppShell";
import FirmDetail from "@/components/FirmDetail";

export default function FirmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { firms, stories, viewMode, setViewMode, expandedStory, setExpandedStory, toggleWatch } =
    useApp();

  const firm = firms.find((f) => f.slug === slug);

  if (!firm) {
    return (
      <div style={{ padding: 48 }}>
        <div className="kicker">Firm not found</div>
        <h1 className="briefing-title" style={{ fontSize: 32, marginTop: 12 }}>
          No firm found with slug &ldquo;{slug}&rdquo;
        </h1>
      </div>
    );
  }

  return (
    <FirmDetail
      firm={firm}
      stories={stories}
      allFirms={firms}
      viewMode={viewMode}
      setViewMode={setViewMode}
      expandedStory={expandedStory}
      setExpandedStory={setExpandedStory}
      toggleWatch={toggleWatch}
    />
  );
}
