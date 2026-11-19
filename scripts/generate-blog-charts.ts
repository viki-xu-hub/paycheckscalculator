// Generate the static SVG charts used by the /blog posts.
// Run: npx tsx scripts/generate-blog-charts.ts   (writes public/images/blog/*.svg)
// Figures come from app/lib/blogPosts.ts, which uses the payroll engine, so rerun after a tax-table update.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BIWEEKLY_FACTOR,
  K401_SALARY,
  biweeklyPaydays2026,
  californiaBreakdown,
  k401Roth,
  k401Rows,
  texasBreakdown,
  texasExample,
  EXEMPT_THRESHOLDS_2026,
  GVN_SALARY,
  ficaRows,
  grossVsNetStates,
  overtimeRows,
  OT_RATE,
  payPeriodRows,
  semiVsBiRows,
  seRows,
  stubExample,
  taxableExample,
  annualIncomeGrid,
  ANNUAL_HOURS,
} from "../app/lib/blogPosts";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "public/images/blog");
mkdirSync(OUT, { recursive: true });

const W = 960;
const H = 440;
const FONT = "Arial,Helvetica,sans-serif";
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const money2 = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const C = { net: "#1769aa", federal: "#e07a5f", ss: "#f2cc8f", medicare: "#c9a66b", state: "#81b29a", light: "#8fb8de", ink: "#122a3d", muted: "#5f7485", grid: "#dfe7ee" };

const text = (x: number, y: number, s: string, opts: { size?: number; weight?: number; fill?: string; anchor?: string; serif?: boolean } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${opts.anchor ?? "start"}" font-family="${opts.serif ? "Georgia,serif" : FONT}" font-size="${opts.size ?? 14}" font-weight="${opts.weight ?? 400}" fill="${opts.fill ?? C.ink}">${esc(s)}</text>`;

const FOOT_PAYROLL = "paycheckscalculator.org · 2026 IRS Pub 15-T withholding, 6.2% Social Security, 1.45% Medicare";

function frame(file: string, title: string, desc: string, heading: string, sub: string, body: string[], legend: [string, string][] = [], h = H, foot = FOOT_PAYROLL) {
  const legendParts = legend.map(([color, label], i) => {
    const x = 32 + i * 210;
    return `<rect x="${x}" y="${h - 52}" width="14" height="14" rx="3" fill="${color}"/>${text(x + 22, h - 40, label, { size: 13, fill: "#3d5466" })}`;
  });
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-labelledby="t d">`,
    `<title id="t">${esc(title)}</title>`,
    `<desc id="d">${esc(desc)}</desc>`,
    `<rect width="${W}" height="${h}" rx="16" fill="#f6f9fc"/>`,
    text(32, 44, heading, { size: 25, weight: 700, serif: true }),
    text(32, 70, sub, { fill: C.muted }),
    ...body,
    ...legendParts,
    text(32, h - 14, foot, { size: 12, fill: "#8595a5" }),
    "</svg>",
  ].join("\n");
  writeFileSync(join(OUT, file), svg);
}

/* 1. Biweekly paydays per month in 2026, both Friday cohorts */
{
  const a = biweeklyPaydays2026(2);
  const b = biweeklyPaydays2026(9);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const base = 330;
  const unit = 66;
  const body: string[] = [];
  months.forEach((m, i) => {
    const x = 70 + i * 72;
    [[a.perMonth[i], C.net, 0], [b.perMonth[i], C.light, 30]].forEach(([count, color, dx]) => {
      const hgt = (count as number) * unit;
      body.push(`<rect x="${x + (dx as number)}" y="${base - hgt}" width="26" height="${hgt}" rx="4" fill="${color}"/>`);
      if (count === 3) body.push(text(x + (dx as number) + 13, base - hgt - 8, "3", { size: 14, weight: 700, anchor: "middle" }));
    });
    body.push(text(x + 28, base + 22, m, { size: 13, anchor: "middle", fill: "#3d5466" }));
  });
  [1, 2, 3].forEach(n => body.push(`<line x1="58" x2="${W - 30}" y1="${base - n * unit}" y2="${base - n * unit}" stroke="${C.grid}" stroke-dasharray="4 4"/>`, text(50, base - n * unit + 5, String(n), { size: 12, anchor: "end", fill: C.muted })));
  frame(
    "biweekly-paychecks-per-month-2026.svg",
    "2026 biweekly paydays per month",
    "Two biweekly Friday schedules in 2026. Paid from January 2: January and July have three paychecks. Paid from January 9: May and October have three. Every other month has two, for 26 paychecks a year.",
    "26 Paychecks, 12 Months: Two Months Get a Third Check",
    "2026 Friday paydays · first payday Jan 2 (dark) or Jan 9 (light)",
    body,
    [[C.net, "Paid from Jan 2 (3 in Jan, Jul)"], [C.light, "Paid from Jan 9 (3 in May, Oct)"]],
  );
}

/* 2. Doubling vs ×26÷12 for a $2,000 biweekly gross */
{
  const check = 2000;
  const rows: [string, number, string][] = [
    ["Double one check (×2)", check * 2, C.federal],
    ["Two-check month (cash)", check * 2, C.light],
    ["Correct average (×26 ÷ 12)", check * BIWEEKLY_FACTOR, C.net],
    ["Three-check month (cash)", check * 3, C.light],
  ];
  const left = 290;
  const maxW = 560;
  const max = check * 3;
  const body = rows.flatMap(([label, value, color], i) => {
    const y = 100 + i * 66;
    const w = (maxW * value) / max;
    return [
      text(left - 14, y + 27, label, { size: 15, weight: 700, anchor: "end" }),
      `<rect x="${left}" y="${y}" width="${w.toFixed(1)}" height="40" rx="6" fill="${color}"/>`,
      text(left + w + 10, y + 27, money2(value), { size: 15, weight: 700 }),
    ];
  });
  frame(
    "biweekly-monthly-income-methods.svg",
    "Monthly income from a $2,000 biweekly paycheck by method",
    `For a $2,000 gross biweekly paycheck, doubling gives $4,000 a month, the correct 26-over-12 average gives ${money2(check * BIWEEKLY_FACTOR)}, and a three-paycheck month actually pays $6,000.`,
    "Doubling a Biweekly Check Understates Monthly Income",
    "$2,000 gross biweekly paycheck · gross monthly income by method",
    body,
    [[C.net, "Use this for budgets & applications"], [C.federal, "Common mistake"], [C.light, "Actual cash in a given month"]],
  );
}

/* 3. Texas biweekly paycheck breakdown at four salaries */
{
  const left = 160;
  const maxW = 620;
  const body = texasBreakdown.flatMap((row, i) => {
    const y = 96 + i * 70;
    let x = left;
    const segs: [number, string][] = [[row.net, C.net], [row.federal, C.federal], [row.socialSecurity, C.ss], [row.medicare, C.medicare]];
    const rects = segs.map(([v, color]) => {
      const w = (maxW * v) / texasBreakdown[texasBreakdown.length - 1].gross;
      const r = `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="44" fill="${color}"/>`;
      x += w;
      return r;
    });
    return [
      text(left - 14, y + 20, `${money(row.salary)}/yr`, { size: 15, weight: 700, anchor: "end" }),
      text(left - 14, y + 38, `${money2(row.gross)} gross`, { size: 12, anchor: "end", fill: C.muted }),
      ...rects,
      text(left + 10, y + 28, `${money2(row.net)} take-home`, { size: 14, weight: 700, fill: "#fff" }),
      text(x + 8, y + 28, `${Math.round((1 - row.net / row.gross) * 100)}% withheld`, { size: 13, fill: C.muted }),
    ];
  });
  frame(
    "texas-paycheck-tax-breakdown.svg",
    "Texas biweekly paycheck tax breakdown at four salaries",
    texasBreakdown.map(r => `${money(r.salary)} salary: ${money2(r.gross)} gross, ${money2(r.federal)} federal, ${money2(r.socialSecurity)} Social Security, ${money2(r.medicare)} Medicare, ${money2(r.net)} take-home`).join(". ") + ". Single filer, no Texas income tax.",
    "Where a Texas Biweekly Paycheck Goes",
    "Single filer, standard 2026 W-4, no pre-tax deductions · no Texas state income tax",
    body,
    [[C.net, "Take-home pay"], [C.federal, "Federal income tax"], [C.ss, "Social Security 6.2%"], [C.medicare, "Medicare 1.45%"]],
  );
}

/* 4. Texas vs California take-home per biweekly check */
{
  const base = 330;
  const chartH = 220;
  const max = texasBreakdown[texasBreakdown.length - 1].net;
  const body = texasBreakdown.flatMap((tx, i) => {
    const ca = californiaBreakdown[i];
    const x = 110 + i * 205;
    const hT = (chartH * tx.net) / max;
    const hC = (chartH * ca.net) / max;
    return [
      `<rect x="${x}" y="${(base - hT).toFixed(1)}" width="72" height="${hT.toFixed(1)}" rx="6" fill="${C.net}"/>`,
      `<rect x="${x + 80}" y="${(base - hC).toFixed(1)}" width="72" height="${hC.toFixed(1)}" rx="6" fill="${C.state}"/>`,
      text(x + 36, base - hT - 8, money(tx.net), { size: 13, weight: 700, anchor: "middle" }),
      text(x + 116, base - hC - 8, money(ca.net), { size: 13, weight: 700, anchor: "middle" }),
      text(x + 76, base + 22, `${money(tx.salary)} salary`, { size: 14, anchor: "middle", fill: "#3d5466" }),
      text(x + 76, base + 42, `TX keeps +${money2(tx.net - ca.net)}/check`, { size: 12, anchor: "middle", fill: C.muted }),
    ];
  });
  frame(
    "texas-vs-california-take-home.svg",
    "Texas vs California biweekly take-home pay",
    texasBreakdown.map((tx, i) => `${money(tx.salary)}: Texas ${money2(tx.net)}, California ${money2(californiaBreakdown[i].net)}`).join("; ") + " per biweekly paycheck, single filer.",
    "Same Salary, Bigger Check: Texas vs California",
    "Biweekly take-home pay, single filer · difference is California income tax and SDI",
    body,
    [[C.net, "Texas take-home"], [C.state, "California take-home"]],
    460,
  );
}

/* 5. Annotated Texas pay stub for the $60,000 example */
{
  const e = texasExample;
  const c = e.check;
  const lines: [string, string, string, string][] = [
    ["Gross pay (regular)", money2(c.gross), C.net, "① $60,000 ÷ 26 pay periods"],
    ["Federal income tax", `−${money2(c.federal)}`, C.federal, "② IRS Pub 15-T percentage method"],
    ["Social Security (OASDI)", `−${money2(c.socialSecurity)}`, C.ss, "③ 6.2% of gross"],
    ["Medicare", `−${money2(c.medicare)}`, C.medicare, "④ 1.45% of gross"],
    ["Texas state income tax", "$0.00", C.state, "⑤ Texas has no wage income tax"],
    ["Net pay", money2(c.net), C.net, "⑥ Gross minus ②③④"],
  ];
  const body: string[] = [
    `<rect x="40" y="92" width="470" height="300" rx="10" fill="#fff" stroke="#c9d6e2"/>`,
    text(60, 122, "EARNINGS STATEMENT · Biweekly", { size: 13, weight: 700, fill: C.muted }),
    text(490, 122, "Pay date 11/06/2026", { size: 12, anchor: "end", fill: C.muted }),
    `<line x1="60" x2="490" y1="134" y2="134" stroke="${C.grid}"/>`,
  ];
  lines.forEach(([label, amount, color, note], i) => {
    const y = 166 + i * 38;
    const bold = i === 0 || i === lines.length - 1;
    if (i === lines.length - 1) body.push(`<line x1="60" x2="490" y1="${y - 22}" y2="${y - 22}" stroke="${C.ink}"/>`);
    body.push(
      `<rect x="60" y="${y - 14}" width="6" height="18" rx="2" fill="${color}"/>`,
      text(76, y, label, { size: 15, weight: bold ? 700 : 400 }),
      text(490, y, amount, { size: 15, weight: bold ? 700 : 400, anchor: "end" }),
      `<line x1="510" x2="548" y1="${y - 5}" y2="${y - 5}" stroke="#b7c6d3" stroke-dasharray="3 3"/>`,
      text(556, y, note, { size: 14, fill: "#3d5466" }),
    );
  });
  frame(
    "texas-pay-stub-annotated.svg",
    "Annotated Texas biweekly pay stub for a $60,000 salary",
    `A $60,000 single filer in Texas: ${money2(c.gross)} gross, ${money2(c.federal)} federal income tax, ${money2(c.socialSecurity)} Social Security, ${money2(c.medicare)} Medicare, $0 Texas income tax, ${money2(c.net)} net pay.`,
    "Reading a Texas Pay Stub, Line by Line",
    "$60,000 salary · single · biweekly · 2026 W-4 with no adjustments",
    body,
    [],
    440,
  );
}

/* 6. 401(k) contribution vs real take-home cost */
{
  const rows = k401Rows.filter(r => r.rate > 0);
  const base = 330;
  const chartH = 220;
  const max = rows[rows.length - 1].contribution;
  const body = rows.flatMap((r, i) => {
    const x = 110 + i * 205;
    const hC = (chartH * r.contribution) / max;
    const hD = (chartH * r.takeHomeDrop) / max;
    return [
      `<rect x="${x}" y="${(base - hC).toFixed(1)}" width="72" height="${hC.toFixed(1)}" rx="6" fill="${C.net}"/>`,
      `<rect x="${x + 80}" y="${(base - hD).toFixed(1)}" width="72" height="${hD.toFixed(1)}" rx="6" fill="${C.federal}"/>`,
      text(x + 36, base - hC - 8, money2(r.contribution), { size: 13, weight: 700, anchor: "middle" }),
      text(x + 116, base - hD - 8, money2(r.takeHomeDrop), { size: 13, weight: 700, anchor: "middle" }),
      text(x + 76, base + 22, `${r.rate}% contribution`, { size: 14, anchor: "middle", fill: "#3d5466" }),
      text(x + 76, base + 42, `tax break ${money2(r.taxSaved)}`, { size: 12, anchor: "middle", fill: C.muted }),
    ];
  });
  frame(
    "401k-take-home-cost.svg",
    "401(k) contribution vs drop in take-home pay",
    rows.map(r => `${r.rate}%: ${money2(r.contribution)} saved, take-home falls ${money2(r.takeHomeDrop)}`).join("; ") + `. ${money(K401_SALARY)} salary, single, biweekly, Texas.`,
    "Saving $150 Only Costs You About $132",
    `${money(K401_SALARY)} salary · single · biweekly · Texas · traditional (pre-tax) 401(k)`,
    body,
    [[C.net, "Into your 401(k) per check"], [C.federal, "Drop in take-home pay"]],
    460,
  );
}

/* 7. Traditional vs Roth vs none, same 6% */
{
  const r = k401Roth;
  const rows: [string, number, string, string][] = [
    ["No 401(k)", r.none.net, C.light, "baseline"],
    [`Traditional ${r.rate}%`, r.traditional.net, C.net, `−${money2(r.none.net - r.traditional.net)}`],
    [`Roth ${r.rate}%`, r.rothNet, C.state, `−${money2(r.none.net - r.rothNet)}`],
  ];
  const left = 220;
  const maxW = 600;
  const body = rows.flatMap(([label, value, color, delta], i) => {
    const y = 104 + i * 80;
    const w = (maxW * value) / r.none.net;
    return [
      text(left - 14, y + 30, label, { size: 16, weight: 700, anchor: "end" }),
      `<rect x="${left}" y="${y}" width="${w.toFixed(1)}" height="48" rx="6" fill="${color}"/>`,
      text(left + 12, y + 30, `${money2(value)} take-home`, { size: 15, weight: 700, fill: i === 0 ? C.ink : "#fff" }),
      text(left + w + 10, y + 30, delta, { size: 14, weight: 700, fill: C.muted }),
    ];
  });
  frame(
    "401k-traditional-vs-roth-paycheck.svg",
    "Traditional vs Roth 401(k) effect on one paycheck",
    `${money(K401_SALARY)} salary, ${r.rate}% contribution (${money2(r.contribution)} per check): no 401(k) ${money2(r.none.net)}, traditional ${money2(r.traditional.net)}, Roth ${money2(r.rothNet)} take-home.`,
    "Traditional vs Roth: Same Savings, Different Paycheck",
    `${money(K401_SALARY)} salary · ${r.rate}% contribution = ${money2(r.contribution)} per biweekly check · Texas, single`,
    body,
    [],
    400,
  );
}


/* ===================== November 2026 batch ===================== */

/** Horizontal bars: one row per item, optional stacked segments. */
function hbars(rows: { label: string; sub?: string; segs: [number, string][]; note?: string }[], max: number, opts: { left?: number; maxW?: number; top?: number; gap?: number; barH?: number } = {}) {
  const left = opts.left ?? 250;
  const maxW = opts.maxW ?? 560;
  const top = opts.top ?? 100;
  const gap = opts.gap ?? 64;
  const barH = opts.barH ?? 40;
  return rows.flatMap((r, i) => {
    const y = top + i * gap;
    let x = left;
    const rects = r.segs.map(([v, color]) => {
      const w = Math.max(0, (maxW * v) / max);
      const rect = `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${barH}" fill="${color}"/>`;
      x += w;
      return rect;
    });
    return [
      text(left - 14, y + (r.sub ? 18 : barH / 2 + 5), r.label, { size: 15, weight: 700, anchor: "end" }),
      ...(r.sub ? [text(left - 14, y + 35, r.sub, { size: 12, anchor: "end", fill: C.muted })] : []),
      ...rects,
      ...(r.note ? [text(x + 10, y + barH / 2 + 5, r.note, { size: 14, weight: 700 })] : []),
    ];
  });
}

/* 8. Semimonthly vs biweekly, $60,000 */
{
  const r = semiVsBiRows.find(x => x.salary === 60000)!;
  const body = hbars(
    [
      { label: "Semimonthly", sub: "24 checks a year", segs: [[r.semimonthly.net, C.net], [r.semimonthly.gross - r.semimonthly.net, C.federal]], note: `${money2(r.semimonthly.gross)} gross` },
      { label: "Biweekly", sub: "26 checks a year", segs: [[r.biweekly.net, C.net], [r.biweekly.gross - r.biweekly.net, C.federal]], note: `${money2(r.biweekly.gross)} gross` },
    ],
    r.semimonthly.gross,
    { top: 120, gap: 100, barH: 56, maxW: 520 },
  );
  body.push(text(32, 350, `Both schedules: ${money(r.salary)} gross and ${money(r.biweekly.netAnnual)} take-home a year`, { size: 16, weight: 700 }));
  frame(
    "semimonthly-vs-biweekly-paycheck.svg",
    "Semimonthly vs biweekly paycheck on a $60,000 salary",
    `Semimonthly: ${money2(r.semimonthly.gross)} gross, ${money2(r.semimonthly.net)} take-home per check, 24 checks. Biweekly: ${money2(r.biweekly.gross)} gross, ${money2(r.biweekly.net)} take-home, 26 checks. Same annual pay.`,
    "Semimonthly vs Biweekly: Bigger Checks, Same Year",
    "$60,000 salary · single filer · Texas · per-check gross split into take-home and taxes",
    body,
    [[C.net, "Take-home pay"], [C.federal, "Federal tax + FICA"]],
  );
}

/* 9. Pay periods per year */
{
  const max = 52;
  const body = hbars(
    payPeriodRows.map(r => ({ label: r.label, segs: [[r.periods, C.net]] as [number, string][], note: `${r.periods} checks · ${money2(r.check.gross)} each` })),
    max,
    { top: 100, gap: 66, maxW: 420, left: 170 },
  );
  frame(
    "pay-periods-per-year.svg",
    "How many pay periods in a year by pay schedule",
    payPeriodRows.map(r => `${r.label}: ${r.periods} pay periods, ${money2(r.check.gross)} gross per check on $60,000`).join(". "),
    "How Many Pay Periods in a Year?",
    "Pay periods per year and gross per check on a $60,000 salary",
    body,
  );
}

/* 10. Taxable income waterfall */
{
  const e = taxableExample;
  const steps: [string, number, number, string][] = [
    ["Salary", 0, e.salary, C.light],
    ["401(k) + health", e.wages, e.salary, C.federal],
    ["+ Interest", e.wages, e.agi, C.state],
    ["Standard deduction", e.taxable, e.agi, C.federal],
    ["Taxable income", 0, e.taxable, C.net],
  ];
  const base = 330;
  const chartH = 230;
  const body = steps.flatMap(([label, lo, hi, color], i) => {
    const x = 90 + i * 168;
    const y = base - (chartH * hi) / e.salary;
    const h = (chartH * (hi - lo)) / e.salary;
    const value = i === 0 || i === 4 ? money(hi) : i === 2 ? `+${money(hi - lo)}` : `−${money(hi - lo)}`;
    return [
      `<rect x="${x}" y="${y.toFixed(1)}" width="110" height="${Math.max(2, h).toFixed(1)}" rx="5" fill="${color}"/>`,
      text(x + 55, y - 8, value, { size: 14, weight: 700, anchor: "middle" }),
      text(x + 55, base + 22, label, { size: 13, anchor: "middle", fill: "#3d5466" }),
    ];
  });
  frame(
    "taxable-income-waterfall.svg",
    "From salary to taxable income",
    `${money(e.salary)} salary minus ${money(e.k401 + e.health)} of pre-tax 401(k) and health premiums, plus ${money(e.interest)} interest, minus the ${money(e.sd)} 2026 standard deduction leaves ${money(e.taxable)} of taxable income.`,
    "What Is Taxable Income? From $60,000 Salary to Line 15",
    "Single filer, 2026 · IRS Rev. Proc. 2025-32 standard deduction",
    body,
    [],
    H,
    "paycheckscalculator.org · 2026 standard deduction and brackets, IRS Rev. Proc. 2025-32",
  );
}

/* 11. 1099 self-employment tax vs employee FICA */
{
  const body = hbars(
    seRows.flatMap(r => [
      { label: `${money(r.profit)} profit`, sub: "1099: self-employment tax", segs: [[r.total, C.federal]] as [number, string][], note: money2(r.total) },
      { label: "", sub: "W-2: employee FICA", segs: [[r.employeeFica, C.net]] as [number, string][], note: money2(r.employeeFica) },
    ]),
    seRows[seRows.length - 1].total,
    { top: 92, gap: 46, barH: 32, maxW: 480, left: 260 },
  );
  frame(
    "1099-vs-w2-payroll-tax.svg",
    "Self-employment tax on 1099 income vs employee FICA on W-2 wages",
    seRows.map(r => `${money(r.profit)}: self-employment tax ${money2(r.total)}, employee FICA ${money2(r.employeeFica)}`).join("; "),
    "1099 Income Carries Both Halves of FICA",
    "2026 self-employment tax (15.3% × 92.35%) vs employee share on the same pay",
    body,
    [[C.federal, "1099 self-employment tax"], [C.net, "W-2 employee FICA"]],
    H,
    "paycheckscalculator.org · Schedule SE 2026, $184,500 Social Security wage base",
  );
}

/* 12. Annual income by hours */
{
  const grid = annualIncomeGrid;
  const max = grid[grid.length - 1].values[ANNUAL_HOURS.length - 1];
  const base = 320;
  const chartH = 210;
  const colors = [C.light, C.state, C.net];
  const body: string[] = [];
  ANNUAL_HOURS.forEach((h, j) => {
    const gx = 90 + j * 210;
    grid.forEach((r, i) => {
      const v = r.values[j];
      const bh = (chartH * v) / max;
      const x = gx + i * 52;
      body.push(`<rect x="${x}" y="${(base - bh).toFixed(1)}" width="44" height="${bh.toFixed(1)}" rx="4" fill="${colors[i]}"/>`);
      body.push(text(x + 22, base - bh - 6, `${Math.round(v / 1000)}k`, { size: 12, weight: 700, anchor: "middle" }));
    });
    body.push(text(gx + 74, base + 22, `${h} h/week`, { size: 14, anchor: "middle", fill: "#3d5466" }));
  });
  frame(
    "annual-income-by-hours.svg",
    "Annual income by hourly rate and weekly hours",
    grid.map(r => `$${r.rate}/hour: ` + r.values.map((v, j) => `${ANNUAL_HOURS[j]} h ${money(v)}`).join(", ")).join(". "),
    "How to Calculate Annual Income From an Hourly Wage",
    "Rate × hours × 52 weeks · hours over 40 at 1.5×",
    body,
    grid.map((r, i) => [colors[i], `$${r.rate} an hour`] as [string, string]),
    H,
    "paycheckscalculator.org · gross annual income, 52 paid weeks, FLSA overtime over 40 hours",
  );
}

/* 13. FICA by salary */
{
  const body = hbars(
    ficaRows.map(r => ({ label: `${money(r.wages)}`, segs: [[r.ss, C.ss], [r.medicare, C.medicare], [r.addl, C.federal]] as [number, string][], note: `${money2(r.total)} · ${r.effective}%` })),
    ficaRows[ficaRows.length - 1].total,
    { top: 92, gap: 54, barH: 36, maxW: 480, left: 150 },
  );
  frame(
    "fica-tax-by-salary.svg",
    "FICA tax by salary in 2026",
    ficaRows.map(r => `${money(r.wages)} wages: Social Security ${money2(r.ss)}, Medicare ${money2(r.medicare)}, Additional Medicare ${money2(r.addl)}`).join("; "),
    "What Is FICA Tax at Each Salary?",
    "2026 employee FICA · Social Security stops at $184,500 · 0.9% extra Medicare over $200,000",
    body,
    [[C.ss, "Social Security 6.2%"], [C.medicare, "Medicare 1.45%"], [C.federal, "Additional Medicare 0.9%"]],
    H,
    "paycheckscalculator.org · 2026 SSA wage base, IRS Topic 751",
  );
}

/* 14. Overtime week */
{
  const body = hbars(
    overtimeRows.map(r => ({ label: `${r.hours} hours`, sub: r.otHours ? `${r.otHours} overtime hours` : "no overtime", segs: [[r.straight, C.net], [r.premium, C.federal]] as [number, string][], note: money2(r.total) })),
    overtimeRows[overtimeRows.length - 1].total,
    { top: 96, gap: 64, barH: 44, maxW: 520, left: 200 },
  );
  frame(
    "overtime-pay-week.svg",
    `Weekly overtime pay at $${OT_RATE} an hour`,
    overtimeRows.map(r => `${r.hours} hours: ${money2(r.straight)} at base rate plus ${money2(r.premium)} overtime premium = ${money2(r.total)}`).join("; "),
    "How Overtime Pay Adds Up in a Week",
    `$${OT_RATE}/hour · every hour at base rate plus a half-time premium for hours over 40`,
    body,
    [[C.net, "All hours at base rate"], [C.federal, "Overtime premium (0.5×)"]],
    H,
    "paycheckscalculator.org · FLSA overtime, 29 CFR 778",
  );
}

/* 15. Pay stub anatomy */
{
  const s = stubExample;
  const c = s.check;
  const lines: [string, number, string][] = [
    ["Gross pay", c.gross, C.ink],
    ["401(k) 5% (pre-tax)", -c.retirement, C.light],
    ["Medical/dental (pre-tax)", -c.otherPreTax, C.light],
    ["Federal income tax (FIT)", -c.federal, C.federal],
    ["Social Security (OASDI)", -c.socialSecurity, C.ss],
    ["Medicare (MED)", -c.medicare, C.medicare],
    ["Georgia income tax (SIT)", -c.state, C.state],
    ["Net pay", c.net, C.net],
  ];
  const body: string[] = [`<rect x="32" y="88" width="${W - 64}" height="300" rx="10" fill="#fff" stroke="${C.grid}"/>`];
  body.push(text(56, 114, "EARNINGS & DEDUCTIONS", { size: 12, weight: 700, fill: C.muted }), text(640, 114, "CURRENT", { size: 12, weight: 700, fill: C.muted, anchor: "end" }), text(880, 114, "YEAR TO DATE", { size: 12, weight: 700, fill: C.muted, anchor: "end" }));
  lines.forEach(([label, v, color], i) => {
    const y = 146 + i * 30;
    const bold = i === 0 || i === lines.length - 1;
    body.push(`<rect x="48" y="${y - 14}" width="6" height="18" rx="2" fill="${color}"/>`);
    body.push(text(64, y, label, { size: 15, weight: bold ? 700 : 400 }));
    body.push(text(640, y, `${v < 0 ? "−" : ""}${money2(Math.abs(v))}`, { size: 15, weight: bold ? 700 : 400, anchor: "end" }));
    body.push(text(880, y, `${v < 0 ? "−" : ""}${money2(Math.abs(v) * s.periodsPaid)}`, { size: 15, weight: bold ? 700 : 400, anchor: "end", fill: C.muted }));
  });
  frame(
    "pay-stub-anatomy.svg",
    "How to read a pay stub: labelled example",
    lines.map(([l, v]) => `${l} ${money2(v)}`).join(", ") + ` per biweekly check; YTD after ${s.periodsPaid} checks.`,
    "How to Read a Pay Stub: Gross to Net",
    `$60,000 salary · biweekly · Georgia · single filer · check ${s.periodsPaid} of 26`,
    body,
    [],
    430,
  );
}

/* 16. Gross vs net by state */
{
  const names: Record<string, string> = { TX: "Texas", CA: "California", NY: "New York" };
  const body = hbars(
    grossVsNetStates.map(r => ({ label: names[r.code], sub: `${r.netShare}% kept`, segs: [[r.net, C.net], [r.federal, C.federal], [r.socialSecurity + r.medicare, C.ss], [r.state, C.state]] as [number, string][] })),
    grossVsNetStates[0].gross,
    { top: 100, gap: 76, barH: 50, maxW: 600, left: 180 },
  );
  grossVsNetStates.forEach((r, i) => body.push(text(190, 100 + i * 76 + 30, `${money2(r.net)} net of ${money2(r.gross)}`, { size: 14, weight: 700, fill: "#fff" })));
  frame(
    "gross-vs-net-by-state.svg",
    "Gross pay vs net pay by state",
    grossVsNetStates.map(r => `${names[r.code]}: ${money2(r.gross)} gross, ${money2(r.net)} net (${r.netShare}%)`).join("; ") + ` per biweekly check on ${money(GVN_SALARY)}.`,
    "Gross Pay vs Net Pay: Same Salary, Three States",
    `${money(GVN_SALARY)} salary · biweekly check · single filer · no benefit deductions`,
    body,
    [[C.net, "Net pay"], [C.federal, "Federal tax"], [C.ss, "FICA"], [C.state, "State tax / SDI"]],
  );
}

/* 17. Exempt salary thresholds */
{
  const rows = EXEMPT_THRESHOLDS_2026.filter(t => t.weekly !== null);
  const body = hbars(
    rows.map(t => ({ label: t.where.replace(/ \(.*\)/, "").replace("New York outside NYC, Long Island, Westchester", "New York (rest of state)").replace("New York City, Long Island, Westchester", "NYC, Long Island, Westchester"), segs: [[t.annual, C.net]] as [number, string][], note: money(t.annual) })),
    rows[rows.length - 1].annual,
    { top: 100, gap: 64, barH: 40, maxW: 470, left: 330 },
  );
  frame(
    "exempt-salary-thresholds-2026.svg",
    "Exempt employee salary thresholds 2026",
    rows.map(t => `${t.where}: ${money(t.annual)} a year`).join("; "),
    "Exempt vs Non-Exempt: 2026 Salary Floors",
    "Minimum salary to be exempt from overtime (executive and administrative)",
    body,
    [],
    H,
    "paycheckscalculator.org · DOL 29 CFR 541; NY DOL; California Labor Code §515",
  );
}

console.log(`wrote blog charts to ${OUT}`);
