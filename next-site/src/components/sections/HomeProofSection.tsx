import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";

const SHOTS = [
  {
    src: "/images/project-image-1.jpg",
    label: "Estate facades",
  },
  {
    src: "/images/project-image-2.jpg",
    label: "Common-property walls",
  },
  {
    src: "/images/project-image-5.jpg",
    label: "Complex elevations",
  },
  {
    src: "/images/service-image-2.jpg",
    label: "Roof coatings",
  },
] as const;

export function HomeProofSection() {
  return (
    <section className="kgp-lp-proof" aria-labelledby="home-proof-heading">
      <div className="container">
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">Proof</p>
          <h2 id="home-proof-heading">Exterior work on real schemes</h2>
          <p className="kgp-lp-section-head__lead">
            Product-in-use beats brochure claims. This is the kind of exterior
            work trustees and managing agents appoint us for.
          </p>
        </header>

        <ul className="kgp-lp-proof__grid">
          {SHOTS.map((shot) => (
            <li key={shot.src}>
              <div className="kgp-lp-proof__shot">
                <SiteImage
                  src={shot.src}
                  alt=""
                  fill
                  className="kgp-lp-proof__img"
                  sizes="(max-width: 767px) 50vw, 25vw"
                />
              </div>
              <p>{shot.label}</p>
            </li>
          ))}
        </ul>

        <Link href="/projects" className="kgp-lp-text-link">
          View projects
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
