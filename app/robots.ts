import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep admin and order/checkout flows out of the index.
      disallow: ["/admin", "/api", "/order", "/checkout", "/cart"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
