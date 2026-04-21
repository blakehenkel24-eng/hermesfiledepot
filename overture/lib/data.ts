import fs from "fs";
import path from "path";
import type { FirmProfile, FlatFirm, Story, MarketPulse } from "./types";

const FIRMS_DIR = path.join(process.cwd(), "data", "firms");

// Parse AUM string like "$43B+" or "$1.5B+" to a number
function parseAum(aumStr: string): number {
  const match = aumStr.replace(/,/g, "").match(/\$?([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

// Generate a short ticker from firm name
function generateShort(name: string): string {
  const words = name
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter((w) => !["the", "of", "and", "inc", "llc", "lp", "ltd", "group", "capital", "partners", "equity", "holdings", "investment", "management", "corporation", "private"].includes(w.toLowerCase()));
  if (words.length === 0) return name.substring(0, 6).toUpperCase();
  if (words.length === 1) return words[0].substring(0, 8).toUpperCase();
  return words.map((w) => w.substring(0, Math.max(1, Math.ceil(8 / words.length)))).join("").toUpperCase().substring(0, 10);
}

// Assign a relationship based on tier and watched status
function assignRelationship(tier: number, watched: boolean): string {
  if (watched && tier <= 2) return "Active";
  if (watched) return "Dormant";
  if (tier <= 2) return "Prospect";
  return "Cold";
}

// Transform FirmProfile JSON to FlatFirm for UI
export function transformFirm(fp: FirmProfile, watched: boolean = false): FlatFirm {
  const aumNum = parseAum(fp.aum);
  const founded = extractFounded(fp);
  const short = generateShort(fp.name);

  return {
    id: fp.slug,
    slug: fp.slug,
    name: fp.name,
    short,
    hq: `${fp.hq.city}, ${fp.hq.state}`,
    aum: aumNum.toFixed(1),
    aumNum,
    founded,
    employees: estimateEmployees(aumNum),
    activeFunds: `Fund ${fp.fundCount} (${estimateFundSize(aumNum)})`,
    strategy: fp.investmentStrategy[0] || "General",
    focus: fp.description || "",
    sectors: fp.focusAreas.slice(0, 4).map((s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")),
    watched,
    unread: watched ? Math.floor(Math.random() * 5) : 0,
    relationship: assignRelationship(fp.tier, watched),
    keyPeople: fp.keyPersonnel.slice(0, 5).map((p) => `${p.name} · ${p.title}`),
    recentFunds: generateRecentFunds(fp),
    notablePortfolio: fp.portfolioCompanies.filter((p) => p.status === "active").slice(0, 4).map((p) => p.name),
    description: fp.description,
    website: fp.website,
    tier: fp.tier,
    geographicFocus: fp.geographicFocus,
    portfolioCompanies: fp.portfolioCompanies,
  };
}

function extractFounded(fp: FirmProfile): number {
  // Try to derive from description or use a default based on tier
  const desc = fp.description || "";
  const match = desc.match(/founded in (\d{4})/i) || desc.match(/founded.*?(\d{4})/i);
  if (match) return parseInt(match[1]);
  // Default based on tier
  if (fp.tier === 1) return 1995;
  if (fp.tier === 2) return 2005;
  return 2010;
}

function estimateEmployees(aum: number): number {
  if (aum > 40) return 300;
  if (aum > 20) return 150;
  if (aum > 10) return 80;
  if (aum > 5) return 50;
  if (aum > 2) return 30;
  return 15;
}

function estimateFundSize(aum: number): string {
  const size = aum * 0.35;
  if (size >= 1) return `$${size.toFixed(1)}B`;
  return `$${Math.round(size * 1000)}M`;
}

function generateRecentFunds(fp: FirmProfile): { name: string; vintage: number; size: string }[] {
  const aum = parseAum(fp.aum);
  const fundSize = estimateFundSize(aum);
  return [
    { name: `${fp.name} Fund ${fp.fundCount}`, vintage: 2023, size: fundSize },
    ...(fp.fundCount > 1
      ? [{ name: `${fp.name} Fund ${fp.fundCount - 1}`, vintage: 2020, size: `$${Math.round(aum * 0.25 * 10) / 10}B` || "$500M" }]
      : []),
  ];
}

// Default watched firms (matching prototype)
const DEFAULT_WATCHED_SLUGS = new Set([
  "platinum-equity",
  "gemspring-capital",
  "nautic-partners",
  "apco-holdings",
  "cdnr-partners",
]);

// Load all firms from JSON files
export function loadAllFirms(): FlatFirm[] {
  const files = fs.readdirSync(FIRMS_DIR).filter((f) => f.endsWith(".json"));
  const firms: FlatFirm[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(FIRMS_DIR, file), "utf-8");
      const fp: FirmProfile = JSON.parse(raw);
      const watched = DEFAULT_WATCHED_SLUGS.has(fp.slug);
      firms.push(transformFirm(fp, watched));
    } catch (e) {
      console.error(`Error loading firm ${file}:`, e);
    }
  }

  return firms.sort((a, b) => a.name.localeCompare(b.name));
}

// Load a single firm by slug
export function loadFirm(slug: string): FlatFirm | null {
  const filePath = path.join(FIRMS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const fp: FirmProfile = JSON.parse(raw);
    const watched = DEFAULT_WATCHED_SLUGS.has(fp.slug);
    return transformFirm(fp, watched);
  } catch {
    return null;
  }
}

// Seed news stories (from prototype data.js)
export function loadNewsStories(): Story[] {
  const cachePath = path.join(process.cwd(), "data", "news-cache.json");
  if (fs.existsSync(cachePath)) {
    try {
      return JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    } catch {
      // fall through to return default
    }
  }
  return SEED_STORIES;
}

// Market pulse data
export function loadMarketPulse(): MarketPulse {
  return {
    dealCount24h: 47,
    dealCount24hDelta: "+12",
    fundCloseCount: 3,
    fundCloseCountDelta: "+1",
    seniorHires: 8,
    seniorHiresDelta: "-2",
    aggregateDealValue: "14.8B",
    aggregateDealValueDelta: "+3.2B",
  };
}

const SEED_STORIES: Story[] = [
  {
    id: "s001",
    firmId: "platinum-equity",
    type: "Deal",
    headline: "Platinum Equity closes $2.1B take-private of HarborLine Logistics",
    dek: "Transaction values 3PL at 11.4x trailing EBITDA; debt package led by Ares and Blackstone Credit.",
    source: "Mergermarket",
    sourceTier: 1,
    timeAgo: "2h",
    impact: "high",
    tags: ["Buyout", "Industrial", "Take-private"],
    metric: { label: "Deal size", value: "$2.1B" },
    body: "Platinum Equity has completed its take-private acquisition of HarborLine Logistics, the publicly traded third-party logistics provider, for an enterprise value of approximately $2.1 billion — a 32% premium to the unaffected share price and 11.4x trailing EBITDA.\n\nThe debt package was led by Ares Capital Management and Blackstone Credit. Platinum intends to combine HarborLine with its existing holding in drayage operator Portside Freight, creating a platform with roughly $4.8B combined revenue. Operational integration will be led by Platinum's in-house M&A integration group, with a 100-day plan focused on yard optimization and IT consolidation.",
  },
  {
    id: "s002",
    firmId: "nautic-partners",
    type: "Deal",
    headline: "Nautic acquires Meridian Specialty Coatings from founder",
    dek: "Tuck-in for Nautic's industrial coatings platform, Kelvin Surface Technologies; terms undisclosed.",
    source: "PE Hub",
    sourceTier: 1,
    timeAgo: "4h",
    impact: "med",
    tags: ["Add-on", "Industrial", "Founder-owned"],
    metric: { label: "Platform", value: "Kelvin" },
    body: "Nautic Partners has acquired Meridian Specialty Coatings, an Akron, Ohio manufacturer of high-performance industrial coatings, from its founder and CEO Daniel Meridian, who will retain a minority stake.\n\nIt is the fourth tuck-in for Nautic's Kelvin Surface Technologies platform, formed in 2023 through a carve-out from a publicly traded specialty chemicals company. Kelvin's pro-forma revenue now stands at roughly $310M.",
  },
  {
    id: "s003",
    firmId: "gemspring-capital",
    type: "Fund",
    headline: "Gem Spring closes Fund IV at $2.4B hard cap, oversubscribed",
    dek: "Fourth flagship closes above $1.8B target in under six months; LPs include CalPERS, OTPP, MetLife GA.",
    source: "Private Equity International",
    sourceTier: 1,
    timeAgo: "6h",
    impact: "high",
    tags: ["Fundraise", "Hard cap", "Oversubscribed"],
    metric: { label: "Fund IV", value: "$2.4B" },
    body: "Gem Spring Capital has closed its fourth flagship fund at its $2.4 billion hard cap, well above the $1.8 billion target, less than six months after launch.\n\nAnchor commitments came from CalPERS, OTPP, and MetLife's general account; existing LPs re-upped at >95%. Fund IV will continue Gem Spring's strategy of control investments in lower middle-market industrial, consumer and services businesses.",
  },
  {
    id: "s004",
    firmId: "platinum-equity",
    type: "Leadership",
    headline: "Platinum hires ex-Carlyle MD Anjali Rao as Head of Portfolio Ops",
    dek: "Rao, who led Carlyle's industrial value-creation team, reports to Co-President Louis Samson.",
    source: "Bloomberg",
    sourceTier: 1,
    timeAgo: "5h",
    impact: "high",
    tags: ["Hire", "Senior", "Portfolio Ops"],
    metric: { label: "New role", value: "Head of PortOps" },
    body: "Platinum Equity has hired Anjali Rao, most recently an MD at Carlyle where she led value creation for the industrial portfolio, as its new Head of Portfolio Operations, reporting to Co-President Louis Samson.\n\nRao spent nine years at Carlyle across U.S. buyout and portfolio support; prior to that she was a partner at McKinsey's private equity practice.",
  },
  {
    id: "s005",
    firmId: "cdnr-partners",
    type: "Portfolio",
    headline: "CDNR-backed Vantage Analytics acquires ClearSignal for $180M",
    dek: "Add-on doubles Vantage's ARR in regulatory analytics; second acquisition under CDNR ownership.",
    source: "Axios Pro",
    sourceTier: 1,
    timeAgo: "8h",
    impact: "high",
    tags: ["Add-on", "Software", "Portfolio"],
    metric: { label: "Add-on", value: "$180M" },
    body: "Vantage Analytics, a regulatory-compliance software company backed by CDNR, has acquired ClearSignal, a Denver provider of transaction monitoring and AML analytics, for ~$180M.\n\nPro-forma, Vantage will have ~$95M ARR — roughly double its ARR at the time of CDNR's investment. Partner Elena Vasquez, who leads CDNR's software practice and sits on the Vantage board, said ClearSignal extends coverage into banking and payments end markets.",
  },
  {
    id: "s006",
    firmId: "apco-holdings",
    type: "Portfolio",
    headline: "APCO portfolio company ProShield expands into dealer F&I services",
    dek: "ProShield signs multi-year partnership with national dealer group covering 240 rooftops.",
    source: "Auto Finance News",
    sourceTier: 2,
    timeAgo: "10h",
    impact: "med",
    tags: ["Portfolio", "Expansion", "Consumer"],
    metric: { label: "Rooftops", value: "240" },
    body: "ProShield Auto Protection, a portfolio company of APCO Holdings, has signed a multi-year partnership with a top-10 national automotive dealer group to provide F&I products across 240 rooftops. The agreement, effective June 1, is expected to add meaningful volume to ProShield's vehicle service contract and GAP product lines.",
  },
  {
    id: "s007",
    firmId: "nautic-partners",
    type: "Fund",
    headline: "Nautic files Form D for Fund XI, targets $1.5B",
    dek: "SEC filing indicates pre-marketing has begun; first close targeted for Q3 2026.",
    source: "SEC EDGAR",
    sourceTier: 1,
    timeAgo: "12h",
    impact: "med",
    tags: ["Fundraise", "Filing", "Pre-marketing"],
    metric: { label: "Target", value: "$1.5B" },
    body: "Nautic Partners has filed a Form D with the SEC indicating the launch of pre-marketing for Nautic Partners XI, with a target of $1.5 billion. Park Hill Group is listed as placement agent. Predecessor Fund X closed at $1.25 billion in 2022.",
  },
  {
    id: "s008",
    firmId: "platinum-equity",
    type: "Deal",
    headline: "Platinum explores sale of Simcom Aviation Training",
    dek: "Firm has hired Jefferies to run process; expected valuation range $1.2B–$1.4B.",
    source: "Reuters",
    sourceTier: 1,
    timeAgo: "14h",
    impact: "high",
    tags: ["Exit", "Sale process", "Aerospace"],
    metric: { label: "Est. value", value: "$1.2–1.4B" },
    body: "Platinum Equity is exploring a sale of Simcom Aviation Training, the commercial and business aviation simulator and training provider it acquired in 2019, according to people familiar with the matter. Jefferies is running a formal sale process with first-round bids expected in late May and an expected valuation of $1.2B to $1.4B.",
  },
  {
    id: "s009",
    firmId: "cdnr-partners",
    type: "Leadership",
    headline: "CDNR promotes three to Partner, opens Austin office",
    dek: "Annual promotions include two software-focused principals; firm also opens Austin office led by Reid McKinney.",
    source: "Firm release",
    sourceTier: 2,
    timeAgo: "1d",
    impact: "med",
    tags: ["Promotion", "Expansion", "Office"],
    metric: { label: "New partners", value: "3" },
    body: "CDNR has promoted three principals to partner effective April 1, the firm announced in its annual promotions. Two are in the firm's software investing team, reflecting CDNR's continued emphasis on vertical software. The firm also announced an Austin, Texas office to be led by newly promoted partner Reid McKinney.",
  },
  {
    id: "s010",
    firmId: "gemspring-capital",
    type: "Deal",
    headline: "Gem Spring invests in Beaumont Machining, carve-out from diversified manufacturer",
    dek: "First Fund IV platform deal; 62-year-old precision machining business serves aerospace and defense.",
    source: "Mergermarket",
    sourceTier: 1,
    timeAgo: "1d",
    impact: "high",
    tags: ["Buyout", "Carve-out", "Industrial"],
    metric: { label: "Deal type", value: "Carve-out" },
    body: "Gem Spring Capital has acquired Beaumont Machining, a 62-year-old precision machining business, in a carve-out from a publicly traded diversified manufacturer. Beaumont serves aerospace, defense and medical device end markets with revenue of approximately $280M.\n\nIndustry veteran Patricia Hearst is installed as executive chair; CEO Marcus Wilhelm remains in place. Sources put the transaction at roughly 8.5x EBITDA.",
  },
  {
    id: "s011",
    firmId: "gemspring-capital",
    type: "Leadership",
    headline: "Gem Spring adds Andrew Feld as Operating Partner, consumer focus",
    dek: "Former CEO of Harbor Brands joins as consumer-sector operating partner.",
    source: "LinkedIn",
    sourceTier: 3,
    timeAgo: "1d",
    impact: "low",
    tags: ["Operating partner", "Consumer"],
    metric: { label: "Hire", value: "Op. Partner" },
    body: "Gem Spring has added Andrew Feld, former CEO of portfolio company Harbor Brands, as a consumer-focused operating partner. Feld led Harbor through a 2022 exit to a strategic acquirer.",
  },
  {
    id: "s012",
    firmId: "apco-holdings",
    type: "Fund",
    headline: "APCO in market for continuation vehicle covering two portfolio assets",
    dek: "Firm working with Evercore; CV would extend hold on two consumer-finance assets.",
    source: "Secondaries Investor",
    sourceTier: 1,
    timeAgo: "1d",
    impact: "med",
    tags: ["Continuation fund", "Secondaries"],
    metric: { label: "Assets", value: "2" },
    body: "APCO Holdings is in market with a continuation vehicle that would extend the firm's hold on two consumer-finance portfolio assets. Evercore is advising on the transaction, targeted to close in Q3.",
  },
  {
    id: "s013",
    firmId: "platinum-equity",
    type: "Portfolio",
    headline: "Platinum's Ingram Micro reports Q1 revenue up 8% YoY",
    dek: "Distribution giant's first full quarter since refinancing; margin expansion of 60 bps.",
    source: "Company filing",
    sourceTier: 1,
    timeAgo: "1d",
    impact: "low",
    tags: ["Portfolio", "Earnings", "Distribution"],
    metric: { label: "Rev growth", value: "+8%" },
    body: "Ingram Micro, majority-owned by Platinum Equity, reported first-quarter revenue growth of 8% year over year, with adjusted EBITDA margin expanding approximately 60 basis points.",
  },
];
