import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { OperationalMatrix } from "@/components/b2b/OperationalMatrix";
import { OperationTimeline } from "@/components/b2b/OperationTimeline";
import { QaLogSection } from "@/components/b2b/QaLogSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Exterior Painters Krugersdorp | Zero Interior Disruption",
  description:
    "Expert exterior-only painters in Krugersdorp and the West Rand. Facades, boundary walls, and roof coatings for estates and body corporates — STSMA-aware, phased programmes, measured QA.",
  keywords: [
    "exterior painters Krugersdorp",
    "exterior house painting West Rand",
    "estate boundary wall painters",
    "complex painting contractors Krugersdorp",
    "roof painting West Rand",
  ],
  alternates: { canonical: `${SITE_URL}/exterior-painting` },
  openGraph: {
    title: "Exterior Painters Krugersdorp | Krugersdorp Painters",
    description:
      "Exterior-only teams for West Rand estates — facades, boundaries, roofs. Phased, compliant, zero interior access.",
    url: `${SITE_URL}/exterior-painting`,
  },
};

export default function ExteriorPaintingPage() {
  const jsonLd = [
    organizationSchema(),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Exterior painting", path: "/exterior-painting" },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Expert exterior painters in Krugersdorp"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Exterior painting", href: "/exterior-painting" },
        ]}
      />
      <OperationalMatrix />
      <section className="kgp-b2b-section kgp-b2b-section--surface">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <article className="kgp-b2b-card">
                <h3>
                  <Link href="/exterior-painting#qa-log">Complex roofs</Link>
                </h3>
                <p>Thermal protection, ridge sealing, IBR and tiled systems.</p>
              </article>
            </div>
            <div className="col-md-6 col-lg-3">
              <article className="kgp-b2b-card">
                <h3>Boundary walls</h3>
                <p>Rising and lateral damp, efflorescence, perimeter security aesthetics.</p>
              </article>
            </div>
            <div className="col-md-6 col-lg-3">
              <article className="kgp-b2b-card">
                <h3>Estate facades</h3>
                <p>UV elastomerics, crack bridging, HOA colour compliance.</p>
              </article>
            </div>
            <div className="col-md-6 col-lg-3">
              <article className="kgp-b2b-card">
                <h3>Parapet waterproofing</h3>
                <p>Box gutters, flashings, moisture ingress before topcoat.</p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <OperationTimeline />
      <QaLogSection />
      <section className="kgp-b2b-section kgp-b2b-section--dark">
        <div className="container text-center">
          <Link href="/body-corporate-painters" className="btn-default btn-highlighted me-2">
            Body corporate programmes
          </Link>
          <Link href="/contact" className="btn-default">
            Request estate maintenance proposal
          </Link>
        </div>
      </section>
    </>
  );
}
