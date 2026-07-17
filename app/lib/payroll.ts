export type FilingStatus = "single" | "married" | "head";

const brackets: Record<FilingStatus, [number, number][]> = {
  single: [[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[640600,.35],[Infinity,.37]],
  married: [[24800,.10],[100800,.12],[211400,.22],[403550,.24],[512450,.32],[768700,.35],[Infinity,.37]],
  head: [[17700,.10],[67450,.12],[105700,.22],[201750,.24],[256200,.32],[640600,.35],[Infinity,.37]],
};

const standardDeduction: Record<FilingStatus, number> = { single:16100, married:32200, head:24150 };

export function estimateAnnualPay(gross: number, status: FilingStatus, preTax = 0) {
  const taxableWages = Math.max(0, gross - preTax);
  const taxableFederal = Math.max(0, taxableWages - standardDeduction[status]);
  let federal = 0, previous = 0;
  for (const [ceiling, rate] of brackets[status]) {
    if (taxableFederal <= previous) break;
    federal += (Math.min(taxableFederal, ceiling) - previous) * rate;
    previous = ceiling;
  }
  const socialSecurity = Math.min(taxableWages, 184500) * .062;
  const medicare = taxableWages * .0145 + Math.max(0, taxableWages - 200000) * .009;
  return { federal, socialSecurity, medicare, net: Math.max(0, gross - preTax - federal - socialSecurity - medicare) };
}

export const money = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:2 });
export const wholeMoney = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 });
