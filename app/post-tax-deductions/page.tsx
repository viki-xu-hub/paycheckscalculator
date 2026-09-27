import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "post-tax-deductions",
  title: "Post-Tax Deductions vs Pre-Tax — 2026 Guide",
  description:
    "What post-tax deductions are, how they differ from pre-tax deductions, which payroll items fall in each group, and why the order on your pay stub matters.",
  crumb: "Post-Tax Deductions",
  faqs: [
    {
      q: "What are post-tax deductions?",
      a: "Amounts taken from your pay after taxes have been calculated and withheld. They reduce the cash you receive but not your taxable income. Roth 401(k) contributions, wage garnishments, union dues, most disability premiums and charitable payroll giving are typical examples.",
    },
    {
      q: "What is the difference between pre-tax and post-tax deductions?",
      a: "Pre-tax deductions come out before tax is calculated, so they lower your taxable income and your tax bill. Post-tax deductions come out afterwards and have no effect on tax. A $200 pre-tax deduction might cost you around $150 of take-home pay; a $200 post-tax deduction costs the full $200.",
    },
    {
      q: "Which payroll deductions are pre-tax?",
      a: "Traditional 401(k) and 403(b) contributions, health, dental and vision premiums under a Section 125 plan, HSA and FSA contributions, dependent care FSA, and commuter benefits. Health premiums under a Section 125 plan also avoid Social Security and Medicare — traditional 401(k) contributions do not.",
    },
    {
      q: "Is a Roth 401(k) a post-tax deduction?",
      a: "Yes. Roth contributions come out after tax, so they do not lower your current taxable income. The trade is at the other end: qualified withdrawals in retirement, including all investment growth, are tax-free, whereas traditional 401(k) withdrawals are taxed as ordinary income.",
    },
    {
      q: "Do post-tax deductions reduce Social Security and Medicare tax?",
      a: "No. They come out after all taxes are calculated, so FICA is unaffected. Only certain pre-tax deductions reduce FICA — chiefly Section 125 health premiums, HSA contributions through payroll, and FSAs. Traditional 401(k) contributions reduce income tax but not FICA.",
    },
    {
      q: "Are wage garnishments pre-tax or post-tax?",
      a: "Post-tax, always. Garnishments for child support, tax levies, student loan defaults and court judgments are calculated from disposable earnings — pay after legally required withholding — and come out after tax. Federal law caps how much can be taken, with the limits varying by garnishment type.",
    },
    {
      q: "What are deductions on a paycheck?",
      a: "Everything subtracted between gross pay and net pay. They fall into three groups: taxes (federal income tax, Social Security, Medicare, state and local tax), pre-tax benefit deductions such as 401(k) and health premiums, and post-tax deductions such as Roth contributions, union dues and garnishments.",
    },
    {
      q: "What is pre-tax income and how do I calculate it?",
      a: "Pre-tax income is your pay before tax is applied. To calculate pre-tax income for a paycheck, take gross pay and subtract only the pre-tax deductions — 401(k), Section 125 premiums, HSA and FSA. The result is the figure your tax is actually computed on, which is why the annual pre tax income in W-2 Box 1 is smaller than your salary. To find pretax income for a year, start from gross annual pay and subtract the year's pre-tax deductions.",
    },
    {
      q: "Why does the order of deductions matter on a pay stub?",
      a: "Because each pre-tax deduction shrinks the base the next tax is calculated on. Payroll runs a fixed sequence: gross pay, then pre-tax deductions, then taxes on what remains, then post-tax deductions. A benefit moved from the post-tax group to the pre-tax group changes your tax, not just the label.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function PostTaxDeductionsPage() {
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
        <span>Post-Tax Deductions</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">PAYROLL DEDUCTIONS · 2026</div>
        <h1>Post-Tax Deductions vs Pre-Tax Deductions</h1>
        <p className="hero-copy">
          <strong>Post tax deductions</strong> come out of your pay after tax has already been
          calculated, so they cost you the full amount. Pre-tax deductions come out first and
          shrink the income your tax is calculated on. Which group a benefit sits in changes what
          it really costs you.
        </p>
      </section>

      <article className="long-seo">
        <p className="kicker">THE ORDER</p>
        <h2>How Payroll Actually Processes a Paycheck</h2>
        <section>
          <p>
            Every paycheck runs through the same four steps, and the sequence is what makes pre-tax
            deductions valuable:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Step</th><th>What happens</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>1</strong></td><td>Start with gross pay — salary, hourly wages, overtime, commission</td></tr>
                <tr><td><strong>2</strong></td><td>Subtract pre-tax deductions — 401(k), Section 125 health premiums, HSA, FSA</td></tr>
                <tr><td><strong>3</strong></td><td>Calculate and withhold taxes on what is left</td></tr>
                <tr className="rate-total"><td><strong>4</strong></td><td><strong>Subtract post-tax deductions → net pay</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            A deduction at step 2 reduces the number step 3 works from. A deduction at step 4 does
            not. That is the entire difference, and it is worth roughly your combined marginal rate
            on every dollar.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHICH IS WHICH</p>
        <h2>Sorting Your Deductions</h2>
        <section>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Deduction</th>
                  <th>Group</th>
                  <th>Reduces income tax?</th>
                  <th>Reduces FICA?</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Traditional 401(k) / 403(b)</td><td>Pre-tax</td><td>Yes</td><td><strong>No</strong></td></tr>
                <tr><td>Health / dental / vision (Section 125)</td><td>Pre-tax</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>HSA via payroll</td><td>Pre-tax</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Health FSA / dependent care FSA</td><td>Pre-tax</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Commuter benefits</td><td>Pre-tax</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Roth 401(k)</td><td>Post-tax</td><td>No</td><td>No</td></tr>
                <tr><td>Union dues</td><td>Post-tax</td><td>No</td><td>No</td></tr>
                <tr><td>Wage garnishments</td><td>Post-tax</td><td>No</td><td>No</td></tr>
                <tr><td>Disability insurance premiums</td><td>Usually post-tax</td><td>No</td><td>No</td></tr>
                <tr><td>Charitable payroll giving</td><td>Post-tax</td><td>No</td><td>No</td></tr>
                <tr className="rate-total"><td><strong>Life insurance over $50,000</strong></td><td><strong>Post-tax</strong></td><td><strong>No — and it adds imputed income</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Two rows deserve attention. <strong>Traditional 401(k) contributions reduce income tax
            but not FICA</strong> — Social Security and Medicare are still charged on the full
            amount, which is why your W-2 Box 1 and Box 3 wages differ. And{" "}
            <strong>disability premiums</strong> are the rare case where paying post-tax is
            usually better: premiums paid with after-tax money make any future benefit payments
            tax-free, while pre-tax premiums make benefits taxable exactly when you need them.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT IT COSTS</p>
        <h2>The Real Price of a $200 Deduction</h2>
        <section>
          <p>
            Take someone in the 22% federal bracket with a 5% state rate. A $200 post-tax deduction
            reduces take-home pay by exactly $200. A $200 pre-tax health premium under a Section
            125 plan reduces income tax by $54 and FICA by $15.30, so take-home falls by about
            $130.70 — the same benefit for roughly a third less.
          </p>
          <p>
            A $200 traditional 401(k) contribution sits in between: it saves the $54 of income tax
            but not the FICA, so take-home falls by about $146. The money is also still yours, just
            moved into the retirement account rather than spent.
          </p>
          <p>
            This is why the pre-tax versus post-tax choice on a benefits form is a real financial
            decision, not paperwork. To see the effect on your own numbers, adjust the pre-tax
            deduction field in the <a href="/">paycheck calculator</a> and watch net pay move.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>Post-Tax Deductions — Frequently Asked Questions</h2>
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
        <h2>More Pay and Benefit Calculators</h2>
        <section>
          <ul className="checklist">
            <li><a href="/">Paycheck Calculator — see deductions line by line</a></li>
            <li><a href="/hsa-calculator">HSA Calculator — pre-tax savings</a></li>
            <li><a href="/dependent-care-fsa">Dependent Care FSA</a></li>
            <li><a href="/what-is-annual-income">What Is Annual Income?</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
