import pg from "pg";
import { v2 as cloudinary } from "cloudinary";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const { Pool } = pg;
let pool;
let memoryProjects = [];

function getCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw Object.assign(new Error("cloudinary_not_configured"), { statusCode: 503 });
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  return cloudinary;
}

export async function uploadProjectImage(file) {
  if (!file?.buffer) throw Object.assign(new Error("image_required"), { statusCode: 422 });
  const client = getCloudinary();
  return new Promise((resolve, reject) => {
    const upload = client.uploader.upload_stream({
      folder: "hpdglass/projects",
      resource_type: "image",
      transformation: [{ width: 1600, height: 1000, crop: "fill", gravity: "auto", quality: "auto", fetch_format: "auto" }]
    }, (error, result) => error ? reject(error) : resolve(result.secure_url));
    upload.end(file.buffer);
  });
}

function getPool() {
  if (!process.env.DATABASE_URL) throw Object.assign(new Error("database_not_configured"), { statusCode: 503 });
  pool ||= new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined, max: 10 });
  return pool;
}

export async function runMigrations() {
  if (!process.env.DATABASE_URL) return;
  const database = getPool();
  await database.query("CREATE TABLE IF NOT EXISTS schema_migrations (filename VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  const migrationDirectory = path.resolve(process.cwd(), "api/migrations");
  const filenames = (await fs.readdir(migrationDirectory)).filter(filename => /^\d+_.*\.sql$/.test(filename)).sort();
  for (const filename of filenames) {
    const applied = await database.query("SELECT 1 FROM schema_migrations WHERE filename=$1", [filename]);
    if (applied.rowCount) continue;
    const sql = await fs.readFile(path.join(migrationDirectory, filename), "utf8");
    await database.query("BEGIN");
    try {
      await database.query(sql);
      await database.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
      await database.query("COMMIT");
      console.log(`Applied migration ${filename}`);
    } catch (error) {
      await database.query("ROLLBACK");
      throw error;
    }
  }
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
    return { inserted: true, id: `local-${Date.now()}` };
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

export async function updateProject(id, project) {
  if (!process.env.DATABASE_URL) {
    const index = memoryProjects.findIndex((entry) => String(entry.id) === String(id));
    if (index < 0) return null;
    memoryProjects[index] = { ...memoryProjects[index], ...project, updated_at: new Date().toISOString() };
    return memoryProjects[index];
  }
  const result = await getPool().query(
    `UPDATE projects SET name=$1, client=$2, location=$3, stage=$4, progress=$5, value_cents=$6, scope=$7, image_url=$8, updated_at=NOW()
     WHERE id=$9 RETURNING id, name, client, location, stage, progress, value_cents, scope, image_url, created_at, updated_at`,
    [project.name, project.client || null, project.location || null, project.stage, project.progress, project.value_cents, project.scope || null, project.image_url || null, id]
  );
  return result.rows[0] || null;
}

export async function deleteProject(id) {
  if (!process.env.DATABASE_URL) {
    const before = memoryProjects.length;
    memoryProjects = memoryProjects.filter((entry) => String(entry.id) !== String(id));
    return memoryProjects.length !== before;
  }
  const result = await getPool().query("DELETE FROM projects WHERE id=$1", [id]);
  return result.rowCount === 1;
}

export async function closeDatabase() {
  if (pool) await pool.end();
}

export async function findUserByEmail(email) {
  if (!process.env.DATABASE_URL) return null;
  const result = await getPool().query("SELECT id, email, password_hash, role, name, company, tax_id, phone FROM users WHERE LOWER(email)=LOWER($1)", [email]);
  return result.rows[0] || null;
}

export async function createUser(user) {
  const passwordHash = await hashPassword(user.password);
  const result = await getPool().query("INSERT INTO users (email, password_hash, role, name, company, tax_id, phone) VALUES ($1,$2,'cliente',$3,$4,$5,$6) RETURNING id,email,role,name,company,tax_id,phone", [user.email, passwordHash, user.name, user.company || null, user.tax_id || null, user.phone || null]);
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await getPool().query("SELECT id,email,role,name,company,tax_id,phone FROM users WHERE id=$1", [id]);
  return result.rows[0] || null;
}

export async function updateUser(id, user) {
  const result = await getPool().query("UPDATE users SET name=$1, company=$2, tax_id=$3, phone=$4, updated_at=NOW() WHERE id=$5 RETURNING id,email,role,name,company,tax_id,phone", [user.name, user.company || null, user.tax_id || null, user.phone || null, id]);
  return result.rows[0] || null;
}

export async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, process.env.PASSWORD_PEPPER || "", 64, (error, derived) => {
      if (error) reject(error);
      else resolve(derived.toString("hex"));
    });
  });
}

export async function verifyPassword(password, hash) {
  const candidate = await hashPassword(password);
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
}

export async function listQuotes(userId) {
  const result = await getPool().query("SELECT id,title,details,status,created_at,updated_at FROM quotes WHERE user_id=$1 ORDER BY updated_at DESC", [userId]);
  return result.rows;
}

export async function createQuote(userId, quote) {
  const result = await getPool().query("INSERT INTO quotes (user_id,title,details) VALUES ($1,$2,$3) RETURNING id,title,details,status,created_at,updated_at", [userId, quote.title, quote.details]);
  return result.rows[0];
}

export async function listMessages(userId) {
  const result = await getPool().query("SELECT id,sender_id,recipient_id,quote_id,body,created_at FROM messages WHERE sender_id=$1 OR recipient_id=$1 ORDER BY created_at ASC", [userId]);
  return result.rows;
}

export async function createMessage(senderId, message) {
  const result = await getPool().query("INSERT INTO messages (sender_id,recipient_id,quote_id,body) VALUES ($1,$2,$3,$4) RETURNING id,sender_id,recipient_id,quote_id,body,created_at", [senderId, message.recipient_id || null, message.quote_id || null, message.body]);
  return result.rows[0];
}

export async function listAllMessages() {
  const result = await getPool().query("SELECT id,sender_id,recipient_id,quote_id,body,created_at FROM messages ORDER BY created_at ASC");
  return result.rows;
}

export async function listAllQuotes() {
  const result = await getPool().query("SELECT id,user_id,title,details,status,created_at,updated_at FROM quotes ORDER BY updated_at DESC");
  return result.rows;
}
