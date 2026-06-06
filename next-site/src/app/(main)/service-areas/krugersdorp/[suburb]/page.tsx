import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AssessmentCtaSection } from "@/components/b2b/AssessmentCtaSection";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { EstateLocalArticle } from "@/components/b2b/EstateLocalArticle";
import { EstateRulesModule } from "@/components/b2b/EstateRulesModule";
import { OperationalMatrix } from "@/components/b2b/OperationalMatrix";
import { QaLogSection } from "@/components/b2b/QaLogSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { allEstateSlugs, getEstateBySlug } from "@/content/estates";
import {
  breadcrumbSchema,
  estateServiceAreaSchema,
  organizationSchema,
} from "@/lib/schema";
import { SITE_URL } from "@/config/site";

type Props = { params: Promise<{ suburb: string }> };

export async function generateStaticParams() {
  return allEstateSlugs().map((suburb) => ({ suburb }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suburb } = await params;
  const estate = getEstateBySlug(suburb);
  if (!estate) return {};

  const title = `${estate.name} Exterior Painting | PMR 22 Body Corporate | ${estate.h1Suffix}`;
  const description = `${estate.subheading} STSMA PMR 22 aligned. Section 5 median line splits. Highveld thermal shock specialists.`;
  const url = `${SITE_URL}/service-areas/krugersdorp/${suburb}`;

  return {
    title,
    description,
    keywords: [
      `body corporate painting ${estate.name}`,
      `PMR 22 exterior maintenance Krugersdorp`,
      `sectional title painters ${estate.slug}`,
      `10-year MRRP contractors West Rand`,
      `Highveld thermal shock painting`,
    ],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function ServiceAreaPage({ params }: Props) {
  const { suburb } = await params;
  const estate = getEstateBySlug(suburb);
  if (!estate) notFound();

  const path = `/service-areas/krugersdorp/${suburb}`;
  const jsonLd = [
    organizationSchema(),
    estateServiceAreaSchema(estate, path),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Service areas", path: "/exterior-painting" },
      { name: estate.name, path },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title={`${estate.name} exterior painting | ${estate.h1Suffix}`}
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Krugersdorp", href: "/exterior-painting" },
          { label: estate.name, href: path },
        ]}
      />

      <section className="bg-charcoal py-12 lg:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EstateLocalArticle estate={estate} />
            </div>
            <aside className="space-y-4">
              <div className="rounded-xl border border-charcoal-border bg-surface p-5">
                <h3 className="font-display font-semibold text-ink">Quick actions</h3>
                <div className="mt-4 flex flex-col gap-2">
                  <LeadAssessmentTrigger variant="turquoise">
                    Schedule structural site inspection
                  </LeadAssessmentTrigger>
                  <Link
                    href="/contact"
                    className="rounded-lg border border-charcoal-border px-4 py-2.5 text-center text-sm font-semibold text-ink hover:bg-surface-muted"
                  >
                    Request proposal
                  </Link>
                </div>
              </div>
              <p className="text-sm text-surface/80">{estate.demographic}</p>
            </aside>
          </div>
        </div>
      </section>

      <EstateRulesModule estate={estate} />
      <OperationalMatrix />
      <QaLogSection />
      <AssessmentCtaSection
        id="assessment"
        title={`Physical assessment for ${estate.name}`}
        description="Our specialized teams utilize calibrated moisture diagnostics and structural analysis to deliver your tailored, phased maintenance proposal — scoped after a walk-through of your estate, not via self-service quoting."
        compact
      />
    </>
  );
}
