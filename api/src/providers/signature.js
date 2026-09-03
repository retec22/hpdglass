import crypto from "node:crypto";

function safeEqual(left, right) {
  const a = Buffer.from(left || "", "utf8");
  const b = Buffer.from(right || "", "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifyMetaSignature(rawBody, signature, appSecret) {
  if (!appSecret || !signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  return safeEqual(expected, signature);
}

export function verifyTikTokSignature(rawBody, signature, secret) {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature.replace(/^sha256=/, ""));
}
