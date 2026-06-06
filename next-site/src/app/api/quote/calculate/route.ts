import { NextResponse } from "next/server";
import {
  aggregateGeometry,
  calculateMaterialsAndLabor,
} from "@/lib/material-labor-engine";
import { quoteCalculateRequestSchema } from "@/lib/quote-schema";

/**
 * POST /api/quote/calculate
 *
 * Accepts Base Unit Object + multiplier_count.
 * Multiplies raw geometry FIRST, then runs material/labor algorithms
 * with ceiling functions on aggregated totals (blueprint mandate).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteCalculateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { base_unit, multiplier_count, profit_margin_pct } = parsed.data;

    const aggregated = aggregateGeometry(base_unit.geometry, multiplier_count);
    const result = calculateMaterialsAndLabor(
      aggregated,
      base_unit.services_requested,
      base_unit.labor_parameters,
      profit_margin_pct,
    );

    return NextResponse.json({
      success: true,
      project_reference: base_unit.project_reference,
      base_unit_id: base_unit.base_unit_id,
      quote: result,
    });
  } catch (err) {
    console.error("[quote/calculate]", err);
    return NextResponse.json(
      { error: "Quote calculation failed" },
      { status: 500 },
    );
  }
}
