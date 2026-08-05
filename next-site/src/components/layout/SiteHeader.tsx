"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { HEADER_ASSESSMENT_CTA, NAV_LINKS } from "@/lib/navigation";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { BUSINESS } from "@/config/site";

export type HeaderVariant = "a" | "b" | "c";

const STORAGE_KEY = "kgp-header-variant";
const VARIANTS: HeaderVariant[] = ["a", "b", "c"];

function readStoredVariant(): HeaderVariant {
  if (typeof window === "undefined") return "b";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "a" || stored === "b" || stored === "c") return stored;
  return "b";
}

function HeaderChrome({
  variant,
  onVariantChange,
}: {
  variant: HeaderVariant;
  onVariantChange: (next: HeaderVariant) => void;
}) {
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
    const onScroll = () => setScrolled(window.scrollY >= 24);
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
    `kgp-nav--${variant}`,
    navOpen ? "kgp-nav--open" : "",
    scrolled ? "kgp-nav--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClass}>
        {variant === "c" && (
          <div className="kgp-nav__utility">
            <div className="container kgp-nav__utility-inner">
              <p className="kgp-nav__utility-text">
                Exterior painting for West Rand estates &amp; complexes
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
              </div>
            </div>
          </div>
        )}

        <div className="kgp-nav__bar">
          <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
            <div className="container kgp-nav__container">
              <Link className="kgp-nav__brand" href="/" onClick={closeNav}>
                {BUSINESS.name}
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
                    Contact Us
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
                    Contact Us
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

      <div className="kgp-nav-picker" role="region" aria-label="Header design picker">
        <p>Header style</p>
        <div className="kgp-nav-picker__btns">
          {VARIANTS.map((item) => (
            <button
              key={item}
              type="button"
              className={variant === item ? "is-active" : undefined}
              onClick={() => onVariantChange(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function HeaderWithParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [variant, setVariant] = useState<HeaderVariant>("b");

  useEffect(() => {
    const fromQuery = searchParams.get("header");
    if (fromQuery === "a" || fromQuery === "b" || fromQuery === "c") {
      setVariant(fromQuery);
      window.localStorage.setItem(STORAGE_KEY, fromQuery);
      return;
    }
    setVariant(readStoredVariant());
  }, [searchParams]);

  const onVariantChange = useCallback(
    (next: HeaderVariant) => {
      setVariant(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      const params = new URLSearchParams(searchParams.toString());
      params.set("header", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return <HeaderChrome variant={variant} onVariantChange={onVariantChange} />;
}

export function SiteHeader() {
  return (
    <Suspense fallback={<HeaderChrome variant="b" onVariantChange={() => undefined} />}>
      <HeaderWithParams />
    </Suspense>
  );
}
