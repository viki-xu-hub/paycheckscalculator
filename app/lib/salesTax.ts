import salesTaxRaw from "../data/sales-tax.json";
import ohioRaw from "../data/ohio-sales-tax.json";

export type RateRow = { name: string; rate: number };
export type RateComponent = { label: string; rate: number };

export type SalesTaxLocation = {
  slug: string;
  name: string;
  short: string;
  kind: "city" | "county";
  state: string;
  stateAbbr: string;
  rate: number;
  stateBase: number;
  district: number;
  county: string;
  countyRate: number | null;
  effective: string;
  lead: string;
  notes: string[];
  nearby: RateRow[];
  cities?: RateRow[];
  components?: RateComponent[];
  src: { agency: string; agencyShort: string; agencyUrl: string; table: string };
};

export type OhioSalesTax = {
  state: string;
  stateBase: number;
  effective: string;
  agency: string;
  agencyShort: string;
  agencyUrl: string;
  table: string;
  counties: RateRow[];
  transitAreas: RateRow[];
};

export const salesTaxLocations = (salesTaxRaw as { locations: SalesTaxLocation[] }).locations;
export const salesTaxBySlug: Record<string, SalesTaxLocation> =
  Object.fromEntries(salesTaxLocations.map(l => [l.slug, l]));
export const ohioSalesTax = ohioRaw as OhioSalesTax;

/** Percentages are stored as whole numbers (7.75 means 7.75%). */
export const pct = (rate: number) => `${rate.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}%`;

/** Tax on a pre-tax amount, rounded to the cent the way a register totals a single line. */
export function taxOn(amount: number, rate: number) {
  return Math.round(amount * rate) / 100;
}

/** Back out the pre-tax amount from a tax-inclusive total. */
export function preTaxFrom(total: number, rate: number) {
  return Math.round((total / (1 + rate / 100)) * 100) / 100;
}

/** State paycheck calculator for each state we publish sales tax pages in. */
export const statePaycheckPage: Record<string, { href: string; name: string }> = {
  CA: { href: "/california-paycheck-calculator", name: "California" },
  TX: { href: "/texas-paycheck-calculator", name: "Texas" },
  OH: { href: "/ohio-paycheck-calculator", name: "Ohio" },
};

/** The published page for a city name in a state, if we have one (used to link rate tables). */
export function salesTaxPageFor(name: string, stateAbbr: string) {
  return salesTaxLocations.find(l => l.kind === "city" && l.stateAbbr === stateAbbr && l.name === name);
}

/** The county page a city belongs to, if we publish one. */
export function countyPageFor(p: SalesTaxLocation) {
  if (p.kind !== "city") return undefined;
  return salesTaxLocations.find(l => l.kind === "county" && l.stateAbbr === p.stateAbbr && l.county === p.county);
}

/**
 * Sibling pages ranked by geography: same county first, then same state, then the rest.
 * Within each group the order rotates from this page's position in the data, so every
 * page still receives sibling links instead of the first few in the list taking them all.
 * The county parent is left out because the page links it separately.
 */
export function relatedSalesTaxLocations(p: SalesTaxLocation, count = 5) {
  const parent = countyPageFor(p);
  const n = salesTaxLocations.length;
  const start = salesTaxLocations.findIndex(l => l.slug === p.slug);
  const rank = (l: SalesTaxLocation) =>
    l.stateAbbr === p.stateAbbr && l.county === p.county ? 0 : l.stateAbbr === p.stateAbbr ? 1 : 2;
  return salesTaxLocations
    .map((l, i) => ({ l, i: (i - start + n) % n }))
    .filter(({ l }) => l.slug !== p.slug && l.slug !== parent?.slug)
    .sort((a, b) => rank(a.l) - rank(b.l) || a.i - b.i)
    .slice(0, count)
    .map(({ l }) => l);
}

export const SALES_TAX_ORIGIN = "https://www.paycheckscalculator.org";
export const salesTaxUrl = (slug: string) => `${SALES_TAX_ORIGIN}/sales-tax/${slug}`;

export const ohioRateSummary = () => {
  const rates = ohioSalesTax.counties.map(c => c.rate);
  const counts = new Map<number, number>();
  rates.forEach(r => counts.set(r, (counts.get(r) ?? 0) + 1));
  const [mostCommon, mostCommonCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    min: Math.min(...rates),
    max: Math.max(...rates),
    mostCommon,
    mostCommonCount,
    countyCount: ohioSalesTax.counties.length,
  };
};
