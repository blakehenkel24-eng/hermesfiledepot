# Overture -- PE Client Intelligence Platform Build Spec

## Overview
Build a production Next.js application based on the reference design prototype. The prototype is located at:
- `/root/hermesfiledepot/extracted/PE News Monitor/PE News Monitor/app.jsx` (React components)
- `/root/hermesfiledepot/extracted/PE News Monitor/PE News Monitor/styles.css` (complete CSS)
- `/root/hermesfiledepot/extracted/PE News Monitor/PE News Monitor/data.js` (data model + mock data)

## CRITICAL: Read These Files First
Before writing ANY code, you MUST read all three design reference files completely. They contain the exact UI structure, styling, data model, and interactions that must be replicated.

## Project Location
`/root/pe-tool/` -- this directory already has a Next.js 14 scaffold with `app/`, `components/`, `lib/`, `data/` directories.

## Architecture

### Tech Stack
- Next.js 14 (App Router) -- already scaffolded
- TypeScript
- Tailwind CSS -- BUT the design uses custom CSS, NOT Tailwind utility classes. Import the custom CSS.
- React 18+ (client components where needed)
- File-based JSON storage (no database)
- Source Serif 4 + IBM Plex Sans + IBM Plex Mono fonts (from Google Fonts)

### Aesthetic (FROM THE CSS FILE -- DO NOT DEVIATE)
- FT (Financial Times) editorial style
- Pink-cream paper background: `#fff1e5`
- Near-black ink text: `#1d1d1b`
- Claret accent: `#990f3d`
- FT teal-blue for links: `#0f5499`
- Source Serif 4 for body/headings
- IBM Plex Sans for labels/UI elements
- IBM Plex Mono for numbers/data
- Double-rule borders, hairline rules, editorial typography
- The ENTIRE styles.css from the prototype should be ported as the foundation

### App Layout (Grid Shell)
```
| Brand Mark | Topbar (date, market pulse, search, user)          |
| Sidebar    | Main Content Area                                  |
| (240px)    | (remaining)                                        |
```

### Pages / Views

**1. Dashboard (Home -- `/`)**
- Briefing header with editorial masthead style
- Stats row: Deals 24h, Fund closes, Senior moves, Agg deal value
- AI Summary: Claret left border, serif body, firm references as styled badges
- Filter bar: ALL / DEAL / FUND / LEADERSHIP / PORTFOLIO with counts
- News feed: StoryRow components with time, firm badge, type tags, impact markers, expandable body
- Comfort/Compact density toggle

**2. Firm Profiles (`/repo`)**
- Search + filter (All, Watched, Mid-market, Large-cap, By sector)
- Sort by Name A-Z, AUM, or Vintage
- Grid of firm cards with: short name, full name, strategy, sector chips, AUM/founded/HQ stats
- Click card -> Firm Detail

**3. Firm Detail (`/firm/[slug]`)**
- Breadcrumb navigation
- Firm header with name, strategy, watch/share/export buttons
- Facts bar (AUM, Founded, Stories 30d, Unread)
- Three-column profile panel:
  - Left: Firm at a glance (HQ, AUM, Employees, Active fund, Strategy, Sectors)
  - Middle: Investment focus description + Key people list
  - Right: Recent funds + Notable portfolio pills
- Filtered news feed for this firm

**4. Saved (stub -- `/saved`)**
- Placeholder: "Coming soon"

### Components to Build (from app.jsx)
All component logic is in the prototype's app.jsx. Replicate these exactly:

1. **Topbar** -- Date chip, market pulse pills, search box, bell/settings buttons, user chip
2. **Sidebar** -- Views nav (Briefing, Profiles, Saved), Watchlist with firm items showing relationship dots + unread counts, "Manage watchlist" button
3. **AISummary** -- AI-generated market brief with claret border, firm-ref badges, copy/regenerate buttons
4. **FilterBar** -- Type filters with counts, density toggle
5. **StoryRow** -- Time column, firm badge, type tag, impact marker, headline, dek, tags, metric, source, expandable body with save/share/open/memo buttons
6. **BriefingView** -- Full dashboard page composition
7. **FirmRepo** -- Searchable filterable grid of all firms
8. **FirmDetail** -- Deep dive single firm view with profile panel + filtered news
9. **WatchlistModal** -- Modal for adding/removing firms from watchlist
10. **TweaksPanel** -- Layout/density settings panel

### Data Layer

**Firm profiles**: JSON files in `/data/firms/` (61 files already exist). Each file follows this schema:
```json
{
  "slug": "firm-name",
  "name": "Full Firm Name",
  "description": "...",
  "hq": { "city": "...", "state": "IL" },
  "website": "https://...",
  "aum": "$X.XB+",
  "fundCount": 10,
  "tier": 1,
  "dateAdded": "2026-04-21",
  "investmentStrategy": ["Buyout", ...],
  "focusAreas": ["Healthcare", ...],
  "geographicFocus": ["United States"],
  "keyPersonnel": [{"name": "...", "title": "...", "office": "City, ST"}],
  "portfolioCompanies": [{"name": "...", "industry": "...", "status": "active|exited"}]
}
```

**News stories**: Use the mock data from data.js as initial seed data, stored in `/data/news-cache.json`. In production, stories will come from RSS/GDELT feeds.

**Market pulse**: Use the mock data from data.js PE_MARKET_PULSE object.

### API Routes
- `GET /api/firms` -- Returns all firm profiles from JSON files
- `GET /api/firms/[slug]` -- Returns single firm profile
- `PATCH /api/firms/[slug]` -- Update firm (e.g., toggle watch status, tier)
- `GET /api/news` -- Returns news stories, optional firm filter
- `GET /api/market-pulse` -- Returns aggregate market stats

### Key Interactions
1. **Watchlist toggle**: Click star on firm detail or use WatchlistModal -> updates firm's watched status
2. **Story expand/collapse**: Click story row -> expands to show full body text
3. **Filter news**: Click type filter (Deal/Fund/Leadership/Portfolio) -> filters story list
4. **Search firms**: Type in search box on Firm Profiles page -> filters grid
5. **Sort firms**: Toggle A-Z / AUM / Vintage sort on Firm Profiles page
6. **Density toggle**: Comfort/Compact switches story list between full and condensed views

### Implementation Rules
1. **Use the prototype CSS as the foundation** -- port the complete styles.css, don't recreate from scratch
2. **Port the component logic from app.jsx** -- the interactions, state management, and UI logic are all there
3. **DO NOT use Tailwind utility classes** for the main styling -- use the custom CSS
4. **Client components** for anything with state (useState, useEffect) -- add "use client" directive
5. **Read firm data from the JSON files** -- use fs.readFileSync on server, or an API route for client
6. **Make the app look IDENTICAL to the prototype** -- same colors, fonts, spacing, typography
7. **Ensure `npm run build` passes** with zero errors
8. **Add Google Fonts via next/font/google** for Source Serif 4, IBM Plex Sans, IBM Plex Mono

### File Structure
```
pe-tool/
  app/
    layout.tsx           -- Root layout with sidebar + topbar
    page.tsx             -- Dashboard (BriefingView)
    globals.css          -- Port of the prototype's styles.css
    repo/
      page.tsx           -- Firm Profiles grid (FirmRepo)
    firm/
      [slug]/
        page.tsx         -- Firm Detail page
    saved/
      page.tsx           -- Saved items (stub)
    api/
      firms/
        route.ts         -- GET all firms
        [slug]/
          route.ts       -- GET/PATCH single firm
      news/
        route.ts         -- GET news stories
      market-pulse/
        route.ts         -- GET market stats
  components/
    Topbar.tsx
    Sidebar.tsx
    AISummary.tsx
    FilterBar.tsx
    StoryRow.tsx
    BriefingView.tsx
    FirmRepo.tsx
    FirmDetail.tsx
    WatchlistModal.tsx
    TweaksPanel.tsx
    Icons.tsx            -- SVG icon components
  lib/
    types.ts             -- TypeScript interfaces
    data.ts              -- Data loading helpers (read firm JSONs, news cache)
    seed-data.ts         -- Initial news stories and market pulse from prototype
  data/
    firms/               -- 61 JSON files (already exist)
    news-cache.json      -- Seed with prototype stories
  package.json
  next.config.ts
  tsconfig.json
```

## Success Criteria
- App starts with `npm run dev` and renders correctly
- Dashboard shows AI summary, market pulse, news feed with all 61 firms accessible
- Firm Profiles page shows searchable/filterable grid of all firms
- Firm Detail page shows complete profile with personnel, portfolio, funds
- Watchlist management works (add/remove firms)
- News filtering by type works
- Story expand/collapse works
- `npm run build` passes with zero errors
- Visual fidelity matches the prototype design
