const PAIRS = [
  {
    pain: "Peeling & fading",
    fix: "Prep-first repaints with coatings chosen for Highveld sun and rain.",
  },
  {
    pain: "Resident complaints",
    fix: "Phased sections, agreed working hours, notices, and tidy sites daily.",
  },
  {
    pain: "Budget pressure",
    fix: "Block-by-block phasing and itemised scopes that fit levy planning.",
  },
] as const;

export function HomeGapSection() {
  return (
    <section className="kgp-lp-gap" aria-labelledby="home-gap-heading">
      <div className="container">
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">For trustees &amp; managing agents</p>
          <h2 id="home-gap-heading">
            The exterior is the first thing residents — and buyers — judge
          </h2>
          <p className="kgp-lp-section-head__lead">
            Patchy repairs and contractors who vanish mid-job create complaints
            and eat budgets. A proper exterior programme fixes the scheme once,
            then keeps it maintained.
          </p>
        </header>

        <ul className="kgp-lp-gap__grid">
          {PAIRS.map((item) => (
            <li key={item.pain}>
              <h3>{item.pain}</h3>
              <p>{item.fix}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
