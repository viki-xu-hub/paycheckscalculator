/**
 * Qualified overtime compensation deduction — One Big Beautiful Bill Act,
 * tax years 2025 through 2028.
 *
 * Sources:
 *  - IRS, "Working Families Tax Cuts: tax deductions for working Americans and
 *    seniors" — cap of $12,500 ($25,000 joint), phase-out starting at modified
 *    AGI of $150,000 ($300,000 joint).
 *  - IRS, "Questions and answers about the new deduction for qualified overtime
 *    compensation" (FS-2026-01, superseded by FS-2026-13) — only the premium
 *    portion of FLSA-required overtime counts; a Social Security number valid
 *    for employment is required; overtime owed only under a collective
 *    bargaining agreement or state law does not qualify.
 *
 * The deduction is available whether or not the taxpayer itemises. It reduces
 * income subject to federal income tax only — it does not change FICA.
 */

export type OtStatus = "single" | "married";

export const OT_DEDUCTION_CAP: Record<OtStatus, number> = {
  single: 12500,
  married: 25000,
};

export const OT_PHASEOUT_START: Record<OtStatus, number> = {
  single: 150000,
  married: 300000,
};

/** The deduction drops by $100 for each $1,000 of modified AGI over the threshold. */
export const OT_PHASEOUT_PER_1000 = 100;

export const OT_YEARS = "2025 through 2028";

export type OtDeductionResult = {
  /** Statutory maximum for the filing status. */
  cap: number;
  /** Dollars of cap removed by the income phase-out. */
  phaseout: number;
  /** Cap after the phase-out, before applying the taxpayer's actual premium. */
  cappedAfterPhaseout: number;
  /** Deduction the taxpayer can actually claim. */
  deduction: number;
};

/**
 * @param premium  Qualified overtime compensation — the half above the regular
 *                 rate in time-and-a-half, not the whole overtime payment.
 * @param magi     Modified adjusted gross income.
 */
export function otDeductionFor(
  premium: number,
  magi: number,
  status: OtStatus,
): OtDeductionResult {
  const cap = OT_DEDUCTION_CAP[status];
  const over = Math.max(0, magi - OT_PHASEOUT_START[status]);
  // Each full $1,000 over the threshold removes $100 of the cap.
  const phaseout = Math.min(cap, Math.floor(over / 1000) * OT_PHASEOUT_PER_1000);
  const cappedAfterPhaseout = Math.max(0, cap - phaseout);
  return {
    cap,
    phaseout,
    cappedAfterPhaseout,
    deduction: Math.max(0, Math.min(Math.max(0, premium), cappedAfterPhaseout)),
  };
}

/** Modified AGI at which the deduction reaches zero for a filing status. */
export function otPhaseoutEnd(status: OtStatus): number {
  return OT_PHASEOUT_START[status] + (OT_DEDUCTION_CAP[status] / OT_PHASEOUT_PER_1000) * 1000;
}
