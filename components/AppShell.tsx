"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import WatchlistModal from "./WatchlistModal";
import TweaksPanel from "./TweaksPanel";
import type { FlatFirm, Story } from "@/lib/types";

interface AppState {
  firms: FlatFirm[];
  stories: Story[];
  viewMode: string;
  setViewMode: (m: string) => void;
  expandedStory: string | null;
  setExpandedStory: (id: string | null) => void;
  toggleWatch: (firmId: string) => void;
  layout: string;
  setLayout: (l: string) => void;
  density: string;
  setDensity: (d: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppShell");
  return ctx;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [firms, setFirms] = useState<FlatFirm[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [viewMode, setViewMode] = useState("comfortable");
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showTweaks, setShowTweaks] = useState(false);
  const [layout, setLayout] = useState("dashboard");
  const [density, setDensityRaw] = useState("comfortable");

  const setDensity = (d: string) => {
    setDensityRaw(d);
    setViewMode(d);
  };

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setFirms(data.firms || []);
        setStories(data.stories || []);
      })
      .catch(() => {});
  }, []);

  const toggleWatch = (firmId: string) => {
    setFirms((prev) =>
      prev.map((f) => (f.id === firmId ? { ...f, watched: !f.watched } : f))
    );
  };

  // Edit mode activation via postMessage (for integrated tools)
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "__activate_edit_mode") setShowTweaks(true);
      if (e.data?.type === "__deactivate_edit_mode") setShowTweaks(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <AppContext.Provider
      value={{
        firms,
        stories,
        viewMode,
        setViewMode,
        expandedStory,
        setExpandedStory,
        toggleWatch,
        layout,
        setLayout,
        density,
        setDensity,
      }}
    >
      <div className="brand">
        <div className="brand-mark"></div>
        <div className="brand-name">
          OVERTURE<span>·</span>PE
        </div>
      </div>
      <Topbar />
      <Sidebar onOpenWatchlist={() => setShowWatchlist(true)} />
      <main className={`main layout-${layout}`}>{children}</main>
      {showWatchlist && (
        <WatchlistModal
          firms={firms}
          onClose={() => setShowWatchlist(false)}
          toggleWatch={toggleWatch}
        />
      )}
      {showTweaks && (
        <TweaksPanel
          layout={layout}
          setLayout={setLayout}
          density={density}
          setDensity={setDensity}
          onClose={() => setShowTweaks(false)}
        />
      )}
    </AppContext.Provider>
  );
}
