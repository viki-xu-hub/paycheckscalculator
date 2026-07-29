import assert from "node:assert/strict";
import test from "node:test";
import { calculatePaycheck, federalWithholding2026, stateWithholding2026, type SupportedState } from "../app/lib/payroll.ts";

test("uses the 2026 IRS annual percentage method", () => {
  assert.equal(federalWithholding2026(52000, "single"), 4060);
});

test("matches the California Method B annual worked example", () => {
  const result = stateWithholding2026("CA", 57000, "married", 4);
  assert.ok(Math.abs(result.incomeTax - 86) < 0.01);
  assert.equal(result.payrollPremiums, 741);
});

test("separates Washington payroll premiums from income tax", () => {
  const result = stateWithholding2026("WA", 100000, "single", 1);
  assert.equal(result.incomeTax, 0);
  assert.ok(result.payrollPremiums > 1300 && result.payrollPremiums < 1400);
});

test("applies published flat withholding rules", () => {
  assert.equal(stateWithholding2026("PA", 100000, "single", 1).incomeTax, 3070);
  assert.ok(Math.abs(stateWithholding2026("IL", 100000, "single", 1).incomeTax - 4805.2125) < 0.001);
});

test("matches the South Carolina WH-1603F worked example", () => {
  const result = stateWithholding2026("SC", 39000, "single", 3);
  assert.ok(Math.abs(result.incomeTax - 549.9) < 0.001);
});

test("matches the North Carolina NC-30 annualized example", () => {
  const result = stateWithholding2026("NC", 23400, "single", 2);
  assert.ok(Math.abs(result.incomeTax - 231.085) < 0.001);
});

test("matches official Alabama and Arkansas worked examples", () => {
  const alabama = stateWithholding2026("AL", 44200, "married", 2, {
    federalWithholdingAnnual: 35.19 * 52,
    payPeriods: 52,
  });
  assert.equal(Math.round(alabama.incomeTax / 52 * 100) / 100, 29.59);

  const arkansas = stateWithholding2026("AR", 2127 * 12, "single", 2, { payPeriods: 12 });
  assert.equal(arkansas.incomeTax / 12, 36.5);
});

test("matches official Georgia, Hawaii, and Idaho examples", () => {
  const georgia = stateWithholding2026("GA", 2000 * 24, "married", 1, { payPeriods: 24, spouseWorks: false, statePayDate: "2026-05-11" });
  assert.equal(Math.round(georgia.incomeTax / 24 * 100) / 100, 27.03);

  const hawaii = stateWithholding2026("HI", 500 * 52, "single", 3, { payPeriods: 52 });
  assert.equal(hawaii.incomeTax / 52, 9.58);

  const idaho = stateWithholding2026("ID", 1000 * 52, "married", 4, { payPeriods: 52 });
  assert.equal(idaho.incomeTax / 52, 7);
});

test("applies the complete Connecticut TPG-211 tables", () => {
  const result = stateWithholding2026("CT", 52000, "single", 0, {
    payPeriods: 26,
    withholdingCode: "A",
  });
  assert.equal(Math.round(result.incomeTax / 26 * 100) / 100, 80.47);
  assert.equal(result.payrollPremiums, 260);
  assert.equal(stateWithholding2026("CT", 52000, "single", 0, { withholdingCode: "E" }).incomeTax, 0);
});

test("switches Ohio formulas on the official August 1, 2026 effective date", () => {
  const input = { payPeriods: 26, localRatePercent: 0 };
  const before = stateWithholding2026("OH", 3000 * 26, "single", 2, { ...input, ohioPayDate: "2026-07-31" });
  const after = stateWithholding2026("OH", 3000 * 26, "single", 2, { ...input, ohioPayDate: "2026-08-15" });
  assert.equal(before.incomeTax / 26, 76.03);
  assert.equal(after.incomeTax / 26, 74.28);
});

test("matches Oklahoma, Oregon, Utah, Virginia, and Wisconsin examples", () => {
  const oklahoma = stateWithholding2026("OK", 1825 * 24, "married", 2, { payPeriods: 24 });
  assert.equal(oklahoma.incomeTax / 24, 37);

  const oregon = stateWithholding2026("OR", 25000, "single", 0, {
    federalWithholdingAnnual: 1000,
    payPeriods: 12,
  });
  assert.equal(Math.round(oregon.incomeTax), 1789);

  assert.equal(stateWithholding2026("UT", 400 * 52, "single", 0, { payPeriods: 52 }).incomeTax / 52, 12);
  assert.equal(stateWithholding2026("UT", 2600 * 26, "single", 0, { payPeriods: 26 }).incomeTax / 26, 116);

  const virginia = stateWithholding2026("VA", 2649 * 24, "single", 5, { payPeriods: 24 });
  assert.equal(virginia.incomeTax / 24, 109.5);

  const wisconsin = stateWithholding2026("WI", 350 * 52, "single", 1, { payPeriods: 52 });
  assert.equal(wisconsin.incomeTax / 52, 7.59);
});

test("adds NYC resident withholding on top of New York State", () => {
  const stateOnly = stateWithholding2026("NY", 90000, "single", 1);
  const nycResident = stateWithholding2026("NYC", 90000, "single", 1);
  assert.ok(nycResident.incomeTax > stateOnly.incomeTax);
  assert.equal(nycResident.payrollPremiums, 388.8);
});

test("uses payroll-program wages before traditional 401(k) reductions", () => {
  const noRetirement = calculatePaycheck({ grossAnnual: 100000, frequency: "biweekly", status: "single", state: "CO" });
  const withRetirement = calculatePaycheck({ grossAnnual: 100000, frequency: "biweekly", status: "single", state: "CO", retirementPercent: 10 });
  assert.equal(noRetirement.statePayrollPremiums, withRetirement.statePayrollPremiums);
  assert.ok(withRetirement.stateIncomeTax < noRetirement.stateIncomeTax);
});

test("every published location code resolves to a finite nonnegative engine result", () => {
  const states: SupportedState[] = ["AL","AZ","AR","CA","CO","CT","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","MD","MA","MI","MN","MO","NC","NE","NV","NJ","NY","NYC","OH","OK","OR","PA","SC","TN","TX","UT","VA","WA","WI"];
  for (const state of states) {
    const result = stateWithholding2026(state, 75000, "single", 1, {
      payPeriods: 26,
      federalWithholdingAnnual: 8000,
      payrollWagesAnnual: 75000,
      withholdingCode: state === "CT" ? "F" : undefined,
      ohioPayDate: "2026-08-01",
    });
    assert.ok(Number.isFinite(result.incomeTax), `${state} income tax should be finite`);
    assert.ok(Number.isFinite(result.payrollPremiums), `${state} premiums should be finite`);
    assert.ok(result.incomeTax >= 0, `${state} income tax should not be negative`);
    assert.ok(result.payrollPremiums >= 0, `${state} premiums should not be negative`);
    assert.ok(result.label.length > 10, `${state} should identify its method`);
  }
});

test("handles current Iowa W-4 dollars and married dual-income status", () => {
  const dualIncome = stateWithholding2026("IA", 100000, "married", 0, { spouseWorks: true, annualStateAllowance: 0 });
  const oneIncome = stateWithholding2026("IA", 100000, "married", 0, { spouseWorks: false, annualStateAllowance: 0 });
  const allowance = stateWithholding2026("IA", 100000, "married", 0, { spouseWorks: true, annualStateAllowance: 500 });
  assert.equal(dualIncome.incomeTax, 3306);
  assert.equal(oneIncome.incomeTax, 2812);
  assert.equal(allowance.incomeTax, 2806);
});

test("handles Missouri spouse-income choice and required whole-dollar paycheck rounding", () => {
  const dualIncome = stateWithholding2026("MO", 35000, "married", 0, { spouseWorks: true, payPeriods: 12 });
  const oneIncome = stateWithholding2026("MO", 35000, "married", 0, { spouseWorks: false, payPeriods: 12 });
  assert.equal(dualIncome.incomeTax / 12, 59);
  assert.equal(oneIncome.incomeTax / 12, 2);
});

test("applies optional local rates and state-certificate choices", () => {
  const kentucky = stateWithholding2026("KY", 50000, "single", 0, { localRatePercent: 1, payrollWagesAnnual: 50000 });
  assert.ok(Math.abs(kentucky.incomeTax - 2132.4) < 0.001);

  const louisianaWithDeduction = stateWithholding2026("LA", 50000, "single", 0, { claimStateStandardDeduction: true });
  const louisianaWithoutDeduction = stateWithholding2026("LA", 50000, "single", 0, { claimStateStandardDeduction: false });
  assert.ok(louisianaWithoutDeduction.incomeTax > louisianaWithDeduction.incomeTax);
  assert.equal(louisianaWithoutDeduction.incomeTax, 1545);

  const indiana = stateWithholding2026("IN", 100000, "single", 1, { dependentAllowances: 2, adoptedChildAllowances: 1, localRatePercent: 1 });
  assert.ok(Math.abs(indiana.incomeTax - 3673.5) < 0.001);
});

test("honors Connecticut no-form fallback and CT-W4 paycheck adjustments", () => {
  const noForm = stateWithholding2026("CT", 52000, "single", 0, { payPeriods: 26 });
  const adjusted = stateWithholding2026("CT", 52000, "single", 0, { payPeriods: 26, withholdingCode: "A", additionalStatePerPaycheck: 10, reducedStatePerPaycheck: 2 });
  assert.equal(noForm.incomeTax, 3634.8);
  assert.equal(Math.round((adjusted.incomeTax / 26) * 100) / 100, 88.47);
});

test("supports Georgia's midyear rate and spouse-income change", () => {
  const before = stateWithholding2026("GA", 48000, "married", 1, { spouseWorks: false, statePayDate: "2026-05-10" });
  const after = stateWithholding2026("GA", 48000, "married", 1, { spouseWorks: false, statePayDate: "2026-05-11" });
  const bothWork = stateWithholding2026("GA", 48000, "married", 1, { spouseWorks: true, statePayDate: "2026-05-11" });
  assert.ok(before.incomeTax > after.incomeTax);
  assert.ok(bothWork.incomeTax > after.incomeTax);
});

test("applies Massachusetts low-wage and qualified deduction rules", () => {
  const lowWage = stateWithholding2026("MA", 7000, "single", 1, { payrollWagesAnnual: 7000, employeePremiumRatePercent: 0 });
  assert.equal(lowWage.incomeTax, 0);
  const regular = stateWithholding2026("MA", 100000, "single", 1, { payrollWagesAnnual: 100000, ficaAnnual: 7650, retirementContributionsAnnual: 5000, employeePremiumRatePercent: 0 });
  assert.equal(regular.incomeTax, 4297.5);
});

test("switches Utah tables for pay periods beginning June 1, 2026", () => {
  const before = stateWithholding2026("UT", 7800 * 12, "married", 0, { payPeriods: 12, statePayDate: "2026-05-31" });
  const after = stateWithholding2026("UT", 7800 * 12, "married", 0, { payPeriods: 12, statePayDate: "2026-06-01" });
  assert.equal(before.incomeTax / 12, 351);
  assert.equal(after.incomeTax / 12, 347);
});

test("uses Oregon transit-tax truncation and Workers Benefit Fund hours", () => {
  const annualWages = 1239.99 * 52;
  const result = stateWithholding2026("OR", annualWages, "single", 1, {
    payPeriods: 52,
    federalWithholdingAnnual: 5000,
    payrollWagesAnnual: annualWages,
    employeePremiumRatePercent: 0,
    annualHours: 2080,
    wbfEmployeeCentsPerHour: .9,
  });
  assert.ok(Math.abs(result.payrollPremiums - (63.96 + 18.72)) < .001);

  const withRetirement = calculatePaycheck({ grossAnnual: 100000, frequency: "biweekly", status: "single", state: "OR", retirementPercent: 10, employeePremiumRatePercent: 0, annualHours: 0 });
  assert.equal(withRetirement.statePayrollPremiums, 89.96);
});

test("applies Virginia E2 exemptions and Wisconsin WT-4 adjustments", () => {
  const virginiaBase = stateWithholding2026("VA", 70000, "single", 1, { payPeriods: 26 });
  const virginiaE2 = stateWithholding2026("VA", 70000, "single", 1, { payPeriods: 26, blindExemptions: 1, additionalStatePerPaycheck: 5 });
  assert.equal(virginiaE2.incomeTax, virginiaBase.incomeTax - 46 + 130);

  const wisconsinBase = stateWithholding2026("WI", 60000, "single", 1, { payPeriods: 26 });
  const wisconsinAdjusted = stateWithholding2026("WI", 60000, "single", 1, { payPeriods: 26, additionalStatePerPaycheck: 10, reducedStatePerPaycheck: 3 });
  assert.equal(wisconsinAdjusted.incomeTax, wisconsinBase.incomeTax + 182);
});
