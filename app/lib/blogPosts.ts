// Blog post registry plus every worked-example figure the posts quote.
// Figures come from the same payroll engine as the calculators, so the posts
// and charts (scripts/generate-blog-charts.ts) stay in sync after a tax-table update.

import { calculatePaycheck, type FilingStatus, type PayFrequency, type SupportedState } from "./payroll";
import { ordinaryTax, statusByKey } from "./qualifiedDividends";

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
  /** Live but kept out of search: robots noindex, left out of the sitemap and IndexNow. */
  noindex?: boolean;
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
  {
    slug: "semimonthly-vs-biweekly",
    title: "Semimonthly vs Biweekly Pay: What Changes on Your Paycheck",
    metaTitle: "Semimonthly vs Biweekly Pay: 24 vs 26 Paychecks Explained (2026)",
    description:
      "Semimonthly vs biweekly: 24 paychecks vs 26, how each check size, overtime, budgeting and 2026 three-paycheck months differ, with take-home examples.",
    keyword: "semimonthly vs biweekly",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 8,
    hero: "/images/blog/semimonthly-vs-biweekly-paycheck.svg",
    heroAlt: "Semimonthly vs biweekly paychecks on a $60,000 salary: 24 semimonthly checks of $2,500 gross versus 26 biweekly checks of $2,307.69 gross, same annual pay",
  },
  {
    slug: "how-many-pay-periods-in-a-year",
    title: "How Many Pay Periods in a Year? Weekly, Biweekly, Semimonthly and Monthly",
    metaTitle: "How Many Pay Periods in a Year? 52, 26, 24 or 12 (2026 Guide)",
    description:
      "How many pay periods in a year: 52 weekly, 26 biweekly, 24 semimonthly, 12 monthly. What a pay period is, 27-paycheck years, and per-check pay by schedule.",
    keyword: "how many pay periods in a year",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 8,
    hero: "/images/blog/pay-periods-per-year.svg",
    heroAlt: "How many pay periods in a year by schedule: 52 weekly, 26 biweekly, 24 semimonthly and 12 monthly, with the gross check size on a $60,000 salary",
  },
  {
    slug: "what-is-taxable-income",
    title: "What Is Taxable Income? How to Calculate It for 2026",
    metaTitle: "What Is Taxable Income? Definition, Formula and 2026 Examples",
    description:
      "What is taxable income: gross income minus adjustments and the standard or itemized deduction. 2026 standard deductions, what is excluded, and worked examples.",
    keyword: "what is taxable income",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 9,
    hero: "/images/blog/taxable-income-waterfall.svg",
    heroAlt: "What is taxable income: a $60,000 salary falls to $39,500 of taxable income after 401(k) and pre-tax health deductions, savings interest and the $16,100 2026 standard deduction",
  },
  {
    slug: "what-is-a-1099-form",
    title: "What Is a 1099 Form? Types, 2026 Thresholds and How 1099 Income Is Taxed",
    metaTitle: "What Is a 1099 Form? Types, $2,000 Threshold and Taxes (2026)",
    description:
      "What is a 1099 form: the IRS information return for non-wage income. 1099-NEC, MISC, K, INT and DIV explained, the new $2,000 threshold, deadlines and taxes.",
    keyword: "what is a 1099 form",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 10,
    hero: "/images/blog/1099-vs-w2-payroll-tax.svg",
    heroAlt: "What is a 1099 form worth in tax terms: self-employment tax on 1099 income compared with the employee share of FICA on the same W-2 wages at three income levels",
  },
  {
    slug: "how-to-calculate-annual-income",
    title: "How to Calculate Annual Income From Hourly, Salary, Pay Stub or 1099 Pay",
    metaTitle: "How to Calculate Annual Income: Formulas for Every Pay Type",
    description:
      "How to calculate annual income from an hourly rate, part-time or overtime hours, a partial-year salary, a pay stub, several jobs or 1099 work, with formulas.",
    keyword: "how to calculate annual income",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 9,
    hero: "/images/blog/annual-income-by-hours.svg",
    heroAlt: "How to calculate annual income from an hourly wage: annual gross at $20, $25 and $30 an hour for 20, 30, 40 and 45 hours a week, with overtime",
  },
  {
    slug: "what-is-fica-tax",
    noindex: true,
    title: "What Is FICA Tax? Social Security and Medicare Tax on Your Paycheck",
    metaTitle: "What Is FICA Tax? 7.65% Rate, Medicare Tax and 2026 Limits",
    description:
      "What is FICA tax: 6.2% Social Security up to $184,500 plus 1.45% Medicare, and 0.9% Additional Medicare over $200,000. 2026 amounts by salary and refunds.",
    keyword: "what is fica tax",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 9,
    hero: "/images/blog/fica-tax-by-salary.svg",
    heroAlt: "What is FICA tax at different salaries in 2026: Social Security and Medicare withheld on $40,000, $75,000, $150,000, $200,000 and $300,000 of wages",
  },
  {
    slug: "how-to-calculate-overtime-pay",
    noindex: true,
    title: "How to Calculate Overtime Pay: Time and a Half, Regular Rate and Daily Overtime",
    metaTitle: "How to Calculate Overtime Pay: Formula, Bonus Rule and Examples",
    description:
      "How to calculate overtime pay: regular rate × 1.5 × hours over 40. Worked examples, how bonuses change the regular rate, California daily overtime and tax.",
    keyword: "how to calculate overtime pay",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 9,
    hero: "/images/blog/overtime-pay-week.svg",
    heroAlt: "How to calculate overtime pay for a $20-an-hour worker: weekly gross at 40, 45, 50 and 55 hours split into straight-time pay and the overtime premium",
  },
  {
    slug: "how-to-read-a-pay-stub",
    noindex: true,
    title: "How to Read a Pay Stub: Every Line, Abbreviation and YTD Figure",
    metaTitle: "How to Read a Pay Stub: Lines, Abbreviations and a 2026 Example",
    description:
      "How to read a pay stub line by line: earnings, pre-tax deductions, FIT, OASDI, Medicare, state tax, net pay and YTD, with a fully worked 2026 example stub.",
    keyword: "how to read a pay stub",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 9,
    hero: "/images/blog/pay-stub-anatomy.svg",
    heroAlt: "How to read a pay stub: a labelled 2026 Georgia biweekly stub for a $60,000 salary showing earnings, 401(k) and health deductions, taxes and net pay",
  },
  {
    slug: "gross-pay-vs-net-pay",
    noindex: true,
    title: "Gross Pay vs Net Pay: What Each Means and How to Get From One to the Other",
    metaTitle: "Gross Pay vs Net Pay: Definitions, Formula and 2026 Examples",
    description:
      "Gross pay vs net pay: gross is earnings before deductions, net is what lands in your account. The formula, what sits between them, and 2026 state examples.",
    keyword: "gross pay vs net pay",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 8,
    hero: "/images/blog/gross-vs-net-by-state.svg",
    heroAlt: "Gross pay vs net pay on a $75,000 salary in Texas, California and New York: the share of each biweekly check left as take-home pay",
  },
  {
    slug: "exempt-vs-non-exempt-employee",
    noindex: true,
    title: "Exempt vs Non-Exempt Employee: Salary Tests, Overtime and 2026 Thresholds",
    metaTitle: "Exempt vs Non-Exempt Employee: 2026 Salary Tests and Overtime",
    description:
      "Exempt vs non exempt employee: the FLSA salary basis, $684-a-week salary level and duties tests, state thresholds for 2026, and what each status means for pay.",
    keyword: "exempt vs non exempt employee",
    published: "2026-11-19",
    updated: "2026-11-19",
    readMinutes: 9,
    hero: "/images/blog/exempt-salary-thresholds-2026.svg",
    heroAlt: "Exempt vs non exempt employee salary thresholds for 2026: federal $35,568, New York outside NYC $62,353, NYC area $66,300 and California $70,304",
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

/* ===================================================================== */
/* November 2026 batch: shared helpers                                    */
/* ===================================================================== */

export const usd2 = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const usd0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const pct = (n: number) => `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;

/** One paycheck at any frequency, straight from the payroll engine. */
export function checkFor(input: { grossAnnual: number; frequency: PayFrequency; status?: FilingStatus; state?: SupportedState; retirementPercent?: number; preTaxPerPaycheck?: number }) {
  const p = calculatePaycheck({
    grossAnnual: input.grossAnnual,
    frequency: input.frequency,
    status: input.status ?? "single",
    state: input.state ?? "TX",
    retirementPercent: input.retirementPercent,
    preTaxPerPaycheck: input.preTaxPerPaycheck,
  });
  const n = p.periods;
  return {
    periods: n,
    gross: round2(p.grossAnnual / n),
    retirement: round2(p.retirementAnnual / n),
    preTax: round2(p.preTaxAnnual / n),
    otherPreTax: round2((p.preTaxAnnual - p.retirementAnnual) / n),
    federal: round2(p.federal / n),
    socialSecurity: round2(p.socialSecurity / n),
    medicare: round2(p.medicare / n),
    state: round2((p.stateIncomeTax + p.statePayrollPremiums) / n),
    net: round2(p.netAnnual / n),
    netAnnual: round2(p.netAnnual),
  };
}

export const FREQUENCIES: { key: PayFrequency; label: string; periods: number; schedule: string }[] = [
  { key: "weekly", label: "Weekly", periods: 52, schedule: "Every week, same weekday" },
  { key: "biweekly", label: "Biweekly", periods: 26, schedule: "Every other week, same weekday" },
  { key: "semimonthly", label: "Semimonthly", periods: 24, schedule: "Twice a month on fixed dates (e.g. 15th and last day)" },
  { key: "monthly", label: "Monthly", periods: 12, schedule: "Once a month on a fixed date" },
];

/** 2026 federal constants used across the batch (IRS Rev. Proc. 2025-32, SSA fact sheet). */
export const FED_2026 = {
  ssRate: 0.062,
  medicareRate: 0.0145,
  addlMedicareRate: 0.009,
  addlMedicareWithholdingThreshold: 200000,
  ssWageBase: 184500,
  standardDeduction: { single: statusByKey.single.standardDeduction, married: statusByKey.married.standardDeduction, head: statusByKey.head.standardDeduction },
};
export const SS_MAX_2026 = round2(FED_2026.ssWageBase * FED_2026.ssRate);

/* --------------------------------------------- Semimonthly vs biweekly */

export const SEMI_VS_BI_SALARIES = [45000, 60000, 90000];
export const semiVsBiRows = SEMI_VS_BI_SALARIES.map(salary => ({
  salary,
  biweekly: checkFor({ grossAnnual: salary, frequency: "biweekly" }),
  semimonthly: checkFor({ grossAnnual: salary, frequency: "semimonthly" }),
}));

/** Hourly $25 × 40 h on a semimonthly schedule: hours per period vary between 80 and 96 (10–12 workdays). */
export const semiHourly = (() => {
  const rate = 25;
  const avgHours = round2((40 * 52) / 24);
  return { rate, avgHours, avgGross: round2(rate * avgHours), lowGross: rate * 80, highGross: rate * 96, biweeklyGross: rate * 80 };
})();

/* ------------------------------------------------- Pay periods per year */

export const payPeriodRows = FREQUENCIES.map(f => ({ ...f, check: checkFor({ grossAnnual: 60000, frequency: f.key }) }));

/** Count paydays per calendar year for a fixed-interval schedule anchored on a 2026 payday. */
export function paydaysPerYear(anchor: Date, stepDays: number, fromYear: number, toYear: number) {
  const counts: Record<number, number> = {};
  const step = stepDays * 86400000;
  let t = anchor.getTime();
  while (new Date(t).getUTCFullYear() >= fromYear) t -= step;
  for (; new Date(t).getUTCFullYear() <= toYear; t += step) {
    const y = new Date(t).getUTCFullYear();
    if (y >= fromYear) counts[y] = (counts[y] ?? 0) + 1;
  }
  return counts;
}

/** Years 2026–2040 with an extra payday, for Friday schedules. */
export const extraPaydayYears = (() => {
  const range = (counts: Record<number, number>, n: number) => Object.entries(counts).filter(([, c]) => c === n).map(([y]) => Number(y));
  const biJan2 = paydaysPerYear(new Date(Date.UTC(2026, 0, 2)), 14, 2026, 2040);
  const biJan9 = paydaysPerYear(new Date(Date.UTC(2026, 0, 9)), 14, 2026, 2040);
  const weekly = paydaysPerYear(new Date(Date.UTC(2026, 0, 2)), 7, 2026, 2040);
  return { biJan2: range(biJan2, 27), biJan9: range(biJan9, 27), weekly: range(weekly, 53), weekly2026: weekly[2026], biJan2In2026: biJan2[2026] };
})();

/* ------------------------------------------------------- Taxable income */

export const taxableExample = (() => {
  const salary = 60000;
  const k401 = 3000; // 5% traditional 401(k)
  const health = 1800; // $150/month pre-tax health premium (Section 125)
  const wages = salary - k401 - health; // W-2 box 1
  const interest = 400;
  const grossIncome = wages + interest;
  const hsa = 0;
  const agi = grossIncome - hsa;
  const sd = FED_2026.standardDeduction.single;
  const taxable = Math.max(0, agi - sd);
  const tax = round2(ordinaryTax(taxable, statusByKey.single));
  return { salary, k401, health, wages, interest, grossIncome, agi, sd, taxable, tax, effectiveOnSalary: round2((tax / salary) * 100), marginal: 12 };
})();

export const taxableMarried = (() => {
  const wages = 110000;
  const sd = FED_2026.standardDeduction.married;
  const taxable = wages - sd;
  return { wages, sd, taxable, tax: round2(ordinaryTax(taxable, statusByKey.married)) };
})();

export const BRACKETS_2026 = {
  single: statusByKey.single.brackets.map(([from, rate]) => ({ from, rate })),
  married: statusByKey.married.brackets.map(([from, rate]) => ({ from, rate })),
};

/* ----------------------------------------------------------------- 1099 */

/** Schedule SE: 92.35% of net profit, 12.4% up to the wage base, 2.9% Medicare on all (0.9% extra not shown). */
export function seTax(netProfit: number) {
  const base = netProfit * 0.9235;
  const ss = Math.min(base, FED_2026.ssWageBase) * 0.124;
  const medicare = base * 0.029;
  return { base: round2(base), ss: round2(ss), medicare: round2(medicare), total: round2(ss + medicare), deductibleHalf: round2((ss + medicare) / 2) };
}

export const SE_PROFITS = [20000, 50000, 100000];
export const seRows = SE_PROFITS.map(profit => {
  const se = seTax(profit);
  const employeeFica = round2(profit * (FED_2026.ssRate + FED_2026.medicareRate));
  return { profit, ...se, employeeFica };
});

/* -------------------------------------------------------- Annual income */

export const ANNUAL_RATES = [20, 25, 30];
export const ANNUAL_HOURS = [20, 30, 40, 45];
/** Weekly hours over 40 paid at 1.5×, 52 weeks. */
export const annualFromHourly = (rate: number, hours: number, weeks = 52) =>
  round2((Math.min(hours, 40) * rate + Math.max(0, hours - 40) * rate * 1.5) * weeks);
export const annualIncomeGrid = ANNUAL_RATES.map(rate => ({ rate, values: ANNUAL_HOURS.map(h => annualFromHourly(rate, h)) }));

export const annualNet = (() => {
  const gross = 52000;
  return { gross, tx: checkFor({ grossAnnual: gross, frequency: "biweekly" }).netAnnual, ca: checkFor({ grossAnnual: gross, frequency: "biweekly", state: "CA" }).netAnnual, ny: checkFor({ grossAnnual: gross, frequency: "biweekly", state: "NY" }).netAnnual };
})();

/* ----------------------------------------------------------------- FICA */

export const FICA_WAGES = [40000, 75000, 150000, 200000, 300000];
export const ficaRows = FICA_WAGES.map(wages => {
  const ss = round2(Math.min(wages, FED_2026.ssWageBase) * FED_2026.ssRate);
  const medicare = round2(wages * FED_2026.medicareRate);
  const addl = round2(Math.max(0, wages - FED_2026.addlMedicareWithholdingThreshold) * FED_2026.addlMedicareRate);
  const total = round2(ss + medicare + addl);
  return { wages, ss, medicare, addl, total, effective: round2((total / wages) * 100) };
});

/** Two jobs, $110,000 + $90,000: each employer withholds Social Security separately. */
export const ficaTwoJobs = (() => {
  const a = 110000;
  const b = 90000;
  const withheld = round2((a + b) * FED_2026.ssRate);
  return { a, b, withheld, max: SS_MAX_2026, excess: round2(withheld - SS_MAX_2026) };
})();

export const fica60k = checkFor({ grossAnnual: 60000, frequency: "biweekly" });

/* ------------------------------------------------------------- Overtime */

export const OT_RATE = 20;
export const OT_HOURS = [40, 45, 50, 55];
export const overtimeRows = OT_HOURS.map(hours => {
  const straight = OT_RATE * hours;
  const premium = Math.max(0, hours - 40) * OT_RATE * 0.5;
  return { hours, straight, premium, total: straight + premium, otHours: Math.max(0, hours - 40) };
});

/** Nondiscretionary bonus folded into the regular rate (29 CFR 778.110(b) method). */
export const overtimeBonus = (() => {
  const rate = 20;
  const hours = 45;
  const bonus = 90;
  const straight = rate * hours;
  const regularRate = round2((straight + bonus) / hours);
  const premium = round2(0.5 * regularRate * (hours - 40));
  const naive = round2(rate * 40 + rate * 1.5 * (hours - 40) + bonus);
  return { rate, hours, bonus, straight, regularRate, premium, total: round2(straight + bonus + premium), naive };
})();

/** California: 10-hour day ×4 = 40 h week, but 2 h/day over 8 are daily overtime. */
export const overtimeCalifornia = (() => {
  const rate = 20;
  const days = 4;
  const dayHours = 10;
  const otHours = days * (dayHours - 8);
  const straightHours = days * 8;
  const total = straightHours * rate + otHours * rate * 1.5;
  return { rate, days, dayHours, otHours, straightHours, total, federalOnly: days * dayHours * rate };
})();

/** Weekly take-home on a 50-hour week vs a 40-hour week, Texas single (annualized by the engine). */
export const overtimeTakeHome = (() => {
  const base = checkFor({ grossAnnual: OT_RATE * 40 * 52, frequency: "weekly" });
  const ot = checkFor({ grossAnnual: overtimeRows[2].total * 52, frequency: "weekly" });
  return { base, ot, extraGross: round2(ot.gross - base.gross), extraNet: round2(ot.net - base.net) };
})();

/* -------------------------------------------------------------- Pay stub */

export const stubExample = (() => {
  const salary = 60000;
  const check = checkFor({ grossAnnual: salary, frequency: "biweekly", state: "GA", retirementPercent: 5, preTaxPerPaycheck: 100 });
  const periodsPaid = 22; // stub dated late October 2026
  const ytd = (n: number) => round2(n * periodsPaid);
  return { salary, check, periodsPaid, ytd, hoursPerPeriod: 80, hourlyEquivalent: round2(salary / 2080) };
})();

/* ---------------------------------------------------------- Gross vs net */

export const GVN_SALARY = 75000;
export const grossVsNetStates = (["TX", "CA", "NY"] as SupportedState[]).map(state => {
  const c = checkFor({ grossAnnual: GVN_SALARY, frequency: "biweekly", state });
  return { code: state, ...c, netShare: round2((c.net / c.gross) * 100) };
});
export const grossVsNetSalaries = [40000, 60000, 100000, 150000].map(salary => {
  const c = checkFor({ grossAnnual: salary, frequency: "biweekly" });
  return { salary, ...c, netShare: round2((c.net / c.gross) * 100) };
});
export const grossVsNetWith401k = checkFor({ grossAnnual: GVN_SALARY, frequency: "biweekly", retirementPercent: 6, preTaxPerPaycheck: 120 });

/* ------------------------------------------------------ Exempt vs non-exempt */

export const EXEMPT_THRESHOLDS_2026 = [
  { where: "Federal (FLSA standard salary level)", weekly: 684, annual: 35568 },
  { where: "Federal highly compensated employee", weekly: null, annual: 107432 },
  { where: "New York outside NYC, Long Island, Westchester", weekly: 1199.1, annual: 62353.2 },
  { where: "New York City, Long Island, Westchester", weekly: 1275, annual: 66300 },
  { where: "California (2 × state minimum wage × 2,080)", weekly: 1352, annual: 70304 },
];

/** Same $45,000 job, 50 hours a week: exempt salary vs non-exempt with overtime at the equivalent hourly rate. */
export const exemptCompare = (() => {
  const salary = 45000;
  const hourly = round2(salary / 2080);
  const weeklyHours = 50;
  const nonExemptAnnual = round2((hourly * 40 + hourly * 1.5 * (weeklyHours - 40)) * 52);
  return { salary, hourly, weeklyHours, nonExemptAnnual, gap: round2(nonExemptAnnual - salary), effectiveExemptHourly: round2(salary / (weeklyHours * 52)) };
})();
