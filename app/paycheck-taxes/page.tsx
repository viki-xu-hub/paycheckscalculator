import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title:
    "Paycheck Taxes Explained - Federal, State, Social Security & Medicare Taxes",
  description:
    "Learn how paycheck taxes work, including federal income tax, state taxes, Social Security, Medicare, and other payroll deductions that affect your take-home pay.",
  alternates: { canonical: "/paycheck-taxes" },
  openGraph: {
    title:
      "Paycheck Taxes Explained - Federal, State, Social Security & Medicare Taxes",
    description:
      "Understand how federal, state, Social Security, and Medicare taxes are deducted from your paycheck and affect your take-home pay.",
    url: "https://www.paycheckscalculator.org/paycheck-taxes",
    type: "website",
  },
};

export default function PaycheckTaxes() {
  const canonical = "https://www.paycheckscalculator.org/paycheck-taxes";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What taxes come out of a paycheck?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common paycheck taxes include federal income tax, Social Security tax, Medicare tax, and state income tax where applicable.",
        },
      },
      {
        "@type": "Question",
        name: "How much tax is taken from a paycheck?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The amount of tax withheld depends on income, filing status, location, and withholding information provided on your W-4.",
        },
      },
      {
        "@type": "Question",
        name: "Why is my paycheck lower than my salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your paycheck is lower because taxes and payroll deductions are removed from your gross earnings before you receive payment.",
        },
      },
      {
        "@type": "Question",
        name: "Does every state have paycheck taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Some states do not have individual state income tax on wages, while others deduct state income tax from employee paychecks.",
        },
      },
      {
        "@type": "Question",
        name: "How can I reduce paycheck taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some employees reduce taxable income through eligible deductions such as retirement contributions and certain employee benefits.",
        },
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Paycheck Taxes: Understanding Taxes Deducted From Your Paycheck",
    description:
      "Learn how paycheck taxes work, including federal income tax, state taxes, Social Security, Medicare, and payroll deductions.",
    url: canonical,
    dateModified: "2026-08-04",
    author: {
      "@type": "Organization",
      name: "Paycheck Calculator Editorial Team",
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Paycheck Taxes Guide",
    url: canonical,
    about:
      "Payroll tax deduction guide covering federal income tax, Social Security, Medicare, state taxes, and paycheck withholding.",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">PAYCHECK TAX GUIDE</div>
        <h1>Paycheck Taxes: Understanding Taxes Deducted From Your Paycheck</h1>
        <p className="hero-copy">
          Paycheck taxes are the deductions removed from your earnings before you
          receive your final take-home pay.
        </p>
        <p className="hero-copy">
          Understanding how taxes affect your paycheck can help you better estimate
          your income, plan your budget, and understand why your net pay is
          different from your gross salary.
        </p>
        <p className="hero-copy">
          Common paycheck deductions include federal income tax, Social Security
          tax, Medicare tax, state income tax, and other payroll deductions.
        </p>
        <p className="hero-copy">
          Use our{" "}
          <a href="/" className="text-link">
            paycheck calculator
          </a>{" "}
          to estimate how taxes affect your final paycheck amount.
        </p>
        <div className="trust-row">
          <span>Free &bull; No sign-up required</span>
          <span>Updated for 2026 tax rules</span>
          <span>Comprehensive tax guide</span>
        </div>
      </section>

      {/* What Are Paycheck Taxes */}
      <section className="seo-section">
        <p className="kicker">THE BASICS</p>
        <h2>What Are Paycheck Taxes?</h2>
        <p className="section-intro">
          Paycheck taxes are amounts withheld from your wages by your employer and
          sent to federal, state, and local tax authorities.
        </p>
        <p className="section-intro">
          These deductions reduce your gross pay and determine your final net pay,
          also called take-home pay.
        </p>
        <p className="section-intro">The main types of paycheck taxes include:</p>
        <ul className="factors-list">
          <li>Federal income tax</li>
          <li>Social Security tax</li>
          <li>Medicare tax</li>
          <li>State income tax</li>
          <li>Local taxes (where applicable)</li>
        </ul>
      </section>

      {/* How Are Taxes Calculated */}
      <section className="seo-section">
        <h2>How Are Taxes Calculated on a Paycheck?</h2>
        <p className="section-intro">
          Paycheck taxes are calculated based on several factors, including:
        </p>
        <ul className="factors-list">
          <li>Gross income</li>
          <li>Pay frequency</li>
          <li>Filing status</li>
          <li>W-4 information</li>
          <li>Tax brackets</li>
          <li>State of residence</li>
          <li>Pre-tax deductions</li>
          <li>Employee benefits</li>
        </ul>
        <p>
          Your employer uses this information to estimate how much tax should be
          withheld from each paycheck.
        </p>
      </section>

      {/* Federal Income Tax */}
      <section className="seo-section">
        <h2>Federal Income Tax on Paychecks</h2>
        <p className="section-intro">
          Federal income tax is one of the largest deductions that may appear on a
          paycheck.
        </p>
        <p className="section-intro">The amount withheld depends on:</p>
        <ul className="factors-list">
          <li>Annual income</li>
          <li>Filing status</li>
          <li>W-4 form information</li>
          <li>Tax credits</li>
          <li>Additional withholding requests</li>
        </ul>
        <p>
          Employees usually complete Form W-4 when starting a job or when their tax
          situation changes. The W-4 tells your employer how much federal income tax
          to withhold from each paycheck based on your filing status, dependents, and
          other adjustments.
        </p>
      </section>

      {/* Social Security Tax */}
      <section className="seo-section">
        <h2>Social Security Tax</h2>
        <p className="section-intro">
          Social Security tax is a payroll tax that helps fund retirement,
          disability, and survivor benefits.
        </p>
        <p className="section-intro">
          Most employees contribute a percentage of their wages through paycheck
          withholding.
        </p>
        <p>
          This deduction appears separately on many pay stubs and is commonly listed
          as Social Security or OASDI. For 2026, the Social Security tax rate for
          employees is 6.2% on wages up to the annual wage base limit. Employers
          also contribute a matching 6.2%.
        </p>
      </section>

      {/* Medicare Tax */}
      <section className="seo-section">
        <h2>Medicare Tax</h2>
        <p className="section-intro">
          Medicare tax helps fund the federal Medicare healthcare program.
        </p>
        <p className="section-intro">
          Employees generally pay Medicare tax through payroll deductions at a rate
          of 1.45% on all covered wages.
        </p>
        <p>
          Higher-income employees may also be subject to an additional 0.9% Medicare
          tax on wages above certain thresholds, depending on filing status and
          earnings.
        </p>
      </section>

      {/* State Income Tax */}
      <section className="seo-section">
        <h2>State Income Tax on Paychecks</h2>
        <p className="section-intro">
          State paycheck taxes vary depending on where you live and work.
        </p>
        <p className="section-intro">
          Some states have income tax deductions, while others do not collect state
          income tax on wages.
        </p>

        <p><strong>States with no state income tax on wages include:</strong></p>
        <ul className="factors-list">
          <li>Texas</li>
          <li>Florida</li>
          <li>Washington</li>
          <li>Nevada</li>
          <li>Tennessee</li>
          <li>Wyoming</li>
          <li>South Dakota</li>
          <li>Alaska</li>
        </ul>

        <p>
          Employees in other states may see state income tax deducted from each
          paycheck. State tax rates and withholding methods vary widely — some
          states use a flat tax rate while others have progressive tax brackets.
        </p>
      </section>

      {/* Gross Pay vs Net Pay */}
      <section className="seo-section">
        <h2>Gross Pay vs Paycheck After Taxes</h2>
        <p className="section-intro">
          Many employees are surprised that their paycheck amount is lower than their
          salary. This happens because taxes and deductions are removed before
          payment.
        </p>

        <div className="breakdown-grid">
          <div className="breakdown-card">
            <h3>Gross Pay</h3>
            <p>Your total earnings before taxes and deductions.</p>
            <ul>
              <li>Salary</li>
              <li>Hourly wages</li>
              <li>Overtime</li>
              <li>Bonuses</li>
            </ul>
          </div>
          <div className="breakdown-card">
            <h3>Net Pay</h3>
            <p>
              The amount you receive after taxes and deductions. This is your actual
              take-home pay.
            </p>
          </div>
        </div>
      </section>

      {/* Other Deductions */}
      <section className="seo-section">
        <h2>Common Payroll Deductions Besides Taxes</h2>
        <p className="section-intro">Not every paycheck deduction is a tax.</p>
        <p className="section-intro">Your paycheck may also include:</p>
        <ul className="factors-list">
          <li>Health insurance premiums</li>
          <li>Retirement contributions</li>
          <li>401(k) contributions</li>
          <li>Flexible spending accounts</li>
          <li>Employee benefit programs</li>
          <li>Wage garnishments</li>
        </ul>
      </section>

      {/* Why So Much Tax */}
      <section className="seo-section">
        <h2>Why Is So Much Tax Taken From My Paycheck?</h2>
        <p className="section-intro">
          The amount of tax deducted from your paycheck depends on your personal
          financial situation.
        </p>
        <p className="section-intro">
          Factors that can increase or decrease paycheck taxes include:
        </p>
        <ul className="factors-list">
          <li>Income level</li>
          <li>Tax bracket</li>
          <li>Filing status</li>
          <li>State tax rules</li>
          <li>W-4 withholding settings</li>
          <li>Pre-tax benefits</li>
        </ul>
        <p>
          Updating your W-4 information can help ensure your paycheck withholding
          better matches your expected tax liability, so you don&apos;t owe a large
          amount at tax time or receive a large refund.
        </p>
      </section>

      {/* How to Calculate */}
      <section className="seo-section">
        <h2>How to Calculate Paycheck Taxes</h2>
        <p className="section-intro">To estimate paycheck taxes:</p>

        <div className="steps-grid">
          {[
            { num: 1, title: "Gross Wages", text: "Calculate your gross wages based on your salary or hourly rate." },
            { num: 2, title: "Taxable Income", text: "Determine taxable income after eligible pre-tax deductions." },
            { num: 3, title: "Federal Tax", text: "Estimate federal income tax withholding using IRS guidelines." },
            { num: 4, title: "FICA Taxes", text: "Calculate Social Security (6.2%) and Medicare (1.45%) taxes." },
            { num: 5, title: "State & Local Tax", text: "Apply state and local income taxes based on your location." },
            { num: 6, title: "Net Pay", text: "Subtract all deductions to estimate your final take-home pay." },
          ].map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <p className="section-intro">
          Use our{" "}
          <a href="/" className="text-link">
            free paycheck calculator
          </a>{" "}
          to automate this calculation and see your estimated take-home pay.
        </p>
      </section>

      {/* State Links */}
      <section className="seo-section">
        <h2>Paycheck Taxes by State</h2>
        <p className="section-intro">
          Paycheck taxes can vary significantly depending on your location.
        </p>
        <p className="section-intro">
          Use our state paycheck calculators to estimate your after-tax income:
        </p>

        <div className="tool-links">
          <a href="/california-paycheck-calculator">
            <b>California Paycheck Calculator</b>
            <span>Progressive tax with SDI withholding →</span>
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
          <a href="/illinois-paycheck-calculator">
            <b>Illinois Paycheck Calculator</b>
            <span>Flat 4.95% rate with exemptions →</span>
          </a>
          <a href="/pennsylvania-paycheck-calculator">
            <b>Pennsylvania Paycheck Calculator</b>
            <span>Flat 3.07% state tax rate →</span>
          </a>
        </div>
      </section>

      {/* Example */}
      <section className="seo-section">
        <h2>Paycheck Taxes Example: $75,000 Salary</h2>
        <p className="section-intro">
          An employee earning $75,000 per year may experience deductions including:
        </p>

        <div className="breakdown-grid">
          <div className="breakdown-card">
            <h3>Annual View</h3>
            <ul>
              <li>Gross salary: $75,000</li>
              <li>Federal income tax: Depends on filing status</li>
              <li>Social Security: Payroll deduction</li>
              <li>Medicare: Payroll deduction</li>
              <li>State taxes: Depends on location</li>
            </ul>
          </div>
          <div className="breakdown-card">
            <h3>Per Paycheck View</h3>
            <p>
              If paid biweekly (26 pay periods), each paycheck would show roughly
              $2,885 in gross pay before any taxes and deductions are applied.
            </p>
            <p>
              After taxes and deductions, the actual take-home pay per paycheck will
              be lower than the gross amount.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="seo-section faq-section">
        <h2>Frequently Asked Questions</h2>

        <details open>
          <summary>What taxes come out of a paycheck?</summary>
          <p>
            Common paycheck taxes include federal income tax, Social Security tax,
            Medicare tax, and state income tax where applicable.
          </p>
        </details>

        <details open>
          <summary>How much tax is taken from a paycheck?</summary>
          <p>
            The amount of tax withheld depends on income, filing status, location,
            and withholding information provided on your W-4.
          </p>
        </details>

        <details open>
          <summary>Why is my paycheck lower than my salary?</summary>
          <p>
            Your paycheck is lower because taxes and payroll deductions are removed
            from your gross earnings before you receive payment.
          </p>
        </details>

        <details open>
          <summary>Does every state have paycheck taxes?</summary>
          <p>
            No. Some states do not have individual state income tax on wages, while
            others deduct state income tax from employee paychecks.
          </p>
        </details>

        <details open>
          <summary>How can I reduce paycheck taxes?</summary>
          <p>
            Some employees reduce taxable income through eligible deductions such as
            retirement contributions and certain employee benefits.
          </p>
        </details>
      </section>

      {/* EEAT Methodology */}
      <section className="seo-section methodology-section">
        <h2>How We Calculate Paycheck Taxes</h2>
        <p className="section-intro">
          Our paycheck tax information is based on commonly used payroll calculation
          methods and publicly available tax guidance.
        </p>
        <p className="section-intro">We consider:</p>
        <ul className="factors-list">
          <li>Federal tax withholding rules</li>
          <li>Social Security and Medicare requirements</li>
          <li>State tax regulations</li>
          <li>Common payroll deductions</li>
        </ul>
        <p>
          Tax rules may change over time, so users should verify current
          requirements with official government sources.
        </p>
      </section>

      {/* Tax Sources */}
      <section className="seo-section sources-section">
        <h2>Tax Information Sources</h2>
        <p className="section-intro">
          For official tax information, refer to:
        </p>
        <ul className="factors-list">
          <li>Internal Revenue Service (IRS)</li>
          <li>Social Security Administration (SSA)</li>
          <li>State tax agencies</li>
          <li>U.S. Department of Labor</li>
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
          This information is provided for educational purposes only and does not
          constitute tax advice. Actual paycheck deductions may vary depending on
          employer payroll systems, benefits, tax changes, and individual
          circumstances. Consult a qualified tax professional for personal tax
          guidance.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
