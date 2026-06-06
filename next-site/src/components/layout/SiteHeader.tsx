"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HEADER_ASSESSMENT_CTA, NAV_LINKS } from "@/lib/navigation";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";

const SCROLL_SOLID_THRESHOLD = 48;

export function SiteHeader() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle("kgp-nav-open", navOpen);
    return () => document.body.classList.remove("kgp-nav-open");
  }, [navOpen]);

  useEffect(() => {
    closeNav();
  }, [pathname, closeNav]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY >= SCROLL_SOLID_THRESHOLD);
    };

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
    "kgp-header",
    navOpen ? "kgp-header--open" : "",
    scrolled ? "kgp-header--scrolled" : "kgp-header--top",
    isHome ? "kgp-header--home" : "kgp-header--inner",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
          <div className="container kgp-header__container">
            <Link className="navbar-brand text-logo" href="/" onClick={closeNav}>
              Krugersdorp Painters
            </Link>

            <div
              className={`navbar-collapse main-menu kgp-nav-panel${navOpen ? " show" : ""}`}
              id="kgp-main-menu"
            >
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  {NAV_LINKS.map((link) => (
                    <li
                      key={link.href}
                      className={[
                        "nav-item",
                        link.mobileOnly ? "d-lg-none" : "",
                        link.desktopHidden ? "d-lg-none" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <Link
                        className={`nav-link${isActive(link.href) ? " active" : ""}`}
                        href={link.href}
                        onClick={closeNav}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="header-btn kgp-header__actions">
                <LeadAssessmentTrigger
                  variant="header"
                  className="kgp-header__cta-secondary d-none d-lg-inline-flex"
                  onActivate={closeNav}
                >
                  {HEADER_ASSESSMENT_CTA.label}
                </LeadAssessmentTrigger>
                <Link
                  href="/contact"
                  className="btn-default btn-highlighted kgp-header__cta-primary"
                  onClick={closeNav}
                >
                  <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
                  Contact Us
                </Link>
              </div>

              <div className="kgp-header__mobile-ctas d-lg-none">
                <LeadAssessmentTrigger
                  variant="header"
                  className="kgp-header__cta-secondary"
                  onActivate={closeNav}
                >
                  {HEADER_ASSESSMENT_CTA.label}
                </LeadAssessmentTrigger>
                <Link
                  href="/contact"
                  className="btn-default btn-highlighted kgp-header__cta-primary"
                  onClick={closeNav}
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <button
              type="button"
              className="navbar-toggle"
              aria-expanded={navOpen}
              aria-controls="kgp-main-menu"
              aria-label={navOpen ? "Close menu" : "Open menu"}
              onClick={() => setNavOpen((o) => !o)}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
