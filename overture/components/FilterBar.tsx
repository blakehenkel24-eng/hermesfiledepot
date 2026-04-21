"use client";

interface FilterBarProps {
  filter: string;
  setFilter: (f: string) => void;
  counts: Record<string, number>;
  viewMode: string;
  setViewMode: (m: string) => void;
  types?: string[];
}

export default function FilterBar({
  filter,
  setFilter,
  counts,
  viewMode,
  setViewMode,
  types = ["All", "Deal", "Fund", "Leadership", "Portfolio"],
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-left">
        {types.map((t) => (
          <button
            key={t}
            className={`filter-chip ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}
          >
            {t.toUpperCase()}{" "}
            <span className="count">{counts[t] || 0}</span>
          </button>
        ))}
      </div>
      <div className="filter-bar-right">
        <div className="view-toggle">
          <button
            className={viewMode === "comfortable" ? "active" : ""}
            onClick={() => setViewMode("comfortable")}
          >
            COMFORT
          </button>
          <button
            className={viewMode === "compact" ? "active" : ""}
            onClick={() => setViewMode("compact")}
          >
            COMPACT
          </button>
        </div>
      </div>
    </div>
  );
}
