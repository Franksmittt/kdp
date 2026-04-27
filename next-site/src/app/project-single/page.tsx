import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("project-single");

export default function ProjectSinglePage() {
  return <LegacyHtmlRoute file="project-single.html" slug="project-single" />;
}
