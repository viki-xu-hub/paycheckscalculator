import type { Metadata } from "next";
import StateIncomeTaxCalculator from "../components/StateIncomeTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";
import { NJ_DEPENDENT_EXEMPTION } from "../lib/stateIncomeTax";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/new-jersey-income-tax-calculator";
const TITLE = "New Jersey Income Tax Calculator 2026 — NJ Tax Brackets";
const DESCRIPTION =
  "Free New Jersey income tax calculator for 2026. NJ has graduated rates from 1.4% to 10.75%. Estimate your federal and NJ state income tax based on income and filing status.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/new-jersey-income-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

const NJ_TOP_RATE = 10.75;
const NJ_LOW_RATE = 1.4;
/**
 * NJ's dependent exemption is a deduction from gross income on Form NJ-1040,
 * not a credit against tax. Sourced from the calculator library so the prose,
 * the tables and the calculator can never drift apart.
 */
const NJ_DEP_EXEMPTION = NJ_DEPENDENT_EXEMPTION;
/** Marginal rate for the bracket most NJ middle-income filers land in. */
const NJ_MID_RATE = 0.05525;
/** What one dependent is actually worth at that bracket. */
const NJ_DEP_VALUE_MID = NJ_DEP_EXEMPTION * NJ_MID_RATE;

// NJ bracket data for tables
const njSingleBrackets = [
  { upTo: 20000, rate: 1.4 },
  { upTo: 35000, rate: 1.75 },
  { upTo: 40000, rate: 3.5 },
  { upTo: 75000, rate: 5.525 },
  { upTo: 500000, rate: 6.37 },
  { upTo: 1000000, rate: 8.97 },
  { upTo: Infinity, rate: 10.75 },
];

const njMarriedBrackets = [
  { upTo: 20000, rate: 1.4 },
  { upTo: 50000, rate: 1.75 },
  { upTo: 70000, rate: 2.45 },
  { upTo: 80000, rate: 3.5 },
  { upTo: 150000, rate: 5.525 },
  { upTo: 500000, rate: 6.37 },
  { upTo: 1000000, rate: 8.97 },
  { upTo: Infinity, rate: 10.75 },
];

const faqs = [
  {
    q: "What are the New Jersey income tax brackets for 2026?",
    a: `For ${YEAR}, New Jersey has a graduated income tax system with seven brackets for single filers and eight brackets for married couples filing jointly. Rates range from ${NJ_LOW_RATE}% on the lowest tier of income up to ${NJ_TOP_RATE}% on income above $1 million. Single filers: 1.4% up to $20,000, 1.75% up to $35,000, 3.5% up to $40,000, 5.525% up to $75,000, 6.37% up to $500,000, 8.97% up to $1 million, and 10.75% above $1 million. Married filers have slightly different bracket thresholds, including an additional 2.45% bracket between $50,000 and $70,000.`,
  },
  {
    q: "What is the NJ income tax rate?",
    a: `New Jersey does not have a single income tax rate — it uses a graduated system with rates ranging from ${NJ_LOW_RATE}% to ${NJ_TOP_RATE}% depending on your income level and filing status. Most middle-income taxpayers fall into the 5.525% or 6.37% brackets. The top 10.75% rate — often called the millionaires' tax — only applies to income above $1 million. Your effective tax rate (total tax divided by total income) will always be lower than your top marginal rate because only the income within each bracket is taxed at that rate.`,
  },
  {
    q: "How much is NJ income tax on $80,000?",
    a: `For a single filer earning $80,000 with no dependents, the New Jersey income tax is calculated by applying each bracket rate to the portion of income within that bracket. The first $20,000 is taxed at 1.4%, the next $15,000 at 1.75%, the next $5,000 at 3.5%, the next $35,000 at 5.525%, and the remaining $5,000 at 6.37%. The gross tax is approximately $${(20000 * 0.014 + 15000 * 0.0175 + 5000 * 0.035 + 35000 * 0.05525 + 5000 * 0.0637).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. With one dependent, you would first subtract the $${NJ_DEP_EXEMPTION.toLocaleString()} dependent exemption from income, which at the 6.37% bracket reduces the tax by about $${(NJ_DEP_EXEMPTION * 0.0637).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Use the calculator above to enter your exact filing situation with dependents.`,
  },
  {
    q: "Does NJ have a standard deduction?",
    a: `No. New Jersey does not have a standard deduction like the federal government and many other states. Instead, New Jersey uses a system of personal exemptions that are subtracted from gross income before the rates are applied. The dependent exemption is $${NJ_DEP_EXEMPTION.toLocaleString()} per qualifying dependent for ${YEAR}. Because it is a deduction rather than a credit, its cash value depends on your marginal rate — at the 5.525% bracket, each dependent saves about $${NJ_DEP_VALUE_MID.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in New Jersey tax. New Jersey does separately offer true credits, including the earned income tax credit, the property tax credit, and the child and dependent care credit, which reduce your tax bill dollar for dollar.`,
  },
  {
    q: "What is the New Jersey millionaires' tax?",
    a: `The New Jersey millionaires' tax refers to the top ${NJ_TOP_RATE}% income tax rate that applies to taxable income above $1 million. It was originally enacted in 2004 as a temporary surcharge but has been extended and made permanent over the years. The rate applies to both single filers and married couples filing jointly — the $1 million threshold is the same regardless of filing status. Revenue from the millionaires' tax funds various state programs, including education, healthcare, and transportation. Only about 1-2% of New Jersey taxpayers earn enough to reach this top bracket.`,
  },
  {
    q: "Who has to file a NJ state tax return?",
    a: `You generally must file a New Jersey Form NJ-1040 if you were a New Jersey resident for any part of the year and your gross income meets or exceeds the filing threshold for your filing status. For ${YEAR}, the filing thresholds are generally based on your filing status and age. Even if you are not required to file, you should file if you had New Jersey tax withheld or if you qualify for refundable credits like the New Jersey Earned Income Tax Credit. Nonresidents who earned income from New Jersey sources — including wages, business income, or rental income from NJ property — may also need to file a NJ-1040NR.`,
  },
  {
    q: "How is NJ income tax calculated?",
    a: `New Jersey income tax starts with your total income, then applies New Jersey-specific additions and subtractions. You then subtract your personal exemptions — including $${NJ_DEP_EXEMPTION.toLocaleString()} per dependent — to arrive at New Jersey taxable income. From there, the graduated tax rates are applied, with each bracket's rate applying only to the income within that bracket. After calculating the gross tax, you subtract any credits you qualify for, such as the earned income tax credit and the property tax credit. The result is your net New Jersey income tax. Our calculator uses the simplified progressive bracket formula with the dependent exemption applied as a deduction from income.`,
  },
  {
    q: "Is New Jersey a high-tax state?",
    a: `Yes, New Jersey is generally considered a high-tax state. Its top marginal income tax rate of ${NJ_TOP_RATE}% is one of the highest in the nation, and the state also has high property taxes, sales taxes, and various other fees. However, the tax burden varies significantly by income level. Lower- and middle-income households pay relatively modest state income tax rates (1.4% to 5.525%), while high earners face the 6.37%, 8.97%, and 10.75% top brackets. New Jersey also offers numerous credits and exemptions that can reduce the effective rate for many households, especially those with dependents or lower incomes.`,
  },
];

export default function NewJerseyIncomeTaxPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "New Jersey Income Tax Calculator",
    url: CANONICAL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: DESCRIPTION,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Tax Calculators", item: "https://www.paycheckscalculator.org/blog" },
      { "@type": "ListItem", position: 3, name: "New Jersey Income Tax Calculator", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      {/* Breadcrumb */}
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <span>New Jersey Income Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">NJ STATE TAX · {YEAR}</div>
        <h1>
          New Jersey Income Tax Calculator <em>{YEAR}</em>
        </h1>
        <div className="hero-intro">
          <p>
            Estimate your total federal and New Jersey state income tax for {YEAR}. Enter your
            annual income, filing status, and dependents to see how the federal progressive
            brackets and New Jersey&apos;s graduated rate system — from {NJ_LOW_RATE}% to{" "}
            {NJ_TOP_RATE}% — apply to your return. NJ is known for having one of the most
            progressive state tax structures in the country, with seven brackets for single
            filers and eight for married couples.
          </p>
        </div>
        <StateIncomeTaxCalculator stateAbbr="NJ" />
        <div className="hero-more">
          <p>
            Federal rates come from {capitalGains.source.label}. New Jersey figures use the
            graduated rate schedule ({NJ_LOW_RATE}%–{NJ_TOP_RATE}%) with a $
            {NJ_DEP_EXEMPTION.toLocaleString()} exemption per dependent deducted from income,
            consistent with the NJ-1040 formula.
          </p>
        </div>
        <div className="trust-row">
          <span>{YEAR} Rates</span>
          <span>NJ Progressive</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How New Jersey Income Tax Works</h2>
        <section>
          <p>
            New Jersey has one of the most progressive state income tax systems in the United
            States, with graduated rates that increase as your income rises. Unlike flat-tax
            states where every dollar is taxed at the same rate, NJ applies different marginal
            rates to different slices of income. The more you earn, the higher the rate on each
            additional dollar — but only the dollars within each bracket are taxed at that
            bracket&apos;s rate.
          </p>

          <h3>The Graduated Rate System</h3>
          <p>
            New Jersey&apos;s income tax system is built on the principle of ability to pay:
            taxpayers with higher incomes pay a larger share of their income in tax. The system
            has seven tax brackets for single filers and eight for married couples filing
            jointly, with rates ranging from <strong>{NJ_LOW_RATE}%</strong> at the bottom to{" "}
            <strong>{NJ_TOP_RATE}%</strong> at the top. Each bracket represents a range of
            income taxed at a specific marginal rate.
          </p>
          <p>
            It is important to understand that your marginal rate is not the rate you pay on
            all your income. If you are a single filer in the 5.525% bracket, for example, you
            do not pay 5.525% on your entire income — you pay 1.4% on the first $20,000, 1.75%
            on the next $15,000, 3.5% on the next $5,000, and 5.525% only on the amount above
            $40,000 up to $75,000. Your effective tax rate — total tax divided by total income —
            is always lower than your top bracket rate.
          </p>

          <h3>Personal Exemption for Dependents</h3>
          <p>
            New Jersey does not have a standard deduction, but it does offer a personal
            exemption that reduces the income the rates are applied to. For {YEAR}, the
            exemption is <strong>{money2(NJ_DEP_EXEMPTION)}</strong> per qualifying dependent,
            claimed on Form NJ-1040. Because it is a deduction rather than a credit, each
            dependent reduces your taxable income by {money2(NJ_DEP_EXEMPTION)} — the tax you
            actually save depends on your marginal bracket, not on the exemption amount itself.
          </p>
          <ul className="checklist">
            <li><strong>{money2(NJ_DEP_EXEMPTION)} per dependent</strong> — a deduction from income, not a credit against tax</li>
            <li><strong>No income phase-out</strong> — available at all income levels</li>
            <li><strong>Worth your marginal rate</strong> — about {money2(NJ_DEP_VALUE_MID)} per dependent in the 5.525% bracket, more in the higher brackets</li>
          </ul>

          <h3>How the Calculation Works</h3>
          <p>
            Calculating your New Jersey income tax follows a multi-step process. Start with
            your total income, apply New Jersey-specific additions and subtractions to get NJ
            taxable income, then apply the graduated bracket rates. Finally, subtract any
            credits you qualify for:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1</strong></td>
                  <td>Start with total income (with NJ additions and subtractions)</td>
                </tr>
                <tr>
                  <td><strong>2</strong></td>
                  <td>Subtract personal exemptions ({money2(NJ_DEP_EXEMPTION)} per dependent) to get NJ taxable income</td>
                </tr>
                <tr>
                  <td><strong>3</strong></td>
                  <td>Apply graduated bracket rates to that taxable income</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>4</strong></td>
                  <td><strong>Result: net New Jersey income tax</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TAX BRACKETS</p>
        <h2>NJ Tax Brackets for {YEAR}</h2>
        <section>
          <p>
            New Jersey&apos;s tax brackets are the foundation of its progressive income tax
            system. Each bracket represents a range of income taxed at a specific marginal rate.
            The brackets differ between single filers and married couples filing jointly, with
            married filers getting wider brackets at lower income levels and an additional
            2.45% bracket that does not exist for single filers.
          </p>

          <h3>Single Filers</h3>
          <p>
            For single filers, New Jersey has seven tax brackets in {YEAR}. The rates start at
            1.4% on the first $20,000 of income and gradually increase through six more
            brackets, reaching the top 10.75% rate on income above $1 million:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bracket</th>
                  <th>Taxable Income Range</th>
                  <th>Marginal Rate</th>
                </tr>
              </thead>
              <tbody>
                {njSingleBrackets.map((b, i) => (
                  <tr key={i}>
                    <td><strong>{i + 1}</strong></td>
                    <td>
                      {i === 0
                        ? `$0 – ${money2(b.upTo)}`
                        : b.upTo === Infinity
                        ? `${money2(njSingleBrackets[i - 1].upTo)}+`
                        : `${money2(njSingleBrackets[i - 1].upTo)} – ${money2(b.upTo)}`}
                    </td>
                    <td><strong>{b.rate}%</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Married Filing Jointly</h3>
          <p>
            For married couples filing jointly, New Jersey has eight tax brackets — one more
            than for single filers. The additional 2.45% bracket provides a modest benefit for
            married couples at lower-middle income levels. The top rate of 10.75% applies at
            the same $1 million threshold as for single filers:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bracket</th>
                  <th>Taxable Income Range</th>
                  <th>Marginal Rate</th>
                </tr>
              </thead>
              <tbody>
                {njMarriedBrackets.map((b, i) => (
                  <tr key={i}>
                    <td><strong>{i + 1}</strong></td>
                    <td>
                      {i === 0
                        ? `$0 – ${money2(b.upTo)}`
                        : b.upTo === Infinity
                        ? `${money2(njMarriedBrackets[i - 1].upTo)}+`
                        : `${money2(njMarriedBrackets[i - 1].upTo)} – ${money2(b.upTo)}`}
                    </td>
                    <td><strong>{b.rate}%</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Understanding Marginal vs Effective Rates</h3>
          <p>
            A common source of confusion is the difference between your marginal tax rate and
            your effective tax rate. Your <strong>marginal rate</strong> is the rate you pay on
            the next dollar of income — it is the rate of the highest bracket you reach. Your{" "}
            <strong>effective rate</strong> is your total tax divided by your total income.
            Because of the progressive bracket structure, your effective rate is always lower
            than your marginal rate.
          </p>
          <p>
            For example, a single filer earning $80,000 has a marginal rate of 6.37% (they
            fall into the 5th bracket), but their effective rate is much lower because most of
            their income is taxed at lower rates. The first $20,000 is taxed at just 1.4%, the
            next $15,000 at 1.75%, and so on. Only the portion of income above $75,000 — about
            $5,000 in this example — is taxed at the 6.37% marginal rate.
          </p>

          <h3>How Dependents Affect Your NJ Tax</h3>
          <p>
            Dependents reduce your New Jersey tax through the personal exemption, which is
            worth {money2(NJ_DEP_EXEMPTION)} per qualifying dependent for {YEAR}. Unlike the
            federal child tax credit, which phases out at higher incomes, New Jersey&apos;s
            exemption is available at all income levels with no phase-out.
          </p>
          <p>
            It is a deduction rather than a credit, so it is subtracted from your income before
            the bracket rates are applied — it does not come off your tax bill dollar for
            dollar. That means the amount you save rises with your marginal rate: a{" "}
            {money2(NJ_DEP_EXEMPTION)} exemption is worth about {money2(NJ_DEP_VALUE_MID)} in
            the 5.525% bracket, roughly {money2(NJ_DEP_EXEMPTION * 0.0637)} in the 6.37%
            bracket, and up to {money2(NJ_DEP_EXEMPTION * 0.1075)} at the top {NJ_TOP_RATE}%
            rate.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">MILLIONAIRES&apos; TAX</p>
        <h2>New Jersey&apos;s Millionaires&apos; Tax</h2>
        <section>
          <p>
            New Jersey&apos;s top income tax rate of {NJ_TOP_RATE}% — often called the
            millionaires&apos; tax — is one of the highest state income tax rates in the nation.
            It applies to taxable income above $1 million for all filing statuses, making New
            Jersey one of a handful of states with a top rate above 10%. Understanding the
            millionaires&apos; tax helps explain why NJ is often ranked among the highest-tax
            states in the country.
          </p>

          <h3>Origins and History</h3>
          <p>
            The New Jersey millionaires&apos; tax was first enacted in 2004 as a temporary
            1% surcharge on incomes above $500,000, creating a top rate of 8.97%. Over the
            years, the surcharge was extended repeatedly and eventually made permanent. In
            2019, Governor Phil Murphy signed legislation increasing the top rate to 10.75% on
            incomes above $5 million, and in subsequent years the threshold was lowered to $1
            million. The 10.75% rate now applies to all taxable income above $1 million for
            both single and joint filers.
          </p>

          <h3>Who Pays the Millionaires&apos; Tax?</h3>
          <p>
            Despite the name, the millionaires&apos; tax affects not just millionaires but also
            high-income professionals, business owners, and investors who earn more than $1
            million in a given year. Only a small share of New Jersey taxpayers — roughly 1-2%
            — earn enough to reach the top bracket. However, this small group contributes a
            disproportionate share of total state income tax revenue, making the state heavily
            reliant on a relatively small number of high-income taxpayers.
          </p>
          <ul className="checklist">
            <li><strong>Top rate:</strong> {NJ_TOP_RATE}% on income above $1 million</li>
            <li><strong>Affected filers:</strong> Approximately 1-2% of NJ taxpayers</li>
            <li><strong>Filing status:</strong> Same $1M threshold for single and joint</li>
            <li><strong>Revenue use:</strong> Funds education, healthcare, and state programs</li>
          </ul>

          <h3>Revenue and Economic Impact</h3>
          <p>
            Revenue from the millionaires&apos; tax is a significant source of funding for New
            Jersey&apos;s state budget, supporting public education, healthcare programs,
            transportation infrastructure, and other essential services. Proponents argue that
            the progressive structure ensures that those with the greatest ability to pay
            contribute their fair share to public services. Critics, however, contend that the
            high top rate encourages high-income residents to move to lower-tax states like
            Florida or Texas, potentially eroding the tax base over time.
          </p>
          <p>
            The debate over the millionaires&apos; tax reflects a broader tension in New Jersey
            politics between the need for revenue to fund public services and concerns about
            tax competitiveness. Studies on the impact of high state tax rates on migration
            have produced mixed results, with some finding modest effects and others finding
            more significant impacts, particularly among high-earning workers in mobile
            industries like finance and technology.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FILING REQUIREMENTS</p>
        <h2>Who Has to File a NJ Tax Return?</h2>
        <section>
          <p>
            Whether you need to file a New Jersey Form NJ-1040 depends on your residency
            status, your income level, your filing status, and whether you had New Jersey tax
            withheld. New Jersey&apos;s filing requirements are structured similarly to the
            federal rules but with different thresholds and some state-specific considerations.
          </p>

          <h3>New Jersey Residents</h3>
          <p>
            If you were a New Jersey resident for the full year, you generally must file a
            NJ-1040 if your gross income meets or exceeds the filing threshold for your filing
            status. The thresholds vary by filing status and age:
          </p>
          <ul className="checklist">
            <li>You are required to file a federal income tax return</li>
            <li>Your gross income exceeds the NJ filing threshold for your filing status</li>
            <li>You had New Jersey income tax withheld and want a refund</li>
            <li>You qualify for refundable credits like the NJ Earned Income Tax Credit</li>
            <li>You had NJ estimated tax payments or overpayment credits from last year</li>
          </ul>
          <p>
            Even if you are not technically required to file, it is usually a good idea to
            file if you had any New Jersey tax withheld or if you might qualify for refundable
            credits. You cannot get a refund without filing a return, and filing ensures you
            are in compliance with the New Jersey Division of Taxation.
          </p>

          <h3>Part-Year Residents and Nonresidents</h3>
          <p>
            If you moved into or out of New Jersey during the year, you file as a part-year
            resident using Form NJ-1040. You pay New Jersey tax on income you earned while you
            were a resident, plus any income from New Jersey sources while you were a
            nonresident. You will need to allocate your income between the resident and
            nonresident portions of the year.
          </p>
          <p>
            If you were never a New Jersey resident but earned income from New Jersey sources —
            for example, if you worked in New Jersey but lived in another state — you may need
            to file Form NJ-1040NR as a nonresident. Common New Jersey-source income includes
            wages earned in New Jersey, rental income from New Jersey property, business income
            from New Jersey operations, and income from a New Jersey business or partnership.
          </p>

          <h3>Filing Thresholds</h3>
          <p>
            New Jersey&apos;s filing thresholds are generally based on your filing status and
            age. For most taxpayers under age 65, the threshold is relatively low compared to
            the federal standard deduction, which means many people who do not need to file a
            federal return may still need to file a New Jersey return. If you had any New
            Jersey tax withheld from your pay, you should file regardless of your income level
            to claim a refund.
          </p>

          <h3>Important Deadlines</h3>
          <p>
            The New Jersey individual income tax return is due on the same day as the federal
            return — typically April 15 of the following year, or the next business day if
            April 15 falls on a weekend or holiday. If you file for a federal extension, your
            New Jersey filing deadline is automatically extended as well, but you still need to
            pay any tax you owe by the original deadline to avoid interest and penalties.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARISON</p>
        <h2>NJ vs Federal: How They Compare</h2>
        <section>
          <p>
            Both New Jersey and the federal government use progressive income tax systems, but
            they differ significantly in their bracket structures, rates, and deductions.
            Understanding how the two systems compare helps you plan for your total tax bill
            and see why your federal and state effective rates can be so different.
          </p>

          <h3>Both Progressive, But Different Structures</h3>
          <p>
            The biggest similarity between New Jersey and the federal system is that both use{" "}
            <strong>progressive tax brackets</strong> — as your income rises, each additional
            dollar is taxed at a higher marginal rate. However, the number of brackets, the
            rate levels, and the bracket widths are very different. The federal system has
            seven brackets ranging from 10% to 37%, while New Jersey has seven (single) or
            eight (married) brackets ranging from {NJ_LOW_RATE}% to {NJ_TOP_RATE}%.
          </p>
          <p>
            New Jersey&apos;s brackets are more compressed at the bottom, with several low-rate
            brackets before reaching the middle rates. The federal system has wider brackets,
            meaning you stay in each bracket longer as your income grows. At the top end, the
            federal top rate of 37% is much higher than New Jersey&apos;s 10.75%, but NJ&apos;s
            top rate kicks in at a much lower income level ($1 million vs. roughly $600,000+
            for the top federal bracket for single filers).
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Federal Income Tax</th>
                  <th>New Jersey Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rate structure</strong></td>
                  <td>Progressive — 7 brackets, 10% to 37%</td>
                  <td>Progressive — 7-8 brackets, {NJ_LOW_RATE}% to {NJ_TOP_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Standard deduction</strong></td>
                  <td>Yes — {money2(single.standardDeduction)} single, {money2(married.standardDeduction)} joint</td>
                  <td>No standard deduction</td>
                </tr>
                <tr>
                  <td><strong>Personal exemptions</strong></td>
                  <td>Suspended through 2025 (part of TCJA)</td>
                  <td>{money2(NJ_DEP_EXEMPTION)} exemption (deduction) per dependent</td>
                </tr>
                <tr>
                  <td><strong>Top rate</strong></td>
                  <td>37% above {money2(single.brackets[6][0])} (single)</td>
                  <td>{NJ_TOP_RATE}% above $1,000,000</td>
                </tr>
                <tr>
                  <td><strong>Number of brackets</strong></td>
                  <td>Seven</td>
                  <td>Seven (single) / Eight (married)</td>
                </tr>
                <tr>
                  <td><strong>Dependent treatment</strong></td>
                  <td>Child Tax Credit (refundable, up to $2,000 per child)</td>
                  <td>{money2(NJ_DEP_EXEMPTION)} personal exemption per dependent, deducted from income</td>
                </tr>
                <tr>
                  <td><strong>Bottom rate</strong></td>
                  <td>10%</td>
                  <td>{NJ_LOW_RATE}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Why Your Federal Bill Is Usually Higher</h3>
          <p>
            For most New Jersey taxpayers, the federal income tax bill is substantially larger
            than the state tax bill. Federal rates are much higher across the board — even the
            10% bottom federal bracket is more than seven times New Jersey&apos;s 1.4% bottom
            rate, and the top federal rate of 37% is more than three times higher than New
            Jersey&apos;s top 10.75% rate. The federal standard deduction is also significantly
            larger, but the rates above that deduction are much higher.
          </p>
          <p>
            At $80,000 of income for a single filer, federal tax is roughly three to four
            times the New Jersey tax. At higher incomes, the gap narrows somewhat as New
            Jersey&apos;s rates climb into the 6.37%, 8.97%, and 10.75% brackets, but federal
            rates continue climbing into the 22%, 24%, and 32% brackets. At very high incomes
            (above $1 million), the federal tax remains significantly larger than the state
            tax, but New Jersey&apos;s 10.75% top rate makes it one of the larger state tax
            bills in the country.
          </p>

          <h3>Bracket Structure Differences</h3>
          <p>
            New Jersey&apos;s bracket structure is notably different from the federal system.
            NJ has more brackets clustered at the bottom of the income scale, with several
            small rate increases in the first $75,000 of income. The federal system, by
            contrast, has wider brackets with larger gaps between rates. This means that in
            New Jersey, you move through brackets more quickly at lower income levels, but the
            rate increases are smaller. Federally, you stay in each bracket longer, but the
            jumps between brackets are bigger.
          </p>
          <p>
            Another key difference is how filing status affects the brackets. Married couples
            filing jointly get roughly double the federal bracket thresholds of single filers,
            which largely eliminates the marriage penalty at most income levels. In New Jersey,
            the married brackets are wider than single brackets at lower income levels and
            include an extra 2.45% bracket, but the top $1 million threshold is the same for
            both single and joint filers — meaning two high-earning spouses can easily push a
            married couple into the top bracket.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>
          FREQUENTLY ASKED QUESTIONS
        </p>
        <h2>New Jersey Income Tax FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>
              {f.q}
              <span>+</span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <article className="long-seo">
        <p className="kicker">SOURCES &amp; METHODOLOGY</p>
        <h3>Where these figures come from</h3>
        <section>
          <p>
            Federal tax rates, brackets, and standard deduction amounts for {YEAR} come from{" "}
            <a
              className="text-link"
              href={capitalGains.source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {capitalGains.source.label}
            </a>{" "}
            ({capitalGains.source.sections}). New Jersey figures use the graduated rate
            schedule ({NJ_LOW_RATE}%–{NJ_TOP_RATE}%) with a {money2(NJ_DEP_EXEMPTION)} personal
            exemption per dependent deducted from income, consistent with the Form NJ-1040 instructions and
            the New Jersey Division of Taxation guidance.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice or a substitute
            for professional tax preparation or filing software. The calculator estimates federal
            and New Jersey income tax using simplified inputs and does not account for itemized
            deductions, tax credits, the personal exemption for the filer and spouse, capital gains,
            retirement contributions, self-employment taxes, or New Jersey-specific additions and
            subtractions to income. Consult a tax professional for advice tailored to your
            specific situation.
          </p>
        </section>
        <div className="reviewer">
          <p>
            <span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial
            Team
          </p>
          <p>
            <small>Rates current for tax year {YEAR}</small>
          </p>
        </div>
      </article>

      <article className="long-seo">
        <p className="kicker">RELATED TOOLS</p>
        <h3>More tax calculators and guides</h3>
        <section>
          <div className="tool-links">
            <a href="/">
              <b>Paycheck Calculator</b>
              <span>Take-home pay after tax →</span>
            </a>
            <a href="/new-jersey-paycheck-calculator">
              <b>New Jersey Paycheck Calculator</b>
              <span>Per-paycheck withholding →</span>
            </a>
            <a href="/georgia-income-tax-calculator">
              <b>Georgia Income Tax Calculator</b>
              <span>GA flat rate estimator →</span>
            </a>
            <a href="/pennsylvania-income-tax-calculator">
              <b>Pennsylvania Income Tax Calculator</b>
              <span>PA 3.07% flat rate →</span>
            </a>
            <a href="/state-paycheck-calculators">
              <b>State Calculators</b>
              <span>All 50 states + DC →</span>
            </a>
            <a href="/how-much-tax-is-taken-from-my-paycheck">
              <b>Paycheck Tax Explainer</b>
              <span>Every deduction explained →</span>
            </a>
            <a href="/salary">
              <b>Salary After Tax</b>
              <span>Annual take-home pay →</span>
            </a>
            <a href="/blog">
              <b>All Guides</b>
              <span>Every tax explainer →</span>
            </a>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
