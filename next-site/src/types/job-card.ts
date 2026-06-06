import type { EstimationInput, EstimationResult, ProductTierId } from "@/lib/estimation-engine";

/** Meteorological log — application blocked outside 10°C–40°C */
export type WeatherLogEntry = {
  recordedAt: string;
  ambientTempC: number;
  humidityPct: number;
  applicationPermitted: boolean;
  notes?: string;
};

/** Material telemetry — decanted vs estimated */
export type MaterialTelemetry = {
  productSku: string;
  estimatedLiters: number;
  decantedLiters: number;
  emptyDrums20L: number;
  variancePct: number;
  alertThresholdPct: number;
};

/** Daily labour vs BIBC benchmark */
export type LaborTelemetry = {
  date: string;
  workerCount: number;
  hoursLogged: number;
  benchmarkHours: number;
  prepLinearMCompleted: number;
  topcoatSqmCompleted: number;
  marginBleedFlag: boolean;
};

/** Change order — reruns substrate matrix on scope creep */
export type ChangeOrder = {
  id: string;
  createdAt: string;
  description: string;
  additionalAreaSqm: number;
  additionalCrackLm: number;
  revisedEstimation: EstimationResult;
  clientApproved: boolean;
};

export type JobCardStatus =
  | "lead"
  | "quoted"
  | "approved"
  | "mobilised"
  | "in_progress"
  | "snagged"
  | "handover"
  | "closed";

/** Digital back-office job card — mirrors Prisma JobCard model */
export type JobCard = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: JobCardStatus;

  /** Lead / client */
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  organisation?: string;
  estateSlug: string;
  suburb: string;

  /** STSMA context */
  mrrpStatus: string;
  pmr22PhaseMonths: number;
  selectedTier: ProductTierId;

  /** Frozen estimation snapshot at quote acceptance */
  estimationInput: EstimationInput;
  estimationResult: EstimationResult;

  /** Live field telemetry */
  materialTelemetry: MaterialTelemetry[];
  laborTelemetry: LaborTelemetry[];
  weatherLogs: WeatherLogEntry[];
  changeOrders: ChangeOrder[];

  /** QA handover */
  qaMoistureReadings?: { location: string; valuePct: number; sansCompliant: boolean }[];
  qaDftMicrons?: { location: string; microns: number }[];
};

export function createJobCardFromLead(params: {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  organisation?: string;
  estateSlug: string;
  mrrpStatus: string;
  estimationInput: EstimationInput;
  estimationResult: EstimationResult;
  selectedTier: ProductTierId;
}): JobCard {
  const now = new Date().toISOString();
  const tierBreakdown = params.estimationResult.tiers.find(
    (t) => t.tier === params.selectedTier,
  );

  return {
    id: params.id,
    createdAt: now,
    updatedAt: now,
    status: "lead",
    clientName: params.clientName,
    clientEmail: params.clientEmail,
    clientPhone: params.clientPhone,
    organisation: params.organisation,
    estateSlug: params.estateSlug,
    suburb: params.estateSlug,
    mrrpStatus: params.mrrpStatus,
    pmr22PhaseMonths: tierBreakdown?.phasedMonths ?? 24,
    selectedTier: params.selectedTier,
    estimationInput: params.estimationInput,
    estimationResult: params.estimationResult,
    materialTelemetry: [],
    laborTelemetry: [],
    weatherLogs: [],
    changeOrders: [],
  };
}

/** Flag material variance > threshold (default 12%) */
export function materialVarianceAlert(
  estimated: number,
  decanted: number,
  thresholdPct = 12,
): MaterialTelemetry {
  const variancePct =
    estimated > 0 ? ((decanted - estimated) / estimated) * 100 : 0;
  return {
    productSku: "topcoat",
    estimatedLiters: estimated,
    decantedLiters: decanted,
    emptyDrums20L: Math.floor(decanted / 20),
    variancePct: Math.round(variancePct * 10) / 10,
    alertThresholdPct: thresholdPct,
  };
}

/** Weather gate — Plascon Micatex / primer application window */
export function isApplicationPermitted(ambientTempC: number): boolean {
  return ambientTempC >= 10 && ambientTempC <= 40;
}
