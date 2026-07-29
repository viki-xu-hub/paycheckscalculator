export function SiteHeader() {
  return <header className="site-header"><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><nav aria-label="Main navigation"><a href="/">Calculator</a><a href="/state-paycheck-calculators">States</a><a href="/biweekly-paycheck-calculator">Biweekly</a><a href="/hourly-paycheck-calculator">Hourly</a><a href="/how-much-tax-is-taken-from-my-paycheck">Paycheck taxes</a><a href="/methodology">Methodology</a></nav><span className="year-pill">2026 methods</span></header>;
}

export function SiteFooter() {
  return <footer><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><p>Independent, source-backed paycheck estimates.</p><p className="disclaimer"><a href="/methodology">Methodology & sources</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a></p></footer>;
}
