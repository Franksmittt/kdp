"use server";

import { BUSINESS } from "@/config/site";
import {
  defaultEstimationInputFromWizard,
  runEstimation,
  type EstimationResult,
  type SubstrateProfileId,
} from "@/lib/estimation-engine";
import { createJobCardFromLead } from "@/types/job-card";

export type EstimatorPayload = {
  estate: string;
  scale: string;
  substrate: SubstrateProfileId;
  painPoints: string[];
  mrrpStatus: string;
  name: string;
  email: string;
  phone: string;
  organisation?: string;
  wallAreaSqm?: number;
  crackLinearM?: number;
  selectedTier: "tier1" | "tier2" | "tier3";
  estimationResult?: EstimationResult;
};

export type EstimatorResult =
  | { ok: true; message: string; jobCardId: string }
  | { ok: false; error: string };

export async function submitEstimatorLead(
  data: EstimatorPayload,
): Promise<EstimatorResult> {
  if (!data.name?.trim() || !data.email?.trim() || !data.phone?.trim()) {
    return { ok: false, error: "Name, email, and phone are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const estimationInput = defaultEstimationInputFromWizard({
    scale: data.scale,
    substrate: data.substrate,
    painPoints: data.painPoints,
    wallAreaSqm: data.wallAreaSqm,
    crackLinearM: data.crackLinearM,
  });

  const estimationResult = data.estimationResult ?? runEstimation(estimationInput);

  const jobCardId = `jc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const jobCard = createJobCardFromLead({
    id: jobCardId,
    clientName: data.name.trim(),
    clientEmail: data.email.trim(),
    clientPhone: data.phone.trim(),
    organisation: data.organisation?.trim(),
    estateSlug: data.estate,
    mrrpStatus: data.mrrpStatus,
    estimationInput,
    estimationResult,
    selectedTier: data.selectedTier,
  });

  console.info("[PMR22 Estimator Lead + JobCard]", {
    jobCardId,
    client: data.email,
    estate: data.estate,
    tier: data.selectedTier,
    totalZAR: estimationResult.tiers.find((t) => t.tier === data.selectedTier)?.totalZAR,
    jobCard,
    notify: BUSINESS.email,
  });

  return {
    ok: true,
    jobCardId,
    message:
      "Thank you — Rico will send your phased maintenance timeline and tiered capital forecast within one business day.",
  };
}
