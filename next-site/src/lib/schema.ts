import { BUSINESS, OPENING_HOURS_JSONLD, SERVICE_GEO, SITE_URL } from "@/config/site";
import type { EstateProfile } from "@/content/estates";
import { WEST_RAND_ESTATES } from "@/content/estates";

function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "ProfessionalService", "PaintingContractor"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
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
    priceRange: "$$$",
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
    areaServed: [
      ...BUSINESS.areaServed.map((name) => ({
        "@type": "AdministrativeArea" as const,
        name,
      })),
      ...WEST_RAND_ESTATES.filter((e) => e.officialUrl).map((e) => ({
        "@type": "Place" as const,
        name: e.name,
        sameAs: e.officialUrl,
      })),
    ],
    knowsAbout: [
      { "@type": "DefinedTerm", name: "Sectional Titles Schemes Management Act (STSMA)" },
      { "@type": "DefinedTerm", name: "Prescribed Management Rule 22 (PMR 22)" },
      { "@type": "DefinedTerm", name: "10-Year Maintenance Repair and Replacement Plan (MRRP)" },
      { "@type": "DefinedTerm", name: "Median line rule — sectional title boundary walls" },
      { "@type": "DefinedTerm", name: "Highveld elastomeric exterior coatings" },
      { "@type": "Brand", name: "Plascon Micatex" },
      { "@type": "Brand", name: "PRO-STRUCT 506 Flexicoat" },
      { "@type": "DefinedTerm", name: "Lateral damp and efflorescence remediation" },
      { "@type": "DefinedTerm", name: "Phased chunking exterior maintenance" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Estate exterior maintenance services",
      itemListElement: [
        "Exterior facade repainting",
        "Boundary wall waterproofing and coating",
        "Complex roof restoration",
        "STSMA PMR 22 phased maintenance programmes",
        "Highveld UV elastomeric coating application",
      ].map((name, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name },
      })),
    },
    sameAs: [BUSINESS.whatsapp],
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function estatePaintingContractorSchema(estate: EstateProfile) {
  const path = `/service-areas/krugersdorp/${estate.slug}`;
  return estateServiceAreaSchema(estate, path);
}

/** Nested PaintingContractor + Service + Place for programmatic SEO */
export function estateServiceAreaSchema(estate: EstateProfile, path: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PaintingContractor",
        "@id": `${absoluteUrl(path)}#contractor`,
        name: `${BUSINESS.name} — ${estate.name}`,
        description: estate.subheading,
        url: absoluteUrl(path),
        parentOrganization: { "@id": `${SITE_URL}/#business` },
        areaServed: {
          "@type": "Place",
          name: estate.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: estate.region,
            addressRegion: "Gauteng",
            addressCountry: "ZA",
          },
          ...(estate.officialUrl ? { sameAs: estate.officialUrl } : {}),
        },
        knowsAbout: [
          { "@type": "DefinedTerm", name: "Sectional Titles Schemes Management Act (STSMA)" },
          { "@type": "DefinedTerm", name: "Prescribed Management Rule 22 (PMR 22)" },
          {
            "@type": "DefinedTerm",
            name: "10-Year Maintenance Repair and Replacement Plan (MRRP)",
          },
          { "@type": "DefinedTerm", name: "Section 5 median line rule" },
          { "@type": "DefinedTerm", name: "Highveld thermal shock" },
          { "@type": "DefinedTerm", name: "Lateral damp migration" },
          { "@type": "DefinedTerm", name: "Phased block-by-block chunking" },
          ...estate.legalContext.map((term) => ({
            "@type": "DefinedTerm" as const,
            name: term,
          })),
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${estate.name} exterior maintenance`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "PMR 22 phased exterior repainting",
                areaServed: estate.name,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Lateral damp cementitious tanking",
                areaServed: estate.name,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Measured DFT elastomeric coating",
                areaServed: estate.name,
              },
            },
          ],
        },
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(path)}#webpage`,
        url: absoluteUrl(path),
        name: `${estate.name} exterior painting specialists`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${absoluteUrl(path)}#contractor` },
      },
    ],
  };
}

export function breadcrumbSchema(
  crumbs: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
