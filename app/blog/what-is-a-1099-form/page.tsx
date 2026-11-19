import { BlogArticle, Callout, DataTable, Formula, blogMetadata, type Faq } from "../../components/BlogArticle";
import { FED_2026, seRows, seTax, usd0, usd2 } from "../../lib/blogPosts";

const SLUG = "what-is-a-1099-form";
export const metadata = blogMetadata(SLUG);

const se50 = seTax(50000);

const faqs: Faq[] = [
  {
    q: "What is a 1099 form used for?",
    a: "A 1099 is an IRS information return that reports money paid to you that is not wages: freelance or contract pay, interest, dividends, retirement distributions, unemployment, and similar income. The payer sends one copy to you and one to the IRS, so the IRS can match it against your tax return.",
  },
  {
    q: "What is the 1099 threshold for 2026?",
    a: "For payments made in 2026, businesses must issue Form 1099-NEC or 1099-MISC when they pay you $2,000 or more in the year, up from $600, under the One Big Beautiful Bill Act. The IRS may index that amount for inflation from 2027. Payment platforms issue Form 1099-K above $20,000 and 200 transactions.",
  },
  {
    q: "Do I have to pay taxes on 1099 income if I did not get a form?",
    a: "Yes. The reporting threshold controls whether the payer must send a form, not whether the income is taxable. All self-employment income must be reported, and if your net self-employment earnings are $400 or more you also owe self-employment tax.",
  },
  {
    q: "What is the difference between a W-2 and a 1099?",
    a: "A W-2 reports wages paid to an employee, with income tax, Social Security and Medicare already withheld. A 1099-NEC reports pay to an independent contractor, usually with nothing withheld. The contractor pays both halves of Social Security and Medicare through self-employment tax and usually makes quarterly estimated payments.",
  },
  {
    q: "When are 1099 forms due?",
    a: "Form 1099-NEC is due to both the recipient and the IRS by January 31. Most other 1099s are due to recipients by January 31 (February 15 for 1099-B and certain 1099-MISC boxes) and to the IRS by February 28 on paper or March 31 if filed electronically. When a date falls on a weekend, the deadline moves to the next business day.",
  },
  {
    q: "How much should I set aside from 1099 income?",
    a: "A common starting point is 25% to 30% of profit, covering roughly 14% of profit in self-employment tax plus federal and state income tax. The right figure depends on your bracket and state; our self-employment tax calculator gives a personal estimate and quarterly payment amount.",
  },
];

export default function Page() {
  return (
    <BlogArticle
      slug={SLUG}
      eyebrow="TAX FORMS · SELF-EMPLOYMENT"
      quickAnswer={
        <p>
          <strong>A 1099 form</strong> is an IRS information return that reports income you received from someone other than an
          employer, such as contract work (1099-NEC), interest (1099-INT) or payment-app sales (1099-K). Unlike a W-2, a 1099
          usually has no tax withheld. For payments made in 2026, clients must send a 1099-NEC once they pay you{" "}
          <strong>$2,000</strong> or more, but every dollar of 1099 income is taxable whether or not a form arrives.
        </p>
      }
      takeaways={[
        "1099s report non-wage income; W-2s report wages.",
        "2026 threshold for 1099-NEC and 1099-MISC: $2,000 (was $600).",
        "1099-K from payment apps: over $20,000 and 200 transactions.",
        `Self-employment tax is 15.3% of 92.35% of profit (Social Security part up to ${usd0(FED_2026.ssWageBase)}).`,
        "No form does not mean no tax: report all income.",
      ]}
      toc={[
        { id: "definition", label: "What a 1099 form is" },
        { id: "types", label: "Common types of 1099" },
        { id: "thresholds", label: "2026 reporting thresholds" },
        { id: "w2", label: "1099 vs W-2" },
        { id: "taxes", label: "How 1099 income is taxed" },
        { id: "receive", label: "What to do when you receive one" },
        { id: "deadlines", label: "Deadlines and corrections" },
        { id: "faq", label: "FAQ" },
      ]}
      faqs={faqs}
      sources={[
        { label: "IRS, About Form 1099-NEC, Nonemployee Compensation", url: "https://www.irs.gov/forms-pubs/about-form-1099-nec" },
        { label: "IRS, General Instructions for Certain Information Returns", url: "https://www.irs.gov/instructions/i1099gi" },
        { label: "IRS, Understanding your Form 1099-K", url: "https://www.irs.gov/businesses/understanding-your-form-1099-k" },
        { label: "IRS, Self-Employment Tax (Social Security and Medicare Taxes)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes" },
        { label: "IRS Publication 505, Tax Withholding and Estimated Tax", url: "https://www.irs.gov/publications/p505" },
      ]}
      related={[
        { href: "/self-employment-tax-calculator", title: "Self-Employment Tax Calculator", blurb: "Tax and quarterly payments on 1099 income" },
        { href: "/estimated-tax-worksheet", title: "Estimated Tax Worksheet", blurb: "Plan quarterly 1040-ES payments" },
        { href: "/tax-write-off", title: "What Is a Tax Write-Off?", blurb: "Business expenses that cut 1099 profit" },
      ]}
    >
      <h2 id="definition">What Is a 1099 Form?</h2>
      <p>
        The 1099 is a family of IRS information returns. Each one tells the IRS that a business, bank, broker or agency paid
        you money during the year that was not a wage. You get Copy B; the IRS gets Copy A. When you file, the IRS matches the
        amounts on your return against the 1099s filed under your Social Security number or taxpayer identification number.
      </p>
      <p>
        That matching is the reason the form matters. A 1099 does not create tax on its own; the income is taxable either way.
        But income reported on a 1099 and missing from your return is one of the most common triggers for an IRS notice (a
        CP2000), which proposes extra tax plus interest.
      </p>

      <h2 id="types">The Most Common Types of 1099</h2>
      <DataTable
        caption="Common 1099 forms and when they are issued. Thresholds apply to payments in calendar year 2026."
        head={["Form", "Reports", "Issued when"]}
        rows={[
          ["1099-NEC", "Pay to independent contractors and freelancers", "$2,000 or more in the year"],
          ["1099-MISC", "Rents, royalties, prizes, other income", "$2,000 or more ($10 for royalties)"],
          ["1099-K", "Card and payment-app transactions for goods or services", "Over $20,000 and over 200 transactions"],
          ["1099-INT", "Bank and bond interest", "$10 or more"],
          ["1099-DIV", "Dividends and fund distributions", "$10 or more"],
          ["1099-B", "Sales of stocks, funds and other securities", "Any sale through a broker"],
          ["1099-R", "Pension, IRA and 401(k) distributions", "$10 or more"],
          ["1099-G", "Unemployment benefits, state tax refunds", "$10 or more"],
        ]}
      />
      <p>
        Social Security benefits come on a different form, the SSA-1099, and mortgage interest you paid comes on Form 1098.
        Neither is part of the 1099 series even though the names look alike.
      </p>

      <h2 id="thresholds">2026 1099 Thresholds: What Changed</h2>
      <p>
        The One Big Beautiful Bill Act, signed July 4, 2025, made two changes that apply to 2026 payments:
      </p>
      <ul>
        <li>
          <strong>1099-NEC and 1099-MISC:</strong> the reporting threshold rose from $600 to <strong>$2,000</strong> for
          payments made after December 31, 2025, with inflation indexing allowed from 2027. Backup withholding thresholds moved
          with it. Payments made in 2025 still use $600, so forms received in early 2026 follow the old rule.
        </li>
        <li>
          <strong>1099-K:</strong> the threshold reverted to the original <strong>over $20,000 and over 200 transactions</strong>,
          replacing the phased drop toward $600 that the IRS had been implementing.
        </li>
      </ul>
      <Callout title="Higher thresholds mean fewer forms, not less tax">
        <p>
          A designer who earns $1,500 from each of six clients in 2026 may receive no 1099-NEC at all, yet still owes tax on
          $9,000 of income. Keep your own record of every payment; invoices and bank deposits are the backup the IRS accepts.
        </p>
      </Callout>

      <h2 id="w2">1099 vs W-2: What the Difference Means for Your Pay</h2>
      <DataTable
        caption="Employee vs independent contractor treatment."
        head={["", "W-2 employee", "1099 contractor"]}
        rows={[
          ["Income tax withheld", "Yes, from each paycheck", "No (unless backup withholding applies)"],
          ["Social Security and Medicare", "7.65% from you, 7.65% from the employer", "15.3% paid by you as self-employment tax"],
          ["Pay taxes during the year", "Through withholding", "Quarterly estimated payments"],
          ["Business expenses", "Generally not deductible", "Deductible on Schedule C"],
          ["Benefits and overtime law", "Usually yes", "No"],
        ]}
      />
      <p>
        Which form you get should depend on how the work is controlled, not on what the client prefers. The IRS and the
        Department of Labor both look at behavioral control, financial control and the relationship of the parties. If you are
        treated like an employee but paid on a 1099, Form SS-8 asks the IRS to rule on your status.
      </p>

      <h2 id="taxes">How 1099 Income Is Taxed</h2>
      <p>
        Contract income flows to <strong>Schedule C</strong>, where you subtract business expenses to get net profit. Profit is
        then hit by two taxes: ordinary income tax at your bracket rate, and <strong>self-employment tax</strong>, which replaces
        the Social Security and Medicare an employer would otherwise split with you.
      </p>
      <Formula>
        Self-employment tax = net profit × 92.35% × 15.3%
        <br />
        (12.4% Social Security on up to {usd0(FED_2026.ssWageBase)} in 2026, plus 2.9% Medicare on all of it)
      </Formula>
      <DataTable
        caption="2026 self-employment tax vs the employee share of FICA on the same amount of W-2 wages. Excludes income tax and the 0.9% Additional Medicare Tax."
        head={["Net profit", "Self-employment tax", "Half deductible from income", "Employee FICA on equal W-2 pay"]}
        rows={seRows.map(r => [usd0(r.profit), usd2(r.total), usd2(r.deductibleHalf), usd2(r.employeeFica)])}
      />
      <p>
        On {usd0(50000)} of profit, self-employment tax is {usd2(se50.total)}, close to double the{" "}
        {usd2(50000 * 0.0765)} an employee would see withheld on the same pay. Half of it ({usd2(se50.deductibleHalf)}) is an
        adjustment to income, which softens the income-tax side. Because nothing is withheld, the IRS expects quarterly payments
        on Form 1040-ES if you will owe $1,000 or more. The <a href="/self-employment-tax-calculator">self-employment tax
        calculator</a> runs both taxes and the quarterly amount; the <a href="/estimated-tax-worksheet">estimated tax worksheet</a>{" "}
        walks through safe-harbor rules.
      </p>

      <h2 id="receive">What to Do When You Receive a 1099</h2>
      <ol>
        <li>Check your name, taxpayer ID and the amount against your own records.</li>
        <li>If the amount is wrong, ask the payer for a corrected form before you file.</li>
        <li>Report the income on the right schedule: Schedule C for 1099-NEC, Schedule B for interest and dividends, Form 8949 for 1099-B sales.</li>
        <li>Keep the form with your return records for at least three years.</li>
      </ol>
      <p>
        A 1099-K can include personal payments that are not income, such as splitting a dinner bill or selling a used couch for
        less than you paid. Report the form and back out the non-taxable amount as the Form 1040 instructions describe, rather
        than ignoring it.
      </p>

      <h2 id="deadlines">1099 Deadlines and Corrections</h2>
      <p>
        Payers must furnish Form 1099-NEC to recipients and file it with the IRS by <strong>January 31</strong>. Most other
        1099s go to recipients by January 31 and to the IRS by February 28 on paper or March 31 electronically; Form 1099-B and
        some 1099-MISC boxes have a February 15 recipient date. If a form has not arrived by mid-February, contact the payer.
        You can still file on time using your own records, then amend if a late form shows a different figure.
      </p>
      <p>
        Understanding what a 1099 form is comes down to one idea: it reports income the IRS will expect to see on your return,
        and it usually arrives with no tax paid on it yet. Plan for that tax as you earn, not in April.
      </p>
    </BlogArticle>
  );
}
