import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { GVN_SALARY, grossVsNetSalaries, grossVsNetStates, grossVsNetWith401k as k, usd0, usd2 } from "../../lib/blogPosts";

const SLUG = "gross-pay-vs-net-pay";
export const metadata = blogMetadata(SLUG);

const STATE_NAMES: Record<string, string> = { TX: "Texas", CA: "California", NY: "New York" };
const tx = grossVsNetStates.find(r => r.code === "TX")!;
const ca = grossVsNetStates.find(r => r.code === "CA")!;

const faqs: Faq[] = [
  {
    q: "What is the difference between gross pay and net pay?",
    a: "Gross pay is your total earnings for a pay period before anything is taken out. Net pay is what is left after taxes and deductions, the amount deposited in your bank account. Gross is what employers quote in job offers; net is what you can spend.",
  },
  {
    q: "What is net pay?",
    a: "Net pay, or take-home pay, is gross pay after every withholding: income taxes at each level, FICA, and payroll deductions such as 401(k) contributions, health premiums and garnishments. It is the bottom line on a pay stub.",
  },
  {
    q: "How do I calculate net pay from gross pay?",
    a: "Start with gross pay, subtract pre-tax deductions, calculate and subtract each tax on the remaining wages, then subtract post-tax deductions. Because federal withholding depends on your W-4 and the IRS tables, a paycheck calculator is the practical way to do it.",
  },
  {
    q: "What percentage of gross pay is net pay?",
    a: "For most full-time workers, roughly 70% to 85%. Lower earners in states with no income tax keep the most; higher earners in high-tax states, and anyone with large 401(k) or benefit deductions, keep less of each check.",
  },
  {
    q: "Is salary gross or net?",
    a: "Gross. A $75,000 salary means $75,000 before taxes and deductions. Hourly rates are also gross figures.",
  },
  {
    q: "Should I budget with gross or net pay?",
    a: "Budget with net pay, since that is the money you actually receive. Use gross pay for loan, rental and credit applications, which nearly always ask for income before tax.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="PAYCHECK BASICS · TAKE-HOME PAY"
      quickAnswer={
        <p>
          <strong>Gross pay vs net pay:</strong> gross pay is everything you earn before deductions; <strong>net pay</strong> is
          what reaches your bank account after taxes and deductions. On a {usd0(GVN_SALARY)} salary paid biweekly, gross pay is{" "}
          {usd2(tx.gross)} per check. Net pay is {usd2(tx.net)} in Texas and {usd2(ca.net)} in California for a single filer
          with no benefit deductions.
        </p>
      }
      takeaways={[
        "Gross = total earned. Net = gross − taxes − deductions.",
        "Job offers, salaries and hourly rates are gross.",
        "Net is typically 70–85% of gross for full-time workers.",
        "State, filing status, W-4 and benefits drive the gap.",
        "Budget on net; apply for loans and leases with gross.",
      ]}
      toc={[
        { id: "definitions", label: "Gross pay vs net pay defined" },
        { id: "formula", label: "Gross to net, step by step" },
        { id: "by-state", label: "Same salary, three states" },
        { id: "by-salary", label: "Net share by salary" },
        { id: "deductions", label: "How benefits change net" },
        { id: "where-used", label: "When to use each figure" },
        { id: "faq", label: "FAQ" },
      ]}
      faqs={faqs}
      sources={[
        { label: "IRS Publication 15-T, Federal Income Tax Withholding Methods", url: "https://www.irs.gov/publications/p15t" },
        { label: "IRS Topic No. 751, Social Security and Medicare Withholding Rates", url: "https://www.irs.gov/taxtopics/tc751" },
        { label: "California EDD, 2026 Payroll Tax Rates and Withholding Schedules", url: "https://edd.ca.gov/en/payroll_taxes/rates_and_withholding/" },
        { label: "New York State, Publication NYS-50-T-NYS withholding tables", url: "https://www.tax.ny.gov/forms/withholding_cur_forms.htm" },
      ]}
      related={[
        { href: "/paycheck-taxes", title: "Paycheck Taxes in Texas", blurb: "Gross to net with no state income tax" },
        { href: "/fit-tax-meaning", title: "FIT Tax Meaning", blurb: "The biggest gap between gross and net" },
        { href: "/gross-up-calculator", title: "Gross-Up Calculator", blurb: "Work backwards from net to gross" },
      ]}
    >
      <h2 id="definitions">Gross Pay vs Net Pay: Definitions</h2>
      <p>
        <strong>Gross pay</strong> is the total you earned in a pay period: salary divided by pay periods, or hours times rate,
        plus overtime, bonuses, commission and tips. It is the first total on a pay stub and the number on a job offer.
      </p>
      <p>
        <strong>Net pay</strong> is what is left once everything has been taken out: taxes your employer must withhold,
        benefits you elected, and anything else such as a garnishment. It is the last number on the stub and should match the
        deposit. People also call it take-home pay.
      </p>
      <p>
        The gap between the two is not money lost. Part of it is tax, which may partly come back as a refund. Part of it is
        your own 401(k) savings or insurance you would otherwise pay for directly.
      </p>

      <h2 id="formula">How to Get From Gross Pay to Net Pay</h2>
      <Formula>
        Net pay = gross pay − pre-tax deductions − taxes − post-tax deductions
      </Formula>
      <ol>
        <li><strong>Gross pay.</strong> Salary ÷ pay periods, or hours × rate, plus extra pay.</li>
        <li><strong>Pre-tax deductions.</strong> Traditional 401(k), health premiums, HSA and FSA. These lower taxable wages.</li>
        <li><strong>Federal income tax.</strong> From your W-4 and IRS Publication 15-T.</li>
        <li><strong>FICA.</strong> 6.2% Social Security and 1.45% Medicare; see <a href="/blog/what-is-fica-tax">what FICA tax is</a>.</li>
        <li><strong>State and local tax.</strong> None in nine states; up to double digits at the top in others.</li>
        <li><strong>Post-tax deductions.</strong> Roth 401(k), union dues, garnishments, some insurance.</li>
      </ol>
      <p>
        Each step is a line on your stub. <a href="/blog/how-to-read-a-pay-stub">How to read a pay stub</a> walks through a full
        example.
      </p>

      <h2 id="by-state">Gross Pay vs Net Pay on the Same Salary in Three States</h2>
      <p>
        Gross pay is identical everywhere for the same salary. Net pay is not, mostly because of state income tax.
      </p>
      <DataTable
        caption={`${usd0(GVN_SALARY)} salary, biweekly, single filer, 2026 W-4 with no adjustments, no benefit deductions. From our payroll engine. New York excludes New York City tax.`}
        head={["State", "Gross per check", "Federal tax", "FICA", "State tax", "Net per check", "Net share"]}
        rows={grossVsNetStates.map(r => [
          STATE_NAMES[r.code],
          usd2(r.gross),
          usd2(r.federal),
          usd2(r.socialSecurity + r.medicare),
          usd2(r.state),
          usd2(r.net),
          `${r.netShare}%`,
        ])}
      />
      <p>
        Federal tax and FICA are the same in every row. The whole difference is state tax, including California&apos;s SDI
        payroll deduction. Over a year, the Texas worker takes home {usd0(tx.netAnnual - ca.netAnnual)} more than the California
        worker on the same gross pay.
      </p>

      <h2 id="by-salary">How the Net Share Falls as Gross Pay Rises</h2>
      <DataTable
        caption="Biweekly, single filer, Texas (no state income tax), 2026 W-4. From our payroll engine."
        head={["Salary", "Gross per check", "Net per check", "Net as % of gross"]}
        rows={grossVsNetSalaries.map(r => [usd0(r.salary), usd2(r.gross), usd2(r.net), `${r.netShare}%`])}
      />
      <p>
        Progressive federal brackets mean each extra dollar of gross keeps a little less. Even so, a raise always increases net
        pay: only the portion of income inside a higher bracket is taxed at that rate.
      </p>

      <h2 id="deductions">How Benefits Change Net Pay</h2>
      <p>
        Benefit elections are the part of the gap you control. Add a 6% traditional 401(k) and a {usd2(k.otherPreTax)} pre-tax
        health premium to the {usd0(GVN_SALARY)} Texas example:
      </p>
      <DataTable
        caption={`${usd0(GVN_SALARY)} salary, biweekly, Texas, single filer.`}
        head={["", "No deductions", "6% 401(k) + health"]}
        rows={[
          ["Gross pay", usd2(tx.gross), usd2(k.gross)],
          ["Pre-tax deductions", usd2(0), usd2(k.preTax)],
          ["Federal income tax", usd2(tx.federal), usd2(k.federal)],
          ["Social Security + Medicare", usd2(tx.socialSecurity + tx.medicare), usd2(k.socialSecurity + k.medicare)],
          ["Net pay", usd2(tx.net), usd2(k.net)],
        ]}
      />
      <p>
        Net pay drops by {usd2(tx.net - k.net)}, less than the {usd2(k.preTax)} of deductions, because pre-tax money lowers
        federal tax, and the health premium also lowers FICA. The{" "}
        <a href="/blog/how-to-calculate-401k-from-paycheck">401(k) paycheck guide</a> works through that trade-off in detail.
      </p>
      <Callout title="Working backwards from net to gross">
        <p>
          If you need a specific net amount, such as a bonus that should land as an even $1,000, the gross has to be solved for,
          not estimated by adding a tax percentage. The <a href="/gross-up-calculator">gross-up calculator</a> does the
          division.
        </p>
      </Callout>

      <h2 id="where-used">When to Use Gross Pay and When to Use Net Pay</h2>
      <DataTable
        caption="Which figure each situation calls for."
        head={["Situation", "Use"]}
        rows={[
          ["Monthly budget, savings plan", "Net pay"],
          ["Mortgage, auto loan, credit card application", "Gross pay"],
          ["Apartment rental income requirement", "Gross pay (usually 3× rent)"],
          ["Comparing two job offers", "Gross, then net for each state and benefits package"],
          ["Checking a paycheck for errors", "Both, line by line"],
          ["Child support and benefit applications", "Usually gross; check the form"],
        ]}
      />
      <p>
        The gross pay vs net pay distinction is simple once it is on paper: gross is what you earn, net is what you keep, and
        the stub between them tells you exactly why they differ. To see your own numbers, use the{" "}
        <a href="/">paycheck calculator</a> for your state.
      </p>
    </BlogArticle>
  );
}
