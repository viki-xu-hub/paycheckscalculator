import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaycheckCalculator from "../../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { hourlyMeta } from "../../lib/seo/meta";
import { hourlyFaqs } from "../../lib/seo/faqSchema";
import { hourlyPageLinks } from "../../lib/seo/internalLinks";
import { hourlyBreadcrumb } from "../../lib/seo/breadcrumb";
import type { HourlyData } from "../../lib/seo/types";
import hourlyRaw from "../../data/hourly-rates.json";
import { calculatePaycheck } from "../../lib/payroll";
import { locations } from "../../lib/locations";

const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "Paycheck Calculator 2026" }];
const LAST_MODIFIED = "2026-08-07";

const hourlyRates = hourlyRaw as HourlyData[];
const rateBySlug = Object.fromEntries(hourlyRates.map(h => [h.slug, h]));

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function generateStaticParams() {
  return hourlyRates.map(h => ({ rate: h.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ rate: string }> }
): Promise<Metadata> {
  const { rate: slug } = await params;
  const h = rateBySlug[slug];
  if (!h) return {};
  const meta = hourlyMeta(h);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    robots: { index: false, follow: true },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      type: "website",
      siteName: "Paycheck Calculator",
      images: OG_IMAGE,
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default async function HourlyCalculatorPage(
  { params }: { params: Promise<{ rate: string }> }
) {
  const { rate: slug } = await params;
  const h = rateBySlug[slug];
  if (!h) notFound();

  const meta = hourlyMeta(h);
  const faqs = hourlyFaqs(h);
  const relatedLinks = hourlyPageLinks(h);
  const breadcrumbSchema = hourlyBreadcrumb(h.label, h.slug);

  const weeklyGross = h.rate * 40;
  const biweeklyGross = h.rate * 80;
  const monthlyGross = Math.round(h.annualAt40h / 12);

  const stateComparison = locations
    .map(loc => {
      const r = calculatePaycheck({ grossAnnual: h.annualAt40h, frequency: "biweekly", status: "single", state: loc.short as import("../../lib/payroll").SupportedState });
      return {
        name: loc.name,
        slug: loc.slug,
        abbr: loc.short,
        noTax: loc.noTax ?? false,
        netAnnual: r.netAnnual,
        netBiweekly: Math.round(r.netAnnual / r.periods),
        netWeekly: Math.round(r.netAnnual / 52),
        netHourly: Math.round((r.netAnnual / 2080) * 100) / 100,
        stateTax: r.stateIncomeTax + r.statePayrollPremiums,
        effectiveRate: Math.round((1 - r.netAnnual / r.grossAnnual) * 1000) / 10,
      };
    })
    .sort((a, b) => b.netAnnual - a.netAnnual);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: meta.h1,
    url: meta.canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: meta.description,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.h1,
    url: meta.canonical,
    dateModified: LAST_MODIFIED,
    datePublished: "2026-08-07",
    about: `Hourly paycheck calculation for ${h.label}/hr earners in 2026.`,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">HOURLY PAYCHECK CALCULATOR 2026</div>
        <h1>{meta.h1}</h1>
        <div className="hero-intro">
          <p>
            Use our free calculator to estimate your take-home pay earning {h.label} an
            hour. At 40 hours per week, {h.label}/hr equals{" "}
            <strong>{fmt.format(h.annualAt40h)} per year</strong> in gross pay before taxes.
          </p>
          <p>
            Enter your state, filing status, and deductions below to see your net paycheck
            after federal income tax, Social Security, Medicare, and state taxes.
          </p>
        </div>
        <PaycheckCalculator defaultState="TX" navigateOnStateChange />
        <div className="trust-row">
          <span>2026 IRS Method</span>
          <span>All 50 States</span>
          <span>Free to Use</span>
        </div>
      </section>

      {/* Annual Breakdown */}
      <article className="long-seo">
        <p className="kicker">INCOME BREAKDOWN</p>
        <h2>{h.label} an Hour — Annual, Monthly, and Biweekly Gross Pay</h2>
        <section>
          <p>
            Working full-time at {h.label}/hr, here is how your gross pay breaks down
            across common pay schedules before any taxes or deductions:
          </p>
          <ul className="checklist">
            <li><strong>Annual (40 hrs/week):</strong> {fmt.format(h.annualAt40h)}</li>
            <li><strong>Annual (35 hrs/week):</strong> {fmt.format(h.annualAt35h)}</li>
            <li><strong>Monthly:</strong> {fmt.format(monthlyGross)}</li>
            <li><strong>Biweekly (80 hrs):</strong> {fmt.format(biweeklyGross)}</li>
            <li><strong>Weekly (40 hrs):</strong> {fmt.format(weeklyGross)}</li>
            <li><strong>Daily (8 hrs):</strong> {fmt.format(h.rate * 8)}</li>
          </ul>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14, marginTop: 16 }}>
            These are gross amounts before taxes. Your actual take-home depends on your
            state, filing status, and deductions. Use the calculator above to get a
            state-specific net pay estimate.
          </p>
        </section>
      </article>

      {/* Tax Withholding + State Comparison */}
      <article className="long-seo">
        <p className="kicker">TAX WITHHOLDING</p>
        <h2>Taxes on a {h.label}/hr Paycheck</h2>
        <section>
          <p>
            All U.S. employees earning {h.label}/hr have these federal taxes withheld
            from each paycheck:
          </p>
          <ul className="checklist">
            <li><strong>Federal income tax:</strong> Based on your W-4 elections and 2026 IRS withholding tables</li>
            <li><strong>Social Security:</strong> 6.2% on wages up to the annual wage base</li>
            <li><strong>Medicare:</strong> 1.45% on all wages (0.9% additional tax above thresholds)</li>
            <li><strong>State income tax:</strong> Varies by state — 9 states have no wage income tax</li>
          </ul>
        </section>
      </article>

      {/* 38-State Comparison — real calculated numbers */}
      <article className="long-seo">
        <p className="kicker">TAKE-HOME PAY BY STATE</p>
        <h2>{h.label} an Hour After Tax — All 38 States Compared (2026)</h2>
        <section>
          <p>
            Working full-time at {h.label}/hr ({fmt.format(h.annualAt40h)}/yr gross), here is your
            actual take-home pay in every supported state for 2026. Single filer, standard W-4,
            biweekly pay, 40 hrs/week. Sorted highest to lowest take-home pay.
          </p>
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>State</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Annual Net</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Biweekly Net</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Weekly Net</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Net/hr</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Eff. Rate</th>
                </tr>
              </thead>
              <tbody>
                {stateComparison.map((st, i) => (
                  <tr key={st.abbr} style={{ borderBottom: "1px solid #e0e7ef", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 500 }}>
                      <a href={`/${st.slug}`} style={{ color: "inherit" }}>{st.name}</a>
                    </td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(Math.round(st.netAnnual))}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmt.format(st.netBiweekly)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(st.netWeekly)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>${st.netHourly.toFixed(2)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{st.effectiveRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 13, marginTop: 12 }}>
            Single filer · standard W-4 · biweekly pay · 40 hrs/week · no pre-tax deductions · 2026 federal and state withholding tables.
            Actual paychecks vary based on filing status, allowances, and deductions.
          </p>
        </section>
      </article>

      {/* FAQ */}
      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>{h.label} an Hour — Paycheck FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}<span>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      {/* Internal Links */}
      <article className="long-seo">
        <p className="kicker">RELATED CALCULATORS</p>
        <h2>More Paycheck Calculators</h2>
        <section>
          <div className="tool-links">
            {relatedLinks.map(link => (
              <a key={link.href} href={link.href}>
                <b>{link.title}</b>
                <span>{link.description}</span>
              </a>
            ))}
          </div>
        </section>
      </article>

      {/* Disclaimer */}
      <div className="seo-disclaimer" style={{ maxWidth: 920, margin: "0 auto 40px" }}>
        <p>
          <strong>Disclaimer:</strong> This hourly paycheck calculator provides estimates
          for informational purposes only. Actual paycheck amounts may vary based on
          employer payroll systems, overtime rules, and individual tax circumstances.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
