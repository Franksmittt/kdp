/**
 * B2B Painting Estimation Engine
 * Quantity-surveying matrix per Krugersdorp Painters blueprint (June 2026).
 * All monetary values in ZAR unless noted.
 */

// ---------------------------------------------------------------------------
// Substrate absorption multipliers (α_sub)
// ---------------------------------------------------------------------------

export const SUBSTRATE_PROFILES = {
  smooth_plaster: {
    id: "smooth_plaster",
    label: "Smooth plaster",
    description: "Steel-troweled exterior walls, minimal porosity",
    alpha: 1.0,
  },
  bagged_brickwork: {
    id: "bagged_brickwork",
    label: "Bagged brickwork",
    description: "Mortar-washed brick with moderate absorption",
    alpha: 1.15,
  },
  rough_cast: {
    id: "rough_cast",
    label: "Rough cast / Tyrolean",
    description: "High-relief stipple or heavily textured plaster",
    alpha: 1.4,
  },
  facebrick_trim: {
    id: "facebrick_trim",
    label: "Facebrick (trim only)",
    description: "Unpainted brick — cement rounds, lintels, reveals (~35% of gross wall)",
    alpha: 0.35,
  },
} as const;

export type SubstrateProfileId = keyof typeof SUBSTRATE_PROFILES;

// ---------------------------------------------------------------------------
// Product tiers — spreading rates (m²/L per coat), ZAR drum pricing
// ---------------------------------------------------------------------------

export const PRODUCT_TIERS = {
  tier1: {
    id: "tier1",
    label: "Elite textured",
    products: "Plascon Micatex / Dulux Weatherguard Fine Textured",
    spreadingRateMin: 4,
    spreadingRateMax: 6,
    spreadingRatePractical: 5,
    targetDftMicrons: 100,
    drum20LPriceZAR: 2100,
    bucket5LPriceZAR: 650,
    coatsDefault: 2,
  },
  tier2: {
    id: "tier2",
    label: "Smooth pro acrylic",
    products: "Plascon Wall & All / Prominent Select Sheen",
    spreadingRateMin: 8,
    spreadingRateMax: 10,
    spreadingRatePractical: 9,
    targetDftMicrons: 50,
    drum20LPriceZAR: 2200,
    bucket5LPriceZAR: 680,
    coatsDefault: 2,
  },
  tier3: {
    id: "tier3",
    label: "Budget / contractor grade",
    products: "Plascon Polvin / Bergermaster Craftsmen Nukote",
    spreadingRateMin: 10,
    spreadingRateMax: 12,
    spreadingRatePractical: 11,
    targetDftMicrons: 40,
    drum20LPriceZAR: 1050,
    bucket5LPriceZAR: 320,
    coatsDefault: 2,
  },
} as const;

export type ProductTierId = keyof typeof PRODUCT_TIERS;

export type ApplicationMethod = "roller" | "spray";

export const WASTE_COEFFICIENTS: Record<ApplicationMethod, number> = {
  roller: 0.1,
  spray: 0.25,
};

/** BIBC-compliant hourly labour baseline (Gauteng West Rand, 2026) */
export const BIBC_HOURLY_RATE_ZAR = 85;

/** Standard prep benchmark: hours for 2-person team per 30 LM detail work */
export const PREP_HOURS_PER_30LM = 2.5;

/** Topcoat application rate m²/hour (roller, single coat equivalent) */
export const APPLICATION_RATE_SQM_HOUR = 14;

/** Consumables markup over raw cost */
export const CONSUMABLES_MARKUP = 0.12;

/** Default profit margin on subtotal */
export const DEFAULT_PROFIT_MARGIN = 0.18;

/** Tunable engine overrides (backoffice / quoting desk) */
export type EngineOverrides = {
  bibcHourlyRateZAR?: number;
  tierDrumPrices?: Partial<Record<ProductTierId, number>>;
  consumablesMarkup?: number;
  profitMargin?: number;
};

export const DEFAULT_ENGINE_OVERRIDES: Required<
  Omit<EngineOverrides, "tierDrumPrices">
> & { tierDrumPrices: Record<ProductTierId, number> } = {
  bibcHourlyRateZAR: BIBC_HOURLY_RATE_ZAR,
  tierDrumPrices: {
    tier1: PRODUCT_TIERS.tier1.drum20LPriceZAR,
    tier2: PRODUCT_TIERS.tier2.drum20LPriceZAR,
    tier3: PRODUCT_TIERS.tier3.drum20LPriceZAR,
  },
  consumablesMarkup: CONSUMABLES_MARKUP,
  profitMargin: DEFAULT_PROFIT_MARGIN,
};

function resolveEngineConfig(overrides?: EngineOverrides) {
  return {
    bibcHourlyRate:
      overrides?.bibcHourlyRateZAR ?? DEFAULT_ENGINE_OVERRIDES.bibcHourlyRateZAR,
    consumablesMarkup:
      overrides?.consumablesMarkup ?? DEFAULT_ENGINE_OVERRIDES.consumablesMarkup,
    profitMargin: overrides?.profitMargin ?? DEFAULT_ENGINE_OVERRIDES.profitMargin,
    tierDrumPrice(tierId: ProductTierId) {
      return (
        overrides?.tierDrumPrices?.[tierId] ??
        DEFAULT_ENGINE_OVERRIDES.tierDrumPrices[tierId]
      );
    },
  };
}

/** Primer spreading rate m²/L */
export const PRIMER_SPREADING_RATE = 7;

export const PRIMER_20L_PRICE_ZAR = 890;

/** Masking tape roll: 48mm × 40m */
export const MASKING_TAPE_ROLL_PRICE_ZAR = 45;
export const MASKING_TAPE_OVERLAP = 1.15;

/** Drop sheet 4m × 5m (20 m²) */
export const DROP_SHEET_PRICE_ZAR = 85;
export const DROP_SHEET_COVERAGE_SQM = 20;

/** Polycell Exterior crack filler — SG 1.45, 4:1 powder:water */
export const FILLER_SPECIFIC_GRAVITY = 1.45;
export const FILLER_WATER_FRACTION = 0.2;
export const V_JOINT_WIDTH_M = 0.005;
export const V_JOINT_DEPTH_M = 0.005;

/** Scale → default gross wall area (m²) when surveyor omits dimensions */
export const SCALE_DEFAULT_AREA_SQM: Record<string, number> = {
  small: 450,
  medium: 2200,
  large: 7500,
  boundary: 1200,
  townhouse_cluster: 1800,
  sectional_complex: 3500,
};

/** Phased chunking months by scale */
export const SCALE_PHASE_MONTHS: Record<string, number> = {
  small: 12,
  medium: 24,
  large: 36,
  boundary: 18,
  townhouse_cluster: 24,
  sectional_complex: 36,
};

// ---------------------------------------------------------------------------
// Input / output types
// ---------------------------------------------------------------------------

export type EstimationInput = {
  grossWallAreaSqm: number;
  substrate: SubstrateProfileId;
  tiers?: ProductTierId[];
  coats?: number;
  crackLinearM: number;
  windowDoorPerimeterM: number;
  wallBoundaryRunM: number;
  degradationIndex: 1 | 2 | 3 | 4 | 5;
  applicationMethod: ApplicationMethod;
  schemeScale: string;
  painPointIds?: string[];
};

export type DrumAllocation = {
  drums20L: number;
  buckets5L: number;
  totalLiters: number;
  packagingCostZAR: number;
};

export type TierQuoteBreakdown = {
  tier: ProductTierId;
  label: string;
  products: string;
  effectiveAreaSqm: number;
  alphaSub: number;
  paintLiters: number;
  primerLiters: number;
  drumAllocation: DrumAllocation;
  primerAllocation: DrumAllocation;
  materialCostZAR: number;
  primerCostZAR: number;
  fillerCostZAR: number;
  consumablesCostZAR: number;
  laborHours: number;
  laborCostZAR: number;
  subtotalZAR: number;
  profitZAR: number;
  totalZAR: number;
  costPerSqmZAR: number;
  phasedMonths: number;
  monthlyReserveDrawdownZAR: number;
};

export type EstimationResult = {
  input: EstimationInput;
  effectiveAreaSqm: number;
  alphaSub: number;
  maskingTapeRolls: number;
  dropSheets: number;
  fillerDryKg: number;
  tiers: TierQuoteBreakdown[];
  recommendedTier: ProductTierId;
};

// ---------------------------------------------------------------------------
// Core formulas
// ---------------------------------------------------------------------------

/** Effective paintable area after substrate multiplier */
export function effectiveArea(grossAreaSqm: number, substrate: SubstrateProfileId): number {
  const alpha = SUBSTRATE_PROFILES[substrate].alpha;
  return grossAreaSqm * alpha;
}

/**
 * V_paint = (A_eff × N_coats) / PSR × (1 + ω)
 * A_eff = gross × α_sub
 */
export function paintVolumeLiters(
  grossAreaSqm: number,
  substrate: SubstrateProfileId,
  coats: number,
  spreadingRatePractical: number,
  wasteOmega: number,
): number {
  const aEff = effectiveArea(grossAreaSqm, substrate);
  const raw = (aEff * coats) / spreadingRatePractical;
  return raw * (1 + wasteOmega);
}

/**
 * Modulo drum optimization — prefer 20L drums; if remainder ≥15L buy another 20L;
 * if remainder <15L compare 3×5L vs 1×20L.
 */
export function optimizeDrumPackaging(
  totalLiters: number,
  price20L: number,
  price5L: number,
): DrumAllocation {
  const DRUM_L = 20;
  const BUCKET_L = 5;

  if (totalLiters <= 0) {
    return { drums20L: 0, buckets5L: 0, totalLiters: 0, packagingCostZAR: 0 };
  }

  let drums20 = Math.floor(totalLiters / DRUM_L);
  let remainder = totalLiters - drums20 * DRUM_L;

  if (remainder >= 15) {
    drums20 += 1;
    remainder = 0;
  } else if (remainder > 0) {
    const bucketsNeeded = Math.ceil(remainder / BUCKET_L);
    const costBuckets = bucketsNeeded * price5L;
    const costExtraDrum = price20L;

    if (bucketsNeeded >= 3 && costExtraDrum <= costBuckets) {
      drums20 += 1;
      remainder = 0;
    }
  }

  let buckets5 = 0;
  if (remainder > 0) {
    buckets5 = Math.ceil(remainder / BUCKET_L);
  }

  const packagedLiters = drums20 * DRUM_L + buckets5 * BUCKET_L;
  const cost = drums20 * price20L + buckets5 * price5L;

  return {
    drums20L: drums20,
    buckets5L: buckets5,
    totalLiters: packagedLiters,
    packagingCostZAR: cost,
  };
}

/**
 * Linear crack filler — V = LM × 5mm × 5mm; dry mass from SG 1.45 minus 20% water
 */
export function crackFillerDryKg(linearMeters: number): number {
  if (linearMeters <= 0) return 0;
  const crossSectionSqM = V_JOINT_WIDTH_M * V_JOINT_DEPTH_M;
  const volumeM3 = linearMeters * crossSectionSqM;
  const mixedMassKg = volumeM3 * FILLER_SPECIFIC_GRAVITY * 1000;
  return mixedMassKg * (1 - FILLER_WATER_FRACTION);
}

/** Masking tape rolls from opening perimeter with 15% waste */
export function maskingTapeRolls(perimeterM: number, rollLengthM = 40): number {
  if (perimeterM <= 0) return 0;
  return Math.ceil((perimeterM * MASKING_TAPE_OVERLAP) / rollLengthM);
}

/** Drop sheets from wall boundary run (1 sheet per ~4m run × 5m drop) */
export function dropSheetCount(wallBoundaryRunM: number): number {
  if (wallBoundaryRunM <= 0) return 0;
  return Math.ceil(wallBoundaryRunM / 4);
}

/** Prep labor hours scaled by degradation index */
export function preparationLaborHours(
  crackLinearM: number,
  windowDoorPerimeterM: number,
  degradationIndex: number,
): number {
  const detailLm = crackLinearM + windowDoorPerimeterM;
  const baseHours =
    detailLm > 0 ? (detailLm / 30) * PREP_HOURS_PER_30LM : PREP_HOURS_PER_30LM * 0.5;
  const indexMultiplier = 1 + Math.max(0, degradationIndex - 1) * 0.2;
  return baseHours * indexMultiplier;
}

/** Application + prep labor hours */
export function totalLaborHours(
  effectiveAreaSqm: number,
  coats: number,
  prepHours: number,
): number {
  const applicationHours = (effectiveAreaSqm * coats) / APPLICATION_RATE_SQM_HOUR;
  return prepHours + applicationHours;
}

function buildTierQuote(
  input: EstimationInput,
  tierId: ProductTierId,
  overrides?: EngineOverrides,
): TierQuoteBreakdown {
  const config = resolveEngineConfig(overrides);
  const tier = PRODUCT_TIERS[tierId];
  const drum20LPrice = config.tierDrumPrice(tierId);
  const alpha = SUBSTRATE_PROFILES[input.substrate].alpha;
  const aEff = input.grossWallAreaSqm * alpha;
  const coats = input.coats ?? tier.coatsDefault;
  const omega = WASTE_COEFFICIENTS[input.applicationMethod];

  const paintL = paintVolumeLiters(
    input.grossWallAreaSqm,
    input.substrate,
    coats,
    tier.spreadingRatePractical,
    omega,
  );

  const primerL = paintVolumeLiters(
    input.grossWallAreaSqm,
    input.substrate,
    1,
    PRIMER_SPREADING_RATE,
    0.08,
  );

  const drumAllocation = optimizeDrumPackaging(
    paintL,
    drum20LPrice,
    tier.bucket5LPriceZAR,
  );

  const primerAllocation = optimizeDrumPackaging(
    primerL,
    PRIMER_20L_PRICE_ZAR,
    Math.ceil(PRIMER_20L_PRICE_ZAR / 4),
  );

  const fillerKg = crackFillerDryKg(input.crackLinearM);
  const fillerCost = fillerKg * 42;

  const tapeRolls = maskingTapeRolls(input.windowDoorPerimeterM);
  const sheets = dropSheetCount(input.wallBoundaryRunM);
  const consumablesRaw =
    tapeRolls * MASKING_TAPE_ROLL_PRICE_ZAR + sheets * DROP_SHEET_PRICE_ZAR;
  const consumablesCost = consumablesRaw * (1 + config.consumablesMarkup);

  const prepH = preparationLaborHours(
    input.crackLinearM,
    input.windowDoorPerimeterM,
    input.degradationIndex,
  );
  const laborH = totalLaborHours(aEff, coats, prepH);
  const laborCost = laborH * config.bibcHourlyRate * 2;

  const materialCost = drumAllocation.packagingCostZAR;
  const primerCost = primerAllocation.packagingCostZAR;
  const subtotal = materialCost + primerCost + fillerCost + consumablesCost + laborCost;
  const profit = subtotal * config.profitMargin;
  const total = subtotal + profit;

  const phasedMonths = SCALE_PHASE_MONTHS[input.schemeScale] ?? 24;

  return {
    tier: tierId,
    label: tier.label,
    products: tier.products,
    effectiveAreaSqm: Math.round(aEff),
    alphaSub: alpha,
    paintLiters: Math.round(paintL * 10) / 10,
    primerLiters: Math.round(primerL * 10) / 10,
    drumAllocation,
    primerAllocation,
    materialCostZAR: Math.round(materialCost),
    primerCostZAR: Math.round(primerCost),
    fillerCostZAR: Math.round(fillerCost),
    consumablesCostZAR: Math.round(consumablesCost),
    laborHours: Math.round(laborH * 10) / 10,
    laborCostZAR: Math.round(laborCost),
    subtotalZAR: Math.round(subtotal),
    profitZAR: Math.round(profit),
    totalZAR: Math.round(total),
    costPerSqmZAR: Math.round(total / input.grossWallAreaSqm),
    phasedMonths,
    monthlyReserveDrawdownZAR: Math.round(total / phasedMonths),
  };
}

/** Full triple-tier estimation run */
export function runEstimation(
  input: EstimationInput,
  overrides?: EngineOverrides,
): EstimationResult {
  const tierIds: ProductTierId[] = input.tiers ?? ["tier1", "tier2", "tier3"];
  const alpha = SUBSTRATE_PROFILES[input.substrate].alpha;

  const tiers = tierIds.map((id) => buildTierQuote(input, id, overrides));

  const recommendedTier: ProductTierId =
    input.painPointIds?.includes("thermal-cracking") ||
    input.painPointIds?.includes("lateral-damp")
      ? "tier1"
      : input.schemeScale === "boundary"
        ? "tier3"
        : "tier2";

  return {
    input,
    effectiveAreaSqm: Math.round(input.grossWallAreaSqm * alpha),
    alphaSub: alpha,
    maskingTapeRolls: maskingTapeRolls(input.windowDoorPerimeterM),
    dropSheets: dropSheetCount(input.wallBoundaryRunM),
    fillerDryKg: Math.round(crackFillerDryKg(input.crackLinearM) * 100) / 100,
    tiers,
    recommendedTier,
  };
}

/** Map wizard scale id → default survey inputs */
export function defaultEstimationInputFromWizard(partial: {
  scale: string;
  substrate: SubstrateProfileId;
  painPoints: string[];
  wallAreaSqm?: number;
  crackLinearM?: number;
  windowDoorPerimeterM?: number;
  wallBoundaryRunM?: number;
}): EstimationInput {
  const gross =
    partial.wallAreaSqm ?? SCALE_DEFAULT_AREA_SQM[partial.scale] ?? 1500;

  const degradation: 1 | 2 | 3 | 4 | 5 =
    partial.painPoints.length >= 3
      ? 4
      : partial.painPoints.length === 2
        ? 3
        : partial.painPoints.length === 1
          ? 2
          : 1;

  return {
    grossWallAreaSqm: gross,
    substrate: partial.substrate,
    crackLinearM: partial.crackLinearM ?? (partial.painPoints.includes("thermal-cracking") ? 45 : 15),
    windowDoorPerimeterM: partial.windowDoorPerimeterM ?? Math.sqrt(gross) * 4 * 0.6,
    wallBoundaryRunM: partial.wallBoundaryRunM ?? Math.sqrt(gross) * 4,
    degradationIndex: degradation,
    applicationMethod: gross > 3000 ? "spray" : "roller",
    schemeScale: partial.scale,
    painPointIds: partial.painPoints,
  };
}

/** Re-run estimation for change-order scope creep on an active job card */
export function rerunChangeOrder(
  baseInput: EstimationInput,
  additionalAreaSqm: number,
  overrides?: EngineOverrides,
): EstimationResult {
  return runEstimation(
    {
      ...baseInput,
      grossWallAreaSqm: baseInput.grossWallAreaSqm + additionalAreaSqm,
    },
    overrides,
  );
}
