"use client";

import { useId, useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const money2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const PERIODS: Record<string, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

export type CoverageOption = { key: string; label: string; limit: number; hint?: string };

export default function PreTaxBenefitCalculator({
  coverageLabel,
  coverages,
  catchUp,
  catchUpLabel,
  defaultContribution,
  ficaExempt = true,
  amountLabel = "Annual contribution",
}: {
  coverageLabel: string;
  coverages: CoverageOption[];
  /** Extra room some people get on top of the limit (HSA age 55+); omitted for DCFSA. */
  catchUp?: { amount: number; label: string };
  catchUpLabel?: string;
  defaultContribution: number;
  /** Payroll-deducted cafeteria plan contributions escape Social Security and Medicare too. */
  ficaExempt?: boolean;
  amountLabel?: string;
}) {
  const [coverage, setCoverage] = useState(coverages[0].key);
  const [extra, setExtra] = useState(false);
  const [contribution, setContribution] = useState(defaultContribution);
  const [federalRate, setFederalRate] = useState(22);
  const [stateRate, setStateRate] = useState(5);
  const [frequency, setFrequency] = useState("biweekly");
  const coverageId = useId();
  const amountId = useId();

  const selected = coverages.find(c => c.key === coverage) ?? coverages[0];
  const limit = selected.limit + (extra && catchUp ? catchUp.amount : 0);

  const r = useMemo(() => {
    const amount = Math.max(0, Math.min(Number.isFinite(contribution) ? contribution : 0, limit));
    const fed = Math.max(0, federalRate) / 100;
    const st = Math.max(0, stateRate) / 100;
    const fica = ficaExempt ? 0.0765 : 0;
    const savings = amount * (fed + st + fica);
    return {
      amount,
      over: (contribution || 0) > limit,
      room: Math.max(0, limit - amount),
      federal: amount * fed,
      state: amount * st,
      fica: amount * fica,
      savings,
      perPeriod: amount / PERIODS[frequency],
      netPerPeriod: (amount - savings) / PERIODS[frequency],
      effective: amount > 0 ? (savings / amount) * 100 : 0,
    };
  }, [contribution, limit, federalRate, stateRate, ficaExempt, frequency]);

  return (
    <div className="calculator national-calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <p className="panel-title">Your contribution</p>
            <p>Adjust the fields; results update instantly.</p>
          </div>
        </div>

        <label className="field" htmlFor={coverageId}>
          <span>{coverageLabel}</span>
          <select id={coverageId} value={coverage} onChange={e => setCoverage(e.target.value)}>
            {coverages.map(c => (
              <option key={c.key} value={c.key}>{c.label} — {money.format(c.limit)} limit</option>
            ))}
          </select>
          {selected.hint && <small>{selected.hint}</small>}
        </label>

        {catchUp && (
          <label className="field checkbox-field">
            <span>{catchUp.label}</span>
            <input type="checkbox" checked={extra} onChange={e => setExtra(e.target.checked)} />
          </label>
        )}

        <label className="field" htmlFor={amountId}>
          <span>{amountLabel}</span>
          <div className="money-input">
            <span>$</span>
            <input
              id={amountId}
              type="number"
              min="0"
              step="50"
              value={contribution}
              onChange={e => setContribution(Number(e.target.value))}
            />
          </div>
          <small>
            {r.over
              ? `Above the ${money.format(limit)} limit for ${catchUpLabel ?? "this option"} — the calculation caps at the limit.`
              : `${money.format(r.room)} of room left under the ${money.format(limit)} limit.`}
          </small>
        </label>

        <div className="split-fields">
          <label className="field">
            <span>Federal marginal rate (%)</span>
            <div className="money-input">
              <input type="number" min="0" max="50" step="1" value={federalRate} onChange={e => setFederalRate(Number(e.target.value))} />
            </div>
          </label>
          <label className="field">
            <span>State marginal rate (%)</span>
            <div className="money-input">
              <input type="number" min="0" max="15" step="0.1" value={stateRate} onChange={e => setStateRate(Number(e.target.value))} />
            </div>
          </label>
        </div>

        <div className="field">
          <span>Pay frequency</span>
          <div className="frequency-grid">
            {Object.keys(PERIODS).map(f => (
              <button key={f} type="button" className={frequency === f ? "active" : ""} onClick={() => setFrequency(f)}>
                {f === "biweekly" ? "Bi-weekly" : f === "semimonthly" ? "Semi-monthly" : f[0].toUpperCase() + f.slice(1)}
                <small>{PERIODS[f]}× / year</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <p className="panel-title">Estimated tax saving</p>
            <p>2026 limits and rates you entered.</p>
          </div>
        </div>

        <div className="net-amount">
          <span>ANNUAL TAX SAVED</span>
          <strong>{money2.format(r.savings)}</strong>
          <small>on {money2.format(r.amount)} contributed</small>
        </div>

        <div className="bar">
          <span style={{ width: `${100 - r.effective}%` }} />
          <span style={{ width: `${r.effective}%` }} />
        </div>
        <div className="legend">
          <span><i className="net-dot" />Real cost {(100 - r.effective).toFixed(1)}%</span>
          <span><i className="tax-dot" />Tax saved {r.effective.toFixed(1)}%</span>
        </div>

        <div className="breakdown">
          <div><span>Federal income tax saved</span><b>{money2.format(r.federal)}</b></div>
          <div><span>State income tax saved</span><b>{money2.format(r.state)}</b></div>
          {ficaExempt && <div><span>Social Security + Medicare saved</span><b>{money2.format(r.fica)}</b></div>}
          <div><span>Comes out of each paycheck</span><b>{money2.format(r.perPeriod)}</b></div>
          <div><span>Actual cost per paycheck</span><b>{money2.format(r.netPerPeriod)}</b></div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            {ficaExempt
              ? "Payroll deductions through a cafeteria plan avoid Social Security and Medicare as well as income tax, which is why the saving is larger than your income-tax bracket alone."
              : "This estimate covers income tax only."}{" "}
            See the <a className="text-link" href="/methodology">methodology and source list</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
