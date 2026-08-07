import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PaycheckCalculator from "../../components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import type { SupportedState } from "../../lib/payroll";
import { stateMeta } from "../../lib/seo/meta";
import { stateFaqs } from "../../lib/seo/faqSchema";
import { statePageLinks } from "../../lib/seo/internalLinks";
import { stateBreadcrumb } from "../../lib/seo/breadcrumb";
import type { StateData } from "../../lib/seo/types";
import statesRaw from "../../data/states.json";
import { locations } from "../../lib/locations";

const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "Paycheck Calculator 2026" }];
const LAST_MODIFIED = "2026-08-07";

const states = statesRaw as StateData[];
const stateBySlug = Object.fromEntries(states.map(s => [s.slug, s]));
const supportedSlugs = new Set(locations.map(l => l.slug));

export function generateStaticParams() {
  return states.filter(s => supportedSlugs.has(s.slug)).map(s => ({ state: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ state: string }> }
): Promise<Metadata> {
  const { state: slug } = await params;
  const s = stateBySlug[slug];
  if (!s) return {};
  const meta = stateMeta(s);
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

export default async function StateCalculatorPage(
  { params }: { params: Promise<{ state: string }> }
) {
  const { state: slug } = await params;
  const s = stateBySlug[slug];
  if (!s) notFound();

  const meta = stateMeta(s);
  const faqs = stateFaqs(s);
  const relatedLinks = statePageLinks(s);

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
    about: `Payroll tax calculation and take-home pay estimation for ${s.name} employees in 2026.`,
  };

  const breadcrumbSchema = stateBreadcrumb(s.name, s.slug);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">2026 {s.abbr} PAYCHECK CALCULATOR</div>
        <h1>{meta.h1}</h1>
        <div className="hero-intro">
          <p>
            Use our free {s.name} paycheck calculator to estimate your 2026 take-home pay
            after federal taxes, Social Security, Medicare, and{" "}
            {s.hasStateTax ? `${s.name} state income tax` : "other payroll deductions"}.
          </p>
          {s.hasStateTax ? (
            <p>
              {s.name} imposes {s.taxType} on wages. Your actual take-home pay depends on
              your income level, filing status, allowances, and payroll deductions. Our
              calculator applies published 2026 withholding methods for a transparent estimate.
            </p>
          ) : (
            <p>
              {s.name} does not impose a state income tax on wages. However, your paycheck
              is still subject to federal tax withholding, FICA taxes, and any employee
              benefit deductions you select.
            </p>
          )}
          <p>Enter your salary information below to estimate your {s.name} paycheck.</p>
        </div>
        <PaycheckCalculator defaultState={s.abbr as SupportedState} navigateOnStateChange />
        <div className="trust-row">
          <span>2026 IRS Method</span>
          <span>Source-Backed Calculations</span>
          <span>Free to Use</span>
        </div>
      </section>

      {/* What's Included */}
      <article className="long-seo">
        <p className="kicker">{s.abbr} PAYCHECK BREAKDOWN</p>
        <h2>What This {s.name} Paycheck Calculator Includes</h2>
        <section>
          <p>This calculator estimates your net pay by accounting for all major payroll factors:</p>
          <ul className="checklist">
            <li>Federal income tax (2026 IRS withholding method)</li>
            <li>Social Security tax (6.2% on wages up to the annual wage base)</li>
            <li>Medicare tax (1.45%, plus 0.9% Additional Medicare Tax above thresholds)</li>
            {s.hasStateTax
              ? <li>{s.name} state income tax ({s.taxType})</li>
              : <li>No {s.name} state income tax</li>}
            <li>Pre-tax deductions (retirement, health insurance, FSA)</li>
            <li>Pay frequency adjustments (weekly, biweekly, semimonthly, monthly)</li>
          </ul>
        </section>
      </article>

      {/* State Tax Section */}
      <article className="long-seo">
        <p className="kicker">{s.abbr} TAX INFORMATION</p>
        <h2>
          {s.hasStateTax
            ? `How Does ${s.name} State Income Tax Work?`
            : `Does ${s.name} Have State Income Tax?`}
        </h2>
        <section>
          {s.hasStateTax ? (
            <>
              <p>
                <strong>{s.name} imposes {s.taxType} on wages.</strong> {s.taxNotes}
              </p>
              <p>
                In addition to state income tax, {s.name} employees also have these
                deductions from their paycheck:
              </p>
              <ul className="checklist">
                <li>Federal income tax</li>
                <li>Social Security tax (6.2%)</li>
                <li>Medicare tax (1.45%)</li>
                <li>{s.name} state income tax</li>
                <li>Employee benefit deductions</li>
              </ul>
              <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14, marginTop: 16 }}>
                {s.name} state income tax withholding is administered by the{" "}
                {s.taxAgency} and is separate from federal income tax.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>{s.name} does not impose an individual state income tax on wages.</strong>{" "}
                {s.taxNotes}
              </p>
              <p>{s.name} employees may still have these payroll deductions:</p>
              <ul className="checklist">
                <li>Federal income tax</li>
                <li>Social Security tax (6.2%)</li>
                <li>Medicare tax (1.45%)</li>
                <li>Employer benefit deductions</li>
                <li>Retirement contributions</li>
              </ul>
            </>
          )}
        </section>
      </article>

      {/* Gross vs Net */}
      <article className="long-seo">
        <p className="kicker">GROSS VS NET</p>
        <h2>Understanding Your {s.name} Gross Pay and Take-Home Pay</h2>
        <section>
          <p>
            <strong>Gross pay</strong> is your earnings before any taxes or deductions.
            For salaried employees, this is your annual salary divided by the number of pay
            periods. For hourly workers, it is your hourly rate multiplied by hours worked.
          </p>
          <p>
            <strong>Net pay</strong> (take-home pay) is what remains after required taxes
            and deductions are removed. For {s.name} employees, the gap between gross and
            net is affected by{" "}
            {s.hasStateTax
              ? `federal income tax, ${s.name} state income tax (${s.taxType}), Social Security, Medicare, and any personal deductions`
              : `federal income tax, Social Security, Medicare, and personal deductions`}.
          </p>
        </section>
      </article>

      {/* Methodology */}
      <article className="long-seo">
        <p className="kicker">CALCULATION SOURCES</p>
        <h2>How We Calculate Your {s.name} Paycheck</h2>
        <section>
          <p><strong>1.</strong> Annualize your wages based on your selected pay frequency.</p>
          <p><strong>2.</strong> Apply eligible pre-tax deductions to reduce taxable income.</p>
          <p><strong>3.</strong> Estimate federal income tax using the 2026 IRS withholding method.</p>
          <p>
            <strong>4.</strong>{" "}
            {s.hasStateTax
              ? `Calculate ${s.name} state income tax using published 2026 withholding tables from the ${s.taxAgency}.`
              : `${s.name} has no state income tax withholding.`}
          </p>
          <p><strong>5.</strong> Calculate Social Security (6.2%) and Medicare (1.45%) taxes.</p>
          <p><strong>6.</strong> Convert the annual estimate back to your selected pay frequency.</p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Last Updated: August 2026</small></p>
        </div>
      </article>

      {/* FAQ */}
      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>{s.name} Paycheck Calculator FAQ</h2>
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
          <strong>Disclaimer:</strong> This {s.name} paycheck calculator provides estimates
          for informational purposes only. Actual paycheck amounts may vary. For specific
          tax advice, consult a qualified tax professional.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
