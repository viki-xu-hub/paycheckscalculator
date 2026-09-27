"use client";

import { useMemo, useState } from "react";
import { CalcShell, Grid, NumField, SelectField, Headline, Rows, Row, Note, fmt2 } from "./CalcKit";
import { ordinaryTax, statusByKey } from "../lib/qualifiedDividends";

type Status = "single" | "married" | "head";

/** 2026 Social Security wage base (SSA) — the ceiling for the 12.4% OASDI half. */
const SS_WAGE_BASE = 184500;
/** Only 92.35% of net profit is subject to SE tax (the deemed employer share). */
const SE_BASIS = 0.9235;
const ADDITIONAL_MEDICARE_THRESHOLD: Record<Status, number> = {
  single: 200000,
  married: 250000,
  head: 200000,
};

/**
 * Schedule SE plus a federal income-tax estimate. Self-employment tax is
 * 15.3% on 92.35% of net profit, with the 12.4% Social Security half capped at
 * the wage base and the 2.9% Medicare half uncapped. Half of the SE tax is
 * deductible against income tax.
 */
export default function SelfEmploymentTaxCalculator() {
  const [profit, setProfit] = useState(80000);
  const [w2Wages, setW2Wages] = useState(0);
  const [status, setStatus] = useState<Status>("single");

  const r = useMemo(() => {
    const basis = Math.max(0, profit) * SE_BASIS;
    // W-2 wages use up the Social Security wage base first.
    const ssRoom = Math.max(0, SS_WAGE_BASE - Math.max(0, w2Wages));
    const ssBase = Math.min(basis, ssRoom);
    const socialSecurity = ssBase * 0.124;
    const medicare = basis * 0.029;
    const addlThreshold = ADDITIONAL_MEDICARE_THRESHOLD[status];
    const addlMedicare = Math.max(0, basis + Math.max(0, w2Wages) - addlThreshold) * 0.009;
    const seTax = socialSecurity + medicare + addlMedicare;
    const halfDeduction = (socialSecurity + medicare) / 2;

    const fed = statusByKey[status];
    const agi = Math.max(0, profit) + Math.max(0, w2Wages) - halfDeduction;
    const taxable = Math.max(0, agi - fed.standardDeduction);
    const incomeTax = ordinaryTax(taxable, fed);

    const total = seTax + incomeTax;
    return {
      basis,
      socialSecurity,
      medicare,
      addlMedicare,
      seTax,
      halfDeduction,
      taxable,
      incomeTax,
      total,
      quarterly: total / 4,
      effective: profit + w2Wages > 0 ? (total / (profit + w2Wages)) * 100 : 0,
    };
  }, [profit, w2Wages, status]);

  return (
    <CalcShell eyebrow="Self-Employment Tax Calculator" title="What a 1099 year actually costs">
      <Grid>
        <NumField label="Net self-employment profit" value={profit} onChange={setProfit} step={1000} />
        <NumField label="W-2 wages (if any)" value={w2Wages} onChange={setW2Wages} step={1000} />
        <SelectField<Status>
          label="Filing status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "single", label: "Single" },
            { value: "married", label: "Married filing jointly" },
            { value: "head", label: "Head of household" },
          ]}
        />
      </Grid>

      <Headline
        label="Total federal tax"
        value={fmt2(r.total)}
        note={`About ${fmt2(r.quarterly)} per quarterly estimated payment · ${r.effective.toFixed(1)}% effective`}
      />

      <Rows>
        <Row label="Net earnings subject to SE tax (92.35% of profit)" value={fmt2(r.basis)} />
        <Row label="Social Security — 12.4%" value={fmt2(r.socialSecurity)} />
        <Row label="Medicare — 2.9%" value={fmt2(r.medicare)} />
        {r.addlMedicare > 0 && <Row label="Additional Medicare — 0.9%" value={fmt2(r.addlMedicare)} />}
        <Row label="Self-employment tax" value={fmt2(r.seTax)} strong />
        <Row label="Deductible half of SE tax" value={`− ${fmt2(r.halfDeduction)}`} />
        <Row label="Federal taxable income" value={fmt2(r.taxable)} />
        <Row label="Federal income tax" value={fmt2(r.incomeTax)} />
        <Row label="Total" value={fmt2(r.total)} strong />
      </Rows>

      <Note>
        A W-2 employee pays 7.65% in FICA and the employer pays the other 7.65%. Self-employed
        people pay both halves — 15.3% — which is why a 1099 rate has to be meaningfully higher
        than a W-2 salary to come out even. The Social Security half stops at the{" "}
        {fmt2(SS_WAGE_BASE)} wage base; the Medicare half never stops. State income tax and the
        qualified business income deduction are not included here.
      </Note>
    </CalcShell>
  );
}
