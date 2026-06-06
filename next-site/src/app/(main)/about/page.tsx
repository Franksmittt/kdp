import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { WhatWeDoSection } from "@/components/sections/WhatWeDoSection";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { HomeFaqSection } from "@/components/sections/HomeFaqSection";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("about");

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildJsonLd("about")} />
      <PageHeader
        title="About Us"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "About Us" },
        ]}
      />
      <AboutSection variant="about" />
      <ApproachSection />
      <FeaturesSection />
      <WhatWeDoSection />
      <TestimonialCarousel showSidebar={false} />
      <HomeFaqSection />
    </>
  );
}
