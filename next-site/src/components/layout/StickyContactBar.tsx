import { BUSINESS } from "@/config/site";

export function StickyContactBar() {
  return (
    <div className="kgp-sticky-bar" role="navigation" aria-label="Quick contact">
      <a href={`tel:${BUSINESS.phone}`} className="kgp-sticky-bar__btn kgp-sticky-bar__btn--call">
        <i className="fa-solid fa-phone" aria-hidden="true" />
        Call
      </a>
      <a
        href={BUSINESS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="kgp-sticky-bar__btn kgp-sticky-bar__btn--wa"
      >
        <i className="fa-brands fa-whatsapp" aria-hidden="true" />
        WhatsApp
      </a>
    </div>
  );
}
