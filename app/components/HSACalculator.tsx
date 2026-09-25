"use client";

import { useState, useMemo } from "react";

const fmt0 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmt2 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const FEDERAL_BRACKETS = [
  { min: 0, rate: 0.10, label: "10%" },
  { min: 11925, rate: 0.12, label: "12%" },
  { min: 48475, rate: 0.22, label: "22%" },
  { min: 103350, rate: 0.24, label: "24%" },
  { min: 197300, rate: 0.32, label: "32%" },
  { min: 250525, rate: 0.35, label: "35%" },
  { min: 626350, rate: 0.37, label: "37%" },
];

function marginalRate(income: number, filingStatus: string): number {
  // Simplified — use single brackets as base; for MFJ, double thresholds
  const factor = filingStatus === "mfj" ? 2 : filingStatus === "hoh" ? 1.5 : 1;
  let rate = 0.1;
  for (const b of FEDERAL_BRACKETS) {
    if (income >= b.min * factor) rate = b.rate;
  }
  return rate;
}

export default function HSACalculatorWidget() {
  const [income, setIncome] = useState(75000);
  const [contribution, setContribution] = useState(4000);
  const [coverage, setCoverage] = useState<"self" | "family">("self");
  const [filingStatus, setFilingStatus] = useState<"single" | "mfj" | "hoh">("single");
  const [stateRate, setStateRate] = useState(5);

  const fedRate = useMemo(() => marginalRate(income, filingStatus), [income, filingStatus]);
  const ficaRate = income < 168600 ? 0.0765 : 0.0145; // Below SS wage base vs Medicare only
  const totalRate = fedRate + ficaRate + stateRate / 100;

  const annualSavings = contribution * totalRate;
  const monthlySavings = annualSavings / 12;
  const biweeklySavings = annualSavings / 26;
  const effectiveSavingsPct = (annualSavings / contribution) * 100;

  const maxContribution = coverage === "self" ? 4300 : 8550; // 2026 limits
  const catchUp = income > 0 && contribution > 0; // placeholder — shown in copy

  return (
    <div className="hsa-calc-widget" style={{
      background: "white",
      border: "1px solid #d9e2e7",
      borderRadius: 16,
      padding: "28px",
      marginTop: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 0.5 }}>
        HSA Tax Savings Calculator
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, color: "#0f172a" }}>
        See how much an HSA saves you
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginTop: 20 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#475569", display: "block", marginBottom: 6 }}>
            Annual income
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 15,
              fontVariantNumeric: "tabular-nums",
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#475569", display: "block", marginBottom: 6 }}>
            Filing status
          </label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as "single" | "mfj" | "hoh")}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 15,
              background: "white",
            }}
          >
            <option value="single">Single</option>
            <option value="mfj">Married Filing Jointly</option>
            <option value="hoh">Head of Household</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#475569", display: "block", marginBottom: 6 }}>
            HSA coverage
          </label>
          <select
            value={coverage}
            onChange={(e) => setCoverage(e.target.value as "self" | "family")}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 15,
              background: "white",
            }}
          >
            <option value="self">Self-only ($4,300 max)</option>
            <option value="family">Family ($8,550 max)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#475569", display: "block", marginBottom: 6 }}>
            Annual HSA contribution
          </label>
          <input
            type="number"
            value={contribution}
            onChange={(e) => setContribution(Number(e.target.value) || 0)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 15,
              fontVariantNumeric: "tabular-nums",
            }}
          />
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            2026 max: {fmt0(maxContribution)} (add $1,000 catch-up if 55+)
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#475569", display: "block", marginBottom: 6 }}>
            State income tax rate
          </label>
          <input
            type="number"
            value={stateRate}
            onChange={(e) => setStateRate(Number(e.target.value) || 0)}
            step="0.1"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 15,
              fontVariantNumeric: "tabular-nums",
            }}
          />
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Enter 0 for no-income-tax states (TX, FL, etc.)
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{
        marginTop: 24,
        background: "linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)",
        border: "1px solid #bfdbfe",
        borderRadius: 12,
        padding: "20px 24px",
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Your annual tax savings
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#0f172a", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
          {fmt0(annualSavings)}
        </div>
        <div style={{ fontSize: 14, color: "#475569", marginTop: 4 }}>
          That's {fmt2(monthlySavings)} per month, or {fmt2(biweeklySavings)} per paycheck
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Federal saved</div>
            <div style={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt0(contribution * fedRate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b" }}>FICA saved</div>
            <div style={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt0(contribution * ficaRate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b" }}>State saved</div>
            <div style={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt0(contribution * stateRate / 100)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Effective savings rate</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#16a34a" }}>{effectiveSavingsPct.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#64748b", marginTop: 12, lineHeight: 1.5 }}>
        Estimate based on your marginal federal bracket (approx. {(fedRate * 100).toFixed(0)}%),
        FICA (7.65% below the Social Security wage base), and your state rate.
        Actual savings depend on your specific tax situation.
      </div>
    </div>
  );
}
