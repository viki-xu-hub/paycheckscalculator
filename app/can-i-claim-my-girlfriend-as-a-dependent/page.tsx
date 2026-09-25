import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const YEAR = "2026";
const CANONICAL = "https://www.paycheckscalculator.org/can-i-claim-my-girlfriend-as-a-dependent";
const TITLE = `Can I Claim My Girlfriend as a Dependent? ${YEAR} IRS Rules`;
const DESCRIPTION = `Can I claim my girlfriend as a dependent? Sometimes — she must live with you all year, earn under $5,300 in ${YEAR}, and get over half her support from you.`;

// IRS Rev. Proc. 2025-32 §3.23: "For taxable years beginning in 2026, the exemption
// amount referred to in § 152(d)(1)(B) is $5,300." The 2025 figure was $5,200.
const LIMIT_2026 = 5300;
const LIMIT_2025 = 5200;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/can-i-claim-my-girlfriend-as-a-dependent" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
};

const faqs = [
  {
    q: "Can I claim my girlfriend as a dependent if she has no income?",
    a: `Potentially. Having no income satisfies the gross income part of the test, and it is the easiest test to clear. She still has to live with you for the entire year as a member of your household, receive more than half her support from you, not be another taxpayer's qualifying child, and meet the citizenship or residency rule.`,
  },
  {
    q: "Can I claim my girlfriend as a dependent if she works?",
    a: `Only if her gross income stays under the limit — ${usd(LIMIT_2026)} for ${YEAR}. A job does not disqualify her by itself, but anything close to full-time work almost certainly pushes her over. For most working couples the income test settles the question before the support calculation even matters.`,
  },
  {
    q: "Can I claim my girlfriend if we don't live together?",
    a: `Generally no. A girlfriend is not one of the relatives who can meet the relationship test without living with you, so she has to live in your household for the whole year. Paying her rent somewhere else does not substitute for that, no matter how much of her support you provide.`,
  },
  {
    q: "Can I claim my girlfriend if she lived with me for six months?",
    a: `Generally no. The "more than half the year" rule people remember belongs to the qualifying child test, not this one. An unrelated partner has to live with you all year. Moving in during February or June breaks it for that tax year, though certain temporary absences — school, illness, military service, vacation — may be treated differently.`,
  },
  {
    q: "Can I claim my girlfriend and her child?",
    a: `They are evaluated separately, and one can qualify while the other does not. The common blocker is that her child is her own qualifying child, which prevents you from claiming the child as your qualifying relative. Do not assume that clearing the tests for her clears them for the child.`,
  },
  {
    q: "Does claiming my girlfriend make me Head of Household?",
    a: `Usually not on its own. Dependent status and Head of Household are different tests. IRS Publication 501 gives the example directly: a friend who lives with you all year may be your qualifying relative, but is not a qualifying person for Head of Household because they are not related to you in one of the required ways.`,
  },
  {
    q: "How much can my girlfriend make and still be my dependent?",
    a: `Under ${usd(LIMIT_2026)} of gross income for ${YEAR}, up from ${usd(LIMIT_2025)} for ${YEAR === "2026" ? "2025" : "the prior year"}. The figure is indexed and changes most years, so check the limit for the specific return you are filing. Gross income here means income in money, property and services that is not exempt from tax — not the amount that lands in her bank account after withholding.`,
  },
  {
    q: "Can I claim my boyfriend as a dependent?",
    a: `The same rules apply. Nothing in the qualifying relative test turns on gender: an unmarried boyfriend, partner or unrelated housemate can qualify on exactly the same five conditions.`,
  },
];

export default function ClaimGirlfriendAsDependentPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Can I Claim My Girlfriend as a Dependent? IRS Rules Explained",
    description: DESCRIPTION,
    url: CANONICAL,
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
    author: { "@type": "Organization", name: "Paycheck Calculator Editorial Team" },
    publisher: { "@type": "Organization", name: "Paycheck Atlas" },
    dateModified: "2026-09-25",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.paycheckscalculator.org" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.paycheckscalculator.org/blog" },
      { "@type": "ListItem", position: 3, name: "Claiming a Girlfriend as a Dependent", item: CANONICAL },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader />

      <section className="hero">
        <div className="eyebrow">{YEAR} IRS DEPENDENT RULES</div>
        <h1>Can I Claim My Girlfriend as a <em>Dependent?</em></h1>
        <div className="hero-intro">
          <p>
            Can I claim my girlfriend as a dependent? Sometimes, yes. The IRS does not require a dependent to be your
            child or a blood relative — an unmarried
            partner can qualify under the rules for a <strong>qualifying relative</strong>. But paying most of her bills
            is not enough on its own. Five separate tests have to be met, and the income one eliminates most couples
            before the others matter.
          </p>
        </div>
        <div className="trust-row">
          <span>IRS Publication 501</span>
          <span>{YEAR} limit: {usd(LIMIT_2026)}</span>
          <span>Updated September 2026</span>
        </div>
      </section>

      <article className="long-seo">
        <p className="kicker">THE SHORT ANSWER</p>
        <h2>Can I Claim My Girlfriend as a Dependent? The Short Answer</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src="/images/dependent/girlfriend-dependent-tests.svg"
              alt={`Can I claim my girlfriend as a dependent? The five IRS tests for ${YEAR}: full-year household, gross income under ${usd(LIMIT_2026)}, more than half her support, not another taxpayer's qualifying child, and citizenship or residency`}
              width={880}
              height={400}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              All five have to pass. Failing any one of them ends the question, however much support you provide.
            </figcaption>
          </figure>
          <p>
            Despite the name, a &ldquo;qualifying relative&rdquo; does not have to be related to you. For an unrelated
            person, the requirements are:
          </p>
          <ul className="checklist">
            <li>She lived with you for the <strong>entire year</strong> as a member of your household</li>
            <li>Her gross income was <strong>under {usd(LIMIT_2026)}</strong> for {YEAR}</li>
            <li>You provided <strong>more than half</strong> of her total support</li>
            <li>She was <strong>not the qualifying child</strong> of another taxpayer</li>
            <li>She met the citizenship or residency requirement, and your relationship did not violate local law</li>
          </ul>
          <p style={{ marginTop: 20, color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            Failing even one of these prevents the claim. The rest of this guide works through each test, with the
            examples that decide most real cases.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TEST 1 — HOUSEHOLD</p>
        <h2>Test 1: Your Girlfriend Must Live With You All Year</h2>
        <section>
          <p>
            This is the biggest difference between claiming a girlfriend and claiming family. Parents, children,
            siblings, grandparents and certain in-laws satisfy the relationship requirement <em>without</em> living with
            you. A girlfriend is not on that list, so your home has to have been her household for the full year.
          </p>
          <p>
            Moved in on 1 January and stayed through 31 December? That part of the test may be met. Moved in during
            June? Even if you paid every one of her expenses from that day on, the full-year requirement fails for that
            tax year. Certain temporary absences — education, illness, business, vacation, military service — can be
            treated differently from permanently living elsewhere.
          </p>
          <p>
            The question is not whether she spent a lot of time at your place. It is whether your home was her
            household for the required period.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TEST 2 — INCOME</p>
        <h2>Test 2: Her Gross Income Must Be Under {usd(LIMIT_2026)}</h2>
        <section>
          <p>
            For {YEAR}, a qualifying relative&apos;s gross income must be less than <strong>{usd(LIMIT_2026)}</strong>.
            The limit was {usd(LIMIT_2025)} for 2025 — it is indexed for inflation and moves most years, so check the
            figure for the return you are actually filing.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Her gross income</th><th>Income test</th></tr></thead>
              <tbody>
                <tr><td>$0 — she does not work</td><td>Passes</td></tr>
                <tr><td>$3,000 from occasional part-time work</td><td>Passes</td></tr>
                <tr><td>{usd(LIMIT_2026 - 1)}</td><td>Passes, barely</td></tr>
                <tr><td>{usd(LIMIT_2026)}</td><td>Fails — the limit is &ldquo;less than&rdquo;</td></tr>
                <tr className="rate-total"><td><strong>$15,000 from a regular job</strong></td><td><strong>Fails</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            This is the test that ends most cases. A girlfriend earning $15,000 cannot be your dependent even if you
            pay the rent, utilities, groceries and insurance — her income is simply over the line.
          </p>
          <p>
            One detail that trips people up: gross income is not what lands in her bank account. The IRS means income
            in the form of money, property and services that is not exempt from tax. If you want to see the gap between
            the two for your own pay, the <a className="text-link" href="/">paycheck calculator</a> breaks gross down to
            net line by line, and{" "}
            <a className="text-link" href="/how-much-tax-is-taken-from-my-paycheck">how much tax is taken from a paycheck</a>{" "}
            explains each deduction.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TEST 3 — SUPPORT</p>
        <h2>Test 3: You Must Provide More Than Half Her Support</h2>
        <section>
          <p>
            Clearing the income test does not finish the job. You generally have to provide more than 50% of her total
            support for the calendar year. Support includes housing, food, clothing, medical and dental costs,
            transportation, education, recreation and other basic living expenses.
          </p>
          <p>
            Housing carries a lot of weight. If she lives in a home you pay for, the value of that lodging counts
            toward the support you provide. The arithmetic is simply{" "}
            <strong>support you provided ÷ total support she received</strong>, and the result has to clear 50%.
          </p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>What you paid</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td>Housing</td><td>$7,000</td></tr>
                <tr><td>Food</td><td>$3,000</td></tr>
                <tr><td>Transportation</td><td>$1,500</td></tr>
                <tr><td>Medical and other</td><td>$1,000</td></tr>
                <tr><td>Your total</td><td>$12,500</td></tr>
                <tr><td>Her total support from all sources</td><td>$20,000</td></tr>
                <tr className="rate-total"><td><strong>Your share</strong></td><td><strong>62.5% — passes</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Contribute $9,000 of that same $20,000 instead and your share is 45% — the test fails. Note that the
            denominator is her <em>total</em> support from every source, not just what the two of you spent, which is
            why parental contributions so often break this test.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TESTS 4 AND 5</p>
        <h2>Tests 4 and 5: The Dependent Rules People Forget</h2>
        <section>
          <h3>She cannot be someone else&apos;s qualifying child</h3>
          <p>
            If your girlfriend is the qualifying child of another taxpayer, you cannot claim her as your qualifying
            relative instead. This comes up most with younger adults: a 21-year-old full-time student may still meet
            the requirements to be her parents&apos; qualifying child, depending on her living situation. Who pays the
            bills is not the whole question.
          </p>
          <h3>Citizenship, residency, and local law</h3>
          <p>
            A dependent generally must be a U.S. citizen, U.S. national, U.S. resident alien, or a resident of Canada
            or Mexico, subject to the applicable exceptions. This matters if one partner recently moved to the United
            States, is an international student, or has nonresident status.
          </p>
          <p>
            There is also a rule that gets almost no attention: for an unrelated person to qualify by living in your
            household, the relationship must not violate local law. Publication 501 gives the example of a partner who
            lived with the taxpayer all year but was married to someone else — the relationship violated state law, so
            the household test failed.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WORKED EXAMPLES</p>
        <h2>Claiming a Girlfriend as a Dependent: Four Worked Examples</h2>
        <section>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Situation</th><th>Result</th><th>Why</th></tr></thead>
              <tbody>
                <tr>
                  <td>Lives with you all year, no income, you pay everything</td>
                  <td><strong>May qualify</strong></td>
                  <td>All five tests can be met</td>
                </tr>
                <tr>
                  <td>Lives with you all year, earns $38,000</td>
                  <td>No</td>
                  <td>Income far over {usd(LIMIT_2026)}</td>
                </tr>
                <tr>
                  <td>No income, moves in on 1 July, you pay everything after</td>
                  <td>No</td>
                  <td>Not a full-year household member</td>
                </tr>
                <tr>
                  <td>Lives with you all year, little income, parents pay her tuition and medical bills</td>
                  <td>Probably not</td>
                  <td>Your share of total support may not clear 50%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT IT IS WORTH</p>
        <h2>What Claiming a Girlfriend as a Dependent Is Worth</h2>
        <section>
          <p>
            A girlfriend who qualifies as your dependent does not make you eligible for the Child Tax Credit. A
            qualifying relative may make you eligible for the <strong>Credit for Other Dependents</strong>, assuming the
            credit&apos;s own requirements are met. Credit amounts and income limits change, so check the rules for the
            year you are filing.
          </p>
          <p>
            Claiming her also does not make you Head of Household by itself — those are separate tests, and an
            unrelated partner is not a qualifying person for that status.
          </p>
          <p>
            Whether the claim changes your bottom line depends on your income, filing status and other credits. Run
            your numbers before and after with the{" "}
            <a className="text-link" href="/">take-home pay calculator</a>, and if the answer changes your withholding,{" "}
            <a className="text-link" href="/tax-write-off">what a tax write-off actually does</a> explains why a
            deduction and a credit move your bill by different amounts.
          </p>
          <p>
            Being claimed does not stop her filing her own return, either. She may still need to file — or want to, to
            recover withholding — as long as the return reflects her dependent status correctly.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">RECORDS</p>
        <h3>Records to keep if you make the claim</h3>
        <section>
          <p>
            You should be able to show both where she lived and how you worked out that you provided more than half her
            support. A simple spreadsheet listing her total annual support and who paid each item is usually enough.
          </p>
          <ul className="checklist">
            <li>Lease or housing documents showing a shared residence</li>
            <li>Utility bills, grocery and transportation costs</li>
            <li>Medical expenses and insurance payments you covered</li>
            <li>Bank or credit-card records</li>
            <li>Records of her income, and of any other support she received</li>
          </ul>
        </section>
      </article>

      <div className="faq">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Can I Claim My Girlfriend as a Dependent? FAQ</h2>
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}<span>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <article className="long-seo">
        <p className="kicker">BOTTOM LINE</p>
        <h2>Bottom Line: Can You Claim Your Girlfriend as a Dependent?</h2>
        <section>
          <p>
            You can potentially claim your girlfriend as a dependent, but only if she meets the qualifying relative
            requirements. In practice the full-year household test, the {usd(LIMIT_2026)} income test and the support
            test decide almost every case. A partner who lived with you all year, earned very little and received more
            than half her support from you has a real chance; one with a regular full-time income or her own place
            does not.
          </p>
          <p>
            Before filing, add up the support you actually provided and confirm her gross income for the year. The
            IRS&apos;s{" "}
            <a className="text-link" href="https://www.irs.gov/help/ita/whom-may-i-claim-as-a-dependent" target="_blank" rel="noopener noreferrer">
              Whom May I Claim as a Dependent?
            </a>{" "}
            interactive assistant gives a situation-specific answer, and{" "}
            <a className="text-link" href="https://www.irs.gov/publications/p501" target="_blank" rel="noopener noreferrer">
              Publication 501
            </a>{" "}
            is the underlying source for every rule on this page. The {usd(LIMIT_2026)} figure comes from{" "}
            <a className="text-link" href="https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" target="_blank" rel="noopener noreferrer">
              IRS Revenue Procedure 2025-32
            </a>
            , which sets the § 152(d)(1)(B) exemption amount for {YEAR}.
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> general information, not individualised tax advice. Thresholds change between
            years — always verify the limit for the tax year you are filing.
          </p>
        </section>
        <div className="reviewer">
          <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
          <p><small>Limits current for tax year {YEAR}</small></p>
        </div>
      </article>

      <article className="long-seo">
        <p className="kicker">RELATED GUIDES</p>
        <h3>More on dependents, benefits and take-home pay</h3>
        <section>
          <div className="tool-links">
            <a href="/dependent-care-fsa"><b>Dependent Care FSA</b><span>Now $7,500 for {YEAR} →</span></a>
            <a href="/hsa-calculator"><b>HSA Calculator</b><span>{YEAR} limits and tax savings →</span></a>
            <a href="/tax-write-off"><b>What Is a Tax Write-Off?</b><span>Deductions vs credits →</span></a>
            <a href="/w4v-form"><b>Form W-4V</b><span>Voluntary withholding →</span></a>
            <a href="/"><b>Paycheck Calculator</b><span>Take-home pay after tax →</span></a>
            <a href="/state-paycheck-calculators"><b>State Calculators</b><span>All 50 states + DC →</span></a>
            <a href="/texas-paycheck-calculator-with-dependents"><b>Texas With Dependents</b><span>W-4 Step 3 credits →</span></a>
            <a href="/blog"><b>All Guides</b><span>Every tax explainer →</span></a>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
