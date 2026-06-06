"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { testimonialsCarousel } from "@/content/site-content";

type TestimonialCarouselProps = {
  showSidebar?: boolean;
};

export function TestimonialCarousel({ showSidebar = true }: TestimonialCarouselProps) {
  return (
    <div className="our-testimonials">
      <div className="container">
        <div className="row">
          {showSidebar ? (
            <div className="col-xl-5">
              <div className="our-testimonial-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">Our Testimonials</h3>
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    What clients say after the last coat dries
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    Homeowners, shop owners, and trustees who needed tidy sites and honest
                    timelines.
                  </p>
                </div>
                <div className="testimonial-btn wow fadeInUp" data-wow-delay="0.4s">
                  <Link href="/testimonials" className="btn-default">
                    View all testimonials
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          <div className={showSidebar ? "col-xl-7" : "col-lg-12"}>
            <div className="testimonial-slider-box">
              <div className="testimonial-slider">
                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1}
                  spaceBetween={24}
                  pagination={{ el: ".testimonial-pagination", clickable: true }}
                >
                  {testimonialsCarousel.map((item) => (
                    <SwiperSlide key={item.author}>
                      <div className="testimonial-item">
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
                    </SwiperSlide>
                  ))}
                  <div className="testimonial-pagination" />
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
