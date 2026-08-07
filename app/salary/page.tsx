import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { calculatePaycheck } from "../lib/payroll";
import type { SalaryData } from "../lib/seo/types";
import salaryRaw from "../data/salary.json";

export const metadata: Metadata = {
  title: "Salary After Tax Calculator 2026 — All Salary Levels",
  description: "See your take-home pay at every salary level from $25,000 to $300,000. Pick your salary for a full 38-state after-tax breakdown.",
  alternates: { canonical: "https://www.paycheckscalculator.org/salary" },
  robots: { index: true, follow: true },
};

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const salaries = salaryRaw as SalaryData[];

export default function SalaryHubPage() {
  const cards = salaries.map(s => {
    const tx = calculatePaycheck({ grossAnnual: s.amount, frequency: "biweekly", status: "single", state: "TX" });
    const ca = calculatePaycheck({ grossAnnual: s.amount, frequency: "biweekly", status: "single", state: "CA" });
    return {
      ...s,
      txNet: Math.round(tx.netAnnual / 26),
      caNet: Math.round(ca.netAnnual / 26),
    };
  });

  return (
    <main>
      <SiteHeader />
      <div className="directory">
        <p className="kicker">SALARY AFTER TAX 2026</p>
        <h1>Salary After Tax Calculator</h1>
        <p style={{ color: "#647789", maxWidth: 620, margin: "12px auto 0", lineHeight: 1.6, fontSize: 15 }}>
          Select your annual salary below for a full breakdown of take-home pay across all 38 states.
          Each page shows biweekly net pay, federal tax, state tax, and effective tax rate — calculated
          with 2026 IRS and state withholding tables.
        </p>

        <div className="location-grid" style={{ marginTop: 40 }}>
          {cards.map(s => (
            <a key={s.slug} href={`/salary/${s.slug}`}>
              <b>{s.label} / year</b>
              <span>~{fmt.format(s.txNet)} biweekly (TX) · ~{fmt.format(s.caNet)} (CA)</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 60, padding: "32px 28px", background: "white", border: "1px solid #d9e2e7", borderRadius: 12, maxWidth: 700, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
          <p className="kicker">HOW IT WORKS</p>
          <h2 style={{ font: "700 24px/1.2 Georgia,serif", margin: "8px 0 12px" }}>What each salary page shows</h2>
          <p style={{ color: "#5f7485", fontSize: 14, lineHeight: 1.75 }}>
            Every salary page runs a full payroll calculation for all 38 supported states using
            2026 IRS withholding tables and published state methods. You get the exact biweekly
            take-home, annual net pay, state tax, federal tax, FICA, and effective tax rate — for
            a single filer, standard W-4, no pre-tax deductions.
          </p>
          <p style={{ color: "#5f7485", fontSize: 14, lineHeight: 1.75, marginTop: 10 }}>
            Use the interactive calculator on each page to adjust for your actual filing status,
            state, 401(k) contributions, and deductions.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
