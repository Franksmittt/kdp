import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { featuresHome } from "@/content/site-content";

export function FeaturesSection() {
  const box1 = featuresHome.items[0];
  const box2 = featuresHome.items[1];
  const box3 = featuresHome.items[2];

  return (
    <div className="our-features">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title section-title-center">
              <h3 className="wow fadeInUp">{featuresHome.eyebrow}</h3>
              <h2 className="text-effect" data-cursor="-opaque">
                {featuresHome.title}{" "}
                <span className="feature-title-img-3">
                  {featuresHome.authorImages.map((src, i) => (
                    <SiteImage key={i} src={src} alt="" width={40} height={40} />
                  ))}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 col-md-6 order-1">
            <div className="feature-item box-1 wow fadeInUp">
              <div
                className="kgp-feature-img-placeholder kgp-feature-img-placeholder--dark"
                role="img"
                aria-label="Photo placeholder"
              >
                <span className="kgp-feature-img-placeholder__label" aria-hidden="true">
                  Image
                </span>
              </div>
              <div className="feature-item-shape-image">
                <figure>
                  <SiteImage
                    src={box1.image}
                    alt={box1.title}
                    width={400}
                    height={300}
                  />
                </figure>
              </div>
              <div className="feature-item-content-box">
                <div className="feature-item-content">
                  <h3>{box1.title}</h3>
                  <p>{box1.description}</p>
                </div>
                <div className="feature-item-list">
                  <ul>
                    {box1.bullets?.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 order-xl-2 order-md-3 order-2">
            <div className="feature-item box-2 wow fadeInUp" data-wow-delay="0.2s">
              <div className="feature-item-info">
                <div className="feature-item-info-content">
                  <p>{box2.eyebrow}</p>
                  <h3>{box2.title}</h3>
                </div>
              </div>
              <div className="feature-item-image">
                <figure>
                  <SiteImage
                    src={box2.image}
                    alt={box2.title}
                    width={400}
                    height={300}
                  />
                </figure>
              </div>
              <div className="feature-item-btn">
                <Link href="/contact" className="readmore-btn">
                  <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
                  Get a free quote
                </Link>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6 order-xl-3 order-md-2 order-3">
            <div className="feature-item box-3 wow fadeInUp" data-wow-delay="0.4s">
              <div className="feature-item-content-box">
                <div className="feature-item-content">
                  <h2>
                    <span className="counter">{box3.counter}</span>+
                  </h2>
                  <h3>{box3.title}</h3>
                </div>
                <div className="feature-item-counter-info">
                  <p>{box3.description}</p>
                </div>
                <div
                  className="kgp-feature-img-placeholder kgp-feature-img-placeholder--accent"
                  role="img"
                  aria-label="Photo placeholder"
                >
                  <span className="kgp-feature-img-placeholder__label" aria-hidden="true">
                    Image
                  </span>
                </div>
                <div className="feature-item-tag-list">
                  <ul>
                    {box3.tags?.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
