"use client";

import { useMemo, useState } from "react";
import { CalcShell, Grid, NumField, SelectField, Headline, Rows, Row, Note, fmt2 } from "./CalcKit";
import { calculatePaycheck, type SupportedState, type FilingStatus, type PayFrequency } from "../lib/payroll";

const PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

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
 * Reproduces the lines on a single pay stub so they can be checked against the
 * real one: current-period and year-to-date columns for gross, each withholding
 * line, deductions and net. It checks arithmetic — it does not produce a
 * document, and a stub is only ever issued by an employer.
 */
export default function PayStubCalculator() {
  const [grossPerPeriod, setGrossPerPeriod] = useState(2500);
  const [freq, setFreq] = useState<PayFrequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [state, setState] = useState<SupportedState>("CA");
  const [preTax, setPreTax] = useState(150);
  const [postTax, setPostTax] = useState(40);
  const [periodsPaid, setPeriodsPaid] = useState(17);

  const r = useMemo(() => {
    const total = PERIODS[freq];
    const paid = Math.min(Math.max(1, periodsPaid), total);
    const gross = Math.max(0, grossPerPeriod);
    const annual = gross * total;

    const p = calculatePaycheck({
      grossAnnual: annual,
      frequency: freq,
      status,
      state,
      preTaxPerPaycheck: Math.max(0, preTax),
    });

    const per = (annualAmount: number) => annualAmount / total;
    const federal = per(p.federal);
    const ss = per(p.socialSecurity);
    const med = per(p.medicare);
    const stateTax = per(p.stateIncomeTax);
    const statePremium = per(p.statePayrollPremiums);
    const post = Math.max(0, postTax);
    const net = Math.max(0, per(p.netAnnual) - post);

    return {
      total, paid, gross, federal, ss, med, stateTax, statePremium, post, net,
      method: p.stateMethod,
      hasStateLine: p.stateIncomeTax > 0 || p.statePayrollPremiums > 0,
      takeHomePct: gross > 0 ? (net / gross) * 100 : 0,
    };
  }, [grossPerPeriod, freq, status, state, preTax, postTax, periodsPaid]);

  const ytd = (perPeriod: number) => fmt2(perPeriod * r.paid);

  return (
    <CalcShell eyebrow="Pay Stub Calculator" title="Check every line on your pay stub">
      <Grid>
        <NumField label="Gross pay this period" value={grossPerPeriod} onChange={setGrossPerPeriod} step={50} />
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
        <NumField label="Pre-tax deductions this period" value={preTax} onChange={setPreTax} step={25} />
        <NumField label="Post-tax deductions this period" value={postTax} onChange={setPostTax} step={10} />
        <NumField
          label="Pay periods completed this year"
          value={periodsPaid}
          onChange={setPeriodsPaid}
          step={1}
          min={1}
          max={r.total}
        />
      </Grid>

      <Headline
        label="Net pay this period"
        value={fmt2(r.net)}
        note={`${r.takeHomePct.toFixed(1)}% of gross · year to date ${ytd(r.net)} after ${r.paid} of ${r.total} periods`}
      />

      <Rows>
        <Row label="Gross pay" value={`${fmt2(r.gross)}   ·   YTD ${ytd(r.gross)}`} strong />
        <Row label="Pre-tax deductions" value={`−${fmt2(preTax)}   ·   YTD ${ytd(preTax)}`} />
        <Row label="Federal income tax" value={`−${fmt2(r.federal)}   ·   YTD ${ytd(r.federal)}`} />
        <Row label="Social Security (6.2%)" value={`−${fmt2(r.ss)}   ·   YTD ${ytd(r.ss)}`} />
        <Row label="Medicare (1.45%)" value={`−${fmt2(r.med)}   ·   YTD ${ytd(r.med)}`} />
        <Row label="State income tax" value={`−${fmt2(r.stateTax)}   ·   YTD ${ytd(r.stateTax)}`} />
        {r.statePremium > 0 && (
          <Row label="State payroll programmes" value={`−${fmt2(r.statePremium)}   ·   YTD ${ytd(r.statePremium)}`} />
        )}
        <Row label="Post-tax deductions" value={`−${fmt2(r.post)}   ·   YTD ${ytd(r.post)}`} />
        <Row label="Net pay" value={`${fmt2(r.net)}   ·   YTD ${ytd(r.net)}`} strong />
      </Rows>

      <Note>
        State method: {r.method}. Every line is an estimate built from published 2026 federal and
        state withholding methods — your employer&rsquo;s payroll system may round differently or
        apply elections this form does not capture. This tool checks the arithmetic on a stub you
        already have; it does not create a pay stub, which only an employer can issue.
      </Note>
    </CalcShell>
  );
}
