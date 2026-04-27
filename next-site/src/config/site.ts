/**
 * Canonical production URL (metadata, OG, JSON-LD, sitemap, robots).
 * Override for preview/staging: NEXT_PUBLIC_SITE_URL (no trailing slash).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://krugersdorppainting.co.za";

export const BUSINESS = {
  name: "Krugersdorp Painters",
  legalName: "Krugersdorp Painters",
  phone: "+27764719933",
  phoneDisplay: "076 471 9933",
  email: "info@domainname.com",
  areaServed: [
    "Krugersdorp",
    "West Rand",
    "Gauteng",
    "Johannesburg",
    "Randfontein",
  ],
  whatsapp: "https://wa.me/27764719933",
} as const;
