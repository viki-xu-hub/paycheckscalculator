import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaycheckCalculator from "../../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { salaryMeta } from "../../lib/seo/meta";
import { salaryFaqs } from "../../lib/seo/faqSchema";
import { salaryPageLinks } from "../../lib/seo/internalLinks";
import { salaryBreadcrumb } from "../../lib/seo/breadcrumb";
import type { SalaryData } from "../../lib/seo/types";
import salaryRaw from "../../data/salary.json";
import { calculatePaycheck } from "../../lib/payroll";
import { locations } from "../../lib/locations";

const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "Paycheck Calculator 2026" }];
const LAST_MODIFIED = "2026-08-07";

const salaries = salaryRaw as SalaryData[];
const salaryBySlug = Object.fromEntries(salaries.map(s => [s.slug, s]));

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function generateStaticParams() {
  return salaries.map(s => ({ amount: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ amount: string }> }
): Promise<Metadata> {
  const { amount: slug } = await params;
  const s = salaryBySlug[slug];
  if (!s) return {};
  const meta = salaryMeta(s);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    robots: { index: true, follow: true },
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

export default async function SalaryCalculatorPage(
  { params }: { params: Promise<{ amount: string }> }
) {
  const { amount: slug } = await params;
  const s = salaryBySlug[slug];
  if (!s) notFound();

  const meta = salaryMeta(s);
  const faqs = salaryFaqs(s);
  const relatedLinks = salaryPageLinks(s);
  const breadcrumbSchema = salaryBreadcrumb(s.label, s.slug);

  const monthly = Math.round(s.amount / 12);
  const biweekly = Math.round(s.amount / 26);
  const weekly = Math.round(s.amount / 52);
  const semimonthly = Math.round(s.amount / 24);

  const stateComparison = locations
    .map(loc => {
      const r = calculatePaycheck({ grossAnnual: s.amount, frequency: "biweekly", status: "single", state: loc.short as import("../../lib/payroll").SupportedState });
      return {
        name: loc.name,
        slug: loc.slug,
        abbr: loc.short,
        noTax: loc.noTax ?? false,
        netAnnual: r.netAnnual,
        netBiweekly: Math.round(r.netAnnual / r.periods),
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
    about: `Take-home pay calculation for a ${s.label} annual salary in 2026.`,
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
        <div className="eyebrow">SALARY AFTER TAX 2026</div>
        <h1>{meta.h1}</h1>
        <div className="hero-intro">
          <p>
            How much is {s.label} a year after taxes? Use our free 2026 calculator to
            estimate your take-home pay from a {s.label} salary after federal income tax,
            Social Security, Medicare, and state taxes.
          </p>
          <p>
            At {s.label}/year, your gross biweekly paycheck is{" "}
            <strong>{fmt.format(biweekly)}</strong> before taxes. Your net take-home will
            vary by state, filing status, and deductions.
          </p>
        </div>
        <PaycheckCalculator defaultState="TX" navigateOnStateChange />
        <div className="trust-row">
          <span>2026 IRS Method</span>
          <span>All 50 States</span>
          <span>Free to Use</span>
        </div>
      </section>

      {/* Pay Schedule Breakdown */}
      <article className="long-seo">
        <p className="kicker">PAY BREAKDOWN</p>
        <h2>{s.label} a Year — Gross Pay by Pay Schedule</h2>
        <section>
          <p>
            Here is how a {s.label} annual salary breaks down into gross pay by pay
            frequency before taxes or deductions:
          </p>
          <ul className="checklist">
            <li><strong>Annual:</strong> {fmt.format(s.amount)}</li>
            <li><strong>Monthly (12×/yr):</strong> {fmt.format(monthly)}</li>
            <li><strong>Semimonthly (24×/yr):</strong> {fmt.format(semimonthly)}</li>
            <li><strong>Biweekly (26×/yr):</strong> {fmt.format(biweekly)}</li>
            <li><strong>Weekly (52×/yr):</strong> {fmt.format(weekly)}</li>
            <li><strong>Hourly equivalent (40 hrs/wk):</strong> ~${s.hourlyEquivalent}/hr</li>
          </ul>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14, marginTop: 16 }}>
            These are gross amounts. Your net take-home after taxes depends on your state,
            filing status, pre-tax deductions, and retirement contributions.
          </p>
        </section>
      </article>

      {/* Tax Explanation */}
      <article className="long-seo">
        <p className="kicker">FEDERAL TAX WITHHOLDING</p>
        <h2>Federal Taxes on a {s.label} Salary</h2>
        <section>
          <p>
            A {s.label} salary is subject to the following federal payroll taxes in 2026:
          </p>
          <ul className="checklist">
            <li><strong>Federal income tax:</strong> Marginal rate based on your W-4 elections and 2026 tax brackets</li>
            <li><strong>Social Security:</strong> 6.2% on wages up to the annual wage base ($176,100 in 2026)</li>
            <li><strong>Medicare:</strong> 1.45% on all wages (plus 0.9% Additional Medicare Tax above $200,000 single / $250,000 MFJ)</li>
            <li><strong>State income tax:</strong> Varies by state — use the calculator above to enter your state</li>
          </ul>
        </section>
      </article>

      {/* 38-State Comparison — real calculated numbers */}
      <article className="long-seo">
        <p className="kicker">TAKE-HOME PAY BY STATE</p>
        <h2>{s.label} Salary After Tax — All 38 States Compared (2026)</h2>
        <section>
          <p>
            Here is what a {s.label} salary takes home after taxes in every supported state
            for 2026. Calculated for a single filer, standard W-4, biweekly pay frequency,
            no pre-tax deductions. Sorted highest to lowest take-home pay.
          </p>
          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>State</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Annual Net</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Biweekly Net</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>State Tax</th>
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
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", color: st.noTax ? "#16a34a" : "#667a8a" }}>
                      {st.noTax ? "$0" : fmt.format(Math.round(st.stateTax))}
                    </td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{st.effectiveRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 13, marginTop: 12 }}>
            Single filer · standard W-4 · biweekly pay · no pre-tax deductions · 2026 federal and state withholding tables.
            Actual paychecks vary based on filing status, allowances, and deductions.
          </p>
        </section>
      </article>

      {/* FAQ */}
      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>{s.label} Salary After Tax — FAQ</h2>
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
          <strong>Disclaimer:</strong> This salary after-tax calculator provides estimates
          for informational purposes only. Actual take-home amounts may vary based on
          employer payroll systems, benefit elections, and individual tax circumstances.
          For specific tax advice, consult a qualified tax professional.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
