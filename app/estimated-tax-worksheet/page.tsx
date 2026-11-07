import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import WorksheetCluster from "../components/WorksheetCluster";
import { capitalGains, money, ordinaryTax, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const NEXT = String(capitalGains.year + 1);
const PRIOR = String(capitalGains.year - 1);
const PATH = "/estimated-tax-worksheet";
const CANONICAL = `https://www.paycheckscalculator.org${PATH}`;
const TITLE = `${YEAR} Estimated Tax Worksheet (Form 1040-ES), Line by Line`;
const DESCRIPTION = `Fill out the ${YEAR} Estimated Tax Worksheet from Form 1040-ES line by line: the 90%/100%/110% safe harbor, the $1,000 test, ${YEAR} due dates and a filled-in freelancer example.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;

// Line list and wording follow the 2026 Form 1040-ES Estimated Tax Worksheet.
const LINES: [string, string, string][] = [
  ["1", "Adjusted gross income you expect for the year", "Wages, business profit, interest, dividends and gains, minus adjustments such as half of self-employment tax."],
  ["2a", "Deductions", "Your standard deduction or estimated itemized deductions. Non-itemizers can add up to $1,000 ($2,000 joint) of cash charitable gifts."],
  ["2b", "Qualified business income deduction", "Usually 20% of qualified business income, limited by taxable income."],
  ["2c", "Schedule 1-A deductions", "The new deductions reported on Schedule 1-A, such as qualified tips and overtime pay."],
  ["2d", "Add lines 2a, 2b and 2c", "Total deductions."],
  ["3", "Line 1 − line 2d", "Estimated taxable income."],
  ["4", "Tax on line 3", `The ${YEAR} Tax Rate Schedules. With qualified dividends or a net capital gain, use Publication 505 Worksheet 2-7 instead.`],
  ["5", "Alternative minimum tax", "From Form 6251, if it applies."],
  ["6", "Line 4 + line 5, plus other taxes that go in Form 1040 line 16", "Income tax before credits."],
  ["7", "Credits", "Child tax credit and other nonrefundable credits. Not withholding."],
  ["8", "Line 6 − line 7, not below 0", "Income tax after credits."],
  ["9", "Self-employment tax", "15.3% on 92.35% of net self-employment profit, with Social Security capped at the wage base."],
  ["10", "Other taxes", "Additional Medicare tax, net investment income tax, household employment taxes and similar."],
  ["11a", "Add lines 8 through 10", "Total tax before refundable credits."],
  ["11b", "Refundable credits", "Earned income credit, additional child tax credit, net premium tax credit and others."],
  ["11c", `Total ${YEAR} estimated tax`, "Line 11a − line 11b, not below 0."],
  ["12a", "90% of line 11c", "66⅔% if you are a farmer or fisherman."],
  ["12b", "Required payment based on last year's tax", `100% of the tax on your ${PRIOR} return, or 110% if ${PRIOR} AGI was over $150,000 ($75,000 married filing separately).`],
  ["12c", "Smaller of line 12a or line 12b", "Your required annual payment: what you must prepay to avoid a penalty."],
  ["13", "Withholding", `Income tax withheld and expected to be withheld during ${YEAR}.`],
  ["14a", "Line 12c − line 13", "If zero or less, stop: you don't need to make estimated payments."],
  ["14b", "Line 11c − line 13", "If less than $1,000, stop: you don't need to make estimated payments."],
  ["15", "Quarterly payment", `If your first payment is due April 15, ${YEAR}: ¼ of line 14a, minus any ${PRIOR} overpayment applied.`],
];

const DUE_DATES: [string, string, string][] = [
  ["1st", `April 15, ${YEAR}`, "January 1 – March 31"],
  ["2nd", `June 15, ${YEAR}`, "April 1 – May 31"],
  ["3rd", `September 15, ${YEAR}`, "June 1 – August 31"],
  ["4th", `January 15, ${NEXT}`, "September 1 – December 31"],
];

// Worked example: a single freelancer with $80,000 of net profit, no withholding,
// $12,000 of tax on last year's return and prior-year AGI under $150,000.
const SS_WAGE_BASE = 184500;
const EX = { profit: 80000, priorTax: 12000 };
const seBase = EX.profit * 0.9235;
const exSeTax = Math.min(seBase, SS_WAGE_BASE) * 0.124 + seBase * 0.029;
const exL1 = EX.profit - exSeTax / 2;
const exL2a = single.standardDeduction;
const exL2b = Math.min(exL1, exL1 - exL2a) * 0.2; // 20% of QBI, limited to 20% of taxable income before QBI
const exL2d = exL2a + exL2b;
const exL3 = exL1 - exL2d;
const exL4 = ordinaryTax(exL3, single);
const exL11c = exL4 + exSeTax;
const exL12a = exL11c * 0.9;
const exL12c = Math.min(exL12a, EX.priorTax);
const exL15 = exL12c / 4;

const faqs = [
  {
    q: `Do I have to make ${YEAR} estimated tax payments?`,
    a: `Generally yes, if you expect to owe at least $1,000 for ${YEAR} after withholding and refundable credits, and your withholding and credits will cover less than the smaller of 90% of your ${YEAR} tax or 100% of your ${PRIOR} tax. You are exempt if you had no tax liability for a full 12-month ${PRIOR}.`,
  },
  {
    q: `What are the ${YEAR} estimated tax due dates?`,
    a: `April 15, June 15 and September 15, ${YEAR}, and January 15, ${NEXT}. You can skip the January payment if you file your ${YEAR} return by February 1, ${NEXT} and pay the full balance with it.`,
  },
  {
    q: "What is the 110% rule?",
    a: `If your ${PRIOR} adjusted gross income was more than $150,000 ($75,000 if married filing separately in ${YEAR}), the prior-year safe harbor on line 12b is 110% of your ${PRIOR} tax instead of 100%. It does not apply if at least two-thirds of your gross income comes from farming or fishing.`,
  },
  {
    q: "Which is better, paying 90% of this year's tax or 100% of last year's?",
    a: `Whichever is smaller is all you need to prepay to avoid a penalty, which is why line 12c takes the smaller. Last year's tax is fixed and known, so it is the safer target when your income is rising. You still owe any remaining balance when you file.`,
  },
  {
    q: "How do I figure line 4 if I have qualified dividends or capital gains?",
    a: `Line 4 tells you to see Publication 505. Its Worksheet 2-7 is the estimated-tax version of the Qualified Dividends and Capital Gain Tax Worksheet, so your dividends and long-term gains get the 0%, 15% and 20% rates instead of ordinary rates.`,
  },
  {
    q: "Can I raise my withholding instead of paying estimated tax?",
    a: `Yes. If you also have a job, a new Form W-4 asking your employer to withhold more can cover the tax on your other income. Withholding counts as paid evenly through the year no matter when it happens, which estimated payments don't.`,
  },
];

export default function EstimatedTaxWorksheetPage() {
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
      { "@type": "ListItem", position: 3, name: "Estimated Tax Worksheet", item: CANONICAL },
    ],
  };

  const exampleRows: [string, string, number][] = [
    ["1", "Expected AGI (profit − ½ SE tax)", exL1],
    ["2a", "Standard deduction, single", exL2a],
    ["2b", "QBI deduction", exL2b],
    ["2d", "Total deductions", exL2d],
    ["3", "Taxable income", exL3],
    ["4", "Tax from the rate schedule", exL4],
    ["8", "Tax after credits (none)", exL4],
    ["9", "Self-employment tax", exSeTax],
    ["11c", `Total ${YEAR} estimated tax`, exL11c],
    ["12a", "90% of line 11c", exL12a],
    ["12b", `100% of ${PRIOR} tax`, EX.priorTax],
    ["12c", "Required annual payment", exL12c],
    ["13", "Withholding", 0],
    ["14a", "Line 12c − line 13", exL12c],
    ["14b", "Line 11c − line 13", exL11c],
    ["15", "Each quarterly payment", exL15],
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">{YEAR} FORM 1040-ES</div>
        <h1>{YEAR} Estimated Tax Worksheet, Line by Line</h1>
        <div className="hero-intro">
          <p>
            The Estimated Tax Worksheet in Form 1040-ES works out whether you need to pay quarterly estimated tax for{" "}
            {YEAR}, and how much each payment should be. It runs 15 numbered lines: estimate the year&apos;s tax, find the
            smallest amount that avoids a penalty, subtract withholding, and divide by four.
          </p>
        </div>
        <div className="trust-row">
          <span>{YEAR} Form 1040-ES</span>
          <span>All 15 lines</span>
          <span>{YEAR} due dates</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">WHO PAYS</p>
        <h2>Who Needs to Fill Out the {YEAR} Estimated Tax Worksheet</h2>
        <section>
          <p>
            Estimated tax is how income without withholding gets taxed during the year: self-employment profit,
            rental income, interest, dividends, capital gains, alimony from older divorce agreements. You generally
            must pay it for {YEAR} when both of these are true:
          </p>
          <ul className="checklist">
            <li>You expect to owe at least $1,000 after withholding and refundable credits</li>
            <li>Withholding and credits will cover less than 90% of {YEAR} tax or 100% of {PRIOR} tax, whichever is smaller</li>
          </ul>
          <p>
            You owe nothing for {YEAR} if you were a US citizen or resident all of {PRIOR} and had no tax liability for
            that full year. The worksheet tests both conditions for you on lines 14a and 14b.
          </p>
        </section>
      </article>

      <article className="long-seo" id="line-by-line">
        <p className="kicker">LINE BY LINE</p>
        <h2>The {YEAR} Estimated Tax Worksheet, Every Line</h2>
        <section>
          <p>
            Lines 1–11c estimate your {YEAR} tax from the top down, the same order as Form 1040. Lines 12a–12c set the
            minimum you have to prepay. Lines 13–15 subtract withholding and give you the quarterly figure.
          </p>
          <div className="table-wrap wrap">
            <table>
              <thead><tr><th>Line</th><th>What it asks</th><th>How to fill it in</th></tr></thead>
              <tbody>
                {LINES.map(([line, ask, how]) => (
                  <tr key={line} id={`line-${line}`} className={line === "12c" || line === "15" ? "rate-total" : undefined}>
                    <td><strong>{line}</strong></td>
                    <td>{ask}</td>
                    <td>{how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Line 4 is where most mistakes happen. Taxing qualified dividends and long-term gains at ordinary rates
            overstates your estimate. Run them through the{" "}
            <a className="text-link" href="/qualified-dividends-and-capital-gain-tax-worksheet">Qualified Dividends and
            Capital Gain Tax Worksheet</a>, which <a className="text-link" href="/publication-505">Publication 505</a>{" "}
            reprints as Worksheet 2-7 for estimated tax. For self-employment tax on line 9, the{" "}
            <a className="text-link" href="/self-employment-tax-calculator">self-employment tax calculator</a> gives the
            figure for your profit.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WORKED EXAMPLE</p>
        <h2>{YEAR} Estimated Tax Worksheet Example: a Freelancer</h2>
        <section>
          <p>
            A single freelancer expects {money(EX.profit)} of net profit in {YEAR}, has no other income and no
            withholding, and owed {money(EX.priorTax)} on last year&apos;s return with AGI under $150,000.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Line</th><th>What it is</th><th>Amount</th></tr></thead>
              <tbody>
                {exampleRows.map(([line, label, value]) => (
                  <tr key={line} className={line === "15" ? "rate-total" : undefined}>
                    <td><strong>{line}</strong></td>
                    <td>{label}</td>
                    <td>{money(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The estimated {YEAR} tax is {money(exL11c)}, and 90% of that is {money(exL12a)}. Last year&apos;s{" "}
            {money(EX.priorTax)} is smaller, so it becomes the required payment: {money(exL15)} a quarter. That avoids
            the penalty, but about {money(exL11c - exL12c)} will still be due in April {NEXT}, so it is worth setting
            aside.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            Self-employment tax is 15.3% of 92.35% of profit, with Social Security capped at the {money(SS_WAGE_BASE)}{" "}
            {YEAR} wage base. The QBI deduction is taken as 20% of qualified business income, limited to 20% of taxable
            income before the deduction.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">DUE DATES</p>
        <h2>{YEAR} Estimated Tax Due Dates</h2>
        <section>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Payment</th><th>Due</th><th>Covers income earned</th></tr></thead>
              <tbody>
                {DUE_DATES.map(([n, due, period]) => (
                  <tr key={n}><td><strong>{n}</strong></td><td>{due}</td><td>{period}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            You can skip the January payment if you file your {YEAR} return by February 1, {NEXT} and pay the whole
            balance with it. Paying late or too little triggers an underpayment penalty, figured on Form 2210, which
            works like interest on each quarter&apos;s shortfall. If your income arrives unevenly, the annualized method
            in Publication 505 (Worksheet 2-9) can lower the early payments.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>{YEAR} Estimated Tax Worksheet FAQ</h2>
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
            Line wording, the safe-harbor percentages and the due dates follow the {YEAR}{" "}
            <a className="text-link" href="https://www.irs.gov/forms-pubs/about-form-1040-es" target="_blank" rel="noopener noreferrer">
              Form 1040-ES
            </a>
            . Tax rates and the standard deduction are from{" "}
            <a className="text-link" href={capitalGains.source.url} target="_blank" rel="noopener noreferrer">
              {capitalGains.source.label}
            </a>
            . Worksheet numbers refer to{" "}
            <a className="text-link" href="https://www.irs.gov/publications/p505" target="_blank" rel="noopener noreferrer">
              Publication 505 ({YEAR})
            </a>
            .
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> a planning guide, not tax advice. The example ignores state tax, the
            self-employed health insurance deduction and retirement contributions.
          </p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Rules current for tax year {YEAR}</small></p>
        </div>
      </article>

      <WorksheetCluster current={PATH} />

      <SiteFooter />
    </main>
  );
}

