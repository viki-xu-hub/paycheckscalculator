import PaycheckCalculator from "./PaycheckCalculator";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { frequencyFaqs } from "../lib/seo/faqSchema";
import { frequencyBreadcrumb } from "../lib/seo/breadcrumb";
import type { FrequencyData } from "../lib/seo/types";
import type { PayFrequency } from "../lib/payroll";

const LAST_MODIFIED = "2026-08-07";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const fmtWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const EXAMPLE_SALARIES = [50000, 75000, 100000];

const FREQUENCY_COPY: Record<string, {
  whatIs: string[];
  scheduleNote: string;
  cashFlowNote: string;
  industries: string[];
  vsOthers: { label: string; periods: number; note: string }[];
}> = {
  weekly: {
    whatIs: [
      "Weekly pay means employees receive a paycheck every seven days — 52 paychecks per year.",
      "It is the most frequent standard pay schedule and is most common in industries with hourly workers or variable hours.",
    ],
    scheduleNote: "Most weekly payrolls run Friday to Thursday, with paychecks issued on Fridays.",
    cashFlowNote: "Weekly pay gives workers more frequent access to earned wages, which can be helpful for managing day-to-day expenses. Each paycheck is smaller than a biweekly check, but there are 26 more pay events per year.",
    industries: ["Construction", "Manufacturing", "Food service", "Retail", "Seasonal and temporary work", "Gig and shift-based work"],
    vsOthers: [
      { label: "Biweekly", periods: 26, note: "Every two weeks, 26 checks/year — most common U.S. schedule" },
      { label: "Semimonthly", periods: 24, note: "Twice per month on fixed dates, 24 checks/year" },
      { label: "Monthly", periods: 12, note: "Once per month, 12 checks/year" },
    ],
  },
  semimonthly: {
    whatIs: [
      "Semimonthly pay means employees are paid twice per month on fixed dates — resulting in exactly 24 paychecks per year.",
      "Common fixed pay dates are the 1st and 15th, or the 15th and last day of the month.",
    ],
    scheduleNote: "Unlike biweekly pay, semimonthly pay always falls on the same calendar dates. This makes benefit deductions and monthly budgeting more predictable.",
    cashFlowNote: "Semimonthly and biweekly pay look similar but differ in important ways. Semimonthly gives you 24 checks per year versus 26 for biweekly — meaning each semimonthly check is slightly larger than a biweekly check for the same annual salary.",
    industries: ["Professional services", "Management and executive roles", "Government and public sector", "Accounting and finance", "Healthcare administration"],
    vsOthers: [
      { label: "Weekly", periods: 52, note: "Every 7 days, 52 checks/year — smallest individual check" },
      { label: "Biweekly", periods: 26, note: "Every 14 days, 26 checks/year — most common U.S. schedule" },
      { label: "Monthly", periods: 12, note: "Once per month, 12 checks/year — largest individual check" },
    ],
  },
  monthly: {
    whatIs: [
      "Monthly pay means employees receive one paycheck per month — 12 paychecks per year.",
      "Each monthly paycheck represents your full monthly earnings minus all taxes and deductions.",
    ],
    scheduleNote: "Monthly payroll is less common in the U.S. but is used in certain industries and for senior-level salaried employees. Pay dates are typically the last business day of the month.",
    cashFlowNote: "Monthly paychecks are the largest of any pay frequency for the same annual salary, but they come infrequently. Budgeting on a monthly schedule requires planning for expenses that fall mid-month before the next check arrives.",
    industries: ["Senior executives and C-suite", "Some government and municipal roles", "Independent contractors", "International employers", "Nonprofit leadership"],
    vsOthers: [
      { label: "Weekly", periods: 52, note: "Every 7 days, 52 checks/year" },
      { label: "Biweekly", periods: 26, note: "Every 14 days, 26 checks/year — most common U.S. schedule" },
      { label: "Semimonthly", periods: 24, note: "Twice per month on fixed dates, 24 checks/year" },
    ],
  },
};

export default function FrequencyPageTemplate({ freq }: { freq: FrequencyData }) {
  const copy = FREQUENCY_COPY[freq.shortLabel];
  const faqs = frequencyFaqs(freq);
  const canonical = `https://www.paycheckscalculator.org/${freq.slug}`;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${freq.name} Paycheck Calculator`,
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: `Calculate your ${freq.shortLabel} take-home pay after taxes with ${freq.periods} pay periods per year.`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${freq.name} Paycheck Calculator 2026`,
    url: canonical,
    dateModified: LAST_MODIFIED,
    datePublished: "2026-08-07",
    about: `${freq.name} paycheck calculation and take-home pay estimation. ${freq.periods} pay periods per year.`,
  };

  const breadcrumbSchema = frequencyBreadcrumb(freq.name, freq.slug);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">{freq.periods} PAYCHECKS PER YEAR</div>
        <h1>{freq.name} Paycheck Calculator 2026 — Estimate Your Take-Home Pay</h1>
        <p className="hero-copy">
          Use our free {freq.shortLabel} paycheck calculator to estimate your take-home pay
          after federal income tax, Social Security, Medicare, and state taxes.
        </p>
        <p className="hero-copy">
          {freq.longDescription} Use the calculator below to enter your salary,
          state, and deductions.
        </p>
        <PaycheckCalculator defaultFrequency={freq.shortLabel as PayFrequency} />
        <div className="trust-row">
          <span>Free &bull; No sign-up required</span>
          <span>Updated for 2026 tax rules</span>
          <span>{freq.periods} pay periods per year</span>
        </div>
      </section>

      {/* What Is This Pay Schedule */}
      <section className="seo-section">
        <p className="kicker">{freq.shortLabel.toUpperCase()} PAY BASICS</p>
        <h2>What Is {freq.name} Pay?</h2>
        {copy.whatIs.map((p, i) => <p key={i} className="section-intro">{p}</p>)}
        <p className="section-intro">{copy.scheduleNote}</p>
        <p className="section-intro">Common industries using {freq.shortLabel} pay:</p>
        <ul className="factors-list">
          {copy.industries.map(ind => <li key={ind}>{ind}</li>)}
        </ul>
      </section>

      {/* How to Calculate */}
      <section className="seo-section">
        <h2>How to Calculate Your {freq.name} Paycheck</h2>
        <p className="section-intro">
          To estimate your {freq.shortLabel} gross pay, divide your annual salary by{" "}
          <strong>{freq.periods}</strong>:
        </p>
        <div className="note">
          <strong>Annual Salary ÷ {freq.periods} = {freq.name} Gross Pay</strong>
        </div>

        <p className="section-intro">Examples at common salary levels:</p>
        {EXAMPLE_SALARIES.map(salary => (
          <div key={salary} className="note">
            <strong>{fmtWhole.format(salary)} annual salary</strong>
            <ul>
              <li>Annual: {fmtWhole.format(salary)}</li>
              <li>{freq.name} gross pay: {fmt.format(salary / freq.periods)}</li>
            </ul>
            <p>Your actual take-home will be lower after taxes and deductions.</p>
          </div>
        ))}
      </section>

      {/* Cash Flow Note */}
      <section className="seo-section">
        <h2>{freq.name} Pay vs Other Pay Schedules</h2>
        <p className="section-intro">{copy.cashFlowNote}</p>

        <div className="breakdown-grid">
          <div className="breakdown-card">
            <h3>{freq.name} Pay</h3>
            <ul>
              <li>{freq.periods} paychecks per year</li>
              <li>{freq.description}</li>
            </ul>
          </div>
          {copy.vsOthers.slice(0, 1).map(other => (
            <div key={other.label} className="breakdown-card">
              <h3>{other.label} Pay</h3>
              <ul>
                <li>{other.periods} paychecks per year</li>
                <li>{other.note}</li>
              </ul>
            </div>
          ))}
        </div>

        <p className="section-intro" style={{ marginTop: 20 }}>
          All pay schedules produce the same annual gross income. The difference is how that
          income is distributed across the year — affecting cash flow, deduction timing, and
          monthly budgeting.
        </p>
      </section>

      {/* After Tax */}
      <section className="seo-section">
        <h2>How Much Is My {freq.name} Paycheck After Taxes?</h2>
        <p className="section-intro">
          Your {freq.shortLabel} take-home pay depends on:
        </p>
        <ul className="factors-list">
          <li>Annual salary and income level</li>
          <li>Federal filing status (single, married, head of household)</li>
          <li>W-4 withholding elections</li>
          <li>State income tax (varies by state)</li>
          <li>Social Security tax (6.2%)</li>
          <li>Medicare tax (1.45%)</li>
          <li>Retirement contributions (401k, 403b)</li>
          <li>Health insurance and benefit deductions</li>
        </ul>

        <div className="note">
          <strong>Example: $75,000 annual salary, {freq.shortLabel}</strong>
          <p>Gross {freq.shortLabel} pay: {fmtWhole.format(Math.round(75000 / freq.periods))}</p>
          <p>Your actual take-home will be lower after federal taxes, state taxes, and deductions.</p>
        </div>
      </section>

      {/* State Links */}
      <section className="seo-section">
        <h2>{freq.name} Paycheck Calculator by State</h2>
        <p className="section-intro">
          Your {freq.shortLabel} take-home pay varies significantly by state. Use our
          state-specific calculators to compare:
        </p>
        <div className="tool-links">
          <a href="/texas-paycheck-calculator">
            <b>Texas Paycheck Calculator</b>
            <span>No state income tax on wages →</span>
          </a>
          <a href="/california-paycheck-calculator">
            <b>California Paycheck Calculator</b>
            <span>State withholding and SDI →</span>
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
        <h2>{freq.name} Paycheck Methodology</h2>
        <p className="section-intro">
          Our {freq.shortLabel} paycheck calculator uses standard payroll conversion methods
          based on 2026 IRS withholding tables.
        </p>
        <ol className="factors-list">
          <li>Converting annual salary into {freq.shortLabel} wages (÷ {freq.periods})</li>
          <li>Applying eligible pre-tax deductions</li>
          <li>Estimating federal income tax using 2026 IRS annualized method</li>
          <li>Calculating Social Security (6.2%) and Medicare (1.45%) taxes</li>
          <li>Applying state income tax where applicable</li>
          <li>Dividing the result back to {freq.shortLabel} net pay</li>
        </ol>

        <h3>Tax Information Sources</h3>
        <ul className="factors-list">
          <li>Internal Revenue Service (IRS) — 2026 Publication 15-T</li>
          <li>Social Security Administration (SSA)</li>
          <li>State tax agency withholding tables</li>
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

      {/* FAQ */}
      <section className="seo-section faq-section">
        <h2>{freq.name} Paycheck Calculator FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i} open>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      {/* Other Frequency Links */}
      <section className="seo-section">
        <h2>Other Paycheck Calculators</h2>
        <div className="tool-links">
          <a href="/biweekly-paycheck-calculator">
            <b>Biweekly Paycheck Calculator</b>
            <span>26 paychecks per year →</span>
          </a>
          {freq.shortLabel !== "weekly" && (
            <a href="/weekly-paycheck-calculator">
              <b>Weekly Paycheck Calculator</b>
              <span>52 paychecks per year →</span>
            </a>
          )}
          {freq.shortLabel !== "semimonthly" && (
            <a href="/semimonthly-paycheck-calculator">
              <b>Semimonthly Paycheck Calculator</b>
              <span>24 paychecks per year →</span>
            </a>
          )}
          {freq.shortLabel !== "monthly" && (
            <a href="/monthly-paycheck-calculator">
              <b>Monthly Paycheck Calculator</b>
              <span>12 paychecks per year →</span>
            </a>
          )}
          <a href="/hourly-paycheck-calculator">
            <b>Hourly Paycheck Calculator</b>
            <span>Calculate pay from hourly rate →</span>
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="seo-section disclaimer-section">
        <h2>Disclaimer</h2>
        <p>
          This {freq.shortLabel} paycheck calculator provides estimates for informational
          purposes only. Actual paycheck amounts may vary based on employer payroll systems,
          tax withholding, benefits, deductions, and individual financial circumstances.
          For specific tax advice, consult a qualified tax professional.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
