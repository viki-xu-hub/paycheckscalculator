import type { MetadataRoute } from "next";
import { INDEXABLE_URLS } from "./lib/indexableRoutes";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_URLS.map((url, index) => ({
    url,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.75,
  }));
}
