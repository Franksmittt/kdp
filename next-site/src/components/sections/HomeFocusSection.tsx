export function HomeFocusSection() {
  return (
    <section
      className="kgp-home-focus kgp-site-section"
      aria-labelledby="home-focus-heading"
    >
      <div className="container">
        <header className="kgp-home-focus__header">
          <h2 id="home-focus-heading">What we do</h2>
          <p>
            One focus: keeping estates and complexes looking protected from the
            outside — without painters moving through residents&apos; homes.
          </p>
        </header>

        <ul className="kgp-home-focus__list">
          <li>
            <h3>Estates &amp; body corporates</h3>
            <p>
              Common-property exteriors for sectional title schemes, HOAs, and
              managed complexes on the West Rand.
            </p>
          </li>
          <li>
            <h3>Roofs, walls &amp; boundaries</h3>
            <p>
              Facades, boundary walls, and roof coatings prepared properly for
              Highveld sun and rain.
            </p>
          </li>
          <li>
            <h3>Exterior only</h3>
            <p>
              No interior work. That keeps units undisturbed and scopes clear for
              trustees and managing agents.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
