import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("service-single");

export default function ServiceSinglePage() {
  return <LegacyHtmlRoute file="service-single.html" slug="service-single" />;
}
