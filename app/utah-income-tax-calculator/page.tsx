import type { Metadata } from "next";
import StateIncomeTaxCalculator from "../components/StateIncomeTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";
import {
  UT_RATE as UT_RATE_FRACTION,
  UT_CREDIT_RATE,
  UT_PHASEOUT_RATE as UT_PHASEOUT_FRACTION,
  UT_PERSONAL_EXEMPTION,
  utPhaseOutBase,
} from "../lib/stateIncomeTax";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/utah-income-tax-calculator";
const TITLE = "Utah Income Tax Calculator 2026 — 4.45% Flat Rate";
const DESCRIPTION =
  "Free Utah income tax calculator for 2026. UT has a flat 4.45% rate with a non-refundable tax credit. Estimate your federal and Utah state income tax.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/utah-income-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

/**
 * All Utah figures come from the calculator library, which implements the
 * Form TC-40 taxpayer tax credit: 6% of (Utah personal exemptions + the federal
 * standard deduction), phased out by 1.3% of income above a base amount.
 * The "base credit" quoted below is therefore the credit for a filer with no
 * dependents; each dependent adds 6% × $2,111 to it.
 */
const UT_RATE = UT_RATE_FRACTION * 100;
const UT_CREDIT_SINGLE = single.standardDeduction * UT_CREDIT_RATE;
const UT_CREDIT_MARRIED = married.standardDeduction * UT_CREDIT_RATE;
const UT_THRESHOLD_SINGLE = utPhaseOutBase.single;
const UT_THRESHOLD_MARRIED = utPhaseOutBase.married;
const UT_PHASEOUT_RATE = UT_PHASEOUT_FRACTION * 100;
const UT_CREDIT_PER_DEPENDENT = UT_PERSONAL_EXEMPTION * UT_CREDIT_RATE;

const faqs = [
  {
    q: "What is the Utah income tax rate for 2026?",
    a: `For ${YEAR}, Utah has a flat individual income tax rate of ${UT_RATE}%. The rate was set by S.B. 60 and is retroactive to January 1, 2026, replacing the 4.50% rate that was in effect for 2025. The flat rate applies to all Utah taxable income, but the actual tax you pay is reduced by a non-refundable taxpayer tax credit that phases out as income rises. This means the effective rate increases gradually from zero at very low incomes to the full ${UT_RATE}% at higher income levels. The rate reduction is part of a series of tax cuts enacted by the Utah Legislature in recent years.`,
  },
  {
    q: "Is Utah a flat tax state?",
    a: `Yes, Utah is a flat tax state with a single rate of ${UT_RATE}% for ${YEAR}. However, the flat rate is paired with a non-refundable taxpayer tax credit that makes the system slightly progressive at lower income levels. The credit — ${money2(UT_CREDIT_SINGLE)} for a single filer with no dependents, ${money2(UT_CREDIT_MARRIED)} for a joint filer, plus ${money2(UT_CREDIT_PER_DEPENDENT)} per dependent — reduces your tax dollar for dollar but phases out as income rises above a base amount. This means lower-income households pay a lower effective rate (or no tax at all), while higher-income households pay closer to the full ${UT_RATE}% flat rate.`,
  },
  {
    q: "How much is Utah income tax on $60,000?",
    a: `For a single filer earning $60,000 with no dependents, the Utah income tax is calculated by first applying the flat ${UT_RATE}% rate to get the gross tax, then subtracting the taxpayer credit after phase-out. The gross tax is $${(60000 * UT_RATE / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. The $${UT_CREDIT_SINGLE.toLocaleString()} base credit phases out by 1.3% of income above $${UT_THRESHOLD_SINGLE.toLocaleString()}, so the actual credit is reduced to about $${(UT_CREDIT_SINGLE - 0.013 * (60000 - UT_THRESHOLD_SINGLE)).toFixed(2)} (but not below zero). The net Utah tax is approximately $${(60000 * UT_RATE / 100 - Math.max(0, UT_CREDIT_SINGLE - 0.013 * (60000 - UT_THRESHOLD_SINGLE))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Use the calculator above to enter your exact filing situation.`,
  },
  {
    q: "What is the Utah taxpayer tax credit?",
    a: `The Utah taxpayer tax credit is a non-refundable credit that reduces your Utah income tax dollar for dollar. On Form TC-40 it equals 6% of your Utah personal exemptions plus your federal standard (or itemized) deduction. For ${YEAR} that works out to ${money2(UT_CREDIT_SINGLE)} for a single filer with no dependents and ${money2(UT_CREDIT_MARRIED)} for a joint filer, plus ${money2(UT_CREDIT_PER_DEPENDENT)} for each dependent you claim (6% of the ${money2(UT_PERSONAL_EXEMPTION)} Utah personal exemption). The credit phases out at a rate of ${UT_PHASEOUT_RATE}% of income above the base amount of ${money2(UT_THRESHOLD_SINGLE)} for single filers and ${money2(UT_THRESHOLD_MARRIED)} for joint filers. This means the credit is gradually reduced as your income rises, and it is fully phased out at higher income levels. The credit is what gives Utah's flat tax system its mildly progressive character at lower incomes.`,
  },
  {
    q: "Does Utah have a standard deduction?",
    a: `No, Utah does not have a traditional standard deduction like the federal government and many other states. Instead, Utah uses a taxpayer tax credit system that reduces your tax liability directly. The taxpayer credit functions similarly to a deduction in that it reduces the amount of tax you pay, but it operates as a credit rather than a reduction of taxable income. Utah also allows itemized deductions for certain expenses, and you can choose between the standard state credit system or itemizing, depending on which benefits you more.`,
  },
  {
    q: "Who has to file a Utah state tax return?",
    a: `You generally must file a Utah Form TC-40 if you were a Utah resident for any part of the year and you are required to file a federal return, or if you had Utah income tax withheld and want a refund. Even if you are not required to file, you should file if you had Utah tax withheld or if you qualify for refundable credits like the Utah Earned Income Tax Credit. Nonresidents who earned income from Utah sources — including wages, business income, or rental income from Utah property — may also need to file a Utah TC-40.`,
  },
  {
    q: "How is Utah state income tax calculated?",
    a: `Utah state income tax starts with your federal adjusted gross income, then applies Utah-specific additions and subtractions to arrive at Utah taxable income. The flat ${UT_RATE}% rate is applied to calculate your gross tax. From there, you subtract the taxpayer tax credit (which is phased out at higher incomes) and any other credits you qualify for, such as dependent exemptions, the retirement income credit, and the earned income tax credit. The result is your net Utah income tax. Our calculator uses the simplified flat-rate formula with the taxpayer credit phase-out.`,
  },
  {
    q: "When did Utah change its tax rate?",
    a: `Utah has been gradually reducing its flat income tax rate over the past several years. The rate was historically higher but has been cut multiple times by the Utah Legislature. For ${YEAR}, the rate drops from 4.50% to ${UT_RATE}% under S.B. 60. Because the change is retroactive to January 1, 2026, the full ${YEAR} tax year is taxed at ${UT_RATE}% — there is no blended rate, though withholding tables were updated mid-year. The reductions have been driven by strong state revenue growth and a policy preference for lower taxes.`,
  },
];

export default function UtahIncomeTaxPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Utah Income Tax Calculator",
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
      { "@type": "ListItem", position: 3, name: "Utah Income Tax Calculator", item: CANONICAL },
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
        <span>Utah Income Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">UT STATE TAX · {YEAR}</div>
        <h1>
          Utah Income Tax Calculator <em>{YEAR}</em>
        </h1>
        <div className="hero-intro">
          <p>
            Estimate your total federal and Utah state income tax for {YEAR}. Enter your
            annual income and filing status to see how the federal progressive brackets and
            Utah&apos;s flat {UT_RATE}% rate — paired with the unique taxpayer tax credit —
            apply to your return. Utah&apos;s flat rate system with a phased-out credit means
            the effective rate starts low and gradually approaches {UT_RATE}% as income rises.
          </p>
        </div>
        <StateIncomeTaxCalculator stateAbbr="UT" />
        <div className="hero-more">
          <p>
            Federal rates come from {capitalGains.source.label}. Utah figures use the{" "}
            {UT_RATE}% flat rate with the Form TC-40 taxpayer tax credit — 6% of your Utah
            exemptions plus federal standard deduction ({money2(UT_CREDIT_SINGLE)} single /{" "}
            {money2(UT_CREDIT_MARRIED)} joint with no dependents, plus{" "}
            {money2(UT_CREDIT_PER_DEPENDENT)} per dependent) — and its phase-out, consistent with the
            Utah TC-40 formula.
          </p>
        </div>
        <div className="trust-row">
          <span>{YEAR} Rates</span>
          <span>UT Flat Rate</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How Utah Income Tax Works</h2>
        <section>
          <p>
            Utah has a flat income tax system with a single rate of <strong>{UT_RATE}%</strong>{" "}
            for {YEAR}. But unlike a pure flat tax where every dollar is taxed at the same
            effective rate, Utah&apos;s system includes a non-refundable taxpayer tax credit
            that makes it mildly progressive at lower income levels. The credit reduces your
            tax bill dollar for dollar but phases out as your income rises, meaning the
            effective rate gradually increases toward the statutory {UT_RATE}% rate.
          </p>

          <h3>The Flat Rate Structure</h3>
          <p>
            The Utah individual income tax rate is a flat <strong>{UT_RATE}%</strong> for{" "}
            {YEAR}. This rate is applied to all Utah taxable income regardless of how much you
            earn. S.B. 60 cut the rate from 4.50% to {UT_RATE}% retroactive to January 1,
            2026, so the whole {YEAR} tax year is taxed at {UT_RATE}% — there is no blended
            rate, even though the Tax Commission updated its withholding tables partway
            through the year.
          </p>
          <p>
            Utah&apos;s flat tax system has been in place for over a decade, replacing a
            previous graduated system. The rate has been gradually reduced in recent years as
            state revenues have grown, with the Utah Legislature approving multiple rounds of
            tax cuts. The shift to a flat rate was designed to simplify the tax system, make
            the state more competitive, and provide transparency for taxpayers.
          </p>

          <h3>The Taxpayer Tax Credit</h3>
          <p>
            What makes Utah&apos;s flat tax unique is the taxpayer tax credit — a
            non-refundable credit that reduces your tax bill directly. For {YEAR}, the base
            credit amounts are:
          </p>
          <ul className="checklist">
            <li><strong>Single filers:</strong> {money2(UT_CREDIT_SINGLE)} base credit (no dependents)</li>
            <li><strong>Married filing jointly:</strong> {money2(UT_CREDIT_MARRIED)} base credit (no dependents)</li>
            <li><strong>Each dependent:</strong> adds {money2(UT_CREDIT_PER_DEPENDENT)} to the credit</li>
            <li><strong>Phase-out threshold (single):</strong> {money2(UT_THRESHOLD_SINGLE)}</li>
            <li><strong>Phase-out threshold (married):</strong> {money2(UT_THRESHOLD_MARRIED)}</li>
            <li><strong>Phase-out rate:</strong> {UT_PHASEOUT_RATE}% of income above the threshold</li>
          </ul>
          <p>
            The credit phases out at a rate of {UT_PHASEOUT_RATE}% for every dollar of income
            above the threshold. This means that as your income increases, the credit is
            gradually reduced, and your effective tax rate gradually approaches the full{" "}
            {UT_RATE}% flat rate. At very low incomes, the credit can eliminate Utah tax
            entirely. At higher incomes, the credit is fully phased out and you pay the full
            {UT_RATE}% rate on all your income.
          </p>

          <h3>How the Calculation Works</h3>
          <p>
            Calculating your Utah income tax follows a four-step process. Start with your
            federal adjusted gross income, apply Utah-specific adjustments, apply the flat
            rate, and then subtract credits:
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
                  <td>Start with federal adjusted gross income (with Utah adjustments)</td>
                </tr>
                <tr>
                  <td><strong>2</strong></td>
                  <td>Multiply taxable income by {UT_RATE}% → gross tax</td>
                </tr>
                <tr>
                  <td><strong>3</strong></td>
                  <td>Calculate taxpayer credit (base credit minus phase-out)</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>4</strong></td>
                  <td><strong>Subtract credits from gross tax → Utah tax</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FLAT RATE + CREDIT</p>
        <h2>Utah&apos;s Flat Rate + Credit Structure</h2>
        <section>
          <p>
            Utah&apos;s income tax system is often described as a flat tax, but it is more
            accurately described as a flat rate with a refundable-like credit that creates a
            mildly progressive structure at lower income levels. The combination of the flat
            rate and the phased-out credit means that Utah&apos;s system behaves differently
            depending on your income level.
          </p>

          <h3>Why It Looks Flat but Feels Progressive</h3>
          <p>
            On paper, Utah has a single flat rate of {UT_RATE}%. But the taxpayer tax credit
            effectively creates a zero-tax bracket at the very bottom of the income scale and a
            gradually increasing effective rate as income rises. For a single filer earning
            less than about {money2(UT_THRESHOLD_SINGLE)}, the full {money2(UT_CREDIT_SINGLE)}{" "}
            credit can completely eliminate Utah tax liability on modest incomes. Above that
            threshold, the credit phases out and the effective rate gradually increases.
          </p>
          <p>
            This structure is sometimes called a &ldquo;flat tax with a zero bracket&rdquo; or
            a &ldquo;negative income tax&rdquo; system. It combines the simplicity of a flat
            rate with the progressive fairness of exempting low-income households from tax.
            Unlike a standard deduction approach (which reduces taxable income), Utah&apos;s
            credit system directly reduces the tax owed, which can be more targeted and
            transparent.
          </p>

          <h3>How the Phase-Out Works</h3>
          <p>
            The taxpayer credit phases out at a rate of {UT_PHASEOUT_RATE}% of income above
            the threshold. This means that for every dollar you earn above the threshold,
            your credit is reduced by 1.3 cents. The phase-out is gradual enough that it does
            not create a sharp cliff, but it does mean your effective marginal rate is
            slightly higher within the phase-out range than the statutory {UT_RATE}% rate.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Income Level (Single)</th>
                  <th>Taxpayer Credit</th>
                  <th>Effective UT Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{money2(UT_THRESHOLD_SINGLE)}</strong></td>
                  <td>{money2(UT_CREDIT_SINGLE)}</td>
                  <td>Very low (credit offsets most tax)</td>
                </tr>
                <tr>
                  <td><strong>$30,000</strong></td>
                  <td>{money2(UT_CREDIT_SINGLE - 0.013 * (30000 - UT_THRESHOLD_SINGLE))}</td>
                  <td>{((30000 * UT_RATE / 100 - Math.max(0, UT_CREDIT_SINGLE - 0.013 * (30000 - UT_THRESHOLD_SINGLE))) / 30000 * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td><strong>$60,000</strong></td>
                  <td>{money2(Math.max(0, UT_CREDIT_SINGLE - 0.013 * (60000 - UT_THRESHOLD_SINGLE)))}</td>
                  <td>{((60000 * UT_RATE / 100 - Math.max(0, UT_CREDIT_SINGLE - 0.013 * (60000 - UT_THRESHOLD_SINGLE))) / 60000 * 100).toFixed(2)}%</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>$100,000+</strong></td>
                  <td>$0.00 (fully phased out)</td>
                  <td><strong>{UT_RATE}%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Single vs Married: How Filing Status Matters</h3>
          <p>
            Filing status affects your Utah tax primarily through the taxpayer credit.
            Married couples filing jointly receive double the base credit ({money2(UT_CREDIT_MARRIED)}{" "}
            vs. {money2(UT_CREDIT_SINGLE)}) and double the phase-out threshold ({money2(UT_THRESHOLD_MARRIED)}{" "}
            vs. {money2(UT_THRESHOLD_SINGLE)}). This means the credit structure is roughly
            proportional between single and joint filers, with no marriage penalty or bonus
            built into the credit system itself.
          </p>
          <p>
            Because the flat rate applies equally regardless of filing status, and the credit
            amounts and thresholds are doubled for joint filers, Utah&apos;s system is
            generally marriage-neutral. Two single earners each making $50,000 will pay
            roughly the same total Utah tax as a married couple with one earner making
            $100,000 — though the exact amounts differ slightly due to the phase-out
            structure.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">DEDUCTIONS &amp; CREDITS</p>
        <h2>Utah Tax Deductions and Credits</h2>
        <section>
          <p>
            While Utah&apos;s flat {UT_RATE}% rate gets most of the attention, the state
            offers a variety of deductions and credits that can significantly reduce your tax
            bill. Understanding these provisions helps you plan and make the most of Utah&apos;s
            tax system.
          </p>

          <h3>Taxpayer Tax Credit</h3>
          <p>
            The taxpayer tax credit is the foundational credit in Utah&apos;s system. It
            replaces what would be a standard deduction in other states. The base credit is{" "}
            {money2(UT_CREDIT_SINGLE)} for single filers and {money2(UT_CREDIT_MARRIED)} for
            married couples, and it phases out at {UT_PHASEOUT_RATE}% above the income
            threshold. This credit is automatically applied — you do not need to claim it
            separately.
          </p>

          <h3>Dependent Exemptions</h3>
          <p>
            Utah does not deduct a fixed amount per dependent from your taxable income.
            Instead, each qualifying dependent adds a {money2(UT_PERSONAL_EXEMPTION)} Utah
            personal exemption to the base your taxpayer tax credit is calculated from — and
            because that credit is 6% of the base, each dependent is worth{" "}
            {money2(UT_CREDIT_PER_DEPENDENT)} of extra credit before phase-out. Like the rest
            of the credit, it is reduced by {UT_PHASEOUT_RATE}% of income above the base
            phase-out amount, so it is worth less as income rises and nothing once the credit
            is fully phased out. You can generally claim the same dependents on your Utah
            return that you claim on your federal return.
          </p>

          <h3>Retirement Income Credit</h3>
          <p>
            Utah offers a retirement income credit for taxpayers who are 65 or older (or who
            are receiving retirement benefits due to disability). The credit is based on your
            retirement income and your overall income level, and it is designed to reduce the
            tax burden on retirees. Utah is generally considered tax-friendly for retirees,
            especially when combined with the relatively low flat rate.
          </p>

          <h3>Earned Income Tax Credit</h3>
          <p>
            Utah has its own Earned Income Tax Credit (EITC) that is tied to the federal EITC.
            The Utah EITC is a percentage of the federal credit and is designed to help
            low- to moderate-income working households. Like the federal EITC, the Utah
            version is refundable in some cases, meaning it can reduce your tax below zero and
            generate a refund. This credit is one of the most important anti-poverty tools in
            the Utah tax code.
          </p>
          <ul className="checklist">
            <li><strong>Taxpayer credit:</strong> {money2(UT_CREDIT_SINGLE)} single / {money2(UT_CREDIT_MARRIED)} joint (base amount)</li>
            <li><strong>Dependent exemptions:</strong> Credit per qualifying dependent</li>
            <li><strong>Retirement income credit:</strong> Available to taxpayers 65+</li>
            <li><strong>Earned income tax credit:</strong> Tied to federal EITC</li>
            <li><strong>Itemized deductions:</strong> Optional alternative to standard credit</li>
          </ul>

          <h3>Itemized Deductions Option</h3>
          <p>
            In addition to the standard taxpayer credit system, Utah allows taxpayers to
            itemize deductions if it results in a lower tax bill. Itemizable expenses include
            things like mortgage interest, charitable contributions, and certain medical
            expenses. However, because Utah&apos;s system is based on a flat rate with a
            credit, the itemized deduction calculation works differently than the federal
            itemized deduction system. Most taxpayers are better off with the standard
            taxpayer credit approach.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FILING REQUIREMENTS</p>
        <h2>Who Has to File a Utah Tax Return?</h2>
        <section>
          <p>
            Whether you need to file a Utah Form TC-40 depends on your residency status, your
            income level, your filing status, and whether you had Utah tax withheld. Utah&apos;s
            filing requirements are generally tied to the federal filing thresholds, but there
            are some important differences.
          </p>

          <h3>Utah Residents</h3>
          <p>
            If you were a Utah resident for the full year, you generally must file a Utah
            TC-40 if:
          </p>
          <ul className="checklist">
            <li>You are required to file a federal income tax return</li>
            <li>You had Utah income tax withheld from your pay and want a refund</li>
            <li>You qualify for refundable credits like the Utah Earned Income Tax Credit</li>
            <li>You had Utah estimated tax payments or overpayment credits applied from last year</li>
            <li>You have income from Utah sources but are claimed as a dependent on someone else&apos;s return</li>
          </ul>
          <p>
            Even if you are not technically required to file, it is usually a good idea to
            file if you had any Utah tax withheld or if you might qualify for refundable
            credits. You cannot get a refund without filing a return, and filing ensures you
            are in compliance with the Utah State Tax Commission.
          </p>

          <h3>Part-Year Residents and Nonresidents</h3>
          <p>
            If you moved into or out of Utah during the year, you file as a part-year
            resident using Form TC-40. You pay Utah tax on income you earned while you were a
            resident, plus any income from Utah sources while you were a nonresident. You
            will need to allocate your income between the resident and nonresident portions of
            the year.
          </p>
          <p>
            If you were never a Utah resident but earned income from Utah sources — for
            example, if you worked in Utah but lived in another state — you may need to file
            Form TC-40 as a nonresident. Common Utah-source income includes wages earned in
            Utah, rental income from Utah property, business income from Utah operations, and
            income from a Utah business or partnership.
          </p>

          <h3>Filing Thresholds</h3>
          <p>
            Because Utah uses a credit-based system rather than a standard deduction, you
            generally do not need to file a Utah return if your income is very low and you
            have no other filing requirement. However, if you had any Utah tax withheld, you
            should file anyway to claim a refund — you may be entitled to get back all of the
            tax that was withheld, plus any refundable credits.
          </p>
          <p>
            The general rule is that if you are required to file a federal return, you should
            also file a Utah return. Utah&apos;s filing thresholds are generally similar to the
            federal standard deduction amounts, but there can be differences, especially for
            dependents and for taxpayers with special types of income.
          </p>

          <h3>Important Deadlines</h3>
          <p>
            The Utah individual income tax return is due on the same day as the federal return
            — typically April 15 of the following year, or the next business day if April 15
            falls on a weekend or holiday. If you file for a federal extension, your Utah
            filing deadline is automatically extended as well, but you still need to pay any
            tax you owe by the original deadline to avoid interest and penalties.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARISON</p>
        <h2>Utah vs Federal: Key Differences</h2>
        <section>
          <p>
            While both Utah and the federal government collect income tax, they operate on
            fundamentally different principles. Utah uses a single flat rate with a taxpayer
            credit, while the federal government uses seven progressive brackets with a large
            standard deduction and numerous credits. Understanding these differences helps you
            plan for your total tax bill.
          </p>

          <h3>Flat Credit-Based vs Progressive Brackets</h3>
          <p>
            The biggest difference is the rate structure. Utah has a <strong>single flat rate
            of {UT_RATE}%</strong> that applies to all taxable income, paired with a taxpayer
            credit that phases out at higher incomes. Once the credit is fully phased out,
            every additional dollar is taxed at exactly {UT_RATE}%. There are no bracket
            thresholds to cross and no marginal rate increases beyond that point.
          </p>
          <p>
            The federal system uses <strong>seven progressive tax brackets</strong> for {YEAR},
            ranging from 10% at the bottom to 37% at the top. As your income rises, each
            additional dollar is taxed at a higher marginal rate. Your effective rate — total
            tax divided by total income — is always lower than your top bracket because only
            the income within each bracket is taxed at that bracket&apos;s rate.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Federal Income Tax</th>
                  <th>Utah Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rate structure</strong></td>
                  <td>Progressive — 7 brackets, 10% to 37%</td>
                  <td>Flat — single rate of {UT_RATE}% with phased credit</td>
                </tr>
                <tr>
                  <td><strong>Standard deduction</strong></td>
                  <td>Yes — {money2(single.standardDeduction)} single, {money2(married.standardDeduction)} joint</td>
                  <td>None — uses taxpayer credit instead</td>
                </tr>
                <tr>
                  <td><strong>Personal exemptions</strong></td>
                  <td>Suspended through 2025 (part of TCJA)</td>
                  <td>Taxpayer credit ({money2(UT_CREDIT_SINGLE)} single base)</td>
                </tr>
                <tr>
                  <td><strong>Top rate</strong></td>
                  <td>37% above {money2(single.brackets[6][0])} (single)</td>
                  <td>{UT_RATE}% on all taxable income (credit phased out)</td>
                </tr>
                <tr>
                  <td><strong>Number of brackets</strong></td>
                  <td>Seven</td>
                  <td>One (flat rate with credit phase-out)</td>
                </tr>
                <tr>
                  <td><strong>Dependent treatment</strong></td>
                  <td>Child Tax Credit (refundable, up to $2,000 per child)</td>
                  <td>{money2(UT_PERSONAL_EXEMPTION)} personal exemption per dependent, which adds {money2(UT_CREDIT_PER_DEPENDENT)} to the taxpayer credit</td>
                </tr>
                <tr>
                  <td><strong>Lowest effective rate</strong></td>
                  <td>0% below standard deduction</td>
                  <td>0% when credit exceeds gross tax</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Why Your Federal Bill Is Usually Higher</h3>
          <p>
            For most Utah taxpayers, the federal income tax bill is substantially larger than
            the state tax bill. Federal rates are much higher across the board — even the 10%
            bottom federal bracket is more than double Utah&apos;s {UT_RATE}% flat rate, and
            the top federal rate of 37% is more than eight times higher. The federal standard
            deduction is also significantly larger than Utah&apos;s taxpayer credit equivalent,
            but the rates above that deduction are much higher.
          </p>
          <p>
            At $60,000 of income for a single filer, federal tax is roughly three to four
            times the Utah tax. At higher incomes, the gap widens further as federal rates
            climb into the 22%, 24%, and 32% brackets while Utah stays at {UT_RATE}%. At very
            high incomes, the federal tax can be five to eight times larger than the Utah
            state tax, making Utah one of the more tax-friendly states for high earners.
          </p>

          <h3>Credit vs Deduction Approaches</h3>
          <p>
            One of the most interesting differences is how the two systems shelter low-income
            households from tax. The federal system uses a standard deduction — it reduces
            taxable income, which means the value of the deduction depends on your marginal
            tax rate. Utah uses a taxpayer credit — it directly reduces your tax bill by a
            fixed amount, which means the value is the same regardless of your rate (until the
            phase-out kicks in).
          </p>
          <p>
            Both approaches result in zero or very low tax for low-income households, but they
            work differently. The federal standard deduction is worth more to higher-bracket
            taxpayers because it is deducted from income taxed at their marginal rate. Utah&apos;s
            taxpayer credit, by contrast, is worth the same dollar amount to everyone within
            the phase-in range, but then it phases out at higher incomes. Which system is
            better depends on your income level and your perspective on tax fairness.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>
          FREQUENTLY ASKED QUESTIONS
        </p>
        <h2>Utah Income Tax FAQ</h2>
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
            ({capitalGains.source.sections}). Utah figures use the {UT_RATE}% flat rate with
            the taxpayer tax credit ({money2(UT_CREDIT_SINGLE)} single / {money2(UT_CREDIT_MARRIED)}{" "}
            joint base) and {UT_PHASEOUT_RATE}% phase-out rate, consistent with the Form TC-40
            instructions and the Utah State Tax Commission guidance.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice or a substitute
            for professional tax preparation or filing software. The calculator estimates federal
            and Utah income tax using simplified inputs and does not account for itemized
            deductions, tax credits beyond the taxpayer credit, capital gains, retirement
            contributions, self-employment taxes, or Utah-specific additions and subtractions to
            federal AGI. Consult a tax professional for advice tailored to your specific
            situation.
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
            <a href="/georgia-income-tax-calculator">
              <b>Georgia Income Tax Calculator</b>
              <span>GA flat rate estimator →</span>
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
