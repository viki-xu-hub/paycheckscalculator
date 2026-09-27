import {
  ordinaryTax,
  statusByKey,
  type CapitalGainsStatus,
  type FilingStatusKey,
} from "./qualifiedDividends";

export type { FilingStatusKey };

export type StateTaxResult = {
  stateTax: number;
  stateTaxableIncome: number;
  effectiveStateRate: number;
  details: Record<string, number>;
};

export type StateTaxConfig = {
  abbr: string;
  name: string;
  type: "flat" | "progressive" | "none";
  hasStateIncomeTax: boolean;
  displayRate: string;
  hasStandardDeduction: boolean;
  hasPersonalExemptions: boolean;
  hasDependentExemptions: boolean;
  /**
   * Whether the number of dependents actually changes this state's tax. Some
   * states grant no per-dependent relief at all (PA, CT) and some have no
   * income tax (FL, TN); the calculator hides the dependents input for those
   * rather than showing a control that silently does nothing.
   */
  dependentsAffectTax: boolean;
  standardDeduction?: Record<FilingStatusKey, number>;
  personalExemptionAmount?: number;
  dependentExemptionAmount?: number;
  calculate: (
    income: number,
    status: FilingStatusKey,
    dependents: number,
  ) => StateTaxResult;
};

export type TotalTaxResult = {
  federalTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  federalTaxableIncome: number;
  stateTaxableIncome: number;
  stateDetails: Record<string, number>;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Progressive tax using [ceiling, marginalRate] rows — same pattern as
 * payroll.ts `progressiveTax`. Rate applies to the slice of income between
 * the previous ceiling and this ceiling.
 */
function progressiveTax(income: number, rows: [number, number][]): number {
  let tax = 0;
  let previous = 0;
  for (const [ceiling, rate] of rows) {
    if (income <= previous) break;
    tax += (Math.min(income, ceiling) - previous) * rate;
    previous = ceiling;
  }
  return Math.max(0, tax);
}

/**
 * Resolve a filing status onto one of New Jersey's two rate schedules.
 * Per the NJ-1040 Tax Rate Schedules: Table A covers Single and
 * Married/CU partner filing separately; Table B covers Married/CU couple
 * filing jointly, Head of household, and Qualifying widow(er)/surviving
 * CU partner. Head of household therefore uses the joint schedule, not Table A.
 */
function njScheduleFor(status: FilingStatusKey): "single" | "married" {
  return status === "married" || status === "head" ? "married" : "single";
}

// ---------------------------------------------------------------------------
// State configurations
// ---------------------------------------------------------------------------

// --- Pennsylvania (PA) ---
const paConfig: StateTaxConfig = {
  abbr: "PA",
  name: "Pennsylvania",
  type: "flat",
  hasStateIncomeTax: true,
  displayRate: "3.07%",
  hasStandardDeduction: false,
  hasPersonalExemptions: false,
  // PA grants no standard deduction, no personal exemption and no per-dependent
  // exemption — the flat rate applies to every dollar. Relief for dependents comes
  // only through Tax Forgiveness (Schedule SP), which is eligibility-income based
  // and is out of scope for this estimator.
  hasDependentExemptions: false,
  dependentsAffectTax: false,
  calculate: (income, _status, _dependents) => {
    const rate = 0.0307;
    const stateTaxableIncome = Math.max(0, income);
    const stateTax = stateTaxableIncome * rate;
    return {
      stateTax,
      stateTaxableIncome,
      effectiveStateRate: income > 0 ? (stateTax / income) * 100 : 0,
      details: { flatRate: 3.07 },
    };
  },
};

// --- Georgia (GA) ---
const gaStandardDeduction: Record<FilingStatusKey, number> = {
  single: 15000,
  head: 15000,
  married: 30000,
  separate: 15000,
};

const gaConfig: StateTaxConfig = {
  abbr: "GA",
  name: "Georgia",
  type: "flat",
  hasStateIncomeTax: true,
  displayRate: "4.99%",
  hasStandardDeduction: true,
  hasPersonalExemptions: false,
  hasDependentExemptions: true,
  dependentsAffectTax: true,
  standardDeduction: gaStandardDeduction,
  dependentExemptionAmount: 5000,
  calculate: (income, status, dependents) => {
    const rate = 0.0499;
    const stdDed = gaStandardDeduction[status];
    const depExemption = Math.max(0, dependents) * 5000;
    const stateTaxableIncome = Math.max(0, income - stdDed - depExemption);
    const stateTax = stateTaxableIncome * rate;
    return {
      stateTax,
      stateTaxableIncome,
      effectiveStateRate: income > 0 ? (stateTax / income) * 100 : 0,
      details: {
        standardDeduction: stdDed,
        dependentExemption: depExemption,
        taxableIncome: stateTaxableIncome,
      },
    };
  },
};

// --- New Jersey (NJ) ---
const newJerseyRows: Record<"single" | "married", [number, number][]> = {
  single: [
    [20000, 0.014],
    [35000, 0.0175],
    [40000, 0.035],
    [75000, 0.05525],
    [500000, 0.0637],
    [1000000, 0.0897],
    [Infinity, 0.1075],
  ],
  married: [
    [20000, 0.014],
    [50000, 0.0175],
    [70000, 0.0245],
    [80000, 0.035],
    [150000, 0.05525],
    [500000, 0.0637],
    [1000000, 0.0897],
    [Infinity, 0.1075],
  ],
};

/**
 * New Jersey's dependent exemption is a DEDUCTION from gross income on Form
 * NJ-1040 (line 13), not a credit against tax. Each qualifying dependent
 * reduces New Jersey taxable income by $1,500, so the cash value depends on
 * the filer's marginal rate rather than being a flat dollar-for-dollar cut.
 */
export const NJ_DEPENDENT_EXEMPTION = 1500;

/** NJ regular personal exemption: $1,000 for the filer, doubled on a joint return. */
export const NJ_PERSONAL_EXEMPTION = 1000;

const njConfig: StateTaxConfig = {
  abbr: "NJ",
  name: "New Jersey",
  type: "progressive",
  hasStateIncomeTax: true,
  displayRate: "1.4% – 10.75%",
  hasStandardDeduction: false,
  hasPersonalExemptions: false,
  hasDependentExemptions: true,
  dependentsAffectTax: true,
  dependentExemptionAmount: NJ_DEPENDENT_EXEMPTION,
  calculate: (income, status, dependents) => {
    const njStatus = njScheduleFor(status);
    const rows = newJerseyRows[njStatus];
    const dependentExemption =
      Math.max(0, dependents) * NJ_DEPENDENT_EXEMPTION;
    // The second $1,000 is for a spouse/CU partner, so only an actual joint
    // return doubles it — a head of household files alone despite sharing
    // the joint rate schedule.
    const personalExemption =
      status === "married" ? NJ_PERSONAL_EXEMPTION * 2 : NJ_PERSONAL_EXEMPTION;
    const stateTaxableIncome = Math.max(
      0,
      income - dependentExemption - personalExemption,
    );
    const stateTax = progressiveTax(stateTaxableIncome, rows);
    // Count the bracket the filer actually lands in, not just the ones cleared.
    const bracketsUsed =
      rows.filter(([c]) => stateTaxableIncome > c).length +
      (stateTaxableIncome > 0 ? 1 : 0);
    return {
      stateTax,
      stateTaxableIncome,
      effectiveStateRate: income > 0 ? (stateTax / income) * 100 : 0,
      details: {
        taxableIncome: stateTaxableIncome,
        bracketsUsed,
        personalExemption,
        dependentExemption,
      },
    };
  },
};

// --- Utah (UT) ---
/**
 * Utah's taxpayer tax credit, per Form TC-40 lines 11–20:
 *   initial credit = 6% × (Utah personal exemptions + federal standard deduction)
 *   phase-out      = 1.3% × (income over the base phase-out amount)
 *   credit         = max(0, initial − phase-out)
 * The credit therefore grows with the number of dependents and shrinks as
 * income rises. Base phase-out amounts are the latest published (2025) figures;
 * they are indexed annually.
 * Rate: 4.45%, S.B. 60 (2026), retroactive to January 1, 2026.
 */
export const UT_RATE = 0.0445;
export const UT_PERSONAL_EXEMPTION = 2111; // per dependent, TC-40 line 11
export const UT_CREDIT_RATE = 0.06;
export const UT_PHASEOUT_RATE = 0.013;
export const utPhaseOutBase: Record<FilingStatusKey, number> = {
  single: 18213,
  married: 36426,
  separate: 18213,
  head: 27320,
};

const utConfig: StateTaxConfig = {
  abbr: "UT",
  name: "Utah",
  type: "flat",
  hasStateIncomeTax: true,
  displayRate: "4.45%",
  hasStandardDeduction: false,
  hasPersonalExemptions: false,
  // Dependents raise the taxpayer credit rather than reducing taxable income,
  // so they are handled inside calculate() rather than as a flat exemption.
  hasDependentExemptions: false,
  dependentsAffectTax: true,
  calculate: (income, status, dependents) => {
    const federal = statusByKey[status];
    const exemptionAmount =
      Math.max(0, dependents) * UT_PERSONAL_EXEMPTION;
    const creditBase = exemptionAmount + federal.standardDeduction;
    const baseCredit = creditBase * UT_CREDIT_RATE;
    const creditPhaseout =
      Math.max(0, income - utPhaseOutBase[status]) * UT_PHASEOUT_RATE;
    const credit = Math.max(0, baseCredit - creditPhaseout);
    const grossTax = income * UT_RATE;
    const stateTax = Math.max(0, grossTax - credit);
    return {
      stateTax,
      stateTaxableIncome: income,
      effectiveStateRate: income > 0 ? (stateTax / income) * 100 : 0,
      details: {
        flatRate: UT_RATE * 100,
        exemptionAmount,
        baseCredit,
        creditPhaseout: Math.min(creditPhaseout, baseCredit),
        actualCredit: credit,
        grossTax,
      },
    };
  },
};

// --- Connecticut (CT) ---
/**
 * Connecticut's Tax Calculation Schedule (Form CT-1040). Three separate
 * schedules — single/married-filing-separately, head of household, and married
 * filing jointly — each with seven brackets running 2% → 6.99%. Rows are
 * [ceiling, rate] on Connecticut taxable income (after the personal exemption).
 *
 * This is the single source of truth: the CT page renders its published bracket
 * tables and its worked FAQ example from these rows so the prose and the
 * calculator can never disagree.
 */
export type CtScheduleKey = "single" | "head" | "married";

export const connecticutRows: Record<CtScheduleKey, [number, number][]> = {
  single: [
    [10000, 0.02],
    [50000, 0.045],
    [100000, 0.055],
    [200000, 0.06],
    [250000, 0.065],
    [500000, 0.069],
    [Infinity, 0.0699],
  ],
  head: [
    [16000, 0.02],
    [80000, 0.045],
    [160000, 0.055],
    [320000, 0.06],
    [400000, 0.065],
    [800000, 0.069],
    [Infinity, 0.0699],
  ],
  married: [
    [20000, 0.02],
    [100000, 0.045],
    [200000, 0.055],
    [400000, 0.06],
    [500000, 0.065],
    [1000000, 0.069],
    [Infinity, 0.0699],
  ],
};

/** Map a filing status onto one of Connecticut's three schedules. */
export function ctScheduleFor(status: FilingStatusKey): CtScheduleKey {
  if (status === "married") return "married";
  if (status === "head") return "head";
  return "single"; // single and married filing separately share a schedule
}

/**
 * Connecticut personal exemption, Form CT-1040 TCS Table A. The exemption is
 * reduced by $1,000 for each $1,000 (or part) of Connecticut AGI above the
 * phase-out threshold, reaching zero well before middle-income levels.
 */
export const ctExemptionMax: Record<FilingStatusKey, number> = {
  single: 15000,
  head: 19000,
  married: 24000,
  separate: 12000,
};

export const ctExemptionPhaseStart: Record<FilingStatusKey, number> = {
  single: 30000,
  head: 38000,
  married: 48000,
  separate: 24000,
};

/** Connecticut personal exemption for a given CT AGI, after Table A phase-out. */
export function ctExemptionFor(
  income: number,
  status: FilingStatusKey,
): number {
  const max = ctExemptionMax[status];
  const start = ctExemptionPhaseStart[status];
  if (income <= start) return max;
  // Table A bands are "more than X but less than X+1,000", and the final row is
  // "and up", so a CT AGI landing exactly on a $1,000 boundary takes the next step.
  const steps = Math.floor((income - start) / 1000) + 1;
  return Math.max(0, max - steps * 1000);
}

/** Connecticut tax on an already-exempted taxable amount. */
export function ctProgressiveTax(
  taxable: number,
  schedule: CtScheduleKey,
): number {
  return progressiveTax(Math.max(0, taxable), connecticutRows[schedule]);
}

/**
 * Connecticut's Table C and Table D are both stepped surcharges on Connecticut
 * AGI: once AGI passes a threshold, a fixed amount is added for every step (or
 * part of a step) above it, until a cap is reached. A phase is
 * [threshold, stepSize, amountPerStep, maxSteps].
 */
type CtStepPhase = [number, number, number, number];

function ctSteppedAmount(agi: number, phases: CtStepPhase[]): number {
  let total = 0;
  for (const [threshold, step, amount, maxSteps] of phases) {
    if (agi > threshold) {
      total += amount * Math.min(maxSteps, Math.ceil((agi - threshold) / step));
    }
  }
  return total;
}

/**
 * Table C — 2% Tax Rate Phase-Out Add-Back. Recaptures the benefit of the 2%
 * bottom bracket from higher earners. The cap equals that benefit exactly:
 * (4.5% − 2%) × the width of the 2% bracket — $250 single, $500 joint,
 * $400 head of household, $250 married filing separately.
 */
const ctPhaseOutAddBackPhases: Record<FilingStatusKey, CtStepPhase[]> = {
  single: [[56500, 5000, 25, 10]],
  married: [[100500, 5000, 50, 10]],
  separate: [[50250, 2500, 25, 10]],
  head: [[78500, 4000, 40, 10]],
};

export function ctPhaseOutAddBack(
  agi: number,
  status: FilingStatusKey,
): number {
  return ctSteppedAmount(Math.max(0, agi), ctPhaseOutAddBackPhases[status]);
}

/**
 * Table D — Tax Recapture. Claws back the benefit of the lower brackets from
 * high earners in three stepped stages, maxing out at $3,400 single / $6,800
 * joint / $5,320 head of household. Married filing separately shares the
 * single column.
 */
const ctRecapturePhases: Record<FilingStatusKey, CtStepPhase[]> = {
  single: [
    [105000, 5000, 25, 10],
    [200000, 5000, 90, 30],
    [500000, 5000, 50, 9],
  ],
  separate: [
    [105000, 5000, 25, 10],
    [200000, 5000, 90, 30],
    [500000, 5000, 50, 9],
  ],
  married: [
    [210000, 10000, 50, 10],
    [400000, 10000, 180, 30],
    [1000000, 10000, 100, 9],
  ],
  head: [
    [168000, 8000, 40, 10],
    [320000, 8000, 140, 30],
    [800000, 8000, 80, 9],
  ],
};

export function ctTaxRecapture(agi: number, status: FilingStatusKey): number {
  return ctSteppedAmount(Math.max(0, agi), ctRecapturePhases[status]);
}

const ctConfig: StateTaxConfig = {
  abbr: "CT",
  name: "Connecticut",
  type: "progressive",
  hasStateIncomeTax: true,
  displayRate: "2% – 6.99%",
  // Connecticut has no standard deduction — only a personal exemption, and it
  // phases out with income, so it cannot be shown as a fixed per-status figure.
  hasStandardDeduction: false,
  hasPersonalExemptions: true,
  hasDependentExemptions: false,
  dependentsAffectTax: false,
  calculate: (income, status, _dependents) => {
    // Form CT-1040 Tax Calculation Schedule, in order:
    //   L2 exemption (Table A) → L3 taxable → L4 initial tax (Table B)
    //   → L5 phase-out add-back (Table C) → L7 recapture (Table D)
    const exemption = ctExemptionFor(income, status);
    const stateTaxableIncome = Math.max(0, income - exemption);
    const initialTax = ctProgressiveTax(
      stateTaxableIncome,
      ctScheduleFor(status),
    );
    const phaseOutAddBack = ctPhaseOutAddBack(income, status);
    const taxRecapture = ctTaxRecapture(income, status);
    const stateTax = initialTax + phaseOutAddBack + taxRecapture;
    return {
      stateTax,
      stateTaxableIncome,
      effectiveStateRate: income > 0 ? (stateTax / income) * 100 : 0,
      details: {
        exemptionAmount: exemption,
        taxableIncome: stateTaxableIncome,
        initialTax,
        ...(phaseOutAddBack > 0 ? { phaseOutAddBack } : {}),
        ...(taxRecapture > 0 ? { taxRecapture } : {}),
      },
    };
  },
};

// --- Florida (FL) ---
const flConfig: StateTaxConfig = {
  abbr: "FL",
  name: "Florida",
  type: "none",
  hasStateIncomeTax: false,
  displayRate: "0%",
  hasStandardDeduction: false,
  hasPersonalExemptions: false,
  hasDependentExemptions: false,
  dependentsAffectTax: false,
  calculate: (income, _status, _dependents) => ({
    stateTax: 0,
    stateTaxableIncome: 0,
    effectiveStateRate: 0,
    details: {},
  }),
};

// --- Tennessee (TN) ---
const tnConfig: StateTaxConfig = {
  abbr: "TN",
  name: "Tennessee",
  type: "none",
  hasStateIncomeTax: false,
  displayRate: "0%",
  hasStandardDeduction: false,
  hasPersonalExemptions: false,
  hasDependentExemptions: false,
  dependentsAffectTax: false,
  calculate: (income, _status, _dependents) => ({
    stateTax: 0,
    stateTaxableIncome: 0,
    effectiveStateRate: 0,
    details: {},
  }),
};

// ---------------------------------------------------------------------------
// Config registry
// ---------------------------------------------------------------------------

export const stateTaxConfigs: Record<string, StateTaxConfig> = {
  PA: paConfig,
  GA: gaConfig,
  NJ: njConfig,
  UT: utConfig,
  CT: ctConfig,
  FL: flConfig,
  TN: tnConfig,
};

// ---------------------------------------------------------------------------
// Total tax (federal + state)
// ---------------------------------------------------------------------------

/**
 * Calculate combined federal and state income tax for a given state.
 * Uses the federal ordinary tax schedule from qualifiedDividends.ts and the
 * state-specific config from stateTaxConfigs.
 */
export function calculateTotalTax(
  income: number,
  status: FilingStatusKey,
  dependents: number,
  stateAbbr: string,
): TotalTaxResult {
  const safeIncome = Math.max(0, income);
  const federalStatus = statusByKey[status] as CapitalGainsStatus | undefined;
  if (!federalStatus) {
    throw new Error(`Unknown filing status: ${status}`);
  }

  const federalTaxableIncome = Math.max(0, safeIncome - federalStatus.standardDeduction);
  const federalTax = ordinaryTax(federalTaxableIncome, federalStatus);

  const stateConfig = stateTaxConfigs[stateAbbr.toUpperCase()];
  if (!stateConfig) {
    throw new Error(`Unsupported state: ${stateAbbr}`);
  }

  const stateResult = stateConfig.calculate(safeIncome, status, dependents);
  const totalTax = federalTax + stateResult.stateTax;
  const effectiveRate = safeIncome > 0 ? (totalTax / safeIncome) * 100 : 0;

  return {
    federalTax,
    stateTax: stateResult.stateTax,
    totalTax,
    effectiveRate,
    federalTaxableIncome,
    stateTaxableIncome: stateResult.stateTaxableIncome,
    stateDetails: stateResult.details,
  };
}
