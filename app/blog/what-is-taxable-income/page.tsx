import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { BRACKETS_2026, FED_2026, taxableExample as ex, taxableMarried, usd0, usd2 } from "../../lib/blogPosts";

const SLUG = "what-is-taxable-income";
export const metadata = blogMetadata(SLUG);

const sd = FED_2026.standardDeduction;
const bracketRows = BRACKETS_2026.single.map((b, i) => {
  const next = BRACKETS_2026.single[i + 1];
  const nextMarried = BRACKETS_2026.married[i + 1];
  const m = BRACKETS_2026.married[i];
  return [
    `${Math.round(b.rate * 100)}%`,
    next ? `${usd0(b.from)} – ${usd0(next.from)}` : `Over ${usd0(b.from)}`,
    nextMarried ? `${usd0(m.from)} – ${usd0(nextMarried.from)}` : `Over ${usd0(m.from)}`,
  ];
});

const faqs: Faq[] = [
  {
    q: "What is taxable income in simple terms?",
    a: "Taxable income is the part of your income the IRS actually applies tax rates to. You start with all your income, subtract certain adjustments such as traditional IRA or HSA contributions to reach adjusted gross income, then subtract the standard deduction or your itemized deductions. Whatever is left is taxable income.",
  },
  {
    q: "Is taxable income the same as gross income?",
    a: `No. Gross income is everything you received that is not specifically excluded. Taxable income is gross income minus adjustments and deductions. For a single filer in 2026 the gap is at least the ${usd0(sd.single)} standard deduction, and more if you contribute pre-tax to a 401(k), HSA or traditional IRA.`,
  },
  {
    q: "What is the 2026 standard deduction?",
    a: `${usd0(sd.single)} for single filers and married people filing separately, ${usd0(sd.married)} for married couples filing jointly, and ${usd0(sd.head)} for heads of household, under IRS Revenue Procedure 2025-32. People 65 or older or blind get an additional amount, and the One Big Beautiful Bill Act added a separate senior deduction for 2025 through 2028.`,
  },
  {
    q: "What income is not taxable?",
    a: "Common examples are gifts and inheritances you receive, life insurance death benefits, child support, qualified Roth IRA withdrawals, qualified HSA withdrawals for medical expenses, most employer-paid health insurance, and municipal bond interest for federal purposes. Some Social Security benefits are also excluded, depending on your other income.",
  },
  {
    q: "Is taxable income before or after 401(k) contributions?",
    a: "After traditional 401(k) contributions. Pre-tax deferrals are left out of box 1 of your W-2, so they never enter gross income for federal tax. Roth 401(k) deferrals go in after tax, so they leave taxable income unchanged. Neither type reduces Social Security or Medicare wages.",
  },
  {
    q: "How do I find my taxable income on my tax return?",
    a: "On Form 1040 it is line 15, labelled taxable income. It equals adjusted gross income on line 11 minus the deductions on lines 12 through 14. If you have not filed yet, your final pay stub of the year gives a starting point: year-to-date federal taxable wages.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="TAX BASICS · FORM 1040"
      quickAnswer={
        <p>
          <strong>Taxable income</strong> is the amount the IRS applies tax rates to: your total income, minus adjustments such
          as HSA or traditional IRA contributions, minus the standard deduction ({usd0(sd.single)} single, {usd0(sd.married)}{" "}
          married filing jointly for 2026) or your itemized deductions. A single filer on a $60,000 salary who puts $3,000 in a
          401(k) and pays health premiums pre-tax ends up with {usd0(ex.taxable)} of taxable income and about {usd0(ex.tax)} of
          federal income tax.
        </p>
      }
      takeaways={[
        "Taxable income = gross income − adjustments − standard or itemized deduction.",
        `2026 standard deduction: ${usd0(sd.single)} single, ${usd0(sd.married)} joint, ${usd0(sd.head)} head of household.`,
        "Pre-tax 401(k), HSA and Section 125 health premiums never reach gross income.",
        "Tax brackets apply to taxable income, not salary.",
        "Taxable income sits on Form 1040, line 15.",
      ]}
      toc={[
        { id: "definition", label: "What taxable income means" },
        { id: "formula", label: "The taxable income formula" },
        { id: "example", label: "Worked example: $60,000 salary" },
        { id: "what-counts", label: "Taxable vs non-taxable income" },
        { id: "deductions", label: "2026 standard deduction" },
        { id: "brackets", label: "How brackets apply" },
        { id: "lower", label: "Legitimate ways to lower it" },
        { id: "faq", label: "FAQ" },
      ]}
      howTo={{
        name: "How to calculate taxable income",
        steps: [
          "Add up all income that is not excluded: W-2 box 1 wages, self-employment profit, interest, dividends, capital gains and other income.",
          "Subtract above-the-line adjustments such as HSA, traditional IRA and half of self-employment tax to get adjusted gross income.",
          "Subtract the larger of the standard deduction or your itemized deductions.",
          "Subtract the qualified business income deduction or other below-the-line deductions if you qualify. The result is taxable income.",
        ],
      }}
      faqs={faqs}
      sources={[
        { label: "IRS Revenue Procedure 2025-32 (2026 tax rate tables and standard deduction)", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
        { label: "IRS Publication 525, Taxable and Nontaxable Income", url: "https://www.irs.gov/publications/p525" },
        { label: "IRS Publication 17, Your Federal Income Tax", url: "https://www.irs.gov/publications/p17" },
        { label: "IRS, About Form 1040", url: "https://www.irs.gov/forms-pubs/about-form-1040" },
      ]}
      related={[
        { href: "/tax-computation-worksheet", title: "Tax Computation Worksheet 2026", blurb: "Turn taxable income into tax owed" },
        { href: "/qualified-dividends-and-capital-gain-tax-worksheet", title: "Qualified Dividends Worksheet", blurb: "When investment income is in the mix" },
        { href: "/post-tax-deductions", title: "Pre-Tax vs Post-Tax Deductions", blurb: "Which payroll deductions cut taxable wages" },
      ]}
    >
      <h2 id="definition">What Is Taxable Income?</h2>
      <p>
        Taxable income is the figure that federal income tax rates are applied to. It is always smaller than what you earned,
        sometimes by a lot, because the tax code lets you exclude some income outright and subtract deductions from the rest.
        When people say they are &quot;in the 22% bracket,&quot; the bracket refers to taxable income, not salary.
      </p>
      <p>
        Three terms sit on the path from paycheck to tax bill, and they are easy to mix up. <strong>Gross income</strong> is
        everything you received that the law does not exclude. <strong>Adjusted gross income (AGI)</strong> is gross income
        after a short list of &quot;above-the-line&quot; adjustments. <strong>Taxable income</strong> is AGI after the standard
        or itemized deduction and a few others. Each step is a line on Form 1040.
      </p>

      <h2 id="formula">The Taxable Income Formula</h2>
      <Formula>
        Gross income − adjustments = adjusted gross income (AGI)
        <br />
        AGI − standard or itemized deduction − QBI deduction = taxable income
      </Formula>
      <p>
        On the current Form 1040, total income is line 9, AGI is line 11, deductions run from line 12 to line 14 (line 13 now
        also carries the new overtime, tip, car-loan interest and senior deductions from Schedule 1-A), and taxable income is{" "}
        <strong>line 15</strong>. Line numbers can shift when the IRS redesigns the form, so check the label. Tax is then computed from line 15 using the tax tables, the{" "}
        <a href="/tax-computation-worksheet">Tax Computation Worksheet</a> for incomes of $100,000 or more, or the{" "}
        <a href="/qualified-dividends-and-capital-gain-tax-worksheet">qualified dividends worksheet</a> when you have
        long-term gains or qualified dividends.
      </p>

      <h2 id="example">How to Calculate Taxable Income: A $60,000 Worked Example</h2>
      <p>
        Take a single filer earning a {usd0(ex.salary)} salary in 2026 who contributes 5% to a traditional 401(k), pays{" "}
        {usd0(ex.health / 12)} a month in health premiums through a pre-tax cafeteria plan, earns {usd0(ex.interest)} of savings
        interest, and takes the standard deduction.
      </p>
      <DataTable
        caption="Single filer, 2026. Tax computed from the IRS Rev. Proc. 2025-32 rate schedule."
        head={["Step", "Amount", "Where it comes from"]}
        rows={[
          ["Salary", usd0(ex.salary), "Offer letter"],
          ["− Traditional 401(k) (5%)", `−${usd0(ex.k401)}`, "Excluded from W-2 box 1"],
          ["− Pre-tax health premiums", `−${usd0(ex.health)}`, "Section 125 plan, excluded from box 1"],
          ["= W-2 box 1 wages", usd0(ex.wages), "Form 1040 line 1a"],
          ["+ Savings interest", usd0(ex.interest), "Form 1099-INT"],
          ["= Total income / AGI", usd0(ex.agi), "Lines 9 and 11 (no adjustments here)"],
          ["− Standard deduction", `−${usd0(ex.sd)}`, "Line 12"],
          ["= Taxable income", usd0(ex.taxable), "Line 15"],
          ["Federal income tax", usd2(ex.tax), "10% of the first $12,400, 12% of the rest"],
        ]}
      />
      <p>
        Notice how far taxable income is from salary: {usd0(ex.salary)} of pay produces {usd0(ex.taxable)} of taxable income.
        The tax of {usd2(ex.tax)} is about {ex.effectiveOnSalary}% of salary, even though this filer&apos;s top bracket is{" "}
        {ex.marginal}%. A married couple filing jointly on {usd0(taxableMarried.wages)} of wages would subtract{" "}
        {usd0(taxableMarried.sd)} and have {usd0(taxableMarried.taxable)} of taxable income, for {usd2(taxableMarried.tax)} of
        tax.
      </p>
      <Callout title="Payroll uses a shortcut, not your return">
        <p>
          Your employer&apos;s withholding estimates this calculation each payday using the W-4 and the IRS percentage method.
          It does not know about your interest, a spouse&apos;s job or itemized deductions, which is why a refund or balance due
          appears at filing time. The <a href="/fit-tax-meaning">FIT line on your pay stub</a> is that estimate.
        </p>
      </Callout>

      <h2 id="what-counts">Taxable vs Non-Taxable Income</h2>
      <p>
        IRS Publication 525 is the full list. The short version: income is taxable unless a specific rule excludes it.
      </p>
      <DataTable
        caption="Common items and their federal income tax treatment. State rules can differ."
        head={["Income", "Federal treatment"]}
        rows={[
          ["Wages, salary, tips, bonuses, commission", "Taxable"],
          ["Self-employment and 1099 income", "Taxable (profit after expenses)"],
          ["Interest and ordinary dividends", "Taxable"],
          ["Qualified dividends and long-term gains", "Taxable at 0%, 15% or 20%"],
          ["Unemployment compensation", "Taxable"],
          ["Social Security benefits", "Up to 85% taxable, depending on other income"],
          ["Gifts and inheritances received", "Not taxable to you"],
          ["Child support", "Not taxable"],
          ["Employer-paid health insurance", "Not taxable"],
          ["Municipal bond interest", "Not taxable federally"],
          ["Qualified Roth IRA and HSA withdrawals", "Not taxable"],
        ]}
      />
      <p>
        If you freelance on the side, the profit counts even when no form arrives; our guide to{" "}
        <a href="/blog/what-is-a-1099-form">what a 1099 form is</a> explains the reporting thresholds.
      </p>

      <h2 id="deductions">The 2026 Standard Deduction</h2>
      <p>
        Most filers take the standard deduction because it is larger than their itemized deductions would be. For 2026 the IRS
        set it at:
      </p>
      <DataTable
        caption="2026 standard deduction, IRS Revenue Procedure 2025-32."
        head={["Filing status", "Standard deduction"]}
        rows={[
          ["Single or married filing separately", usd0(sd.single)],
          ["Married filing jointly", usd0(sd.married)],
          ["Head of household", usd0(sd.head)],
        ]}
      />
      <p>
        You itemize instead when mortgage interest, state and local taxes (capped, with a higher limit under the 2025 tax law),
        charitable gifts and large medical expenses add up to more than these amounts. Itemizing is an either-or choice; you
        cannot take both.
      </p>

      <h2 id="brackets">How Tax Brackets Apply to Taxable Income</h2>
      <p>
        Brackets are marginal. Each rate applies only to the slice of taxable income inside its band, so moving into a higher
        bracket never makes your whole income taxed at the higher rate.
      </p>
      <DataTable
        caption="2026 ordinary income tax brackets by taxable income, IRS Rev. Proc. 2025-32."
        head={["Rate", "Single", "Married filing jointly"]}
        rows={bracketRows}
      />

      <h2 id="lower">Legitimate Ways to Lower Taxable Income</h2>
      <ul>
        <li><strong>Traditional 401(k) or 403(b):</strong> contributions come out of wages before federal tax.</li>
        <li><strong>HSA:</strong> payroll or direct contributions are excluded or deductible if you have a qualifying high-deductible plan.</li>
        <li><strong>Traditional IRA:</strong> deductible within income limits if you or a spouse has a workplace plan.</li>
        <li><strong>Pre-tax benefits:</strong> health, dental, vision premiums and dependent care FSA through a cafeteria plan.</li>
        <li><strong>Self-employed:</strong> business expenses, half of self-employment tax, and the qualified business income deduction.</li>
        <li><strong>Overtime and tips (2025–2028):</strong> new federal deductions for qualified overtime premium and tips; see <a href="/no-tax-on-overtime">no tax on overtime</a>.</li>
      </ul>
      <p>
        To see how a pre-tax contribution changes each paycheck rather than the annual return, try the{" "}
        <a href="/401k-paycheck-impact-calculator">401(k) paycheck impact calculator</a>. Knowing what taxable income is, and
        which line of the return it lives on, makes every other tax number easier to check.
      </p>
    </BlogArticle>
  );
}
