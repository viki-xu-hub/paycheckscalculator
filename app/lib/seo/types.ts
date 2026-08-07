export interface StateData {
  name: string;
  slug: string;
  abbr: string;
  hasStateTax: boolean;
  taxRate: number;
  taxType: string;
  taxNotes: string;
  taxAgency: string;
  region: "northeast" | "south" | "midwest" | "west" | "other";
  isCity?: boolean;
}

export interface SalaryData {
  amount: number;
  slug: string;
  label: string;
  hourlyEquivalent: number;
}

export interface HourlyData {
  rate: number;
  slug: string;
  label: string;
  annualAt40h: number;
  annualAt35h: number;
}

export interface FrequencyData {
  name: string;
  slug: string;
  shortLabel: string;
  periods: number;
  description: string;
  longDescription: string;
  examples: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface InternalLink {
  href: string;
  title: string;
  description: string;
}

export interface PageMeta {
  title: string;
  description: string;
  h1: string;
  canonical: string;
}
