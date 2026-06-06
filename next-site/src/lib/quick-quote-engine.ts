/**
 * Quick exterior quote engine — unit template × count, line-item output.
 */

import {
  DEFAULT_UNIT_SPEC,
  QUOTE_RATE_DEFAULTS,
  ROOF_TYPES,
  SURFACE_CONDITIONS,
} from "@/config/exterior-quote";
import {
  APPLICATION_RATE_SQM_HOUR,
  crackFillerDryKg,
  DEFAULT_ENGINE_OVERRIDES,
  maskingTapeRolls,
  optimizeDrumPackaging,
  paintVolumeLiters,
  PRIMER_20L_PRICE_ZAR,
  PRIMER_SPREADING_RATE,
  PRODUCT_TIERS,
  type EngineOverrides,
  type ProductTierId,
} from "@/lib/estimation-engine";
import type {
  ManualLineItem,
  QuickQuoteJob,
  QuickQuoteResult,
  QuoteLineItem,
  UnitSpec,
  UnitTakeoff,
} from "@/types/quick-quote";

export type QuoteRateOverrides = {
  membranePricePerLmZAR?: number;
  roofPaint20LPriceZAR?: number;
  fillerPricePerKgZAR?: number;
};

function round(n: number, d = 0) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function openingArea(count: number, w: number, h: number) {
  return count * w * h;
}

export function computeUnitTakeoff(spec: UnitSpec): UnitTakeoff {
  const perimeter = 2 * (spec.lengthM + spec.widthM);
  const grossWallSqm = perimeter * spec.heightM;
  const openingsSqm =
    openingArea(spec.windows.count, spec.windows.widthM, spec.windows.heightM) +
    openingArea(spec.doors.count, spec.doors.widthM, spec.doors.heightM);
  const paintableWallSqm = Math.max(
    0,
    (grossWallSqm - openingsSqm) * (spec.cementPercent / 100),
  );

  const overhangM = spec.roofOverhangMm / 1000;
  const effL = spec.lengthM + 2 * overhangM;
  const effW = spec.widthM + 2 * overhangM;
  const roofPlanSqm = effL * effW;

  const pitchRad = (spec.roofPitchDeg * Math.PI) / 180;
  const pitchFactor =
    spec.roofType === "flat_parapet" ? 1 : 1 / Math.cos(pitchRad);
  const roofProfile = ROOF_TYPES[spec.roofType];
  const roofSlopeSqm = roofPlanSqm * pitchFactor * roofProfile.areaFactor;

  let membraneLinearM = 0;
  switch (spec.roofType) {
    case "simple_pitch":
      membraneLinearM = 2 * effW + effL * 0.2;
      break;
    case "hip":
      membraneLinearM = (effL + effW) * 1.2;
      break;
    case "flat_parapet":
      membraneLinearM = 2 * (effL + effW);
      break;
  }

  const windowDoorPerimeterM =
    spec.windows.count * 2 * (spec.windows.widthM + spec.windows.heightM) +
    spec.doors.count * 2 * (spec.doors.widthM + spec.doors.heightM);

  return {
    grossWallSqm: round(grossWallSqm, 1),
    openingsSqm: round(openingsSqm, 1),
    paintableWallSqm: round(paintableWallSqm, 1),
    roofPlanSqm: round(roofPlanSqm, 1),
    roofSlopeSqm: round(roofSlopeSqm, 1),
    membraneLinearM: round(membraneLinearM, 1),
    windowDoorPerimeterM: round(windowDoorPerimeterM, 1),
  };
}

function resolveRates(
  engineOverrides?: EngineOverrides,
  quoteRates?: QuoteRateOverrides,
) {
  const tierDrum = (tier: ProductTierId) =>
    engineOverrides?.tierDrumPrices?.[tier] ??
    DEFAULT_ENGINE_OVERRIDES.tierDrumPrices[tier];

  return {
    hourlyRate:
      engineOverrides?.bibcHourlyRateZAR ?? DEFAULT_ENGINE_OVERRIDES.bibcHourlyRateZAR,
    profitMargin:
      engineOverrides?.profitMargin ?? DEFAULT_ENGINE_OVERRIDES.profitMargin,
    membranePricePerLm:
      quoteRates?.membranePricePerLmZAR ?? QUOTE_RATE_DEFAULTS.membranePricePerLmZAR,
    roofPaint20L:
      quoteRates?.roofPaint20LPriceZAR ?? QUOTE_RATE_DEFAULTS.roofPaint20LPriceZAR,
    fillerPricePerKg:
      quoteRates?.fillerPricePerKgZAR ?? QUOTE_RATE_DEFAULTS.fillerPricePerKgZAR,
    tierDrum,
  };
}

function buildAutoLineItems(
  job: QuickQuoteJob,
  takeoff: UnitTakeoff,
  rates: ReturnType<typeof resolveRates>,
): QuoteLineItem[] {
  const { unitSpec: spec, productTier } = job;
  const tier = PRODUCT_TIERS[productTier];
  const condition = SURFACE_CONDITIONS[spec.condition];
  const items: QuoteLineItem[] = [];
  const margin = 1 + rates.profitMargin;

  if (spec.services.wall_paint && takeoff.paintableWallSqm > 0) {
    const paintL = paintVolumeLiters(
      takeoff.paintableWallSqm,
      "smooth_plaster",
      spec.wallCoats,
      tier.spreadingRatePractical,
      0.1,
    );
    const drums = optimizeDrumPackaging(
      paintL,
      rates.tierDrum(productTier),
      tier.bucket5LPriceZAR,
    );
    const appHours =
      (takeoff.paintableWallSqm * spec.wallCoats) / APPLICATION_RATE_SQM_HOUR;
    const prepHours = appHours * 0.15 * condition.prepMultiplier;
    const laborH = prepHours + appHours;

    items.push({
      id: "wall-paint",
      category: "materials",
      description: `Wall paint — ${tier.label} (${spec.wallCoats} coats)`,
      quantity: drums.totalLiters,
      unit: "L",
      unitCostZAR: round(drums.packagingCostZAR / Math.max(drums.totalLiters, 1), 2),
      totalCostZAR: drums.packagingCostZAR,
      totalPriceZAR: round(drums.packagingCostZAR * margin),
      laborHours: round(laborH, 1),
      auto: true,
      perUnit: true,
    });
  }

  if (spec.services.wall_primer && takeoff.paintableWallSqm > 0) {
    const primerL = paintVolumeLiters(
      takeoff.paintableWallSqm,
      "smooth_plaster",
      1,
      PRIMER_SPREADING_RATE,
      0.08,
    );
    const drums = optimizeDrumPackaging(primerL, PRIMER_20L_PRICE_ZAR, 250);
    const laborH = takeoff.paintableWallSqm / (APPLICATION_RATE_SQM_HOUR * 1.2);

    items.push({
      id: "wall-primer",
      category: "materials",
      description: "Wall bonding primer (1 coat)",
      quantity: drums.totalLiters,
      unit: "L",
      unitCostZAR: round(drums.packagingCostZAR / Math.max(drums.totalLiters, 1), 2),
      totalCostZAR: drums.packagingCostZAR,
      totalPriceZAR: round(drums.packagingCostZAR * margin),
      laborHours: round(laborH, 1),
      auto: true,
      perUnit: true,
    });
  }

  if (spec.services.crack_fill && spec.crackLinearM > 0) {
    const fillerKg = crackFillerDryKg(spec.crackLinearM);
    const fillerCost = fillerKg * rates.fillerPricePerKg;
    const laborH = (spec.crackLinearM / 30) * 2.5 * condition.prepMultiplier;

    items.push({
      id: "crack-fill",
      category: "materials",
      description: "Hairline crack filler",
      quantity: round(fillerKg, 1),
      unit: "kg",
      unitCostZAR: rates.fillerPricePerKg,
      totalCostZAR: round(fillerCost),
      totalPriceZAR: round(fillerCost * margin),
      laborHours: round(laborH, 1),
      auto: true,
      perUnit: true,
    });
  }

  if (spec.services.roof_waterproofing && takeoff.membraneLinearM > 0) {
    const materialCost = takeoff.membraneLinearM * rates.membranePricePerLm;
    const laborH =
      takeoff.membraneLinearM / QUOTE_RATE_DEFAULTS.waterproofingRateLmHour;

    items.push({
      id: "roof-waterproof",
      category: "materials",
      description: "Roof membrane / flashing",
      quantity: takeoff.membraneLinearM,
      unit: "lm",
      unitCostZAR: rates.membranePricePerLm,
      totalCostZAR: round(materialCost),
      totalPriceZAR: round(materialCost * margin),
      laborHours: round(laborH, 1),
      auto: true,
      perUnit: true,
    });
  }

  if (spec.services.roof_paint && takeoff.roofSlopeSqm > 0) {
    const paintL =
      (takeoff.roofSlopeSqm * spec.roofCoats) /
      QUOTE_RATE_DEFAULTS.roofPaintSpreadingRateSqmL;
    const drums = optimizeDrumPackaging(
      paintL * 1.12,
      rates.roofPaint20L,
      Math.ceil(rates.roofPaint20L / 4),
    );
    const laborH =
      (takeoff.roofSlopeSqm * spec.roofCoats) /
      QUOTE_RATE_DEFAULTS.roofApplicationRateSqmHour;

    items.push({
      id: "roof-paint",
      category: "materials",
      description: `Roof paint (${spec.roofCoats} coats)`,
      quantity: drums.totalLiters,
      unit: "L",
      unitCostZAR: round(drums.packagingCostZAR / Math.max(drums.totalLiters, 1), 2),
      totalCostZAR: drums.packagingCostZAR,
      totalPriceZAR: round(drums.packagingCostZAR * margin),
      laborHours: round(laborH, 1),
      auto: true,
      perUnit: true,
    });
  }

  const tapeRolls = maskingTapeRolls(takeoff.windowDoorPerimeterM);
  if (tapeRolls > 0 && (spec.services.wall_paint || spec.services.wall_primer)) {
    const cost = tapeRolls * 45;
    items.push({
      id: "consumables",
      category: "materials",
      description: "Masking tape & drop sheets",
      quantity: tapeRolls,
      unit: "rolls",
      unitCostZAR: 45,
      totalCostZAR: cost,
      totalPriceZAR: round(cost * margin),
      laborHours: 0,
      auto: true,
      perUnit: true,
    });
  }

  const totalAutoLaborH = items.reduce((s, i) => s + i.laborHours, 0);
  if (totalAutoLaborH > 0) {
    const laborCost = totalAutoLaborH * rates.hourlyRate;
    items.push({
      id: "labour",
      category: "labour",
      description: `Labour (${round(totalAutoLaborH, 1)} h per unit)`,
      quantity: round(totalAutoLaborH, 1),
      unit: "h",
      unitCostZAR: rates.hourlyRate,
      totalCostZAR: round(laborCost),
      totalPriceZAR: round(laborCost * margin),
      laborHours: round(totalAutoLaborH, 1),
      auto: true,
      perUnit: true,
    });
  }

  return items;
}

function manualToLineItem(item: ManualLineItem, margin: number): QuoteLineItem {
  const totalCost = item.quantity * item.unitCostZAR;
  const totalPrice =
    item.unitPriceZAR != null
      ? item.quantity * item.unitPriceZAR
      : totalCost * (1 + margin);

  return {
    id: item.id,
    category: "other",
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unitCostZAR: item.unitCostZAR,
    totalCostZAR: round(totalCost),
    totalPriceZAR: round(totalPrice),
    laborHours: 0,
    auto: false,
    perUnit: true,
  };
}

function sumEnabled(
  items: QuoteLineItem[],
  disabledIds: Set<string>,
  unitCount: number,
  field: "totalCostZAR" | "totalPriceZAR" | "laborHours",
) {
  return items
    .filter((i) => !disabledIds.has(i.id))
    .reduce((s, i) => {
      const mult = i.perUnit ? unitCount : 1;
      return s + i[field] * mult;
    }, 0);
}

export function runQuickQuote(
  job: QuickQuoteJob,
  engineOverrides?: EngineOverrides,
  quoteRates?: QuoteRateOverrides,
): QuickQuoteResult {
  const takeoff = computeUnitTakeoff(job.unitSpec);
  const rates = resolveRates(engineOverrides, quoteRates);
  const disabled = new Set(job.disabledLineItemIds);

  const autoItems = buildAutoLineItems(job, takeoff, rates);
  const manualItems = job.manualLineItems.map((m) =>
    manualToLineItem(m, rates.profitMargin),
  );
  const lineItems = [...autoItems, ...manualItems];

  const perUnitCost = sumEnabled(lineItems, disabled, 1, "totalCostZAR");
  const perUnitPrice = sumEnabled(lineItems, disabled, 1, "totalPriceZAR");
  const perUnitLaborH = sumEnabled(lineItems, disabled, 1, "laborHours");
  const perUnitLaborCost = lineItems
    .filter((i) => !disabled.has(i.id) && i.category === "labour")
    .reduce((s, i) => s + i.totalCostZAR, 0);
  const perUnitMaterialCost = perUnitCost - perUnitLaborCost;

  const projectCost = sumEnabled(lineItems, disabled, job.unitCount, "totalCostZAR");
  const projectPrice = sumEnabled(lineItems, disabled, job.unitCount, "totalPriceZAR");
  const projectLaborH = sumEnabled(lineItems, disabled, job.unitCount, "laborHours");
  const calendarDays = projectLaborH / (job.crewSize * 8);

  return {
    takeoff,
    lineItems,
    perUnit: {
      materialCostZAR: round(perUnitMaterialCost),
      laborCostZAR: round(perUnitLaborCost),
      laborHours: round(perUnitLaborH, 1),
      subtotalZAR: round(perUnitCost),
      profitZAR: round(perUnitPrice - perUnitCost),
      totalZAR: round(perUnitPrice),
    },
    project: {
      materialCostZAR: round(
        sumEnabled(
          lineItems.filter((i) => i.category !== "labour"),
          disabled,
          job.unitCount,
          "totalCostZAR",
        ),
      ),
      laborCostZAR: round(
        sumEnabled(
          lineItems.filter((i) => i.category === "labour"),
          disabled,
          job.unitCount,
          "totalCostZAR",
        ),
      ),
      laborHours: round(projectLaborH, 1),
      calendarDays: round(calendarDays, 1),
      subtotalZAR: round(projectCost),
      profitZAR: round(projectPrice - projectCost),
      totalZAR: round(projectPrice),
    },
  };
}

export function defaultQuickQuoteJob(): QuickQuoteJob {
  return {
    jobRef: `JOB-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    clientName: "",
    schemeName: "",
    unitCount: 12,
    unitLabel: "Standard unit",
    unitSpec: {
      ...DEFAULT_UNIT_SPEC,
    },
    productTier: "tier2",
    crewSize: 2,
    manualLineItems: [],
    disabledLineItemIds: [],
  };
}
export function servicesForCondition(
  condition: UnitSpec["condition"],
  current: Record<string, boolean>,
): Record<string, boolean> {
  const next = { ...current };
  if (condition === "new_build") {
    next.wall_primer = true;
    next.crack_fill = true;
  } else if (condition === "previously_painted") {
    next.wall_primer = false;
    next.crack_fill = false;
  } else {
    next.wall_primer = true;
    next.crack_fill = true;
  }
  return next;
}

export function newManualLineItem(): ManualLineItem {
  return {
    id: `manual-${Date.now().toString(36)}`,
    description: "Custom item",
    quantity: 1,
    unit: "each",
    unitCostZAR: 0,
  };
}
