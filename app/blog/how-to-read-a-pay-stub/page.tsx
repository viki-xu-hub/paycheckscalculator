import { BlogArticle, Callout, DataTable, blogMetadata, type Faq } from "../../components/BlogArticle";
import { stubExample as s, usd2 } from "../../lib/blogPosts";

const SLUG = "how-to-read-a-pay-stub";
export const metadata = blogMetadata(SLUG);

const c = s.check;
const totalTaxes = c.federal + c.socialSecurity + c.medicare + c.state;

const faqs: Faq[] = [
  {
    q: "How do I read my pay stub?",
    a: "Work from top to bottom. Gross pay is what you earned before anything came out. Below it are pre-tax deductions (such as 401(k) and health premiums), then the tax lines (FIT, OASDI, MED, plus any state or city tax), then post-tax deductions. Net pay at the bottom is what was deposited. Each line has a current-period column and a year-to-date column.",
  },
  {
    q: "What does YTD mean on a pay stub?",
    a: "Year to date: the running total of each line from January 1 through the current pay date. YTD gross is the figure lenders use to verify income, and YTD tax totals will match your W-2 if nothing changes before year-end.",
  },
  {
    q: "What is OASDI on my pay stub?",
    a: "OASDI stands for Old-Age, Survivors and Disability Insurance, the formal name for Social Security. It is 6.2% of wages up to the annual wage base ($184,500 in 2026). Medicare usually appears on the next line as MED or Medicare at 1.45%.",
  },
  {
    q: "What does FIT mean on a pay stub?",
    a: "FIT is federal income tax withholding. It is calculated from your W-4 and the IRS percentage method in Publication 15-T, and it is the one tax line you can change by filing a new W-4 with your employer.",
  },
  {
    q: "Why is my taxable wage different from my gross pay?",
    a: "Pre-tax deductions come out first. A traditional 401(k) lowers federal and most state taxable wages but not Social Security or Medicare wages. Section 125 health premiums lower all of them. That is why a stub may show three different wage bases.",
  },
  {
    q: "How long should I keep pay stubs?",
    a: "At least until you have checked them against your W-2 in January. Many people keep a year of stubs, plus the last stub of each year, for loan applications and to resolve disputes. Employers must keep payroll records for at least three years under the FLSA.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="PAY STUBS · PAYCHECK BASICS"
      quickAnswer={
        <p>
          <strong>To read a pay stub</strong>, follow the money from top to bottom: <strong>gross pay</strong> (what you
          earned), minus <strong>pre-tax deductions</strong> (401(k), health premiums), minus <strong>taxes</strong> (FIT,
          Social Security/OASDI, Medicare, state), minus <strong>post-tax deductions</strong>, equals <strong>net pay</strong>,
          the deposit. On the example stub below, {usd2(c.gross)} of gross pay becomes {usd2(c.net)} of net pay.
        </p>
      }
      takeaways={[
        "Gross − pre-tax deductions − taxes − post-tax deductions = net pay.",
        "FIT = federal income tax; OASDI = Social Security; MED = Medicare.",
        "Current column is this check; YTD column is January 1 to date.",
        "401(k) lowers income-tax wages, not Social Security or Medicare wages.",
        "Check rate, hours, deductions and YTD every period.",
      ]}
      toc={[
        { id: "sections", label: "The sections of a pay stub" },
        { id: "example", label: "Example stub, line by line" },
        { id: "abbreviations", label: "Pay stub abbreviations" },
        { id: "ytd", label: "Reading the YTD column" },
        { id: "wage-bases", label: "Why taxable wages differ" },
        { id: "check", label: "What to check every payday" },
        { id: "faq", label: "FAQ" },
      ]}
      howTo={{
        name: "How to read a pay stub",
        steps: [
          "Confirm the pay period, pay date and your hours or salary amount.",
          "Read gross pay, the total earned before any deduction.",
          "Subtract pre-tax deductions such as 401(k) and health premiums to find taxable wages.",
          "Review each tax line: federal income tax, Social Security, Medicare, state and local.",
          "Subtract post-tax deductions and confirm net pay matches your deposit; then compare the YTD column with your last stub.",
        ],
      }}
      faqs={faqs}
      sources={[
        { label: "IRS Publication 15-T, Federal Income Tax Withholding Methods", url: "https://www.irs.gov/publications/p15t" },
        { label: "IRS Topic No. 751, Social Security and Medicare Withholding Rates", url: "https://www.irs.gov/taxtopics/tc751" },
        { label: "Georgia Department of Revenue, 2026 Employer's Tax Guide", url: "https://dor.georgia.gov/document/document/2026-employers-tax-guide-updated-june-2026/download" },
        { label: "U.S. Department of Labor, Recordkeeping requirements under the FLSA (Fact Sheet #21)", url: "https://www.dol.gov/agencies/whd/fact-sheets/21-flsa-recordkeeping" },
      ]}
      related={[
        { href: "/how-much-tax-is-taken-from-my-paycheck", title: "How Much Tax Is Taken From My Paycheck?", blurb: "Check every tax line on your stub" },
        { href: "/pay-stub-calculator", title: "Pay Stub Calculator", blurb: "Rebuild a stub from gross pay" },
        { href: "/fit-tax-meaning", title: "FIT Tax Meaning", blurb: "The federal income tax line explained" },
      ]}
    >
      <h2 id="sections">How to Read a Pay Stub: The Five Sections</h2>
      <p>
        Pay stubs look different from one payroll provider to the next, but nearly all of them have the same five blocks.
        Find them first and the rest of the stub falls into place.
      </p>
      <ol>
        <li><strong>Header:</strong> employer, employee name and ID, pay period start and end, pay date, and sometimes filing status from your W-4.</li>
        <li><strong>Earnings:</strong> each type of pay (regular, overtime, holiday, bonus) with hours, rate and amount. Their total is gross pay.</li>
        <li><strong>Pre-tax deductions:</strong> traditional 401(k), health, dental and vision premiums, HSA and FSA contributions.</li>
        <li><strong>Taxes:</strong> FIT, Social Security and Medicare, followed by any state, city or disability withholding.</li>
        <li><strong>Post-tax deductions and net pay:</strong> Roth 401(k), union dues, garnishments, then the amount deposited.</li>
      </ol>
      <p>
        Many stubs also list employer contributions (401(k) match, employer health premium) and paid-time-off balances. Those
        are informational; they do not change your net pay.
      </p>

      <h2 id="example">Example Pay Stub, Line by Line</h2>
      <p>
        Here is a biweekly stub for a single filer in Georgia on a {usd2(s.salary)} salary, contributing 5% to a traditional
        401(k) and paying {usd2(c.otherPreTax)} per check for pre-tax health coverage. It is the {s.periodsPaid}nd paycheck of
        2026, so the YTD column covers {s.periodsPaid} pay periods.
      </p>
      <DataTable
        caption="Every amount from our 2026 payroll engine: IRS Pub 15-T federal withholding, Georgia's flat-rate withholding, 6.2% Social Security, 1.45% Medicare."
        head={["Line", "Current", "Year to date"]}
        rows={[
          [`Regular salary (${s.hoursPerPeriod} h)`, usd2(c.gross), usd2(s.ytd(c.gross))],
          ["Gross pay", usd2(c.gross), usd2(s.ytd(c.gross))],
          ["401(k) 5% (pre-tax)", `−${usd2(c.retirement)}`, `−${usd2(s.ytd(c.retirement))}`],
          ["Medical/dental (pre-tax)", `−${usd2(c.otherPreTax)}`, `−${usd2(s.ytd(c.otherPreTax))}`],
          ["Federal income tax (FIT)", `−${usd2(c.federal)}`, `−${usd2(s.ytd(c.federal))}`],
          ["Social Security (OASDI)", `−${usd2(c.socialSecurity)}`, `−${usd2(s.ytd(c.socialSecurity))}`],
          ["Medicare (MED)", `−${usd2(c.medicare)}`, `−${usd2(s.ytd(c.medicare))}`],
          ["Georgia income tax (SIT)", `−${usd2(c.state)}`, `−${usd2(s.ytd(c.state))}`],
          ["Net pay", usd2(c.net), usd2(s.ytd(c.net))],
        ]}
      />
      <p>
        Reading it: gross pay is {usd2(c.gross)}, which is {usd2(s.salary)} ÷ 26. Pre-tax deductions take{" "}
        {usd2(c.retirement + c.otherPreTax)}. Taxes take {usd2(totalTaxes)} in total. Nothing is deducted after tax, so net pay
        is {usd2(c.net)}, about {Math.round((c.net / c.gross) * 100)}% of gross. Of the {usd2(c.gross - c.net)} difference,{" "}
        {usd2(c.retirement)} is your own retirement savings rather than a cost.
      </p>

      <h2 id="abbreviations">Common Pay Stub Abbreviations</h2>
      <DataTable
        caption="Abbreviations vary by payroll provider; these are the most widely used."
        head={["Abbreviation", "Meaning"]}
        rows={[
          ["FIT, FWT, Fed W/H", "Federal income tax withholding"],
          ["OASDI, SS, FICA-SS", "Social Security (6.2%)"],
          ["MED, MEDI, FICA-MED", "Medicare (1.45%, plus 0.9% over $200,000)"],
          ["SIT, SWT, ST", "State income tax"],
          ["LIT, LOC, CITY", "Local or city income tax"],
          ["SDI, FLI, PFML", "State disability or paid family leave insurance"],
          ["401K, 401K-R / ROTH", "Traditional or Roth 401(k) deferral"],
          ["MED/DEN/VIS, SEC125", "Pre-tax health, dental, vision premiums"],
          ["REG, OT, HOL, PTO", "Regular, overtime, holiday and paid-time-off hours"],
          ["YTD", "Year to date"],
        ]}
      />
      <p>
        FIT is the line people ask about most. Our page on <a href="/fit-tax-meaning">what FIT means on a paycheck</a> explains
        how it is calculated and how a new W-4 changes it.
      </p>

      <h2 id="ytd">Reading the Year-to-Date Column</h2>
      <p>
        The YTD column is the most useful part of a pay stub and the most overlooked. It answers questions a single check
        cannot:
      </p>
      <ul>
        <li><strong>What have I earned this year?</strong> YTD gross, which lenders use to verify income.</li>
        <li><strong>Will my W-2 match?</strong> YTD taxable wages and taxes become W-2 boxes 1 through 6 and 16 to 17.</li>
        <li><strong>Am I on track for my 401(k) goal?</strong> YTD deferrals versus the 2026 limit of $24,500.</li>
        <li><strong>Has Social Security stopped?</strong> High earners see YTD OASDI freeze at $11,439 once wages pass $184,500.</li>
      </ul>
      <p>
        To project annual income from the YTD column, divide YTD gross by paychecks received and multiply by your pay periods
        per year; the method is in <a href="/blog/how-to-calculate-annual-income">how to calculate annual income</a>.
      </p>

      <h2 id="wage-bases">Why a Pay Stub Can Show Three Different Taxable Wages</h2>
      <p>
        Pre-tax deductions do not all reduce the same taxes, so some stubs print separate wage bases:
      </p>
      <DataTable
        caption="Which wage base each deduction reduces, for the example stub."
        head={["Wage base", "Reduced by 401(k)?", "Reduced by health premium?", "Example, this check"]}
        rows={[
          ["Federal taxable wages", "Yes", "Yes", usd2(c.gross - c.retirement - c.otherPreTax)],
          ["Social Security wages", "No", "Yes", usd2(c.gross - c.otherPreTax)],
          ["Medicare wages", "No", "Yes", usd2(c.gross - c.otherPreTax)],
        ]}
      />
      <p>
        This is also why W-2 box 1 is usually lower than boxes 3 and 5. For a fuller list of which deductions come out before
        tax, see <a href="/post-tax-deductions">pre-tax vs post-tax deductions</a>.
      </p>

      <h2 id="check">What to Check on Every Pay Stub</h2>
      <ol>
        <li><strong>Hours and rate.</strong> Do regular and overtime hours match your timesheet? Is the rate current after a raise?</li>
        <li><strong>Deductions.</strong> Do benefit amounts match what you elected at enrollment?</li>
        <li><strong>Tax setup.</strong> Is the right state listed after a move or a remote-work change?</li>
        <li><strong>Net pay.</strong> Does it match the deposit in your bank account?</li>
        <li><strong>YTD continuity.</strong> Does each YTD figure equal last stub&apos;s YTD plus this check?</li>
      </ol>
      <Callout title="Rebuild the stub yourself">
        <p>
          Enter your salary or hours into the <a href="/pay-stub-calculator">pay stub calculator</a> or the{" "}
          <a href="/how-much-tax-is-taken-from-my-paycheck">paycheck tax calculator</a> and compare line by line. A gap of a
          few cents is rounding; a gap of dollars is worth a question to payroll.
        </p>
      </Callout>
      <p>
        Once you know how to read a pay stub, the layout stops looking like a wall of codes: it is one subtraction from gross
        to net, shown twice, once for this check and once for the year.
      </p>
    </BlogArticle>
  );
}
