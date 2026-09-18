import type { StateData, SalaryData, HourlyData, FrequencyData, FaqItem } from "./types";

const YEAR = "2026";

export function stateFaqs(state: StateData): FaqItem[] {
  const { name, hasStateTax, taxRate, taxType, taxAgency } = state;
  return [
    {
      q: `Does ${name} have state income tax?`,
      a: hasStateTax
        ? `Yes. ${name} imposes ${taxType} on wages. The amount withheld depends on your income, filing status, and withholding elections. ${name} state income tax is separate from federal income tax.`
        : `No. ${name} does not impose a state income tax on wages. Employees still pay federal income tax, Social Security (6.2%), and Medicare (1.45%).`,
    },
    {
      q: `How much is my paycheck after taxes in ${name}?`,
      a: `Your ${name} take-home pay depends on your salary, pay frequency, filing status, pre-tax deductions, and ${hasStateTax ? `${name} state income tax withholding` : "payroll deductions"}. Use the calculator above to enter your specific situation.`,
    },
    {
      q: `What taxes are taken out of a ${name} paycheck?`,
      a: hasStateTax
        ? `A ${name} paycheck typically deducts: federal income tax, ${name} state income tax (${taxType}), Social Security (6.2%), Medicare (1.45%), and any benefit or retirement deductions.`
        : `A ${name} paycheck deducts: federal income tax, Social Security (6.2%), Medicare (1.45%), and benefit or retirement deductions. ${name} does not deduct state income tax.`,
    },
    {
      q: `Is ${name} a tax-friendly state for employees?`,
      a: hasStateTax
        ? `${name} has a ${taxType} in addition to federal taxes. Whether it is tax-friendly depends on your income level and how ${name}'s rates compare to other states.`
        : `${name} has no state income tax, which can benefit employees. However, federal taxes and other payroll deductions still apply to all U.S. workers.`,
    },
    {
      q: `How accurate is this ${name} paycheck calculator?`,
      a: `This calculator provides a ${YEAR} estimate based on published IRS withholding methods${hasStateTax ? ` and ${taxAgency} rates` : ""}. Actual paychecks may differ due to employer payroll systems, year-to-date caps, bonus treatment, and individual tax circumstances.`,
    },
  ];
}

export function salaryFaqs(salary: SalaryData): FaqItem[] {
  const { amount, label } = salary;
  const monthly = Math.round(amount / 12);
  const biweekly = Math.round(amount / 26);
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  return [
    {
      q: `How much is ${label} a year after taxes?`,
      a: `A ${label} salary take-home pay depends on your state, filing status, and deductions. Federally, you pay income tax, Social Security (6.2%), and Medicare (1.45%). Use the calculator to get a state-specific estimate.`,
    },
    {
      q: `What is the monthly take-home pay for ${label}?`,
      a: `${label} per year equals approximately ${fmt(monthly)} per month in gross pay. Your net monthly take-home will be lower after taxes. Use the calculator above and set pay frequency to monthly.`,
    },
    {
      q: `What is the biweekly paycheck for ${label}?`,
      a: `At ${label}/year with 26 biweekly pay periods, your gross pay per check is approximately ${fmt(biweekly)}. Net pay after taxes will be lower — enter your state and deductions for an exact estimate.`,
    },
    {
      q: `Is ${label} a good salary?`,
      a: `Whether ${label} is a good salary depends on your location, household size, and cost of living. Use the state calculator to compare take-home pay across different states.`,
    },
    {
      q: `What federal tax bracket is ${label} in for ${YEAR}?`,
      a: `For ${YEAR}, a ${label} single-filer salary falls in the ${salaryBracketLabel(amount)} federal income tax bracket. However, the U.S. uses a marginal rate system, so only income above each bracket threshold is taxed at that rate.`,
    },
  ];
}

export function hourlyFaqs(hourly: HourlyData): FaqItem[] {
  const { rate, annualAt40h, annualAt35h } = hourly;
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const dollar = `$${rate}`;
  const fmtAnnual = money.format(annualAt40h);
  return [
    {
      q: `${dollar} an hour is how much a year?`,
      a: `${dollar} an hour is ${fmtAnnual} a year before taxes if you work 40 hours a week for 52 weeks (2,080 hours). At 35 hours a week it is ${money.format(annualAt35h)} a year. Your take-home pay will be lower after federal income tax, Social Security, Medicare and any state tax.`,
    },
    {
      q: `How much is ${dollar} an hour after taxes?`,
      a: `On ${fmtAnnual} gross, a single filer with a standard W-4 keeps roughly 78%–85% depending on the state, because federal income tax, 6.2% Social Security and 1.45% Medicare come out of every check. The state table on this page shows the exact after-tax figure for all 38 supported states.`,
    },
    {
      q: `What is the biweekly paycheck for ${dollar} an hour?`,
      a: `At ${dollar} an hour for 80 hours per biweekly period, your gross biweekly pay is ${money.format(rate * 80)}. After taxes, net pay depends on your state and deductions — use the calculator above for your exact number.`,
    },
    {
      q: `${dollar} an hour is how much a month?`,
      a: `At 40 hours a week, ${dollar} an hour works out to about ${money.format(annualAt40h / 12)} a month in gross pay (${fmtAnnual} ÷ 12). Enter your details in the calculator for a monthly net pay estimate.`,
    },
    {
      q: `How much tax is taken out of a ${dollar} an hour paycheck?`,
      a: `Federal income tax (based on your W-4 and the 2026 IRS withholding tables), Social Security (6.2%) and Medicare (1.45%) are withheld from every U.S. paycheck. State income tax depends on where you work; nine states withhold none.`,
    },
    {
      q: `Is ${dollar} an hour a good wage?`,
      a: `${dollar} an hour is approximately ${fmtAnnual} a year at full-time hours. Whether that is a good wage depends on your location and cost of living — compare the take-home figures for different states on this page.`,
    },
  ];
}

export function frequencyFaqs(freq: FrequencyData): FaqItem[] {
  return [
    {
      q: `How many paychecks are in a ${freq.shortLabel} pay schedule?`,
      a: `A ${freq.shortLabel} pay schedule results in ${freq.periods} paychecks per year. ${freq.longDescription}`,
    },
    {
      q: `What is the difference between biweekly and ${freq.shortLabel} pay?`,
      a: `Biweekly pay gives you 26 checks per year (every two weeks). ${freq.name} pay gives you ${freq.periods} checks per year. The ${freq.shortLabel} schedule is ${freq.description}.`,
    },
    {
      q: `How is federal tax withholding calculated on a ${freq.shortLabel} paycheck?`,
      a: `The IRS annualizes your ${freq.shortLabel} wages (multiplying by ${freq.periods}), applies the withholding tables, then divides by ${freq.periods} to get the per-paycheck amount. Higher-frequency pay means smaller individual checks but the same annual tax.`,
    },
    {
      q: `Does pay frequency affect how much tax I pay annually?`,
      a: `Your total annual tax burden is the same regardless of pay frequency. However, ${freq.shortLabel} pay can affect cash flow and how deductions are spread across checks.`,
    },
  ];
}

function salaryBracketLabel(annual: number): string {
  if (annual <= 47150) return "10%–12%";
  if (annual <= 100525) return "22%";
  if (annual <= 191950) return "24%";
  if (annual <= 243725) return "32%";
  if (annual <= 609350) return "35%";
  return "37%";
}
