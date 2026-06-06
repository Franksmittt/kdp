import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { homeFaqs, serviceSingleContent } from "@/content/site-content";
import { BUSINESS } from "@/config/site";

export function ServiceSingleContent() {
  const data = serviceSingleContent;

  return (
    <div className="page-service-single">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="page-single-sidebar">
              <div className="page-category-list wow fadeInUp">
                <h3>Explore Our Services</h3>
                <ul>
                  {data.sidebarCategories.map((cat) => (
                    <li key={cat.label}>
                      <Link href={cat.href}>{cat.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar-cta-box wow fadeInUp" data-wow-delay="0.25s">
                <div className="sidebar-cta-title">
                  <h3>Do You Need Help!</h3>
                </div>
                <div className="sidebar-cta-body">
                  <div className="sidebar-cta-body-content">
                    <ul>
                      <li>
                        <i className="fa-solid fa-phone" aria-hidden="true" />
                        <a href={`tel:${BUSINESS.phone}`}>
                          {BUSINESS.phoneDisplay}
                        </a>{" "}
                        (Rico)
                      </li>
                      <li>
                        <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                        <a
                          href={BUSINESS.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp Rico
                        </a>
                      </li>
                      <li>
                        <i className="fa-solid fa-envelope" aria-hidden="true" />
                        <Link href="/contact">Contact form</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="sidebar-cta-body-image">
                    <figure>
                      <SiteImage
                        src="/images/sidebar-body-image.png"
                        alt=""
                        width={200}
                        height={200}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="service-single-content">
              <div className="page-single-image">
                <figure className="image-anime reveal">
                  <SiteImage
                    src={data.heroImage}
                    alt="Krugersdorp Painters services"
                    width={800}
                    height={500}
                    className="img-fluid"
                  />
                </figure>
              </div>

              <div className="service-entry">
                <p className="wow fadeInUp">
                  <strong>Technical property maintenance, done properly.</strong>{" "}
                  {data.intro.paragraphs[0].replace(
                    /^Technical property maintenance, done properly\.\s*/,
                    "",
                  )}
                </p>
                <p className="wow fadeInUp" data-wow-delay="0.1s">
                  Below is how we scope and deliver the four pillars of our service. For a
                  site-specific quote or phased programme for a scheme,{" "}
                  <Link href="/contact">use the contact form</Link> or{" "}
                  <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer">
                    message Rico on WhatsApp
                  </a>
                  .
                </p>

                {data.sections.map((section) => (
                  <div key={section.title}>
                    <h2 className="text-anime-style-3 mt-5">{section.title}</h2>
                    {section.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)} className="wow fadeInUp">
                        {p}
                      </p>
                    ))}
                    <div className="service-offer-list wow fadeInUp" data-wow-delay="0.1s">
                      <ul>
                        {section.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                <div className="service-why-choose-box wow fadeInUp mt-5">
                  <h3>{data.whyChoose.title}</h3>
                  <ul>
                    {data.whyChoose.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-process-box wow fadeInUp mt-5">
                  <h3>{data.process.title}</h3>
                  <ol>
                    {data.process.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <figure className="mt-4">
                    <SiteImage
                      src={data.process.image}
                      alt="Service process"
                      width={700}
                      height={400}
                    />
                  </figure>
                </div>
              </div>

              <div className="page-single-faqs mt-5">
                <h3>Frequently asked questions</h3>
                <FaqAccordion items={homeFaqs} idPrefix="service" defaultOpenId="hf1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
