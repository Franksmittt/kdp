import { SiteImage } from "@/components/ui/SiteImage";
import { ctaBox } from "@/content/site-content";
import { BUSINESS } from "@/config/site";

export function CtaSection() {
  return (
    <div className="cta-box dark-section parallaxie kgp-site-section">
      <div className="container">
        <div className="row align-items-stretch cta-box-row">
          <div className="col-12 col-lg-7 col-xl-7 d-flex flex-column">
            <div className="cta-box-content flex-grow-1 w-100">
              <div className="section-title">
                <h3 className="wow fadeInUp">{ctaBox.eyebrow}</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  {ctaBox.title}
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.2s">
                  {ctaBox.description}
                </p>
              </div>

              <div className="cta-box-items-list wow fadeInUp" data-wow-delay="0.4s">
                {ctaBox.items.map((item) => (
                  <div key={item.title} className="cta-box-item">
                    <div className="icon-box">
                      <i className={item.icon} aria-hidden="true" />
                    </div>
                    <div className="cta-box-item-content">
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="cta-box-btn wow fadeInUp d-flex flex-wrap gap-2 align-items-center"
                data-wow-delay="0.6s"
              >
                <a href={`tel:${BUSINESS.phone}`} className="btn-default btn-highlighted">
                  <i className="fa-solid fa-phone" aria-hidden="true" />
                  Call Rico: {BUSINESS.phoneDisplay}
                </a>
                <a
                  href={BUSINESS.whatsapp}
                  className="btn-default btn-highlighted"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                  WhatsApp Rico
                </a>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5 col-xl-5 d-flex flex-column">
            <div className="cta-box-image w-100 flex-grow-1 d-flex flex-column">
              <figure className="cta-box-image-frame mb-0">
                <SiteImage
                  src={ctaBox.image}
                  alt="Contact Krugersdorp Painters"
                  width={600}
                  height={500}
                  className="cta-box-image-photo"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
