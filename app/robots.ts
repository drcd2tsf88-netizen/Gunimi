import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/lib/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/orbit-control/",
          "/founder",
          "/register/complete",
          "/register/verify",
          "/monitoring",
          "/opengraph-image",
        ],
      },
    ],
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
  };
}
