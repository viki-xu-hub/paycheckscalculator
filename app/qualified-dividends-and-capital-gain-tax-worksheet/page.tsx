import type { Metadata } from "next";
import QualifiedDividendsWorksheet from "../components/QualifiedDividendsWorksheet";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/qualified-dividends-and-capital-gain-tax-worksheet";
const TITLE = `Qualified Dividends and Capital Gain Tax Worksheet ${YEAR}`;
const DESCRIPTION = `Work the Qualified Dividends and Capital Gain Tax Worksheet for ${YEAR} line by line. Enter three figures from Form 1040 and see the 0%, 15% and 20% split.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/qualified-dividends-and-capital-gain-tax-worksheet" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;

const faqs = [
  {
    q: "What is the Qualified Dividends and Capital Gain Tax Worksheet?",
    a: `It is the worksheet in the Form 1040 instructions that figures your tax when part of your income is qualified dividends or long-term capital gain. Those amounts get preferential rates of 0%, 15% or 20% instead of your ordinary bracket, and the worksheet is how the return separates the two piles and taxes each correctly.`,
  },
  {
    q: "Who has to use the qualified dividends and capital gains worksheet?",
    a: `You use it when you report qualified dividends on Form 1040 line 3a or a net capital gain, and you are not required to use the Schedule D Tax Worksheet instead. If you have 28% rate gain from collectibles or unrecaptured section 1250 gain from depreciated real estate, the Schedule D Tax Worksheet replaces this one.`,
  },
  {
    q: `What are the ${YEAR} qualified dividend tax rates?`,
    a: `0%, 15% and 20%, set by where your taxable income falls. For ${YEAR} a single filer pays 0% on preferential income up to ${money2(single.zeroRateMax)} of taxable income, 15% from there to ${money2(single.fifteenRateMax)}, and 20% above that. The bands for married filing jointly are ${money2(statusByKey.married.zeroRateMax)} and ${money2(statusByKey.married.fifteenRateMax)}.`,
  },
  {
    q: "Why does the worksheet compare two numbers at the end?",
    a: `Line 23 is the preferential-rate computation and line 24 is the tax you would owe if everything were taxed at ordinary rates. Line 25 takes the smaller of the two. That safety valve means the worksheet can never produce a larger bill than the plain rate schedule, which matters at low incomes where the ordinary brackets are already below 15%.`,
  },
  {
    q: "Do ordinary dividends count on this worksheet?",
    a: `Only the qualified portion. Form 1040 line 3b is total ordinary dividends and line 3a is the qualified subset of it. The worksheet uses line 3a. The non-qualified remainder stays in ordinary income and is taxed at your normal bracket.`,
  },
  {
    q: "Does the worksheet include the 3.8% net investment income tax?",
    a: `No. The net investment income tax is a separate 3.8% surtax figured on Form 8960, and it keys off modified adjusted gross income rather than taxable income. The thresholds are ${money2(single.niitThreshold)} for single filers and ${money2(statusByKey.married.niitThreshold)} for married filing jointly, and they are not adjusted for inflation.`,
  },
  {
    q: "Can my qualified dividends be taxed at 0%?",
    a: `Yes, and it is more common than people expect. The 0% band is filled by your ordinary income first — that is what lines 5 through 9 do — so the 0% rate applies only to whatever room is left underneath the threshold. A filer with little ordinary income and a large dividend can pay nothing on a substantial amount.`,
  },
  {
    q: "What makes a dividend qualified?",
    a: `Broadly, it has to be paid by a US corporation or a qualified foreign corporation, and you have to have held the stock for more than 60 days during the 121-day window that starts 60 days before the ex-dividend date. Dividends from REITs, money market funds and employee stock options generally do not qualify. Your 1099-DIV does the classification for you.`,
  },
];

export default function QualifiedDividendsPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Qualified Dividends and Capital Gain Tax Worksheet — ${YEAR} Line by Line`,
    description: DESCRIPTION,
    url: CANONICAL,
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
    author: { "@type": "Organization", name: "Paycheck Calculator Editorial Team" },
    publisher: { "@type": "Organization", name: "Paycheck Atlas" },
    dateModified: "2026-09-25",
  };
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qualified Dividends and Capital Gain Tax Worksheet Calculator",
    url: CANONICAL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: DESCRIPTION,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.paycheckscalculator.org" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.paycheckscalculator.org/blog" },
      { "@type": "ListItem", position: 3, name: "Qualified Dividends and Capital Gain Tax Worksheet", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">{YEAR} FORM 1040 WORKSHEET</div>
        <h1>Qualified Dividends and Capital Gain Tax Worksheet <em>{YEAR}</em></h1>
        <div className="hero-intro">
          <p>
            The Qualified Dividends and Capital Gain Tax Worksheet is the part of the Form 1040 instructions that
            stops your long-term gains being taxed at your ordinary bracket. Enter three figures from your return and
            this runs all 25 lines, showing which slice lands at 0%, which at 15% and which at 20%.
          </p>
        </div>
        <QualifiedDividendsWorksheet />
        <div className="hero-more">
          <p>
            Every threshold comes from {capitalGains.source.label} and the line order follows the worksheet as printed
            in the Form 1040 instructions. Open <strong>Show all 25 lines</strong> to compare against the paper version
            box by box.
          </p>
        </div>
        <div className="trust-row">
          <span>{capitalGains.source.label}</span>
          <span>All 25 lines</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">WHAT IT DOES</p>
        <h2>What the Qualified Dividends and Capital Gain Tax Worksheet Actually Does</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src="/images/dividends/qualified-dividends-worksheet.svg"
              alt={`How the Qualified Dividends and Capital Gain Tax Worksheet splits ${YEAR} income: ordinary income fills the 0% band first, then preferential income is taxed at 0%, 15% and 20%`}
              width={880}
              height={380}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Ordinary income fills the 0% band first. Only the room left underneath the threshold gets the 0% rate.
            </figcaption>
          </figure>
          <p>
            Your return has two kinds of income in it. Wages, interest, non-qualified dividends and short-term gains
            are taxed on the ordinary rate schedule — 10% through 37%. Qualified dividends and net long-term capital
            gain get their own schedule: 0%, 15% and 20%.
          </p>
          <p>
            The worksheet is how a single Form 1040 handles both. It separates the two piles, stacks the preferential
            income <em>on top of</em> the ordinary income, and taxes each band at its own rate. The stacking order is
            the part people get wrong: ordinary income uses up the 0% band first, so the 0% rate only reaches whatever
            space is left.
          </p>
          <p>
            That is why a filer with $120,000 of wages and $30,000 of qualified dividends pays 15% on all $30,000 —
            the wages have already filled the 0% band — while a filer with no wages and $40,000 of dividends pays
            nothing at all.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">{YEAR} RATE BANDS</p>
        <h2>{YEAR} Qualified Dividend and Long-Term Capital Gain Rates</h2>
        <section>
          <p>
            The bands are set by taxable income, not by the size of the gain. These are the {YEAR} figures from{" "}
            {capitalGains.source.label}.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Filing status</th><th>0% rate applies up to</th><th>15% rate applies up to</th><th>20% rate</th></tr>
              </thead>
              <tbody>
                {capitalGains.filingStatuses.map(s => (
                  <tr key={s.key}>
                    <td>{s.label}</td>
                    <td>{money2(s.zeroRateMax)}</td>
                    <td>{money2(s.fifteenRateMax)}</td>
                    <td>above {money2(s.fifteenRateMax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 20, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            On top of these, a 3.8% net investment income tax can apply above {money2(single.niitThreshold)} of
            modified AGI for single filers and {money2(statusByKey.married.niitThreshold)} for joint filers. That
            surtax is figured separately on Form 8960 and is not part of this worksheet.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">LINE BY LINE</p>
        <h2>The Lines That Decide the Answer</h2>
        <section>
          <p>
            All 25 lines are in the calculator above, but five of them do the real work.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Line</th><th>What happens</th></tr></thead>
              <tbody>
                <tr><td><strong>5</strong></td><td>Taxable income minus qualified dividends and net capital gain — this is the ordinary pile</td></tr>
                <tr><td><strong>9</strong></td><td>The amount taxed at <strong>0%</strong>, which is the 0% band minus whatever the ordinary pile already used</td></tr>
                <tr><td><strong>17</strong></td><td>The amount taxed at <strong>15%</strong></td></tr>
                <tr><td><strong>20</strong></td><td>The amount taxed at <strong>20%</strong> — anything left above the 15% ceiling</td></tr>
                <tr className="rate-total"><td><strong>25</strong></td><td><strong>Your tax: the smaller of line 23 and line 24</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Line 25 is worth understanding. Line 23 adds up the preferential computation; line 24 is what you would
            owe if the whole taxable income went through the ordinary rate schedule. Taking the smaller of the two
            means the worksheet can never charge you more than not using it would — which matters at low incomes,
            where the 10% and 12% ordinary brackets are already below the 15% preferential rate.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHICH WORKSHEET</p>
        <h2>When to Use Schedule D&apos;s Worksheet Instead</h2>
        <section>
          <p>
            Two worksheets do similar jobs and the return picks one. Use the Qualified Dividends and Capital Gain Tax
            Worksheet when your preferential income is plain qualified dividends and net long-term gain. Switch to the
            Schedule D Tax Worksheet when either of these appears:
          </p>
          <ul className="checklist">
            <li><strong>28% rate gain</strong> — collectibles, and qualified small business stock under section 1202</li>
            <li><strong>Unrecaptured section 1250 gain</strong> — the depreciation component when you sell rental property</li>
          </ul>
          <p>
            Both carry their own rate ceilings that this worksheet has no line for, which is why they push you to the
            longer version. If your 1099-DIV and Schedule D show neither, this is the right worksheet.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT QUALIFIES</p>
        <h2>Which Dividends Are Qualified</h2>
        <section>
          <p>
            Only the qualified subset reaches this worksheet. Form 1040 line 3b is total ordinary dividends; line 3a
            is the qualified part of that total, and line 3a is what you enter. The rest stays in ordinary income.
          </p>
          <ul className="checklist">
            <li>Paid by a US corporation or a qualified foreign corporation</li>
            <li>Held more than 60 days in the 121-day window starting 60 days before the ex-dividend date</li>
            <li>Not on the IRS list of excluded payers — REIT and money-market distributions generally do not qualify</li>
            <li>Your 1099-DIV already splits box 1a from box 1b, so you rarely have to make the call yourself</li>
          </ul>
          <p>
            Long-term capital gain follows a different test: the asset has to have been held more than one year.
            Short-term gain is ordinary income and never reaches the preferential bands.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Qualified Dividends and Capital Gain Tax Worksheet FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}<span>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <article className="long-seo">
        <p className="kicker">SOURCES</p>
        <h3>Where these figures come from</h3>
        <section>
          <p>
            The {YEAR} rate bands, ordinary rate schedules and standard deduction amounts are from{" "}
            <a className="text-link" href={capitalGains.source.url} target="_blank" rel="noopener noreferrer">
              {capitalGains.source.label}
            </a>{" "}
            ({capitalGains.source.sections}). The line order and the wording of each step follow the{" "}
            <a className="text-link" href={capitalGains.worksheetSource.url} target="_blank" rel="noopener noreferrer">
              Form 1040 instructions
            </a>
            .
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> a planning tool, not tax advice or a substitute for filing software. It does
            not handle 28% rate gain, unrecaptured section 1250 gain, the alternative minimum tax, or the net
            investment income tax. If Schedule D shows either of the first two, use the Schedule D Tax Worksheet.
          </p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Rates current for tax year {YEAR}</small></p>
        </div>
      </article>

      <article className="long-seo">
        <p className="kicker">RELATED TOOLS</p>
        <h3>More tax tools and guides</h3>
        <section>
          <div className="tool-links">
            <a href="/"><b>Paycheck Calculator</b><span>Take-home pay after tax →</span></a>
            <a href="/tax-write-off"><b>What Is a Tax Write-Off?</b><span>Deductions vs credits →</span></a>
            <a href="/hsa-calculator"><b>HSA Calculator</b><span>{YEAR} limits and savings →</span></a>
            <a href="/dependent-care-fsa"><b>Dependent Care FSA</b><span>Now $7,500 for {YEAR} →</span></a>
            <a href="/can-i-claim-my-girlfriend-as-a-dependent"><b>Claiming a Partner</b><span>IRS dependent rules →</span></a>
            <a href="/how-much-tax-is-taken-from-my-paycheck"><b>Paycheck Tax Explainer</b><span>Every deduction explained →</span></a>
            <a href="/state-paycheck-calculators"><b>State Calculators</b><span>All 50 states + DC →</span></a>
            <a href="/blog"><b>All Guides</b><span>Every tax explainer →</span></a>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
