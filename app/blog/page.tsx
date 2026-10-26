import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const CANONICAL = "https://www.paycheckscalculator.org/blog";

export const metadata: Metadata = {
  title: "Paycheck Tax Blog - Withholding Guides for 2026",
  description:
    "Plain-English guides to the taxes deducted from your paycheck in 2026: Texas withholding, federal income tax, Social Security, Medicare and state-by-state rules.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Paycheck Tax Blog - Withholding Guides for 2026",
    description:
      "Guides to the taxes deducted from your paycheck in 2026, backed by the same withholding engine that powers our calculators.",
    url: CANONICAL,
    type: "website",
  },
};

const POSTS = [
  {
    href: "/hsa-calculator",
    title: "HSA Calculator 2026 — Tax Savings & Contribution Limits",
    blurb:
      "Free HSA calculator with triple tax advantage breakdown. See federal, FICA, and state tax savings from Health Savings Account contributions.",
    meta: "HSA · 2026 Limits · Interactive Calculator",
  },
  {
    href: "/illinois-income-tax-calculator",
    title: "Illinois Income Tax Calculator 2026 — Free Estimator",
    blurb:
      "Calculate your 2026 Illinois state income tax plus federal tax. Flat 4.95% rate with personal exemptions — see your total bill and effective rate.",
    meta: "Illinois · Flat Tax · Annual Estimator",
  },
  {
    href: "/pennsylvania-income-tax-calculator",
    title: "Pennsylvania Income Tax Calculator 2026 — 3.07% Flat Rate",
    blurb:
      "Free PA income tax calculator for 2026. Pennsylvania's flat 3.07% rate — see your federal and state tax total and effective rate.",
    meta: "Pennsylvania · Flat Tax · 3.07%",
  },
  {
    href: "/georgia-income-tax-calculator",
    title: "Georgia Income Tax Calculator 2026 — Flat 4.99% Rate",
    blurb:
      "Calculate your 2026 Georgia state income tax. GA flat 4.99% rate with standard deduction and dependent exemptions.",
    meta: "Georgia · Flat Tax · 4.99%",
  },
  {
    href: "/new-jersey-income-tax-calculator",
    title: "New Jersey Income Tax Calculator 2026 — NJ Tax Brackets",
    blurb:
      "Free NJ income tax calculator with 2026 tax brackets (1.4% to 10.75%). Estimate your federal and New Jersey state income tax.",
    meta: "New Jersey · Progressive · 7 Brackets",
  },
  {
    href: "/connecticut-income-tax-calculator",
    title: "Connecticut Income Tax Calculator 2026 — CT Tax Brackets",
    blurb:
      "Free CT income tax calculator with the 2026 seven-bracket schedule (2% to 6.99%) and the Table A personal exemption phase-out.",
    meta: "Connecticut · Progressive · 7 Brackets",
  },
  {
    href: "/utah-income-tax-calculator",
    title: "Utah Income Tax Calculator 2026 — 4.45% Flat Rate",
    blurb:
      "Calculate your 2026 Utah state income tax. Flat 4.45% rate paired with the Form TC-40 taxpayer tax credit and its phase-out.",
    meta: "Utah · Flat Tax · 4.45%",
  },
  {
    href: "/tennessee-income-tax-calculator",
    title: "Tennessee Income Tax Calculator 2026 — No State Income Tax",
    blurb:
      "Tennessee has no state income tax. See what you actually owe in 2026 — federal only — and how that compares with income-tax states.",
    meta: "Tennessee · No Income Tax · Federal Only",
  },
  {
    href: "/florida-state-tax-calculator",
    title: "Florida State Tax Calculator 2026 — No Income Tax",
    blurb:
      "Florida levies no state income tax. Estimate your 2026 federal tax and see how much you keep compared with high-tax states.",
    meta: "Florida · No Income Tax · Federal Only",
  },
  {
    href: "/no-tax-on-overtime",
    title: "No Tax on Overtime 2026 — Deduction Rules Explained",
    blurb:
      "The OBBBA overtime deduction covers up to $12,500 of overtime premium ($25,000 joint) for 2025–2028. What qualifies, the income phase-out, and what it is worth.",
    meta: "OBBBA · Overtime · 2025–2028",
  },
  {
    href: "/overtime-calculator",
    title: "Overtime Calculator 2026 — Time and a Half Pay",
    blurb:
      "Work out time and a half, double time and your weekly gross from any hourly rate — plus how overtime is actually taxed.",
    meta: "Overtime · Time and a Half · Calculator",
  },
  {
    href: "/self-employment-tax-calculator",
    title: "Self Employed Tax Calculator 2026 — 1099 vs W2",
    blurb:
      "Estimate self-employment tax, federal income tax and quarterly payments on 1099 income, and see what a 1099 rate has to cover versus a W-2 salary.",
    meta: "1099 · Self-Employment · 15.3%",
  },
  {
    href: "/tax-on-commission",
    title: "Tax on Commission Payments 2026 — Is It Taxed More?",
    blurb:
      "Commission is taxed at ordinary rates but withheld at a flat 22%. Why the cheque looks overtaxed and what you actually owe at filing.",
    meta: "Commission · Supplemental Wages",
  },
  {
    href: "/severance-pay-tax-calculator",
    title: "Severance Pay Tax Calculator 2026 — PTO Payout",
    blurb:
      "Estimate tax on a severance package and accrued PTO payout, including the 22% supplemental rate and whether you have passed the Social Security wage base.",
    meta: "Severance · PTO Payout · Calculator",
  },
  {
    href: "/gross-up-calculator",
    title: "Gross Up Calculator 2026 — Net to Gross Pay",
    blurb:
      "Work backwards from a target net to the gross an employer must run. Grossing up is division, not addition — and adding the tax rate always lands short.",
    meta: "Gross-Up · Bonus · Relocation",
  },
  {
    href: "/ytd-calculator",
    title: "YTD Calculator 2026 — Year to Date Income",
    blurb:
      "Turn the year-to-date figure on a pay stub into projected annual and monthly income, the way a mortgage underwriter does it.",
    meta: "YTD · Pay Stub · Projection",
  },
  {
    href: "/what-is-annual-income",
    title: "What Is Annual Income? How to Find Yours (2026)",
    blurb:
      "Annual income means total earnings for a year. What counts, how to find it from an hourly wage or pay stub, and why gross and net differ so much.",
    meta: "Annual Income · Gross vs Net",
  },
  {
    href: "/post-tax-deductions",
    title: "Post-Tax Deductions vs Pre-Tax — 2026 Guide",
    blurb:
      "Which payroll deductions come out before tax and which after, why a 401(k) cuts income tax but not FICA, and what a $200 deduction really costs.",
    meta: "Payroll Deductions · Pre-Tax vs Post-Tax",
  },
  {
    href: "/nanny-cost",
    title: "How Much Do Nannies Cost? Average Nanny Pay Rates (2026)",
    blurb:
      "How much does a nanny cost? See 2026 nanny salary averages by location, experience, and number of kids. Plus the full cost of employing a nanny including taxes and benefits.",
    meta: "Child Care · Nanny Pay · Household Employer",
  },
  {
    href: "/dependent-care-fsa",
    title: "Dependent Care FSA: Eligible Expenses & Limits (2026)",
    blurb:
      "What is a dependent care FSA? Eligible child care and adult care expenses, 2026 contribution limits, tax savings, and how it compares to the child care tax credit.",
    meta: "FSA · Child Care · Pre-Tax Benefits",
  },
  {
    href: "/qualified-dividends-and-capital-gain-tax-worksheet",
    title: "Qualified Dividends and Capital Gain Tax Worksheet 2026",
    blurb:
      "Run all 25 lines of the Form 1040 worksheet. Enter taxable income, qualified dividends and net capital gain to see the 0%, 15% and 20% split.",
    meta: "Form 1040 · Capital Gains · Interactive",
  },
  {
    href: "/can-i-claim-my-girlfriend-as-a-dependent",
    title: "Can I Claim My Girlfriend as a Dependent? 2026 IRS Rules",
    blurb:
      "The five IRS qualifying-relative tests, the $5,300 gross income limit for 2026, the support calculation, and why Head of Household is a separate question.",
    meta: "Dependents · IRS Pub 501 · 2026",
  },
  {
    href: "/tax-write-off",
    title: "What Is a Tax Write-Off? Meaning & How It Works (2026)",
    blurb:
      "A plain-English guide to tax write-offs (deductions) — what they are, how they lower your tax bill, and the most common write-offs for employees and self-employed workers.",
    meta: "Tax Concepts · Deductions · 2026",
  },
  {
    href: "/w4v-form",
    title: "Form W-4V: What It Is and How to File It (2026)",
    blurb:
      "Everything you need to know about Form W-4V (Voluntary Withholding Request) for Social Security benefits — who needs it, filing options, and withholding percentages.",
    meta: "Tax Forms · Social Security · 2026",
  },
  {
    href: "/fit-tax-meaning",
    title: "FIT Tax Meaning: What Is FIT on a Paycheck? (2026)",
    blurb:
      "What does FIT mean on your pay stub? FIT stands for Federal Income Tax — the largest withholding on most paychecks. Learn how it is calculated and how to adjust it.",
    meta: "Paycheck Basics · Federal Tax · W-4",
  },
  {
    href: "/paycheck-taxes",
    title: "How Much Taxes Deducted From Paycheck Texas: 2026 Breakdown",
    blurb:
      "Texas withholds federal income tax, Social Security and Medicare — and no state income tax. Dollar amounts by salary, by pay frequency and by filing status.",
    meta: "Texas · Updated September 2026",
  },
  {
    href: "/how-much-tax-is-taken-from-my-paycheck",
    title: "How Much Tax Is Taken Out of My Paycheck?",
    blurb:
      "An interactive explainer covering federal withholding, FICA, state income tax and pre-tax deductions, with a calculator built into the page.",
    meta: "All 50 states · 2026 methods",
  },
  {
    href: "/methodology",
    title: "Calculation Methodology and Tax Sources",
    blurb:
      "Every federal and state withholding method behind our calculators, with the official IRS, SSA and state agency documents each rate comes from.",
    meta: "Sources · Assumptions · Limitations",
  },
];

export default function Blog() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Paycheck Atlas Blog",
    url: CANONICAL,
    description:
      "Guides to the taxes deducted from your paycheck in 2026, including Texas withholding, federal income tax, Social Security and Medicare.",
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://www.paycheckscalculator.org${p.href}`,
      description: p.blurb,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.paycheckscalculator.org" },
      { "@type": "ListItem", position: 2, name: "Blog", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <span>Blog</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">PAYCHECK TAX BLOG</div>
        <h1>Paycheck Tax Guides</h1>
        <p className="hero-copy">
          Long-form guides to the taxes deducted from a paycheck, written against the same 2026
          withholding engine that powers every calculator on this site.
        </p>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">LATEST ARTICLES</p>
        <h2>Articles on Paycheck Taxes and Withholding</h2>
        <div className="tool-links">
          {POSTS.map((p) => (
            <a key={p.href} href={p.href}>
              <b>{p.title}</b>
              <span>{p.blurb}</span>
              <span>{p.meta} →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">CALCULATORS</p>
        <h2>Prefer to Run the Numbers?</h2>
        <p className="section-intro">
          Every article links back to a calculator. These are the most used:
        </p>
        <div className="tool-links">
          <a href="/texas-paycheck-calculator">
            <b>Texas Paycheck Calculator</b>
            <span>No state income tax on wages →</span>
          </a>
          <a href="/hourly-paycheck-calculator">
            <b>Hourly Paycheck Calculator</b>
            <span>Hourly wages and overtime →</span>
          </a>
          <a href="/state-paycheck-calculators">
            <b>All 50 State Paycheck Calculators</b>
            <span>Browse every state and city →</span>
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
