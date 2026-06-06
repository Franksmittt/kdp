"use client";

import { useState } from "react";
import type { FaqItem } from "@/content/site-content";

type FaqAccordionProps = {
  items: FaqItem[];
  idPrefix?: string;
  defaultOpenId?: string;
  variant?: "template" | "modern";
};

export function FaqAccordion({
  items,
  idPrefix = "faq",
  defaultOpenId,
  variant = "template",
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState(defaultOpenId ?? items[0]?.id ?? "");

  if (variant === "modern") {
    return (
      <div className="kgp-faq-accordion" id={`accordion-${idPrefix}`}>
        {items.map((item) => {
          const isOpen = openId === item.id;
          const headingId = `${idPrefix}-heading-${item.id}`;
          const panelId = `${idPrefix}-panel-${item.id}`;

          return (
            <div
              key={item.id}
              className={`kgp-faq-item${isOpen ? " is-open" : ""}`}
            >
              <h3 className="kgp-faq-item__heading">
                <button
                  type="button"
                  className="kgp-faq-item__trigger"
                  id={headingId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? "" : item.id)}
                >
                  <span className="kgp-faq-item__question">{item.question}</span>
                  <span className="kgp-faq-item__icon" aria-hidden="true" />
                </button>
              </h3>
              <div
                id={panelId}
                className="kgp-faq-item__panel"
                role="region"
                aria-labelledby={headingId}
                hidden={!isOpen}
              >
                <div className="kgp-faq-item__panel-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="faq-accordion" id={`accordion-${idPrefix}`}>
      {items.map((item, i) => {
        const isOpen = openId === item.id;
        const headingId = `${idPrefix}-heading-${item.id}`;
        const panelId = `${idPrefix}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className="accordion-item wow fadeInUp"
            data-wow-delay={i > 0 ? `${i * 0.2}s` : undefined}
          >
            <h2 className="accordion-header" id={headingId}>
              <button
                className={`accordion-button${isOpen ? "" : " collapsed"}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? "" : item.id)}
              >
                {item.question}
              </button>
            </h2>
            <div
              id={panelId}
              className={`accordion-collapse kgp-accordion-panel${isOpen ? " show" : ""}`}
              aria-labelledby={headingId}
            >
              <div className="accordion-body">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
