import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("testimonials");

export default function TestimonialsPage() {
  return <LegacyHtmlRoute file="testimonials.html" slug="testimonials" />;
}
