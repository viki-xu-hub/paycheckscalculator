"use client";

import { useMemo, useState } from "react";
import { calculatePaycheck, money, wholeMoney, PAY_PERIODS, type FilingStatus, type PayFrequency } from "../lib/payroll";
import { bonusAggregateMethod, bonusFlatMethod, SUPPLEMENTAL_FLAT_RATE } from "../lib/paycheckExtras";

type Method = "flat" | "aggregate";

export default function TexasBonusCalculator() {
  const [salary, setSalary] = useState(75000);
  const [bonus, setBonus] = useState(5000);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [retirement, setRetirement] = useState(5);
  const [preTax, setPreTax] = useState(150);
  const [method, setMethod] = useState<Method>("flat");

  const periods = PAY_PERIODS[frequency];

  const regular = useMemo(
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

  const annualPreTax = regular.preTaxAnnual;

  const flat = useMemo(
    () => bonusFlatMethod({ bonus, regularAnnualWages: salary }),
    [bonus, salary],
  );
  const aggregate = useMemo(
    () => bonusAggregateMethod({ bonus, regularAnnualWages: salary, annualPreTax, frequency, status }),
    [bonus, salary, annualPreTax, frequency, status],
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
            <h2>Your Texas pay and bonus</h2>
            <p>Keep the bonus separate from your regular salary.</p>
          </div>
        </div>

        <div className="split-fields">
          <MoneyField label="Annual gross salary" value={salary} setValue={setSalary} step={1000} />
          <MoneyField label="Bonus amount" value={bonus} setValue={setBonus} step={500} />
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

        <div className="field">
          <span>How is the bonus paid?</span>
          <div className="frequency-grid">
            <button type="button" className={method === "flat" ? "active" : ""} onClick={() => setMethod("flat")}>
              Separate check
              <small>Flat 22% method</small>
            </button>
            <button type="button" className={method === "aggregate" ? "active" : ""} onClick={() => setMethod("aggregate")}>
              Added to a paycheck
              <small>Aggregate method</small>
            </button>
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
            <h2>Bonus tax and take-home in Texas</h2>
            <p>{method === "flat" ? "Withheld at the 22% supplemental rate." : "Withheld by annualizing the combined paycheck."}</p>
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
          <div><span>Texas state income tax</span><b>$0</b></div>
          <div><span>Bonus take-home</span><b>{wholeMoney.format(active.net)}</b></div>
        </div>

        <div className="breakdown">
          <div><span>Flat 22% method</span><b>{wholeMoney.format(flat.net)}</b></div>
          <div><span>Aggregate method</span><b>{wholeMoney.format(aggregate.net)}</b></div>
          <div>
            <span>Difference</span>
            <b>{difference === 0 ? "$0" : `${difference > 0 ? "+" : "−"}${wholeMoney.format(Math.abs(difference))}`}</b>
          </div>
        </div>

        <div className="result-note">
          <span>ⓘ</span>
          <p>
            Withholding is not your final tax. Both methods are settled on your Form 1040, so the method your
            employer uses changes the size of your bonus check, not the tax you ultimately owe. The flat rate
            is {(SUPPLEMENTAL_FLAT_RATE * 100).toFixed(0)}% on supplemental wages up to $1 million per year.
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
