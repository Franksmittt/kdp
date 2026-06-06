import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { serviceBenefitTags, services } from "@/content/site-content";
import { BUSINESS } from "@/config/site";

type ServicesGridProps = {
  showIntro?: boolean;
  introTitle?: string;
  introEyebrow?: string;
};

export function ServicesGrid({
  showIntro = true,
  introTitle = "Painting, roofs, waterproofing, and maintenance, with complexes and body corporates in mind",
  introEyebrow = "Our Services",
}: ServicesGridProps) {
  return (
    <div className={showIntro ? "our-services" : "page-services"}>
      <div className="container">
        {showIntro ? (
          <div className="row section-row">
            <div className="col-lg-12">
              <SectionTitle
                eyebrow={introEyebrow}
                title={introTitle}
                centered
              />
            </div>
          </div>
        ) : null}

        <div className="row services-item-list">
          {services.map((service, i) => (
            <div key={service.title} className="col-xl-3 col-md-6">
              <div
                className={`service-item wow fadeInUp${i === 0 ? " active" : ""}`}
                data-wow-delay={i > 0 ? `${i * 0.2}s` : undefined}
              >
                <div className="service-item-header">
                  <div className="service-item-title">
                    <h2>
                      <Link href={service.href}>{service.title}</Link>
                    </h2>
                    <h3>{service.number}</h3>
                  </div>
                  <div className="service-item-content">
                    <p>{service.description}</p>
                  </div>
                </div>
                <div className="service-image-box">
                  <div className="service-item-image">
                    <figure className="image-anime">
                      <SiteImage
                        src={service.image}
                        alt={service.title}
                        width={400}
                        height={300}
                      />
                    </figure>
                  </div>
                  <div className="service-item-btn">
                    <Link href={service.href} aria-label={`View ${service.title}`}>
                      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="col-lg-12">
            <div className="service-benefit-box wow fadeInUp" data-wow-delay="0.4s">
              <div className="service-benefit-list">
                <ul>
                  {serviceBenefitTags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div className="section-footer-text">
                <p>
                  <span>Free</span>
                  Tell us what needs coating and we will price it clearly.{" "}
                  <Link href="/contact" className="link-contact">
                    <i
                      className="fa-solid fa-envelope inline-contact-icon"
                      aria-hidden="true"
                    />
                    Get a free quote
                  </Link>{" "}
                  or{" "}
                  <a
                    href={BUSINESS.whatsapp}
                    className="link-contact"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i
                      className="fa-brands fa-whatsapp inline-contact-icon"
                      aria-hidden="true"
                    />
                    WhatsApp Rico
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
