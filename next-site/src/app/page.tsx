import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroHome } from "@/components/sections/HeroHome";
import { HomeFocusSection } from "@/components/sections/HomeFocusSection";
import { HomeProcessSection } from "@/components/sections/HomeProcessSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { HomeFaqSection } from "@/components/sections/HomeFaqSection";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { buildJsonLd, buildMetadata } from "@/config/seo";
import { faqPageSchema, organizationSchema } from "@/lib/schema";
import { homeFaqs } from "@/content/site-content";
import { WEST_RAND_ESTATES } from "@/content/estates";

export const metadata: Metadata = buildMetadata("home");

export default function Home() {
  const jsonLd = [
    ...buildJsonLd("home"),
    organizationSchema(),
    faqPageSchema(
      homeFaqs.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    ),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="home-first-screen">
        <SiteHeader />
        <HeroHome />
      </div>

      <HomeFocusSection />
      <HomeProcessSection />

      <section
        className="kgp-home-areas kgp-site-section"
        aria-labelledby="home-areas-heading"
      >
        <div className="container">
          <header className="kgp-home-areas__header">
            <h2 id="home-areas-heading">Areas we work</h2>
            <p>
              Exterior programmes for estates and complexes across Krugersdorp
              and the West Rand.
            </p>
          </header>
          <ul className="kgp-estate-links">
            {WEST_RAND_ESTATES.map((e) => (
              <li key={e.slug}>
                <Link href={`/service-areas/krugersdorp/${e.slug}`}>{e.name}</Link>
              </li>
            ))}
          </ul>
          <div className="kgp-home-areas__footer">
            <Link href="/exterior-painting" className="btn-default">
              Exterior painting services
            </Link>
            <Link href="/body-corporate-painters" className="btn-default btn-highlighted">
              Body corporate work
            </Link>
          </div>
        </div>
      </section>

      <section
        className="kgp-home-visit kgp-site-section"
        aria-labelledby="home-visit-heading"
      >
        <div className="container kgp-home-visit__inner">
          <div>
            <h2 id="home-visit-heading">Ready for a site visit?</h2>
            <p>
              Tell us about your complex or estate. We&apos;ll walk the site and
              send a clear exterior scope.
            </p>
          </div>
          <div className="kgp-home-visit__actions">
            <LeadAssessmentTrigger variant="primary">
              Request a site visit
            </LeadAssessmentTrigger>
            <Link href="/contact" className="btn-default">
              Contact form
            </Link>
          </div>
        </div>
      </section>

      <CtaSection />
      <HomeFaqSection />
    </>
  );
}
