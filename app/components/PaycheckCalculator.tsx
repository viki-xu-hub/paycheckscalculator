"use client";

import { useId, useMemo, useState } from "react";
import {
  calculatePaycheck,
  money,
  PAY_PERIODS,
  type AlabamaWithholdingStatus,
  type ConnecticutWithholdingCode,
  type FilingStatus,
  type PayFrequency,
  type SupportedState,
  wholeMoney,
} from "../lib/payroll";

const supportedStates: {code:SupportedState;name:string}[] = [
  {code:"AL",name:"Alabama"},{code:"AK",name:"Alaska"},{code:"AZ",name:"Arizona"},{code:"AR",name:"Arkansas"},{code:"CA",name:"California"},{code:"CO",name:"Colorado"},{code:"CT",name:"Connecticut"},{code:"DE",name:"Delaware"},{code:"DC",name:"District of Columbia"},{code:"FL",name:"Florida"},{code:"GA",name:"Georgia"},{code:"HI",name:"Hawaii"},{code:"ID",name:"Idaho"},{code:"IL",name:"Illinois"},{code:"IN",name:"Indiana"},{code:"IA",name:"Iowa"},{code:"KS",name:"Kansas"},{code:"KY",name:"Kentucky"},{code:"LA",name:"Louisiana"},{code:"ME",name:"Maine"},{code:"MD",name:"Maryland"},{code:"MA",name:"Massachusetts"},{code:"MI",name:"Michigan"},{code:"MN",name:"Minnesota"},{code:"MS",name:"Mississippi"},{code:"MO",name:"Missouri"},{code:"MT",name:"Montana"},{code:"NE",name:"Nebraska"},{code:"NV",name:"Nevada"},{code:"NH",name:"New Hampshire"},{code:"NJ",name:"New Jersey"},{code:"NM",name:"New Mexico"},{code:"NY",name:"New York"},{code:"NYC",name:"New York City resident"},{code:"NC",name:"North Carolina"},{code:"ND",name:"North Dakota"},{code:"OH",name:"Ohio"},{code:"OK",name:"Oklahoma"},{code:"OR",name:"Oregon"},{code:"PA",name:"Pennsylvania"},{code:"RI",name:"Rhode Island"},{code:"SC",name:"South Carolina"},{code:"SD",name:"South Dakota"},{code:"TN",name:"Tennessee"},{code:"TX",name:"Texas"},{code:"UT",name:"Utah"},{code:"VT",name:"Vermont"},{code:"VA",name:"Virginia"},{code:"WA",name:"Washington"},{code:"WV",name:"West Virginia"},{code:"WI",name:"Wisconsin"},{code:"WY",name:"Wyoming"}
];

const allowanceStates = new Set<SupportedState>(["AL","AR","CA","DC","DE","GA","HI","ID","IL","IN","KS","MA","MD","ME","MI","MN","MS","NC","NE","NJ","NY","NYC","OH","OK","OR","RI","SC","VA","VT","WI","WV"]);
const localRateStates = new Set<SupportedState>(["AL","IN","KY","MD","MI","MO","OH","PA"]);

const initialLocalRate=(state:SupportedState)=>state==="MD"?3.2:0;
const initialStateDate=(state:SupportedState)=>state==="GA"?"2026-05-11":state==="UT"?"2026-06-01":"2026-08-01";
const initialPremiumRate=(state:SupportedState)=>state==="MA" ? .46 : state==="MN" ? .44 : state==="OR" ? .6 : 0;

export default function PaycheckCalculator({defaultState="TX",defaultFrequency="biweekly",hourly=false,navigateOnStateChange=false,defaultHourlyRate=30,defaultOvertime=5,defaultSalary=75000,headingSuffix=""}:{defaultState?:SupportedState;defaultFrequency?:PayFrequency;hourly?:boolean;navigateOnStateChange?:boolean;defaultHourlyRate?:number;defaultOvertime?:number;defaultSalary?:number;headingSuffix?:string}) {
  const [state,setState]=useState<SupportedState>(defaultState);
  const [stateQuery,setStateQuery]=useState(supportedStates.find(item=>item.code===defaultState)?.name??"");
  const [stateSearchOpen,setStateSearchOpen]=useState(false);
  const [assumptionsOpen,setAssumptionsOpen]=useState(false);
  const stateListId=useId();
  const [frequency,setFrequency]=useState<PayFrequency>(defaultFrequency);
  const [salary,setSalary]=useState(defaultSalary);
  const [hourlyRate,setHourlyRate]=useState(defaultHourlyRate);
  const [hours,setHours]=useState(40);
  const [overtime,setOvertime]=useState(defaultOvertime);
  const [weeks,setWeeks]=useState(52);
  const [status,setStatus]=useState<FilingStatus>("single");
  const [retirement,setRetirement]=useState(5);
  const [preTax,setPreTax]=useState(150);
  const [additional,setAdditional]=useState(0);
  const [allowances,setAllowances]=useState(0);
  const [electedStateRate,setElectedStateRate]=useState(2);
  const [localRate,setLocalRate]=useState(initialLocalRate(defaultState));
  const [ctCode,setCtCode]=useState<ConnecticutWithholdingCode|"none">("none");
  const [statePayDate,setStatePayDate]=useState(initialStateDate(defaultState));
  const [iowaAnnualAllowance,setIowaAnnualAllowance]=useState(0);
  const [spouseWorks,setSpouseWorks]=useState(true);
  const [claimLouisianaDeduction,setClaimLouisianaDeduction]=useState(true);
  const [alabamaStatus,setAlabamaStatus]=useState<AlabamaWithholdingStatus>("single");
  const [dependentAllowances,setDependentAllowances]=useState(0);
  const [adoptedChildAllowances,setAdoptedChildAllowances]=useState(0);
  const [additionalState,setAdditionalState]=useState(0);
  const [reducedState,setReducedState]=useState(0);
  const [coloradoAdjustment,setColoradoAdjustment]=useState(5500);
  const [employeePremiumRate,setEmployeePremiumRate]=useState(initialPremiumRate(defaultState));
  const [stateProgramDeduction,setStateProgramDeduction]=useState(0);
  const [blindExemptions,setBlindExemptions]=useState(0);
  const [oregonHours,setOregonHours]=useState(2080);
  const [wbfEmployeeCents,setWbfEmployeeCents]=useState(.9);
  const [hasStateWithholdingForm,setHasStateWithholdingForm]=useState(true);
  const [schoolDistrictRate,setSchoolDistrictRate]=useState(0);
  const [withholdAtHigherSingleRate,setWithholdAtHigherSingleRate]=useState(false);

  const annualGross=hourly?Math.max(0,hourlyRate)*(Math.max(0,hours)+Math.max(0,overtime)*1.5)*Math.max(0,weeks):Math.max(0,salary);
  const result=useMemo(()=>calculatePaycheck({
    grossAnnual:annualGross,frequency,status,state,retirementPercent:retirement,preTaxPerPaycheck:preTax,
    additionalFederalPerPaycheck:additional,stateAllowances:allowances,electedStateRatePercent:electedStateRate,
    localRatePercent:localRate,annualStateAllowance:iowaAnnualAllowance,spouseWorks,
    claimStateStandardDeduction:claimLouisianaDeduction,alabamaStatus,dependentAllowances,
    adoptedChildAllowances,additionalStatePerPaycheck:additionalState,reducedStatePerPaycheck:reducedState,
    stateAdjustmentAnnual:state==="CO"?coloradoAdjustment:undefined,statePayDate,
    employeePremiumRatePercent:employeePremiumRate,stateProgramPerPaycheck:stateProgramDeduction,
    blindExemptions,stateWithholdingCode:state==="CT"&&ctCode!=="none"?ctCode:undefined,
    annualHours:state==="OR"?(hourly?(Math.max(0,hours)+Math.max(0,overtime))*Math.max(0,weeks):oregonHours):undefined,
    wbfEmployeeCentsPerHour:wbfEmployeeCents,hasStateWithholdingForm,schoolDistrictRatePercent:schoolDistrictRate,
    withholdAtHigherSingleRate,
  }),[annualGross,frequency,status,state,retirement,preTax,additional,allowances,electedStateRate,localRate,iowaAnnualAllowance,spouseWorks,claimLouisianaDeduction,alabamaStatus,dependentAllowances,adoptedChildAllowances,additionalState,reducedState,coloradoAdjustment,statePayDate,employeePremiumRate,stateProgramDeduction,blindExemptions,ctCode,hourly,hours,overtime,weeks,oregonHours,wbfEmployeeCents,hasStateWithholdingForm,schoolDistrictRate,withholdAtHigherSingleRate]);

  const changeState=(next:SupportedState)=>{
    setStateQuery(supportedStates.find(item=>item.code===next)?.name??next);
    setStateSearchOpen(false);
    if(navigateOnStateChange){
      const slug=next==="NYC"?"nyc":supportedStates.find(item=>item.code===next)?.name.toLowerCase().replaceAll(" ","-");
      window.location.href=`/${slug}-paycheck-calculator`;
      return;
    }
    setState(next);
    setAllowances(0);
    setLocalRate(initialLocalRate(next));
    setElectedStateRate(2);
    setCtCode("none");
    setStatePayDate(initialStateDate(next));
    setIowaAnnualAllowance(0);
    setSpouseWorks(true);
    setClaimLouisianaDeduction(true);
    setAlabamaStatus(status==="married"?"married":status==="head"?"head":"single");
    setDependentAllowances(0);
    setAdoptedChildAllowances(0);
    setAdditionalState(0);
    setReducedState(0);
    setColoradoAdjustment(status==="married"?11000:5500);
    setEmployeePremiumRate(initialPremiumRate(next));
    setStateProgramDeduction(0);
    setBlindExemptions(0);
    setOregonHours(2080);
    setWbfEmployeeCents(.9);
    setHasStateWithholdingForm(true);
    setSchoolDistrictRate(0);
    setWithholdAtHigherSingleRate(false);
  };

  const changeStatus=(next:FilingStatus)=>{
    setStatus(next);
    if(state==="AL")setAlabamaStatus(next==="married"?"married":next==="head"?"head":"single");
    if(state==="CO")setColoradoAdjustment(next==="married"?11000:5500);
  };

  const per=(value:number)=>value/result.periods;
  const taxes=result.federal+result.socialSecurity+result.medicare+result.stateIncomeTax+result.statePayrollPremiums;
  const netShare=result.grossAnnual?result.netAnnual/result.grossAnnual*100:0;
  const taxShare=result.grossAnnual?taxes/result.grossAnnual*100:0;
  const deductionShare=Math.max(0,100-netShare-taxShare);
  const stateName=supportedStates.find(item=>item.code===state)?.name;
  const filteredStates=supportedStates.filter(item=>{
    const query=stateQuery.trim().toLowerCase();
    return !query||item.name.toLowerCase().includes(query)||item.code.toLowerCase().includes(query);
  });
  const allowanceLabel:Partial<Record<SupportedState,string>>={DC:"D-4 allowances",DE:"W-4 exemptions ($110 credit each)",ME:"W-4ME allowances",MS:"89-350 dependents",RI:"RI W-4 exemptions",VT:"W-4VT allowances",WV:"IT-104 exemptions",AL:"AL dependent exemptions",AR:"AR4EC exemptions",CA:"DE 4 allowances",GA:"Georgia dependents",HI:"HW-4 allowances",ID:"ID-W-4 allowances",IL:"IL-W-4 allowances",IN:"WH-4 personal exemptions",KS:"Kansas dependents",MA:"Massachusetts exemptions",MD:"Maryland exemptions",MI:"Michigan exemptions",MN:"Minnesota allowances",NC:"NC-4 allowances",NE:"W-4N allowances",NJ:"NJ exemptions",NY:"IT-2104 allowances",NYC:"IT-2104 allowances",OH:"Ohio IT 4 exemptions",OK:"OK-W-4 allowances",OR:"Oregon allowances",SC:"SC W-4 allowances",VA:"Virginia exemptions",WI:"WT-4 exemptions"};
  const localLabel=state==="MD"?"Maryland county rate (%)":state==="IN"?"Indiana county rate (%)":state==="OH"?"Ohio municipal planning rate (%)":state==="MI"?"Michigan city planning rate (%)":state==="KY"?"Kentucky local occupational rate (%)":state==="MO"?"KC / St. Louis earnings rate (%)":state==="PA"?"Pennsylvania local EIT rate (%)":"Alabama occupational rate (%)";

  return <div className="calculator national-calculator" id="calculator">
    <section className="inputs">
      <div className="section-heading"><span className="step">1</span><div><p className="panel-title">Your pay details{headingSuffix}</p><p>Adjust the fields; results update instantly.</p></div></div>
      <label className="field"><span>State or location</span><div className="state-combobox" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){setStateSearchOpen(false);setStateQuery(stateName??"");}}}><input type="search" role="combobox" aria-autocomplete="list" aria-controls={stateListId} aria-expanded={stateSearchOpen} aria-label="Search state or location" placeholder="Search by state name or abbreviation" value={stateQuery} onFocus={event=>{event.currentTarget.select();setStateSearchOpen(true);}} onChange={event=>{setStateQuery(event.target.value);setStateSearchOpen(true);}} onKeyDown={event=>{if(event.key==="Escape"){setStateQuery(stateName??"");setStateSearchOpen(false);event.currentTarget.blur();}else if(event.key==="Enter"&&stateSearchOpen&&filteredStates.length){event.preventDefault();changeState(filteredStates[0].code);}}}/>{stateSearchOpen&&<div className="state-search-results" id={stateListId} role="listbox">{filteredStates.length?filteredStates.map(item=><button type="button" role="option" aria-selected={item.code===state} className={item.code===state?"selected":""} key={item.code} onClick={()=>changeState(item.code)}><span>{item.name}</span><small>{item.code}</small></button>):<p>No matching state or location.</p>}</div>}</div><small>Type a state name or abbreviation, then select from all 52 location engines.</small></label>
      {hourly?<><div className="split-fields"><NumberField label="Hourly rate" value={hourlyRate} setValue={setHourlyRate}/><NumberField label="Regular hours / week" value={hours} setValue={setHours} currency={false}/></div><div className="split-fields"><NumberField label="Overtime hours / week" value={overtime} setValue={setOvertime} currency={false}/><NumberField label="Paid weeks / year" value={weeks} setValue={setWeeks} currency={false}/></div></>:<NumberField label="Annual gross salary" value={salary} setValue={setSalary}/>} 
      <div className="field"><span>Pay frequency</span><div className="frequency-grid">{(Object.keys(PAY_PERIODS) as PayFrequency[]).map(item=><button key={item} className={frequency===item?"active":""} onClick={()=>setFrequency(item)} type="button">{item==="biweekly"?"Bi-weekly pay":item==="semimonthly"?"Semi-monthly":item[0].toUpperCase()+item.slice(1)}<small>{PAY_PERIODS[item]}× / year</small></button>)}</div></div>
      <label className="field"><span>Federal filing status</span><select value={status} onChange={event=>changeStatus(event.target.value as FilingStatus)}><option value="single">Single or married filing separately</option><option value="married">Married filing jointly</option><option value="head">Head of household</option></select></label>
      <div className="split-fields"><NumberField label="401(k) contribution (%)" value={retirement} setValue={setRetirement} currency={false}/><NumberField label="Other pre-tax / paycheck" value={preTax} setValue={setPreTax}/></div>
      <div className="split-fields">{allowanceStates.has(state)&&<NumberField label={allowanceLabel[state]??"State allowances / exemptions"} value={allowances} setValue={setAllowances} currency={false}/>}<NumberField label="Extra federal / paycheck" value={additional} setValue={setAdditional}/></div>

      {state==="AL"&&<label className="field"><span>Alabama A-4 status</span><select value={alabamaStatus} onChange={event=>setAlabamaStatus(event.target.value as AlabamaWithholdingStatus)}><option value="single">S — Single</option><option value="marriedSeparate">MS — Married filing separately</option><option value="married">M — Married</option><option value="head">H — Head of family</option><option value="zero">0 — No exemptions / no valid form</option></select></label>}
      {state==="AZ"&&<><label className="field"><span>AZ A-4 withholding election</span><select value={electedStateRate} onChange={event=>setElectedStateRate(Number(event.target.value))}>{[0,.5,1,1.5,2,2.5,3,3.5].map(rate=><option key={rate} value={rate}>{rate.toFixed(1)}%</option>)}</select><small>Choose 0% only when the employee qualifies and elects exemption.</small></label><NumberField label="Additional Arizona / paycheck" value={additionalState} setValue={setAdditionalState}/></>}
      {state==="CO"&&<div className="split-fields"><NumberField label="DR 0004 annual adjustment" value={coloradoAdjustment} setValue={setColoradoAdjustment}/><NumberField label="Additional Colorado / paycheck" value={additionalState} setValue={setAdditionalState}/></div>}
      {state==="CT"&&<><label className="field"><span>CT-W4 withholding code</span><select value={ctCode} onChange={event=>setCtCode(event.target.value as ConnecticutWithholdingCode|"none")}><option value="none">No CT-W4 — withhold 6.99%</option><option value="A">A — separate / working-spouse situation</option><option value="B">B — head of household</option><option value="C">C — joint, spouse not employed</option><option value="D">D — significant other income</option><option value="E">E — qualified exemption</option><option value="F">F — single</option></select><small>Use the exact code printed on the current CT-W4; it cannot be inferred safely from federal status.</small></label><div className="split-fields"><NumberField label="CT-W4 line 2 / paycheck" value={additionalState} setValue={setAdditionalState}/><NumberField label="CT-W4 line 3 reduction / paycheck" value={reducedState} setValue={setReducedState}/></div></>}
      {state==="GA"&&<label className="field"><span>Georgia paycheck date</span><input type="date" min="2026-01-01" max="2026-12-31" value={statePayDate} onChange={event=>setStatePayDate(event.target.value)}/><small>Georgia’s withholding rate changes on May 11, 2026.</small></label>}
      {state==="HI"&&<NumberField label="Actual TDI / health plan deductions per paycheck" value={stateProgramDeduction} setValue={setStateProgramDeduction} help="Optional: copy the employer-plan amount from a pay stub; no universal deduction applies."/>}
      {state==="IN"&&<div className="split-fields"><NumberField label="Dependents / first-time dependents" value={dependentAllowances} setValue={setDependentAllowances} currency={false}/><NumberField label="Adopted child exemptions" value={adoptedChildAllowances} setValue={setAdoptedChildAllowances} currency={false}/></div>}
      {state==="IA"&&<NumberField label="IA W-4 annual allowance (W)" value={iowaAnnualAllowance} setValue={setIowaAnnualAllowance} help="Enter the annual dollar allowance from the current IA W-4, not a count."/>}
      {status==="married"&&(["GA","IA","MO","MS"] as SupportedState[]).includes(state)&&<CheckboxField label="Spouse also has wage income" checked={spouseWorks} setChecked={setSpouseWorks}/>} 
      {state==="LA"&&<CheckboxField label="Claim the L-4 standard deduction" checked={claimLouisianaDeduction} setChecked={setClaimLouisianaDeduction}/>} 
      {state==="MA"&&<div className="split-fields"><NumberField label="Blindness exemptions" value={blindExemptions} setValue={setBlindExemptions} currency={false}/><NumberField label="Employee PFML share (%)" value={employeePremiumRate} setValue={setEmployeePremiumRate} currency={false} step={.01} help="Maximum permitted employee share is 0.46%."/></div>}
      {state==="MN"&&<NumberField label="Employee Paid Leave share (%)" value={employeePremiumRate} setValue={setEmployeePremiumRate} currency={false} step={.01} help="Maximum permitted employee share is 0.44%."/>}
      {state==="OH"&&<><label className="field"><span>Ohio paycheck date</span><input type="date" min="2026-01-01" max="2026-12-31" value={statePayDate} onChange={event=>setStatePayDate(event.target.value)}/><small>Ohio rates change for pay dates on or after August 1, 2026.</small></label><div className="split-fields"><NumberField label="School-district planning rate (%)" value={schoolDistrictRate} setValue={setSchoolDistrictRate} currency={false} step={.01}/><NumberField label="Additional Ohio / paycheck" value={additionalState} setValue={setAdditionalState}/></div></>}
      {state==="OK"&&<><>{status==="married"&&<CheckboxField label="Withhold at the higher Single rate" checked={withholdAtHigherSingleRate} setChecked={setWithholdAtHigherSingleRate}/>}</><NumberField label="Additional Oklahoma / paycheck" value={additionalState} setValue={setAdditionalState}/></>}
      {state==="WV"&&<CheckboxField label="Use two-earner / two-or-more-jobs table (IT-104 default)" checked={hasStateWithholdingForm} setChecked={setHasStateWithholdingForm}/>}
      {state==="OR"&&<><CheckboxField label="Valid OR-W-4 on file" checked={hasStateWithholdingForm} setChecked={setHasStateWithholdingForm}/><NumberField label="Employee Paid Leave share (%)" value={employeePremiumRate} setValue={setEmployeePremiumRate} currency={false} step={.01} help="Maximum permitted employee share is 0.60%."/><div className="split-fields">{!hourly&&<NumberField label="WBF covered hours / year" value={oregonHours} setValue={setOregonHours} currency={false}/>}<NumberField label="Employee WBF cents / hour" value={wbfEmployeeCents} setValue={setWbfEmployeeCents} currency={false} step={.1} help="Default 0.9¢; an employer may pay more of the 1.8¢ total."/></div><NumberField label="Additional Oregon / paycheck" value={additionalState} setValue={setAdditionalState}/></>}
      {state==="UT"&&<label className="field"><span>Utah pay-period start date</span><input type="date" min="2026-01-01" max="2026-12-31" value={statePayDate} onChange={event=>setStatePayDate(event.target.value)}/><small>Utah’s new table applies to pay periods beginning June 1, 2026 or later.</small></label>}
      {state==="VA"&&<div className="split-fields"><NumberField label="VA-4 age 65 / blind exemptions" value={blindExemptions} setValue={setBlindExemptions} currency={false}/><NumberField label="Additional Virginia / paycheck" value={additionalState} setValue={setAdditionalState}/></div>}
      {state==="WI"&&<div className="split-fields"><NumberField label="WT-4 additional / paycheck" value={additionalState} setValue={setAdditionalState}/><NumberField label="WT-4A reduction / paycheck" value={reducedState} setValue={setReducedState}/></div>}
      {localRateStates.has(state)&&<NumberField label={localLabel} value={localRate} setValue={setLocalRate} currency={false} step={.01} help={state==="MD"?"3.20% is a planning default; replace it with the applicable county rate.":"Enter the applicable local rate. Fixed fees and address rules are not inferred."}/>} 
    </section>

    <section className="results" aria-live="polite">
      <div className="section-heading light"><span className="step">2</span><div><p className="panel-title">Estimated take-home pay{headingSuffix}</p><p>2026 source-backed withholding methods.</p></div></div>
      <div className="net-amount"><span>NET PAY · {frequency.toUpperCase()}</span><strong>{money.format(per(result.netAnnual))}</strong><small>{wholeMoney.format(result.netAnnual)} per year</small></div>
      <div className="bar"><span style={{width:`${netShare}%`}}/><span style={{width:`${taxShare}%`}}/><span style={{width:`${deductionShare}%`}}/></div><div className="legend"><span><i className="net-dot"/>Take-home {netShare.toFixed(0)}%</span><span><i className="tax-dot"/>Taxes {taxShare.toFixed(0)}%</span><span><i className="deduction-dot"/>Deductions {deductionShare.toFixed(0)}%</span></div>
      <div className="breakdown"><div><span>Gross pay</span><b>{money.format(per(result.grossAnnual))}</b></div><div><span>Federal income tax</span><b>−{money.format(per(result.federal))}</b></div><div><span>Social Security</span><b>−{money.format(per(result.socialSecurity))}</b></div><div><span>Medicare</span><b>−{money.format(per(result.medicare))}</b></div><div><span>{stateName} income tax</span><b>−{money.format(per(result.stateIncomeTax))}</b></div>{result.statePayrollPremiums>0&&<div><span>State payroll programs</span><b>−{money.format(per(result.statePayrollPremiums))}</b></div>}<div><span>Pre-tax deductions</span><b>−{money.format(per(result.preTaxAnnual))}</b></div></div>
      <div className="result-note"><span>ⓘ</span><p>{result.stateMethod}. <button type="button" className="note-toggle" aria-expanded={assumptionsOpen} onClick={()=>setAssumptionsOpen(open=>!open)}>{assumptionsOpen?"Hide assumptions":"Assumptions"}</button></p></div>
      {/* Rendered only after the click so the shared assumption text is not part of every page's server HTML */}
      {assumptionsOpen&&<div className="result-note assumptions" role="note"><p>Assumes a current federal W-4 with Step 2 unchecked and no credits. Address-specific local taxes are included only from the rate you enter; fixed local fees and employer-specific rules remain excluded. See the <a className="text-link" href="/methodology">methodology and source list</a>.</p></div>}
    </section>
  </div>;
}

function NumberField({label,value,setValue,currency=true,step=1,help}:{label:string;value:number;setValue:(value:number)=>void;currency?:boolean;step?:number;help?:string}) {return <label className="field"><span>{label}</span><div className="money-input">{currency&&<span>$</span>}<input type="number" min="0" step={step} value={value} onChange={event=>setValue(Number(event.target.value))}/></div>{help&&<small>{help}</small>}</label>}
function CheckboxField({label,checked,setChecked}:{label:string;checked:boolean;setChecked:(value:boolean)=>void}){return <label className="field checkbox-field"><span>{label}</span><input type="checkbox" checked={checked} onChange={event=>setChecked(event.target.checked)}/></label>}
