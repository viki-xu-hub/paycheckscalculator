// Blog post registry plus every worked-example figure the posts quote.
// Figures come from the same payroll engine as the calculators, so the posts
// and charts (scripts/generate-blog-charts.ts) stay in sync after a tax-table update.

import { calculatePaycheck, type FilingStatus, type SupportedState } from "./payroll";

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keyword: string;
  published: string;
  updated: string;
  readMinutes: number;
  hero: string;
  heroAlt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-calculate-gross-monthly-income-from-biweekly-paycheck",
    title: "How to Calculate Gross Monthly Income From Biweekly Paychecks",
    metaTitle: "How to Calculate Gross Monthly Income From Biweekly Paycheck",
    description:
      "How to calculate gross monthly income from biweekly paychecks: multiply one gross check by 26, divide by 12. Worked examples and 2026 three-paycheck months.",
    keyword: "how to calculate gross monthly income from biweekly paycheck",
    published: "2026-10-31",
    updated: "2026-10-31",
    readMinutes: 9,
    hero: "/images/blog/biweekly-paychecks-per-month-2026.svg",
    heroAlt: "How to calculate gross monthly income from biweekly paycheck schedules: bar chart of 2026 biweekly paydays per month: January and July get three paychecks, every other month gets two",
  },
  {
    slug: "how-to-calculate-taxes-on-paycheck-in-texas",
    title: "How to Calculate Taxes on Paycheck in Texas: 2026 Step-by-Step Guide",
    metaTitle: "How to Calculate Taxes on Paycheck in Texas — 2026 Guide",
    description:
      "How to calculate taxes on paycheck in Texas: federal withholding via IRS Pub 15-T, 6.2% Social Security, 1.45% Medicare and a full $60,000 worked example.",
    keyword: "how to calculate taxes on paycheck in texas",
    published: "2026-10-31",
    updated: "2026-10-31",
    readMinutes: 11,
    hero: "/images/blog/texas-paycheck-tax-breakdown.svg",
    heroAlt: "How to calculate taxes on paycheck in Texas: stacked bars showing a biweekly paycheck split into take-home pay, federal withholding, Social Security and Medicare at four salaries",
  },
  {
    slug: "how-to-calculate-401k-from-paycheck",
    title: "How to Calculate 401k From Paycheck: Contributions, Take-Home Cost and 2026 Limits",
    metaTitle: "How to Calculate 401k From Paycheck: 2026 Formula + Examples",
    description:
      "How to calculate 401k from paycheck: gross pay × contribution %, the real take-home cost after the tax break, 2026 IRS limits, match and Roth vs traditional.",
    keyword: "how to calculate 401k from paycheck",
    published: "2026-10-31",
    updated: "2026-10-31",
    readMinutes: 10,
    hero: "/images/blog/401k-take-home-cost.svg",
    heroAlt: "How to calculate 401k from paycheck: paired bars comparing each contribution rate with the smaller drop in take-home pay on a $65,000 Texas salary",
  },
];

export const blogPostBySlug = Object.fromEntries(BLOG_POSTS.map(post => [post.slug, post])) as Record<string, BlogPost>;

const round2 = (n: number) => Math.round(n * 100) / 100;

function perCheck(input: { grossAnnual: number; status?: FilingStatus; state?: SupportedState; retirementPercent?: number; preTaxPerPaycheck?: number }) {
  const p = calculatePaycheck({
    grossAnnual: input.grossAnnual,
    frequency: "biweekly",
    status: input.status ?? "single",
    state: input.state ?? "TX",
    retirementPercent: input.retirementPercent,
    preTaxPerPaycheck: input.preTaxPerPaycheck,
  });
  const n = p.periods;
  return {
    gross: round2(p.grossAnnual / n),
    retirement: round2(p.retirementAnnual / n),
    preTax: round2(p.preTaxAnnual / n),
    federal: round2(p.federal / n),
    socialSecurity: round2(p.socialSecurity / n),
    medicare: round2(p.medicare / n),
    state: round2((p.stateIncomeTax + p.statePayrollPremiums) / n),
    net: round2(p.netAnnual / n),
  };
}

/* ---------------------------------------------------- Biweekly → monthly */

export const BIWEEKLY_FACTOR = 26 / 12;

/** 2026 Friday paydays for the two biweekly cohorts (first payday Jan 2 or Jan 9). */
export function biweeklyPaydays2026(firstDay: 2 | 9) {
  const days: Date[] = [];
  for (let d = new Date(Date.UTC(2026, 0, firstDay)); d.getUTCFullYear() === 2026; d = new Date(d.getTime() + 14 * 86400000)) days.push(d);
  const perMonth = Array.from({ length: 12 }, (_, m) => days.filter(d => d.getUTCMonth() === m).length);
  return { days, perMonth, threeCheckMonths: perMonth.flatMap((c, m) => (c === 3 ? [m] : [])) };
}

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* --------------------------------------------------------- Texas taxes */

export const TEXAS_SALARIES = [40000, 60000, 75000, 100000];
export const texasBreakdown = TEXAS_SALARIES.map(salary => ({ salary, ...perCheck({ grossAnnual: salary }) }));
export const californiaBreakdown = TEXAS_SALARIES.map(salary => ({ salary, ...perCheck({ grossAnnual: salary, state: "CA" }) }));

/** The $60,000 single-filer walkthrough, step by step, matching IRS Pub 15-T Worksheet 1A. */
export const texasExample = (() => {
  const salary = 60000;
  const check = perCheck({ grossAnnual: salary });
  const standardAdjustment = 8600; // Pub 15-T Worksheet 1A, line 1g (single, Step 2 unchecked)
  const adjustedAnnual = salary - standardAdjustment;
  const bracketFloor = 19900;
  const bracketBase = 1240;
  const bracketRate = 0.12;
  const annualTax = bracketBase + bracketRate * (adjustedAnnual - bracketFloor);
  const married = perCheck({ grossAnnual: salary, status: "married" });
  const withHealth = perCheck({ grossAnnual: salary, preTaxPerPaycheck: 100 });
  return { salary, check, standardAdjustment, adjustedAnnual, bracketFloor, bracketBase, bracketRate, annualTax, married, withHealth };
})();

/* --------------------------------------------------------------- 401(k) */

export const K401_LIMITS_2026 = {
  deferral: 24500,
  catchUp50: 8000,
  catchUp60to63: 11250,
  annualAdditions: 72000,
  rothCatchUpWageThreshold: 150000,
};

export const K401_SALARY = 65000;
export const K401_RATES = [0, 3, 6, 10, 15];
export const k401Rows = (() => {
  const base = perCheck({ grossAnnual: K401_SALARY });
  return K401_RATES.map(rate => {
    const row = perCheck({ grossAnnual: K401_SALARY, retirementPercent: rate });
    return { rate, contribution: row.retirement, federal: row.federal, net: row.net, takeHomeDrop: round2(base.net - row.net), taxSaved: round2(base.federal - row.federal) };
  });
})();

export const k401Roth = (() => {
  const rate = 6;
  const traditional = perCheck({ grossAnnual: K401_SALARY, retirementPercent: rate });
  const none = perCheck({ grossAnnual: K401_SALARY });
  const contribution = traditional.retirement;
  // Roth deferrals come out after tax: same withholding as no contribution, then the full deferral.
  const rothNet = round2(none.net - contribution);
  return { rate, contribution, traditional, none, rothNet };
})();
