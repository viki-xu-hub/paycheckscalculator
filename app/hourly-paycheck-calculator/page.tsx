import type { Metadata } from "next";
import PaycheckCalculator from "../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import type { HourlyData } from "../lib/seo/types";
import hourlyRaw from "../data/hourly-rates.json";

const hourlyRates = hourlyRaw as HourlyData[];
const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const metadata: Metadata = {
  title: "Hourly Paycheck Calculator 2026 – Take-Home Pay by Rate",
  description:
    "Free hourly paycheck calculator for 2026. Enter your hourly rate, hours and overtime to see take-home pay after federal tax, FICA and state withholding.",
  alternates: { canonical: "/hourly-paycheck-calculator" },
  openGraph: {
    title: "Hourly Paycheck Calculator 2026",
    description:
      "Estimate your hourly take-home pay after federal taxes, Social Security, Medicare, overtime, and payroll deductions. Free online hourly paycheck calculator.",
    url: "https://www.paycheckscalculator.org/hourly-paycheck-calculator",
    type: "website",
  },
};

export default function HourlyPaycheck() {
  const canonical = "https://www.paycheckscalculator.org/hourly-paycheck-calculator";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Hourly Paycheck Calculator",
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Calculate your hourly take-home pay after taxes, overtime, and payroll deductions with this free online hourly paycheck calculator.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate my paycheck from hourly pay?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply your hourly wage by the number of hours worked to calculate gross pay. Then subtract taxes and deductions to estimate your take-home paycheck.",
        },
      },
      {
        "@type": "Question",
        name: "How much is $20 an hour after taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your take-home pay depends on your state, tax situation, deductions, and pay frequency. A paycheck calculator can estimate your expected net income based on these factors.",
        },
      },
      {
        "@type": "Question",
        name: "How many hours is full-time hourly work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many full-time employees work approximately 40 hours per week, although schedules vary by employer, industry, and individual agreements.",
        },
      },
      {
        "@type": "Question",
        name: "Does an hourly paycheck calculator include overtime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many hourly paycheck calculators allow overtime earnings to be included at 1.5 times the regular rate when estimating total pay.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is an hourly paycheck calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An hourly paycheck calculator provides an estimate. Actual employer payroll amounts may differ based on tax withholding, benefits, overtime rules, and payroll policies.",
        },
      },
    ],
  };

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hourly paycheck calculator pages by hourly rate",
    itemListElement: hourlyRates.map((h, i) => ({ "@type": "ListItem", position: i + 1, name: `$${h.rate} an hour is how much a year?`, url: `https://www.paycheckscalculator.org/hourly/${h.slug}` })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Paycheck Calculator", item: "https://www.paycheckscalculator.org" },
      { "@type": "ListItem", position: 2, name: "Hourly Paycheck Calculator", item: canonical },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hourly Paycheck Calculator",
    url: canonical,
    about: "Hourly paycheck calculation and take-home pay estimation for hourly workers",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      {/* Hero + Calculator */}
      <section className="hero">
        <h1>Hourly Paycheck Calculator <em>2026</em></h1>
        <div className="hero-intro">
          <p>Use this free hourly paycheck calculator to turn your hourly wage, hours and overtime into take-home pay after 2026 federal tax, Social Security, Medicare and state withholding.</p>
        </div>
        <PaycheckCalculator hourly />
        <div className="hero-more">
          <p>Enter your hourly wage, working hours, pay frequency, and deductions to see how much you will actually receive in your paycheck — weekly, biweekly, semimonthly or monthly — with every one of the 52 state and city withholding engines available.</p>
        </div>
        <div className="trust-row">
          <span>Free &bull; No sign-up required</span>
          <span>Updated for 2026 tax rules</span>
          <span>Federal &amp; state tax estimates</span>
        </div>
      </section>

      {/* Hub: every hourly-rate page */}
      <section className="seo-section">
        <p className="kicker">HOURLY PAY 2026</p>
        <h2>Hourly Paycheck Calculator by Hourly Rate</h2>
        <p className="section-intro">
          Prefer a ready-made answer? Every rate below opens its own hourly paycheck calculator page with annual gross pay at 40 hours a week, biweekly and weekly net pay, effective hourly take-home, and a side-by-side comparison across all 52 supported locations.
        </p>
        <div className="location-grid rate-grid">
          {hourlyRates.map(h => (
            <a key={h.slug} href={`/hourly/${h.slug}`}>
              <b>${h.rate} an hour is how much a year?</b>
              <span>{fmt.format(h.annualAt40h)} a year gross (40 hrs/wk) →</span>
            </a>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="seo-section">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How Does an Hourly Paycheck Calculator Work?</h2>
        <p className="section-intro">
          An hourly paycheck calculator converts your hourly wage into an estimated paycheck amount
          by calculating your gross earnings and subtracting applicable taxes and deductions.
        </p>
        <figure className="bracket-figure">
          <img src="/images/hourly-paycheck-calculator-flow.svg" alt="Hourly paycheck calculator flow: $25 an hour × 80 biweekly hours = $2,000 gross, minus federal tax, Social Security, Medicare and state tax, leaves about $1,691 take-home" width="880" height="300" loading="lazy" decoding="async" />
          <figcaption>How the hourly paycheck calculator moves from gross wages to take-home pay. Example: $25/hour, 40 hours, biweekly, single filer, Texas.</figcaption>
        </figure>
        <p className="section-intro">The calculation usually follows these steps:</p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Calculate Hourly Gross Pay</h3>
            <p>
              Your gross hourly pay is calculated by multiplying your hourly rate by the number of
              hours worked.
            </p>
            <div className="note">
              <strong>Formula:</strong> Hourly Rate × Hours Worked = Gross Pay
            </div>
            <div className="note">
              <strong>Example:</strong> $25 per hour × 40 hours per week = $1,000 weekly gross pay.
            </div>
          </div>

          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Include Overtime Pay</h3>
            <p>
              Many hourly employees receive overtime pay when they work more than the standard
              number of hours.
            </p>
            <p>
              Under federal labor rules, eligible employees may receive overtime pay at 1.5 times
              their regular hourly rate.
            </p>
            <div className="note">
              <strong>Example:</strong> Regular rate: $20/hour → Overtime rate: $30/hour
            </div>
          </div>

          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Calculate Payroll Taxes</h3>
            <p>Your paycheck may include several payroll deductions:</p>
            <ul>
              <li>Federal income tax</li>
              <li>Social Security tax</li>
              <li>Medicare tax</li>
              <li>State income tax (depending on your location)</li>
            </ul>
            <p>These deductions reduce your gross pay and determine your final take-home pay.</p>
          </div>

          <div className="step-card">
            <div className="step-num">4</div>
            <h3>Apply Additional Deductions</h3>
            <p>Your employer may also deduct:</p>
            <ul>
              <li>Health insurance premiums</li>
              <li>Retirement contributions</li>
              <li>Flexible spending accounts</li>
              <li>Employee benefits</li>
            </ul>
            <p>These deductions can affect the amount deposited into your bank account.</p>
          </div>
        </div>
      </section>

      {/* Gross vs Net */}
      <section className="seo-section">
        <h2>Gross Hourly Pay vs Take-Home Pay</h2>
        <p className="section-intro">
          Many hourly workers are surprised that their paycheck amount is lower than their hourly
          wage calculation. This happens because gross pay is calculated before taxes and deductions.
        </p>

        <div className="breakdown-grid">
          <div className="breakdown-card">
            <h3>Gross Pay</h3>
            <p>The total amount earned before deductions.</p>
          </div>
          <div className="breakdown-card">
            <h3>Net Pay</h3>
            <p>
              The amount received after taxes and deductions. Net pay is your actual take-home
              income.
            </p>
          </div>
        </div>
      </section>

      {/* How to Calculate */}
      <section className="seo-section">
        <h2>How to Calculate Your Hourly Paycheck After Taxes</h2>
        <p className="section-intro">To estimate your hourly paycheck after taxes:</p>
        <ol className="factors-list">
          <li>Calculate total hours worked</li>
          <li>Multiply hours by your hourly rate</li>
          <li>Add overtime or additional earnings</li>
          <li>Subtract federal taxes</li>
          <li>Subtract Social Security and Medicare taxes</li>
          <li>Subtract state taxes and deductions</li>
          <li>Calculate your estimated net paycheck</li>
        </ol>
      </section>

      {/* Examples */}
      <section className="seo-section">
        <h2>Hourly Paycheck Calculator Examples</h2>

        <details open>
          <summary><h3>Example 1: $20 Per Hour</h3></summary>
          <div className="note">
            <p>A worker earning $20 per hour:</p>
            <ul>
              <li>Hourly wage: $20</li>
              <li>Hours worked: 40 hours/week</li>
              <li>Weekly gross pay: $800</li>
              <li>Annual gross pay: Approximately $41,600</li>
            </ul>
            <p>
              The final take-home amount depends on taxes, state, and deductions.
            </p>
          </div>
        </details>

        <details open>
          <summary><h3>Example 2: $25 Per Hour</h3></summary>
          <div className="note">
            <ul>
              <li>Hourly wage: $25</li>
              <li>Hours worked: 40 hours/week</li>
              <li>Weekly gross pay: $1,000</li>
              <li>Annual gross pay: Approximately $52,000</li>
            </ul>
            <p>
              After taxes and deductions, the actual paycheck amount will be lower than gross income.
            </p>
          </div>
        </details>

        <details open>
          <summary><h3>Example 3: $30 Per Hour</h3></summary>
          <div className="note">
            <ul>
              <li>Hourly wage: $30</li>
              <li>Hours worked: 40 hours/week</li>
              <li>Weekly gross pay: $1,200</li>
              <li>Annual gross pay: Approximately $62,400</li>
            </ul>
          </div>
        </details>
      </section>

      {/* State Links */}
      <section className="seo-section">
        <h2>Hourly Paycheck Calculator by State</h2>
        <p className="section-intro">
          Hourly workers may see different paycheck amounts depending on where they live and work.
          State taxes, local taxes, and payroll rules can affect your final take-home pay.
        </p>
        <p className="section-intro">
          Use our state paycheck calculators to estimate hourly wages after taxes:
        </p>

        <div className="tool-links">
          <a href="/california-paycheck-calculator">
            <b>California Paycheck Calculator</b>
            <span>State withholding and SDI estimate →</span>
          </a>
          <a href="/texas-paycheck-calculator">
            <b>Texas Paycheck Calculator</b>
            <span>No state income tax on wages →</span>
          </a>
          <a href="/florida-paycheck-calculator">
            <b>Florida Paycheck Calculator</b>
            <span>No state income tax on wages →</span>
          </a>
          <a href="/new-york-paycheck-calculator">
            <b>New York Paycheck Calculator</b>
            <span>State withholding and NYC estimates →</span>
          </a>
          <a href="/new-jersey-paycheck-calculator">
            <b>New Jersey Paycheck Calculator</b>
            <span>State withholding estimate →</span>
          </a>
        </div>
      </section>

      {/* Pay Frequency */}
      <section className="seo-section">
        <h2>Hourly Paycheck Calculator for Weekly, Biweekly, and Monthly Pay</h2>
        <p className="section-intro">
          Your paycheck frequency affects how often you receive income, but your total annual
          earnings remain based on your hourly wage and hours worked.
        </p>
        <p className="section-intro">Common pay schedules include:</p>

        <div className="breakdown-grid">
          <div className="breakdown-card">
            <h3>Weekly Pay</h3>
            <p>Paid every week.</p>
          </div>
          <div className="breakdown-card">
            <h3>Biweekly Pay</h3>
            <p>Paid every two weeks.</p>
          </div>
          <div className="breakdown-card">
            <h3>Semi-monthly Pay</h3>
            <p>Paid twice per month.</p>
          </div>
          <div className="breakdown-card">
            <h3>Monthly Pay</h3>
            <p>Paid once per month.</p>
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="seo-section">
        <h2>What Changes Your Hourly Paycheck</h2>
        <p className="section-intro">Your final paycheck depends on several factors:</p>

        <ul className="factors-list">
          <li>Hourly wage</li>
          <li>Number of hours worked</li>
          <li>Overtime hours</li>
          <li>State of residence</li>
          <li>Filing status</li>
          <li>Federal tax withholding</li>
          <li>Benefits</li>
          <li>Retirement contributions</li>
          <li>Other payroll deductions</li>
        </ul>
      </section>

      {/* Methodology */}
      <section className="seo-section">
        <h2>Hourly Paycheck Calculator Methodology</h2>
        <p className="section-intro">
          Our hourly paycheck calculator uses standard payroll calculation methods to estimate
          take-home pay.
        </p>
        <p className="section-intro">The calculation process includes:</p>

        <ol className="factors-list">
          <li>Converting hourly wages into gross earnings</li>
          <li>Calculating overtime when applicable</li>
          <li>Estimating federal payroll taxes</li>
          <li>Applying Social Security and Medicare deductions</li>
          <li>Considering additional payroll deductions</li>
          <li>Estimating final net pay</li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="seo-section faq-section">
        <h2>Hourly Paycheck Calculator FAQ</h2>

        <details open>
          <summary>How do I calculate my paycheck from hourly pay?</summary>
          <p>
            Multiply your hourly wage by the number of hours worked to calculate gross pay. Then
            subtract taxes and deductions to estimate your take-home paycheck.
          </p>
        </details>

        <details open>
          <summary>How much is $20 an hour after taxes?</summary>
          <p>
            Your take-home pay depends on your state, tax situation, deductions, and pay frequency.
            A paycheck calculator can estimate your expected net income.
          </p>
        </details>

        <details open>
          <summary>How many hours is full-time hourly work?</summary>
          <p>
            Many full-time employees work approximately 40 hours per week, although schedules vary
            by employer and industry.
          </p>
        </details>

        <details open>
          <summary>Does an hourly paycheck calculator include overtime?</summary>
          <p>
            Yes. Many hourly paycheck calculators allow overtime earnings to be included when
            estimating total pay.
          </p>
        </details>

        <details open>
          <summary>How accurate is an hourly paycheck calculator?</summary>
          <p>
            An hourly paycheck calculator provides an estimate. Actual employer payroll amounts may
            differ based on tax withholding, benefits, and payroll policies.
          </p>
        </details>
      </section>

      {/* EEAT */}
      <section className="seo-section sources-section">
        <h3>Tax and Payroll Information Sources</h3>
        <p className="section-intro">
          Our hourly paycheck calculations are based on publicly available payroll and tax
          information.
        </p>
        <p className="section-intro">Reference sources include:</p>
        <ul className="factors-list">
          <li>Internal Revenue Service (IRS)</li>
          <li>Social Security Administration (SSA)</li>
          <li>U.S. Department of Labor</li>
          <li>State tax agencies</li>
        </ul>

        <div className="reviewer-info">
          <div className="reviewer-label">Reviewed by:</div>
          <div>Paycheck Calculator Editorial Team</div>
        </div>
        <div className="reviewer-info">
          <div className="reviewer-label">Last Updated:</div>
          <div>August 2026</div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="seo-section disclaimer-section">
        <h3>Disclaimer</h3>
        <p>
          This hourly paycheck calculator provides estimates for informational purposes only. Actual
          paycheck amounts may vary depending on employer payroll systems, tax withholding, benefits,
          deductions, and individual circumstances. For specific tax advice, consult a qualified tax
          professional.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
