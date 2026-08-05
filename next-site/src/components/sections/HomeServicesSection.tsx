import Link from "next/link";

const SERVICES = [
  {
    title: "Exterior painting",
    href: "/exterior-painting",
    text: "Roofs, facades, and boundary walls for estates and complexes.",
  },
  {
    title: "Body corporate programmes",
    href: "/body-corporate-painters",
    text: "Common-property scopes trustees and managing agents can approve.",
  },
  {
    title: "Phased maintenance",
    href: "/body-corporate-painters/10-year-maintenance-plan",
    text: "Multi-year exterior plans that fit scheme budgets and access rules.",
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

        <ul className="kgp-lp-services__list">
          {SERVICES.map((service) => (
            <li key={service.title}>
              <Link href={service.href} className="kgp-lp-service-row">
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
                <span className="kgp-lp-service-row__go" aria-hidden="true">
                  <i className="fa-solid fa-arrow-right" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
