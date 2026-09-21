import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaycheckCalculator from "../../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import type { SupportedState } from "../../lib/payroll";
import { calculatePaycheck } from "../../lib/payroll";
import { locations, locationBySlug } from "../../lib/locations";

const SITE = "https://www.paycheckscalculator.org";
const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "Paycheck Calculator 2026" }];
const LAST_MODIFIED = "2026-08-07";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const SALARY_BRACKETS = [30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000];

export function generateStaticParams() {
  return locations.map(loc => ({ state: loc.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ state: string }> }
): Promise<Metadata> {
  const { state: slug } = await params;
  const loc = locationBySlug[slug];
  if (!loc) return {};
  const canonical = `${SITE}/biweekly/${loc.slug}`;
  const taxPhrase = loc.noTax ? "no state income tax" : `${loc.name} state income tax`;
  return {
    title: `${loc.name} Biweekly Paycheck Calculator 2026 — Take-Home Pay After Taxes`,
    description: `Calculate your ${loc.name} biweekly paycheck for 2026. See exact take-home pay at 9 salary levels after federal income tax, FICA, and ${taxPhrase}.`,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${loc.name} Biweekly Paycheck Calculator 2026`,
      description: `${loc.name} biweekly net pay at 9 salary levels — 2026 federal and state withholding.`,
      url: canonical,
      type: "website",
      siteName: "Paycheck Calculator",
      images: OG_IMAGE,
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default async function BiweeklyStateCalculatorPage(
  { params }: { params: Promise<{ state: string }> }
) {
  const { state: slug } = await params;
  const loc = locationBySlug[slug];
  if (!loc) notFound();

  const canonical = `${SITE}/biweekly/${loc.slug}`;
  const noTax = loc.noTax === true;

  // Pre-calculate biweekly net pay at each salary bracket for this state
  const bracketResults = SALARY_BRACKETS.map(salary => {
    const r = calculatePaycheck({
      grossAnnual: salary,
      frequency: "biweekly",
      status: "single",
      state: loc.short as SupportedState,
    });
    return {
      salary,
      grossBiweekly: Math.round(salary / 26),
      netAnnual: Math.round(r.netAnnual),
      netBiweekly: Math.round(r.netAnnual / 26),
      federal: Math.round(r.federal),
      stateTax: Math.round(r.stateIncomeTax + r.statePayrollPremiums),
      fica: Math.round(r.socialSecurity + r.medicare),
      effectiveRate: Math.round((1 - r.netAnnual / salary) * 1000) / 10,
    };
  });

  const faqs = buildFaqs(loc.name, loc.short, noTax, bracketResults);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${loc.name} Biweekly Paycheck Calculator`,
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: `Free ${loc.name} biweekly paycheck calculator for 2026. Estimate net pay after federal tax, FICA, and ${noTax ? "payroll deductions" : `${loc.name} state income tax`}.`,
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
    name: `${loc.name} Biweekly Paycheck Calculator 2026`,
    url: canonical,
    dateModified: LAST_MODIFIED,
    datePublished: "2026-08-07",
    about: `Biweekly paycheck take-home pay calculation for ${loc.name} employees in 2026.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Biweekly Paycheck Calculator", item: `${SITE}/biweekly-paycheck-calculator` },
      { "@type": "ListItem", position: 3, name: `${loc.name} Biweekly Calculator`, item: canonical },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">2026 {loc.short} BIWEEKLY PAYCHECK CALCULATOR</div>
        <h1>{loc.name} Biweekly Paycheck Calculator 2026</h1>
        <div className="hero-intro">
          <p>
            How much is your biweekly paycheck in {loc.name}? Use our free calculator to
            estimate your 2026 take-home pay after federal income tax, Social Security,
            Medicare, and {noTax ? "payroll deductions" : `${loc.name} state income tax`}.
          </p>
      </div>
        <PaycheckCalculator defaultState={loc.short as SupportedState} defaultFrequency="biweekly" navigateOnStateChange />
        <div className="hero-more">
          <p>
            A biweekly pay schedule means 26 paychecks per year.{" "}
            {noTax
              ? `${loc.name} has no state income tax on wages, so your biweekly deductions are limited to federal taxes and benefit elections.`
              : `${loc.name} withholds state income tax from each biweekly paycheck in addition to federal taxes.`}
          </p>
        </div>
        <div className="trust-row">
          <span>2026 IRS Method</span>
          <span>26 Pay Periods</span>
          <span>Free to Use</span>
        </div>
      </section>

      {/* Salary Bracket Table — real calculated numbers */}
      <article className="long-seo">
        <p className="kicker">{loc.short} BIWEEKLY NET PAY BY SALARY</p>
        <h2>{loc.name} Biweekly Paycheck After Tax — 9 Salary Levels (2026)</h2>
        <section>
          <p>
            Here is exactly what your biweekly paycheck looks like in {loc.name} at
            common annual salary levels in 2026. Calculated for a single filer, standard
            W-4, biweekly pay frequency, no pre-tax deductions.
          </p>
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>Annual Salary</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Gross/Biweekly</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Federal Tax</th>
                  {!noTax && <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>State Tax</th>}
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>FICA</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600, color: "#16a34a" }}>Net/Biweekly</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Eff. Rate</th>
                </tr>
              </thead>
              <tbody>
                {bracketResults.map((row, i) => (
                  <tr key={row.salary} style={{ borderBottom: "1px solid #e0e7ef", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 500 }}>{fmt.format(row.salary)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(row.grossBiweekly)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", color: "#667a8a" }}>{fmt.format(Math.round(row.federal / 26))}</td>
                    {!noTax && <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", color: "#667a8a" }}>{fmt.format(Math.round(row.stateTax / 26))}</td>}
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", color: "#667a8a" }}>{fmt.format(Math.round(row.fica / 26))}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "#16a34a" }}>{fmt.format(row.netBiweekly)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{row.effectiveRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 13, marginTop: 12 }}>
            Single filer · standard W-4 · biweekly pay (26 periods/yr) · no pre-tax deductions ·
            2026 IRS withholding tables{noTax ? "" : ` · ${loc.name} published 2026 withholding method`}.
            Actual paychecks vary based on filing status, allowances, and deductions.
          </p>
        </section>
      </article>

      {/* State Tax Info */}
      <article className="long-seo">
        <p className="kicker">{loc.short} TAX INFORMATION</p>
        <h2>{noTax ? `Does ${loc.name} Have State Income Tax?` : `How Does ${loc.name} Tax Your Biweekly Paycheck?`}</h2>
        <section>
          {noTax ? (
            <>
              <p>
                <strong>{loc.name} does not impose a state income tax on wages.</strong>{" "}
                Your biweekly paycheck in {loc.name} is only subject to federal payroll taxes:
              </p>
              <ul className="checklist">
                <li>Federal income tax (2026 IRS withholding tables)</li>
                <li>Social Security tax — 6.2% on wages up to $184,500</li>
                <li>Medicare tax — 1.45% on all wages</li>
                <li>Employee benefit deductions (health, retirement, FSA)</li>
              </ul>
              <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14, marginTop: 16 }}>
                With no state income tax, {loc.name} employees keep more of each biweekly paycheck
                compared to states like California, New York, or Minnesota. Federal taxes still apply.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>{loc.name} withholds state income tax from every paycheck.</strong>{" "}
                Your biweekly paycheck includes these deductions:
              </p>
              <ul className="checklist">
                <li>Federal income tax (2026 IRS withholding tables)</li>
                <li>{loc.name} state income tax (withheld each pay period)</li>
                <li>Social Security tax — 6.2% on wages up to $184,500</li>
                <li>Medicare tax — 1.45% on all wages</li>
                <li>Employee benefit deductions</li>
              </ul>
            </>
          )}
        </section>
      </article>

      {/* How Biweekly Works */}
      <article className="long-seo">
        <p className="kicker">BIWEEKLY PAY BASICS</p>
        <h2>How Biweekly Pay Works in {loc.name}</h2>
        <section>
          <p>
            A biweekly pay schedule means you receive a paycheck every two weeks — 26
            paychecks per year. To find your gross biweekly pay, divide your annual salary
            by 26:
          </p>
          <div className="note">
            <strong>Annual Salary ÷ 26 = Gross Biweekly Pay</strong>
          </div>
          <p style={{ marginTop: 16 }}>
            Two months per year you will receive three biweekly paychecks instead of two.
            This is sometimes called a "three-paycheck month." Because benefit deductions
            are often fixed per paycheck, the extra check can feel larger than usual.
          </p>
          <p>
            Your net biweekly paycheck in {loc.name} depends on your annual salary, W-4
            filing status, {noTax ? "" : `${loc.name} state withholding elections, `}retirement
            contributions, health insurance deductions, and any additional withholding.
          </p>
        </section>
      </article>

      {/* Methodology */}
      <article className="long-seo methodology-section">
        <p className="kicker">CALCULATION METHOD</p>
        <h2>How We Calculate Your {loc.name} Biweekly Paycheck</h2>
        <section>
          <p><strong>1.</strong> Annualize wages: Gross biweekly pay × 26 pay periods.</p>
          <p><strong>2.</strong> Apply pre-tax deductions to reduce taxable income.</p>
          <p><strong>3.</strong> Estimate federal income tax using the 2026 IRS annualized withholding method.</p>
          <p>
            <strong>4.</strong>{" "}
            {noTax
              ? `${loc.name} has no state income tax — no state withholding is applied.`
              : `Calculate ${loc.name} state income tax using published 2026 withholding tables.`}
          </p>
          <p><strong>5.</strong> Calculate Social Security (6.2%) and Medicare (1.45%) taxes.</p>
          <p><strong>6.</strong> Divide the annual net pay estimate by 26 to get biweekly take-home.</p>
        </section>
        <div className="reviewer-info">
          <div className="reviewer-label">Last Updated:</div>
          <div>August 2026</div>
        </div>
      </article>

      {/* FAQ */}
      <section className="seo-section faq-section">
        <h2>{loc.name} Biweekly Paycheck FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i} open={i === 0}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      {/* Related Links */}
      <article className="long-seo">
        <p className="kicker">RELATED CALCULATORS</p>
        <h2>More {loc.name} Paycheck Calculators</h2>
        <section>
          <div className="tool-links">
            <a href={`/${loc.slug}`}>
              <b>{loc.name} Paycheck Calculator</b>
              <span>All pay frequencies →</span>
            </a>
            <a href="/biweekly-paycheck-calculator">
              <b>Biweekly Paycheck Calculator</b>
              <span>26 paychecks per year →</span>
            </a>
            <a href="/hourly-paycheck-calculator">
              <b>Hourly Paycheck Calculator</b>
              <span>Calculate from hourly rate →</span>
            </a>
            <a href="/how-much-tax-is-taken-from-my-paycheck">
              <b>Paycheck Tax Guide</b>
              <span>Understand every deduction →</span>
            </a>
          </div>
        </section>
      </article>

      {/* Disclaimer */}
      <div className="seo-disclaimer" style={{ maxWidth: 920, margin: "0 auto 40px" }}>
        <p>
          <strong>Disclaimer:</strong> This {loc.name} biweekly paycheck calculator provides
          estimates for informational purposes only. Actual paycheck amounts may vary based on
          employer payroll systems, tax withholding elections, benefits, and individual
          circumstances. For specific tax advice, consult a qualified tax professional.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}

function buildFaqs(
  name: string,
  code: string,
  noTax: boolean,
  brackets: { salary: number; netBiweekly: number; effectiveRate: number }[]
): { q: string; a: string }[] {
  const mid = brackets[2]; // $50k bracket
  const high = brackets[5]; // $100k bracket
  return [
    {
      q: `How much is a biweekly paycheck in ${name} on a $${mid.salary.toLocaleString()} salary?`,
      a: `On a $${mid.salary.toLocaleString()} annual salary, your biweekly gross pay is ${fmt.format(Math.round(mid.salary / 26))}. After federal income tax, ${noTax ? "FICA taxes, and benefit deductions" : `${name} state income tax, and FICA taxes`}, your estimated biweekly take-home pay is ${fmt.format(mid.netBiweekly)} — an effective total tax rate of ${mid.effectiveRate}%. Actual amounts vary by filing status and deductions.`,
    },
    {
      q: `How much is a biweekly paycheck in ${name} on a $${high.salary.toLocaleString()} salary?`,
      a: `On a $${high.salary.toLocaleString()} annual salary in ${name}, your gross biweekly pay is ${fmt.format(Math.round(high.salary / 26))}. Estimated take-home after all taxes is ${fmt.format(high.netBiweekly)} per biweekly paycheck (${high.effectiveRate}% effective tax rate).`,
    },
    {
      q: `Does ${name} have state income tax on biweekly paychecks?`,
      a: noTax
        ? `No. ${name} does not impose a state income tax on wages. Your biweekly paycheck is only reduced by federal income tax, Social Security (6.2%), and Medicare (1.45%), plus any employee benefit deductions.`
        : `Yes. ${name} withholds state income tax from every biweekly paycheck. The amount depends on your income level, filing status, and state withholding form elections. Federal income tax and FICA taxes are also withheld each pay period.`,
    },
    {
      q: `How many biweekly paychecks are there in 2026?`,
      a: `There are 26 biweekly paychecks in 2026. Two months in 2026 will have three pay Fridays instead of two, sometimes called "three-paycheck months." The three-paycheck months depend on your employer's specific pay schedule and payroll start date.`,
    },
    {
      q: `What taxes are taken from a biweekly paycheck in ${name}?`,
      a: noTax
        ? `A biweekly paycheck in ${name} is subject to federal income tax withholding, Social Security tax (6.2% on wages up to $184,500 in 2026), Medicare tax (1.45%), and any voluntary employee deductions such as retirement contributions or health insurance premiums. ${name} does not have a state income tax on wages.`
        : `A biweekly paycheck in ${name} is subject to federal income tax withholding, ${name} state income tax withholding, Social Security tax (6.2% on wages up to $184,500 in 2026), Medicare tax (1.45%), and any employee benefit deductions. State income tax amounts vary based on your ${name} withholding form elections and income level.`,
    },
  ];
}
