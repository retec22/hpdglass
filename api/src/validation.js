import { z } from "zod";

export const leadSchema = z.object({
  source: z.string().trim().min(1).max(32).default("website"),
  external_id: z.string().trim().max(255).optional(),
  name: z.string().trim().min(2).max(160),
  company: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(64),
  product: z.string().trim().max(120).optional(),
  need: z.string().trim().max(120).optional(),
  project: z.string().trim().max(240).optional(),
  location: z.string().trim().max(240).optional(),
  stage: z.string().trim().max(80).optional(),
  area: z.string().trim().max(80).optional(),
  description: z.string().trim().max(10000).optional()
}).strict();

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(180),
  client: z.string().trim().max(180).optional(),
  location: z.string().trim().max(180).optional(),
  stage: z.enum(["preventa", "diseno", "fabricacion", "instalacion", "cerrado"]).default("preventa"),
  progress: z.number().int().min(0).max(100).default(0),
  value_cents: z.number().int().min(0).default(0),
  scope: z.string().trim().max(10000).optional(),
  image_url: z.preprocess(value => value === "" ? undefined : value, z.string().url().max(2000).optional())
}).strict();

export const projectFormSchema = projectSchema.omit({ image_url: true }).extend({
  image_url: z.string().url().max(2000).optional()
});

export const registerSchema = z.object({ email: z.string().trim().email().max(320), password: z.string().min(10).max(200), name: z.string().trim().min(2).max(160), company: z.string().trim().max(200).optional(), tax_id: z.string().trim().max(32).optional(), phone: z.string().trim().max(64).optional() }).strict();
export const loginSchema = z.object({ email: z.string().trim().email().max(320), password: z.string().min(1).max(200) }).strict();
export const profileSchema = registerSchema.omit({ email: true, password: true }).strict();
