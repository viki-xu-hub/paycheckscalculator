import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "tax-on-commission",
  title: "Tax on Commission Payments 2026 — Is It Taxed More?",
  description:
    "How commission is taxed in 2026: the 22% supplemental withholding rate, why commission looks overtaxed, and what you actually owe when you file.",
  crumb: "Tax on Commission",
  faqs: [
    {
      q: "Is commission taxable?",
      a: "Yes. Commission is ordinary wages — fully subject to federal income tax, Social Security, Medicare and state income tax. It appears in the wages box of your W-2 alongside salary, not as a separate category.",
    },
    {
      q: "Is commission taxed at a higher rate than salary?",
      a: "No. It is withheld differently, which makes it look that way. Employers commonly withhold commission at the 22% flat supplemental rate instead of your regular W-4 tables. At filing, commission is taxed at exactly the same marginal rates as salary — so if your rate is below 22%, the excess comes back as a refund.",
    },
    {
      q: "What is the tax rate on commission payments?",
      a: "There is no separate commission tax rate. For withholding, employers use either the 22% flat supplemental rate (37% on supplemental wages above $1,000,000 in a year) or the aggregate method, which combines the commission with your regular pay and withholds on the total. Your actual tax is your ordinary marginal rate.",
    },
    {
      q: "Why was so much taken out of my commission check?",
      a: "Two likely reasons. If the flat method was used, a straight 22% came off the top plus 7.65% FICA and state tax — around 30% before you reach a bracket calculation. If the aggregate method was used, payroll treated the larger combined cheque as if every cheque this year would be that size, which pushes withholding into higher brackets temporarily.",
    },
    {
      q: "Do I pay Social Security and Medicare on commission?",
      a: "Yes, on both. Social Security at 6.2% applies until your total wages reach the $184,500 wage base for 2026; Medicare at 1.45% applies with no ceiling, plus 0.9% more above $200,000 single or $250,000 joint.",
    },
    {
      q: "How is commission taxed for a 1099 contractor?",
      a: "Differently, and more heavily on the payroll side. Nothing is withheld, and the commission is business income subject to self-employment tax at 15.3% on top of income tax. You are responsible for quarterly estimated payments. Business expenses reduce the profit that both taxes apply to.",
    },
    {
      q: "Can I reduce tax on commission income?",
      a: "The levers are the ordinary ones: increase 401(k) or HSA contributions in a high-commission year to cut taxable income, and if commission is lumpy, check mid-year whether withholding is tracking your actual liability. Deferring a commission payment into the next tax year can help if this year pushes you into a higher bracket, but that is usually the employer's decision.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

export default function TaxOnCommissionPage() {
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
        <span>Tax on Commission</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">COMMISSION &amp; BONUS PAY · 2026</div>
        <h1>Tax on Commission Payments</h1>
        <p className="hero-copy">
          Commission is taxable, and it is taxed at the same rates as your salary — but it is
          usually <em>withheld</em> at a flat 22%, which is why a commission cheque so often looks
          as though it has been taxed punitively. The difference between withholding and tax is
          the whole story.
        </p>
      </section>

      <article className="long-seo">
        <p className="kicker">THE SHORT ANSWER</p>
        <h2>Commission Is Taxable — at Ordinary Rates</h2>
        <section>
          <p>
            Commission is wages. It lands in the same W-2 box as salary, it is subject to federal
            income tax, Social Security, Medicare and state tax, and when you file it is taxed on
            the ordinary brackets like every other dollar you earned.
          </p>
          <p>
            What makes commission feel different is that the IRS classes it as{" "}
            <strong>supplemental wages</strong>, alongside bonuses, overtime premiums, severance
            and back pay. Supplemental wages have their own withholding rules — not their own tax
            rates. That single distinction explains almost every complaint about commission being
            &ldquo;taxed more&rdquo;. Commission and taxes only look
            unusual because of how payroll withholds them, not because of how they are ultimately
            taxed.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WITHHOLDING</p>
        <h2>Two Methods, Two Very Different Cheques</h2>
        <section>
          <h3>The flat supplemental method</h3>
          <p>
            The employer withholds a flat <strong>22%</strong> federal tax on the commission,
            separately from regular pay. Above $1,000,000 of supplemental wages in a calendar year,
            the excess is withheld at 37%. Add 7.65% FICA and state tax and roughly 30% of a
            commission cheque disappears before any bracket is considered.
          </p>
          <h3>The aggregate method</h3>
          <p>
            The employer adds the commission to your regular pay for the period and withholds on
            the combined amount using your W-4. This is where the real distortion happens:
            percentage-method withholding annualises the cheque, treating a one-off $10,000
            commission as though you would receive it every period. The system briefly believes you
            earn far more than you do and withholds accordingly.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>$8,000 commission</th>
                  <th>Withheld</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Federal — flat 22%</td>
                  <td>{money(8000 * 0.22)}</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Social Security — 6.2%</td>
                  <td>{money(8000 * 0.062)}</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Medicare — 1.45%</td>
                  <td>{money(8000 * 0.0145)}</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>State — 5% example</td>
                  <td>{money(8000 * 0.05)}</td>
                  <td>—</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>Total</strong></td>
                  <td><strong>{money(8000 * 0.3465)}</strong></td>
                  <td><strong>{money(8000 * 0.6535)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Neither method changes what you owe. Both are prepayments, reconciled on the return.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">AT FILING</p>
        <h2>What You Actually Owe</h2>
        <section>
          <p>
            At filing, commission joins your other income and is taxed at your marginal rate. Three
            outcomes follow, depending on where that rate sits relative to 22%:
          </p>
          <ul className="checklist">
            <li><strong>Marginal rate below 22%</strong> — you over-withheld and the difference comes back as a refund</li>
            <li><strong>Marginal rate at 22%</strong> — roughly even, which is why the rate was chosen</li>
            <li><strong>Marginal rate above 22%</strong> — you under-withheld and will owe, sometimes substantially in a strong commission year</li>
          </ul>
          <p>
            That last case is the one to watch. A salesperson whose commission doubles their income
            can be withheld at 22% all year while owing 32% — a gap that arrives as a bill in April
            along with a possible underpayment penalty. The fix is a mid-year check: compare
            year-to-date withholding against projected liability using the{" "}
            <a href="/ytd-calculator">YTD calculator</a>, and adjust the W-4 if they diverge.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>Commission Tax — Frequently Asked Questions</h2>
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
            <li><a href="/gross-up-calculator">Gross-Up Calculator — net to gross on a bonus</a></li>
            <li><a href="/self-employment-tax-calculator">Self-Employment Tax Calculator</a></li>
            <li><a href="/no-tax-on-overtime">No Tax on Overtime</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
