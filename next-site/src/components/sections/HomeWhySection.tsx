const PILLARS = [
  {
    title: "Exterior specialists",
    text: "Estates and complexes only — roofs, facades, boundary walls. We don't do interiors, so we're very good at what we do.",
  },
  {
    title: "Owner-managed",
    text: "Rico runs every job personally. The person who quoted your scheme is the person on site — not a call centre.",
  },
  {
    title: "Estate-ready process",
    text: "Written scopes, agreed working hours, security compliance, and phasing that works around residents and levies.",
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
          {PILLARS.map((item, index) => (
            <li key={item.title}>
              <span className="kgp-lp-why__num">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="kgp-lp-honest">
          <p className="kgp-lp-honest__label">The honest part</p>
          <p className="kgp-lp-honest__text">
            We&apos;re rarely the cheapest quote on the table. Proper prep and
            the right coatings cost more upfront — and years less in redos.
            And if something isn&apos;t right at handover, we come back and
            sort it.
          </p>
        </div>
      </div>
    </section>
  );
}
