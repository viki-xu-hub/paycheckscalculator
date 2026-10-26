import type { Metadata } from "next";

const ORIGIN = "https://www.paycheckscalculator.org";

export type Faq = { q: string; a: string };

export type StandaloneSeo = {
  slug: string;
  title: string;
  description: string;
  /** Breadcrumb label — usually a shorter form of the title. */
  crumb: string;
  /** Set for pages whose main content is an interactive calculator. */
  appName?: string;
  faqs: Faq[];
};

export function standaloneMetadata(s: StandaloneSeo): Metadata {
  const url = `${ORIGIN}/${s.slug}`;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `/${s.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: s.title,
      description: s.description,
      url,
      type: "article",
      siteName: "Paycheck Calculator",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: s.title }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

/** The three JSON-LD blocks every standalone page on this site emits. */
export function standaloneSchemas(s: StandaloneSeo) {
  const url = `${ORIGIN}/${s.slug}`;
  const schemas: Record<string, unknown>[] = [];

  if (s.appName) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: s.appName,
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: s.description,
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: ORIGIN },
      { "@type": "ListItem", position: 2, name: s.crumb, item: url },
    ],
  });

  return schemas;
}
