import pg from "pg";
import { demoProjects } from "./demo-data.js";

const { Pool } = pg;
let pool;
let memoryProjects = demoProjects.map((project) => ({ ...project }));

function getPool() {
  if (!process.env.DATABASE_URL) throw Object.assign(new Error("database_not_configured"), { statusCode: 503 });
  pool ||= new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined, max: 10 });
  return pool;
}

export async function saveWebhookEvent(provider, providerEventId, payload) {
  if (!process.env.DATABASE_URL) {
    return { inserted: true, id: null };
  }

  const result = await getPool().query(
    `INSERT INTO webhook_events (provider, provider_event_id, payload)
     VALUES ($1, $2, $3::jsonb)
     ON CONFLICT (provider, provider_event_id) DO NOTHING
     RETURNING id`,
    [provider, providerEventId, JSON.stringify(payload)]
  );
  return { inserted: result.rowCount === 1, id: result.rows[0]?.id || null };
}

export async function saveLead(lead) {
  if (!process.env.DATABASE_URL) {
    return { inserted: true, id: `demo-${Date.now()}` };
  }

  const result = await getPool().query(
    `INSERT INTO leads (source, external_id, name, company, email, phone, product, need, project, location, stage, area, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     ON CONFLICT (source, external_id) DO NOTHING
     RETURNING id`,
    [lead.source, lead.external_id || null, lead.name, lead.company, lead.email, lead.phone, lead.product || null, lead.need || null, lead.project || null, lead.location || null, lead.stage || null, lead.area || null, lead.description || null]
  );
  return { inserted: result.rowCount === 1, id: result.rows[0]?.id || null };
}

export async function listProjects() {
  if (!process.env.DATABASE_URL) {
    return memoryProjects.map((project) => ({ ...project }));
  }

  const result = await getPool().query(
    `SELECT id, name, client, location, stage, progress, value_cents, scope, image_url, created_at, updated_at
     FROM projects ORDER BY updated_at DESC`
  );
  return result.rows;
}

export async function createProject(project) {
  if (!process.env.DATABASE_URL) {
    const item = {
      id: `local-${Date.now()}`,
      name: project.name,
      client: project.client || "Cliente",
      location: project.location || "Lima, Perú",
      stage: project.stage || "preventa",
      progress: Number(project.progress || 0),
      value_cents: Number(project.value_cents || 0),
      scope: project.scope || "Proyecto registrado desde el dashboard local.",
      image_url: project.image_url || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryProjects = [item, ...memoryProjects.filter((entry) => entry.id !== item.id)];
    return item;
  }

  const result = await getPool().query(
    `INSERT INTO projects (name, client, location, stage, progress, value_cents, scope, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, name, client, location, stage, progress, value_cents, scope, image_url, created_at, updated_at`,
    [project.name, project.client || null, project.location || null, project.stage, project.progress, project.value_cents, project.scope || null, project.image_url || null]
  );
  return result.rows[0];
}

export async function closeDatabase() {
  if (pool) await pool.end();
}
