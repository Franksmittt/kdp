import Link from "next/link";
import { WEST_RAND_ESTATES } from "@/content/estates";

export function HomeEstatesStrip() {
  const estates = WEST_RAND_ESTATES.slice(0, 8);

  return (
    <section className="kgp-lp-estates" aria-labelledby="home-estates-heading">
      <div className="container">
        <div className="kgp-lp-estates__head">
          <p className="kgp-lp-eyebrow">Service areas</p>
          <h2 id="home-estates-heading">West Rand estates &amp; complexes</h2>
        </div>
        <ul className="kgp-lp-estates__list">
          {estates.map((estate) => (
            <li key={estate.slug}>
              <Link href={`/service-areas/krugersdorp/${estate.slug}`}>
                {estate.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="kgp-lp-estates__note">
          Exterior programmes for body corporates and managing agents across
          Krugersdorp and the wider West Rand.
        </p>
      </div>
    </section>
  );
}
