import type { Metadata } from "next";
import IllinoisIncomeTaxCalculator from "../components/IllinoisIncomeTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/illinois-income-tax-calculator";
const TITLE = "Illinois Income Tax Calculator 2026 — Free Estimator";
const DESCRIPTION =
  "Free Illinois income tax calculator for 2026. Estimate your federal and Illinois state income tax based on your income, filing status, and dependents.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/illinois-income-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

const IL_RATE = 4.95;
const IL_EXEMPTION = 2925;

const faqs = [
  {
    q: "What is the Illinois income tax rate?",
    a: `Illinois has a flat individual income tax rate of ${IL_RATE}%. Unlike the federal system and most state income taxes, Illinois applies the same rate to every dollar of taxable income regardless of how much you earn. The flat rate is applied after personal exemptions of $${IL_EXEMPTION.toLocaleString()} per person are subtracted from your income.`,
  },
  {
    q: "Is Illinois a flat tax state?",
    a: `Yes. Illinois is one of about a dozen states with a flat income tax rate. Every dollar of taxable Illinois income is taxed at ${IL_RATE}%, whether you earn $30,000 or $300,000. The flat rate is established by the Illinois Constitution, and changing it would require a constitutional amendment. Personal exemptions reduce the taxable base before the flat rate is applied, which gives the system a modest progressive element at very low incomes.`,
  },
  {
    q: `How much is Illinois income tax on $75,000?`,
    a: `For a single filer earning $75,000 with no dependents, the Illinois personal exemption is $${IL_EXEMPTION.toLocaleString()}, leaving $${(75000 - IL_EXEMPTION).toLocaleString()} of taxable Illinois income. At ${IL_RATE}%, the Illinois income tax is $${((75000 - IL_EXEMPTION) * 0.0495).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. A married couple with two children would claim four exemptions ($${(IL_EXEMPTION * 4).toLocaleString()}), reducing Illinois tax to $${((75000 - IL_EXEMPTION * 4) * 0.0495).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Use the calculator above to enter your exact filing situation.`,
  },
  {
    q: "What are Illinois personal exemptions?",
    a: `The Illinois personal exemption is $${IL_EXEMPTION.toLocaleString()} per person for tax year ${YEAR}. You get one exemption for yourself, one for your spouse if you file jointly, and one for each dependent you claim. The exemption reduces your Illinois taxable income dollar for dollar before the ${IL_RATE}% flat rate is applied. The amount is adjusted annually for inflation by the Illinois Department of Revenue.`,
  },
  {
    q: "Do I have to file an Illinois tax return?",
    a: `You generally must file an Illinois Form IL-1040 if you were an Illinois resident for any part of the year and you are required to file a federal return, or if you had Illinois income tax withheld and want a refund. Even if you are not required to file, you should file if you had Illinois tax withheld or if you qualify for refundable credits like the Earned Income Tax Credit or the Property Tax Credit. Nonresidents who earned income from Illinois sources may also need to file.`,
  },
  {
    q: "How is Illinois income tax calculated?",
    a: `Illinois income tax starts with your federal adjusted gross income, then applies Illinois-specific additions and subtractions to arrive at Illinois base income. From there, you subtract your personal exemptions ($${IL_EXEMPTION.toLocaleString()} per person for ${YEAR}) to get Illinois net income. The tax is simply net income multiplied by ${IL_RATE}%. Credits like the property tax credit and earned income credit then reduce the final bill. Our calculator uses the simplified flat-rate formula: (income minus exemptions) times ${IL_RATE}%.`,
  },
  {
    q: "What is the difference between Illinois and federal income tax?",
    a: `The biggest difference is structure: federal income tax is progressive with seven brackets ranging from 10% to 37%, while Illinois has a single flat rate of ${IL_RATE}%. The federal system uses a standard deduction or itemized deductions to reduce taxable income, whereas Illinois uses personal exemptions per person. Federal tax also has many credits and adjustments that do not exist in Illinois. At moderate incomes, federal tax is usually significantly larger than Illinois tax, but the share depends heavily on your income level and filing status.`,
  },
  {
    q: "Can I deduct federal tax on my Illinois return?",
    a: `No. Illinois does not allow a deduction for federal income tax paid. Your Illinois tax base starts from federal adjusted gross income and then applies Illinois-specific additions and subtractions, but federal income tax itself is not deductible at the state level. This is different from some other states that allow a state-level deduction for federal taxes paid.`,
  },
];

export default function IllinoisIncomeTaxPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Illinois Income Tax Calculator",
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
      { "@type": "ListItem", position: 3, name: "Illinois Income Tax Calculator", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">ILLINOIS · {IL_RATE}% FLAT STATE INCOME TAX</div>
        <h1>
          Illinois Income Tax Calculator <em>{YEAR}</em>
        </h1>
        <div className="hero-intro">
          <p>
            Estimate your total federal and Illinois state income tax for {YEAR}. Enter your annual
            income, filing status, and dependents to see how the federal progressive brackets and
            Illinois&apos;s flat {IL_RATE}% rate apply to your return.
          </p>
        </div>
        <IllinoisIncomeTaxCalculator />
        <div className="hero-more">
          <p>
            Federal rates come from {capitalGains.source.label}. Illinois figures use the{" "}
            {IL_RATE}% flat rate with ${IL_EXEMPTION.toLocaleString()} personal exemptions per
            person, consistent with the IL-1040 formula.
          </p>
        </div>
        <div className="trust-row">
          <span>{YEAR} Rates</span>
          <span>IL Flat Rate</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How Illinois Income Tax Works</h2>
        <section>
          <p>
            Illinois has one of the simplest state income tax systems in the country: a single flat
            rate applied to nearly all income after personal exemptions. There are no brackets, no
            graduated rates, and no standard deduction separate from the per-person exemption
            amount.
          </p>

          <h3>The Flat Rate Structure</h3>
          <p>
            The Illinois individual income tax rate is <strong>{IL_RATE}%</strong>. This rate is
            written into the Illinois Constitution and has been in effect since 2011, when it was
            temporarily raised from 3%, then made permanent at the current level. Because it is a
            flat rate, every dollar of taxable Illinois income is taxed at exactly the same
            percentage, whether you earn $10,000 or $10 million.
          </p>
          <p>
            This makes Illinois different from the federal system and from the majority of US
            states, which use progressive brackets where higher incomes face higher marginal rates.
            In practice, the flat rate means your Illinois tax is roughly proportional to your
            income — the calculation is straightforward enough to do by hand.
          </p>

          <h3>Personal Exemptions</h3>
          <p>
            Before the flat rate is applied, Illinois allows you to subtract a personal exemption
            for each person on your return. For {YEAR}, the personal exemption is{" "}
            <strong>{money2(IL_EXEMPTION)}</strong> per person. You get:
          </p>
          <ul className="checklist">
            <li>One exemption for yourself</li>
            <li>One exemption for your spouse if you file a joint return</li>
            <li>One exemption for each dependent you claim</li>
          </ul>
          <p>
            The exemption amount is adjusted annually for inflation by the Illinois Department of
            Revenue. It has generally increased by small amounts each year. The exemption reduces
            your taxable income dollar for dollar, which means it is worth exactly{" "}
            {money2(IL_EXEMPTION * 0.0495)} in tax savings per person at the {IL_RATE}% rate.
          </p>

          <h3>How the Calculation Works</h3>
          <p>
            The Illinois income tax calculation follows a simple formula. Start with your federal
            adjusted gross income, then apply Illinois-specific additions and subtractions to reach
            your Illinois base income. Common additions include interest from out-of-state municipal
            bonds and certain deductions you claimed on your federal return. Common subtractions
            include Social Security benefits, retirement income up to certain limits, and interest
            from US government obligations.
          </p>
          <p>
            From base income, subtract your total personal exemptions to get Illinois net income.
            Multiply net income by {IL_RATE}% to get your gross tax. Then subtract any credits you
            qualify for — including the property tax credit, earned income credit, and education
            credits — to arrive at your net Illinois income tax.
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
                  <td>Start with federal adjusted gross income</td>
                </tr>
                <tr>
                  <td><strong>2</strong></td>
                  <td>Apply Illinois additions and subtractions → base income</td>
                </tr>
                <tr>
                  <td><strong>3</strong></td>
                  <td>Subtract personal exemptions ({money2(IL_EXEMPTION)} per person) → net income</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>4</strong></td>
                  <td><strong>Multiply net income by {IL_RATE}% → Illinois tax</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARISON</p>
        <h2>Illinois vs Federal: What Is the Difference?</h2>
        <section>
          <p>
            The federal income tax and the Illinois income tax operate on fundamentally different
            principles. Understanding the difference helps you see how each tax affects your total
            bill and why the two systems behave so differently as your income changes.
          </p>

          <h3>Progressive vs Flat</h3>
          <p>
            The federal system uses <strong>seven progressive tax brackets</strong> for {YEAR},
            ranging from 10% at the bottom to 37% at the top. As your income rises, each
            additional dollar is taxed at a higher marginal rate. Your effective rate — total tax
            divided by total income — is always lower than your top bracket because only the income
            within each bracket is taxed at that bracket&apos;s rate.
          </p>
          <p>
            Illinois uses a <strong>single flat rate of {IL_RATE}%</strong>. Every dollar of
            taxable income is taxed at the same rate, so your marginal rate and your effective rate
            are nearly identical (differing only because of the personal exemption). There is no
            bracket creep and no cliff where crossing a threshold changes the rate on income you
            already earned.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Federal Income Tax</th>
                  <th>Illinois Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rate structure</strong></td>
                  <td>Progressive — 7 brackets, 10% to 37%</td>
                  <td>Flat — single rate of {IL_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Standard deduction</strong></td>
                  <td>Yes — {money2(single.standardDeduction)} single, {money2(married.standardDeduction)} joint</td>
                  <td>No separate standard deduction</td>
                </tr>
                <tr>
                  <td><strong>Personal exemptions</strong></td>
                  <td>Suspended through 2025 (part of TCJA)</td>
                  <td>Yes — {money2(IL_EXEMPTION)} per person</td>
                </tr>
                <tr>
                  <td><strong>Top rate</strong></td>
                  <td>37% above {money2(single.brackets[6][0])} (single)</td>
                  <td>{IL_RATE}% on all taxable income</td>
                </tr>
                <tr>
                  <td><strong>Number of brackets</strong></td>
                  <td>Seven</td>
                  <td>One</td>
                </tr>
                <tr>
                  <td><strong>Filing status options</strong></td>
                  <td>Single, MFJ, MFS, Head of Household</td>
                  <td>Same statuses affect exemption count only</td>
                </tr>
                <tr>
                  <td><strong>Inflation adjustment</strong></td>
                  <td>Brackets and standard deduction indexed annually</td>
                  <td>Personal exemption adjusted annually</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Why Your Federal Bill Is Usually Higher</h3>
          <p>
            For most Illinois taxpayers, the federal income tax bill is substantially larger than
            the state tax bill. There are two reasons. First, federal rates are generally higher —
            the top {IL_RATE}% Illinois rate is well below the middle federal brackets. Second,
            federal tax applies to a broader base after the standard deduction, while Illinois only
            taxes income after the much smaller personal exemptions.
          </p>
          <p>
            At $75,000 of income for a single filer, federal tax is roughly four to five times the
            Illinois tax. At higher incomes, the gap widens further because federal rates climb
            into the 22%, 24%, and 32% brackets while Illinois stays at {IL_RATE}%. The exception
            is at very low incomes, where federal tax can be zero (due to the standard deduction
            and credits) while Illinois may still collect something once income exceeds the
            personal exemption.
          </p>

          <h3>What Filing Status Means in Each System</h3>
          <p>
            Filing status matters a lot for federal tax because it changes both the standard
            deduction and every bracket threshold. Married filing jointly gets roughly double the
            brackets of single, and head of household gets something in between. Your filing status
            can change your federal tax by thousands of dollars.
          </p>
          <p>
            In Illinois, filing status only changes the number of personal exemptions you claim.
            Married filing jointly gets two exemptions instead of one, which is worth{" "}
            {money2(IL_EXEMPTION * 0.0495)} in tax savings compared with single. Head of household
            gets the same single exemption as a single filer. There is no separate bracket
            structure for each status.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FILING REQUIREMENTS</p>
        <h2>Who Has to File Illinois Income Tax?</h2>
        <section>
          <p>
            Whether you need to file an Illinois Form IL-1040 depends on your residency status,
            your income, and whether you are required to file a federal return. The rules are
            simpler than the federal filing requirements because Illinois has fewer filing
            categories.
          </p>

          <h3>Illinois Residents</h3>
          <p>
            If you were an Illinois resident for the full year, you generally must file an IL-1040
            if:
          </p>
          <ul className="checklist">
            <li>You are required to file a federal income tax return</li>
            <li>You had Illinois income tax withheld from your pay and want a refund</li>
            <li>You qualify for refundable credits like the Illinois Earned Income Credit</li>
            <li>You had Illinois estimated tax payments or overpayment credits applied from last year</li>
          </ul>
          <p>
            Even if you are not technically required to file, it is usually a good idea to file if
            you had any Illinois tax withheld or if you might qualify for refundable credits. You
            cannot get a refund without filing a return.
          </p>

          <h3>Part-Year Residents and Nonresidents</h3>
          <p>
            If you moved into or out of Illinois during the year, you file as a part-year resident
            using Form IL-1040 and Schedule NR. You pay Illinois tax on income you earned while you
            were a resident, plus any income from Illinois sources while you were a nonresident.
          </p>
          <p>
            If you were never an Illinois resident but earned income from Illinois sources — for
            example, if you worked in Illinois but lived in another state — you may need to file
            Form IL-1040 with Schedule NR as a nonresident. Common Illinois-source income includes
            wages earned in Illinois, rental income from Illinois property, and business income
            from Illinois operations.
          </p>

          <h3>When Filing Is Optional</h3>
          <p>
            If your income is below the filing threshold for your federal return and you had no
            Illinois tax withheld, you probably do not need to file an Illinois return. For a
            single person with only wage income below the standard deduction, federal filing is not
            required, and therefore Illinois filing is also not required.
          </p>
          <p>
            However, there is no penalty for filing a return when you do not have to. If you are
            unsure whether you should file, the safest approach is to file anyway — especially if
            you had any withholding or estimated payments. You will get any overpayment back as a
            refund.
          </p>

          <h3>Important Deadlines</h3>
          <p>
            The Illinois individual income tax return is due on the same day as the federal return
            — typically April 15 of the following year, or the next business day if April 15 falls
            on a weekend or holiday. If you file for a federal extension, your Illinois filing
            deadline is automatically extended as well, but you still need to pay any tax you owe
            by the original deadline to avoid interest and penalties.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMMON CREDITS</p>
        <h2>Illinois Tax Credits That Reduce Your Bill</h2>
        <section>
          <p>
            While Illinois has a flat tax rate, several credits can reduce your final tax bill
            dollar for dollar. These are different from deductions and exemptions, which reduce
            your taxable income — credits directly reduce the tax you owe.
          </p>

          <h3>Property Tax Credit</h3>
          <p>
            The Illinois property tax credit allows you to claim a credit equal to 5% of the real
            estate tax you paid on your principal residence during the tax year. The credit applies
            to property tax paid on your home and up to one acre of land surrounding it. You must
            have owned and occupied the residence as your principal place of residence. This
            credit is not refundable, meaning it can only reduce your tax to zero but cannot
            generate a refund beyond what you paid.
          </p>

          <h3>Illinois Earned Income Credit (EIC)</h3>
          <p>
            The Illinois Earned Income Credit is a refundable credit equal to 20% of your federal
            Earned Income Tax Credit. If you qualify for the federal EIC, you automatically qualify
            for the Illinois version. The credit is fully refundable, meaning it can reduce your
            tax below zero and generate a refund. For low- and moderate-income working families,
            the EIC is often the most valuable credit on the Illinois return.
          </p>

          <h3>Education Expense Credit</h3>
          <p>
            The Illinois education expense credit provides a credit of 25% of qualified K-12
            education expenses above $250, up to a maximum credit of $750 per student. Qualified
            expenses include tuition, books, and lab fees for students in kindergarten through 12th
            grade at public or private schools. The credit is available regardless of your income
            level.
          </p>

          <h3>Child Tax Credit</h3>
          <p>
            Illinois also offers a child tax credit for qualifying children under age 17. The
            credit amount and income limits vary by year. Check the current IL-1040 instructions
            for the latest figures. Like the federal child tax credit, it is subject to income
            phase-outs at higher earnings levels.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>
          FREQUENTLY ASKED QUESTIONS
        </p>
        <h2>Illinois Income Tax FAQ</h2>
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
            ({capitalGains.source.sections}). Illinois figures use the {IL_RATE}% flat rate with{" "}
            {money2(IL_EXEMPTION)} personal exemptions, consistent with the Form IL-1040
            instructions and the Illinois Department of Revenue withholding guidance.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice or a substitute
            for professional tax preparation or filing software. The calculator estimates federal
            and Illinois income tax using simplified inputs and does not account for itemized
            deductions, tax credits, capital gains, retirement contributions, self-employment
            taxes, or Illinois-specific additions and subtractions to federal AGI. Consult a tax
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
            <a href="/illinois-paycheck-calculator">
              <b>Illinois Paycheck Calculator</b>
              <span>Per-paycheck withholding →</span>
            </a>
            <a href="/qualified-dividends-and-capital-gain-tax-worksheet">
              <b>Qualified Dividends Worksheet</b>
              <span>Line-by-line 1040 tax →</span>
            </a>
            <a href="/hsa-calculator">
              <b>HSA Calculator</b>
              <span>{YEAR} limits and savings →</span>
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
