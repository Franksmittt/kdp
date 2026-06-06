/**
 * Dynamic Material & Labor Engine
 * Blueprint § Dynamic Material and Labor Engine (June 2026).
 *
 * CRITICAL: Call only AFTER geometric values are multiplied by unit count.
 */

import type {
  BaseUnitObject,
  QuoteCalculationResult,
  QuoteLineItemResult,
  ServicesRequested,
} from "@/types/visual-quote";
import { totalLinearJointsLm } from "@/lib/geometry-engine";

/** Industry constants — server-side only */
export const MATERIAL_CONSTANTS = {
  /** SBP membrane roll length (m) */
  MEMBRANE_ROLL_LENGTH_M: 20,
  /** Default membrane roll width (m) — 200mm */
  MEMBRANE_ROLL_WIDTH_M: 0.2,
  /** Overlap waste 10–15% — use 12.5% median */
  MEMBRANE_OVERLAP_WASTE: 0.125,
  /** Liquid plastic coverage L/m² (multi-coat system) */
  LIQUID_PLASTIC_L_PER_SQM: 2.25,
  /** Plaster primer median spreading rate m²/L */
  PRIMER_SPREADING_RATE_SQM_L: 8,
  PRIMER_WASTE: 0.1,
  /** Crack filler baseline kg/m² plastered wall */
  CRACK_FILLER_KG_PER_SQM: 0.05,
  FILLER_PRICE_KG: 42,
  /** Acrylic topcoat spreading m²/L, 2 coats default */
  TOPCOAT_SPREADING_SQM_L: 9,
  TOPCOAT_COATS: 2,
  TOPCOAT_WASTE: 0.1,
  PAINT_20L_PRICE: 2200,
  PRIMER_20L_PRICE: 890,
  LIQUID_PLASTIC_20L_PRICE: 1850,
  MEMBRANE_ROLL_PRICE: 95 * 20,
  /** Labor productivity man-hours/m² wall */
  WALL_LABOR_HRS_PER_SQM: 0.2,
  PREP_LABOR_HRS_PER_SQM: 0.05,
  PRIMER_LABOR_HRS_PER_SQM: 0.08,
  MEMBRANE_LABOR_HRS_PER_LM: 0.15,
  ROOF_PAINT_LABOR_HRS_PER_SQM: 0.12,
};

export type AggregatedGeometry = {
  net_plaster_area_sqm: number;
  net_wall_area_sqm: number;
  roof_surface_area_sqm: number;
  total_linear_joints_lm: number;
  multiplier_count: number;
};

/** Multiply raw base-unit geometry BEFORE ceiling/rounding (blueprint mandate) */
export function aggregateGeometry(
  base: BaseUnitObject["geometry"],
  multiplierCount: number,
): AggregatedGeometry {
  const m = multiplierCount;
  const joints = base.roof.linear_joints;
  return {
    net_plaster_area_sqm: base.net_plaster_area_sqm * m,
    net_wall_area_sqm: base.net_wall_area_sqm * m,
    roof_surface_area_sqm: base.roof.surface_area_sqm * m,
    total_linear_joints_lm: totalLinearJointsLm(joints) * m,
    multiplier_count: m,
  };
}

function ceilLitresFromSqm(areaSqm: number, spreadingSqmL: number, coats: number, waste: number): number {
  const litres = (areaSqm * coats) / spreadingSqmL;
  return Math.ceil(litres * (1 + waste));
}

function ceilDrums20L(litres: number): number {
  return Math.ceil(litres / 20);
}

export function calculateMaterialsAndLabor(
  agg: AggregatedGeometry,
  services: ServicesRequested,
  labor: BaseUnitObject["labor_parameters"],
  profitMarginPct: number,
  materialPrices?: Partial<typeof MATERIAL_CONSTANTS>,
): QuoteCalculationResult {
  const c = { ...MATERIAL_CONSTANTS, ...materialPrices };
  const lineItems: QuoteLineItemResult[] = [];
  let materialCost = 0;
  let laborHours = 0;

  if (services.waterproofing_membrane && agg.total_linear_joints_lm > 0) {
    const linearWithWaste = agg.total_linear_joints_lm * (1 + c.MEMBRANE_OVERLAP_WASTE);
    const membraneRolls = Math.ceil(linearWithWaste / c.MEMBRANE_ROLL_LENGTH_M);
    const membraneCost = membraneRolls * c.MEMBRANE_ROLL_PRICE;

    const liquidAreaSqm = linearWithWaste * c.MEMBRANE_ROLL_WIDTH_M;
    const liquidLitres = Math.ceil(liquidAreaSqm * c.LIQUID_PLASTIC_L_PER_SQM);
    const liquidDrums = ceilDrums20L(liquidLitres);
    const liquidCost = liquidDrums * c.LIQUID_PLASTIC_20L_PRICE;

    materialCost += membraneCost + liquidCost;
    laborHours += agg.total_linear_joints_lm * c.MEMBRANE_LABOR_HRS_PER_LM;

    lineItems.push({
      id: "sbp-membrane",
      description: "SBP membrane rolls (ridges/hips/parapets)",
      quantity: membraneRolls,
      unit: "rolls",
      cost_zar: membraneCost,
    });
    lineItems.push({
      id: "liquid-plastic",
      description: "Liquid plastic waterproofing",
      quantity: liquidLitres,
      unit: "L",
      cost_zar: liquidCost,
    });
  }

  if (services.alkali_primer && agg.net_plaster_area_sqm > 0) {
    const primerL = ceilLitresFromSqm(
      agg.net_plaster_area_sqm,
      c.PRIMER_SPREADING_RATE_SQM_L,
      1,
      c.PRIMER_WASTE,
    );
    const drums = ceilDrums20L(primerL);
    const cost = drums * c.PRIMER_20L_PRICE;
    materialCost += cost;
    laborHours += agg.net_plaster_area_sqm * c.PRIMER_LABOR_HRS_PER_SQM;

    lineItems.push({
      id: "plaster-primer",
      description: "Alkali-resistant plaster primer",
      quantity: primerL,
      unit: "L",
      cost_zar: cost,
    });
  }

  if (services.crack_remediation && agg.net_plaster_area_sqm > 0) {
    const fillerKg = agg.net_plaster_area_sqm * c.CRACK_FILLER_KG_PER_SQM;
    const cost = Math.round(fillerKg * c.FILLER_PRICE_KG);
    materialCost += cost;
    laborHours += agg.net_plaster_area_sqm * c.PREP_LABOR_HRS_PER_SQM;

    lineItems.push({
      id: "crack-fill",
      description: "Baseline crack filler (0.05 kg/m²)",
      quantity: Math.round(fillerKg * 10) / 10,
      unit: "kg",
      cost_zar: cost,
    });
  }

  if (services.acrylic_topcoat && agg.net_plaster_area_sqm > 0) {
    const paintL = ceilLitresFromSqm(
      agg.net_plaster_area_sqm,
      c.TOPCOAT_SPREADING_SQM_L,
      c.TOPCOAT_COATS,
      c.TOPCOAT_WASTE,
    );
    const drums = ceilDrums20L(paintL);
    const cost = drums * c.PAINT_20L_PRICE;
    materialCost += cost;
    laborHours += agg.net_plaster_area_sqm * c.WALL_LABOR_HRS_PER_SQM;

    lineItems.push({
      id: "acrylic-topcoat",
      description: `Acrylic topcoat (${c.TOPCOAT_COATS} coats)`,
      quantity: paintL,
      unit: "L",
      cost_zar: cost,
    });
  }

  const laborCost = laborHours * labor.blended_hourly_rate;
  if (laborHours > 0) {
    lineItems.push({
      id: "labor",
      description: `Labour (${Math.round(laborHours * 10) / 10} man-hours)`,
      quantity: Math.round(laborHours * 10) / 10,
      unit: "h",
      cost_zar: Math.round(laborCost),
    });
  }

  const baseCost = materialCost + laborCost;
  const profitMargin = profitMarginPct / 100;
  const profitZar = Math.round(baseCost * profitMargin);
  const totalQuote = baseCost + profitZar;

  const crewDays =
    laborHours / (labor.allocated_crew_size * labor.standard_shift_hours);

  return {
    multiplier_count: agg.multiplier_count,
    aggregated: {
      net_plaster_area_sqm: Math.round(agg.net_plaster_area_sqm * 10) / 10,
      net_wall_area_sqm: Math.round(agg.net_wall_area_sqm * 10) / 10,
      roof_surface_area_sqm: Math.round(agg.roof_surface_area_sqm * 10) / 10,
      total_linear_joints_lm: Math.round(agg.total_linear_joints_lm * 10) / 10,
      total_labor_hours: Math.round(laborHours * 10) / 10,
      crew_days: Math.round(crewDays * 10) / 10,
    },
    line_items: lineItems,
    base_cost_zar: Math.round(baseCost),
    profit_zar: profitZar,
    total_quote_zar: Math.round(totalQuote),
    profit_margin_pct: profitMarginPct,
  };
}
