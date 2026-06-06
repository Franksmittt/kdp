/**
 * Canonical production URL (metadata, OG, JSON-LD, sitemap, robots).
 * Override for preview/staging: NEXT_PUBLIC_SITE_URL (no trailing slash).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://krugersdorppainting.co.za";

/** Approximate service-area centroid (Krugersdorp); used for LocalBusiness geo. */
export const SERVICE_GEO = {
  latitude: -26.1047,
  longitude: 27.7757,
} as const;

/**
 * Typical contact hours for schema (confirm with the business).
 * Does not block the site outside these hours — for rich-result hints only.
 */
export const OPENING_HOURS_JSONLD = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "08:00",
    closes: "13:00",
  },
] as const;

export const BUSINESS = {
  name: "Krugersdorp Painters",
  legalName: "Krugersdorp Painters",
  phone: "+27764719933",
  phoneDisplay: "076 471 9933",
  email: "info@krugersdorppainting.co.za",
  slogan: "Exterior-only painting for West Rand estates & body corporates",
  areaServed: [
    "Krugersdorp",
    "West Rand",
    "Gauteng",
    "Johannesburg",
    "Randfontein",
  ],
  whatsapp: "https://wa.me/27764719933",
} as const;
