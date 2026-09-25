import { notFound } from "next/navigation";
import { locations,locationBySlug } from "../lib/locations";
import PaycheckCalculator from "../components/PaycheckCalculator";
import {SiteFooter,SiteHeader} from "../components/SiteChrome";
import type {SupportedState} from "../lib/payroll";
import FrequencyPageTemplate from "../components/FrequencyPageTemplate";
import type { FrequencyData } from "../lib/seo/types";
import frequenciesRaw from "../data/frequencies.json";
import type { Metadata } from "next";
import { frequencyMeta } from "../lib/seo/meta";
import editorialRaw from "../data/state-editorial.json";

// Per-state editorial copy (intro, tax summary, sections, FAQs) written for each state individually;
// see scripts/merge-state-editorial.mjs. States without an entry fall back to the shared template text.
type StateEditorialCopy={code:string;intro:string;taxSummary:string;sections:{h3:string;p:string}[];faqs:{q:string;a:string}[]};
const editorialByCode:Record<string,StateEditorialCopy>=Object.fromEntries((editorialRaw as StateEditorialCopy[]).map(e=>[e.code,e]));

const frequencies = frequenciesRaw as FrequencyData[];
// biweekly already has its own static page — exclude it to avoid build conflict
const DYNAMIC_FREQUENCIES = frequencies.filter(f => f.shortLabel !== "biweekly");
const frequencyBySlug = Object.fromEntries(DYNAMIC_FREQUENCIES.map(f => [f.slug, f]));

// State pages not yet indexed by Google — suppress until they gain authority
const NOINDEX_STATE_SLUGS = new Set<string>([]);

// States where the abbreviation outsells the full name: "pa paycheck calculator" runs
// 9,900/mo against 2,900 for "pennsylvania paycheck calculator", and MA, SC, GA, CT and KY
// follow the same pattern. Those titles lead with the abbreviation so the phrase searchers
// actually type stays contiguous; the H1 and body copy keep the full state name either way.
const ABBREVIATION_FIRST = new Set(["PA", "GA", "SC", "MA", "CT", "KY", "NH", "WV", "DC", "NYC"]);

// Two states get searched under a form that is neither the spelled-out name nor the postal
// code: Washington almost always carries the word "state" (to separate it from Washington DC,
// worth ~6,100/mo across three variants), and Massachusetts is shortened to "Mass" (2,900/mo).
const ALT_PHRASING: Record<string, string> = {
  WA: "Washington searchers nearly always add the word state, to keep it apart from Washington DC. This is equally a Washington state paycheck calculator or a WA state paycheck calculator — same tool, same numbers.",
  MA: "Massachusetts gets shortened to Mass far more often than to its postal code. A Mass paycheck calculator, a Mass salary calculator and the MA version on this page are the same tool — the state writes its name out in full, but almost nobody searching for one does.",
};

// "{Place} Paycheck Calculator" has to survive as one unbroken phrase — it is the head term
// on every one of these pages — so the salary and abbreviation variants go after the dash.
function stateTitle(short: string, fullName: string) {
  const abbrevFirst = ABBREVIATION_FIRST.has(short);
  const lead = abbrevFirst ? short : fullName;
  const tail = abbrevFirst ? fullName : short;
  return `${lead} Paycheck Calculator 2026 – ${tail} Salary & Net Pay`;
}

function stateDescription(fullName: string, short: string, noTax: boolean) {
  // Kept inside 120-160 characters: the no-tax variant has to stay shorter because its
  // extra clause would otherwise push the longer state names past the truncation point.
  return noTax
    ? `${fullName} paycheck calculator for 2026: estimate take-home pay after federal tax and FICA. No ${short} income tax — free ${short} salary estimator.`
    : `${fullName} paycheck calculator for 2026: estimate take-home pay after federal tax, FICA and ${short} state income tax. Free ${short} salary and payroll estimator.`;
}


// Pages such as WV/NH target the abbreviation searchers actually use; `name` becomes the on-page label, `fullName` keeps the state name.
function pageLocation(slug:string){
  const loc=locationBySlug[slug];
  return loc?{...loc,name:loc.seoName??loc.name,fullName:loc.name}:undefined;
}

export function generateStaticParams(){
  return [
    ...locations.map(x=>({location:x.slug})),
    ...DYNAMIC_FREQUENCIES.map(f=>({location:f.slug})),
  ];
}

export async function generateMetadata({params}:{params:Promise<{location:string}>}):Promise<Metadata>{
  const {location}=await params;
  // Frequency page metadata
  const freq=frequencyBySlug[location];
  if(freq){
    const meta=frequencyMeta(freq);
    return{title:meta.title,description:meta.description,alternates:{canonical:`/${freq.slug}`},robots:{index:true,follow:true},openGraph:{title:meta.title,description:meta.description,url:meta.canonical,type:"website"}};
  }
  const p=pageLocation(location);
  if(!p)return{};
  const canonical=`/${p.slug}`;
  return{
    title:stateTitle(p.short,p.fullName),
    description:stateDescription(p.fullName,p.short,p.noTax===true),
    alternates:{canonical},
    robots:{index:NOINDEX_STATE_SLUGS.has(location)?false:true,follow:true},
    openGraph:{
      title:`${p.fullName} Paycheck Calculator 2026 – ${p.short} Take-Home Pay`,
      description:`Estimate ${p.name} take-home pay after taxes with transparent 2026 withholding assumptions. Works as a salary, hourly, and payroll estimator.`,
      url:canonical,
      type:"website"
    }
  };
}

export default async function LocationPage({params}:{params:Promise<{location:string}>}){
  const {location}=await params;
  // Frequency pages (weekly, semimonthly, monthly)
  const freq=frequencyBySlug[location];
  if(freq) return <FrequencyPageTemplate freq={freq}/>;
  const p=pageLocation(location);
  if(!p)notFound();
  const canonical=`https://www.paycheckscalculator.org/${p.slug}`;
  const noTax=p.noTax===true;
  const taxInfo=stateTaxInfo[p.short]||{type:"income tax",detail:`${p.name} imposes state income tax on wages.`,agency:`${p.name} Department of Revenue`};
  const ed=editorialByCode[p.short];
  const genericFaqs=buildFaqs(p.name,p.short,noTax,taxInfo.agency);
  const faqs=[...(ed?[genericFaqs[0],...ed.faqs]:genericFaqs),...buildSynonymFaqs(p.fullName,p.short)];

  const softwareSchema={"@context":"https://schema.org","@type":"SoftwareApplication",name:`${p.name} Paycheck Calculator`,url:canonical,applicationCategory:"FinanceApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},description:`Free ${p.name} paycheck calculator for 2026. Estimate your take-home pay after federal taxes, FICA, and ${noTax?"payroll deductions":`${p.name} state income tax`}.`};
  const faqSchema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))};
  const webPageSchema={"@context":"https://schema.org","@type":"WebPage",name:`${p.name} Paycheck Calculator 2026`,url:canonical,about:`Payroll tax calculation and take-home pay estimation for ${p.name} employees.`};

  const RelatedStates=getRelatedStates(p.short);

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(softwareSchema)}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(webPageSchema)}}/>
    <SiteHeader/>

    {/* Hero */}
    <section className="hero">
      <div className="eyebrow">2026 {p.short} PAYCHECK CALCULATOR</div>
      <h1>{p.name} Paycheck Calculator <em>2026</em></h1>
      <div className="hero-intro">
        {ed?<p>{ed.intro}</p>:<p>Use our free {p.name} paycheck calculator to estimate your take-home pay after federal taxes, Social Security, Medicare, and {noTax?"other payroll deductions":`${p.name} state income tax`}.</p>}
      </div>
      <PaycheckCalculator defaultState={p.short as SupportedState} navigateOnStateChange/>
      <div className="hero-more">
        {!ed&&(noTax?<p>{p.name} does not impose a state income tax on wages. However, your paycheck is still affected by federal tax withholding, FICA taxes, and any employee benefit deductions you select.</p>:<p>{p.name} imposes {taxInfo.type} on wages. Your actual take-home pay depends on your income level, filing status, allowances, and payroll deductions. Our calculator applies published 2026 withholding methods to provide a transparent estimate.</p>)}
        <p>Enter your salary information above to estimate your {p.name} paycheck based on your pay frequency, deductions, and payroll factors. The same tool doubles as a {p.name} salary calculator for annual pay, a {p.name} pay calculator for hourly wages, and a {p.name} payroll estimator for any pay schedule.</p>
      </div>
      <div className="trust-row"><span>2026 IRS Method</span><span>Source-Backed Calculations</span><span>Free to Use</span></div>
    </section>

    {/* What's Included */}
    <article className="long-seo">
      <p className="kicker">{p.short} PAYCHECK BREAKDOWN</p>
      <h2>What This {p.name} Paycheck Calculator Includes</h2>
      <section>
        {!ed&&<p>This {p.name} paycheck calculator estimates your net pay by considering the major payroll factors that affect your paycheck. The calculation includes:</p>}
        <ul className="checklist">
          <li>Federal income tax</li>
          <li>Social Security tax (6.2%)</li>
          <li>Medicare tax (1.45%)</li>
          {noTax?<li>No {p.name} state income tax</li>:<li>{p.name} state income tax</li>}
          <li>Pre-tax deductions</li>
          <li>Retirement contributions</li>
          <li>Employee benefits</li>
          <li>Pay frequency adjustments</li>
        </ul>
        {!ed&&<p style={{marginTop:20,color:"#667a8a",lineHeight:1.7,fontSize:14}}>The calculator is designed to help {p.name} employees understand the difference between gross pay and actual take-home pay. Whether you are paid weekly, biweekly, semimonthly, or monthly, this tool annualizes your wages, applies the relevant tax and deduction rules, and divides the result into your selected paycheck frequency.</p>}
      </section>
    </article>

    {/* Salary / pay / payroll / income calculator synonyms */}
    <article className="long-seo">
      <p className="kicker">{p.short} SALARY &amp; PAY CALCULATOR</p>
      <h2>{p.fullName} Salary Calculator, Pay Calculator, and Payroll Estimator</h2>
      <section>
        {ALT_PHRASING[p.short]&&<p>{ALT_PHRASING[p.short]}</p>}
        <p>People look for this tool under several names — a {p.fullName} paycheck calculator, a {p.fullName} salary calculator, a {p.fullName} pay calculator, a {p.fullName} payroll calculator, a {p.fullName} income calculator, or simply a {p.fullName} paycheck estimator. All of them describe the same job: turning a gross wage into the amount that actually reaches your bank account.</p>
        <p>One engine covers every case. Enter an annual figure and it behaves as a <strong>{p.name} salary calculator</strong>, dividing the year into weekly, biweekly, semimonthly, or monthly paychecks. Enter an hourly rate and your usual hours and it behaves as a <strong>{p.short} wage calculator</strong> — a {p.fullName} wage calculator — instead. Either way the output is identical: gross pay, every tax line, every deduction, and net pay.</p>
        <p>Used as a <strong>{p.short} tax calculator</strong> — or a {p.fullName} tax calculator, the same thing — it separates the {noTax?`federal tax and FICA lines so you can see exactly what leaves a ${p.name} paycheck even without a state income tax`:`${p.name} state income tax line from federal tax and FICA, so you can see exactly how much ${p.name} withholding costs you each pay period`}. Keep in mind that paycheck withholding follows the 2026 payroll method your employer applies, which can land slightly above or below the tax you finally owe on an annual return.</p>
      </section>
    </article>

    {/* State Tax Section */}
    <article className="long-seo">
      <p className="kicker">{p.short} TAX INFORMATION</p>
      <h2>{noTax?`Does ${p.name} Have State Income Tax?`:`How Does ${p.name} State Income Tax Work?`}</h2>
      <section>
        {ed?<p>{ed.taxSummary}</p>:noTax?<>
          <p><strong>{p.name} does not impose an individual state income tax on wages.</strong> This means employees working in {p.name} do not have state income tax deducted from their paycheck.</p>
          <p>However, {p.name} employees may still have other payroll deductions, including:</p>
          <ul className="checklist">
            <li>Federal income tax</li>
            <li>Social Security tax</li>
            <li>Medicare tax</li>
            <li>Employer benefit deductions</li>
            <li>Retirement contributions</li>
          </ul>
          <p style={{color:"#667a8a",lineHeight:1.7,fontSize:14,marginTop:16}}>Although {p.name} has no state income tax, your final paycheck amount depends on federal tax rules, your W-4 elections, and your personal payroll situation. States without income tax can be more tax-friendly for employees, but federal obligations still apply to all U.S. workers.</p>
        </>:<>
          <p><strong>{p.name} imposes {taxInfo.type} on wages.</strong> {taxInfo.detail} Your employer withholds {p.name} income tax from each paycheck based on your earnings, filing status, and the information you provide on your state withholding certificate.</p>
          <p>In addition to state income tax, {p.name} employees also have these deductions from their paycheck:</p>
          <ul className="checklist">
            <li>Federal income tax</li>
            <li>Social Security tax</li>
            <li>Medicare tax</li>
            <li>{p.name} state income tax</li>
            <li>Employee benefit deductions</li>
          </ul>
          <p style={{color:"#667a8a",lineHeight:1.7,fontSize:14,marginTop:16}}>{p.name} state income tax withholding is separate from federal income tax. The amount withheld depends on your state withholding form elections, income level, and any applicable exemptions or deductions under {p.name} law. Unlike federal tax, {p.name} tax rules may have different brackets, standard deductions, and credit provisions.</p>
        </>}
      </section>
    </article>

    {/* Original SourceBackedGuide + StateEditorial */}
    <SourceBackedGuide place={p} editorial={ed}/>

    {/* Gross Pay vs Net Pay + Why Results May Differ — covered by the per-state editorial when present */}
    {!ed&&<>
    <article className="long-seo">
      <p className="kicker">GROSS VS NET</p>
      <h2>Understanding Your {p.name} Gross Pay and Take-Home Pay</h2>
      <section>
        <p><strong>Gross pay</strong> is the total amount you earn before any taxes or deductions are applied. For salaried employees, this is your annual salary divided by the number of pay periods. For hourly workers, it is your hourly rate multiplied by hours worked.</p>
        <p><strong>Net pay</strong>, also called take-home pay, is the amount remaining after required taxes and payroll deductions are removed from your gross pay. This is the amount that typically appears on your paycheck and is deposited into your bank account.</p>
        <p>For {p.name} employees, the difference between gross pay and net pay is mainly affected by:{noTax?" federal income tax, Social Security, Medicare, and any personal deductions such as retirement contributions or health insurance premiums.":` federal income tax, ${p.name} state income tax, Social Security, Medicare, and any personal deductions such as retirement contributions or health insurance premiums.`} Understanding this difference can help you budget more effectively and compare job offers on a take-home basis rather than just the salary number.</p>
      </section>
    </article>

    <article className="long-seo">
      <p className="kicker">IMPORTANT NOTE</p>
      <h2>Why Your Actual {p.name} Paycheck May Be Different</h2>
      <section>
        <p>Your actual paycheck from an employer may differ from this estimate because payroll calculations depend on individual circumstances. Factors that may affect your final paycheck include:</p>
        <ul className="checklist">
          <li>Multiple jobs or income sources</li>
          <li>W-4 credits or additional withholding</li>
          <li>Bonuses and commissions</li>
          <li>Overtime and tips</li>
          <li>Benefit eligibility changes</li>
          <li>Year-to-date Social Security wage caps</li>
          <li>Employer payroll rounding</li>
          <li>Retirement contribution limits</li>
        </ul>
        <p style={{color:"#667a8a",lineHeight:1.7,fontSize:14,marginTop:16}}>This calculator provides an estimate for planning purposes. For official payroll amounts, refer to your pay stub or consult your employer's payroll department. Tax situations vary, and this tool does not replace professional tax advice.</p>
      </section>
    </article>

    </>}

    {/* State FAQ */}
    <div className="faq">
      <p className="kicker" style={{textAlign:"center"}}>FREQUENTLY ASKED QUESTIONS</p>
      <h2>{p.name} Paycheck Calculator FAQ</h2>
      {faqs.map((f,i)=><details key={i}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}
    </div>

    {/* Related States */}
    <article className="long-seo">
      <p className="kicker">EXPLORE OTHER STATES</p>
      <h2>Paycheck Calculators by State</h2>
      <section>
        <div className="tool-links">
          {RelatedStates.map((s,i)=><a key={s.slug} href={`/${s.slug}`}><b>{s.name} {i%3===1?"Salary Calculator":i%3===2?"Pay Calculator":"Paycheck Calculator"}</b><span>Estimate your {s.name} take-home pay →</span></a>)}
        </div>
      </section>
    </article>

    {/* Methodology + Sources */}
    <article className="long-seo">
      <p className="kicker">CALCULATION SOURCES</p>
      <h2>How We Calculate Your {p.name} Paycheck</h2>
      <section>
        <p>Wages are annualized for the selected pay frequency, reduced by eligible pre-tax deductions, then run through the 2026 IRS federal withholding method, FICA, and {noTax?`no ${p.name} state withholding`:`the published 2026 ${p.name} state withholding method`} before being converted back to one paycheck. The full step list and every source are on the <a className="text-link" href="/methodology">methodology page</a>.</p>
      </section>
      <section>
        <h3>{p.name} Tax Information Sources</h3>
        <p>IRS, Social Security Administration, and {taxInfo.agency}.</p>
      </section>
      <div className="reviewer">
        <p><span className="reviewer-label">Reviewed by:</span> Paycheck Calculator Editorial Team</p>
        <p><small>Last Updated: August 2026</small></p>
      </div>
    </article>

    {/* Disclaimer */}
    <div className="seo-disclaimer" style={{maxWidth:920,margin:"0 auto 40px"}}>
      <p><strong>Disclaimer:</strong> This {p.name} paycheck calculator provides estimates for informational purposes only. Actual paycheck amounts may vary based on employer payroll systems, benefits, deductions, tax changes, filing status, and individual financial circumstances. For specific tax advice, consult a qualified tax professional.</p>
    </div>

    <SiteFooter/>
  </main>;
}

// ── State Tax Info ────────────────────────────────────────────
const stateTaxInfo:Record<string,{type:string;detail:string;agency:string}>={
  AL:{type:"graduated income tax (2%–5%)",detail:"Alabama uses graduated individual income-tax brackets. Some municipalities also impose occupational taxes that can affect your paycheck.",agency:"Alabama Department of Revenue"},
  AZ:{type:"a flat income tax (2.5%)",detail:"Arizona uses a flat state income-tax rate. Employees elect a withholding percentage on Form A-4, which may differ from their final annual tax liability.",agency:"Arizona Department of Revenue"},
  AR:{type:"graduated income tax (2%–4.4%)",detail:"Arkansas uses graduated individual income-tax brackets. The withholding amount depends on your income level and state withholding elections.",agency:"Arkansas Department of Finance and Administration"},
  CO:{type:"a flat income tax (4.4%)",detail:"Colorado uses a flat individual income-tax rate. Paid family and medical leave (FAMLI) contributions may also appear separately on your paycheck.",agency:"Colorado Department of Revenue"},
  CT:{type:"graduated income tax (3%–6.99%)",detail:"Connecticut uses graduated income-tax brackets. Employees must select a CT-W4 withholding code, and paid-leave contributions may appear as a separate payroll line.",agency:"Connecticut Department of Revenue Services"},
  GA:{type:"a flat income tax (5.39%)",detail:"Georgia uses a flat individual income-tax structure. Payroll results can vary with allowances, deductions, and credits claimed on Form G-4.",agency:"Georgia Department of Revenue"},
  HI:{type:"graduated income tax (1.4%–11%)",detail:"Hawaii uses graduated income-tax brackets with rates that increase with income. State-specific withholding tables apply.",agency:"Hawaii Department of Taxation"},
  ID:{type:"a flat income tax (5.8%)",detail:"Idaho uses a flat individual income-tax rate. Withholding is affected by your Idaho Form ID W-4 elections and allowances.",agency:"Idaho State Tax Commission"},
  IN:{type:"a flat state income tax (3.05%) plus county tax",detail:"Indiana uses a flat state income tax, and most counties impose an additional county income tax based on your residence or work location.",agency:"Indiana Department of Revenue"},
  IA:{type:"a flat income tax (3.8%)",detail:"Iowa uses a flat income-tax rate. Taxable wages and withholding elections on Form IA W-4 affect the amount withheld from each paycheck.",agency:"Iowa Department of Revenue"},
  KS:{type:"graduated income tax (3.1%–5.7%)",detail:"Kansas uses graduated income-tax brackets. State-specific withholding tables and Form K-4 elections determine the withholding amount.",agency:"Kansas Department of Revenue"},
  KY:{type:"a flat income tax (4%)",detail:"Kentucky uses a flat state income tax. Some cities and counties also impose occupational or payroll taxes that may appear on your paycheck.",agency:"Kentucky Department of Revenue"},
  LA:{type:"graduated income tax (1.85%–4.25%)",detail:"Louisiana uses graduated income-tax brackets. State-specific withholding rules and Form L-4 elections apply.",agency:"Louisiana Department of Revenue"},
  MD:{type:"graduated state income tax plus county tax",detail:"Maryland combines graduated state income tax with county-level income tax. Your county of residence significantly affects your total withholding amount.",agency:"Comptroller of Maryland"},
  MA:{type:"a flat income tax (5%) plus high-earner surtax",detail:"Massachusetts generally uses a flat wage-tax rate of 5%, with an additional 4% surtax applying to income above $1 million.",agency:"Massachusetts Department of Revenue"},
  MI:{type:"a flat income tax (4.25%)",detail:"Michigan uses a flat state income tax. Certain cities, including Detroit, impose separate city income taxes that may affect your paycheck.",agency:"Michigan Department of Treasury"},
  MN:{type:"graduated income tax (5.35%–9.85%)",detail:"Minnesota uses graduated withholding brackets. The 2026 Paid Leave program premium may also be separately withheld from your paycheck.",agency:"Minnesota Department of Revenue"},
  MO:{type:"graduated income tax (2%–4.95%)",detail:"Missouri uses graduated income-tax brackets. Kansas City and St. Louis also impose earnings taxes that can affect workers in those cities.",agency:"Missouri Department of Revenue"},
  NC:{type:"a flat income tax (4.09%)",detail:"North Carolina uses a flat income-tax rate of 4.09%, which includes a 0.1% withholding adjustment. Standard deductions and allowances reduce taxable wages.",agency:"North Carolina Department of Revenue"},
  NE:{type:"graduated income tax (2.46%–5.84%)",detail:"Nebraska uses graduated income-tax brackets. State withholding tables and Form W-4N elections determine the amount withheld.",agency:"Nebraska Department of Revenue"},
  NV:{type:"no state income tax",detail:"",agency:"Nevada Department of Taxation"},
  NH:{type:"no tax on wages",detail:"",agency:"New Hampshire Department of Revenue Administration"},
  NM:{type:"graduated income tax (1.5%–5.9%)",detail:"New Mexico uses graduated income-tax brackets from 1.5% to 5.9%. Withholding follows the FYI-104 percentage tables for the filing status on your federal Form W-4.",agency:"New Mexico Taxation and Revenue Department"},
  NY:{type:"graduated income tax (4%–10.9%)",detail:"New York uses graduated income-tax brackets. New York City and Yonkers residents may also face additional local income tax withholding.",agency:"New York State Department of Taxation and Finance"},
  NYC:{type:"New York City resident income tax (3.078%–3.876%) plus NY state tax",detail:"New York City residents pay New York State income tax plus New York City resident income tax. Both are withheld from your paycheck.",agency:"New York State Department of Taxation and Finance"},
  OH:{type:"graduated income tax plus local taxes",detail:"Ohio uses graduated income-tax brackets, and many municipalities and school districts impose separate local income taxes that affect your paycheck.",agency:"Ohio Department of Taxation"},
  OK:{type:"graduated income tax (0.25%–4.5%)",detail:"Oklahoma uses graduated income-tax brackets. State-specific withholding tables and Form OK-W-4 elections apply.",agency:"Oklahoma Tax Commission"},
  OR:{type:"graduated income tax (4.75%–9.9%)",detail:"Oregon uses graduated income-tax brackets with a top rate of 9.9%. Statewide transit tax and paid-leave contributions may appear separately.",agency:"Oregon Department of Revenue"},
  PA:{type:"a flat income tax (3.07%)",detail:"Pennsylvania uses a flat state income tax of 3.07%. Municipalities and school districts may also impose local earned-income taxes.",agency:"Pennsylvania Department of Revenue"},
  RI:{type:"graduated income tax (3.75%–5.99%)",detail:"Rhode Island uses graduated income-tax brackets. State withholding is based on Form RI W-4 elections and income level.",agency:"Rhode Island Division of Taxation"},
  SC:{type:"graduated income tax (0%–6.2%)",detail:"South Carolina uses graduated income-tax brackets with the top rate of 6.2%. Allowances and standard deductions reduce taxable wages.",agency:"South Carolina Department of Revenue"},
  TN:{type:"no state income tax on wages",detail:"",agency:"Tennessee Department of Revenue"},
  UT:{type:"a flat income tax (4.55%)",detail:"Utah uses a flat income-tax rate. State withholding depends on your Form W-4 elections and applicable tax credits.",agency:"Utah State Tax Commission"},
  VA:{type:"graduated income tax (2%–5.75%)",detail:"Virginia uses graduated income-tax brackets. State-specific withholding tables and Form VA-4 elections determine the amount withheld.",agency:"Virginia Department of Taxation"},
  WA:{type:"no state income tax on wages",detail:"But Washington employers may withhold paid family and medical leave premiums and long-term care (WA Cares) contributions.",agency:"Washington State Department of Revenue"},
  WI:{type:"graduated income tax (3.5%–7.65%)",detail:"Wisconsin uses graduated income-tax brackets. State-specific withholding tables and Form WT-4 elections apply.",agency:"Wisconsin Department of Revenue"},
  WV:{type:"graduated income tax (2.11%–4.58%)",detail:"West Virginia uses five graduated brackets, cut again for 2026 by Senate Bill 392 to 2.11%–4.58%. Withholding is based on Form WV/IT-104 exemptions.",agency:"West Virginia Tax Division"},
  MT:{type:"graduated income tax (4.7%–5.65%)",detail:"Montana uses two brackets for 2026 — 4.7% and a top rate lowered to 5.65% by House Bill 337 — and the 2026 withholding formula keys off the filing status marked on Form MW-4.",agency:"Montana Department of Revenue"},
  ND:{type:"graduated income tax (0%–2.5%)",detail:"North Dakota has a wide zero bracket, then 1.95% and 2.5% rates. Withholding uses the filing status on your federal Form W-4.",agency:"North Dakota Office of State Tax Commissioner"},
  DE:{type:"graduated income tax (2.2%–6.6%)",detail:"Delaware uses graduated income-tax brackets. State withholding tables and Form W-4 elections apply.",agency:"Delaware Division of Revenue"},
  DC:{type:"graduated income tax (4%–10.75%)",detail:"The District of Columbia uses seven graduated income-tax brackets from 4% to 10.75%. DC withholding is based on Form D-4 allowances.",agency:"DC Office of Tax and Revenue"},
  VT:{type:"graduated income tax (3.35%–8.75%)",detail:"Vermont uses graduated income-tax brackets. State withholding is based on Form W-4VT elections.",agency:"Vermont Department of Taxes"},
  ME:{type:"graduated income tax (5.8%–7.15%)",detail:"Maine uses graduated income-tax brackets. State withholding is based on Form W-4ME elections.",agency:"Maine Revenue Services"},
  MS:{type:"a flat income tax (4.0% on taxable income over $10,000)",detail:"Mississippi taxes wages at a flat 4.0% for 2026 after a $10,000 zero bracket, the standard deduction, and the exemption amount claimed on Form 89-350.",agency:"Mississippi Department of Revenue"},
  AK:{type:"no state income tax on wages",detail:"",agency:"Alaska Department of Revenue"},
  SD:{type:"no state income tax on wages",detail:"",agency:"South Dakota Department of Revenue"},
  WY:{type:"no state income tax on wages",detail:"",agency:"Wyoming Department of Revenue"},
};

// ── FAQ Generator ─────────────────────────────────────────────
function buildFaqs(name:string,code:string,noTax:boolean,agency:string):{q:string;a:string}[]{
  const faqs:{q:string;a:string}[]=[];
  if(noTax){
    faqs.push({q:`Does ${name} have state income tax?`,a:`No. ${name} does not impose an individual state income tax on wages. ${name} employees still pay federal income tax, Social Security tax, and Medicare tax through payroll withholding.`});
  }else{
    faqs.push({q:`Does ${name} have state income tax?`,a:`Yes. ${name} imposes state income tax on wages. The amount withheld from your paycheck depends on your income level, filing status, and the elections on your state withholding certificate. ${name} income tax is separate from federal income tax.`});
  }
  faqs.push({q:`How much is my paycheck after taxes in ${name}?`,a:`Your ${name} take-home pay depends on your salary, pay frequency, federal tax withholding, ${noTax?"":`${name} state income tax withholding, `}Social Security, Medicare, retirement contributions, health benefits, and other payroll deductions. Use the calculator above to enter your specific information for an estimate.`});
  faqs.push({q:`Is ${name} a tax-friendly state for employees?`,a:noTax?`${name} can be tax-friendly for employees because there is no state income tax on wages. However, federal taxes and other payroll deductions still apply to all U.S. employees.`:`${name} employees pay state income tax in addition to federal taxes. Whether ${name} is tax-friendly depends on your income level and how ${name}'s tax brackets compare to other states. Use the calculator to compare your take-home pay across states.`});
  faqs.push({q:`How accurate is the ${name} paycheck calculator?`,a:`The ${name} paycheck calculator provides an estimate based on the information you enter and published 2026 withholding methods. Actual paychecks may differ because of employer payroll systems, benefit elections, year-to-date wage caps, bonus treatment, and individual tax circumstances. For official amounts, refer to your pay stub.`});
  faqs.push({q:`What deductions are taken from a ${name} paycheck?`,a:noTax?`A ${name} paycheck typically includes deductions for federal income tax, Social Security tax (6.2%), Medicare tax (1.45%), and any employee benefit deductions such as health insurance, retirement contributions, and flexible spending accounts. ${name} does not deduct state income tax from wages.`:`A ${name} paycheck typically includes deductions for federal income tax, ${name} state income tax, Social Security tax (6.2%), Medicare tax (1.45%), and any employee benefit deductions such as health insurance, retirement contributions, and flexible spending accounts.`});
  return faqs;
}

// ── Synonym FAQs ─────────────────────────────────────────────
// Searchers reach these pages through several head terms — "salary calculator",
// "pay calculator", "payroll calculator", "income calculator", "paycheck estimator".
// These entries answer each phrasing on-page instead of spawning near-duplicate URLs.
// Questions alternate between the spelled-out name and the postal code on purpose: searchers
// use both, and the abbreviated forms ("pa tax calculator", "nj income tax calculator",
// "paycheck estimator ma") were not on the page in any form before.
function buildSynonymFaqs(name:string,short:string):{q:string;a:string}[]{
  return [
    {q:`Is this the same as a ${name} salary calculator?`,a:`Yes. Enter your annual salary and the calculator works as a ${name} salary calculator, splitting the year into weekly, biweekly, semimonthly, or monthly paychecks and showing take-home pay for each one. A ${name} paycheck calculator and a ${name} salary calculator are the same tool viewed from either end — one starts from the yearly number, the other from the per-check number.`},
    {q:`Can I use this as a ${short} payroll calculator or a ${short} pay calculator?`,a:`Yes. The calculator applies the same 2026 payroll rules an employer uses — federal withholding, Social Security, Medicare, state withholding where it applies, and pre-tax deductions — so it works as a ${short} payroll calculator for checking a pay stub and as a ${short} pay calculator for hourly wages. It is an estimate for planning, not a payroll system of record.`},
    {q:`Is this a ${short} income calculator or a ${short} income tax calculator?`,a:`For paycheck withholding, yes: it shows the ${name} state income tax and federal income tax taken out of each check separately. It is not a full annual return calculator, so it does not model itemized deductions, credits, or non-wage income. Use it to see what is withheld per pay period, and a return-focused tool for your final tax liability.`},
    {q:`How do I use this as a ${short} paycheck estimator?`,a:`Enter your gross pay, pick your pay frequency, set your filing status, and add any retirement or pre-tax benefit amounts. The ${short} paycheck estimator returns gross pay, each tax and deduction line, and the net amount deposited. Change one input at a time to see how a raise, a new W-4, or a higher 401(k) percentage moves your take-home pay.`},
  ];
}

// ── Related States ───────────────────────────────────────────
function getRelatedStates(currentShort:string):{slug:string;name:string}[]{
  const priority=["CA","TX","FL","NY","NJ","IL","PA","GA","OH","NC","VA","WA","MA","MI","AZ","CO","MN","WI","MO","IN","TN","MD","OR","SC","AL","CT","LA","KY","OK","IA","KS","AR","NV","UT","NM","NE","HI","ID","RI","NH","ME","MT","ND","VT","DE","MS","AK","SD","WV","WY","DC"];
  const nameMap:Record<string,string>={CA:"California",TX:"Texas",FL:"Florida",NY:"New York",NJ:"New Jersey",IL:"Illinois",PA:"Pennsylvania",GA:"Georgia",OH:"Ohio",NC:"North Carolina",VA:"Virginia",WA:"Washington",MA:"Massachusetts",MI:"Michigan",AZ:"Arizona",CO:"Colorado",MN:"Minnesota",WI:"Wisconsin",MO:"Missouri",IN:"Indiana",TN:"Tennessee",MD:"Maryland",OR:"Oregon",SC:"South Carolina",AL:"Alabama",CT:"Connecticut",LA:"Louisiana",KY:"Kentucky",OK:"Oklahoma",IA:"Iowa",KS:"Kansas",AR:"Arkansas",NV:"Nevada",UT:"Utah",NM:"New Mexico",NE:"Nebraska",HI:"Hawaii",ID:"Idaho",RI:"Rhode Island",NH:"New Hampshire",ME:"Maine",MT:"Montana",ND:"North Dakota",VT:"Vermont",DE:"Delaware",MS:"Mississippi",AK:"Alaska",SD:"South Dakota",WV:"West Virginia",WY:"Wyoming",DC:"District of Columbia"};
  const slugMap:Record<string,string>={CA:"california-paycheck-calculator",TX:"texas-paycheck-calculator",FL:"florida-paycheck-calculator",NY:"new-york-paycheck-calculator",NJ:"new-jersey-paycheck-calculator",IL:"illinois-paycheck-calculator",PA:"pennsylvania-paycheck-calculator",GA:"georgia-paycheck-calculator",OH:"ohio-paycheck-calculator",NC:"north-carolina-paycheck-calculator",VA:"virginia-paycheck-calculator",WA:"washington-paycheck-calculator",MA:"massachusetts-paycheck-calculator",MI:"michigan-paycheck-calculator",AZ:"arizona-paycheck-calculator",CO:"colorado-paycheck-calculator",MN:"minnesota-paycheck-calculator",WI:"wisconsin-paycheck-calculator",MO:"missouri-paycheck-calculator",IN:"indiana-paycheck-calculator",TN:"tennessee-paycheck-calculator",MD:"maryland-paycheck-calculator",OR:"oregon-paycheck-calculator",SC:"south-carolina-paycheck-calculator",AL:"alabama-paycheck-calculator",CT:"connecticut-paycheck-calculator",LA:"louisiana-paycheck-calculator",KY:"kentucky-paycheck-calculator",OK:"oklahoma-paycheck-calculator",IA:"iowa-paycheck-calculator",KS:"kansas-paycheck-calculator",AR:"arkansas-paycheck-calculator",NV:"nevada-paycheck-calculator",UT:"utah-paycheck-calculator",NM:"new-mexico-paycheck-calculator",NE:"nebraska-paycheck-calculator",HI:"hawaii-paycheck-calculator",ID:"idaho-paycheck-calculator",RI:"rhode-island-paycheck-calculator"};
  return priority.filter(c=>c!==currentShort).slice(0,8).map(c=>({slug:slugMap[c]||`${nameMap[c]?.toLowerCase().replace(/\s/g,"-")}-paycheck-calculator`,name:nameMap[c]||c}));
}

// ── Reusable components ──────────────────────────────────────
function SourceBackedGuide({place:p,editorial}:{place:(typeof locations)[number];editorial?:StateEditorialCopy}){
  return <article className="long-seo">
    <p className="kicker">{p.short} 2026 WITHHOLDING METHOD</p>
    <h2>How the {p.name} paycheck estimate works</h2>
    <section>
      <h3>What the {p.name} paycheck calculator estimates</h3>
      <p>{stateNotes[p.short]||`${p.name} imposes state income tax rules that affect paycheck withholding.`} The calculator applies the published 2026 state method in addition to IRS federal withholding and FICA. State payroll premiums are displayed separately from state income tax where applicable.</p>
    </section>
    {!editorial&&<section>
      <h3>Paycheck inputs to verify</h3>
      <p>Use taxable annual wages, pay frequency, federal filing status, the state-specific allowances or exemptions shown on your current certificate, retirement contributions, eligible pre-tax benefits, and additional federal withholding. Connecticut users should select the exact CT-W4 code or the no-form fallback. Arizona uses the elected A-4 percentage. Georgia, Utah, and Ohio require a 2026 paycheck or pay-period date because their methods change during the year. A recent pay stub provides the best starting values.</p>
    </section>}
    <StateEditorial code={p.short}/>
    {editorial?.sections.map(sec=><section key={sec.h3}><h3>{sec.h3}</h3><p>{sec.p}</p></section>)}
    <section>
      <h3>What the paycheck estimate excludes</h3>
      {editorial?<p>Reciprocity, nonresident rules, multiple jobs, credits, garnishments, and year-to-date wage history are not modeled; the <a className="text-link" href="/methodology">methodology page</a> lists every exclusion.</p>:<p>Address-specific local income taxes are included only when you enter a planning rate. New York City is a resident calculator, not a calculator for nonresident commuters. Reciprocity, nonresident rules, multiple-job adjustments, credits, employer-paid premium choices, special exemptions, garnishments, and year-to-date wage history may still change an actual paycheck. Review the <a className="text-link" href="/methodology">methodology and official source list</a> before relying on the estimate.</p>}
    </section>
    <div className="tool-links">
      <a href="/hourly-paycheck-calculator"><b>Hourly paycheck calculator</b><span>Include regular and overtime hours →</span></a>
      <a href="/biweekly-paycheck-calculator"><b>Biweekly paycheck calculator</b><span>Estimate one of 26 yearly checks →</span></a>
      <a href="/how-much-tax-is-taken-from-my-paycheck"><b>Paycheck tax guide</b><span>Understand every deduction →</span></a>
      <a href="/methodology"><b>Calculation methodology</b><span>Review assumptions and official sources →</span></a>
    </div>
  </article>;
}

function StateEditorial({code}:{code:string}){
  if(code==="CA")return <>
    <section><h3>California DE 4, federal W-4, and allowances</h3><p>A California paycheck uses two separate withholding elections. Form W-4 controls federal withholding, while Form DE 4 supplies California filing status, regular withholding allowances, estimated deductions, and any additional state amount. The "state allowances" field in this calculator models regular California allowances; it does not copy federal dependents or credits into the state calculation. When an employee does not submit a valid DE 4, payroll may apply default California withholding rules. Use the elections on the latest DE 4 rather than guessing from federal filing status.</p></section>
    <section><h3>California income tax and SDI are different deductions</h3><p>The California paycheck calculator reports state income-tax withholding separately from State Disability Insurance. Income-tax withholding uses the 2026 EDD Method B annual calculation with graduated brackets, a low-income exemption test, a standard deduction, and an allowance credit. SDI is an employee payroll contribution calculated on covered wages. Keeping these lines separate makes the result easier to compare with a pay stub and prevents a user from mistaking SDI for California income tax.</p></section>
    <section><h3>Salary, hourly, weekly, and biweekly California pay</h3><p>For salary income, enter annual gross wages and choose the employer's actual pay schedule. Weekly payroll has 52 checks, biweekly payroll usually has 26, semimonthly payroll has 24, and monthly payroll has 12. An hourly California worker can use the <a className="text-link" href="/hourly-paycheck-calculator">hourly paycheck calculator</a> to include regular hours and time-and-a-half overtime. The tool annualizes those earnings before applying federal and California withholding, then divides the result back into the selected paycheck frequency.</p></section>
    <section><h3>How 401(k) and pre-tax benefits affect a California paycheck</h3><p>A traditional 401(k) contribution generally reduces federal and California income-tax wages, but it normally does not remove the same dollars from Social Security and Medicare wages. Health, HSA, FSA, commuter, and cafeteria-plan deductions can have different payroll-tax treatment. The compact calculator treats the entered retirement percentage and other pre-tax amount as planning inputs, so compare the tax treatment against the boxes and deduction codes on a current pay stub.</p></section>
    <section><h3>Los Angeles, San Francisco, San Diego, and Sacramento</h3><p>California cities generally do not impose a broad local wage income tax comparable with New York City's resident income tax. A paycheck in Los Angeles, San Francisco, San Diego, or Sacramento can still differ because of local minimum-wage rules, employer benefits, commuter deductions, union dues, garnishments, and industry-specific payroll items. The city name therefore changes employment context but does not create a separate city income-tax line in this calculator.</p></section>
    <section><h3>Worked California planning examples</h3><p>A $50,000, $75,000, or $100,000 salary will not have one universal take-home amount. Filing status, DE 4 allowances, 401(k) percentage, health deductions, frequency, and extra withholding all change the check. To compare salaries, keep every selection constant and change only annual gross pay. To compare benefit elections, keep salary constant and test retirement or pre-tax deductions one at a time. This produces a useful side-by-side planning result without presenting one sample as a guaranteed paycheck.</p></section>
    <section><h3>Why an actual California paycheck can differ</h3><p>Common causes include a DE 4 election that does not match the calculator, W-4 Step 2 or Step 3 entries, supplemental wage treatment for bonuses, taxable fringe benefits, irregular overtime, a deduction that remains subject to FICA, year-to-date wage caps, retroactive pay, and employer payroll rounding. Check taxable gross wages rather than total gross wages when reconciling the result, and compare California income tax and SDI as separate lines.</p></section>
  </>;
  if(code==="NJ")return <>
    <section><h3>NJ-W4 and federal W-4 serve different purposes</h3><p>New Jersey withholding does not simply reuse federal W-4 elections. An employee may need Form NJ-W4 to select a New Jersey rate table, exemptions, and additional withholding that better reflect household circumstances. This calculator uses filing status and state allowances to create a transparent graduated-rate estimate, but it does not reproduce every NJ-W4 rate-selection path. Use a current NJ-W4 and pay stub when reconciling payroll.</p></section>
    <section><h3>New Jersey income tax and benefit contributions</h3><p>A New Jersey paycheck can contain state income-tax withholding plus separate employee contributions for programs such as temporary disability, family leave, unemployment, or workforce development. Those programs can have annual wage bases and rates that change. The current compact engine estimates New Jersey income tax and does not claim to reproduce every employer contribution line; review the official source list and the labeled deductions on the employee's pay stub.</p></section>
    <section><h3>Hourly, salary, and biweekly New Jersey pay</h3><p>Enter annual salary for a salaried position or use the <a className="text-link" href="/hourly-paycheck-calculator">hourly paycheck calculator</a> when regular and overtime hours matter. Choose biweekly only when the employer issues 26 checks per year; semimonthly means 24 checks. Selecting the wrong schedule changes gross pay per check and the way annual deductions are allocated, even when annual salary is unchanged.</p></section>
    <section><h3>Traditional 401(k) and other deductions</h3><p>Traditional retirement contributions may lower federal and New Jersey income-tax wages while remaining subject to Social Security and Medicare. Health and cafeteria-plan deductions may receive different treatment. Enter recurring amounts consistently and compare the estimated taxable wages with an actual pay stub. Roth 401(k) contributions are generally after-tax and should not be entered as a pre-tax percentage.</p></section>
    <section><h3>New Jersey versus New York and New York City</h3><p>Where work is performed and where the employee resides can both matter. A New Jersey resident working in New York may see New York withholding and later address resident-state credits on tax returns. New York City resident tax applies based on NYC residency, not merely commuting into the city. This New Jersey paycheck calculator does not model multistate credits, reciprocity, or NYC resident tax, so cross-border workers should compare both payroll forms and seek individual guidance when needed.</p></section>
    <section><h3>How to troubleshoot a New Jersey paycheck estimate</h3><p>First confirm pay frequency and taxable gross wages. Then compare federal W-4 status, NJ-W4 elections, exemptions, additional state withholding, retirement contributions, health deductions, and any separate state benefit-program lines. Bonuses, commissions, stock compensation, retroactive wages, garnishments, and year-to-date wage limits can also create a material difference. A mismatch does not necessarily mean the calculator or payroll is wrong; it often means the two calculations are using different inputs.</p></section>
  </>;
  if(code==="SC")return <>
    <section><h3>South Carolina 2026 withholding formula</h3><p>The engine follows SCDOR Form WH-1603F. When one or more SC W-4 allowances are claimed, taxable annual wages are reduced by $5,000 per allowance and a standard deduction equal to 10% of gross wages, capped at $7,500. Zero allowances receive neither reduction. Taxable income then uses the official 0%, 3%, and 6% subtraction-method brackets.</p></section>
    <section><h3>SC W-4 inputs and limitations</h3><p>Use the number of South Carolina allowances actually claimed, not federal dependents. The estimate does not include extra South Carolina withholding because the compact form currently provides one extra federal field. Nonresident work arrangements, special exemptions, bonuses, multiple jobs, and changes made after a payroll cutoff can produce a different check.</p></section>
  </>;
  if(code==="OK")return <>
    <section><h3>Oklahoma 2026 withholding brackets and OK-W-4 allowances</h3><p>The engine follows the Oklahoma Tax Commission 2026 percentage method (Packet OW-2). Annual wages are reduced by $1,000 for each OK-W-4 allowance, then taxed at 0% up to $10,100, 2.5% to $11,250, 3.5% to $13,550, and 4.5% above that for single employees; married thresholds are exactly double ($20,200, $22,500, and $27,100). Oklahoma HB 2764 lowered the top rate from 4.75% to 4.5% starting with tax year 2026, and the withholding tables reflect that change.</p>
      <figure className="bracket-figure"><picture><img src="/images/states/oklahoma-2026-withholding-brackets.svg" alt="Oklahoma paycheck calculator 2026 state withholding brackets: single and married percentage-method rates from 0% to 4.5%" width="880" height="400" loading="lazy" decoding="async"/></picture><figcaption>Oklahoma 2026 annual withholding brackets as applied by this paycheck calculator. Source: Oklahoma Tax Commission Packet OW-2.</figcaption></figure></section>
    <section><h3>Oklahoma paycheck withholding for married employees</h3><p>A married employee who checks the OK-W-4 box to withhold at the higher Single rate is taxed on the single table, which reaches 4.5% at $13,550 instead of $27,100. Use that toggle when both spouses work and want extra state withholding. Any additional Oklahoma dollar amount entered per paycheck is added after the table calculation, and the final per-paycheck figure is rounded to the whole dollar the way the OTC tables are published.</p></section>
  </>;
  if(code==="NC")return <>
    <section><h3>North Carolina 2026 annualized method</h3><p>The engine follows NCDOR Form NC-30. It subtracts the published $12,750 standard deduction for single or married employees, or $19,125 for head of household, plus $2,500 for each state allowance. The remaining annualized wages are multiplied by the 2026 withholding rate of 4.09%, which consists of the 3.99% individual income-tax rate plus the published 0.1% withholding adjustment.</p></section>
    <section><h3>NC-4 elections and payroll rounding</h3><p>Use allowances from a current Form NC-4 or NC-4 EZ. NCDOR instructs employers to round final per-paycheck withholding under its percentage and annualized methods, so an employer result may differ by small rounding amounts from the annual planning total shown here. Supplemental wages, nonresident rules, pension payments, and extra withholding require separate treatment.</p></section>
  </>;
  return null;
}

const stateNotes:Record<string,string>={
 AK:"Alaska has no individual income tax, so a paycheck is reduced only by federal income tax, FICA, and any benefit deductions.",DE:"Delaware withholding annualizes wages, subtracts a standard deduction, applies graduated rates up to 6.6%, then subtracts a $110 credit for each exemption claimed on Form W-4.",DC:"District of Columbia withholding applies a single graduated rate table (4%–10.75%) after subtracting $4,300 for each allowance claimed on Form D-4.",ME:"Maine withholding subtracts $5,300 per W-4ME allowance and a standard deduction that phases out at higher incomes before applying 5.8%, 6.75%, and 7.15% rates.",MS:"Mississippi withholding is a flat 4.0% for 2026 on annualized wages above $10,000 after the standard deduction and the Form 89-350 exemption amount.",MT:"Montana's 2026 withholding formula applies 4.7% and 5.65% brackets directly to gross wages, using the filing status on Form MW-4 instead of allowances.",NH:"New Hampshire has no tax on wages and repealed its interest-and-dividends tax, so only federal taxes and benefit deductions reduce a paycheck.",NM:"New Mexico withholding follows the FYI-104 percentage tables for wages paid in 2026, with rates from 1.5% to 5.9% by federal W-4 filing status.",ND:"North Dakota withholding uses a large zero bracket followed by 1.95% and 2.5% rates for employees with a 2020-or-later Form W-4.",RI:"Rhode Island withholding subtracts $1,000 per RI W-4 exemption (phased out above $290,800 of annual wages) before 3.75%, 4.75%, and 5.99% rates.",SD:"South Dakota has no individual income tax, so only federal income tax, FICA, and benefit deductions come out of a paycheck.",VT:"Vermont withholding subtracts $5,400 per W-4VT allowance and applies 3.35%, 6.6%, 7.6%, and 8.75% rates from the GB-1210 annual table.",WV:"West Virginia withholding subtracts $2,000 per IT-104 exemption and applies the 2026 two-earner percentage table (2.11%–4.58%) unless the one-earner option is elected.",WY:"Wyoming has no individual income tax, so a paycheck is reduced only by federal income tax, FICA, and any benefit deductions.",
 AL:"Alabama uses graduated individual income-tax rules, and some municipalities impose occupational taxes that can affect a paycheck.",AZ:"Arizona uses a state income-tax system with employee withholding elections; the relevant payroll percentage can differ from final annual liability.",AR:"Arkansas uses graduated individual income-tax rules, so one flat planning rate cannot reproduce every bracket and credit.",CA:"California uses graduated income-tax rules and may also withhold employee State Disability Insurance contributions.",CO:"Colorado uses a flat individual income-tax structure, while paid family and medical leave contributions may appear separately on payroll.",CT:"Connecticut uses graduated income-tax rules, and employee paid-leave contributions can appear separately from income-tax withholding.",FL:"Florida does not impose a broad individual state income tax on wages, although federal taxes and benefit deductions still apply.",GA:"Georgia uses a flat individual income-tax structure; payroll results can still vary with allowances, deductions, and credits.",HI:"Hawaii uses graduated individual income-tax brackets and state-specific withholding tables.",ID:"Idaho uses a flat individual income-tax structure, with withholding affected by current state forms and employee elections.",IL:"Illinois uses a flat individual income-tax structure; exemptions and credits can make withholding differ from a simple percentage.",IN:"Indiana uses a flat state income tax and many counties impose an additional county income tax based on residence or work location.",IA:"Iowa uses a flat individual income-tax structure, but taxable wages and withholding elections still affect payroll results.",KS:"Kansas uses graduated individual income-tax rules and state-specific withholding tables.",KY:"Kentucky uses a flat state income tax, while some cities and counties impose occupational or payroll taxes.",LA:"Louisiana uses a flat individual income-tax structure and state-specific withholding rules.",MD:"Maryland combines graduated state income tax with county income tax, making county residence important to paycheck withholding.",MA:"Massachusetts generally uses a flat wage-tax structure, with an additional tax applying to income above a high-income threshold.",MI:"Michigan uses a flat state income tax, and certain cities impose separate city income taxes.",MN:"Minnesota uses graduated withholding brackets and may separately withhold an employee share of the 2026 Paid Leave premium.",MO:"Missouri uses graduated income-tax rules, and Kansas City or St. Louis earnings taxes can affect some workers.",NC:"North Carolina uses a flat individual income-tax structure whose statutory rate has changed through scheduled reductions.",NE:"Nebraska uses graduated individual income-tax rules and state withholding tables.",NV:"Nevada does not impose a broad individual state income tax on wages; other payroll deductions can still apply.",NJ:"New Jersey uses graduated income-tax brackets and may withhold separate employee contributions for state benefit programs.",NY:"New York uses graduated state income-tax rules; New York City and Yonkers may add local withholding.",NYC:"New York City residents may face New York State tax, New York City resident tax, and separate payroll benefit contributions.",OH:"Ohio uses state income-tax rules and many municipalities or school districts impose separate local income taxes.",OK:"Oklahoma uses graduated individual income-tax rules and state-specific withholding tables.",OR:"Oregon uses graduated income-tax rules and may show statewide transit or paid-leave contributions separately.",PA:"Pennsylvania uses a flat state income tax, while municipalities and school districts may impose local earned-income taxes.",SC:"South Carolina uses graduated individual income-tax rules, deductions, and state withholding tables.",TN:"Tennessee does not impose a broad individual income tax on wage income, but federal payroll taxes remain.",TX:"Texas does not impose a broad individual state income tax on wages; federal taxes and employee benefits still reduce take-home pay.",UT:"Utah uses a flat individual income-tax structure, with withholding affected by current state forms and credits.",VA:"Virginia uses graduated individual income-tax brackets and state-specific withholding allowances.",WA:"Washington does not impose a broad individual state income tax on wages, but paid-leave and long-term-care payroll contributions may apply.",WI:"Wisconsin uses graduated individual income-tax brackets and state-specific withholding tables."
};
