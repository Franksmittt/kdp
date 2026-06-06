import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { faqCategories } from "@/content/site-content";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("faqs");

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={buildJsonLd("faqs")} />
      <PageHeader
        title="FAQs"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "FAQs" },
        ]}
      />
      <div className="page-faqs">
        <div className="container">
          {faqCategories.map((category) => (
            <div
              key={category.id}
              className={
                category.id === "complex" ? "page-single-faqs" : "page-faqs-catagery"
              }
            >
              <SectionTitle
                eyebrow={category.eyebrow}
                title={category.title}
              />
              <FaqAccordion
                items={category.items}
                idPrefix={category.id}
                defaultOpenId={category.items[0]?.id}
              />
            </div>
          ))}

          <div className="row section-row">
            <div className="col-lg-12 text-center wow fadeInUp">
              <p className="mb-3">Still have questions?</p>
              <Link href="/contact" className="btn-default">
                <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
