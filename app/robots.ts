import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://samovar.rs";
  const demo = process.env.NEXT_PUBLIC_DEMO !== "false";
  // Demo verzija se ne indeksira u pretraživačima.
  return demo
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${site}/sitemap.xml` };
}
