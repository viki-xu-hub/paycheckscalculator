// Generates the images for the /biweekly-pay pages.
// Run: npx tsx scripts/generate-biweekly-pay-charts.ts   (writes public/images/biweekly-pay/)
// Every figure comes from app/lib/biweeklyPay.ts, which uses the payroll engine, so rerun after a tax-table update.
// The cover is rendered to PNG (OG images cannot be SVG) with headless Chrome. Set CHROME_PATH if it lives elsewhere.

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BANK_HOLIDAY_FRIDAYS, BIWEEKLY_DATES_IMAGE, BIWEEKLY_HUB_IMAGE, BIWEEKLY_PAGES, biweeklyFacts, biweeklyImages, dollars, fridaySchedule, type BiweeklyFacts, type BiweeklyPage } from "../app/lib/biweeklyPay";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "public/images/biweekly-pay");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
mkdirSync(OUT, { recursive: true });

const FONT = "Arial,Helvetica,sans-serif";
// Series colors pass the dataviz palette validator on the #f6f9fc chart surface.
const C = {
  surface: "#f6f9fc",
  net: "#1769aa",
  federal: "#c9502b",
  fica: "#0e9384",
  state: "#8f62c9",
  ink: "#122a3d",
  body: "#3d5466",
  muted: "#5f7485",
  faint: "#8595a5",
  grid: "#dfe7ee",
  soft: "#e6eef5",
};
const FOOT = "paycheckscalculator.org · Single filer, standard W-4, no pre-tax deductions, 2026 withholding tables";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function text(x: number, y: number, s: string, o: { size?: number; weight?: number; fill?: string; anchor?: string; serif?: boolean } = {}) {
  return `<text x="${x}" y="${y}" text-anchor="${o.anchor ?? "start"}" font-family="${o.serif ? "Georgia,serif" : FONT}" font-size="${o.size ?? 14}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? C.ink}">${esc(s)}</text>`;
}

/** A bar segment with an optional 4px rounded data end; square at the baseline. */
function bar(x: number, y: number, w: number, h: number, fill: string, roundEnd = false) {
  if (w <= 0) return "";
  if (!roundEnd || w < 4) return `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" fill="${fill}"/>`;
  const r = 4;
  const right = x + w;
  return `<path d="M${x.toFixed(1)} ${y}H${(right - r).toFixed(1)}Q${right.toFixed(1)} ${y} ${right.toFixed(1)} ${y + r}V${y + h - r}Q${right.toFixed(1)} ${y + h} ${(right - r).toFixed(1)} ${y + h}H${x.toFixed(1)}Z" fill="${fill}"/>`;
}

function frame(file: string, w: number, h: number, title: string, desc: string, heading: string, sub: string, body: string[]) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">`,
    `<title id="t">${esc(title)}</title>`,
    `<desc id="d">${esc(desc)}</desc>`,
    `<rect width="${w}" height="${h}" rx="16" fill="${C.surface}"/>`,
    text(32, 44, heading, { size: 25, weight: 700, serif: true }),
    text(32, 70, sub, { fill: C.muted }),
    ...body,
    text(32, h - 16, FOOT, { size: 12, fill: C.faint }),
    "</svg>",
  ].join("\n");
  writeFileSync(join(OUT, file), svg);
}

/* Where each check goes: one stacked bar per location, split by tax. */
function splitChart(page: BiweeklyPage, f: BiweeklyFacts, file: string) {
  const W = 960;
  const H = 350;
  const left = 170;
  const barW = W - left - 40;
  const gross = f.single.gross;
  const fica = f.single.socialSecurity + f.single.medicare;
  const rows = [
    { name: "Texas", net: f.noTaxNet, state: 0 },
    { name: f.lowest.name, net: f.lowest.net, state: f.lowest.tax },
  ];
  const keys: [string, string][] = [[C.net, "Take-home"], [C.federal, "Federal income tax"], [C.fica, "Social Security and Medicare"], [C.state, "State and local tax"]];
  const body: string[] = [];
  let lx = 32;
  for (const [color, label] of keys) {
    body.push(`<rect x="${lx}" y="92" width="12" height="12" rx="2" fill="${color}"/>`, text(lx + 18, 103, label, { size: 13, fill: C.body }));
    lx += 30 + label.length * 7;
  }
  rows.forEach((row, i) => {
    const y = 136 + i * 104;
    const barH = 24;
    let x = left;
    const parts: [number, string][] = [[row.net, C.net], [f.single.federal, C.federal], [fica, C.fica], [row.state, C.state]];
    const visible = parts.filter(([v]) => v > 0);
    visible.forEach(([value, color], k) => {
      const segW = (value / gross) * barW;
      const gap = k < visible.length - 1 ? 2 : 0;
      body.push(bar(x, y, segW - gap, barH, color, k === visible.length - 1));
      x += segW;
    });
    body.push(text(left - 14, y + 17, row.name, { size: 15, weight: 600, anchor: "end" }));
    body.push(text(left, y + 50, `${dollars(row.net)} take-home`, { size: 15, weight: 700 }));
    const taxes = [`${dollars(f.single.federal)} federal`, `${dollars(fica)} Social Security and Medicare`];
    if (row.state > 0) taxes.push(`${dollars(row.state)} state and local`);
    body.push(text(left + 150, y + 50, taxes.join(" · "), { size: 13, fill: C.muted }));
  });
  frame(
    file, W, H,
    `Where a ${dollars(gross)} biweekly check goes on ${page.lower}`,
    `On ${page.lower}, a ${dollars(gross)} biweekly check leaves ${dollars(f.noTaxNet)} after taxes in Texas and ${dollars(f.lowest.net)} in ${f.lowest.name}.`,
    `Where a ${dollars(gross)} biweekly check goes`,
    `${page.label}, per check`,
    body,
  );
}

/* State and local tax per check: the five biggest takers against the middle and the zero group. */
function stateChart(page: BiweeklyPage, f: BiweeklyFacts, file: string) {
  const W = 960;
  const H = 400;
  const left = 190;
  const maxW = W - left - 220;
  const max = f.lowestFive[0].tax;
  const rows = [
    ...f.lowestFive.map(s => ({ name: s.name, tax: s.tax, net: s.net })),
    { name: `${f.typical.name} (middle)`, tax: f.typical.tax, net: f.typical.net },
    { name: "Texas and others", tax: 0, net: f.noTaxNet },
  ];
  const body: string[] = [];
  const top = 92;
  const rowH = 38;
  body.push(`<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${top + rowH * rows.length - 8}" stroke="${C.grid}" stroke-width="1"/>`);
  rows.forEach((row, i) => {
    const y = top + i * rowH;
    const w = (row.tax / max) * maxW;
    body.push(text(left - 12, y + 18, row.name, { size: 14, anchor: "end", fill: C.body }));
    if (w > 0) body.push(bar(left, y, w, 24, C.state, true));
    body.push(text(left + w + 10, y + 18, `${dollars(row.tax)} tax`, { size: 14, weight: 700 }));
    body.push(text(left + w + 80, y + 18, `keeps ${dollars(row.net)}`, { size: 13, fill: C.muted }));
  });
  frame(
    file, W, H,
    `State and local tax per biweekly check on ${page.lower}`,
    `${f.lowestFive.map(s => `${s.name} ${dollars(s.tax)}`).join(", ")}, compared with $0 in Texas.`,
    `What state tax takes from a ${dollars(f.single.gross)} check`,
    `${page.label}, state and local tax per biweekly check`,
    body,
  );
}

/* 2026 paydays: each cohort's month totals, with the three-check months marked. */
function calendarChart(page: BiweeklyPage, f: BiweeklyFacts, file: string) {
  const W = 960;
  const H = 330;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const left = 158;
  const cell = 64;
  const gap = 2;
  const body: string[] = [];
  months.forEach((m, i) => body.push(text(left + i * cell + (cell - gap) / 2, 104, m, { size: 13, anchor: "middle", fill: C.muted })));
  const cohorts = [
    { label: "Fridays from Jan 2", perMonth: f.cohortA.perMonth },
    { label: "Fridays from Jan 9", perMonth: f.cohortB.perMonth },
  ];
  cohorts.forEach((cohort, r) => {
    const y = 116 + r * 72;
    body.push(text(left - 12, y + 34, cohort.label, { size: 13, anchor: "end", fill: C.body }));
    cohort.perMonth.forEach((count, i) => {
      const x = left + i * cell;
      const three = count === 3;
      body.push(`<rect x="${x}" y="${y}" width="${cell - gap}" height="64" rx="4" fill="${three ? C.net : C.soft}"/>`);
      body.push(text(x + (cell - gap) / 2, y + 28, `${count} checks`, { size: 11, anchor: "middle", fill: three ? "#ffffff" : C.muted }));
      body.push(text(x + (cell - gap) / 2, y + 47, dollars(f.noTaxNet * count), { size: 13, weight: 700, anchor: "middle", fill: three ? "#ffffff" : C.ink }));
    });
  });
  frame(
    file, W, H,
    `2026 biweekly paydays on ${page.lower}`,
    `Most months pay two checks, ${dollars(f.twoCheck)} after taxes in Texas. Two months pay three checks, ${dollars(f.threeCheck)}.`,
    `Most months pay ${dollars(f.twoCheck)}, two pay ${dollars(f.threeCheck)}`,
    `${page.label}, take-home by month in 2026 (Texas)`,
    body,
  );
}

/* The cover: the answer as a pay-stub card. Also the page's OG image. */
function coverSvg(page: BiweeklyPage, f: BiweeklyFacts) {
  const W = 1200;
  const H = 630;
  const NAVY = "#0d2945";
  const LIGHT = "#b9cbdc";
  const ACCENT = "#ffd166";
  const gross = f.single.gross;
  const lowName = f.lowest.name;
  const scale = 1040;
  const lane = (y: number, label: string, net: number, big: string) => {
    const w = (net / gross) * scale;
    return [
      text(80, y, label, { size: 26, fill: LIGHT }),
      text(1120, y + 2, big, { size: 44, weight: 700, anchor: "end", fill: "#ffffff" }),
      `<rect x="80" y="${y + 18}" width="${scale}" height="18" rx="4" fill="#25425f"/>`,
      `<rect x="80" y="${y + 18}" width="${w.toFixed(1)}" height="18" rx="4" fill="${ACCENT}"/>`,
    ].join("\n");
  };
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    `<rect width="${W}" height="${H}" fill="${NAVY}"/>`,
    text(80, 86, "BIWEEKLY PAY AFTER TAXES · 2026", { size: 22, weight: 700, fill: ACCENT }),
    text(80, 160, `${page.label} Is How Much Biweekly?`, { size: 52, weight: 700, fill: "#ffffff", serif: true }),
    text(80, 236, "Before taxes", { size: 26, fill: LIGHT }),
    text(1120, 240, dollars(gross), { size: 44, weight: 700, anchor: "end", fill: "#ffffff" }),
    `<rect x="80" y="256" width="${scale}" height="18" rx="4" fill="#5b7894"/>`,
    lane(340, "Texas", f.noTaxNet, dollars(f.noTaxNet)),
    lane(444, lowName, f.lowest.net, dollars(f.lowest.net)),
    text(80, 566, `Yellow is what reaches you. Same pay, ${dollars(f.gapToLowest)} a check apart.`, { size: 26, fill: "#ffffff" }),
    text(80, 600, "Single filer, standard W-4, no pre-tax deductions · paycheckscalculator.org", { size: 18, fill: LIGHT }),
    "</svg>",
  ].join("\n");
}

/* The hub cover: all nine pages as one chart, each bar scaled to the largest check. */
function hubCoverSvg() {
  const W = 1200;
  const H = 630;
  const NAVY = "#0d2945";
  const LIGHT = "#b9cbdc";
  const ACCENT = "#ffd166";
  const rows = BIWEEKLY_PAGES.map(page => ({ page, f: biweeklyFacts(page) })).sort((a, b) => a.page.annual - b.page.annual);
  const max = Math.max(...rows.map(r => r.f.single.gross));
  const left = 300;
  const scale = 640;
  const top = 168;
  const rowH = 44;
  const body = rows.map(({ page, f }, i) => {
    const y = top + i * rowH;
    const grossW = (f.single.gross / max) * scale;
    const netW = (f.noTaxNet / max) * scale;
    return [
      text(left - 18, y + 20, page.lower, { size: 22, anchor: "end", fill: "#ffffff" }),
      `<rect x="${left}" y="${y}" width="${grossW.toFixed(1)}" height="26" rx="4" fill="#25425f"/>`,
      `<rect x="${left}" y="${y}" width="${netW.toFixed(1)}" height="26" rx="4" fill="${ACCENT}"/>`,
      text(left + scale + 18, y + 20, `${dollars(f.single.gross)} → ${dollars(f.noTaxNet)}`, { size: 22, weight: 700, fill: "#ffffff" }),
    ].join("\n");
  });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    `<rect width="${W}" height="${H}" fill="${NAVY}"/>`,
    text(60, 66, "BIWEEKLY PAY CHART · 2026", { size: 22, weight: 700, fill: ACCENT }),
    text(60, 130, "What Each Salary Pays Per Check", { size: 50, weight: 700, fill: "#ffffff", serif: true }),
    ...body,
    text(60, 590, "Yellow is take-home in Texas. Single filer, standard W-4, no pre-tax deductions · paycheckscalculator.org", { size: 20, fill: LIGHT }),
    "</svg>",
  ].join("\n");
}

/* Every Friday pay date on one page, for the hub calendar and image search. Dates do not depend on tax tables. */
function datesSvg() {
  const W = 1200;
  const H = 630;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const left = 148;
  const cell = 85;
  const top = 128;
  const rowH = 112;
  const body: string[] = [];
  months.forEach((m, i) => body.push(text(left + i * cell + (cell - 3) / 2, top - 10, m, { size: 15, anchor: "middle", fill: C.muted })));
  ([[2026, 2], [2026, 9], [2027, 2], [2027, 9]] as const).forEach(([year, first], r) => {
    const y = top + r * rowH;
    const schedule = fridaySchedule(first, year);
    body.push(text(24, y + 44, `${year}`, { size: 22, weight: 700, serif: true }));
    body.push(text(24, y + 68, `Jan ${first}, 2026 cycle`, { size: 13, fill: C.body }));
    months.forEach((_, m) => {
      const x = left + m * cell;
      const three = schedule.perMonth[m] === 3;
      const days = schedule.dates.filter(iso => Number(iso.slice(5, 7)) === m + 1);
      body.push(`<rect x="${x}" y="${y}" width="${cell - 3}" height="${rowH - 4}" rx="4" fill="${three ? C.net : C.soft}"/>`);
      const lineTop = y + (rowH - 4 - days.length * 26) / 2 + 20;
      days.forEach((iso, d) => {
        const mark = BANK_HOLIDAY_FRIDAYS.includes(iso) ? "†" : "";
        body.push(text(x + (cell - 3) / 2, lineTop + d * 26, `${Number(iso.slice(8))}${mark}`, { size: 19, weight: 700, anchor: "middle", fill: three ? "#ffffff" : C.ink }));
      });
    });
  });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    `<rect width="${W}" height="${H}" fill="${C.surface}"/>`,
    text(24, 50, "Biweekly Pay Dates 2026–27", { size: 34, weight: 700, serif: true }),
    text(24, 84, "Friday paydays on the two common cycles. Blue months pay three checks. † Federal Reserve Banks closed.", { size: 17, fill: C.muted }),
    ...body,
    text(24, H - 8, "paycheckscalculator.org · Your employer sets the actual pay dates", { size: 13, fill: C.faint }),
    "</svg>",
  ].join("\n");
}

function renderPng(svg: string, outFile: string) {
  const dir = mkdtempSync(join(tmpdir(), "bw-cover-"));
  try {
    const html = join(dir, "cover.html");
    writeFileSync(html, `<!doctype html><html><body style="margin:0;background:#0d2945">${svg}</body></html>`);
    execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1200,630", `--user-data-dir=${join(dir, "profile")}`, `--screenshot=${outFile}`, `file://${html}`], { stdio: "ignore", timeout: 60000 });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

for (const page of BIWEEKLY_PAGES) {
  const f = biweeklyFacts(page);
  const images = biweeklyImages(page.slug);
  const file = (path: string) => path.replace("/images/biweekly-pay/", "");
  splitChart(page, f, file(images.split));
  stateChart(page, f, file(images.states));
  calendarChart(page, f, file(images.calendar));
  renderPng(coverSvg(page, f), join(OUT, file(images.cover)));
}
renderPng(hubCoverSvg(), join(ROOT, "public", BIWEEKLY_HUB_IMAGE));
renderPng(datesSvg(), join(ROOT, "public", BIWEEKLY_DATES_IMAGE));
console.log(`wrote images for ${BIWEEKLY_PAGES.length} pages to ${OUT}`);
