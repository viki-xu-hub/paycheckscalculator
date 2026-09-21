const SITE = "https://www.paycheckscalculator.org";

interface BreadcrumbItem { name: string; href: string }

function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.href}`,
    })),
  };
}

export function stateBreadcrumb(stateName: string, stateSlug: string) {
  return buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "State Paycheck Calculators", href: "/state-paycheck-calculators" },
    { name: `${stateName} Paycheck Calculator`, href: `/states/${stateSlug}` },
  ]);
}

export function hourlyBreadcrumb(rateLabel: string, rateSlug: string) {
  return buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Hourly Paycheck Calculator", href: "/hourly-paycheck-calculator" },
    { name: `${rateLabel} an Hour Is How Much a Year`, href: `/hourly/${rateSlug}` },
  ]);
}

export function salaryBreadcrumb(salaryLabel: string, salarySlug: string) {
  return buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Salary to Hourly", href: "/salary" },
    { name: `${salaryLabel} a Year Is How Much an Hour`, href: `/salary/${salarySlug}` },
  ]);
}

export function frequencyBreadcrumb(freqName: string, freqSlug: string) {
  return buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Paycheck Calculators", href: "/" },
    { name: `${freqName} Paycheck Calculator`, href: `/${freqSlug}` },
  ]);
}
