import { Router } from "express";
import crypto from "node:crypto";
import { verifyWhatsAppChallenge, verifyWhatsAppWebhook } from "../providers/whatsapp.js";
import { verifyMetaChallenge, verifyMetaWebhook } from "../providers/meta.js";
import { verifyTikTokWebhook } from "../providers/tiktok.js";
import { saveWebhookEvent } from "../db.js";

function parseRawBody(request) {
  return Buffer.isBuffer(request.body) ? request.body : Buffer.from(JSON.stringify(request.body || {}));
}

async function acceptWebhook(request, response, provider, verifier) {
  const rawBody = parseRawBody(request);
  if (!verifier(request, rawBody)) return response.status(401).json({ error: "invalid_webhook_signature" });
  const payload = JSON.parse(rawBody.toString("utf8"));
  const eventId = request.get("x-event-id") || payload.id || payload.event_id || payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id || crypto.createHash("sha256").update(rawBody).digest("hex");
  if (!eventId) return response.status(400).json({ error: "missing_provider_event_id" });
  const result = await saveWebhookEvent(provider, String(eventId), payload);
  response.status(202).json({ accepted: true, duplicate: !result.inserted, eventId: String(eventId) });
}

export function createWebhookRouter() {
  const router = Router();
  router.get("/whatsapp", (request, response) => {
    const challenge = verifyWhatsAppChallenge(request);
    return challenge ? response.status(200).send(challenge) : response.status(403).send("forbidden");
  });
  router.post("/whatsapp", (request, response) => acceptWebhook(request, response, "whatsapp", verifyWhatsAppWebhook));
  router.get("/meta", (request, response) => {
    const challenge = verifyMetaChallenge(request);
    return challenge ? response.status(200).send(challenge) : response.status(403).send("forbidden");
  });
  router.post("/meta", (request, response) => acceptWebhook(request, response, "meta", verifyMetaWebhook));
  router.post("/tiktok", (request, response) => acceptWebhook(request, response, "tiktok", verifyTikTokWebhook));
  return router;
}
