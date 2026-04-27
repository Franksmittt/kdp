import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("services");

export default function ServicesPage() {
  return <LegacyHtmlRoute file="services.html" slug="services" />;
}
