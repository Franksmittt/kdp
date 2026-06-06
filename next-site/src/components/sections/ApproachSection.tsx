import { SiteImage } from "@/components/ui/SiteImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { aboutApproach } from "@/content/site-content";

export function ApproachSection() {
  return (
    <div className="our-approach dark-section parallaxie">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <SectionTitle
              eyebrow="Our approach"
              title="Prep-first work with clear scopes from first visit to handover"
              centered
            />
          </div>
        </div>

        <div className="row">
          {aboutApproach.map((item, i) => (
            <div key={item.title} className="col-xl-4 col-md-6">
              <div
                className={`approach-item box-${i + 1} wow fadeInUp`}
                data-wow-delay={i > 0 ? `${i * 0.2}s` : undefined}
              >
                <div className="approach-item-image">
                  <figure>
                    <SiteImage
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={300}
                    />
                  </figure>
                </div>
                <div className="approach-item-content">
                  <div className="icon-box">
                    <i className={`${item.icon} theme-icon--approach`} aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.tags ? (
                    <ul>
                      {item.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
