import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("about");

export default function AboutPage() {
  return <LegacyHtmlRoute file="about.html" slug="about" />;
}
