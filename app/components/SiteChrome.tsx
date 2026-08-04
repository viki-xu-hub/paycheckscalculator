export function SiteHeader() {
  return <header className="site-header"><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><nav aria-label="Main navigation"><a href="/">Paycheck Calculator</a><a href="/state-paycheck-calculators">States</a><a href="/biweekly-paycheck-calculator">Biweekly Pay</a><a href="/hourly-paycheck-calculator">Hourly Pay</a><a href="/paycheck-taxes">Paycheck Taxes</a><a href="/methodology">How It Works</a></nav><span className="year-pill">2026 methods</span></header>;
}

export function SiteFooter() {
  return <footer><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><p>Independent, source-backed paycheck estimates.</p><p className="disclaimer"><a href="/methodology">Methodology & sources</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a> · <a href="/partners">Partners</a></p></footer>;
}
