import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/orbit-control/"],
      },
    ],
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
  };
}
