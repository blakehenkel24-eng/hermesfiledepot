"use client";

import { useApp } from "@/components/AppShell";
import FirmRepo from "@/components/FirmRepo";

export default function RepoPage() {
  const { firms } = useApp();

  if (firms.length === 0) {
    return (
      <div style={{ padding: 48 }}>
        <div className="kicker">Loading…</div>
      </div>
    );
  }

  return <FirmRepo firms={firms} />;
}
