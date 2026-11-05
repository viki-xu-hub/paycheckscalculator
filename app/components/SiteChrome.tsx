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
          <div className="nav-panel nav-panel-cols3">
            <div>
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
            <div>
              <div className="nav-group-label">State Income Tax</div>
              <a href="/illinois-income-tax-calculator">Illinois</a>
              <a href="/pennsylvania-income-tax-calculator">Pennsylvania</a>
              <a href="/georgia-income-tax-calculator">Georgia</a>
              <a href="/new-jersey-income-tax-calculator">New Jersey</a>
              <a href="/connecticut-income-tax-calculator">Connecticut</a>
              <a href="/utah-income-tax-calculator">Utah</a>
              <a href="/tennessee-income-tax-calculator">Tennessee — No Tax</a>
              <a href="/florida-state-tax-calculator">Florida — No Tax</a>
            </div>
            <div>
              <div className="nav-group-label">Pay & Tax Tools</div>
              <a href="/overtime-calculator">Overtime Calculator</a>
              <a href="/no-tax-on-overtime">No Tax on Overtime</a>
              <a href="/self-employment-tax-calculator">Self-Employment Tax</a>
              <a href="/gross-up-calculator">Gross-Up Calculator</a>
              <a href="/ytd-calculator">YTD Calculator</a>
              <a href="/pay-stub-calculator">Pay Stub Calculator</a>
              <a href="/severance-pay-tax-calculator">Severance & PTO Tax</a>
              <div className="nav-panel-divider" />
              <div className="nav-group-label">Tax & Benefits</div>
              <a href="/hsa-calculator">HSA Calculator</a>
              <a href="/401k-paycheck-impact-calculator">401(k) Paycheck Impact</a>
              <a href="/qualified-dividends-and-capital-gain-tax-worksheet">Qualified Dividends</a>
            </div>
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
              <div className="nav-group-label">Bonus by State</div>
              <a href="/illinois-paycheck-calculator-with-bonus">Illinois With Bonus</a>
              <a href="/ohio-paycheck-calculator-with-bonus">Ohio With Bonus</a>
              <a href="/florida-paycheck-calculator-with-bonus">Florida With Bonus</a>
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
          <div className="nav-panel nav-panel-cols3 nav-panel-centered">
            <div className="nav-panel-span">
              <div className="nav-group-label">Sales Tax Calculators</div>
              <div className="nav-panel-row">
                <a href="/sales-tax">All Sales Tax Rates →</a>
                <a href="/ohio-sales-tax-calculator">Ohio — All 88 Counties</a>
              </div>
              <div className="nav-panel-divider" />
              <div className="nav-group-label">By City &amp; County</div>
            </div>
            {[0, 1, 2].map((col) => (
              <div key={col}>
                {salesTaxLocations
                  .slice(Math.ceil(salesTaxLocations.length / 3) * col, Math.ceil(salesTaxLocations.length / 3) * (col + 1))
                  .map((l) => (
                    <a key={l.slug} href={`/sales-tax/${l.slug}`}>{l.name}, {l.stateAbbr}</a>
                  ))}
              </div>
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

// Directory badges render on the homepage footer and the /partners page only,
// so the reciprocal links don't repeat across every page of the site.
export function SiteFooter({ showPartnerZone = false }: { showPartnerZone?: boolean } = {}) {
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
          <a href="/biweekly-pay">Biweekly Pay Chart &amp; 2026–27 Pay Dates</a>
          <a href="/blog/how-to-calculate-gross-monthly-income-from-biweekly-paycheck">Gross Monthly Income From Biweekly Pay</a>
          <a href="/blog/how-to-calculate-taxes-on-paycheck-in-texas">How to Calculate Taxes on a Texas Paycheck</a>
          <a href="/blog/how-to-calculate-401k-from-paycheck">How to Calculate 401k From Paycheck</a>
          <a href="/paycheck-taxes">How Much Taxes Deducted From Paycheck Texas</a>
          <a href="/how-much-tax-is-taken-from-my-paycheck">How Much Tax Is Taken From My Paycheck</a>
          <a href="/methodology">How We Calculate Paycheck Taxes</a>
          <a href="/blog">All blog articles →</a>
        </div>
      </div>
      {showPartnerZone && (
        <div className="partner-zone">
          <span className="partner-zone-label">Partner Zone</span>
          <PartnerBadges />
        </div>
      )}
      <p className="disclaimer">
        <a href="/blog">Blog</a> · <a href="/methodology">Methodology & sources</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a> · <a href="/partners">Partners</a>
      </p>
    </footer>
  );
}

export function PartnerBadges() {
  return (
    <>
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
      <a className="partner-badge" target="_blank" href="https://dang.ai" rel="dofollow noopener">
        <img src="https://assets.dang.ai/badges/dang-verified-dark.png" alt="Verified on DANG!" width="260" height="94" loading="lazy" />
      </a>
      <a className="partner-badge" target="_blank" href="https://best-ai.org" rel="dofollow noopener">
        <img
          src="https://best-ai.org/images/badge-best-ai-org.png"
          srcSet="https://best-ai.org/images/badge-best-ai-org.png 1x, https://best-ai.org/images/badge-best-ai-org@2x.png 2x"
          alt="Listed on Best-AI.org"
          width="200"
          height="48"
          loading="lazy"
        />
      </a>
      {/* Bowora ships an inline HTML/SVG badge instead of an image, so it goes in as markup. */}
      <a
        className="partner-badge"
        href="https://bowora.com/?via=82fsixol"
        target="_blank"
        rel="noopener"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          width: 170,
          height: 50,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          padding: "8px 14px",
          borderRadius: 8,
          textDecoration: "none",
          border: "1px solid #E8E8E8",
        }}
      >
        <svg width="35" height="35" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(31.1875, 18.1874)" fill="#000">
            <path d="M87.5343464,15.4046144 C88.0800499,16.2992254 87.7980596,17.4698555 86.9050901,18.0165331 C86.0121207,18.5633415 84.8423829,18.2806539 84.2966794,17.3859122 C81.7117678,13.1474282 78.0968081,9.80172458 73.4648555,7.33755659 L73.4485366,7.32879615 C68.8772902,4.83909213 63.5398394,3.61244746 57.444409,3.61244746 L9.3017365,3.61244746 C7.67506992,3.61244746 6.3960609,3.83953898 5.49238625,4.41819874 L5.45674581,4.4405444 C4.79524344,4.84409996 4.32995935,5.45833757 4.0239476,6.27503287 C3.73947677,7.26368123 3.60644521,8.42777375 3.60644521,9.76432926 L3.60644521,103.544841 C3.60644521,104.950303 3.75631787,106.263062 4.0658545,107.495669 C4.27578065,108.239391 4.6709588,108.810258 5.28428782,109.184211 L5.31979771,109.20657 C6.22347236,109.785151 7.50248138,110.012269 9.12927851,110.012269 L59.1699028,110.012269 C63.7602097,110.012269 68.0783175,109.267239 72.1226597,107.769727 C76.1497692,106.173758 79.6895314,103.98404 82.7378993,101.19469 C83.5107618,100.487317 84.7118318,100.541579 85.4181132,101.315897 C86.1243946,102.090216 86.0708687,103.293142 85.2967007,104.000384 C81.9088999,107.100795 77.9767011,109.539466 73.4985376,111.311429 L73.4602862,111.326073 C68.9979194,112.981273 64.2351545,113.8126 59.1699028,113.8126 L9.12927851,113.8126 C6.62504751,113.8126 4.6896276,113.307371 3.2936448,112.419559 C1.8549718,111.536324 0.878319095,110.227096 0.397499432,108.466901 L0.387969203,108.430944 C0.00649891912,106.918395 -0.1875,105.289999 -0.1875,103.544841 L-0.1875,9.76432926 C-0.1875,7.97589194 0.0187707215,6.42738608 0.409379582,5.11588281 L0.444889478,5.00826015 C1.06187393,3.31376875 2.08082518,2.0552073 3.46675555,1.20522233 C4.8626078,0.317842042 6.79815825,-0.1874 9.3017365,-0.1874 L57.444409,-0.1874 C64.2296714,-0.1874 70.1626962,1.21570871 75.252361,3.98591679 C80.5093922,6.78394907 84.5995579,10.5933023 87.5343464,15.4046144 Z" />
            <path d="M18.1870648,100.8126 C16.6872227,100.8126 15.520287,100.518396 14.687172,99.9299894 C13.9369898,99.4256779 13.4369118,98.6692106 13.1873299,97.6604566 C12.9372256,96.567738 12.8125,95.3909238 12.8125,94.130538 L12.8125,19.2423752 C12.8125,17.9815965 12.9372256,16.8888779 13.1873299,15.9647434 C13.5207588,14.9559894 14.0622378,14.1995221 14.8124201,13.6952106 C15.6459269,13.1068035 16.8124708,12.8126 18.3128353,12.8126 L53.1886048,12.8126 C57.8554332,12.8126 61.9387285,13.8632708 65.4386213,15.9647434 C69.0219693,18.066085 71.8139951,20.9235009 73.8135234,24.537515 C75.8135741,28.1519222 76.7720677,32.1020566 76.688482,36.3885735 C76.7720677,38.5740106 76.5218328,40.7170071 75.9382997,42.8183487 C75.3548972,44.9198213 74.4798587,46.8946265 73.3134454,48.7439434 C72.2298343,50.5090336 70.8552402,51.9800514 69.188096,53.1563416 C71.438251,54.5853115 73.3548465,56.4346284 74.9381438,58.7036372 C76.5213104,60.9731699 77.729386,63.4943345 78.5626316,66.2681788 C79.3971832,69.0416301 79.8125,71.9416177 79.8125,74.9670938 C79.7302203,78.5811079 79.0628402,81.9848831 77.8129717,85.1790743 C76.5631033,88.2891699 74.771364,91.0204424 72.4380151,93.3735468 C70.1045356,95.7271752 67.3963567,97.576361 64.3126949,98.9208424 C61.2291637,100.181752 57.9374518,100.8126 54.437559,100.8126 L18.186673,100.8126 L18.1870648,100.8126 Z" fillRule="nonzero" />
          </g>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: 10, fontWeight: "normal" }}>Featured on</span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Bowora</span>
        </div>
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
      {/* Raw HTML so the "&" in the badge URL is not escaped to "&amp;", which StartupBase's badge check looks for verbatim. */}
      <span
        className="partner-badge"
        dangerouslySetInnerHTML={{
          __html:
            '<a href="https://startupbase.io/products/paycheck-calculator?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-light" target="_blank" rel="noopener noreferrer"><img src="https://statics.startupbase.io/site/badges/launched-on-sb.svg" alt="Launched on StartupBase" height="55" style="height:55px;width:auto;" /></a>',
        }}
      />
      <a className="partner-badge" href="https://smollaunch.com" target="_blank" rel="noopener noreferrer">
        <img src="https://smollaunch.com/badges/featured.svg" alt="Paycheck Calculator — Featured on Smol Launch" width="250" height="60" loading="lazy" />
      </a>
      {/* Raw HTML for the same reason as the first FoundrList badge: verifier matches the snippet literally, including the unescaped "&". */}
      <span
        className="partner-badge"
        dangerouslySetInnerHTML={{
          __html:
            '<a href="https://www.foundrlist.com/product/paycheckcalculator-2?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener"><img src="https://www.foundrlist.com/api/badge/paycheckcalculator-2" alt="Featured on FoundrList" width="150" height="48" /></a>',
        }}
      />
      {/* Wrapper carries the class so the <a>/<img> stay exactly as Stremit supplies them; the badge art is dark, so it sits on a light chip. */}
      <span className="partner-badge partner-badge-stremit">
        <a href="https://stremit.io" target="_blank" rel="noopener">
          <img src="https://stremit.io/static/img/badges/featured-on-stremit.png" alt="Featured on Stremit" width="240" height="89" />
        </a>
      </span>
      {/* Raw HTML keeps Smartees' snippet byte-for-byte (line breaks and " />" included), which React would otherwise reformat. */}
      <span
        className="partner-badge"
        dangerouslySetInnerHTML={{
          __html:
            '<a href="https://smartees.tech/t/paycheck-calculator" target="_blank" rel="noopener">\n  <img src="https://smartees.tech/badge/smartees-listed-light.svg" alt="Featured on Smartees" width="184" height="44" loading="lazy" />\n</a>',
        }}
      />
    </>
  );
}
