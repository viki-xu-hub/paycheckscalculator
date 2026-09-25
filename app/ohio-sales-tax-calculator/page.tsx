import type { Metadata } from "next";
import SalesTaxCalculator from "../components/SalesTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { ohioRateSummary, ohioSalesTax, pct } from "../lib/salesTax";

const YEAR = "2026";
const CANONICAL = "https://www.paycheckscalculator.org/ohio-sales-tax-calculator";
const TITLE = `Ohio Sales Tax Calculator ${YEAR} — All 88 County Rates`;
const DESCRIPTION = `Ohio sales tax calculator with all 88 county rates for ${YEAR}. Pick a county to load its rate, then add or remove sales tax on any amount.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/ohio-sales-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "website" },
};

export default function OhioSalesTaxCalculatorPage() {
  const s = ohioRateSummary();
  const options = [
    ...ohioSalesTax.counties.map(c => ({ name: `${c.name} County`, rate: c.rate })),
    ...ohioSalesTax.transitAreas.map(t => ({ name: t.name, rate: t.rate })),
  ];
  const cuyahoga = ohioSalesTax.counties.find(c => c.name === "Cuyahoga");
  const franklin = ohioSalesTax.counties.find(c => c.name === "Franklin");
  const hamilton = ohioSalesTax.counties.find(c => c.name === "Hamilton");

  const faqs = [
    {
      q: "What is the sales tax rate in Ohio?",
      a: `Ohio's state sales and use tax rate is ${pct(ohioSalesTax.stateBase)}. Every county adds its own permissive tax on top, so combined rates run from ${pct(s.min)} to ${pct(s.max)}. The most common combined rate is ${pct(s.mostCommon)}, charged in ${s.mostCommonCount} of Ohio's ${s.countyCount} counties.`,
    },
    {
      q: "How do I calculate Ohio sales tax?",
      a: `Find the combined rate for the county where the buyer takes delivery, multiply the pre-tax price by that rate, and add it to the price. To strip tax out of a total instead, divide the total by 1 plus the rate. Select a county in the calculator above and it fills the rate in for you.`,
    },
    {
      q: "Which Ohio county has the highest sales tax?",
      a: `The highest combined county rate in Ohio is ${pct(s.max)}${cuyahoga && cuyahoga.rate === s.max ? ", charged in Cuyahoga County" : ""}. The lowest is ${pct(s.min)}. Certain transit authority areas — parts of Columbus, Dublin, Westerville, Reynoldsburg and Rossford that sit in a neighbouring county — carry their own rates, listed separately below.`,
    },
    {
      q: "How much is sales tax on $100 in Ohio?",
      a: `It depends on the county. At the most common Ohio rate of ${pct(s.mostCommon)}, sales tax on $100 is $${s.mostCommon.toFixed(2)}, for a total of $${(100 + s.mostCommon).toFixed(2)}. At the lowest county rate of ${pct(s.min)} it is $${s.min.toFixed(2)}, and at the highest, ${pct(s.max)}, it is $${s.max.toFixed(2)}.`,
    },
    {
      q: "Is food taxed in Ohio?",
      a: "Food sold for consumption off the premises is generally exempt from Ohio sales tax, and prescription drugs are exempt. Food and drink consumed on the premises — restaurant meals, for example — are taxable, as are most soft drinks and alcoholic beverages.",
    },
    {
      q: "Which county rate applies to an online order shipped to Ohio?",
      a: "Ohio sources most retail sales to the delivery address, so an order shipped into Ohio is taxed at the combined rate for the destination county rather than the seller's location. Where a seller does not collect the tax, the buyer generally owes the matching use tax.",
    },
    {
      q: "Do Ohio sales tax rates change?",
      a: `Yes. County permissive taxes change on a quarterly cycle. The rates on this page come from the ${ohioSalesTax.agency} table effective ${ohioSalesTax.effective}; Warren County's rate rose to ${pct(7.25)} on that date.`,
    },
  ];

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ohio Sales Tax Calculator",
    url: CANONICAL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: DESCRIPTION,
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
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.paycheckscalculator.org" },
      { "@type": "ListItem", position: 2, name: "Sales Tax", item: "https://www.paycheckscalculator.org/sales-tax" },
      { "@type": "ListItem", position: 3, name: "Ohio Sales Tax Calculator", item: CANONICAL },
    ],
  };

  const half = Math.ceil(ohioSalesTax.counties.length / 2);
  const columns = [ohioSalesTax.counties.slice(0, half), ohioSalesTax.counties.slice(half)];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">{YEAR} OHIO SALES TAX CALCULATOR</div>
        <h1>Ohio Sales Tax Calculator <em>{YEAR}</em></h1>
        <div className="hero-intro">
          <p>
            This Ohio sales tax calculator covers all {s.countyCount} counties. Ohio charges a {pct(ohioSalesTax.stateBase)} state
            sales and use tax and every county adds a permissive tax on top, so combined rates run from {pct(s.min)} to{" "}
            {pct(s.max)}. Pick your county below and the rate fills in automatically.
          </p>
        </div>
        <SalesTaxCalculator
          defaultRate={s.mostCommon}
          placeLabel="Ohio"
          options={options}
          optionLabel="County"
        />
        <div className="hero-more">
          <p>
            The calculator works both ways: enter a price to add Ohio sales tax, or switch it round to pull the tax out
            of a total you have already paid. Every county rate comes from the {ohioSalesTax.agencyShort} rate table
            effective {ohioSalesTax.effective}.
          </p>
        </div>
        <div className="trust-row">
          <span>All {s.countyCount} counties</span>
          <span>Effective {ohioSalesTax.effective}</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">OHIO RATE STRUCTURE</p>
        <h2>How Ohio Sales Tax Is Made Up</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src="/images/sales-tax/ohio.svg"
              alt={`Ohio sales tax calculator chart: ${pct(ohioSalesTax.stateBase)} Ohio state rate plus a county permissive tax, with combined rates from ${pct(s.min)} to ${pct(s.max)} across all ${s.countyCount} counties`}
              width={880}
              height={360}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Ohio sales tax rates by county: the state base, the county piece, and how many counties sit at each combined rate.
            </figcaption>
          </figure>
          <p>
            Unlike California or Texas, Ohio keeps it simple: one state rate, plus one county permissive rate. There are
            no separate city sales taxes, so the county a delivery lands in decides the rate.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Component</th><th>Rate</th></tr></thead>
              <tbody>
                <tr><td>Ohio state sales and use tax</td><td>{pct(ohioSalesTax.stateBase)}</td></tr>
                <tr><td>County permissive tax (varies)</td><td>{pct(Math.round((s.min - ohioSalesTax.stateBase) * 1000) / 1000)} – {pct(Math.round((s.max - ohioSalesTax.stateBase) * 1000) / 1000)}</td></tr>
                <tr className="rate-total"><td><strong>Combined rate range</strong></td><td><strong>{pct(s.min)} – {pct(s.max)}</strong></td></tr>
              </tbody>
            </table>
          </div>
          <ul className="checklist">
            <li>{pct(s.mostCommon)} is the most common combined rate, used in {s.mostCommonCount} of {s.countyCount} counties</li>
            {cuyahoga && <li>Cuyahoga County (Cleveland) is {pct(cuyahoga.rate)}</li>}
            {franklin && <li>Franklin County (Columbus) is {pct(franklin.rate)}</li>}
            {hamilton && <li>Hamilton County (Cincinnati) is {pct(hamilton.rate)}</li>}
            <li>Ohio has no city-level sales tax, so the county rate is the whole local piece</li>
            <li>Five transit authority areas straddle county lines and carry their own rates</li>
          </ul>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">ALL {s.countyCount} COUNTIES</p>
        <h2>Ohio Sales Tax Calculator: Rate by County</h2>
        <section>
          <p>
            Every Ohio county with its combined state plus county rate, effective {ohioSalesTax.effective}, as published
            by the {ohioSalesTax.agencyShort}.
          </p>
          <div className="table-wrap table-split">
            {columns.map((column, i) => (
              <table key={i}>
                <thead><tr><th>County</th><th>Rate</th></tr></thead>
                <tbody>
                  {column.map(c => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td>{pct(c.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </section>
        <section>
          <h3>Transit authority areas</h3>
          <p>
            These areas sit inside one county but belong to a transit authority based in another, so they carry a
            different rate from the rest of their county.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Transit area</th><th>Rate</th></tr></thead>
              <tbody>
                {ohioSalesTax.transitAreas.map(t => (
                  <tr key={t.name}>
                    <td>{t.name}</td>
                    <td>{pct(t.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT IS TAXED</p>
        <h2>What Ohio Sales Tax Applies To</h2>
        <section>
          <p>
            Ohio taxes retail sales of tangible personal property and a specifically enumerated list of services. The
            exemptions are set at state level and apply the same way in every county.
          </p>
          <ul className="checklist">
            <li>Food sold for consumption off the premises is generally exempt</li>
            <li>Prescription drugs are exempt</li>
            <li>Restaurant meals and food consumed on the premises are taxable</li>
            <li>Soft drinks and alcoholic beverages are taxable</li>
            <li>Services are taxable only where Ohio law specifically lists them</li>
          </ul>
          <p style={{ marginTop: 20, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            Sales tax is separate from the Ohio income tax withheld from wages. For take-home pay, use the{" "}
            <a className="text-link" href="/ohio-paycheck-calculator">Ohio paycheck calculator</a>.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Ohio Sales Tax FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}<span>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <article className="long-seo">
        <p className="kicker">MORE SALES TAX RATES</p>
        <h3>Sales tax calculators for other places</h3>
        <section>
          <div className="tool-links">
            <a href="/sales-tax"><b>All Sales Tax Calculators</b><span>Browse every rate we publish →</span></a>
            <a href="/sales-tax/los-angeles-ca"><b>Los Angeles Sales Tax</b><span>City and county rate →</span></a>
            <a href="/sales-tax/austin-tx"><b>Austin Sales Tax</b><span>Texas 8.25% cap explained →</span></a>
            <a href="/ohio-paycheck-calculator"><b>Ohio Paycheck Calculator</b><span>Take-home pay after tax →</span></a>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">RATE SOURCES</p>
        <h2>Where These Ohio Rates Come From</h2>
        <section>
          <p>
            County rates are taken from the {ohioSalesTax.agency} publication{" "}
            <a className="text-link" href={ohioSalesTax.agencyUrl} target="_blank" rel="noopener noreferrer">
              {ohioSalesTax.table}
            </a>
            . County permissive taxes change quarterly, so confirm the current figure with the department before filing.
          </p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Rate table effective: {ohioSalesTax.effective}</small></p>
        </div>
      </article>

      <div className="seo-disclaimer" style={{ maxWidth: 920, margin: "0 auto 40px" }}>
        <p>
          <strong>Disclaimer:</strong> This Ohio sales tax calculator provides estimates for informational purposes only.
          Rates change quarterly and some transactions are taxed under separate rules. Confirm the current rate with the{" "}
          {ohioSalesTax.agency} before filing a return or relying on a figure for a transaction.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
