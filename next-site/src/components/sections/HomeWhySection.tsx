import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";

const REASONS = [
  {
    num: "01",
    title: "Exterior specialists",
    text: "We focus on estates and complexes — roofs, facades, and boundary walls.",
  },
  {
    num: "02",
    title: "Owner-managed",
    text: "Rico runs the job from the first site visit through to handover.",
  },
  {
    num: "03",
    title: "Clear scopes",
    text: "Written exterior quotes trustees and managing agents can work with.",
  },
  {
    num: "04",
    title: "Prep-first quality",
    text: "Surfaces are prepared properly so coatings last in Highveld weather.",
  },
  {
    num: "05",
    title: "Phased programmes",
    text: "Larger schemes can be painted block by block to suit budgets.",
  },
  {
    num: "06",
    title: "West Rand focus",
    text: "Local teams for Krugersdorp estates, body corporates, and complexes.",
  },
] as const;

const COLLAGE = [
  "/images/project-image-2.jpg",
  "/images/project-image-3.jpg",
  "/images/about-us-image-2.jpg",
  "/images/feature-item-image-2.jpg",
  "/images/service-image-3.jpg",
] as const;

export function HomeWhySection() {
  return (
    <section className="kgp-lp-why" aria-labelledby="home-why-heading">
      <div className="container">
        <div className="kgp-lp-why__grid">
          <div className="kgp-lp-why__copy">
            <p className="kgp-lp-eyebrow">Why choose us</p>
            <h2 id="home-why-heading">
              Experience. Quality.{" "}
              <span>Results you can trust.</span>
            </h2>

            <ul className="kgp-lp-why__list">
              {REASONS.map((item) => (
                <li key={item.num}>
                  <span className="kgp-lp-why__num">{item.num}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/about" className="kgp-lp-btn">
              Learn more about us
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <div className="kgp-lp-why__visual" aria-hidden="true">
            <div className="kgp-lp-why__collage">
              {COLLAGE.map((src, index) => (
                <div
                  key={src}
                  className={`kgp-lp-why__shot kgp-lp-why__shot--${index + 1}`}
                >
                  <SiteImage
                    src={src}
                    alt=""
                    fill
                    className="kgp-lp-why__img"
                    sizes="(max-width: 991px) 45vw, 22vw"
                  />
                </div>
              ))}
              <div className="kgp-lp-dots kgp-lp-dots--why" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
