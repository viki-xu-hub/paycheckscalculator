import type { MetadataRoute } from "next";
import {
  SITE_ORIGIN,
  INDEXABLE_URLS,
} from "./lib/indexableRoutes";
import { salaryUrls, hourlyUrls, frequencyUrls } from "./lib/seo/sitemap-routes";
import { locations } from "./lib/locations";

const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  // Homepage — highest priority
  const home: MetadataRoute.Sitemap = [{
    url: SITE_ORIGIN,
    lastModified: NOW,
    changeFrequency: "weekly",
    priority: 1.0,
  }];

  // Core editorial pages
  const core: MetadataRoute.Sitemap = INDEXABLE_URLS
    .filter(url => url !== SITE_ORIGIN)
    .map(url => ({
      url,
      lastModified: NOW,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // Frequency pages — medium priority
  const freqPages: MetadataRoute.Sitemap = frequencyUrls().map(url => ({
    url,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Salary pages — medium priority
  const salaryPages: MetadataRoute.Sitemap = salaryUrls().map(url => ({
    url,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  // Hourly pages — medium priority
  const hourlyPages: MetadataRoute.Sitemap = hourlyUrls().map(url => ({
    url,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  // Biweekly × state pages
  const biweeklyStatePages: MetadataRoute.Sitemap = locations.map(loc => ({
    url: `${SITE_ORIGIN}/biweekly/${loc.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...home,
    ...core,
    ...freqPages,
    ...biweeklyStatePages,
    ...salaryPages,
    ...hourlyPages,
  ];
}
