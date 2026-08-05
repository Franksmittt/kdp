import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";

const SERVICES = [
  {
    title: "Exterior painting",
    href: "/exterior-painting",
    image: "/images/project-image-1.jpg",
    icon: "fa-solid fa-paint-roller",
  },
  {
    title: "Body corporate programmes",
    href: "/body-corporate-painters",
    image: "/images/project-image-3.jpg",
    icon: "fa-solid fa-building",
  },
  {
    title: "Estate facades & walls",
    href: "/exterior-painting",
    image: "/images/project-image-5.jpg",
    icon: "fa-solid fa-house",
  },
  {
    title: "Roof coatings",
    href: "/exterior-painting",
    image: "/images/service-image-2.jpg",
    icon: "fa-solid fa-house-chimney",
  },
  {
    title: "Boundary walls",
    href: "/exterior-painting",
    image: "/images/project-image-6.jpg",
    icon: "fa-solid fa-border-all",
  },
  {
    title: "Phased maintenance",
    href: "/body-corporate-painters/10-year-maintenance-plan",
    image: "/images/feature-item-image-1.jpg",
    icon: "fa-solid fa-calendar-check",
  },
] as const;

export function HomeServicesSection() {
  return (
    <section className="kgp-lp-services" aria-labelledby="home-services-heading">
      <div className="container">
        <header className="kgp-lp-section-head">
          <p className="kgp-lp-eyebrow">Our services</p>
          <h2 id="home-services-heading">
            Exterior solutions{" "}
            <span>for estates &amp; complexes</span>
          </h2>
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
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
                  />
                </div>
                <div className="kgp-lp-service-card__body">
                  <span className="kgp-lp-service-card__icon" aria-hidden="true">
                    <i className={service.icon} />
                  </span>
                  <h3>{service.title}</h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
