import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroHome } from "@/components/sections/HeroHome";
import { HomeServicesSection } from "@/components/sections/HomeServicesSection";
import { HomeWhySection } from "@/components/sections/HomeWhySection";
import { HomeTestimonialsSection } from "@/components/sections/HomeTestimonialsSection";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { buildJsonLd, buildMetadata } from "@/config/seo";
import { faqPageSchema, organizationSchema } from "@/lib/schema";
import { BUSINESS } from "@/config/site";

export const metadata: Metadata = buildMetadata("home");

const HOME_FAQ = [
  {
    question: "Do you paint interiors?",
    answer:
      "No. We specialise in exterior painting for estates and complexes — roofs, facades, and boundary walls.",
  },
  {
    question: "Can you work with our body corporate?",
    answer:
      "Yes. We quote and phase common-property exteriors for trustees and managing agents.",
  },
];

export default function Home() {
  const jsonLd = [
    ...buildJsonLd("home"),
    organizationSchema(),
    faqPageSchema(HOME_FAQ),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <HeroHome />
      <HomeServicesSection />
      <HomeWhySection />
      <HomeTestimonialsSection />

      <section className="kgp-lp-cta" aria-labelledby="home-cta-heading">
        <div className="container kgp-lp-cta__inner">
          <div>
            <p className="kgp-lp-eyebrow kgp-lp-eyebrow--on-dark">Next step</p>
            <h2 id="home-cta-heading">
              Ready for a site visit on your estate or complex?
            </h2>
            <p>
              Call or WhatsApp Rico. We&apos;ll walk the site and send a clear
              exterior scope.
            </p>
          </div>
          <div className="kgp-lp-cta__actions">
            <LeadAssessmentTrigger variant="primary">
              Request a site visit
            </LeadAssessmentTrigger>
            <a href={`tel:${BUSINESS.phone}`} className="kgp-lp-btn kgp-lp-btn--ghost">
              Call {BUSINESS.phoneDisplay}
            </a>
            <Link href="/contact" className="kgp-lp-btn kgp-lp-btn--ghost">
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
