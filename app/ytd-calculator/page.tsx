import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import YtdCalculator from "../components/YtdCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "ytd-calculator",
  title: "YTD Calculator 2026 — Year to Date Income",
  description:
    "Free YTD calculator. Turn the year-to-date figure on a pay stub into projected annual income and average monthly income — the way lenders do it.",
  crumb: "YTD Calculator",
  appName: "YTD Calculator",
  faqs: [
    {
      q: "What does YTD mean on a pay stub?",
      a: "Year to date — the running total of everything paid or withheld since 1 January. Most stubs show a YTD column beside the current period: YTD gross, YTD federal tax, YTD Social Security, YTD deductions. It resets every January regardless of when you were hired.",
    },
    {
      q: "How do I calculate monthly income from YTD?",
      a: "Divide the YTD gross by the number of pay periods already paid, then multiply by the periods in a year and divide by 12. If you are paid biweekly and have had 17 checks totalling $38,000, that is $2,235.29 per period × 26 ÷ 12 = about $4,843 a month.",
    },
    {
      q: "How do lenders use YTD income?",
      a: "Mortgage and loan underwriters annualise your most recent stub and compare it with your W-2 history. A YTD projection well above your prior year raises questions about whether the extra is sustainable; well below it suggests reduced hours. Bonus and commission income is usually averaged over two years rather than annualised from a single stub.",
    },
    {
      q: "Why does my YTD gross not match my salary so far?",
      a: "Common causes: you started mid-year, there was unpaid leave, a bonus or commission landed in one period, a pay rise took effect partway through, or the stub covers a period that ended before the calendar date. Overtime is the biggest single source of variation in hourly roles.",
    },
    {
      q: "Is YTD before or after taxes?",
      a: "Pay stubs show both. YTD gross is before any deduction; YTD net — sometimes labelled YTD take-home — is what actually reached your account. Lenders almost always want the gross figure. Make sure you know which one you are reading before projecting from it.",
    },
    {
      q: "How many pay periods are in a year?",
      a: "52 weekly, 26 biweekly, 24 semimonthly, 12 monthly. Biweekly and semimonthly are easy to confuse: biweekly means every two weeks and produces 26 cheques, with two months a year containing three; semimonthly means twice a month, always 24, usually on fixed dates.",
    },
    {
      q: "Can I use YTD to check my tax withholding?",
      a: "Yes, and it is a good mid-year habit. Compare YTD federal tax against what you would owe on the projected annual figure. A large gap in either direction means the W-4 needs adjusting — there is still time to fix it before filing, and correcting it in autumn spreads the change over fewer remaining cheques.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function YtdCalculatorPage() {
  const schemas = standaloneSchemas(SEO);
  return (
    <main>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <span>YTD Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">YEAR TO DATE · 2026</div>
        <h1>YTD Calculator — Project Your Year From a Pay Stub</h1>
        <p className="hero-copy">
          Take the year-to-date figure off your most recent stub and this{" "}
          <strong>YTD calculator</strong> turns it into projected annual income, average monthly
          income and what is still to be paid. It is the same arithmetic a mortgage underwriter
          runs when they ask for your latest pay stub — a year to date calculator, a YTD income
          calculator and an income year to date calculator are all this one tool.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <YtdCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">READING THE STUB</p>
        <h2>What YTD Means and Which Number to Use</h2>
        <section>
          <p>
            <strong>Year to date</strong> is the cumulative total since 1 January. Your stub
            carries a YTD column alongside the current pay period, and every line has one: gross
            pay, each tax, each deduction, and net pay.
          </p>
          <p>
            The distinction that matters before you project anything is gross versus net. YTD
            gross is the figure before deductions and the one lenders, landlords and benefit
            programmes ask for. YTD net is what reached your bank. Projecting from net when
            someone asked for gross understates your income by 20–30%.
          </p>
          <h3>The YTD lines worth checking</h3>
          <ul className="checklist">
            <li><strong>YTD gross</strong> — total earnings before anything comes out</li>
            <li><strong>YTD federal tax</strong> — compare against projected annual liability to catch a W-4 problem early</li>
            <li><strong>YTD Social Security</strong> — stops once wages reach the $184,500 wage base for 2026; Medicare keeps going</li>
            <li><strong>YTD pre-tax deductions</strong> — 401(k), health premiums and HSA contributions, useful for tracking against annual limits</li>
          </ul>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE PROJECTION</p>
        <h2>How to Annualise a YTD Figure</h2>
        <section>
          <p>
            Two steps. Divide YTD gross by pay periods already paid to get an average per period,
            then multiply by the periods in a full year.
          </p>
          <p>
            Counting the periods is where it goes wrong. Use the number of cheques actually
            received, not the calendar month. Someone paid biweekly in mid-July has usually had 14
            or 15 cheques, not 13 — biweekly pay produces 26 a year, so two months contain three
            pay dates rather than two.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Frequency</th>
                  <th>Periods per year</th>
                  <th>Typical by 30 June</th>
                  <th>Annualise by</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Weekly</td><td>52</td><td>26</td><td>YTD ÷ periods × 52</td></tr>
                <tr><td>Biweekly</td><td>26</td><td>13</td><td>YTD ÷ periods × 26</td></tr>
                <tr><td>Semimonthly</td><td>24</td><td>12</td><td>YTD ÷ periods × 24</td></tr>
                <tr><td>Monthly</td><td>12</td><td>6</td><td>YTD ÷ periods × 12</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The projection assumes the rest of the year resembles the part already paid. That
            assumption breaks for anyone with seasonal overtime, quarterly commission, an
            end-of-year bonus, or a raise that landed partway through. It is exactly why
            underwriters ask for two years of W-2s alongside the stub rather than trusting the
            annualised figure on its own.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">USING IT</p>
        <h2>Mid-Year Checks Worth Doing</h2>
        <section>
          <p>
            <strong>Is your withholding on track?</strong> Project the year, work out the tax on
            that income, and compare with YTD federal tax scaled up the same way. A large refund
            means you have lent the government money interest-free; a large balance due means a
            penalty risk. Either way a new W-4 fixes it, and doing it in summer spreads the
            correction over more remaining cheques than doing it in November.
          </p>
          <p>
            <strong>Will you hit the 401(k) limit?</strong> Divide YTD contributions by periods
            paid and project forward. Hitting the annual cap early stops your contributions — and
            with them any employer match on later cheques, unless your plan trues up at year end.
          </p>
          <p>
            <strong>Have you passed the Social Security wage base?</strong> Once YTD wages exceed
            $184,500, the 6.2% stops and your take-home rises for the rest of the year. Worth
            knowing before you mistake it for a payroll error.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>YTD Calculator — Frequently Asked Questions</h2>
        <section>
          {SEO.faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}<span>+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">RELATED</p>
        <h2>More Pay and Tax Calculators</h2>
        <section>
          <ul className="checklist">
            <li><a href="/">Paycheck Calculator — take-home pay by state</a></li>
            <li><a href="/what-is-annual-income">What Is Annual Income?</a></li>
            <li><a href="/post-tax-deductions">Pre-Tax vs Post-Tax Deductions</a></li>
            <li><a href="/overtime-calculator">Overtime Calculator</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
