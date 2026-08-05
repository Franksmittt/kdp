"use client";

import Link from "next/link";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { SiteImage } from "@/components/ui/SiteImage";
import { BUSINESS } from "@/config/site";

export function HeroHome() {
  return (
    <section className="kgp-hero" aria-label="Homepage hero">
      <div className="kgp-hero__backdrop" aria-hidden="true">
        <SiteImage
          src="/images/hero-bg-image.jpg"
          alt=""
          fill
          className="kgp-hero__backdrop-img"
          sizes="100vw"
          priority
        />
        <div className="kgp-hero__backdrop-overlay" />
      </div>

      <div className="container kgp-hero__container">
        <div className="kgp-hero__copy">
          <p className="kgp-hero__brand">{BUSINESS.name}</p>
          <h1 className="kgp-hero__title">
            Exterior painting for estates &amp; complexes
          </h1>
          <p className="kgp-hero__lead">
            We specialise in roofs, facades, and boundary walls on West Rand body
            corporates and estates — exterior only.
          </p>
          <div className="kgp-hero__actions">
            <LeadAssessmentTrigger variant="primary">
              Get a site visit
            </LeadAssessmentTrigger>
            <Link href="/contact" className="kgp-hero__btn-secondary">
              Contact us
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
