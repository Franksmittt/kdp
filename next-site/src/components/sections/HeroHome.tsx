"use client";

import { useEffect, useState } from "react";
import { SiteImage } from "@/components/ui/SiteImage";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { BUSINESS } from "@/config/site";

type HeroVariant = "a" | "b" | "c";

const STORAGE_KEY = "kgp-hero-variant";

const HERO_META: Record<
  HeroVariant,
  { label: string; name: string; blurb: string }
> = {
  a: {
    label: "A",
    name: "Cinema",
    blurb: "Full-bleed estate visual",
  },
  b: {
    label: "B",
    name: "Split",
    blurb: "Clean editorial layout",
  },
  c: {
    label: "C",
    name: "Corporate",
    blurb: "Dark precision panel",
  },
};

function HeroCopy({ onDark = false }: { onDark?: boolean }) {
  return (
    <>
      <p className={`kgp-hero__brand${onDark ? " kgp-hero__brand--on-dark" : ""}`}>
        {BUSINESS.name}
      </p>
      <h1 className={`kgp-hero__title${onDark ? " kgp-hero__title--on-dark" : ""}`}>
        Exterior painting for West Rand estates
      </h1>
      <p className={`kgp-hero__lead${onDark ? " kgp-hero__lead--on-dark" : ""}`}>
        Roofs, facades, and boundary walls for body corporates and complexes —
        without disturbing residents inside.
      </p>
      <div className="kgp-hero__actions">
        <LeadAssessmentTrigger variant="primary" className="kgp-lp-btn">
          Request a site visit
        </LeadAssessmentTrigger>
        <a
          href={`tel:${BUSINESS.phone}`}
          className={`kgp-lp-btn ${onDark ? "kgp-lp-btn--ghost" : "kgp-lp-btn--outline"}`}
        >
          Call {BUSINESS.phoneDisplay}
        </a>
      </div>
    </>
  );
}

function HeroA() {
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
        <HeroCopy onDark />
        <ul className="kgp-hero__meta">
          <li>Estates &amp; complexes</li>
          <li>West Rand focus</li>
          <li>Owner-managed</li>
        </ul>
      </div>
    </section>
  );
}

function HeroB() {
  return (
    <section className="kgp-hero kgp-hero--b" aria-label="Introduction">
      <div className="kgp-hero__split">
        <div className="kgp-hero__split-visual" aria-hidden="true">
          <SiteImage
            src="/images/project-image-1.jpg"
            alt=""
            fill
            className="kgp-hero__media-img"
            sizes="(max-width: 991px) 100vw, 52vw"
            priority
          />
        </div>
        <div className="kgp-hero__split-copy">
          <div className="kgp-hero__content kgp-hero__content--b">
            <HeroCopy />
            <p className="kgp-hero__footnote">
              Serving Krugersdorp estates including Featherbrooke, Avianto, and
              surrounding complexes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroC() {
  return (
    <section className="kgp-hero kgp-hero--c" aria-label="Introduction">
      <div className="container kgp-hero__panel">
        <div className="kgp-hero__content kgp-hero__content--c">
          <p className="kgp-hero__kicker">Exterior specialists</p>
          <HeroCopy onDark />
          <div className="kgp-hero__stats" aria-label="Focus areas">
            <div>
              <strong>Roofs</strong>
              <span>Coatings built for Highveld weather</span>
            </div>
            <div>
              <strong>Facades</strong>
              <span>Common-property finishes that last</span>
            </div>
            <div>
              <strong>Walls</strong>
              <span>Boundary &amp; perimeter programmes</span>
            </div>
          </div>
        </div>
        <div className="kgp-hero__panel-visual" aria-hidden="true">
          <SiteImage
            src="/images/project-image-5.jpg"
            alt=""
            fill
            className="kgp-hero__media-img"
            sizes="(max-width: 991px) 100vw, 42vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export function HeroHome() {
  const [variant, setVariant] = useState<HeroVariant>("a");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as HeroVariant | null;
    if (saved === "a" || saved === "b" || saved === "c") {
      setVariant(saved);
    }
    setReady(true);
  }, []);

  const choose = (next: HeroVariant) => {
    setVariant(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <>
      {variant === "a" ? <HeroA /> : null}
      {variant === "b" ? <HeroB /> : null}
      {variant === "c" ? <HeroC /> : null}

      <div
        className={`kgp-hero-picker${ready ? " is-ready" : ""}`}
        role="group"
        aria-label="Choose hero layout"
      >
        <p className="kgp-hero-picker__title">Hero</p>
        {(Object.keys(HERO_META) as HeroVariant[]).map((key) => {
          const meta = HERO_META[key];
          return (
            <button
              key={key}
              type="button"
              className={`kgp-hero-picker__btn${variant === key ? " is-active" : ""}`}
              onClick={() => choose(key)}
              aria-pressed={variant === key}
            >
              <span className="kgp-hero-picker__letter">{meta.label}</span>
              <span className="kgp-hero-picker__copy">
                <strong>{meta.name}</strong>
                <small>{meta.blurb}</small>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
