export type EstateProfile = {
  slug: string;
  name: string;
  region: string;
  nodeType:
    | "townhouse_cluster"
    | "luxury_cluster"
    | "estate_anchor"
    | "elevated_exposure"
    | "aging_blocks"
    | "general";
  officialUrl?: string;
  demographic: string;
  h1Suffix: string;
  subheading: string;
  hours: string;
  security: string;
  aesthetics: string;
  environment: string;
  climateNote: string;
  geoSignal: string;
  legalContext: string[];
  workingWindow: string;
  accessPerimeter: string;
};

const SHARED_LEGAL = [
  "Sectional Titles Schemes Management Act (STSMA) and Prescribed Management Rule 22 (PMR 22).",
  "10-Year Maintenance, Repair, and Replacement Plan (MRRP) reserve fund alignment.",
  "Section 5 median line — 50/50 body corporate vs section owner fenestration split.",
];

export const WEST_RAND_ESTATES: EstateProfile[] = [
  {
    slug: "chancliff-ridge",
    name: "Chancliff Ridge",
    region: "Krugersdorp",
    nodeType: "townhouse_cluster",
    demographic: "Modern high-density complexes and townhouse clusters",
    h1Suffix: "Phased Complex Maintenance",
    subheading:
      "Exterior-only painting for Chancliff Ridge complexes — boundary walls, facades, and roof batches with zero interior access.",
    hours: "Weekday 07:00–17:00; stairwell phases per body corporate work order.",
    security: "Estate access coordination and contractor induction before mobilisation.",
    aesthetics: "Coordinated colour schedules across multi-unit blocks.",
    environment: "Contained scaffolding; daily site tidy at shift end.",
    climateNote:
      "Expansive clay terraces — lateral damp on retaining walls dominates capillary rise.",
    geoSignal: "PRO-STRUCT 506 tanking + DPC injection before 100 µm Micatex DFT.",
    workingWindow: "Block-by-block micro-zones — one cluster active at a time.",
    accessPerimeter: "Common property exterior only.",
    legalContext: [
      ...SHARED_LEGAL,
      "CSOS Circular No. 1 of 2021 EUA cost recovery where applicable.",
    ],
  },
  {
    slug: "homes-haven",
    name: "Homes Haven",
    region: "Krugersdorp",
    nodeType: "luxury_cluster",
    demographic: "Highly packed luxury cluster home configurations",
    h1Suffix: "Perimeter-First Programmes",
    subheading:
      "Boundary-first exterior maintenance for Homes Haven cluster schemes — phased chunking and perimeter-first sequencing.",
    hours: "Strict weekday windows; weekend by trustee resolution.",
    security: "Pre-cleared personnel and contractor induction.",
    aesthetics: "HOA palette standards on shared boundary runs.",
    environment: "Landscaping protected during wash and prep.",
    climateNote: "Dense layouts require phased chunking for parking and access.",
    geoSignal: "Sequential PMR 22 reserve drawdowns — block-by-block invoicing.",
    workingWindow: "07:00–17:00; one block active per phase.",
    accessPerimeter: "Exterior common property and outer 50% median-line fenestration.",
    legalContext: [
      ...SHARED_LEGAL,
      "Special levy elimination via sequential MRRP phasing.",
    ],
  },
  {
    slug: "noordheuwel",
    name: "Noordheuwel",
    region: "Krugersdorp",
    nodeType: "aging_blocks",
    demographic: "Established estates and aging multi-unit blocks in 10-year cycles",
    h1Suffix: "PMR 22 Cycle Exterior Works",
    subheading:
      "Exterior programmes for Noordheuwel sectional-title blocks executing 10-Year MRRP scopes.",
    hours: "West Rand weekday ops; managing-agent work orders.",
    security: "Contractor registers for gated complexes.",
    aesthetics: "North-facing wall sheen advice for Highveld UV.",
    environment: "Paving and landscaping protected during prep.",
    climateNote: "Parapet spalling and failed DPC common on aging blocks.",
    geoSignal: "BIBC-compliant labour benchmarks for trustee AGM packs.",
    workingWindow: "Phased stairwell and facade batches.",
    accessPerimeter: "Common property exteriors; Section 5 split quotes available.",
    legalContext: [
      ...SHARED_LEGAL,
      "Reserve fund liquidity — baseline capital costing for AGM approval.",
    ],
  },
  {
    slug: "rangeview",
    name: "Rangeview",
    region: "Krugersdorp",
    nodeType: "elevated_exposure",
    demographic: "Elevated terrain — extreme Highveld weather exposure",
    h1Suffix: "Thermal Shock Defense",
    subheading:
      "Elastomeric exterior systems for Rangeview elevations — measured DFT and crack bridging.",
    hours: "Weather-window scheduling; 10°C–40°C application gate.",
    security: "Suburban access; complexes via work orders.",
    aesthetics: "UV-stable textures on exposed elevations.",
    environment: "Wind-aware staging on elevated plots.",
    climateNote: "Diurnal swings >20°C — thermal shock micro-cracking on rigid films.",
    geoSignal: "Quartzite ridge exposure; lateral damp on retaining structures.",
    workingWindow: "Meteorological logs; dew-point thresholds enforced.",
    accessPerimeter: "Full exterior envelope on common property.",
    legalContext: [
      ...SHARED_LEGAL,
      "Highveld thermal shock — Plascon Micatex 50–70 µm/coat specification.",
    ],
  },
  {
    slug: "featherbrooke-estate",
    name: "Featherbrooke Estate",
    region: "Krugersdorp",
    nodeType: "estate_anchor",
    officialUrl: "https://www.featherbrooke-estate.co.za/",
    demographic: "Ultra-luxury sectional title and freehold, 1000+ stands",
    h1Suffix: "HOA-Compliant & Zero-Disruption",
    subheading:
      "Agile exterior teams for Featherbrooke boundary walls, facades, and roofs — biometric access aligned.",
    hours: "07:00–17:00 weekdays; December/January builder shutdown respected.",
    security: "Small-footprint crews; biometric estate access coordination.",
    aesthetics: "Aesthetics committee colour matching.",
    environment: "Zero-impact staging for indigenous gardens.",
    climateNote: "Terraced Highveld exposure — thermal shock on north plaster.",
    geoSignal: "Phased programmes without interior key handovers.",
    workingWindow: "Estate contractor hours and holiday shutdown calendar.",
    accessPerimeter: "Common property and HOA-approved exterior zones.",
    legalContext: SHARED_LEGAL,
  },
  {
    slug: "avianto-estate",
    name: "Avianto Estate",
    region: "Muldersdrift / West Rand",
    nodeType: "estate_anchor",
    officialUrl: "https://aviantoestate.co.za/",
    demographic: "Luxury lifestyle estate, European-influenced architecture",
    h1Suffix: "Architectural Guideline Compliant",
    subheading:
      "Exterior-only repaints respecting Avianto stone, timber, and plaster harmony.",
    hours: "Quiet-hours frameworks per precinct.",
    security: "Avianto Contractor Code of Conduct; central security hub.",
    aesthetics: "True-colour plaster matching Crocodile River landscape.",
    environment: "Greenbelt-sensitive equipment staging.",
    climateNote: "Sustained Highveld UV on open facades.",
    geoSignal: "Micro-zone phased delivery for visitor parking.",
    workingWindow: "Precinct-specific quiet hours.",
    accessPerimeter: "Exterior common property only.",
    legalContext: SHARED_LEGAL,
  },
  {
    slug: "monument",
    name: "Monument",
    region: "Krugersdorp",
    nodeType: "general",
    demographic: "Established middle-to-upper income housing",
    h1Suffix: "Roof & Plaster Restoration",
    subheading: "Exterior repaints and roof coatings for Monument's mature stock.",
    hours: "07:00–17:00; sectional-title rules where applicable.",
    security: "Managing-agent coordination for clusters.",
    aesthetics: "Mixed facebrick and plaster matching.",
    environment: "Pedestrian route control on narrow stands.",
    climateNote: "Parapet spalling before paint failure on older stock.",
    geoSignal: "Parapet waterproofing before facade colour.",
    workingWindow: "Standard West Rand weekday programme.",
    accessPerimeter: "Exterior-only scope.",
    legalContext: SHARED_LEGAL,
  },
  {
    slug: "kenmare",
    name: "Kenmare",
    region: "Krugersdorp",
    nodeType: "general",
    demographic: "Established wealth, mature properties",
    h1Suffix: "Deep Prep Exterior Refresh",
    subheading: "Full exterior lifecycle for Kenmare properties entering maintenance cycles.",
    hours: "Flexible phasing; minimal noise windows.",
    security: "Appointment access; complexes via agents.",
    aesthetics: "Heritage-appropriate colours.",
    environment: "Mature trees protected during pressure wash.",
    climateNote: "Crack routing and stain block before topcoats.",
    geoSignal: "Documented QA handover for pre-sale refreshes.",
    workingWindow: "Owner-occupied friendly phasing.",
    accessPerimeter: "Exterior envelope only.",
    legalContext: SHARED_LEGAL,
  },
  {
    slug: "pinehaven",
    name: "Pinehaven",
    region: "Krugersdorp",
    nodeType: "townhouse_cluster",
    demographic: "Sectional-title schemes adjacent to Featherbrooke corridor",
    h1Suffix: "Trustee-Friendly Exterior Teams",
    subheading: "Phased exterior crews for Pinehaven townhouses — PMR 22 aligned.",
    hours: "Body corporate hours; parking-line coordination.",
    security: "Contractor induction and estate access coordination upfront.",
    aesthetics: "Scheme-wide colour continuity for trustee sign-off.",
    environment: "Dust control near stairwell adjacency.",
    climateNote: "Block-by-block reserve-fund phasing.",
    geoSignal: "PMR 22 proposals for managing agent submissions.",
    workingWindow: "One block micro-zone at a time.",
    accessPerimeter: "Common property exterior.",
    legalContext: SHARED_LEGAL,
  },
];

export function getEstateBySlug(slug: string): EstateProfile | undefined {
  return WEST_RAND_ESTATES.find((e) => e.slug === slug);
}

export function allEstateSlugs(): string[] {
  return WEST_RAND_ESTATES.map((e) => e.slug);
}

export function estatesByNodeType(
  type: EstateProfile["nodeType"],
): EstateProfile[] {
  return WEST_RAND_ESTATES.filter((e) => e.nodeType === type);
}
