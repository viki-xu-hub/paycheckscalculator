"use client";

import { useId, useMemo, useState } from "react";
import { pct, preTaxFrom, taxOn, type RateComponent, type RateRow } from "../lib/salesTax";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type Mode = "add" | "remove";

export default function SalesTaxCalculator({
  defaultRate,
  placeLabel,
  options,
  optionLabel = "Location",
  components,
  defaultAmount = 100,
  rateHelp,
}: {
  defaultRate: number;
  placeLabel: string;
  /** When supplied, renders a picker that switches the rate (e.g. all 88 Ohio counties). */
  options?: RateRow[];
  optionLabel?: string;
  /** Statutory pieces that add up to the rate, shown as a breakdown when supplied. */
  components?: RateComponent[];
  defaultAmount?: number;
  /** Per-page helper line under the rate box, so sibling pages do not repeat the same sentence. */
  rateHelp?: string;
}) {
  const [mode, setMode] = useState<Mode>("add");
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [selected, setSelected] = useState(options?.[0]?.name ?? "");
  const amountId = useId();
  const rateId = useId();
  const pickerId = useId();

  const result = useMemo(() => {
    const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
    const safeRate = Number.isFinite(rate) && rate >= 0 ? rate : 0;
    if (mode === "add") {
      const tax = taxOn(safeAmount, safeRate);
      return { subtotal: safeAmount, tax, total: Math.round((safeAmount + tax) * 100) / 100 };
    }
    const subtotal = preTaxFrom(safeAmount, safeRate);
    return { subtotal, tax: Math.round((safeAmount - subtotal) * 100) / 100, total: safeAmount };
  }, [amount, rate, mode]);

  const taxShare = result.total > 0 ? (result.tax / result.total) * 100 : 0;

  function chooseOption(name: string) {
    setSelected(name);
    const match = options?.find(o => o.name === name);
    if (match) setRate(match.rate);
  }

  return (
    <div className="calculator national-calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <p className="panel-title">Purchase details</p>
            <p>Adjust the fields; results update instantly.</p>
          </div>
        </div>

        <div className="field">
          <span>What do you want to work out?</span>
          <div className="frequency-grid">
            <button type="button" className={mode === "add" ? "active" : ""} onClick={() => setMode("add")}>
              Add sales tax
              <small>Price → total</small>
            </button>
            <button type="button" className={mode === "remove" ? "active" : ""} onClick={() => setMode("remove")}>
              Remove sales tax
              <small>Total → price</small>
            </button>
          </div>
        </div>

        {options && options.length > 0 && (
          <label className="field" htmlFor={pickerId}>
            <span>{optionLabel}</span>
            <select id={pickerId} value={selected} onChange={event => chooseOption(event.target.value)}>
              {options.map(option => (
                <option key={option.name} value={option.name}>
                  {option.name} — {pct(option.rate)}
                </option>
              ))}
            </select>
            <small>Picking a {optionLabel.toLowerCase()} fills in its published rate; you can still edit it below.</small>
          </label>
        )}

        <div className="split-fields">
          <label className="field" htmlFor={amountId}>
            <span>{mode === "add" ? "Price before tax" : "Total paid (tax included)"}</span>
            <div className="money-input">
              <span>$</span>
              <input
                id={amountId}
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={event => setAmount(Number(event.target.value))}
              />
            </div>
          </label>
          <label className="field" htmlFor={rateId}>
            <span>Sales tax rate (%)</span>
            <div className="money-input">
              <input
                id={rateId}
                type="number"
                min="0"
                max="20"
                step="0.001"
                value={rate}
                onChange={event => setRate(Number(event.target.value))}
              />
            </div>
            <small>{rateHelp ?? `Pre-filled with the ${placeLabel} rate. Edit it for a different address.`}</small>
          </label>
        </div>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <p className="panel-title">Sales tax due</p>
            <p>{placeLabel} · {pct(rate)}</p>
          </div>
        </div>

        <div className="net-amount">
          <span>{mode === "add" ? "TOTAL WITH TAX" : "PRICE BEFORE TAX"}</span>
          <strong>{money.format(mode === "add" ? result.total : result.subtotal)}</strong>
          <small>{money.format(result.tax)} of sales tax</small>
        </div>

        <div className="bar">
          <span style={{ width: `${100 - taxShare}%` }} />
          <span style={{ width: `${taxShare}%` }} />
        </div>
        <div className="legend">
          <span><i className="net-dot" />Price {(100 - taxShare).toFixed(1)}%</span>
          <span><i className="tax-dot" />Sales tax {taxShare.toFixed(1)}%</span>
        </div>

        <div className="breakdown">
          <div><span>Price before tax</span><b>{money.format(result.subtotal)}</b></div>
          <div><span>Sales tax at {pct(rate)}</span><b>+{money.format(result.tax)}</b></div>
          <div><span>Total</span><b>{money.format(result.total)}</b></div>
          {components?.map(component => (
            <div key={component.label}>
              <span>— {component.label} ({pct(component.rate)})</span>
              <b>{money.format(taxOn(result.subtotal, component.rate))}</b>
            </div>
          ))}
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            Sales tax is charged on the delivery address, not the billing address, and some goods are exempt or taxed
            differently. See the <a className="text-link" href="/methodology">methodology and source list</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
