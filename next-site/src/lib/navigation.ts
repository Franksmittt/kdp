export type NavLink = {
  label: string;
  href: string;
  mobileOnly?: boolean;
  desktopHidden?: boolean;
  children?: { label: string; href: string; hint?: string }[];
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", desktopHidden: true },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Exterior painting",
        href: "/exterior-painting",
        hint: "Roofs, facades & walls",
      },
      {
        label: "Body corporate",
        href: "/body-corporate-painters",
        hint: "Common-property programmes",
      },
      {
        label: "Maintenance plans",
        href: "/body-corporate-painters/10-year-maintenance-plan",
        hint: "Phased multi-year scopes",
      },
    ],
  },
  { label: "Projects", href: "/projects" },
  {
    label: "Areas",
    href: "/service-areas/krugersdorp/featherbrooke-estate",
    children: [
      {
        label: "Featherbrooke Estate",
        href: "/service-areas/krugersdorp/featherbrooke-estate",
      },
      {
        label: "Avianto Estate",
        href: "/service-areas/krugersdorp/avianto-estate",
      },
      {
        label: "Chancliff Ridge",
        href: "/service-areas/krugersdorp/chancliff-ridge",
      },
      {
        label: "Homes Haven",
        href: "/service-areas/krugersdorp/homes-haven",
      },
      {
        label: "Noordheuwel",
        href: "/service-areas/krugersdorp/noordheuwel",
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact", mobileOnly: true },
];

export const HEADER_ASSESSMENT_CTA = {
  label: "Site visit",
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
  { label: "Exterior", href: "/exterior-painting" },
  { label: "Body corporate", href: "/body-corporate-painters" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/faqs" },
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
