import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

type Row = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
  /** ISO date string — stable hints for crawlers (update when content changes). */
  lastModified: string;
};

const ROUTES: Row[] = [
  { path: "/", lastModified: "2026-04-20", changeFrequency: "weekly", priority: 1 },
  { path: "/about", lastModified: "2026-03-12", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", lastModified: "2026-04-01", changeFrequency: "weekly", priority: 0.95 },
  {
    path: "/service-single",
    lastModified: "2026-03-28",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  { path: "/contact", lastModified: "2026-02-10", changeFrequency: "yearly", priority: 0.95 },
  { path: "/blog", lastModified: "2026-04-05", changeFrequency: "weekly", priority: 0.85 },
  {
    path: "/blog-single",
    lastModified: "2026-03-15",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  { path: "/projects", lastModified: "2026-04-08", changeFrequency: "weekly", priority: 0.9 },
  {
    path: "/project-single",
    lastModified: "2026-03-22",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  { path: "/faqs", lastModified: "2026-03-18", changeFrequency: "monthly", priority: 0.85 },
  {
    path: "/testimonials",
    lastModified: "2026-03-25",
    changeFrequency: "monthly",
    priority: 0.85,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority, lastModified }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));
}
