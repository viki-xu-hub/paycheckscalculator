import type { Metadata } from "next";
import StateIncomeTaxCalculator from "../components/StateIncomeTaxCalculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { capitalGains, money2, statusByKey } from "../lib/qualifiedDividends";
import {
  connecticutRows,
  ctProgressiveTax,
  ctExemptionMax,
  ctExemptionPhaseStart,
  ctExemptionFor,
  type CtScheduleKey,
} from "../lib/stateIncomeTax";

const YEAR = String(capitalGains.year);
const CANONICAL = "https://www.paycheckscalculator.org/connecticut-income-tax-calculator";
const TITLE = "Connecticut Income Tax Calculator 2026 — CT Tax Brackets";
const DESCRIPTION =
  "Free Connecticut income tax calculator for 2026. CT has graduated rates from 2% to 6.99%. Estimate your federal and CT state income tax based on income and filing status.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/connecticut-income-tax-calculator" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const single = statusByKey.single;
const married = statusByKey.married;

const CT_PERSONAL_EXEMPTION_SINGLE = ctExemptionMax.single;
const CT_PERSONAL_EXEMPTION_JOINT = ctExemptionMax.married;
const CT_PERSONAL_EXEMPTION_HOH = ctExemptionMax.head;
const CT_PERSONAL_EXEMPTION_MFS = ctExemptionMax.separate;
/** CT AGI at which the exemption starts shrinking, and where it hits zero. */
const CT_PHASE_START_SINGLE = ctExemptionPhaseStart.single;
const CT_PHASE_END_SINGLE = CT_PHASE_START_SINGLE + CT_PERSONAL_EXEMPTION_SINGLE - 1000;
const CT_PHASE_START_JOINT = ctExemptionPhaseStart.married;
const CT_PHASE_END_JOINT = CT_PHASE_START_JOINT + CT_PERSONAL_EXEMPTION_JOINT - 1000;

/**
 * Bracket tables below are derived from the same schedule the calculator uses
 * (app/lib/stateIncomeTax.ts) so the published rates and the computed result
 * cannot drift apart.
 */
type BracketRow = { from: number; to: number; rate: number };

function bracketRows(schedule: CtScheduleKey): BracketRow[] {
  let from = 0;
  return connecticutRows[schedule].map(([to, rate]) => {
    const row = { from, to, rate: rate * 100 };
    from = to;
    return row;
  });
}

const rangeLabel = (r: BracketRow) =>
  r.to === Infinity
    ? `${money2(r.from + 1).replace(".00", "")} and above`
    : `${money2(r.from === 0 ? 0 : r.from + 1).replace(".00", "")} – ${money2(r.to).replace(".00", "")}`;

const CT_BRACKET_COUNT = connecticutRows.single.length;
const CT_TOP_RATE = connecticutRows.single[CT_BRACKET_COUNT - 1][1] * 100;
const CT_TOP_THRESHOLD_SINGLE = connecticutRows.single[CT_BRACKET_COUNT - 2][0];
const CT_TOP_THRESHOLD_JOINT = connecticutRows.married[CT_BRACKET_COUNT - 2][0];

/** Worked example used in the FAQ and the body — computed, never hand-typed. */
const CT_EXAMPLE_INCOME = 75000;
/** At $75,000 the Table A exemption has fully phased out — use the real value, not the max. */
const CT_EXAMPLE_EXEMPTION = ctExemptionFor(CT_EXAMPLE_INCOME, "single");
const CT_EXAMPLE_TAXABLE = CT_EXAMPLE_INCOME - CT_EXAMPLE_EXEMPTION;
const CT_EXAMPLE_TAX = ctProgressiveTax(CT_EXAMPLE_TAXABLE, "single");
const CT_EXAMPLE_EFFECTIVE = (CT_EXAMPLE_TAX / CT_EXAMPLE_INCOME) * 100;

/** Narrate the example bracket by bracket, straight from the schedule. */
const CT_EXAMPLE_STEPS = bracketRows("single")
  .filter((r) => CT_EXAMPLE_TAXABLE > r.from)
  .map((r) => {
    const slice = Math.min(CT_EXAMPLE_TAXABLE, r.to) - r.from;
    return `${r.rate}% on ${money2(slice).replace(".00", "")}`;
  })
  .join(", ");

const faqs = [
  {
    q: "What are Connecticut income tax brackets for 2026?",
    a: `Connecticut has a progressive income tax system with ${CT_BRACKET_COUNT} brackets for ${YEAR}. For single filers and married filing separately, the rates are ${bracketRows("single").map((r) => `${r.rate}% ${r.to === Infinity ? `above ${money2(r.from).replace(".00", "")}` : `up to ${money2(r.to).replace(".00", "")}`}`).join(", ")}. Married filing jointly brackets are exactly double the single amounts: ${bracketRows("married").map((r) => `${r.rate}% ${r.to === Infinity ? `above ${money2(r.from).replace(".00", "")}` : `up to ${money2(r.to).replace(".00", "")}`}`).join(", ")}. Head of household filers use a third schedule that sits between the two. The personal exemption is ${money2(CT_PERSONAL_EXEMPTION_SINGLE)} for single filers and ${money2(CT_PERSONAL_EXEMPTION_JOINT)} for joint filers, though it phases out at higher income levels.`,
  },
  {
    q: "What is the CT income tax rate?",
    a: `Connecticut's income tax rates range from 2% to ${CT_TOP_RATE}% depending on your income level and filing status. The state uses a progressive system with ${CT_BRACKET_COUNT} tax brackets, so your effective rate is lower than your top marginal rate. Most Connecticut taxpayers fall into the 4.5% to 6% brackets. The top rate of ${CT_TOP_RATE}% applies to single filers with Connecticut taxable income above ${money2(CT_TOP_THRESHOLD_SINGLE).replace(".00", "")} and married couples above ${money2(CT_TOP_THRESHOLD_JOINT).replace(".00", "")}. Connecticut also has a personal exemption of ${money2(CT_PERSONAL_EXEMPTION_SINGLE)} for singles and ${money2(CT_PERSONAL_EXEMPTION_JOINT)} for joint filers, which reduces your taxable income before the bracket rates are applied.`,
  },
  {
    q: "How much is CT income tax on $75,000?",
    a: `For a single filer earning ${money2(CT_EXAMPLE_INCOME).replace(".00", "")} with no dependents, the Connecticut personal exemption has already fully phased out at that income (it reaches zero at ${money2(CT_PHASE_END_SINGLE).replace(".00", "")} of CT AGI), so Connecticut taxable income is the full ${money2(CT_EXAMPLE_TAXABLE).replace(".00", "")}. Using the progressive bracket system, the tax is calculated as ${CT_EXAMPLE_STEPS}. The total Connecticut income tax comes to ${money2(CT_EXAMPLE_TAX)}, for an effective state tax rate of about ${CT_EXAMPLE_EFFECTIVE.toFixed(2)}%. Use the calculator above to enter your exact filing situation and see a precise estimate.`,
  },
  {
    q: "Does CT have a standard deduction?",
    a: `Connecticut does not have a traditional standard deduction like the federal government or many other states. Instead, Connecticut offers a personal exemption that reduces your taxable income. For ${YEAR}, Form CT-1040 TCS Table A sets the maximum personal exemption at ${money2(CT_PERSONAL_EXEMPTION_SINGLE)} for single filers, ${money2(CT_PERSONAL_EXEMPTION_HOH)} for head of household, ${money2(CT_PERSONAL_EXEMPTION_MFS)} for married filing separately, and ${money2(CT_PERSONAL_EXEMPTION_JOINT)} for married filing jointly. The exemption phases out quickly: it drops by $1,000 for every $1,000 of Connecticut AGI above ${money2(CT_PHASE_START_SINGLE).replace(".00", "")} for single filers, reaching zero at ${money2(CT_PHASE_END_SINGLE).replace(".00", "")}. For joint filers the phase-out runs from ${money2(CT_PHASE_START_JOINT).replace(".00", "")} to ${money2(CT_PHASE_END_JOINT).replace(".00", "")}. Most middle-income Connecticut filers therefore get no personal exemption at all. This phase-out is one of the reasons Connecticut's tax system is considered more complex than most states.`,
  },
  {
    q: "What is the top tax rate in Connecticut?",
    a: `The top marginal income tax rate in Connecticut is ${CT_TOP_RATE}%. This rate applies to single filers with Connecticut taxable income above ${money2(CT_TOP_THRESHOLD_SINGLE).replace(".00", "")} and married couples filing jointly above ${money2(CT_TOP_THRESHOLD_JOINT).replace(".00", "")}. Connecticut's top rate is one of the highest in the Northeast and ranks among the top 10 highest state income tax rates in the country. However, because of the progressive bracket structure and the personal exemption, the effective tax rate for most Connecticut residents is significantly lower than 6.99%. It is also important to note that Connecticut has additional tax complexity through the phase-out of personal exemptions and credits at higher income levels, which effectively creates even higher marginal rates for some taxpayers in the phase-out ranges.`,
  },
  {
    q: "Who has to file a CT state tax return?",
    a: `You generally must file a Connecticut Form CT-1040 if you were a Connecticut resident for any part of the year and you meet certain income thresholds. For full-year residents, you must file if your Connecticut gross income exceeds the personal exemption amount for your filing status, or if you had Connecticut income tax withheld and want a refund. Nonresidents who earned income from Connecticut sources — including wages, business income, or rental income from Connecticut property — must file if their Connecticut gross income exceeds the filing threshold. Part-year residents must also file a return. Even if you are not required to file, you should file if you had Connecticut tax withheld or if you qualify for refundable credits like the Connecticut Earned Income Tax Credit.`,
  },
  {
    q: "How is CT income tax calculated?",
    a: `Connecticut income tax is calculated using a progressive ${CT_BRACKET_COUNT}-bracket system. The process starts with your federal adjusted gross income, which is then adjusted for Connecticut-specific additions and subtractions to arrive at Connecticut AGI. Next, you subtract your personal exemption (if your income is below the phase-out threshold) to get Connecticut taxable income. The tax is then computed by applying each bracket's rate to the portion of income that falls within that bracket. After calculating the gross tax, you may subtract any tax credits you qualify for, such as the property tax credit or the earned income tax credit. Connecticut's system also includes various phase-outs of exemptions and credits at higher income levels, which adds complexity and can create effective marginal rates that are higher than the stated bracket rates.`,
  },
  {
    q: "Is Connecticut a high-tax state?",
    a: `Yes, Connecticut is generally considered a high-tax state. Its top income tax rate of 6.99% is above the national average for states with an income tax. When combined with the state's high property taxes and sales tax, Connecticut consistently ranks among the states with the highest overall tax burdens. According to various studies, Connecticut's total state and local tax burden as a percentage of income is typically in the top 10 highest in the nation. The state also has a relatively complex tax code with numerous phase-outs and add-backs that can increase the effective tax rate for many taxpayers. However, it is worth noting that Connecticut does not tax Social Security benefits for most retirees, and it offers various credits that can reduce the tax burden for lower- and middle-income households.`,
  },
];

/** Renders one of Connecticut's three published schedules straight from the shared data. */
function CtBracketTable({ schedule }: { schedule: CtScheduleKey }) {
  const rows = bracketRows(schedule);
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Bracket</th>
            <th>Tax Rate</th>
            <th>Connecticut Taxable Income</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const last = i === rows.length - 1;
            return (
              <tr key={r.from} className={last ? "rate-total" : undefined}>
                <td><strong>{i + 1}</strong></td>
                <td>{last ? <strong>{r.rate}%</strong> : `${r.rate}%`}</td>
                <td>{last ? <strong>{rangeLabel(r)}</strong> : rangeLabel(r)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Bracket-by-bracket walkthrough for a given CT taxable income, computed from the schedule. */
function CtWorkedExample({ taxable }: { taxable: number }) {
  const used = bracketRows("single").filter((r) => taxable > r.from);
  const total = ctProgressiveTax(taxable, "single");
  const ordinals = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"];
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Bracket</th>
            <th>Rate</th>
            <th>Income in Bracket</th>
            <th>Tax in Bracket</th>
          </tr>
        </thead>
        <tbody>
          {used.map((r, i) => {
            const slice = Math.min(taxable, r.to) - r.from;
            return (
              <tr key={r.from}>
                <td>{ordinals[i]} bracket</td>
                <td>{r.rate}%</td>
                <td>{money2(slice)}</td>
                <td>{money2((slice * r.rate) / 100)}</td>
              </tr>
            );
          })}
          <tr className="rate-total">
            <td><strong>Total</strong></td>
            <td><strong>~{((total / taxable) * 100).toFixed(1)}% effective</strong></td>
            <td><strong>{money2(taxable)}</strong></td>
            <td><strong>{money2(total)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function ConnecticutIncomeTaxPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Connecticut Income Tax Calculator",
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
      { "@type": "ListItem", position: 3, name: "Connecticut Income Tax Calculator", item: CANONICAL },
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
        <span>Connecticut Income Tax Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">CT STATE TAX · {YEAR}</div>
        <h1>
          Connecticut Income Tax Calculator <em>{YEAR}</em>
        </h1>
        <div className="hero-intro">
          <p>
            Estimate your total federal and Connecticut state income tax for {YEAR}. Enter your
            annual income and filing status to see how the federal progressive brackets and
            Connecticut&apos;s graduated rate system — with rates from 2% to 6.99% — apply to
            your return. Connecticut is known for having one of the more complex state tax
            codes, with multiple brackets, personal exemption phase-outs, and a variety of
            credits that affect your final bill.
          </p>
        </div>
        <StateIncomeTaxCalculator stateAbbr="CT" />
        <div className="hero-more">
          <p>
            Federal rates come from {capitalGains.source.label}. Connecticut figures follow
            the Form CT-1040 Tax Calculation Schedule: the {CT_BRACKET_COUNT}-bracket rate
            schedule (Table B), the personal exemption and its phase-out (Table A), the 2%
            rate phase-out add-back (Table C) and the tax recapture (Table D).
          </p>
        </div>
        <div className="trust-row">
          <span>{YEAR} Rates</span>
          <span>7 Brackets</span>
          <span>Free to Use</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">HOW IT WORKS</p>
        <h2>How Connecticut Income Tax Works</h2>
        <section>
          <p>
            Connecticut uses a <strong>progressive income tax system</strong> with seven tax
            brackets, ranging from 2% at the bottom to 6.99% at the top. This means that as
            your income increases, each additional dollar is taxed at a higher rate — but only
            the dollars within each bracket are taxed at that bracket&apos;s rate. Your overall
            effective rate is always lower than your top marginal rate.
          </p>
          <p>
            What makes Connecticut&apos;s system more complex than most states is not just the
            number of brackets, but also the various <strong>phase-outs, credits, and
            adjustments</strong> that can significantly affect your final tax liability. The
            personal exemption phases out at moderate income levels, several credits have
            income limits, and Connecticut has a number of additions and subtractions to
            federal AGI that do not exist in other states.
          </p>

          <h3>The Progressive Bracket Structure</h3>
          <p>
            Connecticut&apos;s seven-bracket system is more granular than most states. Most
            states with a graduated tax have between three and six brackets; Connecticut has
            seven, with relatively narrow bands at the lower income levels and wider bands at
            the top. The rates increase gradually: 2%, 3%, 4.5%, 5.5%, 6%, 6.5%, and 6.99%.
          </p>
          <p>
            The bracket structure is designed so that lower-income households pay a smaller
            share of their income in state tax, while higher-income households pay a larger
            share. Because of the personal exemption, households below a certain income level
            pay no Connecticut income tax at all. As income rises above the exemption,
            taxpayers move through the brackets, with each tier of income taxed at a
            progressively higher rate.
          </p>

          <h3>Personal Exemption and Phase-Outs</h3>
          <p>
            Connecticut provides a personal exemption that reduces your taxable income before
            the bracket rates are applied. For {YEAR}, the personal exemption is{" "}
            {money2(CT_PERSONAL_EXEMPTION_SINGLE)} for single filers, head of household filers,
            and married filing separately. Married couples filing jointly receive{" "}
            {money2(CT_PERSONAL_EXEMPTION_JOINT)}.
          </p>
          <p>
            However, the personal exemption is not available to all taxpayers. It begins to
            phase out once your Connecticut AGI reaches a certain threshold, and it is fully
            phased out at higher income levels. The phase-out range is different for each
            filing status. This phase-out effectively creates a higher marginal tax rate for
            taxpayers in the phase-out range, because as their income increases, they not only
            pay tax on the additional income but also gradually lose their exemption.
          </p>
          <ul className="checklist">
            <li><strong>Single filers:</strong> Personal exemption of {money2(CT_PERSONAL_EXEMPTION_SINGLE)}, phases out at higher income levels</li>
            <li><strong>Married filing jointly:</strong> Personal exemption of {money2(CT_PERSONAL_EXEMPTION_JOINT)}, phases out at roughly double the single threshold</li>
            <li><strong>Head of household:</strong> Same as single for the base exemption</li>
            <li><strong>Married filing separately:</strong> Same as single for the base exemption</li>
          </ul>

          <h3>How the Calculation Works</h3>
          <p>
            Calculating your Connecticut income tax follows a multi-step process that starts
            with your federal adjusted gross income and applies Connecticut-specific
            adjustments, exemptions, and credits:
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
                  <td>Start with your federal adjusted gross income (AGI)</td>
                </tr>
                <tr>
                  <td><strong>2</strong></td>
                  <td>Add Connecticut-specific additions (e.g., certain municipal bond interest)</td>
                </tr>
                <tr>
                  <td><strong>3</strong></td>
                  <td>Subtract Connecticut-specific subtractions to get CT AGI</td>
                </tr>
                <tr>
                  <td><strong>4</strong></td>
                  <td>Subtract personal exemption (if below phase-out threshold)</td>
                </tr>
                <tr>
                  <td><strong>5</strong></td>
                  <td>Apply progressive bracket rates to taxable income</td>
                </tr>
                <tr className="rate-total">
                  <td><strong>6</strong></td>
                  <td><strong>Subtract applicable credits → Connecticut tax</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TAX BRACKETS</p>
        <h2>CT Tax Brackets for 2026</h2>
        <section>
          <p>
            Connecticut has {CT_BRACKET_COUNT} income tax brackets for {YEAR}. The brackets are
            structured so that each rate applies only to the portion of Connecticut taxable
            income within that bracket&apos;s range. Connecticut publishes three separate
            schedules — the married filing jointly bands are exactly double the single bands,
            and head of household sits between them.
          </p>

          <h3>Single Filers and Married Filing Separately</h3>
          <p>
            For single filers and married couples filing separately, the {YEAR} Connecticut
            income tax brackets are:
          </p>
          <CtBracketTable schedule="single" />

          <h3>Head of Household</h3>
          <p>
            Head of household filers use their own schedule — Connecticut does not fold them
            in with single filers:
          </p>
          <CtBracketTable schedule="head" />

          <h3>Married Filing Jointly</h3>
          <p>
            For married couples filing jointly, the {YEAR} Connecticut income tax brackets are
            exactly double the single brackets:
          </p>
          <CtBracketTable schedule="married" />


          <h3>Marginal vs. Effective Tax Rate</h3>
          <p>
            It is important to understand the difference between your <strong>marginal tax
            rate</strong> and your <strong>effective tax rate</strong>. Your marginal rate is
            the rate at which your next dollar of income is taxed — in other words, your top
            bracket. Your effective rate is your total tax divided by your total income, which
            is always lower than your marginal rate because lower brackets are taxed at lower
            rates.
          </p>
          <p>
            For example, a single filer with $80,000 of Connecticut taxable income is in the
            5.5% marginal bracket, but their effective Connecticut tax rate is much lower
            because only the income above $50,000 is taxed at 5.5%. The first $10,000 is taxed
            at 2%, the next $40,000 at 4.5%, and only the remaining $30,000 at 5.5%. When you
            also factor in the personal exemption, the effective rate drops further.
          </p>

          <h3>How Brackets Work: A $75,000 Example</h3>
          <p>
            Let us walk through an example to see how the bracket system works in practice.
            Consider a single filer with $75,000 of Connecticut taxable income (after the
            personal exemption):
          </p>
          <CtWorkedExample taxable={75000} />
          <p>
            Even though the taxpayer is in the 5.5% marginal bracket, their effective rate is
            about {((ctProgressiveTax(75000, "single") / 75000) * 100).toFixed(1)}% of total
            taxable income. If you factor in the personal exemption, the effective rate as a
            percentage of total income is even lower. This is the defining feature of a
            progressive tax system: higher earners pay a larger share of their income in tax,
            but nobody pays the top rate on their entire income.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPLEXITY</p>
        <h2>Connecticut&apos;s Complex Tax Structure</h2>
        <section>
          <p>
            Connecticut has one of the more complex state income tax systems in the country.
            Beyond the basic seven-bracket progressive structure, the state has a number of
            features that add layers of complexity and can significantly affect your tax bill.
            Understanding these features is essential for accurate tax planning.
          </p>

          <h3>Personal Exemption Phase-Outs</h3>
          <p>
            One of the most notable complexities of Connecticut&apos;s tax system is the
            phase-out of the personal exemption at higher income levels. While many states
            offer a standard deduction or personal exemption that is available to all
            taxpayers, Connecticut&apos;s exemption gradually disappears as income rises.
          </p>
          <p>
            The phase-out works by reducing the personal exemption by a certain percentage for
            each dollar of income above the phase-out threshold. Once income reaches the top
            of the phase-out range, the exemption is completely eliminated. This creates what
            tax economists call a &ldquo;bubble&rdquo; in the marginal rate structure —
            taxpayers in the phase-out range effectively pay a higher marginal rate than the
            stated bracket rate, because each additional dollar of income both adds to their
            tax and reduces their exemption.
          </p>

          <h3>CT-W4 Withholding Codes</h3>
          <p>
            Connecticut uses a unique withholding system with multiple codes that determine
            how much state income tax is withheld from your paycheck. The CT-W4 form allows
            you to choose from several withholding codes, each of which corresponds to a
            different exemption amount and filing status. The code you select affects how
            much tax is taken out of each paycheck.
          </p>
          <p>
            The withholding codes range from Code A (single or head of household, one
            exemption) to higher codes for married filers and those with more exemptions.
            Unlike the federal W-4, which was redesigned in 2020 to move away from
            allowances, Connecticut&apos;s system still uses a traditional exemption-based
            approach. This means your Connecticut withholding may not match your federal
            withholding pattern, and you may need to adjust one or the other to avoid
            underpayment or overpayment.
          </p>

          <h3>Connecticut Paid Leave Program</h3>
          <p>
            Connecticut has a state-run paid leave program that provides workers with up to 12
            weeks of paid leave per year for qualifying events, including the birth or
            adoption of a child, caring for a seriously ill family member, or addressing
            certain military family needs. The program is funded through a payroll tax on
            employees.
          </p>
          <p>
            The paid leave contribution is technically a payroll tax, not an income tax, but
            it appears as a deduction on your pay stub alongside income tax withholding. The
            rate is set by the state and can change from year to year. It is important to
            note that this is a separate program from the state income tax, and the
            contributions are not part of your income tax calculation or refund.
          </p>

          <h3>Tax Credits in Connecticut</h3>
          <p>
            Connecticut offers a variety of tax credits that can reduce your tax liability
            dollar for dollar. Some of the most significant credits include:
          </p>
          <ul className="checklist">
            <li><strong>Property Tax Credit:</strong> A credit for property taxes paid on your primary residence or motor vehicle, subject to income limits</li>
            <li><strong>Earned Income Tax Credit:</strong> A refundable credit for low- to moderate-income working individuals and families, equal to a percentage of the federal EITC</li>
            <li><strong>Child and Dependent Care Tax Credit:</strong> A credit for a portion of the expenses you pay for the care of a qualifying child or dependent</li>
            <li><strong>College Contribution Credit:</strong> A credit for contributions to Connecticut&apos;s 529 college savings plan</li>
          </ul>
          <p>
            Many of these credits have income limits or phase-outs of their own, adding
            another layer of complexity to the Connecticut tax system. The interaction between
            the personal exemption phase-out, bracket rates, and credit phase-outs can create
            effective marginal rates that differ significantly from the stated bracket rates
            for certain income ranges.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FILING REQUIREMENTS</p>
        <h2>Who Has to File a CT Tax Return?</h2>
        <section>
          <p>
            Whether you need to file a Connecticut Form CT-1040 depends on several factors,
            including your residency status, your income level, your filing status, and
            whether you had Connecticut tax withheld. Connecticut&apos;s filing requirements
            are more complex than those of many other states due to the phase-out of the
            personal exemption and the variety of credits and adjustments.
          </p>

          <h3>Connecticut Residents</h3>
          <p>
            If you were a Connecticut resident for the full year, you generally must file a
            Connecticut Form CT-1040 if:
          </p>
          <ul className="checklist">
            <li>Your Connecticut gross income exceeds the personal exemption amount for your filing status</li>
            <li>You had Connecticut income tax withheld from your pay and want a refund</li>
            <li>You qualify for refundable credits like the Connecticut Earned Income Tax Credit</li>
            <li>You had Connecticut estimated tax payments or overpayment credits applied from last year</li>
            <li>You are a nonresident alien with Connecticut source income</li>
            <li>You have income from Connecticut sources but are claimed as a dependent on someone else&apos;s return</li>
          </ul>
          <p>
            Even if you are not technically required to file, it is usually a good idea to
            file if you had any Connecticut tax withheld or if you might qualify for
            refundable credits. You cannot get a refund without filing a return, and filing
            ensures you are in compliance with the Connecticut Department of Revenue Services.
          </p>

          <h3>Part-Year Residents and Nonresidents</h3>
          <p>
            If you moved into or out of Connecticut during the year, you file as a part-year
            resident using Form CT-1040. You pay Connecticut tax on income you earned while
            you were a resident, plus any income from Connecticut sources while you were a
            nonresident. You will need to allocate your income between the resident and
            nonresident portions of the year.
          </p>
          <p>
            If you were never a Connecticut resident but earned income from Connecticut
            sources — for example, if you worked in Connecticut but lived in another state —
            you may need to file Form CT-1040 as a nonresident. Common Connecticut-source
            income includes wages earned in Connecticut, rental income from Connecticut
            property, business income from Connecticut operations, and income from a
            Connecticut business or partnership.
          </p>

          <h3>Filing Thresholds</h3>
          <p>
            Connecticut&apos;s filing thresholds are based on the personal exemption amounts.
            If your gross income is below the personal exemption for your filing status and
            you have no other filing requirement, you generally do not need to file a
            Connecticut return. However, the phase-out of the personal exemption means that
            even taxpayers with higher incomes may still need to file, even though they
            receive no benefit from the exemption.
          </p>
          <p>
            The general rule is that if you are required to file a federal return and you
            have any connection to Connecticut (as a resident, part-year resident, or
            nonresident with Connecticut source income), you should also file a Connecticut
            return. When in doubt, it is always better to file — you cannot get a refund if
            you do not file, and filing late can result in penalties even if you are owed
            money.
          </p>

          <h3>Important Deadlines</h3>
          <p>
            The Connecticut individual income tax return is due on the same day as the
            federal return — typically April 15 of the following year, or the next business
            day if April 15 falls on a weekend or holiday. If you file for a federal
            extension, your Connecticut filing deadline is automatically extended as well,
            but you still need to pay any tax you owe by the original deadline to avoid
            interest and penalties.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">COMPARISON</p>
        <h2>CT vs Federal: Key Differences</h2>
        <section>
          <p>
            While both Connecticut and the federal government collect income tax using
            progressive bracket systems, there are important differences in how the two
            systems work. Connecticut has more brackets but lower top rates, a different
            approach to deductions and exemptions, and a unique set of credits and phase-outs.
          </p>

          <h3>Rate Structure Comparison</h3>
          <p>
            Both systems are progressive, but the federal system has wider brackets and a
            much higher top rate. Connecticut has seven relatively narrow brackets topping
            out at 6.99%, while the federal system has seven broader brackets with a top
            rate of 37%. The federal brackets are also adjusted annually for inflation,
            while Connecticut&apos;s brackets may or may not be adjusted depending on
            legislative action.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Federal Income Tax</th>
                  <th>Connecticut Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rate structure</strong></td>
                  <td>Progressive — 7 brackets, 10% to 37%</td>
                  <td>Progressive — 7 brackets, 2% to 6.99%</td>
                </tr>
                <tr>
                  <td><strong>Standard deduction</strong></td>
                  <td>Yes — {money2(single.standardDeduction)} single, {money2(married.standardDeduction)} joint</td>
                  <td>Personal exemption — {money2(CT_PERSONAL_EXEMPTION_SINGLE)} single, {money2(CT_PERSONAL_EXEMPTION_JOINT)} joint (phases out)</td>
                </tr>
                <tr>
                  <td><strong>Personal exemptions</strong></td>
                  <td>Suspended through 2025 (part of TCJA)</td>
                  <td>Included in personal exemption amount</td>
                </tr>
                <tr>
                  <td><strong>Dependent exemptions/credits</strong></td>
                  <td>Child Tax Credit (refundable, up to $2,000 per child)</td>
                  <td>No dependent exemption; various credits available</td>
                </tr>
                <tr>
                  <td><strong>Top rate</strong></td>
                  <td>37% above {money2(single.brackets[6][0])} (single)</td>
                  <td>6.99% above $300,000 (single)</td>
                </tr>
                <tr>
                  <td><strong>Number of brackets</strong></td>
                  <td>Seven</td>
                  <td>Seven</td>
                </tr>
                <tr>
                  <td><strong>Phase-outs</strong></td>
                  <td>Some credits phase out</td>
                  <td>Personal exemption and multiple credits phase out</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Why Your Federal Bill Is Usually Higher</h3>
          <p>
            For most Connecticut taxpayers, the federal income tax bill is substantially
            larger than the state tax bill. Federal rates are much higher across the board —
            the 10% bottom federal bracket is higher than Connecticut&apos;s top rate of
            6.99%, and the top federal rate of 37% is more than five times higher than
            Connecticut&apos;s top rate. The federal standard deduction is also significantly
            larger than Connecticut&apos;s personal exemption, but the rates above that
            deduction are much higher.
          </p>
          <p>
            At $75,000 of income for a single filer, federal tax is roughly four to five
            times the Connecticut tax. At higher incomes, the gap widens further as federal
            rates climb into the 22%, 24%, and 32% brackets while Connecticut&apos;s top rate
            maxes out at 6.99%. However, because Connecticut&apos;s personal exemption phases
            out at much lower income levels than the federal standard deduction, the
            effective state rate can climb more quickly at certain income ranges.
          </p>

          <h3>Retirement Income Treatment</h3>
          <p>
            Connecticut does not tax Social Security benefits for most retirees, which is
            similar to the federal treatment for lower-income retirees but more generous for
            middle- and upper-income retirees. Connecticut also offers some exclusions for
            pension and other retirement income for taxpayers who meet certain age and income
            requirements. At the federal level, Social Security benefits are taxable for
            most retirees with other income, and retirement account distributions are fully
            taxed at ordinary rates.
          </p>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>
          FREQUENTLY ASKED QUESTIONS
        </p>
        <h2>Connecticut Income Tax FAQ</h2>
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
            ({capitalGains.source.sections}). Connecticut figures come from the Form
            CT-1040 Tax Calculation Schedule (Rev. 12/25) published by the Connecticut
            Department of Revenue Services: Table A personal exemptions and their phase-out,
            the Table B {CT_BRACKET_COUNT}-bracket rate schedule ({CT_BRACKET_COUNT === 7 ? "2%" : ""}{" "}
            to {CT_TOP_RATE}%), the Table C 2% rate phase-out add-back, and the Table D tax
            recapture.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>One known simplification:</strong> this estimator does not apply Table E,
            Connecticut&apos;s personal tax credit, which reduces the tax of filers with low
            Connecticut AGI by up to 75%. If your Connecticut AGI is roughly under{" "}
            {money2(30500).replace(".00", "")} filing single (or{" "}
            {money2(48000).replace(".00", "")} filing jointly), your actual Connecticut tax
            will be lower than the figure shown here. Everything above those levels is
            unaffected.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice or a substitute
            for professional tax preparation or filing software. The calculator estimates federal
            and Connecticut income tax using simplified inputs and does not account for itemized
            deductions, tax credits, capital gains, retirement contributions, self-employment
            taxes, or Connecticut-specific additions and subtractions to federal AGI. Consult a
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
            <a href="/florida-state-tax-calculator">
              <b>Florida State Tax Calculator</b>
              <span>No income tax state →</span>
            </a>
            <a href="/tennessee-income-tax-calculator">
              <b>Tennessee Income Tax Calculator</b>
              <span>No wage income tax →</span>
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
