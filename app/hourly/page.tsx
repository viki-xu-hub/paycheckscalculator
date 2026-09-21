import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import PaycheckCalculator from "../components/PaycheckCalculator";
import { calculatePaycheck } from "../lib/payroll";
import type { HourlyData } from "../lib/seo/types";
import hourlyRaw from "../data/hourly-rates.json";

const SITE = "https://www.paycheckscalculator.org";
const CANONICAL = `${SITE}/hourly`;

export const metadata: Metadata = {
  title: "Hourly Paycheck Calculator 2026 – Take-Home Pay by Rate",
  description: "Free hourly paycheck calculator for 2026. Enter your hourly rate, hours and overtime to see take-home pay after federal tax, FICA and state withholding.",
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Hourly Paycheck Calculator 2026",
    description: "Turn an hourly wage into take-home pay after 2026 federal, FICA and state withholding.",
    url: CANONICAL,
    type: "website",
  },
};

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const hourlyRates = hourlyRaw as HourlyData[];

// Worked examples come from the same engine the calculator uses, so the copy never drifts from the tool.
const EXAMPLES = [15, 20, 25, 35].map(rate => {
  const r = calculatePaycheck({ grossAnnual: rate * 40 * 52, frequency: "biweekly", status: "single", state: "TX" });
  return { rate, grossPerCheck: rate * 80, netPerCheck: r.netAnnual / 26, netHourly: r.netAnnual / 2080, annual: r.grossAnnual };
});

const FAQS = [
  {
    q: "How does an hourly paycheck calculator work?",
    a: "An hourly paycheck calculator multiplies your hourly rate by the hours you work in a pay period (overtime hours at 1.5×), then subtracts federal income tax withholding, Social Security (6.2%), Medicare (1.45%), state income tax and any pre-tax deductions you enter. The remainder is your estimated take-home pay per paycheck.",
  },
  {
    q: "How much is $20 an hour after taxes?",
    a: `At 40 hours a week, $20 an hour is $41,600 a year. For a single filer in a state with no income tax, this hourly paycheck calculator estimates about ${money.format(EXAMPLES[1].netPerCheck)} per biweekly paycheck after federal tax and FICA — roughly ${money.format(EXAMPLES[1].netHourly)} an hour take-home. States with income tax reduce that further.`,
  },
  {
    q: "Does the hourly paycheck calculator include overtime?",
    a: "Yes. Enter regular hours and overtime hours separately; overtime is paid at time-and-a-half before taxes are calculated, which is why a few overtime hours can push part of a paycheck into a higher withholding bracket.",
  },
  {
    q: "Which pay frequencies can I choose?",
    a: "Weekly (52 checks), biweekly (26), semimonthly (24) and monthly (12). The hourly paycheck calculator annualizes your wages, applies the 2026 IRS percentage method and the state formula, then divides the result by the number of paychecks.",
  },
  {
    q: "Is the hourly paycheck calculator accurate for my state?",
    a: "It applies the published 2026 withholding method for all 50 states plus Washington DC and New York City. Local taxes are included only where you enter a rate, and employer-specific items such as garnishments or benefit premiums are not inferred, so treat the result as a close planning estimate rather than a payroll record.",
  },
];

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Hourly Paycheck Calculator 2026",
  url: CANONICAL,
  description: metadata.description,
  about: "Take-home pay estimation from hourly wages after 2026 federal, FICA and state withholding.",
};
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hourly Paycheck Calculator",
  url: CANONICAL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Free 2026 hourly paycheck calculator: hourly rate, hours and overtime in, take-home pay after federal, FICA and state taxes out.",
};
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const listSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Hourly paycheck calculator pages by hourly rate",
  itemListElement: hourlyRates.map((h, i) => ({ "@type": "ListItem", position: i + 1, name: `$${h.rate} an hour is how much a year?`, url: `${SITE}/hourly/${h.slug}` })),
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Paycheck Calculator", item: SITE },
    { "@type": "ListItem", position: 2, name: "Hourly Paycheck Calculator", item: CANONICAL },
  ],
};

export default function HourlyHubPage() {
  return (
    <main>
      {[webPageSchema, softwareSchema, faqSchema, listSchema, breadcrumbSchema].map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SiteHeader />

      <section className="hero">
        <h1>Hourly Paycheck Calculator <em>2026</em></h1>
        <div className="hero-intro">
          <p>Use this free hourly paycheck calculator to turn your hourly rate, hours and overtime into take-home pay after 2026 federal tax, Social Security, Medicare and state withholding.</p>
        </div>
        <PaycheckCalculator hourly defaultState="TX" />
        <div className="hero-more">
          <p>Results update as you type. Pick any of the 52 state and city engines, switch between weekly, biweekly, semimonthly and monthly pay, and add 401(k) or other pre-tax deductions to match your own pay stub.</p>
        </div>
        <div className="trust-row"><span>✓ 2026 IRS percentage method</span><span>✓ 50 states + DC</span><span>✓ Overtime at 1.5×</span></div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOURLY PAY 2026</p>
        <h2>Hourly Paycheck Calculator by Hourly Rate</h2>
        <section>
          <p>Prefer a ready-made answer? Every rate below links to its own hourly paycheck calculator page with annual gross pay at 40 hours a week, biweekly and weekly net pay, effective hourly take-home, and a side-by-side comparison across all 52 supported locations.</p>
          <div className="location-grid" style={{ marginTop: 20 }}>
            {hourlyRates.map(h => (
              <a key={h.slug} href={`/hourly/${h.slug}`}>
                <b>${h.rate} an hour is how much a year?</b>
                <span>{fmt.format(h.annualAt40h)} a year gross (40 hrs/wk) →</span>
              </a>
            ))}
          </div>
        </section>

        <h2>How the Hourly Paycheck Calculator Works</h2>
        <section>
          <p>An hourly paycheck calculator has to answer two questions: how much you earned in the pay period, and how much of it is withheld. This calculator starts with <strong>hourly rate × regular hours</strong>, adds overtime hours at time-and-a-half, and multiplies by the weeks you work to get annual gross wages.</p>
          <p>From that annual figure it subtracts your 401(k) percentage and other pre-tax deductions to reach taxable wages, applies the 2026 IRS percentage method for federal income tax, adds Social Security (6.2% up to the wage base) and Medicare (1.45%), and runs the state withholding formula for the location you selected. The annual result is divided by the number of paychecks in your pay frequency.</p>
          <figure className="bracket-figure">
            <img src="/images/hourly-paycheck-calculator-flow.svg" alt="Hourly paycheck calculator flow: $25 an hour × 80 biweekly hours = $2,000 gross, minus federal tax, Social Security, Medicare and state tax, leaves about $1,691 take-home" width="880" height="300" loading="lazy" decoding="async" />
            <figcaption>How the hourly paycheck calculator moves from gross wages to take-home pay. Example: $25/hour, 40 hours, biweekly, single filer, Texas.</figcaption>
          </figure>
          <p>Because every step uses published 2026 tables, the estimate tracks a real pay stub closely. The gaps that remain are the items no calculator can infer — local taxes you did not enter, benefit premiums, garnishments and year-to-date wage history.</p>
        </section>

        <h2>Hourly Paycheck Calculator Examples</h2>
        <section>
          <p>These examples use the same engine as the hourly paycheck calculator above: 40 regular hours, no overtime, biweekly pay, single filer, no pre-tax deductions, in a state with no income tax. Your state can lower each net figure by a few percent.</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Hourly rate</th><th>Annual gross</th><th>Biweekly gross</th><th>Biweekly take-home</th><th>Take-home per hour</th></tr></thead>
              <tbody>
                {EXAMPLES.map(e => (
                  <tr key={e.rate}><td>${e.rate}/hour</td><td>{fmt.format(e.annual)}</td><td>{money.format(e.grossPerCheck)}</td><td><strong>{money.format(e.netPerCheck)}</strong></td><td>{money.format(e.netHourly)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Notice that take-home per hour rises more slowly than the wage: federal withholding is progressive, so each extra dollar of hourly pay is taxed at a slightly higher marginal rate while FICA stays a flat 7.65%.</p>
        </section>

        <h2>Hourly Pay Versus Salary in the Calculator</h2>
        <section>
          <p>Hourly workers face two variables a salaried employee does not: hours can change week to week, and overtime is paid at 1.5× the base rate. The hourly paycheck calculator keeps both as separate inputs so you can test a light week, a normal week and a week with ten overtime hours without re-doing the math.</p>
          <p>If you are comparing a salaried offer, the <a className="text-link" href="/salary">salary after-tax calculator</a> runs the same withholding engine from an annual figure, and each <a className="text-link" href="/state-paycheck-calculators">state paycheck calculator</a> explains the local rules behind the state line of your estimate.</p>
        </section>

        <h2>Hourly Paycheck Calculator FAQ</h2>
        <section>
          {FAQS.map(f => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </section>

        <section>
          <h3>Tax Information Sources</h3>
          <p>Federal withholding follows IRS Publication 15-T (2026). Social Security and Medicare rates come from the Social Security Administration. State formulas are taken from each revenue department&apos;s 2026 employer withholding publication; see the <a className="text-link" href="/methodology">methodology page</a> for the full list.</p>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
