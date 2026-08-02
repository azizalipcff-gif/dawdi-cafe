import type { MetadataRoute } from "next";
import { SITE_URL, ADMIN_PATH } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [`${ADMIN_PATH}/`] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
