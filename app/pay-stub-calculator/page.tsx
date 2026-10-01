import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import PayStubCalculator from "../components/PayStubCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "pay-stub-calculator",
  title: "Pay Stub Calculator 2026 — Check Every Line on Your Stub",
  description:
    "Free pay stub calculator. Rebuild gross pay, federal tax, Social Security, Medicare, state tax and net pay for one pay period, with year-to-date totals, in any state.",
  crumb: "Pay Stub Calculator",
  appName: "Pay Stub Calculator",
  faqs: [
    {
      q: "What does a pay stub calculator do?",
      a: "It rebuilds the arithmetic on a single pay stub: gross pay for the period, each withholding line, your deductions, and the net that should reach your account. Enter the same figures your employer used and the result should match your stub within a dollar or two. A gap bigger than that is worth asking payroll about.",
    },
    {
      q: "Can this generate a pay stub for me?",
      a: "No. A pay stub is a record of wages an employer actually paid, and only an employer can issue one. This tool checks the maths on a stub you already have, or shows what a stub should look like at a given salary. Creating a document that claims to be a pay stub for wages nobody paid is fraud in most contexts where a stub is requested — lenders, landlords and benefit agencies all verify them with the employer.",
    },
    {
      q: "Why does my pay stub not match this calculator?",
      a: "The usual causes, in rough order of frequency: a state withholding certificate on file that differs from what you entered, pre-tax benefits that reduce taxable wages before withholding is computed, a local or city tax this tool does not know about, an employer that rounds per period rather than annualising, and extra withholding you requested on line 4(c) of your W-4. Mid-year pay changes also shift the annualised figure your employer is using.",
    },
    {
      q: "What do the YTD columns on a pay stub mean?",
      a: "Year to date — the running total for each line since 1 January, regardless of when you were hired. Checking YTD is more useful than checking one period, because a single period can be distorted by a bonus, retroactive pay or a mid-year rate change while the YTD column smooths all of that out.",
    },
    {
      q: "What should appear on a pay stub?",
      a: "Pay period dates, hours if you are paid hourly, gross pay, each tax withheld shown separately, each deduction shown separately, net pay, and year-to-date totals for all of it. Requirements vary by state — some require employers to provide an itemised statement every period, a few have no statutory requirement at all.",
    },
    {
      q: "Is the state line on my stub only income tax?",
      a: "Not always. Several states withhold payroll-programme premiums that are not income tax: Washington takes Paid Leave and WA Cares, California takes SDI, Oregon takes transit tax, Paid Leave and a Workers' Benefit Fund assessment, and Alaska takes an employee unemployment contribution. This calculator shows those on a separate line so the two are not confused.",
    },
    {
      q: "How do I check my stub against my W-2 at the end of the year?",
      a: "Your final stub's YTD gross will usually be higher than Box 1 of your W-2, because pre-tax deductions such as 401(k) and health premiums reduce taxable wages but not gross pay. YTD federal tax should match Box 2 exactly. If it does not, the difference is worth resolving before you file.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function PayStubCalculatorPage() {
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
        <span>Pay Stub Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">PAY STUB · 2026</div>
        <h1>Pay Stub Calculator — Check Every Line on Your Stub</h1>
        <p className="hero-copy">
          This <strong>pay stub calculator</strong> rebuilds one pay period line by line — gross
          pay, federal income tax, Social Security, Medicare, state withholding, your deductions
          and the net that should land in your account — with year-to-date totals beside each one.
          Enter the figures your employer used and compare. A paycheck stub calculator, a check
          stub calculator and a pay stub tax calculator are all this same tool.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <PayStubCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">READING THE STUB</p>
        <h2>What Each Line on a Pay Stub Actually Is</h2>
        <section>
          <p>
            A pay stub has four blocks, and almost every question about one comes from confusing
            two of them. <strong>Gross pay</strong> is everything you earned in the period before
            anything is removed. <strong>Pre-tax deductions</strong> — traditional 401(k), health
            premiums, HSA, FSA — come out next, and they reduce the wage the tax lines are computed
            on. <strong>Taxes</strong> are then withheld on what is left. <strong>Post-tax
            deductions</strong> such as Roth contributions, union dues, garnishments and most
            insurance top-ups come out last and change nothing about the tax.
          </p>
          <p>
            That ordering is why a $200 pre-tax deduction costs you less than $200 of take-home pay
            and a $200 post-tax deduction costs you exactly $200. It is also why your final stub&rsquo;s
            YTD gross will not match Box 1 of your W-2: Box 1 is taxable wages, which is gross minus
            the pre-tax block.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE TAX LINES</p>
        <h2>Federal, FICA and State — Three Different Rules on One Stub</h2>
        <section>
          <p>
            <strong>Federal income tax</strong> is not a percentage of your paycheck. Payroll
            annualises the period&rsquo;s taxable wage, runs it through the IRS percentage method
            using your W-4, then divides back down. That is why a period containing a bonus is
            withheld so heavily — it is annualised as though the bonus repeated every period.
          </p>
          <p>
            <strong>Social Security</strong> is a flat 6.2% up to the annual wage base, then it
            stops entirely; <strong>Medicare</strong> is 1.45% on everything with an extra 0.9%
            above $200,000. Neither is reduced by a 401(k) contribution, which is the one pre-tax
            deduction people expect to shrink FICA and it never does.
          </p>
          <p>
            <strong>State</strong> varies more than the other two combined. Nine states take no
            income tax on wages at all; Pennsylvania takes a flat rate from the first dollar;
            Arizona lets you pick your own percentage. And in several states the state column is not
            income tax — Washington&rsquo;s Paid Leave and WA Cares, California&rsquo;s SDI,
            Oregon&rsquo;s transit tax and Alaska&rsquo;s employee unemployment contribution are
            separate programmes that this calculator reports on their own line.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHEN THEY DISAGREE</p>
        <h2>Your Stub and This Pay Stub Calculator Disagree — Now What</h2>
        <section>
          <p>
            Work down the lines in order and stop at the first one that differs; everything below it
            will be wrong as a consequence. If <strong>gross</strong> differs, the period dates or
            hours are the issue, not tax. If <strong>pre-tax</strong> differs, check whether a
            benefit is being deducted that you forgot to enter. If only <strong>federal</strong>
            differs, the W-4 on file is the usual culprit — particularly the multiple-jobs box and
            any extra amount on line 4(c).
          </p>
          <p>
            If only the <strong>state</strong> line differs, the cause is almost always a state
            withholding certificate you never filed. Several states will not accept the federal W-4
            and default you to a treatment that over-withholds — Connecticut defaults to its top
            rate when no CT-W4 is on file, and Oregon defaults to a flat 8%. A local or city tax
            this tool does not model will also show up here: Ohio municipalities and school
            districts, Pennsylvania&rsquo;s local EIT, Maryland&rsquo;s county tax, Michigan and
            Missouri city taxes, and Kentucky&rsquo;s occupational taxes all ride on the paycheck.
          </p>
          <p>
            A difference of a dollar or two is normal and not worth chasing: some states round each
            period to whole dollars, and employers differ in whether they annualise first or compute
            the period directly.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT THIS IS NOT</p>
        <h2>This Tool Does Not Create a Pay Stub</h2>
        <section>
          <p>
            A pay stub is a record of wages an employer actually paid. Only an employer can issue
            one, and anyone who needs to verify your income — a mortgage underwriter, a landlord, a
            benefits office — checks it against the employer or against your W-2 and tax transcript.
            Documents produced to look like stubs for wages that were never paid are treated as
            fraud in exactly those settings.
          </p>
          <p>
            What this calculator is for: checking that the stub you were given adds up, working out
            what your take-home will be before accepting an offer, and seeing what changing a
            deduction would do to your net pay. If you need a copy of a real stub, your employer or
            payroll provider can reissue it; if you need to prove income without one, a W-2, a
            1099 or an IRS wage and income transcript is what institutions actually accept.
          </p>
        </section>
      </article>

      <article className="long-seo faq-section">
        <p className="kicker">FAQ</p>
        <h2>Pay Stub Calculator — Frequently Asked Questions</h2>
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
            <li><a href="/ytd-calculator">YTD Calculator — project your year from a stub</a></li>
            <li><a href="/post-tax-deductions">Pre-Tax vs Post-Tax Deductions</a></li>
            <li><a href="/401k-paycheck-impact-calculator">401(k) Paycheck Impact Calculator</a></li>
            <li><a href="/how-much-tax-is-taken-from-my-paycheck">How Much Tax Is Taken From My Paycheck?</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
