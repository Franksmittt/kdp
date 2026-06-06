import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { aboutHome, aboutPage } from "@/content/site-content";

type AboutSectionProps = {
  variant?: "home" | "about";
};

export function AboutSection({ variant = "home" }: AboutSectionProps) {
  const data = variant === "about" ? aboutPage : aboutHome;
  const ctaHref = variant === "about" ? "/contact" : "/about";
  const ctaLabel = variant === "about" ? aboutPage.ctaLabel : "More About Us";

  return (
    <div className="about-us">
      <div className="container">
        <div className="row">
          <div className="col-xl-5">
            <div className="about-us-image-box wow fadeInUp">
              <div className="about-us-image-box-1">
                <div className="about-us-image">
                  <figure className="image-anime">
                    <SiteImage
                      src={data.images[0]}
                      alt="Krugersdorp Painters on site"
                      width={500}
                      height={600}
                    />
                  </figure>
                </div>
              </div>
              <div className="about-us-image-box-2">
                <div className="about-us-image">
                  <figure className="image-anime">
                    <SiteImage
                      src={data.images[1]}
                      alt="Painting and prep work"
                      width={400}
                      height={500}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-7">
            <div className="about-us-content">
              <div className="section-title">
                <h3 className="wow fadeInUp">{data.eyebrow}</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  {data.title}
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.2s">
                  {data.description}
                </p>
              </div>

              <div className="about-us-body wow fadeInUp" data-wow-delay="0.4s">
                {data.bodyItems.map((item) => (
                  <div key={item.title} className="about-body-item">
                    <div className="icon-box">
                      <i className={item.icon} aria-hidden="true" />
                    </div>
                    <div className="about-body-item-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="about-us-footer wow fadeInUp" data-wow-delay="0.6s">
                <div className="about-us-footer-content">
                  <div className="about-footer-content-list">
                    <ul>
                      {data.footerBullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="about-us-btn">
                    <Link href={ctaHref} className="btn-default">
                      {ctaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
