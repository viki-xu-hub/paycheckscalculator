import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaycheckCalculator from "../../../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../../../components/SiteChrome";
import editorialRaw from "../../../data/biweekly-pay-state-editorial.json";
import type { SupportedState } from "../../../lib/payroll";
import {
  BIWEEKLY_STATE_PAGES,
  BIWEEKLY_UPDATED,
  BIWEEKLY_UPDATED_LABEL,
  SOURCES,
  biweeklyStateDescription,
  biweeklyStateFacts,
  biweeklyStateImages,
  biweeklyStatePageBy,
  biweeklyStateTitle,
  cents,
  dollars,
  fillTokens,
  payPeriodRows,
} from "../../../lib/biweeklyPay";

// One amount in one location. These are a small pilot: see BIWEEKLY_STATE_PAGES before adding more.

const SITE = "https://www.paycheckscalculator.org";
const PUBLISHED = "2026-11-05";

type Editorial = {
  hook: string;
  sections: { h2: string; p: string[] }[];
  faqs: { q: string; a: string }[];
  notes: { perCheck: string; compare: string; incomeLabel: string; programLabel: string };
  links?: { href: string; label: string }[];
};
const editorial = editorialRaw as Record<string, Editorial | undefined>;

const pct1 = (n: number) => `${(n * 100).toFixed(1)}%`;
const signed = (n: number) => (n === 0 ? "—" : `${n > 0 ? "+" : "−"}${dollars(Math.abs(n))}`);

export const dynamicParams = false;

export function generateStaticParams() {
  return BIWEEKLY_STATE_PAGES.map(sp => ({ slug: sp.page.slug, state: sp.stateSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; state: string }> }): Promise<Metadata> {
  const { slug, state } = await params;
  const sp = biweeklyStatePageBy(slug, state);
  const copy = sp && editorial[sp.key];
  if (!sp || !copy) return {};
  const facts = biweeklyStateFacts(sp);
  const title = biweeklyStateTitle(sp, facts.net);
  const description = biweeklyStateDescription(sp, copy.hook);
  const image = biweeklyStateImages(sp).cover;
  const alt = `${sp.page.lower} in ${sp.loc.name}: ${dollars(facts.f.single.gross)} biweekly before taxes and ${dollars(facts.net)} after taxes`;
  return {
    title,
    description,
    alternates: { canonical: `/biweekly-pay/${sp.key}` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE}/biweekly-pay/${sp.key}`,
      type: "article",
      siteName: "Paycheck Calculator",
      images: [{ url: image, width: 1200, height: 630, alt }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function BiweeklyStatePayPage({ params }: { params: Promise<{ slug: string; state: string }> }) {
  const { slug, state } = await params;
  const sp = biweeklyStatePageBy(slug, state);
  const copy = sp && editorial[sp.key];
  if (!sp || !copy) notFound();

  const { page, loc } = sp;
  const facts = biweeklyStateFacts(sp);
  const { f, single, married, head, net } = facts;
  const images = biweeklyStateImages(sp);
  const fill = (text: string) => fillTokens(text, page, f);
  const canonical = `${SITE}/biweekly-pay/${sp.key}`;
  const isHourly = page.kind === "hourly";
  const gross = dollars(f.single.gross);
  const title = biweeklyStateTitle(sp, net);
  const description = biweeklyStateDescription(sp, copy.hook);
  const h1 = `${page.label} Is How Much Biweekly After Taxes in ${loc.name}?`;
  const coverAlt = `${page.lower} in ${loc.name}: ${gross} biweekly before taxes and ${dollars(net)} after taxes, compared with ${dollars(f.noTaxNet)} in Texas`;
  const periods = payPeriodRows(page, single.netAnnual);
  const netPer = (perYear: number) => periods.find(row => row.perYear === perYear)?.net ?? 0;
  const faqs = copy.faqs.map(item => ({ q: fill(item.q), a: fill(item.a) }));
  const crumbName = `${page.label} in ${loc.name}`;
  const code = loc.short as SupportedState;
  const twoCheckRent = Math.round((facts.rent / facts.twoCheck) * 100);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: h1,
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      url: canonical,
      description,
      datePublished: PUBLISHED,
      dateModified: BIWEEKLY_UPDATED,
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}${images.cover}`, width: 1200, height: 630, caption: coverAlt },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Biweekly Pay Chart", item: `${SITE}/biweekly-pay` },
        { "@type": "ListItem", position: 3, name: `${page.label} Biweekly`, item: `${SITE}/biweekly-pay/${page.slug}` },
        { "@type": "ListItem", position: 4, name: crumbName, item: canonical },
      ],
    },
  ];

  return (
    <main className="bw-page">
      {schemas.map(schema => (
        <script key={schema["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href="/biweekly-pay">Biweekly Pay Chart</a>
        <span aria-hidden="true">›</span>
        <a href={`/biweekly-pay/${page.slug}`}>{page.label} Biweekly</a>
        <span aria-hidden="true">›</span>
        <span>{loc.name}</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">BIWEEKLY PAY · {loc.name.toUpperCase()} · 2026</div>
        <h1>{h1}</h1>
        <p className="bw-answer">
          <strong>{page.lower} is how much biweekly in {loc.name}?</strong> {gross} before taxes and about <strong>{dollars(net)}</strong> after
          taxes for a single filer. That is {dollars(facts.vsTexas)} a check less than Texas, and it ranks {facts.rank} of the {f.states.length}{" "}
          locations we calculate, where 1 keeps the most.
        </p>
        <p className="bw-updated">Updated {BIWEEKLY_UPDATED_LABEL} · 2026 IRS and {loc.name} withholding tables</p>
        <figure className="bw-cover">
          <img src={images.cover} alt={coverAlt} width={1200} height={630} fetchPriority="high" decoding="async" />
        </figure>
        {isHourly ? (
          <PaycheckCalculator hourly defaultState={code} defaultHourlyRate={page.rate} defaultOvertime={0} defaultRetirement={0} defaultPreTax={0} headingSuffix={` at ${page.lower} in ${loc.name}`} />
        ) : (
          <PaycheckCalculator defaultState={code} defaultSalary={page.annual} defaultRetirement={0} defaultPreTax={0} headingSuffix={` on ${page.lower} in ${loc.name}`} />
        )}
        <div className="hero-more">
          <p>Figures assume a single filer, standard W-4 and no pre-tax deductions. Change any field to match your pay stub.</p>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">PER CHECK</p>
        <h2>{page.label} Is How Much Biweekly in {loc.name}? Where the {gross} Goes</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src={images.split}
              alt={`Where a ${gross} biweekly check goes on ${page.lower} in ${loc.name}: ${dollars(net)} take-home, with the rest going to federal, Social Security, Medicare and state tax`}
              width={960}
              height={350}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <p>{fill(copy.notes.perCheck)}</p>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>Per biweekly check</th>
                  <th>Single</th>
                  <th>Married filing jointly</th>
                  <th>Head of household</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Gross pay</td><td>{cents(single.gross)}</td><td>{cents(married.gross)}</td><td>{cents(head.gross)}</td></tr>
                <tr><td>Federal income tax</td><td>−{cents(single.federal)}</td><td>−{cents(married.federal)}</td><td>−{cents(head.federal)}</td></tr>
                <tr><td>Social Security (6.2%)</td><td>−{cents(single.socialSecurity)}</td><td>−{cents(married.socialSecurity)}</td><td>−{cents(head.socialSecurity)}</td></tr>
                <tr><td>Medicare (1.45%)</td><td>−{cents(single.medicare)}</td><td>−{cents(married.medicare)}</td><td>−{cents(head.medicare)}</td></tr>
                <tr><td>{copy.notes.incomeLabel}</td><td>−{cents(single.stateIncome)}</td><td>−{cents(married.stateIncome)}</td><td>−{cents(head.stateIncome)}</td></tr>
                <tr><td>{copy.notes.programLabel}</td><td>−{cents(single.premiums)}</td><td>−{cents(married.premiums)}</td><td>−{cents(head.premiums)}</td></tr>
                <tr className="total"><td>Take-home</td><td>{cents(single.net)}</td><td>{cents(married.net)}</td><td>{cents(head.net)}</td></tr>
                <tr>
                  <td>Effective tax rate</td>
                  <td>{pct1(1 - single.net / single.gross)}</td>
                  <td>{pct1(1 - married.net / married.gross)}</td>
                  <td>{pct1(1 - head.net / head.gross)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="bw-note">Standard W-4 with Step 2 unchecked, no pre-tax deductions, 2026 withholding tables.</p>
        </section>
      </article>

      {copy.sections.map(section => (
        <article className="long-seo" key={section.h2}>
          <h2>{fill(section.h2)}</h2>
          <section>
            {section.p.map(paragraph => (
              <p key={paragraph.slice(0, 40)}>{fill(paragraph)}</p>
            ))}
          </section>
        </article>
      ))}

      <article className="long-seo">
        <p className="kicker">EVERY PAY PERIOD</p>
        <h2>{page.label} in {loc.name}: Per Month, Week, Day and Hour</h2>
        <section>
          <p>
            After taxes that is about {dollars(netPer(12))} a month on average, {dollars(netPer(52))} a week and {cents(netPer(2080))} an hour. An
            ordinary two-check month deposits {dollars(facts.twoCheck)}. Housing at 30% of gross pay would be {dollars(facts.rent)} a month, or{" "}
            {twoCheckRent}% of that deposit, and 30% of the deposit itself is {dollars(facts.rentNet)}.
          </p>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>Per</th>
                  <th>Before taxes</th>
                  <th>After taxes</th>
                </tr>
              </thead>
              <tbody>
                {periods.map(row => (
                  <tr key={row.perYear} className={row.perYear === 26 ? "total" : undefined}>
                    <td>{row.label}</td>
                    <td>{row.perYear === 2080 ? cents(row.gross) : dollars(row.gross)}</td>
                    <td>{row.perYear === 2080 ? cents(row.net) : dollars(row.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bw-note">
            Annual take-home divided by the period, based on 2,080 paid hours a year. Housing line: <a href={SOURCES.hud.href} rel="noopener">{SOURCES.hud.label}</a>.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARE</p>
        <h2>{page.label} in {loc.name} Against Nearby Places</h2>
        <section>
          <p>{fill(copy.notes.compare)}</p>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>State and local tax per check</th>
                  <th>Take-home per check</th>
                  <th>Against {loc.name}</th>
                </tr>
              </thead>
              <tbody>
                {facts.places.map(row => (
                  <tr key={row.slug} className={row.current ? "total" : undefined}>
                    <td><a href={`/biweekly/${row.slug}`}>{row.name}</a></td>
                    <td>{dollars(row.tax)}</td>
                    <td>{dollars(row.net)}</td>
                    <td>{signed(row.diff)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bw-note">
            Single filer. Assumes you live and work in the same place. Every location: <a href={`/biweekly-pay/${page.slug}`}>{page.lower} biweekly in all 52</a>.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">NEARBY PAY</p>
        <h2>Nearby {isHourly ? "Wages" : "Salaries"} in {loc.name}</h2>
        <section>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>{isHourly ? "Hourly wage" : "Annual salary"}</th>
                  <th>Before taxes per check</th>
                  <th>Take-home per check</th>
                  <th>Difference per check</th>
                </tr>
              </thead>
              <tbody>
                {facts.nearby.map(row => (
                  <tr key={row.page.slug} className={row.current ? "total" : undefined}>
                    <td>{row.current ? row.page.lower : <a href={row.href}>{row.page.lower}</a>}</td>
                    <td>{dollars(row.gross)}</td>
                    <td>{dollars(row.net)}</td>
                    <td>{signed(row.diff)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bw-note">Single filer, {loc.name}, no pre-tax deductions. Linked pages show each amount nationally.</p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>{page.label} in {loc.name}: Common Questions</h2>
        <section>
          {faqs.map(item => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">KEEP GOING</p>
        <h2>More on {page.label} in {loc.name}</h2>
        <section>
          <ul className="bw-links">
            <li><a href={`/biweekly-pay/${page.slug}`}>{page.label} is how much biweekly in every state</a></li>
            <li><a href={`/biweekly/${loc.slug}`}>{loc.name} biweekly paycheck calculator</a></li>
            <li><a href={`/${loc.slug}`}>{loc.name} paycheck calculator</a></li>
            {copy.links?.map(link => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
            <li><a href="/biweekly-pay">Biweekly pay chart and 2026–27 pay dates</a></li>
          </ul>
          <p className="bw-note">
            Updated {BIWEEKLY_UPDATED_LABEL}. Sources: <a href={SOURCES.irs.href} rel="noopener">{SOURCES.irs.label}</a> and the state tables listed in{" "}
            <a href="/methodology">how we calculate paychecks</a>.
          </p>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
