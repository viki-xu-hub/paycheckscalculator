import { locations } from "./locations";

export const SITE_ORIGIN = "https://www.paycheckscalculator.org";

const CORE_INDEXABLE_PATHS = [
  "",
  "/biweekly-paycheck-calculator",
  "/hourly-paycheck-calculator",
  "/how-much-tax-is-taken-from-my-paycheck",
  "/methodology",
  "/texas-bonus-commission-paycheck-calculator",
  "/texas-hourly-paycheck-calculator",
  "/state-paycheck-calculators",
  "/about",
  "/contact",
] as const;

export const INDEXABLE_PATHS = [
  ...CORE_INDEXABLE_PATHS,
  ...locations.map((location) => `/${location.slug}`),
];

export const INDEXABLE_URLS = INDEXABLE_PATHS.map(
  (path) => `${SITE_ORIGIN}${path}`,
);
