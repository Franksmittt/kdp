"use client";

import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { BUSINESS } from "@/config/site";

const TRUST_ITEMS = [
  { icon: "fa-solid fa-medal", label: "Quality workmanship" },
  { icon: "fa-solid fa-shield-halved", label: "Trusted on estates" },
  { icon: "fa-solid fa-clock", label: "Clear timelines" },
] as const;

export function HeroHome() {
  return (
    <section className="kgp-lp-hero" aria-label="Introduction">
      <div className="container">
        <div className="kgp-lp-hero__grid">
          <div className="kgp-lp-hero__visual">
            <div className="kgp-lp-hero__collage" aria-hidden="true">
              <div className="kgp-lp-hero__main">
                <SiteImage
                  src="/images/project-image-1.jpg"
                  alt=""
                  fill
                  className="kgp-lp-hero__img"
                  sizes="(max-width: 991px) 90vw, 42vw"
                  priority
                />
              </div>
              <div className="kgp-lp-hero__float kgp-lp-hero__float--top">
                <SiteImage
                  src="/images/project-image-4.jpg"
                  alt=""
                  fill
                  className="kgp-lp-hero__img"
                  sizes="180px"
                />
              </div>
              <div className="kgp-lp-hero__float kgp-lp-hero__float--bottom">
                <SiteImage
                  src="/images/project-image-6.jpg"
                  alt=""
                  fill
                  className="kgp-lp-hero__img"
                  sizes="200px"
                />
              </div>
              <div className="kgp-lp-hero__badge">
                <i className="fa-solid fa-paint-roller" aria-hidden="true" />
                <span>
                  Exterior
                  <br />
                  specialists
                </span>
              </div>
              <div className="kgp-lp-dots kgp-lp-dots--hero" />
            </div>
          </div>

          <div className="kgp-lp-hero__copy">
            <p className="kgp-lp-hero__brand">{BUSINESS.name}</p>
            <h1 className="kgp-lp-hero__title">
              Exterior painting for{" "}
              <span>estates &amp; complexes</span>
            </h1>
            <p className="kgp-lp-hero__lead">
              We specialise in roofs, facades, and boundary walls on West Rand
              body corporates and estates — so residents stay undisturbed inside.
            </p>

            <ul className="kgp-lp-hero__trust">
              {TRUST_ITEMS.map((item) => (
                <li key={item.label}>
                  <span className="kgp-lp-hero__trust-icon" aria-hidden="true">
                    <i className={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <Link href="/about" className="kgp-lp-btn">
              Learn more about us
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
