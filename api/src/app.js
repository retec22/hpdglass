import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { requestContext } from "./middleware/request-context.js";
import { errorHandler } from "./middleware/error-handler.js";
import { createWebhookRouter } from "./routes/webhooks.js";
import { createHealthRouter } from "./routes/health.js";
import { createLeadRouter } from "./routes/leads.js";
import { createProjectRouter } from "./routes/projects.js";
import { requireAuth } from "./middleware/auth.js";
import { buildDashboardSummary, demoProjects } from "./demo-data.js";
import { listProjects } from "./db.js";

function withOptionalAuth(request, response, next) {
  if (!process.env.JWT_SECRET || !request.headers.authorization) return next();
  return requireAuth(request, response, next);
}

export function createApp() {
  const app = express();
  const origins = (process.env.CORS_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean);

  app.disable("x-powered-by");
  if (process.env.TRUST_PROXY) app.set("trust proxy", Number(process.env.TRUST_PROXY));
  app.use(requestContext);
  app.use(helmet({ contentSecurityPolicy: true, referrerPolicy: { policy: "strict-origin-when-cross-origin" } }));
  app.use(cors({ origin: origins.length ? origins : false, credentials: true, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));
  app.use("/api/webhooks", express.raw({ type: "application/json", limit: "256kb" }), createWebhookRouter());
  app.use(express.json({ limit: "256kb" }));
  app.use("/api/leads", createLeadRouter());
  app.use("/api/projects", withOptionalAuth, createProjectRouter());
  app.use("/api/health", createHealthRouter());
  app.get("/api/dashboard/summary", async (request, response, next) => {
    try {
    if (process.env.JWT_SECRET && request.headers.authorization) {
      return requireAuth(request, response, () => {
        listProjects().then(projects => response.json({ ok: true, summary: buildDashboardSummary(projects), source: "secure" })).catch(next);
      });
    }

    const projects = process.env.DATABASE_URL ? await listProjects() : demoProjects;
    response.json({ ok: true, summary: buildDashboardSummary(projects), source: process.env.DATABASE_URL ? "database" : "demo" });
    } catch (error) {
      next(error);
    }
  });
  if (process.env.SERVE_STATIC === "true") {
    app.use(express.static(path.resolve(process.cwd()), { index: "index.html" }));
  }
  app.use(errorHandler);
  return app;
};
