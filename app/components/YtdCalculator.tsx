"use client";

import { useMemo, useState } from "react";
import { CalcShell, Grid, NumField, SelectField, Headline, Rows, Row, Note, fmt2 } from "./CalcKit";

type Freq = "weekly" | "biweekly" | "semimonthly" | "monthly";
const PERIODS: Record<Freq, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };

/**
 * Year-to-date projector. Takes the YTD figure from a pay stub plus how far
 * into the year it covers, and annualises it — the calculation a lender does
 * when they ask for your most recent stub.
 */
export default function YtdCalculator() {
  const [ytd, setYtd] = useState(38000);
  const [freq, setFreq] = useState<Freq>("biweekly");
  const [periodsPaid, setPeriodsPaid] = useState(17);

  const r = useMemo(() => {
    const total = PERIODS[freq];
    const paid = Math.min(Math.max(1, periodsPaid), total);
    const perPeriod = Math.max(0, ytd) / paid;
    const projected = perPeriod * total;
    const remaining = total - paid;
    return {
      perPeriod,
      projected,
      remaining,
      remainingPay: perPeriod * remaining,
      monthly: projected / 12,
      weekly: projected / 52,
      pctComplete: (paid / total) * 100,
    };
  }, [ytd, freq, periodsPaid]);

  return (
    <CalcShell eyebrow="YTD Calculator" title="Project your year from a pay stub">
      <Grid>
        <NumField label="Year-to-date gross" value={ytd} onChange={setYtd} step={500} />
        <SelectField<Freq>
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
        <NumField
          label="Pay periods so far"
          value={periodsPaid}
          onChange={setPeriodsPaid}
          step={1}
          min={1}
          max={PERIODS[freq]}
        />
      </Grid>

      <Headline
        label="Projected annual gross"
        value={fmt2(r.projected)}
        note={`${r.pctComplete.toFixed(0)}% of the year paid · ${r.remaining} periods left`}
      />

      <Rows>
        <Row label="Average gross per pay period" value={fmt2(r.perPeriod)} />
        <Row label="Monthly income from YTD" value={fmt2(r.monthly)} />
        <Row label="Weekly equivalent" value={fmt2(r.weekly)} />
        <Row label={`Still to be paid (${r.remaining} periods)`} value={fmt2(r.remainingPay)} />
        <Row label="Projected annual gross" value={fmt2(r.projected)} strong />
      </Rows>

      <Note>
        This straight-lines your year: it assumes the rest of the year looks like the part already
        paid. Bonuses, commission, unpaid leave or a mid-year raise will pull the real figure away
        from the projection — which is exactly why underwriters ask for a full year of stubs rather
        than trusting one. To calculate monthly income from YTD, they divide by pay periods elapsed
        and multiply back up, which is what the monthly line above does.
      </Note>
    </CalcShell>
  );
}
