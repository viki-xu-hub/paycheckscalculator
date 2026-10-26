import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import SelfEmploymentTaxCalculator from "../components/SelfEmploymentTaxCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "self-employment-tax-calculator",
  title: "Self Employed Tax Calculator 2026 — 1099 vs W2",
  description:
    "Free self employed tax calculator for 2026. Estimate self-employment tax, federal income tax and quarterly payments on 1099 income — and compare 1099 vs W2.",
  crumb: "Self-Employment Tax Calculator",
  appName: "Self-Employment Tax Calculator",
  faqs: [
    {
      q: "How much tax do I pay on 1099 income?",
      a: "Two separate taxes. Self-employment tax is 15.3% on 92.35% of your net profit — 12.4% for Social Security up to the $184,500 wage base and 2.9% for Medicare with no ceiling. On top of that you owe federal income tax on your profit at ordinary rates. A common rule of thumb is to set aside 25–30% of profit, but the calculator above gives a figure for your actual numbers.",
    },
    {
      q: "What is the self-employment tax rate for 2026?",
      a: "15.3% — 12.4% Social Security plus 2.9% Medicare. It applies to 92.35% of net earnings, not 100%, because you get to subtract the employer-equivalent portion first. High earners add 0.9% Additional Medicare Tax above $200,000 single or $250,000 joint.",
    },
    {
      q: "Why is self-employment tax so high?",
      a: "Because you are paying both halves of FICA. An employee pays 7.65% and the employer quietly pays the other 7.65%. When you work for yourself there is no employer, so both halves land on you. Half of the self-employment tax is deductible against your income tax, which softens it a little.",
    },
    {
      q: "How does 1099 pay compare with W-2 pay?",
      a: "A 1099 rate has to be higher than an equivalent W-2 salary to come out even. You are covering the employer's 7.65% FICA share, and usually health insurance, paid leave and any retirement match too. As a starting point, many contractors add roughly 25–35% to a W-2 equivalent before considering benefits — then check the real numbers, because deductible expenses and the qualified business income deduction can move it either way.",
    },
    {
      q: "Do I have to pay quarterly estimated taxes?",
      a: "Generally yes, if you expect to owe $1,000 or more when you file. Payments are due in April, June, September and January. Missing them triggers an underpayment penalty even if you pay in full at filing. The safe harbour is paying at least 100% of last year's tax — 110% if your prior-year AGI was over $150,000.",
    },
    {
      q: "What can I write off as a 1099 contractor?",
      a: "Ordinary and necessary business expenses: home office, equipment and software, business mileage or actual vehicle costs, professional fees, business insurance, advertising, supplies, and self-employed health insurance premiums. Deductions reduce net profit, which reduces both self-employment tax and income tax, so they are worth more to a contractor than to an employee.",
    },
    {
      q: "What is the qualified business income deduction?",
      a: "A deduction of up to 20% of qualified business income for many pass-through businesses, including sole proprietors. It reduces income tax but not self-employment tax, and it phases out for some service businesses at higher incomes. This calculator does not model it, so your actual income tax may come out lower than shown.",
    },
    {
      q: "What 1099 write offs can I claim?",
      a: "Common 1099 write offs: home office (simplified at $5 per square foot up to 300 sq ft, or actual costs), equipment and software, business mileage, phone and internet apportioned to business use, professional fees, business insurance, advertising, supplies, continuing education, and self-employed health insurance premiums. Tax deductions for self employed workers reduce net profit, so each one cuts both self-employment tax and income tax.",
    },
    {
      q: "Are there self employment tax brackets?",
      a: "No. Unlike income tax, self-employment tax has no brackets — it is a flat 15.3% on 92.35% of net profit, with the 12.4% Social Security half stopping at the $184,500 wage base. Only the income tax layered on top uses brackets. That flatness is why the self employment tax amount can feel heavy at modest profit levels.",
    },
    {
      q: "How does a 1099 hourly rate compare with a W-2 hourly rate?",
      a: "To convert a W-2 hourly rate to a 1099 equivalent, start by adding the 7.65% employer FICA share you will now pay yourself, then add the value of any benefits you lose — health insurance, paid leave, retirement match. A $40 W-2 hour with typical benefits often needs a 1099 rate near $52–$58 to leave you in the same position.",
    },
    {
      q: "Do I pay self-employment tax if I also have a W-2 job?",
      a: "Yes, on the self-employment profit — but your W-2 wages use up the Social Security wage base first. If your salary already exceeds $184,500, the 12.4% Social Security portion does not apply to your side income at all; only the 2.9% Medicare portion does. Enter your W-2 wages above and the calculator accounts for this.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function SelfEmploymentTaxPage() {
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
        <span>Self-Employment Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">1099 &amp; SELF-EMPLOYMENT · 2026</div>
        <h1>Self Employed Tax Calculator</h1>
        <p className="hero-copy">
          Put in your net profit and this <strong>self employed tax calculator</strong> returns
          self-employment tax, federal income tax and what each quarterly estimated payment should
          be. It works as a free self employment tax calculator and a 1099 contractor tax
          estimator. It accounts for the deductible half of SE tax and for W-2 wages that have already
          used up the Social Security wage base.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <SelfEmploymentTaxCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">THE TWO TAXES</p>
        <h2>Self-Employment Tax Is Not Income Tax</h2>
        <section>
          <p>
            Working for yourself means two federal taxes on the same profit, calculated
            separately. Confusing them is the most common reason a first 1099 year ends in a
            surprise bill.
          </p>
          <h3>1. Self-employment tax — 15.3%</h3>
          <p>
            This is Social Security and Medicare for people without an employer. It is{" "}
            <strong>12.4% for Social Security</strong>, capped at the $184,500 wage base for 2026,
            plus <strong>2.9% for Medicare</strong> with no cap at all. It applies to 92.35% of
            net profit rather than the whole amount, which approximates the employer-side
            deduction an employee never sees.
          </p>
          <p>
            Critically, self-employment tax is owed on profit regardless of your deductions,
            credits or filing status. A sole proprietor with $40,000 of profit owes roughly $5,652
            in SE tax before a single dollar of income tax is calculated.
          </p>
          <h3>2. Federal income tax — ordinary rates</h3>
          <p>
            Your profit also flows into adjusted gross income and is taxed on the normal brackets,
            after the standard deduction and after subtracting half your self-employment tax. That
            half-deduction is automatic — you do not need to itemize for it.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">1099 VS W2</p>
        <h2>What a 1099 Rate Has to Cover</h2>
        <section>
          <p>
            Comparing a contract rate with a salary is not a like-for-like comparison. The
            employer side of a W-2 job absorbs costs that a 1099 rate has to absorb instead:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cost</th>
                  <th>W-2 employee</th>
                  <th>1099 contractor</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Social Security + Medicare</td><td>7.65% (employer pays the other half)</td><td><strong>15.3%</strong> — both halves</td></tr>
                <tr><td>Health insurance</td><td>Usually subsidised by employer</td><td>Full premium, though often deductible</td></tr>
                <tr><td>Paid time off</td><td>Paid</td><td>Unpaid — every day off is lost revenue</td></tr>
                <tr><td>Retirement match</td><td>Often 3–6% of salary</td><td>None, but SEP-IRA and solo 401(k) limits are far higher</td></tr>
                <tr><td>Unemployment insurance</td><td>Covered</td><td>Generally not eligible</td></tr>
                <tr className="rate-total"><td><strong>Business expenses</strong></td><td>Rarely deductible since 2018</td><td><strong>Deductible against profit</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The last row is the one that runs in the contractor&apos;s favour. Since unreimbursed
            employee expenses stopped being deductible, a W-2 worker who buys their own laptop
            buys it with after-tax money. A contractor deducts it from profit, which cuts income
            tax and self-employment tax at the same time.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">QUARTERLY PAYMENTS</p>
        <h2>Estimated Taxes and the Safe Harbour</h2>
        <section>
          <p>
            Nobody withholds tax from a 1099 payment, so the IRS expects you to pay as you go.
            Estimated payments are due four times a year — mid-April, mid-June, mid-September and
            mid-January for the previous year&apos;s final quarter.
          </p>
          <p>
            If you expect to owe $1,000 or more, skipping them means an underpayment penalty even
            if you settle the full amount at filing. The reliable way out is the{" "}
            <strong>safe harbour</strong>: pay at least 100% of last year&apos;s total tax (110%
            if your prior-year AGI exceeded $150,000) and you are protected from the penalty
            regardless of how well this year goes.
          </p>
          <p>
            If you also hold a W-2 job, there is a simpler route — increase withholding on the
            W-2 via a new Form W-4. Withholding is treated as paid evenly across the year no
            matter when it happens, so it can retroactively cure an underpayment in a way a late
            estimated payment cannot.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>Self-Employment Tax — Frequently Asked Questions</h2>
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
        <h2>More Pay and Tax Calculators</h2>
        <section>
          <ul className="checklist">
            <li><a href="/">Paycheck Calculator — W-2 take-home pay</a></li>
            <li><a href="/tax-write-off">Tax Write-Offs Explained</a></li>
            <li><a href="/tax-on-commission">Tax on Commission and Bonus Payments</a></li>
            <li><a href="/ytd-calculator">YTD Calculator</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
