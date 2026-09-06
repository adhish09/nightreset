import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nightreset.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/pricing", "/privacy", "/terms", "/safety"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.6,
  }));
}
