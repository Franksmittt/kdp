import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("projects");

export default function ProjectsPage() {
  return <LegacyHtmlRoute file="projects.html" slug="projects" />;
}
