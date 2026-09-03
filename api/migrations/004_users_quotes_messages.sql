CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(16) NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin','cliente')),
  name VARCHAR(160) NOT NULL,
  company VARCHAR(200),
  tax_id VARCHAR(32),
  phone VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS quotes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente','en_revision','respondida','aprobada','rechazada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  quote_id BIGINT REFERENCES quotes(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS quotes_user_idx ON quotes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS messages_quote_idx ON messages(quote_id, created_at);