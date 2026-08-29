export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        <span className="brand-mark">★</span>
        <span>Paycheck <b>Atlas</b></span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/">Calculator</a>

        {/* Calculators dropdown */}
        <div className="nav-item">
          <span className="nav-trigger">Calculators <span className="nav-caret">▾</span></span>
          <div className="nav-panel">
            <div className="nav-group-label">By Amount</div>
            <a href="/salary">Salary After Tax</a>
            <a href="/hourly">Hourly Pay</a>
            <div className="nav-panel-divider" />
            <div className="nav-group-label">By Frequency</div>
            <a href="/biweekly-paycheck-calculator">Biweekly Pay</a>
            <a href="/weekly-paycheck-calculator">Weekly Pay</a>
            <a href="/semimonthly-paycheck-calculator">Semimonthly Pay</a>
            <a href="/monthly-paycheck-calculator">Monthly Pay</a>
          </div>
        </div>

        {/* By State dropdown */}
        <div className="nav-item">
          <span className="nav-trigger">By State <span className="nav-caret">▾</span></span>
          <div className="nav-panel nav-panel-wide">
            <div>
              <div className="nav-group-label">State Calculators</div>
              <a href="/state-paycheck-calculators">All 38 States →</a>
              <a href="/texas-paycheck-calculator">Texas</a>
              <a href="/california-paycheck-calculator">California</a>
              <a href="/new-york-paycheck-calculator">New York</a>
              <a href="/florida-paycheck-calculator">Florida</a>
              <a href="/new-jersey-paycheck-calculator">New Jersey</a>
              <a href="/illinois-paycheck-calculator">Illinois</a>
              <div className="nav-panel-divider" />
              <div className="nav-group-label">Texas by Situation</div>
              <a href="/texas-paycheck-calculator-with-bonus">Texas With Bonus</a>
              <a href="/texas-paycheck-calculator-with-dependents">Texas With Dependents</a>
              <a href="/texas-paycheck-calculator-with-child-support">Texas With Child Support</a>
            </div>
            <div>
              <div className="nav-group-label">Biweekly by State</div>
              <a href="/biweekly/texas-paycheck-calculator">Texas Biweekly</a>
              <a href="/biweekly/california-paycheck-calculator">California Biweekly</a>
              <a href="/biweekly/new-york-paycheck-calculator">New York Biweekly</a>
              <a href="/biweekly/florida-paycheck-calculator">Florida Biweekly</a>
              <a href="/biweekly/new-jersey-paycheck-calculator">New Jersey Biweekly</a>
              <a href="/biweekly/georgia-paycheck-calculator">Georgia Biweekly</a>
            </div>
          </div>
        </div>

        {/* Resources dropdown */}
        <div className="nav-item">
          <span className="nav-trigger">Resources <span className="nav-caret">▾</span></span>
          <div className="nav-panel">
            <a href="/paycheck-taxes">Paycheck Taxes</a>
            <a href="/methodology">How It Works</a>
            <a href="/about">About</a>
          </div>
        </div>
      </nav>
      <span className="year-pill">2026 methods</span>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <a className="brand" href="/">
        <span className="brand-mark">★</span>
        <span>Paycheck <b>Atlas</b></span>
      </a>
      <p>Independent, source-backed paycheck estimates.</p>
      <p className="disclaimer">
        <a href="/methodology">Methodology & sources</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a> · <a href="/partners">Partners</a>
      </p>
    </footer>
  );
}
