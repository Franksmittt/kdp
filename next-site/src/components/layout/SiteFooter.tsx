import Link from "next/link";
import { BUSINESS } from "@/config/site";
import { FOOTER_QUICK_LINKS } from "@/lib/navigation";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="kgp-footer">
      <div className="container">
        <div className="kgp-footer__row">
          <div className="kgp-footer__brand">
            <Link href="/" className="kgp-footer__logo">
              {BUSINESS.name}
            </Link>
            <p>Exterior painting · West Rand estates &amp; complexes</p>
          </div>

          <nav className="kgp-footer__nav" aria-label="Footer">
            {FOOTER_QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="kgp-footer__contact">
            <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </div>
        </div>

        <div className="kgp-footer__bottom">
          <p>
            © {year} {BUSINESS.name}
          </p>
          <p>
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
