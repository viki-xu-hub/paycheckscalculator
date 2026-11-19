import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { OT_RATE, overtimeBonus as bonus, overtimeCalifornia as ca, overtimeRows, overtimeTakeHome as th, usd0, usd2 } from "../../lib/blogPosts";
import { OT_DEDUCTION_CAP, OT_PHASEOUT_START, OT_YEARS } from "../../lib/overtimeDeduction";

const SLUG = "how-to-calculate-overtime-pay";
export const metadata = blogMetadata(SLUG);

const r50 = overtimeRows.find(r => r.hours === 50)!;

const faqs: Faq[] = [
  {
    q: "What is the formula for overtime pay?",
    a: "Take the regular rate, multiply by 1.5, and apply the result to every hour past 40 in the workweek. Add it to 40 hours of regular pay. At $20 an hour and 50 hours: 40 × $20 = $800, plus 10 × $30 = $300, for $1,100.",
  },
  {
    q: "How much is time and a half on a $20 wage?",
    a: "It comes to $30 per hour. Time and a half means 1.5 times the regular rate. Double time, which some states and contracts require, would be $40 an hour.",
  },
  {
    q: "Is overtime calculated per day or per week?",
    a: "Under federal law, per workweek: hours over 40 in a fixed seven-day period. A few states add daily overtime. California requires 1.5× for hours over 8 in a day and 2× over 12, and Alaska and Nevada have daily rules with exceptions. Where state and federal rules differ, the employer must follow whichever is more generous.",
  },
  {
    q: "Do bonuses count toward overtime pay?",
    a: "Nondiscretionary bonuses do: production, attendance, safety and shift bonuses promised in advance must be added to straight-time pay to find the regular rate. Truly discretionary bonuses, gifts and some reimbursements are excluded.",
  },
  {
    q: "Is overtime taxed more than regular pay?",
    a: "No. Overtime is taxed at the same rates as regular wages, but a big check can look over-taxed because withholding annualizes it as if you earned that much every period. For 2025 through 2028 the federal overtime deduction lets eligible workers deduct the premium portion of qualified overtime, up to $12,500 or $25,000 for joint filers.",
  },
  {
    q: "Do salaried employees get overtime?",
    a: "Salaried non-exempt employees do. Divide the weekly salary by the hours it is meant to cover to get the regular rate, then pay 1.5× for hours over 40. Exempt employees, those who meet the FLSA salary and duties tests, are not owed overtime under federal law.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="OVERTIME · WAGE MATH"
      quickAnswer={
        <p>
          <strong>How to calculate overtime pay:</strong> multiply your regular rate by <strong>1.5</strong>, then by the hours
          worked over <strong>40</strong> in the workweek, and add 40 hours of regular pay. At {usd2(OT_RATE)} an hour, a 50-hour
          week pays 40 × {usd2(OT_RATE)} + 10 × {usd2(OT_RATE * 1.5)} = <strong>{usd2(r50.total)}</strong>. If you earn a
          production or attendance bonus, it must be folded into the regular rate first.
        </p>
      }
      takeaways={[
        "Overtime = regular rate × 1.5 × hours over 40 in a workweek.",
        "Each workweek stands alone; two weeks cannot be averaged.",
        "Nondiscretionary bonuses raise the regular rate.",
        "California adds daily overtime (over 8 h) and double time (over 12 h).",
        `Overtime premium may be deductible ${OT_YEARS}; FICA still applies.`,
      ]}
      toc={[
        { id: "formula", label: "The overtime pay formula" },
        { id: "examples", label: "Worked examples" },
        { id: "regular-rate", label: "Regular rate and bonuses" },
        { id: "salaried", label: "Salaried non-exempt workers" },
        { id: "state", label: "Daily overtime and state rules" },
        { id: "tax", label: "How overtime is taxed" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "faq", label: "FAQ" },
      ]}
      howTo={{
        name: "How to calculate overtime pay",
        steps: [
          "Add up hours worked in the fixed seven-day workweek.",
          "Find the regular rate: total straight-time pay plus nondiscretionary bonuses, divided by total hours.",
          "Multiply the regular rate by 1.5 for the overtime rate.",
          "Multiply the overtime rate by hours over 40 and add 40 hours of regular pay (or use the half-time premium method when a bonus is involved).",
        ],
      }}
      faqs={faqs}
      sources={[
        { label: "U.S. Department of Labor, Overtime Pay", url: "https://www.dol.gov/agencies/whd/overtime" },
        { label: "29 CFR 778.109 and 778.110, The regular rate and bonuses", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778/subpart-C" },
        { label: "DOL Fact Sheet #56C, Bonuses under the FLSA", url: "https://www.dol.gov/agencies/whd/fact-sheets/56c-bonuses" },
        { label: "California Labor Commissioner, Overtime FAQ", url: "https://www.dir.ca.gov/dlse/faq_overtime.htm" },
        { label: "IRS, One Big Beautiful Bill provisions: no tax on overtime", url: "https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions" },
      ]}
      related={[
        { href: "/overtime-calculator", title: "Overtime Calculator", blurb: "Time and a half and double time for any rate" },
        { href: "/no-tax-on-overtime", title: "No Tax on Overtime 2026", blurb: "Who qualifies and what the deduction is worth" },
        { href: "/hourly-paycheck-calculator", title: "Hourly Paycheck Calculator", blurb: "Take-home with overtime hours" },
      ]}
    >
      <h2 id="formula">How to Calculate Overtime Pay: The Formula</h2>
      <p>
        The Fair Labor Standards Act requires covered, non-exempt employees to be paid at least <strong>one and a half
        times their regular rate</strong> for every hour over 40 in a workweek. The workweek is a fixed, recurring 168-hour
        period the employer chooses, such as Sunday 12:00 a.m. to Saturday 11:59 p.m. It does not have to match the pay period.
      </p>
      <Formula>
        Overtime rate = regular rate × 1.5
        <br />
        Weekly pay = 40 × regular rate + overtime hours × overtime rate
      </Formula>
      <p>
        An equivalent way to write it, which payroll systems use when bonuses are involved, is to pay every hour at the
        regular rate and then add a <strong>half-time premium</strong> for each overtime hour: hours × rate + overtime hours ×
        rate × 0.5. Both methods give the same answer when there is no bonus.
      </p>

      <h2 id="examples">Overtime Pay Examples at {usd2(OT_RATE)} an Hour</h2>
      <DataTable
        caption={`Weekly gross for a ${usd2(OT_RATE)}/hour non-exempt employee under the federal 40-hour rule.`}
        head={["Hours worked", "Overtime hours", "All hours at base rate", "Half-time premium", "Weekly gross"]}
        rows={overtimeRows.map(r => [String(r.hours), String(r.otHours), usd2(r.straight), usd2(r.premium), usd2(r.total)])}
      />
      <p>
        Each extra overtime hour adds {usd2(OT_RATE * 1.5)} of gross pay. Over a year, ten hours of overtime a week turns a
        $41,600 job into a $57,200 one. The <a href="/overtime-calculator">overtime calculator</a> handles any rate, double
        time and mixed weeks.
      </p>

      <h2 id="regular-rate">The Regular Rate: When Bonuses Change Overtime</h2>
      <p>
        The &quot;regular rate&quot; is not always your base hourly wage. Under 29 CFR 778.109 it is total straight-time
        compensation for the week divided by total hours worked, and it must include nondiscretionary pay such as production
        bonuses, attendance or safety bonuses, shift differentials and commissions.
      </p>
      <p>
        Example: {usd2(bonus.rate)} an hour, {bonus.hours} hours, and a {usd2(bonus.bonus)} weekly production bonus.
      </p>
      <DataTable
        caption="Bonus folded into the regular rate, the method in 29 CFR 778.110(b)."
        head={["Step", "Calculation", "Amount"]}
        rows={[
          ["Straight-time pay", `${bonus.hours} × ${usd2(bonus.rate)}`, usd2(bonus.straight)],
          ["Add the bonus", `${usd2(bonus.straight)} + ${usd2(bonus.bonus)}`, usd2(bonus.straight + bonus.bonus)],
          ["Regular rate", `${usd2(bonus.straight + bonus.bonus)} ÷ ${bonus.hours} hours`, usd2(bonus.regularRate)],
          ["Overtime premium", `${bonus.hours - 40} × ${usd2(bonus.regularRate)} × 0.5`, usd2(bonus.premium)],
          ["Total weekly pay", "Straight time + bonus + premium", usd2(bonus.total)],
        ]}
      />
      <p>
        Ignoring the bonus when figuring overtime would pay {usd2(bonus.naive)}, short by {usd2(bonus.total - bonus.naive)}.
        Small per week, but regular-rate errors are among the most common wage-and-hour violations the Department of Labor
        recovers. Bonuses paid quarterly or annually must be spread back over the weeks they cover, which usually produces a
        separate overtime true-up payment.
      </p>

      <h2 id="salaried">Overtime for Salaried Non-Exempt Employees</h2>
      <p>
        A salary alone never settles exempt status. A salaried non-exempt employee&apos;s regular rate is the
        weekly salary divided by the hours the salary is intended to cover. If a $1,000 weekly salary covers 40 hours, the
        regular rate is $25 and each overtime hour is $37.50. If it is meant to cover 45 hours, the regular rate is $22.22 and
        only the half-time premium ($11.11) is owed for hours 41 to 45, with time and a half after that. Whether you are owed
        overtime at all depends on the tests in <a href="/blog/exempt-vs-non-exempt-employee">exempt vs non-exempt status</a>.
      </p>

      <h2 id="state">Daily Overtime and State Rules</h2>
      <p>
        States can be stricter than federal law, and the employee gets whichever rule pays more. California is the best-known
        example:
      </p>
      <ul>
        <li>1.5× for hours over 8 in a workday and over 40 in a workweek.</li>
        <li>1.5× for the first 8 hours on the seventh consecutive day worked in a workweek.</li>
        <li>2× for hours over 12 in a day, and over 8 on the seventh consecutive day.</li>
      </ul>
      <p>
        So a California worker on four 10-hour days at {usd2(ca.rate)} earns {ca.straightHours} hours at the base rate plus{" "}
        {ca.otHours} daily-overtime hours, {usd2(ca.total)} for the week, even though the week totals exactly 40 hours. Under
        federal rules alone that week would pay {usd2(ca.federalOnly)}. Employers can avoid daily overtime only through a
        properly adopted alternative workweek schedule. Daily overtime rules also exist in Alaska, Nevada and Colorado, and each
        state carves out its own exceptions.
      </p>

      <h2 id="tax">How Overtime Pay Is Taxed</h2>
      <p>
        Overtime is ordinary wages. It is subject to federal and state income tax withholding, Social Security and Medicare
        like any other pay. A long week can look heavily taxed because payroll annualizes each check:
      </p>
      <DataTable
        caption={`Weekly paycheck at ${usd2(OT_RATE)}/hour, single filer, Texas, 2026 W-4. From our payroll engine.`}
        head={["Week", "Gross", "Federal tax", "FICA", "Take-home"]}
        rows={[
          ["40 hours", usd2(th.base.gross), usd2(th.base.federal), usd2(th.base.socialSecurity + th.base.medicare), usd2(th.base.net)],
          ["50 hours", usd2(th.ot.gross), usd2(th.ot.federal), usd2(th.ot.socialSecurity + th.ot.medicare), usd2(th.ot.net)],
        ]}
      />
      <p>
        The extra {usd2(th.extraGross)} of gross adds {usd2(th.extraNet)} of take-home that week. Withholding on the overtime
        portion is higher than on the base because the annualized income lands in a higher bracket, and you settle the real
        figure when you file.
      </p>
      <Callout title="The 2025–2028 overtime deduction">
        <p>
          The One Big Beautiful Bill Act lets eligible workers deduct the <em>premium</em> part of qualified FLSA overtime (the
          extra half, not the whole overtime wage) from federal taxable income, up to {usd0(OT_DEDUCTION_CAP.single)} a year, or{" "}
          {usd0(OT_DEDUCTION_CAP.married)} on a joint return, with the cap shrinking once modified AGI tops {usd0(OT_PHASEOUT_START.single)}
          (or {usd0(OT_PHASEOUT_START.married)} for couples). It does not change withholding or FICA. Details are on our{" "}
          <a href="/no-tax-on-overtime">no tax on overtime</a> page.
        </p>
      </Callout>

      <h2 id="mistakes">Common Overtime Calculation Mistakes</h2>
      <ul>
        <li><strong>Averaging two weeks.</strong> 30 hours one week and 50 the next still owes 10 overtime hours.</li>
        <li><strong>Leaving bonuses out of the regular rate.</strong> Promised bonuses count.</li>
        <li><strong>Counting paid holidays or PTO as hours worked.</strong> Federal law counts only hours actually worked, unless a contract says otherwise.</li>
        <li><strong>Comp time in the private sector.</strong> Private employers cannot substitute time off for overtime pay under the FLSA.</li>
        <li><strong>Missing off-the-clock time.</strong> Required pre-shift work, short breaks under 20 minutes and work emails after hours generally count.</li>
      </ul>
      <p>
        Knowing how to calculate overtime pay yourself is the easiest way to check a stub: count hours by workweek, find the
        regular rate, apply 1.5×, and compare. If the numbers do not match, ask payroll before the next pay period closes.
      </p>
    </BlogArticle>
  );
}
