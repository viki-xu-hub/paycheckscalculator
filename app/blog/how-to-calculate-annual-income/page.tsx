import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { ANNUAL_HOURS, annualFromHourly, annualIncomeGrid, annualNet, usd0, usd2 } from "../../lib/blogPosts";

const SLUG = "how-to-calculate-annual-income";
export const metadata = blogMetadata(SLUG);

const partTime = annualFromHourly(18, 25, 50);

const faqs: Faq[] = [
  {
    q: "How do I calculate my annual income?",
    a: "Multiply what you earn per period by the number of periods in a year. Hourly: rate × hours per week × 52. Weekly pay: × 52. Biweekly: × 26. Semimonthly: × 24. Monthly: × 12. Add overtime, bonuses, commission and side income separately, then total every source.",
  },
  {
    q: "What is my yearly income if I am paid by the hour?",
    a: "Take your pay rate times your usual weekly hours, then times the number of weeks you are paid for. At $25 an hour, 40 hours a week and 52 weeks, that is $52,000. If you take unpaid weeks off, use the actual number of paid weeks instead of 52.",
  },
  {
    q: "How do I calculate annual income with overtime?",
    a: "Calculate straight-time pay for 40 hours and overtime pay separately. A $20-an-hour worker averaging 45 hours earns 40 × $20 = $800 plus 5 × $30 = $150 a week, or $49,400 a year over 52 weeks. Lenders often average overtime over two years before counting it.",
  },
  {
    q: "Can I work out yearly income from one pay stub?",
    a: "Divide year-to-date gross by the number of paychecks received so far this year, then multiply by your pay periods per year. That smooths out variable hours and avoids the error of dividing by months elapsed after a three-paycheck month.",
  },
  {
    q: "How do I calculate annual income if I am self-employed?",
    a: "Use net profit, not total revenue: gross receipts minus business expenses, the figure on Schedule C line 31. For a partial year, divide profit to date by the months you have operated and multiply by 12, but expect lenders to use your last two tax returns.",
  },
  {
    q: "Is annual income calculated before or after taxes?",
    a: "Before, unless a form asks for net or take-home income. To get net annual income, take out income taxes, FICA and any benefit or retirement deductions, or multiply take-home per check by your pay periods per year.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="INCOME MATH · HOURLY & SALARY"
      quickAnswer={
        <p>
          <strong>How to calculate annual income:</strong> multiply your pay per period by the number of periods in a year.
          Hourly workers use <strong>rate × hours per week × 52</strong> ($25 × 40 × 52 = $52,000). Salaried workers start with
          the salary. Paid by check? Multiply gross per check by 52, 26, 24 or 12. Then add overtime, bonuses and side income as
          separate lines.
        </p>
      }
      takeaways={[
        "Hourly: rate × weekly hours × paid weeks.",
        "Per check: gross × 52 weekly, 26 biweekly, 24 semimonthly, 12 monthly.",
        "Overtime: figure the 1.5× hours separately before annualizing.",
        "Variable pay: annualize from year-to-date gross per paycheck.",
        "Self-employed: use profit after expenses, not revenue.",
      ]}
      toc={[
        { id: "formula", label: "The basic formula" },
        { id: "hourly", label: "From an hourly wage" },
        { id: "overtime", label: "With overtime or variable hours" },
        { id: "salary", label: "From a salary or partial year" },
        { id: "paystub", label: "From a pay stub" },
        { id: "multiple", label: "Several jobs and 1099 work" },
        { id: "net", label: "Net annual income" },
        { id: "faq", label: "FAQ" },
      ]}
      howTo={{
        name: "How to calculate annual income",
        steps: [
          "Find your gross pay for one period: an hourly rate, a weekly or biweekly check, or a monthly salary.",
          "Multiply by the number of periods you are paid for in a year (hours × 52 weeks, or 52, 26, 24 or 12 checks).",
          "Add overtime, bonuses, commission and tips as separate annual amounts.",
          "Add income from any other job or self-employment profit to get total annual income.",
        ],
      }}
      faqs={faqs}
      sources={[
        { label: "U.S. Department of Labor, Overtime Pay under the FLSA", url: "https://www.dol.gov/agencies/whd/overtime" },
        { label: "Fannie Mae Selling Guide B3-3.1-01, General Income Information", url: "https://selling-guide.fanniemae.com/sel/b3-3.1-01/general-income-information" },
        { label: "IRS, About Schedule C (Form 1040), Profit or Loss From Business", url: "https://www.irs.gov/forms-pubs/about-schedule-c-form-1040" },
        { label: "IRS Publication 15-T, Federal Income Tax Withholding Methods", url: "https://www.irs.gov/publications/p15t" },
      ]}
      related={[
        { href: "/hourly", title: "Hourly Wage to Salary Tables", blurb: "Every hourly rate as annual, monthly and take-home pay" },
        { href: "/salary", title: "Salary After Tax Tables", blurb: "Annual salaries broken into take-home by state" },
        { href: "/what-is-annual-income", title: "What Is Annual Income?", blurb: "What counts and what does not" },
      ]}
    >
      <h2 id="formula">How to Calculate Annual Income: The Basic Formula</h2>
      <p>
        Every method on this page is the same idea: take what you earn over a short, known period and scale it to a year. What
        changes is the period. If you want to know what counts as income in the first place (salary, tips, interest, and so
        on), start with <a href="/what-is-annual-income">what annual income means</a>. This guide is about the arithmetic.
      </p>
      <Formula>
        Annual income = pay per period × periods per year
        <br />
        Hourly: rate × hours per week × 52 · Weekly: × 52 · Biweekly: × 26 · Semimonthly: × 24 · Monthly: × 12
      </Formula>
      <p>
        Use <strong>gross</strong> pay, the figure before tax and deductions, unless a form specifically asks for take-home.
        Mortgage, rental and credit applications nearly always mean gross.
      </p>

      <h2 id="hourly">Calculate Annual Income From an Hourly Wage</h2>
      <p>
        Full-time is usually defined as 40 hours a week, or 2,080 hours a year, so a full-time hourly rate times 2,080 gives
        annual income. Part-time and seasonal workers should use their real schedule.
      </p>
      <DataTable
        caption="Gross annual income by hourly rate and weekly hours, 52 paid weeks. Hours over 40 are paid at 1.5×."
        head={["Hourly rate", ...ANNUAL_HOURS.map(h => `${h} h/week`)]}
        rows={annualIncomeGrid.map(r => [usd2(r.rate), ...r.values.map(v => usd0(v))])}
      />
      <p>
        If you do not get paid time off, use the weeks you actually work. A part-time employee earning $18 an hour for 25 hours
        a week who takes two unpaid weeks has {usd0(partTime)} of annual income ($18 × 25 × 50), not $23,400. For any specific
        rate, the <a href="/hourly">hourly wage tables</a> show annual, monthly, biweekly and take-home figures side by side.
      </p>

      <h2 id="overtime">Annual Income With Overtime or Variable Hours</h2>
      <p>
        Federal law pays time and a half once a workweek passes 40 hours, so
        total hours times your base rate will undercount overtime weeks. Split each week into the first 40 hours and the overtime hours:
      </p>
      <Formula>
        Weekly gross = 40 × rate + overtime hours × rate × 1.5
        <br />
        Annual income = weekly gross × 52
      </Formula>
      <p>
        At $20 an hour and a steady 45-hour week, that is $800 + $150 = $950 a week and {usd0(annualFromHourly(20, 45))} a
        year. When overtime comes and goes, average it: total your overtime pay for the last several months and scale that to a
        year. Lenders following Fannie Mae guidelines generally want a two-year history of overtime before counting it, and
        they average it over that period. The <a href="/blog/how-to-calculate-overtime-pay">overtime pay guide</a> covers
        bonuses that change the regular rate.
      </p>

      <h2 id="salary">Calculate Annual Income From a Salary or a Partial Year</h2>
      <p>
        A salary already is annual income for a full year. Two situations need adjustment:
      </p>
      <ul>
        <li>
          <strong>Starting or leaving mid-year.</strong> Calendar-year income is salary × months worked ÷ 12. Starting a
          $72,000 job on September 1 produces $24,000 of 2026 income.
        </li>
        <li>
          <strong>Raises during the year.</strong> Weight each rate by the months it applied. Six months at $60,000 and six at
          $66,000 is $63,000.
        </li>
      </ul>
      <p>
        For a quick read on what a salary leaves after tax, the <a href="/salary">salary tables</a> break common salaries into
        take-home pay by pay period and state.
      </p>

      <h2 id="paystub">Calculate Annual Income From a Pay Stub</h2>
      <p>
        A single check is a snapshot. The year-to-date (YTD) gross on your latest stub is a better base, because it captures
        every overtime week and unpaid day so far.
      </p>
      <Formula>Annual income = YTD gross ÷ paychecks received this year × paychecks per year</Formula>
      <p>
        For example, a biweekly worker whose 20th stub shows $46,000 of YTD gross has averaged $2,300 a check, which is $59,800
        over 26 checks. Avoid dividing YTD by months elapsed: right after a three-paycheck month it overstates income. The{" "}
        <a href="/ytd-calculator">YTD calculator</a> does this projection, and <a href="/blog/how-to-read-a-pay-stub">how to
        read a pay stub</a> shows where the YTD column sits.
      </p>

      <h2 id="multiple">Several Jobs, Side Income and 1099 Work</h2>
      <p>
        Total annual income adds every source. Annualize each one on its own schedule and then sum them:
      </p>
      <DataTable
        caption="Example: three income sources, each converted to a year before adding."
        head={["Source", "Amount", "Conversion", "Annual"]}
        rows={[
          ["Main job, biweekly gross", "$2,000", "× 26", "$52,000"],
          ["Weekend job, $16/h × 12 h/week", "$192 a week", "× 52", "$9,984"],
          ["Freelance profit (revenue − expenses)", "$6,500 to date over 10 months", "÷ 10 × 12", "$7,800"],
          ["Total annual income", "", "", "$69,784"],
        ]}
      />
      <p>
        For freelance or contract work the figure is <strong>profit</strong>: revenue minus business expenses. A contractor
        who billed $90,000 and spent $18,000 on equipment, software and mileage has $72,000 of annual income. Reporting and tax on that
        income are covered in our <a href="/blog/what-is-a-1099-form">1099 form guide</a>.
      </p>

      <h2 id="net">Net Annual Income: After Tax</h2>
      <p>
        Net annual income is the part of gross that survives withholding and benefit deductions. Gross is the same everywhere; net depends on where you live.
      </p>
      <DataTable
        caption={`${usd0(annualNet.gross)} salary ($25/hour full-time), single filer, standard 2026 W-4, no pre-tax deductions. From our payroll engine.`}
        head={["State", "Gross annual income", "Net annual income", "Kept"]}
        rows={[
          ["Texas", usd0(annualNet.gross), usd0(annualNet.tx), `${Math.round((annualNet.tx / annualNet.gross) * 100)}%`],
          ["California", usd0(annualNet.gross), usd0(annualNet.ca), `${Math.round((annualNet.ca / annualNet.gross) * 100)}%`],
          ["New York", usd0(annualNet.gross), usd0(annualNet.ny), `${Math.round((annualNet.ny / annualNet.gross) * 100)}%`],
        ]}
      />
      <Callout title="Fastest route to net">
        <p>
          Multiply the take-home amount on one regular paycheck by your pay periods per year. Recheck after any raise, benefit
          change or W-4 update, since each one changes net pay.
        </p>
      </Callout>
      <p>
        Once you know how to calculate annual income for each kind of pay you receive, the total is just addition. Keep the
        working (rates, hours, periods) next to the figure; anyone reviewing an application will want to reproduce it.
      </p>
    </BlogArticle>
  );
}
