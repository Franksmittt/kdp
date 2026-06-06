import Link from "next/link";
import { OPERATIONAL_USPS } from "@/content/b2b-content";

export function OperationalMatrix() {
  return (
    <section className="kgp-b2b-section kgp-b2b-section--dark">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-10 mx-auto text-center">
            <div className="section-title section-title-center">
              <h3>Exterior-only specialists</h3>
              <h2 className="text-anime-style-3">
                Built for body corporates, HOAs, and West Rand estates — not industrial warehouses
              </h2>
              <p>
                We deliberately exclude interior work, high-rise corporate blocks, and massive
                industrial sites. That focus is your advantage: zero interior disruption and
                estate-scale programmes we can actually phase.
              </p>
            </div>
          </div>
        </div>
        <div className="row g-4">
          {OPERATIONAL_USPS.map((item) => (
            <div key={item.title} className="col-md-6 col-xl-3">
              <article className="kgp-b2b-card">
                <div className="icon-box">
                  <i className={item.icon} aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            </div>
          ))}
        </div>
        <div className="kgp-b2b-section-footer">
          <Link href="/body-corporate-painters" className="btn-default btn-highlighted">
            Body corporate &amp; STSMA programmes
          </Link>
        </div>
      </div>
    </section>
  );
}
