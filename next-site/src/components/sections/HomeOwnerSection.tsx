import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { LeadAssessmentTrigger } from "@/components/b2b/LeadAssessmentTrigger";
import { BUSINESS } from "@/config/site";

export function HomeOwnerSection() {
  return (
    <section className="kgp-lp-owner" aria-labelledby="home-owner-heading">
      <div className="container kgp-lp-owner__grid">
        <div className="kgp-lp-owner__media">
          <SiteImage
            src="/images/about-us-image-1.jpg"
            alt="Rico — owner of Krugersdorp Painters"
            fill
            className="kgp-lp-owner__img"
            sizes="(max-width: 991px) 100vw, 40vw"
          />
        </div>
        <div className="kgp-lp-owner__copy">
          <p className="kgp-lp-eyebrow">Meet Rico</p>
          <h2 id="home-owner-heading">
            One owner. One phone number. Accountable on every site.
          </h2>
          <p>
            You&apos;re not dealing with a call centre or a rotating project
            manager. Rico walks the scheme with you, writes the scope, and stays
            responsible through handover — the person with reputational skin in
            the game on the West Rand.
          </p>
          <ul className="kgp-lp-owner__points">
            <li>Direct WhatsApp and phone — same-day reply</li>
            <li>Itemised scopes trustees can table at meetings</li>
            <li>Snags fixed before we pack up</li>
          </ul>
          <div className="kgp-lp-owner__actions">
            <a href={`tel:${BUSINESS.phone}`} className="kgp-lp-btn">
              Call {BUSINESS.phoneDisplay}
            </a>
            <LeadAssessmentTrigger
              variant="unstyled"
              className="kgp-lp-btn kgp-lp-btn--outline"
            >
              Request a site visit
            </LeadAssessmentTrigger>
            <Link href="/about" className="kgp-lp-text-link">
              About the team
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
