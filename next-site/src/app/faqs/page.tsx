import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("faqs");

export default function FaqsPage() {
  return <LegacyHtmlRoute file="faqs.html" slug="faqs" />;
}
