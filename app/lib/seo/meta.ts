import type { StateData, SalaryData, HourlyData, FrequencyData, PageMeta } from "./types";

const SITE = "https://www.paycheckscalculator.org";
const YEAR = "2026";

export function stateMeta(state: StateData): PageMeta {
  return {
    title: `${state.name} Paycheck Calculator ${YEAR} – ${state.abbr} Salary & Net Pay`,
    description: state.hasStateTax
      ? `${state.name} paycheck calculator for ${YEAR}: estimate take-home pay after federal tax, FICA and ${state.abbr} state income tax. Free ${state.abbr} salary and payroll estimator.`
      : `${state.name} paycheck calculator for ${YEAR}: estimate take-home pay after federal tax and FICA. No ${state.abbr} income tax — free ${state.abbr} salary estimator.`,
    h1: `${state.name} Paycheck Calculator ${YEAR}`,
    canonical: `${SITE}/states/${state.slug}`,
  };
}

export function salaryMeta(salary: SalaryData): PageMeta {
  const hourly = (salary.amount / 2080).toFixed(2);
  const k = `$${Math.round(salary.amount / 1000)}k`;
  const biweeklyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(salary.amount / 26));
  return {
    title: `${salary.label} a Year Is How Much an Hour & Biweekly? — ${YEAR} Pay`,
    description: `${salary.label} a year is how much an hour? $${hourly} an hour at 40 hours a week (${k} salary). See biweekly (${biweeklyFmt}), monthly and weekly pay, plus ${YEAR} take-home pay after federal, FICA and state tax in 52 states.`,
    h1: `${salary.label} a Year Is How Much an Hour & Biweekly? — ${YEAR} Calculator`,
    canonical: `${SITE}/salary/${salary.slug}`,
  };
}

export function hourlyMeta(hourly: HourlyData): PageMeta {
  const annualFmt = new Intl.NumberFormat("en-US").format(hourly.annualAt40h);
  const monthlyFmt = new Intl.NumberFormat("en-US").format(Math.round(hourly.annualAt40h / 12));
  const dollar = `$${hourly.rate}`;
  return {
    title: `${dollar} an Hour Is How Much a Year — ${YEAR} After-Tax Pay`,
    description: `${dollar} an hour is how much a year? $${annualFmt} at 40 hours a week, about $${monthlyFmt} a month. See ${YEAR} take-home pay after federal, FICA and state tax in 52 states.`,
    h1: `${dollar} an Hour Is How Much a Year — ${YEAR} Paycheck Calculator`,
    canonical: `${SITE}/hourly/${hourly.slug}`,
  };
}

export function frequencyMeta(freq: FrequencyData): PageMeta {
  return {
    title: `${freq.name} Paycheck Calculator ${YEAR} — Estimate Your ${freq.name} Take-Home Pay`,
    description: `Calculate your ${freq.shortLabel} paycheck amount in ${YEAR}. ${freq.description}. Enter your salary and deductions to estimate your ${freq.shortLabel} net pay after federal taxes.`,
    h1: `${freq.name} Paycheck Calculator ${YEAR}`,
    canonical: `${SITE}/${freq.slug}`,
  };
}
