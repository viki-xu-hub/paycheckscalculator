// Calculation helpers for the Texas situation pages: bonuses (supplemental wages),
// W-4 Step 3 dependent credits, and Texas child support income withholding.
// Sources are cited on each page; see /methodology for the shared payroll method.

import { PAY_PERIODS, federalWithholding2026, type FilingStatus, type PayFrequency } from "./payroll";

/* ---------------------------------------------------------------- FICA */

export const SOCIAL_SECURITY_WAGE_BASE = 184500;
export const SOCIAL_SECURITY_RATE = 0.062;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const ADDITIONAL_MEDICARE_THRESHOLD = 200000;

function socialSecurityOn(wages: number, priorWages = 0) {
  const remaining = Math.max(0, SOCIAL_SECURITY_WAGE_BASE - Math.max(0, priorWages));
  return Math.min(Math.max(0, wages), remaining) * SOCIAL_SECURITY_RATE;
}

function medicareOn(wages: number, priorWages = 0) {
  const safe = Math.max(0, wages);
  const prior = Math.max(0, priorWages);
  const additional =
    Math.max(0, prior + safe - ADDITIONAL_MEDICARE_THRESHOLD) -
    Math.max(0, prior - ADDITIONAL_MEDICARE_THRESHOLD);
  return safe * MEDICARE_RATE + additional * ADDITIONAL_MEDICARE_RATE;
}

/* ------------------------------------------- Bonuses / supplemental wages */

// IRS Publication 15, section 7: flat supplemental rate is 22%, and 37% on
// supplemental wages above $1,000,000 for the calendar year.
export const SUPPLEMENTAL_FLAT_RATE = 0.22;
export const SUPPLEMENTAL_HIGH_RATE = 0.37;
export const SUPPLEMENTAL_HIGH_THRESHOLD = 1000000;

export type BonusBreakdown = {
  bonus: number;
  federal: number;
  socialSecurity: number;
  medicare: number;
  stateIncomeTax: number;
  net: number;
  effectiveRate: number;
};

function finishBonus(bonus: number, federal: number, regularAnnualWages: number): BonusBreakdown {
  const socialSecurity = socialSecurityOn(bonus, regularAnnualWages);
  const medicare = medicareOn(bonus, regularAnnualWages);
  const net = Math.max(0, bonus - federal - socialSecurity - medicare);
  return {
    bonus,
    federal,
    socialSecurity,
    medicare,
    stateIncomeTax: 0,
    net,
    effectiveRate: bonus > 0 ? (bonus - net) / bonus * 100 : 0,
  };
}

// Percentage (flat rate) method: the bonus is paid separately and withheld at 22%.
export function bonusFlatMethod(input: {
  bonus: number;
  regularAnnualWages: number;
  ytdSupplementalWages?: number;
}): BonusBreakdown {
  const bonus = Math.max(0, input.bonus);
  const prior = Math.max(0, input.ytdSupplementalWages ?? 0);
  const aboveThreshold = Math.min(bonus, Math.max(0, prior + bonus - SUPPLEMENTAL_HIGH_THRESHOLD));
  const belowThreshold = bonus - aboveThreshold;
  const federal = belowThreshold * SUPPLEMENTAL_FLAT_RATE + aboveThreshold * SUPPLEMENTAL_HIGH_RATE;
  return finishBonus(bonus, federal, input.regularAnnualWages);
}

// Aggregate method: the bonus is added to a regular paycheck, the combined
// paycheck is annualized with the standard withholding tables, and the extra
// withholding is treated as the tax on the bonus.
export function bonusAggregateMethod(input: {
  bonus: number;
  regularAnnualWages: number;
  annualPreTax?: number;
  frequency: PayFrequency;
  status: FilingStatus;
}): BonusBreakdown {
  const bonus = Math.max(0, input.bonus);
  const periods = PAY_PERIODS[input.frequency];
  const taxableAnnual = Math.max(0, input.regularAnnualWages - Math.max(0, input.annualPreTax ?? 0));
  const regularWithholding = federalWithholding2026(taxableAnnual, input.status);
  const combinedWithholding = federalWithholding2026(taxableAnnual + bonus * periods, input.status);
  const federal = Math.max(0, (combinedWithholding - regularWithholding) / periods);
  return finishBonus(bonus, federal, input.regularAnnualWages);
}

/* --------------------------------------------- W-4 Step 3 dependent credits */

// 2026 Form W-4, Step 3: $2,200 per qualifying child under 17 and $500 per
// other dependent, claimed only when total income is under the limit below.
export const QUALIFYING_CHILD_CREDIT = 2200;
export const OTHER_DEPENDENT_CREDIT = 500;
export const DEPENDENT_CREDIT_LIMIT_SINGLE = 200000;
export const DEPENDENT_CREDIT_LIMIT_MARRIED = 400000;

export function dependentCreditLimit(status: FilingStatus) {
  return status === "married" ? DEPENDENT_CREDIT_LIMIT_MARRIED : DEPENDENT_CREDIT_LIMIT_SINGLE;
}

export function dependentCreditAnnual(input: {
  qualifyingChildren: number;
  otherDependents: number;
  annualIncome: number;
  status: FilingStatus;
}) {
  const claimed =
    Math.max(0, Math.floor(input.qualifyingChildren)) * QUALIFYING_CHILD_CREDIT +
    Math.max(0, Math.floor(input.otherDependents)) * OTHER_DEPENDENT_CREDIT;
  const overLimit = input.annualIncome > dependentCreditLimit(input.status);
  return { credit: overLimit ? 0 : claimed, claimed, overLimit };
}

/* -------------------------------------------- Texas child support withholding */

// Texas Family Code 154.125: guideline percentages apply to the first $11,700
// of monthly net resources for orders rendered on or after September 1, 2025.
export const TX_NET_RESOURCES_CAP_MONTHLY = 11700;
export const TX_GUIDELINE_PERCENTS = [0, 0.20, 0.25, 0.30, 0.35, 0.40, 0.40] as const;
// Texas Family Code 158.009: withholding may not exceed 50% of disposable earnings.
export const TX_MAX_WITHHOLDING_SHARE = 0.5;

export function texasGuidelinePercent(children: number) {
  const count = Math.max(0, Math.min(6, Math.floor(children)));
  return TX_GUIDELINE_PERCENTS[count];
}

export function texasChildSupport(input: {
  annualGross: number;
  frequency: PayFrequency;
  children: number;
  unionDuesPerPaycheck?: number;
  childInsurancePerPaycheck?: number;
  // Actual pay left after legally required deductions, when it is known from a
  // full paycheck calculation. Defaults to the statutory net-resources basis.
  disposableEarningsAnnual?: number;
}) {
  const periods = PAY_PERIODS[input.frequency];
  const gross = Math.max(0, input.annualGross);
  const unionDuesAnnual = Math.max(0, input.unionDuesPerPaycheck ?? 0) * periods;
  const insuranceAnnual = Math.max(0, input.childInsurancePerPaycheck ?? 0) * periods;

  // Section 154.062(d) deductions. Texas has no state income tax on wages, so
  // that statutory deduction is $0 here.
  const socialSecurity = socialSecurityOn(gross);
  const medicare = medicareOn(gross);
  const federalSingleOneExemption = federalWithholding2026(gross, "single");
  const netResourcesAnnual = Math.max(
    0,
    gross - socialSecurity - medicare - federalSingleOneExemption - unionDuesAnnual - insuranceAnnual,
  );

  const netResourcesMonthly = netResourcesAnnual / 12;
  const cappedMonthly = Math.min(netResourcesMonthly, TX_NET_RESOURCES_CAP_MONTHLY);
  const capApplies = netResourcesMonthly > TX_NET_RESOURCES_CAP_MONTHLY;
  const percent = texasGuidelinePercent(input.children);
  const supportMonthly = cappedMonthly * percent;
  const supportPerPaycheck = supportMonthly * 12 / periods;

  // Disposable earnings = pay left after deductions required by law.
  const disposableAnnual =
    input.disposableEarningsAnnual ?? Math.max(0, gross - socialSecurity - medicare - federalSingleOneExemption);
  const disposablePerPaycheck = Math.max(0, disposableAnnual) / periods;
  const withholdingCeiling = disposablePerPaycheck * TX_MAX_WITHHOLDING_SHARE;
  const appliedPerPaycheck = Math.min(supportPerPaycheck, withholdingCeiling);

  return {
    periods,
    percent,
    socialSecurity,
    medicare,
    federalSingleOneExemption,
    unionDuesAnnual,
    insuranceAnnual,
    netResourcesAnnual,
    netResourcesMonthly,
    cappedMonthly,
    capApplies,
    supportMonthly,
    supportPerPaycheck,
    disposablePerPaycheck,
    withholdingCeiling,
    appliedPerPaycheck,
    limitedByFiftyPercentRule: appliedPerPaycheck < supportPerPaycheck - 0.005,
  };
}
