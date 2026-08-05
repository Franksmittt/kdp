const TESTIMONIALS = [
  {
    quote:
      "They phased the exterior over weekends so residents weren’t disrupted. The trustees signed off without rework.",
    name: "Jenny Wilson",
    place: "Body corporate chair, West Rand",
  },
  {
    quote:
      "Clear exterior scope, tidy site daily, and the boundary walls look sharp. Easy to work with as managing agent.",
    name: "David Mokoena",
    place: "Managing agent, Krugersdorp",
  },
  {
    quote:
      "Roof and facade work done properly. They stuck to estate hours and left the common areas clean every day.",
    name: "Sarah Ndlovu",
    place: "Estate committee, Featherbrooke",
  },
] as const;

export function HomeTestimonialsSection() {
  return (
    <section
      className="kgp-lp-testimonials"
      aria-labelledby="home-testimonials-heading"
    >
      <div className="container">
        <header className="kgp-lp-section-head">
          <p className="kgp-lp-eyebrow">What our clients say</p>
          <h2 id="home-testimonials-heading">
            Trusted by estates{" "}
            <span>across the West Rand</span>
          </h2>
        </header>

        <ul className="kgp-lp-testimonials__grid">
          {TESTIMONIALS.map((item) => (
            <li key={item.name} className="kgp-lp-quote-card">
              <span className="kgp-lp-quote-card__mark" aria-hidden="true">
                “
              </span>
              <div
                className="kgp-lp-quote-card__stars"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className="fa-solid fa-star" aria-hidden="true" />
                ))}
              </div>
              <p className="kgp-lp-quote-card__text">{item.quote}</p>
              <p className="kgp-lp-quote-card__name">{item.name}</p>
              <p className="kgp-lp-quote-card__place">{item.place}</p>
              <span className="kgp-lp-quote-card__ghost" aria-hidden="true">
                ”
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
