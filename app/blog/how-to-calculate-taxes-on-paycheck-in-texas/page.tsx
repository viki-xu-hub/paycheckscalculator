import { BlogArticle, Callout, DataTable, Figure, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { californiaBreakdown, texasBreakdown, texasExample } from "../../lib/blogPosts";

const SLUG = "how-to-calculate-taxes-on-paycheck-in-texas";
export const metadata = blogMetadata(SLUG);

const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const whole = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const e = texasExample;
const c = e.check;
const fica = c.socialSecurity + c.medicare;
const tx100 = texasBreakdown.find(row => row.salary === 100000)!;
const ca100 = californiaBreakdown.find(row => row.salary === 100000)!;

const faqs: Faq[] = [
  {
    q: "How do you calculate taxes on a paycheck in Texas?",
    a: "Start with gross pay, subtract pre-tax deductions, then figure federal income tax withholding with the IRS Publication 15-T percentage method, 6.2% Social Security and 1.45% Medicare. Texas has no state income tax, so gross pay minus those three amounts and any other deductions is your take-home pay.",
  },
  {
    q: "What percentage of my paycheck goes to taxes in Texas?",
    a: `For a single filer with a standard W-4, roughly ${pct(1 - texasBreakdown[0].net / texasBreakdown[0].gross)} of gross pay is withheld at $40,000, ${pct(1 - c.net / c.gross)} at $60,000 and ${pct(1 - tx100.net / tx100.gross)} at $100,000. The 7.65% FICA portion is flat; federal income tax rises with income.`,
  },
  {
    q: "Does Texas take state taxes out of your paycheck?",
    a: "No. Texas does not have a personal income tax, and no Texas city or county levies an income tax on wages. The only taxes withheld from a Texas paycheck are federal income tax, Social Security and Medicare.",
  },
  {
    q: "How much federal tax is taken out of a $60,000 paycheck in Texas?",
    a: `A single filer paid biweekly on $60,000 has about ${usd(c.federal)} of federal income tax, ${usd(c.socialSecurity)} of Social Security and ${usd(c.medicare)} of Medicare withheld from each ${usd(c.gross)} check, leaving ${usd(c.net)} take-home.`,
  },
  {
    q: "Do Texas employers pay state payroll taxes?",
    a: "Yes, but not from your paycheck. Texas employers pay state unemployment tax (SUTA) to the Texas Workforce Commission on the first $9,000 of each employee's wages, plus federal unemployment tax (FUTA) and their matching share of Social Security and Medicare.",
  },
  {
    q: "How are bonuses taxed in Texas?",
    a: "Bonuses paid separately from regular wages are usually withheld at a flat 22% federal supplemental rate, plus 6.2% Social Security and 1.45% Medicare. There is no Texas tax on the bonus.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="TEXAS · PAYCHECK TAX MATH"
      quickAnswer={
        <p>
          Here is how to calculate taxes on paycheck in Texas: take your gross pay, subtract pre-tax deductions, and withhold three federal
          taxes: <strong>federal income tax</strong> (from the IRS Publication 15-T tables and your W-4),{" "}
          <strong>Social Security at 6.2%</strong> and <strong>Medicare at 1.45%</strong>. Texas has no state or local income tax,
          so nothing else is withheld for taxes. A single filer earning $60,000 paid biweekly keeps about{" "}
          <strong>{usd(c.net)}</strong> of each {usd(c.gross)} check.
        </p>
      }
      takeaways={[
        "Only three taxes come out of a Texas paycheck: federal income tax, Social Security and Medicare.",
        "FICA is a flat 7.65% (6.2% + 1.45%) up to the $184,500 Social Security wage base in 2026.",
        "Federal withholding uses IRS Pub 15-T: annualize, subtract the W-4 adjustment, apply the bracket table, divide back.",
        "401(k) deferrals cut income tax but not FICA; most Section 125 health premiums cut both.",
        "Texas SUTA is paid by employers on the first $9,000 of wages — it is never deducted from you.",
      ]}
      toc={[
        { id: "what-comes-out", label: "What comes out of a Texas paycheck" },
        { id: "step-by-step", label: "Step-by-step calculation" },
        { id: "worked-example", label: "Worked example: $60,000 salary" },
        { id: "by-salary", label: "Texas paycheck taxes by salary" },
        { id: "deductions", label: "How deductions change the math" },
        { id: "special-cases", label: "Bonuses, overtime and high earners" },
        { id: "employer-taxes", label: "Taxes your employer pays" },
        { id: "texas-vs-other-states", label: "Texas vs other states" },
        { id: "check-your-stub", label: "Checking your own pay stub" },
        { id: "faq", label: "FAQ" },
      ]}
      howTo={{
        name: "How to calculate taxes on a paycheck in Texas",
        steps: [
          "Find your gross pay for the pay period.",
          "Subtract pre-tax deductions such as traditional 401(k) and Section 125 health premiums.",
          "Annualize taxable wages, subtract the W-4 standard adjustment and apply the IRS Publication 15-T bracket table; divide by pay periods for federal withholding.",
          "Multiply Social Security wages by 6.2% and Medicare wages by 1.45%.",
          "Skip state and local income tax because Texas has none.",
          "Subtract all taxes and deductions from gross pay to get take-home pay.",
        ],
      }}
      faqs={faqs}
      sources={[
        { label: "IRS Publication 15-T (2026), Federal Income Tax Withholding Methods", url: "https://www.irs.gov/publications/p15t" },
        { label: "IRS Publication 15 (Circular E), Employer's Tax Guide", url: "https://www.irs.gov/publications/p15" },
        { label: "IRS Topic 751, Social Security and Medicare Withholding Rates", url: "https://www.irs.gov/taxtopics/tc751" },
        { label: "Social Security Administration, Contribution and Benefit Base", url: "https://www.ssa.gov/oact/cola/cbb.html" },
        { label: "Texas Comptroller, Texas taxes overview (no personal income tax)", url: "https://comptroller.texas.gov/taxes/" },
        { label: "Texas Workforce Commission (unemployment tax for employers)", url: "https://www.twc.texas.gov/" },
        { label: "IRS Tax Withholding Estimator", url: "https://www.irs.gov/individuals/tax-withholding-estimator" },
      ]}
      related={[
        { href: "/texas-paycheck-calculator", title: "Texas Paycheck Calculator", blurb: "Your exact Texas take-home" },
        { href: "/biweekly/texas-paycheck-calculator", title: "Texas Biweekly Paycheck Calculator", blurb: "Every-two-weeks pay in Texas" },
        { href: "/texas-paycheck-calculator-with-bonus", title: "Texas Paycheck Calculator With Bonus", blurb: "22% supplemental withholding" },
        { href: "/texas-paycheck-calculator-with-dependents", title: "Texas Paycheck Calculator With Dependents", blurb: "W-4 Step 3 credits" },
      ]}
    >
      <h2 id="what-comes-out">What Taxes Come Out of a Texas Paycheck?</h2>
      <p>
        Texas is one of the few states without a personal income tax, and a 2019 amendment to the Texas Constitution prohibits
        the state from adopting one. No Texas city, county or school district taxes wages either. That makes a Texas paycheck one of
        the simplest in the country to calculate: every tax line on your stub is federal. That is why knowing how to calculate
        taxes on paycheck in Texas really means knowing three federal formulas.
      </p>
      <DataTable
        caption="Taxes withheld from a Texas employee's paycheck in 2026."
        head={["Tax", "Rate", "Wage limit", "Set by"]}
        rows={[
          ["Federal income tax", "10%–37% brackets, via W-4", "None", "IRS Pub 15-T"],
          ["Social Security (OASDI)", "6.2%", "$184,500 of wages", "SSA / IRS"],
          ["Medicare", "1.45%", "None", "IRS"],
          ["Additional Medicare", "0.9%", "Wages over $200,000", "IRS"],
          ["Texas state income tax", "0%", "—", "Texas has none"],
          ["Local income tax", "0%", "—", "None in Texas"],
        ]}
      />
      <p>
        Your stub can still show other deductions — health insurance, 401(k), HSA, union dues, wage garnishments or child
        support — but those are not taxes. They matter for the calculation only because some of them reduce the wages that tax
        is figured on.
      </p>

      <h2 id="step-by-step">How to Calculate Taxes on Paycheck in Texas, Step by Step</h2>
      <h3>Step 1: Start with gross pay</h3>
      <p>
        For salaried workers, divide annual salary by the number of pay periods: 52 weekly, 26 biweekly, 24 semimonthly or 12
        monthly. For hourly workers, multiply your rate by hours worked, adding overtime at 1.5× for hours over 40 in a
        workweek.
      </p>
      <h3>Step 2: Subtract pre-tax deductions</h3>
      <p>
        Traditional 401(k) or 403(b) deferrals, HSA payroll contributions and Section 125 health, dental and vision premiums are
        taken out before federal income tax. The result is your <strong>federal taxable wages</strong>.
      </p>
      <h3>Step 3: Calculate federal income tax withholding</h3>
      <p>
        Employers use the percentage method in IRS Publication 15-T (Worksheet 1A for automated payroll with a 2020-or-later
        W-4). In plain terms:
      </p>
      <Formula>
        Annual wages = taxable wages per check × pay periods
        <br />
        Adjusted wages = annual wages − W-4 adjustment ($8,600 single / $12,900 married)
        <br />
        Annual tax = bracket base + rate × (adjusted wages − bracket floor)
        <br />
        Withholding per check = (annual tax − W-4 Step 3 credits) ÷ pay periods + Step 4(c) extra
      </Formula>
      <p>
        The W-4 adjustment applies when the Step 2 &quot;multiple jobs&quot; box is unchecked. If it is checked, the employer
        uses a narrower table with no adjustment, which withholds more.
      </p>
      <h3>Step 4: Calculate Social Security and Medicare (FICA)</h3>
      <p>
        Multiply Social Security wages by <strong>6.2%</strong> until your year-to-date wages reach $184,500, then stop.
        Multiply Medicare wages by <strong>1.45%</strong> with no cap, adding 0.9% on wages above $200,000 in the year.
      </p>
      <h3>Step 5: Skip state and local income tax</h3>
      <p>Texas withholds nothing here. In most other states, this is where state income tax would be subtracted.</p>
      <h3>Step 6: Subtract everything from gross pay</h3>
      <Formula>Net pay = gross pay − pre-tax deductions − federal income tax − Social Security − Medicare − post-tax deductions</Formula>

      <h2 id="worked-example">Worked Example: $60,000 Salary Paid Biweekly</h2>
      <p>
        This is how to calculate taxes on paycheck in Texas from start to finish for a single filer in Houston earning {whole(e.salary)} a year, paid every two weeks, with a
        2026 W-4 that has no adjustments and no pre-tax deductions.
      </p>
      <Figure
        src="/images/blog/texas-pay-stub-annotated.svg"
        alt={`How to calculate taxes on paycheck in Texas — annotated pay stub: ${usd(c.gross)} gross, ${usd(c.federal)} federal income tax, ${usd(c.socialSecurity)} Social Security, ${usd(c.medicare)} Medicare, $0 Texas tax, ${usd(c.net)} net pay`}
        caption="Each line on this sample stub is calculated below. A real stub adds year-to-date columns and any benefit deductions."
      />
      <ol>
        <li>
          <strong>Gross pay:</strong> {whole(e.salary)} ÷ 26 = <strong>{usd(c.gross)}</strong>.
        </li>
        <li>
          <strong>Annualize and adjust:</strong> {whole(e.salary)} − {whole(e.standardAdjustment)} single-filer adjustment ={" "}
          {whole(e.adjustedAnnual)}.
        </li>
        <li>
          <strong>Apply the 2026 single bracket table:</strong> {whole(e.adjustedAnnual)} falls in the 12% row that starts at{" "}
          {whole(e.bracketFloor)}. Tax = {whole(e.bracketBase)} + 12% × ({whole(e.adjustedAnnual)} − {whole(e.bracketFloor)}) ={" "}
          {usd(e.annualTax)} a year.
        </li>
        <li>
          <strong>Federal withholding per check:</strong> {usd(e.annualTax)} ÷ 26 = <strong>{usd(c.federal)}</strong>.
        </li>
        <li>
          <strong>Social Security:</strong> {usd(c.gross)} × 6.2% = <strong>{usd(c.socialSecurity)}</strong>.
        </li>
        <li>
          <strong>Medicare:</strong> {usd(c.gross)} × 1.45% = <strong>{usd(c.medicare)}</strong>.
        </li>
        <li>
          <strong>Texas income tax:</strong> $0.00.
        </li>
        <li>
          <strong>Net pay:</strong> {usd(c.gross)} − {usd(c.federal)} − {usd(c.socialSecurity)} − {usd(c.medicare)} ={" "}
          <strong>{usd(c.net)}</strong>.
        </li>
      </ol>
      <p>
        Total withholding is {usd(c.gross - c.net)}, or {pct(1 - c.net / c.gross)} of gross. Over a year that is{" "}
        {whole(c.federal * 26)} of federal income tax and {whole(fica * 26)} of FICA. The same worker filing married jointly
        (spouse not working) would have about {usd(e.married.federal)} of federal tax withheld per check and take home{" "}
        {usd(e.married.net)}.
      </p>

      <h2 id="by-salary">Texas Paycheck Taxes by Salary</h2>
      <p>
        Because FICA is flat and federal income tax is progressive, the share withheld rises slowly with income. The chart and
        table below use the same assumptions as the worked example.
      </p>
      <DataTable
        caption="Per biweekly paycheck, single filer, Texas, 2026 W-4 with no adjustments, no pre-tax deductions."
        head={["Annual salary", "Gross / check", "Federal tax", "Social Security", "Medicare", "Take-home", "Withheld"]}
        rows={texasBreakdown.map(row => [
          whole(row.salary),
          usd(row.gross),
          usd(row.federal),
          usd(row.socialSecurity),
          usd(row.medicare),
          usd(row.net),
          pct(1 - row.net / row.gross),
        ])}
      />
      <p>
        Want a different salary, filing status or pay schedule? The <a href="/texas-paycheck-calculator">Texas paycheck
        calculator</a> runs the same method on your numbers in a few seconds.
      </p>

      <h2 id="deductions">How Pre-Tax Deductions Change the Math</h2>
      <p>
        Not every deduction is treated the same way, and this is the most common reason a hand calculation misses the real
        paycheck by a few dollars.
      </p>
      <DataTable
        caption="How common payroll deductions interact with federal income tax and FICA."
        head={["Deduction", "Reduces federal income tax?", "Reduces Social Security & Medicare?"]}
        rows={[
          ["Traditional 401(k) / 403(b)", "Yes", "No"],
          ["Roth 401(k)", "No", "No"],
          ["Section 125 health, dental, vision", "Yes", "Yes"],
          ["HSA via payroll (Section 125)", "Yes", "Yes"],
          ["Commuter benefits", "Yes", "Yes"],
          ["Post-tax deductions (garnishments, Roth)", "No", "No"],
        ]}
      />
      <p>
        Example: add a $100-per-check Section 125 health premium to the $60,000 worker above. Federal withholding drops to{" "}
        {usd(e.withHealth.federal)}, Social Security to {usd(e.withHealth.socialSecurity)} and Medicare to{" "}
        {usd(e.withHealth.medicare)}. Take-home falls by only {usd(c.net - e.withHealth.net)}, not the full $100, because the
        premium is taken out before all three taxes. For retirement deductions, see our guide on{" "}
        <a href="/blog/how-to-calculate-401k-from-paycheck">how to calculate 401(k) from a paycheck</a>.
      </p>

      <h2 id="special-cases">Bonuses, Overtime, Dependents and High Earners</h2>
      <ul>
        <li>
          <strong>Bonuses:</strong> supplemental wages paid separately are usually withheld at a flat 22% federal rate (37% on
          supplemental wages over $1 million), plus FICA. Texas adds nothing. Model it with the{" "}
          <a href="/texas-paycheck-calculator-with-bonus">Texas bonus calculator</a>.
        </li>
        <li>
          <strong>Overtime:</strong> overtime is taxed through regular withholding. A large overtime check is annualized as if
          you earned that much every period, so withholding can look high; the difference is settled when you file.
        </li>
        <li>
          <strong>Dependents:</strong> W-4 Step 3 credits are subtracted from annual tax before it is divided by pay periods,
          which lowers withholding. See the <a href="/texas-paycheck-calculator-with-dependents">dependents calculator</a>.
        </li>
        <li>
          <strong>High earners:</strong> once year-to-date wages pass $184,500, Social Security stops for the rest of 2026 and
          checks get bigger. Above $200,000, the extra 0.9% Medicare tax starts.
        </li>
        <li>
          <strong>Child support:</strong> income withholding orders come out after taxes and are capped by federal law. See the{" "}
          <a href="/texas-paycheck-calculator-with-child-support">child support calculator</a>.
        </li>
      </ul>

      <h2 id="employer-taxes">Taxes Texas Employers Pay (Not From Your Check)</h2>
      <p>
        If you run payroll for a Texas business, a few taxes sit on the employer side of the ledger. They never reduce the
        employee&apos;s paycheck, but they are part of the cost of each hire:
      </p>
      <ul>
        <li>
          <strong>Employer FICA:</strong> a matching 6.2% Social Security and 1.45% Medicare on the same wages.
        </li>
        <li>
          <strong>Texas unemployment tax (SUTA):</strong> paid to the Texas Workforce Commission on the first{" "}
          <strong>$9,000</strong> of each employee&apos;s wages per year. New employers are generally assigned 2.7% or their
          industry average, whichever is higher; experienced employers get a rate based on their claims history.
        </li>
        <li>
          <strong>Federal unemployment tax (FUTA):</strong> 6.0% on the first $7,000 of wages, reduced to an effective 0.6% when
          state unemployment tax is paid on time.
        </li>
      </ul>
      <p>
        Employers must also report new hires to the Texas Employer New Hire Reporting Operations Center within 20 days. None of
        this changes the employee calculation above.
      </p>

      <h2 id="texas-vs-other-states">Texas vs Other States: What No Income Tax Is Worth</h2>
      <Figure
        src="/images/blog/texas-vs-california-take-home.svg"
        alt="Grouped bars comparing Texas and California biweekly take-home pay at $40,000, $60,000, $75,000 and $100,000 salaries"
        caption="Federal tax and FICA are identical in both states; the gap is California income tax and State Disability Insurance."
        height={460}
      />
      <p>
        At {whole(tx100.salary)} a year, a single Texas worker takes home {usd(tx100.net)} per biweekly check, versus{" "}
        {usd(ca100.net)} in California — about {whole((tx100.net - ca100.net) * 26)} more per year. Texas makes up some of that
        through higher property taxes and a 6.25% state sales tax (up to 8.25% with local taxes), so compare total cost of
        living, not just paychecks. See all <a href="/state-paycheck-calculators">state paycheck calculators</a> to run the
        comparison for your state.
      </p>

      <h2 id="check-your-stub">How to Check the Taxes on Your Own Texas Pay Stub</h2>
      <ol>
        <li>Confirm your gross pay matches your salary ÷ pay periods, or rate × hours.</li>
        <li>Check that Social Security ≈ 6.2% and Medicare ≈ 1.45% of gross minus Section 125 deductions.</li>
        <li>
          If federal withholding looks off, review your W-4: filing status, the Step 2 checkbox, Step 3 credits and Step 4
          entries all change it.
        </li>
        <li>
          Use the <a href="https://www.irs.gov/individuals/tax-withholding-estimator" target="_blank" rel="noopener noreferrer">IRS
          Tax Withholding Estimator</a> once a year, especially after a raise, a new job or a new child.
        </li>
        <li>Make sure no state income tax line appears. If one does, ask payroll; you may be set up under another state.</li>
      </ol>
      <Callout title="Withholding is an estimate, not your final tax">
        <p>
          Paycheck withholding is a prepayment. Your actual federal tax is settled on Form 1040. Texans file a federal return
          only — there is no Texas individual income tax return.
        </p>
      </Callout>
    </BlogArticle>
  );
}
