import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhatWeDoSection } from "@/components/sections/WhatWeDoSection";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { HomeFaqSection } from "@/components/sections/HomeFaqSection";
import { servicesPageIntro } from "@/content/site-content";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("services");

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={buildJsonLd("services")} />
      <PageHeader
        title="Our services"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "services" },
        ]}
      />
      <div className="page-services-intro">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-10 mx-auto">
              <SectionTitle
                eyebrow={servicesPageIntro.eyebrow}
                title={servicesPageIntro.title}
                description="Owner-managed with 10+ years of experience. We spend roughly 70% of our time on preparation, because proper prep is the difference between paint that lasts 2 years and paint that lasts 10. We are especially strong on body corporates, sectional-title schemes, and residential complexes across the West Rand and Gauteng, and we still take on private homes and commercial properties where the same technical standards apply."
                centered
              />
            </div>
          </div>
        </div>
      </div>
      <ServicesGrid showIntro={false} />
      <WhatWeDoSection />
      <TestimonialCarousel showSidebar={false} />
      <HomeFaqSection />
    </>
  );
}
