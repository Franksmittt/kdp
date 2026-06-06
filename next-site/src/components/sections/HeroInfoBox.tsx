import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { heroInfoBox } from "@/content/site-content";

export function HeroInfoBox() {
  return (
    <div className="hero-info-box hero-info-below-fold">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero-info-list">
              <div className="hero-info-item box-1">
                <div className="hero-info-content-box">
                  <div className="hero-info-item-content">
                    <ul>
                      <li>{heroInfoBox.box1.tagline}</li>
                    </ul>
                    <h3>{heroInfoBox.box1.title}</h3>
                  </div>
                  <div className="hero-info-btn">
                    <Link href="/contact" className="readmore-btn">
                      <i
                        className="fa-solid fa-envelope btn-contact-icon"
                        aria-hidden="true"
                      />
                      Learn More
                    </Link>
                  </div>
                </div>
                <div className="hero-info-image">
                  <figure className="image-anime reveal">
                    <SiteImage
                      src={heroInfoBox.box1.image}
                      alt="Prep-first painting on the West Rand"
                      width={600}
                      height={400}
                    />
                  </figure>
                </div>
              </div>

              <div className="hero-info-item box-2">
                <figure className="image-anime reveal">
                  <SiteImage
                    src={heroInfoBox.box2.image}
                    alt="Exterior painting project"
                    width={600}
                    height={400}
                  />
                </figure>
              </div>

              <div className="hero-info-item box-3">
                <div className="hero-info-header">
                  <div className="icon-box">
                    <i className="fa-solid fa-paintbrush" aria-hidden="true" />
                  </div>
                  <div className="satisfy-client-images">
                    {heroInfoBox.box3.authorImages.map((src, i) => (
                      <div key={i} className="satisfy-client-image">
                        <figure className="image-anime">
                          <SiteImage
                            src={src}
                            alt=""
                            width={48}
                            height={48}
                          />
                        </figure>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hero-info-counter-box">
                  <h3>{heroInfoBox.box3.title}</h3>
                  <h2>
                    <span className="counter">{heroInfoBox.box3.counter}</span>+
                  </h2>
                </div>
                <div className="hero-info-bg-icon">
                  <i
                    className="fa-solid fa-paint-roller theme-icon--hero-bg"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
