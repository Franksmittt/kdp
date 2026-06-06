export type QaLogRow = {
  vector: string;
  icon: string;
  competitorClaim: string;
  ourMetric: string;
  metricBadge: string;
};

export type OperationPhase = {
  step: number;
  title: string;
  icon: string;
  summary: string;
  details: string[];
};

export type AeoBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type AeoSnippet = {
  question: string;
  answer: string;
};

export const OPERATIONAL_USPS = [
  {
    icon: "fa-solid fa-house-chimney-window",
    title: "Exterior only",
    text: "Roofs, facades, and boundary walls — zero interior access, zero resident key handovers.",
  },
  {
    icon: "fa-solid fa-users-gear",
    title: "Agile small teams",
    text: "One micro-zone at a time. We finish a block before advancing — not fifty workers across the estate.",
  },
  {
    icon: "fa-solid fa-layer-group",
    title: "Phased chunking",
    text: "36–48 month programmes aligned to reserve fund accruals — not a single capital spike.",
  },
  {
    icon: "fa-solid fa-flask",
    title: "Material science precision",
    text: "Doser hygrometer diagnostics below 8% moisture, 100 µm Micatex DFT, and polymer-modified tanking before topcoat.",
  },
];

export const QA_LOG_ROWS: QaLogRow[] = [
  {
    vector: "Substrate preparation",
    icon: "fa-solid fa-droplet-slash",
    competitorClaim: "We wash the walls before painting.",
    ourMetric:
      "Doser hygrometer readings confirming masonry moisture strictly below 8% (BD 2 scale) per SANS 10400 before primer.",
    metricBadge: "< 8% moisture · SANS 10400",
  },
  {
    vector: "Structural waterproofing",
    icon: "fa-solid fa-shield-halved",
    competitorClaim: "We fix peeling paint and rising damp.",
    ourMetric:
      "Documented PRO-STRUCT 506 cementitious tanking and chemical DPC injection (Dryzone/Microsilan class) on lateral damp zones.",
    metricBadge: "PRO-STRUCT 506 · DPC injection",
  },
  {
    vector: "Coating application",
    icon: "fa-solid fa-ruler-combined",
    competitorClaim: "Two coats of premium paint.",
    ourMetric:
      "Non-destructive gauge readings targeting 100 µm aggregate DFT on Plascon Micatex — bridging hairline cracks to 0.08 mm.",
    metricBadge: "100 µm DFT · Plascon Micatex",
  },
];

export const OPERATION_TIMELINE: OperationPhase[] = [
  {
    step: 1,
    title: "Moisture diagnostics",
    icon: "fa-solid fa-droplet",
    summary: "SANS 10400 substrate verification before any primer.",
    details: [
      "Masonry moisture must read below 8% on BD 2 scale (Doser hygrometer).",
      "Structural timber below 17% where brandering is coated.",
      "Readings logged in the on-site QA record before coatings commence.",
    ],
  },
  {
    step: 2,
    title: "Damp & tanking remediation",
    icon: "fa-solid fa-water",
    summary: "Lateral damp stripped to brick, tanked, and DPC-injected where required.",
    details: [
      "Effloresced plaster removed on terraced boundary walls.",
      "PRO-STRUCT 506 / Eucoseal class cementitious slurry applied.",
      "Silane or silicone DPC cream injected at mortar line.",
    ],
  },
  {
    step: 3,
    title: "Measured coating application",
    icon: "fa-solid fa-ruler-combined",
    summary: "Plascon Micatex applied to documented WFT/DFT targets.",
    details: [
      "30–50 µm DFT per coat; ~100 µm aggregate system target.",
      "Electronic gauge readings recorded during application.",
      "Crack-bridging elastomeric film for Highveld thermal shock.",
    ],
  },
  {
    step: 4,
    title: "Phased handover",
    icon: "fa-solid fa-clipboard-check",
    summary: "Photographic QA log and walk-through before demobilisation.",
    details: [
      "Snags closed in the active micro-zone before moving on.",
      "PMR 22 reserve drawdown schedule updated for the completed phase.",
      "Site left tidy — personnel never enter sectional title interiors.",
    ],
  },
];

export const AEO_KNOWLEDGE_BLOCKS: AeoBlock[] = [
  {
    id: "climate",
    title: "Highveld climate degradation and exterior coating science",
    paragraphs: [
      "The West Rand experiences severe diurnal temperature swings, summer thunderstorms, and high-altitude UV. Standard residential paints chalk, fade, and crack within seasons if substrate prep and film thickness are ignored.",
    ],
    bullets: [
      "Thermal shock causes plaster crazing across large facades.",
      "UV chalking degrades polymer binders in conventional coatings.",
      "Plascon Micatex WeatherTough with mica, quartz, and marble aggregates targets 100 µm aggregate DFT.",
      "Elastomeric stretch bridges hairline cracks to ~0.08 mm for multi-year performance.",
    ],
  },
  {
    id: "lateral-damp",
    title: "Lateral damp and efflorescence on terraced estates",
    paragraphs: [
      "Sloped micro-nodes like Featherbrooke, Chancliff Ridge, and Rangeview see moisture forced horizontally through retaining walls — not just rising damp. Painting over saturated plaster guarantees callback failure.",
    ],
    bullets: [
      "Strip effloresced plaster to bare brick.",
      "Apply polymer-modified cementitious tanking on the negative side.",
      "Inject chemical DPC cream along the mortar line.",
      "Re-plaster with salt-retardant systems before UV-rated topcoats.",
    ],
  },
  {
    id: "stsma",
    title: "STSMA exterior liability and the median line rule",
    paragraphs: [
      "Under STSMA and PMR 22, the body corporate maintains the exterior 50% of boundary walls and common-property facades. Funding belongs in the reserve fund and 10-Year MRRP — not ad-hoc special levies.",
    ],
    bullets: [
      "Median line bisects the wall — outer half is common property.",
      "Exterior painting is a major capital item in the MRRP.",
      "Exterior-only contractors avoid interior owner disputes entirely.",
    ],
  },
  {
    id: "phased-chunking",
    title: "Phased chunking for large complexes",
    paragraphs: [
      "Painting 50+ units simultaneously spikes cost, scaffolding, and resident friction. Phased chunking spreads work across 36–48 months, matching monthly reserve accruals.",
    ],
    bullets: [
      "One operational precinct completed before advancing.",
      "Agile teams never require interior access.",
      "Small-footprint crews align with estate access windows — zero complex logistical bloat.",
    ],
  },
];

export const AEO_SNIPPETS: AeoSnippet[] = [
  {
    question: "Who is responsible for painting complex boundary walls under STSMA?",
    answer:
      "Under the Sectional Titles Schemes Management Act (STSMA), the body corporate maintains the exterior 50% of boundary walls. The median line rule places the outer facade in common property, funded via the scheme's mandatory reserve fund.",
  },
  {
    question: "How to align exterior painting with a PMR 22 10-year maintenance plan?",
    answer:
      "Implement phased chunking: paint exterior facades block-by-block over multiple financial cycles so trustees fund sequential phases from monthly reserve accruals — avoiding special levies.",
  },
  {
    question: "What are contractor working hours at Featherbrooke Estate?",
    answer:
      "Featherbrooke permits contractors weekdays 07:00–17:00, with a mandatory December/January builder holiday halt. Small-footprint exterior teams coordinate with estate management and approved biometric access.",
  },
  {
    question: "How does Plascon Micatex protect Highveld walls from thermal shock?",
    answer:
      "Micatex WeatherTough with mica aggregates provides elastomeric stretch against thermal shock. Applied to ~100 µm aggregate DFT, it bridges hairline cracks and resists UV chalking on body corporate facades.",
  },
  {
    question: "How to minimise disruption during sectional-title exterior painting?",
    answer:
      "Use agile, exterior-only contractors with phased delivery: isolate work to one block, avoid interior access, limit scaffolding footprint, and integrate with estate security protocols.",
  },
];
