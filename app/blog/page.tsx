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
