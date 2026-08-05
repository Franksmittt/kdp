const TESTIMONIALS = [
  {
    quote:
      "They phased the exterior over weekends so residents weren’t disrupted. The trustees signed off without rework.",
    name: "Jenny Wilson",
    place: "Body corporate chair, West Rand",
  },
  {
    quote:
      "Clear exterior scope, tidy site daily, and the boundary walls look sharp.",
    name: "David Mokoena",
    place: "Managing agent, Krugersdorp",
  },
  {
    quote:
      "Roof and facade work done properly. They stuck to estate hours and left common areas clean.",
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
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">Clients</p>
          <h2 id="home-testimonials-heading">Trusted on the West Rand</h2>
        </header>

        <ul className="kgp-lp-testimonials__list">
          {TESTIMONIALS.map((item) => (
            <li key={item.name}>
              <blockquote>
                <p>{item.quote}</p>
                <footer>
                  <cite>{item.name}</cite>
                  <span>{item.place}</span>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
