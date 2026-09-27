"use client";

import { useId, useMemo, useState } from "react";
import {
  capitalGains,
  money2,
  ordinaryTax,
  statusByKey,
  type FilingStatusKey,
} from "../lib/qualifiedDividends";

const IL_FLAT_RATE = 0.0495;
const IL_PERSONAL_EXEMPTION = 2925;

export default function IllinoisIncomeTaxCalculator() {
  const [statusKey, setStatusKey] = useState<FilingStatusKey>("single");
  const [income, setIncome] = useState(75000);
  const [dependents, setDependents] = useState(0);
  const statusId = useId();

  const status = statusByKey[statusKey];

  const r = useMemo(() => {
    const federalTaxableIncome = Math.max(0, income - status.standardDeduction);
    const federalTax = ordinaryTax(federalTaxableIncome, status);

    const ilExemptionCount =
      (statusKey === "married" ? 2 : 1) + Math.max(0, dependents);
    const ilExemptions = ilExemptionCount * IL_PERSONAL_EXEMPTION;
    const ilTaxableIncome = Math.max(0, income - ilExemptions);
    const ilTax = ilTaxableIncome * IL_FLAT_RATE;

    const totalTax = federalTax + ilTax;
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

    return {
      federalTaxableIncome,
      federalTax,
      ilExemptionCount,
      ilExemptions,
      ilTaxableIncome,
      ilTax,
      totalTax,
      effectiveRate,
    };
  }, [income, statusKey, dependents, status]);

  const ilFilingStatusLabel =
    statusKey === "married"
      ? "married filing jointly — 2 personal exemptions"
      : statusKey === "head"
      ? "head of household — 1 personal exemption"
      : statusKey === "separate"
      ? "married filing separately — 1 personal exemption"
      : "single — 1 personal exemption";

  return (
    <div className="calculator national-calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <p className="panel-title">Your information</p>
            <p>Enter your annual income and filing details. Results update instantly.</p>
          </div>
        </div>

        <label className="field" htmlFor={statusId}>
          <span>Filing status</span>
          <select
            id={statusId}
            value={statusKey}
            onChange={(e) => setStatusKey(e.target.value as FilingStatusKey)}
          >
            {capitalGains.filingStatuses.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <small>
            Federal standard deduction: {money2(status.standardDeduction)} · Illinois: {ilFilingStatusLabel}
          </small>
        </label>

        <NumberField
          label="Annual income"
          value={income}
          setValue={setIncome}
          step={1000}
        />

        <NumberField
          label="Number of dependents"
          value={dependents}
          setValue={setDependents}
          step={1}
          isInteger
        />

        <div className="result-note" style={{ background: "#f0f6fa", color: "#5f7485" }}>
          <span>ⓘ</span>
          <p>
            Dependents add ${IL_PERSONAL_EXEMPTION.toLocaleString()} each to your Illinois personal
            exemption amount. Federal tax uses the standard deduction model and is not affected by
            dependents in this estimator.
          </p>
        </div>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <p className="panel-title">Your estimated tax</p>
            <p>{capitalGains.year} rates · {status.label}</p>
          </div>
        </div>

        <div className="net-amount">
          <span>TOTAL FEDERAL + ILLINOIS TAX</span>
          <strong>{money2(r.totalTax)}</strong>
          <small>
            Effective rate: {r.effectiveRate.toFixed(2)}% of income
          </small>
        </div>

        <div className="bar">
          <span style={{ width: `${r.totalTax > 0 ? (r.federalTax / r.totalTax) * 100 : 0}%` }} />
          <span style={{ width: `${r.totalTax > 0 ? (r.ilTax / r.totalTax) * 100 : 0}%` }} />
        </div>
        <div className="legend">
          <span>
            <i className="net-dot" />
            Federal {r.totalTax > 0 ? ((r.federalTax / r.totalTax) * 100).toFixed(0) : 0}%
          </span>
          <span>
            <i className="tax-dot" />
            Illinois {r.totalTax > 0 ? ((r.ilTax / r.totalTax) * 100).toFixed(0) : 0}%
          </span>
        </div>

        <div className="breakdown">
          <div>
            <span>Federal income tax</span>
            <b>{money2(r.federalTax)}</b>
          </div>
          <div>
            <span>Illinois income tax</span>
            <b>{money2(r.ilTax)}</b>
          </div>
          <div>
            <span>Total tax</span>
            <b>{money2(r.totalTax)}</b>
          </div>
        </div>

        <div className="breakdown" style={{ marginTop: 16 }}>
          <div>
            <span>Federal taxable income</span>
            <b>{money2(r.federalTaxableIncome)}</b>
          </div>
          <div>
            <span>Federal standard deduction</span>
            <b>{money2(status.standardDeduction)}</b>
          </div>
          <div>
            <span>Illinois personal exemptions</span>
            <b>{money2(r.ilExemptions)}</b>
          </div>
          <div>
            <span>Illinois taxable income</span>
            <b>{money2(r.ilTaxableIncome)}</b>
          </div>
          <div>
            <span>Effective tax rate</span>
            <b>{r.effectiveRate.toFixed(2)}%</b>
          </div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            Illinois applies a flat 4.95% rate after personal exemptions of{" "}
            {money2(IL_PERSONAL_EXEMPTION)} per person. Federal tax uses the progressive {capitalGains.year}{" "}
            rate schedule from {capitalGains.source.label}.
          </p>
        </div>
      </section>
    </div>
  );
}

function NumberField({
  label,
  value,
  setValue,
  step = 500,
  isInteger = false,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  step?: number;
  isInteger?: boolean;
}) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className="money-input">
        {!isInteger && <span>$</span>}
        <input
          id={id}
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    </label>
  );
}
