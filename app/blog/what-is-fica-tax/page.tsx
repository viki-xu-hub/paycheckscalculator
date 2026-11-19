import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { FED_2026, SS_MAX_2026, fica60k, ficaRows, ficaTwoJobs, usd0, usd2 } from "../../lib/blogPosts";

const SLUG = "what-is-fica-tax";
export const metadata = blogMetadata(SLUG);

const base = usd0(FED_2026.ssWageBase);

const faqs: Faq[] = [
  {
    q: "What is FICA tax?",
    a: `FICA tax is the federal payroll tax that funds Social Security and Medicare, named after the Federal Insurance Contributions Act. Employees pay 6.2% Social Security on wages up to ${base} in 2026 and 1.45% Medicare on all wages; employers pay a matching 7.65%. High earners also pay a 0.9% Additional Medicare Tax.`,
  },
  {
    q: "What is Medicare tax on my paycheck?",
    a: "Medicare tax is the hospital-insurance part of FICA: 1.45% of every dollar of wages, with no cap. Once your wages from one employer pass $200,000 in a year, the employer must also withhold an extra 0.9% Additional Medicare Tax on the excess.",
  },
  {
    q: "Is FICA the same as federal income tax?",
    a: "No. Federal income tax (FIT on most pay stubs) depends on your W-4, filing status and deductions, and much of it can come back as a refund. FICA is a flat-rate tax on wages that does not depend on the W-4 and is generally not refunded, except for excess Social Security withheld across multiple employers.",
  },
  {
    q: "Can I get FICA tax back?",
    a: `Only in specific cases. If two or more employers together withheld more than ${usd2(SS_MAX_2026)} of Social Security in 2026, you claim the excess as a credit on your tax return. If one employer over-withheld, ask that employer to refund it. Some nonresident aliens on F-1 or J-1 visas are exempt and can request a refund of FICA withheld in error.`,
  },
  {
    q: "Do 401(k) contributions reduce FICA tax?",
    a: "No. Traditional 401(k) deferrals reduce federal income tax but are still subject to Social Security and Medicare. Section 125 cafeteria-plan deductions such as pre-tax health, dental and vision premiums do reduce FICA wages.",
  },
  {
    q: "Do self-employed people pay FICA?",
    a: "They pay the equivalent through self-employment tax under SECA: 15.3% of 92.35% of net profit, covering both the employee and employer shares. Half of it is deductible as an adjustment to income.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="PAYROLL TAXES · SOCIAL SECURITY & MEDICARE"
      quickAnswer={
        <p>
          <strong>FICA tax</strong> is the payroll tax that funds Social Security and Medicare. In 2026 you pay{" "}
          <strong>6.2%</strong> Social Security on wages up to {base} and <strong>1.45%</strong> Medicare tax on all wages, for
          7.65% in total; your employer matches it. Wages over $200,000 add a 0.9% Additional Medicare Tax. On a $60,000 salary
          paid biweekly, FICA takes {usd2(fica60k.socialSecurity + fica60k.medicare)} from each check.
        </p>
      }
      takeaways={[
        `Social Security: 6.2% up to ${base} (2026), so at most ${usd2(SS_MAX_2026)}.`,
        "Medicare: 1.45% on every dollar, no cap.",
        "Additional Medicare: 0.9% withheld on wages over $200,000.",
        "Your employer pays a matching 7.65% you never see on the stub.",
        "401(k) deferrals do not reduce FICA; Section 125 benefits do.",
      ]}
      toc={[
        { id: "definition", label: "What FICA tax is" },
        { id: "rates", label: "2026 FICA rates and limits" },
        { id: "by-salary", label: "FICA by salary" },
        { id: "medicare", label: "What is Medicare tax?" },
        { id: "employer", label: "The employer half" },
        { id: "wages", label: "Which wages are subject to FICA" },
        { id: "refunds", label: "Over-withholding and refunds" },
        { id: "faq", label: "FAQ" },
      ]}
      faqs={faqs}
      sources={[
        { label: "IRS Topic No. 751, Social Security and Medicare Withholding Rates", url: "https://www.irs.gov/taxtopics/tc751" },
        { label: "Social Security Administration, 2026 Social Security Changes fact sheet", url: "https://www.ssa.gov/news/press/factsheets/colafacts2026.pdf" },
        { label: "IRS, Questions and Answers for the Additional Medicare Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax" },
        { label: "IRS Publication 15 (Circular E), Employer's Tax Guide", url: "https://www.irs.gov/publications/p15" },
        { label: "IRS Publication 519, U.S. Tax Guide for Aliens (FICA exemptions)", url: "https://www.irs.gov/publications/p519" },
      ]}
      related={[
        { href: "/paycheck-taxes", title: "Paycheck Taxes in Texas", blurb: "FICA and federal withholding by salary" },
        { href: "/fit-tax-meaning", title: "FIT Tax Meaning", blurb: "The federal income tax line on your stub" },
        { href: "/how-much-tax-is-taken-from-my-paycheck", title: "How Much Tax Is Taken From My Paycheck?", blurb: "Every withholding, explained" },
      ]}
    >
      <h2 id="definition">What Is FICA Tax?</h2>
      <p>
        FICA stands for the <strong>Federal Insurance Contributions Act</strong>, the law that requires employers to withhold
        Social Security and Medicare taxes from wages. On a pay stub the two pieces usually appear on separate lines, labelled
        something like &quot;Social Security&quot; or &quot;OASDI&quot; (Old-Age, Survivors and Disability Insurance) and
        &quot;Medicare&quot; or &quot;Med/EE.&quot; Some payroll systems show a single &quot;FICA&quot; line instead.
      </p>
      <p>
        Unlike federal income tax, FICA does not depend on your W-4, filing status or dependents. It is a flat percentage of
        wages, which makes it the most predictable deduction on your check and the one you cannot adjust.
      </p>

      <h2 id="rates">2026 FICA Tax Rates and the Social Security Wage Base</h2>
      <DataTable
        caption="2026 FICA rates. The Social Security wage base is set each year by the SSA."
        head={["Tax", "Employee rate", "Employer rate", "Wage limit"]}
        rows={[
          ["Social Security (OASDI)", "6.2%", "6.2%", `First ${base} of wages`],
          ["Medicare (HI)", "1.45%", "1.45%", "None"],
          ["Additional Medicare", "0.9%", "None", "Withheld on wages over $200,000"],
          ["Total, typical worker", "7.65%", "7.65%", ""],
        ]}
      />
      <Formula>
        Social Security = 6.2% × min(wages, {base})
        <br />
        Medicare = 1.45% × wages + 0.9% × (wages − $200,000, if positive)
      </Formula>
      <p>
        The Social Security wage base rises most years with national average wages. Once your wages for the year reach it, that
        line on your stub drops to zero for the rest of the year, so very high earners see a jump in take-home pay in the fall.
      </p>

      <h2 id="by-salary">How Much FICA Tax at Different Salaries</h2>
      <DataTable
        caption="2026 employee FICA on W-2 wages from a single employer, no pre-tax Section 125 deductions."
        head={["Annual wages", "Social Security", "Medicare", "Additional Medicare", "Total FICA", "Effective rate"]}
        rows={ficaRows.map(r => [usd0(r.wages), usd2(r.ss), usd2(r.medicare), usd2(r.addl), usd2(r.total), `${r.effective}%`])}
      />
      <p>
        Up to the wage base, FICA is a flat 7.65%. Above it, the effective rate falls because Social Security stops, then
        climbs slightly again as the 0.9% Additional Medicare Tax kicks in past $200,000. That makes FICA one of the few
        regressive federal taxes.
      </p>

      <h2 id="medicare">What Is Medicare Tax?</h2>
      <p>
        <strong>Medicare tax</strong> funds Medicare Part A, the hospital insurance trust fund. The base rate is 1.45% of all
        wages with no cap, so it keeps applying no matter how much you earn.
      </p>
      <p>
        The <strong>Additional Medicare Tax</strong> of 0.9% has two thresholds that are easy to confuse. Your employer must
        start withholding it once your wages from that employer pass $200,000 in the year, regardless of filing status. But the
        tax you actually owe is based on combined wages and self-employment income above $250,000 for married couples filing
        jointly, $125,000 married filing separately, and $200,000 for everyone else. You settle the difference on Form 8959 at
        filing time. A married couple each earning $150,000 owes some Additional Medicare Tax even though neither employer
        withholds any.
      </p>

      <h2 id="employer">The Employer Half of FICA</h2>
      <p>
        Your employer pays a matching 6.2% and 1.45% on your wages. It does not come out of your check and rarely appears on
        your stub, but it is a real cost of employing you. On a $60,000 salary the employer share is $4,590 a year, which is one
        reason a contractor needs a higher rate than an employee to come out even: self-employed people pay both halves. See{" "}
        <a href="/blog/what-is-a-1099-form">what a 1099 form is</a> for how self-employment tax works.
      </p>
      <p>
        There is no employer match on the 0.9% Additional Medicare Tax.
      </p>

      <h2 id="wages">Which Wages Are Subject to FICA</h2>
      <ul>
        <li><strong>Included:</strong> salary, hourly wages, overtime, bonuses, commission, reported tips, vacation and severance pay.</li>
        <li><strong>Still included:</strong> traditional and Roth 401(k) deferrals, which reduce income tax but not FICA.</li>
        <li><strong>Excluded:</strong> Section 125 cafeteria-plan premiums for health, dental and vision, health FSA and dependent care FSA, and HSA contributions made through payroll.</li>
        <li><strong>Exempt workers:</strong> students working for the school they attend, many F-1 and J-1 nonresident aliens in their first years in the US, and some state and local employees covered by a qualifying pension instead.</li>
      </ul>
      <p>
        The new federal deduction for overtime pay reduces income tax only. Overtime is still fully subject to FICA; our{" "}
        <a href="/no-tax-on-overtime">no tax on overtime</a> page explains the limits.
      </p>

      <h2 id="refunds">Over-Withholding and FICA Refunds</h2>
      <p>
        Each employer withholds Social Security as if it were your only job, so two jobs can push combined withholding past the
        annual maximum. With {usd0(ficaTwoJobs.a)} from one employer and {usd0(ficaTwoJobs.b)} from another, total Social Security
        withheld is {usd2(ficaTwoJobs.withheld)}, but the 2026 maximum is {usd2(ficaTwoJobs.max)}.
      </p>
      <Callout title="Claim the excess on your return">
        <p>
          The {usd2(ficaTwoJobs.excess)} overage comes back as a credit on Schedule 3 of Form 1040. Medicare tax is never refunded
          this way because it has no cap. If a single employer withheld too much, the fix has to come from that employer, not
          the return.
        </p>
      </Callout>
      <p>
        To see FICA alongside federal and state tax on your own paycheck, run the{" "}
        <a href="/how-much-tax-is-taken-from-my-paycheck">paycheck tax calculator</a>. Knowing what FICA tax is helps you read
        the two flat lines on every stub and spot the rare case where one of them is wrong.
      </p>
    </BlogArticle>
  );
}
