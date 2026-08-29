"use client";

import { useMemo, useState } from "react";
import { calculatePaycheck, money, wholeMoney, PAY_PERIODS, type FilingStatus, type PayFrequency } from "../lib/payroll";
import { texasChildSupport, TX_NET_RESOURCES_CAP_MONTHLY } from "../lib/paycheckExtras";

export default function TexasChildSupportCalculator() {
  const [salary, setSalary] = useState(75000);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [children, setChildren] = useState(1);
  const [status, setStatus] = useState<FilingStatus>("single");
  const [unionDues, setUnionDues] = useState(0);
  const [childInsurance, setChildInsurance] = useState(0);

  const periods = PAY_PERIODS[frequency];

  const paycheck = useMemo(
    () => calculatePaycheck({ grossAnnual: salary, frequency, status, state: "TX" }),
    [salary, frequency, status],
  );

  const disposableEarningsAnnual = Math.max(
    0,
    salary - paycheck.federal - paycheck.socialSecurity - paycheck.medicare,
  );

  const support = useMemo(
    () =>
      texasChildSupport({
        annualGross: salary,
        frequency,
        children,
        unionDuesPerPaycheck: unionDues,
        childInsurancePerPaycheck: childInsurance,
        disposableEarningsAnnual,
      }),
    [salary, frequency, children, unionDues, childInsurance, disposableEarningsAnnual],
  );

  const netBefore = paycheck.netAnnual / periods - unionDues - childInsurance;
  const netAfter = Math.max(0, netBefore - support.appliedPerPaycheck);

  return (
    <div className="calculator" id="calculator">
      <section className="inputs">
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <h2>Your pay and support order</h2>
            <p>Guideline support is based on monthly net resources.</p>
          </div>
        </div>

        <MoneyField label="Annual gross pay" value={salary} setValue={setSalary} step={1000} />

        <label className="field">
          <span>Children in this support order</span>
          <select value={children} onChange={event => setChildren(Number(event.target.value))}>
            <option value={1}>1 child — 20% of net resources</option>
            <option value={2}>2 children — 25%</option>
            <option value={3}>3 children — 30%</option>
            <option value={4}>4 children — 35%</option>
            <option value={5}>5 children — 40%</option>
            <option value={6}>6 or more children — not less than 40%</option>
          </select>
        </label>

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

        <div className="split-fields">
          <MoneyField label="Child's health / dental premium per paycheck" value={childInsurance} setValue={setChildInsurance} />
          <MoneyField label="Union dues per paycheck" value={unionDues} setValue={setUnionDues} />
        </div>

        <label className="field">
          <span>Federal filing status on your W-4</span>
          <select value={status} onChange={event => setStatus(event.target.value as FilingStatus)}>
            <option value="single">Single or married filing separately</option>
            <option value="married">Married filing jointly</option>
            <option value="head">Head of household</option>
          </select>
          <small>Used for your paycheck withholding. Net resources always use the single-filer rate required by statute.</small>
        </label>
      </section>

      <section className="results" aria-live="polite">
        <div className="section-heading light">
          <span className="step">2</span>
          <div>
            <h2>Paycheck after child support</h2>
            <p>Texas guideline percentages, 2026 federal withholding.</p>
          </div>
        </div>

        <div className="net-amount">
          <span>TAKE-HOME · {frequency.toUpperCase()}</span>
          <strong>{money.format(netAfter)}</strong>
          <small>after {money.format(support.appliedPerPaycheck)} withheld for support</small>
        </div>

        <div className="mini-stats">
          <div>
            <span>Monthly net resources</span>
            <b>{wholeMoney.format(support.netResourcesMonthly)}</b>
          </div>
          <div>
            <span>Monthly support</span>
            <b>{wholeMoney.format(support.supportMonthly)}</b>
          </div>
        </div>

        <div className="breakdown">
          <div><span>Gross pay</span><b>{money.format(salary / periods)}</b></div>
          <div><span>Federal income tax</span><b>−{money.format(paycheck.federal / periods)}</b></div>
          <div><span>Social Security + Medicare</span><b>−{money.format((paycheck.socialSecurity + paycheck.medicare) / periods)}</b></div>
          <div><span>Texas state income tax</span><b>$0</b></div>
          <div><span>Child&apos;s insurance + union dues</span><b>−{money.format(childInsurance + unionDues)}</b></div>
          <div><span>Child support withheld</span><b>−{money.format(support.appliedPerPaycheck)}</b></div>
          <div><span>Take-home pay</span><b>{money.format(netAfter)}</b></div>
        </div>

        <div className="breakdown">
          <div><span>Guideline percentage</span><b>{(support.percent * 100).toFixed(0)}%</b></div>
          <div><span>Net resources used</span><b>{wholeMoney.format(support.cappedMonthly)} / month</b></div>
          <div><span>50% withholding ceiling</span><b>{money.format(support.withholdingCeiling)}</b></div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            {support.capApplies &&
              `Guideline support applies to the first ${wholeMoney.format(TX_NET_RESOURCES_CAP_MONTHLY)} of monthly net resources, so the amount above that is not counted here. `}
            {support.limitedByFiftyPercentRule &&
              "Texas caps income withholding at 50% of disposable earnings, so the withheld amount is lower than the guideline amount and arrears may build. "}
            This is an estimate of guideline support. Only a court order or the Office of the Attorney General
            sets the amount your employer must withhold, and a court can order more or less than the guideline.
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
  step = 1,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="money-input">
        <span>$</span>
        <input type="number" min="0" step={step} value={value} onChange={event => setValue(Number(event.target.value))} />
      </div>
    </label>
  );
}
