export type NavLink = {
  label: string;
  href: string;
  mobileOnly?: boolean;
  desktopHidden?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", desktopHidden: true },
  { label: "Exterior Painting", href: "/exterior-painting" },
  { label: "Body Corporate", href: "/body-corporate-painters" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact", mobileOnly: true },
];

export const HEADER_ASSESSMENT_CTA = {
  label: "Schedule Site Inspection",
} as const;

export type FooterTickerVariant = "full" | "compact";

export const FOOTER_TICKER: Record<FooterTickerVariant, string[]> = {
  full: [
    "Exterior-only painting",
    "STSMA & PMR 22 programmes",
    "Phased chunking",
    "Measured QA & DFT logs",
    "West Rand estates",
  ],
  compact: [
    "Exterior-only painting",
    "Body corporate & complexes",
  ],
};

export const FOOTER_QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Exterior painting", href: "/exterior-painting" },
  { label: "Body corporate", href: "/body-corporate-painters" },
  { label: "10-Year MRRP", href: "/body-corporate-painters/10-year-maintenance-plan" },
  { label: "Contact", href: "/contact" },
] as const;

export const COMPACT_FOOTER_PATHS = [
  "/projects",
  "/project-single",
  "/blog",
  "/blog-single",
  "/service-areas",
] as const;

export function footerVariantForPath(pathname: string): FooterTickerVariant {
  return COMPACT_FOOTER_PATHS.some((p) => pathname.startsWith(p))
    ? "compact"
    : "full";
}
