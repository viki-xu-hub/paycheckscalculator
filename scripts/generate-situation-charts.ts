// Generate one static SVG chart per state situation page (bonus / dependents / child support).
// Run: npx tsx scripts/generate-situation-charts.ts   (writes public/images/situations/*.svg)
// Figures come from the same payroll engine the pages use, so rerun after a tax-table update.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { situationChartData } from "../app/lib/situationCharts";
import { SITUATION_STATES, type SituationKind } from "../app/lib/stateSituations";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "public/images/situations");
mkdirSync(OUT, { recursive: true });

const W = 960;
const H = 420;
const FONT = "Arial,Helvetica,sans-serif";
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function frame(title: string, desc: string, heading: string, sub: string, body: string[], legend: [string, string][]) {
  const legendParts = legend.map(([color, label], i) => {
    const x = 32 + i * 200;
    return `<rect x="${x}" y="${H - 52}" width="14" height="14" rx="3" fill="${color}"/><text x="${x + 22}" y="${H - 40}" font-family="${FONT}" font-size="13" fill="#3d5466">${esc(label)}</text>`;
  });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">`,
    `<title id="t">${esc(title)}</title>`,
    `<desc id="d">${esc(desc)}</desc>`,
    `<rect width="${W}" height="${H}" rx="16" fill="#f6f9fc"/>`,
    `<text x="32" y="44" font-family="Georgia,serif" font-size="25" font-weight="700" fill="#122a3d">${esc(heading)}</text>`,
    `<text x="32" y="70" font-family="${FONT}" font-size="14" fill="#5f7485">${esc(sub)}</text>`,
    ...body,
    ...legendParts,
    `<text x="32" y="${H - 14}" font-family="${FONT}" font-size="12" fill="#8595a5">paycheckscalculator.org · 2026 federal and state withholding estimates</text>`,
    "</svg>",
  ].join("\n");
}

const COLORS = { net: "#1769aa", federal: "#e07a5f", fica: "#f2cc8f", state: "#81b29a", support: "#e07a5f", disposable: "#8fb8de" };

for (const state of SITUATION_STATES) {
  for (const kind of ["bonus", "dependents", "child-support"] as SituationKind[]) {
    const data = situationChartData(state.code, kind);
    let body: string[] = [];
    let legend: [string, string][] = [];

    if (data.kind === "bonus") {
      const left = 230;
      const maxW = 640;
      body = data.rows.flatMap((row, i) => {
        const y = 110 + i * 100;
        const segments: [number, string][] = [
          [row.net, COLORS.net],
          [row.federal, COLORS.federal],
          [row.fica, COLORS.fica],
          [row.state, COLORS.state],
        ];
        let x = left;
        const rects = segments
          .filter(([value]) => value > 0)
          .map(([value, color]) => {
            const w = (maxW * value) / data.bonus;
            const rect = `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="54" fill="${color}"/>`;
            x += w;
            return rect;
          });
        return [
          `<text x="${left - 14}" y="${y + 24}" text-anchor="end" font-family="${FONT}" font-size="15" font-weight="700" fill="#122a3d">${esc(row.label)}</text>`,
          `<text x="${left - 14}" y="${y + 44}" text-anchor="end" font-family="${FONT}" font-size="13" fill="#5f7485">take home ${money(row.net)}</text>`,
          ...rects,
          `<text x="${left + 10}" y="${y + 33}" font-family="${FONT}" font-size="15" font-weight="700" fill="#ffffff">${money(row.net)}</text>`,
        ];
      });
      legend = [[COLORS.net, "Take-home"], [COLORS.federal, "Federal withholding"], [COLORS.fica, "Social Security + Medicare"]];
      if (!state.noIncomeTax) legend.push([COLORS.state, `${state.name} income tax`]);
    }

    if (data.kind === "dependents") {
      const base = 100;
      const chartH = 210;
      const min = data.rows[0].value * 0.9;
      const max = data.rows[data.rows.length - 1].value;
      body = data.rows.flatMap((row, i) => {
        const x = 90 + i * 168;
        const h = 30 + ((row.value - min) / (max - min || 1)) * (chartH - 30);
        const y = base + chartH - h;
        return [
          `<rect x="${x}" y="${y.toFixed(1)}" width="110" height="${h.toFixed(1)}" rx="8" fill="${i === 0 ? COLORS.disposable : COLORS.net}"/>`,
          `<text x="${x + 55}" y="${(y - 10).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="16" font-weight="700" fill="#122a3d">${money(row.value)}</text>`,
          `<text x="${x + 55}" y="${base + chartH + 22}" text-anchor="middle" font-family="${FONT}" font-size="14" fill="#3d5466">${esc(row.label)}</text>`,
        ];
      });
      legend = [[COLORS.net, "Bi-weekly take-home with dependents"]];
    }

    if (data.kind === "child-support") {
      const base = 100;
      const chartH = 210;
      const max = Math.max(...data.rows.map(row => row.disposable));
      body = data.rows.flatMap((row, i) => {
        const x = 70 + i * 172;
        const hD = (chartH * row.disposable) / max;
        const hS = (chartH * row.withheld) / max;
        const hL = (chartH * row.limit) / max;
        return [
          `<rect x="${x}" y="${(base + chartH - hD).toFixed(1)}" width="62" height="${hD.toFixed(1)}" rx="6" fill="${COLORS.disposable}"/>`,
          `<rect x="${x + 68}" y="${(base + chartH - hS).toFixed(1)}" width="62" height="${hS.toFixed(1)}" rx="6" fill="${COLORS.support}"/>`,
          `<line x1="${x - 4}" x2="${x + 134}" y1="${(base + chartH - hL).toFixed(1)}" y2="${(base + chartH - hL).toFixed(1)}" stroke="#122a3d" stroke-dasharray="5 4" stroke-width="1.5"/>`,
          `<text x="${x + 99}" y="${(base + chartH - hS - 8).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="700" fill="#122a3d">${money(row.withheld)}</text>`,
          `<text x="${x + 65}" y="${base + chartH + 22}" text-anchor="middle" font-family="${FONT}" font-size="14" fill="#3d5466">${esc(row.label)}</text>`,
        ];
      });
      legend = [[COLORS.disposable, "Disposable earnings / check"], [COLORS.support, "Support withheld / check"], ["#122a3d", "60% federal limit (dashed)"]];
    }

    writeFileSync(join(OUT, data.file), frame(data.title, data.alt, data.heading, data.sub, body, legend));
  }
}
console.log(`wrote ${SITUATION_STATES.length * 3} SVGs to ${OUT}`);
