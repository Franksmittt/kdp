export function HomeProcessSection() {
  return (
    <section
      className="kgp-home-process kgp-site-section"
      aria-labelledby="home-process-heading"
    >
      <div className="container">
        <header className="kgp-home-process__header">
          <h2 id="home-process-heading">How a project works</h2>
          <p>Simple steps. Clear scopes. No jargon.</p>
        </header>

        <ol className="kgp-home-process__steps">
          <li>
            <span className="kgp-home-process__num" aria-hidden="true">
              1
            </span>
            <div>
              <h3>Site visit</h3>
              <p>
                We walk the complex with you or your managing agent and note what
                needs prep, repair, and painting.
              </p>
            </div>
          </li>
          <li>
            <span className="kgp-home-process__num" aria-hidden="true">
              2
            </span>
            <div>
              <h3>Clear quote</h3>
              <p>
                You get a written scope for exteriors — what we paint, what we
                prepare, and how work can be phased if needed.
              </p>
            </div>
          </li>
          <li>
            <span className="kgp-home-process__num" aria-hidden="true">
              3
            </span>
            <div>
              <h3>Paint &amp; handover</h3>
              <p>
                Work stays outside. When we finish a zone, we walk it with you
                before we move on.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
