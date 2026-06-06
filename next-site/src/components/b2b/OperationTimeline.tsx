import { OPERATION_TIMELINE } from "@/content/b2b-content";

export function OperationTimeline() {
  return (
    <section className="kgp-b2b-section kgp-b2b-section--light">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-8">
            <div className="section-title">
              <h3>How we operate</h3>
              <h2 className="text-anime-style-3">
                Framework of readiness — proof without a legacy portfolio
              </h2>
              <p>
                Trustees cannot approve multi-million Rand reserve fund spend on vague promises.
                This is the exact technical sequence our agile teams execute on every exterior
                phase — logged, measured, and handed over for your PMR 22 file.
              </p>
            </div>
          </div>
        </div>
        <div className="row g-4">
          {OPERATION_TIMELINE.map((phase) => (
            <div key={phase.step} className="col-md-6 col-xl-3">
              <article className="kgp-b2b-card kgp-b2b-card--step">
                <span className="kgp-b2b-step" aria-hidden="true">
                  {String(phase.step).padStart(2, "0")}
                </span>
                <div className="icon-box">
                  <i className={phase.icon} aria-hidden="true" />
                </div>
                <h3>{phase.title}</h3>
                <p>{phase.summary}</p>
                <ul>
                  {phase.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
