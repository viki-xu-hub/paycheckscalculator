#!/usr/bin/env python3
"""Generate one static SVG per salary: "$N a year is how much an hour" gross-pay chart.
Run: python3 scripts/generate-salary-charts.py   (writes public/images/salary/*.svg)
Pure arithmetic (2,080 hours / 52 weeks / 26 / 12); no tax figures, so it never goes stale."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
salaries = json.load(open(os.path.join(ROOT, "app/data/salary.json")))
OUT = os.path.join(ROOT, "public/images/salary"); os.makedirs(OUT, exist_ok=True)

def money(n, dec=0): return "${:,.{d}f}".format(n, d=dec)

def svg(s):
    a = s["amount"]; label = s["label"]
    rows = [("Yearly", a, 0), ("Monthly", a/12, 0), ("Biweekly", a/26, 0), ("Weekly", a/52, 0), ("Hourly (2,080 hrs)", a/2080, 2)]
    W, H = 960, 420; left, top, barh, gap = 250, 96, 44, 18; maxw = 600
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="t d">',
             f'<title id="t">{label} a year is how much an hour — gross pay by pay period</title>',
             f'<desc id="d">{label} a year equals {money(a/2080,2)} an hour at 40 hours a week, {money(a/12)} a month, {money(a/26)} biweekly and {money(a/52)} a week before taxes.</desc>',
             f'<rect width="{W}" height="{H}" rx="16" fill="#f6f9fc"/>',
             f'<text x="32" y="44" font-family="Georgia,serif" font-size="26" font-weight="700" fill="#122a3d">{label} a year is how much an hour?</text>',
             f'<text x="32" y="70" font-family="Arial,Helvetica,sans-serif" font-size="14" fill="#5f7485">Gross pay before taxes · 40 hours a week · 52 weeks · 2026</text>']
    for i, (lab, val, dec) in enumerate(rows):
        y = top + i*(barh+gap); w = max(8, maxw*val/a)
        parts.append(f'<text x="{left-14}" y="{y+barh/2+5}" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="15" fill="#122a3d">{lab}</text>')
        parts.append(f'<rect x="{left}" y="{y}" width="{w:.1f}" height="{barh}" rx="8" fill="{"#1769aa" if i in (0,4) else "#8fb8de"}"/>')
        parts.append(f'<text x="{left+w+12:.1f}" y="{y+barh/2+6}" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700" fill="#122a3d">{money(val,dec)}</text>')
    parts.append(f'<text x="32" y="{H-18}" font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#8595a5">paycheckscalculator.org · take-home pay after federal, FICA and state tax is shown in the table on the page</text>')
    parts.append('</svg>')
    return "\n".join(parts)

for s in salaries:
    open(os.path.join(OUT, f'{s["amount"]}-a-year-is-how-much-an-hour.svg'), "w").write(svg(s))
print(f"wrote {len(salaries)} SVGs to {OUT}")
