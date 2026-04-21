// TypeScript interfaces for Overture PE Client Intelligence Platform

export interface FirmProfile {
  // From JSON files
  slug: string;
  name: string;
  description: string;
  hq: { city: string; state: string };
  website: string;
  aum: string;
  fundCount: number;
  tier: number;
  dateAdded: string;
  investmentStrategy: string[];
  focusAreas: string[];
  geographicFocus: string[];
  keyPersonnel: { name: string; title: string; office: string }[];
  portfolioCompanies: { name: string; industry: string; status: string }[];
}

// Flat firm format used by UI components (matches prototype data.js)
export interface FlatFirm {
  id: string;
  slug: string;
  name: string;
  short: string;
  hq: string;
  aum: string;
  aumNum: number;
  founded: number;
  employees: number;
  activeFunds: string;
  strategy: string;
  focus: string;
  sectors: string[];
  watched: boolean;
  unread: number;
  relationship: string;
  keyPeople: string[];
  recentFunds: { name: string; vintage: number; size: string }[];
  notablePortfolio: string[];
  description?: string;
  website?: string;
  tier?: number;
  geographicFocus?: string[];
  portfolioCompanies?: { name: string; industry: string; status: string }[];
}

export interface Story {
  id: string;
  firmId: string;
  type: "Deal" | "Fund" | "Leadership" | "Portfolio";
  headline: string;
  dek: string;
  source: string;
  sourceTier: number;
  timeAgo: string;
  impact: "high" | "med" | "low";
  tags: string[];
  metric: { label: string; value: string };
  body: string;
}

export interface MarketPulse {
  dealCount24h: number;
  dealCount24hDelta: string;
  fundCloseCount: number;
  fundCloseCountDelta: string;
  seniorHires: number;
  seniorHiresDelta: string;
  aggregateDealValue: string;
  aggregateDealValueDelta: string;
}

export type ViewType = "briefing" | "repo" | "saved" | "firm";
export type ViewMode = "comfortable" | "compact";
export type RelationshipType = "Active" | "Dormant" | "Prospect" | "Cold";
