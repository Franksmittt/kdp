import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("blog-single");

export default function BlogSinglePage() {
  return <LegacyHtmlRoute file="blog-single.html" slug="blog-single" />;
}
