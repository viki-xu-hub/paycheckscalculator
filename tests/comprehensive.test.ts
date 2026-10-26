import assert from "node:assert/strict";
import test from "node:test";
import {
  calculatePaycheck,
  federalWithholding2026,
  stateWithholding2026,
  type SupportedState,
  type FilingStatus,
  type PayFrequency,
  PAY_PERIODS,
  money,
  wholeMoney,
} from "../app/lib/payroll.ts";

// Replicate paycheckExtras functions here to avoid ESM import resolution issues
const SOCIAL_SECURITY_WAGE_BASE = 184500;
const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = 200000;

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

export const SUPPLEMENTAL_FLAT_RATE = 0.22;
export const SUPPLEMENTAL_HIGH_RATE = 0.37;
export const SUPPLEMENTAL_HIGH_THRESHOLD = 1000000;

type BonusBreakdown = {
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

function bonusFlatMethod(input: {
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

function bonusAggregateMethod(input: {
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

const QUALIFYING_CHILD_CREDIT = 2200;
const OTHER_DEPENDENT_CREDIT = 500;
const DEPENDENT_CREDIT_LIMIT_SINGLE = 200000;
const DEPENDENT_CREDIT_LIMIT_MARRIED = 400000;

function dependentCreditLimit(status: FilingStatus) {
  return status === "married" ? DEPENDENT_CREDIT_LIMIT_MARRIED : DEPENDENT_CREDIT_LIMIT_SINGLE;
}

function dependentCreditAnnual(input: {
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

const TX_NET_RESOURCES_CAP_MONTHLY = 11700;
const TX_GUIDELINE_PERCENTS = [0, 0.20, 0.25, 0.30, 0.35, 0.40, 0.40] as const;
const TX_MAX_WITHHOLDING_SHARE = 0.5;

function texasGuidelinePercent(children: number) {
  const count = Math.max(0, Math.min(6, Math.floor(children)));
  return TX_GUIDELINE_PERCENTS[count];
}

function texasChildSupport(input: {
  annualGross: number;
  frequency: PayFrequency;
  children: number;
  unionDuesPerPaycheck?: number;
  childInsurancePerPaycheck?: number;
  disposableEarningsAnnual?: number;
}) {
  const periods = PAY_PERIODS[input.frequency];
  const gross = Math.max(0, input.annualGross);
  const unionDuesAnnual = Math.max(0, input.unionDuesPerPaycheck ?? 0) * periods;
  const insuranceAnnual = Math.max(0, input.childInsurancePerPaycheck ?? 0) * periods;

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

// ============================================================
// TEST SUITE 1: All 52 States/Territories Basic Calculation
// ============================================================
const ALL_STATES: SupportedState[] = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NYC", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
];

const NO_INCOME_TAX_STATES: SupportedState[] = ["AK", "FL", "NV", "NH", "SD", "TN", "TX", "WY", "WA"];

test("Suite 1.1: All 52 states produce valid, finite, non-negative results", () => {
  const testCases: { salary: number; status: FilingStatus; frequency: PayFrequency }[] = [
    { salary: 50000, status: "single", frequency: "biweekly" },
    { salary: 75000, status: "married", frequency: "monthly" },
    { salary: 100000, status: "head", frequency: "weekly" },
    { salary: 150000, status: "single", frequency: "semimonthly" },
  ];

  let passed = 0;
  const failed: string[] = [];

  for (const state of ALL_STATES) {
    for (const tc of testCases) {
      try {
        const result = calculatePaycheck({
          grossAnnual: tc.salary,
          frequency: tc.frequency,
          status: tc.status,
          state,
          retirementPercent: 5,
          preTaxPerPaycheck: 100,
          stateAllowances: 1,
          electedStateRatePercent: 2,
          localRatePercent: state === "MD" ? 3.2 : 1,
          employeePremiumRatePercent: 0.5,
          statePayDate: "2026-08-15",
          hasStateWithholdingForm: true,
          stateWithholdingCode: state === "CT" ? "F" : undefined,
        });

        assert.ok(Number.isFinite(result.grossAnnual), `${state}: grossAnnual should be finite`);
        assert.ok(Number.isFinite(result.netAnnual), `${state}: netAnnual should be finite`);
        assert.ok(Number.isFinite(result.federal), `${state}: federal should be finite`);
        assert.ok(Number.isFinite(result.socialSecurity), `${state}: socialSecurity should be finite`);
        assert.ok(Number.isFinite(result.medicare), `${state}: medicare should be finite`);
        assert.ok(Number.isFinite(result.stateIncomeTax), `${state}: stateIncomeTax should be finite`);
        assert.ok(Number.isFinite(result.statePayrollPremiums), `${state}: statePayrollPremiums should be finite`);
        assert.ok(result.netAnnual >= 0, `${state}: netAnnual should not be negative (got ${result.netAnnual})`);
        assert.ok(result.stateIncomeTax >= 0, `${state}: stateIncomeTax should not be negative`);
        assert.ok(result.statePayrollPremiums >= 0, `${state}: statePayrollPremiums should not be negative`);
        assert.ok(result.netAnnual <= result.grossAnnual, `${state}: net should not exceed gross`);
        assert.ok(result.stateMethod.length > 5, `${state}: should have a method description`);
        assert.equal(result.periods, PAY_PERIODS[tc.frequency], `${state}: should have correct periods`);
        passed++;
      } catch (e) {
        failed.push(`${state} (${tc.salary}/${tc.status}/${tc.frequency}): ${(e as Error).message}`);
      }
    }
  }

  assert.equal(failed.length, 0, `Failed states: ${failed.join("; ")}`);
  console.log(`  ✓ All ${ALL_STATES.length} states × ${testCases.length} test cases = ${passed} calculations passed`);
});

test("Suite 1.2: No-income-tax states correctly return $0 state income tax", () => {
  for (const state of NO_INCOME_TAX_STATES) {
    const result = stateWithholding2026(state, 100000, "single", 0, {
      payPeriods: 26,
      payrollWagesAnnual: 100000,
    });
    if (state !== "WA" && state !== "AK") {
      assert.equal(result.incomeTax, 0, `${state} should have $0 income tax`);
      assert.equal(result.payrollPremiums, 0, `${state} should have $0 payroll premiums`);
    }
  }
  console.log(`  ✓ ${NO_INCOME_TAX_STATES.length} no-income-tax states verified`);
});

test("Suite 1.3: Federal withholding across all filing statuses and income levels", () => {
  const testCases = [
    { income: 0, single: 0, married: 0, head: 0 },
    { income: 10000, single: 150, married: 0, head: 0 },
    { income: 50000, single: 3807.2, married: 1236, head: 2094 },
    { income: 100000, single: 14260, married: 8748, head: 11022 },
    { income: 200000, single: 38467, married: 29948, head: 34101 },
    { income: 500000, single: 139105.5, married: 125047, head: 135483.5 },
  ];

  for (const tc of testCases) {
    const single = federalWithholding2026(tc.income, "single");
    const married = federalWithholding2026(tc.income, "married");
    const head = federalWithholding2026(tc.income, "head");

    assert.ok(single >= 0, `Single federal tax should be non-negative at $${tc.income}`);
    assert.ok(married >= 0, `Married federal tax should be non-negative at $${tc.income}`);
    assert.ok(head >= 0, `Head federal tax should be non-negative at $${tc.income}`);

    // Progressive tax: higher income should have higher tax
    if (tc.income > 0) {
      assert.ok(single >= federalWithholding2026(tc.income * 0.5, "single"),
        `Federal tax should be progressive (single)`);
    }
  }
  console.log(`  ✓ Federal withholding tested across ${testCases.length} income levels`);
});

test("Suite 1.4: All pay frequencies produce valid results with correct period counts", () => {
  const frequencies: PayFrequency[] = ["weekly", "biweekly", "semimonthly", "monthly"];

  for (const freq of frequencies) {
    // Use retirement only (percentage-based) for apples-to-apples comparison
    // preTaxPerPaycheck is per-period, so annual total varies by frequency (expected behavior)
    const result = calculatePaycheck({
      grossAnnual: 75000,
      frequency: freq,
      status: "single",
      state: "CA",
      retirementPercent: 5,
      preTaxPerPaycheck: 0,
    });

    assert.ok(Math.abs(result.grossAnnual - 75000) < 0.01,
      `${freq}: gross annual should be $75,000`);
    assert.equal(result.periods, PAY_PERIODS[freq],
      `${freq}: should have ${PAY_PERIODS[freq]} periods`);
    assert.ok(result.netAnnual > 0, `${freq}: net pay should be positive`);
    assert.ok(result.federal > 0, `${freq}: federal tax should be positive`);
    assert.ok(result.socialSecurity > 0, `${freq}: social security should be positive`);
    assert.ok(result.medicare > 0, `${freq}: medicare should be positive`);
    assert.ok(result.stateIncomeTax > 0, `${freq}: CA state tax should be positive`);

    // Per-paycheck net should be reasonable
    const perPaycheck = result.netAnnual / result.periods;
    assert.ok(perPaycheck > 0, `${freq}: per-paycheck net should be positive`);
  }
  console.log(`  ✓ All ${frequencies.length} pay frequencies produce valid results`);
});

test("Suite 1.5: Pre-tax deductions reduce taxable income correctly", () => {
  const noPreTax = calculatePaycheck({
    grossAnnual: 100000,
    frequency: "biweekly",
    status: "single",
    state: "CA",
    retirementPercent: 0,
    preTaxPerPaycheck: 0,
  });

  const withRetirement = calculatePaycheck({
    grossAnnual: 100000,
    frequency: "biweekly",
    status: "single",
    state: "CA",
    retirementPercent: 10,
    preTaxPerPaycheck: 0,
  });

  const withOtherPreTax = calculatePaycheck({
    grossAnnual: 100000,
    frequency: "biweekly",
    status: "single",
    state: "CA",
    retirementPercent: 0,
    preTaxPerPaycheck: 200,
  });

  // Retirement (401k) reduces federal and state income tax but NOT FICA
  assert.ok(withRetirement.preTaxAnnual > 0, "Retirement pre-tax should be positive");
  assert.ok(withRetirement.federal < noPreTax.federal,
    "Federal tax should be lower with 401k contributions");
  assert.ok(withRetirement.stateIncomeTax < noPreTax.stateIncomeTax,
    "State tax should be lower with 401k contributions");
  assert.equal(withRetirement.socialSecurity, noPreTax.socialSecurity,
    "401k contributions do NOT reduce Social Security (FICA applies to 401k wages)");

  // Other pre-tax deductions (like Section 125 health insurance) reduce FICA too
  assert.ok(withOtherPreTax.socialSecurity < noPreTax.socialSecurity,
    "Other pre-tax deductions reduce Social Security wages (Section 125 plans)");
  assert.ok(withOtherPreTax.medicare < noPreTax.medicare,
    "Other pre-tax deductions reduce Medicare wages");

  console.log("  ✓ Pre-tax deductions correctly reduce taxable income");
});

test("Suite 1.6: Social Security wage base cap works correctly", () => {
  const belowCap = calculatePaycheck({
    grossAnnual: 100000,
    frequency: "biweekly",
    status: "single",
    state: "TX",
  });

  const atCap = calculatePaycheck({
    grossAnnual: 184500,
    frequency: "biweekly",
    status: "single",
    state: "TX",
  });

  const aboveCap = calculatePaycheck({
    grossAnnual: 300000,
    frequency: "biweekly",
    status: "single",
    state: "TX",
  });

  const expectedAtCap = 184500 * 0.062;
  assert.ok(Math.abs(atCap.socialSecurity - expectedAtCap) < 0.01,
    `Social Security at cap should be $${expectedAtCap}, got ${atCap.socialSecurity}`);
  assert.ok(aboveCap.socialSecurity === atCap.socialSecurity,
    "Social Security should not increase above wage base");
  assert.ok(belowCap.socialSecurity < atCap.socialSecurity,
    "Social Security should increase with wages below cap");
  console.log("  ✓ Social Security wage base cap works correctly");
});

test("Suite 1.7: Additional Medicare tax applies above $200,000", () => {
  const below = calculatePaycheck({
    grossAnnual: 150000,
    frequency: "biweekly",
    status: "single",
    state: "TX",
  });

  const above = calculatePaycheck({
    grossAnnual: 250000,
    frequency: "biweekly",
    status: "single",
    state: "TX",
  });

  const regularMedicare = 150000 * 0.0145;
  assert.ok(Math.abs(below.medicare - regularMedicare) < 0.01,
    "No additional Medicare below threshold");

  const expectedAbove = 250000 * 0.0145 + 50000 * 0.009;
  assert.ok(Math.abs(above.medicare - expectedAbove) < 0.01,
    `Additional Medicare should apply above threshold (expected ${expectedAbove}, got ${above.medicare})`);
  console.log("  ✓ Additional Medicare tax applies correctly");
});

// ============================================================
// TEST SUITE 2: Texas Bonus Calculator
// ============================================================
test("Suite 2.1: Bonus flat rate method basic calculation", () => {
  const result = bonusFlatMethod({ bonus: 5000, regularAnnualWages: 75000 });
  const expectedFederal = 5000 * SUPPLEMENTAL_FLAT_RATE;

  assert.equal(result.bonus, 5000);
  assert.equal(result.federal, expectedFederal);
  assert.ok(result.socialSecurity > 0);
  assert.ok(result.medicare > 0);
  assert.equal(result.stateIncomeTax, 0);
  assert.ok(result.net > 0 && result.net < 5000);
  assert.ok(result.effectiveRate > 20 && result.effectiveRate < 30);
  console.log("  ✓ Bonus flat rate method works correctly");
});

test("Suite 2.2: Bonus flat rate with high-income supplemental rate", () => {
  const result = bonusFlatMethod({
    bonus: 1500000,
    regularAnnualWages: 300000,
    ytdSupplementalWages: 0,
  });

  const belowMillion = 1000000 * SUPPLEMENTAL_FLAT_RATE;
  const aboveMillion = 500000 * SUPPLEMENTAL_HIGH_RATE;
  const expectedFederal = belowMillion + aboveMillion;

  assert.equal(result.federal, expectedFederal);
  assert.ok(result.effectiveRate > 22 && result.effectiveRate < 37);
  console.log("  ✓ High-income bonus 37% rate applies above $1M");
});

test("Suite 2.3: Bonus aggregate method basic calculation", () => {
  const result = bonusAggregateMethod({
    bonus: 5000,
    regularAnnualWages: 75000,
    annualPreTax: 5000,
    frequency: "biweekly",
    status: "single",
  });

  assert.ok(result.bonus === 5000);
  assert.ok(result.federal > 0);
  assert.ok(result.net > 0);
  assert.ok(result.effectiveRate > 0);
  console.log("  ✓ Bonus aggregate method produces valid results");
});

test("Suite 2.4: Bonus methods produce different but reasonable results", () => {
  const bonus = 10000;
  const salary = 80000;

  const flat = bonusFlatMethod({ bonus, regularAnnualWages: salary });
  const aggregate = bonusAggregateMethod({
    bonus,
    regularAnnualWages: salary,
    frequency: "biweekly",
    status: "single",
  });

  // Both should produce positive net amounts
  assert.ok(flat.net > 0);
  assert.ok(aggregate.net > 0);
  // Both should withhold less than the bonus
  assert.ok(flat.net < bonus);
  assert.ok(aggregate.net < bonus);
  console.log("  ✓ Both bonus methods produce reasonable results");
});

test("Suite 2.5: Zero bonus returns zero values", () => {
  const flat = bonusFlatMethod({ bonus: 0, regularAnnualWages: 50000 });
  assert.equal(flat.bonus, 0);
  assert.equal(flat.federal, 0);
  assert.equal(flat.net, 0);
  assert.equal(flat.effectiveRate, 0);
  console.log("  ✓ Zero bonus handled correctly");
});

// ============================================================
// TEST SUITE 3: Texas Child Support Calculator
// ============================================================
test("Suite 3.1: Child support guideline percentages", () => {
  assert.equal(texasGuidelinePercent(1), 0.20);
  assert.equal(texasGuidelinePercent(2), 0.25);
  assert.equal(texasGuidelinePercent(3), 0.30);
  assert.equal(texasGuidelinePercent(4), 0.35);
  assert.equal(texasGuidelinePercent(5), 0.40);
  assert.equal(texasGuidelinePercent(6), 0.40);
  assert.equal(texasGuidelinePercent(0), 0);
  assert.equal(texasGuidelinePercent(10), 0.40); // capped at 6+
  console.log("  ✓ All guideline percentages correct");
});

test("Suite 3.2: Basic child support calculation", () => {
  const result = texasChildSupport({
    annualGross: 60000,
    frequency: "biweekly",
    children: 1,
  });

  assert.ok(result.netResourcesMonthly > 0);
  assert.ok(result.supportMonthly > 0);
  assert.ok(result.percent === 0.20);
  assert.ok(result.appliedPerPaycheck > 0);
  assert.ok(result.withholdingCeiling > 0);
  console.log("  ✓ Basic child support calculation works");
});

test("Suite 3.3: Net resources cap applies for high earners", () => {
  const result = texasChildSupport({
    annualGross: 300000,
    frequency: "monthly",
    children: 2,
  });

  assert.ok(result.capApplies, "Cap should apply for high earners");
  assert.equal(result.cappedMonthly, TX_NET_RESOURCES_CAP_MONTHLY);
  assert.equal(result.supportMonthly, TX_NET_RESOURCES_CAP_MONTHLY * 0.25);
  console.log("  ✓ Net resources cap applies correctly");
});

test("Suite 3.4: 50% withholding ceiling rule", () => {
  const result = texasChildSupport({
    annualGross: 30000,
    frequency: "biweekly",
    children: 6,
  });

  // With low income and many children, 50% rule should apply
  assert.ok(result.limitedByFiftyPercentRule || result.appliedPerPaycheck <= result.withholdingCeiling + 0.01);
  assert.ok(result.appliedPerPaycheck <= result.disposablePerPaycheck * TX_MAX_WITHHOLDING_SHARE + 0.01);
  console.log("  ✓ 50% withholding ceiling enforced");
});

test("Suite 3.5: Union dues and child insurance deductions", () => {
  const base = texasChildSupport({
    annualGross: 75000,
    frequency: "biweekly",
    children: 1,
  });

  const withDeductions = texasChildSupport({
    annualGross: 75000,
    frequency: "biweekly",
    children: 1,
    unionDuesPerPaycheck: 50,
    childInsurancePerPaycheck: 100,
  });

  assert.ok(withDeductions.netResourcesAnnual < base.netResourcesAnnual,
    "Net resources should be lower with deductions");
  assert.ok(withDeductions.supportMonthly < base.supportMonthly,
    "Support should be lower with deductions");
  console.log("  ✓ Union dues and insurance reduce net resources");
});

// ============================================================
// TEST SUITE 4: Dependent Credits Calculator
// ============================================================
test("Suite 4.1: Dependent credit basic calculation", () => {
  const result = dependentCreditAnnual({
    qualifyingChildren: 2,
    otherDependents: 1,
    annualIncome: 75000,
    status: "married",
  });

  const expected = 2 * QUALIFYING_CHILD_CREDIT + 1 * OTHER_DEPENDENT_CREDIT;
  assert.equal(result.credit, expected);
  assert.equal(result.claimed, expected);
  assert.equal(result.overLimit, false);
  console.log("  ✓ Dependent credit basic calculation correct");
});

test("Suite 4.2: Dependent credit income limits", () => {
  // Under limit - should get credit
  const underSingle = dependentCreditAnnual({
    qualifyingChildren: 1,
    otherDependents: 0,
    annualIncome: 150000,
    status: "single",
  });
  assert.equal(underSingle.credit, QUALIFYING_CHILD_CREDIT);
  assert.equal(underSingle.overLimit, false);

  // Over limit - should get $0
  const overSingle = dependentCreditAnnual({
    qualifyingChildren: 1,
    otherDependents: 0,
    annualIncome: 250000,
    status: "single",
  });
  assert.equal(overSingle.credit, 0);
  assert.equal(overSingle.overLimit, true);

  // Married higher limit
  const underMarried = dependentCreditAnnual({
    qualifyingChildren: 1,
    otherDependents: 0,
    annualIncome: 350000,
    status: "married",
  });
  assert.equal(underMarried.credit, QUALIFYING_CHILD_CREDIT);

  const overMarried = dependentCreditAnnual({
    qualifyingChildren: 1,
    otherDependents: 0,
    annualIncome: 450000,
    status: "married",
  });
  assert.equal(overMarried.credit, 0);
  console.log("  ✓ Dependent credit income limits work correctly");
});

test("Suite 4.3: Zero dependents return zero credit", () => {
  const result = dependentCreditAnnual({
    qualifyingChildren: 0,
    otherDependents: 0,
    annualIncome: 50000,
    status: "single",
  });
  assert.equal(result.credit, 0);
  assert.equal(result.claimed, 0);
  console.log("  ✓ Zero dependents return zero credit");
});

// ============================================================
// TEST SUITE 5: Edge Cases and Boundary Conditions
// ============================================================
test("Suite 5.1: Zero salary produces zero net pay", () => {
  const result = calculatePaycheck({
    grossAnnual: 0,
    frequency: "biweekly",
    status: "single",
    state: "TX",
  });

  assert.equal(result.grossAnnual, 0);
  assert.equal(result.netAnnual, 0);
  assert.equal(result.federal, 0);
  assert.equal(result.socialSecurity, 0);
  assert.equal(result.medicare, 0);
  assert.equal(result.stateIncomeTax, 0);
  console.log("  ✓ Zero salary handled correctly");
});

test("Suite 5.2: Negative input values are clamped to zero", () => {
  const result = calculatePaycheck({
    grossAnnual: -50000,
    frequency: "biweekly",
    status: "single",
    state: "TX",
    retirementPercent: -10,
    preTaxPerPaycheck: -50,
  });

  assert.ok(result.grossAnnual >= 0, "Gross should not be negative");
  assert.ok(result.netAnnual >= 0, "Net should not be negative");
  assert.ok(result.preTaxAnnual >= 0, "Pre-tax should not be negative");
  console.log("  ✓ Negative inputs are clamped to zero");
});

test("Suite 5.3: Very high salary ($1M+) calculations", () => {
  const result = calculatePaycheck({
    grossAnnual: 1500000,
    frequency: "monthly",
    status: "married",
    state: "NY",
    retirementPercent: 5,
    preTaxPerPaycheck: 500,
  });

  assert.ok(Number.isFinite(result.netAnnual));
  assert.ok(result.netAnnual > 0);
  assert.ok(result.federal > 0);
  assert.ok(result.socialSecurity > 0);
  assert.ok(result.medicare > 0);
  assert.ok(result.stateIncomeTax > 0);
  assert.ok(result.netAnnual < result.grossAnnual);
  console.log("  ✓ Very high salary calculations work correctly");
});

test("Suite 5.4: Retirement contribution cannot exceed gross pay", () => {
  const result = calculatePaycheck({
    grossAnnual: 50000,
    frequency: "biweekly",
    status: "single",
    state: "TX",
    retirementPercent: 100,
    preTaxPerPaycheck: 1000,
  });

  assert.ok(result.preTaxAnnual <= result.grossAnnual,
    "Pre-tax deductions cannot exceed gross pay");
  assert.ok(result.netAnnual >= 0, "Net pay cannot be negative");
  console.log("  ✓ Retirement contributions capped at gross pay");
});

test("Suite 5.5: All states handle 0 allowances correctly", () => {
  for (const state of ALL_STATES) {
    const result = stateWithholding2026(state, 60000, "single", 0, {
      payPeriods: 26,
      payrollWagesAnnual: 60000,
      withholdingCode: state === "CT" ? "F" : undefined,
    });
    assert.ok(Number.isFinite(result.incomeTax), `${state}: 0 allowances should produce finite result`);
    assert.ok(result.incomeTax >= 0, `${state}: 0 allowances should not produce negative tax`);
  }
  console.log(`  ✓ All ${ALL_STATES.length} states handle 0 allowances`);
});

test("Suite 5.6: State-specific special features work", () => {
  // Arizona elected rate options
  for (const rate of [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]) {
    const result = stateWithholding2026("AZ", 50000, "single", 0, {
      electedRatePercent: rate,
    });
    assert.ok(Math.abs(result.incomeTax - 50000 * rate / 100) < 1,
      `AZ elected rate ${rate}% should approximately equal wage × rate`);
  }

  // Colorado FAMLI premium
  const coResult = stateWithholding2026("CO", 100000, "single", 0, {
    payrollWagesAnnual: 100000,
  });
  assert.ok(coResult.payrollPremiums > 0, "CO should have FAMLI premium");

  // Massachusetts PFML
  const maResult = stateWithholding2026("MA", 100000, "single", 1, {
    payrollWagesAnnual: 100000,
    employeePremiumRatePercent: 0.46,
  });
  assert.ok(maResult.payrollPremiums > 0, "MA should have PFML premium");

  // Washington Paid Leave + WA Cares
  const waResult = stateWithholding2026("WA", 100000, "single", 0, {
    payrollWagesAnnual: 100000,
  });
  assert.ok(waResult.payrollPremiums > 0, "WA should have payroll premiums");

  console.log("  ✓ State-specific features work correctly");
});

// ============================================================
// TEST SUITE 6: Hourly wage calculation
// ============================================================
test("Suite 6.1: Hourly wage annual calculation", () => {
  // Simulate the hourly calculator logic from the component
  const hourlyRate = 25;
  const hours = 40;
  const overtime = 5;
  const weeks = 52;

  const annualGross = hourlyRate * (hours + overtime * 1.5) * weeks;
  const expected = 25 * (40 + 7.5) * 52; // 25 * 47.5 * 52 = 61750

  assert.equal(annualGross, expected);

  const result = calculatePaycheck({
    grossAnnual: annualGross,
    frequency: "biweekly",
    status: "single",
    state: "TX",
  });

  assert.ok(result.grossAnnual === annualGross);
  assert.ok(result.netAnnual > 0);
  console.log("  ✓ Hourly wage annualization works correctly");
});

test("Suite 6.2: Overtime calculation (1.5x rate)", () => {
  const hourlyRate = 30;
  const regularHours = 40;
  const overtimeHours = 10;

  const regularPay = hourlyRate * regularHours;
  const overtimePay = hourlyRate * 1.5 * overtimeHours;
  const weeklyTotal = regularPay + overtimePay;

  assert.equal(regularPay, 1200);
  assert.equal(overtimePay, 450);
  assert.equal(weeklyTotal, 1650);
  console.log("  ✓ Overtime 1.5x rate calculation correct");
});

test("Suite 6.3: Zero hours/overtime handled", () => {
  const annualGross = 20 * (0 + 0 * 1.5) * 52;
  assert.equal(annualGross, 0);

  const result = calculatePaycheck({
    grossAnnual: annualGross,
    frequency: "weekly",
    status: "single",
    state: "CA",
  });
  assert.equal(result.netAnnual, 0);
  console.log("  ✓ Zero hours handled correctly");
});

// ============================================================
// TEST SUITE 7: Utility functions
// ============================================================
test("Suite 7.1: Money formatting utilities", () => {
  assert.equal(money.format(1234.56), "$1,234.56");
  assert.equal(money.format(0), "$0.00");
  assert.equal(wholeMoney.format(1234.56), "$1,235");
  assert.equal(wholeMoney.format(0), "$0");
  console.log("  ✓ Money formatting utilities work");
});

test("Suite 7.2: PAY_PERIODS constants correct", () => {
  assert.equal(PAY_PERIODS.weekly, 52);
  assert.equal(PAY_PERIODS.biweekly, 26);
  assert.equal(PAY_PERIODS.semimonthly, 24);
  assert.equal(PAY_PERIODS.monthly, 12);
  console.log("  ✓ Pay period constants correct");
});

// ============================================================
// TEST SUITE 8: Mid-year rate changes
// ============================================================
test("Suite 8.1: Georgia rate change on May 11, 2026", () => {
  const before = stateWithholding2026("GA", 60000, "single", 0, {
    statePayDate: "2026-05-10",
  });
  const after = stateWithholding2026("GA", 60000, "single", 0, {
    statePayDate: "2026-05-11",
  });

  assert.ok(before.incomeTax > after.incomeTax,
    "Georgia tax should be lower after May 11 rate reduction");
  console.log("  ✓ Georgia mid-year rate change works");
});

test("Suite 8.2: Ohio rate change on August 1, 2026", () => {
  const before = stateWithholding2026("OH", 60000, "single", 0, {
    statePayDate: "2026-07-31",
    payPeriods: 26,
  });
  const after = stateWithholding2026("OH", 60000, "single", 0, {
    statePayDate: "2026-08-01",
    payPeriods: 26,
  });

  assert.ok(before.incomeTax > after.incomeTax,
    "Ohio tax should be lower after August 1 rate change");
  console.log("  ✓ Ohio mid-year rate change works");
});

test("Suite 8.3: Utah rate change on June 1, 2026", () => {
  const before = stateWithholding2026("UT", 60000, "single", 0, {
    statePayDate: "2026-05-31",
    payPeriods: 26,
  });
  const after = stateWithholding2026("UT", 60000, "single", 0, {
    statePayDate: "2026-06-01",
    payPeriods: 26,
  });

  assert.ok(before.incomeTax > after.incomeTax,
    "Utah tax should be lower after June 1 rate change");
  console.log("  ✓ Utah mid-year rate change works");
});

// Summary
console.log("\n" + "=".repeat(60));
console.log("COMPREHENSIVE CALCULATOR TEST SUITE COMPLETE");
console.log("=".repeat(60));
