"use client";

import { useMemo, useState } from "react";

type FilingStatus = "single" | "married" | "head";
type Frequency = "weekly" | "biweekly" | "semimonthly" | "monthly" | "annual";

const periods: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annual: 1,
};

const brackets: Record<FilingStatus, [number, number][]> = {
  single: [[12400, .10], [50400, .12], [105700, .22], [201775, .24], [256225, .32], [640600, .35], [Infinity, .37]],
  married: [[24800, .10], [100800, .12], [211400, .22], [403550, .24], [512450, .32], [768700, .35], [Infinity, .37]],
  head: [[17700, .10], [67450, .12], [105700, .22], [201750, .24], [256200, .32], [640600, .35], [Infinity, .37]],
};

const deductions: Record<FilingStatus, number> = { single: 16100, married: 32200, head: 24150 };

function progressiveTax(income: number, status: FilingStatus) {
  let tax = 0;
  let previous = 0;
  for (const [ceiling, rate] of brackets[status]) {
    if (income <= previous) break;
    tax += (Math.min(income, ceiling) - previous) * rate;
    previous = ceiling;
  }
  return Math.max(0, tax);
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const wholeMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Home() {
  const [salary, setSalary] = useState(75000);
  const [frequency, setFrequency] = useState<Frequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [preTax, setPreTax] = useState(250);
  const [additional, setAdditional] = useState(0);

  const result = useMemo(() => {
    const count = periods[frequency];
    const safeSalary = Math.max(0, salary || 0);
    const annualPreTax = Math.min(safeSalary, Math.max(0, preTax || 0) * count);
    const taxableFederal = Math.max(0, safeSalary - annualPreTax - deductions[status]);
    const federal = progressiveTax(taxableFederal, status) + Math.max(0, additional || 0) * count;
    const ficaWages = Math.max(0, safeSalary - annualPreTax);
    const socialSecurity = Math.min(ficaWages, 184500) * .062;
    const medicare = ficaWages * .0145 + Math.max(0, ficaWages - 200000) * .009;
    const annualNet = Math.max(0, safeSalary - annualPreTax - federal - socialSecurity - medicare);
    return {
      count,
      gross: safeSalary / count,
      preTax: annualPreTax / count,
      federal: federal / count,
      socialSecurity: socialSecurity / count,
      medicare: medicare / count,
      net: annualNet / count,
      annualNet,
      effective: safeSalary ? ((federal + socialSecurity + medicare) / safeSalary) * 100 : 0,
    };
  }, [salary, frequency, status, preTax, additional]);

  const taxes = result.federal + result.socialSecurity + result.medicare;
  const netShare = result.gross ? (result.net / result.gross) * 100 : 0;
  const taxShare = result.gross ? (taxes / result.gross) * 100 : 0;
  const deductionShare = Math.max(0, 100 - netShare - taxShare);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Lone Star Paycheck home"><span className="brand-mark">★</span><span>Lone Star <b>Paycheck</b></span></a>
        <nav aria-label="Main navigation"><a href="#calculator">Calculator</a><a href="#how-it-works">How it works</a><a href="#faq">FAQ</a></nav>
        <span className="year-pill">Updated for 2026</span>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span>★</span> No Texas state income tax</div>
        <h1>Texas Paycheck <em>Calculator</em></h1>
        <p className="hero-copy">See what you’ll actually take home. Enter your pay details for a clear estimate of your Texas paycheck.</p>

        <div className="calculator" id="calculator">
          <section className="inputs" aria-labelledby="details-title">
            <div className="section-heading"><span className="step">1</span><div><h2 id="details-title">Your pay details</h2><p>Adjust the fields to match your paycheck.</p></div></div>

            <label className="field"><span>Annual gross salary</span><div className="money-input"><span>$</span><input type="number" min="0" step="1000" value={salary} onChange={(e) => setSalary(Number(e.target.value))} aria-label="Annual gross salary" /></div></label>

            <div className="field"><span>Pay frequency</span><div className="frequency-grid">
              {(["weekly", "biweekly", "semimonthly", "monthly"] as Frequency[]).map((item) => <button key={item} className={frequency === item ? "active" : ""} onClick={() => setFrequency(item)} type="button">{item === "biweekly" ? "Bi-weekly" : item === "semimonthly" ? "Semi-monthly" : item[0].toUpperCase() + item.slice(1)}<small>{periods[item]}× / year</small></button>)}
            </div></div>

            <label className="field"><span>Federal filing status</span><select value={status} onChange={(e) => setStatus(e.target.value as FilingStatus)}><option value="single">Single</option><option value="married">Married filing jointly</option><option value="head">Head of household</option></select></label>

            <div className="split-fields">
              <label className="field"><span>Pre-tax deductions <i title="For example: 401(k), HSA, or eligible health premiums">?</i></span><div className="money-input"><span>$</span><input type="number" min="0" step="25" value={preTax} onChange={(e) => setPreTax(Number(e.target.value))} /></div><small>Per paycheck</small></label>
              <label className="field"><span>Extra federal withholding</span><div className="money-input"><span>$</span><input type="number" min="0" step="10" value={additional} onChange={(e) => setAdditional(Number(e.target.value))} /></div><small>Per paycheck</small></label>
            </div>
          </section>

          <section className="results" aria-live="polite">
            <div className="section-heading light"><span className="step">2</span><div><h2>Your estimated take-home pay</h2><p>Based on the details you entered.</p></div></div>
            <div className="net-amount"><span>NET PAY · {frequency === "biweekly" ? "BI-WEEKLY" : frequency.toUpperCase()}</span><strong>{money.format(result.net)}</strong><small>{wholeMoney.format(result.annualNet)} per year</small></div>
            <div className="bar" aria-label={`${netShare.toFixed(0)} percent take-home, ${taxShare.toFixed(0)} percent taxes, ${deductionShare.toFixed(0)} percent deductions`}><span style={{width: `${netShare}%`}} /><span style={{width: `${taxShare}%`}} /><span style={{width: `${deductionShare}%`}} /></div>
            <div className="legend"><span><i className="net-dot" />Take-home {netShare.toFixed(0)}%</span><span><i className="tax-dot" />Taxes {taxShare.toFixed(0)}%</span><span><i className="deduction-dot" />Deductions {deductionShare.toFixed(0)}%</span></div>
            <div className="breakdown">
              <div><span>Gross pay</span><b>{money.format(result.gross)}</b></div>
              <div><span>Federal income tax</span><b>−{money.format(result.federal)}</b></div>
              <div><span>Social Security</span><b>−{money.format(result.socialSecurity)}</b></div>
              <div><span>Medicare</span><b>−{money.format(result.medicare)}</b></div>
              <div><span>Pre-tax deductions</span><b>−{money.format(result.preTax)}</b></div>
            </div>
            <div className="result-note"><span>ⓘ</span><p>Texas doesn’t collect individual state income tax. Your actual withholding may vary based on your W-4 and benefits.</p></div>
          </section>
        </div>
        <div className="trust-row"><span>✓ 2026 federal tax brackets</span><span>✓ FICA included</span><span>✓ No sign-up required</span></div>
      </section>

      <section className="why" id="how-it-works">
        <div><p className="kicker">THE TEXAS ADVANTAGE</p><h2>More of your paycheck<br/>stays in your pocket.</h2></div>
        <p>Texas is one of the few states with no individual state income tax. Your paycheck is still subject to federal income tax, Social Security, Medicare, and any deductions you choose.</p>
        <div className="stat"><strong>0%</strong><span>Texas individual<br/>state income tax</span></div>
      </section>

      <section className="info-grid">
        <article><span className="article-num">01</span><h3>What comes out of a Texas paycheck?</h3><p>Federal income tax uses progressive brackets. Employees also pay 6.2% Social Security up to the annual wage cap and 1.45% Medicare, plus an additional Medicare tax at higher incomes.</p></article>
        <article><span className="article-num">02</span><h3>How this estimate works</h3><p>We annualize your income, subtract eligible pre-tax deductions and the 2026 standard deduction, apply federal brackets, then divide the result by your pay frequency.</p></article>
        <article><span className="article-num">03</span><h3>Why your paycheck may differ</h3><p>Your Form W-4, bonuses, itemized deductions, tax credits, benefit eligibility, and year-to-date wages can all change actual employer withholding.</p></article>
      </section>

      <section className="faq" id="faq"><p className="kicker">QUICK ANSWERS</p><h2>Texas paycheck FAQ</h2>
        <details open><summary>Does Texas have a state income tax?<span>+</span></summary><p>No. Texas does not impose an individual state income tax on wages, so the calculator shows $0 for state income tax.</p></details>
        <details><summary>Is this the same as my employer’s payroll calculation?<span>+</span></summary><p>No. This is a planning estimate based on annual tax brackets and common deductions. Payroll systems use your full W-4 and year-to-date payroll information.</p></details>
        <details><summary>Are bonuses and overtime included?<span>+</span></summary><p>Include expected bonuses and overtime in annual gross salary for a broader annual estimate. Supplemental wages may be withheld differently on an actual paycheck.</p></details>
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark">★</span><span>Lone Star <b>Paycheck</b></span></a><p>Free Texas paycheck estimates, built for clarity.</p><p className="disclaimer">For informational purposes only. Not tax, legal, or financial advice.</p></footer>
    </main>
  );
}
