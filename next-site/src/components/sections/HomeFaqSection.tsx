import Link from "next/link";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { homeFaqs } from "@/content/site-content";
import { BUSINESS } from "@/config/site";

const quickLinks = [
  {
    label: "Schedule site inspection",
    action: "assessment" as const,
    icon: "fa-solid fa-clipboard-check",
  },
  { label: "Material QA log", href: "/#qa-log", icon: "fa-solid fa-ruler-combined" },
  { label: "Body corporate guide", href: "/body-corporate-painters", icon: "fa-solid fa-building" },
] as const;

export function HomeFaqSection() {
  return (
    <section className="kgp-faq-section kgp-site-section" aria-labelledby="home-faq-heading">
      <div className="container">
        <header className="kgp-faq-section__header">
          <p className="kgp-faq-section__eyebrow">Trustee &amp; managing agent FAQ</p>
          <h2 id="home-faq-heading" className="kgp-faq-section__title">
            Straight answers on exterior programmes, phasing, and pricing
          </h2>
          <p className="kgp-faq-section__intro">
            Planning a body-corporate repaint or HOA exterior cycle on the West Rand? These are
            the questions trustees and managing agents ask before issuing an RFP.
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
                <h3>Speak to Rico directly</h3>
                <p>Owner-managed from site walk-through to handover — no call centre.</p>
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
                <h3>Popular next steps</h3>
                <ul className="kgp-faq-aside__links">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      {"href" in link ? (
                        <Link href={link.href}>
                          <i className={link.icon} aria-hidden="true" />
                          {link.label}
                        </Link>
                      ) : (
                        <LeadAssessmentTrigger variant="unstyled">
                          <i className={link.icon} aria-hidden="true" />
                          {link.label}
                        </LeadAssessmentTrigger>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/faqs" className="kgp-faq-aside__all">
                View full FAQ library
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
