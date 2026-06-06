import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceSingleContent } from "@/components/sections/ServiceSingleContent";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("service-single");

export default function ServiceSinglePage() {
  return (
    <>
      <JsonLd data={buildJsonLd("service-single")} />
      <PageHeader
        title="Our services"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Technical property maintenance" },
        ]}
      />
      <ServiceSingleContent />
    </>
  );
}
