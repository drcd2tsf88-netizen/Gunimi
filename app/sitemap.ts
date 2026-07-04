import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/config/app";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_CONFIG.url;
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
