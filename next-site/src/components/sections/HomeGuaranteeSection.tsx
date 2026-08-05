import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { BUSINESS } from "@/config/site";

const POINTS = [
  {
    title: "Itemised scopes",
    text: "Compare our quote line by line against cheaper tenders — see exactly what prep and coatings are included.",
  },
  {
    title: "Snag walk-through",
    text: "We walk the site with you at handover. If something isn’t right, we fix it before we pack up.",
  },
  {
    title: "We come back",
    text: "If a covered finish fails under normal use after handover, call Rico. We sort it — local reputation depends on it.",
  },
] as const;

export function HomeGuaranteeSection() {
  return (
    <section className="kgp-lp-guarantee" aria-labelledby="home-guarantee-heading">
      <div className="container">
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">Risk reversal</p>
          <h2 id="home-guarantee-heading">
            Best case: a sharp scheme. Worst case: we make it right.
          </h2>
        </header>

        <ul className="kgp-lp-guarantee__grid">
          {POINTS.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="kgp-lp-guarantee__cta">
          <LeadAssessmentTrigger variant="unstyled" className="kgp-lp-btn">
            Book a no-obligation site visit
          </LeadAssessmentTrigger>
          <a
            href={BUSINESS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="kgp-lp-btn kgp-lp-btn--outline"
          >
            WhatsApp Rico
          </a>
        </div>
      </div>
    </section>
  );
}
