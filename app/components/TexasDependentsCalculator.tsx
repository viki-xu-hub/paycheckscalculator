"use client";

import { useMemo, useState } from "react";
import { calculatePaycheck, money, wholeMoney, PAY_PERIODS, type FilingStatus, type PayFrequency } from "../lib/payroll";
import {
  dependentCreditAnnual,
  dependentCreditLimit,
  OTHER_DEPENDENT_CREDIT,
  QUALIFYING_CHILD_CREDIT,
} from "../lib/paycheckExtras";

export default function TexasDependentsCalculator() {
  const [salary, setSalary] = useState(75000);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("married");
  const [children, setChildren] = useState(1);
  const [otherDependents, setOtherDependents] = useState(0);
  const [retirement, setRetirement] = useState(5);
  const [preTax, setPreTax] = useState(150);

  const periods = PAY_PERIODS[frequency];

  const base = useMemo(
    () =>
      calculatePaycheck({
        grossAnnual: salary,
        frequency,
        status,
        state: "TX",
        retirementPercent: retirement,
        preTaxPerPaycheck: preTax,
      }),
    [salary, frequency, status, retirement, preTax],
  );

  const { credit, claimed, overLimit } = dependentCreditAnnual({
    qualifyingChildren: children,
    otherDependents,
    annualIncome: salary,
    status,
  });

  const federalAfterCredit = Math.max(0, base.federal - credit);
  const creditApplied = base.federal - federalAfterCredit;
  const netAnnual = base.netAnnual + creditApplied;

  return (
    <div className="calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <h2>Your pay and dependents</h2>
            <p>Enter the dependents you claim on Step 3 of your W-4.</p>
          </div>
        </div>

        <MoneyField label="Annual gross salary" value={salary} setValue={setSalary} step={1000} />

        <div className="split-fields">
          <MoneyField label="Qualifying children under 17" value={children} setValue={setChildren} currency={false} />
          <MoneyField label="Other dependents" value={otherDependents} setValue={setOtherDependents} currency={false} />
        </div>

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

        <label className="field">
          <span>Federal filing status</span>
          <select value={status} onChange={event => setStatus(event.target.value as FilingStatus)}>
            <option value="single">Single or married filing separately</option>
            <option value="married">Married filing jointly</option>
            <option value="head">Head of household</option>
          </select>
        </label>

        <div className="split-fields">
          <MoneyField label="401(k) contribution (%)" value={retirement} setValue={setRetirement} currency={false} />
          <MoneyField label="Other pre-tax / paycheck" value={preTax} setValue={setPreTax} />
        </div>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <h2>Take-home pay with dependents</h2>
            <p>Texas withholds no state income tax on wages.</p>
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
            <b>{money.format(creditApplied / periods)}</b>
          </div>
        </div>

        <div className="breakdown">
          <div><span>Gross pay</span><b>{money.format(base.grossAnnual / periods)}</b></div>
          <div><span>Federal tax before dependents</span><b>−{money.format(base.federal / periods)}</b></div>
          <div><span>Dependent credit applied</span><b>+{money.format(creditApplied / periods)}</b></div>
          <div><span>Federal tax withheld</span><b>−{money.format(federalAfterCredit / periods)}</b></div>
          <div><span>Social Security</span><b>−{money.format(base.socialSecurity / periods)}</b></div>
          <div><span>Medicare</span><b>−{money.format(base.medicare / periods)}</b></div>
          <div><span>Texas state income tax</span><b>$0</b></div>
          <div><span>Pre-tax deductions</span><b>−{money.format(base.preTaxAnnual / periods)}</b></div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            {overLimit
              ? `Step 3 of the W-4 asks you to claim dependents only when total income will be under ${wholeMoney.format(dependentCreditLimit(status))} for your filing status, so no credit is applied at this salary.`
              : `Step 3 counts ${wholeMoney.format(QUALIFYING_CHILD_CREDIT)} per qualifying child under 17 and ${wholeMoney.format(OTHER_DEPENDENT_CREDIT)} per other dependent. Payroll spreads that total across your ${periods} paychecks.`}
            {federalAfterCredit === 0 && credit > 0 && " Federal withholding cannot go below zero, so part of the credit is claimed on your tax return instead."}
          </p>
        </div>
      </section>
    </div>
  );
}

function MoneyField({
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
