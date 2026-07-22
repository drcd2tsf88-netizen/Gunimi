import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/config/app";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_CONFIG.url;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/roadmap`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/brand`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/ai-transparency`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
