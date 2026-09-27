"use client";

import { useMemo, useState } from "react";
import { CalcShell, Grid, NumField, Headline, Rows, Row, Note, fmt2 } from "./CalcKit";

/**
 * Overtime pay calculator. Follows the FLSA rule: hours over 40 in a workweek
 * are paid at 1.5× the regular rate. Double time is not federally required but
 * is common in union and California scheduling, so it is offered separately.
 */
export default function OvertimeCalculator() {
  const [rate, setRate] = useState(25);
  const [regularHours, setRegularHours] = useState(40);
  const [otHours, setOtHours] = useState(5);
  const [dtHours, setDtHours] = useState(0);

  const r = useMemo(() => {
    const otRate = rate * 1.5;
    const dtRate = rate * 2;
    const regularPay = rate * Math.max(0, regularHours);
    const otPay = otRate * Math.max(0, otHours);
    const dtPay = dtRate * Math.max(0, dtHours);
    const weekly = regularPay + otPay + dtPay;
    // The premium is the part above straight time — the piece the OBBBA
    // overtime deduction is based on.
    const premium = otPay - rate * Math.max(0, otHours) + (dtPay - rate * Math.max(0, dtHours));
    return {
      otRate,
      dtRate,
      regularPay,
      otPay,
      dtPay,
      weekly,
      premium,
      annual: weekly * 52,
      annualPremium: premium * 52,
    };
  }, [rate, regularHours, otHours, dtHours]);

  return (
    <CalcShell eyebrow="Overtime Pay Calculator" title="What your overtime hours are worth">
      <Grid>
        <NumField label="Regular hourly rate" value={rate} onChange={setRate} step={0.5} />
        <NumField label="Regular hours this week" value={regularHours} onChange={setRegularHours} step={1} max={40} />
        <NumField label="Overtime hours (1.5×)" value={otHours} onChange={setOtHours} step={1} />
        <NumField label="Double-time hours (2×)" value={dtHours} onChange={setDtHours} step={1} />
      </Grid>

      <Headline
        label="Gross pay this week"
        value={fmt2(r.weekly)}
        note={`About ${fmt2(r.annual)} a year if every week looks like this`}
      />

      <Rows>
        <Row label={`Regular pay — ${regularHours} h × ${fmt2(rate)}`} value={fmt2(r.regularPay)} />
        <Row label={`Overtime — ${otHours} h × ${fmt2(r.otRate)} (time and a half)`} value={fmt2(r.otPay)} />
        {dtHours > 0 && (
          <Row label={`Double time — ${dtHours} h × ${fmt2(r.dtRate)}`} value={fmt2(r.dtPay)} />
        )}
        <Row label="Overtime premium (the half above straight time)" value={fmt2(r.premium)} />
        <Row label="Gross for the week" value={fmt2(r.weekly)} strong />
      </Rows>

      <Note>
        Time and a half on {fmt2(rate)} is <strong>{fmt2(r.otRate)}</strong> an hour. The premium
        line — {fmt2(r.premium)} a week, about {fmt2(r.annualPremium)} a year — is the portion that
        counts as qualified overtime compensation for the federal overtime deduction, not the whole
        overtime payment. Overtime is taxed as ordinary wages; there is no separate overtime tax
        rate.
      </Note>
    </CalcShell>
  );
}
