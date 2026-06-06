import type { EstateProfile } from "@/content/estates";

export function EstateRulesModule({ estate }: { estate: EstateProfile }) {
  const rows = [
    { label: "Contractor hours", value: estate.hours },
    { label: "Security & access", value: estate.security },
    { label: "Architectural guidelines", value: estate.aesthetics },
    { label: "Environmental footprint", value: estate.environment },
  ];

  return (
    <section className="kgp-b2b-section kgp-b2b-section--light">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-8">
            <div className="section-title">
              <h3>Estate rules integration</h3>
              <h2 className="text-anime-style-3">
                We already speak {estate.name}&rsquo;s operational language
              </h2>
              <p>{estate.demographic}</p>
            </div>
          </div>
        </div>
        <div className="row g-4">
          {rows.map((row) => (
            <div key={row.label} className="col-md-6">
              <article className="kgp-b2b-card">
                <h3>{row.label}</h3>
                <p>{row.value}</p>
              </article>
            </div>
          ))}
        </div>
        <div className="kgp-b2b-callout">
          <h3>Highveld climate note</h3>
          <p>{estate.climateNote}</p>
          <p>
            <strong>Local methodology:</strong> {estate.geoSignal}
          </p>
        </div>
      </div>
    </section>
  );
}
