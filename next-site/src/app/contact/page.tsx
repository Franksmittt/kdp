import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("contact");

export default function ContactPage() {
  return <LegacyHtmlRoute file="contact.html" slug="contact" />;
}
