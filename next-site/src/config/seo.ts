import type { Metadata } from "next";
import {
  BUSINESS,
  OPENING_HOURS_JSONLD,
  SERVICE_GEO,
  SITE_URL,
} from "./site";

export type PageSlug =
  | "home"
  | "about"
  | "services"
  | "service-single"
  | "contact"
  | "blog"
  | "blog-single"
  | "projects"
  | "project-single"
  | "faqs"
  | "testimonials";

const PATH: Record<PageSlug, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  "service-single": "/service-single",
  contact: "/contact",
  blog: "/blog",
  "blog-single": "/blog-single",
  projects: "/projects",
  "project-single": "/project-single",
  faqs: "/faqs",
  testimonials: "/testimonials",
};

/** Open Graph / Twitter default image per route (unique where it helps sharing CTR). */
const SHARE_IMAGE: Record<
  PageSlug,
  { path: string; width: number; height: number; alt: string }
> = {
  home: {
    path: "/images/hero-bg-image.jpg",
    width: 1920,
    height: 1080,
    alt: "Krugersdorp Painters — prep-first interior and exterior painting",
  },
  about: {
    path: "/images/about-us-image-1.jpg",
    width: 1200,
    height: 800,
    alt: "About Krugersdorp Painters",
  },
  services: {
    path: "/images/service-image-1.jpg",
    width: 1200,
    height: 800,
    alt: "Painting and maintenance services",
  },
  "service-single": {
    path: "/images/service-image-2.jpg",
    width: 1200,
    height: 800,
    alt: "Service detail — Krugersdorp Painters",
  },
  contact: {
    path: "/images/hero-info-image-1.jpg",
    width: 1200,
    height: 800,
    alt: "Contact Krugersdorp Painters for a quote",
  },
  blog: {
    path: "/images/post-1.jpg",
    width: 1200,
    height: 800,
    alt: "Painting tips and articles",
  },
  "blog-single": {
    path: "/images/post-2.jpg",
    width: 1200,
    height: 800,
    alt: "Krugersdorp Painters blog article",
  },
  projects: {
    path: "/images/project-image-1.jpg",
    width: 1200,
    height: 800,
    alt: "Recent painting projects",
  },
  "project-single": {
    path: "/images/project-image-2.jpg",
    width: 1200,
    height: 800,
    alt: "Project case study",
  },
  faqs: {
    path: "/images/what-we-do-image.jpg",
    width: 1200,
    height: 800,
    alt: "Frequently asked questions about painting",
  },
  testimonials: {
    path: "/images/cta-box-image.jpg",
    width: 1200,
    height: 800,
    alt: "Client testimonials",
  },
};

const BLOG_POSTING_ISO_DATE = "2026-03-15";

type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
};

const PAGES: Record<PageSlug, PageSeo> = {
  home: {
    title: "Exterior Painters Krugersdorp | Body Corporate & Estate Specialists",
    description:
      "Exterior-only painting for West Rand estates and body corporates. STSMA-aware phased programmes, measured material QA — zero interior disruption. Krugersdorp, Featherbrooke, Avianto, Chancliff.",
    keywords: [
      "exterior painters Krugersdorp",
      "body corporate painting West Rand",
      "complex painting contractors",
      "sectional title repainting",
      "estate boundary wall painters",
      "PMR 22 maintenance painting",
    ],
  },
  about: {
    title: "About Us | Krugersdorp Painters",
    description:
      "Meet Rico and Krugersdorp Painters: owner-managed technical maintenance, phased repaints for complexes, high-build primers, roof and damp work, and clear scopes from first visit to handover.",
    keywords: [
      "about Krugersdorp Painters",
      "painting contractor West Rand",
      "owner managed painter",
    ],
  },
  services: {
    title: "Services | Krugersdorp Painters",
    description:
      "Interior and exterior painting, roof restoration, heat-reflective coatings, waterproofing and damp treatment, and general maintenance—quoted with prep, access, and materials broken out so you can compare fairly.",
    keywords: [
      "interior painting Gauteng",
      "exterior painting",
      "roof coating",
      "waterproofing contractor",
    ],
  },
  "service-single": {
    title: "Service Detail | Krugersdorp Painters",
    description:
      "How we deliver prep-first painting, roof, and waterproofing work on homes, commercial facades, and sectional-title schemes—with realistic phasing and tidy sites.",
    keywords: ["painting service Krugersdorp", "technical painting quote"],
  },
  contact: {
    title: "Contact | Krugersdorp Painters",
    description:
      "Request a painting or maintenance quote: call or WhatsApp Rico on 076 471 9933, send photos, or book a site visit. We serve Krugersdorp, the West Rand, and wider Gauteng.",
    keywords: [
      "painting quote Krugersdorp",
      "WhatsApp painter",
      "contact painters West Rand",
    ],
  },
  blog: {
    title: "Blog | Krugersdorp Painters",
    description:
      "Practical notes on prep, sheen and colour for Highveld sun, phased sectional-title repaints, and keeping exterior coatings out of trouble.",
    keywords: ["painting tips", "prep before paint", "body corporate repaint"],
  },
  "blog-single": {
    title: "Article | Krugersdorp Painters Blog",
    description:
      "In-depth guidance from Krugersdorp Painters on prep, products, and scheduling paint work in Gauteng.",
    keywords: ["painting blog", "Krugersdorp painters"],
  },
  projects: {
    title: "Projects | Krugersdorp Painters",
    description:
      "Selected interiors, exteriors, body-corporate batches, and roof coatings across the West Rand—each scoped on prep, access, and the coating system we actually applied on site.",
    keywords: [
      "painting projects Krugersdorp",
      "complex painting portfolio",
      "roof painting examples",
    ],
  },
  "project-single": {
    title: "Project | Krugersdorp Painters",
    description:
      "Project breakdown: surfaces, prep, primers, and topcoats used on this Krugersdorp Painters job.",
    keywords: ["painting project case study", "West Rand painting"],
  },
  faqs: {
    title: "FAQs | Krugersdorp Painters",
    description:
      "Straight answers on interior and exterior painting, body corporate phasing, how we estimate jobs, crack and damp prep, and which coatings we specify for Gauteng weather.",
    keywords: [
      "painting FAQ",
      "body corporate painting questions",
      "paint quote explained",
    ],
  },
  testimonials: {
    title: "Testimonials | Krugersdorp Painters",
    description:
      "What homeowners, trustees, and tenants say about prep quality, communication, and handovers after Krugersdorp Painters completed their work.",
    keywords: ["painter reviews Krugersdorp", "painting contractor testimonials"],
  },
};

function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function sameAsUrls(): string[] {
  const extra = process.env.NEXT_PUBLIC_BUSINESS_FACEBOOK_URL?.trim();
  return [BUSINESS.whatsapp, ...(extra ? [extra] : [])];
}

function twitterMetadata(): Partial<NonNullable<Metadata["twitter"]>> {
  const handle = process.env.NEXT_PUBLIC_TWITTER_HANDLE?.trim();
  if (!handle) return {};
  const h = handle.startsWith("@") ? handle : `@${handle}`;
  return { site: h, creator: h };
}

export function buildMetadata(slug: PageSlug): Metadata {
  const p = PAGES[slug];
  const path = PATH[slug];
  const url = absoluteUrl(path);
  const share = SHARE_IMAGE[slug];
  const ogImageUrl = absoluteUrl(share.path);

  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    authors: [{ name: BUSINESS.name, url: SITE_URL }],
    creator: BUSINESS.name,
    publisher: BUSINESS.name,
    category: "Home improvement",
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: slug === "blog-single" ? "article" : "website",
      locale: "en_ZA",
      url,
      siteName: BUSINESS.name,
      title: p.title,
      description: p.description,
      images: [
        {
          url: ogImageUrl,
          width: share.width,
          height: share.height,
          alt: share.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: [ogImageUrl],
      ...twitterMetadata(),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: true, email: true, address: true },
  };
}

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    alternateName: BUSINESS.legalName,
    slogan: BUSINESS.slogan,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/hero-info-image-1.jpg"),
      width: 1200,
      height: 800,
    },
    image: [
      absoluteUrl("/images/hero-info-image-1.jpg"),
      absoluteUrl("/images/hero-bg-image.jpg"),
    ],
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Krugersdorp",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SERVICE_GEO.latitude,
      longitude: SERVICE_GEO.longitude,
    },
    openingHoursSpecification: [...OPENING_HOURS_JSONLD],
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    sameAs: sameAsUrls(),
    description: PAGES.home.description,
  };
}

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    description: PAGES.home.description,
    publisher: { "@id": `${SITE_URL}/#business` },
    inLanguage: "en-ZA",
  };
}

function webPageJsonLd(slug: PageSlug) {
  const p = PAGES[slug];
  const path = PATH[slug];
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: p.title,
    description: p.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#business` },
    inLanguage: "en-ZA",
  };
}

const BREADCRUMB_LABEL: Record<PageSlug, string> = {
  home: "Home",
  about: "About Us",
  services: "Services",
  "service-single": "Service detail",
  contact: "Contact",
  blog: "Blog",
  "blog-single": "Article",
  projects: "Projects",
  "project-single": "Project",
  faqs: "FAQs",
  testimonials: "Testimonials",
};

function breadcrumbJsonLd(slug: PageSlug) {
  if (slug === "home") return null;
  const path = PATH[slug];
  const crumbs = [
    { name: "Home", item: SITE_URL },
    { name: BREADCRUMB_LABEL[slug], item: absoluteUrl(path) },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  };
}

function contactJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/contact")}#contactpage`,
    url: absoluteUrl("/contact"),
    name: PAGES.contact.title,
    description: PAGES.contact.description,
    mainEntity: { "@id": `${SITE_URL}/#business` },
  };
}

function faqJsonLd() {
  const items = [
    {
      q: "Do you paint interiors and exteriors?",
      a: "Yes. Interiors cover walls, ceilings, doors, skirtings, and built-in cupboards where quoted. Exteriors include plaster, brick, and timber trim using systems suited to sun and rain. We can schedule interior and exterior in stages if you need to stay in the property.",
    },
    {
      q: "Can you work with our body corporate or managing agent?",
      a: "Yes. We work with work orders, access arrangements, and phased areas such as stairwells, passages, and parking lines. Quotes can align with maintenance budgets and approved specifications.",
    },
    {
      q: "How do you estimate the cost of a paint job?",
      a: "We measure surfaces (or work from plans), note repairs, height access, and the coating system you want. Prep, primers, topcoats, and labour are listed separately where useful.",
    },
    {
      q: "Which paints and primers do you use?",
      a: "We use quality trade acrylics and PVA for plaster, enamel systems for doors and trims where specified, and manufacturer-approved roof or metal primers. Finishes range from matt through low-sheen to semi-gloss depending on traffic and the look you want.",
    },
    {
      q: "Do you repair cracks and water marks before painting?",
      a: "Yes, within painting scope: raking flaky lines, filling, skimming small areas, stain block where needed, and sanding. Serious structural damp must be fixed at source first—we flag that on inspection.",
    },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

function servicesItemListJsonLd() {
  const services = [
    "Interior & exterior painting",
    "Roof restoration",
    "Waterproofing & damp treatment",
    "General maintenance",
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services",
    itemListElement: services.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
    })),
  };
}

function projectsItemListJsonLd() {
  const projects = [
    "Interior repaints",
    "Exterior & complex batches",
    "Roof coatings",
    "Waterproofing & damp",
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Project types",
    itemListElement: projects.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
    })),
  };
}

/** JSON-LD graphs per page (Organization + WebSite on all; extras where useful). */
export function buildJsonLd(slug: PageSlug): Record<string, unknown>[] {
  const base: Record<string, unknown>[] = [
    organizationJsonLd(),
    websiteJsonLd(),
    webPageJsonLd(slug),
  ];

  const bc = breadcrumbJsonLd(slug);
  if (bc) base.push(bc);

  if (slug === "contact") base.push(contactJsonLd());
  if (slug === "faqs") base.push(faqJsonLd());
  if (slug === "services") base.push(servicesItemListJsonLd());
  if (slug === "projects") base.push(projectsItemListJsonLd());
  if (slug === "blog-single") {
    const img = absoluteUrl(SHARE_IMAGE["blog-single"].path);
    base.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: PAGES["blog-single"].title,
      description: PAGES["blog-single"].description,
      url: absoluteUrl(PATH["blog-single"]),
      datePublished: BLOG_POSTING_ISO_DATE,
      dateModified: BLOG_POSTING_ISO_DATE,
      image: [img],
      author: { "@type": "Organization", name: BUSINESS.name },
      publisher: { "@id": `${SITE_URL}/#business` },
      inLanguage: "en-ZA",
      mainEntityOfPage: { "@type": "WebPage", "@id": `${absoluteUrl(PATH["blog-single"])}#webpage` },
    });
  }

  return base;
}
