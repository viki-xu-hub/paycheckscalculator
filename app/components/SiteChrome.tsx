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
            <a href="/hourly-paycheck-calculator">Hourly Pay</a>
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
              <a href="/state-paycheck-calculators">All 50 States + DC →</a>
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
      <div className="partner-zone">
        <span className="partner-zone-label">Partner Zone</span>
        <a className="partner-badge" target="_blank" href="https://beamtools.com/tool/paycheckscalculator" rel="noopener noreferrer">
          <img src="https://beamtools.com/assets/images/badge.png" alt="Beam Tools" width="185" height="54" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://devhub.best/projects/paycheck-atlas?utm_source=badge" rel="noopener noreferrer">
          <img src="https://r2.direasy-multi-tenant.focusapps.app/uploads/616d0b1a-3979-4b8c-94d1-b4f1fedd3ead/1783239702078/53yqmim54zv/featured-on-light.svg" alt="Featured on DevHub" width="150" height="44" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://fastlaunch.io" rel="noopener noreferrer">
          <img src="https://fastlaunch.io/images/badges/featured-light.svg" alt="Featured on FastLaunch" width="221" height="60" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://firsto.co/projects/paychecks-calculator" title="Discover Paychecks Calculator on Firsto" rel="noopener noreferrer">
          <img src="https://firsto.co/images/badges/find-us-on-firsto.svg" alt="Discover Paychecks Calculator on Firsto" width="111" height="43" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://indielineup.com/product/paycheck-calculator?ref=badge" rel="dofollow">
          <img src="https://indielineup.com/badge/paycheck-calculator.svg" alt="Featured on IndieLineup" width="160" height="44" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://huzzler.so/products/LmCHuJ3iJ0/paychecks-calculator?utm_source=huzzler_product_website&utm_medium=badge&utm_campaign=free_listing" rel="noopener noreferrer">
          <img src="https://huzzler.so/assets/images/embeddable-badges/featured.png" alt="Huzzler Embed Badge" width="159" height="55" loading="lazy" />
        </a>
        <a href="https://dailypings.com/p/paycheck-calculator-calculate-your-take" target="_blank" rel="noopener" title="Featured on DailyPings" className="partner-badge">
          <img src="https://dailypings.com/badge.svg" alt="Featured on DailyPings" width="179" height="32" loading="lazy" />
        </a>
        <a href="https://buildvoyage.com/products/paychecks-calculator?ref=badge" target="_blank" rel="noopener" className="partner-badge partner-badge-buildvoyage">
          <img src="https://buildvoyage.com/images/featured_badge.png" alt="Featured on BuildVoyage" width="250" height="167" loading="lazy" />
        </a>
        <a href="https://dododirectory.com" target="_blank" rel="dofollow" className="partner-badge">
          <img src="https://dododirectory.com/badge-light.png" alt="Featured on DodoDirectory" width="200" height="54" loading="lazy" />
        </a>
        {/* Raw HTML so the "&" in the badge URL is not escaped to "&amp;", which Fazier's badge check looks for verbatim. */}
        <span
          className="partner-badge"
          dangerouslySetInnerHTML={{
            __html:
              '<a href="https://fazier.com/launches/www.paycheckscalculator.org" target="_blank" rel="noopener"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light" width=120 alt="Fazier badge" /></a>',
          }}
        />
        {/* Raw HTML for the same reason as Fazier: FoundrList's verifier matches the snippet literally, including the unescaped "&". */}
        <span
          className="partner-badge"
          dangerouslySetInnerHTML={{
            __html:
              '<a href="https://www.foundrlist.com/product/paycheckcalculator?utm_source=badge&utm_medium=embed" rel="noopener"><img src="https://www.foundrlist.com/api/badge/paycheckcalculator" alt="Featured on FoundrList" width="150" height="48" /></a>',
          }}
        />
        <span className="partner-badge">
          <a href="https://neeed.directory" target="_blank" rel="noopener">
            <img src="https://neeed.directory/badges/neeed-badge-light.svg" alt="Featured on neeed.directory" width="139" height="44" loading="lazy" />
          </a>
        </span>
        {/* Raw HTML keeps NxGn's snippet verbatim (inline styles included); the CSS below overrides the inline 48px height. */}
        <span
          className="partner-badge partner-badge-nxgn"
          dangerouslySetInnerHTML={{
            __html:
              '<a href="https://www.nxgntools.com/tools/paycheck-calculator?utm_source=paycheck-calculator" target="_blank" rel="noopener" style="display: inline-block; width: auto;"><img src="https://www.nxgntools.com/api/embed/paycheck-calculator?type=LAUNCHING_SOON_ON" alt="Launching soon on NxGn Tools" style="height: 48px; width: auto;" /></a>',
          }}
        />
      </div>
      <p className="disclaimer">
        <a href="/methodology">Methodology & sources</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a> · <a href="/partners">Partners</a>
      </p>
    </footer>
  );
}
