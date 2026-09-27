"use client";

import { useId, useMemo, useState } from "react";
import {
  capitalGains,
  money2,
  statusByKey,
  type FilingStatusKey,
} from "../lib/qualifiedDividends";
import {
  stateTaxConfigs,
  calculateTotalTax,
  type StateTaxConfig,
} from "../lib/stateIncomeTax";

type Props = {
  stateAbbr: string;
};

/**
 * Generic state income tax calculator. Works for any state configured in
 * stateTaxConfigs. Follows the same layout pattern as
 * IllinoisIncomeTaxCalculator.
 */
export default function StateIncomeTaxCalculator({ stateAbbr }: Props) {
  const config = stateTaxConfigs[stateAbbr.toUpperCase()];

  if (!config) {
    return (
      <div className="calculator national-calculator" id="calculator">
        <p>State not supported: {stateAbbr}</p>
      </div>
    );
  }

  return <CalculatorBody config={config} />;
}

// --- Body component (separate so hooks are only used when config is valid) ---

function CalculatorBody({ config }: { config: StateTaxConfig }) {
  const [statusKey, setStatusKey] = useState<FilingStatusKey>("single");
  const [income, setIncome] = useState(70000);
  const [dependents, setDependents] = useState(0);
  const statusId = useId();

  const status = statusByKey[statusKey];

  const r = useMemo(() => {
    return calculateTotalTax(income, statusKey, dependents, config.abbr);
  }, [income, statusKey, dependents, config.abbr]);

  const stateName = config.name;
  const stateHasTax = config.hasStateIncomeTax;

  // --- State-specific label text ---
  const filingStatusNote = useMemo(() => {
    const parts: string[] = [];
    if (config.hasStandardDeduction && config.standardDeduction) {
      parts.push(
        `${stateName} standard deduction: ${money2(config.standardDeduction[statusKey])}`,
      );
    }
    if (config.hasDependentExemptions && config.dependentExemptionAmount) {
      parts.push(
        `dependents: ${money2(config.dependentExemptionAmount)} each`,
      );
    }
    return parts.length > 0 ? parts.join(" · ") : `${stateName} rate: ${config.displayRate}`;
  }, [config, statusKey, stateName]);

  // --- Render ---

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
            Federal standard deduction: {money2(status.standardDeduction)} · {filingStatusNote}
          </small>
        </label>

        <NumberField
          label="Annual income"
          value={income}
          setValue={setIncome}
          step={1000}
        />

        {/* Only offered where it changes the answer — see dependentsAffectTax. */}
        {config.dependentsAffectTax && (
          <NumberField
            label="Number of dependents"
            value={dependents}
            setValue={setDependents}
            step={1}
            isInteger
          />
        )}

        {config.dependentsAffectTax && config.hasDependentExemptions && (
          <div
            className="result-note"
            style={{ background: "#f0f6fa", color: "#5f7485" }}
          >
            <span>ⓘ</span>
            <p>
              Each dependent reduces your {stateName} taxable income by{" "}
              {money2(config.dependentExemptionAmount ?? 0)}, so the tax you save
              depends on your marginal rate rather than being a flat dollar amount.
              Federal tax uses the standard deduction model and is not affected by
              dependents in this estimator.
            </p>
          </div>
        )}

        {config.dependentsAffectTax && !config.hasDependentExemptions && (
          <div
            className="result-note"
            style={{ background: "#f0f6fa", color: "#5f7485" }}
          >
            <span>ⓘ</span>
            <p>
              Dependents raise your {stateName} taxpayer tax credit rather than
              reducing taxable income. Federal tax uses the standard deduction
              model and is not affected by dependents in this estimator.
            </p>
          </div>
        )}

        {!config.dependentsAffectTax && stateHasTax && (
          <div
            className="result-note"
            style={{ background: "#f0f6fa", color: "#5f7485" }}
          >
            <span>ⓘ</span>
            <p>
              {stateName} grants no per-dependent deduction or exemption, so the
              number of dependents does not change this estimate. Federal tax
              uses the standard deduction model and is not affected by dependents
              in this estimator either.
            </p>
          </div>
        )}

        {!stateHasTax && (
          <div
            className="result-note"
            style={{ background: "#f0faf3", color: "#2e7d4a" }}
          >
            <span>★</span>
            <p>
              {stateName} does not have a state income tax. You only pay federal
              income tax, which can mean significant savings compared to states
              with high income tax rates.
            </p>
          </div>
        )}
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
          <span>TOTAL FEDERAL + {stateName.toUpperCase()} TAX</span>
          <strong>{money2(r.totalTax)}</strong>
          <small>Effective rate: {r.effectiveRate.toFixed(2)}% of income</small>
        </div>

        {stateHasTax && r.totalTax > 0 && (
          <>
            <div className="bar">
              <span
                style={{
                  width: `${r.totalTax > 0 ? (r.federalTax / r.totalTax) * 100 : 0}%`,
                }}
              />
              <span
                style={{
                  width: `${r.totalTax > 0 ? (r.stateTax / r.totalTax) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="legend">
              <span>
                <i className="net-dot" />
                Federal {r.totalTax > 0 ? ((r.federalTax / r.totalTax) * 100).toFixed(0) : 0}%
              </span>
              <span>
                <i className="tax-dot" />
                {stateName}{" "}
                {r.totalTax > 0 ? ((r.stateTax / r.totalTax) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </>
        )}

        <div className="breakdown">
          <div>
            <span>Federal income tax</span>
            <b>{money2(r.federalTax)}</b>
          </div>
          <div>
            <span>{stateName} income tax</span>
            <b>{money2(r.stateTax)}</b>
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
          {stateHasTax && (
            <div>
              <span>{stateName} taxable income</span>
              <b>{money2(r.stateTaxableIncome)}</b>
            </div>
          )}
          <div>
            <span>Effective tax rate</span>
            <b>{r.effectiveRate.toFixed(2)}%</b>
          </div>
        </div>

        {/* State-specific details */}
        {stateHasTax && Object.keys(r.stateDetails).length > 0 && (
          <StateDetailsBreakdown config={config} details={r.stateDetails} />
        )}

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            {stateHasTax ? (
              <>
                {stateName} uses a {config.type} rate structure
                {config.displayRate && ` (${config.displayRate})`}.
                Federal tax uses the progressive {capitalGains.year} rate schedule
                from {capitalGains.source.label}.
              </>
            ) : (
              <>
                {stateName} has no state income tax — you keep more of your
                paycheck. Federal tax uses the progressive {capitalGains.year}{" "}
                rate schedule from {capitalGains.source.label}.
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}

// --- State-specific details panel ---

function StateDetailsBreakdown({
  config,
  details,
}: {
  config: StateTaxConfig;
  details: Record<string, number>;
}) {
  const labels: Record<string, string> = {
    flatRate: "Flat tax rate",
    standardDeduction: "Standard deduction",
    personalExemption: "Personal exemption",
    dependentExemption: "Dependent exemption(s)",
    taxableIncome: "Taxable income",
    bracketsUsed: "Brackets reached",
    grossTaxBeforeCredit: "Gross tax before credits",
    baseCredit: "Base taxpayer credit",
    creditPhaseout: "Credit phaseout",
    actualCredit: "Actual credit applied",
    grossTax: "Gross tax",
    exemptionAmount: "Personal exemption",
    initialTax: "Initial tax (Table B)",
    phaseOutAddBack: "2% rate phase-out add-back",
    taxRecapture: "Tax recapture",
  };

  const formatValue = (key: string, value: number): string => {
    switch (key) {
      case "flatRate":
        return `${value.toFixed(2)}%`;
      case "bracketsUsed":
        return `${value}`;
      default:
        return money2(value);
    }
  };

  // Filter out entries we already show in the main breakdown
  const skipKeys = new Set(["taxableIncome"]);

  const entries = Object.entries(details).filter(
    ([key]) => !skipKeys.has(key),
  );

  if (entries.length === 0) return null;

  return (
    <div className="breakdown" style={{ marginTop: 16 }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#5f7485",
          marginBottom: 8,
        }}
      >
        {config.name} details
      </p>
      {entries.map(([key, value]) => (
        <div key={key}>
          <span>{labels[key] ?? key}</span>
          <b>{formatValue(key, value)}</b>
        </div>
      ))}
    </div>
  );
}

// --- Shared number field ---

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
