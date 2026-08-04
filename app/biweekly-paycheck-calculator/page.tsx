import type { Metadata } from "next";
import PaycheckCalculator from "../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Biweekly Paycheck Calculator - Calculate Your Pay Every Two Weeks",
  description:
    "Use our biweekly paycheck calculator to estimate your pay every two weeks after taxes. Calculate gross pay, federal taxes, Social Security, Medicare, and take-home pay.",
  alternates: { canonical: "/biweekly-paycheck-calculator" },
  openGraph: {
    title: "Biweekly Paycheck Calculator - Calculate Your Pay Every Two Weeks",
    description:
      "Estimate your biweekly take-home pay after federal taxes, Social Security, Medicare, and payroll deductions. 26 pay periods per year.",
    url: "https://www.paycheckscalculator.org/biweekly-paycheck-calculator",
    type: "website",
  },
};

export default function BiweeklyPaycheck() {
  const canonical = "https://www.paycheckscalculator.org/biweekly-paycheck-calculator";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Biweekly Paycheck Calculator",
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Calculate your biweekly take-home pay after taxes with 26 pay periods per year using this free online biweekly paycheck calculator.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many biweekly paychecks are there in a year?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most employees paid biweekly receive 26 paychecks per year because they are paid every two weeks.",
        },
      },
      {
        "@type": "Question",
        name: "Is biweekly pay twice a month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Biweekly pay means every two weeks. This usually results in 26 paychecks per year, while semi-monthly pay results in 24 paychecks.",
        },
      },
      {
        "@type": "Question",
        name: "How do I calculate my biweekly paycheck?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Divide your annual salary by 26 to estimate your gross biweekly paycheck.",
        },
      },
      {
        "@type": "Question",
        name: "How much is $60,000 a year biweekly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A $60,000 annual salary divided by 26 pay periods equals approximately $2,307.69 before taxes and deductions.",
        },
      },
      {
        "@type": "Question",
        name: "Why do I sometimes get 3 paychecks in one month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because biweekly employees receive 26 paychecks annually, two months each year usually contain three paychecks instead of the typical two.",
        },
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Biweekly Paycheck Calculator",
    url: canonical,
    about: "Biweekly paycheck calculation and take-home pay estimation for employees paid every two weeks",
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

      <SiteHeader />

      {/* Hero + Calculator */}
      <section className="hero">
        <div className="eyebrow">26 PAYCHECKS PER YEAR</div>
        <h1>Biweekly Paycheck Calculator: Calculate Your Pay Every Two Weeks</h1>
        <p className="hero-copy">
          A biweekly paycheck calculator helps you estimate how much you earn every two weeks
          based on your salary, hourly wages, taxes, and payroll deductions.
        </p>
        <p className="hero-copy">
          Many employees receive a paycheck every other week, which means they typically receive
          26 paychecks per year.
        </p>
        <p className="hero-copy">
          Use this calculator to estimate your gross biweekly pay, taxes, deductions, and final
          take-home pay.
        </p>
        <PaycheckCalculator defaultFrequency="biweekly" />
        <div className="trust-row">
          <span>Free &bull; No sign-up required</span>
          <span>Updated for 2026 tax rules</span>
          <span>26 pay periods per year</span>
        </div>
      </section>

      {/* What Is Biweekly Pay */}
      <section className="seo-section">
        <p className="kicker">BIWEEKLY PAY BASICS</p>
        <h2>What Is Biweekly Pay?</h2>
        <p className="section-intro">
          Biweekly pay means employees receive a paycheck every two weeks.
        </p>
        <p className="section-intro">
          Unlike semi-monthly pay, which happens twice per month on fixed dates, biweekly payroll
          follows a 14-day schedule.
        </p>
        <p className="section-intro">A typical biweekly employee receives:</p>
        <ul className="factors-list">
          <li>26 paychecks per year</li>
          <li>2 paychecks in most months</li>
          <li>3 paychecks in two months each year</li>
        </ul>
      </section>

      {/* How It Works */}
      <section className="seo-section">
        <h2>How Does a Biweekly Paycheck Calculator Work?</h2>
        <p className="section-intro">
          A biweekly paycheck calculator converts your annual salary or hourly wages into an
          estimated paycheck amount received every two weeks.
        </p>
        <p className="section-intro">The calculation considers:</p>
        <ul className="factors-list">
          <li>Annual salary</li>
          <li>Hourly wage</li>
          <li>Hours worked</li>
          <li>Overtime pay</li>
          <li>Federal taxes</li>
          <li>State taxes</li>
          <li>Social Security</li>
          <li>Medicare</li>
          <li>Employee deductions</li>
        </ul>
      </section>

      {/* How to Calculate */}
      <section className="seo-section">
        <h2>How to Calculate Biweekly Pay</h2>
        <p className="section-intro">
          To calculate your biweekly paycheck, divide your annual income by the number of pay
          periods in a year.
        </p>
        <p className="section-intro">For most biweekly employees:</p>
        <div className="note">
          <strong>Annual Salary ÷ 26 = Biweekly Gross Pay</strong>
        </div>

        <div className="note">
          <strong>Example:</strong>
          <ul>
            <li>Annual salary: $78,000</li>
            <li>Biweekly pay periods: 26</li>
          </ul>
          <p>
            $78,000 ÷ 26 = <strong>$3,000</strong>
          </p>
          <p>
            Your gross biweekly paycheck is approximately $3,000 before taxes and deductions.
          </p>
        </div>
      </section>

      {/* Biweekly vs Monthly */}
      <section className="seo-section">
        <h2>Biweekly Pay vs Semi-Monthly Pay</h2>
        <p className="section-intro">
          Employees often confuse biweekly pay with twice-monthly pay. The difference:
        </p>

        <div className="breakdown-grid">
          <div className="breakdown-card">
            <h3>Biweekly Pay</h3>
            <ul>
              <li>Paid every two weeks</li>
              <li>26 paychecks per year</li>
              <li>Usually Friday payroll schedule</li>
            </ul>
          </div>
          <div className="breakdown-card">
            <h3>Semi-Monthly Pay</h3>
            <ul>
              <li>Paid twice per month</li>
              <li>24 paychecks per year</li>
              <li>Fixed payment dates (e.g., 1st and 15th)</li>
            </ul>
          </div>
        </div>

        <p>
          Because biweekly employees receive two additional paychecks each year, annual income
          calculations and budgeting can differ between these two pay schedules.
        </p>
      </section>

      {/* After Tax Biweekly */}
      <section className="seo-section">
        <h2>How Much Is My Biweekly Paycheck After Taxes?</h2>
        <p className="section-intro">Your after-tax biweekly paycheck depends on:</p>
        <ul className="factors-list">
          <li>Income level</li>
          <li>Filing status</li>
          <li>State taxes</li>
          <li>Federal tax withholding</li>
          <li>Social Security tax</li>
          <li>Medicare tax</li>
          <li>Retirement contributions</li>
          <li>Health insurance deductions</li>
        </ul>

        <div className="note">
          <strong>Example: $75,000 annual salary</strong>
          <p>Gross biweekly pay: $75,000 ÷ 26 = $2,884.62</p>
          <p>Your actual take-home pay will be lower after taxes and deductions.</p>
        </div>
      </section>

      {/* Examples */}
      <section className="seo-section">
        <h2>Biweekly Paycheck Examples</h2>

        <details open>
          <summary><h3>Example 1: $50,000 Salary</h3></summary>
          <div className="note">
            <ul>
              <li>Annual salary: $50,000</li>
              <li>Biweekly gross pay: $50,000 ÷ 26 = $1,923.08</li>
            </ul>
            <p>Estimated take-home pay depends on taxes and deductions.</p>
          </div>
        </details>

        <details open>
          <summary><h3>Example 2: $75,000 Salary</h3></summary>
          <div className="note">
            <ul>
              <li>Annual salary: $75,000</li>
              <li>Biweekly gross pay: $75,000 ÷ 26 = $2,884.62</li>
            </ul>
          </div>
        </details>

        <details open>
          <summary><h3>Example 3: $100,000 Salary</h3></summary>
          <div className="note">
            <ul>
              <li>Annual salary: $100,000</li>
              <li>Biweekly gross pay: $100,000 ÷ 26 = $3,846.15</li>
            </ul>
          </div>
        </details>
      </section>

      {/* Hourly Workers */}
      <section className="seo-section">
        <h2>Biweekly Pay for Hourly Workers</h2>
        <p className="section-intro">Hourly employees can also calculate biweekly pay.</p>
        <div className="note">
          <strong>Formula:</strong> Hourly Rate × Hours Worked During Two Weeks = Gross Biweekly Pay
        </div>
        <div className="note">
          <strong>Example:</strong>
          <ul>
            <li>Hourly rate: $25/hour</li>
            <li>Hours worked: 80 hours</li>
          </ul>
          <p>
            $25 × 80 = <strong>$2,000</strong>
          </p>
          <p>Overtime, taxes, and deductions will affect the final paycheck amount.</p>
        </div>
      </section>

      {/* Factors */}
      <section className="seo-section">
        <h2>Factors That Affect Your Biweekly Paycheck</h2>
        <p className="section-intro">Your biweekly paycheck may change depending on:</p>
        <ul className="factors-list">
          <li>Salary changes</li>
          <li>Hourly schedule</li>
          <li>Overtime hours</li>
          <li>Bonuses</li>
          <li>Tax withholding</li>
          <li>State income tax</li>
          <li>Retirement contributions</li>
          <li>Insurance deductions</li>
          <li>Wage garnishments</li>
        </ul>
      </section>

      {/* State Links */}
      <section className="seo-section">
        <h2>Biweekly Paycheck Calculator by State</h2>
        <p className="section-intro">
          Payroll taxes vary depending on where you live. Use our state paycheck calculators to
          estimate your biweekly take-home pay:
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
            <span>State and NYC resident withholding →</span>
          </a>
          <a href="/new-jersey-paycheck-calculator">
            <b>New Jersey Paycheck Calculator</b>
            <span>State withholding with TDI and FLI →</span>
          </a>
        </div>
      </section>

      {/* Methodology */}
      <section className="seo-section methodology-section">
        <h2>Biweekly Paycheck Methodology</h2>
        <p className="section-intro">
          Our biweekly paycheck calculator estimates your paycheck using standard payroll
          calculations.
        </p>
        <p className="section-intro">The calculation process includes:</p>

        <ol className="factors-list">
          <li>Converting annual salary into biweekly wages (÷ 26)</li>
          <li>Calculating gross earnings</li>
          <li>Estimating federal income tax</li>
          <li>Applying Social Security and Medicare taxes</li>
          <li>Including state taxes when applicable</li>
          <li>Subtracting deductions</li>
          <li>Estimating final take-home pay</li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="seo-section faq-section">
        <h2>Frequently Asked Questions</h2>

        <details open>
          <summary>How many biweekly paychecks are there in a year?</summary>
          <p>
            Most employees paid biweekly receive 26 paychecks per year because they are paid every
            two weeks.
          </p>
        </details>

        <details open>
          <summary>Is biweekly pay twice a month?</summary>
          <p>
            No. Biweekly pay means every two weeks. This usually results in 26 paychecks per year,
            while semi-monthly pay results in 24 paychecks.
          </p>
        </details>

        <details open>
          <summary>How do I calculate my biweekly paycheck?</summary>
          <p>
            Divide your annual salary by 26 to estimate your gross biweekly paycheck.
          </p>
        </details>

        <details open>
          <summary>How much is $60,000 a year biweekly?</summary>
          <p>
            A $60,000 annual salary divided by 26 pay periods equals approximately $2,307.69 before
            taxes and deductions.
          </p>
        </details>

        <details open>
          <summary>Why do I sometimes get 3 paychecks in one month?</summary>
          <p>
            Because biweekly employees receive 26 paychecks annually, two months each year usually
            contain three paychecks.
          </p>
        </details>
      </section>

      {/* EEAT */}
      <section className="seo-section sources-section">
        <h2>How We Calculate Biweekly Pay</h2>
        <p className="section-intro">
          Our biweekly paycheck calculations use standard payroll conversion methods.
        </p>
        <p className="section-intro">We consider:</p>
        <ul className="factors-list">
          <li>Annual salary conversion</li>
          <li>Hourly wages</li>
          <li>Pay frequency</li>
          <li>Payroll taxes</li>
          <li>Employee deductions</li>
          <li>Federal withholding rules</li>
        </ul>
        <p>Actual employer payroll results may vary depending on individual circumstances.</p>

        <h3>Tax Information Sources</h3>
        <p className="section-intro">Our payroll information references:</p>
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
        <h2>Disclaimer</h2>
        <p>
          This biweekly paycheck calculator provides estimates only. Actual paycheck amounts may
          vary based on employer payroll systems, tax withholding, benefits, deductions, and
          personal financial circumstances.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
