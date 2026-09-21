import type { StateData, SalaryData, HourlyData, InternalLink } from "./types";
import statesRaw from "../../data/states.json";
import salaryRaw from "../../data/salary.json";
import hourlyRaw from "../../data/hourly-rates.json";

const states = statesRaw as StateData[];
const salaries = salaryRaw as SalaryData[];
const hourlyRates = hourlyRaw as HourlyData[];

// Priority states for cross-linking (high search volume)
const PRIORITY_ABBRS = ["TX", "CA", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "NJ", "WA", "VA", "MA", "AZ", "CO"];

export function statePageLinks(current: StateData): InternalLink[] {
  const links: InternalLink[] = [];

  // 3 related states (same region first, then priority)
  const sameRegion = states
    .filter(s => s.abbr !== current.abbr && s.region === current.region && !s.isCity)
    .slice(0, 2);
  const priority = states
    .filter(s => s.abbr !== current.abbr && !sameRegion.includes(s) && PRIORITY_ABBRS.includes(s.abbr) && !s.isCity)
    .slice(0, 2);
  [...sameRegion, ...priority].slice(0, 4).forEach(s => {
    links.push({ href: `/states/${s.slug}`, title: `${s.name} Paycheck Calculator`, description: `Estimate take-home pay in ${s.name} →` });
  });

  // Salary links (3 common benchmarks)
  [50000, 75000, 100000].forEach(amt => {
    const s = salaries.find(x => x.amount === amt);
    if (s) links.push({ href: `/salary/${s.slug}`, title: `${s.label} a Year Is How Much an Hour?`, description: `Hourly rate and take-home pay on ${s.label} a year →` });
  });

  // Hourly link (median rate)
  const h = hourlyRates.find(x => x.rate === 25);
  if (h) links.push({ href: `/hourly/${h.slug}`, title: `$25 an Hour Is How Much a Year?`, description: `See annual and after-tax pay at $25/hr →` });

  // Frequency pages
  links.push({ href: "/biweekly-paycheck-calculator", title: "Biweekly Paycheck Calculator", description: "Estimate your biweekly take-home →" });

  return links;
}

export function salaryPageLinks(current: SalaryData): InternalLink[] {
  const links: InternalLink[] = [];
  const hourly = (current.amount / 2080).toFixed(2);

  // Neighboring salaries (±1 step)
  const idx = salaries.findIndex(s => s.slug === current.slug);
  if (idx > 0) {
    const lo = salaries[idx - 1];
    links.push({ href: `/salary/${lo.slug}`, title: `${lo.label} a Year Is How Much an Hour?`, description: `One step down: ${lo.label} → hourly and after-tax pay →` });
  }
  if (idx < salaries.length - 1) {
    const hi = salaries[idx + 1];
    links.push({ href: `/salary/${hi.slug}`, title: `${hi.label} a Year Is How Much an Hour?`, description: `One step up: ${hi.label} → hourly and after-tax pay →` });
  }

  // Hourly equivalent
  const h = hourlyRates.find(x => x.rate === current.hourlyEquivalent) ?? hourlyRates.reduce((prev, curr) => Math.abs(curr.rate - current.hourlyEquivalent) < Math.abs(prev.rate - current.hourlyEquivalent) ? curr : prev);
  links.push({ href: `/hourly/${h.slug}`, title: `$${h.rate} an Hour Is How Much a Year?`, description: `${current.label} a year ≈ $${hourly} an hour — see the hourly view →` });

  // Hub + interactive calculator
  links.push({ href: "/salary", title: "All Salaries: $25,000 to $300,000 a Year", description: "Browse every salary-to-hourly page →" });
  links.push({ href: "/hourly-paycheck-calculator", title: "Hourly Paycheck Calculator", description: "Enter any rate, hours and overtime →" });

  // Top state pages (canonical root URLs)
  ["TX", "CA", "FL", "NY", "WA"].forEach(abbr => {
    const s = states.find(x => x.abbr === abbr);
    if (s) links.push({ href: `/${s.slug}`, title: `${s.name} Paycheck Calculator`, description: `${current.label} a year in ${s.name} after state tax →` });
  });

  // Frequency pages
  links.push({ href: "/biweekly-paycheck-calculator", title: "Biweekly Paycheck Calculator", description: `Your biweekly paycheck on ${current.label} a year →` });
  links.push({ href: "/monthly-paycheck-calculator", title: "Monthly Paycheck Calculator", description: `Your monthly paycheck on ${current.label} a year →` });

  return links;
}

export function hourlyPageLinks(current: HourlyData): InternalLink[] {
  const links: InternalLink[] = [];
  const dollar = (h: HourlyData) => `$${h.rate}`;

  // Neighboring hourly rates (±1 step)
  const idx = hourlyRates.findIndex(h => h.slug === current.slug);
  if (idx > 0) {
    const lo = hourlyRates[idx - 1];
    links.push({ href: `/hourly/${lo.slug}`, title: `${dollar(lo)} an Hour Is How Much a Year?`, description: `One step down: ${lo.label} → see annual and after-tax pay →` });
  }
  if (idx < hourlyRates.length - 1) {
    const hi = hourlyRates[idx + 1];
    links.push({ href: `/hourly/${hi.slug}`, title: `${dollar(hi)} an Hour Is How Much a Year?`, description: `One step up: ${hi.label} → see annual and after-tax pay →` });
  }

  // Nearest salary equivalent
  const targetAnnual = current.annualAt40h;
  const nearestSalary = salaries.reduce((prev, curr) => Math.abs(curr.amount - targetAnnual) < Math.abs(prev.amount - targetAnnual) ? curr : prev);
  links.push({ href: `/salary/${nearestSalary.slug}`, title: `${nearestSalary.label} a Year Is How Much an Hour?`, description: `${dollar(current)} an hour ≈ ${nearestSalary.label} a year — see the salary view →` });

  // Hub + interactive hourly calculator
  links.push({ href: "/hourly-paycheck-calculator", title: "All Hourly Rates: $10 to $150 an Hour", description: "Browse every hourly wage to yearly salary page →" });
  links.push({ href: "/hourly-paycheck-calculator", title: "Hourly Paycheck Calculator", description: "Enter any rate, hours and overtime →" });

  // Top state pages (canonical root URLs)
  ["TX", "CA", "FL", "NY", "WA"].forEach(abbr => {
    const s = states.find(x => x.abbr === abbr);
    if (s) links.push({ href: `/${s.slug}`, title: `${s.name} Paycheck Calculator`, description: `${dollar(current)} an hour in ${s.name} after state tax →` });
  });

  // Frequency pages
  links.push({ href: "/biweekly-paycheck-calculator", title: "Biweekly Paycheck Calculator", description: `Your biweekly paycheck at ${dollar(current)} an hour →` });
  links.push({ href: "/weekly-paycheck-calculator", title: "Weekly Paycheck Calculator", description: `Your weekly paycheck at ${dollar(current)} an hour →` });

  return links;
}
