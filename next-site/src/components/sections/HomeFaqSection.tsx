import Link from "next/link";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { homeFaqs } from "@/content/site-content";
import { BUSINESS } from "@/config/site";

export function HomeFaqSection() {
  return (
    <section className="kgp-faq-section kgp-site-section" aria-labelledby="home-faq-heading">
      <div className="container">
        <header className="kgp-faq-section__header">
          <h2 id="home-faq-heading" className="kgp-faq-section__title">
            Common questions
          </h2>
          <p className="kgp-faq-section__intro">
            Straight answers for trustees, managing agents, and estate managers.
          </p>
        </header>

        <div className="row g-4 g-xl-5 align-items-start">
          <div className="col-lg-8">
            <FaqAccordion
              items={homeFaqs}
              idPrefix="home"
              defaultOpenId="hf1"
              variant="modern"
            />
          </div>

          <aside className="col-lg-4">
            <div className="kgp-faq-aside">
              <div className="kgp-faq-aside__card kgp-faq-aside__card--contact">
                <div className="kgp-faq-aside__icon" aria-hidden="true">
                  <i className="fa-solid fa-phone" />
                </div>
                <h3>Speak to Rico</h3>
                <p>Owner-managed from first site visit to handover.</p>
                <div className="kgp-faq-aside__actions">
                  <a href={`tel:${BUSINESS.phone}`} className="btn-default btn-highlighted">
                    Call {BUSINESS.phoneDisplay}
                  </a>
                  <a
                    href={BUSINESS.whatsapp}
                    className="kgp-faq-aside__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                    WhatsApp Rico
                  </a>
                </div>
              </div>

              <div className="kgp-faq-aside__card">
                <h3>Next step</h3>
                <ul className="kgp-faq-aside__links">
                  <li>
                    <LeadAssessmentTrigger variant="unstyled">
                      <i className="fa-solid fa-clipboard-check" aria-hidden="true" />
                      Request a site visit
                    </LeadAssessmentTrigger>
                  </li>
                  <li>
                    <Link href="/body-corporate-painters">
                      <i className="fa-solid fa-building" aria-hidden="true" />
                      Body corporate painting
                    </Link>
                  </li>
                  <li>
                    <Link href="/exterior-painting">
                      <i className="fa-solid fa-paint-roller" aria-hidden="true" />
                      Exterior services
                    </Link>
                  </li>
                </ul>
              </div>

              <Link href="/faqs" className="kgp-faq-aside__all">
                More FAQs
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
