CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  client VARCHAR(180),
  location VARCHAR(180),
  stage VARCHAR(32) NOT NULL DEFAULT 'preventa' CHECK (stage IN ('preventa','diseno','fabricacion','instalacion','cerrado')),
  progress SMALLINT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  value_cents BIGINT NOT NULL DEFAULT 0 CHECK (value_cents >= 0),
  scope TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_deliverables (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente','en_revision','aprobado','bloqueado')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_stage_idx ON projects(stage);
CREATE INDEX IF NOT EXISTS projects_updated_at_idx ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS project_deliverables_project_idx ON project_deliverables(project_id, status);

INSERT INTO projects (name, client, location, stage, progress, value_cents, scope)
SELECT seed.name, seed.client, seed.location, seed.stage, seed.progress, seed.value_cents, seed.scope
FROM (VALUES
  ('Pardo 200', 'Proyecto corporativo', 'Miraflores - Lima', 'instalacion', 82, 180000000, 'Fachada integral y muro cortina'),
  ('Time', 'Proyecto corporativo', 'Lima', 'diseno', 48, 210000000, 'Ingenieria y entrega de planos'),
  ('Centro Empresarial More', 'Proyecto empresarial', 'Lima', 'fabricacion', 64, 270000000, 'Vidrio, aluminio y fachada integral'),
  ('Clinica Internacional', 'Proyecto empresarial', 'Lima', 'instalacion', 71, 180000000, 'Fachada y cerramientos de alto desempeno'),
  ('Centro de Convenciones PUCP', 'Proyecto institucional', 'Lima', 'cerrado', 100, 160000000, 'Fachadas y vidrio arquitectonico')
) AS seed(name, client, location, stage, progress, value_cents, scope)
WHERE NOT EXISTS (SELECT 1 FROM projects);
