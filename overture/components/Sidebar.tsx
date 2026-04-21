"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconNews, IconStar, IconBook, IconPlus } from "./Icons";
import type { FlatFirm } from "@/lib/types";

interface SidebarProps {
  onOpenWatchlist: () => void;
}

export default function Sidebar({ onOpenWatchlist }: SidebarProps) {
  const [firms, setFirms] = useState<FlatFirm[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => setFirms(data.firms || []))
      .catch(() => {});
  }, []);

  const watched = firms.filter((f) => f.watched);

  // Determine active view from pathname
  const isBriefing = pathname === "/";
  const isRepo = pathname === "/repo";
  const isSaved = pathname === "/saved";
  const isFirm = pathname.startsWith("/firm/");

  // Extract active firm slug from path
  const activeFirmSlug = isFirm ? pathname.split("/firm/")[1] : null;

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="label">Views</div>
        </div>
        <div
          className={`nav-item ${isBriefing ? "active" : ""}`}
          onClick={() => router.push("/")}
        >
          <span className="nav-icon">
            <IconNews />
          </span>
          Daily briefing
          <span className="nav-count">{watched.length}</span>
        </div>
        <div
          className={`nav-item ${isRepo ? "active" : ""}`}
          onClick={() => router.push("/repo")}
        >
          <span className="nav-icon">
            <IconBook />
          </span>
          Firm profiles
          <span className="nav-count">{firms.length}</span>
        </div>
        <div
          className={`nav-item ${isSaved ? "active" : ""}`}
          onClick={() => router.push("/saved")}
        >
          <span className="nav-icon">
            <IconStar />
          </span>
          Saved
          <span className="nav-count">4</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <div className="label">Watchlist</div>
          <div className="count">{watched.length}</div>
        </div>
        {watched.map((f) => (
          <div
            key={f.id}
            className={`firm-item ${activeFirmSlug === f.slug ? "active" : ""}`}
            onClick={() => router.push(`/firm/${f.slug}`)}
          >
            <span className={`rel-dot ${f.relationship}`}></span>
            <div className="firm-short">{f.short}</div>
            <div className={`firm-unread ${f.unread === 0 ? "zero" : ""}`}>
              {f.unread}
            </div>
          </div>
        ))}
        <button className="add-firm-btn" onClick={onOpenWatchlist}>
          <IconPlus /> Manage watchlist
        </button>
      </div>
    </aside>
  );
}
