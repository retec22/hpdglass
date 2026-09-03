import { Router } from "express";
import { createAdminUser, createMessage, createQuote, listAllMessages, listAllQuotes, listMessages, listQuotes, listUsers } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { z } from "zod";

const quoteSchema = z.object({ title: z.string().trim().min(2).max(180), details: z.string().trim().min(2).max(10000) }).strict();
const messageSchema = z.object({ body: z.string().trim().min(1).max(5000), recipient_id: z.number().int().positive().optional(), quote_id: z.number().int().positive().optional() }).strict();
const adminUserSchema = z.object({ email: z.string().trim().email().max(320), password: z.string().min(10).max(200), name: z.string().trim().min(2).max(160), company: z.string().trim().max(200).optional(), tax_id: z.string().trim().max(32).optional(), phone: z.string().trim().max(64).optional(), role: z.enum(["cliente", "admin"]).default("cliente") }).strict();

export function createPortalRouter() {
  const router = Router();
  router.use(requireAuth);
  router.get("/quotes", async (request, response, next) => { try { response.json({ quotes: await listQuotes(request.user.id) }); } catch (error) { next(error); } });
  router.post("/quotes", async (request, response, next) => { try { const parsed = quoteSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_quote" }); response.status(201).json({ quote: await createQuote(request.user.id, parsed.data) }); } catch (error) { next(error); } });
  router.get("/messages", async (request, response, next) => { try { response.json({ messages: await listMessages(request.user.id) }); } catch (error) { next(error); } });
  router.post("/messages", async (request, response, next) => { try { const parsed = messageSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_message" }); response.status(201).json({ message: await createMessage(request.user.id, parsed.data) }); } catch (error) { next(error); } });
  router.get("/admin/messages", async (request, response, next) => { try { if (request.user.role !== "admin") return response.status(403).json({ error: "admin_access_required" }); response.json({ messages: await listAllMessages() }); } catch (error) { next(error); } });
  router.get("/admin/quotes", async (request, response, next) => { try { if (request.user.role !== "admin") return response.status(403).json({ error: "admin_access_required" }); response.json({ quotes: await listAllQuotes() }); } catch (error) { next(error); } });
  router.get("/admin/users", async (request, response, next) => { try { if (request.user.role !== "admin") return response.status(403).json({ error: "admin_access_required" }); response.json({ users: await listUsers() }); } catch (error) { next(error); } });
  router.post("/admin/users", async (request, response, next) => { try { if (request.user.role !== "admin") return response.status(403).json({ error: "admin_access_required" }); const parsed = adminUserSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_admin_user" }); response.status(201).json({ user: await createAdminUser(parsed.data) }); } catch (error) { next(error); } });
  return router;
}