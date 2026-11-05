import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { locations } from "../lib/locations";
import {
  BANK_HOLIDAY_FRIDAYS,
  BIWEEKLY_DATES_IMAGE,
  BIWEEKLY_HUB_IMAGE,
  BIWEEKLY_PAGES,
  BIWEEKLY_UPDATED,
  BIWEEKLY_UPDATED_LABEL,
  cents,
  dollars,
  fridaySchedule,
  hubChartRows,
  scheduleComparison,
  shortPlace,
} from "../lib/biweeklyPay";

// This page owns the pay dates and the salary-by-salary chart. "What is biweekly pay" and "how to calculate it"
// belong to /biweekly-paycheck-calculator, so the two pages do not compete: link there instead of covering them here.

const SITE = "https://www.paycheckscalculator.org";
const CANONICAL = `${SITE}/biweekly-pay`;
const PUBLISHED = "2026-11-05";
const TITLE = "Biweekly Pay Chart 2026–27: Pay Dates & Take-Home by Salary";
const H1 = "Biweekly Pay Chart: 2026–27 Pay Dates and Take-Home by Salary";
const DESCRIPTION =
  "Every biweekly pay date for 2026 and 2027, which months pay three checks, and what $30k to $200k a year or $15 to $50 an hour leaves per check after tax.";
const COVER_ALT =
  "Biweekly pay chart for 2026 showing pay before taxes and take-home per check in Texas for salaries from $45,000 to $100,000 and wages from $22 to $35 an hour";
const FED_HOLIDAYS = "https://www.federalreserve.gov/aboutthefed/k8.htm";
const QUICKBOOKS_HOLIDAYS = "https://quickbooks.intuit.com/learn-support/en-us/help-articles/how-do-holidays-impact-payroll-direct-deposit/00/262047";
const PATRIOT_HOLIDAYS = "https://www.patriotsoftware.com/payroll/training/blog/what-happens-if-payroll-falls-on-bank-holiday-delay/";
const REVERSE_CHECKS = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/biweekly-pay" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "article",
    siteName: "Paycheck Calculator",
    images: [{ url: BIWEEKLY_HUB_IMAGE, width: 1200, height: 630, alt: COVER_ALT }],
  },
  twitter: { card: "summary_large_image", images: [BIWEEKLY_HUB_IMAGE] },
};

const FREQUENCY_LABEL = { weekly: "Weekly", biweekly: "Biweekly", semimonthly: "Semimonthly", monthly: "Monthly" } as const;
const FREQUENCY_NOTE = { weekly: "Every week", biweekly: "Every two weeks", semimonthly: "Twice a month", monthly: "Once a month" } as const;

const shortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items.join(""));

export default function BiweeklyPayHub() {
  const salaryRows = hubChartRows("salary");
  const hourlyRows = hubChartRows("hourly");
  const taken = [...salaryRows, ...hourlyRows].flatMap(({ f }) => [1 - f.noTaxNet / f.single.gross, 1 - f.lowest.net / f.single.gross]);
  const takenLow = Math.round(Math.min(...taken) * 100);
  const takenHigh = Math.round(Math.max(...taken) * 100);
  const schedules = scheduleComparison(60000);
  const first = { y26: fridaySchedule(2, 2026), y27: fridaySchedule(2, 2027) };
  const second = { y26: fridaySchedule(9, 2026), y27: fridaySchedule(9, 2027) };

  const faqs = [
    {
      q: "How many biweekly pay periods are there in 2026?",
      a: `${first.y26.total} on either Friday cycle. A Thursday payroll that paid on January 1, 2026 is the exception: it lands on 27 Thursdays, ending December 31. January 1 is a bank holiday, so that first check may have arrived on December 31, 2025.`,
    },
    {
      q: "How many biweekly pay periods are there in 2027?",
      a: `Usually 26, but the January 2 Friday cycle lands on ${first.y27.total} Fridays in 2027, starting January 1 and ending December 31. January 1 is a bank holiday, so that first check may arrive on December 31, 2026 instead. Ask your payroll team how they handle it.`,
    },
    {
      q: "Which months have three biweekly paychecks in 2027?",
      a: `${list(first.y27.threeCheckMonths)} on the January 2 cycle, and ${list(second.y27.threeCheckMonths)} on the January 9 cycle. If your employer pays the January 1 check on December 31, 2026, January 2027 drops to two checks and December 2026 gains a third.`,
    },
    {
      q: "What happens when a biweekly payday falls on a holiday?",
      a: "Federal Reserve Banks close on June 19 and December 25, 2026 and January 1, 2027, all Fridays on one of these cycles, so direct deposit cannot settle on those days. Payroll providers generally advise paying a business day early, but no federal law requires it and state rules vary, so ask your payroll team for the date.",
    },
    {
      q: "How do I know which biweekly cycle I am on?",
      a: "Take any recent payday and count back in two-week steps. If you reach January 2, 2026 you are on the first cycle, and if you reach January 9 you are on the second. If you are paid on another weekday, your dates shift by the same number of days and your three-check months can change.",
    },
    {
      q: "How do you turn biweekly pay into annual or monthly income?",
      a: "Multiply a biweekly check by 26 to get annual pay, then divide by 12 for the monthly average. A $2,000 biweekly check is $52,000 a year, or $4,333 a month on average. Most months only pay two checks, so that month brings in $4,000 before taxes.",
    },
    {
      q: "Does biweekly pay change how overtime works?",
      a: "No. Under the federal Fair Labor Standards Act overtime is counted by the workweek, not the pay period. Working 50 hours one week and 30 the next earns 10 overtime hours, even though the two weeks total 80.",
    },
  ];

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: TITLE,
      url: CANONICAL,
      description: DESCRIPTION,
      datePublished: PUBLISHED,
      dateModified: BIWEEKLY_UPDATED,
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}${BIWEEKLY_HUB_IMAGE}`, width: 1200, height: 630, caption: COVER_ALT },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: BIWEEKLY_PAGES.map((page, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${page.lower} is how much biweekly`,
        url: `${SITE}/biweekly-pay/${page.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Biweekly Pay Chart", item: CANONICAL },
      ],
    },
  ];

  const chart = (group: typeof salaryRows, firstColumn: string) => (
    <div className="bw-table-wrap">
      <table className="bw-table">
        <thead>
          <tr>
            <th>{firstColumn}</th>
            <th>Before taxes</th>
            <th>Texas</th>
            <th>Typical state</th>
            <th>Lowest location</th>
          </tr>
        </thead>
        <tbody>
          {group.map(({ page, f, href }) => (
            <tr key={page.slug}>
              <td><a href={href}>{page.lower}</a></td>
              <td>{dollars(f.single.gross)}</td>
              <td>{dollars(f.noTaxNet)}</td>
              <td>{dollars(f.typical.net)}</td>
              <td>{dollars(f.lowest.net)} ({shortPlace(f.lowest.name)})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const payDates = (year: number, a: typeof first.y26, b: typeof first.y26) => {
    const cell = (schedule: typeof first.y26, i: number) => {
      const iso = schedule.dates[i];
      if (!iso) return <td>—</td>;
      const three = schedule.perMonth[Number(iso.slice(5, 7)) - 1] === 3;
      return <td className={three ? "bw-three" : undefined}>{shortDate(iso)}{BANK_HOLIDAY_FRIDAYS.includes(iso) ? "†" : ""}</td>;
    };
    return (
      <div>
        <h3>{year} biweekly pay dates</h3>
        <div className="bw-table-wrap">
          <table className="bw-table">
            <thead>
              <tr>
                <th>Payday</th>
                <th>January 2 cycle</th>
                <th>January 9 cycle</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(a.total, b.total) }, (_, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  {cell(a, i)}
                  {cell(b, i)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <main className="bw-page">
      {schemas.map(schema => (
        <script key={schema["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <span>Biweekly Pay Chart</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">BIWEEKLY PAY CHART · 2026–27</div>
        <h1>{H1}</h1>
        <p className="bw-answer">
          <strong>This biweekly pay chart</strong> lists every Friday pay date for 2026 and 2027, then shows what each salary and hourly
          wage leaves per check after tax. Most Friday payrolls follow one of two cycles: one first paid on January 2, 2026, the other on
          January 9. The first pays three checks in {list(first.y26.threeCheckMonths)} 2026, the second in {list(second.y26.threeCheckMonths)}.
          New to this schedule? See <a href="/biweekly-paycheck-calculator">what biweekly pay means and how to calculate it</a>.
        </p>
        <p className="bw-updated">Updated {BIWEEKLY_UPDATED_LABEL} · 2026 IRS and state withholding tables</p>
        <figure className="bw-cover">
          <img src={BIWEEKLY_HUB_IMAGE} alt={COVER_ALT} width={1200} height={630} fetchPriority="high" decoding="async" />
        </figure>
      </section>

      <article className="long-seo">
        <p className="kicker">THE CALENDAR</p>
        <h2>Biweekly Pay Schedule 2026 and 2027: Every Pay Date</h2>
        <section>
          <p>
            Find your cycle first. Take any recent payday and count back in two-week steps until you land on a date below. Bold dates sit in a
            three-paycheck month. A dagger marks a Friday when Federal Reserve Banks are closed, so direct deposit cannot settle that day. Payroll
            providers generally advise paying a business day early, though no federal law requires it and state rules vary. Paid on another weekday? Shift each date by the same number of days, and check your
            three-paycheck months again, because they can move.
          </p>
          <figure className="bracket-figure">
            <img
              src={BIWEEKLY_DATES_IMAGE}
              alt={`Biweekly pay dates for 2026 and 2027 on the two Friday cycles. Three-check months are ${list(first.y26.threeCheckMonths)} or ${list(second.y26.threeCheckMonths)} in 2026, and ${list(first.y27.threeCheckMonths)} or ${list(second.y27.threeCheckMonths)} in 2027`}
              width={1200}
              height={630}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="bw-calendars">
            {payDates(2026, first.y26, second.y26)}
            {payDates(2027, first.y27, second.y27)}
          </div>
          <p className="bw-note">
            † Holiday dates from the <a href={FED_HOLIDAYS} rel="noopener">Federal Reserve holiday schedule</a>. Holiday payroll guidance from{" "}
            <a href={QUICKBOOKS_HOLIDAYS} rel="noopener">QuickBooks</a> and <a href={PATRIOT_HOLIDAYS} rel="noopener">Patriot Software</a>. Your
            employer sets the actual pay dates, so check them against your pay stub.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THREE CHECKS</p>
        <h2>Three-Paycheck Months in 2026 and 2027</h2>
        <section>
          <figure className="bracket-figure">
            <img
              src="/images/blog/biweekly-paychecks-per-month-2026.svg"
              alt="2026 biweekly paydays per month for the two Friday pay schedules, with January and July or May and October paying three checks"
              width={960}
              height={440}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <p>
            Twenty-six checks do not divide evenly into 12 months, so most years have ten two-check months and two three-check months. Budget
            on the two-check month and treat the third check as extra.
          </p>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>Friday cycle</th>
                  <th>2026 three-check months</th>
                  <th>2027 three-check months</th>
                  <th>Paydays in 2027</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Paid January 2, 2026</td>
                  <td>{first.y26.threeCheckMonths.join(", ")}</td>
                  <td>{first.y27.threeCheckMonths.join(", ")}</td>
                  <td>{first.y27.total}</td>
                </tr>
                <tr>
                  <td>Paid January 9, 2026</td>
                  <td>{second.y26.threeCheckMonths.join(", ")}</td>
                  <td>{second.y27.threeCheckMonths.join(", ")}</td>
                  <td>{second.y27.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The first cycle reaches both January 1 and December 31 in 2027, which is how a biweekly year can hold 27 Fridays. January 1 is a bank
            holiday, so many payrolls would pay that check on December 31, 2026 instead. If your employer does keep 27 paydays in a year and
            divides salaries by 27, each gross check shrinks by about 4%, so it is worth asking in advance.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">THE CHART</p>
        <h2>Biweekly Pay Chart by Salary and Hourly Wage</h2>
        <section>
          <p>
            Each row shows one paycheck for a single filer with a standard W-4 and no pre-tax deductions, using 2026 withholding tables. Across
            this chart, federal tax, Social Security, Medicare and state tax together take about {takenLow}% to {takenHigh}% of a check. Open a
            row for the full breakdown at that pay.
          </p>
          {chart(salaryRows, "Annual salary")}
          {chart(hourlyRows, "Hourly wage (80 hours)")}
          <p className="bw-note">
            Typical state is the middle of the 52 locations we calculate. Want a figure for your own pay? Use the{" "}
            <a href="/biweekly-paycheck-calculator">biweekly paycheck calculator</a>. More detail:{" "}
            <a href="/blog/how-to-calculate-gross-monthly-income-from-biweekly-paycheck">gross monthly income from a biweekly paycheck</a> and{" "}
            <a href="/methodology">how we calculate paycheck taxes</a>.
          </p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">BIWEEKLY TO ANNUAL</p>
        <h2>Biweekly to Annual: What a Check Adds Up To</h2>
        <section>
          <p>
            Working from a pay stub? Multiply the gross check by 26 for annual pay, divide that by 12 for the monthly average, and divide the check
            by 80 for the hourly rate on a 40-hour week.
          </p>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>Biweekly gross</th>
                  <th>Per year</th>
                  <th>Monthly average</th>
                  <th>Per hour (80 hours)</th>
                </tr>
              </thead>
              <tbody>
                {REVERSE_CHECKS.map(check => (
                  <tr key={check}>
                    <td>{dollars(check)}</td>
                    <td>{dollars(check * 26)}</td>
                    <td>{dollars((check * 26) / 12)}</td>
                    <td>{cents(check / 80)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bw-note">Before taxes, 26 pay periods. A two-check month pays less than the monthly average.</p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">PAY SCHEDULES</p>
        <h2>Same $60,000, Four Pay Schedules</h2>
        <section>
          <p>
            The same $60,000 salary gives very different checks depending on the schedule, while the annual total stays the same. Biweekly and
            semimonthly are the two that get mixed up most often: they sound alike, but a biweekly year has two more checks, each one smaller.
          </p>
          <div className="bw-table-wrap">
            <table className="bw-table">
              <thead>
                <tr>
                  <th>Schedule</th>
                  <th>Paid</th>
                  <th>Checks a year</th>
                  <th>Gross per check</th>
                  <th>Take-home per check</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(row => (
                  <tr key={row.frequency} className={row.frequency === "biweekly" ? "total" : undefined}>
                    <td>{FREQUENCY_LABEL[row.frequency]}</td>
                    <td>{FREQUENCY_NOTE[row.frequency]}</td>
                    <td>{row.checks}</td>
                    <td>{cents(row.gross)}</td>
                    <td>{cents(row.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bw-note">$60,000 a year, single filer in Texas, standard W-4, no pre-tax deductions, 2026 withholding tables.</p>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker">BY STATE</p>
        <h2>Biweekly Checks in Your State</h2>
        <section>
          <p>State tax is the biggest reason the same biweekly gross leaves different take-home. See nine salary levels for your state:</p>
          <ul className="bw-links bw-links-compact">
            {locations.map(loc => (
              <li key={loc.slug}><a href={`/biweekly/${loc.slug}`}>{loc.name}</a></li>
            ))}
          </ul>
        </section>
      </article>

      <article className="long-seo">
        <p className="kicker" style={{ textAlign: "center" }}>FREQUENTLY ASKED QUESTIONS</p>
        <h2>Biweekly Pay Chart: Common Questions</h2>
        <section>
          {faqs.map(item => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
