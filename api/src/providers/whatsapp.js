import { verifyMetaSignature } from "./signature.js";

export function verifyWhatsAppWebhook(request, rawBody) {
  return verifyMetaSignature(rawBody, request.get("x-hub-signature-256"), process.env.META_APP_SECRET);
}

export function verifyWhatsAppChallenge(request) {
  const query = request.query;
  return query["hub.mode"] === "subscribe" && query["hub.verify_token"] === process.env.WEBHOOK_VERIFY_TOKEN ? query["hub.challenge"] : null;
}
