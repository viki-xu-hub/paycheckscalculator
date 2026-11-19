import { BlogArticle, Callout, DataTable, blogMetadata, type Faq } from "../../components/BlogArticle";
import { EXEMPT_THRESHOLDS_2026, exemptCompare as ex, usd0, usd2 } from "../../lib/blogPosts";

const SLUG = "exempt-vs-non-exempt-employee";
export const metadata = blogMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is the difference between exempt and non-exempt employees?",
    a: "Non-exempt employees are covered by the Fair Labor Standards Act's minimum wage and overtime rules and earn time and a half for every hour beyond 40 in a workweek. Exempt employees meet specific salary and job-duties tests and are not owed federal overtime, no matter how many hours they work.",
  },
  {
    q: "What is the 2026 salary threshold for exempt employees?",
    a: "Under federal law, $684 a week ($35,568 a year) for the executive, administrative and professional exemptions, and $107,432 in total annual compensation for highly compensated employees. A 2024 rule that would have raised these amounts was vacated in court, and the Department of Labor formally restored the 2019 levels in 2026. Several states set higher thresholds.",
  },
  {
    q: "Can a salaried employee be non-exempt?",
    a: "Yes. Being paid a salary satisfies only one of the tests. A salaried employee who earns below the threshold, or whose duties do not meet an exemption, is non-exempt and must be paid overtime for hours over 40.",
  },
  {
    q: "Can an hourly employee be exempt?",
    a: "Usually not, because most exemptions require a salary. The main exceptions are computer professionals paid at least $27.63 an hour, outside sales employees, and licensed doctors, lawyers and teachers, who have no salary requirement.",
  },
  {
    q: "Is it better to be exempt or non-exempt?",
    a: "It depends on hours. Exempt roles usually pay a steady salary, often with more flexibility, while non-exempt roles pay for every overtime hour. If you regularly work well over 40 hours, a non-exempt job at the same base pay can earn noticeably more.",
  },
  {
    q: "Can my employer change me from exempt to non-exempt?",
    a: "Yes, as long as the change is applied going forward and pay remains at least minimum wage for all hours. Employers often reclassify when a salary threshold rises or after an audit. Back pay may be owed if an employee was misclassified in the past.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="EMPLOYMENT LAW · OVERTIME"
      quickAnswer={
        <p>
          <strong>Exempt vs non-exempt employee</strong> status decides whether you are owed overtime. A
          <strong> non-exempt</strong> employee must be paid 1.5× for hours over 40 a week. An <strong>exempt</strong> employee
          is not, but only if they are paid a fixed salary of at least <strong>$684 a week ($35,568 a year)</strong> under federal
          law and their main duties are executive, administrative or professional. California, New York and several other
          states set higher salary floors for 2026.
        </p>
      }
      takeaways={[
        "Three tests for exemption: salary basis, salary level, duties.",
        "Federal salary level: $684/week ($35,568); HCE: $107,432.",
        "State floors can be much higher: California $70,304 in 2026.",
        "Salaried does not mean exempt; job title does not decide it.",
        "Misclassification can mean up to two years of back overtime (three if willful).",
      ]}
      toc={[
        { id: "difference", label: "Exempt vs non-exempt explained" },
        { id: "tests", label: "The three exemption tests" },
        { id: "thresholds", label: "2026 salary thresholds" },
        { id: "duties", label: "The duties tests" },
        { id: "pay", label: "What it means for your pay" },
        { id: "misclassification", label: "Misclassification" },
        { id: "employers", label: "For employers" },
        { id: "faq", label: "FAQ" },
      ]}
      faqs={faqs}
      sources={[
        { label: "U.S. Department of Labor, Earnings thresholds for the FLSA Part 541 exemptions", url: "https://www.dol.gov/agencies/whd/overtime/rulemaking" },
        { label: "DOL Fact Sheet #17A, Exemption for Executive, Administrative, Professional, Computer and Outside Sales Employees", url: "https://www.dol.gov/agencies/whd/fact-sheets/17a-overtime" },
        { label: "29 CFR Part 541, Defining and delimiting the exemptions", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-541" },
        { label: "California Labor Commissioner, Exemptions from overtime", url: "https://www.dir.ca.gov/dlse/faq_overtimeexemptions.htm" },
        { label: "New York State Department of Labor, Minimum wage and exempt salary thresholds", url: "https://dol.ny.gov/minimum-wage-0" },
      ]}
      related={[
        { href: "/overtime-calculator", title: "Overtime Calculator", blurb: "What non-exempt overtime is worth" },
        { href: "/hourly-paycheck-calculator", title: "Hourly Paycheck Calculator", blurb: "Take-home on hourly pay" },
        { href: "/salary", title: "Salary After Tax", blurb: "Take-home on common salaries" },
      ]}
    >
      <h2 id="difference">Exempt vs Non-Exempt Employee: What the Terms Mean</h2>
      <p>
        &quot;Exempt&quot; is short for exempt from the overtime and minimum-wage provisions of the{" "}
        <strong>Fair Labor Standards Act (FLSA)</strong>. Every employee is non-exempt by default. An employer may treat someone
        as exempt only if the job meets one of the exemptions in 29 CFR Part 541, and the burden of proving it falls on the
        employer.
      </p>
      <DataTable
        caption="Practical differences between the two classifications under federal law."
        head={["", "Non-exempt", "Exempt"]}
        rows={[
          ["Overtime after 40 hours", "Yes, 1.5× the regular rate", "No"],
          ["Minimum wage protection", "Yes, for every hour", "Covered by the salary floor"],
          ["How pay is set", "Usually hourly; can be salaried", "Fixed salary (with narrow exceptions)"],
          ["Hours tracked", "Required", "Not required for pay purposes"],
          ["Pay docked for partial days", "Yes, for hours not worked", "Generally no"],
        ]}
      />

      <h2 id="tests">The Three Tests for Exempt Status</h2>
      <p>
        For the white-collar exemptions (executive, administrative and professional) all three tests must be met:
      </p>
      <ol>
        <li>
          <strong>Salary basis:</strong> paid a predetermined, fixed salary that is not reduced because of the quality or
          quantity of work. Deductions are allowed only in limited cases, such as full-day absences for personal reasons.
        </li>
        <li>
          <strong>Salary level:</strong> paid at least the threshold, currently $684 a week federally, or more under state law.
        </li>
        <li>
          <strong>Duties:</strong> primary duties match the exemption&apos;s definition. Title and job description do not
          decide it; what the person actually does does.
        </li>
      </ol>

      <h2 id="thresholds">2026 Exempt Salary Thresholds</h2>
      <p>
        In November 2024 a federal court in Texas vacated the Department of Labor&apos;s 2024 overtime rule, which would have
        raised the federal threshold to $1,128 a week. The DOL kept enforcing the 2019 levels and formally restored them in May
        2026. States may set higher floors, and where they do, the higher figure applies.
      </p>
      <DataTable
        caption="Minimum salary for the executive and administrative exemptions in 2026. Professional exemptions can differ by state; New York applies the federal level to professionals."
        head={["Jurisdiction", "Weekly", "Annual"]}
        rows={EXEMPT_THRESHOLDS_2026.map(t => [t.where, t.weekly ? usd2(t.weekly) : "—", usd2(t.annual)])}
      />
      <p>
        Washington, Colorado and a few other states also set thresholds above the federal level, and some of them adjust every
        January. Check your state labor department before relying on the federal figure.
      </p>

      <h2 id="duties">The Duties Tests in Plain English</h2>
      <ul>
        <li>
          <strong>Executive:</strong> primary duty is managing the business or a department, regularly directing at least two
          full-time employees, with real input into hiring and firing.
        </li>
        <li>
          <strong>Administrative:</strong> office or non-manual work tied to management or general business operations, with
          discretion and independent judgment on significant matters. HR, finance and compliance roles often qualify; clerical
          and data-entry roles do not.
        </li>
        <li>
          <strong>Learned professional:</strong> work requiring advanced knowledge in science or learning, normally acquired
          through prolonged specialized study, such as accountants, engineers, registered nurses and pharmacists.
        </li>
        <li>
          <strong>Creative professional:</strong> work requiring invention, imagination or originality in an artistic or
          creative field.
        </li>
        <li>
          <strong>Computer employee:</strong> systems analysts, programmers and software engineers, paid the salary level or at
          least $27.63 an hour.
        </li>
        <li>
          <strong>Outside sales:</strong> primary duty is making sales away from the employer&apos;s place of business; no
          salary test.
        </li>
      </ul>
      <p>
        Blue-collar workers who perform work involving repetitive operations with their hands, along with police, firefighters,
        paramedics and similar first responders, are not exempt under these rules regardless of pay.
      </p>

      <h2 id="pay">Exempt vs Non-Exempt: What It Means for Your Paycheck</h2>
      <p>
        Classification matters most when hours run long. Compare the same {usd0(ex.salary)} job at {ex.weeklyHours} hours a week
        under each status:
      </p>
      <DataTable
        caption={`Same base pay, ${ex.weeklyHours}-hour weeks all year. Non-exempt overtime at 1.5× the equivalent hourly rate.`}
        head={["", "Exempt (salaried)", "Non-exempt"]}
        rows={[
          ["Base pay", usd0(ex.salary), `${usd2(ex.hourly)}/hour × 2,080 = ${usd0(ex.salary)}`],
          ["Overtime pay", "$0", usd0(ex.gap)],
          ["Annual gross", usd0(ex.salary), usd0(ex.nonExemptAnnual)],
          ["Effective hourly rate", usd2(ex.effectiveExemptHourly), usd2(ex.nonExemptAnnual / (ex.weeklyHours * 52))],
        ]}
      />
      <p>
        At {ex.weeklyHours} hours, the non-exempt worker earns {usd0(ex.gap)} more. In weeks under 40 hours, the exempt worker
        is ahead, because the salary is guaranteed. Neither status changes how your pay is taxed, and only non-exempt overtime
        qualifies for the new <a href="/no-tax-on-overtime">federal overtime deduction</a>. To price your own overtime, use the{" "}
        <a href="/overtime-calculator">overtime calculator</a> or read <a href="/blog/how-to-calculate-overtime-pay">how to
        calculate overtime pay</a>.
      </p>

      <h2 id="misclassification">Misclassification and Back Pay</h2>
      <p>
        Misclassifying a non-exempt employee as exempt is one of the most common wage-and-hour violations. An employee can
        recover unpaid overtime for two years, or three if the violation was willful, plus an equal amount in liquidated
        damages. Several states allow longer look-back periods. If you think you are misclassified, keep a record of hours
        worked and contact the Wage and Hour Division or your state labor department.
      </p>
      <Callout title="Quick self-check">
        <p>
          You are probably non-exempt if any of these is true: your salary is below your state&apos;s threshold; your pay is
          cut when you leave early; or your job is mostly following set procedures rather than exercising independent judgment.
        </p>
      </Callout>

      <h2 id="employers">For Employers: Getting Classification Right</h2>
      <p>
        Review each exempt role against the salary level and the duties test, not the title, and re-check every January when
        state thresholds change. Track hours for every non-exempt employee, including salaried non-exempt staff, and fold
        nondiscretionary bonuses into the regular rate for overtime. Payroll software can apply the overtime rules
        automatically once each employee&apos;s classification is set correctly.
      </p>
      {/* Partner slot: payroll provider (Gusto) affiliate link goes here once the partner URL is approved. */}
      <p>
        The exempt vs non exempt employee distinction comes down to pay and duties, and the line moves with state law. Run the
        numbers both ways before accepting or offering a salaried role that will routinely exceed 40 hours.
      </p>
    </BlogArticle>
  );
}
