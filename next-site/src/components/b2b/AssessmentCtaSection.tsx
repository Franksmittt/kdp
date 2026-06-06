import Link from "next/link";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  compact?: boolean;
};

export function AssessmentCtaSection({
  id = "assessment",
  eyebrow = "Physical site assessment",
  title = "Tailored phased maintenance proposals — built on site, not online",
  description = "Our specialized teams utilize calibrated moisture diagnostics and structural analysis to deliver your tailored, phased maintenance proposal. Trustees receive scope, phasing, and reserve-fund alignment after a physical walk-through — never a self-service calculator.",
  compact = false,
}: Props) {
  return (
    <section
      className={`kgp-b2b-section ${compact ? "kgp-b2b-section--surface" : "kgp-b2b-section--dark"}`}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container">
        <div className={`row ${compact ? "" : "align-items-center g-4 g-lg-5"}`}>
          <div className={compact ? "col-lg-10 mx-auto text-center" : "col-lg-7"}>
            <div className={compact ? "section-title section-title-center" : "section-title"}>
              <h3>{eyebrow}</h3>
              <h2 id={`${id}-heading`} className="text-anime-style-3">
                {title}
              </h2>
              <p>{description}</p>
            </div>
            <div
              className={`d-flex flex-wrap gap-3 ${compact ? "justify-content-center mt-2" : "mt-4"}`}
            >
              <LeadAssessmentTrigger variant="primary">
                Request a phased maintenance assessment
              </LeadAssessmentTrigger>
              <LeadAssessmentTrigger variant="secondary">
                Schedule structural site inspection
              </LeadAssessmentTrigger>
              <Link href="/contact" className="btn-default">
                Contact managing agent desk
              </Link>
            </div>
          </div>
          {!compact && (
            <div className="col-lg-5">
              <div className="rounded-xl border border-charcoal-border bg-charcoal-elevated p-6 text-surface lg:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-turquoise">
                  What happens on site
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-surface/85">
                  <li className="flex gap-3">
                    <i className="fa-solid fa-droplet mt-0.5 text-turquoise" aria-hidden="true" />
                    Doser hygrometer moisture mapping — masonry below 8% before coatings
                  </li>
                  <li className="flex gap-3">
                    <i className="fa-solid fa-ruler-combined mt-0.5 text-turquoise" aria-hidden="true" />
                    Substrate profiling for tanking, DPC injection, and DFT targets
                  </li>
                  <li className="flex gap-3">
                    <i className="fa-solid fa-layer-group mt-0.5 text-turquoise" aria-hidden="true" />
                    PMR 22 phased chunking outline aligned to reserve accruals
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
