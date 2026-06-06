import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { QA_LOG_ROWS } from "@/content/b2b-content";

export function QaLogSection() {
  return (
    <section
      className="kgp-qa-section kgp-b2b-section kgp-b2b-section--dark"
      id="qa-log"
      aria-labelledby="qa-log-heading"
    >
      <div className="container">
        <header className="kgp-qa-section__header">
          <p className="kgp-qa-section__eyebrow">Independent QA &amp; material log</p>
          <h2 id="qa-log-heading" className="kgp-qa-section__title">
            Empirical metrics — not &ldquo;quality workmanship&rdquo; platitudes
          </h2>
          <p className="kgp-qa-section__intro">
            Every exterior phase is documented against SANS moisture thresholds, tanking
            protocols, and measured dry film thickness. Your managing agent gets numbers they
            can defend at the AGM.
          </p>
        </header>

        <div className="kgp-qa-cards">
          {QA_LOG_ROWS.map((row) => (
            <article key={row.vector} className="kgp-qa-card">
              <div className="kgp-qa-card__head">
                <span className="kgp-qa-card__icon" aria-hidden="true">
                  <i className={row.icon} />
                </span>
                <div>
                  <h3 className="kgp-qa-card__vector">{row.vector}</h3>
                  <span className="kgp-qa-card__badge">{row.metricBadge}</span>
                </div>
              </div>

              <div className="kgp-qa-card__grid">
                <div className="kgp-qa-card__col kgp-qa-card__col--them">
                  <span className="kgp-qa-card__label">Typical competitor claim</span>
                  <blockquote className="kgp-qa-card__quote">
                    <i className="fa-solid fa-quote-left" aria-hidden="true" />
                    {row.competitorClaim}
                  </blockquote>
                </div>

                <div className="kgp-qa-card__divider" aria-hidden="true">
                  <span>vs</span>
                </div>

                <div className="kgp-qa-card__col kgp-qa-card__col--us">
                  <span className="kgp-qa-card__label">Krugersdorp Painters QA metric</span>
                  <p className="kgp-qa-card__metric">
                    <i className="fa-solid fa-circle-check" aria-hidden="true" />
                    {row.ourMetric}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="kgp-qa-section__footer">
          <LeadAssessmentTrigger variant="primary">
            Schedule structural site inspection
          </LeadAssessmentTrigger>
          <p className="kgp-qa-section__footnote">
            Our specialized teams utilize calibrated moisture diagnostics and structural
            analysis to deliver your tailored, phased maintenance proposal.
          </p>
        </footer>
      </div>
    </section>
  );
}
