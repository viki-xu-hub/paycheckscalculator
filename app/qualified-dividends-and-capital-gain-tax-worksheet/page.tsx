import type { Metadata } from "next";
import QualifiedDividendsWorksheet from "../components/QualifiedDividendsWorksheet";
import PrintWorksheetButton from "../components/PrintWorksheetButton";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money, money2, runWorksheet, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/qualified-dividends-and-capital-gain-tax-worksheet";
const TITLE = `Qualified Dividends and Capital Gain Tax Worksheet ${YEAR}`;
const DESCRIPTION = `Work the Qualified Dividends and Capital Gain Tax Worksheet for ${YEAR} line by line, or print the blank ${YEAR} worksheet as a PDF. See a filled-in example and the 0%, 15% and 20% split.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/qualified-dividends-and-capital-gain-tax-worksheet" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;
const head = statusByKey.head;
const separate = statusByKey.separate;

// Line wording follows the 2025 Form 1040 instructions (IRS, public domain) with the
// line 6 and line 13 thresholds swapped for the 2026 figures from Rev. Proc. 2025-32.
const WORKSHEET_LINES: [number, string][] = [
  [1, "Enter the amount from Form 1040 or 1040-SR, line 15 (taxable income). If you are filing Form 2555, enter the amount from line 3 of the Foreign Earned Income Tax Worksheet."],
  [2, "Enter the amount from Form 1040 or 1040-SR, line 3a (qualified dividends)."],
  [3, "Are you filing Schedule D? Yes: enter the smaller of Schedule D line 15 or line 16; if either is blank or a loss, enter -0-. No: enter the amount from Form 1040 or 1040-SR, line 7a."],
  [4, "Add lines 2 and 3."],
  [5, "Subtract line 4 from line 1. If zero or less, enter -0-."],
  [6, `Enter ${money(single.zeroRateMax)} if single or married filing separately, ${money(married.zeroRateMax)} if married filing jointly or qualifying surviving spouse, ${money(head.zeroRateMax)} if head of household.`],
  [7, "Enter the smaller of line 1 or line 6."],
  [8, "Enter the smaller of line 5 or line 7."],
  [9, "Subtract line 8 from line 7. This amount is taxed at 0%."],
  [10, "Enter the smaller of line 1 or line 4."],
  [11, "Enter the amount from line 9."],
  [12, "Subtract line 11 from line 10."],
  [13, `Enter ${money(single.fifteenRateMax)} if single, ${money(separate.fifteenRateMax)} if married filing separately, ${money(married.fifteenRateMax)} if married filing jointly or qualifying surviving spouse, ${money(head.fifteenRateMax)} if head of household.`],
  [14, "Enter the smaller of line 1 or line 13."],
  [15, "Add lines 5 and 9."],
  [16, "Subtract line 15 from line 14. If zero or less, enter -0-."],
  [17, "Enter the smaller of line 12 or line 16."],
  [18, "Multiply line 17 by 15% (0.15)."],
  [19, "Add lines 9 and 17."],
  [20, "Subtract line 19 from line 10."],
  [21, "Multiply line 20 by 20% (0.20)."],
  [22, "Figure the tax on the amount on line 5. Use the Tax Table if line 5 is less than $100,000, or the Tax Computation Worksheet if it is $100,000 or more."],
  [23, "Add lines 18, 21, and 22."],
  [24, "Figure the tax on the amount on line 1. Use the Tax Table if line 1 is less than $100,000, or the Tax Computation Worksheet if it is $100,000 or more."],
  [25, "Tax on all taxable income. Enter the smaller of line 23 or line 24, and include it on Form 1040 or 1040-SR, line 16."],
];

// Worked example: a married couple with $110,000 of wages, $15,000 of qualified
// dividends and $25,000 of long-term gain, taking the standard deduction.
const EX = { wages: 110000, qualified: 15000, gain: 25000 };
const exAgi = EX.wages + EX.qualified + EX.gain;
const exTaxable = exAgi - married.standardDeduction;
const ex = runWorksheet(exTaxable, EX.qualified, EX.gain, married);
const exSaving = ex.l24 - ex.l25;
const exampleRows: [number, string, number][] = [
  [1, "Taxable income", ex.l1],
  [2, "Qualified dividends", ex.l2],
  [3, "Net long-term capital gain", ex.l3],
  [4, "Preferential income (2 + 3)", ex.l4],
  [5, "Ordinary income (1 − 4)", ex.l5],
  [6, "0% ceiling, married filing jointly", ex.l6],
  [7, "Smaller of line 1 or 6", ex.l7],
  [8, "Smaller of line 5 or 7", ex.l8],
  [9, "Taxed at 0%", ex.l9],
  [10, "Smaller of line 1 or 4", ex.l10],
  [11, "Line 9", ex.l11],
  [12, "Line 10 − line 11", ex.l12],
  [13, "15% ceiling, married filing jointly", ex.l13],
  [14, "Smaller of line 1 or 13", ex.l14],
  [15, "Line 5 + line 9", ex.l15],
  [16, "Line 14 − line 15", ex.l16],
  [17, "Taxed at 15%", ex.l17],
  [18, "Line 17 × 15%", ex.l18],
  [19, "Line 9 + line 17", ex.l19],
  [20, "Taxed at 20%", ex.l20],
  [21, "Line 20 × 20%", ex.l21],
  [22, "Ordinary tax on line 5", ex.l22],
  [23, "Lines 18 + 21 + 22", ex.l23],
  [24, "Ordinary tax on line 1", ex.l24],
  [25, "Tax: smaller of line 23 or 24", ex.l25],
];

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
  {
    q: `Where can I get a printable ${YEAR} Qualified Dividends and Capital Gain Tax Worksheet PDF?`,
    a: `The IRS prints the worksheet inside the Form 1040 instructions rather than as a separate form, and the ${YEAR} instructions are released around the end of the year. The blank ${YEAR} version on this page uses the same 25 lines with the ${YEAR} thresholds already filled in on lines 6 and 13; use Print or save as PDF to get a one-page copy.`,
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
    dateModified: "2026-10-27",
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
        <p className="kicker">WORKED EXAMPLE</p>
        <h2>{YEAR} Qualified Dividends and Capital Gain Tax Worksheet Example, Filled In</h2>
        <section>
          <p>
            A married couple filing jointly earns {money(EX.wages)} in wages, receives {money(EX.qualified)} of qualified
            dividends and sells stock held for several years at a {money(EX.gain)} long-term gain. Their AGI is{" "}
            {money(exAgi)}; after the {money(married.standardDeduction)} {YEAR} standard deduction, taxable income on line 15
            of Form 1040 is {money(exTaxable)}.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Line</th><th>What it is</th><th>Amount</th></tr></thead>
              <tbody>
                {exampleRows.map(([line, label, value]) => (
                  <tr key={line} className={line === 25 ? "rate-total" : undefined}>
                    <td><strong>{line}</strong></td>
                    <td>{label}</td>
                    <td>{money(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Their wages fill the first {money(ex.l5)} of the {money(ex.l6)} 0% band, which leaves {money(ex.l9)} of room:
            that much of the dividends and gain is taxed at nothing. The remaining {money(ex.l17)} falls in the 15% band
            for {money(ex.l18)}, and nothing reaches 20%. Line 25 comes to {money(ex.l25)}, which is {money(exSaving)} less
            than the {money(ex.l24)} the same taxable income would cost on the ordinary rate schedule.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            Lines 22 and 24 here use the exact {YEAR} rate schedule. The paper worksheet sends amounts under $100,000 to
            the Tax Table, which works in $50 steps, so a hand-filled copy can differ by a few dollars.
          </p>
        </section>
      </article>

      <article className="long-seo" id="printable-worksheet">
        <p className="kicker">PRINTABLE {YEAR} WORKSHEET</p>
        <h2>Printable {YEAR} Qualified Dividends and Capital Gain Tax Worksheet (PDF)</h2>
        <section>
          <p>
            A blank copy of all 25 lines with the {YEAR} thresholds already entered on lines 6 and 13. Use the button
            to print it or choose Save as PDF in the print dialog. Complete Form 1040 through line 15 before you start.
          </p>
          <PrintWorksheetButton />
          <div className="worksheet-print">
            <p className="worksheet-print-title">
              <strong>Qualified Dividends and Capital Gain Tax Worksheet — Form 1040, Line 16 ({YEAR})</strong>
            </p>
            <ol className="worksheet-lines">
              {WORKSHEET_LINES.map(([line, text]) => (
                <li key={line}>
                  <span className="worksheet-line-num">{line}.</span>
                  <span className="worksheet-line-text">{text}</span>
                  <span className="worksheet-line-box">{line}. ________</span>
                </li>
              ))}
            </ol>
            <p className="worksheet-print-note">
              Line wording from the IRS Form 1040 instructions; {YEAR} thresholds from {capitalGains.source.label}. If
              Schedule D shows 28% rate gain or unrecaptured section 1250 gain, use the Schedule D Tax Worksheet instead.
              Source: paycheckscalculator.org/qualified-dividends-and-capital-gain-tax-worksheet
            </p>
          </div>
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
