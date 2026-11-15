import { calculatePaycheck, money, type FilingStatus, type SupportedState } from "../lib/payroll";

// Three fixed scenarios rendered as a biweekly pay stub. The figures come from the same engine
// as the calculator on the page, so they update with the tax tables and never need hand edits.
const SCENARIOS: { gross: number; status: FilingStatus; label: string }[] = [
  { gross: 50000, status: "single", label: "$50,000 · Single" },
  { gross: 75000, status: "single", label: "$75,000 · Single" },
  { gross: 100000, status: "married", label: "$100,000 · Married" },
];

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

// `layout` matches the surrounding page: the [location] template uses article.long-seo with the
// heading outside its <section>, while the standalone state pages use flat section.seo-section blocks.
export default function SamplePayStub({ state, name, noTax = false, city = false, biweeklyHref, layout = "long-seo" }: { state: SupportedState; name: string; noTax?: boolean; city?: boolean; biweeklyHref?: string; layout?: "long-seo" | "seo-section" }) {
  const rows = SCENARIOS.map(s => {
    const r = calculatePaycheck({ grossAnnual: s.gross, frequency: "biweekly", status: s.status, state });
    const per = (n: number) => n / r.periods;
    const taxes = r.federal + r.socialSecurity + r.medicare + r.stateIncomeTax + r.statePayrollPremiums;
    return { ...s, gross: per(r.grossAnnual), federal: per(r.federal), socialSecurity: per(r.socialSecurity), medicare: per(r.medicare), stateTax: per(r.stateIncomeTax), premiums: per(r.statePayrollPremiums), taxes: per(taxes), net: per(r.netAnnual), netAnnual: r.netAnnual, share: taxes / r.grossAnnual };
  });
  const hasPremiums = rows.some(r => r.premiums > 0);
  const mid = rows[1];
  const stateLabel = city ? `${name} income tax (state + city)` : noTax ? `${name} state income tax (none)` : `${name} state income tax`;

  const heading = <>
    <p className="kicker">SAMPLE {name.toUpperCase()} PAY STUB</p>
    <h2>Sample {name} Paycheck: 2026 Biweekly Pay Stub</h2>
  </>;
  const body = <>
    <p>On a $75,000 salary paid every two weeks, a single {name} employee earns {money.format(mid.gross)} gross per paycheck and takes home <strong>{money.format(mid.net)}</strong> after {money.format(mid.taxes)} in taxes — {pct(mid.share)} of gross pay. The table breaks out every line for three common salaries.</p>
    <div className="table-wrap">
      <table>
        <caption className="table-caption">Per biweekly paycheck (26 pay periods), 2026 withholding tables</caption>
        <thead><tr><th scope="col">Pay stub line</th>{rows.map(r => <th key={r.label} scope="col">{r.label}</th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">Gross pay</th>{rows.map(r => <td key={r.label}>{money.format(r.gross)}</td>)}</tr>
          <tr><th scope="row">Federal income tax</th>{rows.map(r => <td key={r.label}>−{money.format(r.federal)}</td>)}</tr>
          <tr><th scope="row">Social Security (6.2%)</th>{rows.map(r => <td key={r.label}>−{money.format(r.socialSecurity)}</td>)}</tr>
          <tr><th scope="row">Medicare (1.45%)</th>{rows.map(r => <td key={r.label}>−{money.format(r.medicare)}</td>)}</tr>
          <tr><th scope="row">{stateLabel}</th>{rows.map(r => <td key={r.label}>−{money.format(r.stateTax)}</td>)}</tr>
          {hasPremiums && <tr><th scope="row">State SDI / paid-leave premiums</th>{rows.map(r => <td key={r.label}>−{money.format(r.premiums)}</td>)}</tr>}
          <tr><th scope="row">Total taxes</th>{rows.map(r => <td key={r.label}>−{money.format(r.taxes)}</td>)}</tr>
          <tr className="rate-total"><th scope="row">Net pay (take-home)</th>{rows.map(r => <td key={r.label}><strong>{money.format(r.net)}</strong></td>)}</tr>
          <tr><th scope="row">Net pay per year</th>{rows.map(r => <td key={r.label}>{money.format(r.netAnnual)}</td>)}</tr>
        </tbody>
      </table>
    </div>
    <p style={{ color: "#667a8a", lineHeight: 1.7, fontSize: 14 }}>Assumes no pre-tax deductions or retirement contributions, a standard 2026 Form W-4 and default state withholding certificate{city ? "" : ", and no city, county or school-district income tax"}. Enter your own pay in the calculator above to match your actual pay stub.{biweeklyHref && <> For other salaries on the same schedule, use the <a className="text-link" href={biweeklyHref}>{name} biweekly paycheck calculator</a>.</>}</p>
  </>;

  return layout === "seo-section"
    ? <section className="seo-section">{heading}{body}</section>
    : <article className="long-seo">{heading}<section>{body}</section></article>;
}
