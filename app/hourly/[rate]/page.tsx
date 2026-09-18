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
import { occupationsNearHourly, occupationsSummary, hourlyPositionText, overtimeExample, hourlyBucketFaqs, formatEmployment, OES } from "../../lib/seo/uniqueContent";

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

export default async function HourlyCalculatorPage(
  { params }: { params: Promise<{ rate: string }> }
) {
  const { rate: slug } = await params;
  const h = rateBySlug[slug];
  if (!h) notFound();

  const meta = hourlyMeta(h);
  const faqs = [...hourlyFaqs(h), ...hourlyBucketFaqs(h.rate)];
  const position = hourlyPositionText(h.rate);
  const ot = overtimeExample(h.rate);
  const relatedLinks = hourlyPageLinks(h);
  const breadcrumbSchema = hourlyBreadcrumb(h.label, h.slug);

  const weeklyGross = h.rate * 40;
  const biweeklyGross = h.rate * 80;
  const monthlyGross = Math.round(h.annualAt40h / 12);
  const dollar = `$${h.rate}`;
  const idx = hourlyRates.findIndex(x => x.slug === h.slug);
  const lower = idx > 0 ? hourlyRates[idx - 1] : null;
  const higher = idx < hourlyRates.length - 1 ? hourlyRates[idx + 1] : null;
  const jobs = occupationsNearHourly(h.rate, [lower?.rate, higher?.rate].filter((x): x is number => typeof x === "number"));
  const jobsSummary = occupationsSummary(jobs, "hour");
  const chartSrc = `/images/hourly/${h.rate}-an-hour-is-how-much-a-year.svg`;

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
  const bestState = stateComparison[0];
  const worstState = stateComparison[stateComparison.length - 1];
  const texas = stateComparison.find(s => s.abbr === "TX") ?? bestState;

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
    about: `${dollar} an hour is how much a year: gross and after-tax pay for ${h.label} earners in 2026.`,
    primaryImageOfPage: { "@type": "ImageObject", url: `${meta.canonical.replace(/\/hourly\/.*$/, "")}${chartSrc}`, width: 960, height: 420 },
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
            {dollar} an hour is how much a year? <strong>{fmt.format(h.annualAt40h)} before taxes</strong> at
            40 hours a week for 52 weeks. That is about {fmt.format(monthlyGross)} a month,{" "}
            {fmt.format(biweeklyGross)} every two weeks, or {fmt.format(weeklyGross)} a week in gross pay.
          </p>
          <p>
            After taxes, {dollar} an hour is closer to {fmt.format(Math.round(texas.netAnnual))} a year in a
            no-income-tax state like Texas and {fmt.format(Math.round(worstState.netAnnual))} in {worstState.name}.
            Enter your state, filing status and deductions below to see your own net paycheck.
          </p>
        </div>
        <PaycheckCalculator defaultState="TX" navigateOnStateChange hourly defaultHourlyRate={h.rate} defaultOvertime={0} headingSuffix={` at ${dollar} an hour`} />
        <div className="trust-row">
          <span>2026 IRS Method</span>
          <span>All 50 States</span>
          <span>Free to Use</span>
        </div>
      </section>

      {/* Annual Breakdown */}
      <article className="long-seo">
        <p className="kicker">INCOME BREAKDOWN</p>
        <h2>{dollar} an Hour Is How Much a Year, a Month, and Biweekly?</h2>
        <section>
          <figure style={{ margin: "0 0 20px" }}>
            <img
              src={chartSrc}
              alt={`${dollar} an hour is how much a year — ${fmt.format(h.annualAt40h)} a year, ${fmt.format(monthlyGross)} a month, ${fmt.format(biweeklyGross)} biweekly and ${fmt.format(weeklyGross)} a week before taxes (40 hours a week, 2026)`}
              width={960}
              height={420}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "auto", borderRadius: 12, border: "1px solid #e0e7ef" }}
            />
            <figcaption style={{ color: "#8595a5", fontSize: 12, marginTop: 8 }}>
              {dollar} an hour converted to yearly, monthly, biweekly, weekly and daily gross pay.
            </figcaption>
          </figure>
          <p>
            The math behind &ldquo;{dollar}{" "}an hour is how much a year&rdquo; is simple: 40 hours a week
            × 52 weeks = 2,080 working hours, and 2,080 × {dollar} = <strong>{fmt.format(h.annualAt40h)}</strong>.
            If your schedule is 35 hours a week, {dollar} an hour is {fmt.format(h.annualAt35h)} a year instead.
            Here is how that gross pay splits across common pay schedules before any taxes or deductions:
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
            These are gross amounts. Your actual take-home depends on your state, filing status
            and deductions — the calculator above gives a state-specific net estimate, and the
            table below shows {dollar} an hour after tax in every supported state.
            {lower && (<> Earning a little less? <a href={`/hourly/${lower.slug}`}>${lower.rate} an hour is how much a year</a> — {fmt.format((h.rate - lower.rate) * 2080)} less than {dollar}.</>)}
            {higher && (<> Expecting a raise? <a href={`/hourly/${higher.slug}`}>${higher.rate} an hour is how much a year</a> — {fmt.format((higher.rate - h.rate) * 2080)} more, or {fmt.format((higher.rate - h.rate) * 80)} per biweekly check.</>)}
          </p>
        </section>
      </article>

      {/* Jobs near this wage + where it sits */}
      <article className="long-seo">
        <p className="kicker">JOBS AT THIS WAGE</p>
        <h2>What Jobs Pay About {dollar} an Hour?</h2>
        <section>
          <p>
            These occupations have the national median wages closest to {dollar} an hour,
            according to the BLS Occupational Employment and Wage Statistics survey ({OES.release}).
            The median is the midpoint — half of workers in the job earn more, half earn less.
          </p>
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>Occupation</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Median hourly</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Median annual</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>U.S. jobs</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, i) => (
                  <tr key={j.code} style={{ borderBottom: "1px solid #e0e7ef", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                    <td style={{ padding: "8px 10px" }}>{j.title}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>${j.medianHourly.toFixed(2)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(j.medianAnnual)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{formatEmployment(j.employment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#8595a5", fontSize: 12, marginTop: 10 }}>
            Source: <a href={OES.sourceUrl} rel="noopener">BLS OEWS national estimates, {OES.release}</a>. Annual figures assume 2,080 hours.
          </p>
          <p>{jobsSummary}</p>
        </section>
        <section>
          <h3>{position.heading}</h3>
          <p>{position.body}</p>
        </section>
      </article>

      {/* Overtime worked example */}
      <article className="long-seo">
        <p className="kicker">OVERTIME</p>
        <h2>Overtime at {dollar} an Hour: What 5 Extra Hours a Week Is Worth</h2>
        <section>
          <p>
            Non-exempt hourly employees earn time-and-a-half after 40 hours in a week under the FLSA, so
            overtime at {dollar} an hour pays <strong>{ot.otRate}</strong> an hour (double time, where
            it applies, is {ot.doubleRate}). Working {ot.otHours} overtime hours every week adds{" "}
            <strong>{ot.extraGross}</strong> to your annual gross — {ot.extraBiweekly} per biweekly check.
          </p>
          <p>
            Overtime is taxed like any other wage, not at a special rate, but because it stacks on top of
            your base pay some of it is withheld at your highest federal bracket. Run through the 2026
            withholding tables for a single filer in a no-income-tax state, those {ot.otHours} hours a week
            net about <strong>{ot.extraNet}</strong> a year ({ot.extraNetBiweekly} per check), so you keep
            roughly {ot.keepRate}% of the overtime you earn. Federal withholding follows{" "}
            <a href="https://www.irs.gov/publications/p15t" rel="noopener">IRS Publication 15-T</a>; Social
            Security (6.2%, up to the{" "}
            <a href="https://www.ssa.gov/oact/cola/cbb.html" rel="noopener">$184,500 wage base</a>) and
            Medicare (1.45%) apply to every dollar. Our <a href="/methodology">methodology page</a> lists the tables.
          </p>
        </section>
      </article>

      {/* 38-State Comparison — real calculated numbers */}
      <article className="long-seo">
        <p className="kicker">TAKE-HOME PAY BY STATE</p>
        <h2>How Much Is {dollar} an Hour After Taxes in Each State? (2026)</h2>
        <section>
          <p>
            Working full-time at {h.label} ({fmt.format(h.annualAt40h)} a year gross), here is what{" "}
            {dollar} an hour is worth after tax in every supported state for 2026 — from{" "}
            {fmt.format(Math.round(bestState.netAnnual))} in {bestState.name} down to{" "}
            {fmt.format(Math.round(worstState.netAnnual))} in {worstState.name}. Single filer, standard W-4,
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
        <h2>{dollar} an Hour — Frequently Asked Questions</h2>
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
        <h2>How Much a Year Is {lower ? `$${lower.rate}` : "$10"} or {higher ? `$${higher.rate}` : "$150"} an Hour — and Other Paycheck Calculators</h2>
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
          <strong>Disclaimer:</strong> Estimates only — your employer&rsquo;s payroll system, W-4 elections
          and local taxes will change the exact figures.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
