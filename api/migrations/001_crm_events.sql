CREATE TABLE IF NOT EXISTS webhook_events (
  id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(24) NOT NULL,
  provider_event_id VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  status VARCHAR(24) NOT NULL DEFAULT 'received',
  UNIQUE (provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  source VARCHAR(32) NOT NULL,
  external_id VARCHAR(255),
  name VARCHAR(160) NOT NULL,
  company VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  product VARCHAR(120),
  need VARCHAR(120),
  project VARCHAR(240),
  location VARCHAR(240),
  stage VARCHAR(80),
  area VARCHAR(80),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source, external_id)
);

CREATE INDEX IF NOT EXISTS webhook_events_status_idx ON webhook_events (status, received_at);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
