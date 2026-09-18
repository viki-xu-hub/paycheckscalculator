import type { StateData, SalaryData, HourlyData, FrequencyData, PageMeta } from "./types";

const SITE = "https://www.paycheckscalculator.org";
const YEAR = "2026";

export function stateMeta(state: StateData): PageMeta {
  const taxClause = state.hasStateTax
    ? `Estimate state income tax withholding at ${state.taxRate}%.`
    : `${state.name} has no state income tax.`;
  return {
    title: `${state.name} Paycheck Calculator ${YEAR} — Take-Home Pay After Taxes`,
    description: `Free ${state.name} paycheck calculator for ${YEAR}. Estimate your take-home pay after federal taxes, Social Security, Medicare, and ${state.hasStateTax ? `${state.name} state income tax` : "payroll deductions"}. ${taxClause}`,
    h1: `${state.name} Paycheck Calculator ${YEAR}`,
    canonical: `${SITE}/states/${state.slug}`,
  };
}

export function salaryMeta(salary: SalaryData): PageMeta {
  const fmt = new Intl.NumberFormat("en-US");
  return {
    title: `${salary.label} Salary After Tax — ${YEAR} Take-Home Pay Calculator`,
    description: `How much is ${salary.label} a year after taxes in ${YEAR}? Calculate your exact take-home pay from a ${salary.label} salary after federal income tax, Social Security, and Medicare.`,
    h1: `${salary.label} Salary After Tax Calculator ${YEAR}`,
    canonical: `${SITE}/salary/${salary.slug}`,
  };
}

export function hourlyMeta(hourly: HourlyData): PageMeta {
  const annualFmt = new Intl.NumberFormat("en-US").format(hourly.annualAt40h);
  const monthlyFmt = new Intl.NumberFormat("en-US").format(Math.round(hourly.annualAt40h / 12));
  const dollar = `$${hourly.rate}`;
  return {
    title: `${dollar} an Hour Is How Much a Year — ${YEAR} After-Tax Pay`,
    description: `${dollar} an hour is how much a year? $${annualFmt} at 40 hours a week, about $${monthlyFmt} a month. See ${YEAR} take-home pay after federal, FICA and state tax in 38 states.`,
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
