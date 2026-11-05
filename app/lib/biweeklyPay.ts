// Data behind the /biweekly-pay pages: "$X a year is how much biweekly after taxes".
// Every figure comes from the payroll engine, so the pages and their images
// (scripts/generate-biweekly-pay-charts.ts) follow a tax-table update.
// Rerun the chart script after one: tests/biweekly-pay.test.ts fails on stale charts.

import { calculatePaycheck, federalWithholdingSchedule2026, type FilingStatus, type SupportedState } from "./payroll";
import { locations } from "./locations";
import { biweeklyPaydays2026, MONTH_NAMES } from "./blogPosts";
import salaryRaw from "../data/salary.json";
import hourlyRaw from "../data/hourly-rates.json";

/** IRS 2026 limits: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500 */
export const K401_LIMIT_2026 = 24500;
export const SAVERS_CREDIT_SINGLE_2026 = 40250;

export type BiweeklyPage = {
  slug: string;
  kind: "salary" | "hourly";
  annual: number;
  rate?: number;
  /** "$70,000 a Year" */
  label: string;
  /** "$70,000 a year" */
  lower: string;
  /** "$70k a year" */
  short: string;
  /** "$70,000" or "$22-an-Hour", for phrases such as "a $70,000 biweekly check". */
  adjective: string;
  parentHref: string;
  parentLabel: string;
};

const commas = (n: number) => n.toLocaleString("en-US");

const salaryPage = (amount: number): BiweeklyPage => ({
  slug: `${amount}-a-year`,
  kind: "salary",
  annual: amount,
  label: `$${commas(amount)} a Year`,
  lower: `$${commas(amount)} a year`,
  short: `$${Math.round(amount / 1000)}k a year`,
  adjective: `$${commas(amount)}`,
  parentHref: `/salary/${amount}-after-tax-calculator`,
  parentLabel: `$${commas(amount)} a year after tax in every state`,
});

const hourlyPage = (rate: number): BiweeklyPage => ({
  slug: `${rate}-an-hour`,
  kind: "hourly",
  annual: rate * 2080,
  rate,
  label: `$${rate} an Hour`,
  lower: `$${rate} an hour`,
  short: `$${rate} an hour`,
  adjective: `$${rate}-an-Hour`,
  parentHref: `/hourly/${rate}-paycheck-calculator`,
  parentLabel: `$${rate} an hour after tax in every state`,
});

export const BIWEEKLY_PAGES: BiweeklyPage[] = [
  ...[45000, 57000, 70000, 75000, 100000].map(salaryPage),
  ...[22, 23, 25, 35].map(hourlyPage),
];

export const biweeklyPageForSalary = (amount: number) => BIWEEKLY_PAGES.find(p => p.kind === "salary" && p.annual === amount);
export const biweeklyPageForRate = (rate: number) => BIWEEKLY_PAGES.find(p => p.rate === rate);

export const biweeklyPageBySlug = (slug: string) => BIWEEKLY_PAGES.find(p => p.slug === slug);

const SALARY_AMOUNTS = (salaryRaw as { amount: number }[]).map(s => s.amount);
const HOURLY_RATES = (hourlyRaw as { rate: number }[]).map(h => h.rate);

/** A page object for any amount with a /salary or /hourly page, so tables can price and link it. */
const pageFor = (kind: BiweeklyPage["kind"], amount: number) =>
  kind === "salary"
    ? biweeklyPageForSalary(amount) ?? salaryPage(amount)
    : biweeklyPageForRate(amount) ?? hourlyPage(amount);

/** Our biweekly page for an amount when there is one, otherwise its /salary or /hourly page. */
export const payHref = (page: BiweeklyPage) => (biweeklyPageBySlug(page.slug) ? `/biweekly-pay/${page.slug}` : page.parentHref);

/** The rows of the hub chart. Each one must have a /salary or /hourly page (tests/biweekly-pay.test.ts). */
export const HUB_SALARIES = [30000, 35000, 40000, 45000, 50000, 55000, 57000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 125000, 130000, 140000, 150000, 175000, 200000];
export const HUB_RATES = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 35, 38, 40, 45, 50];

export const hubChartRows = (kind: BiweeklyPage["kind"]) =>
  (kind === "salary" ? HUB_SALARIES : HUB_RATES).map(amount => {
    const page = pageFor(kind, amount);
    return { page, f: biweeklyFacts(page), href: payHref(page) };
  });

export const dollars = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const cents = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const percent = (rate: number) => `${Math.round(rate * 100)}%`;

function check(annual: number, state: string, status: FilingStatus = "single", extra: { retirementPercent?: number; preTaxPerPaycheck?: number } = {}) {
  const r = calculatePaycheck({ grossAnnual: annual, frequency: "biweekly", status, state: state as SupportedState, ...extra });
  const n = r.periods;
  return {
    gross: r.grossAnnual / n,
    federal: r.federal / n,
    socialSecurity: r.socialSecurity / n,
    medicare: r.medicare / n,
    state: (r.stateIncomeTax + r.statePayrollPremiums) / n,
    net: r.netAnnual / n,
    netAnnual: r.netAnnual,
  };
}

/** What is withheld overall, and from one more dollar of pay, in a state with no income tax. */
function taxRates(annual: number, status: FilingStatus, netPerCheck: number) {
  const { adjustment, rows } = federalWithholdingSchedule2026(status);
  const adjusted = annual - adjustment;
  const row = rows.find(r => adjusted < r.to) ?? rows[rows.length - 1];
  return { effective: 1 - netPerCheck / (annual / 26), nextDollar: row.rate + 0.0765 };
}

/** Where the single-filer withholding rate changes, as annual wages on a standard W-4. */
function withholdingPosition(annual: number) {
  const { adjustment, rows } = federalWithholdingSchedule2026("single");
  const lines = rows.map(r => ({ ...r, startsAt: r.from + adjustment }));
  const index = lines.filter(l => annual >= l.startsAt).length - 1;
  const current = lines[Math.max(0, index)];
  const previous = lines[Math.max(0, index - 1)];
  const next = lines[Math.min(lines.length - 1, index + 1)];
  const over = annual - current.startsAt;
  const under = next.startsAt - annual;
  const adjusted = annual - adjustment;
  const tentative = current.base + (adjusted - current.from) * current.rate;
  return {
    adjustment, adjusted, tentative, current, previous, next, over, under,
    /** "over" only when the page has barely crossed a line; otherwise the next line is the story. */
    nearerLine: over / annual < 0.12 ? ("over" as const) : ("under" as const),
  };
}

export function biweeklyFacts(page: BiweeklyPage) {
  const { annual } = page;
  const single = check(annual, "TX");

  const states = locations
    .map(loc => {
      const c = check(annual, loc.short);
      // Shown tax is the gap between the rounded checks, so the two columns add up on the page.
      return { name: loc.name, short: loc.short, slug: loc.slug, exact: c.net, net: Math.round(c.net), tax: Math.round(single.net) - Math.round(c.net), hasTax: c.state >= 0.005 };
    })
    .sort((a, b) => b.exact - a.exact);
  const lowest = states[states.length - 1];
  const typical = states[Math.floor(states.length / 2)];
  const noTaxGroup = states.filter(s => !s.hasTax);
  const lowestFive = states.slice(-5).reverse();

  const noTaxNet = Math.round(single.net);
  const twoCheck = noTaxNet * 2;
  const threeCheck = noTaxNet * 3;
  const avgMonth = Math.round(single.netAnnual / 12);
  const grossMonth = annual / 12;
  const rent = Math.round(grossMonth * 0.3);

  const position = withholdingPosition(annual);
  const k401 = [3, 5, 10].map(pct => {
    const withK = check(annual, "TX", "single", { retirementPercent: pct });
    const saved = (annual * pct) / 100 / 26;
    const netDrop = single.net - withK.net;
    return { pct, saved, netDrop, net: withK.net, taxSaved: Math.round(saved) - Math.round(netDrop) };
  });

  const married = check(annual, "TX", "married");
  const marriedSchedule = federalWithholdingSchedule2026("married");
  const marriedRow = marriedSchedule.rows.find(r => r.rate === 0.22);
  const marriedLine = (marriedRow?.from ?? 0) + marriedSchedule.adjustment;
  const saversGap = Math.max(0, annual - SAVERS_CREDIT_SINGLE_2026);
  const saversNet = check(annual, "TX", "single", { retirementPercent: (saversGap / annual) * 100 }).net;
  const netOf = (annualGross: number, state: string) => check(annualGross, state).net;
  const head = check(annual, "TX", "head");

  const realWorld = check(annual, "TX", "single", { retirementPercent: 5, preTaxPerPaycheck: 150 });

  const hours = page.rate
    ? [
        { paid: 64, hours: "64 hours", note: "two shifts short" },
        { paid: 72, hours: "72 hours", note: "one shift short" },
        { paid: 80, hours: "80 hours", note: "full schedule" },
        { paid: 92, hours: "88 hours", note: "8 overtime hours at time and a half" },
      ].map(row => {
        const gross = row.paid * (page.rate as number);
        return { ...row, gross, net: check(gross * 26, "TX").net };
      })
    : [];

  const cohortA = biweeklyPaydays2026(2);
  const cohortB = biweeklyPaydays2026(9);

  return {
    single,
    married,
    head,
    realWorld,
    states,
    lowest,
    typical,
    noTaxGroup,
    lowestFive,
    noTaxNet,
    gapToLowest: noTaxNet - lowest.net,
    twoCheck,
    threeCheck,
    avgMonth,
    monthGap: avgMonth - twoCheck,
    grossMonth,
    rent,
    rentShare: Math.round((rent / twoCheck) * 100),
    position,
    rates: { single: taxRates(annual, "single", single.net), married: taxRates(annual, "married", married.net), head: taxRates(annual, "head", head.net) },
    k401,
    hours,
    semiGross: annual / 24,
    semiNet: Math.round(single.netAnnual / 24),
    check27: annual / 27,
    raise1k: Math.round(check(annual + 1000, "TX").netAnnual - single.netAnnual),
    cohortA,
    cohortB,
    threeCheckA: cohortA.threeCheckMonths.map(m => MONTH_NAMES[m]),
    threeCheckB: cohortB.threeCheckMonths.map(m => MONTH_NAMES[m]),
    saversGap,
    saversDrop: single.net - saversNet,
    marriedLine,
    plusOne: page.rate
      ? {
          gross: 80,
          noTax: netOf((page.rate + 1) * 2080, "TX") - single.net,
          oregon: netOf((page.rate + 1) * 2080, "OR") - netOf(annual, "OR"),
        }
      : null,
  };
}

export type BiweeklyFacts = ReturnType<typeof biweeklyFacts>;

/** Take-home in each unit people search for: "$70k a year is how much a week after taxes". */
export function payPeriodRows(page: BiweeklyPage, f: BiweeklyFacts) {
  return [
    { label: "Year", perYear: 1 },
    { label: "Month (average)", perYear: 12 },
    { label: "Twice a month", perYear: 24 },
    { label: "Every two weeks", perYear: 26 },
    { label: "Week", perYear: 52 },
    { label: "Day (8 hours)", perYear: 260 },
    { label: "Hour", perYear: 2080 },
  ].map(row => ({ ...row, gross: page.annual / row.perYear, net: f.single.netAnnual / row.perYear }));
}

/** The two round amounts on either side of a page, all of which have a page to link to. */
export function nearbyPay(page: BiweeklyPage, f: BiweeklyFacts) {
  const amount = page.rate ?? page.annual;
  const pool = page.kind === "salary" ? SALARY_AMOUNTS.filter(a => a % 5000 === 0) : HOURLY_RATES;
  const amounts = [...pool.filter(a => a < amount).slice(-2), amount, ...pool.filter(a => a > amount).slice(0, 2)];
  return amounts.map(a => {
    const other = pageFor(page.kind, a);
    const net = Math.round(check(other.annual, "TX").net);
    return { page: other, href: payHref(other), current: a === amount, gross: other.annual / 26, net, diff: net - f.noTaxNet };
  });
}

/** Every location, best take-home first. Places that tie on the rounded check share a rank. */
export const rankedStates = (f: BiweeklyFacts) => f.states.map(s => ({ ...s, rank: 1 + f.states.filter(other => other.net > s.net).length }));

/** "New York City" reads as "NYC" where a snippet has to stay short. */
export const shortPlace = (name: string) => (name === "New York City" ? "NYC" : name);

/** BLS national median wage, May 2025 (app/data/occupations.json). */
export const MEDIAN_HOURLY = 24.51;
const CHILD_CREDIT_2026 = 2200;
const OT_DEDUCTION_CAP_SINGLE = 12500;

/** The raise needed in a location to match a target check, found by bisection on the engine. */
function matchLowestRaise(annual: number, state: string, target: number) {
  let low = annual;
  let high = annual * 2;
  for (let i = 0; i < 40; i += 1) {
    const middle = (low + high) / 2;
    if (check(middle, state).net < target) low = middle;
    else high = middle;
  }
  return Math.round((high - annual) / 100) * 100;
}

function tokenValues(page: BiweeklyPage, f: BiweeklyFacts): Record<string, string> {
  const k5 = f.k401[1];
  const netIn = (code: string) => f.states.find(row => row.short === code)?.net ?? 0;
  const rate = page.rate ?? 0;
  const shift = f.hours.length ? { gross: f.hours[2].gross - f.hours[1].gross, net: Math.round(f.hours[2].net) - Math.round(f.hours[1].net) } : null;
  return {
    label: page.label,
    lower: page.lower,
    short: page.short,
    annual: dollars(page.annual),
    gross: dollars(f.single.gross),
    noTax: dollars(f.noTaxNet),
    typical: dollars(f.typical.net),
    typicalName: f.typical.name,
    low: dollars(f.lowest.net),
    lowName: f.lowest.name,
    gap: dollars(f.gapToLowest),
    married: dollars(f.married.net),
    marriedPlus: dollars(f.married.net - f.single.net),
    head: dollars(f.head.net),
    headPlus: dollars(f.head.net - f.single.net),
    federal: dollars(f.single.federal),
    twoCheck: dollars(f.twoCheck),
    threeCheck: dollars(f.threeCheck),
    avgMonth: dollars(f.avgMonth),
    monthGap: dollars(f.monthGap),
    rent: dollars(f.rent),
    rentShare: `${f.rentShare}%`,
    rate: percent(f.position.current.rate),
    nextRate: percent(f.position.next.rate),
    line: dollars(f.position.current.startsAt),
    nextLine: dollars(f.position.next.startsAt),
    over: dollars(f.position.over),
    under: dollars(f.position.under),
    fica: dollars(f.single.socialSecurity + f.single.medicare),
    gapYear: dollars(f.gapToLowest * 26),
    keepPct: `${Math.round((f.noTaxNet / f.single.gross) * 100)}%`,
    toLineDrop: dollars(f.single.net - check(page.annual, "TX", "single", { retirementPercent: (f.position.over / page.annual) * 100 }).net),
    raiseToLineCheck: dollars(Math.round(check(f.position.next.startsAt, "TX").net) - f.noTaxNet),
    pretax100Drop: dollars(f.single.net - check(page.annual, "TX", "single", { preTaxPerPaycheck: 100 }).net),
    k100Drop: dollars(f.single.net - check(page.annual, "TX", "single", { retirementPercent: (100 / f.single.gross) * 100 }).net),
    maxKCheck: dollars(K401_LIMIT_2026 / 26),
    maxKPct: `${((K401_LIMIT_2026 / page.annual) * 100).toFixed(1)}%`,
    maxKDrop: dollars(f.single.net - check(page.annual, "TX", "single", { retirementPercent: (K401_LIMIT_2026 / page.annual) * 100 }).net),
    maxKNet: dollars(check(page.annual, "TX", "single", { retirementPercent: (K401_LIMIT_2026 / page.annual) * 100 }).net),
    childCheck: dollars(CHILD_CREDIT_2026 / 26),
    hohFederal: dollars(f.head.federal),
    hohFedLeft: dollars(Math.max(0, f.head.federal - CHILD_CREDIT_2026 / 26)),
    hohChildNet: dollars(f.head.net + Math.min(f.head.federal, CHILD_CREDIT_2026 / 26)),
    seCheck: dollars((page.annual * 0.9235 * 0.153) / 26),
    medianPlusGross: rate && rate < MEDIAN_HOURLY ? dollars((MEDIAN_HOURLY - rate) * 80) : "",
    medianPlusNet: rate && rate < MEDIAN_HOURLY ? dollars(check(MEDIAN_HOURLY * 2080, "TX").net - f.single.net) : "",
    medianGap: rate ? cents(Math.abs(MEDIAN_HOURLY - rate)) : "",
    otCapHours: rate ? commas(Math.round(OT_DEDUCTION_CAP_SINGLE / (rate * 0.5))) : "",
    k3Tax: dollars(f.k401[0].taxSaved),
    k10Tax: dollars(f.k401[2].taxSaved),
    k10Saved: dollars(f.k401[2].saved),
    noTaxList: f.noTaxGroup.map(row => row.name).join(", "),
    noTaxCount: `${f.noTaxGroup.length}`,
    threeA: f.threeCheckA.join(" and "),
    threeB: f.threeCheckB.join(" and "),
    semiGross: dollars(f.semiGross),
    semiNet: dollars(f.semiNet),
    semiTwo: dollars(f.semiNet * 2),
    check27: dollars(f.check27),
    marriedFederal: dollars(f.married.federal),
    rentShareShort: f.hours.length ? `${Math.round((f.rent / (Math.round(f.hours[1].net) * 2)) * 100)}%` : "",
    twoOt: f.hours.length ? dollars(Math.round(f.hours[3].net) * 2) : "",
    matchRaise: dollars(matchLowestRaise(page.annual, f.lowest.short, f.noTaxNet)),
    k5Saved: dollars(k5.saved),
    k5Drop: dollars(k5.netDrop),
    k5Net: dollars(k5.net),
    k5Tax: dollars(k5.taxSaved),
    k10ExtraTax: dollars(f.k401[2].taxSaved - k5.taxSaved),
    marriedLine: dollars(f.marriedLine),
    marriedRoom: dollars(f.marriedLine - page.annual),
    nycLocal: dollars(netIn("NY") - netIn("NYC")),
    orVsNyc: dollars(Math.abs(netIn("OR") - netIn("NYC"))),
    caVsLow: dollars(netIn("CA") - f.lowest.net),
    grossMonth: dollars(f.grossMonth),
    salaryVsTwo: dollars(f.grossMonth - f.twoCheck),
    raise1kCheck: dollars(f.raise1k / 26),
    saversDrop: dollars(f.saversDrop),
    toLinePct: `${((f.position.over / page.annual) * 100).toFixed(1).replace(/\.0$/, "")}%`,
    toLineCheck: dollars(f.position.over / 26),
    raise1k: dollars(f.raise1k),
    saversLimit: dollars(SAVERS_CREDIT_SINGLE_2026),
    saversGap: dollars(f.saversGap),
    saversGapCheck: dollars(f.saversGap / 26),
    saversGapPct: `${((f.saversGap / page.annual) * 100).toFixed(1)}%`,
    k401Limit: dollars(K401_LIMIT_2026),
    shiftGross: shift ? dollars(shift.gross) : "",
    shiftNet: shift ? dollars(shift.net) : "",
    otGross: f.hours.length ? dollars(f.hours[3].gross) : "",
    otNet: f.hours.length ? dollars(f.hours[3].net) : "",
    otPlus: f.hours.length ? dollars(Math.round(f.hours[3].net) - Math.round(f.hours[2].net)) : "",
    otRaw: f.hours.length ? dollars(f.hours[3].gross - f.hours[2].gross) : "",
    otKeep: f.hours.length ? `${Math.round(((f.hours[3].net - f.hours[2].net) / (f.hours[3].gross - f.hours[2].gross)) * 100)}%` : "",
    otRate: rate ? cents(rate * 1.5) : "",
    otPremium: rate ? cents(rate * 0.5) : "",
    otHoursToLine: rate ? `${Math.floor((f.position.next.startsAt / 26 / rate - 80) / 1.5)}` : "",
    twoShortMonth: f.hours.length ? dollars(Math.round(f.hours[1].net) * 2) : "",
    plusOneNet: f.plusOne ? dollars(f.plusOne.noTax) : "",
    plusOneOregon: f.plusOne ? dollars(f.plusOne.oregon) : "",
    plusOneYear: f.plusOne ? dollars(f.plusOne.noTax * 26) : "",
  };
}

/**
 * Fills {{token}} and {{net:XX}} placeholders in hand-written copy, so the prose
 * cannot drift from the engine. An unknown token throws and fails the build.
 */
export function fillTokens(text: string, page: BiweeklyPage, facts: BiweeklyFacts): string {
  const values = tokenValues(page, facts);
  const netOf = (annual: number, state = "TX") => Math.round(check(annual, state).net);
  return text.replace(/\{\{([A-Za-z0-9:]+)\}\}/g, (_, token: string) => {
    const [kind, first, second] = token.split(":");
    if (first !== undefined) {
      const amount = Number(second ?? first);
      const hourly = page.rate ?? 0;
      switch (kind) {
        case "net":
          return dollars(netOf(page.annual, first));
        case "tax":
          return dollars(netOf(page.annual, "TX") - netOf(page.annual, first));
        case "two":
          return dollars(netOf(page.annual, first) * 2);
        case "month":
          return dollars(check(page.annual, first).netAnnual / 12);
        case "tx":
          return dollars(netOf(amount));
        case "txDiff":
          return dollars(Math.abs(netOf(amount) - netOf(page.annual)));
        case "txMinusLow":
          return dollars(netOf(amount) - facts.lowest.net);
        case "keepFrom":
          return `${Math.round((Math.abs(netOf(amount) - netOf(page.annual)) / (Math.abs(amount - page.annual) / 26)) * 100)}%`;
        case "stateDiff":
          return dollars(Math.abs(netOf(page.annual, first) - netOf(amount, first)));
        case "taxAt":
          return dollars(netOf(amount) - netOf(amount, first));
        case "hours":
          return dollars(netOf(amount * hourly * 26));
        case "hoursGross":
          return dollars(amount * hourly);
        case "hoursDrop":
          return dollars(Math.abs(netOf(page.annual) - netOf(amount * hourly * 26)));
        case "hoursAnnual":
          return dollars(amount * hourly * 26);
        case "twoHours":
          return dollars(netOf(amount * hourly * 26) * 2);
        case "threeHours":
          return dollars(netOf(amount * hourly * 26) * 3);
        default:
          throw new Error(`Unknown token ${token} on ${page.slug}`);
      }
    }
    const value = values[token];
    if (value === undefined || value === "") throw new Error(`Unknown token ${token} on ${page.slug}`);
    return value;
  });
}

export const biweeklyTitle = (page: BiweeklyPage, f: BiweeklyFacts) =>
  `${page.label} Is How Much Biweekly? ${dollars(f.lowest.net)}–${dollars(f.noTaxNet)} After Tax`;

export const biweeklyDescription = (page: BiweeklyPage, f: BiweeklyFacts, hook: string) =>
  `Same ${page.short}, different check: ${dollars(f.noTaxNet)} in Texas, ${dollars(f.lowest.net)} in ${shortPlace(f.lowest.name)}. ${fillTokens(hook, page, f)}`;

/** Biweekly Fridays in a year, from a schedule that started on the given January 2026 Friday. */
export function fridaySchedule(firstJanuary2026: 2 | 9, year: number) {
  const perMonth = Array.from({ length: 12 }, () => 0);
  const dates: string[] = [];
  for (let d = Date.UTC(2026, 0, firstJanuary2026); new Date(d).getUTCFullYear() <= year; d += 14 * 86400000) {
    if (new Date(d).getUTCFullYear() === year) {
      perMonth[new Date(d).getUTCMonth()] += 1;
      dates.push(new Date(d).toISOString().slice(0, 10));
    }
  }
  return { total: dates.length, dates, perMonth, threeCheckMonths: perMonth.flatMap((c, m) => (c === 3 ? [MONTH_NAMES[m]] : [])) };
}

/**
 * Fridays in these two years when Federal Reserve Banks are closed, so direct deposit cannot settle.
 * https://www.federalreserve.gov/aboutthefed/k8.htm
 * July 3, 2026, June 18, December 24 and December 31, 2027 are not here: for a Saturday holiday the Banks open on the Friday before.
 */
export const BANK_HOLIDAY_FRIDAYS = ["2026-06-19", "2026-12-25", "2027-01-01"];

/** Per-check take-home on one annual gross across pay schedules, for the hub comparison. */
export function scheduleComparison(annual: number) {
  return (["weekly", "biweekly", "semimonthly", "monthly"] as const).map(frequency => {
    const r = calculatePaycheck({ grossAnnual: annual, frequency, status: "single", state: "TX" });
    return { frequency, checks: r.periods, gross: annual / r.periods, net: r.netAnnual / r.periods };
  });
}

export const BIWEEKLY_HUB_IMAGE = "/images/biweekly-pay/biweekly-pay-chart-2026.png";
export const BIWEEKLY_DATES_IMAGE = "/images/biweekly-pay/biweekly-pay-dates-2026-2027.png";

export const biweeklyImages = (slug: string) => ({
  cover: `/images/biweekly-pay/${slug}-biweekly-after-taxes.png`,
  split: `/images/biweekly-pay/${slug}-where-the-check-goes.svg`,
  states: `/images/biweekly-pay/${slug}-state-tax-per-check.svg`,
  calendar: `/images/biweekly-pay/${slug}-2026-paydays.svg`,
});
