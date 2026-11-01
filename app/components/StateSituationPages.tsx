import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { StateBonusCalculator, StateChildSupportCalculator, StateDependentsCalculator } from "./StateSituationCalculators";
import { calculatePaycheck } from "../lib/payroll";
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  EXAMPLE_SALARY,
  EXAMPLE_SUPPORT_MONTHLY,
  bonusExample,
  dependentsExamples,
  situationChartData,
  supportExamples,
} from "../lib/situationCharts";
import {
  SITUATION_HUB_STATES,
  SITUATION_LABEL,
  SITUATION_STATES,
  situationPath,
  situationStateByCode,
  type Faq,
  type SituationKind,
  type SituationState,
  type Source,
} from "../lib/stateSituations";

const SITE = "https://www.paycheckscalculator.org";
const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmt2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const FEDERAL_SOURCES: Record<SituationKind, Source[]> = {
  bonus: [
    { label: "IRS Publication 15, section 7 (supplemental wages)", url: "https://www.irs.gov/publications/p15" },
    { label: "IRS Publication 15-T (percentage method)", url: "https://www.irs.gov/publications/p15t" },
    { label: "Social Security Administration 2026 wage base", url: "https://www.ssa.gov/oact/cola/cbb.html" },
  ],
  dependents: [
    { label: "2026 IRS Form W-4, Step 3", url: "https://www.irs.gov/forms-pubs/about-form-w-4" },
    { label: "IRS Publication 15-T (percentage method)", url: "https://www.irs.gov/publications/p15t" },
  ],
  "child-support": [
    { label: "U.S. Department of Labor Fact Sheet 30 (CCPA garnishment limits)", url: "https://www.dol.gov/agencies/whd/fact-sheets/30-cppa" },
    { label: "IRS Publication 15-T (percentage method)", url: "https://www.irs.gov/publications/p15t" },
  ],
};

/* --------------------------------------------------------------- Metadata */

function keywordFor(state: SituationState, kind: SituationKind) {
  return `${state.name} paycheck calculator ${SITUATION_LABEL[kind].toLowerCase()}`;
}

function copyFor(state: SituationState, kind: SituationKind) {
  const { name } = state;
  const keyword = keywordFor(state, kind);
  const sentence = keyword[0].toUpperCase() + keyword.slice(1);
  if (kind === "bonus") {
    const stateTax = state.noIncomeTax ? "no state tax" : `${((state.bonus.supplementalRate ?? 0) * 100).toFixed(2).replace(/0$/, "")}% ${name} tax`;
    return {
      title: `${name} Paycheck Calculator With Bonus — 2026 Take-Home Pay`,
      description: `${sentence}: see 2026 bonus take-home pay after 22% federal, ${stateTax} and FICA under both withholding methods.`,
      about: `Supplemental wage withholding on bonuses for ${name} employees`,
      eyebrow: `${name.toUpperCase()} · SUPPLEMENTAL WAGE WITHHOLDING`,
      h1: `${name} Paycheck Calculator With Bonus: What You Actually Take Home`,
      topic: `${name} bonus`,
    };
  }
  if (kind === "dependents") {
    const form = state.dependents.formName ? ` and ${state.dependents.formName} ${state.dependents.unit}` : "";
    return {
      title: `${name} Paycheck Calculator With Dependents (2026)`,
      description: `${sentence}: see how W-4 Step 3 credits${form} change your 2026 take-home pay for each child and dependent.`,
      about: `Federal and ${name} withholding adjustments for dependents`,
      eyebrow: `${name.toUpperCase()} · W-4 DEPENDENTS`,
      h1: `${name} Paycheck Calculator With Dependents`,
      topic: `${name} dependents`,
    };
  }
  const fee = state.childSupport.fee;
  const feeShort =
    fee?.kind === "monthly" ? `the $${fee.amount} monthly payor fee` : fee?.kind === "percentOfSupport" ? `the ${fee.rate * 100}% processing charge` : fee ? `the $${fee.first}/$${fee.after} payor fee` : "state rules";
  return {
    title: `${name} Paycheck Calculator With Child Support — 2026`,
    description: `${sentence}: estimate 2026 take-home pay after support withholding, the federal 50–65% limit and ${feeShort}.`,
    about: `Child support income withholding for ${name} employees`,
    eyebrow: `${name.toUpperCase()} · CHILD SUPPORT WITHHOLDING`,
    h1: `${name} Paycheck Calculator With Child Support`,
    topic: `${name} child support`,
  };
}

export function situationMetadata(code: string, kind: SituationKind): Metadata {
  const state = situationStateByCode[code];
  const copy = copyFor(state, kind);
  const canonical = `${SITE}${situationPath(state.slug, kind)}`;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonical,
      type: "website",
      siteName: "Paycheck Calculator",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: copy.title }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

/* ----------------------------------------------------------- Shared shell */

function Shell({
  state,
  kind,
  faqs,
  sources,
  calculator,
  intro,
  trust,
  children,
}: {
  state: SituationState;
  kind: SituationKind;
  faqs: Faq[];
  sources: Source[];
  calculator: ReactNode;
  intro: ReactNode;
  trust: string[];
  children: ReactNode;
}) {
  const copy = copyFor(state, kind);
  const keyword = keywordFor(state, kind);
  const canonical = `${SITE}${situationPath(state.slug, kind)}`;
  const pillarName = `${state.name} Paycheck Calculator`;
  const updated = new Date(`${state.lastModified}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  const chart = situationChartData(state.code, kind);
  const allSources = [...FEDERAL_SOURCES[kind], ...sources];

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${state.name} Paycheck Calculator ${SITUATION_LABEL[kind]}`,
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: copy.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${state.name} Paycheck Calculator ${SITUATION_LABEL[kind]}`,
      url: canonical,
      dateModified: state.lastModified,
      about: copy.about,
      description: copy.description,
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}/images/situations/${chart.file}`, width: CHART_WIDTH, height: CHART_HEIGHT },
      isPartOf: { "@type": "WebPage", name: pillarName, url: `${SITE}${state.pillarPath}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: pillarName, item: `${SITE}${state.pillarPath}` },
        { "@type": "ListItem", position: 3, name: SITUATION_LABEL[kind], item: canonical },
      ],
    },
  ];

  const siblings = (["bonus", "dependents", "child-support"] as SituationKind[]).filter(item => item !== kind);
  const siblingBlurb: Record<SituationKind, string> = {
    bonus: "Supplemental withholding on bonuses →",
    dependents: state.dependents.formName ? `W-4 credits and ${state.dependents.formName} ${state.dependents.unit} →` : "W-4 Step 3 credits for dependents →",
    "child-support": "Support withholding and federal limits →",
  };
  const otherStates = [{ name: "Texas", slug: "texas" }, ...SITUATION_STATES.filter(item => item.code !== state.code)];

  return (
    <main>
      {schemas.map(schema => (
        <script key={schema["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href={state.pillarPath}>{pillarName}</a>
        <span aria-hidden="true">›</span>
        <span>{SITUATION_LABEL[kind]}</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1>{copy.h1}</h1>
        <div className="hero-intro">{intro}</div>
        {calculator}
        <div className="trust-row">
          {trust.map(item => (
            <span key={item}>✓ {item}</span>
          ))}
        </div>
      </section>

      <section className="seo-section text-left">
        <p className="kicker">AT A GLANCE</p>
        <h2>{copy.topic[0].toUpperCase() + copy.topic.slice(1)} Example in One Chart</h2>
        <figure style={{ margin: "18px 0 0" }}>
          <img
            src={`/images/situations/${chart.file}`}
            alt={chart.alt}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "auto", borderRadius: 12, border: "1px solid #e0e7ef" }}
          />
          <figcaption style={{ marginTop: 10, fontSize: 13, color: "#667a8a", lineHeight: 1.6 }}>{chart.alt}</figcaption>
        </figure>
      </section>

      {children}

      <section className="seo-section">
        <p className="kicker">RELATED {state.name.toUpperCase()} CALCULATORS</p>
        <h2>More {state.name} Paycheck Calculators</h2>
        <p>
          Start from the <a className="text-link" href={state.pillarPath}>main {state.name} paycheck calculator</a> for
          regular pay, check a <a className="text-link" href={`/biweekly/${state.slug}-paycheck-calculator`}>{state.name} biweekly paycheck</a>,
          or use one of the situation calculators below.
        </p>
        <div className="tool-links">
          <a href={state.pillarPath}>
            <b>{pillarName}</b>
            <span>The full {state.name} take-home pay tool →</span>
          </a>
          {siblings.map(item => (
            <a key={item} href={situationPath(state.slug, item)}>
              <b>{state.name} Paycheck Calculator {SITUATION_LABEL[item]}</b>
              <span>{siblingBlurb[item]}</span>
            </a>
          ))}
          {otherStates.map(item => (
            <a key={item.slug} href={situationPath(item.slug, kind)}>
              <b>{item.name} Paycheck Calculator {SITUATION_LABEL[kind]}</b>
              <span>Same situation, {item.name} rules →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="faq">
        <p className="kicker">COMMON QUESTIONS</p>
        <h2>{copy.topic[0].toUpperCase() + copy.topic.slice(1)} Paycheck Questions</h2>
        {faqs.map(item => (
          <details key={item.q}>
            <summary>
              {item.q}
              <span>+</span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="seo-section text-left">
        <p className="kicker">CALCULATION SOURCES</p>
        <h2>Sources Behind This {state.name} Calculator</h2>
        <p>
          This {keyword} uses the IRS percentage method from Publication 15-T for regular federal withholding, 2026
          Social Security and Medicare rates, and the {state.name} rules listed below. Each figure on this page is
          recalculated from those rules rather than copied from another site.
        </p>
        <ul className="checklist">
          {allSources.map(item => (
            <li key={item.label}>
              <a className="text-link" href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 16 }}>
          Full assumptions are documented on our <a className="text-link" href="/methodology">methodology page</a>.
        </p>
        <div className="reviewer">
          <p><small>Reviewed by: Paycheck Calculator Editorial Team</small></p>
          <p><small>Last Updated: {updated}</small></p>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: "#7b8b98", lineHeight: 1.7 }}>
          <strong>Disclaimer:</strong> the {keyword} produces estimates for informational purposes only. Your
          employer&apos;s payroll system, W-4{state.dependents.formName ? ` and ${state.dependents.formName}` : ""} entries,
          local taxes, and year-to-date wages all affect the actual amounts withheld.{" "}
          {kind === "child-support"
            ? `It does not calculate a ${state.name} guideline support amount; only a court or the ${state.childSupport.agency} can set or change an order.`
            : "For advice about your own tax situation, consult a qualified tax professional."}
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}

const cell = { padding: "8px 10px" } as const;

function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <caption style={{ captionSide: "bottom", paddingTop: 10, fontSize: 12, color: "#7b8b98", textAlign: "left" }}>{caption}</caption>
        <thead>
          <tr style={{ borderBottom: "2px solid #e0e7ef" }}>
            {head.map((label, index) => (
              <th key={label} scope="col" style={{ ...cell, textAlign: index === 0 ? "left" : "right", fontWeight: 600 }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: "1px solid #e0e7ef", background: rowIndex % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
              {row.map((value, index) =>
                index === 0 ? (
                  <th key={index} scope="row" style={{ ...cell, textAlign: "left", fontWeight: 600 }}>{value}</th>
                ) : (
                  <td key={index} style={{ ...cell, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{value}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Prose({ kicker, heading, intro, paragraphs, children }: { kicker: string; heading: string; intro?: string; paragraphs?: string[]; children?: ReactNode }) {
  return (
    <section className="seo-section text-left">
      <p className="kicker">{kicker}</p>
      <h2>{heading}</h2>
      {intro && <p className="seo-section-intro">{intro}</p>}
      {paragraphs?.map(text => (
        <p key={text.slice(0, 48)} style={{ marginTop: 14 }}>{text}</p>
      ))}
      {children}
    </section>
  );
}

const listStyle = { color: "#667a8a", lineHeight: 1.9, fontSize: 14, paddingLeft: 20, marginTop: 14 } as const;

/* ------------------------------------------------------------------ Bonus */

export function StateBonusPage({ code }: { code: string }) {
  const state = situationStateByCode[code];
  const keyword = keywordFor(state, "bonus");
  const regular = calculatePaycheck({ grossAnnual: EXAMPLE_SALARY, frequency: "biweekly", status: "single", state: state.code, stateAllowances: state.dependents.defaultPersonal });
  const examples = [1000, 2500, 5000, 10000, 25000].map(bonus => bonusExample(code, bonus));
  const rate = state.bonus.supplementalRate ?? 0;
  const flatTotal = Number((22 + 7.65 + rate * 100).toFixed(2));
  const localRow =
    state.code === "OH"
      ? ["Ohio city / school district tax", "Varies by city (e.g. 2.5% Columbus)", "Applies to bonuses"]
      : [`${state.name} local income tax`, "None", "No city or county income tax"];

  return (
    <Shell
      state={state}
      kind="bonus"
      faqs={state.bonus.faqs}
      sources={state.bonus.sources}
      calculator={<StateBonusCalculator stateCode={state.code} />}
      trust={["2026 IRS supplemental rules", state.noIncomeTax ? `No ${state.name} income tax` : `2026 ${state.name} rate`, "Both withholding methods"]}
      intro={
        <>
          <p>
            Use this {keyword} to see what a bonus really adds to your check. {state.bonus.headline}
          </p>
          <p>
            Enter your salary and bonus, then switch between a separate bonus check and a bonus added to a regular
            paycheck to see how each method changes what lands in your account.
          </p>
        </>
      }
    >
      <Prose
        kicker="HOW BONUSES ARE WITHHELD"
        heading={`How a Bonus Is Taxed on Your ${state.name} Paycheck`}
        intro={`A bonus is a supplemental wage: ordinary income taxed at your normal rates when you file, but withheld under special rules. On a separate check, the usual ${state.name} total is about ${flatTotal}% of the bonus.`}
        paragraphs={[
          "Federal rules let employers withhold a flat 22% on a bonus paid separately from regular wages (37% on supplemental wages above $1 million a year), or add the bonus to a regular paycheck and withhold on the combined amount as if it were paid every period — the aggregate method, which usually holds back more.",
          ...state.bonus.stateRule,
        ]}
      />

      <Prose kicker="2026 RATES" heading={`${state.name} Bonus Withholding Rates for 2026`}>
        <p style={{ marginTop: 14 }}>
          Every line that can come out of a {state.name} bonus, with the rate the {keyword} applies. Rates are for
          withholding; your final tax is set on your return.
        </p>
        <DataTable
          caption={`Separate-check total for a ${state.name} bonus under $1 million: about ${flatTotal}%${state.code === "OH" ? " before city tax" : ""}.`}
          head={["Withholding line", "2026 rate", "Notes"]}
          rows={[
            ["Federal income tax", "22% flat", "37% above $1 million of supplemental wages"],
            ["Social Security", "6.2%", "Stops at the $184,500 wage base"],
            ["Medicare", "1.45%", "+0.9% on wages above $200,000"],
            [`${state.name} income tax`, state.noIncomeTax ? "0%" : `${(rate * 100).toFixed(2).replace(/0$/, "")}%`, state.noIncomeTax ? "No personal income tax" : state.bonus.rateLabel],
            localRow,
          ]}
        />
      </Prose>

      <section className="seo-section text-left">
        <p className="kicker">WORKED EXAMPLES</p>
        <h2>{state.name} Paycheck Calculator With Bonus: Worked Examples</h2>
        <p className="seo-section-intro">
          Bonus take-home pay on a {fmt.format(EXAMPLE_SALARY)} salary, single filer, bi-weekly pay, no bonus deferral.
          The regular bi-weekly paycheck at this salary is about {fmt2.format(regular.netAnnual / 26)} after tax.
        </p>
        <DataTable
          caption={`Estimates use 2026 federal withholding, a 22% flat federal rate, 7.65% FICA${state.noIncomeTax ? "" : `, and ${state.bonus.rateLabel}`}.`}
          head={["Bonus", `${state.name} tax (flat)`, "Take-home (separate check)", "Take-home (aggregate)", "Aggregate withholding"]}
          rows={examples.map(row => [
            fmt.format(row.bonus),
            fmt.format(row.flat.stateIncomeTax),
            fmt.format(row.flat.net),
            fmt.format(row.aggregate.net),
            `${row.aggregate.effectiveRate.toFixed(1)}%`,
          ])}
        />
        <p className="calc-note" style={{ marginTop: 20 }}>
          <strong>Reading the table:</strong> the aggregate method holds back more up front, not more tax overall. Any
          excess withholding comes back when you file your federal{state.noIncomeTax ? " return" : ` and ${state.name} returns`}.
        </p>
      </section>

      <Prose kicker="KEEP MORE" heading={`How to Keep More of a ${state.name} Bonus`} paragraphs={[state.bonus.keepMore]}>
        <ul style={listStyle}>
          <li>Ask HR whether your 401(k) election applies to bonuses, and whether a separate bonus deferral rate is allowed.</li>
          <li>Time HSA or dependent-care FSA contributions so pre-tax room is available in the bonus pay period.</li>
          <li>Check the bonus line on your pay stub: a federal amount well above 22% means the aggregate method was used.</li>
          <li>Do not adjust your W-4 for a one-time bonus; any over-withholding is settled when you file.</li>
        </ul>
      </Prose>

      <section className="seo-section text-left">
        <p className="kicker">USING THE CALCULATOR</p>
        <h2>How to Use This {state.name} Paycheck Calculator With Bonus</h2>
        <ol style={listStyle}>
          <li>Enter your annual gross salary and the bonus amount you expect.</li>
          <li>Pick your pay frequency — it decides how the aggregate method annualizes the combined check.</li>
          <li>Choose how the bonus is paid: a separate check or added to a regular paycheck.</li>
          <li>
            Set your federal filing status
            {state.dependents.formName ? `, your ${state.dependents.formName} total,` : ""} and any 401(k) or pre-tax deductions.
          </li>
          <li>Compare both methods in the bottom panel to see which one matches your pay stub.</li>
        </ol>
        <p className="calc-note" style={{ marginTop: 16 }}>
          To tell which method your employer used, divide the federal tax withheld on the bonus line of your pay stub
          by the gross bonus. A result near 22% points to the flat method; a noticeably higher result points to the
          aggregate method, and the {keyword} shows both side by side.
        </p>
      </section>
    </Shell>
  );
}

/* ------------------------------------------------------------- Dependents */

export function StateDependentsPage({ code }: { code: string }) {
  const state = situationStateByCode[code];
  const keyword = keywordFor(state, "dependents");
  const form = state.dependents.formName;
  const rows = dependentsExamples(code);
  const oneChildState = rows[1].stateSaved;

  const head = ["Children under 17", "Federal savings / check"];
  if (form) head.push(`${state.name} savings / check`);
  head.push("Bi-weekly take-home", "Annual take-home");

  return (
    <Shell
      state={state}
      kind="dependents"
      faqs={state.dependents.faqs}
      sources={state.dependents.sources}
      calculator={<StateDependentsCalculator stateCode={state.code} />}
      trust={["2026 W-4 Step 3 credits", form ? `${form} ${state.dependents.unit}` : `No ${state.name} income tax`, "No sign-up required"]}
      intro={
        <>
          <p>
            Use this {keyword} to see how much each child adds to your check. {state.dependents.headline}
          </p>
          <p>
            Enter your salary and the children and other dependents you claim to see how much each one adds to your
            {` ${state.name}`} take-home pay per paycheck.
          </p>
        </>
      }
    >
      <Prose
        kicker="HOW DEPENDENTS CHANGE WITHHOLDING"
        heading={`How Dependents Affect Your ${state.name} Paycheck`}
        intro="On the federal side, dependents do not change your taxable wages. Step 3 of Form W-4 turns them into a dollar credit that payroll subtracts from the federal income tax withheld across the year."
        paragraphs={[
          "Each qualifying child under 17 is worth $2,200 on Step 3 of the 2026 W-4 and each other dependent $500, as long as your total income is under $200,000 ($400,000 married filing jointly). Social Security and Medicare are unaffected.",
          ...state.dependents.stateRule,
        ]}
      />

      <Prose kicker="2026 NUMBERS" heading={`2026 Dependent Amounts for ${state.name} Paychecks`}>
        <p style={{ marginTop: 14 }}>
          The figures this calculator applies for each dependent, and what they are worth on a bi-weekly paycheck.
        </p>
        <DataTable
          caption="Bi-weekly values assume 26 paychecks and enough federal withholding to absorb the credit."
          head={["Item", "Annual amount", "Per bi-weekly check"]}
          rows={[
            ["Federal credit, child under 17", "$2,200", fmt2.format(2200 / 26)],
            ["Federal credit, other dependent", "$500", fmt2.format(500 / 26)],
            ["Federal income limit to claim", "$200,000 / $400,000 MFJ", "—"],
            form
              ? [`${form} ${state.dependents.unit.slice(0, -1)} per dependent`, `${fmt.format(state.dependents.perDependent ?? 0)} of wages`, `${fmt2.format(oneChildState / 26)} less ${state.name} tax`]
              : [`${state.name} state allowance`, "None", "No state income tax"],
            ["Social Security and Medicare", "No change", "$0.00"],
          ]}
        />
      </Prose>

      <section className="seo-section text-left">
        <p className="kicker">WORKED EXAMPLES</p>
        <h2>{state.name} Paycheck Calculator With Dependents: Worked Examples</h2>
        <p className="seo-section-intro">
          {fmt.format(EXAMPLE_SALARY)} salary, married filing jointly, bi-weekly pay, no pre-tax deductions
          {form ? `, two ${form} personal ${state.dependents.unit} plus one per child` : ""}.
        </p>
        <DataTable
          caption="Estimates use 2026 federal and state withholding formulas. Credits stop once federal withholding reaches zero."
          head={head}
          rows={rows.map(row => {
            const cells: string[] = [row.children === 1 ? "1 child" : `${row.children} children`, fmt2.format(row.federalSaved / 26)];
            if (form) cells.push(fmt2.format(row.stateSaved / 26));
            cells.push(fmt2.format(row.netPerCheck), fmt.format(row.netAnnual));
            return cells;
          })}
        />
        <p className="calc-note" style={{ marginTop: 20 }}>
          <strong>Why the gain flattens:</strong> at this salary federal withholding runs out after about two children,
          so additional Step 3 credits cannot lower it further. The rest of the credit is claimed on your tax return.
        </p>
      </section>

      <Prose kicker="KEEP IT CURRENT" heading={`When to Update Your W-4${form ? ` and ${form}` : ""} in ${state.name}`} paragraphs={[state.dependents.updateNote]}>
        <ul style={listStyle}>
          <li>A child is born or adopted — add $2,200 to Step 3.</li>
          <li>A child turns 17 during the year — that child moves from $2,200 to $500.</li>
          <li>A dependent moves out or will no longer be claimed — remove them.</li>
          <li>After a divorce or custody change — only the parent claiming the child should list them.</li>
          <li>Your income rises above $200,000 ($400,000 married filing jointly) — Step 3 no longer applies.</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          A partner or relative you support can count as an other dependent if they pass the IRS qualifying-relative
          tests — see <a className="text-link" href="/can-i-claim-my-girlfriend-as-a-dependent">can I claim my girlfriend as a dependent</a>.
          Paying for child care as well? A <a className="text-link" href="/dependent-care-fsa">dependent care FSA</a> covers
          it with pre-tax pay.
        </p>
      </Prose>

      <section className="seo-section text-left">
        <p className="kicker">USING THE CALCULATOR</p>
        <h2>How to Use This {state.name} Paycheck Calculator With Dependents</h2>
        <ol style={listStyle}>
          <li>Enter your annual gross salary.</li>
          <li>Enter qualifying children under 17 and any other dependents from Step 3 of your W-4.</li>
          <li>Pick your pay frequency and federal filing status.</li>
          {form && <li>Enter the {form} {state.dependents.unit} you claim for yourself and your spouse; the calculator adds one per dependent.</li>}
          <li>Read the net pay and the amount dependents add to each paycheck.</li>
        </ol>
        <p className="calc-note" style={{ marginTop: 16 }}>
          The {keyword} assumes one job per household. If you and your spouse both work, only one of you should claim
          the dependents on Step 3, or split the amount between your two W-4s.
        </p>
      </section>
    </Shell>
  );
}

/* ---------------------------------------------------------- Child support */

export function StateChildSupportPage({ code }: { code: string }) {
  const state = situationStateByCode[code];
  const keyword = keywordFor(state, "child-support");
  const fee = state.childSupport.fee;
  const rows = supportExamples(code);
  const mid = rows[2];
  const midPaycheck = calculatePaycheck({ grossAnnual: EXAMPLE_SALARY, frequency: "biweekly", status: "single", state: state.code, stateAllowances: state.dependents.defaultPersonal });
  const supportPerCheck = (EXAMPLE_SUPPORT_MONTHLY * 12) / 26;
  const feePerCheck = mid.withheld - supportPerCheck;

  return (
    <Shell
      state={state}
      kind="child-support"
      faqs={state.childSupport.faqs}
      sources={state.childSupport.sources}
      calculator={<StateChildSupportCalculator stateCode={state.code} />}
      trust={["Federal CCPA limits", fee ? fee.label : `${state.name} withholding rules`, "No sign-up required"]}
      intro={
        <>
          <p>
            Use this {keyword} to see what your check looks like once support is withheld. {state.childSupport.headline}
          </p>
          <p>
            Enter your pay and the monthly amounts in your order to see what is withheld each paycheck, whether the
            federal limit caps it, and what you take home.
          </p>
        </>
      }
    >
      <Prose kicker={`${state.name.toUpperCase()} SUPPORT GUIDELINES`} heading={`How ${state.name} Child Support Is Calculated`} paragraphs={state.childSupport.guideline} />

      <Prose
        kicker="PAYROLL WITHHOLDING"
        heading={`How Child Support Comes Out of Your ${state.name} Paycheck`}
        intro="Support is withheld after taxes. Federal income tax, Social Security, Medicare, and any state and local income tax are figured on your full gross pay; the support deduction comes out of what is left."
        paragraphs={[
          ...state.childSupport.withholding,
          "The federal Consumer Credit Protection Act caps the total at 50% of disposable earnings if you support another spouse or child, or 60% if you do not, with 5 more percentage points allowed when support is more than 12 weeks in arrears.",
        ]}
      />

      <Prose kicker="STEP BY STEP" heading={`How Payroll Figures a ${state.name} Child Support Deduction`}>
        <p style={{ marginTop: 14 }}>
          The same steps the {keyword} follows, using a {fmt.format(EXAMPLE_SALARY)} salary paid bi-weekly and an{" "}
          {fmt.format(EXAMPLE_SUPPORT_MONTHLY)} monthly order:
        </p>
        <ol style={listStyle}>
          <li>Gross pay per check: {fmt2.format(EXAMPLE_SALARY / 26)}.</li>
          <li>
            Subtract taxes required by law — federal {fmt2.format(midPaycheck.federal / 26)}, Social Security and
            Medicare {fmt2.format((midPaycheck.socialSecurity + midPaycheck.medicare) / 26)}
            {state.noIncomeTax ? "" : `, ${state.name} ${fmt2.format(midPaycheck.stateIncomeTax / 26)}`} — to get
            disposable earnings of {fmt2.format(mid.disposable)}.
          </li>
          <li>Apply the federal limit: 60% of disposable earnings is {fmt2.format(mid.limit)}.</li>
          <li>
            Convert the order to this pay schedule: {fmt.format(EXAMPLE_SUPPORT_MONTHLY)} × 12 ÷ 26 ={" "}
            {fmt2.format(supportPerCheck)}
            {feePerCheck > 0.005 ? `, plus ${fmt2.format(feePerCheck)} for the ${fee?.label}` : ""}.
          </li>
          <li>The order is under the limit, so {fmt2.format(mid.withheld)} is withheld and {fmt2.format(mid.takeHome)} is paid to you.</li>
        </ol>
      </Prose>

      <Prose kicker="DISPOSABLE EARNINGS" heading={`What Counts as Disposable Earnings in ${state.name}`}>
        <p style={{ marginTop: 14 }}>
          Disposable earnings are gross pay minus deductions required by law. Voluntary deductions stay in the base, so
          a large 401(k) contribution does not lower the federal limit.
        </p>
        <DataTable
          caption="Based on the federal Consumer Credit Protection Act definition used by Illinois, Ohio, and Florida payroll."
          head={["Deduction", "Subtracted?", "Why"]}
          rows={[
            ["Federal income tax", "Yes", "Required by law"],
            ["Social Security and Medicare", "Yes", "Required by law"],
            [`${state.name} income tax`, state.noIncomeTax ? "n/a" : "Yes", state.noIncomeTax ? "No state income tax" : "Required by law"],
            ["Local income tax", state.code === "OH" ? "Yes" : "n/a", state.code === "OH" ? "Ohio city and school district taxes" : "No local income tax"],
            ["401(k) contributions", "No", "Voluntary"],
            ["Health insurance premiums", "No", "Voluntary, unless ordered"],
          ]}
        />
      </Prose>

      <section className="seo-section text-left">
        <p className="kicker">WORKED EXAMPLES</p>
        <h2>{state.name} Paycheck Calculator With Child Support: Worked Examples</h2>
        <p className="seo-section-intro">
          An {fmt.format(EXAMPLE_SUPPORT_MONTHLY)} monthly order, single filer, bi-weekly pay, no other family
          supported, support current, no pre-tax deductions{fee ? `, including the ${fee.label}` : ""}.
        </p>
        <DataTable
          caption="Disposable earnings are pay after federal and state income tax, Social Security, and Medicare."
          head={["Annual pay", "Disposable / check", "60% limit / check", "Withheld / check", "Take-home / check"]}
          rows={rows.map(row => [fmt.format(row.salary), fmt2.format(row.disposable), fmt2.format(row.limit), fmt2.format(row.withheld), fmt2.format(row.takeHome)])}
        />
      </section>

      <Prose kicker="CHANGES" heading={`Changing Jobs or Pay With a ${state.name} Support Order`}>
        <p style={{ marginTop: 14 }}>
          Employers report new hires to the state, and the {state.childSupport.agency} uses those reports to send the
          withholding notice to your new employer. Until the first deduction appears on a new pay stub, you remain
          responsible for paying the State Disbursement Unit directly, so a job change does not pause the order.
        </p>
        <ul style={listStyle}>
          <li>A pay cut does not change the ordered amount; only a court or the agency can modify it.</li>
          <li>Ask for a review as soon as income drops — modifications usually apply from the filing date forward.</li>
          <li>Bonuses and commissions can be withheld too if the notice covers them; check the notice wording.</li>
          <li>Keep pay stubs showing each deduction as proof of payment.</li>
        </ul>
      </Prose>
    </Shell>
  );
}

/* ------------------------------------------- Hub block for the pillar pages */

export function StateSituationLinks({ code }: { code: string }) {
  const state = situationStateByCode[code];
  if (!state) return null;
  const blurb: Record<SituationKind, string> = {
    bonus: state.noIncomeTax ? "Flat 22% federal rate vs the aggregate method →" : `22% federal plus the ${state.bonus.rateLabel} →`,
    dependents: state.dependents.formName ? `W-4 Step 3 credits and ${state.dependents.formName} ${state.dependents.unit} →` : "W-4 Step 3 credits for children and other dependents →",
    "child-support": "Support withholding, federal limits, and fees →",
  };
  return (
    <section className="seo-section text-left">
      <p className="kicker">{state.name.toUpperCase()} SITUATION CALCULATORS</p>
      <h2>{state.name} Paycheck Calculators for Specific Situations</h2>
      <p className="seo-section-intro">
        The calculator above covers regular salary and hourly pay. When a bonus, dependents, or a child support order
        changes the math, these {state.name} calculators handle the details and show the effect on each paycheck.
      </p>
      <div className="tool-links">
        {(["bonus", "dependents", "child-support"] as SituationKind[]).map(kind => (
          <a key={kind} href={situationPath(state.slug, kind)}>
            <b>{state.name} Paycheck Calculator {SITUATION_LABEL[kind]}</b>
            <span>{blurb[kind]}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- Site-wide hub (homepage, biweekly calculator) */

export function SituationHub({ kicker, heading, intro }: { kicker: string; heading: string; intro: ReactNode }) {
  const blurb: Record<SituationKind, string> = {
    bonus: "Bonus take-home after supplemental withholding →",
    dependents: "What each child adds to a paycheck →",
    "child-support": "Take-home pay after support withholding →",
  };
  return (
    <section className="seo-section">
      <p className="kicker">{kicker}</p>
      <h2>{heading}</h2>
      <p>{intro}</p>
      <div className="tool-links">
        {(["bonus", "dependents", "child-support"] as SituationKind[]).flatMap(kind =>
          SITUATION_HUB_STATES.map(state => (
            <a key={`${state.slug}-${kind}`} href={situationPath(state.slug, kind)}>
              <b>{state.name} Paycheck Calculator {SITUATION_LABEL[kind]}</b>
              <span>{blurb[kind]}</span>
            </a>
          )),
        )}
      </div>
    </section>
  );
}

// Compact links for one state's biweekly page (Texas included).
export function BiweeklySituationLinks({ slug, name }: { slug: string; name: string }) {
  if (!SITUATION_HUB_STATES.some(state => state.slug === slug)) return null;
  return (
    <>
      <a href={situationPath(slug, "bonus")}>
        <b>{name} Paycheck Calculator With Bonus</b>
        <span>A bonus on top of your biweekly check →</span>
      </a>
      <a href={situationPath(slug, "dependents")}>
        <b>{name} Paycheck Calculator With Dependents</b>
        <span>W-4 credits on each biweekly check →</span>
      </a>
      <a href={situationPath(slug, "child-support")}>
        <b>{name} Paycheck Calculator With Child Support</b>
        <span>Biweekly take-home after support →</span>
      </a>
    </>
  );
}
