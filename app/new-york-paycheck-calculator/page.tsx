import type { Metadata } from "next";
import PaycheckCalculator from "../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "New York Paycheck Calculator 2026 - Calculate Your Take-Home Pay After Taxes",
  description:
    "Use our New York paycheck calculator to estimate your 2026 take-home pay after federal taxes, New York state income tax, Social Security, Medicare, and payroll deductions. NYC resident option available.",
  alternates: { canonical: "/new-york-paycheck-calculator" },
  openGraph: {
    title: "New York Paycheck Calculator 2026 - Calculate Your Take-Home Pay After Taxes",
    description:
      "Estimate your New York take-home pay with federal taxes, New York state income tax, Social Security, Medicare, and payroll deductions. NYC resident option available.",
    url: "https://www.paycheckscalculator.org/new-york-paycheck-calculator",
    type: "website",
  },
};

export default function NewYork() {
  const canonical = "https://www.paycheckscalculator.org/new-york-paycheck-calculator";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "New York Paycheck Calculator",
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free New York paycheck calculator for 2026. Estimate take-home pay after federal taxes, New York state income tax, Social Security, Medicare, and payroll deductions. NYC resident option available.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does New York have state income tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. New York has a progressive state income tax with rates ranging from 4% to 10.9%. New York City residents pay an additional city income tax.",
        },
      },
      {
        "@type": "Question",
        name: "How much is my paycheck after taxes in New York?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your New York take-home pay depends on your salary, pay frequency, federal tax withholding, New York state income tax, Social Security, Medicare, NYC resident status, benefits, and deductions.",
        },
      },
      {
        "@type": "Question",
        name: "Does the New York paycheck calculator include NYC resident tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The calculator includes an NYC resident option for employees who live in New York City. NYC residents pay additional city income tax on top of New York state income tax.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is the New York paycheck calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The calculator provides an estimate based on the information entered. Actual payroll results may vary depending on employer systems, IT-2104 elections, NYC residency status, benefits, and tax circumstances.",
        },
      },
      {
        "@type": "Question",
        name: "Is New York a high-tax state for employees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New York has a progressive state income tax, and New York City residents pay an additional city income tax, making it one of the higher-tax jurisdictions in the United States. Federal taxes and other deductions also apply.",
        },
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "New York Paycheck Calculator 2026",
    url: canonical,
    about: "Payroll tax calculation and take-home pay estimation in New York",
    description:
      "Calculate your New York take-home pay after federal taxes, New York state income tax, Social Security, Medicare, and payroll deductions. NYC resident option available.",
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">NEW YORK · PROGRESSIVE STATE INCOME TAX + NYC RESIDENT OPTION</div>
        <h1>New York Paycheck Calculator 2026: Calculate Your Take-Home Pay After Taxes</h1>
        <div className="hero-intro">
          <p>
            Our <strong>New York paycheck calculator</strong> helps you estimate your take-home pay after federal taxes, New York state income tax, Social Security, Medicare, and other payroll deductions. An NYC resident option is available for employees living in New York City.
          </p>
      </div>
        <PaycheckCalculator defaultState="NY" navigateOnStateChange />
        <div className="hero-more">
          <p>
            New York has a progressive state income tax system, and New York City residents pay an additional city income tax on top of state taxes, which can significantly reduce take-home pay compared with states that have lower or no income tax.
          </p>
          <p>
            Enter your salary information to estimate your New York paycheck based on your pay frequency, NYC residency status, deductions, and payroll factors.
          </p>
        </div>
        <div className="trust-row">
          <span>✓ 2026 IRS method</span>
          <span>✓ New York state withholding method</span>
          <span>✓ NYC resident option</span>
        </div>
        <div className="calc-note">
          <p>
            This <strong>New York paycheck calculator</strong> estimates your net pay by considering federal income tax, New York state income tax, Social Security tax, Medicare tax, pre-tax deductions, employee benefits, and other payroll adjustments. An NYC resident option provides additional city tax estimates for employees living in New York City.
          </p>
        </div>
      </section>

      {/* H2: What This New York Paycheck Calculator Includes */}
      <section className="seo-section text-left">
        <p className="kicker">CALCULATOR FEATURES</p>
        <h2>What This New York Paycheck Calculator Includes</h2>
        <p className="seo-section-intro">
          This New York paycheck calculator estimates your net pay by considering the major payroll factors that affect your paycheck.
        </p>
        <ul className="checklist">
          <li>Federal income tax</li>
          <li>New York state income tax</li>
          <li>New York City resident tax (NYC option)</li>
          <li>Social Security tax</li>
          <li>Medicare tax</li>
          <li>Pre-tax deductions</li>
          <li>Employee benefits</li>
          <li>Other payroll adjustments</li>
        </ul>
        <p className="calc-note" style={{ marginTop: 20 }}>
          The calculator is designed to help New York employees understand the difference between gross pay and actual take-home pay, including the additional impact of NYC resident tax.
        </p>
      </section>

      {/* H2: Does New York Have State Income Tax? */}
      <section className="seo-section text-left">
        <p className="kicker">NEW YORK TAX POLICY</p>
        <h2>Does New York Have State Income Tax?</h2>
        <p>
          <strong>Yes. New York imposes a progressive state income tax on wages.</strong> Rates range from 4% to 10.9% depending on income level and filing status.
        </p>
        <p>
          New York employees may have the following payroll deductions:
        </p>
        <ul className="checklist">
          <li>Federal income tax</li>
          <li>New York state income tax</li>
          <li>New York City resident tax (NYC residents only)</li>
          <li>Social Security tax</li>
          <li>Medicare tax</li>
          <li>Employer benefit deductions</li>
          <li>Retirement contributions</li>
        </ul>
        <p style={{ marginTop: 16, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          New York City residents face an additional city income tax ranging from approximately 3.078% to 3.876%, making the combined state and city tax burden one of the highest in the nation.
        </p>
      </section>

      {/* H2: How We Calculate Your New York Paycheck */}
      <section className="seo-section text-left">
        <p className="kicker">CALCULATION METHOD</p>
        <h2>How We Calculate Your New York Paycheck</h2>
        <p className="seo-section-intro">
          Our New York paycheck calculator uses a payroll estimation method based on current federal and New York state tax rules and common payroll practices.
        </p>
        <div className="info-grid">
          <article>
            <span className="article-num">Step 1</span>
            <h3>Annualize wages</h3>
            <p>Annualize your wages based on your selected pay frequency.</p>
          </article>
          <article>
            <span className="article-num">Step 2</span>
            <h3>Apply pre-tax deductions</h3>
            <p>Apply eligible pre-tax deductions that may reduce taxable income.</p>
          </article>
          <article>
            <span className="article-num">Step 3</span>
            <h3>Estimate federal tax</h3>
            <p>Estimate federal income tax using applicable IRS withholding methods.</p>
          </article>
          <article>
            <span className="article-num">Step 4</span>
            <h3>Calculate NY tax & NYC resident tax</h3>
            <p>Estimate New York state income tax using graduated brackets. Apply NYC resident tax when selected.</p>
          </article>
          <article>
            <span className="article-num">Step 5</span>
            <h3>Calculate FICA</h3>
            <p>Calculate Social Security and Medicare taxes.</p>
          </article>
          <article>
            <span className="article-num">Step 6</span>
            <h3>Convert to pay period</h3>
            <p>Convert the annual estimate into your selected paycheck frequency.</p>
          </article>
        </div>
      </section>

      {/* H2: 2026 New York Paycheck Calculator Method */}
      <section className="seo-section text-left">
        <p className="kicker">2026 IRS + NEW YORK METHOD</p>
        <h2>2026 New York Paycheck Calculator Method</h2>
        <p className="seo-section-intro">
          For 2026 estimates, this calculator uses the IRS automated percentage method for federal withholding and New York's graduated withholding tables for state income tax.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          New York uses Form IT-2104 for state withholding elections. The estimate assumes a current Form W-4 and IT-2104 situation without additional adjustments unless entered by the user.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          Actual employer payroll calculations may differ depending on your W-4 information, IT-2104 elections, NYC residency status, benefits, and company payroll system.
        </p>
      </section>

      {/* H2: Why Your Actual New York Paycheck May Be Different */}
      <section className="seo-section text-left">
        <p className="kicker">IMPORTANT CONSIDERATIONS</p>
        <h2>Why Your Actual New York Paycheck May Be Different</h2>
        <p className="seo-section-intro">
          Your actual paycheck from an employer may differ from this estimate because payroll calculations depend on individual circumstances.
        </p>
        <ul className="checklist">
          <li>Multiple jobs</li>
          <li>IT-2104 allowances</li>
          <li>W-4 credits</li>
          <li>NYC residency status changes</li>
          <li>Additional income</li>
          <li>Bonuses</li>
          <li>Tips</li>
          <li>Qualified overtime</li>
          <li>Benefit eligibility</li>
          <li>Year-to-date Social Security wages</li>
          <li>Employer payroll rounding</li>
          <li>Retirement contributions</li>
        </ul>
      </section>

      {/* H2: Gross Pay vs Net Pay */}
      <section className="seo-section text-left">
        <p className="kicker">PAYCHECK BASICS</p>
        <h2>Understanding Your New York Gross Pay and Take-Home Pay</h2>
        <p className="seo-section-intro">
          <strong>Gross pay</strong> is the total amount you earn before taxes and deductions.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          <strong>Net pay</strong>, also called <strong>take-home pay</strong>, is the amount remaining after required taxes and payroll deductions are removed.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          For New York employees, the difference between gross pay and net pay is affected by federal taxes, New York's progressive state income tax, FICA taxes, personal deductions, and NYC resident tax when applicable.
        </p>
      </section>

      {/* New York Salary After Tax Examples */}
      <section className="seo-section">
        <p className="kicker">NEW YORK SALARY EXAMPLES</p>
        <h2>New York Salary After Tax Examples</h2>
        <p>See estimated take-home pay at common salary levels for New York employees.</p>
        <div className="tool-links">
          <a href="/new-york-salary-after-tax?salary=50000">
            <b>$50,000 Salary After Tax in New York</b>
            <span>Estimate take-home pay at $50K →</span>
          </a>
          <a href="/new-york-salary-after-tax?salary=75000">
            <b>$75,000 Salary After Tax in New York</b>
            <span>Calculate net pay at $75K →</span>
          </a>
          <a href="/new-york-salary-after-tax?salary=100000">
            <b>$100,000 Salary After Tax in New York</b>
            <span>See deductions at six figures →</span>
          </a>
          <a href="/new-york-salary-after-tax">
            <b>New York Salary After Tax Calculator</b>
            <span>Full salary comparison tool →</span>
          </a>
        </div>
      </section>

      {/* Related State Calculators */}
      <section className="seo-section">
        <p className="kicker">STATE PAYCHECK CALCULATORS</p>
        <h2>Related State Calculators</h2>
        <p>Compare your New York paycheck with take-home pay in other states.</p>
        <div className="tool-links">
          <a href="/california-paycheck-calculator">
            <b>California Paycheck Calculator</b>
            <span>Method B, SDI, and state income tax →</span>
          </a>
          <a href="/texas-paycheck-calculator">
            <b>Texas Paycheck Calculator</b>
            <span>No state income tax comparison →</span>
          </a>
          <a href="/florida-paycheck-calculator">
            <b>Florida Paycheck Calculator</b>
            <span>Another no-state-income-tax state →</span>
          </a>
          <a href="/new-jersey-paycheck-calculator">
            <b>New Jersey Paycheck Calculator</b>
            <span>Neighboring state comparison →</span>
          </a>
          <a href="/illinois-paycheck-calculator">
            <b>Illinois Paycheck Calculator</b>
            <span>Flat tax with exemptions →</span>
          </a>
          <a href="/paycheck-calculator">
            <b>Paycheck Calculator</b>
            <span>National paycheck calculator →</span>
          </a>
        </div>
      </section>

      {/* Related Calculator Tools */}
      <section className="seo-section">
        <p className="kicker">MORE CALCULATOR TOOLS</p>
        <h2>Related Calculator Tools</h2>
        <div className="tool-links">
          <a href="/hourly-paycheck-calculator">
            <b>Hourly Pay Calculator</b>
            <span>Estimate take-home pay with hourly rates →</span>
          </a>
          <a href="/biweekly-paycheck-calculator">
            <b>Biweekly Paycheck Calculator</b>
            <span>Estimate one of 26 yearly checks →</span>
          </a>
          <a href="/how-much-tax-is-taken-from-my-paycheck">
            <b>Tax Calculator</b>
            <span>Understand every paycheck deduction →</span>
          </a>
          <a href="/nyc-paycheck-calculator">
            <b>NYC Paycheck Calculator</b>
            <span>NYC resident-specific calculator →</span>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <p className="kicker">COMMON QUESTIONS</p>
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>Does New York have state income tax?<span>+</span></summary>
          <p>
            Yes. New York has a progressive state income tax with rates ranging from 4% to 10.9%. New York City residents pay an additional city income tax.
          </p>
        </details>
        <details>
          <summary>How much is my paycheck after taxes in New York?<span>+</span></summary>
          <p>
            Your New York take-home pay depends on your salary, pay frequency, federal tax withholding, New York state income tax, Social Security, Medicare, NYC resident status, benefits, and deductions.
          </p>
        </details>
        <details>
          <summary>Does the New York paycheck calculator include NYC resident tax?<span>+</span></summary>
          <p>
            Yes. The calculator includes an NYC resident option for employees who live in New York City. NYC residents pay additional city income tax on top of New York state income tax.
          </p>
        </details>
        <details>
          <summary>Is New York a high-tax state for employees?<span>+</span></summary>
          <p>
            New York has a progressive state income tax, and New York City residents pay an additional city income tax, making it one of the higher-tax jurisdictions in the United States.
          </p>
        </details>
        <details>
          <summary>How accurate is the New York paycheck calculator?<span>+</span></summary>
          <p>
            The calculator provides an estimate based on the information entered. Actual payroll results may vary depending on employer systems, IT-2104 elections, NYC residency status, benefits, and tax circumstances.
          </p>
        </details>
      </section>

      {/* EEAT: Tax Information Sources */}
      <section className="seo-section">
        <p className="kicker">CALCULATION SOURCES</p>
        <h2>Tax Information Sources</h2>
        <p>
          Our New York paycheck calculations are based on publicly available payroll and tax information from authoritative sources.
        </p>
        <p>Reference sources include:</p>
        <ul className="checklist">
          <li>Internal Revenue Service (IRS)</li>
          <li>Social Security Administration (SSA)</li>
          <li>New York Department of Taxation and Finance</li>
          <li>New York City Department of Finance</li>
        </ul>
        <div className="reviewer">
          <p><small>Reviewed by: Paycheck Calculator Editorial Team</small></p>
          <p><small>Last Updated: August 2026</small></p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="seo-section">
        <p className="kicker">IMPORTANT INFORMATION</p>
        <h2>Disclaimer</h2>
        <p>This New York paycheck calculator provides estimates for informational purposes only.</p>
        <p>Actual paycheck amounts may vary based on employer payroll systems, benefits, deductions, tax changes, and individual financial situations.</p>
        <p>For specific tax advice, consult a qualified tax professional.</p>
      </section>

      <SiteFooter />
    </main>
  );
}
