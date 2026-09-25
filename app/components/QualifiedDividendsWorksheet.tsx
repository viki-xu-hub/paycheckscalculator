"use client";

import { useId, useMemo, useState } from "react";
import {
  capitalGains,
  money2,
  niit,
  ordinaryTax,
  runWorksheet,
  statusByKey,
  type FilingStatusKey,
} from "../lib/qualifiedDividends";

const pct = (n: number) => `${n}%`;

export default function QualifiedDividendsWorksheet() {
  const [statusKey, setStatusKey] = useState<FilingStatusKey>("single");
  const [taxableIncome, setTaxableIncome] = useState(150000);
  const [qualifiedDividends, setQualifiedDividends] = useState(20000);
  const [netCapitalGain, setNetCapitalGain] = useState(10000);
  const [showLines, setShowLines] = useState(false);
  const statusId = useId();

  const status = statusByKey[statusKey];

  const r = useMemo(() => {
    const w = runWorksheet(taxableIncome, qualifiedDividends, netCapitalGain, status);
    const straight = ordinaryTax(Math.max(0, taxableIncome), status);
    // Modified AGI is not on the worksheet; taxable income understates it, so this is
    // shown only as a flag that the surtax may apply, not as a computed liability.
    const mayOweNiit = Math.max(0, taxableIncome) > status.niitThreshold && w.l4 > 0;
    return {
      w,
      straight,
      saving: Math.max(0, straight - w.l25),
      effective: w.l1 > 0 ? (w.l25 / w.l1) * 100 : 0,
      niitIfApplicable: niit(w.l4, Math.max(0, taxableIncome), status),
      mayOweNiit,
      capped: w.l23 > w.l24,
    };
  }, [taxableIncome, qualifiedDividends, netCapitalGain, status]);

  const { w } = r;
  const total = w.l9 + w.l17 + w.l20;
  const share = (x: number) => (total > 0 ? (x / total) * 100 : 0);

  const LINES: { n: number; label: string; value: number }[] = [
    { n: 1, label: "Taxable income (Form 1040, line 15)", value: w.l1 },
    { n: 2, label: "Qualified dividends (line 3a)", value: w.l2 },
    { n: 3, label: "Net capital gain (Schedule D or line 7)", value: w.l3 },
    { n: 4, label: "Add lines 2 and 3", value: w.l4 },
    { n: 5, label: "Subtract line 4 from line 1 — the ordinary-rate part", value: w.l5 },
    { n: 6, label: `Top of the 0% band for ${status.label.toLowerCase()}`, value: w.l6 },
    { n: 7, label: "Smaller of line 1 or line 6", value: w.l7 },
    { n: 8, label: "Smaller of line 5 or line 7", value: w.l8 },
    { n: 9, label: "Subtract line 8 from line 7 — taxed at 0%", value: w.l9 },
    { n: 10, label: "Smaller of line 1 or line 4", value: w.l10 },
    { n: 11, label: "Amount from line 9", value: w.l11 },
    { n: 12, label: "Subtract line 11 from line 10", value: w.l12 },
    { n: 13, label: `Top of the 15% band for ${status.label.toLowerCase()}`, value: w.l13 },
    { n: 14, label: "Smaller of line 1 or line 13", value: w.l14 },
    { n: 15, label: "Add lines 5 and 9", value: w.l15 },
    { n: 16, label: "Subtract line 15 from line 14", value: w.l16 },
    { n: 17, label: "Smaller of line 12 or line 16 — taxed at 15%", value: w.l17 },
    { n: 18, label: "Multiply line 17 by 15%", value: w.l18 },
    { n: 19, label: "Add lines 9 and 17", value: w.l19 },
    { n: 20, label: "Subtract line 19 from line 10 — taxed at 20%", value: w.l20 },
    { n: 21, label: "Multiply line 20 by 20%", value: w.l21 },
    { n: 22, label: "Tax on line 5 from the rate schedule", value: w.l22 },
    { n: 23, label: "Add lines 18, 21 and 22", value: w.l23 },
    { n: 24, label: "Tax on line 1 from the rate schedule", value: w.l24 },
    { n: 25, label: "Your tax — the smaller of line 23 or line 24", value: w.l25 },
  ];

  return (
    <div className="calculator national-calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <p className="panel-title">Your return</p>
            <p>Three figures off Form 1040. Results update instantly.</p>
          </div>
        </div>

        <label className="field" htmlFor={statusId}>
          <span>Filing status</span>
          <select id={statusId} value={statusKey} onChange={e => setStatusKey(e.target.value as FilingStatusKey)}>
            {capitalGains.filingStatuses.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <small>
            0% band runs to {money2(status.zeroRateMax)}; 15% band to {money2(status.fifteenRateMax)}; above that, 20%.
          </small>
        </label>

        <NumberField label="Line 1 — taxable income (Form 1040, line 15)" value={taxableIncome} setValue={setTaxableIncome} />
        <div className="split-fields">
          <NumberField label="Line 2 — qualified dividends (line 3a)" value={qualifiedDividends} setValue={setQualifiedDividends} />
          <NumberField label="Line 3 — net capital gain" value={netCapitalGain} setValue={setNetCapitalGain} />
        </div>

        {w.l4 > w.l1 && (
          <div className="result-note">
            <span>ⓘ</span>
            <p>
              Qualified dividends plus net capital gain ({money2(w.l4)}) exceed taxable income ({money2(w.l1)}). The
              worksheet caps the preferential amount at taxable income, which is what line 10 does.
            </p>
          </div>
        )}
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <p className="panel-title">Tax from the worksheet</p>
            <p>{capitalGains.year} rates · {status.label}</p>
          </div>
        </div>

        <div className="net-amount">
          <span>TAX ON LINE 25</span>
          <strong>{money2(w.l25)}</strong>
          <small>
            {r.saving > 0
              ? `${money2(r.saving)} less than the ordinary rate schedule`
              : "same as the ordinary rate schedule — no preferential income in play"}
          </small>
        </div>

        {total > 0 && (
          <>
            <div className="bar">
              <span style={{ width: `${share(w.l9)}%` }} />
              <span style={{ width: `${share(w.l17)}%` }} />
              <span style={{ width: `${share(w.l20)}%` }} />
            </div>
            <div className="legend">
              <span><i className="net-dot" />At 0% {share(w.l9).toFixed(0)}%</span>
              <span><i className="tax-dot" />At 15% {share(w.l17).toFixed(0)}%</span>
              <span><i className="deduction-dot" />At 20% {share(w.l20).toFixed(0)}%</span>
            </div>
          </>
        )}

        <div className="breakdown">
          <div><span>Taxed at 0% (line 9)</span><b>{money2(w.l9)}</b></div>
          <div><span>Taxed at 15% (line 17)</span><b>{money2(w.l17)}</b></div>
          <div><span>Taxed at 20% (line 20)</span><b>{money2(w.l20)}</b></div>
          <div><span>Ordinary income (line 5)</span><b>{money2(w.l5)}</b></div>
          <div><span>Tax on the ordinary part (line 22)</span><b>{money2(w.l22)}</b></div>
          <div><span>Effective rate on taxable income</span><b>{r.effective.toFixed(2)}%</b></div>
        </div>

        {r.capped && (
          <div className="result-note">
            <span>ⓘ</span>
            <p>
              Line 24 came out lower than line 23, so the worksheet takes the ordinary-rate figure. That is the safety
              valve at the bottom of the worksheet — it can never charge you more than the plain rate schedule.
            </p>
          </div>
        )}

        {r.mayOweNiit && (
          <div className="result-note">
            <span>ⓘ</span>
            <p>
              Taxable income is above the {money2(status.niitThreshold)} net investment income tax threshold for{" "}
              {status.label.toLowerCase()}. The 3.8% surtax is not part of this worksheet and is figured separately on
              Form 8960 — on these figures it would be roughly {money2(r.niitIfApplicable)}, but it keys off modified
              AGI rather than taxable income.
            </p>
          </div>
        )}

        <div className="result-note">
          <span>ⓘ</span>
          <button type="button" className="note-toggle" aria-expanded={showLines} onClick={() => setShowLines(o => !o)}>
            {showLines ? "Hide all 25 lines" : "Show all 25 lines"}
          </button>
        </div>

        {showLines && (
          <div className="table-wrap" role="note">
            <table>
              <thead><tr><th>Line</th><th>What it is</th><th>Amount</th></tr></thead>
              <tbody>
                {LINES.map(l => (
                  <tr key={l.n} className={l.n === 25 ? "rate-total" : undefined}>
                    <td>{l.n}</td>
                    <td>{l.label}</td>
                    <td>{l.n === 6 || l.n === 13 ? money2(l.value) : money2(l.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function NumberField({ label, value, setValue }: { label: string; value: number; setValue: (v: number) => void }) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className="money-input">
        <span>$</span>
        <input id={id} type="number" min="0" step="500" value={value} onChange={e => setValue(Number(e.target.value))} />
      </div>
    </label>
  );
}

export { pct };
