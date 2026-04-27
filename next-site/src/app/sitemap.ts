import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/service-single", changeFrequency: "monthly", priority: 0.85 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.95 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
  { path: "/blog-single", changeFrequency: "monthly", priority: 0.75 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/project-single", changeFrequency: "monthly", priority: 0.75 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.85 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.85 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
