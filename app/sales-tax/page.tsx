import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import SalesTaxCalculator from "../components/SalesTaxCalculator";
import { ohioRateSummary, ohioSalesTax, pct, salesTaxLocations } from "../lib/salesTax";

const YEAR = "2026";
const TITLE = `Sales Tax Calculator ${YEAR} — City and County Rates`;
const DESCRIPTION = `Free sales tax calculator with published ${YEAR} rates for Los Angeles, San Jose, Orange County, Sacramento, San Francisco, Anaheim, Costa Mesa, Austin and all 88 Ohio counties.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sales-tax" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.paycheckscalculator.org/sales-tax",
    type: "website",
  },
};

export default function SalesTaxHub() {
  const ohio = ohioRateSummary();
  const sorted = [...salesTaxLocations].sort((a, b) => b.rate - a.rate);
  const pickerOptions = sorted.map(l => ({ name: `${l.name}, ${l.stateAbbr}`, rate: l.rate }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.paycheckscalculator.org" },
      { "@type": "ListItem", position: 2, name: "Sales Tax", item: "https://www.paycheckscalculator.org/sales-tax" },
    ],
  };
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sales Tax Calculator",
    url: "https://www.paycheckscalculator.org/sales-tax",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: DESCRIPTION,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">{YEAR} SALES TAX CALCULATOR</div>
        <h1>Sales Tax <em>Calculator</em></h1>
        <div className="hero-intro">
          <p>
            Work out the sales tax on any purchase, or pull the tax back out of a receipt total. Pick a city below to
            load its published rate, or type a rate of your own.
          </p>
        </div>
        <SalesTaxCalculator
          defaultRate={sorted[0].rate}
          defaultAmount={250}
          placeLabel={`${sorted[0].name}, ${sorted[0].stateAbbr}`}
          options={pickerOptions}
          optionLabel="City or county"
        />
        <div className="trust-row">
          <span>Official agency rate tables</span>
          <span>Add or remove tax</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">RATES WE PUBLISH</p>
        <h2>Sales Tax Rates by City and County</h2>
        <section>
          <p>
            Each page below carries the rate from the taxing agency&apos;s own table, the breakdown between the state
            base and local district taxes, and a calculator pre-filled with that rate.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Location</th><th>State</th><th>Sales tax rate</th></tr>
              </thead>
              <tbody>
                {sorted.map(l => (
                  <tr key={l.slug}>
                    <td><a className="text-link" href={`/sales-tax/${l.slug}`}>{l.name}</a></td>
                    <td>{l.state}</td>
                    <td>{pct(l.rate)}</td>
                  </tr>
                ))}
                <tr>
                  <td><a className="text-link" href="/ohio-sales-tax-calculator">Ohio — all {ohio.countyCount} counties</a></td>
                  <td>Ohio</td>
                  <td>{pct(ohio.min)} – {pct(ohio.max)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How Sales Tax Is Calculated</h2>
        <section>
          <p>
            A combined sales tax rate is a state base rate plus whatever local and district taxes apply at the delivery
            address. In California the statewide base is {pct(7.25)} and districts add on top of it; in Texas the state
            rate is {pct(6.25)} with local taxes capped at {pct(2)}; in Ohio the state rate is{" "}
            {pct(ohioSalesTax.stateBase)} and each county adds its own.
          </p>
          <ul className="checklist">
            <li>To add tax: multiply the pre-tax price by the rate, then add the result to the price</li>
            <li>To remove tax: divide the tax-inclusive total by 1 plus the rate</li>
            <li>The rate follows the delivery address, not the billing address or the seller&apos;s location</li>
            <li>District taxes change quarterly, so a rate from last year may no longer be correct</li>
            <li>Groceries and prescription drugs are exempt in most states, with prepared food usually taxable</li>
          </ul>
          <p style={{ marginTop: 20, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            Sales tax is separate from the payroll taxes that come out of a paycheck. If you are trying to work out
            take-home pay instead, use the <a className="text-link" href="/">paycheck calculator</a>.
          </p>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
