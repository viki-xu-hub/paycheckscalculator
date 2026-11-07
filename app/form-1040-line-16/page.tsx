import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import WorksheetCluster from "../components/WorksheetCluster";
import { capitalGains, money, runWorksheet, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const PATH = "/form-1040-line-16";
const CANONICAL = `https://www.paycheckscalculator.org${PATH}`;
const TITLE = `Form 1040 Line 16: How to Figure Your Tax (${YEAR})`;
const DESCRIPTION = `What goes on Form 1040 line 16: which method to use (Tax Table, Tax Computation Worksheet or a capital gain worksheet), its checkboxes, and a ${YEAR} example.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const married = statusByKey.married;

// Same couple as the worked example on the qualified dividends worksheet page.
const EX = { wages: 110000, qualified: 15000, gain: 25000 };
const exTaxable = EX.wages + EX.qualified + EX.gain - married.standardDeduction;
const ex = runWorksheet(exTaxable, EX.qualified, EX.gain, married);

const METHODS: [string, string, string][] = [
  ["Tax Table", "Taxable income under $100,000 and no qualified dividends or capital gain", "Form 1040 instructions"],
  ["Tax Computation Worksheet", "Taxable income of $100,000 or more and no qualified dividends or capital gain", "Form 1040 instructions"],
  ["Qualified Dividends and Capital Gain Tax Worksheet", "Qualified dividends on line 3a or capital gain on line 7a, and Schedule D doesn't send you elsewhere", "Form 1040 instructions"],
  ["Schedule D Tax Worksheet", "28% rate gain (Schedule D line 18) or unrecaptured section 1250 gain (line 19)", "Schedule D instructions"],
  ["Foreign Earned Income Tax Worksheet", "You exclude foreign earned income or housing on Form 2555", "Form 1040 instructions"],
  ["Form 8615", "A child's unearned income is taxed at the parent's rate (the kiddie tax)", "Form 8615"],
];

const faqs = [
  {
    q: "What goes on Form 1040 line 16?",
    a: `Your income tax on the taxable income from line 15, before credits. It is figured with the Tax Table, the Tax Computation Worksheet, or a capital gain worksheet, plus any tax from the forms listed in the three checkboxes on that line.`,
  },
  {
    q: "How do I calculate Form 1040 line 16 with qualified dividends?",
    a: `Use the Qualified Dividends and Capital Gain Tax Worksheet in the Form 1040 instructions. It splits taxable income into ordinary income and preferential income, taxes the preferential part at 0%, 15% or 20%, and its line 25 is the amount you enter on line 16.`,
  },
  {
    q: "What are the checkboxes on Form 1040 line 16?",
    a: `Box 1 is for Form 8814, when parents elect to report a child's interest and dividends. Box 2 is for Form 4972, tax on certain lump-sum distributions. Box 3 is for any other tax that the instructions direct you to include, with a description written in.`,
  },
  {
    q: "Is line 16 my total tax?",
    a: `No. Line 16 is income tax before credits. Line 17 adds amounts from Schedule 2 line 3 (alternative minimum tax and excess advance premium tax credit repayment), credits come off on later lines, and other taxes such as self-employment tax are added further down to reach total tax.`,
  },
  {
    q: "Is Form 1040 line 16 the same as worksheet line 16?",
    a: `No. Line 16 of the Qualified Dividends and Capital Gain Tax Worksheet is an intermediate step: the room left in the 15% band. The worksheet's final answer is on its line 25, and that number goes on Form 1040 line 16.`,
  },
  {
    q: "Why is my line 16 different from my tax bracket times my income?",
    a: `Because the brackets are progressive: only the income inside each bracket is taxed at that bracket's rate. Qualified dividends and long-term gains are also taxed at lower preferential rates. Both make line 16 smaller than your top rate times taxable income.`,
  },
];

export default function Form1040Line16Page() {
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
      { "@type": "ListItem", position: 3, name: "Form 1040 Line 16", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">FORM 1040 · {YEAR}</div>
        <h1>Form 1040 Line 16: How Your Tax Is Figured</h1>
        <div className="hero-intro">
          <p>
            Form 1040 line 16 is your income tax on the taxable income from line 15, before credits. The number itself
            is easy to copy over. The real work is choosing the right method, because the same taxable income can
            produce a very different line 16 depending on what kind of income it is.
          </p>
        </div>
        <div className="trust-row">
          <span>Six methods compared</span>
          <span>The three checkboxes</span>
          <span>{YEAR} example</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">WHICH METHOD</p>
        <h2>Which Method to Use for Line 16</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src="/images/tax-worksheets/form-1040-line-16-methods.svg"
              alt={`Decision chart for Form 1040 line 16: Schedule D Tax Worksheet, Qualified Dividends and Capital Gain Tax Worksheet, Tax Computation Worksheet or Tax Table`}
              width={880}
              height={380}
              loading="lazy"
              decoding="async"
            />
            <figcaption>Two questions decide which method figures line 16.</figcaption>
          </figure>
          <p>
            Work down this list and use the first method that fits. Most returns use one of the first three.
          </p>
          <div className="table-wrap wrap">
            <table>
              <thead><tr><th>Method</th><th>Use it when</th><th>Where to find it</th></tr></thead>
              <tbody>
                {METHODS.map(([method, when, where]) => (
                  <tr key={method}><td><strong>{method}</strong></td><td>{when}</td><td>{where}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The capital gain worksheets don&apos;t replace the first two methods; they call on them. The{" "}
            <a className="text-link" href="/qualified-dividends-and-capital-gain-tax-worksheet">Qualified Dividends and
            Capital Gain Tax Worksheet</a> taxes your ordinary income on line 22 and all of your income on line 24, each
            with the Tax Table or the{" "}
            <a className="text-link" href="/tax-computation-worksheet">Tax Computation Worksheet</a> depending on whether
            the amount is under $100,000.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">EXAMPLE</p>
        <h2>Why the Method Matters: a {YEAR} Example</h2>
        <section>
          <p>
            A married couple filing jointly has {money(EX.wages)} of wages, {money(EX.qualified)} of qualified dividends
            and a {money(EX.gain)} long-term gain. After the {money(married.standardDeduction)} standard deduction, line
            15 is {money(exTaxable)}.
          </p>
          <div className="table-wrap wrap">
            <table>
              <thead><tr><th>Method</th><th>Line 16</th></tr></thead>
              <tbody>
                <tr><td>All income at ordinary rates (Tax Computation Worksheet)</td><td>{money(ex.l24)}</td></tr>
                <tr className="rate-total"><td>Qualified Dividends and Capital Gain Tax Worksheet</td><td>{money(ex.l25)}</td></tr>
                <tr><td>Difference</td><td>{money(ex.l24 - ex.l25)}</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The worksheet taxes {money(ex.l9)} of their dividends and gain at 0% and {money(ex.l17)} at 15%. Using the
            Tax Computation Worksheet alone would put all {money(ex.l4)} at their ordinary rate, overstating line 16 by{" "}
            {money(ex.l24 - ex.l25)}. Tax software makes this choice automatically. Doing it by hand, picking the wrong
            method is the most expensive line 16 mistake.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">CHECKBOXES</p>
        <h2>The Three Checkboxes on Line 16</h2>
        <section>
          <div className="table-wrap wrap">
            <table>
              <thead><tr><th>Box</th><th>Form</th><th>When to check it</th></tr></thead>
              <tbody>
                <tr><td><strong>1</strong></td><td>Form 8814</td><td>You elect to report your child&apos;s interest and dividends on your return</td></tr>
                <tr><td><strong>2</strong></td><td>Form 4972</td><td>You use the special averaging method for a qualifying lump-sum distribution</td></tr>
                <tr><td><strong>3</strong></td><td>Other</td><td>The instructions tell you to include another tax; write in the form or code</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Tax from a checked form is added to the tax from your chosen method, and the total goes on line 16. Most
            filers check none of them.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">AFTER LINE 16</p>
        <h2>What Happens After Line 16</h2>
        <section>
          <ul className="checklist">
            <li>Line 17: Schedule 2 line 3, including alternative minimum tax</li>
            <li>Line 18: line 16 + line 17</li>
            <li>Credits such as the child tax credit come off next</li>
            <li>Self-employment tax and other taxes are added after credits</li>
          </ul>
          <p>
            If you are projecting next year&apos;s line 16 to set quarterly payments, the{" "}
            <a className="text-link" href="/estimated-tax-worksheet">{YEAR} Estimated Tax Worksheet</a> follows the same
            order, and <a className="text-link" href="/publication-505">Publication 505</a> has the supporting worksheets.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            Line numbers refer to the 2025 Form 1040, the latest final version. The example uses {YEAR} rates from{" "}
            {capitalGains.source.label}.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Form 1040 Line 16 FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}<span>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <article className="long-seo">
        <p className="kicker">SOURCES</p>
        <h3>Where this comes from</h3>
        <section>
          <p>
            Line 16 methods and checkboxes follow the{" "}
            <a className="text-link" href={capitalGains.worksheetSource.url} target="_blank" rel="noopener noreferrer">
              Form 1040 instructions
            </a>
            . {YEAR} rates and the standard deduction are from{" "}
            <a className="text-link" href={capitalGains.source.url} target="_blank" rel="noopener noreferrer">
              {capitalGains.source.label}
            </a>
            .
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> a planning guide, not tax advice.
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
