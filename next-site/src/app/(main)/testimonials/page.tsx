import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { TestimonialGrid } from "@/components/sections/TestimonialGrid";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("testimonials");

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd data={buildJsonLd("testimonials")} />
      <PageHeader
        title="Testimonials"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Testimonials" },
        ]}
      />
      <TestimonialGrid />
    </>
  );
}
