# Research Plan: PE Playbooks by Industry & Sub-Industry

## Core Question
What are the distinct private equity value creation playbooks (operational, financial, strategic) for each major industry vertical and their sub-industries? How do top PE firms approach each differently?

## Scope
- **Depth:** Deep dive — this is reference-grade intelligence for Blake's consulting career and product building
- **Format:** Structured JSON + narrative Markdown per industry
- **Output:** `/root/pe-playbooks-research/`

## Industries & Sub-Industries to Cover

### 1. Technology / Software
- B2B SaaS
- Fintech
- Cybersecurity
- Healthtech
- IT Services / MSPs
- Data & Analytics

### 2. Healthcare
- Healthcare Services (clinics, practices, facilities)
- Pharma / Life Sciences
- Medical Devices
- Behavioral Health
- Dental / DSOs
- Home Health / Hospice
- Healthcare IT

### 3. Industrials / Manufacturing
- Advanced Manufacturing
- Aerospace & Defense
- Automotive / Auto Parts
- Building Products
- Chemicals
- Industrial Technology

### 4. Consumer
- Consumer Products (CPG)
- Restaurants / Food & Beverage
- Retail
- E-commerce / DTC
- Fitness / Wellness

### 5. Business Services
- Consulting / Professional Services
- HR / Staffing
- Marketing / Advertising
- Facility Management
- Education / Training (EdTech)
- Insurance Brokerage

### 6. Financial Services
- Insurance
- Asset Management / Wealth Management
- Payments / Processing
- Specialty Finance
- Banking Technology

### 7. Energy & Resources
- Oil & Gas (Upstream, Midstream, Downstream)
- Renewables / Clean Energy
- Mining / Minerals
- Utilities

### 8. Real Estate
- Residential
- Commercial
- Industrial / Logistics
- Hospitality

### 9. Transportation & Logistics
- Freight / Trucking
- Supply Chain / 3PL
- Aviation
- Maritime

### 10. TMT (Telecom, Media, Entertainment)
- Telecom / Infrastructure
- Media / Content
- Gaming
- Sports / Entertainment

## Data Fields Per Industry Playbook
- Typical entry thesis / rationale for PE investment
- Common value creation levers (operational improvements)
- Financial engineering approaches (leverage structures, add-on strategies)
- Typical hold period and exit routes
- Key metrics KPIs PE firms track
- Notable PE firms active in space
- Common risks / challenges
- Add-on / roll-up vs platform vs growth equity approaches
- Technology / AI value creation angle (especially relevant for Blake's work)

## Source Hit List

### Tier 1 — Primary Sources
- SEC EDGAR — 10-K filings from PE-backed companies
- PitchBook / Bain PE Reports (annual)
- McKinsey PE practice publications
- Bain & Company Global Private Equity Report
- Preqin research

### Tier 2 — Semi-Structured Deep Sources
- Harvard Business Review PE articles
- Wharton PE case studies
- Industry-specific PE conference proceedings (SuperReturn, ILPA)
- Consulting firm playbooks (BCG, Bain, McKinsey industry primers)
- PE firm websites (KKR, Blackstone, Apollo, Carlyle, Warburg, Thoma Bravo, Vista, etc.)
- Law firm PE publications (Kirkland, Latham, Ropes & Gray)

### Tier 3 — Enrichment Sources
- PE Hub, Private Equity International, Buyouts Magazine
- Axios Pro Rata, PitchBook News
- Industry trade publications
- Reddit r/PrivateEquity, WallStreetOasis PE forums

### Tier 4 — Validation
- Cross-reference across consulting reports + PE firm publications + news coverage

## Search Query Strategy
Per industry, run queries like:
- "private equity playbook [industry] value creation"
- "private equity value creation levers [sub-industry]"
- "private equity operating model [industry]"
- "private equity roll-up strategy [sub-industry]"
- "top PE firms [industry] portfolio strategy"
- "private equity [industry] KPIs metrics"
- "Bain McKinsey private equity [industry] report"
- "private equity [industry] exit strategies"
- "private equity AI technology value creation [industry]"
- "private equity add-on strategy [sub-industry]"

## Execution Plan
1. Run batch searches across all 10 industries (execute_code, 0 LLM calls)
2. Extract top 50+ URLs (execute_code, 0 LLM calls)
3. Browser for any blocked high-value sources (0 LLM calls)
4. Structure into industry playbook profiles (1-2 LLM calls)
5. Validate and confidence-score (1 LLM call)
6. Deliver final structured output

## Rate Limit Budget
| Phase | Calls |
|-------|-------|
| Planning | 1 (done) |
| Gathering | 0 |
| Structuring | 1-2 |
| Validation | 1 |
| **TOTAL** | **3-4** |
