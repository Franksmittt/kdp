"use client";

import { useEffect } from "react";

/** Critical path: interactivity + hero swiper + mobile menu */
const CRITICAL_SCRIPTS = [
  "/js/jquery-3.7.1.min.js",
  "/js/bootstrap.min.js",
  "/js/validator.min.js",
  "/js/jquery.slicknav.js",
  "/js/swiper-bundle.min.js",
  "/js/jquery.waypoints.min.js",
  "/js/jquery.counterup.min.js",
] as const;

/** Deferred until after first paint (idle) — keeps TBT/Lighthouse happier */
const DEFERRED_SCRIPTS = [
  "/js/isotope.min.js",
  "/js/jquery.magnific-popup.min.js",
  "/js/SmoothScroll.js",
  "/js/parallaxie.js",
  "/js/gsap.min.js",
  "/js/SplitText.min.js",
  "/js/ScrollTrigger.min.js",
  "/js/wow.min.js",
  "/js/function.js",
] as const;

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-kgp-src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.kgpSrc = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

function whenIdle(cb: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => cb(), { timeout: 900 });
  } else {
    window.setTimeout(cb, 1);
  }
}

/**
 * Loads legacy scripts: critical first, then idle chain.
 * Skips magiccursor.js (cosmetic, heavy).
 */
export function LegacyScriptLoader() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        for (const src of CRITICAL_SCRIPTS) {
          if (cancelled) return;
          await loadScriptOnce(src);
        }

        whenIdle(() => {
          void (async () => {
            try {
              for (const src of DEFERRED_SCRIPTS) {
                if (cancelled) return;
                await loadScriptOnce(src);
              }
            } catch {
              /* non-fatal */
            }
          })();
        });
      } catch {
        /* non-fatal */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
