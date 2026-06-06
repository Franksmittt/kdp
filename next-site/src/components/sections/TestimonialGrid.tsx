import Link from "next/link";
import { testimonialsGrid } from "@/content/site-content";

type TestimonialGridProps = {
  showIntro?: boolean;
};

export function TestimonialGrid({ showIntro = true }: TestimonialGridProps) {
  return (
    <div className="page-testimonials">
      <div className="container">
        {showIntro ? (
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">What clients say</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Homes, shops, and schemes we have painted
                </h2>
              </div>
            </div>
          </div>
        ) : null}

        <div className="row">
          {testimonialsGrid.map((item, i) => (
            <div key={item.author} className="col-xl-4 col-md-6">
              <div
                className="testimonial-item wow fadeInUp"
                data-wow-delay={i > 0 ? `${i * 0.1}s` : undefined}
              >
                <div className="testimonial-company-logo">
                  <i className="fa-solid fa-quote-left" aria-hidden="true" />
                </div>
                <div className="testimonial-item-body">
                  <div className="testimonial-item-content">
                    <p>&ldquo;{item.quote}&rdquo;</p>
                  </div>
                  <div className="testimonial-author-content">
                    <h3>{item.author}</h3>
                    <p>{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row section-row">
          <div className="col-lg-12 text-center">
            <Link href="/contact" className="btn-default">
              <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
              Get your free quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
