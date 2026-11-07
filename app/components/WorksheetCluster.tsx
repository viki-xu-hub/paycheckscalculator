import { capitalGains } from "../lib/qualifiedDividends";

const YEAR = capitalGains.year;

export const WORKSHEET_CLUSTER = [
  {
    href: "/qualified-dividends-and-capital-gain-tax-worksheet",
    title: `Qualified Dividends and Capital Gain Tax Worksheet ${YEAR}`,
    blurb: "All 25 lines, a calculator and a printable copy →",
  },
  {
    href: "/tax-computation-worksheet",
    title: `${YEAR} Tax Computation Worksheet`,
    blurb: "Tax on $100,000 or more, every filing status →",
  },
  {
    href: "/form-1040-line-16",
    title: "Form 1040 Line 16",
    blurb: "Which method figures your tax →",
  },
  {
    href: "/estimated-tax-worksheet",
    title: `${YEAR} Estimated Tax Worksheet`,
    blurb: "Form 1040-ES, line by line, with due dates →",
  },
  {
    href: "/publication-505",
    title: `IRS Publication 505 (${YEAR})`,
    blurb: "Withholding, estimated tax and its worksheets →",
  },
];

/** Cross-links between the Form 1040 tax-worksheet pages; the current page is left out. */
export default function WorksheetCluster({ current }: { current: string }) {
  return (
    <article className="long-seo">
      <p className="kicker">{YEAR} TAX WORKSHEETS</p>
      <h3>Related {YEAR} tax worksheets</h3>
      <section>
        <div className="tool-links">
          {WORKSHEET_CLUSTER.filter(p => p.href !== current).map(p => (
            <a key={p.href} href={p.href}><b>{p.title}</b><span>{p.blurb}</span></a>
          ))}
        </div>
      </section>
    </article>
  );
}
