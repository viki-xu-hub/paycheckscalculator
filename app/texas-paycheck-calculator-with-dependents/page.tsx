import type { Metadata } from "next";
import TexasDependentsCalculator from "../components/TexasDependentsCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { calculatePaycheck, PAY_PERIODS } from "../lib/payroll";
import {
  dependentCreditAnnual,
  DEPENDENT_CREDIT_LIMIT_MARRIED,
  DEPENDENT_CREDIT_LIMIT_SINGLE,
  OTHER_DEPENDENT_CREDIT,
  QUALIFYING_CHILD_CREDIT,
} from "../lib/paycheckExtras";

const SITE = "https://www.paycheckscalculator.org";
const CANONICAL = `${SITE}/texas-paycheck-calculator-with-dependents`;
const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "Texas Paycheck Calculator With Dependents 2026" }];
const LAST_MODIFIED = "2026-08-29";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const metadata: Metadata = {
  title: "Texas Paycheck Calculator With Dependents — 2026 W-4 Step 3",
  description:
    "Add dependents to your Texas take-home pay estimate. See how the 2026 W-4 Step 3 credit — $2,200 per child under 17 and $500 per other dependent — raises each paycheck.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Texas Paycheck Calculator With Dependents — 2026 W-4 Step 3",
    description:
      "Estimate Texas take-home pay with dependents claimed on Step 3 of the 2026 Form W-4, including federal tax and FICA.",
    url: CANONICAL,
    type: "website",
    siteName: "Paycheck Calculator",
    images: OG_IMAGE,
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

// Worked examples rendered on the server: $75,000 salary, married filing jointly, bi-weekly pay.
const EXAMPLE_SALARY = 75000;
const EXAMPLE_PERIODS = PAY_PERIODS.biweekly;

const baseExample = calculatePaycheck({
  grossAnnual: EXAMPLE_SALARY,
  frequency: "biweekly",
  status: "married",
  state: "TX",
});

const examples = [0, 1, 2, 3, 4].map(children => {
  const { credit } = dependentCreditAnnual({
    qualifyingChildren: children,
    otherDependents: 0,
    annualIncome: EXAMPLE_SALARY,
    status: "married",
  });
  const federal = Math.max(0, baseExample.federal - credit);
  const applied = baseExample.federal - federal;
  const netAnnual = baseExample.netAnnual + applied;
  return {
    children,
    credit,
    federalPerPaycheck: federal / EXAMPLE_PERIODS,
    netPerPaycheck: netAnnual / EXAMPLE_PERIODS,
    gainPerPaycheck: applied / EXAMPLE_PERIODS,
  };
});

const faqs = [
  {
    q: "How do dependents change my Texas paycheck?",
    a: "Dependents do not change your gross pay or your FICA taxes. They lower the federal income tax your employer withholds. Payroll takes the total you entered on Step 3 of your W-4, divides it by the number of pay periods in the year, and reduces the withholding on each paycheck by that amount.",
  },
  {
    q: "How much is the dependent credit on the 2026 W-4?",
    a: "For 2026, Step 3 counts $2,200 for each qualifying child under age 17 and $500 for each other dependent, such as a child 17 or older or a qualifying relative. Two children under 17 come to $4,400.",
  },
  {
    q: "How much more is each paycheck with two children?",
    a: "A $4,400 Step 3 entry spread over 26 bi-weekly paychecks adds about $169 to each check, as long as your federal withholding is large enough to absorb it. On a weekly schedule the same entry adds about $85 per check.",
  },
  {
    q: "Does Texas give a state tax break for dependents?",
    a: "No. Texas has no individual state income tax on wages, so there is no state withholding to reduce and no state dependent exemption. Only federal withholding changes.",
  },
  {
    q: "Can I claim dependents on my W-4 at any income?",
    a: "Step 3 of the W-4 asks you to claim dependents only when your total income will be under $200,000, or under $400,000 if you are married filing jointly. Above those amounts the credit phases out, and this calculator stops applying it.",
  },
  {
    q: "What if my withholding is already near zero?",
    a: "Your employer cannot withhold a negative amount. If the dependent credit is larger than the federal tax that would otherwise be withheld, withholding drops to zero and the rest of the credit is claimed on your tax return as a refund.",
  },
  {
    q: "Should both parents claim the same children on their W-4s?",
    a: "No. If both spouses enter the same dependents, your household will be under-withheld and can owe at filing. The W-4 instructions ask you to claim the dependents on one job only, usually the higher-paying one.",
  },
];

export default function TexasPaycheckCalculatorWithDependents() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Texas Paycheck Calculator With Dependents",
    url: CANONICAL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free Texas paycheck calculator with dependents for 2026. Applies the Form W-4 Step 3 child and dependent credits to federal withholding and shows take-home pay per paycheck.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Texas Paycheck Calculator With Dependents",
    url: CANONICAL,
    dateModified: LAST_MODIFIED,
    about: "Form W-4 Step 3 dependent credits and Texas take-home pay",
    description:
      "Estimate Texas take-home pay after claiming qualifying children and other dependents on Step 3 of the Form W-4.",
    isPartOf: { "@type": "WebPage", name: "Texas Paycheck Calculator", url: `${SITE}/texas-paycheck-calculator` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Texas Paycheck Calculator", item: `${SITE}/texas-paycheck-calculator` },
      { "@type": "ListItem", position: 3, name: "With Dependents", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href="/texas-paycheck-calculator">Texas Paycheck Calculator</a>
        <span aria-hidden="true">›</span>
        <span>With Dependents</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">TEXAS · FORM W-4 STEP 3</div>
        <h1>Texas Paycheck Calculator With Dependents: How Step 3 Raises Your Take-Home Pay</h1>
        <div className="hero-intro">
          <p>
            Enter your salary and the dependents you claim on your W-4 to see the federal withholding reduction
            and the resulting take-home pay per paycheck.
          </p>
      </div>
        <TexasDependentsCalculator />
        <div className="hero-more">
          <p>
            Texas has no state income tax on wages, so dependents change one line on your stub: federal income
            tax withheld.
          </p>
        </div>
        <div className="trust-row">
          <span>✓ 2026 W-4 Step 3 amounts</span>
          <span>✓ Per-paycheck impact</span>
          <span>✓ No sign-up required</span>
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">HOW STEP 3 WORKS</p>
        <h2>How Dependents Change a Texas Paycheck</h2>
        <p className="seo-section-intro">
          Dependents are not a payroll deduction. They are a credit your employer applies in advance, so that
          the tax credit you expect at filing reaches you a little at a time through the year.
        </p>

        <h3>The 2026 Step 3 amounts</h3>
        <ul className="checklist">
          <li>{fmt.format(QUALIFYING_CHILD_CREDIT)} per qualifying child under 17</li>
          <li>{fmt.format(OTHER_DEPENDENT_CREDIT)} per other dependent</li>
          <li>Claim only under {fmt.format(DEPENDENT_CREDIT_LIMIT_SINGLE)} of total income</li>
          <li>Or under {fmt.format(DEPENDENT_CREDIT_LIMIT_MARRIED)} if married filing jointly</li>
        </ul>

        <h3>What payroll does with the number</h3>
        <p>
          Your employer calculates federal withholding on your wages first, then subtracts your Step 3 total
          divided by the number of pay periods in the year. On a bi-weekly schedule that divisor is 26; weekly is
          52, semi-monthly is 24, and monthly is 12. Withholding never goes below zero, so a large credit on a
          small salary simply zeroes out the federal line.
        </p>

        <h3>What does not change</h3>
        <p>
          Social Security and Medicare are flat percentages of your wages and ignore dependents entirely. Your
          gross pay, 401(k) contributions, and benefit deductions are also unaffected. In Texas there is no state
          income tax line to reduce.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">WORKED EXAMPLES</p>
        <h2>Texas Take-Home Pay by Number of Dependents</h2>
        <p className="seo-section-intro">
          A {fmt.format(EXAMPLE_SALARY)} salary, married filing jointly, bi-weekly pay, no pre-tax deductions.
          Each qualifying child under 17 adds {fmt.format(QUALIFYING_CHILD_CREDIT)} to the Step 3 total.
        </p>
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <caption style={{ captionSide: "bottom", paddingTop: 10, fontSize: 12, color: "#7b8b98", textAlign: "left" }}>
              Estimates use the 2026 federal percentage method with a current Form W-4 and Step 2 unchecked.
            </caption>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th scope="col" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>Children under 17</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Step 3 amount</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Federal tax / check</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Bi-weekly net</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Gain / check</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((row, index) => (
                <tr key={row.children} style={{ borderBottom: "1px solid #e0e7ef", background: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                  <th scope="row" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{row.children}</th>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(row.credit)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{cents.format(row.federalPerPaycheck)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{cents.format(row.netPerPaycheck)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", color: "#667a8a" }}>
                    {row.gainPerPaycheck > 0 ? `+${cents.format(row.gainPerPaycheck)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="calc-note" style={{ marginTop: 20 }}>
          The gain per check shrinks once federal withholding reaches zero. At that point the remaining credit is
          not lost — it arrives as a refund after you file rather than inside your paycheck.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">USING THE CALCULATOR</p>
        <h2>How to Use This Texas Dependents Calculator</h2>
        <ol style={{ color: "#667a8a", lineHeight: 1.9, fontSize: 14, paddingLeft: 20 }}>
          <li>Enter your annual gross salary and pay frequency.</li>
          <li>Count qualifying children under 17 separately from other dependents — the amounts differ.</li>
          <li>Select the filing status shown in Step 1 of your W-4.</li>
          <li>Add your 401(k) percentage and any other pre-tax deductions.</li>
          <li>Compare the &quot;federal tax before dependents&quot; and &quot;federal tax withheld&quot; lines to see the credit at work.</li>
        </ol>
        <p className="calc-note" style={{ marginTop: 16 }}>
          To check your own stub, multiply the per-paycheck gain shown here by your number of pay periods. The
          result should match the total you entered on line 3 of your W-4.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">WHAT THIS ESTIMATE ASSUMES</p>
        <h2>Limits of a Dependent Withholding Estimate</h2>
        <ul className="checklist">
          <li>One job, with W-4 Step 2 unchecked</li>
          <li>Dependents claimed on this job only</li>
          <li>No other credits entered on Step 3</li>
          <li>No extra withholding from Step 4(c)</li>
          <li>Credit stops above the income limits</li>
          <li>Employer rounding is not modeled</li>
        </ul>
        <p style={{ marginTop: 16, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          Withholding is a prepayment, not your final tax. Whether you owe or receive a refund depends on your
          full return, including credits that are claimed only at filing.
        </p>
      </section>

      <section className="seo-section">
        <p className="kicker">RELATED TEXAS CALCULATORS</p>
        <h2>Other Texas Paycheck Situations</h2>
        <p>
          Dependents are one input on your W-4. For regular pay across every input, use the{" "}
          <a className="text-link" href="/texas-paycheck-calculator">Texas paycheck calculator</a>, or pick a
          situation below.
        </p>
        <div className="tool-links">
          <a href="/texas-paycheck-calculator">
            <b>Texas Paycheck Calculator</b>
            <span>The full Texas take-home pay tool →</span>
          </a>
          <a href="/texas-paycheck-calculator-with-bonus">
            <b>Texas Paycheck Calculator With Bonus</b>
            <span>Flat 22% vs aggregate withholding →</span>
          </a>
          <a href="/texas-paycheck-calculator-with-child-support">
            <b>Texas Paycheck Calculator With Child Support</b>
            <span>Guideline support and the 50% limit →</span>
          </a>
          <a href="/hourly-paycheck-calculator">
            <b>Hourly Paycheck Calculator</b>
            <span>Hourly pay with overtime →</span>
          </a>
          <a href="/how-much-tax-is-taken-from-my-paycheck">
            <b>How Much Tax Is Taken From My Paycheck</b>
            <span>Every deduction explained →</span>
          </a>
          <a href="/paycheck-taxes">
            <b>Paycheck Taxes Explained</b>
            <span>Federal, FICA, and state basics →</span>
          </a>
        </div>
      </section>

      <section className="faq">
        <p className="kicker">COMMON QUESTIONS</p>
        <h2>Frequently Asked Questions</h2>
        {faqs.map(item => (
          <details key={item.q}>
            <summary>
              {item.q}
              <span>+</span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="seo-section text-left">
        <p className="kicker">CALCULATION SOURCES</p>
        <h2>Method and Sources</h2>
        <p>
          Dependent amounts come from the 2026 Form W-4 and its Step 3 instructions. Withholding is calculated
          with the percentage method in IRS Publication 15-T. Social Security and Medicare rates and the annual
          wage base come from the Social Security Administration. Texas levies no individual income tax on wages,
          per the Texas Comptroller of Public Accounts.
        </p>
        <ul className="checklist">
          <li>2026 Form W-4, Step 3</li>
          <li>IRS Publication 15-T withholding methods</li>
          <li>Social Security Administration wage base</li>
          <li>Texas Comptroller of Public Accounts</li>
        </ul>
        <p style={{ marginTop: 16 }}>
          Full assumptions are documented on our <a className="text-link" href="/methodology">methodology page</a>.
        </p>
        <div className="reviewer">
          <p><small>Reviewed by: Paycheck Calculator Editorial Team</small></p>
          <p><small>Last Updated: August 2026</small></p>
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">IMPORTANT INFORMATION</p>
        <h2>Disclaimer</h2>
        <p>
          This calculator produces estimates for informational purposes only. Eligibility for the child tax credit
          and the credit for other dependents depends on rules this page does not test, including residency,
          support, and relationship tests. For advice about your own situation, consult a qualified tax
          professional.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
