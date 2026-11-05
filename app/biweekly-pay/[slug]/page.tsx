import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaycheckCalculator from "../../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import editorialRaw from "../../data/biweekly-pay-editorial.json";
import {
  BIWEEKLY_PAGES,
  biweeklyDescription,
  biweeklyFacts,
  biweeklyImages,
  biweeklyPageBySlug,
  biweeklyTitle,
  cents,
  dollars,
  fillTokens,
  nearbyPay,
  payPeriodRows,
  rankedStates,
} from "../../lib/biweeklyPay";

const SITE = "https://www.paycheckscalculator.org";
const PUBLISHED = "2026-11-04";
const IRS_PUB_15T = "https://www.irs.gov/publications/p15t";
const IRS_LIMITS = "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500";

type Editorial = {
  hook: string;
  sections: { h2: string; p: string[] }[];
  faqs: { q: string; a: string }[];
  /** Hand-written lead-ins for the data modules, so no two pages share their prose. */
  notes: { perCheck: string; bracket: string; month: string[]; state: string; hours?: string };
  links?: { href: string; label: string }[];
};
const editorial = editorialRaw as Record<string, Editorial | undefined>;

const pct = (n: number) => `${Math.round(n * 100)}%`;
const pct1 = (n: number) => `${(n * 100).toFixed(1)}%`;
const pct2 = (n: number) => `${(n * 100).toFixed(2)}%`;
const signed = (n: number) => (n === 0 ? "—" : `${n > 0 ? "+" : "−"}${dollars(Math.abs(n))}`);

export const dynamicParams = false;

export function generateStaticParams() {
  return BIWEEKLY_PAGES.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = biweeklyPageBySlug(slug);
  const copy = editorial[slug];
  if (!page || !copy) return {};
  const facts = biweeklyFacts(page);
  const title = biweeklyTitle(page, facts);
  const description = biweeklyDescription(page, facts, copy.hook);
  const image = biweeklyImages(slug).cover;
  const alt = `${page.lower} is how much biweekly: ${dollars(facts.single.gross)} before taxes, ${dollars(facts.noTaxNet)} after taxes in Texas and ${dollars(facts.lowest.net)} in ${facts.lowest.name}`;
  return {
    title,
    description,
    alternates: { canonical: `/biweekly-pay/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE}/biweekly-pay/${slug}`,
      type: "article",
      siteName: "Paycheck Calculator",
      images: [{ url: image, width: 1200, height: 630, alt }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function BiweeklyPayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = biweeklyPageBySlug(slug);
  const copy = editorial[slug];
  if (!page || !copy) notFound();

  const f = biweeklyFacts(page);
  const images = biweeklyImages(slug);
  const fill = (text: string) => fillTokens(text, page, f);
  const canonical = `${SITE}/biweekly-pay/${slug}`;
  const isHourly = page.kind === "hourly";
  const gross = dollars(f.single.gross);
  const noTax = dollars(f.noTaxNet);
  const low = dollars(f.lowest.net);
  const pos = f.position;
  const otherNoTax = f.noTaxGroup.length - 1;
  const periods = payPeriodRows(page, f);
  const netPer = (perYear: number) => periods.find(row => row.perYear === perYear)?.net ?? 0;
  const nearby = nearbyPay(page, f);

  const title = biweeklyTitle(page, f);
  const description = biweeklyDescription(page, f, copy.hook);
  const h1 = `${page.label} Is How Much Biweekly After Taxes?`;
  const coverAlt = `${page.lower} is how much biweekly: ${gross} before taxes, ${noTax} after taxes in Texas and ${low} in ${f.lowest.name}`;

  const faqs = [
    {
      q: `${page.short} is how much biweekly after taxes?`,
      a: `${noTax} in Texas, about ${dollars(f.typical.net)} in a typical state and ${low} in ${f.lowest.name}, for a single filer with no pre-tax deductions.`,
    },
    {
      q: `How much is ${page.lower} biweekly before taxes?`,
      a: isHourly
        ? `${cents(f.single.gross)}. An 80-hour pay period at $${page.rate} an hour is ${cents(f.single.gross)} gross, and 26 of those checks add up to ${dollars(page.annual)} a year.`
        : `${cents(f.single.gross)}. Divide ${dollars(page.annual)} by the 26 pay periods in a biweekly year. Taxes and deductions come out after that.`,
    },
    {
      q: `Why is my real paycheck on ${page.short} smaller than this?`,
      a: `Workplace deductions. A 5% 401(k) plus $150 a check for benefits brings ${noTax} down to ${dollars(f.realWorld.net)} in Texas.`,
    },
    ...copy.faqs.map(item => ({ q: fill(item.q), a: fill(item.a) })),
  ];

  const crumbName = `${page.label} Biweekly`;
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
      dateModified: PUBLISHED,
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
        { "@type": "ListItem", position: 3, name: crumbName, item: canonical },
      ],
    },
  ];

  const related = BIWEEKLY_PAGES.filter(p => p.slug !== slug && p.kind === page.kind)
    .sort((a, b) => Math.abs(a.annual - page.annual) - Math.abs(b.annual - page.annual))
    .slice(0, 2);

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
        <span>{crumbName}</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">BIWEEKLY PAY · 2026</div>
        <h1>{h1}</h1>
        <p className="bw-answer">
          <strong>{page.lower} is how much biweekly?</strong> {gross} before taxes,{" "}
          {isHourly ? "for a standard 80-hour pay period" : "because a biweekly schedule splits your salary into 26 checks"}.
          After taxes, a single filer keeps <strong>{noTax}</strong> in Texas and {otherNoTax} other places with no state tax at this pay,
          about <strong>{dollars(f.typical.net)}</strong> in a typical state, and <strong>{low}</strong> in {f.lowest.name}, the
          lowest of the {f.states.length} locations we calculate.
        </p>
        <figure className="bw-cover">
          <img src={images.cover} alt={coverAlt} width={1200} height={630} fetchPriority="high" decoding="async" />
        </figure>
        {isHourly ? (
          <PaycheckCalculator hourly defaultHourlyRate={page.rate} defaultOvertime={0} defaultRetirement={0} defaultPreTax={0} headingSuffix={` at ${page.lower}`} />
        ) : (
          <PaycheckCalculator defaultSalary={page.annual} defaultRetirement={0} defaultPreTax={0} headingSuffix={` on ${page.lower}`} />
        )}
        <div className="hero-more">
          <p>
            Figures assume a single filer, standard W-4 and no pre-tax deductions. Change any field to match your pay stub.
          </p>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">PER CHECK</p>
        <h2>{page.label} Is How Much Biweekly? Where the {gross} Goes</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src={images.split}
              alt={`Where a ${gross} biweekly check goes on ${page.lower}: ${noTax} take-home in Texas, ${low} in ${f.lowest.name}, with the rest going to federal, Social Security, Medicare and state tax`}
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
                <tr><td>Gross pay</td><td>{cents(f.single.gross)}</td><td>{cents(f.married.gross)}</td><td>{cents(f.head.gross)}</td></tr>
                <tr><td>Federal income tax</td><td>−{cents(f.single.federal)}</td><td>−{cents(f.married.federal)}</td><td>−{cents(f.head.federal)}</td></tr>
                <tr><td>Social Security (6.2%)</td><td>−{cents(f.single.socialSecurity)}</td><td>−{cents(f.married.socialSecurity)}</td><td>−{cents(f.head.socialSecurity)}</td></tr>
                <tr><td>Medicare (1.45%)</td><td>−{cents(f.single.medicare)}</td><td>−{cents(f.married.medicare)}</td><td>−{cents(f.head.medicare)}</td></tr>
                <tr className="total"><td>Take-home</td><td>{cents(f.single.net)}</td><td>{cents(f.married.net)}</td><td>{cents(f.head.net)}</td></tr>
                <tr><td>Effective tax rate</td><td>{pct1(f.rates.single.effective)}</td><td>{pct1(f.rates.married.effective)}</td><td>{pct1(f.rates.head.effective)}</td></tr>
                <tr><td>Tax on your next dollar</td><td>{pct2(f.rates.single.nextDollar)}</td><td>{pct2(f.rates.married.nextDollar)}</td><td>{pct2(f.rates.head.nextDollar)}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="bw-note">
            No-income-tax state, standard W-4 with Step 2 unchecked, no pre-tax deductions, 2026 withholding tables. The next-dollar rate is the
            federal bracket plus 7.65% for Social Security and Medicare; state tax adds to both rates.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">EVERY PAY PERIOD</p>
        <h2>{page.label} After Taxes: Per Month, Week, Day and Hour</h2>
        <section>
          <p>
            {page.lower} after taxes is about {dollars(netPer(12))} a month, {dollars(netPer(52))} a week and {cents(netPer(2080))} an hour for a
            single filer with no state income tax.
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
          <p className="bw-note">Annual take-home divided by the period, based on 2,080 paid hours a year. A monthly average, not what lands in a two-check month.</p>
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
        <p className="kicker">TAX BRACKET</p>
        <h2>
          {pos.nearerLine === "over"
            ? `${page.label} Is ${dollars(pos.over)} Over the ${pct(pos.current.rate)} Line: What a 401(k) Does to Your Check`
            : `${page.label} Is ${dollars(pos.under)} Under the ${pct(pos.next.rate)} Line: What a 401(k) Does to Your Check`}
        </h2>
        <section>
          <p>{fill(copy.notes.bracket)}</p>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>401(k) contribution</th>
                  <th>You save per check</th>
                  <th>Take-home falls by</th>
                  <th>Federal tax saved</th>
                </tr>
              </thead>
              <tbody>
                {f.k401.map(row => (
                  <tr key={row.pct}>
                    <td>{row.pct}% of pay</td>
                    <td>{dollars(row.saved)}</td>
                    <td>{dollars(row.netDrop)}</td>
                    <td>{dollars(row.taxSaved)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bw-note">
            Single filer, no-income-tax state, traditional 401(k). <a href={IRS_LIMITS} rel="noopener">2026 limit: $24,500</a>.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">MONTHLY BUDGET</p>
        <h2>Budget on {dollars(f.twoCheck)} a Month, Not {dollars(f.avgMonth)}</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src={images.calendar}
              alt={`2026 biweekly paydays on ${page.lower}: most months pay ${dollars(f.twoCheck)} after taxes in Texas, and the two three-check months pay ${dollars(f.threeCheck)}`}
              width={960}
              height={330}
              loading="lazy"
              decoding="async"
            />
          </figure>
          {copy.notes.month.map(paragraph => (
            <p key={paragraph.slice(0, 40)}>{fill(paragraph)}</p>
          ))}
        </section>
      </article>

      {isHourly && (
        <article className="long-seo">
          <p className="kicker">HOURS</p>
          <h2>What Hours Do to a {page.adjective} Biweekly Check</h2>
          <section>
            {copy.notes.hours && <p>{fill(copy.notes.hours)}</p>}
            <div className="bw-table-wrap">
              <table className="bw-table">
                <thead>
                  <tr>
                    <th>Hours this pay period</th>
                    <th>Gross</th>
                    <th>Take-home</th>
                  </tr>
                </thead>
                <tbody>
                  {f.hours.map(row => (
                    <tr key={row.paid}>
                      <td>{row.hours} ({row.note})</td>
                      <td>{dollars(row.gross)}</td>
                      <td>{dollars(row.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bw-note">
              Single filer, no-income-tax state. See the <a href="/no-tax-on-overtime">federal overtime deduction</a> and{" "}
              <a href="/overtime-calculator">overtime calculator</a>.
            </p>
          </section>
        </article>
      )}

      <article className="long-seo">
        <p className="kicker">BY STATE</p>
        <h2>Which States Take the Most From a {page.adjective} Biweekly Check?</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src={images.states}
              alt={`State and local tax per biweekly check on ${page.lower}: ${f.lowestFive.map(s => `${s.name} ${dollars(s.tax)}`).join(", ")}, compared with $0 in no-income-tax states`}
              width={960}
              height={400}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>State and local tax per check</th>
                  <th>Take-home per check</th>
                </tr>
              </thead>
              <tbody>
                {f.lowestFive.map(s => (
                  <tr key={s.short}>
                    <td><a href={`/biweekly/${s.slug}`}>{s.name}</a></td>
                    <td>{dollars(s.tax)}</td>
                    <td>{dollars(s.net)}</td>
                  </tr>
                ))}
                <tr>
                  <td><a href={`/biweekly/${f.typical.slug}`}>{f.typical.name}</a> (middle of the {f.states.length})</td>
                  <td>{dollars(f.typical.tax)}</td>
                  <td>{dollars(f.typical.net)}</td>
                </tr>
                <tr>
                  <td><a href="/biweekly/texas-paycheck-calculator">Texas</a> and {otherNoTax} others</td>
                  <td>$0</td>
                  <td>{noTax}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>{fill(copy.notes.state)}</p>
          <details className="bw-all-states">
            <summary>All {f.states.length} locations, ranked by take-home</summary>
            <div className="bw-table-wrap">
              <table className="bw-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Rank</th>
                    <th>State and local tax per check</th>
                    <th>Take-home per check</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedStates(f).map(s => (
                    <tr key={s.short}>
                      <td><a href={`/biweekly/${s.slug}`}>{s.name}</a></td>
                      <td>{s.rank}</td>
                      <td>{dollars(s.tax)}</td>
                      <td>{dollars(s.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="bw-note">
            Assumes you live and work in the same place. Annual figures: <a href={page.parentHref}>{page.parentLabel}</a>.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">NEARBY PAY</p>
        <h2>How {page.label} Compares to Nearby {isHourly ? "Wages" : "Salaries"}</h2>
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
                {nearby.map(row => (
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
          <p className="bw-note">Single filer, no-income-tax state, no pre-tax deductions.</p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE MATH</p>
        <h2>How to Calculate {page.label} Biweekly, Step by Step</h2>
        <section>
          <ol className="bw-steps">
            <li>
              <strong>Gross per check:</strong>{" "}
              {isHourly ? `$${page.rate} × 80 hours = ${cents(f.single.gross)}.` : `${dollars(page.annual)} ÷ 26 = ${cents(f.single.gross)}.`}
            </li>
            <li>
              <strong>Annualize, then subtract the W-4 adjustment:</strong> {dollars(page.annual)} − {dollars(pos.adjustment)} ={" "}
              {dollars(pos.adjusted)}.
            </li>
            <li>
              <strong>Apply the single-filer table:</strong> {dollars(pos.adjusted)} falls in the {dollars(pos.current.from)} to{" "}
              {dollars(pos.current.to)} row, so {dollars(pos.current.base)} + {pct(pos.current.rate)} × ({dollars(pos.adjusted)} −{" "}
              {dollars(pos.current.from)}) = {dollars(pos.tentative)} a year.
            </li>
            <li><strong>Federal withholding per check:</strong> {dollars(pos.tentative)} ÷ 26 = {cents(f.single.federal)}.</li>
            <li>
              <strong>Social Security and Medicare:</strong> 6.2% and 1.45% of {cents(f.single.gross)} = {cents(f.single.socialSecurity)} and{" "}
              {cents(f.single.medicare)}.
            </li>
            <li><strong>Take-home in a no-income-tax state:</strong> {cents(f.single.net)}.</li>
          </ol>
          <p className="bw-note">
            Steps follow <a href={IRS_PUB_15T} rel="noopener">IRS Publication 15-T</a>, Worksheet 1A. More in{" "}
            <a href="/methodology">how we calculate paychecks</a>.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>{page.label} Biweekly: Common Questions</h2>
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
        <h2>More on Your Biweekly Paycheck</h2>
        <section>
          <ul className="bw-links">
            <li><a href="/biweekly-pay">Biweekly pay chart and 2026–27 pay dates</a></li>
            <li><a href={page.parentHref}>{page.parentLabel}</a></li>
            {copy.links?.map(link => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
            <li><a href="/biweekly-paycheck-calculator">Biweekly paycheck calculator</a></li>
            {related.map(p => (
              <li key={p.slug}><a href={`/biweekly-pay/${p.slug}`}>{p.label} is how much biweekly</a></li>
            ))}
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
