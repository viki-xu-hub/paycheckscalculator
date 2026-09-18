import occupationsRaw from "../../data/occupations.json";
import { calculatePaycheck } from "../payroll";

/**
 * Per-page content for the programmatic /hourly/N and /salary/N pages.
 *
 * Everything here is derived from data so that no two pages carry the same
 * paragraph: which occupations sit near the wage, where the wage falls in the
 * national distribution, and worked overtime / raise examples run through the
 * real withholding engine.
 */

export type Occupation = { code: string; title: string; employment: number; medianHourly: number; medianAnnual: number };

const occupations: Occupation[] = (occupationsRaw.rows as [string, string, number, number, number][])
  .map(([code, title, employment, medianHourly, medianAnnual]) => ({ code, title, employment, medianHourly, medianAnnual }));

export const OES = {
  release: occupationsRaw.release,            // "May 2025"
  sourceUrl: occupationsRaw.sourceUrl,
  // All Occupations row, national_M2025_dl.xlsx
  medianHourly: 24.51,
  medianAnnual: 50980,
  p25Hourly: 18.07,
  p75Hourly: 38.71,
  p25Annual: 37590,
  p75Annual: 80520,
  federalMinimumWage: 7.25,
};

const money0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const money2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = new Intl.NumberFormat("en-US");

/**
 * Occupations whose national median wage sits closest to the page's wage.
 * `halfGap` is half the distance to the neighbouring page on the same axis, so
 * adjacent pages get (mostly) disjoint lists; the band only widens when the
 * nearest cell holds fewer than `min` occupations.
 */
function nearest(key: "medianHourly" | "medianAnnual", value: number, halfGap: number, count: number, min = 5): Occupation[] {
  let band = Math.max(halfGap, key === "medianHourly" ? 0.25 : 250);
  for (let i = 0; i < 6; i++) {
    const hits = occupations.filter(o => Math.abs(o[key] - value) <= band);
    if (hits.length >= min || (i === 5 && hits.length)) {
      return hits.sort((a, b) => Math.abs(a[key] - value) - Math.abs(b[key] - value) || b.employment - a.employment).slice(0, count);
    }
    band *= 1.5;
  }
  // Nothing within range (e.g. $10/hr sits below every tracked occupation): fall back to the nearest ones.
  return [...occupations].sort((a, b) => Math.abs(a[key] - value) - Math.abs(b[key] - value) || b.employment - a.employment).slice(0, count);
}

export function occupationsNearHourly(rate: number, neighbours: number[] = [], count = 8): Occupation[] {
  const gaps = neighbours.map(n => Math.abs(n - rate) / 2).filter(g => g > 0);
  return nearest("medianHourly", rate, gaps.length ? Math.min(...gaps) : 1, count);
}

export function occupationsNearSalary(amount: number, neighbours: number[] = [], count = 8): Occupation[] {
  const gaps = neighbours.map(n => Math.abs(n - amount) / 2).filter(g => g > 0);
  return nearest("medianAnnual", amount, gaps.length ? Math.min(...gaps) : 1500, count);
}

/** One sentence built from the page's own occupation list, so it differs wherever the list does. */
export function occupationsSummary(jobs: Occupation[], unit: "hour" | "year"): string {
  if (!jobs.length) return "";
  const biggest = [...jobs].sort((a, b) => b.employment - a.employment)[0];
  const lo = Math.min(...jobs.map(j => unit === "hour" ? j.medianHourly : j.medianAnnual));
  const hi = Math.max(...jobs.map(j => unit === "hour" ? j.medianHourly : j.medianAnnual));
  const f = (n: number) => unit === "hour" ? money2.format(n) : money0.format(n);
  const total = jobs.reduce((a, j) => a + j.employment, 0);
  return `The largest of these is ${biggest.title} — about ${formatEmployment(biggest.employment)} jobs nationwide with a median of ${f(unit === "hour" ? biggest.medianHourly : biggest.medianAnnual)} an ${unit} — and together the ${jobs.length} occupations listed employ roughly ${formatEmployment(total)} people at medians between ${f(lo)} and ${f(hi)}.`;
}

const TOTAL_EMPLOYMENT = occupations.reduce((a, o) => a + o.employment, 0);

/** Share of jobs (employment-weighted, across the 451 tracked occupations) whose median wage is below the given value. */
export function shareOfJobsBelow(key: "medianHourly" | "medianAnnual", value: number): number {
  const below = occupations.filter(o => o[key] < value).reduce((a, o) => a + o.employment, 0);
  return Math.round((below / TOTAL_EMPLOYMENT) * 100);
}

/** Where an hourly wage sits in the national distribution — one paragraph, five distinct versions. */
export function hourlyPositionText(rate: number): { heading: string; body: string } {
  const r = hourlyPositionBase(rate);
  const share = shareOfJobsBelow("medianHourly", rate);
  return { heading: r.heading, body: `${r.body} Weighted by employment, about ${share}% of the ${formatEmployment(TOTAL_EMPLOYMENT)} U.S. jobs in the ${occupations.length} occupations we track have a median wage below $${rate} an hour.` };
}

function hourlyPositionBase(rate: number): { heading: string; body: string } {
  const vsMedian = rate / OES.medianHourly;
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  if (rate < OES.p25Hourly) {
    return {
      heading: `Where $${rate} an hour sits among U.S. wages`,
      body: `$${rate} an hour is ${money2.format(rate - OES.federalMinimumWage)} above the federal minimum wage of $${OES.federalMinimumWage.toFixed(2)}, but it is below the 25th-percentile wage for all U.S. occupations (${money2.format(OES.p25Hourly)} in the BLS ${OES.release} survey). In other words, roughly three out of four American workers earn more than $${rate} an hour, and many states set their own minimum wage above this level. The national median is ${money2.format(OES.medianHourly)}, so $${rate} is about ${pct(vsMedian)} of a typical wage.`,
    };
  }
  if (rate < OES.medianHourly) {
    return {
      heading: `Where $${rate} an hour sits among U.S. wages`,
      body: `$${rate} an hour lands between the 25th percentile (${money2.format(OES.p25Hourly)}) and the national median (${money2.format(OES.medianHourly)}) for all U.S. occupations in the BLS ${OES.release} survey. It is ${money2.format(OES.medianHourly - rate)} an hour, or about ${money0.format((OES.medianHourly - rate) * 2080)} a year, below what the typical full-time worker earns — a gap that a single raise or a credential in many of the trades listed below would close.`,
    };
  }
  if (rate < OES.p75Hourly) {
    return {
      heading: `Where $${rate} an hour sits among U.S. wages`,
      body: `$${rate} an hour is above the national median of ${money2.format(OES.medianHourly)} (BLS ${OES.release}) — about ${pct(vsMedian)} of the typical U.S. wage — but still below the 75th percentile of ${money2.format(OES.p75Hourly)}. That puts $${rate} an hour in the upper-middle of the wage distribution: more than half of American workers earn less, and it is a common rate for experienced tradespeople, technicians and administrative specialists.`,
    };
  }
  if (rate < 60) {
    return {
      heading: `Where $${rate} an hour sits among U.S. wages`,
      body: `At $${rate} an hour you are in the top quarter of U.S. earners: the 75th-percentile wage across all occupations is ${money2.format(OES.p75Hourly)} in the BLS ${OES.release} survey, and $${rate} is ${pct(vsMedian)} of the national median (${money2.format(OES.medianHourly)}). Wages at this level are typical of licensed professionals, engineers, nurses and senior technical roles, and at 40 hours a week they cross the ${money0.format(rate * 2080)} annual mark before overtime.`,
    };
  }
  return {
    heading: `Where $${rate} an hour sits among U.S. wages`,
    body: `$${rate} an hour is ${vsMedian.toFixed(1)}× the national median wage of ${money2.format(OES.medianHourly)} and well beyond the 75th percentile of ${money2.format(OES.p75Hourly)} (BLS ${OES.release}). Rates like this are usually paid to physicians, executives, senior engineers, attorneys and specialised contractors — and at this income level the Social Security wage base ($184,500 in 2026) and the Additional Medicare Tax start to matter, which is why the after-tax figures below flatten out compared with lower rates.`,
  };
}

/** Where an annual salary sits in the national distribution — one paragraph, five distinct versions. */
export function salaryPositionText(amount: number): { heading: string; body: string } {
  const r = salaryPositionBase(amount);
  const share = shareOfJobsBelow("medianAnnual", amount);
  return { heading: r.heading, body: `${r.body} Weighted by employment, about ${share}% of the ${formatEmployment(TOTAL_EMPLOYMENT)} U.S. jobs in the ${occupations.length} occupations we track have a median salary below ${money0.format(amount)}.` };
}

function salaryPositionBase(amount: number): { heading: string; body: string } {
  const label = money0.format(amount);
  const vsMedian = amount / OES.medianAnnual;
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  if (amount < OES.p25Annual) {
    return {
      heading: `Where ${label} a year sits among U.S. salaries`,
      body: `${label} a year is below the 25th-percentile annual wage for all U.S. occupations (${money0.format(OES.p25Annual)} in the BLS ${OES.release} survey) and about ${pct(vsMedian)} of the national median of ${money0.format(OES.medianAnnual)}. Roughly three in four full-time workers earn more. At this level federal income tax is modest, so most of the gap between gross and net pay in the table below comes from Social Security and Medicare rather than income tax.`,
    };
  }
  if (amount < OES.medianAnnual) {
    return {
      heading: `Where ${label} a year sits among U.S. salaries`,
      body: `${label} a year lands between the 25th percentile (${money0.format(OES.p25Annual)}) and the national median (${money0.format(OES.medianAnnual)}) for all U.S. occupations in the BLS ${OES.release} survey — about ${money0.format(OES.medianAnnual - amount)} short of what the typical full-time worker earns. It is a common salary for entry-level office, healthcare-support and skilled-trade roles, several of which are listed below.`,
    };
  }
  if (amount < OES.p75Annual) {
    return {
      heading: `Where ${label} a year sits among U.S. salaries`,
      body: `${label} a year is above the national median of ${money0.format(OES.medianAnnual)} (BLS ${OES.release}) — about ${pct(vsMedian)} of a typical salary — but below the 75th percentile of ${money0.format(OES.p75Annual)}. More than half of American workers earn less than this, and it is the range where a single filer's marginal federal rate moves from 12% to 22%, so each additional dollar of raise is taxed noticeably harder than at lower salaries.`,
    };
  }
  if (amount < 150000) {
    return {
      heading: `Where ${label} a year sits among U.S. salaries`,
      body: `At ${label} a year you are in the top quarter of U.S. earners: the 75th-percentile annual wage across all occupations is ${money0.format(OES.p75Annual)} in the BLS ${OES.release} survey, and ${label} is ${pct(vsMedian)} of the national median. Salaries at this level are typical of nurses, engineers, accountants, managers and IT specialists, and most of them sit in the 22% or 24% federal bracket for a single filer.`,
    };
  }
  return {
    heading: `Where ${label} a year sits among U.S. salaries`,
    body: `${label} a year is ${vsMedian.toFixed(1)}× the national median salary of ${money0.format(OES.medianAnnual)} and far above the 75th percentile of ${money0.format(OES.p75Annual)} (BLS ${OES.release}). Incomes like this are typical of physicians, attorneys, executives and senior technology roles. Two things change at this level: wages above $184,500 stop paying the 6.2% Social Security tax in 2026, and wages above $200,000 (single) pick up the 0.9% Additional Medicare Tax — both are reflected in the state table below.`,
  };
}

/** Overtime worked example for an hourly rate, run through the Texas (no state tax) engine so the tax effect is real. */
export function overtimeExample(rate: number) {
  const base = rate * 2080;
  const otHours = 5;
  const otRate = rate * 1.5;
  const extraGross = otRate * otHours * 52;
  const before = calculatePaycheck({ grossAnnual: base, frequency: "biweekly", status: "single", state: "TX" });
  const after = calculatePaycheck({ grossAnnual: base + extraGross, frequency: "biweekly", status: "single", state: "TX" });
  const extraNet = after.netAnnual - before.netAnnual;
  return {
    otRate: money2.format(otRate),
    doubleRate: money2.format(rate * 2),
    otHours,
    extraGross: money0.format(Math.round(extraGross)),
    extraNet: money0.format(Math.round(extraNet)),
    keepRate: Math.round((extraNet / extraGross) * 100),
    extraBiweekly: money0.format(Math.round(extraGross / 26)),
    extraNetBiweekly: money0.format(Math.round(extraNet / 26)),
  };
}

/** What a $1,000 raise (and a $5,000 raise) actually adds to take-home pay at this salary, Texas engine. */
export function raiseExample(amount: number) {
  const base = calculatePaycheck({ grossAnnual: amount, frequency: "biweekly", status: "single", state: "TX" });
  const plus1k = calculatePaycheck({ grossAnnual: amount + 1000, frequency: "biweekly", status: "single", state: "TX" });
  const plus5k = calculatePaycheck({ grossAnnual: amount + 5000, frequency: "biweekly", status: "single", state: "TX" });
  const keep1k = plus1k.netAnnual - base.netAnnual;
  const keep5k = plus5k.netAnnual - base.netAnnual;
  return {
    keep1k: money0.format(Math.round(keep1k)),
    keep1kPct: Math.round((keep1k / 1000) * 100),
    keep5k: money0.format(Math.round(keep5k)),
    keep5kBiweekly: money0.format(Math.round(keep5k / 26)),
    federalOnBase: money0.format(Math.round(base.federal)),
    ficaOnBase: money0.format(Math.round(base.socialSecurity + base.medicare)),
  };
}

export type FaqItem = { q: string; a: string };

/** Bucket-specific FAQs for hourly pages — three extra questions that differ by wage band. */
export function hourlyBucketFaqs(rate: number): FaqItem[] {
  const monthly = rate * 2080 / 12;
  const rent = money0.format(Math.round(monthly * 0.3));
  const ot = overtimeExample(rate);
  if (rate < OES.p25Hourly) {
    return [
      { q: `Is $${rate} an hour a living wage?`, a: `It depends heavily on where you live and whether you have dependents. $${rate} an hour is ${money0.format(Math.round(monthly))} a month before taxes; the common 30%-of-income rule puts affordable rent at about ${rent} a month, which is below the median one-bedroom rent in most U.S. metro areas. In lower-cost regions and for a single person it can cover basics; in high-cost cities it usually does not.` },
      { q: `How much rent can I afford on $${rate} an hour?`, a: `Using the 30% guideline, about ${rent} a month on ${money0.format(Math.round(monthly))} of gross monthly income. Many landlords screen for income of 2.5–3× rent, which caps you at roughly ${money0.format(Math.round(monthly / 3))}–${money0.format(Math.round(monthly / 2.5))}.` },
      { q: `How much is overtime at $${rate} an hour?`, a: `Time-and-a-half at $${rate} an hour is ${ot.otRate} an hour. Five hours of overtime a week adds ${ot.extraGross} a year in gross pay, of which you keep about ${ot.extraNet} after federal tax, Social Security and Medicare in a no-income-tax state.` },
    ];
  }
  if (rate < OES.p75Hourly) {
    return [
      { q: `How much is time-and-a-half at $${rate} an hour?`, a: `Time-and-a-half is ${ot.otRate} an hour and double time is ${ot.doubleRate}. Working ${ot.otHours} overtime hours a week for a year adds ${ot.extraGross} gross, or about ${ot.extraNet} net (${ot.keepRate}% kept) in a state with no income tax.` },
      { q: `How much rent can I afford on $${rate} an hour?`, a: `On ${money0.format(Math.round(monthly))} a month gross, the 30% rule suggests about ${rent} a month for rent. Lenders and landlords typically use a similar ceiling, so ${rent} is a reasonable budget line before utilities.` },
      { q: `Is $${rate} an hour a good wage?`, a: `$${rate} an hour is ${rate >= OES.medianHourly ? "above" : "slightly below"} the U.S. median wage of ${money2.format(OES.medianHourly)} (BLS ${OES.release}). Whether it feels good depends on your state's cost of living — the state table above shows how much of it you actually keep.` },
    ];
  }
  return [
    { q: `Is $${rate} an hour better as W-2 or 1099?`, a: `At $${rate} an hour on a W-2, your employer pays half of your Social Security and Medicare (7.65% of wages). As a 1099 contractor you pay both halves — 15.3% self-employment tax — plus you lose employer benefits, so a contractor rate typically needs to be 25–35% higher than $${rate} to match a W-2 offer.` },
    { q: `How much is overtime at $${rate} an hour?`, a: `Time-and-a-half is ${ot.otRate} an hour. Note that many salaried and professional roles paid at this level are exempt from overtime under the FLSA; if you are hourly and non-exempt, ${ot.otHours} extra hours a week is worth ${ot.extraGross} a year gross.` },
    { q: `Does $${rate} an hour hit the Social Security wage base?`, a: `${rate * 2080 > 184500 ? `Yes. At 40 hours a week $${rate} an hour is ${money0.format(rate * 2080)} a year, above the 2026 wage base of $184,500, so the 6.2% Social Security tax stops partway through the year and your later paychecks are larger.` : `Not at 40 hours a week: $${rate} an hour is ${money0.format(rate * 2080)} a year, below the 2026 wage base of $184,500, so Social Security is withheld on every paycheck.`}` },
  ];
}

/** Bucket-specific FAQs for salary pages. */
export function salaryBucketFaqs(amount: number): FaqItem[] {
  const label = money0.format(amount);
  const monthly = amount / 12;
  const rent = money0.format(Math.round(monthly * 0.3));
  const r = raiseExample(amount);
  if (amount < OES.p25Annual) {
    return [
      { q: `How much rent can I afford on ${label} a year?`, a: `The 30% rule puts affordable rent at about ${rent} a month on ${money0.format(Math.round(monthly))} of gross monthly income. Landlords often require income of 2.5–3× rent, which caps you at roughly ${money0.format(Math.round(monthly / 3))}–${money0.format(Math.round(monthly / 2.5))}.` },
      { q: `Is ${label} a year a living wage?`, a: `${label} is below the 25th-percentile U.S. salary (${money0.format(OES.p25Annual)}, BLS ${OES.release}). For a single person in a lower-cost region it can cover essentials; for a household or a high-cost metro it generally falls short of most living-wage estimates.` },
      { q: `How much of a $1,000 raise do I keep at ${label}?`, a: `About ${r.keep1k} (${r.keep1kPct}%). At this income the federal rate is low, so most of what comes out of a raise is Social Security and Medicare, not income tax.` },
    ];
  }
  if (amount < OES.p75Annual) {
    return [
      { q: `How much of a $1,000 raise do I keep at ${label}?`, a: `About ${r.keep1k}, or ${r.keep1kPct}%, in a state with no income tax. A $5,000 raise would add roughly ${r.keep5k} a year — ${r.keep5kBiweekly} per biweekly paycheck.` },
      { q: `How much house can I afford on ${label} a year?`, a: `A common guideline caps total housing costs at 28% of gross income — about ${money0.format(Math.round(monthly * 0.28))} a month on ${label}. Depending on rates and your down payment, that supports a mortgage in the ${money0.format(Math.round(amount * 2.5))}–${money0.format(Math.round(amount * 3.5))} range.` },
      { q: `Is ${label} a good salary?`, a: `${label} is ${amount >= OES.medianAnnual ? "above" : "slightly below"} the U.S. median annual wage of ${money0.format(OES.medianAnnual)} (BLS ${OES.release}). Whether it feels good depends on your state — the table above shows the after-tax difference, which can exceed ${money0.format(Math.round(amount * 0.08))} a year between the highest- and lowest-tax states.` },
    ];
  }
  return [
    { q: `How much of a $1,000 raise do I keep at ${label}?`, a: `About ${r.keep1k} (${r.keep1kPct}%) in a state with no income tax; in California or New York, expect to keep 5–10 points less. On ${label} you already pay roughly ${r.federalOnBase} in federal income tax and ${r.ficaOnBase} in Social Security and Medicare.` },
    { q: `Does ${label} a year hit the Social Security wage base?`, a: `${amount > 184500 ? `Yes — wages above $184,500 in 2026 are not subject to the 6.2% Social Security tax, so your paychecks get larger once you cross that mark during the year.` : `Not quite: ${label} is below the 2026 wage base of $184,500, so Social Security is withheld on every dollar.`}` },
    { q: `How much should I contribute to a 401(k) on ${label}?`, a: `The 2026 employee limit is $24,500. Contributing 10% (${money0.format(Math.round(amount * 0.1))}) reduces federal withholding by roughly ${money0.format(Math.round(amount * 0.1 * 0.24))} a year at a 24% marginal rate — use the calculator's 401(k) field to see the exact paycheck effect.` },
  ];
}

export function formatEmployment(n: number) {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${int.format(Math.round(n / 1000))}K`;
}
