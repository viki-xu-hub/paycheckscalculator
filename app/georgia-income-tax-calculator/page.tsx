import type { Metadata } from "next";
import StateIncomeTaxCalculator from "../components/StateIncomeTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/georgia-income-tax-calculator";
const TITLE = "Georgia Income Tax Calculator 2026 — Flat 4.99% Rate";
const DESCRIPTION =
  "Free Georgia income tax calculator for 2026. GA moved to a flat 4.99% rate. Estimate your federal and Georgia state income tax based on income, filing status, and dependents.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/georgia-income-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

const GA_RATE = 4.99;
const GA_STD_DED_SINGLE = 15000;
const GA_STD_DED_JOINT = 30000;
const GA_DEP_EXEMPTION = 5000;

const faqs = [
  {
    q: "What is the Georgia income tax rate for 2026?",
    a: `For 2026, Georgia has a flat individual income tax rate of ${GA_RATE}%. The rate was set by House Bill 463, signed May 11, 2026, and applies to taxable years beginning January 1, 2026, replacing the 5.19% rate that was in effect for 2025. The rate applies to all Georgia taxable income after the standard deduction and dependent exemptions are subtracted. This is the third reduction in as many years, following Georgia's shift from a graduated tax system to a flat tax starting in 2024.`,
  },
  {
    q: "Is Georgia a flat tax state?",
    a: `Yes. Georgia became a flat tax state on January 1, 2024, when it replaced its six-bracket graduated income tax with a single flat rate. The initial flat rate was 5.49% in 2024, dropped to 5.19% in 2025, and dropped further to ${GA_RATE}% in 2026. Georgia's flat tax includes a standard deduction (${money2(GA_STD_DED_SINGLE)} for single filers and ${money2(GA_STD_DED_JOINT)} for joint filers) and dependent exemptions of ${money2(GA_DEP_EXEMPTION)} per dependent, which means the effective rate increases gradually as income rises above those thresholds.`,
  },
  {
    q: "How much is GA income tax on $60,000?",
    a: `For a single filer earning $60,000 with no dependents, the Georgia standard deduction is ${money2(GA_STD_DED_SINGLE)}, leaving $${(60000 - GA_STD_DED_SINGLE).toLocaleString()} of taxable Georgia income. At ${GA_RATE}%, the Georgia income tax is $${((60000 - GA_STD_DED_SINGLE) * GA_RATE / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. A married couple with two children filing jointly would claim a ${money2(GA_STD_DED_JOINT)} standard deduction plus ${money2(GA_DEP_EXEMPTION * 2)} in dependent exemptions, reducing taxable income to $${(60000 - GA_STD_DED_JOINT - GA_DEP_EXEMPTION * 2).toLocaleString()} and Georgia tax to $${((60000 - GA_STD_DED_JOINT - GA_DEP_EXEMPTION * 2) * GA_RATE / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Use the calculator above to enter your exact filing situation.`,
  },
  {
    q: "What is the Georgia standard deduction?",
    a: `For ${YEAR}, the Georgia standard deduction is ${money2(GA_STD_DED_SINGLE)} for single filers, head of household filers, and married filing separately. Married couples filing jointly receive ${money2(GA_STD_DED_JOINT)}. The standard deduction reduces your Georgia taxable income dollar for dollar before the ${GA_RATE}% flat rate is applied. Georgia moved to this flat standard deduction structure when it adopted the flat tax system in 2024, replacing the previous combination of personal exemptions and graduated brackets.`,
  },
  {
    q: "How many dependents can I claim in Georgia?",
    a: `In Georgia, there is no statutory limit on the number of dependents you can claim for state income tax purposes. Each qualifying dependent reduces your Georgia taxable income by ${money2(GA_DEP_EXEMPTION)}. You generally claim the same dependents on your Georgia return that you claim on your federal return. The dependent exemption is subtracted from your income along with the standard deduction before the ${GA_RATE}% flat rate is applied, so each dependent saves you exactly ${money2(GA_DEP_EXEMPTION * GA_RATE / 100)} in Georgia tax.`,
  },
  {
    q: "When did Georgia switch to a flat tax?",
    a: `Georgia switched to a flat income tax system on January 1, 2024. Prior to 2024, Georgia had a graduated income tax with six brackets ranging from 1% to 5.75%. The shift to a flat tax was enacted by House Bill 1437, signed into law in April 2022. The initial flat rate was 5.49% in 2024, followed by scheduled reductions to 5.19% in 2025 and ${GA_RATE}% in 2026. The legislation includes triggers that could further reduce the rate in future years if state revenue meets certain thresholds.`,
  },
  {
    q: "Do I have to file a Georgia tax return?",
    a: `You generally must file a Georgia Form 500 if you were a Georgia resident for any part of the year and you are required to file a federal return, or if you had Georgia income tax withheld and want a refund. The filing thresholds generally follow the federal standard deduction amounts. Even if you are not required to file, you should file if you had Georgia tax withheld or if you qualify for refundable credits. Nonresidents who earned income from Georgia sources — including wages, business income, or rental income from Georgia property — may also need to file a Georgia return.`,
  },
  {
    q: "Is Social Security taxed in Georgia?",
    a: `No. Georgia does not tax Social Security benefits for state income tax purposes. If your only income is Social Security, you generally do not need to file a Georgia return. Georgia also offers additional retirement income exclusions for taxpayers who are 62 or older or who are permanently and totally disabled. For ${YEAR}, the retirement income exclusion is up to ${money2(65000)} per person (the amount is adjusted periodically), which can cover income from pensions, IRAs, 401(k)s, and other retirement sources. This makes Georgia one of the more tax-friendly states for retirees.`,
  },
];

export default function GeorgiaIncomeTaxPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Georgia Income Tax Calculator",
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
      { "@type": "ListItem", position: 3, name: "Georgia Income Tax Calculator", item: CANONICAL },
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
        <span>Georgia Income Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">GA STATE TAX · {YEAR}</div>
        <h1>
          Georgia Income Tax Calculator <em>{YEAR}</em>
        </h1>
        <div className="hero-intro">
          <p>
            Estimate your total federal and Georgia state income tax for {YEAR}. Enter your
            annual income, filing status, and dependents to see how the federal progressive
            brackets and Georgia&apos;s flat {GA_RATE}% rate apply to your return. Georgia moved
            to a flat tax system in 2024, and the rate continues to drop in {YEAR} as part of
            scheduled reductions.
          </p>
        </div>
        <StateIncomeTaxCalculator stateAbbr="GA" />
        <div className="hero-more">
          <p>
            Federal rates come from {capitalGains.source.label}. Georgia figures use the{" "}
            {GA_RATE}% flat rate with {money2(GA_STD_DED_SINGLE)} / {money2(GA_STD_DED_JOINT)}{" "}
            standard deduction and {money2(GA_DEP_EXEMPTION)} dependent exemptions, consistent
            with the GA Form 500 formula.
          </p>
        </div>
        <div className="trust-row">
          <span>{YEAR} Rates</span>
          <span>GA Flat Rate</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How Georgia Income Tax Works</h2>
        <section>
          <p>
            Georgia uses a flat income tax system with a single rate of <strong>{GA_RATE}%</strong>{" "}
            for {YEAR}. The flat rate is applied to your Georgia taxable income, which is your
            total income minus the Georgia standard deduction and any dependent exemptions you
            qualify for. The state transitioned from a graduated six-bracket system to a flat tax
            starting in 2024, with the rate gradually declining each year.
          </p>

          <h3>The 2026 Flat Rate Structure</h3>
          <p>
            For {YEAR}, the Georgia individual income tax rate is a flat <strong>{GA_RATE}%</strong>.
            This rate applies to all taxable income regardless of how much you earn. The flat rate
            takes effect on May 11, 2026, which means part of the {YEAR} tax year may fall under
            the prior 5.19% rate and part under the new {GA_RATE}% rate, depending on how the
            transition is implemented. Our calculator uses the full-year {GA_RATE}% rate for
            estimation purposes.
          </p>
          <p>
            Unlike a pure flat tax with no deductions, Georgia's system includes a standard
            deduction and dependent exemptions that reduce the amount of income subject to tax.
            This means the effective tax rate — total tax divided by total income — is lower for
            lower-income households and gradually approaches the statutory {GA_RATE}% rate as
            income rises. In that sense, Georgia's flat tax has a mildly progressive character at
            lower income levels, similar to most other flat-tax states.
          </p>

          <h3>Standard Deduction</h3>
          <p>
            Georgia offers a standard deduction that reduces your taxable income before the flat
            rate is applied. For {YEAR}, the standard deduction amounts are:
          </p>
          <ul className="checklist">
            <li><strong>Single:</strong> {money2(GA_STD_DED_SINGLE)}</li>
            <li><strong>Head of Household:</strong> {money2(GA_STD_DED_SINGLE)}</li>
            <li><strong>Married Filing Jointly:</strong> {money2(GA_STD_DED_JOINT)}</li>
            <li><strong>Married Filing Separately:</strong> {money2(GA_STD_DED_SINGLE)}</li>
          </ul>
          <p>
            The standard deduction is automatically applied — you do not need to itemize or claim
            it separately. It replaces the personal exemption system that existed under Georgia's
            prior graduated tax. The standard deduction means that a single filer pays no Georgia
            income tax on the first {money2(GA_STD_DED_SINGLE)} of income, and a married couple
            pays no tax on the first {money2(GA_STD_DED_JOINT)}.
          </p>

          <h3>Dependent Exemptions</h3>
          <p>
            In addition to the standard deduction, Georgia allows a dependent exemption for each
            qualifying dependent you claim on your return. For {YEAR}, the dependent exemption is{" "}
            <strong>{money2(GA_DEP_EXEMPTION)}</strong> per dependent. There is no limit on the
            number of dependents you can claim.
          </p>
          <p>
            Each dependent exemption reduces your Georgia taxable income by{" "}
            {money2(GA_DEP_EXEMPTION)}, which saves you exactly {money2(GA_DEP_EXEMPTION * GA_RATE / 100)}{" "}
            in Georgia tax at the {GA_RATE}% flat rate. If you have three children, for example,
            your total dependent exemption is {money2(GA_DEP_EXEMPTION * 3)}, reducing your tax
            bill by {money2(GA_DEP_EXEMPTION * 3 * GA_RATE / 100)}.
          </p>

          <h3>How the Calculation Works</h3>
          <p>
            Calculating your Georgia income tax follows a straightforward three-step formula:
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
                  <td>Start with your federal adjusted gross income (with Georgia adjustments)</td>
                </tr>
                <tr>
                  <td><strong>2</strong></td>
                  <td>Subtract standard deduction ({money2(GA_STD_DED_SINGLE)} single / {money2(GA_STD_DED_JOINT)} joint)</td>
                </tr>
                <tr>
                  <td><strong>3</strong></td>
                  <td>Subtract dependent exemptions ({money2(GA_DEP_EXEMPTION)} per dependent)</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>4</strong></td>
                  <td><strong>Multiply taxable income by {GA_RATE}% → Georgia tax</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">HISTORY</p>
        <h2>Georgia's Move to a Flat Tax System</h2>
        <section>
          <p>
            Georgia's shift to a flat income tax is one of the most significant state tax changes
            of the past decade. The transition was years in the making and represents a major
            policy shift from a progressive graduated system to a single-rate flat tax.
            Understanding how we got here helps explain the current system and what might come
            next.
          </p>

          <h3>The Old Graduated System</h3>
          <p>
            Before 2024, Georgia had a graduated income tax with six tax brackets. Rates ranged
            from 1% on the lowest tier of income up to 5.75% on the highest bracket. The top
            bracket kicked in at relatively low income levels — just $7,000 for single filers and
            $10,000 for joint filers — which meant most Georgia taxpayers were already in the top
            bracket. In practice, the system was only mildly progressive because the brackets
            were so compressed.
          </p>
          <p>
            Critics of the old system argued that it was complex, created unnecessary compliance
            burdens, and put Georgia at a competitive disadvantage compared to states with lower
            or flatter taxes. Supporters of the graduated system countered that it was fairer
            because higher earners paid a larger share of their income in tax.
          </p>

          <h3>House Bill 1437 and the Flat Tax Transition</h3>
          <p>
            In April 2022, Georgia Governor Brian Kemp signed House Bill 1437 into law, enacting
            the most sweeping tax reform in the state's modern history. The legislation replaced
            Georgia's six-bracket graduated income tax with a single flat rate and a larger
            standard deduction. The transition was phased in over multiple years with scheduled
            rate reductions:
          </p>
          <ul className="checklist">
            <li><strong>2024:</strong> First year of flat tax at 5.49%</li>
            <li><strong>2025:</strong> Rate reduced to 5.19%</li>
            <li><strong>2026:</strong> Rate reduced to {GA_RATE}% (effective May 11, 2026)</li>
          </ul>
          <p>
            The law also includes revenue triggers that could further reduce the rate in future
            years if state revenue growth meets certain thresholds. These triggers are designed
            to ensure that rate reductions only happen when the state can afford them, preventing
            budget shortfalls from the tax cut.
          </p>

          <h3>Why Georgia Made the Switch</h3>
          <p>
            Proponents of the flat tax gave several reasons for the change. First, they argued
            that a simpler, flatter tax system would make Georgia more competitive with other
            states and attract businesses and workers. With neighboring states like Florida and
            Tennessee having no state income tax at all, Georgia's leaders felt pressure to lower
            rates to remain competitive in the region.
          </p>
          <p>
            Second, supporters said the flat tax would make the system simpler and more
            transparent. With a single rate and a standard deduction, taxpayers can more easily
            understand what they owe and plan their finances accordingly. The old system's
            compressed brackets meant that most people were effectively paying the top rate
            anyway, so the flat rate formalized what was already largely true in practice.
          </p>
          <p>
            Third, the flat tax was paired with an increase in the standard deduction and
            dependent exemptions, which meant that lower- and middle-income households saw a net
            tax cut even before the rate reductions fully phase in. The larger standard deduction
            ensures that households below a certain income level pay no Georgia income tax at all.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Tax System</th>
                  <th>Top / Flat Rate</th>
                  <th>Standard Deduction (Single)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>2023</strong></td>
                  <td>Graduated (6 brackets)</td>
                  <td>5.75%</td>
                  <td>Lower personal exemption system</td>
                </tr>
                <tr>
                  <td><strong>2024</strong></td>
                  <td>Flat tax</td>
                  <td>5.49%</td>
                  <td>Increased standard deduction</td>
                </tr>
                <tr>
                  <td><strong>2025</strong></td>
                  <td>Flat tax</td>
                  <td>5.19%</td>
                  <td>Same structure</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>{YEAR}</strong></td>
                  <td><strong>Flat tax</strong></td>
                  <td><strong>{GA_RATE}%</strong></td>
                  <td><strong>{money2(GA_STD_DED_SINGLE)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">DEDUCTIONS &amp; EXEMPTIONS</p>
        <h2>GA Standard Deduction and Exemptions</h2>
        <section>
          <p>
            While Georgia's flat rate gets most of the attention, the standard deduction and
            dependent exemptions are just as important for understanding how much tax you will
            actually pay. These two provisions reduce your taxable income dollar for dollar before
            the {GA_RATE}% rate is applied, and they are the main reason Georgia's flat tax is
            not quite as flat as it first appears.
          </p>

          <h3>Standard Deduction by Filing Status</h3>
          <p>
            The Georgia standard deduction varies by filing status, with married couples filing
            jointly receiving double the single amount. Here is the breakdown for {YEAR}:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Filing Status</th>
                  <th>Standard Deduction</th>
                  <th>Tax savings at {GA_RATE}%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Single</strong></td>
                  <td>{money2(GA_STD_DED_SINGLE)}</td>
                  <td>{money2(GA_STD_DED_SINGLE * GA_RATE / 100)}</td>
                </tr>
                <tr>
                  <td><strong>Head of Household</strong></td>
                  <td>{money2(GA_STD_DED_SINGLE)}</td>
                  <td>{money2(GA_STD_DED_SINGLE * GA_RATE / 100)}</td>
                </tr>
                <tr>
                  <td><strong>Married Filing Jointly</strong></td>
                  <td>{money2(GA_STD_DED_JOINT)}</td>
                  <td>{money2(GA_STD_DED_JOINT * GA_RATE / 100)}</td>
                </tr>
                <tr>
                  <td><strong>Married Filing Separately</strong></td>
                  <td>{money2(GA_STD_DED_SINGLE)}</td>
                  <td>{money2(GA_STD_DED_SINGLE * GA_RATE / 100)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The standard deduction means that if your income is below the threshold for your
            filing status, you owe no Georgia income tax at all. For a single person, that means
            the first {money2(GA_STD_DED_SINGLE)} of income is completely tax-free at the state
            level. For a married couple with two children, the combination of the standard
            deduction and two dependent exemptions means the first{" "}
            {money2(GA_STD_DED_JOINT + GA_DEP_EXEMPTION * 2)} of income is tax-free.
          </p>

          <h3>Dependent Exemptions Explained</h3>
          <p>
            The Georgia dependent exemption is {money2(GA_DEP_EXEMPTION)} per qualifying
            dependent for {YEAR}. You can claim the same dependents on your Georgia return that
            you claim on your federal return. There is no income phase-out and no limit on the
            number of dependents you can claim.
          </p>
          <p>
            Each dependent exemption reduces your taxable income by {money2(GA_DEP_EXEMPTION)}.
            At the {GA_RATE}% flat rate, each dependent saves you{" "}
            {money2(GA_DEP_EXEMPTION * GA_RATE / 100)} in Georgia tax. If you have a family of
            four (two adults, two children) filing jointly, your standard deduction plus two
            dependent exemptions totals {money2(GA_STD_DED_JOINT + GA_DEP_EXEMPTION * 2)}, which
            means you pay no Georgia tax on the first {money2(GA_STD_DED_JOINT + GA_DEP_EXEMPTION * 2)}{" "}
            of your income.
          </p>

          <h3>How They Reduce Your Taxable Income</h3>
          <p>
            To see how the standard deduction and dependent exemptions work together, consider a
            few examples at different income levels:
          </p>
          <ul className="checklist">
            <li><strong>Single, $30,000 income, no dependents:</strong> {money2(GA_STD_DED_SINGLE)} standard deduction leaves {money2(30000 - GA_STD_DED_SINGLE)} taxable → tax of {money2((30000 - GA_STD_DED_SINGLE) * GA_RATE / 100)}</li>
            <li><strong>Married, $80,000 income, 2 dependents:</strong> {money2(GA_STD_DED_JOINT)} + {money2(GA_DEP_EXEMPTION * 2)} = {money2(GA_STD_DED_JOINT + GA_DEP_EXEMPTION * 2)} in deductions → taxable income {money2(80000 - GA_STD_DED_JOINT - GA_DEP_EXEMPTION * 2)} → tax of {money2((80000 - GA_STD_DED_JOINT - GA_DEP_EXEMPTION * 2) * GA_RATE / 100)}</li>
            <li><strong>Single, $100,000 income, 1 dependent:</strong> {money2(GA_STD_DED_SINGLE)} + {money2(GA_DEP_EXEMPTION)} = {money2(GA_STD_DED_SINGLE + GA_DEP_EXEMPTION)} in deductions → taxable income {money2(100000 - GA_STD_DED_SINGLE - GA_DEP_EXEMPTION)} → tax of {money2((100000 - GA_STD_DED_SINGLE - GA_DEP_EXEMPTION) * GA_RATE / 100)}</li>
          </ul>
          <p>
            Notice that as income rises, the deductions become a smaller share of total income,
            and the effective tax rate gradually approaches the statutory {GA_RATE}% rate. This
            is the mildly progressive effect of the standard deduction and exemptions in an
            otherwise flat tax system.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FILING REQUIREMENTS</p>
        <h2>Who Has to File a Georgia Tax Return?</h2>
        <section>
          <p>
            Whether you need to file a Georgia Form 500 depends on your residency status, your
            income level, your filing status, and whether you had Georgia tax withheld. Georgia's
            filing requirements are generally tied to the federal filing thresholds, but there are
            some important differences.
          </p>

          <h3>Georgia Residents</h3>
          <p>
            If you were a Georgia resident for the full year, you generally must file a Georgia
            Form 500 if:
          </p>
          <ul className="checklist">
            <li>You are required to file a federal income tax return</li>
            <li>You had Georgia income tax withheld from your pay and want a refund</li>
            <li>You qualify for refundable credits like the Georgia Earned Income Tax Credit</li>
            <li>You had Georgia estimated tax payments or overpayment credits applied from last year</li>
            <li>You have income from Georgia sources but are claimed as a dependent on someone else's return</li>
          </ul>
          <p>
            Even if you are not technically required to file, it is usually a good idea to file
            if you had any Georgia tax withheld or if you might qualify for refundable credits.
            You cannot get a refund without filing a return, and filing ensures you are in
            compliance with the Georgia Department of Revenue.
          </p>

          <h3>Part-Year Residents and Nonresidents</h3>
          <p>
            If you moved into or out of Georgia during the year, you file as a part-year
            resident using Form 500. You pay Georgia tax on income you earned while you were a
            resident, plus any income from Georgia sources while you were a nonresident. You will
            need to allocate your income between the resident and nonresident portions of the
            year.
          </p>
          <p>
            If you were never a Georgia resident but earned income from Georgia sources — for
            example, if you worked in Georgia but lived in another state — you may need to file
            Form 500 as a nonresident. Common Georgia-source income includes wages earned in
            Georgia, rental income from Georgia property, business income from Georgia
            operations, and income from a Georgia business or partnership.
          </p>

          <h3>Filing Thresholds</h3>
          <p>
            Because Georgia uses a standard deduction system, you generally do not need to file a
            Georgia return if your income is below the standard deduction for your filing status
            and you have no other filing requirement. However, if you had any Georgia tax
            withheld, you should file anyway to claim a refund.
          </p>
          <p>
            The general rule is that if you are required to file a federal return, you should
            also file a Georgia return. Georgia's filing thresholds are generally similar to the
            federal standard deduction amounts, but there can be differences, especially for
            dependents and for taxpayers with special types of income.
          </p>

          <h3>Important Deadlines</h3>
          <p>
            The Georgia individual income tax return is due on the same day as the federal return
            — typically April 15 of the following year, or the next business day if April 15
            falls on a weekend or holiday. If you file for a federal extension, your Georgia
            filing deadline is automatically extended as well, but you still need to pay any tax
            you owe by the original deadline to avoid interest and penalties.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARISON</p>
        <h2>Georgia vs Federal: Key Differences</h2>
        <section>
          <p>
            While both Georgia and the federal government collect income tax, they operate on
            fundamentally different principles. Georgia uses a single flat rate with a standard
            deduction, while the federal government uses seven progressive brackets with a larger
            standard deduction and numerous credits. Understanding these differences helps you
            plan for your total tax bill.
          </p>

          <h3>Flat vs Progressive Rate Structure</h3>
          <p>
            The biggest difference is the rate structure. Georgia has a <strong>single flat rate
            of {GA_RATE}%</strong> that applies to all taxable income above the standard
            deduction. Once your income exceeds the standard deduction, every additional dollar is
            taxed at exactly {GA_RATE}%. There are no bracket thresholds to cross and no marginal
            rate increases as your income grows.
          </p>
          <p>
            The federal system uses <strong>seven progressive tax brackets</strong> for {YEAR},
            ranging from 10% at the bottom to 37% at the top. As your income rises, each
            additional dollar is taxed at a higher marginal rate. Your effective rate — total tax
            divided by total income — is always lower than your top bracket because only the
            income within each bracket is taxed at that bracket's rate.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Federal Income Tax</th>
                  <th>Georgia Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rate structure</strong></td>
                  <td>Progressive — 7 brackets, 10% to 37%</td>
                  <td>Flat — single rate of {GA_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Standard deduction</strong></td>
                  <td>Yes — {money2(single.standardDeduction)} single, {money2(married.standardDeduction)} joint</td>
                  <td>Yes — {money2(GA_STD_DED_SINGLE)} single, {money2(GA_STD_DED_JOINT)} joint</td>
                </tr>
                <tr>
                  <td><strong>Personal exemptions</strong></td>
                  <td>Suspended through 2025 (part of TCJA)</td>
                  <td>Included in standard deduction</td>
                </tr>
                <tr>
                  <td><strong>Dependent exemptions/credits</strong></td>
                  <td>Child Tax Credit (refundable, up to $2,000 per child)</td>
                  <td>{money2(GA_DEP_EXEMPTION)} exemption per dependent</td>
                </tr>
                <tr>
                  <td><strong>Top rate</strong></td>
                  <td>37% above {money2(single.brackets[6][0])} (single)</td>
                  <td>{GA_RATE}% on all taxable income</td>
                </tr>
                <tr>
                  <td><strong>Number of brackets</strong></td>
                  <td>Seven</td>
                  <td>One</td>
                </tr>
                <tr>
                  <td><strong>Filing status impact</strong></td>
                  <td>Major — changes brackets and standard deduction</td>
                  <td>Moderate — changes standard deduction only</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Why Your Federal Bill Is Usually Higher</h3>
          <p>
            For most Georgia taxpayers, the federal income tax bill is substantially larger than
            the state tax bill. Federal rates are much higher across the board — even the 10%
            bottom bracket is roughly double Georgia's {GA_RATE}% flat rate, and the top federal
            rate of 37% is more than seven times higher. The federal standard deduction is also
            significantly larger than Georgia's, but the rates above that deduction are much
            higher.
          </p>
          <p>
            At $60,000 of income for a single filer, federal tax is roughly three to four times
            the Georgia tax. At higher incomes, the gap widens further as federal rates climb
            into the 22%, 24%, and 32% brackets while Georgia stays at {GA_RATE}%. At very high
            incomes, the federal tax can be five to ten times larger than the Georgia state tax.
          </p>

          <h3>Retirement Income Treatment</h3>
          <p>
            Georgia is notably more generous than the federal government when it comes to
            retirement income. Social Security benefits are fully exempt from Georgia tax, and
            taxpayers age 62 and older can exclude up to $65,000 of retirement income (including
            pensions, IRAs, and 401(k) distributions) from their Georgia taxable income. At the
            federal level, Social Security benefits are taxable for most retirees with other
            income, and retirement account distributions are fully taxed at ordinary rates.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>
          FREQUENTLY ASKED QUESTIONS
        </p>
        <h2>Georgia Income Tax FAQ</h2>
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
            ({capitalGains.source.sections}). Georgia figures use the {GA_RATE}% flat rate with{" "}
            {money2(GA_STD_DED_SINGLE)} / {money2(GA_STD_DED_JOINT)} standard deduction and{" "}
            {money2(GA_DEP_EXEMPTION)} dependent exemptions, consistent with the Form 500
            instructions and the Georgia Department of Revenue guidance.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice or a substitute
            for professional tax preparation or filing software. The calculator estimates federal
            and Georgia income tax using simplified inputs and does not account for itemized
            deductions, tax credits, capital gains, retirement contributions, self-employment
            taxes, or Georgia-specific additions and subtractions to federal AGI. Consult a tax
            professional for advice tailored to your specific situation.
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
            <a href="/georgia-paycheck-calculator">
              <b>Georgia Paycheck Calculator</b>
              <span>Per-paycheck withholding →</span>
            </a>
            <a href="/illinois-income-tax-calculator">
              <b>Illinois Income Tax Calculator</b>
              <span>IL flat rate estimator →</span>
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
