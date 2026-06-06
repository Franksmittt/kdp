"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/config/site";
import {
  FOOTER_QUICK_LINKS,
  FOOTER_TICKER,
  footerVariantForPath,
  type FooterTickerVariant,
} from "@/lib/navigation";

type SiteFooterProps = {
  tickerVariant?: FooterTickerVariant;
};

function TickerContent({ variant }: { variant: FooterTickerVariant }) {
  const items = FOOTER_TICKER[variant];
  const spans = items.map((text) => (
    <span key={text}>
      <i className="fa-solid fa-asterisk" aria-hidden="true" />
      {text}
    </span>
  ));

  return (
    <>
      <div className="scrolling-content">{spans}</div>
      <div className="scrolling-content">{spans}</div>
    </>
  );
}

export function SiteFooter({ tickerVariant }: SiteFooterProps) {
  const pathname = usePathname();
  const variant = tickerVariant ?? footerVariantForPath(pathname);

  return (
    <footer className="main-footer dark-section">
      <div className="footer-scrolling-ticker">
        <div className="scrolling-ticker-box">
          <TickerContent variant={variant} />
        </div>
      </div>

      <div className="footer-box">
        <div className="container">
          <div className="row">
            <div className="col-xl-4">
              <div className="about-footer">
                <div className="footer-logo">
                  <i className="fa-solid fa-paint-roller" aria-hidden="true" />
                </div>
                <div className="footer-working-hours">
                  <h3>Working Hours:</h3>
                  <ul>
                    <li>Monday - Friday: 09:00 AM - 06:00 PM</li>
                    <li>Saturday - Sunday: Closed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-xl-8">
              <div className="footer-links-box footer-links-box--clean">
                <div className="row g-4 g-lg-5">
                  <div className="col-md-6 col-lg-4">
                    <div className="footer-panel">
                      <h3>Quick links</h3>
                      <ul className="footer-list-links">
                        {FOOTER_QUICK_LINKS.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="footer-panel">
                      <h3>Contact Rico</h3>
                      <ul className="footer-list-contact">
                        <li>
                          <span className="footer-contact-label">Phone</span>{" "}
                          <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
                        </li>
                        <li>
                          <span className="footer-contact-label">WhatsApp</span>{" "}
                          <a
                            href={BUSINESS.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Chat on WhatsApp
                          </a>
                        </li>
                        <li>
                          <span className="footer-contact-label">Email</span>{" "}
                          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="footer-panel">
                      <h3>Service area</h3>
                      <p className="footer-area-text">
                        Krugersdorp, the West Rand, and wider Gauteng. Body corporates,
                        complexes, commercial facades, and private homes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="footer-copyright footer-copyright--simple">
                <p className="footer-copyright-line">
                  <span className="footer-brand-line">{BUSINESS.name}</span>
                  <span className="footer-copy-sep" aria-hidden="true">
                    {" "}
                    ·{" "}
                  </span>
                  <span className="footer-copy-meta">
                    Copyright © 2026. All rights reserved.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
