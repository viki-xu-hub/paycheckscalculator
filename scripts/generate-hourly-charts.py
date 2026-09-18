#!/usr/bin/env python3
"""Generate one static SVG per hourly rate: "$N an hour is how much a year" gross-pay chart.
Run: python3 scripts/generate-hourly-charts.py   (writes public/images/hourly/*.svg)
Pure arithmetic (40 hrs/week × 52 weeks); no tax figures, so it never goes stale with tax tables."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rates = json.load(open(os.path.join(ROOT, "app/data/hourly-rates.json")))
OUT = os.path.join(ROOT, "public/images/hourly"); os.makedirs(OUT, exist_ok=True)

def money(n): return "${:,.0f}".format(n)

def svg(r):
    rate = r["rate"]; annual = r["annualAt40h"]
    rows = [("Yearly (2,080 hrs)", annual), ("Monthly", annual/12), ("Biweekly (80 hrs)", rate*80), ("Weekly (40 hrs)", rate*40), ("Daily (8 hrs)", rate*8)]
    W, H = 960, 420; left, top, barh, gap = 250, 96, 44, 18; maxw = 600
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="t d">',
             f'<title id="t">${rate} an hour is how much a year — gross pay by pay period</title>',
             f'<desc id="d">At 40 hours a week, ${rate} an hour equals {money(annual)} a year, {money(annual/12)} a month, {money(rate*80)} biweekly, {money(rate*40)} a week and {money(rate*8)} a day before taxes.</desc>',
             f'<rect width="{W}" height="{H}" rx="16" fill="#f6f9fc"/>',
             f'<text x="32" y="44" font-family="Georgia,serif" font-size="26" font-weight="700" fill="#122a3d">${rate} an hour is how much a year?</text>',
             f'<text x="32" y="70" font-family="Arial,Helvetica,sans-serif" font-size="14" fill="#5f7485">Gross pay before taxes · 40 hours a week · 52 weeks · 2026</text>']
    for i, (label, val) in enumerate(rows):
        y = top + i*(barh+gap); w = max(8, maxw*val/annual)
        parts.append(f'<text x="{left-14}" y="{y+barh/2+5}" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="15" fill="#122a3d">{label}</text>')
        parts.append(f'<rect x="{left}" y="{y}" width="{w:.1f}" height="{barh}" rx="8" fill="{"#1769aa" if i==0 else "#8fb8de"}"/>')
        parts.append(f'<text x="{left+w+12:.1f}" y="{y+barh/2+6}" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700" fill="#122a3d">{money(val)}</text>')
    parts.append(f'<text x="32" y="{H-18}" font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#8595a5">paycheckscalculator.org · take-home pay after federal, FICA and state tax is shown in the table on the page</text>')
    parts.append('</svg>')
    return "\n".join(parts)

for r in rates:
    fn = os.path.join(OUT, f'{r["rate"]}-an-hour-is-how-much-a-year.svg')
    open(fn, "w").write(svg(r))
print(f"wrote {len(rates)} SVGs to {OUT}")
