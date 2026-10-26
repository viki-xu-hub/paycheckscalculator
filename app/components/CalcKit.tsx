"use client";

import { useId, type ReactNode } from "react";

/**
 * Shared presentational shell for the small single-purpose calculators
 * (overtime, gross-up, YTD, severance, self-employment tax). Keeps them
 * visually consistent with HSACalculator without repeating its inline styles
 * in every widget.
 */

export const fmt0 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const fmt2 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

export function CalcShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #d9e2e7",
        borderRadius: 16,
        padding: 28,
        marginTop: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#3b82f6",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {eyebrow}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, color: "#0f172a" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px 20px",
        marginTop: 20,
      }}
    >
      {children}
    </div>
  );
}

const labelStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: "#475569",
  display: "block",
  marginBottom: 6,
} as const;

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontSize: 15,
  color: "#0f172a",
  background: "white",
} as const;

export function NumField({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          style={inputStyle}
        />
        {suffix && <span style={{ fontSize: 13, color: "#64748b" }}>{suffix}</span>}
      </div>
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={inputStyle}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Headline({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div
      style={{
        marginTop: 24,
        padding: "18px 20px",
        background: "#f0f6fa",
        borderRadius: 12,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: "#5f7485", textTransform: "uppercase", letterSpacing: 0.4 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>{value}</div>
      {note && <div style={{ fontSize: 13, color: "#5f7485", marginTop: 4 }}>{note}</div>}
    </div>
  );
}

export function Rows({ children }: { children: ReactNode }) {
  return <div style={{ marginTop: 18 }}>{children}</div>;
}

export function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "9px 0",
        borderTop: "1px solid #eef2f5",
        fontSize: 14,
        color: strong ? "#0f172a" : "#475569",
        fontWeight: strong ? 700 : 400,
      }}
    >
      <span>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: "#5f7485", lineHeight: 1.6, marginTop: 16 }}>
      {children}
    </p>
  );
}
