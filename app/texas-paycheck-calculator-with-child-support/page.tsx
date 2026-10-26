import type { Metadata } from "next";
import TexasChildSupportCalculator from "../components/TexasChildSupportCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { calculatePaycheck } from "../lib/payroll";
import {
  texasChildSupport,
  texasGuidelinePercent,
  TX_NET_RESOURCES_CAP_MONTHLY,
} from "../lib/paycheckExtras";

const SITE = "https://www.paycheckscalculator.org";
const CANONICAL = `${SITE}/texas-paycheck-calculator-with-child-support`;
const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "Texas Paycheck Calculator With Child Support 2026" }];
const LAST_MODIFIED = "2026-08-29";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const metadata: Metadata = {
  title: "Texas Paycheck Calculator With Child Support — 2026 Withholding",
  description:
    "Estimate your Texas paycheck after child support withholding. Applies the state guideline percentages, the $11,700 monthly net resources cap, and the 50% limit on disposable earnings.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Texas Paycheck Calculator With Child Support — 2026 Withholding",
    description:
      "See guideline child support, the amount withheld from each paycheck, and the take-home pay left over in Texas.",
    url: CANONICAL,
    type: "website",
    siteName: "Paycheck Calculator",
    images: OG_IMAGE,
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

// Worked examples rendered on the server: one child, bi-weekly pay, no add-ons.
const EXAMPLE_SALARIES = [45000, 60000, 75000, 100000, 175000];

const examples = EXAMPLE_SALARIES.map(salary => {
  const paycheck = calculatePaycheck({ grossAnnual: salary, frequency: "biweekly", status: "single", state: "TX" });
  const support = texasChildSupport({
    annualGross: salary,
    frequency: "biweekly",
    children: 1,
    disposableEarningsAnnual: Math.max(0, salary - paycheck.federal - paycheck.socialSecurity - paycheck.medicare),
  });
  return {
    salary,
    netResourcesMonthly: support.netResourcesMonthly,
    supportMonthly: support.supportMonthly,
    supportPerPaycheck: support.appliedPerPaycheck,
    takeHome: paycheck.netAnnual / support.periods - support.appliedPerPaycheck,
  };
});

const guidelineRows = [1, 2, 3, 4, 5].map(children => ({
  children,
  percent: texasGuidelinePercent(children),
  maxMonthly: TX_NET_RESOURCES_CAP_MONTHLY * texasGuidelinePercent(children),
}));

const faqs = [
  {
    q: "How much child support is taken out of a paycheck in Texas?",
    a: "Texas guideline support is a percentage of monthly net resources: 20% for one child, 25% for two, 30% for three, 35% for four, and 40% for five. The monthly amount is converted to your pay cycle, so on a bi-weekly schedule your employer withholds the monthly order multiplied by 12 and divided by 26.",
  },
  {
    q: "What counts as net resources in Texas?",
    a: "Net resources are all income from nearly every source minus a short statutory list of deductions: Social Security taxes, federal income tax figured for a single person claiming one personal exemption and the standard deduction, state income tax, union dues, and the cost of the child's health and dental insurance. Texas has no state income tax on wages, so that deduction is zero here.",
  },
  {
    q: "Is there a cap on Texas child support?",
    a: "Yes. For orders on or after September 1, 2025, the guideline percentages apply only to the first $11,700 of monthly net resources, up from $9,200. That puts guideline support for one child at a maximum of $2,340 per month. A court can order more than the guideline when the child has proven needs above that amount.",
  },
  {
    q: "Can child support take more than half my paycheck in Texas?",
    a: "No. Texas Family Code section 158.009 limits an income withholding order to 50% of your disposable earnings — what is left after deductions required by law. If guideline support is higher than that ceiling, your employer withholds the ceiling and the unpaid difference accrues as arrears.",
  },
  {
    q: "Does child support come out before or after taxes?",
    a: "After. Child support is withheld from earnings that remain once legally required deductions such as federal income tax, Social Security, and Medicare have been taken. It is not a pre-tax deduction and it does not lower your taxable income.",
  },
  {
    q: "Is child support taxable income in Texas?",
    a: "No. Child support is neither deductible by the parent who pays it nor taxable income to the parent who receives it. It does not appear as income or as a deduction on either federal return.",
  },
  {
    q: "What if I support children in more than one household?",
    a: "Texas uses a separate schedule of reduced percentages in section 154.129 when a parent has a duty to support children in more than one household. This calculator applies only the standard guideline schedule, so ask the Office of the Attorney General or an attorney for the multiple-household figure.",
  },
];

export default function TexasPaycheckCalculatorWithChildSupport() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Texas Paycheck Calculator With Child Support",
    url: CANONICAL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free Texas child support paycheck calculator for 2026. Estimates monthly net resources, guideline support, the amount withheld per paycheck, and the take-home pay left over.",
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
    name: "Texas Paycheck Calculator With Child Support",
    url: CANONICAL,
    dateModified: LAST_MODIFIED,
    about: "Texas child support income withholding and take-home pay",
    description:
      "Estimate Texas guideline child support, the amount withheld from each paycheck, and the remaining take-home pay.",
    isPartOf: { "@type": "WebPage", name: "Texas Paycheck Calculator", url: `${SITE}/texas-paycheck-calculator` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Texas Paycheck Calculator", item: `${SITE}/texas-paycheck-calculator` },
      { "@type": "ListItem", position: 3, name: "With Child Support", item: CANONICAL },
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
        <span>With Child Support</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">TEXAS · INCOME WITHHOLDING FOR SUPPORT</div>
        <h1>Texas Paycheck Calculator With Child Support: Take-Home Pay After Withholding</h1>
        <div className="hero-intro">
          <p>
            Enter your pay and the number of children on the order to estimate monthly net resources, guideline
            child support, the amount withheld from each paycheck, and what is left to take home.
          </p>
      </div>
        <TexasChildSupportCalculator />
        <div className="hero-more">
          <p>
            The estimate applies the Texas guideline percentages, the{" "}
            {fmt.format(TX_NET_RESOURCES_CAP_MONTHLY)} monthly cap on net resources, and the 50% limit on
            disposable earnings.
          </p>
        </div>
        <div className="trust-row">
          <span>✓ 2025 guideline cap</span>
          <span>✓ 50% withholding limit</span>
          <span>✓ No sign-up required</span>
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">HOW TEXAS CALCULATES SUPPORT</p>
        <h2>How Child Support Is Withheld From a Texas Paycheck</h2>
        <p className="seo-section-intro">
          Texas sets guideline child support as a percentage of the paying parent&apos;s monthly net resources,
          then collects it through an income withholding order sent to the employer. Four steps decide the
          amount that leaves your check.
        </p>

        <h3>1. Net resources, not gross pay</h3>
        <p>
          Under Texas Family Code section 154.062, net resources are all income minus a specific list of
          deductions: Social Security taxes, federal income tax figured for a single person claiming one personal
          exemption and the standard deduction, state income tax, union dues, and the cost of the child&apos;s
          health and dental insurance. Texas has no state income tax on wages, so that line is zero. Notice what
          is missing — 401(k) contributions and most benefit premiums do not reduce net resources even though
          they reduce your take-home pay.
        </p>

        <h3>2. The guideline percentage</h3>
        <p>
          The percentage depends on the number of children before the court, starting at 20% for one child and
          rising by five points per child through five children. For six or more, the order must be at least the
          amount for five.
        </p>

        <h3>3. The cap on net resources</h3>
        <p>
          Guideline percentages apply only to the first {fmt.format(TX_NET_RESOURCES_CAP_MONTHLY)} of monthly net
          resources for orders rendered on or after September 1, 2025, up from $9,200 previously. Income above
          the cap is not counted unless the court finds the child has proven needs beyond guideline support.
        </p>

        <h3>4. The 50% ceiling on withholding</h3>
        <p>
          Section 158.009 caps an income withholding order at 50% of disposable earnings — pay left after
          deductions required by law. If ordered support plus arrears exceeds that ceiling, your employer
          withholds the ceiling and the shortfall accrues as arrears.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">GUIDELINE SCHEDULE</p>
        <h2>Texas Child Support Percentages and Maximums</h2>
        <p className="seo-section-intro">
          Guideline percentages under Texas Family Code section 154.125, with the maximum monthly amount each one
          produces at the {fmt.format(TX_NET_RESOURCES_CAP_MONTHLY)} cap.
        </p>
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <caption style={{ captionSide: "bottom", paddingTop: 10, fontSize: 12, color: "#7b8b98", textAlign: "left" }}>
              Applies to orders rendered on or after September 1, 2025. Six or more children: not less than the
              amount for five children.
            </caption>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th scope="col" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>Children before the court</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Percentage of net resources</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Maximum monthly support</th>
              </tr>
            </thead>
            <tbody>
              {guidelineRows.map((row, index) => (
                <tr key={row.children} style={{ borderBottom: "1px solid #e0e7ef", background: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                  <th scope="row" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{row.children}</th>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{(row.percent * 100).toFixed(0)}%</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmt.format(row.maxMonthly)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">WORKED EXAMPLES</p>
        <h2>Texas Paycheck Examples With One Child</h2>
        <p className="seo-section-intro">
          One child, bi-weekly pay, single filer, no health insurance premium or union dues entered. Take-home
          pay is what remains after federal tax, FICA, and the support withholding.
        </p>
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <caption style={{ captionSide: "bottom", paddingTop: 10, fontSize: 12, color: "#7b8b98", textAlign: "left" }}>
              Net resources use the single-filer federal tax basis required by section 154.062(d).
            </caption>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th scope="col" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>Annual gross pay</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Monthly net resources</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Support / month</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Withheld / check</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Take-home / check</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((row, index) => (
                <tr key={row.salary} style={{ borderBottom: "1px solid #e0e7ef", background: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                  <th scope="row" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{fmt.format(row.salary)}</th>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(row.netResourcesMonthly)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(row.supportMonthly)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{cents.format(row.supportPerPaycheck)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{cents.format(row.takeHome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="calc-note" style={{ marginTop: 20 }}>
          Support is ordered as a monthly amount. On a bi-weekly schedule your employer converts it by
          multiplying by 12 and dividing by 26, so each check carries slightly less than half the monthly order
          and two months a year contain three checks.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">USING THE CALCULATOR</p>
        <h2>How to Use This Texas Child Support Calculator</h2>
        <ol style={{ color: "#667a8a", lineHeight: 1.9, fontSize: 14, paddingLeft: 20 }}>
          <li>Enter your annual gross pay, including overtime and bonuses you reliably receive.</li>
          <li>Select the number of children in this support order.</li>
          <li>Add the premium you pay for the child&apos;s health or dental coverage, and union dues if any.</li>
          <li>Choose your pay frequency so the monthly order converts to your pay cycle.</li>
          <li>Read the withheld amount, then check the 50% ceiling line to see whether the limit applies.</li>
        </ol>
        <p className="calc-note" style={{ marginTop: 16 }}>
          Your W-4 filing status changes your paycheck withholding but not your net resources. Section 154.062(d)
          requires the single-filer basis for the child support calculation regardless of how you actually file.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">WHAT THIS ESTIMATE ASSUMES</p>
        <h2>Limits of a Child Support Estimate</h2>
        <ul className="checklist">
          <li>Standard guideline schedule only</li>
          <li>No multiple-household percentages</li>
          <li>No arrears or interest added</li>
          <li>No medical or dental support add-ons ordered separately</li>
          <li>Wage income only, not self-employment</li>
          <li>Court-ordered deviations not modeled</li>
        </ul>
        <div className="seo-disclaimer" style={{ marginTop: 20 }}>
          This tool estimates guideline support. It is not legal advice, and it does not replace a court order.
          Only a court, or the Office of the Attorney General through an administrative process, determines what
          your employer must withhold. If your income, custody arrangement, or family situation has changed, speak
          with a family law attorney.
        </div>
      </section>

      <section className="seo-section">
        <p className="kicker">RELATED TEXAS CALCULATORS</p>
        <h2>Other Texas Paycheck Situations</h2>
        <p>
          To see the same paycheck without a support order, use the{" "}
          <a className="text-link" href="/texas-paycheck-calculator">Texas paycheck calculator</a>. The pages below
          cover the other common Texas paycheck situations.
        </p>
        <div className="tool-links">
          <a href="/texas-paycheck-calculator">
            <b>Texas Paycheck Calculator</b>
            <span>The full Texas take-home pay tool →</span>
          </a>
          <a href="/texas-paycheck-calculator-with-dependents">
            <b>Texas Paycheck Calculator With Dependents</b>
            <span>W-4 Step 3 credits and take-home pay →</span>
          </a>
          <a href="/texas-paycheck-calculator-with-bonus">
            <b>Bonus Tax Calculator Texas</b>
            <span>Flat 22% vs aggregate withholding →</span>
          </a>
          <a href="/hourly-paycheck-calculator">
            <b>Hourly Paycheck Calculator</b>
            <span>Hourly pay with overtime →</span>
          </a>
          <a href="/biweekly-paycheck-calculator">
            <b>Biweekly Paycheck Calculator</b>
            <span>One of 26 checks a year →</span>
          </a>
          <a href="/how-much-tax-is-taken-from-my-paycheck">
            <b>How Much Tax Is Taken From My Paycheck</b>
            <span>Every deduction explained →</span>
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
          Guideline percentages, the definition of net resources, and the cap come from the Texas Family Code.
          The withholding limit comes from section 158.009. Federal tax and FICA figures use IRS Publication 15-T
          and Social Security Administration rates. The Office of the Attorney General publishes annual tax charts
          that courts use for the statutory federal tax deduction, so an official calculation may differ slightly
          from the estimate shown here.
        </p>
        <ul className="checklist">
          <li>Texas Family Code section 154.062</li>
          <li>Texas Family Code section 154.125</li>
          <li>Texas Family Code section 158.009</li>
          <li>Office of the Attorney General child support</li>
          <li>IRS Publication 15-T withholding methods</li>
          <li>Social Security Administration wage base</li>
        </ul>
        <p style={{ marginTop: 16 }}>
          Full assumptions are documented on our <a className="text-link" href="/methodology">methodology page</a>.
        </p>
        <div className="reviewer">
          <p><small>Reviewed by: Paycheck Calculator Editorial Team</small></p>
          <p><small>Last Updated: August 2026</small></p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
