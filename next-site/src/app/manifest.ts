import type { MetadataRoute } from "next";
import { BUSINESS, SITE_URL } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS.name,
    short_name: "KD Painters",
    description:
      "Interior and exterior painting, roof restoration, and waterproofing for Krugersdorp and the West Rand.",
    id: SITE_URL,
    start_url: "/",
    scope: "/",
    display: "browser",
    orientation: "portrait-primary",
    background_color: "#1e3a5f",
    theme_color: "#1e3a5f",
    lang: "en-ZA",
    categories: ["business", "lifestyle"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Get a quote",
        short_name: "Quote",
        description: "Contact Krugersdorp Painters",
        url: "/contact",
      },
      {
        name: "Services",
        short_name: "Services",
        url: "/services",
      },
    ],
  };
}
