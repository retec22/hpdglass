import { Router } from "express";
import { leadSchema } from "../validation.js";
import { saveLead } from "../db.js";

export function createLeadRouter() {
  const router = Router();
  router.post("/", async (request, response) => {
    const parsed = leadSchema.safeParse(request.body);
    if (!parsed.success) return response.status(422).json({ error: "invalid_lead_payload", details: parsed.error.flatten().fieldErrors, requestId: request.requestId });
    const lead = await saveLead(parsed.data);
    response.status(201).json({ accepted: true, duplicate: !lead.inserted, leadId: lead.id, requestId: request.requestId });
  });
  return router;
}
