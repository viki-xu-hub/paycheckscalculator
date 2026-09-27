"use client";

import { useMemo, useState } from "react";
import { CalcShell, Grid, NumField, SelectField, Headline, Rows, Row, Note, fmt2 } from "./CalcKit";

type Method = "supplemental" | "aggregate";

const SUPPLEMENTAL_RATE = 0.22;
const SUPPLEMENTAL_HIGH_RATE = 0.37;
const SUPPLEMENTAL_THRESHOLD = 1000000;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const SS_WAGE_BASE = 184500;

/**
 * Severance and accrued-PTO payouts are supplemental wages: taxable as ordinary
 * income and subject to FICA, usually withheld at the 22% flat supplemental
 * rate. Withholding is not the final tax — the return settles up.
 */
export default function SeveranceTaxCalculator() {
  const [severance, setSeverance] = useState(20000);
  const [ptoPayout, setPtoPayout] = useState(4000);
  const [ytdWages, setYtdWages] = useState(70000);
  const [stateRate, setStateRate] = useState(0);
  const [method, setMethod] = useState<Method>("supplemental");

  const r = useMemo(() => {
    const gross = Math.max(0, severance) + Math.max(0, ptoPayout);
    const fedRate =
      method === "supplemental"
        ? gross > SUPPLEMENTAL_THRESHOLD
          ? SUPPLEMENTAL_HIGH_RATE
          : SUPPLEMENTAL_RATE
        : SUPPLEMENTAL_RATE;
    const federal = gross * fedRate;
    // Social Security only applies up to the wage base, counting wages already paid.
    const ssRoom = Math.max(0, SS_WAGE_BASE - Math.max(0, ytdWages));
    const ss = Math.min(gross, ssRoom) * SS_RATE;
    const medicare = gross * MEDICARE_RATE;
    const state = gross * (Math.max(0, stateRate) / 100);
    const withheld = federal + ss + medicare + state;
    return {
      gross,
      fedRate,
      federal,
      ss,
      medicare,
      state,
      withheld,
      net: gross - withheld,
      ssCapped: ssRoom < gross,
      effective: gross > 0 ? (withheld / gross) * 100 : 0,
    };
  }, [severance, ptoPayout, ytdWages, stateRate, method]);

  return (
    <CalcShell eyebrow="Severance & PTO Payout Tax" title="What you keep from a separation package">
      <Grid>
        <NumField label="Severance amount" value={severance} onChange={setSeverance} step={1000} />
        <NumField label="Accrued PTO / vacation payout" value={ptoPayout} onChange={setPtoPayout} step={500} />
        <NumField label="Wages already paid this year" value={ytdWages} onChange={setYtdWages} step={1000} />
        <NumField label="State rate" value={stateRate} onChange={setStateRate} step={0.5} suffix="%" />
        <SelectField<Method>
          label="Withholding method"
          value={method}
          onChange={setMethod}
          options={[
            { value: "supplemental", label: "Flat supplemental (most common)" },
            { value: "aggregate", label: "Aggregate with regular pay" },
          ]}
        />
      </Grid>

      <Headline
        label="Estimated net payout"
        value={fmt2(r.net)}
        note={`${r.effective.toFixed(1)}% withheld from ${fmt2(r.gross)} gross`}
      />

      <Rows>
        <Row label="Gross severance + PTO" value={fmt2(r.gross)} strong />
        <Row label={`Federal withholding — ${(r.fedRate * 100).toFixed(0)}% supplemental`} value={`− ${fmt2(r.federal)}`} />
        <Row
          label={r.ssCapped ? "Social Security — 6.2% (wage base reached)" : "Social Security — 6.2%"}
          value={`− ${fmt2(r.ss)}`}
        />
        <Row label="Medicare — 1.45%" value={`− ${fmt2(r.medicare)}`} />
        {stateRate > 0 && <Row label={`State — ${stateRate}%`} value={`− ${fmt2(r.state)}`} />}
        <Row label="Net payout" value={fmt2(r.net)} strong />
      </Rows>

      <Note>
        Severance is ordinary W-2 wages, not a gift and not capital gains — it is taxed at your
        normal rates and it is subject to FICA. The flat 22% you see withheld is a withholding
        convention, not your tax rate: if your marginal rate is lower you get the difference back
        at filing, and if it is higher you will owe. Accrued vacation paid out at separation is
        treated the same way. Unemployment benefits, if you claim them, are taxable federally too
        but are not subject to FICA.
      </Note>
    </CalcShell>
  );
}
