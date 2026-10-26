import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import Retirement401kCalculator from "../components/Retirement401kCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "401k-paycheck-impact-calculator",
  title: "401k Paycheck Impact Calculator 2026 — Cost Per Paycheck",
  description:
    "Free 401k paycheck impact calculator. See how much take-home pay really drops when you raise your contribution — always less than the amount you save.",
  crumb: "401(k) Paycheck Impact Calculator",
  appName: "401k Paycheck Impact Calculator",
  faqs: [
    {
      q: "How much will a 401(k) contribution reduce my paycheck?",
      a: "By less than you contribute. A traditional 401(k) deferral comes out of pre-tax wages, so it reduces the income your federal and state withholding are calculated on. Someone in a combined 22% federal and 5% state position sees take-home fall by roughly 73 cents for every dollar deferred. The calculator above works out the exact figure for your salary, state and filing status.",
    },
    {
      q: "Does a 401(k) contribution reduce Social Security and Medicare tax?",
      a: "No. This is the single most common misunderstanding about 401(k) contributions. Elective deferrals are exempt from federal and most state income tax but not from FICA — Social Security and Medicare are calculated on your full gross pay. It is why your take-home falls by less than your contribution but by more than your income-tax saving alone would suggest.",
    },
    {
      q: "How much should I contribute to get the full employer match?",
      a: "At least up to the percentage your employer matches. A common formula is 50% of what you put in, up to 6% of pay — contribute 6% and the employer adds 3%, contribute 4% and they add 2%, and the other 2% of matched money is simply not paid. Enter your employer's formula above and the calculator flags it when your contribution is below the match limit.",
    },
    {
      q: "What is the 401(k) contribution limit for 2026?",
      a: "The elective deferral limit is $24,500, with an additional $8,000 catch-up for those aged 50 and over. The limit applies to what you defer from salary, not to employer matching contributions, which sit under a separate and much higher combined cap. Payroll normally stops your deferrals once you reach the limit, which makes your final paychecks of the year larger.",
    },
    {
      q: "Is a Roth 401(k) different on my paycheck?",
      a: "Yes, and the difference is the whole point of this tool. Roth contributions come out of after-tax pay, so your take-home falls by the full amount you contribute — there is no immediate tax saving. The trade is that qualified withdrawals in retirement are tax free. The calculator above models traditional pre-tax contributions.",
    },
    {
      q: "Do all states give a tax break on 401(k) contributions?",
      a: "Most do, but not all. Pennsylvania taxes elective deferrals when they are made rather than when they are withdrawn, so a Pennsylvania worker sees no state-tax reduction from contributing. In the nine states with no wage income tax there is nothing to reduce, so the whole saving is federal. Selecting your state above accounts for this.",
    },
    {
      q: "Should I increase my 401(k) if money is tight?",
      a: "This calculator answers the arithmetic question, not the financial-planning one, and the arithmetic usually looks better than people expect because of the pre-tax effect and the match. Whether that makes raising your contribution the right call depends on your debts, emergency savings and plan options — a licensed adviser is the right person for that question.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function Retirement401kPage() {
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
        <span>401(k) Paycheck Impact Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">RETIREMENT · 2026</div>
        <h1>401k Paycheck Impact Calculator — What It Really Costs</h1>
        <p className="hero-copy">
          Raising your contribution never costs you the full amount. This{" "}
          <strong>401k paycheck impact calculator</strong> puts the two numbers side by side: how
          much more goes into your retirement account, and how much smaller your actual deposit
          gets. Pick your salary, state and pay frequency, and it works out the gap — plus the
          employer match you may be leaving behind.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <Retirement401kCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">THE CORE IDEA</p>
        <h2>Why a $200 401k Contribution Only Costs About $150 of Take-Home Pay</h2>
        <section>
          <p>
            A traditional 401(k) contribution is taken from your pay <em>before</em> federal and
            state income tax are calculated. Deferring another $200 a paycheck lowers the wage those
            taxes are computed on by $200, so the tax withheld falls too. The money that would have
            gone to the IRS goes into your account instead, and your take-home pay drops by only the
            remainder.
          </p>
          <p>
            How much remainder depends entirely on your marginal rate. Someone at 12% federal in a
            no-income-tax state sees take-home fall by about $176 of that $200. Someone at 24%
            federal in California sees it fall by roughly $130. That spread is why a single rule of
            thumb is useless here, and why this 401k paycheck impact calculator asks for your state
            and filing status before it gives you a number.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE PART PEOPLE MISS</p>
        <h2>Your 401k Does Not Shrink FICA, However Much You Defer</h2>
        <section>
          <p>
            Social Security and Medicare are calculated on your <strong>full gross pay</strong>.
            Elective deferrals are exempt from income tax but not from FICA, so contributing more
            does nothing at all to the 6.2% and 1.45% lines on your stub.
          </p>
          <p>
            This catches people who expect their take-home to fall by only the income-tax-adjusted
            amount and find it falls by more. It also means the effective discount on a 401(k)
            contribution is your income-tax rate alone — not your total payroll-tax burden. The
            calculator above models FICA on gross, which is why its figure is lower than the
            back-of-envelope version you may have run.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE MATCH</p>
        <h2>The Employer Match Is the Only Guaranteed Return on a 401k</h2>
        <section>
          <p>
            Most matching formulas look like &ldquo;50% of what you contribute, up to 6% of
            pay&rdquo; or &ldquo;100% up to 4%&rdquo;. Contribute below that ceiling and the
            unmatched portion is not deferred to later or paid another way — it is simply never
            paid. On a $75,000 salary, contributing 3% instead of 6% under a 50%-to-6% formula
            leaves about $1,125 a year on the table.
          </p>
          <p>
            Enter your employer&rsquo;s formula above and the calculator warns you when your
            contribution is below the match limit, and shows the match as a per-paycheck figure
            beside your own contribution. Whatever else you decide about retirement saving, the
            stretch from your current rate up to the match limit is the part with a defined,
            immediate return.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TIMING</p>
        <h2>Hitting the 401k Limit Early Changes Your Last Paychecks</h2>
        <section>
          <p>
            The 2026 elective deferral limit is $24,500, plus an $8,000 catch-up from age 50. If
            your contribution rate would take you past it, payroll normally stops deferring once you
            reach the cap — so your final paychecks of the year arrive noticeably larger than the
            earlier ones, with no 401(k) line at all.
          </p>
          <p>
            That is worth planning around for two reasons. Some employers only match on paychecks
            where you actually contribute, so front-loading contributions early in the year can cost
            you match on the periods after you stop — plans with a &ldquo;true-up&rdquo; provision
            fix this at year end, and plans without one do not. And a change made in autumn has
            fewer remaining paychecks to work through, so the per-paycheck impact of the same
            annual target is larger the later you leave it.
          </p>
        </section>
      </article>

      <article className="long-seo faq-section">
        <p className="kicker">FAQ</p>
        <h2>401k Paycheck Impact Calculator — Frequently Asked Questions</h2>
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
        <h2>More Paycheck and Tax Calculators</h2>
        <section>
          <ul className="checklist">
            <li><a href="/">Paycheck Calculator — take-home pay by state</a></li>
            <li><a href="/pay-stub-calculator">Pay Stub Calculator — check every line</a></li>
            <li><a href="/post-tax-deductions">Pre-Tax vs Post-Tax Deductions</a></li>
            <li><a href="/hsa-calculator">HSA Calculator</a></li>
            <li><a href="/what-is-annual-income">What Is Annual Income?</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
