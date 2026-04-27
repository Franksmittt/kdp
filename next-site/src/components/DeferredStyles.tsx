"use client";

import { useEffect } from "react";

/** Non-critical CSS: loads after first paint to reduce render-blocking. */
const DEFERRED_STYLESHEETS = [
  "/css/animate.css",
  "/css/magnific-popup.css",
  "/css/mousecursor.css",
] as const;

export function DeferredStyles() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    for (const href of DEFERRED_STYLESHEETS) {
      if (document.querySelector(`link[data-kgp-defer="${href}"]`)) continue;
      const el = document.createElement("link");
      el.rel = "stylesheet";
      el.href = href;
      el.dataset.kgpDefer = href;
      document.head.appendChild(el);
      links.push(el);
    }
    return () => {
      for (const el of links) el.remove();
    };
  }, []);

  return null;
}
