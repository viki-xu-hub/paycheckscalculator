import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const CANONICAL = "https://www.paycheckscalculator.org/tax-write-off";

export const metadata: Metadata = {
  title: "Tax Write Off: What It Means and How It Works (2026)",
  description:
    "What does tax write off mean? A simple explanation of tax write-offs, deductions, and how they lower your tax bill. See examples for employees and self-employed workers.",
  alternates: { canonical: "/tax-write-off" },
  openGraph: {
    title: "Tax Write Off: What It Means and How It Works (2026)",
    description:
      "A tax write off (or tax deduction) reduces your taxable income, which lowers the amount of tax you owe. Learn how write-offs work and see common examples.",
    url: CANONICAL,
    type: "article",
  },
};

const FAQS = [
  {
    q: "What does tax write off mean?",
    a: "A tax write off (also called a tax deduction) is an expense that the IRS allows you to subtract from your taxable income. It lowers the amount of income that is subject to tax, which in turn reduces your total tax bill. Common write-offs include charitable donations, mortgage interest, medical expenses, and business expenses.",
  },
  {
    q: "Is a tax write off the same as a tax deduction?",
    a: "Yes, in most cases 'tax write off' is just an informal term for a tax deduction. Both refer to expenses that reduce your taxable income. The term 'write off' is also used in accounting to describe when a business declares an asset as worthless, but in everyday tax talk it means a deduction.",
  },
  {
    q: "How does a tax write off save me money?",
    a: "A write off reduces your taxable income, not your tax bill directly. The actual savings depend on your marginal tax bracket. For example, if you are in the 22% federal bracket and have a $1,000 write off, you save $220 in federal income tax (22% of $1,000). The higher your bracket, the more each write off is worth.",
  },
  {
    q: "What is the difference between a tax write off and a tax credit?",
    a: "A tax write off (deduction) reduces your taxable income, while a tax credit reduces your tax bill dollar for dollar. A $1,000 deduction might save you $220 if you are in the 22% bracket, but a $1,000 tax credit saves you exactly $1,000 in tax. Credits are generally more valuable than deductions of the same size.",
  },
  {
    q: "What are common tax write offs for employees?",
    a: "Common write offs for W-2 employees include the standard deduction ($14,600 single / $29,200 married filing jointly for 2026), charitable contributions, mortgage interest, state and local taxes (SALT, capped at $10,000), medical expenses above 7.5% of AGI, and student loan interest (up to $2,500). Most employees take the standard deduction rather than itemizing.",
  },
  {
    q: "What can self-employed people write off?",
    a: "Self-employed workers and independent contractors can write off a wide range of business expenses including home office (simplified or regular method), supplies, equipment, travel, mileage (67.5¢ per mile for 2026), health insurance premiums, retirement contributions, professional fees, and advertising costs. These are taken on Schedule C.",
  },
  {
    q: "Should I itemize or take the standard deduction?",
    a: "You should itemize if your total deductible expenses (mortgage interest, SALT, charitable gifts, medical, etc.) add up to more than the standard deduction for your filing status. Most taxpayers find the standard deduction is larger, especially after the 2017 tax law changes roughly doubled it. Use IRS Schedule A to add up your itemized deductions and compare.",
  },
  {
    q: "Do tax write offs give you a refund?",
    a: "Tax write offs lower your taxable income, which can increase your refund or reduce the amount you owe. A write off does not directly give you money back — it reduces the amount of tax you owe. If your total tax goes down and you already had enough withheld from your paychecks, the difference comes back as a larger refund.",
  },
];

export default function TaxWriteOffGuide() {
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Tax Write Off: What It Means and How It Works (2026 Guide)",
    description:
      "A plain-English guide to tax write offs (deductions) — what they are, how they lower your tax bill, and the most common write offs for employees and self-employed workers.",
    url: CANONICAL,
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
    image: "https://www.paycheckscalculator.org/og.png",
    datePublished: "2026-09-25",
    dateModified: "2026-09-25",
    inLanguage: "en-US",
    articleSection: "Tax Concepts",
    keywords:
      "tax write off meaning, what is a tax write off, tax deduction explained, how do tax write offs work, itemized vs standard deduction, tax write off examples",
    author: { "@type": "Organization", name: "Paycheck Atlas Editorial Team", url: "https://www.paycheckscalculator.org/about" },
    publisher: { "@type": "Organization", name: "Paycheck Atlas", url: "https://www.paycheckscalculator.org" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.paycheckscalculator.org/blog" },
      { "@type": "ListItem", position: 3, name: "Tax Write Off Guide" },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href="/blog">Blog</a>
        <span aria-hidden="true">›</span>
        <span>Tax Write Off</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">TAX CONCEPTS · 2026</div>
        <h1>What Is a Tax Write Off?</h1>
        <p className="hero-copy">
          A <strong>tax write off</strong> — more formally called a <strong>tax deduction</strong> — is
          an expense the IRS lets you subtract from your income before calculating how much tax you owe.
          The result: less taxable income, and a smaller tax bill. If you have ever wondered "what does
          tax write off mean?" or how write-offs actually save you money, this guide breaks it down in
          plain English with real examples.
        </p>
      </section>

      <article className="long-seo">
        <p className="kicker">DEFINITION</p>
        <h2>Tax Write Off Meaning: A Simple Explanation</h2>
        <section>
          <p>
            The phrase "tax write off" is everyday language for what the IRS calls a <strong>tax deduction</strong>.
            It is an expense that qualifies to be subtracted from your taxable income — the amount of
            income the government actually taxes you on.
          </p>
          <p>
            Think of it this way: if you earned $60,000 this year and had $5,000 in write-offs, the IRS
            only taxes you on $55,000 instead of the full $60,000. You do not get $5,000 back — you pay
            tax on $5,000 less income.
          </p>
          <p>
            The term comes from accounting, where businesses "write off" expenses against revenue on
            their books. Over time, the phrase leaked into everyday speech as a casual name for any
            tax-deductible expense. You will hear people say "I can write that off" or "that is a write
            off" — they usually mean the expense is tax deductible.
          </p>
          <div style={{ background: "#f0f7ff", border: "1px solid #b3d4ff", borderRadius: 12, padding: "20px 24px", marginTop: 20 }}>
            <p style={{ margin: 0, fontWeight: 600, color: "#1a56db" }}>Key idea</p>
            <p style={{ margin: "8px 0 0", color: "#1e40af", lineHeight: 1.6 }}>
              A tax write off reduces <em>taxable income</em>, not your tax bill directly.
              How much you save depends on your <strong>marginal tax bracket</strong>.
            </p>
          </div>

          <h3 style={{ marginTop: 24 }}>Two kinds of write offs</h3>
          <p>
            Not all write offs work the same way. The two main categories are:
          </p>
          <ul className="checklist">
            <li><strong>Above-the-line deductions:</strong> These come off your income before you calculate your adjusted gross income (AGI). Examples include student loan interest, IRA contributions, health savings account contributions, and self-employment expenses. They are valuable because they lower your AGI, which affects many other tax calculations.</li>
            <li><strong>Below-the-line deductions:</strong> These are subtracted after AGI is calculated. They include the standard deduction and itemized deductions (mortgage interest, SALT, charitable gifts, etc.). Most people claim the standard deduction.</li>
          </ul>
        </section>

        <p className="kicker">HOW IT WORKS</p>
        <h2>How Tax Write Offs Actually Save You Money</h2>
        <section>
          <p>
            Because the U.S. uses a <strong>marginal tax system</strong>, write offs come off the top
            of your income — meaning they save tax at your highest rate. Here is a concrete example:
          </p>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "24px", marginTop: 16 }}>
            <p style={{ fontWeight: 600, margin: "0 0 12px" }}>Example: $1,000 tax write off in the 22% bracket</p>
            <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "8px 0", color: "#475569" }}>Income before write off</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>$60,000</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "8px 0", color: "#475569" }}>Minus $1,000 write off</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#dc2626" }}>−$1,000</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "8px 0", color: "#475569" }}>Taxable income</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>$59,000</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "8px 0", color: "#475569" }}>Tax saved (22% × $1,000)</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#16a34a", fontWeight: 600 }}>$220</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16 }}>
            The higher your tax bracket, the more each dollar of write offs is worth. A $1,000 deduction
            saves $100 in the 10% bracket, $220 in the 22% bracket, and $370 in the 37% bracket.
          </p>

          <h3 style={{ marginTop: 24 }}>Tax savings by bracket</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Federal Bracket</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>$1,000 Write Off Saves</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>$5,000 Write Off Saves</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>$10,000 Write Off Saves</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>10%</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$100</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$500</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$1,000</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>12%</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$120</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$600</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$1,200</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>22%</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$220</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$1,100</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$2,200</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>24%</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$240</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$1,200</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$2,400</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>32%</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$320</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$1,600</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$3,200</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 8, fontSize: 13, color: "#667a8a" }}>
            Federal income tax only. State tax deductions may add additional savings depending on your state.
          </p>
        </section>

        <p className="kicker">WRITE-OFFS VS CREDITS</p>
        <h2>Write Off vs. Tax Credit: What's the Difference?</h2>
        <section>
          <p>
            People often mix up write offs and tax credits, but they work very differently and have
            different values. Understanding the difference is key to smart tax planning.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}></th>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Tax Write Off (Deduction)</th>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Tax Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>What it reduces</td>
                <td style={{ padding: "10px" }}>Taxable income</td>
                <td style={{ padding: "10px" }}>Tax bill, dollar for dollar</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>$1,000 value in 22% bracket</td>
                <td style={{ padding: "10px" }}>$220 saved</td>
                <td style={{ padding: "10px" }}>$1,000 saved</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Common examples</td>
                <td style={{ padding: "10px" }}>Mortgage interest, charitable gifts, SALT, business expenses</td>
                <td style={{ padding: "10px" }}>Child Tax Credit, EITC, education credits, premium tax credit</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Refundable?</td>
                <td style={{ padding: "10px" }}>Never — they only reduce tax owed</td>
                <td style={{ padding: "10px" }}>Some are refundable (EITC, Child Tax Credit)</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 16 }}>
            Bottom line: <strong>tax credits are generally more valuable</strong> than deductions of the
            same size because they reduce your tax bill dollar for dollar. That said, write offs are much
            more common and widely available — almost everyone can claim at least the standard deduction.
          </p>
        </section>

        <p className="kicker">STANDARD vs ITEMIZED</p>
        <h2>Standard Deduction vs. Itemized Deductions</h2>
        <section>
          <p>
            Every taxpayer gets an automatic write off called the <strong>standard deduction</strong>.
            It is a flat amount based on your filing status that requires no receipts or documentation.
            Alternatively, you can <strong>itemize</strong> — meaning you add up all your individual
            deductible expenses and claim that total instead.
          </p>

          <h3 style={{ marginTop: 16 }}>2026 standard deduction amounts</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Filing Status</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>2026 Standard Deduction</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Single</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$14,600</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>Married Filing Jointly</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$29,200</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Head of Household</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$21,900</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>Married Filing Separately</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$14,600</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 8, fontSize: 13, color: "#667a8a" }}>
            Additional standard deduction amounts apply for taxpayers who are 65 or older or blind.
          </p>

          <h3 style={{ marginTop: 24 }}>Common itemized write offs (Schedule A)</h3>
          <p>
            You should itemize only if your total itemized deductions exceed the standard deduction.
            The most common itemized write offs include:
          </p>
          <ul className="checklist">
            <li><strong>State and local taxes (SALT):</strong> State income tax (or sales tax) plus property tax — capped at $10,000 total per return</li>
            <li><strong>Mortgage interest:</strong> Interest on up to $750,000 of home mortgage debt ($375,000 for married filing separately)</li>
            <li><strong>Charitable contributions:</strong> Cash and non-cash donations to qualified 501(c)(3) organizations — up to 60% of AGI for cash gifts</li>
            <li><strong>Medical expenses:</strong> Out-of-pocket medical, dental, and vision costs above 7.5% of your adjusted gross income</li>
            <li><strong>Casualty and theft losses:</strong> Only from federally declared disasters</li>
            <li><strong>Gambling losses:</strong> Up to the amount of gambling winnings reported</li>
          </ul>
          <p>
            About <strong>9 out of 10 taxpayers</strong> take the standard deduction because it is larger
            than their itemized total and requires no record-keeping. The Tax Cuts and Jobs Act of 2017
            roughly doubled the standard deduction, which dramatically reduced the number of people
            who itemize.
          </p>
        </section>

        <p className="kicker">EMPLOYEE WRITE OFFS</p>
        <h2>Common Tax Write Offs for Employees</h2>
        <section>
          <p>
            If you are a W-2 employee, your write off options are more limited than they used to be.
            The 2017 tax law eliminated most miscellaneous itemized deductions for employees, including
            unreimbursed work expenses, home office deductions, and union dues.
          </p>
          <p>
            But there are still valuable write offs available to employees:
          </p>
          <ul className="checklist">
            <li><strong>401(k) contributions:</strong> Traditional 401(k) contributions come out pre-tax, directly reducing your taxable income</li>
            <li><strong>Health Savings Account (HSA):</strong> Contributions are pre-tax for federal, FICA, and most state taxes — a triple tax advantage</li>
            <li><strong>Flexible Spending Account (FSA):</strong> Health and dependent care FSAs use pre-tax dollars</li>
            <li><strong>Student loan interest:</strong> Up to $2,500 per year in student loan interest — even if you take the standard deduction</li>
            <li><strong>Traditional IRA contributions:</strong> May be deductible depending on income and whether you have a workplace plan</li>
            <li><strong>Educator expenses:</strong> Up to $300 ($600 if both spouses are educators) for classroom supplies</li>
          </ul>
          <p>
            The biggest write offs for most employees happen through <strong>payroll deductions</strong> —
            401(k), HSA, and FSA contributions come out of your paycheck before taxes are calculated.
            You can see the impact on your take-home pay using a <a href="/">paycheck calculator</a> that
            accounts for pre-tax deductions.
          </p>
        </section>

        <p className="kicker">SELF-EMPLOYED WRITE OFFS</p>
        <h2>Tax Write Offs for Self-Employed Workers</h2>
        <section>
          <p>
            If you are self-employed (freelancer, contractor, small business owner), you have far more
            write off options than a typical W-2 employee. Business expenses are deducted on
            <strong> Schedule C</strong> and come off your income before you even get to the standard
            deduction vs. itemized choice.
          </p>

          <h3 style={{ marginTop: 16 }}>Top self-employment write offs</h3>
          <ul className="checklist">
            <li><strong>Home office deduction:</strong> Simplified method ($5/sq ft, up to 300 sq ft = $1,500) or regular method (percentage of home used for business)</li>
            <li><strong>Vehicle expenses:</strong> Standard mileage rate (67.5¢ per mile for 2026) or actual expenses method</li>
            <li><strong>Supplies and equipment:</strong> Office supplies, tools, computers, phones, software</li>
            <li><strong>Travel and meals:</strong> Business travel (100%) and business meals (50%)</li>
            <li><strong>Health insurance premiums:</strong> Medical, dental, and long-term care premiums (subject to rules)</li>
            <li><strong>Retirement contributions:</strong> SEP-IRA, Solo 401(k), SIMPLE IRA</li>
            <li><strong>Professional services:</strong> Accounting, legal, consulting fees</li>
            <li><strong>Marketing and advertising:</strong> Website costs, ads, business cards, branding</li>
            <li><strong>Self-employment tax deduction:</strong> Deduct half of your self-employment tax (15.3%) from your income</li>
            <li><strong>Qualified Business Income (QBI) deduction:</strong> Extra 20% deduction on qualified business income</li>
          </ul>
          <p>
            The QBI deduction is especially valuable — it is an additional 20% write off on net business
            income for most pass-through businesses, available regardless of whether you itemize or take
            the standard deduction. It was introduced by the 2017 tax law and is currently scheduled to
            expire after 2025, though Congress may extend it.
          </p>
        </section>

        <p className="kicker">MYTHS</p>
        <h2>Common Tax Write Off Myths Debunked</h2>
        <section>
          <ul className="checklist">
            <li><strong>Myth: "Write offs are free money."</strong> Reality: A write off reduces your tax bill, but you still spent the money. A $100 expense might save you $22 in tax, but you still paid $100 — so you are $78 out of pocket, not ahead.</li>
            <li><strong>Myth: "You can write off anything if you have a business."</strong> Reality: Business expenses must be both "ordinary and necessary" — meaning common in your industry and helpful for running the business. The IRS scrutinizes lavish or personal expenses.</li>
            <li><strong>Myth: "Taking a write off triggers an audit."</strong> Reality: Claiming legitimate deductions does not by itself increase audit risk. The IRS uses statistical formulas, and most audits target unreported income or unusually high deductions relative to income.</li>
            <li><strong>Myth: "You need a receipt for every write off."</strong> Reality: You need documentation, but it does not have to be a paper receipt. Bank statements, credit card statements, invoices, and calendar logs can all serve as proof. Mileage can be tracked with an app.</li>
            <li><strong>Myth: "Charitable donations are always 100% deductible."</strong> Reality: Cash donations are generally deductible up to 60% of your AGI, but only if you itemize. Most people who take the standard deduction get no tax benefit from charitable giving.</li>
          </ul>
        </section>
      </article>

      {/* FAQ */}
      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Tax Write Offs — Frequently Asked Questions</h2>
        {FAQS.map((f, i) => (
          <details key={i}>
            <summary>{f.q}<span>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      {/* Related */}
      <article className="long-seo">
        <p className="kicker">RELATED GUIDES</p>
        <h2>More Tax Guides &amp; Calculators</h2>
        <section>
          <div className="tool-links">
            <a href="/hsa-calculator">
              <b>HSA Calculator</b>
              <span>See how much you save with pre-tax HSA contributions →</span>
            </a>
            <a href="/dependent-care-fsa">
              <b>Dependent Care FSA Guide</b>
              <span>Eligible expenses, limits, and tax savings →</span>
            </a>
            <a href="/how-much-tax-is-taken-from-my-paycheck">
              <b>How Much Tax Is Taken Out of My Paycheck?</b>
              <span>Interactive guide to federal withholding, FICA, and pre-tax deductions →</span>
            </a>
            <a href="/methodology">
              <b>Calculation Methodology</b>
              <span>Sources and methods behind every calculator on this site →</span>
            </a>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
