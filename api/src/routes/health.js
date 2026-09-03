import { Router } from "express";
import { isTikTokConfigured } from "../providers/tiktok.js";

export function createHealthRouter() {
  const router = Router();
  router.get("/", (_request, response) => response.json({
    status: "ok",
    providers: {
      whatsapp: Boolean(process.env.META_APP_SECRET && process.env.WHATSAPP_ACCESS_TOKEN),
      meta: Boolean(process.env.META_APP_SECRET),
      tiktok: isTikTokConfigured()
    }
  }));
  return router;
}
