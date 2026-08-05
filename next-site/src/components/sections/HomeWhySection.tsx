import Link from "next/link";

const REASONS = [
  {
    title: "Exterior specialists",
    text: "Estates and complexes only — roofs, facades, boundary walls.",
  },
  {
    title: "Owner-managed",
    text: "Rico runs the job from first site visit through handover.",
  },
  {
    title: "Clear scopes",
    text: "Written quotes trustees and managing agents can work with.",
  },
  {
    title: "West Rand focus",
    text: "Local teams for Krugersdorp estates and surrounding complexes.",
  },
] as const;

export function HomeWhySection() {
  return (
    <section className="kgp-lp-why" aria-labelledby="home-why-heading">
      <div className="container">
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">Why us</p>
          <h2 id="home-why-heading">Built for estate work</h2>
        </header>

        <ul className="kgp-lp-why__grid">
          {REASONS.map((item, index) => (
            <li key={item.title}>
              <span className="kgp-lp-why__num">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>

        <Link href="/about" className="kgp-lp-text-link">
          About the team
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
