import type { Metadata } from "next";
import PaycheckCalculator from "./components/PaycheckCalculator";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "Paycheck Calculator - Calculate Your Take-Home Pay After Taxes",
  description:
    "Use our free paycheck calculator to estimate your take-home pay after federal taxes, state taxes, Social Security, Medicare, and payroll deductions. Calculate your net pay quickly and easily.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Paycheck Calculator - Calculate Your Take-Home Pay After Taxes",
    description:
      "Use our free paycheck calculator to estimate your take-home pay after federal taxes, state taxes, Social Security, Medicare, and payroll deductions.",
    url: "https://www.paycheckscalculator.org",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Paycheck Calculator" }],
  },
};

export default function Home() {
  const canonical = "https://www.paycheckscalculator.org";

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Paycheck Calculator",
    url: canonical,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free online paycheck calculator to estimate take-home pay after federal taxes, state taxes, Social Security, Medicare, and payroll deductions.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "How do I calculate my paycheck after taxes?", acceptedAnswer: { "@type": "Answer", text: "To calculate your paycheck after taxes, subtract federal income tax, state taxes, Social Security, Medicare, and other deductions from your gross income. A paycheck calculator simplifies this process by estimating your expected take-home pay." } },
      { "@type": "Question", name: "How much will my paycheck be after taxes?", acceptedAnswer: { "@type": "Answer", text: "Your paycheck after taxes depends on your salary, location, filing status, deductions, and benefits. The same salary can result in different take-home pay amounts depending on individual circumstances." } },
      { "@type": "Question", name: "What percentage of my paycheck goes to taxes?", acceptedAnswer: { "@type": "Answer", text: "The percentage of taxes deducted from your paycheck depends on your income level, tax bracket, state, and personal deductions. There is no single tax percentage that applies to every employee." } },
      { "@type": "Question", name: "How accurate is a paycheck calculator?", acceptedAnswer: { "@type": "Answer", text: "A paycheck calculator provides an estimate based on the information you enter. Actual paycheck amounts may differ because of employer benefits, deductions, tax changes, and personal financial circumstances." } },
      { "@type": "Question", name: "Does a paycheck calculator include state taxes?", acceptedAnswer: { "@type": "Answer", text: "Yes. Many paycheck calculators consider state taxes when estimating your take-home pay. State tax rules vary, so your location plays an important role in the final calculation." } },
      { "@type": "Question", name: "What is the difference between gross pay and net pay?", acceptedAnswer: { "@type": "Answer", text: "Gross pay is your total earnings before deductions. Net pay is the amount remaining after taxes and deductions are removed. Net pay is the amount you actually receive." } },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Paycheck Atlas",
    url: canonical,
    description: "Free paycheck calculator and take-home pay resource providing transparent, source-backed paycheck estimates.",
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <SiteHeader />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">FREE 2026 TAKE-HOME PAY TOOL</div>
        <h1>Paycheck Calculator: Calculate Your Take-Home Pay After Taxes</h1>
        <div className="hero-intro">
          <p>Use our free paycheck calculator to estimate your take-home pay after taxes and payroll deductions.</p>
          <p>Whether you are paid weekly, biweekly, semi-monthly, or monthly, our calculator helps you understand how much money you will actually receive in your paycheck.</p>
          <p>Estimate your net pay by accounting for common deductions including federal income tax, state taxes, Social Security, Medicare, and other payroll deductions.</p>
        </div>
        <PaycheckCalculator />
        <div className="trust-row">
          <span>✓ IRS 2026 percentage method</span>
          <span>✓ 38 location engines</span>
          <span>✓ No sign-up required</span>
        </div>
        <div className="calc-note">
          <p>Enter your salary information to estimate your paycheck after taxes. Our <strong>paycheck calculator</strong> helps you understand the difference between your gross income and your actual take-home pay.</p>
          <p>The calculation considers important payroll factors, including: gross wages, federal income tax, state income tax, Social Security tax, Medicare tax, and employee deductions.</p>
          <p>Your final paycheck amount may vary depending on your personal tax situation, benefits, retirement contributions, and employer-specific deductions.</p>
        </div>
      </section>

      {/* How Does a Paycheck Calculator Work? */}
      <section className="seo-section text-left">
        <p className="kicker">HOW THE CALCULATOR WORKS</p>
        <h2>How Does a Paycheck Calculator Work?</h2>
        <p className="seo-section-intro">A paycheck calculator estimates your take-home pay by calculating the difference between your gross income and the deductions removed from your paycheck.</p>
        <div className="info-grid">
          <article><span className="article-num">Step 1</span><h3>Calculate Gross Income</h3><p>Gross income is the total amount you earn before any taxes or deductions are applied. Your gross pay may include regular salary or hourly wages, overtime pay, bonuses, commissions, and other taxable compensation.</p></article>
          <article><span className="article-num">Step 2</span><h3>Estimate Federal Income Tax</h3><p>Federal income tax is calculated based on factors such as your income level, filing status, and information provided on your W-4 form. Employees typically have federal taxes withheld from each paycheck throughout the year.</p></article>
          <article><span className="article-num">Step 3</span><h3>Calculate State Income Tax</h3><p>State income tax varies depending on where you live and work. Some states have progressive income tax systems, while others have no state income tax. Your location can significantly affect your final take-home pay.</p></article>
          <article><span className="article-num">Step 4</span><h3>Apply FICA Taxes</h3><p>Most employees contribute to Social Security and Medicare through payroll taxes. These deductions are commonly known as FICA taxes. They help fund important federal programs including retirement and healthcare benefits.</p></article>
          <article><span className="article-num">Step 5</span><h3>Include Additional Deductions</h3><p>Your paycheck may also include voluntary deductions such as health insurance premiums, retirement contributions, flexible spending accounts, and employee benefit programs.</p></article>
          <article><span className="article-num">Step 6</span><h3>Calculate Final Take-Home Pay</h3><p>After subtracting taxes and deductions from your gross income, the remaining amount is your estimated net pay or take-home pay. This is the amount you typically receive in your bank account.</p></article>
        </div>
      </section>

      {/* Understanding Your Paycheck Breakdown */}
      <section className="seo-section text-left">
        <p className="kicker">PAYCHECK BASICS</p>
        <h2>Understanding Your Paycheck Breakdown</h2>
        <p className="seo-section-intro">Understanding your paycheck helps you see where your earnings go and why your take-home pay may differ from your salary.</p>
        <div className="info-grid">
          <article><h3>Gross Pay</h3><p>Gross pay is your total earnings before taxes and deductions. For example, if your annual salary is $75,000, your gross monthly income is approximately $6,250 before deductions.</p></article>
          <article><h3>Payroll Taxes</h3><p>Payroll taxes are required deductions collected from your paycheck. Common payroll taxes include federal income tax, state income tax, Social Security, and Medicare.</p></article>
          <article><h3>Net Pay</h3><p>Net pay is the amount you receive after all taxes and deductions have been removed. This is also known as your take-home pay.</p></article>
        </div>
      </section>

      {/* What Taxes Are Deducted From Your Paycheck? */}
      <section className="seo-section text-left">
        <p className="kicker">PAYCHECK DEDUCTIONS</p>
        <h2>What Taxes Are Deducted From Your Paycheck?</h2>
        <p className="seo-section-intro">Several types of taxes may be deducted from your paycheck depending on your income, location, and employment situation.</p>
        <div className="info-grid">
          <article><h3>Federal Income Tax</h3><p>Federal income tax is collected by the Internal Revenue Service (IRS) and is based on federal tax brackets. Your W-4 form determines how much is withheld from each paycheck.</p></article>
          <article><h3>Social Security Tax</h3><p>Social Security tax helps fund retirement and disability benefits. Employees generally contribute 6.2% of their wages through payroll deductions, up to the annual wage base limit.</p></article>
          <article><h3>Medicare Tax</h3><p>Medicare tax supports the federal healthcare program. Most employees contribute 1.45% of their wages through payroll withholding, with no wage cap.</p></article>
          <article><h3>State Income Tax</h3><p>State taxes vary significantly. Some states have income tax, while others do not. Your state of residence and employment location can impact your paycheck amount.</p></article>
        </div>
      </section>

      {/* Factors That Affect Your Take-Home Pay */}
      <section className="seo-section text-left">
        <p className="kicker">WHAT CHANGES YOUR PAYCHECK</p>
        <h2>Factors That Affect Your Take-Home Pay</h2>
        <p className="seo-section-intro">Your paycheck amount depends on several factors beyond your salary.</p>
        <ul className="checklist">
          <li>Annual income</li>
          <li>Pay frequency (weekly, biweekly, semi-monthly, monthly)</li>
          <li>Filing status</li>
          <li>State of residence</li>
          <li>Tax deductions</li>
          <li>Retirement contributions</li>
          <li>Health insurance benefits</li>
          <li>Other employee benefits</li>
        </ul>
      </section>

      {/* Paycheck Calculator By State */}
      <section className="seo-section">
        <p className="kicker">STATE PAYCHECK CALCULATORS</p>
        <h2>Paycheck Calculator By State</h2>
        <p>Payroll taxes vary across the United States. Use our state-specific paycheck calculators to estimate your take-home pay based on your location.</p>
        <div className="tool-links">
          <a href="/california-paycheck-calculator"><b>California Paycheck Calculator</b><span>Method B, allowances, and SDI →</span></a>
          <a href="/texas-paycheck-calculator"><b>Texas Paycheck Calculator</b><span>No state income tax →</span></a>
          <a href="/florida-paycheck-calculator"><b>Florida Paycheck Calculator</b><span>Zero state income tax →</span></a>
          <a href="/new-york-paycheck-calculator"><b>New York Paycheck Calculator</b><span>State tax plus NYC resident option →</span></a>
          <a href="/new-jersey-paycheck-calculator"><b>New Jersey Paycheck Calculator</b><span>Graduated rates and benefit contributions →</span></a>
          <a href="/illinois-paycheck-calculator"><b>Illinois Paycheck Calculator</b><span>Flat tax with exemptions →</span></a>
          <a href="/pennsylvania-paycheck-calculator"><b>Pennsylvania Paycheck Calculator</b><span>Flat rate with local tax options →</span></a>
          <a href="/georgia-paycheck-calculator"><b>Georgia Paycheck Calculator</b><span>Flat rate with allowances →</span></a>
          <a href="/state-paycheck-calculators"><b>All State Calculators</b><span>Browse all 38 location engines →</span></a>
        </div>
      </section>

      {/* Salary → hourly */}
      <section className="seo-section">
        <p className="kicker">SALARY TO HOURLY</p>
        <h2>$X a Year Is How Much an Hour?</h2>
        <p>Paid a salary? Pick your income to see what it works out to per hour, per paycheck and per month — before and after taxes in all 38 supported states.</p>
        <div className="tool-links">
          <a href="/salary/40000-after-tax-calculator"><b>$40,000 a Year Is How Much an Hour?</b><span>$19.23 an hour at 40 hrs/week →</span></a>
          <a href="/salary/45000-after-tax-calculator"><b>$45,000 a Year Is How Much an Hour?</b><span>$21.63 an hour at 40 hrs/week →</span></a>
          <a href="/salary/50000-after-tax-calculator"><b>$50,000 a Year Is How Much an Hour?</b><span>$24.04 an hour at 40 hrs/week →</span></a>
          <a href="/salary/55000-after-tax-calculator"><b>$55,000 a Year Is How Much an Hour?</b><span>$26.44 an hour at 40 hrs/week →</span></a>
          <a href="/salary/60000-after-tax-calculator"><b>$60,000 a Year Is How Much an Hour?</b><span>$28.85 an hour at 40 hrs/week →</span></a>
          <a href="/salary/70000-after-tax-calculator"><b>$70,000 a Year Is How Much an Hour?</b><span>$33.65 an hour at 40 hrs/week →</span></a>
          <a href="/salary/75000-after-tax-calculator"><b>$75,000 a Year Is How Much an Hour?</b><span>$36.06 an hour at 40 hrs/week →</span></a>
          <a href="/salary/80000-after-tax-calculator"><b>$80,000 a Year Is How Much an Hour?</b><span>$38.46 an hour at 40 hrs/week →</span></a>
          <a href="/salary/100000-after-tax-calculator"><b>$100,000 a Year Is How Much an Hour?</b><span>$48.08 an hour at 40 hrs/week →</span></a>
          <a href="/salary"><b>All Salaries ($25k–$300k)</b><span>Browse every salary-to-hourly page →</span></a>
        </div>
      </section>

      {/* Hourly wage → yearly salary */}
      <section className="seo-section">
        <p className="kicker">HOURLY TO YEARLY</p>
        <h2>$X an Hour Is How Much a Year?</h2>
        <p>Paid by the hour? Pick your rate to see what it adds up to per year, per month and per paycheck — before and after taxes in all 38 supported states.</p>
        <div className="tool-links">
          <a href="/hourly/15-paycheck-calculator"><b>$15 an Hour Is How Much a Year?</b><span>$31,200 a year at 40 hrs/week →</span></a>
          <a href="/hourly/17-paycheck-calculator"><b>$17 an Hour Is How Much a Year?</b><span>$35,360 a year at 40 hrs/week →</span></a>
          <a href="/hourly/20-paycheck-calculator"><b>$20 an Hour Is How Much a Year?</b><span>$41,600 a year at 40 hrs/week →</span></a>
          <a href="/hourly/22-paycheck-calculator"><b>$22 an Hour Is How Much a Year?</b><span>$45,760 a year at 40 hrs/week →</span></a>
          <a href="/hourly/25-paycheck-calculator"><b>$25 an Hour Is How Much a Year?</b><span>$52,000 a year at 40 hrs/week →</span></a>
          <a href="/hourly/30-paycheck-calculator"><b>$30 an Hour Is How Much a Year?</b><span>$62,400 a year at 40 hrs/week →</span></a>
          <a href="/hourly/35-paycheck-calculator"><b>$35 an Hour Is How Much a Year?</b><span>$72,800 a year at 40 hrs/week →</span></a>
          <a href="/hourly/40-paycheck-calculator"><b>$40 an Hour Is How Much a Year?</b><span>$83,200 a year at 40 hrs/week →</span></a>
          <a href="/hourly/50-paycheck-calculator"><b>$50 an Hour Is How Much a Year?</b><span>$104,000 a year at 40 hrs/week →</span></a>
          <a href="/hourly"><b>All Hourly Rates ($10–$150)</b><span>Browse every hourly-to-yearly page →</span></a>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <p className="kicker">COMMON QUESTIONS</p>
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How do I calculate my paycheck after taxes?<span>+</span></summary>
          <p>To calculate your paycheck after taxes, subtract federal income tax, state taxes, Social Security, Medicare, and other deductions from your gross income. A paycheck calculator simplifies this process by estimating your expected take-home pay.</p>
        </details>
        <details>
          <summary>How much will my paycheck be after taxes?<span>+</span></summary>
          <p>Your paycheck after taxes depends on your salary, location, filing status, deductions, and benefits. The same salary can result in different take-home pay amounts depending on individual circumstances.</p>
        </details>
        <details>
          <summary>What percentage of my paycheck goes to taxes?<span>+</span></summary>
          <p>The percentage of taxes deducted from your paycheck depends on your income level, tax bracket, state, and personal deductions. There is no single tax percentage that applies to every employee.</p>
        </details>
        <details>
          <summary>How accurate is a paycheck calculator?<span>+</span></summary>
          <p>A paycheck calculator provides an estimate based on the information you enter. Actual paycheck amounts may differ because of employer benefits, deductions, tax changes, and personal financial circumstances.</p>
        </details>
        <details>
          <summary>Does a paycheck calculator include state taxes?<span>+</span></summary>
          <p>Yes. Many paycheck calculators consider state taxes when estimating your take-home pay. State tax rules vary, so your location plays an important role in the final calculation.</p>
        </details>
        <details>
          <summary>What is the difference between gross pay and net pay?<span>+</span></summary>
          <p>Gross pay is your total earnings before deductions. Net pay is the amount remaining after taxes and deductions are removed. Net pay is the amount you actually receive.</p>
        </details>
      </section>

      {/* EEAT: How We Calculate Your Paycheck */}
      <section className="seo-section">
        <p className="kicker">OUR CALCULATION METHOD</p>
        <h2>How We Calculate Your Paycheck</h2>
        <p>Our paycheck calculator uses standard payroll calculation methods to estimate your expected take-home pay.</p>
        <p>The calculation process considers: <strong>1.</strong> Gross income <strong>2.</strong> Federal tax estimates <strong>3.</strong> State tax estimates <strong>4.</strong> Social Security deductions <strong>5.</strong> Medicare deductions <strong>6.</strong> Additional payroll deductions</p>
        <p>We regularly review our content to help users better understand paycheck calculations and payroll concepts.</p>
        <div className="reviewer">
          <p><small>Reviewed by: Paycheck Calculator Editorial Team</small></p>
          <p><small>Last Updated: August 2026</small></p>
        </div>
      </section>

      {/* Tax Information Sources */}
      <section className="seo-section">
        <p className="kicker">OFFICIAL REFERENCES</p>
        <h2>Tax Information Sources</h2>
        <p>Our paycheck calculations are based on publicly available payroll and tax information.</p>
        <p>For official tax guidance, users should refer to: Internal Revenue Service (IRS), Social Security Administration (SSA), and state tax agencies.</p>
        <p><a className="text-link" href="/methodology">View our complete methodology and official source list →</a></p>
      </section>

      {/* Disclaimer */}
      <section className="seo-section">
        <p className="kicker">IMPORTANT INFORMATION</p>
        <h2>Disclaimer</h2>
        <p>This paycheck calculator provides estimates for informational purposes only. Actual paycheck amounts may vary depending on employer deductions, benefits, tax changes, filing status, and individual financial circumstances.</p>
        <p>For specific tax advice, consult a qualified tax professional.</p>
      </section>

      {/* Related Tools */}
      <section className="seo-section">
        <p className="kicker">MORE PAYCHECK TOOLS</p>
        <h2>Related Paycheck Tools</h2>
        <div className="tool-links">
          <a href="/biweekly-paycheck-calculator"><b>Biweekly paycheck calculator</b><span>Estimate one of 26 yearly paychecks →</span></a>
          <a href="/hourly-paycheck-calculator"><b>Hourly paycheck calculator</b><span>Include regular and overtime hours →</span></a>
          <a href="/how-much-tax-is-taken-from-my-paycheck"><b>How much tax is taken out?</b><span>Explore each paycheck deduction →</span></a>
          <a href="/methodology"><b>Calculation methodology</b><span>Official sources and update history →</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
