import { verifyTikTokSignature } from "./signature.js";

export function verifyTikTokWebhook(request, rawBody) {
  const signature = request.get("tiktok-signature") || request.get("x-tt-signature");
  return verifyTikTokSignature(rawBody, signature, process.env.TIKTOK_WEBHOOK_SECRET);
}

export function isTikTokConfigured() {
  return Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET && process.env.TIKTOK_WEBHOOK_SECRET);
}
