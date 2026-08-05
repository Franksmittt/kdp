import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";

const SERVICES = [
  {
    title: "Exterior painting",
    href: "/exterior-painting",
    text: "Roofs, facades, and boundary walls for estates and complexes.",
    image: "/images/project-image-1.jpg",
  },
  {
    title: "Body corporate programmes",
    href: "/body-corporate-painters",
    text: "Common-property scopes trustees and managing agents can approve.",
    image: "/images/project-image-3.jpg",
  },
  {
    title: "Estate facades & walls",
    href: "/exterior-painting",
    text: "Street-facing and courtyard finishes that keep estates looking sharp.",
    image: "/images/project-image-5.jpg",
  },
  {
    title: "Roof coatings",
    href: "/exterior-painting",
    text: "Protective exterior roof systems built for Highveld weather.",
    image: "/images/service-image-2.jpg",
  },
  {
    title: "Boundary walls",
    href: "/exterior-painting",
    text: "Perimeter and shared-wall programmes with tidy site control.",
    image: "/images/project-image-6.jpg",
  },
  {
    title: "Phased maintenance",
    href: "/body-corporate-painters/10-year-maintenance-plan",
    text: "Multi-year exterior plans that fit scheme budgets and access rules.",
    image: "/images/feature-item-image-1.jpg",
  },
] as const;

export function HomeServicesSection() {
  return (
    <section className="kgp-lp-services" aria-labelledby="home-services-heading">
      <div className="container">
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">Services</p>
          <h2 id="home-services-heading">What we paint</h2>
          <p className="kgp-lp-section-head__lead">
            Exterior-only work for West Rand estates, body corporates, and complexes.
          </p>
        </header>

        <ul className="kgp-lp-services__grid">
          {SERVICES.map((service) => (
            <li key={service.title}>
              <Link href={service.href} className="kgp-lp-service-card">
                <div className="kgp-lp-service-card__media">
                  <SiteImage
                    src={service.image}
                    alt=""
                    fill
                    className="kgp-lp-service-card__img"
                    sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw"
                  />
                </div>
                <div className="kgp-lp-service-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
