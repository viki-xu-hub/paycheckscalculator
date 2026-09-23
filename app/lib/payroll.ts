export type FilingStatus = "single" | "married" | "head";
export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";
export type SupportedState =
  | "AL" | "AZ" | "AR" | "CA" | "CO" | "CT" | "FL" | "GA" | "HI" | "ID"
  | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "MD" | "MA" | "MI" | "MN"
  | "MO" | "NC" | "NE" | "NV" | "NJ" | "NY" | "NYC" | "OH" | "OK" | "OR"
  | "PA" | "SC" | "TN" | "TX" | "UT" | "VA" | "WA" | "WI"
  | "AK" | "DC" | "DE" | "ME" | "MS" | "MT" | "ND" | "NH" | "NM" | "RI" | "SD" | "VT" | "WV" | "WY";

export const PAY_PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

type RateRow = [floor: number, ceiling: number, base: number, rate: number];

export type ConnecticutWithholdingCode = "A" | "B" | "C" | "D" | "E" | "F";
export type AlabamaWithholdingStatus = "zero" | "single" | "marriedSeparate" | "married" | "head";

export type StateWithholdingOptions = {
  electedRatePercent?: number;
  localRatePercent?: number;
  annualStateAllowance?: number;
  spouseWorks?: boolean;
  claimStateStandardDeduction?: boolean;
  alabamaStatus?: AlabamaWithholdingStatus;
  dependentAllowances?: number;
  adoptedChildAllowances?: number;
  additionalStatePerPaycheck?: number;
  reducedStatePerPaycheck?: number;
  stateAdjustmentAnnual?: number;
  statePayDate?: string;
  employeePremiumRatePercent?: number;
  stateProgramPerPaycheck?: number;
  blindExemptions?: number;
  annualHours?: number;
  wbfEmployeeCentsPerHour?: number;
  hasStateWithholdingForm?: boolean;
  schoolDistrictRatePercent?: number;
  withholdAtHigherSingleRate?: boolean;
  federalWithholdingAnnual?: number;
  ficaAnnual?: number;
  retirementContributionsAnnual?: number;
  payrollWagesAnnual?: number;
  payPeriods?: number;
  withholdingCode?: ConnecticutWithholdingCode;
  ohioPayDate?: string;
};

const federalRows: Record<FilingStatus, RateRow[]> = {
  married: [[0,19300,0,0],[19300,44100,0,.10],[44100,120100,2480,.12],[120100,230700,11600,.22],[230700,422850,35932,.24],[422850,531750,82048,.32],[531750,788000,116896,.35],[788000,Infinity,206583.5,.37]],
  single: [[0,7500,0,0],[7500,19900,0,.10],[19900,57900,1240,.12],[57900,113200,5800,.22],[113200,209275,17966,.24],[209275,263725,41024,.32],[263725,648100,58448,.35],[648100,Infinity,192979.25,.37]],
  head: [[0,15550,0,0],[15550,33250,0,.10],[33250,83000,1770,.12],[83000,121250,7740,.22],[121250,217300,16155,.24],[217300,271750,39207,.32],[271750,656150,56631,.35],[656150,Infinity,191171,.37]],
};

const californiaRows: Record<FilingStatus, RateRow[]> = {
  single: [[0,11079,0,.011],[11079,26264,121.87,.022],[26264,41452,455.94,.044],[41452,57542,1124.21,.066],[57542,72724,2186.15,.088],[72724,371479,3522.17,.1023],[371479,445771,34084.81,.1133],[445771,742953,42502.09,.1243],[742953,1000000,79441.81,.1353],[1000000,Infinity,114220.27,.1463]],
  married: [[0,22158,0,.011],[22158,52528,243.74,.022],[52528,82904,911.88,.044],[82904,115084,2248.42,.066],[115084,145448,4372.3,.088],[145448,742958,7044.33,.1023],[742958,891542,68169.6,.1133],[891542,1000000,85004.17,.1243],[1000000,1485906,98485.5,.1353],[1485906,Infinity,164228.58,.1463]],
  head: [[0,22173,0,.011],[22173,52530,243.9,.022],[52530,67716,911.75,.044],[67716,83805,1579.93,.066],[83805,98990,2641.8,.088],[98990,505208,3978.08,.1023],[505208,606251,45534.18,.1133],[606251,1000000,56982.35,.1243],[1000000,1010417,105925.35,.1353],[1010417,Infinity,107334.77,.1463]],
};

const newYorkRows: Record<"single" | "married", RateRow[]> = {
  single: [[0,8500,0,.039],[8500,11700,332,.044],[11700,13900,472,.0515],[13900,80650,586,.054],[80650,96800,4190,.059],[96800,107650,5143,.0703],[107650,157650,5906,.0753],[157650,215400,9673,.064],[215400,265400,13369,.1144],[265400,1077550,19091,.0735],[1077550,5000000,0,.1045],[5000000,25000000,0,.111],[25000000,Infinity,0,.117]],
  married: [[0,8500,0,.039],[8500,11700,332,.044],[11700,13900,472,.0515],[13900,80650,586,.054],[80650,96800,4190,.059],[96800,107650,5143,.0657],[107650,157650,5855,.0707],[157650,211550,9388,.0801],[211550,323200,13708,.064],[323200,373200,20854,.1349],[373200,1077550,27600,.0735],[1077550,2155350,79369,.0765],[2155350,5000000,0,.1045],[5000000,25000000,0,.111],[25000000,Infinity,0,.117]],
};

const newJerseyRows: Record<"single" | "married", [number, number][]> = {
  single: [[20000,.014],[35000,.0175],[40000,.035],[75000,.05525],[500000,.0637],[1000000,.0897],[Infinity,.1075]],
  married: [[20000,.014],[50000,.0175],[70000,.0245],[80000,.035],[150000,.05525],[500000,.0637],[1000000,.0897],[Infinity,.1075]],
};

const minnesotaRows: Record<"single" | "married", RateRow[]> = {
  single: [[0,4700,0,0],[4700,38010,0,.0535],[38010,114130,1782.09,.068],[114130,207850,6958.25,.0785],[207850,Infinity,14315.27,.0985]],
  married: [[0,14700,0,0],[14700,63400,0,.0535],[63400,208180,2605.45,.068],[208180,352630,12450.49,.0785],[352630,Infinity,23789.82,.0985]],
};

const marylandSingleRows: [number, number][] = [[100000,.0475],[125000,.05],[150000,.0525],[250000,.055],[500000,.0575],[1000000,.0625],[Infinity,.065]];
const marylandJointRows: [number, number][] = [[150000,.0475],[175000,.05],[225000,.0525],[300000,.055],[600000,.0575],[1200000,.0625],[Infinity,.065]];

const hawaiiRows: Record<"single" | "married", RateRow[]> = {
  single: [[0,9600,0,.014],[9600,14400,134,.032],[14400,19200,288,.055],[19200,24000,552,.064],[24000,36000,859,.068],[36000,48000,1675,.072],[48000,125000,2539,.076],[125000,Infinity,8391,.079]],
  married: [[0,19200,0,.014],[19200,28800,269,.032],[28800,38400,576,.055],[38400,48000,1104,.064],[48000,72000,1718,.068],[72000,96000,3350,.072],[96000,250000,5078,.076],[250000,Infinity,16782,.079]],
};

const nebraskaRows: Record<"single" | "married", RateRow[]> = {
  single: [[0,3430,0,0],[3430,6710,0,.0226],[6710,21810,74.13,.0322],[21810,31610,560.35,.0421],[31610,40130,972.93,.0435],[40130,75370,1343.55,.0448],[75370,Infinity,2922.30,.046]],
  married: [[0,8190,0,0],[8190,13010,0,.0226],[13010,32400,108.93,.0322],[32400,50400,733.29,.0421],[50400,62530,1491.09,.0435],[62530,82920,2018.75,.0448],[82920,Infinity,2932.22,.046]],
};

const oklahomaRows: Record<"single" | "married", RateRow[]> = {
  single: [[0,10100,0,0],[10100,11250,0,.025],[11250,13550,28.75,.035],[13550,Infinity,109.25,.045]],
  married: [[0,20200,0,0],[20200,22500,0,.025],[22500,27100,57.50,.035],[27100,Infinity,218.50,.045]],
};

const virginiaRows: RateRow[] = [[0,3000,0,.02],[3000,5000,60,.03],[5000,17000,120,.05],[17000,Infinity,720,.0575]];
const wisconsinRows: RateRow[] = [[0,12760,0,.0354],[12760,25520,451.70,.0465],[25520,280950,1045.04,.053],[280950,Infinity,14582.83,.0765]];
const nycRows: RateRow[] = [[0,8000,0,.0205],[8000,8700,164,.028],[8700,15000,184,.0325],[15000,25000,388,.0395],[25000,60000,783,.0415],[60000,Infinity,2236,.0425]];


// --- 2026 rate schedules for the 14 states added Sept 2026 (sources cited on each engine below) ---
const maineRows: Record<"single"|"married", RateRow[]> = {
  single: [[0,27400,0,.058],[27400,64850,1589,.0675],[64850,Infinity,4117,.0715]],
  married: [[0,54850,0,.058],[54850,129750,3181,.0675],[129750,Infinity,8237,.0715]],
};
// WV IT-100.2A (March 2026): Table 5 annual, "Two earner / two or more jobs" (default) and optional "One earner / one job"
const westVirginiaRows: Record<"twoEarner"|"oneEarner", RateRow[]> = {
  twoEarner: [[0,7500,0,.0211],[7500,18750,158.25,.0281],[18750,30000,474.38,.0316],[30000,45000,829.88,.0422],[45000,Infinity,1462.88,.0458]],
  oneEarner: [[0,10000,0,.0211],[10000,25000,211,.0281],[25000,40000,632.50,.0316],[40000,60000,1106.50,.0422],[60000,Infinity,1950.50,.0458]],
};
const rhodeIslandRows: RateRow[] = [[0,82050,0,.0375],[82050,186450,3076.88,.0475],[186450,Infinity,8035.88,.0599]];
const newMexicoRows: Record<FilingStatus, RateRow[]> = {
  single: [[0,8050,0,0],[8050,13550,0,.015],[13550,20550,82.50,.032],[20550,24550,306.50,.032],[24550,33550,434.50,.043],[33550,41550,821.50,.043],[41550,58550,1165.50,.047],[58550,74550,1964.50,.047],[74550,218050,2716.50,.049],[218050,Infinity,9748,.059]],
  married: [[0,16100,0,0],[16100,24100,0,.015],[24100,32100,120,.032],[32100,41100,376,.032],[41100,57100,664,.043],[57100,66100,1352,.043],[66100,102100,1739,.047],[102100,116100,3431,.047],[116100,331100,4089,.049],[331100,Infinity,14624,.059]],
  head: [[0,12075,0,0],[12075,20075,0,.015],[20075,28075,120,.032],[28075,37075,376,.032],[37075,53075,664,.043],[53075,62075,1352,.043],[62075,98075,1739,.047],[98075,112075,3431,.047],[112075,327075,4089,.049],[327075,Infinity,14624,.059]],
};
const montanaRows: Record<FilingStatus, RateRow[]> = {
  single: [[0,16100,0,0],[16100,63600,0,.047],[63600,Infinity,2233,.0565]],
  married: [[0,32200,0,0],[32200,127200,0,.047],[127200,Infinity,4465,.0565]],
  head: [[0,24150,0,0],[24150,95400,0,.047],[95400,Infinity,3349,.0565]],
};
const northDakotaRows: Record<FilingStatus, RateRow[]> = {
  single: [[0,57625,0,0],[57625,258450,0,.0195],[258450,Infinity,3916.09,.025]],
  married: [[0,57500,0,0],[57500,168525,0,.0195],[168525,Infinity,2164.99,.025]],
  head: [[0,78475,0,0],[78475,289675,0,.0195],[289675,Infinity,4118.40,.025]],
};
const vermontRows: Record<"single"|"married", RateRow[]> = {
  single: [[0,3925,0,0],[3925,54675,0,.0335],[54675,126775,1700.13,.066],[126775,260225,6458.73,.076],[260225,Infinity,16600.93,.0875]],
  married: [[0,11775,0,0],[11775,96475,0,.0335],[96475,216525,2837.45,.066],[216525,323825,10760.75,.076],[323825,Infinity,18915.55,.0875]],
};
const delawareRows: RateRow[] = [[0,2000,0,0],[2000,5000,0,.022],[5000,10000,66,.039],[10000,20000,261,.048],[20000,25000,741,.052],[25000,60000,1001,.0555],[60000,Infinity,2943.50,.066]];
const dcRows: RateRow[] = [[0,10000,0,.04],[10000,40000,400,.06],[40000,60000,2200,.065],[60000,250000,3500,.085],[250000,500000,19650,.0925],[500000,1000000,42775,.0975],[1000000,Infinity,91525,.1075]];

const connecticutRows: Record<"ADF" | "B" | "C", RateRow[]> = {
  ADF: [[0,10000,0,.02],[10000,50000,200,.045],[50000,100000,2000,.055],[100000,200000,4750,.06],[200000,250000,10750,.065],[250000,500000,14000,.069],[500000,Infinity,31250,.0699]],
  B: [[0,16000,0,.02],[16000,80000,320,.045],[80000,160000,3200,.055],[160000,320000,7600,.06],[320000,400000,17200,.065],[400000,800000,22400,.069],[800000,Infinity,50000,.0699]],
  C: [[0,20000,0,.02],[20000,100000,400,.045],[100000,200000,4000,.055],[200000,400000,9500,.06],[400000,500000,21500,.065],[500000,1000000,28000,.069],[1000000,Infinity,62500,.0699]],
};

const connecticutCredits: Record<Exclude<ConnecticutWithholdingCode,"E">, [number,number][]> = {
  A:[[15000,.75],[15500,.70],[16000,.65],[16500,.60],[17000,.55],[17500,.50],[18000,.45],[18500,.40],[20000,.35],[20500,.30],[21000,.25],[21500,.20],[25000,.15],[25500,.14],[26000,.13],[26500,.12],[27000,.11],[48000,.10],[48500,.09],[49000,.08],[49500,.07],[50000,.06],[50500,.05],[51000,.04],[51500,.03],[52000,.02],[52500,.01],[Infinity,0]],
  B:[[24000,.75],[24500,.70],[25000,.65],[25500,.60],[26000,.55],[26500,.50],[27000,.45],[27500,.40],[34000,.35],[34500,.30],[35000,.25],[35500,.20],[44000,.15],[44500,.14],[45000,.13],[45500,.12],[46000,.11],[74000,.10],[74500,.09],[75000,.08],[75500,.07],[76000,.06],[76500,.05],[77000,.04],[77500,.03],[78000,.02],[78500,.01],[Infinity,0]],
  C:[[30000,.75],[30500,.70],[31000,.65],[31500,.60],[32000,.55],[32500,.50],[33000,.45],[33500,.40],[40000,.35],[40500,.30],[41000,.25],[41500,.20],[50000,.15],[50500,.14],[51000,.13],[51500,.12],[52000,.11],[96000,.10],[96500,.09],[97000,.08],[97500,.07],[98000,.06],[98500,.05],[99000,.04],[99500,.03],[100000,.02],[100500,.01],[Infinity,0]],
  D:[[Infinity,0]],
  F:[[18800,.75],[19300,.70],[19800,.65],[20300,.60],[20800,.55],[21300,.50],[21800,.45],[22300,.40],[25000,.35],[25500,.30],[26000,.25],[26500,.20],[31300,.15],[31800,.14],[32300,.13],[32800,.12],[33300,.11],[60000,.10],[60500,.09],[61000,.08],[61500,.07],[62000,.06],[62500,.05],[63000,.04],[63500,.03],[64000,.02],[64500,.01],[Infinity,0]],
};

function tableTax(income: number, rows: RateRow[]) {
  const row = rows.find(([, ceiling]) => income < ceiling) ?? rows[rows.length - 1];
  if (row[2] === 0 && row[0] >= 1077550) return income * row[3];
  return Math.max(0, row[2] + (income - row[0]) * row[3]);
}

function progressiveTax(income: number, rows: [number, number][]) {
  let tax = 0, previous = 0;
  for (const [ceiling, rate] of rows) {
    if (income <= previous) break;
    tax += (Math.min(income, ceiling) - previous) * rate;
    previous = ceiling;
  }
  return Math.max(0, tax);
}

function annualFromRoundedPeriod(annualTax: number, periods: number, wholeDollar = false) {
  const periodTax = annualTax / Math.max(1, periods);
  return (wholeDollar ? Math.round(periodTax) : Math.round(periodTax * 100) / 100) * Math.max(1, periods);
}

function alabamaStandardDeduction(wages: number, status: AlabamaWithholdingStatus) {
  if(status==="zero")return 0;
  if (status === "married") {
    if (wages <= 25999) return 8500;
    if (wages >= 35500) return 5000;
    return 8500 - 175 * Math.ceil((wages - 25999) / 500);
  }
  if (status === "head") {
    if (wages <= 25999) return 5200;
    if (wages >= 35500) return 2500;
    return 5200 - 135 * Math.ceil((wages - 25999) / 500);
  }
  if(status==="marriedSeparate"){
    if(wages<=12999)return 4250;
    if(wages>=17750)return 2500;
    return 4250-88*Math.ceil((wages-12999)/250);
  }
  if (wages <= 25999) return 3000;
  if (wages >= 35500) return 2500;
  return 3000 - 25 * Math.ceil((wages - 25999) / 500);
}

function alabamaTax(taxable: number, married: boolean) {
  if (married) return Math.min(taxable,1000)*.02 + Math.min(Math.max(0,taxable-1000),5000)*.04 + Math.max(0,taxable-6000)*.05;
  return Math.min(taxable,500)*.02 + Math.min(Math.max(0,taxable-500),2500)*.04 + Math.max(0,taxable-3000)*.05;
}

function connecticutExemption(wages:number, code:ConnecticutWithholdingCode) {
  const settings:Partial<Record<ConnecticutWithholdingCode,[number,number]>>={A:[24000,12000],B:[38000,19000],C:[48000,24000],F:[30000,15000]};
  const setting=settings[code];
  if(!setting)return 0;
  const [start,amount]=setting;
  return Math.max(0,amount-1000*Math.max(0,Math.ceil((wages-start)/1000)));
}

function connecticutAddBack(wages:number,code:ConnecticutWithholdingCode){
  const settings:Partial<Record<ConnecticutWithholdingCode,[number,number,number]>>={A:[50250,2500,25],D:[50250,2500,25],B:[78500,4000,40],C:[100500,5000,50],F:[56500,5000,25]};
  const setting=settings[code];if(!setting)return 0;
  const [start,step,amount]=setting;
  return Math.min(amount*10,amount*Math.max(0,Math.ceil((wages-start)/step)));
}

function connecticutRecapture(wages:number,code:ConnecticutWithholdingCode){
  if(code==="A"||code==="D"||code==="F"){
    if(wages<=105000)return 0;if(wages<=150000)return 25*Math.ceil((wages-105000)/5000);if(wages<=200000)return 250;
    if(wages<=345000)return 250+90*Math.ceil((wages-200000)/5000);if(wages<=500000)return 2950;
    if(wages<=540000)return 2950+50*Math.ceil((wages-500000)/5000);return 3400;
  }
  if(code==="B"){
    if(wages<=168000)return 0;if(wages<=240000)return 40*Math.ceil((wages-168000)/8000);if(wages<=320000)return 400;
    if(wages<=552000)return 400+140*Math.ceil((wages-320000)/8000);if(wages<=800000)return 4600;
    if(wages<=864000)return 4600+80*Math.ceil((wages-800000)/8000);return 5320;
  }
  if(code==="C"){
    if(wages<=210000)return 0;if(wages<=300000)return 50*Math.ceil((wages-210000)/10000);if(wages<=400000)return 500;
    if(wages<=690000)return 500+180*Math.ceil((wages-400000)/10000);if(wages<=1000000)return 5900;
    if(wages<=1080000)return 5900+100*Math.ceil((wages-1000000)/10000);return 6800;
  }
  return 0;
}

function connecticutCredit(wages:number,code:ConnecticutWithholdingCode){
  if(code==="E")return 1;
  return connecticutCredits[code].find(([ceiling])=>wages<=ceiling)?.[1]??0;
}

function newYorkStateIncomeTax(wages:number,status:FilingStatus,allowances:number){
  const nyStatus=status==="married"?"married":"single";
  const deduction=(nyStatus==="married"?7950:7400)+1000*allowances;
  return tableTax(Math.max(0,wages-deduction),newYorkRows[nyStatus]);
}

function oregonFederalSubtractionCap(wages:number,married:boolean){
  if(married){if(wages<250000)return 8750;if(wages<260000)return 7000;if(wages<270000)return 5250;if(wages<280000)return 3500;if(wages<290000)return 1750;return 0;}
  if(wages<125000)return 8750;if(wages<130000)return 7000;if(wages<135000)return 5250;if(wages<140000)return 3500;if(wages<145000)return 1750;return 0;
}

function wisconsinDeduction(wages:number,married:boolean){
  if(married){if(wages<25727)return 9461;if(wages<73032)return Math.max(0,9461-.20*(wages-25727));return 0;}
  if(wages<17780)return 6702;if(wages<73630)return Math.max(0,6702-.12*(wages-17780));return 0;
}

export function federalWithholding2026(taxableAnnualWages: number, status: FilingStatus) {
  const adjustment = status === "married" ? 12900 : 8600;
  return tableTax(Math.max(0, taxableAnnualWages - adjustment), federalRows[status]);
}

export function stateWithholding2026(state: SupportedState, wages: number, status: FilingStatus, allowances = 0, options: StateWithholdingOptions = {}) {
  const safeWages = Math.max(0, wages);
  const payrollWages = Math.max(0, options.payrollWagesAnnual ?? safeWages);
  const periods = Math.max(1, options.payPeriods ?? 1);
  const safeAllowances = Math.max(0, Math.floor(allowances));
  if (state === "TX" || state === "FL" || state === "NV" || state === "TN") return { incomeTax: 0, payrollPremiums: 0, label: "No individual state income tax on wages" };
  if (state === "AL") {
    const stateStatus=options.alabamaStatus??(status==="married"?"married":status==="head"?"head":"single");
    const dependentDeduction = stateStatus==="zero"?0:safeAllowances * (safeWages <= 50000 ? 1000 : safeWages <= 100000 ? 500 : 300);
    const personalExemption = stateStatus==="zero"?0:stateStatus==="single"||stateStatus==="marriedSeparate"?1500:3000;
    const taxable = Math.max(0,safeWages-alabamaStandardDeduction(safeWages,stateStatus)-Math.max(0,options.federalWithholdingAnnual??0)-personalExemption-dependentDeduction);
    const localTax=safeWages*Math.max(0,options.localRatePercent??0)/100;
    return {incomeTax:alabamaTax(taxable,stateStatus==="married")+localTax,payrollPremiums:0,label:`Alabama 2026 ${stateStatus} formula + entered occupational rate`};
  }
  if (state === "SC") {
    const standardDeduction = safeAllowances > 0 ? Math.min(safeWages * .10, 7500) : 0;
    const taxable = Math.max(0, safeWages - safeAllowances * 5000 - standardDeduction);
    const incomeTax = taxable < 3640 ? 0 : taxable < 18230 ? taxable * .03 - 109.2 : taxable * .06 - 656.1;
    return { incomeTax: Math.max(0, incomeTax), payrollPremiums: 0, label: "SC WH-1603F 2026 annualized formula" };
  }
  if (state === "NC") {
    const standardDeduction = status === "head" ? 19125 : 12750;
    const taxable = Math.max(0, safeWages - standardDeduction - safeAllowances * 2500);
    return { incomeTax: taxable * .0409, payrollPremiums: 0, label: "NC-30 2026 annualized percentage method" };
  }
  if (state === "AZ") {
    const elections=[0,.5,1,1.5,2,2.5,3,3.5];
    const entered=Math.min(3.5,Math.max(0,options.electedRatePercent??2));
    const elected=elections.reduce((closest,rate)=>Math.abs(rate-entered)<Math.abs(closest-entered)?rate:closest,2);
    const incomeTax=safeWages*elected/100+Math.max(0,options.additionalStatePerPaycheck??0)*periods;
    return { incomeTax, payrollPremiums: 0, label: `AZ Form A-4 elected rate (${elected.toFixed(1)}%) + entered additional amount` };
  }
  if (state === "AR") {
    const net=Math.max(0,safeWages-2470);
    const lookup=net<100001?Math.floor(net/100)*100+50:net;
    let grossTax=0;
    if(lookup>=5600&&lookup<=11199)grossTax=lookup*.02-111.98;
    else if(lookup<=15999&&lookup>=11200)grossTax=lookup*.03-223.97;
    else if(lookup<=26399&&lookup>=16000)grossTax=lookup*.034-287.97;
    else if(lookup>=26400&&lookup<=94700)grossTax=lookup*.037-367.16;
    else if(lookup>=94701&&lookup<=97600)grossTax=lookup*.037-(369.90-10*Math.floor((lookup-94750)/100));
    else if(lookup>=97601)grossTax=lookup*.037-79.90;
    const incomeTax=Math.max(0,Math.round(Math.max(0,grossTax))-safeAllowances*29);
    return {incomeTax,payrollPremiums:0,label:"Arkansas 2026 formula with $50 midpoint and AR4EC credits"};
  }
  if (state === "CO") {
    const deduction = Math.max(0,options.stateAdjustmentAnnual??(status === "married" ? 11000 : 5500));
    const incomeTax = Math.max(0, safeWages - deduction) * .044+Math.max(0,options.additionalStatePerPaycheck??0)*periods;
    const famli = Math.min(payrollWages, 184500) * .0044;
    return { incomeTax, payrollPremiums: famli, label: "CO DR 1098 + 2026 FAMLI employee premium" };
  }
  if(state==="CT"){
    const code=options.withholdingCode;
    const paidLeave=Math.min(payrollWages,184500)*.005;
    if(!code)return {incomeTax:safeWages*.0699,payrollPremiums:paidLeave,label:"Connecticut no-CT-W4 fallback (6.99%) + Paid Leave"};
    const adjustment=(Math.max(0,options.additionalStatePerPaycheck??0)-Math.max(0,options.reducedStatePerPaycheck??0))*periods;
    if(code==="E")return {incomeTax:Math.max(0,adjustment),payrollPremiums:paidLeave,label:"Connecticut CT-W4 code E + entered adjustments + Paid Leave"};
    const taxable=Math.max(0,safeWages-connecticutExemption(safeWages,code));
    const rowKey=code==="B"?"B":code==="C"?"C":"ADF";
    const initial=taxable>0?tableTax(taxable,connecticutRows[rowKey]):0;
    const incomeTax=(initial+connecticutAddBack(safeWages,code)+connecticutRecapture(safeWages,code))*(1-connecticutCredit(safeWages,code));
    return {incomeTax:Math.max(0,incomeTax+adjustment),payrollPremiums:paidLeave,label:`Connecticut TPG-211 code ${code} + entered adjustments + Paid Leave`};
  }
  if(state==="GA"){
    const deduction=status==="married"&&options.spouseWorks===false?30000:15000;
    const newRate=(options.statePayDate??"2026-05-11")>="2026-05-11";
    const rate=newRate?0.0499:0.0519;
    return {incomeTax:Math.max(0,safeWages-deduction-safeAllowances*5000)*rate,payrollPremiums:0,label:`Georgia withholding rate effective ${newRate?"May 11, 2026":"through May 10, 2026"}`};
  }
  if(state==="HI"){
    const taxable=Math.max(0,safeWages-safeAllowances*1144-4350);
    const annualTax=tableTax(taxable,hawaiiRows[status==="married"?"married":"single"]);
    return {incomeTax:annualFromRoundedPeriod(annualTax,periods),payrollPremiums:Math.max(0,options.stateProgramPerPaycheck??0)*periods,label:"Hawaii Booklet A 2026 + entered employer-plan deductions"};
  }
  if(state==="ID"){
    const taxable=Math.max(0,safeWages-safeAllowances*3868-(status==="married"?30000:15000));
    return {incomeTax:annualFromRoundedPeriod(taxable*.053,periods,true),payrollPremiums:0,label:"Idaho 2026 percentage method (whole-dollar paycheck rounding)"};
  }
  if(state==="IN"){
    const dependents=Math.max(0,Math.floor(options.dependentAllowances??0));
    const adoptedChildren=Math.max(0,Math.floor(options.adoptedChildAllowances??0));
    const taxable=Math.max(0,safeWages-safeAllowances*1000-dependents*1500-adoptedChildren*3000);
    const localTax=taxable*Math.max(0,options.localRatePercent??0)/100;
    return {incomeTax:taxable*.0295+localTax,payrollPremiums:0,label:"Indiana 2026 exemptions + entered county planning rate"};
  }
  if (state === "IA") {
    const deduction = status === "married" ? (options.spouseWorks === false ? 26000 : 13000) : status === "head" ? 19500 : 13000;
    const annualAllowance = Math.max(0,options.annualStateAllowance??0);
    const incomeTax = Math.max(0, Math.max(0, safeWages-deduction)*.038-annualAllowance);
    return { incomeTax, payrollPremiums: 0, label: "Iowa 2026 formula with entered IA W-4 annual allowance" };
  }
  if (state === "KS") {
    const baseDeduction = status === "married" ? 18320 : 9160;
    const taxable = Math.max(0, safeWages-baseDeduction-(status === "head" ? 2320 : 0)-safeAllowances*2320);
    const rows:RateRow[] = status === "married"
      ? [[0,8240,0,0],[8240,54240,0,.052],[54240,Infinity,2392,.0558]]
      : [[0,3605,0,0],[3605,26605,0,.052],[26605,Infinity,1196,.0558]];
    return { incomeTax: tableTax(taxable,rows), payrollPremiums:0, label:"Kansas KW-100 annual percentage method" };
  }
  if (state === "KY") {
    const localTax=payrollWages*Math.max(0,options.localRatePercent??0)/100;
    return { incomeTax:Math.max(0,safeWages-3360)*.035+localTax, payrollPremiums:0, label:"Kentucky 2026 formula + entered local occupational planning rate" };
  }
  if (state === "LA") {
    const deduction = options.claimStateStandardDeduction === false ? 0 : status === "single" ? 12875 : 25750;
    return { incomeTax:Math.max(0,safeWages-deduction)*.0309, payrollPremiums:0, label:"Louisiana R-1210 2026 formula" };
  }
  if (state === "MD") {
    const taxable=Math.max(0,safeWages-3400-safeAllowances*3200);
    const stateTax=progressiveTax(taxable,status === "single" ? marylandSingleRows : marylandJointRows);
    const localTax=taxable*Math.max(0,options.localRatePercent ?? 0)/100;
    return {incomeTax:stateTax+localTax,payrollPremiums:0,label:"Maryland 2026 state schedule + entered county planning rate"};
  }
  if (state === "MA") {
    const exemption=safeAllowances===0?0:safeAllowances===1?4400:3400+safeAllowances*1000;
    const adjustedWages=Math.max(0,payrollWages-Math.max(0,options.ficaAnnual??0)-Math.min(2000,Math.max(0,options.retirementContributionsAnnual??0)));
    const taxable=Math.max(0,adjustedWages-exemption);
    const blindnessReduction=Math.max(0,Math.floor(options.blindExemptions??0))*110;
    const incomeTax=safeAllowances>0&&payrollWages<8000?0:Math.min(taxable,1107750)*.05+Math.max(0,taxable-1107750)*.09-(status==="head"?120:0)-blindnessReduction;
    const premiumRate=Math.min(.46,Math.max(0,options.employeePremiumRatePercent??.46))/100;
    return {incomeTax:Math.max(0,incomeTax),payrollPremiums:Math.min(payrollWages,184500)*premiumRate,label:"Massachusetts Circular M + entered PFML employee share"};
  }
  if (state === "MI") {
    const stateTax=Math.max(0,safeWages-safeAllowances*5900)*.0425;
    const localTax=payrollWages*Math.max(0,options.localRatePercent ?? 0)/100;
    return {incomeTax:stateTax+localTax,payrollPremiums:0,label:"Michigan 2026 state formula + entered city planning rate"};
  }
  if (state === "MN") {
    const taxable=Math.max(0,safeWages-safeAllowances*5300);
    const premiumRate=Math.min(.44,Math.max(0,options.employeePremiumRatePercent??.44))/100;
    return {incomeTax:tableTax(taxable,minnesotaRows[status==="married"?"married":"single"]),payrollPremiums:Math.min(payrollWages,185000)*premiumRate,label:"Minnesota 2026 formula + entered employee Paid Leave share"};
  }
  if (state === "MO") {
    const deduction=status==="married"?(options.spouseWorks===false?32200:16100):status==="head"?24150:16100;
    const taxable=Math.max(0,safeWages-deduction);
    const rows:RateRow[]=[[0,1348,0,0],[1348,2696,0,.02],[2696,4044,27,.025],[4044,5392,61,.03],[5392,6740,101,.035],[6740,8088,148,.04],[8088,9436,202,.045],[9436,Infinity,263,.047]];
    const localTax=payrollWages*Math.max(0,options.localRatePercent??0)/100;
    return {incomeTax:annualFromRoundedPeriod(tableTax(taxable,rows),periods,true)+localTax,payrollPremiums:0,label:"Missouri 2026 formula + entered city earnings planning rate"};
  }
  if(state==="NE"){
    const taxable=Math.max(0,safeWages-safeAllowances*2440);
    return {incomeTax:tableTax(taxable,nebraskaRows[status==="married"?"married":"single"]),payrollPremiums:0,label:"Nebraska 2026 Circular EN percentage method"};
  }
  if (state === "PA") return { incomeTax: safeWages * (.0307+Math.max(0,options.localRatePercent??0)/100), payrollPremiums: 0, label: "3.07% Pennsylvania withholding + entered local EIT rate" };
  if (state === "IL") return { incomeTax: Math.max(0, safeWages - 2925 * safeAllowances) * .0495, payrollPremiums: 0, label: "4.95% after IL-W-4 allowances" };
  if (state === "WA") {
    const paidLeaveEmployeeShare = Math.min(payrollWages, 184500) * .0113 * .7143;
    const waCares = payrollWages * .0058;
    return { incomeTax: 0, payrollPremiums: paidLeaveEmployeeShare + waCares, label: "WA Paid Leave employee share + WA Cares" };
  }
  if (state === "CA") {
    const lowIncome = status === "single" ? 18896 : 37791;
    const deduction = status === "single" ? 5706 : 11412;
    const incomeTax = safeWages <= lowIncome ? 0 : Math.max(0, tableTax(Math.max(0, safeWages - deduction), californiaRows[status]) - 168.3 * safeAllowances);
    return { incomeTax, payrollPremiums: payrollWages * .013, label: "CA Method B + 1.3% SDI" };
  }
  if (state === "NY") {
    return { incomeTax:newYorkStateIncomeTax(safeWages,status,safeAllowances), payrollPremiums:Math.min(payrollWages*.00432,411.91), label: "NYS-50-T-NYS + 2026 maximum PFL contribution" };
  }
  if(state==="NYC"){
    const cityDeduction=(status==="married"?5500:5000)+safeAllowances*1000;
    const cityTax=tableTax(Math.max(0,safeWages-cityDeduction),nycRows);
    return {incomeTax:newYorkStateIncomeTax(safeWages,status,safeAllowances)+cityTax,payrollPremiums:Math.min(payrollWages*.00432,411.91),label:"NYS-50-T-NYS + NYC resident table + 2026 maximum PFL"};
  }
  if(state==="OH"){
    const taxable=Math.max(0,safeWages-safeAllowances*650);
    const newTable=(options.statePayDate||options.ohioPayDate||"2026-08-01")>="2026-08-01";
    const incomeTax=newTable
      ? taxable<=26050?taxable*.016:taxable<=100000?(taxable-26050)*.0299+416.80:(taxable-100000)*.034+2627.91
      : taxable<=26050?taxable*.01775:taxable<=100000?(taxable-26050)*.0299+462.39:(taxable-100000)*.0364+2673.50;
    const municipalTax=payrollWages*Math.max(0,options.localRatePercent??0)/100;
    const schoolTax=safeWages*Math.max(0,options.schoolDistrictRatePercent??0)/100;
    const additional=Math.max(0,options.additionalStatePerPaycheck??0)*periods;
    return {incomeTax:annualFromRoundedPeriod(incomeTax,periods)+municipalTax+schoolTax+additional,payrollPremiums:0,label:`Ohio state formula effective ${newTable?"Aug. 1, 2026":"through July 31, 2026"} + entered municipal/school planning rates`};
  }
  if(state==="OK"){
    const taxable=Math.max(0,safeWages-safeAllowances*1000);
    const tableStatus=status==="married"&&options.withholdAtHigherSingleRate!==true?"married":"single";
    const annualTax=tableTax(taxable,oklahomaRows[tableStatus]);
    const additional=Math.max(0,options.additionalStatePerPaycheck??0)*periods;
    return {incomeTax:annualFromRoundedPeriod(annualTax,periods,true)+additional,payrollPremiums:0,label:"Oklahoma 2026 percentage method (whole-dollar paycheck rounding)"};
  }
  if(state==="OR"){
    const married=status==="married";
    const useJointTable=married||safeAllowances>=3;
    const standardDeduction=useJointTable?5820:2910;
    const federalSubtraction=Math.min(Math.max(0,options.federalWithholdingAnnual??0),oregonFederalSubtractionCap(safeWages,married));
    const base=Math.max(0,safeWages-federalSubtraction-standardDeduction);
    const creditAllowances=safeWages>(married?200000:100000)?0:safeAllowances;
    let incomeTax:number;
    if(options.hasStateWithholdingForm===false){incomeTax=safeWages*.08;
    }else if(safeWages<50000){
      const rows:RateRow[]=useJointTable?[[0,9100,263,.0475],[9100,22800,695,.0675],[22800,Infinity,1620,.0875]]:[[0,4550,263,.0475],[4550,11400,479,.0675],[11400,Infinity,941,.0875]];
      incomeTax=tableTax(base,rows)-263*creditAllowances;
    }else if(useJointTable){incomeTax=(base<250000?1357+.0875*(base-22800):21237+.099*(base-250000))-263*creditAllowances;
    }else{incomeTax=(base<125000?678+.0875*(base-11400):10618+.099*(base-125000))-263*creditAllowances;}
    incomeTax=Math.max(0,incomeTax)+Math.max(0,options.additionalStatePerPaycheck??0)*periods;
    const transitPerPeriod=Math.floor((safeWages/periods)*.001*100)/100;
    const transit=transitPerPeriod*periods;
    const premiumRate=Math.min(.6,Math.max(0,options.employeePremiumRatePercent??.6))/100;
    const paidLeave=Math.min(payrollWages,184500)*premiumRate;
    const wbfHours=Math.max(0,options.annualHours??0);
    const wbfRate=Math.min(1.8,Math.max(0,options.wbfEmployeeCentsPerHour??.9))/100;
    const workersBenefitFund=wbfHours*wbfRate;
    return {incomeTax,payrollPremiums:transit+paidLeave+workersBenefitFund,label:`Oregon 2026 ${options.hasStateWithholdingForm===false?"8% no-form fallback":"formula"} + transit, Paid Leave, and WBF`};
  }
  if(state==="UT"){
    const periodWages=safeWages/periods;
    const newTable=(options.statePayDate||"2026-06-01")>="2026-06-01";
    const currentConstants:Record<number,{single:[number,number];married:[number,number]}>= {52:{single:[9,180],married:[19,360]},26:{single:[19,360],married:[37,719]},24:{single:[20,390],married:[40,779]},12:{single:[40,779],married:[81,1558]},1:{single:[485,9348],married:[970,18696]}};
    const oldConstants:Record<number,{single:[number,number];married:[number,number]}>= {52:{single:[9,175],married:[17,350]},26:{single:[17,350],married:[35,701]},24:{single:[19,379],married:[38,759]},12:{single:[38,759],married:[75,1518]},1:{single:[450,9107],married:[900,18213]}};
    const setting=(newTable?currentConstants:oldConstants)[periods]??(newTable?currentConstants:oldConstants)[1];
    const [baseCredit,threshold]=setting[status==="married"?"married":"single"];
    const credit=Math.max(0,baseCredit-.013*Math.max(0,periodWages-threshold));
    const rate=newTable ? .0445 : .045;
    return {incomeTax:Math.round(Math.max(0,periodWages*rate-credit))*periods,payrollPremiums:0,label:`Utah Publication 14 ${newTable?"effective June 1, 2026":"through May 31, 2026"}`};
  }
  if(state==="VA"){
    const taxable=Math.max(0,safeWages-8750-safeAllowances*930-Math.max(0,Math.floor(options.blindExemptions??0))*800);
    const additional=Math.max(0,options.additionalStatePerPaycheck??0)*periods;
    return {incomeTax:Math.round(tableTax(taxable,virginiaRows))+additional,payrollPremiums:0,label:"Virginia withholding formula effective July 2025 and later"};
  }
  if(state==="WI"){
    const taxable=Math.max(0,safeWages-wisconsinDeduction(safeWages,status==="married")-safeAllowances*400);
    const adjustment=(Math.max(0,options.additionalStatePerPaycheck??0)-Math.max(0,options.reducedStatePerPaycheck??0))*periods;
    return {incomeTax:Math.max(0,annualFromRoundedPeriod(tableTax(taxable,wisconsinRows),periods)+adjustment),payrollPremiums:0,label:"Wisconsin W-166 (1/26) annualized method + entered WT-4 adjustments"};
  }
  if(state==="NJ"){
    const njStatus = status === "married" ? "married" : "single";
    return { incomeTax: progressiveTax(Math.max(0, safeWages - 1000 * safeAllowances), newJerseyRows[njStatus]), payrollPremiums: 0, label: "NJ graduated rate schedule estimate" };
  }
  if (state === "AK") {
    // Alaska is one of the few states where the employee funds part of unemployment
    // insurance: 0.50% of wages up to the annual taxable wage base, $54,200 for 2026
    // (employee total $271.00). Source: Alaska DOLWD Employment Security Tax FAQ,
    // https://labor.alaska.gov/estax/faq/w1.htm — retrieved 2026-09-23.
    const employeeUI = Math.min(payrollWages, 54200) * .005;
    return { incomeTax: 0, payrollPremiums: employeeUI, label: "Alaska employee unemployment insurance (0.5% up to $54,200)" };
  }
  if (state === "SD" || state === "WY" || state === "NH") return { incomeTax: 0, payrollPremiums: 0, label: "No individual state income tax on wages" };
  if (state === "ME") {
    // Maine Revenue Services, Withholding Tables for Individual Income Tax 2026 (26_wh_tab_instr), Percentage Method steps 1-6
    const married = status === "married";
    const [full, low, high, range] = married ? [27750, 204550, 354550, 150000] : [12450, 102250, 177250, 75000];
    const standardDeduction = safeWages <= low ? full : safeWages >= high ? 0 : Math.round(full * ((high - safeWages) / range) * 10000) / 10000;
    const taxable = Math.max(0, safeWages - safeAllowances * 5300 - standardDeduction);
    return { incomeTax: annualFromRoundedPeriod(tableTax(taxable, maineRows[married ? "married" : "single"]), periods, true), payrollPremiums: 0, label: "Maine 2026 percentage method (W-4ME allowances × $5,300)" };
  }
  if (state === "WV") {
    // WV Tax Division Form IT-100.2A (March 2026, SB 392 rates): $2,000 per exemption; two-earner table unless the one-earner box is used
    const oneEarner = options.hasStateWithholdingForm === false;
    const taxable = Math.max(0, safeWages - safeAllowances * 2000);
    return { incomeTax: tableTax(taxable, westVirginiaRows[oneEarner ? "oneEarner" : "twoEarner"]), payrollPremiums: 0, label: `West Virginia IT-100.2A 2026 ${oneEarner ? "one-earner" : "two-earner"} table` };
  }
  if (state === "RI") {
    // RI Division of Taxation, 2026 Employer's Income Tax Withholding Tables: $1,000 per exemption, zero once annual wages exceed $290,800
    const exemption = safeWages > 290800 ? 0 : safeAllowances * 1000;
    return { incomeTax: tableTax(Math.max(0, safeWages - exemption), rhodeIslandRows), payrollPremiums: 0, label: "Rhode Island 2026 percentage method (RI W-4 exemptions)" };
  }
  if (state === "NM") {
    // NM Taxation & Revenue FYI-104 (Rev. 11/2025), Table 7 annual, wages paid on or after Jan 1 2026; no allowance deduction for 2020+ W-4
    return { incomeTax: tableTax(safeWages, newMexicoRows[status]), payrollPremiums: 0, label: "New Mexico FYI-104 2026 percentage method" };
  }
  if (state === "MS") {
    // MS DOR Pub 89-700 (rev. 1/13/2026): 0% on first $10,000, 4.0% above; standard deduction + Form 89-350 exemption amount
    const married = status === "married", head = status === "head";
    const standardDeduction = head ? 3400 : married ? (options.spouseWorks === false ? 4600 : 2300) : 2300;
    const exemption = head ? 9500 : married ? (options.spouseWorks === false ? 12000 : 6000) : 6000;
    const taxable = Math.max(0, safeWages - standardDeduction - exemption - safeAllowances * 1500);
    return { incomeTax: annualFromRoundedPeriod(Math.max(0, taxable - 10000) * .04, periods, true), payrollPremiums: 0, label: "Mississippi 2026 annualized formula (Pub 89-700, 4.0% over $10,000)" };
  }
  if (state === "MT") {
    // MT DOR Employer and Information Agent Guide (HB 337, 2026): W = A + B × (G − C) on gross wages, no allowances; rounded up to the dollar
    const periodTax = Math.ceil(tableTax(safeWages, montanaRows[status]) / periods);
    return { incomeTax: periodTax * periods, payrollPremiums: 0, label: "Montana 2026 withholding formula (MW-4 filing status)" };
  }
  if (state === "ND") {
    // ND Office of State Tax Commissioner, 2026 Income Tax Withholding Rates & Instructions, Section 2 annual percentage method (2020+ W-4)
    return { incomeTax: tableTax(safeWages, northDakotaRows[status]), payrollPremiums: 0, label: "North Dakota 2026 percentage method (Forms W-4 2020 and after)" };
  }
  if (state === "VT") {
    // VT Dept of Taxes GB-1210 (2026) annual percentage table; one W-4VT allowance = $5,400
    const taxable = Math.max(0, safeWages - safeAllowances * 5400);
    return { incomeTax: tableTax(taxable, vermontRows[status === "married" ? "married" : "single"]), payrollPremiums: 0, label: "Vermont GB-1210 2026 percentage method (W-4VT allowances)" };
  }
  if (state === "DE") {
    // DE Division of Revenue Employer's Guide: annualized wages − standard deduction, rate table, then $110 credit per exemption (rates unchanged since 2014)
    const standardDeduction = status === "married" ? 6500 : 3250;
    const tax = tableTax(Math.max(0, safeWages - standardDeduction), delawareRows) - safeAllowances * 110;
    return { incomeTax: Math.max(0, tax), payrollPremiums: 0, label: "Delaware percentage method (W-4 exemptions × $110 credit)" };
  }
  if (state === "DC") {
    // DC OTR FR-230 method (rates unchanged since the 2022 schedule): $4,300 per D-4 allowance, single rate table for all statuses
    const taxable = Math.max(0, safeWages - safeAllowances * 4300);
    return { incomeTax: tableTax(taxable, dcRows), payrollPremiums: 0, label: "District of Columbia FR-230 percentage method (D-4 allowances)" };
  }
  throw new Error(`Unsupported state engine: ${state}`);
}

export function calculatePaycheck(input: {grossAnnual:number; frequency:PayFrequency; status:FilingStatus; state:SupportedState; retirementPercent?:number; preTaxPerPaycheck?:number; additionalFederalPerPaycheck?:number; stateAllowances?:number;electedStateRatePercent?:number;localRatePercent?:number;annualStateAllowance?:number;spouseWorks?:boolean;claimStateStandardDeduction?:boolean;alabamaStatus?:AlabamaWithholdingStatus;dependentAllowances?:number;adoptedChildAllowances?:number;additionalStatePerPaycheck?:number;reducedStatePerPaycheck?:number;stateAdjustmentAnnual?:number;statePayDate?:string;employeePremiumRatePercent?:number;stateProgramPerPaycheck?:number;blindExemptions?:number;annualHours?:number;wbfEmployeeCentsPerHour?:number;hasStateWithholdingForm?:boolean;schoolDistrictRatePercent?:number;withholdAtHigherSingleRate?:boolean;stateWithholdingCode?:ConnecticutWithholdingCode;ohioPayDate?:string}) {
  const periods = PAY_PERIODS[input.frequency];
  const grossAnnual = Math.max(0, input.grossAnnual || 0);
  const retirementAnnual = grossAnnual * Math.min(100, Math.max(0, input.retirementPercent || 0)) / 100;
  const otherPreTaxAnnual = Math.max(0, input.preTaxPerPaycheck || 0) * periods;
  const preTaxAnnual = Math.min(grossAnnual, retirementAnnual + otherPreTaxAnnual);
  const taxableWages = Math.max(0, grossAnnual - preTaxAnnual);
  const ficaWages = Math.max(0, grossAnnual - otherPreTaxAnnual);
  const federal = federalWithholding2026(taxableWages, input.status) + Math.max(0, input.additionalFederalPerPaycheck || 0) * periods;
  const socialSecurity = Math.min(ficaWages, 184500) * .062;
  const medicare = ficaWages * .0145 + Math.max(0, ficaWages - 200000) * .009;
  const state = stateWithholding2026(input.state, taxableWages, input.status, input.stateAllowances,{electedRatePercent:input.electedStateRatePercent,localRatePercent:input.localRatePercent,annualStateAllowance:input.annualStateAllowance,spouseWorks:input.spouseWorks,claimStateStandardDeduction:input.claimStateStandardDeduction,alabamaStatus:input.alabamaStatus,dependentAllowances:input.dependentAllowances,adoptedChildAllowances:input.adoptedChildAllowances,additionalStatePerPaycheck:input.additionalStatePerPaycheck,reducedStatePerPaycheck:input.reducedStatePerPaycheck,stateAdjustmentAnnual:input.stateAdjustmentAnnual,statePayDate:input.statePayDate,employeePremiumRatePercent:input.employeePremiumRatePercent,stateProgramPerPaycheck:input.stateProgramPerPaycheck,blindExemptions:input.blindExemptions,annualHours:input.annualHours,wbfEmployeeCentsPerHour:input.wbfEmployeeCentsPerHour,hasStateWithholdingForm:input.hasStateWithholdingForm,schoolDistrictRatePercent:input.schoolDistrictRatePercent,withholdAtHigherSingleRate:input.withholdAtHigherSingleRate,federalWithholdingAnnual:federal,ficaAnnual:socialSecurity+medicare,retirementContributionsAnnual:retirementAnnual,payrollWagesAnnual:ficaWages,payPeriods:periods,withholdingCode:input.stateWithholdingCode,ohioPayDate:input.ohioPayDate});
  const netAnnual = Math.max(0, grossAnnual - preTaxAnnual - federal - socialSecurity - medicare - state.incomeTax - state.payrollPremiums);
  return {periods,grossAnnual,preTaxAnnual,retirementAnnual,federal,socialSecurity,medicare,stateIncomeTax:state.incomeTax,statePayrollPremiums:state.payrollPremiums,stateMethod:state.label,netAnnual};
}

// Compatibility wrapper for the legacy planning-only location and Texas bonus tools.
export function estimateAnnualPay(gross:number,status:FilingStatus,preTax=0){const taxableWages=Math.max(0,gross-preTax);const federal=federalWithholding2026(taxableWages,status);const socialSecurity=Math.min(taxableWages,184500)*.062;const medicare=taxableWages*.0145+Math.max(0,taxableWages-200000)*.009;return{federal,socialSecurity,medicare,net:Math.max(0,gross-preTax-federal-socialSecurity-medicare)}}

export const money = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:2 });
export const wholeMoney = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 });
