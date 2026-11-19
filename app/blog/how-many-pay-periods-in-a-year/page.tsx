import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { extraPaydayYears, payPeriodRows, usd2 } from "../../lib/blogPosts";

const SLUG = "how-many-pay-periods-in-a-year";
export const metadata = blogMetadata(SLUG);

const rowFor = (k: string) => payPeriodRows.find(r => r.key === k)!;
const weekly = rowFor("weekly");
const biweekly = rowFor("biweekly");

const faqs: Faq[] = [
  {
    q: "How many pay periods are in a year?",
    a: "It depends on the schedule: 52 for weekly pay, 26 for biweekly, 24 for semimonthly and 12 for monthly. Weekly and biweekly schedules occasionally have one extra pay period (53 or 27) when the calendar year contains an extra payday.",
  },
  {
    q: "What is a pay period?",
    a: "A pay period is the stretch of days an employer counts work for before issuing a paycheck, such as one week or the 1st through the 15th. The payday is the date the money is paid, which is often a few days to a week after the period ends.",
  },
  {
    q: "How many pay periods are in a year if paid biweekly?",
    a: "Twenty-six in most years. A year has 52 weeks plus one or two extra days, so roughly every 11 years a biweekly schedule fits 27 paydays into one calendar year.",
  },
  {
    q: "Are there 24 or 26 pay periods in a year?",
    a: "Both exist. Twenty-four is semimonthly (twice a month on set dates); twenty-six is biweekly (every two weeks). Check your pay stub or offer letter: if paydays fall on the same weekday, you are biweekly; if they fall on the same dates, you are semimonthly.",
  },
  {
    q: "How many weeks are in a pay period?",
    a: "One for weekly pay and two for biweekly. Semimonthly periods are about 2.17 weeks on average but vary from 13 to 16 days, and monthly periods average about 4.33 weeks.",
  },
  {
    q: "Does the number of pay periods change how much tax I pay?",
    a: "No. Withholding tables convert each check to an annual figure using the pay-period count, so the yearly total is the same on any schedule. What can drift is a 27th or 53rd paycheck year, where per-check withholding assumes the usual count and the extra check adds income.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="PAY FREQUENCY · PAYROLL BASICS"
      quickAnswer={
        <p>
          <strong>How many pay periods in a year</strong> depends on how often you are paid: <strong>52</strong> weekly,{" "}
          <strong>26</strong> biweekly, <strong>24</strong> semimonthly and <strong>12</strong> monthly. Weekly and biweekly
          schedules sometimes pick up one extra period, giving 53 or 27 paychecks that year. A $60,000 salary works out to{" "}
          {usd2(weekly.check.gross)} per weekly check or {usd2(biweekly.check.gross)} per biweekly check.
        </p>
      }
      takeaways={[
        "Weekly 52 · biweekly 26 · semimonthly 24 · monthly 12.",
        "A pay period is the work span a check covers; payday is when it is paid.",
        `27-paycheck biweekly years ahead for Friday payrolls: ${[...extraPaydayYears.biJan2, ...extraPaydayYears.biJan9].sort().join(", ")}.`,
        "Annual pay and annual tax do not depend on the count, only check size does.",
        "Divide salary by pay periods for gross per check; multiply a check by periods for annual pay.",
      ]}
      toc={[
        { id: "pay-periods", label: "Pay periods per year by schedule" },
        { id: "what-is-a-pay-period", label: "What is a pay period?" },
        { id: "per-check", label: "Pay per check on a $60,000 salary" },
        { id: "extra-period", label: "27 and 53 pay-period years" },
        { id: "math", label: "Using the count in pay math" },
        { id: "which", label: "How to tell which schedule you are on" },
        { id: "faq", label: "FAQ" },
      ]}
      howTo={{
        name: "How to find how many pay periods you have in a year",
        steps: [
          "Look at two consecutive paydays on your pay stubs or payroll portal.",
          "If they are 7 days apart you have 52 pay periods; 14 days apart, 26.",
          "If they fall on the same two dates each month you have 24; once a month, 12.",
          "Count paydays in the calendar year to spot a 27th or 53rd paycheck year.",
        ],
      }}
      faqs={faqs}
      sources={[
        { label: "IRS Publication 15-T, Federal Income Tax Withholding Methods, Table 3 (payroll periods)", url: "https://www.irs.gov/publications/p15t" },
        { label: "U.S. Department of Labor, State Payday Requirements", url: "https://www.dol.gov/agencies/whd/state/payday" },
        { label: "U.S. Bureau of Labor Statistics, How frequently do private businesses pay workers?", url: "https://www.bls.gov/opub/btn/volume-3/how-frequently-do-private-businesses-pay-workers.htm" },
        { label: "29 CFR 778.105, Determining the workweek", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778/subpart-B/section-778.105" },
      ]}
      related={[
        { href: "/weekly-paycheck-calculator", title: "Weekly Paycheck Calculator", blurb: "52 pay periods" },
        { href: "/biweekly-paycheck-calculator", title: "Biweekly Paycheck Calculator", blurb: "26 pay periods" },
        { href: "/monthly-paycheck-calculator", title: "Monthly Paycheck Calculator", blurb: "12 pay periods" },
      ]}
    >
      <h2 id="pay-periods">How Many Pay Periods in a Year for Each Pay Schedule</h2>
      <p>
        US employers use four standard schedules. The count of pay periods per year follows directly from how the schedule is
        defined, and it is the same count the IRS uses in the withholding tables of Publication 15-T.
      </p>
      <DataTable
        caption="Standard US pay schedules. Extra-period years apply to weekly and biweekly only."
        head={["Schedule", "Pay periods per year", "How paydays fall", "Occasional extra"]}
        rows={payPeriodRows.map(r => [
          r.label,
          String(r.periods),
          r.schedule,
          r.key === "weekly" ? "53" : r.key === "biweekly" ? "27" : "None",
        ])}
      />
      <p>
        Biweekly is the most common schedule in the US private sector, followed by weekly. Semimonthly is popular for salaried
        office staff, and monthly pay is more common outside the US than inside it; several states restrict how often an
        employer may pay monthly.
      </p>

      <h2 id="what-is-a-pay-period">What Is a Pay Period?</h2>
      <p>
        A <strong>pay period</strong> is the block of days your employer tallies work for before paying you. On a weekly
        schedule that might be Sunday through Saturday; on a semimonthly schedule, the 1st through the 15th and the 16th through
        month-end. Your pay stub shows it as &quot;period start&quot; and &quot;period end&quot; or as a date range.
      </p>
      <p>
        The pay period is not the same as <strong>payday</strong>. Payroll needs time to collect timesheets and run
        calculations, so most employers pay a few days to a week after the period closes. Someone whose period ends Saturday
        might be paid the following Friday. That lag is why your first paycheck at a new job can take two or three weeks to
        arrive.
      </p>
      <p>
        For overtime purposes, the Fair Labor Standards Act uses a different unit again: the <strong>workweek</strong>, a fixed
        seven-day span that the employer sets. A biweekly pay period holds exactly two workweeks; a semimonthly one does not,
        which matters for hourly workers.
      </p>

      <h2 id="per-check">Pay Per Check on a $60,000 Salary</h2>
      <p>
        Dividing the same salary by more pay periods makes each check smaller. Annual take-home stays the same because
        withholding scales with the count.
      </p>
      <DataTable
        caption="$60,000 salary, single filer, Texas, standard 2026 W-4. Calculated with our payroll engine."
        head={["Schedule", "Pay periods", "Gross per check", "Federal tax", "Social Security + Medicare", "Take-home per check"]}
        rows={payPeriodRows.map(r => [
          r.label,
          String(r.periods),
          usd2(r.check.gross),
          usd2(r.check.federal),
          usd2(r.check.socialSecurity + r.check.medicare),
          usd2(r.check.net),
        ])}
      />
      <p>
        Every row multiplies back to {usd2(weekly.check.netAnnual)} of take-home pay for the year. In a state with income tax,
        each check would be lower by the state withholding; the{" "}
        <a href="/state-paycheck-calculators">state paycheck calculators</a> handle that for every state.
      </p>

      <h2 id="extra-period">When There Are 27 or 53 Pay Periods in a Year</h2>
      <p>
        A calendar year is 365 days, which is 52 weeks plus one day (two in a leap year). Those spare days add up. Every so
        often a weekly schedule fits 53 paydays into one year, and a biweekly schedule fits 27.
      </p>
      <DataTable
        caption="Extra-payday years from 2026 through 2040 for Friday payrolls, computed by stepping each schedule forward from its 2026 paydays."
        head={["Schedule", "Years with an extra paycheck"]}
        rows={[
          ["Weekly, paid Fridays", extraPaydayYears.weekly.join(", ")],
          ["Biweekly, first 2026 payday Jan 2", extraPaydayYears.biJan2.join(", ")],
          ["Biweekly, first 2026 payday Jan 9", extraPaydayYears.biJan9.join(", ")],
        ]}
      />
      <p>
        In a 27-pay year, the January 2 cohort&apos;s first payday falls on January 1, 2027, a bank holiday, so many employers
        pay on December 31, 2026 instead. That moves the check into the earlier tax year and leaves 2027 with 26 paychecks. Ask
        payroll which way your employer handles it.
      </p>
      <Callout title="What a 27th paycheck means for salaried staff">
        <p>
          Employers either keep the per-check amount (so you earn slightly more than your stated salary that year) or divide the
          salary by 27 (so each check shrinks). Benefit deductions set as a fixed annual amount may also be split differently.
          Look for a notice from HR in the fall before an extra-period year.
        </p>
      </Callout>

      <h2 id="math">Using Pay Periods in Paycheck Math</h2>
      <Formula>
        Gross per check = annual salary ÷ pay periods per year
        <br />
        Annual pay = gross per check × pay periods per year
        <br />
        Monthly pay = gross per check × pay periods ÷ 12
      </Formula>
      <p>
        The count shows up in more places than you might expect: annualizing a check for a loan application, converting an
        hourly rate (2,080 hours ÷ 26 = 80 hours per biweekly period), setting a 401(k) contribution to hit the annual limit, or
        spreading an extra W-4 withholding amount across the remaining checks of the year. Using 24 when you are actually paid
        26 times is the most common slip, and it misstates annual income by about 8%.
      </p>

      <h2 id="which">How to Tell Which Pay Schedule You Are On</h2>
      <ol>
        <li>Find two recent pay stubs and note the pay dates.</li>
        <li>Seven days apart means weekly (52); fourteen days apart means biweekly (26).</li>
        <li>The same two dates every month (for example, the 15th and the 30th) means semimonthly (24).</li>
        <li>One date a month means monthly (12).</li>
      </ol>
      <p>
        If you are still unsure, the pay period dates printed on the stub settle it. For a side-by-side of the two schedules
        that cause the most confusion, read <a href="/blog/semimonthly-vs-biweekly">semimonthly vs biweekly pay</a>. Once you
        know how many pay periods in a year you have, the paycheck calculators for each schedule will show your exact
        take-home pay.
      </p>
    </BlogArticle>
  );
}
