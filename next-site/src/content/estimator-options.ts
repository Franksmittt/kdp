import type { SubstrateProfileId } from "@/lib/estimation-engine";

export const ESTIMATOR_ESTATES = [
  { id: "chancliff-ridge", label: "Chancliff Ridge" },
  { id: "homes-haven", label: "Homes Haven" },
  { id: "noordheuwel", label: "Noordheuwel" },
  { id: "rangeview", label: "Rangeview" },
  { id: "featherbrooke-estate", label: "Featherbrooke Estate" },
  { id: "avianto-estate", label: "Avianto Estate" },
  { id: "monument", label: "Monument" },
  { id: "kenmare", label: "Kenmare" },
  { id: "other-west-rand", label: "Other West Rand suburb" },
];

export const ESTIMATOR_SCALES = [
  {
    id: "townhouse_cluster",
    label: "Townhouse cluster (modern high-density)",
    hint: "~1,800 m² default exterior canvas — Chancliff Ridge profile",
  },
  {
    id: "sectional_complex",
    label: "Sectional title complex (multi-unit blocks)",
    hint: "~3,500 m² — Noordheuwel 10-year cycle profile",
  },
  {
    id: "small",
    label: "Small scheme (1–10 units)",
    hint: "~450 m²",
  },
  {
    id: "medium",
    label: "Medium scheme (11–50 units)",
    hint: "~2,200 m²",
  },
  {
    id: "large",
    label: "Large scheme (50+ units)",
    hint: "~7,500 m²",
  },
  {
    id: "boundary",
    label: "Perimeter boundary walls only",
    hint: "~1,200 m² — luxury cluster perimeter (Homes Haven)",
  },
];

export const ESTIMATOR_SUBSTRATES: { id: SubstrateProfileId; label: string; hint: string }[] = [
  { id: "smooth_plaster", label: "Smooth plaster", hint: "Steel-troweled facades" },
  { id: "bagged_brickwork", label: "Bagged brickwork", hint: "Mortar-washed profiles" },
  { id: "rough_cast", label: "Rough cast / Tyrolean", hint: "High-relief texture" },
  { id: "facebrick_trim", label: "Facebrick trim only", hint: "30–40% of gross wall" },
];

export const ESTIMATOR_PAIN_POINTS = [
  { id: "lateral-damp", label: "Lateral damp & efflorescence on retaining walls" },
  { id: "thermal-cracking", label: "Highveld thermal shock cracking on north facades" },
  { id: "uv-roof", label: "UV chalking on roof substrates" },
  { id: "spalling", label: "Spalling, parapet moisture & box-gutter ingress" },
  { id: "rising-damp", label: "Capillary rising damp below 1 m tide mark" },
];

export const ESTIMATOR_MRRP_STATUS = [
  { id: "drafting", label: "Drafting PMR 22 MRRP — need reserve-fund baseline" },
  { id: "executing", label: "Executing approved 10-Year Plan — contractor vetting" },
  { id: "none", label: "No formal MRRP — need statutory baseline assessment" },
];
