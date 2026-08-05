"use client";

import Link from "next/link";
import { BUSINESS } from "@/config/site";
import { FOOTER_QUICK_LINKS } from "@/lib/navigation";

const WORKING_HOURS = [
  { label: "Monday – Friday", value: "09:00 AM – 06:00 PM" },
  { label: "Saturday – Sunday", value: "Closed" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="kgp-footer">
      <div className="container">
        <div className="kgp-footer__top">
          <div className="kgp-footer__brand">
            <Link href="/" className="kgp-footer__logo">
              {BUSINESS.name}
            </Link>
            <p className="kgp-footer__tagline">{BUSINESS.slogan}</p>

            <div className="kgp-footer__hours">
              <h3>Working hours</h3>
              <ul>
                {WORKING_HOURS.map((row) => (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="kgp-footer__col">
            <h3>Quick links</h3>
            <ul className="kgp-footer__links">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="kgp-footer__col">
            <h3>Contact Rico</h3>
            <ul className="kgp-footer__contact">
              <li>
                <span>Phone</span>
                <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
              </li>
              <li>
                <span>WhatsApp</span>
                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <span>Email</span>
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </li>
            </ul>
          </div>

          <div className="kgp-footer__col">
            <h3>Service area</h3>
            <p className="kgp-footer__area">
              Krugersdorp and the West Rand. Exterior painting for estates, body
              corporates, and complexes.
            </p>
          </div>
        </div>

        <div className="kgp-footer__bottom">
          <p className="kgp-footer__copy">
            {BUSINESS.name} · Copyright © {year}. All rights reserved.
          </p>
          <p className="kgp-footer__credit">
            Designed, Developed and Maintained by{" "}
            <a
              href="https://www.endpointmedia.co.za/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Endpoint Media
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
