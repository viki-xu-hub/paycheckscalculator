"use client";

import { useMemo, useState } from "react";
import { CalcShell, Grid, NumField, SelectField, Headline, Rows, Row, Note, fmt2 } from "./CalcKit";

type Method = "supplemental" | "custom";

/** IRS flat supplemental withholding rate on bonuses under $1,000,000. */
const SUPPLEMENTAL_RATE = 22;
const SS_RATE = 6.2;
const MEDICARE_RATE = 1.45;

/**
 * Gross-up: works backwards from a target net payment to the gross an employer
 * must run so the employee nets exactly that amount after withholding.
 * gross = net / (1 − total withholding rate).
 */
export default function GrossUpCalculator() {
  const [net, setNet] = useState(1000);
  const [method, setMethod] = useState<Method>("supplemental");
  const [federalRate, setFederalRate] = useState(SUPPLEMENTAL_RATE);
  const [stateRate, setStateRate] = useState(0);
  const [includeFica, setIncludeFica] = useState<"yes" | "no">("yes");

  const r = useMemo(() => {
    const fed = method === "supplemental" ? SUPPLEMENTAL_RATE : Math.max(0, federalRate);
    const fica = includeFica === "yes" ? SS_RATE + MEDICARE_RATE : 0;
    const totalPct = fed + fica + Math.max(0, stateRate);
    if (totalPct >= 100) {
      return { impossible: true, fed, fica, totalPct, gross: 0, federal: 0, ss: 0, med: 0, state: 0, cost: 0 };
    }
    const gross = Math.max(0, net) / (1 - totalPct / 100);
    return {
      impossible: false,
      fed,
      fica,
      totalPct,
      gross,
      federal: gross * (fed / 100),
      ss: gross * ((includeFica === "yes" ? SS_RATE : 0) / 100),
      med: gross * ((includeFica === "yes" ? MEDICARE_RATE : 0) / 100),
      state: gross * (Math.max(0, stateRate) / 100),
      cost: gross - Math.max(0, net),
    };
  }, [net, method, federalRate, stateRate, includeFica]);

  return (
    <CalcShell eyebrow="Gross-Up Calculator" title="Gross needed to hit a target net">
      <Grid>
        <NumField label="Target net amount" value={net} onChange={setNet} step={100} />
        <SelectField<Method>
          label="Federal method"
          value={method}
          onChange={setMethod}
          options={[
            { value: "supplemental", label: `Supplemental flat ${SUPPLEMENTAL_RATE}%` },
            { value: "custom", label: "Custom rate" },
          ]}
        />
        {method === "custom" && (
          <NumField label="Federal rate" value={federalRate} onChange={setFederalRate} step={1} suffix="%" />
        )}
        <NumField label="State rate" value={stateRate} onChange={setStateRate} step={0.5} suffix="%" />
        <SelectField<"yes" | "no">
          label="Include FICA (7.65%)"
          value={includeFica}
          onChange={setIncludeFica}
          options={[
            { value: "yes", label: "Yes — normal wages" },
            { value: "no", label: "No — FICA already capped" },
          ]}
        />
      </Grid>

      {r.impossible ? (
        <Headline label="Not possible" value="—" note="Withholding rates total 100% or more" />
      ) : (
        <>
          <Headline
            label="Gross to run"
            value={fmt2(r.gross)}
            note={`Costs the employer ${fmt2(r.cost)} above the ${fmt2(net)} the employee receives`}
          />
          <Rows>
            <Row label="Gross payment" value={fmt2(r.gross)} strong />
            <Row label={`Federal withholding — ${r.fed}%`} value={`− ${fmt2(r.federal)}`} />
            {includeFica === "yes" && (
              <>
                <Row label={`Social Security — ${SS_RATE}%`} value={`− ${fmt2(r.ss)}`} />
                <Row label={`Medicare — ${MEDICARE_RATE}%`} value={`− ${fmt2(r.med)}`} />
              </>
            )}
            {stateRate > 0 && <Row label={`State — ${stateRate}%`} value={`− ${fmt2(r.state)}`} />}
            <Row label="Net to employee" value={fmt2(net)} strong />
          </Rows>
        </>
      )}

      <Note>
        Grossing up is division, not addition. Adding {r.totalPct}% to a {fmt2(net)} bonus lands
        short, because the tax comes out of the larger number — you have to divide by{" "}
        {(1 - r.totalPct / 100).toFixed(4)} instead. Employers use this for signing bonuses,
        relocation payments and any &ldquo;you&rsquo;ll receive exactly $X&rdquo; promise. The
        flat {SUPPLEMENTAL_RATE}% supplemental rate applies to bonuses up to $1,000,000; above
        that the excess is withheld at 37%.
      </Note>
    </CalcShell>
  );
}
