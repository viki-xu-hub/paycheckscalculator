import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import SeveranceTaxCalculator from "../components/SeveranceTaxCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "severance-pay-tax-calculator",
  title: "Severance Pay Tax Calculator 2026 — PTO Payout",
  description:
    "Free severance package calculator. Estimate tax on severance pay and an accrued PTO or vacation payout, including the 22% supplemental rate and FICA.",
  crumb: "Severance Pay Tax Calculator",
  appName: "Severance Pay Tax Calculator",
  faqs: [
    {
      q: "How is severance pay taxed?",
      a: "As ordinary W-2 wages. Severance is subject to federal income tax, Social Security and Medicare exactly like salary. Employers usually withhold federal tax at the 22% flat supplemental rate rather than running it through your normal W-4, which is why the deposit often looks smaller than expected.",
    },
    {
      q: "Is severance taxed at a higher rate?",
      a: "No — it is withheld differently, which is not the same thing. The 22% supplemental rate is a withholding convention. At filing, severance is ordinary income taxed at your marginal rate. If your rate is below 22% the excess comes back as a refund; if it is above, you will owe the difference.",
    },
    {
      q: "Is a PTO or vacation payout taxed the same as severance?",
      a: "Yes. Accrued vacation or PTO paid out at separation is supplemental wages, taxed as ordinary income and subject to FICA. Some states require the payout; others leave it to company policy. Either way the tax treatment is identical to severance.",
    },
    {
      q: "Do I pay Social Security and Medicare on severance?",
      a: "Yes. Both apply. Social Security stops once your total wages for the year reach the $184,500 wage base, so a large severance late in a high-earning year may escape the 6.2% portion — but Medicare's 1.45% has no ceiling and always applies.",
    },
    {
      q: "Can I reduce the tax on a severance package?",
      a: "Sometimes. Contributing to a traditional 401(k) or IRA in the same year reduces taxable income. Spreading the payment across two tax years can help if it pushes you into a higher bracket, though it is the employer's call and it delays your cash. Health insurance premiums and job-search costs are not deductible for employees under current rules.",
    },
    {
      q: "Does severance affect unemployment benefits?",
      a: "It depends on the state. Some treat severance as wages that delay or reduce benefits for the weeks it covers; others disregard it entirely, particularly when it is paid as a lump sum rather than salary continuation. Check your state's unemployment agency before assuming either way.",
    },
    {
      q: "Are unemployment benefits taxable?",
      a: "Federally, yes — they are ordinary income and go on your return. They are not subject to Social Security or Medicare tax. Withholding is optional and defaults to off, so people who do not opt in are frequently surprised by a balance due. State treatment varies; several states exempt them.",
    },
    {
      q: "Is there a federal severance pay calculator for government employees?",
      a: "The calculator above works for federal employee severance pay as well — the tax treatment is identical to private-sector severance. What differs is the entitlement: federal severance is set by formula from years of service and age, paid as biweekly continuation rather than a lump sum, and capped at 52 weeks over a career. Enter the total you expect to receive in the year and the withholding estimate applies the same way.",
    },
    {
      q: "How is a vacation or PTO payout taxed at a different rate?",
      a: "It is not a different rate — a vacation payout tax calculator and a severance tax calculator do the same arithmetic, because both are supplemental wages. The PTO payout tax rate you see withheld is the 22% flat supplemental rate plus FICA and state tax, not a rate specific to vacation time.",
    },
    {
      q: "How much of a severance package do I keep?",
      a: "Typically 65–75% of the gross, depending on your state and how much you have already earned that year. The calculator above shows the split for your figures — enter wages already paid this year so it can tell whether the Social Security wage base has been reached.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function SeverancePayTaxPage() {
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
        <span>Severance Pay Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">SEVERANCE &amp; PTO PAYOUT · 2026</div>
        <h1>Severance Package Calculator — Tax on Separation Pay</h1>
        <p className="hero-copy">
          A severance offer is quoted in gross, but what matters is the deposit. This{" "}
          <strong>severance package calculator</strong> estimates federal withholding, FICA and
          state tax on severance plus any accrued PTO payout — and accounts for whether you have
          already passed the Social Security wage base this year.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <SeveranceTaxCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">HOW IT IS TAXED</p>
        <h2>Severance Is Ordinary Wages</h2>
        <section>
          <p>
            There is no special tax category for severance. It is W-2 wages: ordinary income tax,
            Social Security at 6.2%, Medicare at 1.45%, and state income tax where you live. It is
            not a gift, it is not capital gains, and it does not escape payroll tax.
          </p>
          <p>
            What differs is <strong>withholding</strong>. Because severance is supplemental wages,
            most employers apply the flat 22% federal supplemental rate rather than the tables
            your regular salary runs through. Above $1,000,000 of supplemental wages in a year, the
            excess is withheld at 37%.
          </p>
          <p>
            Withholding is not your tax. It is a prepayment. Someone whose marginal rate is 12%
            has over-withheld at 22% and gets the difference back; someone at 32% has under-withheld
            and will owe. The lump-sum nature of severance makes this gap unusually large, and it is
            why a severance year often produces an unexpected refund or an unexpected bill.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE WAGE BASE</p>
        <h2>Timing Can Change What You Keep</h2>
        <section>
          <p>
            One genuine variable is the <strong>Social Security wage base</strong> — $184,500 for
            2026. Once your wages for the calendar year reach it, the 6.2% stops for the rest of
            the year.
          </p>
          <p>
            For someone laid off in November after a high-earning year, a severance payment may
            face no Social Security tax at all — 6.2% of the whole package stays in their pocket.
            The same package paid in February, at the start of a fresh wage base, is fully
            exposed. On a $40,000 severance that difference is $2,480.
          </p>
          <p>
            This occasionally makes payment timing worth raising in negotiation, though the
            income-tax bracket effect usually runs the other way: a lump sum landing in a year when
            you have already earned a full salary is taxed at higher marginal rates than the same
            sum in a year you spend largely unemployed.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">PTO PAYOUT</p>
        <h2>Accrued Vacation and PTO at Separation</h2>
        <section>
          <p>
            Unused vacation or PTO paid out when you leave is supplemental wages, taxed exactly
            like severance. The tax question is settled; the entitlement question is not.
          </p>
          <ul className="checklist">
            <li><strong>Some states require payout</strong> of accrued vacation on separation, treating it as earned wages that cannot be forfeited</li>
            <li><strong>Others leave it to policy</strong> — if the handbook says unused time is forfeited, it may well be</li>
            <li><strong>&ldquo;Use it or lose it&rdquo; policies</strong> are prohibited in some states and permitted in others</li>
          </ul>
          <p>
            Because the payout is added to the same period as severance, the combined figure can
            push total supplemental wages higher than expected. Enter both in the calculator above
            to see the combined withholding rather than estimating them separately.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>Severance Pay Tax — Frequently Asked Questions</h2>
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
            <li><a href="/gross-up-calculator">Gross-Up Calculator</a></li>
            <li><a href="/tax-on-commission">Tax on Commission and Bonus Payments</a></li>
            <li><a href="/self-employment-tax-calculator">Self-Employment Tax Calculator</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
