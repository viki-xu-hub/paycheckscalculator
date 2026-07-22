export const SITE_ORIGIN = "https://www.paycheckscalculator.org";

export const INDEXABLE_PATHS = [
  "",
  "/texas-bonus-commission-paycheck-calculator",
  "/texas-hourly-paycheck-calculator",
  "/state-paycheck-calculators",
  "/about",
  "/contact",
] as const;

export const INDEXABLE_URLS = INDEXABLE_PATHS.map(
  (path) => `${SITE_ORIGIN}${path}`,
);
