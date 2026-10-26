import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "what-is-annual-income",
  title: "What Is Annual Income? How to Find Yours (2026)",
  description:
    "Annual income means your total earnings for a year. Learn what counts, how to find annual income from an hourly wage or pay stub, and gross vs net.",
  crumb: "What Is Annual Income",
  faqs: [
    {
      q: "What is annual income?",
      a: "Annual income is the total money you earn in a 12-month period, before or after tax depending on which figure is being asked for. Gross annual income is everything you earn before deductions; net annual income — take-home income — is what remains after tax and other withholding. Unless a form says otherwise, it is asking for gross.",
    },
    {
      q: "Is annual income yearly?",
      a: "Yes, they mean the same thing. Annual income, yearly income and yearly salary all describe earnings over a 12-month span. The period is not always the calendar year — a lender may mean the last 12 months, and a business may use a fiscal year that starts in another month.",
    },
    {
      q: "How do I find my annual income?",
      a: "From a salary, it is the salary itself. From an hourly wage, multiply the rate by hours worked per week and then by 52 — $25 an hour at 40 hours is $52,000. From a pay stub, take the year-to-date gross, divide by the number of pay periods already paid, and multiply by the periods in a full year.",
    },
    {
      q: "Does annual income mean before or after taxes?",
      a: "Before taxes, in almost every context. Job listings, loan applications, rental applications and tax forms all mean gross annual income. Net annual income is normally labelled explicitly as take-home pay or net income. If a form is ambiguous, gross is the safer assumption.",
    },
    {
      q: "What is total annual income?",
      a: "Everything you earned from all sources in the year, not just your main job — wages, self-employment profit, bonuses, commission, tips, overtime, interest, dividends, rental income, and taxable benefits. A second job or freelance work counts. For most tax purposes this total is what leads to adjusted gross income.",
    },
    {
      q: "What is the difference between annual income and annual salary?",
      a: "Salary is the fixed amount an employer agrees to pay for the year. Annual income is broader — salary plus overtime, bonuses, commission and anything else you earn. Someone on a $60,000 salary who earns $8,000 in commission has a $60,000 annual salary and a $68,000 annual income.",
    },
    {
      q: "What is take home income?",
      a: "Take-home income is your annual income after federal income tax, Social Security, Medicare, state and local tax, and payroll deductions such as health premiums and retirement contributions. Most full-time workers take home roughly 70–80% of gross, depending on state and deduction choices.",
    },
    {
      q: "What does annual income mean?",
      a: "Annual income means the total amount you earn over a 12-month period. The annual income definition covers wages, salary, overtime, bonuses, commission, tips and any other earnings — not just your base pay. Used without qualification it means gross annual income, the figure before tax and deductions.",
    },
    {
      q: "What is gross annual income, and how do I calculate it?",
      a: "Gross annual income is everything you earn in a year before anything is taken out. To calculate gross annual income from an hourly wage, multiply the rate by hours per week and then by 52. From a salary, it is the salary itself. From a pay stub, divide year-to-date gross by pay periods already paid and multiply by the periods in a full year.",
    },
    {
      q: "What is gross salary and is gross salary before taxes?",
      a: "Gross salary is the agreed annual figure before any deduction — yes, it is before taxes. Your monthly gross salary is that figure divided by 12. What reaches your account is net salary, typically 70–80% of gross once federal tax, Social Security, Medicare, state tax and benefit deductions have come out.",
    },
    {
      q: "What is gross annual pay and what does gross pay mean?",
      a: "Gross pay means pay before deductions, for any period. Gross annual pay is the yearly version; gross pay on a weekly stub is that week's earnings before tax. Every pay stub shows gross at the top and net at the bottom, with the deductions that separate them listed in between.",
    },
    {
      q: "How do you define yearly income?",
      a: "Yearly income is defined the same way as annual income — total earnings across 12 months. A yearly salary definition is narrower: it refers only to the fixed amount an employer pays, excluding overtime, bonuses and commission that still count toward yearly income.",
    },
    {
      q: "How do I find gross salary or work out annual income from monthly pay?",
      a: "Multiply monthly gross by 12. Going the other way, to calculate monthly income from a yearly salary, divide the annual figure by 12 — note this differs from pay-period income if you are paid biweekly, because 26 cheques do not divide evenly into 12 months.",
    },
    {
      q: "How do I calculate annual income from a biweekly paycheck?",
      a: "Multiply gross biweekly pay by 26, not by 24. Biweekly means every two weeks, which produces 26 cheques a year — two months contain three pay dates. Using 24 understates annual income by roughly 8%, a mistake that shows up often on loan applications.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

const ROWS = [
  { rate: 15, h: 40 },
  { rate: 20, h: 40 },
  { rate: 25, h: 40 },
  { rate: 30, h: 40 },
  { rate: 40, h: 40 },
  { rate: 50, h: 40 },
];

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function WhatIsAnnualIncomePage() {
  const schemas = standaloneSchemas(SEO);
  return (
    <main>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <span>What Is Annual Income</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">PAY TERMS EXPLAINED · 2026</div>
        <h1>What Is Annual Income?</h1>
        <p className="hero-copy">
          <strong>Annual income means</strong> the total you earn over a 12-month period. The word
          that decides everything is the one usually left off: gross or net. This page covers what
          counts, how to find annual income from an hourly wage or a pay stub, and where the
          definition shifts depending on who is asking.
        </p>
      </section>

      <article className="long-seo">
        <p className="kicker">DEFINITION</p>
        <h2>Annual Income, Defined</h2>
        <section>
          <p>
            Annual income is your total earnings across a year. <strong>Gross annual income</strong>{" "}
            is the figure before anything is taken out. <strong>Net annual income</strong> — take-home
            income — is what remains after tax and deductions.
          </p>
          <p>
            Nearly every form that asks for annual income wants the gross figure: job listings,
            mortgage applications, rental applications, credit card applications and tax forms.
            Net is normally labelled as such. When a field just says &ldquo;annual income&rdquo;
            with no qualifier, enter gross.
          </p>
          <p>
            &ldquo;Annual&rdquo; and &ldquo;yearly&rdquo; are interchangeable — a{" "}
            <strong>yearly salary definition</strong> and an annual salary definition describe the
            same number. What varies is which 12 months. A calendar year runs January to December;
            a lender may mean the trailing 12 months; a company&apos;s fiscal year might start in
            April or October.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT COUNTS</p>
        <h2>Total Annual Income Includes More Than Salary</h2>
        <section>
          <p>
            <strong>Total annual income means</strong> everything you earned, not just your main
            job. On a tax return this total is the starting point for adjusted gross income.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Counts toward annual income?</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Salary or hourly wages</td><td>Yes — the core of it</td></tr>
                <tr><td>Overtime, bonuses, commission, tips</td><td>Yes, in the year received</td></tr>
                <tr><td>Self-employment or freelance profit</td><td>Yes — profit after expenses, not gross receipts</td></tr>
                <tr><td>Interest and dividends</td><td>Yes</td></tr>
                <tr><td>Rental income</td><td>Yes, net of allowable expenses</td></tr>
                <tr><td>Unemployment benefits</td><td>Yes — taxable federally</td></tr>
                <tr><td>Most gifts and inheritances</td><td>No — not income to the recipient</td></tr>
                <tr className="rate-total"><td><strong>Employer 401(k) match</strong></td><td><strong>No — not current taxable income to you</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The distinction that catches self-employed people is profit versus revenue. A
            freelancer who invoiced $90,000 and spent $20,000 on legitimate business costs has
            $70,000 of annual income, not $90,000.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">HOW TO FIND IT</p>
        <h2>How to Find Annual Income</h2>
        <section>
          <h3>From an hourly wage</h3>
          <p>
            Multiply the hourly rate by hours worked per week, then by 52. Full-time at 40 hours
            means 2,080 hours a year, so the shortcut is <strong>rate × 2,080</strong>.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Hourly rate</th>
                  <th>Hours/week</th>
                  <th>Annual income (gross)</th>
                  <th>Roughly take-home</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => {
                  const annual = r.rate * r.h * 52;
                  return (
                    <tr key={r.rate}>
                      <td>${r.rate.toFixed(2)}</td>
                      <td>{r.h}</td>
                      <td>{money(annual)}</td>
                      <td>{money(annual * 0.78)} – {money(annual * 0.85)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h3>From a salary</h3>
          <p>
            The salary is the annual income, assuming you work the full year. Starting in July on
            a $60,000 salary means $30,000 of annual income for that calendar year — which is what
            a tax return will show, even though the job pays $60,000.
          </p>
          <h3>From a pay stub</h3>
          <p>
            Take year-to-date gross, divide by the number of pay periods already paid, and
            multiply by the periods in a full year — 52 weekly, 26 biweekly, 24 semimonthly, 12
            monthly. The <a href="/ytd-calculator">YTD calculator</a> does this for you.
          </p>
          <p>
            Watch the biweekly trap: multiply biweekly gross by <strong>26</strong>, not 24.
            Biweekly means every two weeks and yields 26 cheques; semimonthly means twice a month
            and yields 24. Using the wrong one misstates annual income by about 8%.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">GROSS VS NET</p>
        <h2>Why the Two Figures Differ So Much</h2>
        <section>
          <p>
            Between gross and net sit federal income tax, Social Security at 6.2%, Medicare at
            1.45%, state and local income tax, and voluntary deductions such as health premiums and
            retirement contributions.
          </p>
          <p>
            Most full-time workers keep roughly 70–80% of gross. The spread is driven mostly by
            state — nine states levy no wage income tax at all, while others reach past 10% at the
            top — and by how much you route into pre-tax benefits. Someone contributing 10% to a
            401(k) has a lower take-home figure but a higher total compensation than the deposit
            suggests.
          </p>
          <p>
            For a precise figure rather than a range, run your numbers through the{" "}
            <a href="/">paycheck calculator</a>, which applies 2026 federal and state withholding
            rules line by line.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>Annual Income — Frequently Asked Questions</h2>
        <section>
          {SEO.faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}<span>+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">RELATED</p>
        <h2>More Pay Calculators and Guides</h2>
        <section>
          <ul className="checklist">
            <li><a href="/">Paycheck Calculator — gross to net by state</a></li>
            <li><a href="/ytd-calculator">YTD Calculator — annual income from a pay stub</a></li>
            <li><a href="/hourly-paycheck-calculator">Hourly Paycheck Calculator</a></li>
            <li><a href="/post-tax-deductions">Pre-Tax vs Post-Tax Deductions</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
