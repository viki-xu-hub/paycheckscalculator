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
  const hourly40 = (amount / 2080).toFixed(2);
  const hourly35 = (amount / 1820).toFixed(2);
  const k = `$${Math.round(amount / 1000)}k`;
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  return [
    {
      q: `${label} a year is how much an hour?`,
      a: `${label} a year is $${hourly40} an hour if you work 40 hours a week for 52 weeks (2,080 hours). At 35 hours a week it is $${hourly35} an hour. These are gross figures before federal income tax, Social Security, Medicare and state tax.`,
    },
    {
      q: `${k} a year is how much an hour after taxes?`,
      a: `After taxes, ${k} a year is roughly $${(amount / 2080 * 0.75).toFixed(2)}–$${(amount / 2080 * 0.85).toFixed(2)} an hour, because a single filer with a standard W-4 keeps about 75%–85% of gross depending on the state. Federal income tax, 6.2% Social Security and 1.45% Medicare come out of every check; the state table on this page shows the exact after-tax figure for all 38 supported states.`,
    },
    {
      q: `${k} a year is how much biweekly?`,
      a: `${label} a year with 26 biweekly pay periods is ${fmt(biweekly)} per paycheck before taxes. Net pay after taxes will be lower — enter your state and deductions in the calculator for an exact estimate.`,
    },
    {
      q: `${label} a year is how much a month?`,
      a: `${label} a year equals ${fmt(monthly)} a month in gross pay (${label} ÷ 12). Set the calculator's pay frequency to monthly to see your net monthly take-home.`,
    },
    {
      q: `What federal tax bracket is ${label} in for ${YEAR}?`,
      a: `For ${YEAR}, a ${label} single-filer salary falls in the ${salaryBracketLabel(amount)} federal income tax bracket. The U.S. uses a marginal rate system, so only income above each bracket threshold is taxed at that rate.`,
    },
    {
      q: `Is ${label} a good salary?`,
      a: `Whether ${label} a year is a good salary depends on your location, household size and cost of living. Compare the after-tax figures for different states on this page.`,
    },
    // Salary-to-hourly phrasing variants. The conversion is identical; these
    // spell it out the way the question is usually typed.
    {
      q: `What is ${label} a year hourly?`,
      a: `${label} a year hourly is $${hourly40} an hour on a standard 2,080-hour year (40 hours a week, 52 weeks). At 35 hours a week the same salary is $${hourly35} an hour, because the same money is spread over fewer hours.`,
    },
    {
      q: `How do I convert a ${label} salary to hourly?`,
      a: `Divide by the hours you actually work in a year. ${label} salary to hourly is ${label} ÷ 2,080 = $${hourly40} an hour at full time, or ${label} ÷ 1,820 = $${hourly35} an hour at 35 hours a week. Paid time off does not change the maths — salaried pay covers the year either way.`,
    },
    {
      q: `How much per hour is ${label} a year?`,
      a: `Per hour, ${label} a year is $${hourly40} before tax at 40 hours a week. After federal tax, Social Security and Medicare the effective hourly figure is lower — the state table on this page shows the after-tax amount where you live.`,
    },
    {
      q: `What is the hourly rate for ${label} a year?`,
      a: `The hourly rate for ${label} a year is $${hourly40} at full-time hours. Put the other way round, someone earning $${hourly40} an hour and working 2,080 hours reaches a ${label} annual salary.`,
    },
    {
      q: `How much is ${k} a year hourly?`,
      a: `${k} a year hourly is $${hourly40} an hour at 40 hours a week. Written out, ${Math.round(amount / 1000)} thousand a year is how much an hour? The same $${hourly40}, because ${k} and ${label} are the same salary.`,
    },
    {
      q: `${label} salary hourly — what does it work out to?`,
      a: `A ${label} salary hourly is $${hourly40} at full-time hours and $${hourly35} at 35 hours a week. ${label} is how much an hour once you divide by the 2,080 hours in a standard working year.`,
    },
    {
      q: `${label} a year is how much a month after taxes?`,
      a: `Before tax, ${label} a year is ${fmt(monthly)} a month. After taxes the monthly figure depends on your state and filing status — a single filer typically keeps somewhere between 78% and 85% of gross, so use the calculator above and set pay frequency to monthly for your exact number.`,
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
    // Phrasing variants people actually search for. Same arithmetic, different
    // wording — answered explicitly so the page matches the query as typed.
    {
      q: `${rate} dollars an hour is how much a year?`,
      a: `${rate} dollars an hour is ${fmtAnnual} a year at 40 hours a week, or ${money.format(annualAt35h)} a year at 35 hours a week. Written either way — ${dollar} an hour or ${rate} dollars an hour — the calculation is the same: the hourly rate times 2,080 working hours in a year.`,
    },
    {
      q: `How much is ${rate} dollars an hour annually?`,
      a: `Annually, ${rate} dollars an hour comes to ${fmtAnnual} before tax on a standard 2,080-hour year. That is the gross figure; what lands in your account depends on federal withholding, Social Security, Medicare and your state.`,
    },
    {
      q: `What is ${dollar} an hour annually?`,
      a: `${dollar} an hour annually is ${fmtAnnual} gross. Part-time hours change it: at 35 hours a week it is ${money.format(annualAt35h)}, and at 30 hours a week about ${money.format(rate * 30 * 52)}.`,
    },
    {
      q: `What is the ${dollar} an hour salary equivalent?`,
      a: `The salary equivalent of ${dollar} an hour is ${fmtAnnual} a year — ${dollar} per hour annual salary at full-time hours. Converting ${dollar} hourly to salary means multiplying by 2,080; going the other way, an ${fmtAnnual} salary works out to ${dollar} an hour.`,
    },
    {
      q: `How much is ${dollar} an hour annually?`,
      a: `How much is ${dollar} an hour annually depends only on hours worked: ${fmtAnnual} at 40 hours a week, ${money.format(annualAt35h)} at 35. The ${dollar} an hour salary most people quote is the 40-hour figure, ${fmtAnnual}.`,
    },
    {
      q: `What is the ${rate} hr salary — and how do I convert ${rate} hr to salary?`,
      a: `The ${rate} hr salary is ${fmtAnnual} a year. To convert ${rate} hr to salary, multiply by the hours you work in a year: ${rate} × 2,080 = ${fmtAnnual} at full time. A ${rate} dollars an hour salary quoted as an annual number is that same ${fmtAnnual}.`,
    },
    {
      q: `${rate} hr is how much a year?`,
      a: `${rate}/hr is ${fmtAnnual} a year at full time. Whether it is written ${rate} hr, ${dollar} per hour or ${rate} dollars an hour, the annual figure is the same ${fmtAnnual} before deductions.`,
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
