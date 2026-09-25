import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import HSACalculatorWidget from "../components/HSACalculator";

const CANONICAL = "https://www.paycheckscalculator.org/hsa-calculator";

export const metadata: Metadata = {
  title: "HSA Calculator 2026 — Tax Savings & Contribution Limits",
  description:
    "Free HSA calculator for 2026. See how much you save with a Health Savings Account — federal tax, FICA, and state tax savings on your contributions.",
  alternates: { canonical: "/hsa-calculator" },
  openGraph: {
    title: "HSA Calculator 2026 — Tax Savings & Contribution Limits",
    description:
      "Calculate your HSA tax savings for 2026. See how much a Health Savings Account saves you on federal, FICA, and state taxes with pre-tax contributions.",
    url: CANONICAL,
    type: "website",
  },
};

const FAQS = [
  {
    q: "How does an HSA save me money?",
    a: "An HSA (Health Savings Account) offers a triple tax advantage: (1) contributions are pre-tax, lowering your taxable income; (2) earnings grow tax-free; and (3) withdrawals for qualified medical expenses are tax-free. The immediate tax savings come from reducing your federal income tax, FICA (Social Security + Medicare), and often state income tax.",
  },
  {
    q: "What are the 2026 HSA contribution limits?",
    a: "For 2026, the maximum HSA contribution is $4,300 for self-only HDHP coverage and $8,550 for family coverage. If you are age 55 or older, you can contribute an additional $1,000 as a catch-up contribution. These limits are set by the IRS and adjusted for inflation each year.",
  },
  {
    q: "Who is eligible for an HSA?",
    a: "To contribute to an HSA, you must be covered under a qualifying High Deductible Health Plan (HDHP), not be enrolled in Medicare, not be claimed as a dependent on someone else's tax return, and not have other disqualifying health coverage (like a general-purpose FSA or another non-HDHP plan).",
  },
  {
    q: "What is a High Deductible Health Plan (HDHP)?",
    a: "For 2026, an HDHP is a health plan with a minimum deductible of $1,600 for self-only coverage or $3,200 for family coverage, and a maximum out-of-pocket limit of $8,050 for self-only or $16,100 for family coverage. The plan can cover preventive care before the deductible is met.",
  },
  {
    q: "What can I use HSA money for?",
    a: "HSA funds can be used tax-free for a wide range of qualified medical expenses including doctor visits, prescription drugs, dental care, vision care (glasses, contacts), mental health services, medical equipment, and more. After age 65, you can withdraw HSA funds for any purpose without penalty — you just pay regular income tax on non-medical withdrawals.",
  },
  {
    q: "Do HSA funds roll over from year to year?",
    a: "Yes. Unlike a flexible spending account (FSA), HSA funds never expire. Any money left in your account at the end of the year rolls over indefinitely. The account is yours to keep even if you change jobs, change insurance, or retire.",
  },
  {
    q: "Can I invest my HSA money?",
    a: "Yes. Most HSA providers let you invest your balance in mutual funds, ETFs, and other investment options once you reach a certain threshold (often $1,000–$2,000). Investment earnings grow tax-free, and withdrawals for qualified medical expenses remain tax-free — making the HSA one of the most tax-advantaged accounts available.",
  },
  {
    q: "HSA vs. FSA: which is better?",
    a: "HSAs and FSAs both use pre-tax dollars for medical costs, but HSAs offer more flexibility: funds roll over indefinitely (FSA is mostly use-it-or-lose-it), you can invest the balance, and the account is portable between jobs. FSAs have lower contribution limits and stricter rules but may be a better fit if you do not have an HDHP or want predictable annual expenses.",
  },
];

export default function HSACalculatorPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "HSA Calculator",
    url: CANONICAL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Calculate your HSA tax savings for 2026. See federal, FICA, and state tax savings from Health Savings Account contributions.",
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
      { "@type": "ListItem", position: 2, name: "HSA Calculator" },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <span>HSA Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">HSA TAX SAVINGS · 2026</div>
        <h1>HSA Calculator — How Much Can You Save?</h1>
        <p className="hero-copy">
          Use this free <strong>HSA calculator</strong> to estimate your 2026 tax savings from
          contributing to a Health Savings Account. An HSA lets you pay for medical expenses with
          pre-tax dollars, invest the balance tax-free, and withdraw for qualified expenses tax-free —
          a triple tax advantage no other account can match.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <HSACalculatorWidget />
      </div>

      <article className="long-seo">
        <p className="kicker">HOW HSAs WORK</p>
        <h2>The Triple Tax Advantage of an HSA</h2>
        <section>
          <p>
            An HSA is widely considered the most tax-advantaged account available because it offers
            <strong> three layers of tax savings</strong>. Together, these benefits make the HSA
            more valuable than a 401(k) or IRA on a dollar-for-dollar basis for health care spending.
          </p>
          <h3 style={{ marginTop: 16 }}>1. Pre-tax contributions</h3>
          <p>
            Money you contribute to an HSA goes in <strong>before federal income tax, FICA (Social Security
            + Medicare), and usually state income tax</strong>. This immediately lowers your taxable income
            and reduces your paycheck withholding. For someone in the 22% federal bracket, contributing
            the max $4,300 (self-only) saves roughly $946 in federal tax alone — plus another $329 in
            FICA tax. This is the savings our HSA calculator above estimates.
          </p>
          <h3 style={{ marginTop: 20 }}>2. Tax-free growth</h3>
          <p>
            Any interest, dividends, or investment gains earned inside the HSA are <strong>never taxed</strong>.
            Unlike a taxable brokerage account where you pay capital gains tax each year, your HSA
            investments compound without any tax drag. Over 20–30 years, this tax-free compounding
            can add tens of thousands of dollars in extra growth compared to a taxable account.
          </p>
          <h3 style={{ marginTop: 20 }}>3. Tax-free withdrawals for medical expenses</h3>
          <p>
            Money taken out to pay for <strong>qualified medical expenses</strong> is 100% tax-free at any age.
            This includes doctor visits, prescriptions, dental work, vision care, and hundreds of other
            eligible expenses. No other retirement or savings account combines tax-free contributions,
            tax-free growth, <em>and</em> tax-free withdrawals — that is why the HSA is often called a
            "triple tax-advantaged" account.
          </p>
          <p style={{ marginTop: 16 }}>
            After age 65, the penalty for non-medical withdrawals disappears — you just pay ordinary
            income tax, the same as a traditional IRA or 401(k). This makes the HSA a powerful
            retirement savings tool in addition to a health care account.
          </p>
        </section>

        <p className="kicker">2026 LIMITS</p>
        <h2>2026 HSA Contribution Limits &amp; HDHP Requirements</h2>
        <section>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}></th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Self-only</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Family</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Maximum contribution</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$4,300</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$8,550</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Catch-up (age 55+)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>+$1,000</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>+$1,000 per spouse</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Minimum HDHP deductible</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$1,600</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$3,200</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Max out-of-pocket</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$8,050</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$16,100</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 16, fontSize: 13, color: "#667a8a" }}>
            Limits are adjusted annually for inflation. You can make contributions for the current
            tax year up until the tax filing deadline (usually April 15 of the following year).
          </p>
        </section>

        <p className="kicker">ELIGIBLE EXPENSES</p>
        <h2>What Can You Spend HSA Money On?</h2>
        <section>
          <p>
            HSA funds can be used tax-free for a broad range of <strong>qualified medical expenses</strong>
            for you, your spouse, and your dependents — even if they are not on your HDHP. The IRS
            defines eligible expenses in Publication 502, and the list covers far more than just
            doctor visits.
          </p>
          <h3 style={{ marginTop: 16 }}>Medical and health care services</h3>
          <p>
            The core category of HSA-eligible expenses includes all types of medical treatment and
            preventive care:
          </p>
          <ul className="checklist" style={{ marginTop: 8 }}>
            <li>Doctor visits, specialist consultations, and urgent care</li>
            <li>Hospital stays, surgery, and emergency room visits</li>
            <li>Prescription medications and insulin</li>
            <li>Lab tests, X-rays, MRI, and diagnostic imaging</li>
            <li>Mental health services and therapy</li>
            <li>Physical therapy, occupational therapy, and chiropractic care</li>
            <li>Preventive care and health screenings</li>
          </ul>
          <h3 style={{ marginTop: 20 }}>Dental and vision care</h3>
          <p>
            Dental and vision expenses are fully eligible — a major benefit since these are often
            not fully covered by standard health insurance:
          </p>
          <ul className="checklist" style={{ marginTop: 8 }}>
            <li>Dental cleanings, fillings, crowns, and braces</li>
            <li>Eye exams, prescription glasses, and contact lenses</li>
            <li>LASIK and other vision correction surgery</li>
            <li>Dentures and dental implants</li>
          </ul>
          <h3 style={{ marginTop: 20 }}>Over-the-counter and everyday health items</h3>
          <p>
            Since the CARES Act, many over-the-counter items are eligible without a prescription.
            This is an often-overlooked way to use HSA funds:
          </p>
          <ul className="checklist" style={{ marginTop: 8 }}>
            <li>Over-the-counter medications (pain relievers, allergy meds, etc.)</li>
            <li>Menstrual care products (tampons, pads, menstrual cups)</li>
            <li>Medical equipment and supplies (bandages, thermometers, blood pressure monitors)</li>
            <li>COBRA premiums (in specific situations)</li>
            <li>Long-term care insurance premiums (limits apply based on age)</li>
          </ul>
          <p style={{ marginTop: 16 }}>
            The IRS maintains a full list in <a href="https://www.irs.gov/publications/p502" rel="noopener">Publication 502</a>.
            Always save receipts in case of an IRS audit — you are responsible for proving that
            withdrawals were used for qualified expenses.
          </p>
        </section>

        <p className="kicker">HSA vs 401(k)</p>
        <h2>HSA vs. 401(k): Which Should You Fund First?</h2>
        <section>
          <p>
            If you have access to both an HSA and a 401(k), choosing which to prioritize depends on
            your employer match, tax bracket, and expected medical costs. Here is the general priority
            order recommended by most financial planners:
          </p>
          <h3 style={{ marginTop: 16 }}>Recommended contribution priority</h3>
          <ol className="checklist">
            <li><strong>401(k) up to the employer match:</strong> A 50% or 100% match is an instant return you cannot beat. Always contribute enough to get the full match first.</li>
            <li><strong>HSA up to the max:</strong> The triple tax advantage makes the HSA more valuable than a 401(k) on a dollar-for-dollar basis for medical spending in retirement. Many people underestimate their future medical costs.</li>
            <li><strong>401(k) up to the max:</strong> After the HSA, go back to maxing out your 401(k) or IRA for additional retirement savings.</li>
          </ol>
          <p>
            The HSA's advantage is strongest if you can afford to <em>pay current medical bills out of
            pocket</em> and let the HSA balance grow and compound over decades. Used this way, an HSA
            can function as a "super IRA" for health care costs in retirement.
          </p>
        </section>

        <p className="kicker">HSA vs FSA</p>
        <h2>HSA vs. FSA: What's the Difference?</h2>
        <section>
          <p>
            HSAs and health FSAs both let you pay for medical expenses with pre-tax dollars, but they
            have important differences that affect which one is better for you — and whether you can
            use both at the same time.
          </p>
          <h3 style={{ marginTop: 16 }}>Side-by-side comparison</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}></th>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>HSA</th>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Health FSA</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Requires HDHP</td>
                <td style={{ padding: "10px" }}>Yes — must have a high-deductible health plan</td>
                <td style={{ padding: "10px" }}>No — available with any plan through employers</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Funds roll over?</td>
                <td style={{ padding: "10px" }}>Yes — never expires, grows indefinitely</td>
                <td style={{ padding: "10px" }}>Mostly no — use-it-or-lose-it (with limited exceptions)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>2026 limit (self)</td>
                <td style={{ padding: "10px" }}>$4,300 (+$1,000 catch-up at 55+)</td>
                <td style={{ padding: "10px" }}>$3,200 (+$640 carryover option)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Investment option</td>
                <td style={{ padding: "10px" }}>Yes — invest balance in mutual funds, ETFs</td>
                <td style={{ padding: "10px" }}>Rarely — most plans do not offer investing</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 500 }}>Portability</td>
                <td style={{ padding: "10px" }}>Fully portable — stays with you when you change jobs</td>
                <td style={{ padding: "10px" }}>Not portable — you lose it when you leave the employer</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 16 }}>
            Note: You generally cannot contribute to both an HSA and a <em>general-purpose</em> health
            FSA in the same year. However, you can combine an HSA with a <strong>limited-purpose FSA</strong>
            that only covers dental and vision expenses, or a <strong>post-deductible FSA</strong>.
            Check with your employer to see what options are available.
          </p>
        </section>

        <p className="kicker">INVESTING STRATEGY</p>
        <h2>How to Invest Your HSA for Maximum Growth</h2>
        <section>
          <p>
            One of the biggest advantages of an HSA is that you can invest the balance once it reaches
            a certain threshold (usually $1,000–$2,000). Investment earnings grow tax-free, and qualified
            withdrawals remain tax-free — making the HSA the only account that offers truly tax-free
            growth and withdrawals.
          </p>
          <h3 style={{ marginTop: 16 }}>HSA investment options</h3>
          <ul className="checklist">
            <li><strong>Cash / savings:</strong> The default option for most HSAs. FDIC-insured, no risk of loss, but low interest rates (often 0.5–2%). Best for your near-term medical spending.</li>
            <li><strong>Mutual funds:</strong> Most HSA providers offer a menu of stock, bond, and target-date mutual funds. Similar to investing in a 401(k) or IRA.</li>
            <li><strong>ETFs and individual stocks:</strong> Some providers (like Fidelity, Lively, HealthEquity) offer self-directed brokerage windows where you can invest in individual stocks, ETFs, and bonds.</li>
          </ul>
          <h3 style={{ marginTop: 24 }}>Recommended strategy</h3>
          <p>
            Many financial advisors recommend treating your HSA as a long-term investment account and
            paying current medical expenses out of pocket if you can afford to. This lets the full
            balance compound tax-free for decades, potentially growing into a significant nest egg for
            health care costs in retirement.
          </p>
          <p>
            For younger investors with long time horizons, a growth-oriented allocation (mostly stock
            index funds) is reasonable. As you approach retirement, gradually shift toward more
            conservative investments to protect the balance you will need for near-term medical costs.
          </p>
        </section>
      </article>

      {/* FAQ */}
      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>HSA — Frequently Asked Questions</h2>
        {FAQS.map((f, i) => (
          <details key={i}>
            <summary>{f.q}<span>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      {/* Related */}
      <article className="long-seo">
        <p className="kicker">RELATED CALCULATORS</p>
        <h2>More Paycheck &amp; Tax Calculators</h2>
        <section>
          <div className="tool-links">
            <a href="/">
              <b>Paycheck Calculator</b>
              <span>Enter HSA, 401(k), and other pre-tax deductions to see your net pay →</span>
            </a>
            <a href="/how-much-tax-is-taken-from-my-paycheck">
              <b>How Much Tax Is Taken Out of My Paycheck?</b>
              <span>Interactive guide to withholding, FICA, and pre-tax deductions →</span>
            </a>
            <a href="/dependent-care-fsa">
              <b>Dependent Care FSA Guide</b>
              <span>Eligible expenses, limits, and tax savings for dependent care FSAs →</span>
            </a>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
