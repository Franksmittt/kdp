import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";

const STEPS = [
  {
    num: "1",
    title: "Walk the site",
    text: "Rico inspects every elevation with you and flags what actually needs work — and what doesn't.",
  },
  {
    num: "2",
    title: "Written scope",
    text: "An itemised quote trustees can table at the next meeting. No vague line items, no surprise extras.",
  },
  {
    num: "3",
    title: "Phased painting",
    text: "Block-by-block scheduling, daily clean-up, residents kept informed. One contact from start to handover.",
  },
] as const;

export function HomeProcessSection() {
  return (
    <section className="kgp-lp-steps" aria-labelledby="home-steps-heading">
      <div className="container">
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">How it works</p>
          <h2 id="home-steps-heading">From site visit to handover</h2>
        </header>

        <ol className="kgp-lp-steps__grid">
          {STEPS.map((step) => (
            <li key={step.num}>
              <span className="kgp-lp-steps__num" aria-hidden="true">
                {step.num}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="kgp-lp-steps__cta">
          <LeadAssessmentTrigger variant="primary" className="kgp-lp-btn">
            Start with a site visit
          </LeadAssessmentTrigger>
          <p>No obligation. We reply the same day.</p>
        </div>
      </div>
    </section>
  );
}
