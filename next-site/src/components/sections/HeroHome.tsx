"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { SiteImage } from "@/components/ui/SiteImage";
import { heroSlides, heroTrustSignals, type HeroSlide } from "@/content/site-content";

function HeroCta({
  cta,
  variant,
}: {
  cta: HeroSlide["primaryCta"];
  variant: "primary" | "secondary";
}) {
  if (cta.action === "assessment" || !cta.href) {
    return (
      <LeadAssessmentTrigger variant={variant === "primary" ? "primary" : "secondary"}>
        {cta.label}
        {variant === "secondary" && (
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        )}
      </LeadAssessmentTrigger>
    );
  }

  if (variant === "primary") {
    return (
      <Link href={cta.href} className="btn-default btn-highlighted kgp-hero__btn">
        {cta.label}
      </Link>
    );
  }

  return (
    <Link href={cta.href} className="kgp-hero__btn-secondary">
      {cta.label}
      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
    </Link>
  );
}

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
        <Swiper
          className="kgp-hero__swiper"
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          slidesPerView={1}
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={600}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          pagination={{
            el: ".kgp-hero__pagination",
            clickable: true,
          }}
          navigation={{
            prevEl: ".kgp-hero__nav--prev",
            nextEl: ".kgp-hero__nav--next",
          }}
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <div className="kgp-hero__grid">
                <div className="kgp-hero__copy">
                  <p className="kgp-hero__eyebrow">{slide.eyebrow}</p>
                  <h1 className="kgp-hero__title">{slide.title}</h1>
                  <p className="kgp-hero__lead">{slide.lead}</p>
                  <p className="kgp-hero__sub">{slide.leadSecondary}</p>
                  <div className="kgp-hero__actions">
                    <HeroCta cta={slide.primaryCta} variant="primary" />
                    <HeroCta cta={slide.secondaryCta} variant="secondary" />
                  </div>
                </div>

                <div className="kgp-hero__visual">
                  <figure className="kgp-hero__figure">
                    <SiteImage
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      className="kgp-hero__figure-img"
                      sizes="(max-width: 991px) 92vw, 42vw"
                      priority
                    />
                  </figure>
                  <div className="kgp-hero__visual-badge">
                    <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                    Exterior-only · West Rand
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <ul className="kgp-hero__trust">
          {heroTrustSignals.map((item) => (
            <li key={item.label} className="kgp-hero__trust-item">
              <i className={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="kgp-hero__controls">
          <button
            type="button"
            className="kgp-hero__nav kgp-hero__nav--prev"
            aria-label="Previous slide"
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          </button>
          <div className="kgp-hero__pagination" aria-label="Hero slides" />
          <button
            type="button"
            className="kgp-hero__nav kgp-hero__nav--next"
            aria-label="Next slide"
          >
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
