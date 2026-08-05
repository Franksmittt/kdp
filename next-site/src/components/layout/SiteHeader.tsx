"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HEADER_ASSESSMENT_CTA, NAV_LINKS } from "@/lib/navigation";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { BUSINESS } from "@/config/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle("kgp-nav-open", navOpen);
    return () => document.body.classList.remove("kgp-nav-open");
  }, [navOpen]);

  useEffect(() => {
    closeNav();
  }, [pathname, closeNav]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const headerClass = [
    "main-header",
    "kgp-nav",
    "kgp-nav--c",
    navOpen ? "kgp-nav--open" : "",
    scrolled ? "kgp-nav--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="kgp-nav__utility">
        <div className="container kgp-nav__utility-inner">
          <p className="kgp-nav__utility-text">
            <span className="kgp-nav__pulse" aria-hidden="true" />
            Exterior specialists · West Rand estates &amp; complexes
          </p>
          <div className="kgp-nav__utility-links">
            <a href={`tel:${BUSINESS.phone}`}>
              <i className="fa-solid fa-phone" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
              WhatsApp
            </a>
            <a href={`mailto:${BUSINESS.email}`} className="d-none d-xl-inline-flex">
              <i className="fa-solid fa-envelope" aria-hidden="true" />
              {BUSINESS.email}
            </a>
          </div>
        </div>
      </div>

      <div className="kgp-nav__bar">
        <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
          <div className="container kgp-nav__container">
            <Link className="kgp-nav__brand" href="/" onClick={closeNav}>
              <span className="kgp-nav__mark" aria-hidden="true">
                K
              </span>
              <span className="kgp-nav__brand-text">
                <span className="kgp-nav__brand-name">{BUSINESS.name}</span>
                <span className="kgp-nav__brand-sub">Exterior · Estates · Complexes</span>
              </span>
            </Link>

            <div
              className={`kgp-nav__panel${navOpen ? " is-open" : ""}`}
              id="kgp-main-menu"
            >
              <ul className="kgp-nav__links">
                {NAV_LINKS.map((link) => (
                  <li
                    key={link.href}
                    className={[
                      link.mobileOnly ? "d-lg-none" : "",
                      link.desktopHidden ? "d-lg-none" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <Link
                      href={link.href}
                      className={isActive(link.href) ? "is-active" : undefined}
                      onClick={closeNav}
                      aria-current={isActive(link.href) ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="kgp-nav__actions">
                <LeadAssessmentTrigger
                  variant="header"
                  className="kgp-nav__cta kgp-nav__cta--ghost d-none d-lg-inline-flex"
                  onActivate={closeNav}
                >
                  {HEADER_ASSESSMENT_CTA.label}
                </LeadAssessmentTrigger>
                <Link
                  href="/contact"
                  className="kgp-nav__cta kgp-nav__cta--solid"
                  onClick={closeNav}
                >
                  Contact
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>

              <div className="kgp-nav__mobile-actions d-lg-none">
                <LeadAssessmentTrigger
                  variant="header"
                  className="kgp-nav__cta kgp-nav__cta--ghost"
                  onActivate={closeNav}
                >
                  {HEADER_ASSESSMENT_CTA.label}
                </LeadAssessmentTrigger>
                <Link
                  href="/contact"
                  className="kgp-nav__cta kgp-nav__cta--solid"
                  onClick={closeNav}
                >
                  Contact
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <button
              type="button"
              className="kgp-nav__toggle"
              aria-expanded={navOpen}
              aria-controls="kgp-main-menu"
              aria-label={navOpen ? "Close menu" : "Open menu"}
              onClick={() => setNavOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
