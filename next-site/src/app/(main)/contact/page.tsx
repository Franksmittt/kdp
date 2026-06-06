import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("contact");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildJsonLd("contact")} />
      <PageHeader
        title="Contact Us"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Contact" },
        ]}
      />
      <ContactSection />
    </>
  );
}
