import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroHome } from "@/components/sections/HeroHome";
import { HomeGapSection } from "@/components/sections/HomeGapSection";
import { HomeServicesSection } from "@/components/sections/HomeServicesSection";
import { HomeProcessSection } from "@/components/sections/HomeProcessSection";
import { HomeWhySection } from "@/components/sections/HomeWhySection";
import { HomeTestimonialsSection } from "@/components/sections/HomeTestimonialsSection";
import { HomeFaqStrip } from "@/components/sections/HomeFaqStrip";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { buildJsonLd, buildMetadata } from "@/config/seo";
import { faqPageSchema, organizationSchema } from "@/lib/schema";
import { BUSINESS } from "@/config/site";

export const metadata: Metadata = buildMetadata("home");

const HOME_FAQ = [
  {
    question: "Do you paint interiors?",
    answer:
      "No. We specialise in exterior painting for estates and complexes — roofs, facades, and boundary walls. That focus is why the work lasts.",
  },
  {
    question: "Can you work with our body corporate?",
    answer:
      "Yes. We quote and phase common-property exteriors for trustees and managing agents, with itemised scopes you can table at meetings.",
  },
  {
    question: "How disruptive is the work for residents?",
    answer:
      "Exterior work stays outside. We agree working hours with estate rules, phase the site in sections, put up notices, and leave active zones tidy every day.",
  },
  {
    question: "Why not just take the cheapest quote?",
    answer:
      "You can — but most exterior failures come from skipped prep, not cheap paint. We itemise our scope so you can compare quotes line by line and see exactly what the cheaper one leaves out.",
  },
  {
    question: "How quickly do you respond?",
    answer:
      "Same day. Call or WhatsApp Rico directly — the owner, not a call centre — and we'll set up a site visit that suits your scheme.",
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
      <HomeGapSection />
      <HomeServicesSection />
      <HomeProcessSection />
      <HomeWhySection />
      <HomeTestimonialsSection />
      <HomeFaqStrip items={HOME_FAQ} />

      <section className="kgp-lp-cta" aria-labelledby="home-cta-heading">
        <div className="container kgp-lp-cta__inner">
          <div>
            <h2 id="home-cta-heading">Ready for a site visit?</h2>
            <p>
              Call or WhatsApp Rico for a clear exterior scope on your estate or
              complex. Same-day response.
            </p>
          </div>
          <div className="kgp-lp-cta__actions">
            <LeadAssessmentTrigger variant="primary">
              Request a site visit
            </LeadAssessmentTrigger>
            <a href={`tel:${BUSINESS.phone}`} className="kgp-lp-btn kgp-lp-btn--ghost">
              {BUSINESS.phoneDisplay}
            </a>
            <Link href="/contact" className="kgp-lp-btn kgp-lp-btn--ghost">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
