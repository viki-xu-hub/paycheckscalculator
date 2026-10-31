// State-specific rules and copy for the "<state> paycheck calculator with bonus /
// with dependents / with child support" pages. Texas keeps its own hand-built
// pages; every state listed here is rendered by app/components/StateSituationPages.tsx.

import { PAY_PERIODS, stateWithholding2026, type SupportedState } from "./payroll";

export type SituationKind = "bonus" | "dependents" | "child-support";

export type Faq = { q: string; a: string };

export type Source = { label: string; url: string };

export type SupportFee =
  | { kind: "monthly"; amount: number; label: string }
  | { kind: "percentOfSupport"; rate: number; label: string }
  | { kind: "perDeduction"; first: number; after: number; label: string };

export type SituationState = {
  code: SupportedState;
  name: string;
  slug: string; // e.g. "illinois"
  pillarPath: string;
  noIncomeTax: boolean;
  lastModified: string;
  bonus: {
    supplementalRate: number | null;
    rateLabel: string;
    headline: string;
    stateRule: string[];
    keepMore: string;
    sources: Source[];
    faqs: Faq[];
  };
  dependents: {
    formName: string | null;
    unit: "allowances" | "exemptions";
    perDependent: number | null; // annual amount each state allowance/exemption removes from wages
    personalLabel: string;
    defaultPersonal: number;
    headline: string;
    stateRule: string[];
    updateNote: string;
    sources: Source[];
    faqs: Faq[];
  };
  childSupport: {
    statute: string;
    guidelineStatute: string;
    fee: SupportFee | null;
    headline: string;
    guideline: string[];
    withholding: string[];
    agency: string;
    sources: Source[];
    faqs: Faq[];
  };
};

const usd = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
const usd0 = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

// Annual state withholding saved by one more allowance/exemption at a $75,000 salary.
function allowanceValue(code: SupportedState, salary = 75000) {
  const without = stateWithholding2026(code, salary, "single", 1, { payPeriods: PAY_PERIODS.biweekly }).incomeTax;
  const withOne = stateWithholding2026(code, salary, "single", 2, { payPeriods: PAY_PERIODS.biweekly }).incomeTax;
  return Math.max(0, without - withOne);
}

const IL_ALLOWANCE = 2925;
const OH_EXEMPTION = 650;
const ilAllowanceYear = allowanceValue("IL");
const ohExemptionYear = allowanceValue("OH");

const FEDERAL_DEPENDENT_FAQ: Faq = {
  q: "How much does one child add to my federal withholding?",
  a: "Step 3 of the 2026 federal W-4 counts $2,200 for each qualifying child under 17 and $500 for each other dependent. Payroll divides that amount across the year, so one child lowers federal withholding by about $84.62 per bi-weekly paycheck, as long as the withholding before credits is at least that large and your income is under $200,000 ($400,000 married filing jointly).",
};

export const SITUATION_STATES: SituationState[] = [
  {
    code: "IL",
    name: "Illinois",
    slug: "illinois",
    pillarPath: "/illinois-paycheck-calculator",
    noIncomeTax: false,
    lastModified: "2026-10-31",
    bonus: {
      supplementalRate: 0.0495,
      rateLabel: "4.95% Illinois flat rate",
      headline: "Illinois withholds its flat 4.95% income tax on a bonus, on top of federal withholding and FICA.",
      stateRule: [
        "Illinois taxes all wages at a single 4.95% rate, and bonuses are wages. There is no separate, higher Illinois supplemental rate: a bonus paid on its own check is withheld at 4.95% of the gross bonus.",
        "When a bonus is added to a regular paycheck, Illinois withholding on the combined check is still 4.95% of the amount above your IL-W-4 allowances. Your allowances were already used up by your salary, so the extra Illinois withholding on the bonus works out to 4.95% under either method. Only the federal side changes between methods.",
        "Illinois exempts traditional 401(k) deferrals from state income tax, so any part of the bonus your plan defers is not withheld at 4.95%. Social Security and Medicare still apply to the deferred amount.",
      ],
      keepMore: "In Illinois a traditional 401(k) or 403(b) deferral from a bonus avoids both federal withholding and the 4.95% Illinois tax, and an HSA contribution through a cafeteria plan avoids federal, Illinois, and FICA tax. Every $1,000 deferred from an Illinois bonus keeps about $269.50 of federal and state withholding out of the bonus check (22% + 4.95%).",
      sources: [{ label: "Illinois Department of Revenue Booklet IL-700-T (2026)", url: "https://tax.illinois.gov/forms/withholding/currentyear/il-700-t-withholding-guide-tables.html" }, { label: "35 ILCS 5/201 (4.95% individual rate)", url: "https://ilga.gov/ftp/ILCS/Ch%200035/Act%200005/035000050K201.html" }],
      faqs: [
        {
          q: "How much is a bonus taxed in Illinois?",
          a: "A bonus paid on a separate check is usually withheld at 22% federal, 4.95% Illinois, 6.2% Social Security, and 1.45% Medicare — 34.6% in total. A $5,000 Illinois bonus at those rates leaves about $3,270. Withholding is a prepayment; the final tax is settled on your federal and Illinois returns.",
        },
        {
          q: "Does Illinois have a supplemental tax rate for bonuses?",
          a: "No separate one. Illinois applies its flat 4.95% income tax rate to bonuses, commissions, and other supplemental wages the same way it applies to salary.",
        },
        {
          q: "Why is the Illinois tax on my bonus the same under both methods?",
          a: "Because Illinois has a flat rate. The aggregate method changes federal withholding because federal brackets are graduated, but every additional Illinois dollar is withheld at 4.95% once your IL-W-4 allowances have been applied to your salary.",
        },
        {
          q: "Is a bonus subject to Chicago city income tax?",
          a: "No. Chicago and other Illinois cities do not levy a local income tax on wages, so an Illinois bonus is not reduced by a city income tax.",
        },
        {
          q: "Do 401(k) deferrals from a bonus avoid Illinois tax?",
          a: "Yes. Traditional 401(k) deferrals are excluded from Illinois base income, so they are not withheld at 4.95%. Roth deferrals are taxed. Whether a deferral applies to bonuses at all depends on your plan document.",
        },
      ],
    },
    dependents: {
      formName: "IL-W-4",
      unit: "allowances",
      perDependent: IL_ALLOWANCE,
      personalLabel: "IL-W-4 allowances for you and your spouse",
      defaultPersonal: 1,
      headline: `Each dependent you list on Form IL-W-4 is worth a ${usd0(IL_ALLOWANCE)} allowance, which lowers Illinois withholding by about ${usd(ilAllowanceYear)} a year.`,
      stateRule: [
        `Illinois withholding starts from your wages, subtracts ${usd0(IL_ALLOWANCE)} for every allowance on Line 1 of Form IL-W-4, and applies 4.95% to the rest. Line 1 counts one allowance for you, one for your spouse if you claim them, and one for each dependent you will claim on your Illinois return.`,
        `One dependent therefore removes ${usd0(IL_ALLOWANCE)} from Illinois-taxable wages and ${usd(ilAllowanceYear)} from a year of Illinois withholding — about ${usd(ilAllowanceYear / 26)} per bi-weekly paycheck. That is separate from, and much smaller than, the federal Step 3 credit.`,
        "Line 2 of the IL-W-4 is a different allowance: $1,000 each for being 65 or older or legally blind. It does not apply to children. If you change the federal W-4 for a new child, file a new IL-W-4 too; Illinois does not read your federal form.",
      ],
      updateNote: "In Illinois, file a new IL-W-4 at the same time as the federal W-4. Illinois employers must use the IL-W-4 allowances on file, so a new baby or a child moving out changes Illinois withholding only after the new form reaches payroll.",
      sources: [{ label: "Illinois Form IL-W-4 and Booklet IL-700-T (2026)", url: "https://tax.illinois.gov/forms/withholding/currentyear/il-700-t-withholding-guide-tables.html" }, { label: "35 ILCS 5/204 (Illinois exemption allowance)", url: "https://ilga.gov/ftp/ILCS/Ch%200035/Act%200005/035000050K204.html" }],
      faqs: [
        FEDERAL_DEPENDENT_FAQ,
        {
          q: "How much does a dependent lower Illinois withholding?",
          a: `Each IL-W-4 allowance removes ${usd0(IL_ALLOWANCE)} of wages from Illinois withholding. At the 4.95% rate that is ${usd(ilAllowanceYear)} a year, or about ${usd(ilAllowanceYear / 26)} on a bi-weekly paycheck.`,
        },
        {
          q: "Do I need to update my IL-W-4 when I have a child?",
          a: "Yes. Illinois withholding uses only the allowances on Form IL-W-4. Updating the federal W-4 changes federal withholding but leaves Illinois withholding unchanged until you give your employer a new IL-W-4.",
        },
        {
          q: "Does the Illinois child tax credit change my paycheck?",
          a: "No. The Illinois child tax credit is figured on your Illinois Form IL-1040 and is tied to the Illinois earned income credit. It is not built into the IL-W-4 allowance, so it shows up as a smaller balance due or a larger refund rather than a bigger paycheck.",
        },
        {
          q: "Can I claim a dependent on both the federal W-4 and the IL-W-4?",
          a: "Yes. The two forms are independent. A child under 17 can count toward the federal Step 3 credit and also as an Illinois allowance, so both federal and Illinois withholding go down.",
        },
      ],
    },
    childSupport: {
      statute: "750 ILCS 28 (Income Withholding for Support Act)",
      guidelineStatute: "750 ILCS 5/505",
      fee: { kind: "monthly", amount: 5, label: "Illinois payor fee (up to $5 / month)" },
      headline: "Illinois sets support with an income-shares schedule, then your employer withholds it from each paycheck within federal limits.",
      guideline: [
        "Since July 1, 2017, Illinois has used an income-shares guideline under 750 ILCS 5/505. The court adds both parents' net incomes, looks up the basic support obligation for that combined income and the number of children in the schedule published by the Department of Healthcare and Family Services, and splits the obligation by each parent's share of combined income.",
        "Net income generally means gross income minus the standardized tax amount (or the individualized tax amount when the court uses actual figures). When each parent has the children for 146 or more overnights a year, the shared-parenting formula applies instead. Because the result depends on both parents, this calculator starts from the amount in your order rather than estimating the guideline.",
      ],
      withholding: [
        "Under the Income Withholding for Support Act, your employer must deduct the amount stated in the income withholding notice from each paycheck and send it to the State Disbursement Unit. Withholding cannot exceed the federal Consumer Credit Protection Act limits.",
        "The payor may also keep a fee of up to $5 per month from your pay for processing the withholding. Withheld income is applied first to current support, then to court-ordered health insurance premiums, then to past-due support.",
      ],
      agency: "Illinois Department of Healthcare and Family Services (HFS) Division of Child Support Services",
      sources: [{ label: "750 ILCS 28/35 (Income Withholding for Support Act)", url: "https://ilga.gov/ftp/ILCS/Ch%200750/Act%200028/075000280K35.html" }, { label: "750 ILCS 5/505 (Illinois support guidelines)", url: "https://ilga.gov/ftp/ILCS/Ch%200750/Act%200005/075000050K505.html" }, { label: "15 U.S.C. 1673(b) (Consumer Credit Protection Act)", url: "https://www.dol.gov/agencies/whd/fact-sheets/30-cppa" }],
      faqs: [
        {
          q: "How much can be taken from an Illinois paycheck for child support?",
          a: "Illinois follows the federal Consumer Credit Protection Act: up to 50% of disposable earnings if you support another spouse or child, or 60% if you do not, plus 5 percentage points when support is more than 12 weeks behind. Disposable earnings are pay after federal tax, Illinois tax, Social Security, and Medicare.",
        },
        {
          q: "Can my employer charge a fee for withholding child support in Illinois?",
          a: "Yes. Under 750 ILCS 28/35 the payor may take a fee of up to $5 per month from your income for handling the withholding. It is in addition to the support amount.",
        },
        {
          q: "How is Illinois child support calculated?",
          a: "Illinois uses an income-shares model. Both parents' net incomes are combined, the basic obligation for that income and number of children comes from the HFS schedule, and each parent pays their percentage share. Shared-parenting adjustments apply at 146 or more overnights per parent.",
        },
        {
          q: "Is child support taken before or after taxes in Illinois?",
          a: "After. Federal and Illinois income tax, Social Security, and Medicare are calculated on your full gross pay, and child support is deducted from what remains. Child support does not reduce your taxable wages.",
        },
        {
          q: "What if my Illinois paycheck is too small to cover the full order?",
          a: "The employer withholds only up to the federal limit and sends that amount. The unpaid balance becomes past-due support, which can lead to added arrears payments and other enforcement by the Illinois Department of Healthcare and Family Services.",
        },
      ],
    },
  },
  {
    code: "OH",
    name: "Ohio",
    slug: "ohio",
    pillarPath: "/ohio-paycheck-calculator",
    noIncomeTax: false,
    lastModified: "2026-10-31",
    bonus: {
      supplementalRate: 0.0275,
      rateLabel: "2.75% Ohio supplemental rate",
      headline: "Ohio withholds 2.75% state income tax on a bonus paid separately in 2026, and many Ohio cities withhold municipal tax on it too.",
      stateRule: [
        "Ohio Administrative Code 5703-7-10 lets employers withhold state tax on supplemental compensation — bonuses, commissions, and similar pay — at a flat rate. For payments made in 2026 that rate is 2.75%, down from 3.5% in 2025, matching Ohio's new flat income tax rate.",
        "If the bonus is instead added to a regular paycheck, Ohio withholding is figured on the combined check with the regular annualized formula and IT 4 exemptions. That can withhold slightly more or less than 2.75%, depending on where your salary falls in the withholding table.",
        "Ohio municipal income tax is not covered by the state rate. Most Ohio cities tax bonuses as wages — Columbus at 2.5%, Cleveland at 2.5%, Cincinnati at 1.8% — and some school districts add their own income tax. Enter those rates in the main Ohio calculator if they apply to you.",
      ],
      keepMore: "In Ohio a traditional 401(k) deferral from a bonus avoids federal and Ohio income tax but generally not Ohio municipal income tax, which most cities apply to wages before retirement deferrals. Every $1,000 deferred from an Ohio bonus keeps about $247.50 of federal and state withholding out of the bonus check (22% + 2.75%), while city tax on that $1,000 still applies.",
      sources: [{ label: "Ohio Adm.Code 5703-7-10 (supplemental compensation, eff. Jan. 1, 2026)", url: "https://codes.ohio.gov/ohio-administrative-code/rule-5703-7-10" }, { label: "Ohio 2026 employer withholding filing guidelines", url: "https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/employer_withholding/2025-2026%20NYP%20Updates/2026_OH_Employer_School_District_Withholding_Tax_Filing_Guidelines.pdf" }, { label: "R.C. 5747.02 (Ohio income tax rate)", url: "https://codes.ohio.gov/ohio-revised-code/section-5747.02" }],
      faqs: [
        {
          q: "How much is a bonus taxed in Ohio in 2026?",
          a: "A bonus paid separately is usually withheld at 22% federal, 2.75% Ohio, and 7.65% Social Security and Medicare — 32.4% before any city tax. A $5,000 Ohio bonus at those rates leaves about $3,380, less municipal and school district tax where they apply.",
        },
        {
          q: "What is the Ohio supplemental tax rate for 2026?",
          a: "2.75%. Ohio Adm.Code 5703-7-10 ties the supplemental withholding rate to Ohio's top income tax rate, which fell to a flat 2.75% for 2026. The 2025 supplemental rate was 3.5%.",
        },
        {
          q: "Do Ohio cities tax bonuses?",
          a: "Generally yes. Ohio municipal income taxes apply to wages, including bonuses, at the city's rate — for example 2.5% in Columbus and Cleveland. School district income tax may also apply based on where you live.",
        },
        {
          q: "Why does the Ohio aggregate method differ from 2.75%?",
          a: "Ohio's regular withholding formula uses annualized brackets and $650 IT 4 exemptions, so adding a bonus to a paycheck is withheld at whatever marginal rate the combined, annualized amount falls into, not at the flat supplemental rate.",
        },
        {
          q: "Will I get Ohio tax on my bonus back?",
          a: "Only if more was withheld than you owe. Ohio's 2026 income tax is a flat 2.75% on income above the $26,050 zero bracket, so withholding at 2.75% on a bonus is usually close to the final Ohio tax on it.",
        },
      ],
    },
    dependents: {
      formName: "IT 4",
      unit: "exemptions",
      perDependent: OH_EXEMPTION,
      personalLabel: "IT 4 exemptions for you and your spouse",
      defaultPersonal: 1,
      headline: `Each dependent on Ohio Form IT 4 is a ${usd0(OH_EXEMPTION)} exemption — worth about ${usd(ohExemptionYear)} a year in Ohio withholding at a $75,000 salary.`,
      stateRule: [
        `Ohio withholding subtracts ${usd0(OH_EXEMPTION)} from annual wages for every exemption on Form IT 4 — one for you, one for your spouse, and one for each dependent you will claim on your Ohio return — then applies the Ohio withholding table to the rest.`,
        `Because the exemption is small and Ohio's rates are low, a dependent changes Ohio withholding by only about ${usd(ohExemptionYear)} a year at a $75,000 salary, or roughly ${usd(ohExemptionYear / 26)} per bi-weekly check. Almost all of the paycheck gain from a child comes from the federal W-4 Step 3 credit.`,
        "Ohio's own dependent exemption on the IT 1040 phases out at higher incomes, but IT 4 withholding uses the flat $650 figure. Exemptions do not reduce municipal income tax, which most Ohio cities apply to gross wages.",
      ],
      updateNote: "In Ohio, give your employer a new IT 4 along with the federal W-4. The IT 4 also carries your school district number, so a move to a new district is another reason to update it.",
      sources: [{ label: "Ohio Form IT 4 (Employee's Withholding Exemption Certificate)", url: "https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/forms/employer_withholding/generic/wth_it4.pdf" }, { label: "Ohio 2026 employer withholding filing guidelines", url: "https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/employer_withholding/2025-2026%20NYP%20Updates/2026_OH_Employer_School_District_Withholding_Tax_Filing_Guidelines.pdf" }],
      faqs: [
        FEDERAL_DEPENDENT_FAQ,
        {
          q: "How much does a dependent lower Ohio withholding?",
          a: `Each IT 4 exemption removes ${usd0(OH_EXEMPTION)} of wages from Ohio withholding. At a $75,000 salary that lowers Ohio withholding by about ${usd(ohExemptionYear)} a year, or ${usd(ohExemptionYear / 26)} per bi-weekly paycheck.`,
        },
        {
          q: "Do I need a new IT 4 after having a baby?",
          a: "Yes, if you want Ohio withholding to change. Ohio employers use only Form IT 4 for state withholding. Updating the federal W-4 does not change the Ohio amount.",
        },
        {
          q: "Do dependents lower Ohio city income tax?",
          a: "No. Ohio municipal income taxes are generally a flat percentage of wages with no personal or dependent exemptions, so your city tax stays the same.",
        },
        {
          q: "Why is the Ohio change so much smaller than the federal one?",
          a: "The federal W-4 gives a $2,200 credit per child against tax. Ohio's IT 4 gives a $650 exemption against wages, which at Ohio's withholding rates is worth well under $25 a year.",
        },
      ],
    },
    childSupport: {
      statute: "R.C. Chapter 3121 (withholding notices)",
      guidelineStatute: "R.C. 3119.021 and 3119.022",
      fee: { kind: "percentOfSupport", rate: 0.02, label: "Ohio 2% processing charge" },
      headline: "Ohio support is set from both parents' incomes with a statewide schedule, and the order adds a 2% processing charge to every payment.",
      guideline: [
        "Ohio uses an income-shares model. The worksheet under R.C. 3119.022 combines both parents' annual incomes, applies the basic child support schedule in R.C. 3119.021, and assigns each parent a share based on their percentage of combined income. A self-sufficiency reserve protects low-income obligors, and the court can reduce support by 10% when the obligor has 90 or more overnights a year.",
        "Because the result depends on both incomes, health insurance, child care, and parenting time, this calculator starts from the monthly amount in your Ohio order rather than estimating the worksheet.",
      ],
      withholding: [
        "When an Ohio order is enforced by payroll withholding, the child support enforcement agency sends your employer a withholding notice under R.C. Chapter 3121. The employer withholds the ordered amount from each paycheck, within federal Consumer Credit Protection Act limits, and sends it to Ohio Child Support Payment Central.",
        "R.C. 3119.27 adds a processing charge of 2% of the support amount, which is collected with every current support payment and every arrears payment. A $600 monthly order therefore withholds $612 a month.",
      ],
      agency: "county child support enforcement agency (CSEA) and the Ohio Department of Job and Family Services",
      sources: [{ label: "R.C. 3119.021–3119.022 (Ohio guideline schedule and worksheet)", url: "https://codes.ohio.gov/ohio-revised-code/section-3119.021" }, { label: "R.C. 3119.27 (2% processing charge)", url: "https://codes.ohio.gov/ohio-revised-code/section-3119.27" }, { label: "R.C. Chapter 3121 (income withholding)", url: "https://codes.ohio.gov/ohio-revised-code/chapter-3121" }, { label: "15 U.S.C. 1673(b) (Consumer Credit Protection Act)", url: "https://www.dol.gov/agencies/whd/fact-sheets/30-cppa" }],
      faqs: [
        {
          q: "How much can be taken from an Ohio paycheck for child support?",
          a: "Ohio applies the federal Consumer Credit Protection Act limits: up to 50% of disposable earnings if you support another spouse or child, 60% if not, and 5 percentage points more if support is over 12 weeks in arrears. Disposable earnings are pay after federal, Ohio, and local income taxes, Social Security, and Medicare.",
        },
        {
          q: "What is the 2% fee on Ohio child support?",
          a: "R.C. 3119.27 requires a processing charge of 2% of the support payment. It is paid by the obligor with every current support and arrears payment, so payroll withholds the ordered amount plus 2%.",
        },
        {
          q: "How is Ohio child support calculated?",
          a: "Ohio combines both parents' incomes, finds the basic obligation in the R.C. 3119.021 schedule for that income and number of children, and splits it by each parent's share of income, with adjustments for health insurance, child care, the self-sufficiency reserve, and parenting time.",
        },
        {
          q: "Does Ohio child support reduce my taxes?",
          a: "No. Child support is neither deductible for the payer nor taxable to the recipient, and it is withheld after federal, Ohio, and city taxes are calculated on your full wages.",
        },
        {
          q: "What happens if my Ohio paycheck cannot cover the order?",
          a: "Your employer withholds up to the federal limit. The shortfall accrues as arrears, and the county child support enforcement agency may add an arrears payment or use other enforcement tools.",
        },
      ],
    },
  },
  {
    code: "FL",
    name: "Florida",
    slug: "florida",
    pillarPath: "/florida-paycheck-calculator",
    noIncomeTax: true,
    lastModified: "2026-10-31",
    bonus: {
      supplementalRate: null,
      rateLabel: "No Florida income tax",
      headline: "Florida has no personal income tax, so a Florida bonus is reduced only by federal withholding, Social Security, and Medicare.",
      stateRule: [
        "The Florida Constitution prohibits a state personal income tax, and no Florida county or city levies a local income tax. No Florida income tax is withheld from a bonus, a commission, or any other supplemental wage.",
        "Florida's reemployment (unemployment) tax is paid entirely by the employer and never comes out of your check. Florida also has no state disability insurance or paid-leave payroll deduction, so the only bonus deductions are federal.",
        "If you live in Florida but work for an employer in a state with income tax, that state may still withhold on wages earned there. The estimate below assumes you live and work in Florida.",
      ],
      keepMore: "In Florida the only levers are federal: a traditional 401(k) deferral from a bonus avoids the 22% federal withholding, and an HSA contribution through a cafeteria plan also avoids Social Security and Medicare. Every $1,000 deferred from a Florida bonus keeps about $220 of federal withholding out of the bonus check.",
      sources: [{ label: "Florida Constitution, Article VII, Section 5", url: "https://www.flsenate.gov/Laws/Constitution#A7S05" }, { label: "Florida Department of Revenue (reemployment tax is employer-paid)", url: "https://floridarevenue.com/taxes/taxesfees/Pages/reemployment.aspx" }],
      faqs: [
        {
          q: "How much of my bonus will I take home in Florida?",
          a: "A Florida bonus paid separately is usually withheld at 22% federal plus 7.65% Social Security and Medicare, leaving about 70%. A $5,000 bonus leaves roughly $3,518. There is no Florida state or local income tax.",
        },
        {
          q: "Does Florida tax bonuses?",
          a: "No. Florida has no personal income tax on any wages, including bonuses. Federal income tax, Social Security, and Medicare still apply.",
        },
        {
          q: "Why was my Florida bonus withheld at more than 22%?",
          a: "Your employer probably added the bonus to a regular paycheck and used the aggregate method, which annualizes the combined check and pushes it into higher federal brackets. The extra withholding is credited when you file your Form 1040.",
        },
        {
          q: "Is a Florida bonus taxed differently for remote workers?",
          a: "It can be. If you work remotely for an employer in another state, that state's rules decide whether its income tax applies. Some states tax nonresidents who work for in-state employers; Florida itself never does.",
        },
        {
          q: "What happens to Florida bonuses over $1 million?",
          a: "Federal law requires 37% withholding on supplemental wages above $1 million in a calendar year. Florida adds nothing on top.",
        },
      ],
    },
    dependents: {
      formName: null,
      unit: "allowances",
      perDependent: null,
      personalLabel: "",
      defaultPersonal: 0,
      headline: "Florida has no state withholding form, so dependents change a Florida paycheck only through Step 3 of the federal W-4.",
      stateRule: [
        "Because Florida has no personal income tax, there is no Florida W-4, no state allowances, and no state dependent exemption. The full paycheck effect of a child comes from Step 3 of the federal Form W-4.",
        "That makes the math simple: each qualifying child under 17 adds $2,200 a year and each other dependent $500 a year to Step 3, and payroll subtracts the total from federal withholding across your paychecks. Social Security and Medicare do not change.",
        "Federal withholding cannot fall below zero. If your Step 3 amount is larger than the federal tax withheld on your wages, the unused part is not paid out through payroll; it is settled when you file your federal return, where refundability rules for the child tax credit apply.",
      ],
      updateNote: "In Florida there is no state form to file. Updating Step 3 of the federal W-4 is the only change needed when your family changes.",
      sources: [{ label: "2026 IRS Form W-4, Step 3", url: "https://www.irs.gov/forms-pubs/about-form-w-4" }, { label: "IRS Publication 15-T", url: "https://www.irs.gov/publications/p15t" }, { label: "Florida Constitution, Article VII, Section 5", url: "https://www.flsenate.gov/Laws/Constitution#A7S05" }],
      faqs: [
        FEDERAL_DEPENDENT_FAQ,
        {
          q: "Is there a Florida W-4 for dependents?",
          a: "No. Florida has no state income tax, so there is no state withholding certificate. Dependents are claimed only on the federal Form W-4.",
        },
        {
          q: "Why didn't my Florida paycheck go up by the full credit?",
          a: "Payroll can only reduce federal withholding to zero. On a lower salary the Step 3 credit can be larger than the federal tax withheld, so the rest of the benefit arrives when you file your return.",
        },
        {
          q: "Do dependents lower Social Security or Medicare?",
          a: "No. Social Security and Medicare are a fixed percentage of wages and do not depend on dependents or filing status.",
        },
        {
          q: "Who counts as an other dependent on the W-4?",
          a: "Generally a qualifying child age 17 or older, or a qualifying relative such as a parent you support. Each is worth $500 in Step 3 rather than $2,200.",
        },
      ],
    },
    childSupport: {
      statute: "Fla. Stat. 61.1301 (income deduction orders)",
      guidelineStatute: "Fla. Stat. 61.30",
      fee: { kind: "perDeduction", first: 5, after: 2, label: "Florida payor fee ($5 first, $2 after)" },
      headline: "Florida support follows the s. 61.30 income-shares guidelines and is deducted from each paycheck under an income deduction order.",
      guideline: [
        "Florida child support guidelines in s. 61.30 combine both parents' net monthly incomes, look up the minimum support need for that income and number of children in the statutory schedule, and divide it by each parent's share. Health insurance and child care costs are added and allocated the same way.",
        "When each parent has the children for at least 20% of overnights (73 a year), the substantial time-sharing formula applies. Because the result depends on both parents' incomes and the parenting plan, this calculator starts from the amount in your Florida order.",
      ],
      withholding: [
        "Under s. 61.1301, a Florida income deduction order directs your employer to deduct current support and, when there is an arrearage, an additional amount — at least 20% of the periodic payment unless the court orders otherwise — until the arrearage is paid. Deductions may not exceed the federal Consumer Credit Protection Act limits.",
        "The payor may collect up to $5 from your income for the first deduction and up to $2 for each deduction after that to cover administrative costs. Payments go to the Florida State Disbursement Unit. With no state income tax, disposable earnings in Florida are simply pay after federal tax, Social Security, and Medicare.",
      ],
      agency: "Florida Department of Revenue Child Support Program",
      sources: [{ label: "Fla. Stat. 61.1301 (income deduction orders and payor fee)", url: "https://www.flsenate.gov/Laws/Statutes/2025/61.1301" }, { label: "Fla. Stat. 61.30 (child support guidelines)", url: "https://www.flsenate.gov/Laws/Statutes/2025/61.30" }, { label: "15 U.S.C. 1673(b) (Consumer Credit Protection Act)", url: "https://www.dol.gov/agencies/whd/fact-sheets/30-cppa" }],
      faqs: [
        {
          q: "How much can be taken from a Florida paycheck for child support?",
          a: "Florida income deduction orders cannot exceed the federal Consumer Credit Protection Act limits: 50% of disposable earnings if you support another spouse or child, 60% if not, plus 5 points when support is more than 12 weeks behind. Florida has no state income tax, so disposable earnings are pay after federal tax and FICA.",
        },
        {
          q: "Can a Florida employer charge a fee for child support deductions?",
          a: "Yes. Section 61.1301 lets the payor collect up to $5 for the first deduction and up to $2 for each later deduction from your income to cover administrative costs.",
        },
        {
          q: "How much extra is withheld for Florida child support arrears?",
          a: "Unless the court sets a different amount, a Florida income deduction order directs the employer to withhold an additional 20% or more of the periodic support amount until past-due support, fees, and costs are paid.",
        },
        {
          q: "How is Florida child support calculated?",
          a: "Florida uses the income-shares guidelines in s. 61.30: both parents' net incomes are combined, the schedule gives a minimum need for that income and number of children, and each parent pays their percentage share, adjusted for health insurance, child care, and substantial time-sharing.",
        },
        {
          q: "Is Florida child support taken out before taxes?",
          a: "No. Federal income tax, Social Security, and Medicare are calculated on your full gross pay first, and the support deduction comes out of what remains.",
        },
      ],
    },
  },
];

export const situationStateByCode = Object.fromEntries(SITUATION_STATES.map(s => [s.code, s])) as Record<string, SituationState>;

export const SITUATION_LABEL: Record<SituationKind, string> = {
  bonus: "With Bonus",
  dependents: "With Dependents",
  "child-support": "With Child Support",
};

export function situationPath(slug: string, kind: SituationKind) {
  return `/${slug}-paycheck-calculator-with-${kind}`;
}

export const SITUATION_PATHS = SITUATION_STATES.flatMap(state =>
  (["bonus", "dependents", "child-support"] as SituationKind[]).map(kind => situationPath(state.slug, kind)),
);

// Every state with situation pages, Texas included (its pages are hand-built).
export const SITUATION_HUB_STATES = [
  { code: "TX", name: "Texas", slug: "texas" },
  ...SITUATION_STATES.map(({ code, name, slug }) => ({ code: code as string, name, slug })),
];
