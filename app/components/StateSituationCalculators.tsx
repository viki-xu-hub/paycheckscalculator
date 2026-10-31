"use client";

import { useMemo, useState } from "react";
import { calculatePaycheck, money, wholeMoney, PAY_PERIODS, type FilingStatus, type PayFrequency } from "../lib/payroll";
import {
  bonusAggregateMethod,
  bonusFlatMethod,
  dependentCreditAnnual,
  dependentCreditLimit,
  OTHER_DEPENDENT_CREDIT,
  QUALIFYING_CHILD_CREDIT,
  stateBonusWithholding,
  supportWithholding,
  withStateBonusTax,
} from "../lib/paycheckExtras";
import { situationStateByCode } from "../lib/stateSituations";

type Method = "flat" | "aggregate";

/* ------------------------------------------------------------------ Bonus */

export function StateBonusCalculator({ stateCode }: { stateCode: string }) {
  const config = situationStateByCode[stateCode];
  const state = config.code;
  const [salary, setSalary] = useState(75000);
  const [bonus, setBonus] = useState(5000);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [retirement, setRetirement] = useState(5);
  const [preTax, setPreTax] = useState(150);
  const [allowances, setAllowances] = useState(config.dependents.defaultPersonal);
  const [method, setMethod] = useState<Method>("flat");

  const periods = PAY_PERIODS[frequency];

  const regular = useMemo(
    () =>
      calculatePaycheck({
        grossAnnual: salary,
        frequency,
        status,
        state,
        retirementPercent: retirement,
        preTaxPerPaycheck: preTax,
        stateAllowances: allowances,
      }),
    [salary, frequency, status, state, retirement, preTax, allowances],
  );

  const annualPreTax = regular.preTaxAnnual;
  const stateInput = { state, supplementalRate: config.bonus.supplementalRate, bonus, regularAnnualWages: salary, annualPreTax, frequency, status, stateAllowances: allowances };

  const flat = withStateBonusTax(
    bonusFlatMethod({ bonus, regularAnnualWages: salary }),
    stateBonusWithholding({ ...stateInput, method: "flat" }),
  );
  const aggregate = withStateBonusTax(
    bonusAggregateMethod({ bonus, regularAnnualWages: salary, annualPreTax, frequency, status }),
    stateBonusWithholding({ ...stateInput, method: "aggregate" }),
  );

  const active = method === "flat" ? flat : aggregate;
  const regularNetPerPaycheck = regular.netAnnual / periods;
  const difference = flat.net - aggregate.net;

  return (
    <div className="calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <h2>Your pay and bonus</h2>
            <p>Keep the bonus separate from your regular salary.</p>
          </div>
        </div>

        <div className="split-fields">
          <NumberField label="Annual gross salary" value={salary} setValue={setSalary} step={1000} />
          <NumberField label="Bonus amount" value={bonus} setValue={setBonus} step={500} />
        </div>

        <FrequencyPicker frequency={frequency} setFrequency={setFrequency} />

        <div className="field">
          <span>How is the bonus paid?</span>
          <div className="frequency-grid">
            <button type="button" className={method === "flat" ? "active" : ""} onClick={() => setMethod("flat")}>
              Separate check
              <small>Flat 22% federal method</small>
            </button>
            <button type="button" className={method === "aggregate" ? "active" : ""} onClick={() => setMethod("aggregate")}>
              Added to a paycheck
              <small>Aggregate method</small>
            </button>
          </div>
        </div>

        <StatusSelect status={status} setStatus={setStatus} />

        {config.dependents.formName && (
          <NumberField
            label={`${config.dependents.formName} ${config.dependents.unit} (total)`}
            value={allowances}
            setValue={setAllowances}
            currency={false}
          />
        )}

        <div className="split-fields">
          <NumberField label="401(k) contribution (%)" value={retirement} setValue={setRetirement} currency={false} />
          <NumberField label="Other pre-tax / paycheck" value={preTax} setValue={setPreTax} />
        </div>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <h2>Bonus take-home pay</h2>
            <p>{method === "flat" ? `22% federal + ${config.bonus.rateLabel}.` : "Withheld by annualizing the combined paycheck."}</p>
          </div>
        </div>

        <div className="net-amount">
          <span>BONUS AFTER WITHHOLDING</span>
          <strong>{wholeMoney.format(active.net)}</strong>
          <small>{active.effectiveRate.toFixed(1)}% of the bonus withheld</small>
        </div>

        <div className="mini-stats">
          <div>
            <span>Regular {frequency} net</span>
            <b>{money.format(regularNetPerPaycheck)}</b>
          </div>
          <div>
            <span>Paycheck with bonus</span>
            <b>{money.format(regularNetPerPaycheck + active.net)}</b>
          </div>
        </div>

        <div className="breakdown">
          <div><span>Bonus gross</span><b>{wholeMoney.format(active.bonus)}</b></div>
          <div><span>Federal income tax withheld</span><b>−{money.format(active.federal)}</b></div>
          <div><span>Social Security</span><b>−{money.format(active.socialSecurity)}</b></div>
          <div><span>Medicare</span><b>−{money.format(active.medicare)}</b></div>
          <div><span>{config.name} state income tax</span><b>{active.stateIncomeTax > 0 ? `−${money.format(active.stateIncomeTax)}` : "$0"}</b></div>
          <div><span>Bonus take-home</span><b>{wholeMoney.format(active.net)}</b></div>
        </div>

        <div className="breakdown">
          <div><span>Separate check (flat)</span><b>{wholeMoney.format(flat.net)}</b></div>
          <div><span>Aggregate method</span><b>{wholeMoney.format(aggregate.net)}</b></div>
          <div>
            <span>Difference</span>
            <b>{Math.round(difference) === 0 ? "$0" : `${difference > 0 ? "+" : "−"}${wholeMoney.format(Math.abs(difference))}`}</b>
          </div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            Withholding is not your final tax. The method your employer uses changes the size of your bonus check,
            not the tax you owe when you file.
            {config.code === "OH" && " Ohio city and school district income taxes are not included here."}
            {config.noIncomeTax && ` ${config.name} withholds no state income tax on wages.`}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------- Dependents */

export function StateDependentsCalculator({ stateCode }: { stateCode: string }) {
  const config = situationStateByCode[stateCode];
  const state = config.code;
  const hasStateForm = config.dependents.formName !== null;
  const [salary, setSalary] = useState(75000);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("married");
  const [children, setChildren] = useState(1);
  const [otherDependents, setOtherDependents] = useState(0);
  const [personal, setPersonal] = useState(config.dependents.defaultPersonal);
  const [retirement, setRetirement] = useState(5);
  const [preTax, setPreTax] = useState(150);

  const periods = PAY_PERIODS[frequency];
  const dependentCount = Math.max(0, Math.floor(children)) + Math.max(0, Math.floor(otherDependents));

  const common = { grossAnnual: salary, frequency, status, state, retirementPercent: retirement, preTaxPerPaycheck: preTax };
  const base = calculatePaycheck({ ...common, stateAllowances: personal });
  const withDependents = calculatePaycheck({ ...common, stateAllowances: personal + (hasStateForm ? dependentCount : 0) });

  const { credit, claimed, overLimit } = dependentCreditAnnual({
    qualifyingChildren: children,
    otherDependents,
    annualIncome: salary,
    status,
  });

  const federalAfterCredit = Math.max(0, base.federal - credit);
  const federalSaved = base.federal - federalAfterCredit;
  const stateSaved = Math.max(0, base.stateIncomeTax - withDependents.stateIncomeTax);
  const netAnnual = withDependents.netAnnual + federalSaved;

  return (
    <div className="calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <h2>Your pay and dependents</h2>
            <p>
              {hasStateForm
                ? `Dependents count on the federal W-4 and on ${config.name} Form ${config.dependents.formName}.`
                : "Enter the dependents you claim on Step 3 of your W-4."}
            </p>
          </div>
        </div>

        <NumberField label="Annual gross salary" value={salary} setValue={setSalary} step={1000} />

        <div className="split-fields">
          <NumberField label="Qualifying children under 17" value={children} setValue={setChildren} currency={false} />
          <NumberField label="Other dependents" value={otherDependents} setValue={setOtherDependents} currency={false} />
        </div>

        <FrequencyPicker frequency={frequency} setFrequency={setFrequency} />
        <StatusSelect status={status} setStatus={setStatus} />

        {hasStateForm && (
          <NumberField label={config.dependents.personalLabel} value={personal} setValue={setPersonal} currency={false} />
        )}

        <div className="split-fields">
          <NumberField label="401(k) contribution (%)" value={retirement} setValue={setRetirement} currency={false} />
          <NumberField label="Other pre-tax / paycheck" value={preTax} setValue={setPreTax} />
        </div>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <h2>Take-home pay with dependents</h2>
            <p>{hasStateForm ? `Federal Step 3 credit plus ${config.dependents.formName} ${config.dependents.unit}.` : `${config.name} withholds no state income tax on wages.`}</p>
          </div>
        </div>

        <div className="net-amount">
          <span>NET PAY · {frequency.toUpperCase()}</span>
          <strong>{money.format(netAnnual / periods)}</strong>
          <small>{wholeMoney.format(netAnnual)} per year</small>
        </div>

        <div className="mini-stats">
          <div>
            <span>W-4 Step 3 amount</span>
            <b>{wholeMoney.format(claimed)}</b>
          </div>
          <div>
            <span>Added per paycheck</span>
            <b>{money.format((federalSaved + stateSaved) / periods)}</b>
          </div>
        </div>

        <div className="breakdown">
          <div><span>Gross pay</span><b>{money.format(base.grossAnnual / periods)}</b></div>
          <div><span>Federal tax before dependents</span><b>−{money.format(base.federal / periods)}</b></div>
          <div><span>Federal dependent credit</span><b>+{money.format(federalSaved / periods)}</b></div>
          <div><span>Social Security</span><b>−{money.format(base.socialSecurity / periods)}</b></div>
          <div><span>Medicare</span><b>−{money.format(base.medicare / periods)}</b></div>
          {hasStateForm ? (
            <>
              <div><span>{config.name} tax before dependents</span><b>−{money.format(base.stateIncomeTax / periods)}</b></div>
              <div><span>{config.dependents.formName} dependent savings</span><b>+{money.format(stateSaved / periods)}</b></div>
            </>
          ) : (
            <div><span>{config.name} state income tax</span><b>$0</b></div>
          )}
          <div><span>Pre-tax deductions</span><b>−{money.format(base.preTaxAnnual / periods)}</b></div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            {overLimit
              ? `Step 3 of the W-4 asks you to claim dependents only when total income will be under ${wholeMoney.format(dependentCreditLimit(status))} for your filing status, so no federal credit is applied at this salary.`
              : `Step 3 counts ${wholeMoney.format(QUALIFYING_CHILD_CREDIT)} per qualifying child under 17 and ${wholeMoney.format(OTHER_DEPENDENT_CREDIT)} per other dependent, spread across your ${periods} paychecks.`}
            {federalAfterCredit === 0 && credit > 0 && " Federal withholding cannot go below zero, so part of the credit is claimed on your tax return instead."}
            {hasStateForm &&
              ` Each ${config.dependents.formName} dependent removes ${wholeMoney.format(config.dependents.perDependent ?? 0)} from ${config.name}-taxable wages.`}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------- Child support */

export function StateChildSupportCalculator({ stateCode }: { stateCode: string }) {
  const config = situationStateByCode[stateCode];
  const state = config.code;
  const fee = config.childSupport.fee;
  const [salary, setSalary] = useState(75000);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [monthlySupport, setMonthlySupport] = useState(800);
  const [monthlyArrears, setMonthlyArrears] = useState(0);
  const [supportsOtherFamily, setSupportsOtherFamily] = useState(false);
  const [arrearsOverTwelveWeeks, setArrearsOverTwelveWeeks] = useState(false);

  const periods = PAY_PERIODS[frequency];

  const paycheck = useMemo(
    () => calculatePaycheck({ grossAnnual: salary, frequency, status, state, stateAllowances: config.dependents.defaultPersonal }),
    [salary, frequency, status, state, config.dependents.defaultPersonal],
  );

  // Disposable earnings: pay left after deductions required by law (taxes and FICA).
  const disposablePerPaycheck =
    Math.max(0, salary - paycheck.federal - paycheck.socialSecurity - paycheck.medicare - paycheck.stateIncomeTax - paycheck.statePayrollPremiums) / periods;

  const supportPerPaycheck = (Math.max(0, monthlySupport) + Math.max(0, monthlyArrears)) * 12 / periods;
  const processingPerPaycheck = fee?.kind === "percentOfSupport" ? supportPerPaycheck * fee.rate : 0;
  const orderedPerPaycheck = supportPerPaycheck + processingPerPaycheck;

  const limit = supportWithholding({ disposablePerPaycheck, orderedPerPaycheck, supportsOtherFamily, arrearsOverTwelveWeeks });

  const payorFeePerPaycheck =
    limit.applied <= 0 || !fee
      ? 0
      : fee.kind === "monthly"
        ? fee.amount * 12 / periods
        : fee.kind === "perDeduction"
          ? fee.after
          : 0;

  const netBefore = paycheck.netAnnual / periods;
  const netAfter = Math.max(0, netBefore - limit.applied - payorFeePerPaycheck);

  return (
    <div className="calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <h2>Your pay and support order</h2>
            <p>Enter the monthly amounts shown on your {config.name} order.</p>
          </div>
        </div>

        <NumberField label="Annual gross pay" value={salary} setValue={setSalary} step={1000} />

        <div className="split-fields">
          <NumberField label="Current support / month" value={monthlySupport} setValue={setMonthlySupport} step={25} />
          <NumberField label="Arrears payment / month" value={monthlyArrears} setValue={setMonthlyArrears} step={25} />
        </div>

        <FrequencyPicker frequency={frequency} setFrequency={setFrequency} />
        <StatusSelect status={status} setStatus={setStatus} />

        <div className="field">
          <span>Do you support another spouse or child?</span>
          <div className="frequency-grid">
            <button type="button" className={supportsOtherFamily ? "active" : ""} onClick={() => setSupportsOtherFamily(true)}>
              Yes<small>50% limit</small>
            </button>
            <button type="button" className={!supportsOtherFamily ? "active" : ""} onClick={() => setSupportsOtherFamily(false)}>
              No<small>60% limit</small>
            </button>
          </div>
        </div>

        <div className="field">
          <span>Is support more than 12 weeks behind?</span>
          <div className="frequency-grid">
            <button type="button" className={arrearsOverTwelveWeeks ? "active" : ""} onClick={() => setArrearsOverTwelveWeeks(true)}>
              Yes<small>+5 points</small>
            </button>
            <button type="button" className={!arrearsOverTwelveWeeks ? "active" : ""} onClick={() => setArrearsOverTwelveWeeks(false)}>
              No<small>Standard limit</small>
            </button>
          </div>
        </div>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <h2>Take-home pay after support</h2>
            <p>Taxes are figured on full gross pay before support is withheld.</p>
          </div>
        </div>

        <div className="net-amount">
          <span>NET PAY · {frequency.toUpperCase()}</span>
          <strong>{money.format(netAfter)}</strong>
          <small>{money.format(limit.applied + payorFeePerPaycheck)} withheld for support each paycheck</small>
        </div>

        <div className="mini-stats">
          <div>
            <span>Disposable earnings</span>
            <b>{money.format(disposablePerPaycheck)}</b>
          </div>
          <div>
            <span>Federal limit ({(limit.share * 100).toFixed(0)}%)</span>
            <b>{money.format(limit.ceiling)}</b>
          </div>
        </div>

        <div className="breakdown">
          <div><span>Gross pay</span><b>{money.format(salary / periods)}</b></div>
          <div><span>Federal income tax</span><b>−{money.format(paycheck.federal / periods)}</b></div>
          <div><span>Social Security + Medicare</span><b>−{money.format((paycheck.socialSecurity + paycheck.medicare) / periods)}</b></div>
          <div><span>{config.name} income tax</span><b>{paycheck.stateIncomeTax > 0 ? `−${money.format(paycheck.stateIncomeTax / periods)}` : "$0"}</b></div>
          <div><span>Support ordered</span><b>−{money.format(supportPerPaycheck)}</b></div>
          {fee?.kind === "percentOfSupport" && <div><span>{fee.label}</span><b>−{money.format(processingPerPaycheck)}</b></div>}
          {limit.limited && <div><span>Reduced to federal limit</span><b>+{money.format(limit.ordered - limit.applied)}</b></div>}
          {fee && fee.kind !== "percentOfSupport" && <div><span>{fee.label}</span><b>−{money.format(payorFeePerPaycheck)}</b></div>}
          <div><span>Take-home pay</span><b>{money.format(netAfter)}</b></div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            {limit.limited
              ? `Your order is more than ${(limit.share * 100).toFixed(0)}% of disposable earnings, so payroll can withhold only ${money.format(limit.applied)} per paycheck; the rest accrues as past-due support.`
              : `The order is within the federal limit of ${(limit.share * 100).toFixed(0)}% of disposable earnings, so the full amount is withheld.`}
            {fee?.kind === "perDeduction" && ` The first deduction may carry a $${fee.first} fee instead of $${fee.after}.`}
            {fee?.kind === "monthly" && ` The fee is shown spread across paychecks; employers usually take it once a month.`}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- Inputs */

function FrequencyPicker({ frequency, setFrequency }: { frequency: PayFrequency; setFrequency: (value: PayFrequency) => void }) {
  return (
    <div className="field">
      <span>Pay frequency</span>
      <div className="frequency-grid">
        {(Object.keys(PAY_PERIODS) as PayFrequency[]).map(item => (
          <button key={item} type="button" className={frequency === item ? "active" : ""} onClick={() => setFrequency(item)}>
            {item === "biweekly" ? "Bi-weekly pay" : item === "semimonthly" ? "Semi-monthly" : item[0].toUpperCase() + item.slice(1)}
            <small>{PAY_PERIODS[item]}× / year</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusSelect({ status, setStatus }: { status: FilingStatus; setStatus: (value: FilingStatus) => void }) {
  return (
    <label className="field">
      <span>Federal filing status</span>
      <select value={status} onChange={event => setStatus(event.target.value as FilingStatus)}>
        <option value="single">Single or married filing separately</option>
        <option value="married">Married filing jointly</option>
        <option value="head">Head of household</option>
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  setValue,
  currency = true,
  step = 1,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  currency?: boolean;
  step?: number;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="money-input">
        {currency && <span>$</span>}
        <input type="number" min="0" step={step} value={value} onChange={event => setValue(Number(event.target.value))} />
      </div>
    </label>
  );
}
