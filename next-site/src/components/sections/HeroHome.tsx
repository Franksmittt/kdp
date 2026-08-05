import { SiteImage } from "@/components/ui/SiteImage";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { BUSINESS } from "@/config/site";

export function HeroHome() {
  return (
    <section className="kgp-hero kgp-hero--a" aria-label="Introduction">
      <div className="kgp-hero__media" aria-hidden="true">
        <SiteImage
          src="/images/hero-bg-image.jpg"
          alt=""
          fill
          className="kgp-hero__media-img"
          sizes="100vw"
          priority
        />
        <div className="kgp-hero__veil" />
      </div>
      <div className="container kgp-hero__content kgp-hero__content--a">
        <p className="kgp-hero__brand kgp-hero__brand--on-dark">{BUSINESS.name}</p>
        <h1 className="kgp-hero__title kgp-hero__title--on-dark">
          Exterior painting for West Rand estates
        </h1>
        <p className="kgp-hero__lead kgp-hero__lead--on-dark">
          Roofs, facades, and boundary walls for body corporates and complexes —
          without disturbing residents inside.
        </p>
        <div className="kgp-hero__actions">
          <LeadAssessmentTrigger variant="primary" className="kgp-lp-btn">
            Request a site visit
          </LeadAssessmentTrigger>
          <a href={`tel:${BUSINESS.phone}`} className="kgp-lp-btn kgp-lp-btn--ghost">
            Call {BUSINESS.phoneDisplay}
          </a>
        </div>
        <ul className="kgp-hero__meta">
          <li>Estates &amp; complexes</li>
          <li>West Rand focus</li>
          <li>Owner-managed</li>
        </ul>
      </div>
    </section>
  );
}
