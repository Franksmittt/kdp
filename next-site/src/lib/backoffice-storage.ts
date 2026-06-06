import {
  BACKOFFICE_ENGINE_KEY,
  BACKOFFICE_SESSION_KEY,
} from "@/config/backoffice";
import {
  DEFAULT_ENGINE_OVERRIDES,
  type EngineOverrides,
  type ProductTierId,
} from "@/lib/estimation-engine";

export type StoredEngineOverrides = {
  bibcHourlyRateZAR: number;
  tier1DrumPrice: number;
  tier2DrumPrice: number;
  tier3DrumPrice: number;
  consumablesMarkupPct: number;
  profitMarginPct: number;
};

export const DEFAULT_STORED_OVERRIDES: StoredEngineOverrides = {
  bibcHourlyRateZAR: DEFAULT_ENGINE_OVERRIDES.bibcHourlyRateZAR,
  tier1DrumPrice: DEFAULT_ENGINE_OVERRIDES.tierDrumPrices.tier1,
  tier2DrumPrice: DEFAULT_ENGINE_OVERRIDES.tierDrumPrices.tier2,
  tier3DrumPrice: DEFAULT_ENGINE_OVERRIDES.tierDrumPrices.tier3,
  consumablesMarkupPct: Math.round(
    DEFAULT_ENGINE_OVERRIDES.consumablesMarkup * 100,
  ),
  profitMarginPct: Math.round(DEFAULT_ENGINE_OVERRIDES.profitMargin * 100),
};

export function isBackofficeAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(BACKOFFICE_SESSION_KEY) === "verified";
}

export function setBackofficeSession(): void {
  localStorage.setItem(BACKOFFICE_SESSION_KEY, "verified");
}

export function clearBackofficeSession(): void {
  localStorage.removeItem(BACKOFFICE_SESSION_KEY);
}

export function loadEngineOverrides(): StoredEngineOverrides {
  if (typeof window === "undefined") return DEFAULT_STORED_OVERRIDES;
  try {
    const raw = localStorage.getItem(BACKOFFICE_ENGINE_KEY);
    if (!raw) return DEFAULT_STORED_OVERRIDES;
    return { ...DEFAULT_STORED_OVERRIDES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORED_OVERRIDES;
  }
}

export function saveEngineOverrides(overrides: StoredEngineOverrides): void {
  localStorage.setItem(BACKOFFICE_ENGINE_KEY, JSON.stringify(overrides));
}

export function toEngineOverrides(
  stored: StoredEngineOverrides,
): EngineOverrides {
  const tierDrumPrices: Partial<Record<ProductTierId, number>> = {
    tier1: stored.tier1DrumPrice,
    tier2: stored.tier2DrumPrice,
    tier3: stored.tier3DrumPrice,
  };

  return {
    bibcHourlyRateZAR: stored.bibcHourlyRateZAR,
    tierDrumPrices,
    consumablesMarkup: stored.consumablesMarkupPct / 100,
    profitMargin: stored.profitMarginPct / 100,
  };
}
