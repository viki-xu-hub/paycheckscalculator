import type { Metadata } from "next";
import StateIncomeTaxCalculator from "../components/StateIncomeTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/pennsylvania-income-tax-calculator";
const TITLE = "Pennsylvania Income Tax Calculator 2026 — 3.07% Flat Rate";
const DESCRIPTION =
  "Free Pennsylvania income tax calculator for 2026. PA has a flat 3.07% state income tax rate. Estimate your federal and PA state tax based on income and filing status.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pennsylvania-income-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

const PA_RATE = 3.07;

const faqs = [
  {
    q: "What is the Pennsylvania income tax rate?",
    a: `Pennsylvania has a flat individual income tax rate of ${PA_RATE}%. Unlike the federal system and most state income taxes, Pennsylvania applies the same rate to every dollar of taxable income regardless of how much you earn. There is no standard deduction and no personal exemption that reduces your taxable base before the rate is applied, making PA one of the purest flat tax systems in the country.`,
  },
  {
    q: "Is Pennsylvania a flat tax state?",
    a: `Yes. Pennsylvania is one of about a dozen states with a flat income tax rate, and it has one of the flattest structures of all. Every dollar of taxable Pennsylvania income is taxed at exactly ${PA_RATE}%, whether you earn $20,000 or $2 million. Unlike some other flat-tax states, Pennsylvania has no standard deduction and no personal exemption that varies by filing status, which means the flat rate applies to nearly all income from the very first dollar.`,
  },
  {
    q: "How much is PA income tax on $50,000?",
    a: `For a Pennsylvania resident earning $50,000, the PA state income tax is calculated simply by multiplying taxable income by ${PA_RATE}%. With no standard deduction or personal exemption to subtract, the full $50,000 is subject to the flat rate, resulting in a PA income tax of $${(50000 * 0.0307).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. For a married couple or a single filer, the calculation is the same because PA does not adjust the tax base by filing status. Use the calculator above to see your combined federal and PA tax based on your exact income.`,
  },
  {
    q: "Does PA have a standard deduction?",
    a: `No. Pennsylvania does not have a standard deduction like the federal government and most other states. There is also no personal exemption amount that reduces your taxable income before the flat rate is applied. This means the ${PA_RATE}% rate applies to nearly all taxable income from dollar one. The lack of a standard deduction is what makes Pennsylvania's flat tax one of the broadest and simplest in the nation — your PA tax is essentially your taxable income multiplied by ${PA_RATE}%, with very few adjustments.`,
  },
  {
    q: "Do I have to file a PA state tax return?",
    a: `You generally must file a Pennsylvania Form PA-40 if you were a Pennsylvania resident for any part of the year and you meet the minimum income threshold, or if you had Pennsylvania income tax withheld and want a refund. Even if you are not required to file, you should file if you had PA tax withheld or if you qualify for refundable credits like the Pennsylvania Earned Income Tax Credit. Nonresidents who earned income from Pennsylvania sources may also need to file a PA-40.`,
  },
  {
    q: "What is the PA personal income tax rate?",
    a: `The Pennsylvania personal income tax rate is a flat ${PA_RATE}%. This rate applies to all eight classes of income recognized by the state: compensation (wages, salaries, tips), interest, dividends, net profits from business or profession, net gains from the sale of property, net income from rents and royalties, income from estates or trusts, and gambling and lottery winnings. Each class is taxed at the same ${PA_RATE}% rate, which is set by state law.`,
  },
  {
    q: "How is PA tax calculated?",
    a: `Pennsylvania income tax is calculated by taking your total PA taxable income and multiplying it by the flat ${PA_RATE}% rate. PA starts with eight classes of income and allows certain deductions specific to each class (such as business expenses against business income), but there is no general standard deduction or personal exemption. The result is PA taxable income, which is then multiplied by ${PA_RATE}% to get your gross tax. Credits like the low-income credit and property tax/rent rebate may reduce your final bill. Our calculator uses the simplified flat-rate formula: income times ${PA_RATE}%.`,
  },
  {
    q: "Are retirement income taxed in PA?",
    a: `Pennsylvania is generally very tax-friendly for retirees. Social Security benefits are not taxed by Pennsylvania. Distributions from qualified retirement plans like 401(k)s, IRAs, and pensions are also exempt from PA state income tax, provided you meet the age and plan requirements. This makes Pennsylvania one of the more attractive states for retirement from a state income tax perspective, especially when combined with the low ${PA_RATE}% flat rate on income that is taxable.`,
  },
];

export default function PennsylvaniaIncomeTaxPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Pennsylvania Income Tax Calculator",
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
      { "@type": "ListItem", position: 3, name: "Pennsylvania Income Tax Calculator", item: CANONICAL },
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
        <span>Pennsylvania Income Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">PA STATE TAX · {YEAR}</div>
        <h1>
          Pennsylvania Income Tax Calculator <em>{YEAR}</em>
        </h1>
        <div className="hero-intro">
          <p>
            Estimate your total federal and Pennsylvania state income tax for {YEAR}. Enter your
            annual income and filing status to see how the federal progressive brackets and
            Pennsylvania&apos;s flat {PA_RATE}% rate apply to your return. PA is known for having
            one of the simplest and flattest state income tax systems in the country.
          </p>
        </div>
        <StateIncomeTaxCalculator stateAbbr="PA" />
        <div className="hero-more">
          <p>
            Federal rates come from {capitalGains.source.label}. Pennsylvania figures use the{" "}
            {PA_RATE}% flat rate, consistent with the PA-40 formula and the Pennsylvania Department
            of Revenue guidance.
          </p>
        </div>
        <div className="trust-row">
          <span>{YEAR} Rates</span>
          <span>PA Flat Rate</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How Pennsylvania Income Tax Works</h2>
        <section>
          <p>
            Pennsylvania has one of the simplest state income tax systems in the United States: a
            single flat rate applied to nearly all income with no standard deduction and no
            personal exemption. There are no brackets, no graduated rates, and very few
            adjustments that reduce your taxable base before the rate is applied.
          </p>

          <h3>The 3.07% Flat Rate</h3>
          <p>
            The Pennsylvania individual income tax rate is <strong>{PA_RATE}%</strong>. This flat
            rate is written into state law and applies to every dollar of taxable Pennsylvania
            income, whether you earn $10,000 or $10 million. Unlike progressive systems where
            higher incomes face higher marginal rates, Pennsylvania treats every dollar of income
            the same way.
          </p>
          <p>
            This makes Pennsylvania different not just from the federal system but also from most
            other states with a flat tax. Many flat-tax states still offer a standard deduction or
            personal exemption that effectively makes the first several thousand dollars of income
            tax-free. Pennsylvania does not, which means the {PA_RATE}% rate applies to nearly all
            income from dollar one. The result is one of the broadest, simplest, and most
            proportional state income tax systems in the country.
          </p>

          <h3>Eight Classes of Income</h3>
          <p>
            Pennsylvania recognizes eight separate classes of income, each of which is taxed at the
            same {PA_RATE}% flat rate:
          </p>
          <ul className="checklist">
            <li><strong>Compensation:</strong> wages, salaries, tips, bonuses, and commissions</li>
            <li><strong>Interest:</strong> interest from savings accounts, CDs, and bonds</li>
            <li><strong>Dividends:</strong> dividends from stocks and mutual funds</li>
            <li><strong>Net profits:</strong> income from business, profession, or farm</li>
            <li><strong>Net gains:</strong> gains from the sale, exchange, or disposition of property</li>
            <li><strong>Rents and royalties:</strong> income from rental property and intellectual property</li>
            <li><strong>Estates and trusts:</strong> income passed through from estates or trusts</li>
            <li><strong>Gambling and lottery:</strong> winnings from gambling, lotteries, and prizes</li>
          </ul>
          <p>
            Each class has its own set of allowable deductions and adjustments, but all are taxed
            at the same flat rate. Losses in one class generally cannot offset income in another
            class, which is different from how the federal tax system works.
          </p>

          <h3>Why PA's Flat Rate Is Unique</h3>
          <p>
            What makes Pennsylvania's flat tax stand out among flat-tax states is the absence of a
            standard deduction or personal exemption. In states like Illinois or Massachusetts, a
            per-person exemption reduces taxable income before the flat rate is applied, which
            introduces a modest progressive element at low income levels. In Pennsylvania, there
            is no such exemption, so the effective rate is essentially the same at all income
            levels.
          </p>
          <p>
            On the other hand, Pennsylvania does not tax Social Security benefits and exempts most
            retirement income, which provides significant tax relief for retirees. The state also
            offers a low-income credit and a property tax/rent rebate program that can reduce or
            eliminate tax liability for lower-income households, adding a progressive element
            through credits rather than through rate brackets.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Pennsylvania</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rate structure</strong></td>
                  <td>Flat — single rate of {PA_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Standard deduction</strong></td>
                  <td>None</td>
                </tr>
                <tr>
                  <td><strong>Personal exemption</strong></td>
                  <td>None</td>
                </tr>
                <tr>
                  <td><strong>Top rate</strong></td>
                  <td>{PA_RATE}% on all taxable income</td>
                </tr>
                <tr>
                  <td><strong>Number of brackets</strong></td>
                  <td>One</td>
                </tr>
                <tr>
                  <td><strong>Tax classes</strong></td>
                  <td>Eight separate classes, all at {PA_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Social Security taxed?</strong></td>
                  <td>No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARISON</p>
        <h2>PA's {PA_RATE}% Flat Rate vs Federal Progressive Tax</h2>
        <section>
          <p>
            The difference between Pennsylvania's income tax and the federal income tax could
            hardly be more stark. One is a pure flat rate with almost no deductions; the other is
            a complex progressive system with seven brackets, a large standard deduction, and
            numerous credits and adjustments. Understanding how they compare helps you see how
            each tax affects your total bill.
          </p>

          <h3>Flat vs Progressive: The Core Difference</h3>
          <p>
            Pennsylvania uses a <strong>single flat rate of {PA_RATE}%</strong>. Every dollar of
            taxable income is taxed at exactly the same rate, so your marginal rate and your
            effective rate are identical. There is no bracket creep, no cliff effects, and no need
            to look up which bracket your income falls into. The calculation is as simple as
            multiplying your taxable income by {PA_RATE}%.
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
                  <th>Pennsylvania Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rate structure</strong></td>
                  <td>Progressive — 7 brackets, 10% to 37%</td>
                  <td>Flat — single rate of {PA_RATE}%</td>
                </tr>
                <tr>
                  <td><strong>Standard deduction</strong></td>
                  <td>Yes — {money2(single.standardDeduction)} single, {money2(married.standardDeduction)} joint</td>
                  <td>No standard deduction</td>
                </tr>
                <tr>
                  <td><strong>Personal exemptions</strong></td>
                  <td>Suspended through 2025 (part of TCJA)</td>
                  <td>No personal exemptions</td>
                </tr>
                <tr>
                  <td><strong>Top rate</strong></td>
                  <td>37% above {money2(single.brackets[6][0])} (single)</td>
                  <td>{PA_RATE}% on all taxable income</td>
                </tr>
                <tr>
                  <td><strong>Number of brackets</strong></td>
                  <td>Seven</td>
                  <td>One</td>
                </tr>
                <tr>
                  <td><strong>Filing status impact</strong></td>
                  <td>Major — changes brackets and standard deduction</td>
                  <td>Minimal — no bracket or deduction differences</td>
                </tr>
                <tr>
                  <td><strong>Low-income treatment</strong></td>
                  <td>Zero tax below standard deduction</td>
                  <td>Tax starts from first dollar of income</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Why Federal Tax Is Usually Much Higher</h3>
          <p>
            For most Pennsylvania taxpayers, the federal income tax bill is substantially larger
            than the state tax bill. There are two main reasons. First, federal rates are much
            higher — even the bottom federal bracket of 10% is more than triple Pennsylvania's{" "}
            {PA_RATE}% rate, and the top federal rate of 37% is more than twelve times higher.
            Second, while the federal system has a large standard deduction that shelters the
            first portion of income, the rates above that deduction are significantly higher.
          </p>
          <p>
            At $50,000 of income for a single filer, federal tax is roughly three to four times
            the Pennsylvania tax. At higher incomes, the gap widens further as federal rates climb
            into the 22%, 24%, and 32% brackets while Pennsylvania stays firmly at {PA_RATE}%.
            The exception is at very low incomes, where the federal standard deduction can reduce
            federal tax to zero while Pennsylvania still collects {PA_RATE}% on all taxable
            income.
          </p>

          <h3>What Filing Status Means in Each System</h3>
          <p>
            Filing status is enormously important for federal tax because it changes both the
            standard deduction and every bracket threshold. Married filing jointly gets roughly
            double the brackets and double the standard deduction of single, and head of household
            gets something in between. Your filing status can change your federal tax by thousands
            of dollars.
          </p>
          <p>
            In Pennsylvania, filing status has very little impact on your state income tax. There
            are no separate bracket structures for different filing statuses, and there is no
            standard deduction that varies by status. The flat {PA_RATE}% rate applies the same
            way regardless of whether you file single, married filing jointly, or head of
            household. Some credits may vary by filing status, but the core tax calculation is
            the same for everyone.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TAXABLE INCOME</p>
        <h2>What Counts as Taxable Income in PA?</h2>
        <section>
          <p>
            Pennsylvania divides income into eight separate classes, each with its own rules about
            what is included and what deductions are allowed. Understanding what counts as
            taxable income in Pennsylvania helps you plan and avoid surprises at tax time.
          </p>

          <h3>What Is Taxable in Pennsylvania</h3>
          <p>
            The following types of income are generally taxable in Pennsylvania at the {PA_RATE}%
            flat rate:
          </p>
          <ul className="checklist">
            <li>Wages, salaries, tips, bonuses, and commissions</li>
            <li>Interest income from savings accounts, CDs, and bonds</li>
            <li>Dividend income from stocks and mutual funds</li>
            <li>Net profits from business, profession, or farming</li>
            <li>Net gains from the sale of real estate, stocks, and other property</li>
            <li>Rental income from real estate and royalty income</li>
            <li>Income passed through from estates and trusts</li>
            <li>Gambling winnings, lottery prizes, and raffle winnings</li>
            <li>Unemployment compensation</li>
          </ul>

          <h3>What Is Not Taxable in Pennsylvania</h3>
          <p>
            Pennsylvania exempts several important types of income from state tax, including:
          </p>
          <ul className="checklist">
            <li>Social Security and Railroad Retirement benefits</li>
            <li>Distributions from qualified retirement plans (401k, IRA, pension)</li>
            <li>Public assistance and welfare payments</li>
            <li>Workers' compensation benefits</li>
            <li>Life insurance proceeds paid by reason of death</li>
            <li>Gifts and inheritances</li>
            <li>Interest on direct obligations of the U.S. government</li>
            <li>Certain scholarships and fellowship grants</li>
            <li>Child support payments received</li>
          </ul>

          <h3>How PA Taxable Income Differs from Federal AGI</h3>
          <p>
            Pennsylvania taxable income is not the same as federal adjusted gross income (AGI).
            The two systems define income differently, allow different deductions, and treat many
            items differently. For example, Social Security is taxable at the federal level for
            many retirees but fully exempt in Pennsylvania. On the other hand, Pennsylvania does
            not allow a standard deduction, while the federal system has a very generous one.
          </p>
          <p>
            The PA-40 return starts with federal income and then applies Pennsylvania-specific
            additions and subtractions to arrive at PA taxable income. Common additions include
            interest from out-of-state municipal bonds and state tax refunds. Common subtractions
            include Social Security benefits, retirement income, and interest on U.S. government
            obligations. Our calculator uses a simplified model based on the flat {PA_RATE}% rate
            applied to your income.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FILING REQUIREMENTS</p>
        <h2>Who Has to File a PA Tax Return?</h2>
        <section>
          <p>
            Whether you need to file a Pennsylvania Form PA-40 depends on your residency status,
            your income, and whether you had Pennsylvania tax withheld. Pennsylvania's filing
            requirements are generally simpler than the federal rules because of the flat rate
            structure.
          </p>

          <h3>Pennsylvania Residents</h3>
          <p>
            If you were a Pennsylvania resident for the full year, you generally must file a
            PA-40 if:
          </p>
          <ul className="checklist">
            <li>You had Pennsylvania taxable income of $33 or more during the year</li>
            <li>You had Pennsylvania income tax withheld from your pay and want a refund</li>
            <li>You qualify for refundable credits like the PA Earned Income Tax Credit</li>
            <li>You had Pennsylvania estimated tax payments or overpayment credits applied from last year</li>
            <li>You are a part-year resident with PA-source income</li>
          </ul>
          <p>
            Even if you are not technically required to file, it is usually a good idea to file
            if you had any Pennsylvania tax withheld or if you might qualify for refundable
            credits. You cannot get a refund of withheld tax without filing a return.
          </p>

          <h3>Part-Year Residents and Nonresidents</h3>
          <p>
            If you moved into or out of Pennsylvania during the year, you file as a part-year
            resident using Form PA-40. You pay Pennsylvania tax on income you earned while you
            were a resident, plus any income from Pennsylvania sources while you were a
            nonresident.
          </p>
          <p>
            If you were never a Pennsylvania resident but earned income from Pennsylvania sources
            — for example, if you worked in Pennsylvania but lived in another state — you may
            need to file Form PA-40 as a nonresident. Common Pennsylvania-source income includes
            wages earned in Pennsylvania, rental income from Pennsylvania property, and business
            income from Pennsylvania operations.
          </p>

          <h3>When Filing Is Optional</h3>
          <p>
            If your Pennsylvania taxable income is below $33 and you had no Pennsylvania tax
            withheld, you generally do not need to file a PA-40. However, there is no penalty for
            filing a return when you do not have to, and filing is the only way to claim a refund
            of any tax that was withheld on your behalf.
          </p>
          <p>
            If you are unsure whether you should file, the safest approach is to file anyway —
            especially if you had any withholding or estimated payments. You will get any
            overpayment back as a refund, and you will be in compliance with Pennsylvania
            Department of Revenue requirements.
          </p>

          <h3>Important Deadlines</h3>
          <p>
            The Pennsylvania individual income tax return is due on the same day as the federal
            return — typically April 15 of the following year, or the next business day if April
            15 falls on a weekend or holiday. If you file for a federal extension, your
            Pennsylvania filing deadline is automatically extended as well, but you still need to
            pay any tax you owe by the original deadline to avoid interest and penalties.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>
          FREQUENTLY ASKED QUESTIONS
        </p>
        <h2>Pennsylvania Income Tax FAQ</h2>
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
            ({capitalGains.source.sections}). Pennsylvania figures use the {PA_RATE}% flat rate,
            consistent with the Form PA-40 instructions and the Pennsylvania Department of
            Revenue withholding guidance.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice or a substitute
            for professional tax preparation or filing software. The calculator estimates federal
            and Pennsylvania income tax using simplified inputs and does not account for itemized
            deductions, tax credits, capital gains, retirement contributions, self-employment
            taxes, or Pennsylvania-specific additions and subtractions to federal AGI. Consult a
            tax professional for advice tailored to your specific situation.
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
            <a href="/illinois-income-tax-calculator">
              <b>Illinois Income Tax Calculator</b>
              <span>IL flat rate estimator →</span>
            </a>
            <a href="/federal-income-tax-calculator">
              <b>Federal Income Tax Calculator</b>
              <span>FIT tax meaning and rates →</span>
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
