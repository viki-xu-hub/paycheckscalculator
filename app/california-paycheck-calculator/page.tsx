import type { Metadata } from "next";
import PaycheckCalculator from "../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "California Paycheck Calculator 2026 - Calculate Your Take-Home Pay After Taxes",
  description:
    "Use our California paycheck calculator to estimate your 2026 take-home pay after federal taxes, California state income tax, SDI, Social Security, Medicare, and payroll deductions.",
  alternates: { canonical: "/california-paycheck-calculator" },
  openGraph: {
    title: "California Paycheck Calculator 2026 - Calculate Your Take-Home Pay After Taxes",
    description:
      "Estimate your California take-home pay with federal taxes, California state income tax, SDI, Social Security, Medicare, and payroll deductions.",
    url: "https://www.paycheckscalculator.org/california-paycheck-calculator",
    type: "website",
  },
};

export default function California() {
  const canonical = "https://www.paycheckscalculator.org/california-paycheck-calculator";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "California Paycheck Calculator",
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free California paycheck calculator for 2026. Estimate take-home pay after federal taxes, California state income tax, SDI, Social Security, Medicare, and payroll deductions.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does California have state income tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. California has a progressive state income tax with rates ranging from 1% to 13.3%. California employees also contribute to State Disability Insurance (SDI) through payroll withholding.",
        },
      },
      {
        "@type": "Question",
        name: "How much is my paycheck after taxes in California?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your California take-home pay depends on your salary, pay frequency, federal tax withholding, California state income tax, SDI, Social Security, Medicare, benefits, and deductions.",
        },
      },
      {
        "@type": "Question",
        name: "Does California paycheck calculator include SDI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. California paycheck calculations include estimated State Disability Insurance (SDI) contributions in addition to California state income tax and federal taxes.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is the California paycheck calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The calculator provides an estimate based on the information entered. Actual payroll results may vary depending on employer systems, DE 4 elections, benefits, and tax circumstances.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between California SDI and state income tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "California SDI (State Disability Insurance) is a payroll contribution that funds disability and paid family leave benefits. California state income tax is a separate tax based on income brackets. Both are deducted from California employee paychecks.",
        },
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "California Paycheck Calculator 2026",
    url: canonical,
    about: "Payroll tax calculation and take-home pay estimation in California",
    description:
      "Calculate your California take-home pay after federal taxes, California state income tax, SDI, Social Security, Medicare, and payroll deductions.",
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">CALIFORNIA · PROGRESSIVE STATE INCOME TAX + SDI</div>
        <h1>California Paycheck Calculator 2026: Calculate Your Take-Home Pay After Taxes</h1>
        <div className="hero-intro">
          <p>
            Our <strong>California paycheck calculator</strong> helps you estimate your take-home pay after federal taxes, California state income tax, State Disability Insurance (SDI), Social Security, Medicare, and other payroll deductions.
          </p>
          <p>
            California has a progressive state income tax system and requires SDI contributions from most employees, which can significantly affect your net pay compared with states that have no income tax or lower payroll deductions.
          </p>
          <p>
            Enter your salary information to estimate your California paycheck based on your pay frequency, DE 4 allowances, deductions, and payroll factors.
          </p>
        </div>
        <PaycheckCalculator defaultState="CA" navigateOnStateChange />
        <div className="trust-row">
          <span>✓ 2026 IRS method</span>
          <span>✓ California EDD withholding method</span>
          <span>✓ No sign-up required</span>
        </div>
        <div className="calc-note">
          <p>
            This <strong>California paycheck calculator</strong> estimates your net pay by considering federal income tax, California state income tax, SDI contributions, Social Security tax, Medicare tax, pre-tax deductions, employee benefits, and other payroll adjustments. The calculator is designed to help California employees understand the difference between gross pay and actual take-home pay.
          </p>
        </div>
      </section>

      {/* H2: What This California Paycheck Calculator Includes */}
      <section className="seo-section text-left">
        <p className="kicker">CALCULATOR FEATURES</p>
        <h2>What This California Paycheck Calculator Includes</h2>
        <p className="seo-section-intro">
          This California paycheck calculator estimates your net pay by considering the major payroll factors that affect your paycheck.
        </p>
        <ul className="checklist">
          <li>Federal income tax</li>
          <li>California state income tax</li>
          <li>State Disability Insurance (SDI)</li>
          <li>Social Security tax</li>
          <li>Medicare tax</li>
          <li>Pre-tax deductions</li>
          <li>Employee benefits</li>
          <li>Other payroll adjustments</li>
        </ul>
        <p className="calc-note" style={{ marginTop: 20 }}>
          The calculator is designed to help California employees understand the difference between gross pay and actual take-home pay, accounting for the state's progressive income tax brackets and SDI contributions.
        </p>
      </section>

      {/* H2: Does California Have State Income Tax? */}
      <section className="seo-section text-left">
        <p className="kicker">CALIFORNIA TAX POLICY</p>
        <h2>Does California Have State Income Tax?</h2>
        <p>
          <strong>Yes. California imposes a progressive state income tax on wages.</strong> Rates range from 1% to 13.3% depending on income level and filing status.
        </p>
        <p>
          In addition to state income tax, most California employees have the following payroll deductions:
        </p>
        <ul className="checklist">
          <li>Federal income tax</li>
          <li>California state income tax</li>
          <li>State Disability Insurance (SDI)</li>
          <li>Social Security tax</li>
          <li>Medicare tax</li>
          <li>Employer benefit deductions</li>
          <li>Retirement contributions</li>
        </ul>
        <p style={{ marginTop: 16, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          California's progressive income tax means higher earners pay a larger percentage of their income in state taxes. Combined with SDI contributions, California employees typically see more withheld from their paycheck compared with employees in no-income-tax states.
        </p>
      </section>

      {/* H2: How We Calculate Your California Paycheck */}
      <section className="seo-section text-left">
        <p className="kicker">CALCULATION METHOD</p>
        <h2>How We Calculate Your California Paycheck</h2>
        <p className="seo-section-intro">
          Our California paycheck calculator uses a payroll estimation method based on current federal and California state tax rules and common payroll practices.
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
            <h3>Calculate California tax & SDI</h3>
            <p>Estimate California state income tax using EDD Method B brackets and apply SDI contributions.</p>
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

      {/* H2: 2026 California Paycheck Calculator Method */}
      <section className="seo-section text-left">
        <p className="kicker">2026 IRS + CALIFORNIA METHOD</p>
        <h2>2026 California Paycheck Calculator Method</h2>
        <p className="seo-section-intro">
          For 2026 estimates, this calculator uses the IRS automated percentage method for federal withholding and California EDD Method B for state income tax withholding.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          California uses Form DE 4 for state withholding elections. The estimate assumes a current Form W-4 and DE 4 situation without additional adjustments unless entered by the user.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          Actual employer payroll calculations may differ depending on your W-4 information, DE 4 elections, benefits, and company payroll system.
        </p>
      </section>

      {/* H2: Why Your Actual California Paycheck May Be Different */}
      <section className="seo-section text-left">
        <p className="kicker">IMPORTANT CONSIDERATIONS</p>
        <h2>Why Your Actual California Paycheck May Be Different</h2>
        <p className="seo-section-intro">
          Your actual paycheck from an employer may differ from this estimate because payroll calculations depend on individual circumstances.
        </p>
        <ul className="checklist">
          <li>Multiple jobs</li>
          <li>DE 4 allowances and elections</li>
          <li>W-4 credits</li>
          <li>Additional income</li>
          <li>Bonuses</li>
          <li>Tips</li>
          <li>Qualified overtime</li>
          <li>Benefit eligibility</li>
          <li>Year-to-date SDI and Social Security wage caps</li>
          <li>Employer payroll rounding</li>
          <li>Retirement contributions</li>
        </ul>
      </section>

      {/* H2: Gross Pay vs Net Pay */}
      <section className="seo-section text-left">
        <p className="kicker">PAYCHECK BASICS</p>
        <h2>Understanding Your California Gross Pay and Take-Home Pay</h2>
        <p className="seo-section-intro">
          <strong>Gross pay</strong> is the total amount you earn before taxes and deductions.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          <strong>Net pay</strong>, also called <strong>take-home pay</strong>, is the amount remaining after required taxes and payroll deductions are removed.
        </p>
        <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          For California employees, the difference between gross pay and net pay is affected by federal taxes, California's progressive state income tax, SDI contributions, FICA taxes, and personal deductions.
        </p>
      </section>

      {/* California Salary After Tax Examples */}
      <section className="seo-section">
        <p className="kicker">CALIFORNIA SALARY EXAMPLES</p>
        <h2>California Salary After Tax Examples</h2>
        <p>See estimated take-home pay at common salary levels for California employees.</p>
        <div className="tool-links">
          <a href="/california-salary-after-tax?salary=50000">
            <b>$50,000 Salary After Tax in California</b>
            <span>Estimate take-home pay at $50K →</span>
          </a>
          <a href="/california-salary-after-tax?salary=75000">
            <b>$75,000 Salary After Tax in California</b>
            <span>Calculate net pay at $75K →</span>
          </a>
          <a href="/california-salary-after-tax?salary=100000">
            <b>$100,000 Salary After Tax in California</b>
            <span>See deductions at six figures →</span>
          </a>
          <a href="/california-salary-after-tax">
            <b>California Salary After Tax Calculator</b>
            <span>Full salary comparison tool →</span>
          </a>
        </div>
      </section>

      {/* Related State Calculators */}
      <section className="seo-section">
        <p className="kicker">STATE PAYCHECK CALCULATORS</p>
        <h2>Related State Calculators</h2>
        <p>Compare your California paycheck with take-home pay in other states.</p>
        <div className="tool-links">
          <a href="/texas-paycheck-calculator">
            <b>Texas Paycheck Calculator</b>
            <span>No state income tax state comparison →</span>
          </a>
          <a href="/florida-paycheck-calculator">
            <b>Florida Paycheck Calculator</b>
            <span>Another no-state-income-tax state →</span>
          </a>
          <a href="/new-york-paycheck-calculator">
            <b>New York Paycheck Calculator</b>
            <span>State tax plus NYC resident option →</span>
          </a>
          <a href="/new-jersey-paycheck-calculator">
            <b>New Jersey Paycheck Calculator</b>
            <span>Graduated rates and benefit contributions →</span>
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
          <a href="/california-salary-after-tax">
            <b>California Salary After Tax</b>
            <span>Full California salary comparison →</span>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <p className="kicker">COMMON QUESTIONS</p>
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>Does California have state income tax?<span>+</span></summary>
          <p>
            Yes. California has a progressive state income tax with rates ranging from 1% to 13.3%. California employees also contribute to State Disability Insurance (SDI) through payroll withholding.
          </p>
        </details>
        <details>
          <summary>How much is my paycheck after taxes in California?<span>+</span></summary>
          <p>
            Your California take-home pay depends on your salary, pay frequency, federal tax withholding, California state income tax, SDI, Social Security, Medicare, benefits, and deductions.
          </p>
        </details>
        <details>
          <summary>Does California paycheck calculator include SDI?<span>+</span></summary>
          <p>
            Yes. California paycheck calculations include estimated State Disability Insurance (SDI) contributions in addition to California state income tax and federal taxes.
          </p>
        </details>
        <details>
          <summary>What is the difference between California SDI and state income tax?<span>+</span></summary>
          <p>
            California SDI (State Disability Insurance) is a payroll contribution that funds disability and paid family leave benefits. California state income tax is a separate tax based on income brackets. Both are deducted from California employee paychecks.
          </p>
        </details>
        <details>
          <summary>How accurate is the California paycheck calculator?<span>+</span></summary>
          <p>
            The calculator provides an estimate based on the information entered. Actual payroll results may vary depending on employer systems, DE 4 elections, benefits, and tax circumstances.
          </p>
        </details>
      </section>

      {/* EEAT: Tax Information Sources */}
      <section className="seo-section">
        <p className="kicker">CALCULATION SOURCES</p>
        <h2>Tax Information Sources</h2>
        <p>
          Our California paycheck calculations are based on publicly available payroll and tax information from authoritative sources.
        </p>
        <p>Reference sources include:</p>
        <ul className="checklist">
          <li>Internal Revenue Service (IRS)</li>
          <li>Social Security Administration (SSA)</li>
          <li>California Employment Development Department (EDD)</li>
          <li>California Franchise Tax Board (FTB)</li>
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
        <p>This California paycheck calculator provides estimates for informational purposes only.</p>
        <p>Actual paycheck amounts may vary based on employer payroll systems, benefits, deductions, tax changes, and individual financial situations.</p>
        <p>For specific tax advice, consult a qualified tax professional.</p>
      </section>

      <SiteFooter />
    </main>
  );
}
