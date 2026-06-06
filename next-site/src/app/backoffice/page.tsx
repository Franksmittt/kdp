import type { Metadata } from "next";
import { BackofficeDashboard } from "@/components/backoffice/BackofficeDashboard";

export const metadata: Metadata = {
  title: "Contractor Backoffice | Krugersdorp Painters",
  robots: { index: false, follow: false },
};

export default function BackofficePage() {
  return <BackofficeDashboard />;
}
