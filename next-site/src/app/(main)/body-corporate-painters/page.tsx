import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AeoKnowledgeSection } from "@/components/b2b/AeoKnowledgeSection";
import { AssessmentCtaSection } from "@/components/b2b/AssessmentCtaSection";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { OperationalMatrix } from "@/components/b2b/OperationalMatrix";
import { QaLogSection } from "@/components/b2b/QaLogSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { faqPageSchema, breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { AEO_SNIPPETS } from "@/content/b2b-content";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Body Corporate Painting Contractors Krugersdorp | STSMA Compliant",
  description:
    "Body corporate and sectional-title exterior painting on the West Rand. Phased chunking, PMR 22 alignment, measured material QA, and zero interior disruption.",
  keywords: [
    "body corporate painting Krugersdorp",
    "sectional title repainting",
    "complex painting contractors West Rand",
    "10 year maintenance plan painting",
  ],
  alternates: { canonical: `${SITE_URL}/body-corporate-painters` },
};

export default function BodyCorporatePaintersPage() {
  const jsonLd = [
    organizationSchema(),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Body corporate painters", path: "/body-corporate-painters" },
    ]),
    faqPageSchema(AEO_SNIPPETS),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Body corporate exterior painting"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Body corporate painters", href: "/body-corporate-painters" },
        ]}
      />
      <section className="kgp-b2b-section kgp-b2b-section--surface">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="section-title">
                <h3>Trustees &amp; managing agents</h3>
                <h2 className="text-anime-style-3">
                  You are not buying paint — you are buying a defensible AGM decision
                </h2>
                <p>
                  We supply phased exterior scopes, SANS 10400 moisture diagnostics, and measured
                  coating QA so reserve fund spend is justified without resident friction or
                  interior access.
                </p>
              </div>
              <Link
                href="/body-corporate-painters/10-year-maintenance-plan"
                className="btn-default btn-highlighted me-2"
              >
                PMR 22 &amp; 10-Year MRRP guide
              </Link>
              <LeadAssessmentTrigger variant="primary">
                Request phased maintenance assessment
              </LeadAssessmentTrigger>
            </div>
          </div>
        </div>
      </section>
      <OperationalMatrix />
      <QaLogSection />
      <AssessmentCtaSection id="assessment" compact />
      <AeoKnowledgeSection />
    </>
  );
}
