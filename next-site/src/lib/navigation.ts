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
  label: "Get a site visit",
} as const;

export type FooterTickerVariant = "full" | "compact";

export const FOOTER_TICKER: Record<FooterTickerVariant, string[]> = {
  full: [
    "Exterior painting for estates",
    "Body corporates & complexes",
    "West Rand specialists",
    "Roofs, facades & boundary walls",
  ],
  compact: [
    "Exterior painting for estates",
    "Body corporates & complexes",
  ],
};

export const FOOTER_QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Exterior painting", href: "/exterior-painting" },
  { label: "Body corporate", href: "/body-corporate-painters" },
  { label: "About", href: "/about" },
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
