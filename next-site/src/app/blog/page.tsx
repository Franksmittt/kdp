import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("blog");

export default function BlogPage() {
  return <LegacyHtmlRoute file="blog.html" slug="blog" />;
}
