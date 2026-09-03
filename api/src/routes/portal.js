import { Router } from "express";
import { createMessage, createQuote, listMessages, listQuotes } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { z } from "zod";

const quoteSchema = z.object({ title: z.string().trim().min(2).max(180), details: z.string().trim().min(2).max(10000) }).strict();
const messageSchema = z.object({ body: z.string().trim().min(1).max(5000), recipient_id: z.number().int().positive().optional(), quote_id: z.number().int().positive().optional() }).strict();

export function createPortalRouter() {
  const router = Router();
  router.use(requireAuth);
  router.get("/quotes", async (request, response, next) => { try { response.json({ quotes: await listQuotes(request.user.id) }); } catch (error) { next(error); } });
  router.post("/quotes", async (request, response, next) => { try { const parsed = quoteSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_quote" }); response.status(201).json({ quote: await createQuote(request.user.id, parsed.data) }); } catch (error) { next(error); } });
  router.get("/messages", async (request, response, next) => { try { response.json({ messages: await listMessages(request.user.id) }); } catch (error) { next(error); } });
  router.post("/messages", async (request, response, next) => { try { const parsed = messageSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_message" }); response.status(201).json({ message: await createMessage(request.user.id, parsed.data) }); } catch (error) { next(error); } });
  return router;
}