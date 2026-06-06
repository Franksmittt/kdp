import { z } from "zod";

/** Zod validation for Base Unit Object — blueprint JSON schema */

const pointSchema = z.object({ x: z.number(), y: z.number() });

const wallFinishSchema = z.object({
  facebrick_ratio: z.number().min(0).max(1),
  plaster_ratio: z.number().min(0).max(1),
});

const wallSchema = z.object({
  wall_id: z.string(),
  length_m: z.number().nonnegative(),
  height_m: z.number().positive(),
  gross_area_sqm: z.number().nonnegative(),
  apertures_area_sqm: z.number().nonnegative(),
  net_area_sqm: z.number().nonnegative(),
  finishes: wallFinishSchema,
});

const linearJointsSchema = z.object({
  ridges_lm: z.number().nonnegative(),
  hips_lm: z.number().nonnegative(),
  valleys_lm: z.number().nonnegative(),
  parapets_lm: z.number().nonnegative(),
});

const roofSchema = z.object({
  structural_style: z.enum(["gable", "hip", "flat"]),
  pitch_degrees: z.number().min(0).max(60),
  pitch_factor: z.number().positive(),
  overhang_m: z.number().nonnegative(),
  surface_area_sqm: z.number().nonnegative(),
  linear_joints: linearJointsSchema,
});

const footprintSchema = z.object({
  area_sqm: z.number().nonnegative(),
  perimeter_lm: z.number().nonnegative(),
  vertices: z.array(pointSchema).min(3),
  offset_vertices: z.array(pointSchema).optional(),
});

const geometrySchema = z.object({
  footprint: footprintSchema,
  walls: z.array(wallSchema),
  wall_height_m: z.number().positive(),
  net_plaster_area_sqm: z.number().nonnegative(),
  net_wall_area_sqm: z.number().nonnegative(),
  total_aperture_area_sqm: z.number().nonnegative(),
  roof: roofSchema,
});

const servicesSchema = z.object({
  waterproofing_membrane: z.boolean(),
  alkali_primer: z.boolean(),
  crack_remediation: z.boolean(),
  acrylic_topcoat: z.boolean(),
});

const laborSchema = z.object({
  allocated_crew_size: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
  standard_shift_hours: z.number().positive().default(8),
  blended_hourly_rate: z.number().positive(),
});

export const baseUnitObjectSchema = z.object({
  base_unit_id: z.string(),
  project_reference: z.string(),
  geometry: geometrySchema,
  services_requested: servicesSchema,
  labor_parameters: laborSchema,
  facade_plaster_ratio: z.number().min(0).max(1),
});

export const quoteCalculateRequestSchema = z.object({
  base_unit: baseUnitObjectSchema,
  multiplier_count: z.number().int().min(1).max(9999),
  profit_margin_pct: z.number().min(0).max(100).default(18),
});

export type QuoteCalculateRequest = z.infer<typeof quoteCalculateRequestSchema>;
export type BaseUnitObjectValidated = z.infer<typeof baseUnitObjectSchema>;
