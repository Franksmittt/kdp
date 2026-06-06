import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AssessmentCtaSection } from "@/components/b2b/AssessmentCtaSection";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { PageHeader } from "@/components/ui/PageHeader";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "10-Year Maintenance Plan Painters | PMR 22 MRRP Alignment",
  description:
    "Align exterior painting with STSMA PMR 22 and your 10-Year MRRP. Phased chunking for body corporates on the West Rand — fund from reserve accruals, avoid special levies.",
  keywords: [
    "10 year maintenance plan painting contractors",
    "PMR 22 painting",
    "MRRP exterior maintenance",
    "sectional title maintenance plan",
  ],
  alternates: {
    canonical: `${SITE_URL}/body-corporate-painters/10-year-maintenance-plan`,
  },
};

export default function TenYearMaintenancePlanPage() {
  const jsonLd = [
    organizationSchema(),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Body corporate painters", path: "/body-corporate-painters" },
      {
        name: "10-Year maintenance plan",
        path: "/body-corporate-painters/10-year-maintenance-plan",
      },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Body corporate exterior painting & STSMA 10-Year MRRP alignment"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Body corporate", href: "/body-corporate-painters" },
          {
            label: "10-Year maintenance plan",
            href: "/body-corporate-painters/10-year-maintenance-plan",
          },
        ]}
      />

      <section className="kgp-b2b-section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-10 mx-auto">
              <article className="kgp-b2b-card">
                <h2>Decoding PMR 22 and the reserve fund imperative</h2>
                <p>
                  Under Prescribed Management Rule 22, every community scheme needs a written
                  Maintenance, Repair, and Replacement Plan for major capital items over ten
                  years. Exterior painting and waterproofing are unequivocally major capital
                  items — not administration fund repairs.
                </p>
                <p>
                  Reserve funds must implement the MRRP. Trustees need plain-language scopes with
                  lifecycle costing for thermal shock repair, spalling remediation, and elastomeric
                  applications — not tick-box spreadsheets.
                </p>
              </article>

              <article className="kgp-b2b-card mt-4">
                <h2>The financial superiority of phased chunking</h2>
                <p>
                  Single-phase repaints drain reserves and trigger special levies. Phased chunking
                  paints block-by-block over 36–48 months, matching monthly accruals. Agile
                  exterior-only teams isolate the footprint to one precinct — no interior keys, no
                  estate-wide scaffolding chaos.
                </p>
              </article>

              <article className="kgp-b2b-card mt-4">
                <h2>Median line &amp; common property facades</h2>
                <p>
                  The outer 50% of boundary walls and common-property facades is body corporate
                  responsibility. Our teams restore that outer half — tanking lateral damp, DPC
                  injection, and UV-rated topcoats — so trustees stay out of owner disputes.
                </p>
                <div className="mt-4 d-flex flex-wrap gap-2">
                  <LeadAssessmentTrigger variant="primary">
                    Request phased maintenance assessment
                  </LeadAssessmentTrigger>
                  <Link href="/contact" className="btn-default">
                    Contact managing agent desk
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <AssessmentCtaSection id="assessment" compact />
    </>
  );
}
