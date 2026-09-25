import raw from "../data/capital-gains.json";

export type FilingStatusKey = "single" | "married" | "head" | "separate";

export type CapitalGainsStatus = {
  key: FilingStatusKey;
  label: string;
  standardDeduction: number;
  zeroRateMax: number;
  fifteenRateMax: number;
  /** [lowerBound, marginalRate, taxAtLowerBound] */
  brackets: [number, number, number][];
  niitThreshold: number;
};

export const capitalGains = raw as unknown as {
  year: number;
  source: { label: string; url: string; sections: string };
  worksheetSource: { label: string; url: string };
  filingStatuses: CapitalGainsStatus[];
  niitRate: number;
};

export const statusByKey: Record<string, CapitalGainsStatus> =
  Object.fromEntries(capitalGains.filingStatuses.map(s => [s.key, s]));

/** Tax on an amount using the ordinary § 1 rate schedule — the worksheet's "Tax Table" steps. */
export function ordinaryTax(amount: number, status: CapitalGainsStatus): number {
  const income = Math.max(0, amount);
  let chosen = status.brackets[0];
  for (const b of status.brackets) if (income > b[0]) chosen = b;
  const [lower, rate, base] = chosen;
  return base + (income - lower) * rate;
}

export type WorksheetLines = {
  l1: number; l2: number; l3: number; l4: number; l5: number;
  l6: number; l7: number; l8: number; l9: number; l10: number;
  l11: number; l12: number; l13: number; l14: number; l15: number;
  l16: number; l17: number; l18: number; l19: number; l20: number;
  l21: number; l22: number; l23: number; l24: number; l25: number;
};

/**
 * The Qualified Dividends and Capital Gain Tax Worksheet from the Form 1040
 * instructions, line for line. Line 25 is the tax — the smaller of the
 * preferential-rate computation (line 23) and the all-ordinary tax (line 24),
 * which is what stops the worksheet ever costing more than the plain rate schedule.
 */
export function runWorksheet(
  taxableIncome: number,
  qualifiedDividends: number,
  netCapitalGain: number,
  status: CapitalGainsStatus,
): WorksheetLines {
  const l1 = Math.max(0, taxableIncome);
  const l2 = Math.max(0, qualifiedDividends);
  const l3 = Math.max(0, netCapitalGain);
  const l4 = l2 + l3;
  const l5 = Math.max(0, l1 - l4);
  const l6 = status.zeroRateMax;
  const l7 = Math.min(l1, l6);
  const l8 = Math.min(l5, l7);
  const l9 = l7 - l8;                       // taxed at 0%
  const l10 = Math.min(l1, l4);
  const l11 = l9;
  const l12 = l10 - l11;
  const l13 = status.fifteenRateMax;
  const l14 = Math.min(l1, l13);
  const l15 = l5 + l9;
  const l16 = Math.max(0, l14 - l15);
  const l17 = Math.min(l12, l16);           // taxed at 15%
  const l18 = l17 * 0.15;
  const l19 = l9 + l17;
  const l20 = l10 - l19;                    // taxed at 20%
  const l21 = l20 * 0.20;
  const l22 = ordinaryTax(l5, status);
  const l23 = l18 + l21 + l22;
  const l24 = ordinaryTax(l1, status);
  const l25 = Math.min(l23, l24);
  return { l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17, l18, l19, l20, l21, l22, l23, l24, l25 };
}

/**
 * Net investment income tax: 3.8% of the lesser of net investment income or
 * the excess of modified AGI over the threshold. Thresholds are statutory and
 * are not indexed for inflation.
 */
export function niit(netInvestmentIncome: number, modifiedAgi: number, status: CapitalGainsStatus): number {
  const excess = Math.max(0, modifiedAgi - status.niitThreshold);
  return Math.min(Math.max(0, netInvestmentIncome), excess) * (capitalGains.niitRate / 100);
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const money2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
