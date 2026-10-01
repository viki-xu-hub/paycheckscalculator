"use client";

import { useMemo, useState } from "react";
import { CalcShell, Grid, NumField, SelectField, Headline, Rows, Row, Note, fmt2, fmt0 } from "./CalcKit";
import { calculatePaycheck, type SupportedState, type FilingStatus, type PayFrequency } from "../lib/payroll";

const PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

// 2026 elective deferral limit for 401(k)/403(b)/457 salary reductions.
const DEFERRAL_LIMIT = 24500;
const CATCH_UP = 8000;

const STATES: { value: SupportedState; label: string }[] = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" }, { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" }, { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" }, { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" }, { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" }, { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" }, { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" }, { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" }, { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" }, { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" }, { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" }, { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NYC", label: "New York City resident" }, { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" }, { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" }, { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" }, { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" }, { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
];

/**
 * Shows what raising a 401(k) deferral actually costs per paycheck. The point
 * of the tool is the gap between the two numbers: a traditional contribution
 * comes out of pre-tax wages, so take-home falls by less than the amount saved.
 */
export default function Retirement401kCalculator() {
  const [salary, setSalary] = useState(75000);
  const [freq, setFreq] = useState<PayFrequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [state, setState] = useState<SupportedState>("CA");
  const [currentPct, setCurrentPct] = useState(3);
  const [newPct, setNewPct] = useState(10);
  const [matchPct, setMatchPct] = useState(50);
  const [matchLimitPct, setMatchLimitPct] = useState(6);
  const [age50, setAge50] = useState<"no" | "yes">("no");

  const r = useMemo(() => {
    const periods = PERIODS[freq];
    const gross = Math.max(0, salary);
    const base = { grossAnnual: gross, frequency: freq, status, state } as const;

    const before = calculatePaycheck({ ...base, retirementPercent: Math.max(0, currentPct) });
    const after = calculatePaycheck({ ...base, retirementPercent: Math.max(0, newPct) });

    const netBefore = before.netAnnual / periods;
    const netAfter = after.netAnnual / periods;
    const takeHomeDrop = netBefore - netAfter;

    const contribBefore = before.retirementAnnual / periods;
    const contribAfter = after.retirementAnnual / periods;
    const extraContribution = contribAfter - contribBefore;

    // Tax saved is the part of the extra contribution that never cost you take-home pay.
    const taxSaved = Math.max(0, extraContribution - takeHomeDrop);
    const costPerDollar = extraContribution > 0 ? takeHomeDrop / extraContribution : 0;

    const matchedPct = Math.min(Math.max(0, newPct), Math.max(0, matchLimitPct));
    const employerMatchAnnual = gross * (matchedPct / 100) * (Math.max(0, matchPct) / 100);

    const limit = DEFERRAL_LIMIT + (age50 === "yes" ? CATCH_UP : 0);
    const annualContribution = after.retirementAnnual;

    return {
      periods, netBefore, netAfter, takeHomeDrop, contribAfter, extraContribution,
      taxSaved, costPerDollar,
      employerMatchPerPeriod: employerMatchAnnual / periods,
      annualContribution,
      totalAnnualIntoAccount: annualContribution + employerMatchAnnual,
      overLimit: annualContribution > limit,
      limit,
      leavingMatchOnTable: newPct < matchLimitPct && matchPct > 0,
      shortfallPct: Math.max(0, matchLimitPct - newPct),
    };
  }, [salary, freq, status, state, currentPct, newPct, matchPct, matchLimitPct, age50]);

  return (
    <CalcShell eyebrow="401(k) Paycheck Impact" title="What raising your contribution really costs">
      <Grid>
        <NumField label="Annual salary" value={salary} onChange={setSalary} step={1000} />
        <SelectField<PayFrequency>
          label="Pay frequency"
          value={freq}
          onChange={setFreq}
          options={[
            { value: "weekly", label: "Weekly (52)" },
            { value: "biweekly", label: "Biweekly (26)" },
            { value: "semimonthly", label: "Semimonthly (24)" },
            { value: "monthly", label: "Monthly (12)" },
          ]}
        />
        <SelectField<FilingStatus>
          label="W-4 filing status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "single", label: "Single or married filing separately" },
            { value: "married", label: "Married filing jointly" },
            { value: "head", label: "Head of household" },
          ]}
        />
        <SelectField<SupportedState> label="State" value={state} onChange={setState} options={STATES} />
        <NumField label="Current contribution" value={currentPct} onChange={setCurrentPct} step={1} min={0} max={100} suffix="% of pay" />
        <NumField label="New contribution" value={newPct} onChange={setNewPct} step={1} min={0} max={100} suffix="% of pay" />
        <NumField label="Employer matches" value={matchPct} onChange={setMatchPct} step={5} min={0} max={200} suffix="% of what you put in" />
        <NumField label="…up to this much of pay" value={matchLimitPct} onChange={setMatchLimitPct} step={1} min={0} max={100} suffix="% of pay" />
        <SelectField<"no" | "yes">
          label="Age 50 or over"
          value={age50}
          onChange={setAge50}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes — catch-up eligible" },
          ]}
        />
      </Grid>

      <Headline
        label={`Take-home pay falls by this much per ${freq === "monthly" ? "month" : "paycheck"}`}
        value={fmt2(r.takeHomeDrop)}
        note={`…to put ${fmt2(r.extraContribution)} more into your 401(k). Every extra dollar saved costs you ${fmt2(r.costPerDollar)} of take-home pay.`}
      />

      <Rows>
        <Row label="Take-home now" value={fmt2(r.netBefore)} />
        <Row label="Take-home after the change" value={fmt2(r.netAfter)} strong />
        <Row label="Your contribution per paycheck" value={fmt2(r.contribAfter)} />
        <Row label="Employer match per paycheck" value={fmt2(r.employerMatchPerPeriod)} />
        <Row label="Federal and state tax saved per paycheck" value={fmt2(r.taxSaved)} />
        <Row label="Your contributions this year" value={fmt0(r.annualContribution)} />
        <Row label="Total into the account this year" value={fmt0(r.totalAnnualIntoAccount)} strong />
      </Rows>

      {r.leavingMatchOnTable && (
        <Note>
          At {newPct}% you are below the {matchLimitPct}% your employer matches, so you are leaving{" "}
          {r.shortfallPct} percentage points of matched money unclaimed. Contributing up to the
          match limit is the part of this decision with a guaranteed return.
        </Note>
      )}

      {r.overLimit && (
        <Note>
          {fmt0(r.annualContribution)} is above the {fmt0(r.limit)} elective deferral limit for 2026
          {age50 === "yes" ? " including the age-50 catch-up" : ""}. Payroll will usually stop your
          contributions once you reach it, which means your last paychecks of the year arrive larger
          than the figures above.
        </Note>
      )}

      <Note>
        Traditional pre-tax contributions only. They reduce federal and most state income tax but
        not Social Security or Medicare, which is why take-home falls by less than you contribute
        but by more than nothing. Roth 401(k) contributions come out of after-tax pay, so there your
        take-home falls by the full amount. Pennsylvania and a few other states tax contributions
        when they are made rather than when they are withdrawn.
      </Note>
    </CalcShell>
  );
}
