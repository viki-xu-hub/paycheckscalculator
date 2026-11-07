import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import WorksheetCluster from "../components/WorksheetCluster";
import { capitalGains, money, money2, ordinaryTax, statusByKey, taxComputationRows } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const PATH = "/tax-computation-worksheet";
const CANONICAL = `https://www.paycheckscalculator.org${PATH}`;
const TITLE = `${YEAR} Tax Computation Worksheet (Form 1040)`;
const DESCRIPTION = `The ${YEAR} Tax Computation Worksheet for taxable income of $100,000 or more: the multiplication and subtraction amounts for every filing status, with a worked example.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

// The four sections of the worksheet as printed in the 1040 instructions.
const SECTIONS = [
  { letter: "A", status: statusByKey.single, label: "Single" },
  { letter: "B", status: statusByKey.married, label: "Married filing jointly or qualifying surviving spouse" },
  { letter: "C", status: statusByKey.separate, label: "Married filing separately" },
  { letter: "D", status: statusByKey.head, label: "Head of household" },
];

const pct = (r: number) => `${Math.round(r * 100)}%`;

// Worked example: a single filer with $150,000 of taxable income.
const EX_INCOME = 150000;
const exRow = taxComputationRows(single).find(r => EX_INCOME > r.from - 1 && (r.to === null || EX_INCOME <= r.to))!;
const exMultiplied = EX_INCOME * exRow.rate;
const exTax = exMultiplied - exRow.subtraction;
const exCheck = ordinaryTax(EX_INCOME, single);

// Second example: married filing jointly at $250,000.
const EX2_INCOME = 250000;
const ex2Row = taxComputationRows(married).find(r => EX2_INCOME > r.from - 1 && (r.to === null || EX2_INCOME <= r.to))!;
const ex2Tax = EX2_INCOME * ex2Row.rate - ex2Row.subtraction;

const faqs = [
  {
    q: "What is the Tax Computation Worksheet?",
    a: `It is the table in the Form 1040 instructions you use instead of the Tax Table when taxable income is $100,000 or more. It restates the bracket schedule as one step: multiply your taxable income by your top bracket rate, then subtract a fixed amount for your bracket.`,
  },
  {
    q: "When do I use the Tax Computation Worksheet instead of the Tax Table?",
    a: `When the amount you are taxing is $100,000 or more. That applies to Form 1040 line 15, and also to lines 22 and 24 of the Qualified Dividends and Capital Gain Tax Worksheet, which each tax a separate amount and can land on different tables.`,
  },
  {
    q: "Where does the subtraction amount come from?",
    a: `It removes the over-charge from taxing your whole income at the top rate. Each bracket's subtraction amount equals the bracket floor times its rate, minus the tax owed on income up to that floor. For ${YEAR} single filers in the 24% bracket it is ${money2(taxComputationRows(single).find(r => r.rate === 0.24)!.subtraction)}.`,
  },
  {
    q: `Is the ${YEAR} Tax Computation Worksheet out yet?`,
    a: `The IRS prints it in the ${YEAR} Form 1040 instructions, released around the end of the year. The figures here come from the ${YEAR} rate schedules in ${capitalGains.source.label}, which are the same schedules printed in the ${YEAR} Form 1040-ES and Publication 505 Worksheet 1-4, so the result matches the official worksheet.`,
  },
  {
    q: "Does the Tax Computation Worksheet give the same answer as the tax brackets?",
    a: `Yes, to the cent. It is the bracket schedule in a different format. The Tax Table, by contrast, works in $50 income steps and taxes the midpoint, so for incomes under $100,000 the table and an exact bracket calculation can differ by a few dollars.`,
  },
  {
    q: "Do I use this worksheet if I have qualified dividends?",
    a: `Indirectly. You first run the Qualified Dividends and Capital Gain Tax Worksheet. Its lines 22 and 24 tell you to figure tax on certain amounts, and for any amount of $100,000 or more you use this worksheet to do it.`,
  },
];

export default function TaxComputationWorksheetPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
    author: { "@type": "Organization", name: "Paycheck Calculator Editorial Team" },
    publisher: { "@type": "Organization", name: "Paycheck Atlas" },
    dateModified: "2026-11-07",
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
      { "@type": "ListItem", position: 3, name: "Tax Computation Worksheet", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">{YEAR} FORM 1040 WORKSHEET</div>
        <h1>{YEAR} Tax Computation Worksheet</h1>
        <div className="hero-intro">
          <p>
            The Tax Computation Worksheet is how Form 1040 figures tax on taxable income of $100,000 or more. Find your
            filing status and income row, multiply by the rate, subtract the amount shown, and the result is your tax.
            All four sections for {YEAR} are below.
          </p>
        </div>
        <div className="trust-row">
          <span>{capitalGains.source.label}</span>
          <span>Sections A–D</span>
          <span>Matches the {YEAR} rate schedules</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How the Tax Computation Worksheet Works</h2>
        <section>
          <p>
            Each row has five columns. Column (a) is your taxable income. Column (b) is the rate for the bracket that
            income falls in. Column (c) multiplies the two. Column (d) is a fixed subtraction amount, and your tax is (c)
            minus (d).
          </p>
          <p>
            The subtraction is what makes one multiplication work for a progressive schedule. Multiplying all of your
            income by your top rate over-charges the dollars that belong in lower brackets. Column (d) is exactly that
            over-charge, worked out in advance for each bracket.
          </p>
          <p>
            Use it when the amount being taxed is <strong>$100,000 or more</strong>. Below that, the Tax Table in the
            1040 instructions applies. The test is applied to whatever amount you are taxing, so on the{" "}
            <a className="text-link" href="/qualified-dividends-and-capital-gain-tax-worksheet">Qualified Dividends and
            Capital Gain Tax Worksheet</a> line 22 might use the Tax Table while line 24 uses this worksheet.
          </p>
        </section>
      </article>

      {SECTIONS.map(({ letter, status, label }) => (
        <article className="long-seo" key={letter} id={`section-${letter.toLowerCase()}`}>
          <p className="kicker">SECTION {letter}</p>
          <h2>Section {letter}: {label}</h2>
          <section>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Taxable income (a)</th>
                    <th>Multiplication amount (b)</th>
                    <th>Subtraction amount (d)</th>
                    <th>Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {taxComputationRows(status).map(r => (
                    <tr key={r.from}>
                      <td>
                        {r.to === null
                          ? `Over ${money(r.from)}`
                          : `${r.from === 100000 ? "At least" : "Over"} ${money(r.from)} but not over ${money(r.to)}`}
                      </td>
                      <td>× {r.rate.toFixed(2)} ({pct(r.rate)})</td>
                      <td>{money2(r.subtraction)}</td>
                      <td>(a) × (b) − {money2(r.subtraction)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </article>
      ))}

      <article className="long-seo">
        <p className="kicker">WORKED EXAMPLE</p>
        <h2>{YEAR} Tax Computation Worksheet Example</h2>
        <section>
          <p>
            A single filer has {money(EX_INCOME)} of taxable income on Form 1040 line 15. That falls in the row from{" "}
            {money(exRow.from)} to {money(exRow.to ?? 0)} in Section A.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Column</th><th>Step</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td><strong>(a)</strong></td><td>Taxable income</td><td>{money2(EX_INCOME)}</td></tr>
                <tr><td><strong>(b)</strong></td><td>Multiplication amount</td><td>× {exRow.rate.toFixed(2)}</td></tr>
                <tr><td><strong>(c)</strong></td><td>(a) × (b)</td><td>{money2(exMultiplied)}</td></tr>
                <tr><td><strong>(d)</strong></td><td>Subtraction amount</td><td>{money2(exRow.subtraction)}</td></tr>
                <tr className="rate-total"><td><strong>Tax</strong></td><td>(c) − (d)</td><td>{money2(exTax)}</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Working through the brackets one at a time gives the same {money2(exCheck)}. A married couple filing
            jointly with {money(EX2_INCOME)} of taxable income uses Section B: {money(EX2_INCOME)} ×{" "}
            {ex2Row.rate.toFixed(2)} − {money2(ex2Row.subtraction)} = {money2(ex2Tax)}.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHERE IT FITS</p>
        <h2>Where the Worksheet Fits on Your Return</h2>
        <section>
          <ul className="checklist">
            <li>Form 1040 line 16, when you have no qualified dividends or capital gain</li>
            <li>Qualified Dividends and Capital Gain Tax Worksheet, lines 22 and 24</li>
            <li>Schedule D Tax Worksheet, for its ordinary-tax lines</li>
            <li>Publication 505 Worksheet 1-4, when estimating {YEAR} withholding</li>
          </ul>
          <p>
            The result ends up on <a className="text-link" href="/form-1040-line-16">Form 1040 line 16</a>, either
            directly or through one of the capital gain worksheets. The same rate schedules drive line 4 of the{" "}
            <a className="text-link" href="/estimated-tax-worksheet">{YEAR} Estimated Tax Worksheet</a>.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            The {YEAR} brackets start at {money(single.brackets[1][0])} (12%) for single filers and{" "}
            {money(married.brackets[1][0])} for joint filers, so every row on this worksheet is already in the 22%
            bracket or above.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Tax Computation Worksheet FAQ</h2>
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
            Rates and bracket floors are the {YEAR} schedules in{" "}
            <a className="text-link" href={capitalGains.source.url} target="_blank" rel="noopener noreferrer">
              {capitalGains.source.label}
            </a>{" "}
            §3.01, the same figures printed as the {YEAR} Tax Rate Schedules in Form 1040-ES. The subtraction amounts
            are derived from them. The worksheet layout follows the{" "}
            <a className="text-link" href={capitalGains.worksheetSource.url} target="_blank" rel="noopener noreferrer">
              Form 1040 instructions
            </a>
            .
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> a planning reference, not tax advice. Check your figures against the{" "}
            {YEAR} Form 1040 instructions when they are released.
          </p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Rates current for tax year {YEAR}</small></p>
        </div>
      </article>

      <WorksheetCluster current={PATH} />

      <SiteFooter />
    </main>
  );
}
