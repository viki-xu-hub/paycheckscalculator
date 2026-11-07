import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import WorksheetCluster from "../components/WorksheetCluster";
import { capitalGains } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const NEXT = String(capitalGains.year + 1);
const PRIOR = String(capitalGains.year - 1);
const PATH = "/publication-505";
const CANONICAL = `https://www.paycheckscalculator.org${PATH}`;
const TITLE = `IRS Publication 505 (${YEAR}): Withholding and Estimated Tax`;
const DESCRIPTION = `What IRS Publication 505 for ${YEAR} covers, which of its worksheets you need, and the ${YEAR} estimated tax rules: the $1,000 test, 90%/100%/110% safe harbors and due dates.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

// Worksheet names and numbers from the table of contents of Publication 505 (2026).
const WORKSHEETS: [string, string, string][] = [
  ["1-4", `Tax Computation Worksheets for ${YEAR}`, "Tax on $100,000 or more when checking withholding"],
  ["2-2", "Line 1: estimated taxable Social Security and railroad retirement benefits", "You receive Social Security or RRB benefits"],
  ["2-3", "Lines 1 and 9: estimated self-employment tax and deduction", "You have self-employment income"],
  ["2-4", "Line 2a: standard deduction", "You are 65+, blind, or can be claimed as a dependent"],
  ["2-5", "Line 2a: expected charitable contribution deduction", "You give to charity"],
  ["2-6", "Line 2a: overall limitation on itemized deductions", "You itemize at high income"],
  ["2-7", "Line 4: Qualified Dividends and Capital Gain Tax Worksheet", "You have qualified dividends or long-term gains"],
  ["2-8", "Line 4: Foreign Earned Income Tax Worksheet", "You exclude foreign earned income or housing"],
  ["2-9", `${YEAR} Annualized Estimated Tax Worksheet`, "Your income arrives unevenly through the year"],
  ["2-10", "Annualized line 12: Qualified Dividends and Capital Gain Tax Worksheet", "Annualizing, with dividends or gains"],
  ["2-11", "Annualized line 12: Foreign Earned Income Tax Worksheet", "Annualizing, with foreign earned income"],
];

const faqs = [
  {
    q: "What is IRS Publication 505?",
    a: `Publication 505, Tax Withholding and Estimated Tax, is the IRS guide to paying tax during the year. Chapter 1 covers withholding from wages, pensions and other payments. Chapter 2 covers estimated tax: who must pay, how much, when, and the penalty for paying too little.`,
  },
  {
    q: `Is Publication 505 for ${YEAR} available?`,
    a: `Yes. The IRS has published Publication 505 (${YEAR}), labelled "For use in ${YEAR}", on IRS.gov. It is meant for planning ${YEAR} withholding and estimated payments, not for filing your ${PRIOR} return.`,
  },
  {
    q: "What is Worksheet 2-7 in Publication 505?",
    a: `It is the estimated-tax version of the Qualified Dividends and Capital Gain Tax Worksheet. It feeds line 4 of the ${YEAR} Estimated Tax Worksheet so that qualified dividends and long-term gains are taxed at 0%, 15% or 20% rather than at ordinary rates.`,
  },
  {
    q: "What is the difference between Publication 505 and Form 1040-ES?",
    a: `Form 1040-ES is the short package: the worksheet, the ${YEAR} rate schedules, the due dates and the payment vouchers. Publication 505 is the long explanation behind it, with the supporting worksheets for Social Security benefits, self-employment tax, capital gains, foreign income and the annualized method.`,
  },
  {
    q: "Does Publication 505 explain the underpayment penalty?",
    a: `Yes. Chapter 2 explains the underpayment penalty and when it applies. The penalty itself is figured on Form 2210 when you file, as interest on each quarter's shortfall.`,
  },
  {
    q: "How do I avoid an estimated tax penalty?",
    a: `Prepay, through withholding and estimated payments, at least the smaller of 90% of your ${YEAR} tax or 100% of your ${PRIOR} tax (110% if ${PRIOR} AGI was over $150,000, or $75,000 married filing separately). You also owe no penalty if the balance due after withholding is under $1,000.`,
  },
];

export default function Publication505Page() {
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
      { "@type": "ListItem", position: 3, name: "Publication 505", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">IRS PUBLICATION 505 · {YEAR}</div>
        <h1>IRS Publication 505 for {YEAR}, Explained</h1>
        <div className="hero-intro">
          <p>
            Publication 505, Tax Withholding and Estimated Tax, is the IRS guide to paying your {YEAR} tax during the
            year instead of all at once in April. This page sums up what each chapter covers, which of its worksheets
            you actually need, and the {YEAR} rules it sets out.
          </p>
        </div>
        <div className="trust-row">
          <span>Publication 505 ({YEAR})</span>
          <span>Every chapter 2 worksheet</span>
          <span>{YEAR} rules</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">WHAT&apos;S INSIDE</p>
        <h2>What Publication 505 Covers</h2>
        <section>
          <div className="table-wrap wrap">
            <table>
              <thead><tr><th>Chapter</th><th>Title</th><th>What it answers</th></tr></thead>
              <tbody>
                <tr>
                  <td><strong>1</strong></td>
                  <td>Tax Withholding for {YEAR}</td>
                  <td>How withholding from wages, pensions, annuities and other payments works, and how to change it with Forms W-4, W-4P, W-4R and W-4V</td>
                </tr>
                <tr>
                  <td><strong>2</strong></td>
                  <td>Estimated Tax for {YEAR}</td>
                  <td>Who must pay estimated tax, how to figure it, when it is due, the annualized method and the underpayment penalty</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            If you only have wages, chapter 1 is all you need, and the practical step is usually a new W-4. For a
            paycheck-level view of what is already being withheld, see{" "}
            <a className="text-link" href="/how-much-tax-is-taken-from-my-paycheck">how much tax is taken from a
            paycheck</a>. Chapter 2 is for income with no withholding: self-employment, rentals, investments, and the{" "}
            <a className="text-link" href="/estimated-tax-worksheet">{YEAR} Estimated Tax Worksheet</a>.
          </p>
        </section>
      </article>

      <article className="long-seo" id="worksheets">
        <p className="kicker">WORKSHEETS</p>
        <h2>Publication 505 Worksheets: Which Ones You Need</h2>
        <section>
          <p>
            The main {YEAR} Estimated Tax Worksheet is short because the hard parts are pushed into supporting
            worksheets. Each one is named for the line it feeds. You only need the ones that match your situation.
          </p>
          <div className="table-wrap wrap">
            <table>
              <thead><tr><th>Worksheet</th><th>What it figures</th><th>You need it if</th></tr></thead>
              <tbody>
                {WORKSHEETS.map(([n, what, when]) => (
                  <tr key={n} id={`worksheet-${n}`} className={n === "2-7" ? "rate-total" : undefined}>
                    <td><strong>{n}</strong></td>
                    <td>{what}</td>
                    <td>{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong>Worksheet 2-7</strong> is the one investors most often need. It is the same 25-line{" "}
            <a className="text-link" href="/qualified-dividends-and-capital-gain-tax-worksheet">Qualified Dividends and
            Capital Gain Tax Worksheet</a> as on Form 1040, applied to your projected {YEAR} figures. Worksheet 1-4 is
            the{" "}
            <a className="text-link" href="/tax-computation-worksheet">{YEAR} Tax Computation Worksheet</a>, for tax on
            income of $100,000 or more.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">{YEAR} RULES</p>
        <h2>The {YEAR} Estimated Tax Rules in Publication 505</h2>
        <section>
          <div className="table-wrap wrap">
            <table>
              <thead><tr><th>Rule</th><th>{YEAR} figure</th></tr></thead>
              <tbody>
                <tr><td>Minimum balance that requires estimated tax</td><td>$1,000 after withholding and refundable credits</td></tr>
                <tr><td>Current-year safe harbor</td><td>90% of {YEAR} tax</td></tr>
                <tr><td>Prior-year safe harbor</td><td>100% of {PRIOR} tax</td></tr>
                <tr><td>Prior-year safe harbor at higher income</td><td>110% if {PRIOR} AGI was over $150,000 ($75,000 MFS)</td></tr>
                <tr><td>Farmers and fishermen</td><td>66⅔% of {YEAR} tax</td></tr>
                <tr><td>Payment due dates</td><td>Apr 15, Jun 15, Sep 15, {YEAR}; Jan 15, {NEXT}</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The safe harbors set the minimum you must prepay to avoid a penalty, not what you owe. If you pay last
            year&apos;s tax in four installments while your income doubles, you avoid the penalty but still owe the
            difference when you file.
          </p>
          <p>
            For {YEAR} the estimated tax worksheet also has a line for the new deductions reported on Schedule 1-A,
            such as qualified tips and overtime pay. If those apply, the{" "}
            <a className="text-link" href="/no-tax-on-overtime">no tax on overtime</a> guide explains the overtime
            part.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">HOW TO USE IT</p>
        <h2>How to Use Publication 505 in Four Steps</h2>
        <section>
          <ol>
            <li><strong>Decide whether chapter 2 applies.</strong> If you have only wages and your withholding is close, adjust your W-4 in chapter 1 and stop.</li>
            <li><strong>Pull the supporting worksheets you need.</strong> Use the table above: 2-3 for self-employment, 2-7 for dividends and gains, 2-2 for Social Security.</li>
            <li><strong>Fill out the Estimated Tax Worksheet.</strong> Line 12c gives the minimum to prepay; line 15 gives each quarterly payment.</li>
            <li><strong>Pay by each due date.</strong> If income is lumpy, switch to the annualized method in Worksheet 2-9 to lower the early installments.</li>
          </ol>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Publication 505 FAQ</h2>
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
            Chapter titles and worksheet numbers are from the table of contents of{" "}
            <a className="text-link" href="https://www.irs.gov/publications/p505" target="_blank" rel="noopener noreferrer">
              Publication 505 ({YEAR})
            </a>
            . The safe-harbor percentages, the $1,000 threshold and the due dates also appear in the {YEAR}{" "}
            <a className="text-link" href="https://www.irs.gov/forms-pubs/about-form-1040-es" target="_blank" rel="noopener noreferrer">
              Form 1040-ES
            </a>
            .
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> a summary for planning, not tax advice or a substitute for the publication
            itself.
          </p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Current for tax year {YEAR}</small></p>
        </div>
      </article>

      <WorksheetCluster current={PATH} />

      <SiteFooter />
    </main>
  );
}
