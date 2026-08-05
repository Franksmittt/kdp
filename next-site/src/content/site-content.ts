export type HeroSlide = {
  eyebrow: string;
  title: string;
  lead: string;
  leadSecondary: string;
  image: string;
  imageAlt: string;
  primaryCta: { label: string; href?: string; action?: "assessment" | "link" };
  secondaryCta: { label: string; href?: string; action?: "assessment" | "link" };
};

export type ServiceItem = {
  number: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type ProjectCategory = "homes" | "commercial" | "complexes" | "roofs";

export type ProjectItem = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  categories: ProjectCategory[];
};

export type BlogPost = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  image: string;
  excerpt?: string;
  body?: string[];
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  eyebrow: string;
  title: string;
  items: FaqItem[];
};

export type AboutBodyItem = {
  icon: string;
  title: string;
  description: string;
};

export type AboutApproachItem = {
  title: string;
  description: string;
  image: string;
  icon: string;
  tags?: string[];
};

export type ServiceDetailSection = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

export type ServiceSingleContentData = {
  intro: { paragraphs: string[] };
  heroImage: string;
  sections: ServiceDetailSection[];
  whyChoose: { title: string; items: string[] };
  process: { title: string; steps: string[]; image: string };
  sidebarCategories: { label: string; href: string }[];
};

const AUTHOR_FALLBACKS = [
  "/images/hero-info-image-1.jpg",
  "/images/hero-info-image-2.jpg",
  "/images/hero-info-image-1.jpg",
  "/images/hero-info-image-2.jpg",
  "/images/hero-info-image-1.jpg",
  "/images/hero-info-image-2.jpg",
];

export function authorImage(index: number): string {
  return `/images/author-${index + 1}.jpg`;
}

export function authorImageOrFallback(index: number): string {
  return authorImage(index);
}

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "West Rand exterior specialists",
    title: "Exterior-only painting for estates & body corporates",
    lead: "Roofs, facades, and boundary walls — measured prep, SANS moisture checks, and phased programmes aligned to PMR 22 reserve funds.",
    leadSecondary:
      "Zero interior access. Agile teams. Featherbrooke, Avianto, Chancliff Ridge, and complexes across Krugersdorp.",
    image: "/images/project-image-1.jpg",
    imageAlt: "Exterior repainting on a West Rand sectional title complex",
    primaryCta: {
      label: "Request a phased maintenance assessment",
      action: "assessment",
    },
    secondaryCta: {
      label: "Body corporate programmes",
      href: "/body-corporate-painters",
      action: "link",
    },
  },
  {
    eyebrow: "STSMA & PMR 22",
    title: "Phased chunking — not a special levy shock",
    lead: "Block-by-block exterior maintenance over 36–48 months so trustees fund from monthly reserve accruals, with measured QA ready for AGMs.",
    leadSecondary:
      "SANS 10400 moisture diagnostics, 100 µm DFT coating logs, and phased chunking with zero interior access.",
    image: "/images/project-image-4.jpg",
    imageAlt: "Phased exterior maintenance programme on an estate facade",
    primaryCta: {
      label: "Schedule structural site inspection",
      action: "assessment",
    },
    secondaryCta: {
      label: "10-year MRRP guide",
      href: "/body-corporate-painters/10-year-maintenance-plan",
      action: "link",
    },
  },
  {
    eyebrow: "Highveld engineering",
    title: "Lateral damp, thermal shock & measured coatings",
    lead: "Cementitious tanking, DPC injection, and Plascon Micatex applied to documented dry film thickness — not cosmetic cover-ups.",
    leadSecondary:
      "Owner-managed by Rico from site walk-through to photographic handover.",
    image: "/images/project-image-6.jpg",
    imageAlt: "Exterior coating and damp remediation on a West Rand property",
    primaryCta: {
      label: "Request estate proposal",
      action: "assessment",
    },
    secondaryCta: {
      label: "Exterior services",
      href: "/exterior-painting",
      action: "link",
    },
  },
];

export const heroTrustSignals = [
  { icon: "fa-solid fa-building-shield", label: "Exterior only" },
  { icon: "fa-solid fa-file-contract", label: "STSMA PMR 22" },
  { icon: "fa-solid fa-ruler-combined", label: "Measured QA" },
  { icon: "fa-solid fa-door-closed", label: "Zero interior access" },
] as const;

export const heroInfoBox = {
  box1: {
    tagline: "Prep · Prime · Protect",
    title: "West Rand sun meets proper primers",
    image: "/images/hero-info-image-1.jpg",
  },
  box2: { image: "/images/hero-info-image-2.jpg" },
  box3: {
    title: "Rooms & facades refreshed",
    counter: "650",
    authorImages: AUTHOR_FALLBACKS.slice(0, 5),
  },
};

export const aboutHome = {
  images: ["/images/about-us-image-1.jpg", "/images/about-us-image-2.jpg"],
  eyebrow: "About Us",
  title: "Owner-managed painting, roofs, waterproofing, and maintenance",
  description:
    "We take on what trustees, managing agents, landlords, and homeowners actually need: phased common-area repaints, exterior refreshers with high-build primers, roof restoration and heat-reflective systems, damp and waterproofing fixes, plus general maintenance, all personally run by Rico from first site visit to handover.",
  bodyItems: [
    {
      icon: "fa-solid fa-medal",
      title: "Commitment to quality",
      description: "We do not skip sanding, priming, or dust control when the substrate demands it.",
    },
    {
      icon: "fa-solid fa-swatchbook",
      title: "Right product for the job",
      description:
        "High-build primers, UV-rated exteriors, roof membranes, and trade acrylics or enamels matched to each surface and Gauteng weather.",
    },
  ] satisfies AboutBodyItem[],
  footerBullets: [
    "Clear quotes for homes, shops, body corporates, and sectional-title schemes, with realistic phasing included.",
    "Furniture and floors protected; stairwells and passages coordinated with residents and agents.",
    "Walk-through on completion so snags are fixed before we pack up.",
  ],
};

export const aboutPage = {
  ...aboutHome,
  title: "Technical property maintenance, owner-managed on every site",
  bodyItems: [
    {
      icon: "fa-solid fa-medal",
      title: "Commitment to quality",
      description: "We do not skip sanding, priming, or dust control when the substrate demands it.",
    },
    {
      icon: "fa-solid fa-cloud-sun",
      title: "Systems for Gauteng weather",
      description:
        "UV-rated exteriors, heat-reflective roof coatings, and damp treatments matched to Highveld sun and storms.",
    },
  ] satisfies AboutBodyItem[],
  footerBullets: [
    "Phased common-area work with signed work orders and agreed access hours.",
    "Quotes that separate prep, primers, topcoats, and labour where it helps compare options.",
    "Walk-through handovers so snags are fixed before we pack up.",
  ],
  ctaLabel: "Contact Now",
};

export const services: ServiceItem[] = [
  {
    number: "01.",
    title: "Interior & exterior painting",
    description:
      "Crack repair, high-pressure cleaning, high-build primers, and UV-rated coatings for Gauteng exteriors",
    image: "/images/service-image-1.jpg",
    href: "/service-single",
  },
  {
    number: "02.",
    title: "Roof restoration",
    description:
      "Cleaning, ridge repointing, heat-reflective coatings, and waterproofing for tiled and metal roofs",
    image: "/images/service-image-2.jpg",
    href: "/service-single",
  },
  {
    number: "03.",
    title: "Waterproofing & damp treatment",
    description: "Moisture diagnosis, crack injection, membranes, balconies, flat roofs, and parapet systems",
    image: "/images/service-image-3.jpg",
    href: "/service-single",
  },
  {
    number: "04.",
    title: "General maintenance",
    description: "Plaster repairs, gutters, pre-sale refreshes, and ongoing contracts for landlords and investors",
    image: "/images/service-image-4.jpg",
    href: "/service-single",
  },
];

export const serviceBenefitTags = [
  "Body corporates & complexes",
  "High-pressure prep",
  "UV & roof systems",
  "Owner-managed sites",
];

export const whatWeDoHome = {
  eyebrow: "what we do",
  title:
    "Sectional-title schemes, townhouse complexes, commercial facades, and private homes from one technical contractor",
  description:
    "We are set up for phased stairwells and passages, parking-line refreshers, full exterior batches on schemes, and standalone repaints. You get the same prep discipline everywhere: washing, stripping failed coats where needed, compatible primers, and topcoats chosen for Gauteng UV and storms, not a one-tin-fits-all shortcut.",
  image: "/images/what-we-do-image.jpg",
  items: [
    {
      icon: "fa-solid fa-fill-drip",
      title: "Solid prep first",
      description:
        "Washing, scraping, crack routing, filler, and primer, so topcoats do not let go after the first storm.",
      bullets: ["Moisture and chalky paint addressed before we roll colour."],
    },
    {
      icon: "fa-solid fa-house-chimney",
      title: "Neat execution on site",
      description: "Straight cutting lines, uniform sheen, and protection of carpets, tiles, and landscaping.",
      bullets: ["Roof and high-access work quoted only when it is safe and practical for our setup."],
    },
  ],
};

export const featuresHome = {
  eyebrow: "Our Features",
  title:
    "We care about clean prep and lasting coatings for body corporates, complexes, homes, and shops with tidy sites and straightforward handovers",
  authorImages: AUTHOR_FALLBACKS.slice(0, 3),
  items: [
    {
      box: "box-1" as const,
      title: "Advice you can use",
      description:
        "Sheen levels, low-VOC options, and colours that suit north- and south-facing rooms in the Highveld sun.",
      image: "/images/feature-item-image-1.jpg",
      bullets: [
        "Sample pots on request before we commit drums of tint.",
        "Exterior schedules planned around weather windows.",
      ],
    },
    {
      box: "box-2" as const,
      eyebrow: "Your brief, our ladders",
      title: "Request a free painting estimate today",
      image: "/images/feature-item-image-2.jpg",
    },
    {
      box: "box-3" as const,
      counter: "10",
      title: "Years owner-managed on site",
      description:
        "Experience across repaints, roof work, waterproofing, and maintenance cycles for homes, commercial clients, and sectional-title schemes.",
      tags: ["Interior", "Exterior"],
    },
  ] as const,
};

export const projects: ProjectItem[] = [
  {
    slug: "family-home-interior",
    title: "Family home: full interior repaint",
    subtitle: "Interior · walls, ceilings & trims",
    image: "/images/project-image-1.jpg",
    categories: ["homes", "complexes"],
  },
  {
    slug: "warehouse-facade",
    title: "Warehouse facade & roller-door frames",
    subtitle: "Exterior · weatherproof system",
    image: "/images/project-image-2.jpg",
    categories: ["homes", "roofs"],
  },
  {
    slug: "stairwell-refresh",
    title: "Sectional-title stairwell refresh",
    subtitle: "Complex · phased after hours",
    image: "/images/project-image-3.jpg",
    categories: ["homes", "complexes"],
  },
  {
    slug: "retail-shop",
    title: "Retail shop: ceilings & feature wall",
    subtitle: "Commercial · quick turnaround",
    image: "/images/project-image-4.jpg",
    categories: ["commercial", "roofs"],
  },
  {
    slug: "townhouse-exteriors",
    title: "Townhouse exteriors & boundary wall",
    subtitle: "Homes & complex perimeter",
    image: "/images/project-image-5.jpg",
    categories: ["commercial", "complexes"],
  },
  {
    slug: "ibr-roof-repaint",
    title: "IBR roof repaint & rust primer",
    subtitle: "Roof · compatible metal coating",
    image: "/images/project-image-6.jpg",
    categories: ["commercial", "roofs"],
  },
];

export const projectCategoryFilters: { label: string; value: "all" | ProjectCategory }[] = [
  { label: "all", value: "all" },
  { label: "Homes", value: "homes" },
  { label: "Commercial", value: "commercial" },
  { label: "Complexes", value: "complexes" },
  { label: "Roofs", value: "roofs" },
];

export const projectSingle = {
  slug: "family-home-interior",
  title: "Family home: full interior repaint",
  image: "/images/project-image-1.jpg",
  fields: {
    Scope:
      "Living areas, bedrooms, passages, kitchen walls & ceilings, doors, skirtings, and built-in cupboards as quoted.",
    Prep: "Crack raking, filler, spot skimming, sanding, stain block on water marks, and dust control between rooms.",
    Finish:
      "Low-sheen acrylic on walls, acrylic PVA on ceilings, enamel on trims and doors.",
  },
};

export const blogPosts: BlogPost[] = [
  {
    slug: "skimming-cracks-before-painting",
    title: "Why skimming cracks before painting saves you a callback",
    tag: "Prep",
    date: "FEB 12, 2026",
    image: "/images/post-1.jpg",
    excerpt:
      "Hairline cracks in skimmed walls will telegraph through a fresh coat if they are not opened, filled, and sanded.",
    body: [
      "Hairline cracks in skimmed walls will telegraph through a fresh coat if they are not opened, filled, and sanded. We rake flaky paint, apply suitable filler, skim where needed, then seal stains before topcoats.",
      "Skipping that step often looks fine at handover, then opens up after a season of heat movement on the Highveld. If you are repainting a whole house or a batch of units, fixing structure first keeps your maintenance cycle predictable.",
    ],
  },
  {
    slug: "choosing-sheen-highveld-sun",
    title: "Choosing sheen for Highveld sun: walls, trims, and ceilings",
    tag: "Exterior",
    date: "FEB 5, 2026",
    image: "/images/post-2.jpg",
    excerpt:
      "Matt, low-sheen, and semi-gloss each behave differently on north-facing exterior walls and busy interior passages.",
  },
  {
    slug: "phasing-sectional-title-repaint",
    title: "Phasing a sectional-title repaint with tenants still on site",
    tag: "Complexes",
    date: "JAN 28, 2026",
    image: "/images/post-3.jpg",
    excerpt:
      "Stairwells, lifts, and fire routes need a programme that trustees can sign off before drums of tint are ordered.",
  },
];

export const featuredBlogPost = blogPosts[0];

export const testimonialsCarousel: Testimonial[] = [
  {
    quote:
      "They repainted our entire house without rushing the prep. Ceilings were blotchy before. Now they are even, and the skirtings actually look straight.",
    author: "Darlene Robertson",
    role: "Homeowner, Krugersdorp",
  },
  {
    quote:
      "Our body corporate stairwell and parking lines were done in sections after hours. Communication with the trustees was clear and the place was left swept each night.",
    author: "Savannah Nguyen",
    role: "Trustee, sectional-title scheme",
  },
  {
    quote:
      "Shop front and interior feature wall turned around in the window we had between tenants. Quote matched the final invoice.",
    author: "Wade Warren",
    role: "Retail tenant, West Rand",
  },
];

export const testimonialsGrid: Testimonial[] = [
  {
    quote:
      "Full interior repaint while we stayed in the house. Dust sheets every day and the crew stuck to the room schedule we agreed.",
    author: "Leslie Alexander",
    role: "Homeowner, Krugersdorp",
  },
  {
    quote:
      "Stairwell and passages phased over three weekends so lifts stayed usable. Trustees signed off on the spec without rework.",
    author: "Jenny Wilson",
    role: "Body corporate chair, West Rand",
  },
  {
    quote:
      "IBR roof wash, rust spots treated, then topcoat. No overspray on the solar strings we asked them to mask off.",
    author: "Guy Hawkins",
    role: "Warehouse manager",
  },
  {
    quote:
      "Ceiling water ring came back until the leak was fixed upstairs. They did not paint over damp. Clear scope when we were ready.",
    author: "Robert Fox",
    role: "Townhouse owner",
  },
  {
    quote:
      "Shop front and feature wall between tenants. Quote matched the final invoice and they hit the handover date.",
    author: "Wade Warren",
    role: "Retail tenant, West Rand",
  },
  {
    quote:
      "Exterior refresh with colour samples on the boundary wall first. Neighbours commented that the crew kept the pavement clean.",
    author: "Kristin Watson",
    role: "Residential client",
  },
];

export const homeFaqs: FaqItem[] = [
  {
    id: "hf1",
    question: "Do you paint interiors?",
    answer:
      "No. We specialise in exterior painting for estates and complexes — roofs, facades, and boundary walls. That keeps residents undisturbed inside their units.",
  },
  {
    id: "hf2",
    question: "Can you work with our body corporate or managing agent?",
    answer:
      "Yes. We quote and phase common-property exteriors so trustees and managing agents can plan work clearly and present scopes at meetings.",
  },
  {
    id: "hf3",
    question: "How do you quote a complex or estate?",
    answer:
      "We visit the site, check the surfaces that need prep and paint, and send a written exterior scope. Larger schemes can be phased block by block if that suits your budget cycle.",
  },
  {
    id: "hf4",
    question: "Can residents stay on site while you paint?",
    answer:
      "Usually yes. Exterior work stays outside. We agree working hours with estate or complex rules and keep active zones clear and tidy.",
  },
];

export const faqCategories: FaqCategory[] = [
  {
    id: "general",
    eyebrow: "General painting",
    title: "Quotes, products, and prep",
    items: [
      {
        id: "fg1",
        question: "Do you paint interiors and exteriors?",
        answer:
          "Yes. Interiors cover walls, ceilings, doors, skirtings, and built-ins where quoted. Exteriors use systems suited to sun and rain. We can stage work if you need to stay in the property.",
      },
      {
        id: "fg2",
        question: "How do you estimate cost?",
        answer:
          "We measure surfaces (or work from plans), note repairs, access, and your chosen coating system. Quotes can split prep, primers, topcoats, and labour so you can compare options.",
      },
      {
        id: "fg3",
        question: "Do you repair cracks before painting?",
        answer:
          "Yes, within painting scope: raking, filling, skimming small areas, stain block, and sanding. Active leaks or failed waterproofing must be fixed first. We flag that on inspection.",
      },
    ],
  },
  {
    id: "complex",
    eyebrow: "Complexes & commercial",
    title: "Access, phasing, and specs",
    items: [
      {
        id: "fc1",
        question: "Can you work with our body corporate?",
        answer:
          "Yes. We follow signed work orders, phased areas, and agreed hours for stairwells, passages, parking lines, and facades. Quotes can align to approved paint specs.",
      },
      {
        id: "fc2",
        question: "Can tenants stay on site during painting?",
        answer:
          "Often yes, with clear daily boundaries, dust control, and drying time between coats. We plan access so lifts and fire routes stay compliant.",
      },
      {
        id: "fc3",
        question: "Do you handle roof sheet and IBR recoating?",
        answer:
          "Yes, with correct wash, rust treatment, primers, and manufacturer-compatible topcoats. We mask solar, gutters, and edges as agreed in the quote.",
      },
    ],
  },
];

export const aboutApproach: AboutApproachItem[] = [
  {
    title: "Our Mission",
    description:
      "Deliver prep-first painting, roof, and waterproofing work that body corporates, landlords, and homeowners can budget for with confidence.",
    image: "/images/approach-item-image-1.jpg",
    icon: "fa-solid fa-bullseye",
    tags: ["Prep-first", "Clear scopes"],
  },
  {
    title: "Our Vision",
    description:
      "Be the West Rand contractor trustees and agents call when coatings need to last through Highveld sun, storms, and daily traffic.",
    image: "/images/approach-item-image-2.jpg",
    icon: "fa-solid fa-eye",
  },
  {
    title: "Our Value",
    description:
      "Owner-managed sites, honest timelines, and handovers that include walk-throughs—not rushed cover-ups.",
    image: "/images/approach-item-image-3.jpg",
    icon: "fa-solid fa-rocket",
  },
];

export const serviceSingleContent: ServiceSingleContentData = {
  intro: {
    paragraphs: [
      "Technical property maintenance, done properly. Krugersdorp Painters is owner-managed with 10+ years of experience. We spend roughly 70% of our time on preparation, because proper prep is the difference between paint that lasts 2 years and paint that lasts 10. We work across the West Rand and wider Gauteng, with a strong focus on body corporates, sectional-title schemes, and residential complexes, alongside private homes and commercial buildings.",
      "Below is how we scope and deliver the four pillars of our service. For a site-specific quote or phased programme for a scheme, use the contact form or message Rico on WhatsApp.",
    ],
  },
  heroImage: "/images/service-image-1.jpg",
  sections: [
    {
      title: "Service 01. Interior & exterior painting",
      paragraphs: [
        "A paint job is only as good as the surface underneath it. That is why we never skip preparation. We use high-build primers because the West Rand sun is harsh on exterior walls; thin, cheap coatings simply cannot handle the UV exposure and Highveld temperature swings.",
      ],
      bullets: [
        "Full crack repair and surface preparation before any paint is applied",
        "High-pressure cleaning to remove old flaking coats and contaminants",
        "UV-resistant exterior coatings rated for the harsh Gauteng climate",
        "Residential homes, complexes, and commercial properties",
      ],
    },
    {
      title: "Service 02. Roof restoration",
      paragraphs: [
        "A neglected roof is the number one cause of long-term property damage. We do not only paint roofs; we restore them. Our full technical process starts with high-pressure cleaning and ends with specialised heat-reflective coatings that lower indoor temperatures and extend roof life by years.",
      ],
      bullets: [
        "High-pressure cleaning to remove moss, lichen, and built-up grime",
        "Ridge cap re-pointing and flashing repairs",
        "Heat-reflective coatings that reduce indoor temperatures",
        "Full waterproofing for tiled and metal roofs",
      ],
    },
    {
      title: "Service 03. Waterproofing & damp treatment",
      paragraphs: [
        "Damp does not fix itself, and painting over it only hides the problem until the next rainy season. We diagnose the source of moisture ingress and treat it properly, using crack injection, damp-proof membranes, and exterior wall coatings designed for Highveld conditions.",
      ],
      bullets: [
        "Rising damp and lateral damp diagnosis and treatment",
        "Crack injection and membrane systems for balconies and flat roofs",
        "Parapet and flashing repairs coordinated with paint schedules",
        "Stain block and compatible primers before decorative topcoats",
      ],
    },
    {
      title: "Service 04. General maintenance",
      paragraphs: [
        "Landlords, investors, and managing agents often need more than a single repaint. We handle plaster repairs, gutter touch-ups, pre-sale refreshes, and ongoing maintenance cycles with the same prep discipline as full projects.",
      ],
      bullets: [
        "Plaster repairs and snagging before handover or sale",
        "Gutter cleaning, minor repairs, and coordinated exterior touch-ups",
        "Pre-sale refreshes scoped room by room",
        "Ongoing maintenance contracts for landlords and investors",
      ],
    },
  ],
  whyChoose: {
    title: "Why choose Krugersdorp Painters",
    items: [
      "Prep-first, every time",
      "Complex & body corporate experience",
      "Systems for the Highveld",
      "Owner-managed handover",
    ],
  },
  process: {
    title: "Our process",
    steps: ["Site assessment & scope", "Preparation & priming", "Topcoats & handover"],
    image: "/images/service-process-image.jpg",
  },
  sidebarCategories: [
    { label: "Interior & exterior painting", href: "/services" },
    { label: "Roof restoration", href: "/services" },
    { label: "Waterproofing & damp treatment", href: "/services" },
    { label: "General maintenance", href: "/services" },
    { label: "Quotes & site visits", href: "/contact" },
  ],
};

export const ctaBox = {
  eyebrow: "Talk to us",
  title: "Need exterior painting for your estate or complex?",
  description:
    "Call or WhatsApp Rico. Tell us about the scheme, and we’ll arrange a site visit for a clear exterior quote.",
  image: "/images/cta-box-image.jpg",
  items: [
    { icon: "fa-solid fa-building", title: "Estates & body corporates" },
    { icon: "fa-solid fa-paint-roller", title: "Exterior-only specialists" },
  ],
};

export const servicesPageIntro = {
  eyebrow: "Our Services",
  title: "Technical property maintenance, done properly.",
  benefitTags: [
    "Body corporates & complexes",
    "Prep-first methodology",
    "UV & weather-rated systems",
    "Owner-managed sites",
  ],
};
