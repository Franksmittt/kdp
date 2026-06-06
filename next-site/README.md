# Krugersdorp Painters

Next.js 15 website — **exterior-only** B2B positioning for West Rand estates, body corporates, and sectional-title schemes.

## Strategy implementation

This site follows the B2B CRO, Trust & SEO, and Answer Engine Optimization blueprints in `/rec/`:

- **Trust without portfolio:** QA material log, compliance locker, operation timeline
- **STSMA / PMR 22:** Dedicated body corporate silo + 10-Year MRRP page + budgeting estimator
- **Local SEO:** 8 programmatic estate pages under `/service-areas/krugersdorp/[suburb]`
- **AEO:** Entity-dense knowledge blocks + FAQ schema for AI Overviews
- **JSON-LD:** `PaintingContractor` with `knowsAbout`, `areaServed`, `hasOfferCatalog`

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | B2B home — trust engine + PMR 22 estimator |
| `/exterior-painting` | Core service pillar (exterior-only) |
| `/body-corporate-painters` | HOA / trustee procurement |
| `/body-corporate-painters/10-year-maintenance-plan` | PMR 22 / MRRP education |
| `/compliance` | COIDA, H&S, SAPS, liability + QA log |
| `/service-areas/krugersdorp/*` | Featherbrooke, Avianto, Chancliff, etc. |

## Commands

```bash
npm install
npm run dev
npm run build
```

## SEO checklist (post-deploy)

1. Add property in [Google Search Console](https://search.google.com/search-console) for `krugersdorppainting.co.za`
2. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel env
3. Submit `/sitemap.xml`
4. Create/claim [Google Business Profile](https://business.google.com) — Krugersdorp, exterior painter category
5. Wire estimator leads: replace console log in `src/app/actions/estimator.ts` with email/CRM

## Content updates

- Estate rules & copy: `src/content/estates.ts`
- AEO blocks, compliance, QA data: `src/content/b2b-content.ts`
- Schema helpers: `src/lib/schema.ts`
