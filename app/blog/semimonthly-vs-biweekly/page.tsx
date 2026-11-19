import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { MONTH_NAMES, biweeklyPaydays2026, extraPaydayYears, semiHourly, semiVsBiRows, usd2 } from "../../lib/blogPosts";

const SLUG = "semimonthly-vs-biweekly";
export const metadata = blogMetadata(SLUG);

const row60 = semiVsBiRows.find(r => r.salary === 60000)!;
const jan2 = biweeklyPaydays2026(2);
const jan9 = biweeklyPaydays2026(9);
const months = (list: number[]) => list.map(m => MONTH_NAMES[m]).join(" and ");

const faqs: Faq[] = [
  {
    q: "What is the difference between semimonthly and biweekly pay?",
    a: "Semimonthly pay arrives twice a month on two fixed dates, such as the 15th and the last day, for 24 paychecks a year. Biweekly pay arrives every other week on the same weekday, for 26 paychecks a year. Annual pay is identical; each semimonthly check is larger because the salary is split into fewer pieces.",
  },
  {
    q: "Is semimonthly or biweekly better for employees?",
    a: "Neither pays more over a year. Semimonthly suits people whose bills fall on fixed calendar dates, since every month has exactly two paychecks. Biweekly suits people who like a predictable weekday payday and the two extra paychecks that arrive in three-paycheck months, which make natural savings or debt-payoff windows.",
  },
  {
    q: "Is semimonthly every 15 days?",
    a: "Roughly, but not exactly. Semimonthly paydays are tied to dates, not a day count, so the gap between checks ranges from 13 to 16 days depending on the month. Biweekly is always exactly 14 days apart.",
  },
  {
    q: "How do I convert a semimonthly paycheck to an annual salary?",
    a: `Multiply the gross semimonthly amount by 24. A ${usd2(row60.semimonthly.gross)} semimonthly gross equals ${usd2(row60.semimonthly.gross * 24)} a year. For biweekly, multiply by 26 instead; using the wrong multiplier misstates annual pay by about 8%.`,
  },
  {
    q: "Is more tax taken out of a semimonthly paycheck?",
    a: "Each semimonthly check withholds a little more in dollars because the check is bigger, but the annual total is the same. The IRS percentage method annualizes each paycheck by its pay-period count, so 24 larger checks and 26 smaller ones produce the same yearly federal withholding, Social Security and Medicare.",
  },
  {
    q: "How is overtime handled on a semimonthly schedule?",
    a: "Overtime is still calculated per workweek under the FLSA, not per pay period. Because a semimonthly period does not line up with workweeks, payroll often pays overtime from a week that straddles two periods on the later check, which is why hourly workers usually prefer biweekly pay.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="PAY FREQUENCY · PAYCHECK BASICS"
      quickAnswer={
        <p>
          <strong>Semimonthly vs biweekly</strong> comes down to the count: semimonthly pays <strong>24</strong> times a year on two
          fixed dates each month, while biweekly pays <strong>26</strong> times a year, every other week. On a $60,000 salary a
          semimonthly check is {usd2(row60.semimonthly.gross)} gross and a biweekly check is {usd2(row60.biweekly.gross)} gross, yet
          both add up to the same {usd2(row60.salary)} and the same annual take-home pay.
        </p>
      }
      takeaways={[
        "Semimonthly = 24 checks on fixed dates; biweekly = 26 checks every 14 days.",
        "Annual pay and annual tax are identical; only the per-check size changes.",
        `Biweekly workers get two three-paycheck months in 2026 (${months(jan2.threeCheckMonths)} or ${months(jan9.threeCheckMonths)} for Friday payers).`,
        "Semimonthly lines up with monthly bills; biweekly lines up with workweeks.",
        "Hourly staff are usually paid biweekly because overtime is figured per workweek.",
      ]}
      toc={[
        { id: "difference", label: "Semimonthly vs biweekly at a glance" },
        { id: "paycheck-size", label: "How each paycheck compares" },
        { id: "calendar", label: "Paydays across a year" },
        { id: "hourly", label: "Hourly pay and overtime" },
        { id: "budgeting", label: "Budgeting on each schedule" },
        { id: "employers", label: "Why employers choose one" },
        { id: "convert", label: "Converting between the two" },
        { id: "faq", label: "FAQ" },
      ]}
      faqs={faqs}
      sources={[
        { label: "IRS Publication 15-T, Federal Income Tax Withholding Methods (pay periods per year)", url: "https://www.irs.gov/publications/p15t" },
        { label: "29 CFR 778.104, Each workweek stands alone", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778/subpart-B/section-778.104" },
        { label: "U.S. Department of Labor, State Payday Requirements", url: "https://www.dol.gov/agencies/whd/state/payday" },
        { label: "U.S. Department of Labor, Overtime Pay", url: "https://www.dol.gov/agencies/whd/overtime" },
      ]}
      related={[
        { href: "/semimonthly-paycheck-calculator", title: "Semimonthly Paycheck Calculator", blurb: "Take-home on 24 checks a year" },
        { href: "/biweekly-paycheck-calculator", title: "Biweekly Paycheck Calculator", blurb: "Take-home on 26 checks a year" },
        { href: "/biweekly-pay", title: "Biweekly Pay Chart 2026–27", blurb: "Every biweekly pay date and three-check month" },
      ]}
    >
      <h2 id="difference">Semimonthly vs Biweekly Pay at a Glance</h2>
      <p>
        The two words sound alike and both describe &quot;twice-ish a month,&quot; which is why they get confused on job offers
        and pay stubs. The difference is what the schedule is anchored to. <strong>Semimonthly</strong> is anchored to the
        calendar: you are paid on two set dates every month, commonly the 15th and the last day, or the 1st and the 15th.{" "}
        <strong>Biweekly</strong> is anchored to the week: you are paid every second Friday (or whichever weekday your employer
        uses), regardless of the date.
      </p>
      <DataTable
        caption="Core differences between the two schedules."
        head={["", "Semimonthly", "Biweekly"]}
        rows={[
          ["Paychecks per year", "24", "26 (27 in some years)"],
          ["Paychecks per month", "Always 2", "2, or 3 in two months a year"],
          ["Payday", "Fixed dates, e.g. 15th and last day", "Same weekday every 14 days"],
          ["Days between checks", "13 to 16", "Always 14"],
          ["Hours per check (full-time hourly)", "Varies, about 80 to 96", "Always 80"],
          ["Monthly income math", "Check × 2", "Check × 26 ÷ 12"],
        ]}
      />
      <p>
        If you remember one thing, make it the count. Twenty-four versus twenty-six drives every other difference in the table,
        from check size to how you convert pay into a monthly budget.
      </p>

      <h2 id="paycheck-size">Semimonthly vs Biweekly Paycheck Size and Take-Home Pay</h2>
      <p>
        A salary is divided by the number of pay periods, so a semimonthly check is always bigger than a biweekly one at the same
        salary, by a factor of 26 ÷ 24, or about 8.3%. Withholding scales the same way. The IRS percentage method in Publication
        15-T annualizes each paycheck using its own pay-period count, which means the yearly federal income tax, Social Security
        and Medicare come out the same on either schedule.
      </p>
      <DataTable
        caption="Single filer, Texas (no state income tax), 2026 W-4 with no adjustments. Figures from our payroll engine."
        head={["Salary", "Semimonthly gross", "Semimonthly take-home", "Biweekly gross", "Biweekly take-home", "Annual take-home (both)"]}
        rows={semiVsBiRows.map(r => [
          usd2(r.salary),
          usd2(r.semimonthly.gross),
          usd2(r.semimonthly.net),
          usd2(r.biweekly.gross),
          usd2(r.biweekly.net),
          usd2(r.biweekly.netAnnual),
        ])}
      />
      <p>
        So the bigger semimonthly check is not a raise, and the smaller biweekly check is not a pay cut. On a $60,000 salary,
        24 × {usd2(row60.semimonthly.net)} and 26 × {usd2(row60.biweekly.net)} both land at {usd2(row60.biweekly.netAnnual)} of
        take-home pay. If you change jobs and the new check looks smaller, check the pay frequency before you assume something
        is wrong.
      </p>

      <h2 id="calendar">Semimonthly vs Biweekly Paydays Across a Year</h2>
      <h3>Semimonthly: always two</h3>
      <p>
        Every month has exactly two semimonthly paydays. When a payday lands on a weekend or bank holiday, most employers pay on
        the business day before, so the deposit date shifts by a day or two while the count stays fixed. That regularity is the
        main appeal: rent due on the 1st and a car payment due on the 15th each have a paycheck in front of them every month.
      </p>
      <h3>Biweekly: two, sometimes three</h3>
      <p>
        Fourteen-day cycles drift across the calendar, so ten months get two biweekly paydays and two months get a third. For
        Friday payrolls in 2026, employees whose first payday was January 2 receive three checks in {months(jan2.threeCheckMonths)};
        those first paid on January 9 receive three in {months(jan9.threeCheckMonths)}.
      </p>
      <p>
        Every 11 years or so a biweekly schedule picks up a <strong>27th paycheck</strong> in the calendar year. For the January 2
        Friday cohort, that next happens in {extraPaydayYears.biJan2.join(" and ")}; for the January 9 cohort, in{" "}
        {extraPaydayYears.biJan9.join(" and ")}. Salaried employees are usually paid the same amount per check that year, so W-2
        wages run higher than the stated salary. Our <a href="/biweekly-pay">biweekly pay chart</a> lists every 2026 and 2027 pay
        date.
      </p>

      <h2 id="hourly">Semimonthly vs Biweekly for Hourly Pay and Overtime</h2>
      <p>
        Under the Fair Labor Standards Act each workweek stands alone: overtime is owed for hours over 40 in a fixed seven-day
        week, and you cannot average two weeks together. A biweekly period is exactly two workweeks, so payroll can total hours
        and overtime cleanly. A semimonthly period is not. It might hold 10, 11 or 12 workdays, and a workweek can start in one
        period and end in the next.
      </p>
      <Formula>
        Full-time hourly, biweekly: rate × 80 hours, every check
        <br />
        Full-time hourly, semimonthly: rate × 80 to 96 hours, depending on workdays in the period
      </Formula>
      <p>
        At {usd2(semiHourly.rate)} an hour and 40 hours a week, a biweekly check is always {usd2(semiHourly.biweeklyGross)} gross.
        On a semimonthly schedule the same worker averages {semiHourly.avgHours} hours and {usd2(semiHourly.avgGross)} per check,
        but individual checks swing between roughly {usd2(semiHourly.lowGross)} and {usd2(semiHourly.highGross)}. Overtime from a
        week that straddles the cutoff is typically paid on the following check. That is legal, but it makes checks harder to
        predict, which is why hourly and non-exempt staff are far more often on biweekly or weekly pay. Use the{" "}
        <a href="/overtime-calculator">overtime calculator</a> to work out a week with extra hours.
      </p>

      <h2 id="budgeting">Budgeting on a Semimonthly vs Biweekly Schedule</h2>
      <ul>
        <li>
          <strong>Semimonthly:</strong> split fixed bills into a first-half and second-half list. Each check covers the same
          bills every month, and monthly income is simply two checks.
        </li>
        <li>
          <strong>Biweekly:</strong> build the budget on two checks a month and treat each third check as surplus. Two extra
          checks a year (one more in a 27-pay year) can fund an emergency account or an extra loan payment without touching the
          regular budget.
        </li>
        <li>
          <strong>Both:</strong> budget on take-home, not gross, and recheck after open enrollment, since new benefit
          deductions change every check.
        </li>
      </ul>
      <Callout title="Watch the monthly-income trap">
        <p>
          Doubling a biweekly check to get monthly income understates it by about 8.3%. Use check × 26 ÷ 12 instead. The full
          method is in our guide to{" "}
          <a href="/blog/how-to-calculate-gross-monthly-income-from-biweekly-paycheck">gross monthly income from biweekly pay</a>.
        </p>
      </Callout>

      <h2 id="employers">Why Employers Pick Semimonthly or Biweekly</h2>
      <p>
        Employers weigh cost against convenience. Semimonthly means 24 payroll runs a year instead of 26, two fewer rounds of
        processing fees and approvals, and paydays that line up with monthly benefit premiums and accounting closes. Biweekly
        keeps hourly payroll simple and gives employees a consistent payday. Many companies run both: salaried staff on
        semimonthly, hourly staff on biweekly.
      </p>
      <p>
        State law also limits the choice. Most states set a minimum pay frequency, and several require at least semimonthly
        pay for most workers; a few restrict monthly pay to exempt or executive staff. The Department of Labor keeps a{" "}
        <a href="https://www.dol.gov/agencies/whd/state/payday" target="_blank" rel="noopener noreferrer">state payday table</a>{" "}
        with the current rule for each state.
      </p>

      <h2 id="convert">Converting Semimonthly and Biweekly Pay</h2>
      <DataTable
        caption="Multiply gross pay per check by the factor shown."
        head={["To get", "From semimonthly", "From biweekly"]}
        rows={[
          ["Annual", "× 24", "× 26"],
          ["Monthly", "× 2", "× 26 ÷ 12 (2.1667)"],
          ["The other schedule", "× 24 ÷ 26 (0.9231)", "× 26 ÷ 24 (1.0833)"],
          ["Hourly (40 h/week)", "× 24 ÷ 2,080", "÷ 80"],
        ]}
      />
      <p>
        For a full gross-to-net figure on your own salary, run it through the{" "}
        <a href="/semimonthly-paycheck-calculator">semimonthly paycheck calculator</a> or the{" "}
        <a href="/biweekly-paycheck-calculator">biweekly paycheck calculator</a>. Both apply 2026 federal and state withholding
        to the pay-period count you choose. Whichever schedule you are on, semimonthly vs biweekly changes only how your pay is
        sliced, not how much of it you keep.
      </p>
    </BlogArticle>
  );
}
