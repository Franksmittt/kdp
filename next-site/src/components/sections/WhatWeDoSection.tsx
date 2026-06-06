import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { whatWeDoHome } from "@/content/site-content";

type WhatWeDoSectionProps = {
  data?: typeof whatWeDoHome;
};

export function WhatWeDoSection({ data = whatWeDoHome }: WhatWeDoSectionProps) {
  return (
    <div className="what-we-do">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-xl-7">
            <div className="what-we-do-content">
              <div className="section-title">
                <h3 className="wow fadeInUp">{data.eyebrow}</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  {data.title}
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.2s">
                  {data.description}
                </p>
              </div>

              <div className="what-we-do-item-list wow fadeInUp" data-wow-delay="0.4s">
                {data.items.map((item) => (
                  <div key={item.title} className="what-we-do-item">
                    <div className="icon-box">
                      <i className={item.icon} aria-hidden="true" />
                    </div>
                    <div className="what-we-do-item-body">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <ul>
                        {item.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="what-we-do-btn wow fadeInUp" data-wow-delay="0.6s">
                <Link href="/contact" className="btn-default">
                  <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
                  Contact Us Today
                </Link>
              </div>
            </div>
          </div>

          <div className="col-xl-5">
            <div className="what-we-do-image wow fadeInUp" data-wow-delay="0.2s">
              <figure>
                <SiteImage
                  src={data.image}
                  alt="What we do"
                  width={600}
                  height={700}
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
