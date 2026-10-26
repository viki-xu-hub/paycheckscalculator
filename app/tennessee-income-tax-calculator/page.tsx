import type { Metadata } from "next";
import StateIncomeTaxCalculator from "../components/StateIncomeTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/tennessee-income-tax-calculator";
const TITLE = "Tennessee Income Tax Calculator 2026 — No State Income Tax";
const DESCRIPTION =
  "Tennessee has no state income tax on wages. Calculate your federal tax and learn what taxes Tennesseans pay — sales tax, Hall tax phase-out, property tax, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tennessee-income-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

const TN_STATE_SALES_TAX = 7;
const TN_AVG_TOTAL_SALES_TAX = 9.5;
const TN_AVG_PROPERTY_TAX_RATE = 0.66;
const FL_STATE_SALES_TAX = 6;
const FL_AVG_TOTAL_SALES_TAX = 7.5;
const FL_AVG_PROPERTY_TAX_RATE = 0.98;
const COMPARISON_INCOME = 60000;
const COMPARISON_STATE_RATE = 5; // approximate effective rate in high-tax state at this income

const faqs = [
  {
    q: "Does Tennessee have a state income tax?",
    a: `Tennessee does not have a state income tax on wages and salaries. The Volunteer State is one of nine states in the U.S. that does not impose a broad-based individual income tax on earned income. If you live and work in Tennessee, you pay zero dollars in state income tax on your wages — no state income tax is withheld from your paycheck, and you do not file a state income tax return for wage income. Historically, Tennessee did have what was known as the Hall income tax, which taxed interest and dividend income, but that tax was fully repealed as of January 1, 2021. Today, Tennessee has no individual income tax of any kind on personal income.`,
  },
  {
    q: "How much is Tennessee state tax on $75,000?",
    a: `Tennessee state income tax on $75,000 of wage income is $0. Because Tennessee has no state income tax on wages, you pay zero dollars in state income tax regardless of how much you earn. This is one of the biggest financial benefits of living in Tennessee. For comparison, a single filer earning $75,000 in a state with a 5% effective state tax rate might pay roughly $3,750 per year in state income tax. In Tennessee, that money stays in your pocket. However, it is important to note that Tennessee does have other taxes — including one of the highest average sales tax rates in the country, plus property tax and various excise taxes — so living in Tennessee is not completely tax-free. The overall tax burden depends on your spending habits and whether you own property.`,
  },
  {
    q: "What is the Hall tax in Tennessee?",
    a: `The Hall income tax was a Tennessee state tax on interest and dividend income. It was named after Frank Hall, the state senator who sponsored the original legislation in 1929. For many years, the Hall tax was levied at a rate of 6% on interest and dividend income above a certain exemption threshold. Unlike most state income taxes, it did not apply to wages, salaries, or business income — only to investment income. The Hall tax was gradually phased out starting in 2017, with the rate reduced each year until it was fully eliminated on January 1, 2021. The repeal of the Hall tax made Tennessee a true no-income-tax state and strengthened its reputation as a tax-friendly destination for retirees and investors.`,
  },
  {
    q: "What taxes do you pay in Tennessee?",
    a: `While Tennessee has no state income tax on wages, residents still pay a variety of other taxes. The main taxes in Tennessee are: (1) Sales tax — a ${TN_STATE_SALES_TAX}% state sales tax plus local option taxes that bring the average combined rate to about ${TN_AVG_TOTAL_SALES_TAX}%, one of the highest in the nation. (2) Property tax — levied by counties, cities, and school districts, with an average effective rate of about ${TN_AVG_PROPERTY_TAX_RATE}% of assessed home value, which is below the national average. (3) Gas tax — Tennessee has a state fuel tax plus local fuel taxes. (4) Excise tax on businesses — a 6.5% tax on business income from Tennessee sources (applies to businesses, not individuals). (5) Other excise taxes — on cigarettes, alcohol, and certain other goods. Tennessee does not have an inheritance tax or an estate tax.`,
  },
  {
    q: "What is the Tennessee sales tax rate?",
    a: `The Tennessee state sales tax rate is ${TN_STATE_SALES_TAX}%, which is one of the highest state sales tax rates in the country. On top of the state rate, most Tennessee counties and cities impose local option sales taxes. The maximum combined state and local rate is 9.75%, and the average combined rate across the state is approximately ${TN_AVG_TOTAL_SALES_TAX}%. This makes Tennessee&apos;s average combined sales tax rate one of the highest in the United States. The high sales tax is how Tennessee funds state government without an income tax. Groceries are taxed at a lower rate of 4% in Tennessee, and prescription drugs are exempt. The high sales tax rate is one of the trade-offs of living in a no-income-tax state, and it means Tennessee&apos;s tax system is more regressive than states with a progressive income tax.`,
  },
  {
    q: "Is Tennessee a tax-friendly state?",
    a: `Tennessee is generally considered a tax-friendly state, especially for higher-income earners and retirees. The lack of a state income tax means you keep more of your paycheck and your retirement income. Tennessee is particularly attractive for retirees because there is no tax on Social Security benefits, pension income, 401(k) withdrawals, or IRA distributions — and with the repeal of the Hall tax, even investment income is tax-free at the state level. However, Tennessee&apos;s high sales tax rates mean that the overall tax picture is more mixed, especially for lower-income households, which tend to spend a larger share of their income on taxable goods. Tennessee&apos;s property taxes are below the national average, which helps offset the high sales tax somewhat. Overall, most middle- and upper-income households come out ahead in Tennessee compared to states with an income tax.`,
  },
  {
    q: "Why doesn&apos;t Tennessee have an income tax?",
    a: `Tennessee has never had a broad-based individual income tax on wages. The state&apos;s history and political culture have long favored low taxes, and for most of its history, Tennessee relied on sales taxes, property taxes, and other revenue sources instead of an income tax. The only income tax Tennessee ever had was the Hall income tax on interest and dividends, which was first imposed in 1929 but never applied to wages. The Hall tax was phased out starting in 2017 and fully eliminated in 2021, making Tennessee a completely no-income-tax state. The state&apos;s decision to forgo an income tax is also an economic development strategy — it has helped attract businesses, retirees, and workers from higher-tax states, contributing to Tennessee&apos;s strong population and economic growth in recent years.`,
  },
  {
    q: "Do I need to file a Tennessee state tax return?",
    a: `No, you do not need to file a Tennessee state income tax return on your wages because Tennessee does not have a state income tax on earned income. There is no Tennessee equivalent of a Form 1040 for individual wage income. However, you still need to file a federal income tax return if you meet the federal filing requirements. If you are a Tennessee resident but earned income in another state, you may need to file a nonresident return in that state. Additionally, while there is no individual income tax return for wages, Tennessee businesses may need to file various tax returns, and there are other state taxes and fees that may require filings, such as sales tax returns for businesses, franchise and excise tax returns, and property tax payments. The old Hall tax return (Form INC-250) is no longer required since the tax was fully repealed in 2021.`,
  },
];

export default function TennesseeIncomeTaxPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Tennessee Income Tax Calculator",
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
      { "@type": "ListItem", position: 3, name: "Tennessee Income Tax Calculator", item: CANONICAL },
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
        <span>Tennessee Income Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">TENNESSEE TAXES · {YEAR}</div>
        <h1>
          Tennessee Income Tax Calculator <em>{YEAR}</em>
        </h1>
        <div className="hero-intro">
          <p>
            Tennessee is one of nine states with no individual income tax on wages. Use this
            calculator to estimate your federal income tax and see how much you save by
            living in a no-income-tax state. This guide also explains what taxes Tennesseans
            actually pay — from the high sales tax to the now-repealed Hall tax on
            investment income — so you can understand the full tax picture in the Volunteer
            State.
          </p>
        </div>
        <StateIncomeTaxCalculator stateAbbr="TN" />
        <div className="hero-more">
          <p>
            Federal rates come from {capitalGains.source.label}. Tennessee state income tax
            is $0 — Tennessee has no individual income tax on wages, and the Hall tax on
            interest and dividends was fully repealed as of 2021. Tennessee residents still
            pay federal income tax, plus sales tax, property tax, and other state and local
            taxes.
          </p>
        </div>
        <div className="trust-row">
          <span>No State Income Tax</span>
          <span>Hall Tax Repealed</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">THE BASICS</p>
        <h2>Does Tennessee Have a State Income Tax?</h2>
        <section>
          <p>
            <strong>No, Tennessee does not have a state income tax on wages.</strong> The
            Volunteer State is one of nine states in the United States that does not impose
            a broad-based individual income tax on earned income. If you live and work in
            Tennessee, you pay zero dollars in state income tax on your wages — no state
            income tax is withheld from your paycheck, and you do not file a state income
            tax return for wage income.
          </p>
          <p>
            What makes Tennessee&apos;s story unique among no-income-tax states is the Hall
            income tax — a tax on interest and dividend income that existed for nearly 90
            years before being fully repealed in 2021. For decades, Tennessee was a
            partial-no-tax state: no tax on wages, but a tax on investment income. Today,
            Tennessee is a true no-income-tax state with no individual income tax of any
            kind.
          </p>

          <h3>The Nine No-Income-Tax States</h3>
          <p>
            Tennessee is part of a group of nine states that do not levy a broad-based
            individual income tax on wages. These states are:
          </p>
          <ul className="checklist">
            <li><strong>Alaska</strong> — no income tax, funded primarily by oil revenues</li>
            <li><strong>Florida</strong> — no income tax, funded by sales tax, property tax, and tourism</li>
            <li><strong>Nevada</strong> — no income tax, funded heavily by gaming and tourism</li>
            <li><strong>New Hampshire</strong> — no tax on wages; taxes interest and dividends (being phased out)</li>
            <li><strong>South Dakota</strong> — no income tax, funded by sales tax and other revenue sources</li>
            <li><strong>Tennessee</strong> — no tax on wages; Hall tax on interest/dividends fully repealed in 2021</li>
            <li><strong>Texas</strong> — no income tax, funded by sales tax, property tax, and oil/gas</li>
            <li><strong>Washington</strong> — no income tax on wages; has a capital gains tax on high earners</li>
            <li><strong>Wyoming</strong> — no income tax, funded primarily by mineral and energy revenues</li>
          </ul>

          <h3>What No Income Tax Means for You</h3>
          <p>
            Living in a no-income-tax state means more money in your pocket from every
            paycheck. Instead of seeing a state income tax deduction on your pay stub, you
            only see federal income tax, FICA (Social Security and Medicare), and any
            pre-tax deductions like health insurance or retirement contributions.
          </p>
          <p>
            For Tennessee, the benefit extends beyond just wages. Because the Hall tax was
            fully repealed in 2021, Tennessee residents also pay no state tax on interest,
            dividends, or other investment income. This makes Tennessee particularly
            attractive for retirees, who often rely on investment income and retirement
            account withdrawals. In Tennessee, all of this income is tax-free at the state
            level.
          </p>

          <h3>Why Tennessee Has No Wage Income Tax</h3>
          <p>
            Tennessee has never had a broad-based personal income tax on wages. The state&apos;s
            political culture has historically favored limited government and low taxes, and
            Tennessee has traditionally funded its operations through alternative revenue
            sources:
          </p>
          <ul className="checklist">
            <li><strong>Sales tax:</strong> Tennessee&apos;s {TN_STATE_SALES_TAX}% state sales tax is one of the highest in the nation</li>
            <li><strong>Property tax:</strong> Local property taxes fund schools, county services, and municipal services</li>
            <li><strong>Franchise and excise tax:</strong> A tax on business entities doing business in Tennessee</li>
            <li><strong>Excise taxes:</strong> Taxes on fuel, tobacco, alcohol, and other goods</li>
            <li><strong>Various fees and licenses:</strong> Driver licenses, vehicle registrations, business licenses, and more</li>
          </ul>
          <p>
            Tennessee&apos;s model relies on a high sales tax to replace the revenue that
            would otherwise come from an income tax. This trade-off has implications for
            fairness — sales taxes are generally regressive, meaning lower-income households
            pay a larger share of their income in sales tax than higher-income households.
            But for higher-income earners and retirees, the system is very favorable.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT YOU PAY</p>
        <h2>What Taxes Do You Pay in Tennessee?</h2>
        <section>
          <p>
            While Tennessee has no state income tax on wages or investment income, it is not
            a tax-free state. Tennessee residents pay a variety of other taxes at the state
            and local level, and some of these taxes are quite high. The overall tax burden
            depends on your income level, how much you spend, and whether you own property.
          </p>

          <h3>Sales Tax</h3>
          <p>
            Tennessee&apos;s state sales tax rate is <strong>{TN_STATE_SALES_TAX}%</strong>{" "}
            — one of the highest state sales tax rates in the country. On top of the state
            rate, most Tennessee counties and cities impose local option sales taxes. The
            local rates vary by jurisdiction, and the maximum combined state and local rate
            is 9.75%.
          </p>
          <p>
            The average combined sales tax rate across Tennessee is approximately{" "}
            <strong>{TN_AVG_TOTAL_SALES_TAX}%</strong>, which is among the highest in the
            United States. This high sales tax is the primary trade-off for having no income
            tax — it is how the state funds its operations.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tax Component</th>
                  <th>Rate</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>State sales tax</strong></td>
                  <td>{TN_STATE_SALES_TAX}%</td>
                  <td>Applies statewide to most goods and some services</td>
                </tr>
                <tr>
                  <td><strong>Local option sales tax</strong></td>
                  <td>Up to 2.75%</td>
                  <td>Varies by county and city</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>Average total</strong></td>
                  <td><strong>~{TN_AVG_TOTAL_SALES_TAX}%</strong></td>
                  <td><strong>State + local average</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Groceries are taxed at a reduced rate of 4% in Tennessee, which is lower than
            the general sales tax rate but still higher than the many states that fully
            exempt groceries. Prescription drugs and certain medical devices are exempt
            from sales tax. There are also occasional sales tax holidays for items like
            clothing and school supplies.
          </p>

          <h3>Property Tax</h3>
          <p>
            Property tax is a major source of revenue for Tennessee local governments and
            school districts. The average effective property tax rate across Tennessee is
            approximately <strong>{TN_AVG_PROPERTY_TAX_RATE}%</strong> of a home&apos;s
            assessed value, which is below the national average and significantly lower
            than many other states. This means the owner of a $250,000 home would pay
            roughly {money2(250000 * TN_AVG_PROPERTY_TAX_RATE / 100)} per year in property
            taxes.
          </p>
          <p>
            Property tax rates vary by county and by the type of taxing district. Tennessee
            has relatively low property taxes compared to many other states, which is one of
            the advantages that helps offset the high sales tax. For homeowners, the
            combination of no income tax and below-average property taxes can make
            Tennessee a very affordable place to live.
          </p>

          <h3>Gas Tax and Other Excise Taxes</h3>
          <p>
            Tennessee imposes various excise taxes on specific goods. The state&apos;s gas
            tax includes both a state fuel tax and various additional fees. Tennessee also
            has relatively high cigarette taxes compared to some neighboring states, as
            well as taxes on alcohol and other products.
          </p>
          <ul className="checklist">
            <li><strong>Gas tax:</strong> State fuel tax plus additional fees per gallon</li>
            <li><strong>Cigarette tax:</strong> One of the higher rates in the Southeast</li>
            <li><strong>Alcohol tax:</strong> Taxes on beer, wine, and spirits at varying rates</li>
            <li><strong>Business taxes:</strong> Franchise and excise tax on business entities</li>
          </ul>

          <h3>No Inheritance or Estate Tax</h3>
          <p>
            Tennessee does not have an inheritance tax or an estate tax. This is another
            advantage for retirees and high-net-worth individuals who want to pass on their
            wealth to their heirs. Combined with the lack of an income tax on both wages
            and investment income, this makes Tennessee one of the most tax-friendly states
            for retirees and estate planning.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">HALL TAX</p>
        <h2>Tennessee&apos;s Hall Tax: Fully Repealed</h2>
        <section>
          <p>
            The Hall income tax was a unique feature of Tennessee&apos;s tax system for
            nearly 90 years. It was not a traditional income tax — it applied only to
            interest and dividend income, not to wages, salaries, or business income. The
            tax was gradually phased out and fully eliminated on January 1, 2021, making
            Tennessee a true no-income-tax state.
          </p>

          <h3>What Was the Hall Tax?</h3>
          <p>
            The Hall income tax was enacted in 1929 and was named after Frank Hall, the
            state senator who sponsored the original legislation. The tax applied to
            interest and dividend income received by Tennessee residents. For most of its
            history, the rate was 6%, and it applied to interest and dividend income above
            a certain exemption threshold.
          </p>
          <p>
            The Hall tax was unusual in that it was a flat-rate tax on investment income
            only. Wages, salaries, business income, rental income, and other types of
            income were never subject to the tax. This made Tennessee&apos;s system unique —
            a sort of hybrid between a no-income-tax state and a traditional income tax
            state.
          </p>

          <h3>The Phase-Out</h3>
          <p>
            In 2017, the Tennessee General Assembly passed legislation to gradually phase
            out the Hall income tax. The phase-out was designed to reduce the rate by one
            percentage point per year until the tax was completely eliminated:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Hall Tax Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>2017 and earlier</strong></td>
                  <td>6%</td>
                  <td>Full rate in effect</td>
                </tr>
                <tr>
                  <td><strong>2018</strong></td>
                  <td>5%</td>
                  <td>First reduction</td>
                </tr>
                <tr>
                  <td><strong>2019</strong></td>
                  <td>4%</td>
                  <td>Second reduction</td>
                </tr>
                <tr>
                  <td><strong>2020</strong></td>
                  <td>3%</td>
                  <td>Third reduction</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>2021 and later</strong></td>
                  <td><strong>0%</strong></td>
                  <td><strong>Fully repealed</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The final repeal of the Hall tax on January 1, 2021, completed Tennessee&apos;s
            transition to a completely no-income-tax state. Today, Tennessee residents pay
            no state income tax on any type of personal income — wages, interest,
            dividends, capital gains, retirement distributions, or any other form of
            personal income.
          </p>

          <h3>Why the Hall Tax Was Repealed</h3>
          <p>
            The repeal of the Hall tax was driven by several factors. First, proponents
            argued that eliminating the tax would make Tennessee more competitive with
            other no-income-tax states and attract retirees and investors. At the time,
            Florida and Texas had no income tax at all, while Tennessee&apos;s Hall tax put
            it at a slight disadvantage in attracting high-income retirees.
          </p>
          <p>
            Second, the Hall tax was a relatively small source of revenue for the state.
            By the time the phase-out began, the Hall tax generated only a small percentage
            of total state revenue, making it feasible to eliminate without significant
            budget disruption. The state was able to absorb the revenue loss through
            economic growth and other revenue sources.
          </p>
          <p>
            Third, there was a philosophical argument against the Hall tax. Critics argued
            that it was unfair to tax investment income while not taxing wages, and that it
            discouraged saving and investment. Repealing the Hall tax was also seen as a
            step toward broader tax reform and a simpler, more competitive tax system.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARISON</p>
        <h2>Tennessee vs Other No-Tax States</h2>
        <section>
          <p>
            Not all no-income-tax states are the same. Each state has a different mix of
            taxes, different rates, and different trade-offs. Understanding how Tennessee
            compares to other no-income-tax states can help you decide which one might be
            the best fit for your financial situation.
          </p>

          <h3>Sales Tax: Tennessee vs Florida vs Texas</h3>
          <p>
            The biggest difference among no-income-tax states is the sales tax rate.
            Tennessee has the highest state sales tax rate among the major no-income-tax
            states, while Florida&apos;s state rate is lower and Texas&apos;s is in between.
            When local taxes are included, the picture changes slightly, but Tennessee
            still comes out on the high end.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>State Sales Tax</th>
                  <th>Average Total (w/ Local)</th>
                  <th>Property Tax (Avg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Tennessee</strong></td>
                  <td>{TN_STATE_SALES_TAX}%</td>
                  <td>~{TN_AVG_TOTAL_SALES_TAX}%</td>
                  <td>~{TN_AVG_PROPERTY_TAX_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Florida</strong></td>
                  <td>{FL_STATE_SALES_TAX}%</td>
                  <td>~{FL_AVG_TOTAL_SALES_TAX}%</td>
                  <td>~{FL_AVG_PROPERTY_TAX_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Texas</strong></td>
                  <td>6.25%</td>
                  <td>~8.2%</td>
                  <td>~1.6%</td>
                </tr>
                <tr>
                  <td><strong>Washington</strong></td>
                  <td>6.5%</td>
                  <td>~9.2%</td>
                  <td>~0.9%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Property Tax: Where Tennessee Shines</h3>
          <p>
            One area where Tennessee stands out among no-income-tax states is property tax.
            Tennessee&apos;s average effective property tax rate of approximately{" "}
            {TN_AVG_PROPERTY_TAX_RATE}% is significantly lower than Texas (around 1.6%) and
            lower than Florida (around {FL_AVG_PROPERTY_TAX_RATE}%). For homeowners, this
            can be a significant advantage.
          </p>
          <p>
            For example, on a $300,000 home:
          </p>
          <ul className="checklist">
            <li><strong>Tennessee:</strong> ~{money2(300000 * TN_AVG_PROPERTY_TAX_RATE / 100)} per year</li>
            <li><strong>Florida:</strong> ~{money2(300000 * FL_AVG_PROPERTY_TAX_RATE / 100)} per year</li>
            <li><strong>Texas:</strong> ~$4,800 per year</li>
          </ul>
          <p>
            This makes Tennessee particularly attractive for homeowners, especially retirees
            who own their homes outright and want to minimize their ongoing expenses.
            Combined with no income tax, the low property tax rate gives Tennessee one of
            the lowest overall tax burdens for homeowners among all states.
          </p>

          <h3>Which No-Tax State Is Best for You?</h3>
          <p>
            The best no-income-tax state for you depends on your personal financial
            situation:
          </p>
          <ul className="checklist">
            <li><strong>If you are a high-income renter:</strong> Florida, Texas, or Tennessee all offer significant savings — the exact difference depends on spending habits</li>
            <li><strong>If you own an expensive home:</strong> Tennessee may be the best choice due to its low property tax rates</li>
            <li><strong>If you spend a lot on taxable goods:</strong> Florida&apos;s lower sales tax might be better, even with higher property tax</li>
            <li><strong>If you are a retiree:</strong> Tennessee&apos;s combination of no income tax, low property tax, and no tax on retirement income makes it very attractive</li>
            <li><strong>If you have a lower income:</strong> The high sales tax in Tennessee means the overall tax burden may be higher than in states with a progressive income tax</li>
          </ul>

          <h3>Other Factors Beyond Taxes</h3>
          <p>
            Of course, taxes are not the only factor in deciding where to live. Climate,
            job opportunities, cost of housing, quality of schools, healthcare access, and
            lifestyle preferences all play important roles. Tennessee offers a lower cost
            of living than many coastal states, a growing economy with strong job markets
            in Nashville, Memphis, and Knoxville, and a relatively mild climate with four
            distinct seasons.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">SAVINGS</p>
        <h2>Living in Tennessee: Tax Savings</h2>
        <section>
          <p>
            To understand the real financial impact of living in a no-income-tax state like
            Tennessee, it helps to compare a Tennessee resident with someone earning the
            same income in a high-tax state. The difference can be substantial, especially
            when you consider the long-term compounding effect of the savings.
          </p>

          <h3>$60,000 Income: Tennessee vs. a High-Tax State</h3>
          <p>
            Let us compare a single filer earning ${COMPARISON_INCOME.toLocaleString()} per
            year in Tennessee versus the same person in a state with a progressive income
            tax and an effective state tax rate of roughly {COMPARISON_STATE_RATE}% at this
            income level:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Tennessee</th>
                  <th>High-Tax State</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Annual income</strong></td>
                  <td>${COMPARISON_INCOME.toLocaleString()}</td>
                  <td>${COMPARISON_INCOME.toLocaleString()}</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><strong>Federal income tax</strong></td>
                  <td>Similar</td>
                  <td>Similar</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><strong>State income tax</strong></td>
                  <td>$0</td>
                  <td>~${(COMPARISON_INCOME * COMPARISON_STATE_RATE / 100).toLocaleString()}</td>
                  <td style={{ color: "#2e7d4a" }}>Save ~${(COMPARISON_INCOME * COMPARISON_STATE_RATE / 100).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>FICA (Social Security + Medicare)</strong></td>
                  <td>Same</td>
                  <td>Same</td>
                  <td>—</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>State income tax savings</strong></td>
                  <td><strong>$0 state tax</strong></td>
                  <td><strong>Pays state tax</strong></td>
                  <td style={{ color: "#2e7d4a" }}><strong>~${(COMPARISON_INCOME * COMPARISON_STATE_RATE / 100).toLocaleString()} per year</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The exact savings depend on the specific state you are comparing against and
            your personal situation (filing status, deductions, etc.), but the general
            pattern is clear: Tennessee residents keep more of their income because they
            pay no state income tax.
          </p>

          <h3>Factoring in Sales Tax</h3>
          <p>
            To get a complete picture, you also need to consider Tennessee&apos;s high
            sales tax. If you spend a large portion of your income on taxable goods, the
            sales tax can eat into your savings. However, for most middle- and upper-income
            households, the income tax savings still exceed the additional sales tax cost.
          </p>
          <p>
            For example, if you earn ${COMPARISON_INCOME.toLocaleString()} and save roughly
            ${(COMPARISON_INCOME * COMPARISON_STATE_RATE / 100).toLocaleString()} in state
            income tax, you would need to spend a very large share of your income on
            taxable goods for the higher sales tax to fully offset those savings. Most
            households spend a portion of their income on non-taxed items like groceries
            (taxed at a lower rate in Tennessee), rent or mortgage (not subject to sales
            tax), healthcare, and services.
          </p>

          <h3>Long-Term Impact</h3>
          <p>
            The long-term impact of living in a no-income-tax state can be enormous. If you
            save ${(COMPARISON_INCOME * COMPARISON_STATE_RATE / 100).toLocaleString()} per
            year in state income tax and invest those savings, the compound growth over a
            30-year career could add up to hundreds of thousands of dollars. For
            higher-income earners, the savings are even more dramatic.
          </p>
          <p>
            The benefit is especially large for retirees, who typically have significant
            investment income and retirement account withdrawals. In Tennessee, all of this
            income is tax-free at the state level, which can make a huge difference in
            retirement planning and quality of life.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>
          FREQUENTLY ASKED QUESTIONS
        </p>
        <h2>Tennessee Income Tax FAQ</h2>
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
            ({capitalGains.source.sections}). Tennessee state income tax is $0 — Tennessee
            has no individual income tax on wages, and the Hall tax on interest and
            dividends was fully repealed as of January 1, 2021. Information about
            Tennessee&apos;s sales tax, property tax, and other state taxes is based on
            data from the Tennessee Department of Revenue and various research sources.
            Property tax rates are averages and vary by county.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice or a
            substitute for professional tax preparation or filing software. The calculator
            estimates federal income tax using simplified inputs and does not account for
            itemized deductions, tax credits, capital gains, retirement contributions,
            self-employment taxes, or state-specific tax situations. Tennessee has no state
            income tax, but other taxes (sales tax, property tax, etc.) are not included in
            this calculator. Consult a tax professional for advice tailored to your
            specific situation.
          </p>
        </section>
        <div className="reviewer">
          <p>
            <span className="reviewer-label">Reviewed by:</span> Paycheck Calculator
            Editorial Team
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
            <a href="/florida-state-tax-calculator">
              <b>Florida State Tax Calculator</b>
              <span>Another no-income-tax state →</span>
            </a>
            <a href="/connecticut-income-tax-calculator">
              <b>Connecticut Income Tax Calculator</b>
              <span>CT progressive rates →</span>
            </a>
            <a href="/georgia-income-tax-calculator">
              <b>Georgia Income Tax Calculator</b>
              <span>GA flat rate estimator →</span>
            </a>
            <a href="/illinois-income-tax-calculator">
              <b>Illinois Income Tax Calculator</b>
              <span>IL flat rate estimator →</span>
            </a>
            <a href="/new-jersey-income-tax-calculator">
              <b>New Jersey Income Tax Calculator</b>
              <span>NJ progressive rates →</span>
            </a>
            <a href="/pennsylvania-income-tax-calculator">
              <b>Pennsylvania Income Tax Calculator</b>
              <span>PA flat rate estimator →</span>
            </a>
            <a href="/sales-tax">
              <b>Sales Tax Calculator</b>
              <span>State and local sales tax →</span>
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
