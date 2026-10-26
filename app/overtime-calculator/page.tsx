import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import OvertimeCalculator from "../components/OvertimeCalculator";
import { standaloneMetadata, standaloneSchemas, type StandaloneSeo } from "../lib/seo/standalonePage";

const SEO: StandaloneSeo = {
  slug: "overtime-calculator",
  title: "Overtime Calculator 2026 — Time and a Half Pay",
  description:
    "Free overtime calculator. Work out time and a half, double time and your total weekly gross from any hourly rate, plus how overtime is taxed in 2026.",
  crumb: "Overtime Calculator",
  appName: "Overtime Calculator",
  faqs: [
    {
      q: "How do you calculate overtime pay?",
      a: "Multiply your regular hourly rate by 1.5, then multiply that by the number of overtime hours. At $25 an hour, time and a half is $37.50, so 5 overtime hours pay $187.50 on top of your regular 40 hours. Under the Fair Labor Standards Act, overtime is owed on hours worked beyond 40 in a single workweek — not beyond 8 in a day, which is a state-level rule in places like California.",
    },
    {
      q: "What is time and a half for $20 an hour?",
      a: "Time and a half for $20 an hour is $30 an hour. The formula is the regular rate × 1.5. For any rate, add half the rate to itself: $18 becomes $27, $22 becomes $33, $30 becomes $45.",
    },
    {
      q: "Is overtime taxed at a higher rate?",
      a: "No. Overtime is ordinary wages and is taxed at the same rates as the rest of your pay. What confuses people is withholding: many payroll systems annualise the larger paycheck, so a week with heavy overtime can have a bigger share withheld than usual. That evens out when you file. Separately, for tax years 2025 through 2028 a federal deduction lets eligible workers deduct the premium half of FLSA overtime, up to $12,500 ($25,000 joint).",
    },
    {
      q: "How many hours is overtime?",
      a: "Federally, any hours over 40 in a workweek. A workweek is a fixed, recurring 168-hour period your employer defines; it does not have to start on Monday. Some states add daily overtime — California pays time and a half after 8 hours in a day and double time after 12.",
    },
    {
      q: "What is double time and when does it apply?",
      a: "Double time is twice your regular rate. Federal law does not require it at all — the FLSA stops at time and a half. Double time comes from state law (California, after 12 hours in a day or on the seventh consecutive workday), union contracts, or employer policy for holidays.",
    },
    {
      q: "Do salaried employees get overtime?",
      a: "Some do. Being paid a salary does not by itself make you exempt — you must also earn above the federal salary threshold and perform exempt executive, administrative or professional duties. A salaried worker below the threshold, or whose duties are not exempt, is entitled to overtime calculated from their effective hourly rate.",
    },
    {
      q: "Is overtime pay taxable?",
      a: "Yes. Overtime pay is taxable as ordinary wages — federal income tax, Social Security and Medicare all apply, as does state income tax where you live. The only relief is the 2025–2028 federal deduction for the premium half of FLSA overtime, which reduces income tax on that portion but not payroll tax.",
    },
    {
      q: "Is overtime always time and a half, and what is double time pay?",
      a: "Federally, yes — the FLSA requires time and a half and nothing more. Double time pay is twice the regular rate and is never federally required; it comes from state law, union contracts or employer policy. To calculate double time, multiply the regular rate by 2: $22 an hour becomes $44.",
    },
    {
      q: "What is overtime on overtime?",
      a: "It refers to recalculating the overtime rate when extra pay is added after the fact. Because the regular rate must include non-discretionary bonuses and shift differentials, a bonus paid later can retroactively raise the regular rate — meaning additional overtime premium is owed on hours already worked. Employers settle this with a true-up payment.",
    },
    {
      q: "How do you figure overtime pay quickly?",
      a: "Half the hourly rate is the premium per overtime hour. At $24 an hour, the premium is $12, so 6 overtime hours add $72 above what those hours would have paid at straight time — or $216 in total overtime pay. The overtime rate calculator above does both figures at once.",
    },
    {
      q: "Is overtime calculated on gross or net pay?",
      a: "On gross. The overtime premium is applied to your regular rate of pay before any tax or deduction. Your regular rate also has to include non-discretionary bonuses and shift differentials, which can make it slightly higher than your base hourly wage.",
    },
  ],
};

export const metadata: Metadata = standaloneMetadata(SEO);

export default function OvertimeCalculatorPage() {
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
        <span>Overtime Calculator</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">OVERTIME PAY · 2026</div>
        <h1>Overtime Calculator — Time and a Half Pay</h1>
        <p className="hero-copy">
          Enter your hourly rate and overtime hours to see what the week actually pays. This{" "}
          <strong>overtime calculator</strong> handles time and a half, double time and the
          overtime premium separately — the premium matters because it is the only part the new
          federal overtime deduction applies to. It doubles as an overtime hours calculator, an
          overtime rate calculator and a time and a half pay calculator.
        </p>
      </section>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <OvertimeCalculator />
      </div>

      <article className="long-seo">
        <p className="kicker">THE FORMULA</p>
        <h2>How to Calculate Overtime Pay</h2>
        <section>
          <p>
            Overtime pay is your regular hourly rate multiplied by 1.5, applied to every hour
            worked beyond 40 in a workweek. Written out: <strong>overtime pay = regular rate ×
            1.5 × overtime hours</strong>. At $25 an hour, that is $37.50 for each overtime hour.
          </p>
          <p>
            The part people get wrong is the <strong>overtime premium</strong> — the extra half.
            When you work an overtime hour at time and a half, you are paid your normal rate for
            the hour plus a premium of half that rate. Those are separate lines on a pay stub and,
            since 2025, separate lines for tax purposes too. On $25 an hour, 5 overtime hours pay
            $187.50 in total, of which $62.50 is premium.
          </p>
          <h3>Time and a half at common rates</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Regular rate</th>
                  <th>Time and a half</th>
                  <th>Double time</th>
                  <th>5 OT hours pay</th>
                </tr>
              </thead>
              <tbody>
                {[15, 18, 20, 22, 25, 30, 35, 40, 50].map((r) => (
                  <tr key={r}>
                    <td>${r.toFixed(2)}</td>
                    <td>${(r * 1.5).toFixed(2)}</td>
                    <td>${(r * 2).toFixed(2)}</td>
                    <td>${(r * 1.5 * 5).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">WHEN OVERTIME IS OWED</p>
        <h2>The 40-Hour Rule — and Where States Go Further</h2>
        <section>
          <p>
            The Fair Labor Standards Act requires time and a half for hours over 40 in a workweek.
            A workweek is any fixed, recurring 168-hour period — seven consecutive 24-hour days —
            that the employer designates. It does not have to align with the calendar week or the
            pay period, but once set it cannot be changed to dodge overtime.
          </p>
          <p>
            Two things follow that surprise people. First, there is no federal daily overtime: a
            12-hour Tuesday followed by a short Friday can add up to 40 hours and owe nothing.
            Second, averaging across two weeks is not allowed for non-exempt employees — 50 hours
            one week and 30 the next is 10 hours of overtime, not a balanced 80.
          </p>
          <p>
            Several states are stricter. California requires time and a half after 8 hours in a
            day and double time after 12, plus double time after 8 hours on a seventh consecutive
            workday. Alaska, Nevada and Colorado also have daily overtime rules. Where state and
            federal rules differ, the one more favourable to the employee applies.
          </p>
          <h3>What counts toward the 40 hours</h3>
          <ul className="checklist">
            <li><strong>Counts</strong> — time actually worked, including short rest breaks under 20 minutes and required training</li>
            <li><strong>Usually does not count</strong> — paid holidays, vacation and sick leave, because those hours were not worked</li>
            <li><strong>Raises your regular rate</strong> — non-discretionary bonuses and shift differentials must be folded into the rate before the 1.5 multiplier</li>
          </ul>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">TAX</p>
        <h2>How Overtime Is Taxed</h2>
        <section>
          <p>
            There is no overtime tax rate. Overtime is ordinary wages, taxed on the same brackets
            as the rest of your income and subject to the same 6.2% Social Security and 1.45%
            Medicare withholding.
          </p>
          <p>
            The reason an overtime-heavy paycheck can look disproportionately taxed is
            withholding mechanics. Percentage-method withholding treats each paycheck as though
            every check this year will be that size, so one big week is withheld as if you had
            suddenly moved up a bracket. You have not — you get the excess back when you file.
          </p>
          <p>
            Since tax year 2025 there is a genuine federal break: a deduction for{" "}
            <strong>qualified overtime compensation</strong>, worth up to $12,500 ($25,000 filing
            jointly), covering the premium half of FLSA-required overtime through 2028. It is a
            deduction on your return, not a payroll exemption — FICA still comes out. Our{" "}
            <a href="/no-tax-on-overtime">no tax on overtime guide</a> walks through the caps,
            the income phase-out and who qualifies.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">FAQ</p>
        <h2>Overtime Calculator — Frequently Asked Questions</h2>
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
        <p className="kicker">RELATED</p>
        <h2>More Pay and Tax Calculators</h2>
        <section>
          <ul className="checklist">
            <li><a href="/no-tax-on-overtime">No Tax on Overtime — the 2025–2028 deduction explained</a></li>
            <li><a href="/">Paycheck Calculator — full take-home pay after all deductions</a></li>
            <li><a href="/hourly-paycheck-calculator">Hourly Paycheck Calculator</a></li>
            <li><a href="/gross-up-calculator">Gross-Up Calculator — work backwards from a target net</a></li>
            <li><a href="/ytd-calculator">YTD Calculator — project your year from a pay stub</a></li>
          </ul>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
