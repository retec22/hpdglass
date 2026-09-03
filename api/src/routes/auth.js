import { Router } from "express";
import { SignJWT } from "jose";
import { createUser, findUserByEmail, getUserById, updateUser, verifyPassword } from "../db.js";
import { loginSchema, profileSchema, registerSchema } from "../validation.js";
import { requireAuth } from "../middleware/auth.js";

function tokenFor(user) {
  return new SignJWT({ role: user.role, email: user.email }).setProtectedHeader({ alg: "HS256" }).setSubject(String(user.id)).setIssuer(process.env.JWT_ISSUER).setAudience(process.env.JWT_AUDIENCE).setIssuedAt().setExpirationTime("8h").sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

export function createAuthRouter() {
  const router = Router();
  router.post("/register", async (request, response, next) => { try { const parsed = registerSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_registration" }); const user = await createUser(parsed.data); response.status(201).json({ user, token: await tokenFor(user) }); } catch (error) { next(error); } });
  router.post("/login", async (request, response, next) => { try { const parsed = loginSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_login" }); const user = await findUserByEmail(parsed.data.email); if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) return response.status(401).json({ error: "invalid_credentials" }); response.json({ user, token: await tokenFor(user) }); } catch (error) { next(error); } });
  router.get("/me", requireAuth, async (request, response, next) => { try { response.json({ user: await getUserById(request.user.id) }); } catch (error) { next(error); } });
  router.put("/me", requireAuth, async (request, response, next) => { try { const parsed = profileSchema.safeParse(request.body); if (!parsed.success) return response.status(422).json({ error: "invalid_profile" }); response.json({ user: await updateUser(request.user.id, parsed.data) }); } catch (error) { next(error); } });
  return router;
}