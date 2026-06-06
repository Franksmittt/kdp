import { ContactForm } from "@/components/sections/ContactForm";
import { BUSINESS } from "@/config/site";

export function ContactSection() {
  return (
    <div className="page-contact-us">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="contact-us-content">
              <div className="section-title">
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Quotes for painting, roofs, waterproofing, and maintenance
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.2s">
                  Tell us about your home, commercial facade, or body-corporate scheme.
                  Photos help us scope prep and access before we visit.
                </p>
              </div>

              <div className="contact-info-list wow fadeInUp" data-wow-delay="0.4s">
                <div className="contact-info-item">
                  <div className="icon-box">
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                  </div>
                  <div className="contact-info-content">
                    <h3>Phone Number</h3>
                    <p>
                      <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
                    </p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="icon-box">
                    <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                  </div>
                  <div className="contact-info-content">
                    <h3>WhatsApp Rico</h3>
                    <p>
                      <a
                        href={BUSINESS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {BUSINESS.phoneDisplay}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="icon-box">
                    <i className="fa-solid fa-envelope" aria-hidden="true" />
                  </div>
                  <div className="contact-info-content">
                    <h3>Email Address</h3>
                    <p>
                      <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
                    </p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="icon-box">
                    <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  </div>
                  <div className="contact-info-content">
                    <h3>Service area</h3>
                    <p>
                      Krugersdorp, the West Rand, and wider Gauteng — body corporates,
                      complexes, commercial facades, and private homes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="contact-us-form wow fadeInUp" data-wow-delay="0.2s">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
