import type { Metadata } from "next";
import { LegacyHtmlRoute } from "@/components/LegacyHtmlRoute";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("home");

export default function Home() {
  return <LegacyHtmlRoute file="index.html" slug="home" />;
}
