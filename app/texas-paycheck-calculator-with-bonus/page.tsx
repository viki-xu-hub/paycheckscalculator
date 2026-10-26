import type { Metadata } from "next";
import TexasBonusCalculator from "../components/TexasBonusCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { bonusAggregateMethod, bonusFlatMethod, SUPPLEMENTAL_FLAT_RATE } from "../lib/paycheckExtras";

const SITE = "https://www.paycheckscalculator.org";
const CANONICAL = `${SITE}/texas-paycheck-calculator-with-bonus`;
const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "Bonus Tax Calculator Texas 2026" }];
const LAST_MODIFIED = "2026-09-25";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const metadata: Metadata = {
  title: "Bonus Tax Calculator Texas: 2026 Take-Home Pay",
  description:
    "Free bonus tax calculator Texas workers can use for 2026: compare the flat 22% supplemental rate with the aggregate method and see your bonus take-home pay.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Bonus Tax Calculator Texas: 2026 Take-Home Pay",
    description:
      "Estimate bonus tax and take-home pay in Texas under both federal supplemental withholding methods, with FICA included and no state income tax.",
    url: CANONICAL,
    type: "website",
    siteName: "Paycheck Calculator",
    images: OG_IMAGE,
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

// Worked examples rendered on the server: $75,000 salary, single filer, bi-weekly pay.
const EXAMPLE_SALARY = 75000;
const EXAMPLE_BONUSES = [1000, 2500, 5000, 10000, 25000];

const examples = EXAMPLE_BONUSES.map(bonus => {
  const flat = bonusFlatMethod({ bonus, regularAnnualWages: EXAMPLE_SALARY });
  const aggregate = bonusAggregateMethod({
    bonus,
    regularAnnualWages: EXAMPLE_SALARY,
    frequency: "biweekly",
    status: "single",
  });
  return { bonus, flat, aggregate };
});

const faqs = [
  {
    q: "How much of a bonus do you take home in Texas?",
    a: "Texas has no state income tax on wages, so a bonus is reduced only by federal income tax withholding, Social Security, and Medicare. When the bonus is paid as a separate check, the usual withholding is 22% federal plus 7.65% FICA, leaving roughly 70% of the bonus. A $5,000 bonus at that rate leaves about $3,518.",
  },
  {
    q: "What is the bonus tax rate in Texas for 2026?",
    a: "There is no Texas bonus tax rate, because Texas levies no individual income tax on wages. The rate you feel is federal: 22% withheld on supplemental wages up to $1 million, 37% on the excess above that, plus 6.2% Social Security and 1.45% Medicare. That is about 29.65% withheld in total on a typical separate bonus check.",
  },
  {
    q: "Is a bonus taxed at a higher rate in Texas?",
    a: "No. A bonus is taxed at the same rates as the rest of your income when you file your return. It can be withheld differently: employers may use a flat 22% supplemental rate or add the bonus to a regular paycheck and use the standard withholding tables, which often withholds more up front.",
  },
  {
    q: "Why was so much tax withheld from my bonus?",
    a: "Under the aggregate method, payroll treats the combined paycheck as if you earned that amount every pay period. A one-time bonus makes the annualized figure look much larger than your real salary, so withholding lands in a higher bracket. The excess comes back as a refund or a smaller balance due at filing.",
  },
  {
    q: "Does Texas take state tax out of a bonus?",
    a: "No. Texas does not levy an individual income tax on wages, so no state income tax is withheld from a Texas bonus. Federal income tax, Social Security, and Medicare still apply.",
  },
  {
    q: "What happens to bonuses over $1 million?",
    a: "Federal rules require 37% withholding on supplemental wages above $1 million in a calendar year. The first $1 million can still be withheld at the 22% flat rate.",
  },
  {
    q: "Do 401(k) contributions come out of a bonus?",
    a: "That depends on your employer's plan. Some plans apply your regular deferral percentage to bonuses, some use a separate bonus election, and some exclude bonuses entirely. Check your plan rules, because a deferral reduces the federal income tax withheld from the bonus but not Social Security or Medicare.",
  },
];

export default function TexasPaycheckCalculatorWithBonus() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bonus Tax Calculator Texas",
    url: CANONICAL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free bonus tax calculator for Texas, 2026. Compare the 22% flat supplemental withholding method with the aggregate method and see bonus take-home pay after federal tax and FICA.",
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
    name: "Bonus Tax Calculator Texas",
    url: CANONICAL,
    dateModified: LAST_MODIFIED,
    about: "Bonus tax and supplemental wage withholding for Texas employees",
    description:
      "Estimate the bonus tax withheld and the take-home value of a bonus in Texas under both federal supplemental withholding methods.",
    isPartOf: { "@type": "WebPage", name: "Texas Paycheck Calculator", url: `${SITE}/texas-paycheck-calculator` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Texas Paycheck Calculator", item: `${SITE}/texas-paycheck-calculator` },
      { "@type": "ListItem", position: 3, name: "Bonus Tax Calculator", item: CANONICAL },
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
        <span>Bonus Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">TEXAS · BONUS TAX · SUPPLEMENTAL WAGE WITHHOLDING</div>
        <h1>Bonus Tax Calculator Texas: What You Keep After Withholding</h1>
        <div className="hero-intro">
          <p>
            This bonus tax calculator Texas workers can use shows the bonus tax withheld and the take-home pay
            left from a bonus, under both federal withholding methods. Texas charges no state income tax on a
            bonus.
          </p>
        </div>
        <TexasBonusCalculator />
        <div className="hero-more">
          <p>
            Switch between the two methods employers use — a separate bonus check withheld at a flat{" "}
            {(SUPPLEMENTAL_FLAT_RATE * 100).toFixed(0)}%, or a bonus folded into a regular paycheck and withheld
            at your annualized rate.
          </p>
        </div>
        <div className="trust-row">
          <span>✓ 2026 IRS supplemental rules</span>
          <span>✓ Both withholding methods</span>
          <span>✓ No sign-up required</span>
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">HOW BONUS TAX WORKS</p>
        <h2>How Bonus Tax Is Withheld on a Texas Paycheck</h2>
        <p className="seo-section-intro">
          A bonus is a supplemental wage. It is ordinary income taxed at your normal rates when you file, but
          federal rules let employers withhold on it in two different ways, and the method your payroll team
          picks changes the size of the check you receive.
        </p>

        <figure className="bracket-figure">
          <img
            src="/images/bonus-tax-calculator-texas-flow.svg"
            alt="Bonus tax calculator Texas flow: a $5,000 bonus on a $75,000 salary loses $1,100 federal tax at 22%, $310 Social Security and $72.50 Medicare, pays $0 Texas state income tax, and leaves $3,517.50 take-home"
            width="880"
            height="320"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            How the bonus tax calculator Texas employees need moves a bonus from gross to take-home pay. Example:
            $5,000 bonus, $75,000 salary, single filer, separate bonus check.
          </figcaption>
        </figure>

        <h3>The flat 22% method — a separate bonus check</h3>
        <p>
          When a bonus is paid on its own check and identified separately from regular wages, the employer may
          withhold a flat 22% for federal income tax. Social Security (6.2% up to the annual wage base) and
          Medicare (1.45%, plus 0.9% on wages above $200,000) still come out. Above $1 million of supplemental
          wages in a calendar year, the rate on the excess is 37%.
        </p>

        <h3>The aggregate method — bonus added to a paycheck</h3>
        <p>
          When the bonus is folded into a regular paycheck, payroll annualizes the combined amount using the
          standard withholding tables, calculates the tax on that annualized figure, and subtracts what would
          have been withheld on the salary alone. Because a one-time bonus is treated as if it repeated every
          pay period, this method usually withholds more than 22% — sometimes far more.
        </p>

        <h3>What Texas changes about bonus tax</h3>
        <p>
          Texas has no individual income tax on wages, so there is no state supplemental rate to apply and no
          state line on the bonus stub. A Texas bonus keeps more than the same bonus paid in a state that
          withholds state income tax on supplemental wages, which is why the only bonus tax to plan for here is
          federal.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">WORKED EXAMPLES</p>
        <h2>Bonus Tax Calculator Texas: 2026 Worked Examples</h2>
        <p className="seo-section-intro">
          Bonus take-home pay on a {fmt.format(EXAMPLE_SALARY)} salary, single filer, bi-weekly pay, no bonus
          deferral. The last column shows how much more the aggregate method holds back up front.
        </p>

        <figure className="bracket-figure">
          <img
            src="/images/bonus-tax-calculator-texas-methods.svg"
            alt="Texas bonus tax withheld by method: the flat 22% method withholds 29.7% of every bonus, while the aggregate method withholds 29.7% on $1,000, 30.9% on $5,000, 35.6% on $10,000 and 40.1% on $25,000"
            width="880"
            height="340"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            The flat rate is flat; the aggregate rate climbs with the size of the bonus. Same salary, same filer,
            only the withholding method changes.
          </figcaption>
        </figure>

        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <caption style={{ captionSide: "bottom", paddingTop: 10, fontSize: 12, color: "#7b8b98", textAlign: "left" }}>
              Estimates use 2026 federal withholding, a 22% flat supplemental rate, and 7.65% FICA.
            </caption>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th scope="col" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>Bonus</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Take-home (flat 22%)</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Take-home (aggregate)</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Aggregate withholding</th>
                <th scope="col" style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Difference</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((row, index) => (
                <tr key={row.bonus} style={{ borderBottom: "1px solid #e0e7ef", background: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                  <th scope="row" style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{fmt.format(row.bonus)}</th>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(row.flat.net)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(row.aggregate.net)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", color: "#667a8a" }}>{row.aggregate.effectiveRate.toFixed(1)}%</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                    {fmt.format(row.flat.net - row.aggregate.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="calc-note" style={{ marginTop: 20 }}>
          <strong>Reading the difference:</strong> a larger gap does not mean a larger tax bill. It means more of
          your money is held by the IRS until you file. If the aggregate method over-withholds, that money comes
          back as a refund.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">USING THE CALCULATOR</p>
        <h2>How to Use This Texas Bonus Tax Calculator</h2>
        <ol style={{ color: "#667a8a", lineHeight: 1.9, fontSize: 14, paddingLeft: 20 }}>
          <li>Enter your annual gross salary and the bonus amount you expect.</li>
          <li>Pick your pay frequency — it decides how the aggregate method annualizes the combined check.</li>
          <li>Choose how the bonus is paid: a separate check (flat 22%) or added to a paycheck (aggregate).</li>
          <li>Set your federal filing status and any 401(k) or pre-tax deductions.</li>
          <li>
            Read the bonus take-home figure, then compare both methods in the bottom panel to see which one your
            employer used.
          </li>
        </ol>
        <p className="calc-note" style={{ marginTop: 16 }}>
          Not sure which method your employer used? Divide the federal tax withheld on the bonus line of your pay
          stub by the gross bonus. A result near 22% points to the flat method; a noticeably higher result points
          to the aggregate method.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">WHAT THE ESTIMATE ASSUMES</p>
        <h2>What This Texas Bonus Tax Estimate Assumes</h2>
        <ul className="checklist">
          <li>Salary is assumed paid evenly across the year</li>
          <li>Social Security stops at the annual wage base</li>
          <li>Bonus 401(k) deferrals are not assumed</li>
          <li>No W-4 Step 2 multiple-job adjustment</li>
          <li>Commission plans may be withheld differently</li>
          <li>Employer rounding is not modeled</li>
        </ul>
        <p style={{ marginTop: 16, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
          If your bonus is paid late in the year and you have already passed the Social Security wage base, the
          Social Security line on your bonus will be smaller than this estimate shows. Enter your full salary so
          the bonus tax calculator Texas payroll teams would recognize accounts for wages already taxed.
        </p>
      </section>

      <section className="seo-section">
        <p className="kicker">RELATED TEXAS CALCULATORS</p>
        <h2>More Texas Paycheck and Bonus Tax Calculators</h2>
        <p>
          This page covers bonus tax. Start from the{" "}
          <a className="text-link" href="/texas-paycheck-calculator">main Texas paycheck calculator</a> for regular
          pay, or use one of the situation calculators below.
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
          <a href="/texas-paycheck-calculator-with-child-support">
            <b>Texas Paycheck Calculator With Child Support</b>
            <span>Guideline support and the 50% limit →</span>
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
        <h2>Texas Bonus Tax Questions</h2>
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
        <h2>Sources Behind This Texas Bonus Tax Calculator</h2>
        <p>
          Federal supplemental wage rules come from IRS Publication 15 (Circular E), section 7. Regular
          withholding uses the percentage method in IRS Publication 15-T. Social Security and Medicare rates and
          the annual wage base come from the Social Security Administration. The absence of a Texas individual
          income tax on wages is confirmed by the Texas Comptroller of Public Accounts.
        </p>
        <ul className="checklist">
          <li>IRS Publication 15, supplemental wages</li>
          <li>IRS Publication 15-T withholding methods</li>
          <li>Social Security Administration wage base</li>
          <li>Texas Comptroller of Public Accounts</li>
        </ul>
        <p style={{ marginTop: 16 }}>
          Full assumptions are documented on our <a className="text-link" href="/methodology">methodology page</a>.
        </p>
        <div className="reviewer">
          <p><small>Reviewed by: Paycheck Calculator Editorial Team</small></p>
          <p><small>Last Updated: September 2026</small></p>
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">IMPORTANT INFORMATION</p>
        <h2>Disclaimer for This Texas Bonus Tax Estimate</h2>
        <p>
          This calculator produces estimates for informational purposes only. Your employer&apos;s payroll system,
          benefit elections, W-4 entries, and year-to-date wages all affect the actual amount withheld from a
          bonus. For advice about your own tax situation, consult a qualified tax professional.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
