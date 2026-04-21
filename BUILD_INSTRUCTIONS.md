# PE Client Intelligence Tool - Build Instructions

You are building a PE Client Intelligence Platform called **Overture** for Inspire11's PE services team.

## Your Task

Build the complete Next.js application based on the design spec below. This is a greenfield build - the scaffold exists with Next.js 14, TypeScript, Tailwind CSS, App Router, and src directory structure. You need to create ALL files listed in the file structure.

## Design Spec

### Aesthetic: Editorial Private Bank
Financial Times meets private wealth management morning brief.
- Light mode only. Cream/warm white background (#FAFAF8)
- Warm serif display font (Georgia) for headings
- Clean sans-serif body (system font stack)
- Gold/amber accent color (#B8860B) for opportunities, alerts, and interactive elements
- No gradients, no glassmorphism, no neon, no rounded cards everywhere
- Rigid grid with visible structural dividers
- Feels like opening a morning intelligence packet at a white-shoe firm
- Content-first: maximum readability, minimum decoration

### Three Main Views

**1. Dashboard (Home - `/`)**
- Top: AI Morning Summary - 3-5 paragraph synthesis of most important developments. Gold horizontal rule above. Warm serif.
- Middle: News Feed - chronological list of articles. Source icon, firm name (clickable), category tag (Acquisition|Fund|Portco|Personnel|Strategy|Opportunity), headline, 1-2 sentence AI summary, timestamp, optional gold Opportunity badge.
- Right sidebar: Signal Heat Index - firms sorted by activity volume (7 days). Firm name, tier badge, news count, latest headline snippet.

**2. Firm Profile (`/firm/[slug]`)**
- Header: Firm name (large serif), HQ, website link, tier badge, date added
- Overview: Description, AUM, fund count, investment strategy tags, industry verticals, geographic focus
- Key Personnel table: Name, Title, Office, LinkedIn link. Sorted by seniority.
- Portfolio Companies: Name, industry, investment date, status (active/exited)
- Recent News: Filtered to this firm
- Team Notes: Shared notepad. Textarea, save button, timestamp + author (free text)

**3. Client Tracker (`/tracker`)**
- Firm list table: Name, Tier, HQ, Focus, Last News Date, # Articles This Week, Actions
- Tier system: Tier 1 (gold), Tier 2 (silver), Tier 3 (bronze)
- Add Firm form: Name, website, tier, HQ city
- Bulk import: Paste list of firm names

### Data Layer
- Firm profiles: JSON files in `/data/firms/` (one per firm)
- News articles: `/data/news-cache.json` (rolling 30-day)
- Team notes: `/data/notes.json` (keyed by firm slug)
- AI summaries: `/data/summaries/` (one per day)
- NO DATABASE. File-based storage.

### API Routes
- GET /api/news - cached news, query params for firm/category/date
- GET /api/firms - all followed firms
- GET /api/firms/[slug] - single firm profile + recent news
- POST /api/firms - add new firm
- PATCH /api/firms/[slug] - update tier/info
- DELETE /api/firms/[slug] - remove firm
- GET /api/summary - today's AI morning summary
- POST /api/notes/[slug] - save team note
- GET /api/cron/fetch-news - cron: fetch RSS + GDELT
- GET /api/cron/generate-summary - cron: AI morning summary

### Tech Stack
- Next.js 14 (App Router, src directory)
- TypeScript
- Tailwind CSS with custom design tokens
- Georgia serif (display) + system sans-serif (body)
- OpenAI GPT-4o-mini via AI SDK (for summaries)
- rss-parser for RSS feeds
- GDELT API v2 (free, no key)
- File-based JSON storage

### IMPORTANT NOTES
- The app structure uses `src/` directory (check if scaffold has it)
- Do NOT use any database - all data is file-based JSON
- Do NOT add authentication
- For the OpenAI API key, use `process.env.OPENAI_API_KEY`
- Create sample firm data files for at least 3 firms so the UI works immediately
- Create sample news data so the dashboard isn't empty
- Make the app look premium - this is for a consulting team at a PE firm
- Include a `vercel.json` with cron configuration

### Tailwind Custom Tokens
Add these to your tailwind config:
- cream: '#FAFAF8' (background)
- gold: '#B8860B' (accent)
- gold-light: '#D4A843' (hover)
- ink: '#1A1A1A' (text)
- muted: '#6B6B6B' (secondary text)
- divider: '#E5E2DB' (borders)
- serif: 'Georgia, Cambria, "Times New Roman", Times, serif'
- sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
