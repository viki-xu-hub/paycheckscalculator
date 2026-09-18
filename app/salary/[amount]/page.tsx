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
import { occupationsNearSalary, occupationsSummary, basisLabel, wageFor, salaryPositionText, raiseExample, salaryBucketFaqs, formatEmployment, OES } from "../../lib/seo/uniqueContent";

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
  const faqs = [...salaryFaqs(s), ...salaryBucketFaqs(s.amount)];
  const position = salaryPositionText(s.amount);
  const raise = raiseExample(s.amount);
  const relatedLinks = salaryPageLinks(s);
  const breadcrumbSchema = salaryBreadcrumb(s.label, s.slug);

  const monthly = Math.round(s.amount / 12);
  const biweekly = Math.round(s.amount / 26);
  const weekly = Math.round(s.amount / 52);
  const semimonthly = Math.round(s.amount / 24);
  const hourly40 = (s.amount / 2080).toFixed(2);
  const hourly35 = (s.amount / 1820).toFixed(2);
  const kLabel = `$${Math.round(s.amount / 1000)}k`;
  const idx = salaries.findIndex(x => x.slug === s.slug);
  const lower = idx > 0 ? salaries[idx - 1] : null;
  const higher = idx < salaries.length - 1 ? salaries[idx + 1] : null;
  const jobs = occupationsNearSalary(s.amount, [lower?.amount, higher?.amount].filter((x): x is number => typeof x === "number"));
  const jobsSummary = occupationsSummary(jobs, "year");
  const jobBasis = jobs.basis;
  const chartSrc = `/images/salary/${s.amount}-a-year-is-how-much-an-hour.svg`;

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
  const bestState = stateComparison[0];
  const worstState = stateComparison[stateComparison.length - 1];
  const texas = stateComparison.find(x => x.abbr === "TX") ?? bestState;

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
    about: `${s.label} a year is how much an hour: hourly rate, pay-period breakdown and after-tax pay for a ${s.label} salary in 2026.`,
    primaryImageOfPage: { "@type": "ImageObject", url: `${meta.canonical.replace(/\/salary\/.*$/, "")}${chartSrc}`, width: 960, height: 420 },
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
        <div className="eyebrow">SALARY TO HOURLY 2026</div>
        <h1>{meta.h1}</h1>
        <div className="hero-intro">
          <p>
            {s.label} a year is how much an hour? <strong>${hourly40} an hour</strong> at 40 hours a
            week for 52 weeks (2,080 hours), or ${hourly35} an hour on a 35-hour week. Per pay period
            that is {fmt.format(monthly)} a month, {fmt.format(biweekly)} biweekly or {fmt.format(weekly)} a week
            before taxes.
          </p>
          <p>
            After taxes, {kLabel} a year is closer to {fmt.format(Math.round(texas.netAnnual))} in a
            no-income-tax state like Texas and {fmt.format(Math.round(worstState.netAnnual))} in {worstState.name}.
            Enter your state, filing status and deductions below to see your own net paycheck.
          </p>
        </div>
        <PaycheckCalculator defaultState="TX" navigateOnStateChange defaultSalary={s.amount} headingSuffix={` on ${s.label} a year`} />
        <div className="trust-row">
          <span>2026 IRS Method</span>
          <span>All 50 States</span>
          <span>Free to Use</span>
        </div>
      </section>

      {/* Pay Schedule Breakdown */}
      <article className="long-seo">
        <p className="kicker">PAY BREAKDOWN</p>
        <h2>{s.label} a Year Is How Much an Hour, a Month, and Biweekly?</h2>
        <section>
          <figure style={{ margin: "0 0 20px" }}>
            <img
              src={chartSrc}
              alt={`${s.label} a year is how much an hour — $${hourly40} an hour, ${fmt.format(monthly)} a month, ${fmt.format(biweekly)} biweekly and ${fmt.format(weekly)} a week before taxes (40 hours a week, 2026)`}
              width={960}
              height={420}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "auto", borderRadius: 12, border: "1px solid #e0e7ef" }}
            />
            <figcaption style={{ color: "#8595a5", fontSize: 12, marginTop: 8 }}>
              {s.label} a year converted to hourly, weekly, biweekly and monthly gross pay.
            </figcaption>
          </figure>
          <p>
            The math behind &ldquo;{s.label}{" "}a year is how much an hour&rdquo;: a full-time year is 40 hours
            × 52 weeks = 2,080 hours, so {s.label} ÷ 2,080 = <strong>${hourly40} an hour</strong>. If you
            only count the roughly 2,000 hours most people actually work after holidays and vacation, {kLabel} a
            year is about ${(s.amount / 2000).toFixed(2)} an hour. Here is the same salary split across common
            pay schedules before any taxes or deductions:
          </p>
          <ul className="checklist">
            <li><strong>Hourly (40 hrs/wk, 2,080 hrs):</strong> ${hourly40}</li>
            <li><strong>Hourly (35 hrs/wk, 1,820 hrs):</strong> ${hourly35}</li>
            <li><strong>Weekly (52×/yr):</strong> {fmt.format(weekly)}</li>
            <li><strong>Biweekly (26×/yr):</strong> {fmt.format(biweekly)}</li>
            <li><strong>Semimonthly (24×/yr):</strong> {fmt.format(semimonthly)}</li>
            <li><strong>Monthly (12×/yr):</strong> {fmt.format(monthly)}</li>
          </ul>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14, marginTop: 16 }}>
            These are gross amounts. Your take-home depends on your state, filing status and
            deductions — the calculator above gives a state-specific net estimate, and the table
            below shows {s.label} a year after tax in every supported state.
            {lower && (<> Earning a little less? <a href={`/salary/${lower.slug}`}>{lower.label} a year is how much an hour</a> — ${((s.amount - lower.amount) / 2080).toFixed(2)} an hour less than {s.label}.</>)}
            {higher && (<> Expecting a raise? <a href={`/salary/${higher.slug}`}>{higher.label} a year is how much an hour</a> — ${((higher.amount - s.amount) / 2080).toFixed(2)} an hour more, or {fmt.format(Math.round((higher.amount - s.amount) / 26))} per biweekly check.</>)}
          </p>
        </section>
      </article>

      {/* Jobs near this salary + where it sits */}
      <article className="long-seo">
        <p className="kicker">JOBS AT THIS SALARY</p>
        <h2>What Jobs Pay About {s.label} a Year?</h2>
        <section>
          <p>
            These occupations have a national {basisLabel(jobBasis)} salary closest to {s.label} a year,
            according to the BLS Occupational Employment and Wage Statistics survey ({OES.release}).
            {jobBasis === "median"
              ? "The median is the midpoint — half of workers in the job earn more, half earn less."
              : jobBasis === "p25"
              ? `Few large occupations have a median this low, so the table shows jobs where the bottom quarter of workers — typically new hires — earn about ${s.label} a year; the median column shows what the job pays once established.`
              : `Few large occupations have a median this high, so the table shows jobs where the top quarter of workers earn about ${s.label} a year; the median column shows the typical pay.`}
          </p>
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>Occupation</th>
                  {jobBasis !== "median" && <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>{jobBasis === "p25" ? "Entry-level" : "Experienced"} annual</th>}
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Median annual</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>Median hourly</th>
                  <th style={{ textAlign: "right", padding: "8px 10px", fontWeight: 600 }}>U.S. jobs</th>
                </tr>
              </thead>
              <tbody>
                {jobs.jobs.map((j, i) => (
                  <tr key={j.code} style={{ borderBottom: "1px solid #e0e7ef", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                    <td style={{ padding: "8px 10px" }}>{j.title}</td>
                    {jobBasis !== "median" && <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmt.format(wageFor(j, jobBasis, "annual"))}</td>}
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>{fmt.format(j.medianAnnual)}</td>
                    <td style={{ textAlign: "right", padding: "8px 10px", fontVariantNumeric: "tabular-nums" }}>${j.medianHourly.toFixed(2)}</td>
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

      {/* Raise worked example */}
      <article className="long-seo">
        <p className="kicker">MARGINAL TAX</p>
        <h2>A Raise on {s.label} a Year: How Much of It You Actually Keep</h2>
        <section>
          <p>
            On {s.label} a year a single filer with a standard W-4 pays about <strong>{raise.federalOnBase}</strong> in
            federal income tax and <strong>{raise.ficaOnBase}</strong> in Social Security and Medicare before any
            state tax. Because the U.S. system is marginal, a raise is taxed at your <em>top</em> rate, not your
            average rate — so the next dollar is worth less than the average dollar you already earn.
          </p>
          <p>
            Run through the 2026 withholding tables in a no-income-tax state, a $1,000 raise on {s.label} adds
            about <strong>{raise.keep1k}</strong> to annual take-home ({raise.keep1kPct}%), and a $5,000 raise adds
            roughly <strong>{raise.keep5k}</strong> — {raise.keep5kBiweekly} per biweekly paycheck. Add your state&rsquo;s
            income tax on top of that. Federal withholding follows{" "}
            <a href="https://www.irs.gov/publications/p15t" rel="noopener">IRS Publication 15-T</a>; Social Security
            (6.2%) applies up to the{" "}
            <a href="https://www.ssa.gov/oact/cola/cbb.html" rel="noopener">$184,500 wage base</a> and Medicare
            (1.45%) to every dollar. Our <a href="/methodology">methodology page</a> lists the tables.
          </p>
        </section>
      </article>

      {/* 38-State Comparison — real calculated numbers */}
      <article className="long-seo">
        <p className="kicker">TAKE-HOME PAY BY STATE</p>
        <h2>How Much Is {s.label} a Year After Taxes in Each State? (2026)</h2>
        <section>
          <p>
            Here is what {s.label} a year takes home after taxes in every supported state for 2026 —
            from {fmt.format(Math.round(bestState.netAnnual))} in {bestState.name} down to{" "}
            {fmt.format(Math.round(worstState.netAnnual))} in {worstState.name}. Calculated for a single
            filer, standard W-4, biweekly pay frequency, no pre-tax deductions. Sorted highest to lowest.
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
        <h2>{s.label} a Year — Frequently Asked Questions</h2>
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
        <h2>How Much an Hour Is {lower ? lower.label : "$25,000"} or {higher ? higher.label : "$300,000"} a Year — and Other Paycheck Calculators</h2>
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
