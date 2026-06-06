import type { MetadataRoute } from "next";
import { allEstateSlugs } from "@/content/estates";
import { SITE_URL } from "@/config/site";

type Row = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
  lastModified: string;
};

const STATIC_ROUTES: Row[] = [
  { path: "/", lastModified: "2026-06-05", changeFrequency: "weekly", priority: 1 },
  {
    path: "/exterior-painting",
    lastModified: "2026-06-05",
    changeFrequency: "weekly",
    priority: 0.98,
  },
  {
    path: "/body-corporate-painters",
    lastModified: "2026-06-05",
    changeFrequency: "weekly",
    priority: 0.98,
  },
  {
    path: "/body-corporate-painters/10-year-maintenance-plan",
    lastModified: "2026-06-05",
    changeFrequency: "monthly",
    priority: 0.95,
  },
  { path: "/about", lastModified: "2026-03-12", changeFrequency: "monthly", priority: 0.85 },
  { path: "/services", lastModified: "2026-04-01", changeFrequency: "monthly", priority: 0.8 },
  {
    path: "/service-single",
    lastModified: "2026-03-28",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  { path: "/contact", lastModified: "2026-06-05", changeFrequency: "yearly", priority: 0.95 },
  { path: "/blog", lastModified: "2026-04-05", changeFrequency: "weekly", priority: 0.7 },
  {
    path: "/blog-single",
    lastModified: "2026-03-15",
    changeFrequency: "monthly",
    priority: 0.65,
  },
  { path: "/projects", lastModified: "2026-04-08", changeFrequency: "monthly", priority: 0.75 },
  {
    path: "/project-single",
    lastModified: "2026-03-22",
    changeFrequency: "monthly",
    priority: 0.65,
  },
  { path: "/faqs", lastModified: "2026-06-05", changeFrequency: "monthly", priority: 0.88 },
  {
    path: "/testimonials",
    lastModified: "2026-03-25",
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const estateRoutes: Row[] = allEstateSlugs().map((slug) => ({
    path: `/service-areas/krugersdorp/${slug}`,
    lastModified: "2026-06-05",
    changeFrequency: "monthly" as const,
    priority: 0.92,
  }));

  return [...STATIC_ROUTES, ...estateRoutes].map(
    ({ path, changeFrequency, priority, lastModified }) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      lastModified: new Date(lastModified),
      changeFrequency,
      priority,
    }),
  );
}
