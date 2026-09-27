import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import GrossUpCalculator from "../components/GrossUpCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "gross-up-calculator",
  title: "Gross Up Calculator 2026 — Net to Gross Pay",
  description:
    "Free gross up calculator. Work out the gross payment needed for an employee to net an exact amount after federal, FICA and state withholding in 2026.",
  crumb: "Gross-Up Calculator",
  appName: "Gross-Up Calculator",
  faqs: [
    {
      q: "How do you calculate a gross-up?",
      a: "Divide the target net by 1 minus the total withholding rate. To net $1,000 with 22% federal, 7.65% FICA and no state tax, the total rate is 29.65%, so the gross is $1,000 ÷ 0.7035 = $1,421.46. You cannot simply add 29.65% — that gives $1,296.50 and leaves the employee short.",
    },
    {
      q: "Why does adding the tax percentage not work?",
      a: "Because the tax is charged on the larger grossed-up figure, not on the net. Adding 30% to $1,000 gives $1,300, but 30% of $1,300 is $390, leaving $910 — not $1,000. Division accounts for the tax on the tax; addition does not.",
    },
    {
      q: "What is the supplemental withholding rate for bonuses?",
      a: "22% for supplemental wages up to $1,000,000 in a calendar year. Anything above $1,000,000 is withheld at 37%. Employers can instead use the aggregate method, combining the bonus with regular wages and withholding as though it were one larger paycheck.",
    },
    {
      q: "When do employers gross up a payment?",
      a: "Whenever a specific net amount has been promised — signing bonuses, relocation and moving expenses, taxable fringe benefits, expatriate tax equalisation, and legal settlements. It is also used to make an employee whole when a taxable benefit would otherwise cost them money.",
    },
    {
      q: "Does grossing up cost the employer more?",
      a: "Yes, and by more than the tax itself. Grossing a $1,000 net to $1,421 costs the employer $421 extra in wages, plus the employer's own 7.65% FICA on the larger gross. Payroll budgets that assume the net figure will fall short.",
    },
    {
      q: "Is a grossed-up bonus taxed differently at filing?",
      a: "No. The 22% supplemental rate is a withholding convention, not a tax rate. At filing, the bonus is ordinary income taxed at your marginal rate. If your marginal rate is below 22% you get the difference refunded; above it, you owe more.",
    },
    {
      q: "Should FICA be included in the gross-up?",
      a: "Usually yes, because Social Security and Medicare come out of a bonus like any other wage. The exception is an employee who has already passed the $184,500 Social Security wage base — then only the 1.45% Medicare portion applies, and including the full 7.65% would over-gross the payment.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function GrossUpCalculatorPage() {
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
        <span>Gross-Up Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">NET TO GROSS · 2026</div>
        <h1>Gross Up Calculator</h1>
        <p className="hero-copy">
          When someone has been promised an exact amount in hand, payroll has to run a larger
          gross so the net lands on target. This <strong>gross up calculator</strong> works
          backwards from the net through federal, FICA and state withholding to the gross figure —
          and shows what the extra costs the employer. The same tool serves as a gross up payroll
          calculator, a gross up paycheck calculator and a gross up bonus calculator.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <GrossUpCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">THE FORMULA</p>
        <h2>Gross-Up Is Division, Not Addition</h2>
        <section>
          <p>
            The formula is <strong>gross = net ÷ (1 − total tax rate)</strong>. The instinct to add
            the tax percentage to the net is wrong, and it is wrong in a direction that leaves the
            employee short every time.
          </p>
          <p>
            Take a $1,000 net with 22% federal supplemental, 7.65% FICA and no state tax — a 29.65%
            total. Adding 29.65% gives $1,296.50. Withholding 29.65% of that leaves $912.19, which
            is $87.81 short. Dividing instead gives $1,421.46, and 29.65% of that leaves exactly
            $1,000.
          </p>
          <h3>Gross-up at common net amounts</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Target net</th>
                  <th>Gross (22% + FICA)</th>
                  <th>Employer cost above net</th>
                  <th>Gross (22% + FICA + 5% state)</th>
                </tr>
              </thead>
              <tbody>
                {[500, 1000, 2500, 5000, 10000].map((net) => {
                  const g1 = net / (1 - 0.2965);
                  const g2 = net / (1 - 0.3465);
                  const f = (n: number) =>
                    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
                  return (
                    <tr key={net}>
                      <td>{f(net)}</td>
                      <td>{f(g1)}</td>
                      <td>{f(g1 - net)}</td>
                      <td>{f(g2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHEN IT IS USED</p>
        <h2>Where Gross-Ups Show Up in Payroll</h2>
        <section>
          <p>
            A gross-up is the answer whenever a net figure has been promised rather than a gross
            one. The common cases:
          </p>
          <ul className="checklist">
            <li><strong>Signing and retention bonuses</strong> — &ldquo;$10,000 in your account&rdquo; means a gross near $14,200</li>
            <li><strong>Relocation and moving costs</strong> — taxable to the employee since 2018, so reimbursing the invoice alone leaves them out of pocket</li>
            <li><strong>Taxable fringe benefits</strong> — a gift card or a prize that would otherwise create a tax bill the employee did not ask for</li>
            <li><strong>Tax equalisation</strong> — keeping an employee on assignment abroad in the same net position as at home</li>
            <li><strong>Settlements</strong> — where a net number was agreed in negotiation</li>
          </ul>
          <p>
            The budgeting mistake is planning for the net. A grossed-up $10,000 costs closer to
            $14,200 in wages, plus the employer&apos;s own 7.65% FICA on that larger figure —
            roughly $15,300 in total.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">GETTING THE RATE RIGHT</p>
        <h2>Which Rates Belong in the Calculation</h2>
        <section>
          <p>
            A gross-up is only as accurate as the rate you feed it. Three things routinely throw it
            off:
          </p>
          <p>
            <strong>The Social Security wage base.</strong> Once an employee passes $184,500 in
            wages for the year, the 6.2% Social Security portion stops. Grossing up at the full
            7.65% after that point over-pays. Switch the FICA setting above to exclude it.
          </p>
          <p>
            <strong>Supplemental versus marginal.</strong> The 22% flat rate is what payroll
            withholds, not what the employee ultimately pays. Someone in the 32% bracket will owe
            more at filing, so a gross-up calculated at 22% makes them whole on the day but not on
            the return. Where the promise is about the final position rather than the deposit, use
            their marginal rate instead.
          </p>
          <p>
            <strong>State and local tax.</strong> Rates range from nothing to over 10%, and some
            cities add their own. The state field above takes a flat percentage; for a precise
            figure by state, use the <a href="/">paycheck calculator</a>.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>Gross-Up Calculator — Frequently Asked Questions</h2>
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
            <li><a href="/">Paycheck Calculator — take-home pay by state</a></li>
            <li><a href="/tax-on-commission">Tax on Commission and Bonus Payments</a></li>
            <li><a href="/severance-pay-tax-calculator">Severance and PTO Payout Tax Calculator</a></li>
            <li><a href="/overtime-calculator">Overtime Calculator</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
