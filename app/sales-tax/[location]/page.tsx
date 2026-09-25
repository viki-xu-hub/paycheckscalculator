import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SalesTaxCalculator from "../../components/SalesTaxCalculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import {
  pct,
  salesTaxBySlug,
  salesTaxLocations,
  salesTaxUrl,
} from "../../lib/salesTax";
import editorialRaw from "../../data/sales-tax-editorial.json";

const YEAR = "2026";

// Per-location copy, written individually for each city so sibling pages do not share
// templated prose. See app/data/sales-tax-editorial.json.
type Editorial = {
  intro: string;
  heroMore: string;
  sections: { h2: string; paragraphs: string[] }[];
  nearbyIntro: string;
  exemptionsIntro: string;
  exemptions: string[];
  metaDescription: string;
  sourceNote: string;
  disclaimer: string;
  rateHelp: string;
  faqs: { q: string; a: string }[];
};
const editorial = (editorialRaw as { locations: Record<string, Editorial> }).locations;

export function generateStaticParams() {
  return salesTaxLocations.map(l => ({ location: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params;
  const p = salesTaxBySlug[location];
  const ed = editorial[location];
  if (!p) return {};
  const title = `${p.name} Sales Tax ${YEAR} — ${pct(p.rate)} Rate & Calculator`;
  // Hand-written per location, kept in the 120-160 character range.
  const description = ed?.metaDescription
    ?? `${p.name}, ${p.stateAbbr} sales tax is ${pct(p.rate)} as of ${p.effective}.`;
  return {
    title,
    description,
    alternates: { canonical: `/sales-tax/${p.slug}` },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: salesTaxUrl(p.slug), type: "website" },
  };
}

export default async function SalesTaxLocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const p = salesTaxBySlug[location];
  if (!p) notFound();
  const ed = editorial[location];

  const canonical = salesTaxUrl(p.slug);
  const faqs = ed?.faqs ?? [];

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${p.name} Sales Tax Calculator`,
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: `Work out the ${pct(p.rate)} sales tax on any purchase in ${p.name}, ${p.stateAbbr}, or back the tax out of a total.`,
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
      { "@type": "ListItem", position: 3, name: `${p.name} Sales Tax`, item: canonical },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">{YEAR} {p.name.toUpperCase()} SALES TAX</div>
        <h1>{p.name} Sales Tax <em>{YEAR}</em></h1>
        <div className="hero-intro">
          <p>{ed?.intro}</p>
        </div>
        <SalesTaxCalculator
          defaultRate={p.rate}
          placeLabel={`${p.name}, ${p.stateAbbr}`}
          components={p.components}
          rateHelp={ed?.rateHelp}
        />
        <div className="hero-more">
          <p>{ed?.heroMore}</p>
        </div>
        <div className="trust-row">
          <span>{p.src.agencyShort} rates</span>
          <span>Effective {p.effective}</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">RATE BREAKDOWN</p>
        <h2>{p.name} Sales Tax Rate, Broken Down</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src={`/images/sales-tax/${p.slug}.svg`}
              alt={`${p.name} sales tax rate breakdown for ${YEAR}: ${pct(p.stateBase)} ${p.state} statewide base plus ${pct(p.district)} local tax, giving a combined ${pct(p.rate)}`}
              width={880}
              height={360}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              How the {pct(p.rate)} rate is built, and how it compares with the rates around it.
            </figcaption>
          </figure>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Component</th><th>Rate</th></tr>
              </thead>
              <tbody>
                {p.components ? (
                  p.components.map(c => (
                    <tr key={c.label}><td>{c.label}</td><td>{pct(c.rate)}</td></tr>
                  ))
                ) : (
                  <>
                    <tr><td>{p.state} statewide base rate</td><td>{pct(p.stateBase)}</td></tr>
                    <tr><td>District taxes in {p.name}</td><td>{pct(p.district)}</td></tr>
                  </>
                )}
                <tr className="rate-total">
                  <td><strong>Total {p.name} sales tax</strong></td>
                  <td><strong>{pct(p.rate)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      {ed?.sections.map(s => (
        <article className="long-seo" key={s.h2}>
          <p className="kicker">{p.stateAbbr} SALES TAX</p>
          <h2>{s.h2}</h2>
          <section>
            {s.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
          </section>
        </article>
      ))}

      {p.cities && p.cities.length > 0 && (
        <article className="long-seo">
          <p className="kicker">CITY BY CITY</p>
          <h2>{p.name} Sales Tax by City</h2>
          <section>
            <div className="table-wrap">
              <table>
                <thead><tr><th>City</th><th>Sales tax rate</th></tr></thead>
                <tbody>
                  {p.cities.map(c => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td>{pct(c.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </article>
      )}

      {p.nearby.length > 0 && ed?.nearbyIntro && (
        <article className="long-seo">
          <p className="kicker">NEARBY RATES</p>
          <h2>How {p.name} Compares Nearby</h2>
          <section>
            <p>{ed.nearbyIntro}</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>City</th><th>Sales tax rate</th><th>vs {p.name}</th></tr></thead>
                <tbody>
                  <tr className="rate-total">
                    <td><strong>{p.name}</strong></td>
                    <td><strong>{pct(p.rate)}</strong></td>
                    <td>—</td>
                  </tr>
                  {p.nearby.map(c => {
                    const diff = Math.round((c.rate - p.rate) * 1000) / 1000;
                    return (
                      <tr key={c.name}>
                        <td>{c.name}</td>
                        <td>{pct(c.rate)}</td>
                        <td>{diff === 0 ? "same" : diff > 0 ? `+${pct(diff)}` : `−${pct(Math.abs(diff))}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </article>
      )}

      {ed && (
        <article className="long-seo">
          <p className="kicker">TAXABLE OR NOT</p>
          <h2>What {p.name} Sales Tax Applies To</h2>
          <section>
            <p>{ed.exemptionsIntro}</p>
            <ul className="checklist">
              {ed.exemptions.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </article>
      )}

      {faqs.length > 0 && (
        <div className="faq">
          <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
          <h2>{p.name} Sales Tax Questions</h2>
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}<span>+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      )}

      <article className="long-seo">
        <p className="kicker">RATE SOURCE</p>
        <h2>Where These Rates Come From</h2>
        <section>
          <p>
            {ed?.sourceNote}{" "}
            <a className="text-link" href={p.src.agencyUrl} target="_blank" rel="noopener noreferrer">
              {p.src.table}
            </a>
            , effective {p.effective}.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> {ed?.disclaimer}
          </p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Rate table effective: {p.effective}</small></p>
        </div>
      </article>

      <article className="long-seo">
        <p className="kicker">OTHER RATES</p>
        <h3>Sales tax rates elsewhere</h3>
        <section>
          <div className="tool-links">
            {/* Rotate the subset per page so sibling pages do not share an identical link block. */}
            {(() => {
              const others = salesTaxLocations.filter(other => other.slug !== p.slug);
              const start = salesTaxLocations.findIndex(l => l.slug === p.slug);
              return [...others.slice(start), ...others.slice(0, start)].slice(0, 5);
            })()
              .map(other => (
                <a key={other.slug} href={`/sales-tax/${other.slug}`}>
                  <b>{other.name}</b>
                  <span>{pct(other.rate)} →</span>
                </a>
              ))}
            <a href="/ohio-sales-tax-calculator"><b>Ohio</b><span>All 88 county rates →</span></a>
            <a href="/sales-tax"><b>All rates</b><span>Every city we publish →</span></a>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}

