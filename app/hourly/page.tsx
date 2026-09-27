import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import type { HourlyData } from "../lib/seo/types";
import hourlyRaw from "../data/hourly-rates.json";

export const metadata: Metadata = {
  title: "Hourly Paycheck Calculator 2026 — All Hourly Rates",
  description: "Find your hourly rate and see annual gross pay, biweekly paycheck, and after-tax take-home across 38 states in 2026.",
  alternates: { canonical: "https://www.paycheckscalculator.org/hourly" },
  robots: { index: true, follow: true },
};

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const hourlyRates = hourlyRaw as HourlyData[];

export default function HourlyHubPage() {
  return (
    <main>
      <SiteHeader />
      <div className="directory">
        <p className="kicker">HOURLY PAY 2026</p>
        <h1>Hourly Paycheck Calculator</h1>
        <p style={{ color: "#647789", maxWidth: 620, margin: "12px auto 0", lineHeight: 1.6, fontSize: 15 }}>
          Select your hourly rate below for a full after-tax breakdown across all 38 states.
          Each page shows annual gross, biweekly net pay, and effective tax rate — calculated
          with 2026 IRS and state withholding tables.
        </p>

        <div className="location-grid" style={{ marginTop: 40 }}>
          {hourlyRates.map(h => (
            <a key={h.slug} href={`/hourly/${h.slug}`}>
              <b>${h.rate} an hour is how much a year?</b>
              <span>{fmt.format(h.annualAt40h)} a year gross (40 hrs/wk) →</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 60, padding: "32px 28px", background: "white", border: "1px solid #d9e2e7", borderRadius: 12, maxWidth: 700, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
          <p className="kicker">HOW IT WORKS</p>
          <h2 style={{ font: "700 24px/1.2 Georgia,serif", margin: "8px 0 12px" }}>What each hourly rate page shows</h2>
          <p style={{ color: "#5f7485", fontSize: 14, lineHeight: 1.75 }}>
            Every hourly rate page calculates your full-time annual gross (40 hrs/week), then
            runs a complete payroll calculation for all 38 supported states. You get biweekly
            net pay, weekly net pay, effective hourly take-home after all taxes, and state-by-state
            comparison — all based on 2026 IRS and state withholding tables.
          </p>
          <div style={{ marginTop: 16 }}>
            <a href="/hourly-paycheck-calculator" style={{ display: "inline-block", background: "#1769aa", color: "white", padding: "10px 20px", borderRadius: 7, fontSize: 13, fontWeight: 700 }}>
              Use the Interactive Hourly Calculator →
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
