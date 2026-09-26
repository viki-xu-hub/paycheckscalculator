import statesData from "../data/states.json";
import { salesTaxLocations } from "../lib/salesTax";

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
            <div className="nav-panel-divider" />
            <div className="nav-group-label">State Income Tax Calculators</div>
            <a href="/illinois-income-tax-calculator">Illinois</a>
            <a href="/pennsylvania-income-tax-calculator">Pennsylvania</a>
            <a href="/georgia-income-tax-calculator">Georgia</a>
            <a href="/new-jersey-income-tax-calculator">New Jersey</a>
            <div className="nav-group-label">Tax & Benefits</div>
            <a href="/hsa-calculator">HSA Calculator</a>
            <a href="/qualified-dividends-and-capital-gain-tax-worksheet">Qualified Dividends Worksheet</a>
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

        {/* Sales Tax dropdown */}
        <div className="nav-item">
          <span className="nav-trigger">Sales Tax <span className="nav-caret">▾</span></span>
          <div className="nav-panel">
            <div className="nav-group-label">Sales Tax Calculators</div>
            <a href="/sales-tax">All Sales Tax Rates →</a>
            <a href="/ohio-sales-tax-calculator">Ohio — All 88 Counties</a>
            <div className="nav-panel-divider" />
            <div className="nav-group-label">By City &amp; County</div>
            {salesTaxLocations.map((l) => (
              <a key={l.slug} href={`/sales-tax/${l.slug}`}>{l.name}, {l.stateAbbr}</a>
            ))}
          </div>
        </div>

        {/* Blog dropdown */}
        <div className="nav-item">
          <span className="nav-trigger">Blog <span className="nav-caret">▾</span></span>
          <div className="nav-panel">
            <div className="nav-group-label">Paycheck Tax Guides</div>
            <a href="/blog">All Blog Articles →</a>
            <a href="/paycheck-taxes">Texas Paycheck Taxes</a>
            <a href="/how-much-tax-is-taken-from-my-paycheck">Tax Taken From My Paycheck</a>
            <div className="nav-panel-divider" />
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
  const states = statesData.filter((s) => !s.isCity);
  return (
    <footer>
      <a className="brand" href="/">
        <span className="brand-mark">★</span>
        <span>Paycheck <b>Atlas</b></span>
      </a>
      <p>Independent, source-backed paycheck estimates.</p>
      <div className="footer-states">
        <p className="footer-states-title">State Paycheck Calculators</p>
        <div className="footer-states-grid">
          {states.map((s) => (
            <a key={s.abbr} href={`/${s.slug}`}>{s.name}</a>
          ))}
        </div>
      </div>
      <div className="footer-blog">
        <p className="footer-blog-title">Sales Tax Rates</p>
        <div className="footer-blog-grid">
          {salesTaxLocations.map((l) => (
            <a key={l.slug} href={`/sales-tax/${l.slug}`}>{l.name} Sales Tax</a>
          ))}
          <a href="/ohio-sales-tax-calculator">Ohio Sales Tax Calculator</a>
          <a href="/sales-tax">All sales tax calculators →</a>
        </div>
      </div>
      <div className="footer-blog">
        <p className="footer-blog-title">From the Blog</p>
        <div className="footer-blog-grid">
          <a href="/paycheck-taxes">How Much Taxes Deducted From Paycheck Texas</a>
          <a href="/how-much-tax-is-taken-from-my-paycheck">How Much Tax Is Taken From My Paycheck</a>
          <a href="/methodology">How We Calculate Paycheck Taxes</a>
          <a href="/blog">All blog articles →</a>
        </div>
      </div>
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
        <a className="partner-badge" target="_blank" href="https://uno.directory" rel="noopener noreferrer">
          <img src="https://uno.directory/uno-directory.svg" alt="Listed on Uno Directory" width="120" height="30" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://launchstag.com/p/paychecks-calculator" rel="noopener">
          <img src="https://launchstag.com/badge-light.svg" alt="Featured on Launchstag" width="198" height="62" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://twelve.tools" rel="noopener noreferrer">
          <img src="https://twelve.tools/badge0-white.svg" alt="Featured on Twelve Tools" width="148" height="40" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://tinylaunch.com" rel="noopener">
          <img
            src="https://tinylaunch.com/tinylaunch_badge_launching_soon.svg"
            alt="TinyLaunch Badge"
            width={202}
            height="auto"
            loading="lazy"
          />
        </a>
        <a className="partner-badge" target="_blank" href="https://prolaunch.net" title="Pro Launch Featured Badge" rel="noopener noreferrer">
          <img
            src="https://prolaunch.net/images/badges/featured-light.svg"
            alt="Pro Launch Featured Badge"
            width={240}
            height="auto"
            loading="lazy"
          />
        </a>
        {/* Raw HTML so the "&" in the badge URLs is not escaped to "&amp;", which 21st Tools' badge check looks for verbatim. */}
        <span
          className="partner-badge"
          dangerouslySetInnerHTML={{
            __html:
              '<a href="https://21st.tools?utm_source=badge&ref=paycheckscalculator.org" target="_blank" rel="noopener"><img src="https://21st.tools/api/badge?theme=light&kind=listing&v=3" alt="Featured on 21st Tools" height="54" /></a>',
          }}
        />
        <a className="partner-badge" target="_blank" href="https://earlyhunt.com/project/paycheck-atlas" rel="noopener">
          <img src="https://earlyhunt.com/badges/earlyhunt-badge-light.svg" alt="Featured on EarlyHunt" width="265" height="58" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://saaspa.ge/product/cmughefm20002ic041s5pxv9q" rel="nofollow">
          <img src="https://saaspa.ge/api/embed/product/cmughefm20002ic041s5pxv9q/badge.png?theme=blue" alt="Featured on Saaspa.ge" width="200" height="60" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://shinylaunch.com/product/paycheckscalculator" rel="noopener noreferrer">
          <img src="https://shinylaunch.com/assets/images/badge.png" alt="ShinyLaunch" width={198} height={54} loading="lazy" />
        </a>
        <a className="partner-badge" href="https://themicrosaasdir.com/product/paycheck-calculator?ref=badge" rel="dofollow">
          <img src="https://themicrosaasdir.com/badge/paycheck-calculator.svg" alt="Featured on TheMicroSaaSDir" width="160" height="44" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://thesaasdir.com/product/evertrend-llc?ref=badge" rel="dofollow">
          <img src="https://thesaasdir.com/badge/evertrend-llc.svg" alt="Featured on TheSaaSDir" width="160" height="44" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://thekeytools.com/ai/paycheckscalculator" rel="noopener noreferrer">
          <img src="https://thekeytools.com/assets/images/badge.png" alt="The Key Tools" width={208} height={54} loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://startupbenchmarks.com/product/paycheckscalculator" rel="noopener noreferrer">
          <img src="https://startupbenchmarks.com/assets/images/badge.png" alt="Startup Benchmarks" width={265} height={54} loading="lazy" />
        </a>
        <a className="partner-badge" href="https://hunt0.com/products/paycheck-calculator-calculate-your-take-home-pay-after-taxes" target="_blank" rel="noopener nofollow">
          <img src="https://hunt0.com/badges/hunt0-find-us-on-light.svg" alt="Find us on HUNT0" width="170" height="53" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://peerpush.com/p/paycheck-atlas-weww" target="_blank" rel="noopener">
          <img src="https://peerpush.com/p/paycheck-atlas-weww/badge.png" alt="Paycheck Atlas on PeerPush" width="230" height="auto" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://www.ontoplist.com/business-webdirectory/" target="_blank" rel="noopener">
          <img src="https://www.ontoplist.com/images/ontoplist31.png?id=6ab68f688dfa5" alt="Top Business Services - OnToplist.com" width="180" height="auto" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://findly.tools/paychecks-calculator?utm_source=paychecks-calculator" target="_blank" rel="noopener noreferrer">
          <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on Findly.tools" width="175" height="55" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://saaslineup.com/product/paycheck-calculator?ref=badge" rel="dofollow">
          <img src="https://saaslineup.com/badge/paycheck-calculator.svg" alt="Featured on SaaSLineup" width="160" height="44" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://stackdirectory.com/product/paycheckscalculator" rel="noopener">
          <img src="https://stackdirectory.com/assets/images/badge.png" alt="Stack Directory" height="54" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://awesomeindie.com/?ref=badge" target="_blank" rel="noopener">
          <img src="https://awesomeindie.com/images/badges/awesome-indie-launching-soon-light.svg" alt="Paycheck Atlas — Launching soon on Awesome Indie" width="184" height="54" loading="lazy" />
        </a>
        <a className="partner-badge" href="https://www.startupinspire.com" target="_blank" rel="noopener noreferrer">
          <img src="https://www.startupinspire.com/images/badge_1.svg" alt="Featured on Startup Inspire" height={54} loading="lazy" />
        </a>
        <a className="partner-badge" href="https://pickapps.org" target="_blank" rel="noopener noreferrer">
          <img src="https://pickapps.org/pickapps-badge.svg" alt="Listed on PickApps" width="160" loading="lazy" />
        </a>
        <a className="partner-badge" target="_blank" href="https://productwing.com/product/paycheckscalculator" rel="noopener noreferrer">
          <img src="https://productwing.com/assets/images/badge.png" alt="Product Wing" height={54} loading="lazy" />
        </a>
        <a className="partner-badge" href="https://saastool.site/item/paycheck-calculator" target="_blank" rel="noopener noreferrer">
          <img src="https://saastool.site/badges/saastool-light.svg" alt="Featured on SaaSTool.site" height={54} width="auto" loading="lazy" />
        </a>
        {/* Raw HTML for the same reason as the first FoundrList badge: verifier matches the snippet literally, including the unescaped "&". */}
        <span
          className="partner-badge"
          dangerouslySetInnerHTML={{
            __html:
              '<a href="https://www.foundrlist.com/product/paycheckcalculator-2?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener"><img src="https://www.foundrlist.com/api/badge/paycheckcalculator-2" alt="Featured on FoundrList" width="150" height="48" /></a>',
          }}
        />
      </div>
      <p className="disclaimer">
        <a href="/blog">Blog</a> · <a href="/methodology">Methodology & sources</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a> · <a href="/partners">Partners</a>
      </p>
    </footer>
  );
}
