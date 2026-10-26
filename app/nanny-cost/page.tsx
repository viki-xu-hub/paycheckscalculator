import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const CANONICAL = "https://www.paycheckscalculator.org/nanny-cost";

export const metadata: Metadata = {
  title: "How Much Do Nannies Cost? Average Nanny Pay Rates (2026)",
  description:
    "How much does a nanny cost? See 2026 nanny salary averages by location, experience, and number of kids. Plus the full cost of employing a nanny including taxes and benefits.",
  alternates: { canonical: "/nanny-cost" },
  openGraph: {
    title: "How Much Do Nannies Cost? Average Nanny Pay Rates (2026)",
    description:
      "How much does a nanny cost? See 2026 nanny salary averages by location, experience, and number of kids. Plus the full cost of employing a nanny including taxes and benefits.",
    url: CANONICAL,
    type: "article",
  },
};

const FAQS = [
  {
    q: "How much do nannies make per hour?",
    a: "The national average hourly rate for nannies in 2026 is roughly $20–$25 per hour for full-time care of one or two children. Entry-level nannies may start around $15–$18/hr, while experienced nannies, newborn specialists, and those in high-cost-of-living cities can earn $30–$35+/hr. The rate depends heavily on location, years of experience, number of children, and job responsibilities.",
  },
  {
    q: "How much does a full-time nanny cost per year?",
    a: "A full-time nanny working 40 hours per week at $25/hr costs about $52,000 per year in base wages alone. But the total annual cost to a family is higher — typically 15–25% more when you add employer payroll taxes (Social Security, Medicare, FUTA, SUTA), paid time off, and other benefits. For a $25/hr nanny, the true annual cost is roughly $60,000–$65,000 including taxes and benefits.",
  },
  {
    q: "Do nannies get paid overtime?",
    a: "Yes, most nannies are entitled to overtime pay under the Fair Labor Standards Act (FLSA). Live-out nannies must be paid 1.5 times their regular hourly rate for any hours worked over 40 in a week. Live-in nannies are exempt from federal overtime requirements in most states, but some states (like California) require overtime for live-in nannies after a certain number of hours. Always check your state's labor laws.",
  },
  {
    q: "What is the nanny tax?",
    a: "The 'nanny tax' refers to the payroll tax obligations that come with hiring a household employee like a nanny. If you pay a nanny $2,700 or more in a year (2026 threshold), you are considered a household employer and must pay employer-side payroll taxes: 6.2% Social Security, 1.45% Medicare, plus federal unemployment tax (FUTA) and state unemployment tax (SUTA). You are also responsible for withholding the employee's share of FICA and federal/state income tax from their paycheck.",
  },
  {
    q: "Is a nanny cheaper than daycare?",
    a: "It depends on how many children you have. For one child, daycare is usually cheaper — average daycare costs $10,000–$18,000 per year, while a full-time nanny costs $40,000–$65,000+. But for two or more children, the gap narrows significantly because a nanny cares for all your kids for the same rate, whereas daycare charges per child. A nanny also offers more personalized care, flexibility, and convenience.",
  },
  {
    q: "Do you pay a nanny during vacation?",
    a: "Yes, most full-time nannies receive paid vacation time as part of their benefits package. The standard is 1–2 weeks of paid vacation per year, plus paid holidays and sick days. Paid time off is negotiated upfront and written into the work agreement. If the family goes on vacation and the nanny is not needed, they are typically still paid if it falls within their contracted paid time off, or if the family chooses to give them paid time off.",
  },
  {
    q: "How much do you pay a nanny overnight?",
    a: "Overnight nanny rates vary by location and the number of children, but a common approach is to pay the regular hourly rate for awake hours and a reduced flat rate for sleeping hours. Many families pay $100–$200 per night on top of the regular hourly rate for evening hours, or negotiate a flat overnight rate of $150–$300 depending on the number of kids and responsibilities. Always clarify overnight pay expectations in advance.",
  },
  {
    q: "Can I use a Dependent Care FSA for a nanny?",
    a: "Yes, if you have a Dependent Care FSA through your employer, you can use pre-tax dollars to pay your nanny, as long as the care is for a qualifying child under age 13 (or a disabled dependent) and is necessary so you can work. The 2026 contribution limit is $7,500 per household. You will need to provide your nanny's name and Tax ID number (SSN or EIN) to your FSA administrator for reimbursement.",
  },
];

export default function NannyCostGuide() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How Much Do Nannies Cost? Average Nanny Pay Rates (2026)",
    description:
      "How much does a nanny cost? See 2026 nanny salary averages by location, experience, and number of kids. Plus the full cost of employing a nanny including taxes and benefits.",
    url: CANONICAL,
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
    image: "https://www.paycheckscalculator.org/og.png",
    datePublished: "2026-09-25",
    dateModified: "2026-09-25",
    inLanguage: "en-US",
    articleSection: "Child Care Costs",
    keywords:
      "how much do nannies make, how much do nannies get paid, how much does a nanny cost, nanny cost, nanny salary, nanny pay rates 2026, nanny tax",
    author: { "@type": "Organization", name: "Paycheck Atlas Editorial Team", url: "https://www.paycheckscalculator.org/about" },
    publisher: { "@type": "Organization", name: "Paycheck Atlas", url: "https://www.paycheckscalculator.org" },
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
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.paycheckscalculator.org/blog" },
      { "@type": "ListItem", position: 3, name: "Nanny Cost Guide" },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href="/blog">Blog</a>
        <span aria-hidden="true">›</span>
        <span>Nanny Cost</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">NANNY PAY · 2026</div>
        <h1>How Much Do Nannies Make? Average Nanny Pay for 2026</h1>
        <p className="hero-copy">
          <strong>How much does a nanny cost?</strong> The short answer: the national average is about
          $20–$25 per hour for full-time care, but rates range from $15/hr in rural areas to $35+/hr
          in major cities. What a nanny takes home and what a family actually pays are two different
          numbers — payroll taxes, benefits, and overtime all add to the total cost. This guide breaks
          down current nanny pay rates by location, experience, and family size, plus the full cost of
          legally employing a nanny.
        </p>
      </section>

      <article className="long-seo">
        <p className="kicker">AVERAGE RATES</p>
        <h2>Average Nanny Pay Rates (2026)</h2>
        <section>
          <p>
            Nanny pay has risen steadily over the past several years, driven by increased demand,
            inflation, and a competitive market for experienced caregivers. In 2026, the typical
            full-time nanny earns between <strong>$20 and $25 per hour</strong> nationwide — but
            averages tell only part of the story.
          </p>
          <p>
            Where you live, how many children need care, the nanny's experience level, and the duties
            involved all move the rate up or down. A newborn specialist in San Francisco can command
            twice as much per hour as a recent high school graduate watching one toddler in a small
            town.
          </p>

          <h3 style={{ marginTop: 24 }}>National average hourly rates</h3>
          <div style={{ background: "#f0f7ff", border: "1px solid #b3d4ff", borderRadius: 12, padding: "20px 24px", marginTop: 16 }}>
            <p style={{ margin: 0, fontWeight: 600, color: "#1a56db" }}>2026 quick stats</p>
            <ul style={{ margin: "10px 0 0", paddingLeft: 20, color: "#1e40af", lineHeight: 1.8 }}>
              <li><strong>National average:</strong> $20–$25/hr for full-time, one child</li>
              <li><strong>Entry-level (0–1 yr experience):</strong> $15–$18/hr</li>
              <li><strong>Experienced (5+ yrs):</strong> $25–$32/hr</li>
              <li><strong>High-cost cities (NYC, SF):</strong> $28–$38/hr</li>
              <li><strong>Rural / low-cost areas:</strong> $15–$20/hr</li>
              <li><strong>Each additional child:</strong> +$1–$3/hr</li>
            </ul>
          </div>
          <p style={{ marginTop: 16 }}>
            These figures are gross hourly wages before taxes and do not include benefits, overtime,
            or the employer's share of payroll taxes. We will cover the <strong>total cost to a family</strong> —
            often 15–25% above the base wage — later in this guide.
          </p>

          <h3 style={{ marginTop: 28 }}>Nanny pay by number of children</h3>
          <p>
            Most nannies charge a base rate for one child and add a smaller amount for each additional
            child. The per-child increment is typically <strong>$1–$3 per hour</strong> rather than a
            full doubling or tripling of the rate, since one caregiver can supervise multiple children
            at once.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Number of Children</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Typical Hourly Rate</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Annual Full-Time (40 hrs)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>1 child</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$18–$25/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$37,440–$52,000</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>2 children</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$20–$28/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$41,600–$58,240</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>3 children</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$22–$32/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$45,760–$66,560</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>4+ children</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$25–$38/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$52,000–$79,040</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 8, fontSize: 13, color: "#667a8a" }}>
            Rates shown are national averages for experienced nannies. Adjust up for high-cost cities
            and down for rural areas. Annual figures assume 52 weeks at 40 hours per week, no overtime,
            gross of taxes.
          </p>

          <h3 style={{ marginTop: 28 }}>Nanny pay by experience level</h3>
          <p>
            Experience is one of the biggest factors in nanny pay. A caregiver who has worked with
            infants for a decade, holds certifications in CPR and early childhood education, and can
            handle children with special needs commands a premium over someone just starting out.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Experience Level</th>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>What You Get</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Hourly Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Entry-level (0–1 yr)</td>
                <td style={{ padding: "10px", fontSize: 14, color: "#5f7485" }}>High school or college student, first nanny job, basic supervision</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$15–$18/hr</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>1–3 years experience</td>
                <td style={{ padding: "10px", fontSize: 14, color: "#5f7485" }}>Several years of childcare experience, CPR certified, can handle routines</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$18–$22/hr</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>3–5 years experience</td>
                <td style={{ padding: "10px", fontSize: 14, color: "#5f7485" }}>Professional nanny, multiple long-term positions, drives, plans activities</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$22–$27/hr</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>5+ years experience</td>
                <td style={{ padding: "10px", fontSize: 14, color: "#5f7485" }}>Career nanny, references, newborn or toddler specialty, degree in ECE</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$27–$33/hr</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Newborn specialist / NCS</td>
                <td style={{ padding: "10px", fontSize: 14, color: "#5f7485" }}>Trained in newborn care, sleep coaching, feeding support, often overnight shifts</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$30–$45+/hr</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 8, fontSize: 13, color: "#667a8a" }}>
            Rates are approximate and vary by location. Newborn Care Specialists (NCS) and night nannies
            often charge premium rates, especially for overnight work.
          </p>
        </section>

        <p className="kicker">COST BY CITY</p>
        <h2>Nanny Cost by City</h2>
        <section>
          <p>
            Location is the single biggest factor in how much a nanny costs. Nanny pay tracks closely
            with cost of living — families in expensive coastal cities pay dramatically more than
            families in the South or Midwest. The difference between San Francisco and Dallas can be
            as much as <strong>$15 per hour</strong> for the same level of care.
          </p>
          <p>
            This makes sense when you think about it: nannies need to earn enough to live where they
            work, and supply and demand vary by market. Cities with more two-income professional
            households and fewer available caregivers tend to have the highest rates.
          </p>

          <h3 style={{ marginTop: 24 }}>Average nanny hourly rates by city</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>City</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Avg. Hourly Rate (1 child)</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Annual Full-Time</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>San Francisco, CA</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$28–$38/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$58,240–$79,040</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>New York City, NY</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$27–$36/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$56,160–$74,880</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Boston, MA</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$25–$33/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$52,000–$68,640</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>Los Angeles, CA</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$24–$32/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$49,920–$66,560</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Seattle, WA</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$25–$32/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$52,000–$66,560</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>Chicago, IL</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$22–$28/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$45,760–$58,240</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Washington, DC</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$24–$30/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$49,920–$62,400</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>Atlanta, GA</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$19–$25/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$39,520–$52,000</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Dallas, TX</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$18–$24/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$37,440–$49,920</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>Phoenix, AZ</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$17–$23/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$35,360–$47,840</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Houston, TX</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$17–$23/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$35,360–$47,840</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}>Columbus, OH</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$16–$21/hr</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$33,280–$43,680</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 8, fontSize: 13, color: "#667a8a" }}>
            Rates are approximate for full-time experienced nannies caring for 1–2 children. Actual
            rates vary by neighborhood, experience level, and job responsibilities.
          </p>

          <h3 style={{ marginTop: 28 }}>Why location matters so much</h3>
          <p>
            Nanny rates are primarily driven by two factors: <strong>cost of living</strong> and
            <strong> supply and demand</strong>.
          </p>
          <ul className="checklist">
            <li><strong>Cost of living:</strong> Nannies need to earn enough to pay their own rent, groceries, and bills. In cities where a one-bedroom apartment costs $3,000+ per month, nanny rates have to be higher to attract and retain caregivers.</li>
            <li><strong>Demand from families:</strong> Cities with a high concentration of two-income professional families have more demand for nannies. Tech hubs like San Francisco and Seattle, and financial centers like New York and Boston, consistently have the highest demand — and the highest pay.</li>
            <li><strong>Local minimum wage:</strong> Many cities and states have minimum wages well above the federal $7.25/hr. Nanny rates are always well above minimum wage, but a higher local floor pushes all wages up.</li>
            <li><strong>Cost of alternatives:</strong> If daycare centers in your area charge $2,000+ per month per child, nannies can charge more because families are already used to high child care costs.</li>
          </ul>
        </section>

        <p className="kicker">FULL COST</p>
        <h2>Beyond Hourly Rate: The Full Cost of a Nanny</h2>
        <section>
          <p>
            The hourly rate is just the starting point. When you hire a nanny, you are becoming a
            <strong> household employer</strong>, which means you have payroll tax obligations and
            typically offer benefits. The total cost to employ a nanny is usually <strong>15–25% higher</strong>
            than the base wage alone.
          </p>
          <p>
            This is one of the most common surprises for families new to hiring a nanny. They budget
            for the hourly rate, then discover they also need to cover Social Security, Medicare,
            unemployment taxes, paid time off, and more. Understanding the full cost upfront helps
            you avoid budget shortfalls later.
          </p>

          <h3 style={{ marginTop: 24 }}>Payroll taxes (the "nanny tax")</h3>
          <p>
            If you pay a nanny <strong>$2,700 or more in a calendar year</strong> (the 2026 threshold),
            you are considered a household employer by the IRS. That means you are responsible for
            both <em>employer-side</em> payroll taxes and for <em>withholding</em> the employee's share
            of taxes from their pay.
          </p>
          <p>Here is what employers pay:</p>
          <ul className="checklist">
            <li><strong>Social Security:</strong> 6.2% of wages (up to the Social Security wage base — $168,600 in 2026)</li>
            <li><strong>Medicare:</strong> 1.45% of all wages (no wage cap)</li>
            <li><strong>FUTA (Federal Unemployment Tax Act):</strong> 6% on the first $7,000 of wages, but most employers get a 5.4% credit for state unemployment taxes, reducing it to 0.6% ($42 per year)</li>
            <li><strong>SUTA (State Unemployment Tax Act):</strong> Varies by state, typically 1–5% on the first $7,000–$50,000+ of wages depending on your state and experience rating</li>
          </ul>
          <p>And here is what the employee pays (you withhold it from their paycheck):</p>
          <ul className="checklist">
            <li><strong>Federal Income Tax (FIT):</strong> Based on the employee's W-4 form, filing status, income, and deductions. Use our <a href="/fit-tax-meaning">FIT tax guide</a> to understand how it works.</li>
            <li><strong>Social Security:</strong> 6.2% (matched by the employer)</li>
            <li><strong>Medicare:</strong> 1.45% (matched by the employer)</li>
            <li><strong>State Income Tax:</strong> Varies by state — some states have no income tax, others have progressive rates</li>
          </ul>
          <p>
            Curious what a nanny actually takes home? Use our <a href="/">paycheck calculator</a> to
            estimate net pay after federal and state withholding, FICA, and pre-tax deductions.
          </p>

          <h3 style={{ marginTop: 28 }}>Benefits that add to cost</h3>
          <p>
            Beyond taxes, most families offer their nanny a benefits package. These are not legally
            required in most cases, but they are standard for full-time nannies and help attract and
            retain good caregivers.
          </p>
          <ul className="checklist">
            <li><strong>Paid time off (PTO):</strong> 1–2 weeks of paid vacation per year is standard, plus 5–10 paid holidays. Many families also offer 3–5 paid sick days.</li>
            <li><strong>Health insurance stipend:</strong> Some families contribute $100–$400 per month toward the nanny's health insurance premium. This is a taxable benefit unless set up through a qualified plan.</li>
            <li><strong>Mileage reimbursement:</strong> If the nanny uses their own car for driving kids to school, activities, or errands, you should reimburse them at the IRS standard mileage rate (67.5¢ per mile for 2026).</li>
            <li><strong>Annual bonus or raise:</strong> A holiday bonus (typically one week's pay) or an annual raise of 3–5% is common for nannies who stay long-term.</li>
            <li><strong>Professional development:</strong> Some families pay for CPR renewal, early childhood education classes, or nanny conferences.</li>
            <li><strong>Guaranteed hours:</strong> Many nannies negotiate a guaranteed minimum number of paid hours per week, so they still get paid even if the family goes out of town or doesn't need care that day.</li>
          </ul>

          <h3 style={{ marginTop: 28 }}>Example: $25/hr nanny's true cost</h3>
          <p>
            Let us walk through a concrete example. Suppose you hire a full-time nanny at $25 per hour,
            working 40 hours per week, and you live in a state with a 3% SUTA rate on the first $9,000.
            Here is what the total annual cost looks like:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginTop: 16 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <th style={{ textAlign: "left", padding: "10px", fontWeight: 600 }}>Cost Category</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>Annual Cost</th>
                <th style={{ textAlign: "right", padding: "10px", fontWeight: 600 }}>% of Base</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px" }}>Base wages ($25/hr × 40 hrs × 52 wks)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>$52,000</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>100%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>Employer Social Security (6.2%)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$3,224</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>6.2%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>Employer Medicare (1.45%)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$754</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>1.45%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>FUTA (0.6% on first $7,000)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$42</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>0.08%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>SUTA (3% on first $9,000)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$270</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>0.52%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px" }}><strong>Total employer taxes</strong></td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>$4,290</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>8.25%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>Paid vacation (10 days)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$2,000</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>3.8%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>Paid holidays (10 days)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$2,000</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>3.8%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>Health stipend ($200/mo)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$2,400</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>4.6%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e0e7ef", background: "rgba(0,0,0,0.02)" }}>
                <td style={{ padding: "10px", paddingLeft: 24 }}>Mileage reimbursement (est.)</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>$1,200</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums" }}>2.3%</td>
              </tr>
              <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
                <td style={{ padding: "10px", fontWeight: 700 }}>Total annual cost</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "#16a34a" }}>$63,890</td>
                <td style={{ textAlign: "right", padding: "10px", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>~123%</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 8, fontSize: 13, color: "#667a8a" }}>
            Example for illustrative purposes only. Actual SUTA rates and wage bases vary by state.
            Paid time off and benefits are negotiable and vary by family.
          </p>
          <p style={{ marginTop: 16 }}>
            In this example, the family's total cost is about <strong>$63,890 per year</strong> — roughly
            23% above the $52,000 base wage. That is a meaningful difference, and it is why it is so
            important to budget for the full cost, not just the hourly rate.
          </p>
        </section>

        <p className="kicker">PAY STRUCTURES</p>
        <h2>Nanny Pay Structures</h2>
        <section>
          <p>
            Nannies can be paid in different ways depending on the arrangement. The pay structure
            affects everything from taxes to overtime eligibility to how easy it is to budget. Here
            are the most common structures and what you need to know about each.
          </p>

          <h3 style={{ marginTop: 20 }}>Hourly vs salaried</h3>
          <p>
            Most nannies are paid <strong>hourly</strong>, which is generally the simplest and most
            compliant approach. Hourly pay makes it easy to track hours, calculate overtime, and
            adjust for schedule changes. Because nannies are almost always non-exempt employees under
            the FLSA (meaning they are entitled to overtime), hourly pay is the most straightforward
            way to comply with labor laws.
          </p>
          <p>
            Some families prefer a <strong>salary</strong> arrangement for predictability. A salary
            can work, but you need to be careful: salaried non-exempt employees are still entitled to
            overtime, so the salary must be structured to account for any hours over 40 per week.
            Many families who use a salary structure set it based on a guaranteed number of hours
            (e.g., 45 hours per week) with overtime already built in.
          </p>
          <ul className="checklist">
            <li><strong>Hourly:</strong> Best for most situations. Simple, compliant, easy to adjust for schedule changes.</li>
            <li><strong>Salary:</strong> Can work for predictable full-time schedules, but must still track hours and pay overtime correctly.</li>
            <li><strong>Guaranteed hours:</strong> A hybrid where the nanny is guaranteed a minimum number of paid hours per week, even if you don't need them. Provides income security for the nanny.</li>
          </ul>

          <h3 style={{ marginTop: 28 }}>Live-in vs live-out nannies</h3>
          <p>
            Live-out nannies commute to your home each day and are the most common arrangement.
            Live-in nannies live in your home, often with a private bedroom and bathroom, and
            sometimes meals and utilities included in their compensation.
          </p>
          <p>
            Live-in nannies may have a slightly lower hourly rate because room and board are provided,
            but the total compensation value is comparable. Under federal law, live-in nannies are
            <strong> exempt from overtime requirements</strong>, though some states (like California)
            require overtime for live-in domestic workers after a certain number of hours per day
            or week.
          </p>
          <ul className="checklist">
            <li><strong>Live-out:</strong> Most common. Nanny commutes daily. Eligible for overtime after 40 hours/week under federal law.</li>
            <li><strong>Live-in:</strong> Nanny lives in your home. Lower cash rate but includes housing. Exempt from federal overtime (check state rules).</li>
          </ul>

          <h3 style={{ marginTop: 28 }}>Full-time vs part-time</h3>
          <p>
            Full-time nannies typically work 40–50 hours per week and command a higher hourly rate
            than part-time nannies. This may seem counterintuitive, but full-time nannies are more
            experienced, more committed, and harder to find — so they can charge more.
          </p>
          <p>
            Part-time nannies (under 30 hours per week) often have a slightly lower hourly rate,
            but the gap is not huge. Many part-time nannies work multiple jobs to piece together
            full-time income. Part-time arrangements may or may not include benefits like paid time
            off or health insurance.
          </p>
          <ul className="checklist">
            <li><strong>Full-time (40+ hrs/week):</strong> Higher hourly rate, more experienced nannies, usually includes benefits.</li>
            <li><strong>Part-time (&lt;30 hrs/week):</strong> Slightly lower hourly rate, may be a student or someone with other jobs, benefits vary.</li>
            <li><strong>Summer only / temporary:</strong> Similar hourly rates to regular nannies, but no long-term commitment or benefits.</li>
          </ul>

          <h3 style={{ marginTop: 28 }}>Overtime rules for nannies</h3>
          <p>
            Overtime is one of the most commonly misunderstood aspects of nanny pay. Under the federal
            Fair Labor Standards Act (FLSA), most nannies are entitled to <strong>overtime pay at
            1.5 times their regular rate</strong> for all hours worked over 40 in a week.
          </p>
          <p>Key rules to know:</p>
          <ul className="checklist">
            <li><strong>Live-out nannies:</strong> Overtime required after 40 hours/week at 1.5x regular rate. No exceptions.</li>
            <li><strong>Live-in nannies:</strong> Exempt from federal overtime, but some states (California, New York, Massachusetts, and others) require overtime for live-in domestic workers. Always check your state's rules.</li>
            <li><strong>State rules may be stricter:</strong> Some states require overtime after 8 hours in a day (California, Alaska) or on the 7th consecutive day of work.</li>
            <li><strong>Salary does not eliminate overtime:</strong> Even if you pay a salary, you still need to track hours and pay overtime for hours over 40.</li>
            <li><strong>"Off the clock" work counts:</strong> If your nanny is expected to respond to texts, plan activities, or do other work outside their scheduled hours, that time counts toward their hours worked.</li>
          </ul>
        </section>

        <p className="kicker">NANNY TAXES</p>
        <h2>How Nanny Taxes Work</h2>
        <section>
          <p>
            The "nanny tax" is not a single tax — it is the collective name for all the payroll tax
            responsibilities that come with hiring a household employee. Many families are surprised
            to learn that hiring a nanny makes them an employer in the eyes of the IRS, with all the
            filing and payment obligations that entails.
          </p>
          <p>
            While it may seem tempting to pay cash "under the table," doing so exposes both you and
            your nanny to significant risk: back taxes, penalties, interest, and even legal trouble.
            Legally employing your nanny is the right choice — and it is not as complicated as it
            sounds, especially with payroll services that handle most of the work.
          </p>

          <h3 style={{ marginTop: 20 }}>When you're considered a household employer</h3>
          <p>
            You become a household employer in the eyes of the IRS if you pay any household employee
            (including a nanny, housekeeper, or babysitter) <strong>$2,700 or more in a calendar
            year</strong> (2026 threshold). This is the Social Security and Medicare (FICA) threshold.
            Once you cross it, you are responsible for FICA taxes on all wages paid that year.
          </p>
          <p>
            For federal unemployment tax (FUTA), the threshold is <strong>$1,000 or more in any
            calendar quarter</strong>. State unemployment thresholds vary — some match the federal
            $1,000, others are lower.
          </p>
          <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 12, padding: "20px 24px", marginTop: 16 }}>
            <p style={{ margin: 0, fontWeight: 600, color: "#92400e" }}>2026 household employer thresholds</p>
            <ul style={{ margin: "10px 0 0", paddingLeft: 20, color: "#78350f", lineHeight: 1.8 }}>
              <li><strong>FICA (Social Security + Medicare):</strong> $2,700+ in annual wages</li>
              <li><strong>FUTA (federal unemployment):</strong> $1,000+ in any calendar quarter</li>
              <li><strong>SUTA (state unemployment):</strong> Varies by state — $1,000+ is common</li>
            </ul>
          </div>

          <h3 style={{ marginTop: 28 }}>What taxes you're responsible for as an employer</h3>
          <p>
            As a household employer, you have two types of tax responsibilities: taxes <em>you</em> pay
            as the employer, and taxes you <em>withhold</em> from the nanny's paycheck and remit to the
            government on their behalf.
          </p>
          <p><strong>Employer-paid taxes:</strong></p>
          <ul className="checklist">
            <li><strong>Social Security (6.2%):</strong> On wages up to the Social Security wage base ($168,600 in 2026)</li>
            <li><strong>Medicare (1.45%):</strong> On all wages — no wage cap</li>
            <li><strong>FUTA (up to 6%):</strong> On first $7,000 of wages; effectively 0.6% with the SUTA credit</li>
            <li><strong>SUTA:</strong> Varies by state and your experience rating</li>
          </ul>
          <p style={{ marginTop: 16 }}><strong>Employee-paid taxes (you withhold and remit):</strong></p>
          <ul className="checklist">
            <li><strong>Federal Income Tax (FIT):</strong> Based on the employee's W-4. Learn more about <a href="/fit-tax-meaning">what FIT means on a paycheck</a>.</li>
            <li><strong>Social Security (6.2%):</strong> Employee's half — matched by employer</li>
            <li><strong>Medicare (1.45%):</strong> Employee's half — matched by employer</li>
            <li><strong>State Income Tax:</strong> If your state has one</li>
            <li><strong>Additional Medicare Tax (0.9%):</strong> On wages over $200,000 (single) — employee only</li>
          </ul>

          <h3 style={{ marginTop: 28 }}>How to handle withholding and filing</h3>
          <p>
            Setting up nanny payroll involves several steps. Here is a high-level overview of the
            process:
          </p>
          <ol className="checklist">
            <li><strong>Get an EIN:</strong> Apply for an Employer Identification Number from the IRS. It is free and takes minutes online.</li>
            <li><strong>Have your nanny complete forms:</strong> They will need to fill out a W-4 (federal withholding), state withholding form (if applicable), and an I-9 (employment eligibility verification).</li>
            <li><strong>Register with your state:</strong> Register as a household employer with your state's labor department and tax agency for unemployment and state withholding.</li>
            <li><strong>Run payroll each pay period:</strong> Calculate gross wages, withhold employee taxes, and write a paycheck for net pay. Use our <a href="/">paycheck calculator</a> to estimate take-home pay.</li>
            <li><strong>File and pay taxes:</strong> Remit withheld taxes and employer taxes to the IRS and state on the required schedule (quarterly is common for household employers).</li>
            <li><strong>Provide a W-2:</strong> At the end of the year, give your nanny a W-2 form and file a W-2 copy with the Social Security Administration.</li>
            <li><strong>File Schedule H:</strong> Report household employment taxes on Schedule H with your personal Form 1040.</li>
          </ol>
          <p>
            Many families use a <strong>nanny payroll service</strong> to handle all of this — they
            calculate payroll, file taxes, provide W-2s, and keep you compliant. The cost is typically
            $50–$100 per month, which is worth it for most families who would rather spend their time
            on other things.
          </p>
          <p>
            Want to see how payroll taxes affect take-home pay? Try our <a href="/how-much-tax-is-taken-from-my-paycheck">tax
            withholding guide</a> to understand exactly how much comes out of a paycheck and why.
          </p>
        </section>

        <p className="kicker">SAVING MONEY</p>
        <h2>Ways Families Save on Nanny Costs</h2>
        <section>
          <p>
            Nanny care is a significant expense — but there are legitimate ways to reduce the cost.
            Between tax-advantaged accounts, tax credits, and creative arrangements, many families
            are able to make nanny care more affordable than the sticker price suggests.
          </p>

          <h3 style={{ marginTop: 20 }}>Dependent Care FSA</h3>
          <p>
            If your employer offers a <a href="/dependent-care-fsa">Dependent Care FSA</a> (DCFSA),
            this is one of the most valuable tax breaks available for child care. You can set aside
            up to <strong>$7,500 per year</strong> (2026 limit) in pre-tax dollars to pay for nanny
            expenses. Because the money comes out before federal income tax, Social Security, and
            Medicare, the typical family saves 22–32% on every dollar contributed.
          </p>
          <p>
            For example, if you contribute the full $7,500 and you are in the 22% federal bracket,
            you save about $1,650 in federal income tax plus about $574 in FICA taxes — roughly
            <strong> $2,224 per year</strong> in total savings. That is like getting a 30% discount
            on your first $7,500 of nanny costs.
          </p>
          <p>
            The catch: you need a qualifying child under age 13 (or a disabled dependent), and the
            care must be necessary so you can work. You also need to have earned income, and your
            spouse must also have earned income (unless they are a full-time student or disabled).
          </p>

          <h3 style={{ marginTop: 28 }}>Child and Dependent Care Tax Credit</h3>
          <p>
            The Child and Dependent Care Tax Credit (CDCC) lets you claim a credit on your tax return
            for a percentage of child care expenses. The credit covers 20–35% of up to $3,000 in
            expenses for one child or $6,000 for two or more children. The percentage depends on your
            income — lower earners get a higher percentage.
          </p>
          <p>
            You generally <strong>cannot</strong> claim the same expenses for both the Dependent Care
            FSA and the CDCC. If you max out your FSA at $7,500, you have already used up more than
            the $6,000 expense limit for two children, so there is no leftover to claim the credit on.
            But if your FSA election is lower than the credit's expense limit, you may be able to claim
            the credit on expenses above your FSA amount.
          </p>

          <h3 style={{ marginTop: 28 }}>Nanny share arrangements</h3>
          <p>
            A nanny share is when two or more families share one nanny, splitting the cost. The nanny
            watches all the children at the same time (usually at one family's home, alternating, or
            in a dedicated space). Each family pays less than they would for a solo nanny, and the
            nanny earns more than they would working for just one family — a win-win.
          </p>
          <ul className="checklist">
            <li><strong>Cost savings:</strong> Each family typically pays 60–75% of a solo nanny rate, saving 25–40% compared to hiring alone.</li>
            <li><strong>Social benefits:</strong> Kids get built-in playmates and social interaction.</li>
            <li><strong>Logistics:</strong> Requires coordination between families on schedule, sick days, discipline approach, and payment. A written agreement between all parties is essential.</li>
            <li><strong>Tax implications:</strong> Each family is technically a separate employer, so each has their own tax responsibilities. Alternatively, one family can be the employer and the other pays them their share — but this gets complicated legally.</li>
          </ul>

          <h3 style={{ marginTop: 28 }}>Part-time or shared care</h3>
          <p>
            If full-time nanny care is out of budget, consider a <strong>part-time nanny</strong> combined
            with other care options like daycare, preschool, or family care. Many families use a nanny
            for 20–30 hours per week to cover the trickiest parts of the schedule — early mornings,
            after school, or days when daycare is closed — and use cheaper options for the rest.
          </p>
          <p>
            Other cost-saving ideas include:
          </p>
          <ul className="checklist">
            <li><strong>Flexible scheduling:</strong> Some nannies offer lower rates for less desirable shifts or split shifts.</li>
            <li><strong>Au pair:</strong> An au pair program can be cheaper than a full-time nanny, especially for families with multiple children, though the cultural exchange aspect is the main draw.</li>
            <li><strong>Long-term commitment:</strong> Many nannies will negotiate a slightly lower rate in exchange for a guaranteed one-year contract and steady hours.</li>
            <li><strong>Negotiate benefits instead of pay:</strong> If pay is your main constraint, you might offer fewer paid days off or no health stipend in exchange for a lower hourly rate.</li>
          </ul>
        </section>
      </article>

      {/* FAQ */}
      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Nanny Cost — Frequently Asked Questions</h2>
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
        <h2>Estimate Nanny Take-Home Pay &amp; Tax Savings</h2>
        <section>
          <p style={{ color: "#5f7485", lineHeight: 1.7 }}>
            Whether you are hiring a nanny and want to budget for the full cost, or you are a nanny
            wanting to know your take-home pay, these tools use the same 2026 payroll engine to give
            you accurate numbers.
          </p>
          <div className="tool-links">
            <a href="/">
              <b>Paycheck Calculator</b>
              <span>Estimate nanny take-home pay after federal, state, and FICA taxes →</span>
            </a>
            <a href="/dependent-care-fsa">
              <b>Dependent Care FSA Guide</b>
              <span>How to save 22–32% on nanny costs with pre-tax FSA dollars →</span>
            </a>
            <a href="/fit-tax-meaning">
              <b>FIT Tax Meaning</b>
              <span>What federal income tax withholding is and how it is calculated →</span>
            </a>
            <a href="/how-much-tax-is-taken-from-my-paycheck">
              <b>How Much Tax Is Taken From My Paycheck?</b>
              <span>Interactive guide to all the taxes on a paycheck →</span>
            </a>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
