import { locations } from "./locations";
import { allProgrammaticUrls, stateUrls, salaryUrls, hourlyUrls, frequencyUrls } from "./seo/sitemap-routes";

export const SITE_ORIGIN = "https://www.paycheckscalculator.org";

const CORE_INDEXABLE_PATHS = [
  "",
  "/biweekly-paycheck-calculator",
  "/weekly-paycheck-calculator",
  "/semimonthly-paycheck-calculator",
  "/monthly-paycheck-calculator",
  "/hourly-paycheck-calculator",
  "/how-much-tax-is-taken-from-my-paycheck",
  "/methodology",
  "/texas-paycheck-calculator-with-bonus",
  "/texas-paycheck-calculator-with-dependents",
  "/texas-paycheck-calculator-with-child-support",
  "/state-paycheck-calculators",
  "/about",
  "/contact",
  "/paycheck-taxes",
  "/blog",
] as const;

// Legacy location slugs at root (e.g. /texas-paycheck-calculator)
const LEGACY_LOCATION_PATHS = locations.map(loc => `/${loc.slug}`);

export const INDEXABLE_PATHS = [
  ...CORE_INDEXABLE_PATHS,
  ...LEGACY_LOCATION_PATHS,
];

export const INDEXABLE_URLS = INDEXABLE_PATHS.map(path => `${SITE_ORIGIN}${path}`);

// All programmatic SEO URLs (new /states/, /hourly/, /salary/ routes)
export const PROGRAMMATIC_URLS = allProgrammaticUrls();

// Individual category URL sets for granular sitemap priority control
export {
  stateUrls as PROGRAMMATIC_STATE_URLS,
  salaryUrls as PROGRAMMATIC_SALARY_URLS,
  hourlyUrls as PROGRAMMATIC_HOURLY_URLS,
  frequencyUrls as PROGRAMMATIC_FREQUENCY_URLS,
};
