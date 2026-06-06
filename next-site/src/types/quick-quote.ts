import type { ProductTierId } from "@/lib/estimation-engine";

export type SurfaceCondition = "new_build" | "previously_painted" | "degraded";

export type RoofTypeId = "simple_pitch" | "hip" | "flat_parapet";

export type ExteriorServiceId =
  | "wall_paint"
  | "wall_primer"
  | "crack_fill"
  | "roof_paint"
  | "roof_waterproofing";

export type OpeningSpec = {
  count: number;
  widthM: number;
  heightM: number;
};

export type UnitSpec = {
  lengthM: number;
  widthM: number;
  heightM: number;
  /** 0–100: share of wall area that is cement/plaster (paintable). Rest is facebrick. */
  cementPercent: number;
  roofType: RoofTypeId;
  roofPitchDeg: number;
  roofOverhangMm: number;
  windows: OpeningSpec;
  doors: OpeningSpec;
  services: Record<ExteriorServiceId, boolean>;
  condition: SurfaceCondition;
  /** Hairline crack fill — linear metres per unit */
  crackLinearM: number;
  wallCoats: number;
  roofCoats: number;
};

export type ManualLineItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCostZAR: number;
  /** When set, overrides cost × qty for sell price */
  unitPriceZAR?: number;
};

export type QuickQuoteJob = {
  jobRef: string;
  clientName: string;
  schemeName: string;
  unitCount: number;
  unitLabel: string;
  unitSpec: UnitSpec;
  productTier: ProductTierId;
  crewSize: 1 | 2 | 3 | 4;
  manualLineItems: ManualLineItem[];
  disabledLineItemIds: string[];
};

export type QuoteLineItem = {
  id: string;
  category: "materials" | "labour" | "other";
  description: string;
  quantity: number;
  unit: string;
  unitCostZAR: number;
  totalCostZAR: number;
  totalPriceZAR: number;
  laborHours: number;
  auto: boolean;
  perUnit: boolean;
};

export type UnitTakeoff = {
  grossWallSqm: number;
  openingsSqm: number;
  paintableWallSqm: number;
  roofPlanSqm: number;
  roofSlopeSqm: number;
  membraneLinearM: number;
  windowDoorPerimeterM: number;
};

export type QuickQuoteResult = {
  takeoff: UnitTakeoff;
  lineItems: QuoteLineItem[];
  perUnit: {
    materialCostZAR: number;
    laborCostZAR: number;
    laborHours: number;
    subtotalZAR: number;
    profitZAR: number;
    totalZAR: number;
  };
  project: {
    materialCostZAR: number;
    laborCostZAR: number;
    laborHours: number;
    calendarDays: number;
    subtotalZAR: number;
    profitZAR: number;
    totalZAR: number;
  };
};
