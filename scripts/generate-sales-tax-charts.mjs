// Generates one rate-composition chart per sales tax page from the rate data,
// so the figures cannot drift out of sync with sales-tax.json / ohio-sales-tax.json.
// Run: node scripts/generate-sales-tax-charts.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const data = JSON.parse(readFileSync("app/data/sales-tax.json", "utf8"));
const ohio = JSON.parse(readFileSync("app/data/ohio-sales-tax.json", "utf8"));
const OUT = "public/images/sales-tax";
mkdirSync(OUT, { recursive: true });

const W = 880, H = 360;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pct = r => `${(+r.toFixed(3))}%`;
const BLUE = "#4a63e7", ORANGE = "#c9741a", TEAL = "#149c86", GREY = "#9aa7b4";

const head = (title, desc) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">${esc(title)}</title>
  <desc id="d">${esc(desc)}</desc>
  <style>
    .h{font:700 17px Arial,Helvetica,sans-serif;fill:#1c2333}
    .s{font:13px Arial,Helvetica,sans-serif;fill:#5f6b7a}
    .n{font:700 14px Arial,Helvetica,sans-serif;fill:#fff}
    .v{font:700 13px Arial,Helvetica,sans-serif;fill:#1c2333}
    .l{font:12px Arial,Helvetica,sans-serif;fill:#5f6b7a}
    .lg{font:12px Arial,Helvetica,sans-serif;fill:#5f6b7a}
  </style>
  <rect width="${W}" height="${H}" fill="#f7f8fa" rx="12"/>`;

/** Stacked composition bar + labelled legend. Returns svg fragment. */
function stack(parts, y, total) {
  const x0 = 60, full = 760;
  let x = x0, out = "", lx = x0;
  parts.forEach((p, i) => {
    const w = (p.rate / total) * full;
    const r = i === 0 ? `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="46" fill="${p.color}" rx="4"/>`
      : i === parts.length - 1 ? `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="46" fill="${p.color}" rx="4"/>`
      : `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="46" fill="${p.color}"/>`;
    out += r;
    if (w > 54) out += `<text x="${(x + w / 2).toFixed(1)}" y="${y + 28}" text-anchor="middle" class="n">${pct(p.rate)}</text>`;
    x += w;
  });
  parts.forEach(p => {
    out += `<rect x="${lx}" y="${y + 62}" width="10" height="10" fill="${p.color}" rx="2"/>`;
    out += `<text x="${lx + 16}" y="${y + 71}" class="lg">${esc(p.label)} ${pct(p.rate)}</text>`;
    lx += 20 + esc(p.label).length * 6.4 + 42;
  });
  return out;
}

/** Horizontal comparison rows. */
function rows(items, y0, max, highlight) {
  const lx = 60, bx = 240, full = 520;
  return items.map((it, i) => {
    const y = y0 + i * 26;
    const w = Math.max(2, (it.rate / max) * full);
    const c = it.name === highlight ? BLUE : GREY;
    return `<text x="${lx}" y="${y + 13}" class="l">${esc(it.name)}</text>`
      + `<rect x="${bx}" y="${y + 2}" width="${w.toFixed(1)}" height="14" fill="${c}" rx="3"/>`
      + `<text x="${(bx + w + 8).toFixed(1)}" y="${y + 13}" class="v">${pct(it.rate)}</text>`;
  }).join("");
}

for (const loc of data.locations) {
  const title = `${loc.name} sales tax ${loc.stateAbbr === "TX" ? "2026" : "2026"} — how the ${pct(loc.rate)} rate is built`;
  const parts = loc.components
    ? loc.components.map((c, i) => ({ label: c.label.replace("Texas state sales and use tax", "Texas state").replace("Austin MTA (Capital Metro)", "Austin MTA"), rate: c.rate, color: [BLUE, ORANGE, TEAL][i] || GREY }))
    : [{ label: `${loc.state} base`, rate: loc.stateBase, color: BLUE }, { label: "District taxes", rate: loc.district, color: ORANGE }];

  let cmp = "", sub = "", desc = "";
  if (loc.cities && loc.cities.length) {
    const tiers = [...new Set(loc.cities.map(c => c.rate))].sort((a, b) => b - a)
      .map(r => ({ name: `${pct(r)} — ${loc.cities.filter(c => c.rate === r).length} cities`, rate: r }));
    cmp = rows(tiers, 200, Math.max(...tiers.map(t => t.rate)), null);
    sub = `Countywide baseline ${pct(loc.rate)}; city rates range ${pct(Math.min(...loc.cities.map(c => c.rate)))} to ${pct(Math.max(...loc.cities.map(c => c.rate)))}`;
    desc = `${loc.name} sales tax is ${pct(loc.rate)}: ${pct(loc.stateBase)} ${loc.state} base plus ${pct(loc.district)} district tax. City rates across the county range from ${pct(Math.min(...loc.cities.map(c => c.rate)))} to ${pct(Math.max(...loc.cities.map(c => c.rate)))}.`;
  } else {
    const near = [{ name: loc.name, rate: loc.rate }, ...loc.nearby.slice(0, 5)];
    cmp = rows(near, 200, Math.max(...near.map(n => n.rate)), loc.name);
    sub = `${pct(loc.stateBase)} ${loc.state} statewide base plus ${pct(loc.district)} of local tax, compared with nearby cities`;
    desc = `${loc.name} sales tax is ${pct(loc.rate)}, made up of a ${pct(loc.stateBase)} ${loc.state} statewide base plus ${pct(loc.district)} of local tax, shown against nearby city rates.`;
  }

  const svg = head(title, desc)
    + `<text x="440" y="38" text-anchor="middle" class="h">${esc(title)}</text>`
    + `<text x="440" y="62" text-anchor="middle" class="s">${esc(sub)}</text>`
    + stack(parts, 88, loc.rate)
    + `<text x="60" y="190" class="s">${esc(loc.cities ? "Rate tiers inside the county" : "How that compares nearby")}</text>`
    + cmp + `</svg>`;
  writeFileSync(`${OUT}/${loc.slug}.svg`, svg);
  console.log(`  ${loc.slug}.svg`);
}

// Ohio: state base + county permissive range, then the rate distribution across 88 counties
{
  const rates = ohio.counties.map(c => c.rate);
  const min = Math.min(...rates), max = Math.max(...rates);
  const counts = new Map();
  rates.forEach(r => counts.set(r, (counts.get(r) || 0) + 1));
  const dist = [...counts.entries()].sort((a, b) => a[0] - b[0])
    .map(([r, n]) => ({ name: `${pct(r)} — ${n} ${n === 1 ? "county" : "counties"}`, rate: n }));
  const title = `Ohio sales tax calculator — combined rates across all ${ohio.counties.length} counties`;
  const desc = `Ohio sales tax is a ${pct(ohio.stateBase)} state rate plus a county permissive tax, giving combined rates from ${pct(min)} to ${pct(max)} across ${ohio.counties.length} counties.`;
  const parts = [{ label: "Ohio state rate", rate: ohio.stateBase, color: BLUE }, { label: "County permissive tax (typical)", rate: +(7.25 - ohio.stateBase).toFixed(2), color: ORANGE }];
  const svg = head(title, desc)
    + `<text x="440" y="38" text-anchor="middle" class="h">${esc(title)}</text>`
    + `<text x="440" y="62" text-anchor="middle" class="s">${esc(`${pct(ohio.stateBase)} state rate plus a county tax; combined rates run ${pct(min)} to ${pct(max)}`)}</text>`
    + stack(parts, 88, 7.25)
    + `<text x="60" y="190" class="s">How many counties charge each combined rate</text>`
    + rows(dist, 200, Math.max(...dist.map(d => d.rate)), null) + `</svg>`;
  writeFileSync(`${OUT}/ohio.svg`, svg);
  console.log("  ohio.svg");
}

// Hub: every published rate side by side
{
  const all = [...data.locations.map(l => ({ name: `${l.name}, ${l.stateAbbr}`, rate: l.rate }))].sort((a, b) => b.rate - a.rate);
  const title = `Sales tax calculator — 2026 combined rates by city and county`;
  const desc = `Combined sales tax rates for ${all.map(a => `${a.name} ${pct(a.rate)}`).join(", ")}.`;
  const svg = head(title, desc)
    + `<text x="440" y="38" text-anchor="middle" class="h">${esc(title)}</text>`
    + `<text x="440" y="62" text-anchor="middle" class="s">Published agency rates, highest first</text>`
    + rows(all, 90, Math.max(...all.map(a => a.rate)), null) + `</svg>`;
  writeFileSync(`${OUT}/index.svg`, svg);
  console.log("  index.svg");
}
