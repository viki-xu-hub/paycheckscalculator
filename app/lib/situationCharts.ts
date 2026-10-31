// Worked-example figures shared by the state situation pages and the SVG chart
// generator (scripts/generate-situation-charts.ts), so the chart and the table
// on each page always show the same numbers.

import { calculatePaycheck, PAY_PERIODS } from "./payroll";
import {
  bonusAggregateMethod,
  bonusFlatMethod,
  dependentCreditAnnual,
  stateBonusWithholding,
  supportWithholding,
  withStateBonusTax,
} from "./paycheckExtras";
import { situationPath, situationStateByCode, type SituationKind } from "./stateSituations";

export const EXAMPLE_SALARY = 75000;
export const EXAMPLE_SUPPORT_MONTHLY = 800;
export const CHART_WIDTH = 960;
export const CHART_HEIGHT = 420;

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function bonusExample(code: string, bonus: number) {
  const state = situationStateByCode[code];
  const shared = {
    state: state.code,
    supplementalRate: state.bonus.supplementalRate,
    bonus,
    regularAnnualWages: EXAMPLE_SALARY,
    frequency: "biweekly" as const,
    status: "single" as const,
    stateAllowances: state.dependents.defaultPersonal,
  };
  const flat = withStateBonusTax(bonusFlatMethod({ bonus, regularAnnualWages: EXAMPLE_SALARY }), stateBonusWithholding({ ...shared, method: "flat" }));
  const aggregate = withStateBonusTax(
    bonusAggregateMethod({ bonus, regularAnnualWages: EXAMPLE_SALARY, frequency: "biweekly", status: "single" }),
    stateBonusWithholding({ ...shared, method: "aggregate" }),
  );
  return { bonus, flat, aggregate };
}

// $75,000, married filing jointly, bi-weekly, two personal state allowances plus one per child.
export function dependentsExamples(code: string) {
  const state = situationStateByCode[code];
  const personal = state.dependents.formName ? 2 : 0;
  const run = (allowances: number) =>
    calculatePaycheck({ grossAnnual: EXAMPLE_SALARY, frequency: "biweekly", status: "married", state: state.code, stateAllowances: allowances });
  const base = run(personal);
  return [0, 1, 2, 3, 4].map(children => {
    const { credit } = dependentCreditAnnual({ qualifyingChildren: children, otherDependents: 0, annualIncome: EXAMPLE_SALARY, status: "married" });
    const federalSaved = Math.min(base.federal, credit);
    const withKids = run(personal + (state.dependents.formName ? children : 0));
    const stateSaved = base.stateIncomeTax - withKids.stateIncomeTax;
    const netAnnual = withKids.netAnnual + federalSaved;
    return { children, federalSaved, stateSaved, netAnnual, netPerCheck: netAnnual / 26 };
  });
}

// $800 monthly order, single filer, bi-weekly, no other family supported, support current.
export function supportExamples(code: string) {
  const state = situationStateByCode[code];
  const fee = state.childSupport.fee;
  const periods = PAY_PERIODS.biweekly;
  return [35000, 50000, 75000, 100000, 150000].map(salary => {
    const paycheck = calculatePaycheck({ grossAnnual: salary, frequency: "biweekly", status: "single", state: state.code, stateAllowances: state.dependents.defaultPersonal });
    const disposable =
      Math.max(0, salary - paycheck.federal - paycheck.socialSecurity - paycheck.medicare - paycheck.stateIncomeTax - paycheck.statePayrollPremiums) / periods;
    const support = (EXAMPLE_SUPPORT_MONTHLY * 12) / periods;
    const ordered = support * (fee?.kind === "percentOfSupport" ? 1 + fee.rate : 1);
    const limit = supportWithholding({ disposablePerPaycheck: disposable, orderedPerPaycheck: ordered, supportsOtherFamily: false, arrearsOverTwelveWeeks: false });
    const payorFee = fee?.kind === "monthly" ? (fee.amount * 12) / periods : fee?.kind === "perDeduction" ? fee.after : 0;
    const withheld = limit.applied + payorFee;
    return { salary, disposable, limit: limit.ceiling, withheld, takeHome: paycheck.netAnnual / periods - withheld };
  });
}

export function situationChartFile(slug: string, kind: SituationKind) {
  return `${situationPath(slug, kind).slice(1)}.svg`;
}

export function situationChartData(code: string, kind: SituationKind) {
  const state = situationStateByCode[code];
  const file = situationChartFile(state.slug, kind);
  const keyword = `${state.name} paycheck calculator with ${kind.replace("-", " ")}`;

  if (kind === "bonus") {
    const { bonus, flat, aggregate } = bonusExample(code, 5000);
    const row = (label: string, b: typeof flat) => ({
      label,
      net: b.net,
      federal: b.federal,
      fica: b.socialSecurity + b.medicare,
      state: b.stateIncomeTax,
    });
    return {
      kind: "bonus" as const,
      file,
      bonus,
      rows: [row("Separate check", flat), row("Added to paycheck", aggregate)],
      title: `${state.name} bonus take-home pay: separate check vs aggregate method`,
      heading: `Where a ${usd(bonus)} ${state.name} bonus goes`,
      sub: `$75,000 salary · single · bi-weekly · 2026 withholding`,
      alt: `${keyword} example: a ${usd(bonus)} bonus on a $75,000 salary takes home ${usd(flat.net)} on a separate check and ${usd(aggregate.net)} when added to a paycheck${state.noIncomeTax ? `, with no ${state.name} income tax` : `, after ${usd(flat.stateIncomeTax)} of ${state.name} income tax on the separate check`}.`,
    };
  }

  if (kind === "dependents") {
    const rows = dependentsExamples(code);
    return {
      kind: "dependents" as const,
      file,
      rows: rows.map(r => ({ label: r.children === 1 ? "1 child" : `${r.children} children`, value: r.netPerCheck })),
      title: `${state.name} bi-weekly take-home pay by number of children`,
      heading: `${state.name} take-home pay by number of children`,
      sub: `$75,000 salary · married filing jointly · bi-weekly · 2026 W-4${state.dependents.formName ? ` and ${state.dependents.formName}` : ""}`,
      alt: `${keyword} example: on a $75,000 salary, bi-weekly take-home pay rises from ${usd(rows[0].netPerCheck)} with no children to ${usd(rows[1].netPerCheck)} with one child and ${usd(rows[2].netPerCheck)} with two.`,
    };
  }

  const rows = supportExamples(code);
  const mid = rows[2];
  return {
    kind: "child-support" as const,
    file,
    rows: rows.map(r => ({ label: `${usd(r.salary)}/yr`, disposable: r.disposable, withheld: r.withheld, limit: r.limit })),
    title: `${state.name} child support withholding vs disposable earnings`,
    heading: `${state.name} paycheck with an $800/month support order`,
    sub: "Single filer · bi-weekly · support current · federal 60% limit",
    alt: `${keyword} example: an $800 monthly order withholds ${usd(mid.withheld)} from each bi-weekly check on a $75,000 salary, well under the ${usd(mid.limit)} federal limit, leaving ${usd(mid.takeHome)} take-home.`,
  };
}
