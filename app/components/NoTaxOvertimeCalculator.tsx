"use client";

import { useMemo, useState } from "react";
import {
  CalcShell,
  Grid,
  NumField,
  SelectField,
  Headline,
  Rows,
  Row,
  Note,
  fmt0,
  fmt2,
} from "./CalcKit";
import { ordinaryTax, statusByKey } from "../lib/qualifiedDividends";
import {
  OT_DEDUCTION_CAP,
  OT_PHASEOUT_START,
  otDeductionFor,
} from "../lib/overtimeDeduction";

type Status = "single" | "married";

/**
 * Estimates the One Big Beautiful Bill qualified-overtime deduction and what it
 * is worth in federal income tax. The deduction applies to the premium half of
 * FLSA time-and-a-half only, so the input asks for that figure rather than
 * total overtime pay.
 */
export default function NoTaxOvertimeCalculator() {
  const [status, setStatus] = useState<Status>("single");
  const [magi, setMagi] = useState(85000);
  const [premium, setPremium] = useState(6000);

  const r = useMemo(() => {
    const d = otDeductionFor(premium, magi, status);
    const fed = statusByKey[status];
    const taxableBefore = Math.max(0, magi - fed.standardDeduction);
    const taxableAfter = Math.max(0, magi - fed.standardDeduction - d.deduction);
    const taxBefore = ordinaryTax(taxableBefore, fed);
    const taxAfter = ordinaryTax(taxableAfter, fed);
    return { ...d, taxBefore, taxAfter, saved: taxBefore - taxAfter };
  }, [premium, magi, status]);

  return (
    <CalcShell
      eyebrow="No Tax on Overtime · 2025–2028"
      title="What the overtime deduction is actually worth"
    >
      <Grid>
        <SelectField<Status>
          label="Filing status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "single", label: "Single" },
            { value: "married", label: "Married filing jointly" },
          ]}
        />
        <NumField label="Modified AGI" value={magi} onChange={setMagi} step={1000} />
        <NumField
          label="Overtime premium for the year"
          value={premium}
          onChange={setPremium}
          step={500}
        />
      </Grid>

      <Headline
        label="Federal income tax saved"
        value={fmt2(r.saved)}
        note={
          r.deduction === 0
            ? "No deduction available at this income"
            : `From a ${fmt0(r.deduction)} deduction against taxable income`
        }
      />

      <Rows>
        <Row label="Qualified overtime premium entered" value={fmt0(premium)} />
        <Row label={`Statutory cap (${status === "married" ? "joint" : "single"})`} value={fmt0(r.cap)} />
        {r.phaseout > 0 && (
          <Row
            label={`Phase-out — $100 per $1,000 over ${fmt0(OT_PHASEOUT_START[status])}`}
            value={`− ${fmt0(r.phaseout)}`}
          />
        )}
        <Row label="Deduction you can claim" value={fmt0(r.deduction)} strong />
        <Row label="Federal income tax without it" value={fmt2(r.taxBefore)} />
        <Row label="Federal income tax with it" value={fmt2(r.taxAfter)} />
      </Rows>

      <Note>
        This is an income-tax deduction claimed on your return, not a payroll-tax exemption —
        Social Security (6.2%) and Medicare (1.45%) still come out of every overtime hour, and
        most states tax the overtime too. The cap is {fmt0(OT_DEDUCTION_CAP.single)} single and{" "}
        {fmt0(OT_DEDUCTION_CAP.married)} joint, and it shrinks by $100 for every $1,000 of modified
        AGI above {fmt0(OT_PHASEOUT_START.single)} ({fmt0(OT_PHASEOUT_START.married)} joint).
      </Note>
    </CalcShell>
  );
}
