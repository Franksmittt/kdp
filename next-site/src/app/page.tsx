import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AeoKnowledgeSection } from "@/components/b2b/AeoKnowledgeSection";
import { AssessmentCtaSection } from "@/components/b2b/AssessmentCtaSection";
import { OperationalMatrix } from "@/components/b2b/OperationalMatrix";
import { OperationTimeline } from "@/components/b2b/OperationTimeline";
import { QaLogSection } from "@/components/b2b/QaLogSection";
import { HeroHome } from "@/components/sections/HeroHome";
import { CtaSection } from "@/components/sections/CtaSection";
import { HomeFaqSection } from "@/components/sections/HomeFaqSection";
import { buildJsonLd, buildMetadata } from "@/config/seo";
import { faqPageSchema, organizationSchema } from "@/lib/schema";
import { AEO_SNIPPETS } from "@/content/b2b-content";
import { WEST_RAND_ESTATES } from "@/content/estates";

export const metadata: Metadata = buildMetadata("home");

export default function Home() {
  const jsonLd = [
    ...buildJsonLd("home"),
    organizationSchema(),
    faqPageSchema(AEO_SNIPPETS),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="home-first-screen">
        <SiteHeader />
        <HeroHome />
      </div>
      <OperationalMatrix />
      <OperationTimeline />
      <QaLogSection />
      <AssessmentCtaSection id="assessment" />
      <section className="kgp-b2b-section kgp-b2b-section--surface">
        <div className="container">
          <div className="section-title section-title-center">
            <h3>Service areas</h3>
            <h2 className="text-anime-style-3">West Rand estates we programme for</h2>
          </div>
          <ul className="kgp-estate-links">
            {WEST_RAND_ESTATES.map((e) => (
              <li key={e.slug}>
                <Link href={`/service-areas/krugersdorp/${e.slug}`}>{e.name}</Link>
              </li>
            ))}
          </ul>
          <div className="kgp-b2b-section-footer">
            <Link href="/exterior-painting" className="btn-default btn-highlighted">
              All exterior services
            </Link>
          </div>
        </div>
      </section>
      <AeoKnowledgeSection />
      <CtaSection />
      <HomeFaqSection />
    </>
  );
}
