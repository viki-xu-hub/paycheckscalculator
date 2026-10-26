import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import NoTaxOvertimeCalculator from "../components/NoTaxOvertimeCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";
import {
  OT_DEDUCTION_CAP,
  OT_PHASEOUT_START,
  OT_PHASEOUT_PER_1000,
  OT_YEARS,
  otPhaseoutEnd,
} from "../lib/overtimeDeduction";

const m0 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const SEO: StandaloneSeo = {
  slug: "no-tax-on-overtime",
  title: "No Tax on Overtime 2026 — Deduction Rules Explained",
  description:
    "No tax on overtime explained: the One Big Beautiful Bill deduction covers up to $12,500 of overtime premium ($25,000 joint) for 2025–2028. See if you qualify.",
  crumb: "No Tax on Overtime",
  appName: "No Tax on Overtime Calculator",
  faqs: [
    {
      q: "Is there really no tax on overtime?",
      a: "Not entirely — the name is shorthand. The One Big Beautiful Bill Act created a federal income tax deduction for qualified overtime compensation for tax years 2025 through 2028. It removes income tax on up to $12,500 of overtime premium ($25,000 for joint filers), but Social Security and Medicare are still withheld, most states still tax the overtime, and anything above the cap is taxed normally.",
    },
    {
      q: "When does no tax on overtime start?",
      a: "It applies to tax years 2025 through 2028. The 2025 tax year was the first one covered, claimed on the return filed in 2026. It is scheduled to expire after 2028 unless Congress extends it.",
    },
    {
      q: "How much overtime can I deduct?",
      a: "Up to $12,500 a year if you file single, or $25,000 if you file jointly. The deduction covers only the premium portion — the extra half in time-and-a-half — not the whole overtime payment. Someone paid $30 an hour who works 200 overtime hours earns $9,000 in overtime, of which $3,000 is premium; the $3,000 is what counts.",
    },
    {
      q: "Does no tax on overtime have an income limit?",
      a: "Yes. The deduction starts phasing out once modified adjusted gross income passes $150,000 ($300,000 joint), dropping by $100 for every $1,000 above the threshold. It reaches zero at $275,000 for single filers and $550,000 for joint filers.",
    },
    {
      q: "Does the overtime deduction reduce Social Security and Medicare tax?",
      a: "No. It is a deduction against income for federal income tax purposes, claimed on your return. Social Security at 6.2% and Medicare at 1.45% still apply to every overtime dollar, and your employer still withholds them from each paycheck.",
    },
    {
      q: "What counts as qualified overtime compensation?",
      a: "Only overtime required by the Fair Labor Standards Act — generally hours over 40 in a workweek — and only the premium above your regular rate. The IRS has been explicit that overtime owed solely under a collective bargaining agreement, a state daily-overtime law, or an employer policy does not qualify if the FLSA itself did not require it. The amount must be reported on a Form W-2, Form 1099 or similar statement.",
    },
    {
      q: "Do I need to itemize to claim it?",
      a: "No. The deduction is available whether or not you itemize, so you can take the standard deduction and still claim it. You do need a Social Security number valid for employment.",
    },
    {
      q: "Did the big beautiful bill pass for no tax on overtime?",
      a: "Yes. The provision was enacted as part of the One Big Beautiful Bill Act and applies for tax years 2025 through 2028. The IRS has published guidance including a question-and-answer fact sheet and a dedicated schedule for claiming the deduction on the return.",
    },
    {
      q: "Is there tax on overtime?",
      a: "Yes — overtime is taxable wages. What changed is that part of it can now be deducted. Social Security, Medicare and (in most states) state income tax still apply to every overtime dollar, and federal income tax still applies to anything above the deduction cap. So there is tax on overtime; there is simply less federal income tax on the premium portion than there used to be.",
    },
    {
      q: "How does no tax on overtime work?",
      a: "It works as a deduction, not an exemption. Your employer still withholds tax from each overtime paycheck during the year. At filing, you report your qualified overtime compensation — the premium half of FLSA time-and-a-half — and deduct up to $12,500 ($25,000 joint) from the income the federal government taxes. The benefit arrives as a smaller tax bill or a larger refund, not as a bigger paycheck during the year.",
    },
    {
      q: "When will no tax on overtime start, and when will it take effect?",
      a: "It already has. The big beautiful bill no tax on overtime provision applies from tax year 2025 and runs through 2028, so the first returns claiming it were filed in 2026. Because it works through the annual return rather than payroll, there was no date when paychecks visibly changed — which is why people still ask when it will start after it already has.",
    },
    {
      q: "How will no tax on overtime work in practice?",
      a: "Your employer keeps withholding tax from overtime as normal during the year. At filing you report qualified overtime compensation from your W-2 and deduct it, up to the cap. The money comes back as a lower tax bill or a larger refund. Nothing about your weekly or biweekly deposit changes.",
    },
    {
      q: "When does no tax on overtime go into effect in Texas, California or any other state?",
      a: "The same everywhere — it is a federal deduction, so the start date does not vary by state. What does vary is state tax: no tax on overtime California, Texas or anywhere else refers only to the federal income tax deduction. Texas has no state income tax at all, so overtime there was already free of state tax. California does tax overtime and its treatment of the federal deduction is a separate question from the federal rule.",
    },
    {
      q: "What does no tax on overtime mean?",
      a: "It means a capped federal income tax deduction on the premium half of FLSA overtime, not tax-free overtime. The phrase is political shorthand. Payroll tax still applies, most states still tax the pay, and anything above $12,500 ($25,000 joint) of premium is taxed normally.",
    },
    {
      q: "When does no tax on overtime start and when does it take effect?",
      a: "It took effect for tax year 2025 and runs through tax year 2028. The 2025 tax year was claimed on returns filed in 2026. Because it operates on the annual return rather than through payroll, there was no single date when paychecks changed — the IRS provided transition relief for 2025 while employers updated how they report qualified overtime on the W-2.",
    },
    {
      q: "Did the no tax on tips and overtime bill pass?",
      a: "Yes. Both provisions were enacted in the One Big Beautiful Bill Act. The overtime deduction is capped at $12,500 ($25,000 joint) and the tips deduction at $25,000, both phasing out above $150,000 of modified AGI ($300,000 joint), and both running for tax years 2025 through 2028.",
    },
    {
      q: "What does the big beautiful bill overtime provision mean for me?",
      a: "If you are a non-exempt employee who works FLSA overtime and earns under $150,000, it means a deduction worth your marginal rate on the premium half of that overtime — commonly a few hundred to a couple of thousand dollars of federal income tax. If you are exempt from FLSA overtime, earn above the phase-out range, or your extra pay comes only from a union contract or state daily-overtime rule, it means nothing for you.",
    },
    {
      q: "Is the overtime tax deduction the same as an exemption?",
      a: "No. An exemption would remove the income from taxation entirely, including payroll tax. This is an overtime tax deduction: it reduces taxable income for federal income tax only, is capped, and phases out with income. Calling it 'no tax on overtime' overstates it in three separate ways.",
    },
    {
      q: "How do I claim no tax on overtime on my return?",
      a: "The IRS publishes a schedule specifically for the new deductions — overtime, tips, car loan interest and the senior deduction. Your employer reports qualified overtime compensation on your W-2, and you carry that figure to the schedule. Transition relief applied for the 2025 tax year while employers updated reporting.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function NoTaxOnOvertimePage() {
  const schemas = standaloneSchemas(SEO);
  return (
    <main>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <span>No Tax on Overtime</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">OBBBA OVERTIME DEDUCTION · {OT_YEARS}</div>
        <h1>No Tax on Overtime — What the Deduction Actually Does</h1>
        <p className="hero-copy">
          <strong>No tax on overtime</strong> is shorthand for a real but narrower rule: a federal
          deduction for qualified overtime compensation, worth up to{" "}
          {m0(OT_DEDUCTION_CAP.single)} ({m0(OT_DEDUCTION_CAP.married)} joint), covering the
          premium half of FLSA overtime for {OT_YEARS}. It does not make overtime tax-free. Use
          the no tax on overtime calculator below to see what it is worth on your numbers.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <NoTaxOvertimeCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">WHAT IT IS</p>
        <h2>No Tax on Overtime Explained</h2>
        <section>
          <p>
            The One Big Beautiful Bill Act created a deduction for{" "}
            <strong>qualified overtime compensation</strong>. For tax years {OT_YEARS}, eligible
            workers subtract that overtime from the income the federal government taxes. It is
            available to itemizers and non-itemizers alike, so taking the standard deduction does
            not cost you the break.
          </p>
          <p>
            Three limits turn &ldquo;no tax on overtime&rdquo; into something more modest, and all
            three catch people out:
          </p>
          <ul className="checklist">
            <li><strong>Only the premium counts</strong> — the extra half in time-and-a-half, not the entire overtime payment</li>
            <li><strong>Only income tax</strong> — Social Security and Medicare still come out, and most states still tax it</li>
            <li><strong>Capped and phased out</strong> — {m0(OT_DEDUCTION_CAP.single)} single, {m0(OT_DEDUCTION_CAP.married)} joint, shrinking above {m0(OT_PHASEOUT_START.single)} of modified AGI</li>
          </ul>
          <h3>Premium, not total overtime</h3>
          <p>
            This is the single biggest misreading. If you earn $30 an hour and work 200 overtime
            hours in a year, you are paid $45 an hour for those hours — $9,000 of overtime pay.
            But only the premium above your regular rate qualifies: $15 an hour × 200 hours ={" "}
            <strong>$3,000</strong>. That $3,000 is the deduction figure, not $9,000.
          </p>
          <p>
            In practice the cap binds only for people with a great deal of overtime. Reaching the
            full {m0(OT_DEDUCTION_CAP.single)} at a $30 regular rate would take roughly 833
            overtime hours in a year — about 16 extra hours every week.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHO QUALIFIES</p>
        <h2>Eligibility — and the FLSA Catch</h2>
        <section>
          <p>
            The overtime has to be required by the <strong>Fair Labor Standards Act</strong>. That
            generally means hours beyond 40 in a workweek, paid to a non-exempt employee.
          </p>
          <p>
            The IRS has stated this narrowly, and it excludes overtime many workers actually
            receive. Premium pay owed only under a collective bargaining agreement does not
            qualify. Neither does state daily overtime — California&apos;s time and a half after 8
            hours in a day is a state entitlement, not an FLSA one, so the hours that were
            overtime only under California law fall outside the deduction. If you are exempt from
            FLSA overtime altogether, no amount of extra pay qualifies, whatever your contract
            calls it.
          </p>
          <p>
            You also need a <strong>Social Security number valid for employment</strong>, and the
            compensation has to be reported on a Form W-2, Form 1099 or similar statement — which
            is why employer reporting matters and why the IRS granted transition relief for 2025
            while payroll systems caught up.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE PHASE-OUT</p>
        <h2>Income Limits on the Overtime Deduction</h2>
        <section>
          <p>
            Above {m0(OT_PHASEOUT_START.single)} of modified AGI ({m0(OT_PHASEOUT_START.married)}{" "}
            joint), the cap falls by <strong>${OT_PHASEOUT_PER_1000} for every $1,000</strong> of
            income over the threshold. It reaches zero at{" "}
            {m0(otPhaseoutEnd("single"))} for single filers and {m0(otPhaseoutEnd("married"))} for
            joint filers.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Modified AGI (single)</th>
                  <th>Over threshold</th>
                  <th>Cap reduction</th>
                  <th>Maximum deduction</th>
                </tr>
              </thead>
              <tbody>
                {[150000, 175000, 200000, 225000, 250000, 275000].map((magi) => {
                  const over = Math.max(0, magi - OT_PHASEOUT_START.single);
                  const cut = Math.min(OT_DEDUCTION_CAP.single, Math.floor(over / 1000) * OT_PHASEOUT_PER_1000);
                  const left = OT_DEDUCTION_CAP.single - cut;
                  return (
                    <tr key={magi} className={left === 0 ? "rate-total" : undefined}>
                      <td>{m0(magi)}</td>
                      <td>{m0(over)}</td>
                      <td>{cut === 0 ? "—" : `− ${m0(cut)}`}</td>
                      <td>{left === 0 ? <strong>{m0(0)}</strong> : m0(left)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>
            Note that the phase-out works on modified AGI, which includes the overtime itself. A
            heavy overtime year can push you into the phase-out range that the overtime was
            supposed to be sheltered from.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHAT IT IS WORTH</p>
        <h2>Real Numbers, Not the Headline</h2>
        <section>
          <p>
            A deduction saves you your marginal rate, not the full amount. Deducting $3,000 of
            overtime premium in the 22% bracket saves $660 in federal income tax — meaningful,
            but a long way from &ldquo;no tax on overtime.&rdquo; FICA on that same overtime is
            untouched.
          </p>
          <p>
            Your state may or may not follow the federal treatment. States that start from federal
            taxable income may pick it up automatically; states with their own definitions of
            income generally will not, and several have said so explicitly. Check your state before
            assuming the break flows through.
          </p>
          <p>
            Use the calculator at the top of this page to put your own numbers in, and the{" "}
            <a href="/overtime-calculator">overtime calculator</a> to work out how much premium you
            actually accumulate in a year.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>No Tax on Overtime — Frequently Asked Questions</h2>
        <section>
          {SEO.faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}<span>+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">SOURCES</p>
        <h2>Where These Figures Come From</h2>
        <section>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            Deduction caps, phase-out thresholds and the {OT_YEARS} window come from the IRS
            Working Families Tax Cuts guidance on the One, Big, Beautiful Bill. The definition of
            qualified overtime compensation, the Social Security number requirement and the
            treatment of collective-bargaining and state-law overtime come from the IRS questions
            and answers on the new deduction (Fact Sheet 2026-01, superseded by FS-2026-13).
          </p>
          <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>
            <strong>Disclaimer:</strong> this is a planning tool, not tax advice. The deduction
            interacts with your full return, and state treatment varies. Confirm your situation
            with a tax professional or the current IRS guidance before filing.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">RELATED</p>
        <h2>More Pay and Tax Calculators</h2>
        <section>
          <ul className="checklist">
            <li><a href="/overtime-calculator">Overtime Calculator — time and a half and double time</a></li>
            <li><a href="/">Paycheck Calculator — take-home pay after all deductions</a></li>
            <li><a href="/tax-on-commission">Tax on Commission and Bonus Payments</a></li>
            <li><a href="/post-tax-deductions">Pre-Tax vs Post-Tax Deductions</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
