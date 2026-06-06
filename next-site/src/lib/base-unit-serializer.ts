import type { BaseUnitObject } from "@/types/visual-quote";

/**
 * Serialize the validated Base Unit Object for API submission.
 * Contains geometry + services only — no canvas pixels or Three.js state.
 */
export function serializeBaseUnitObject(unit: BaseUnitObject): string {
  return JSON.stringify(unit, null, 2);
}

export function parseBaseUnitObject(json: string): BaseUnitObject {
  return JSON.parse(json) as BaseUnitObject;
}
