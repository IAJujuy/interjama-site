CREATE TABLE IF NOT EXISTS interjama_consultations (
  id BIGSERIAL PRIMARY KEY,
  consultation_id VARCHAR(64) NOT NULL UNIQUE,
  event_type VARCHAR(120) NOT NULL DEFAULT 'interjama.consultation.created',
  source VARCHAR(120) NOT NULL DEFAULT 'Web Interjama',
  agent VARCHAR(120) NOT NULL DEFAULT 'IA punita',
  created_at_client TIMESTAMPTZ,
  created_at_server TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at_server TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  need_type TEXT,
  service TEXT,
  client_type TEXT,
  priority TEXT,
  full_name TEXT,
  company TEXT,
  city TEXT,
  country TEXT,
  client_phone TEXT,
  email TEXT,
  details TEXT,
  suggested_action TEXT,
  status TEXT NOT NULL DEFAULT 'Nueva',
  assigned_to TEXT,
  internal_notes TEXT,
  last_action TEXT,
  next_action TEXT,
  whatsapp_target VARCHAR(32),
  page_url TEXT,
  user_agent TEXT,
  language VARCHAR(32),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Retoques minimos para bases ya creadas con la version anterior.
ALTER TABLE interjama_consultations
  ADD COLUMN IF NOT EXISTS updated_at_server TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS client_phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Nueva',
  ADD COLUMN IF NOT EXISTS assigned_to TEXT,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS last_action TEXT,
  ADD COLUMN IF NOT EXISTS next_action TEXT;

CREATE INDEX IF NOT EXISTS idx_interjama_consultations_created_at_server
  ON interjama_consultations (created_at_server DESC);

CREATE INDEX IF NOT EXISTS idx_interjama_consultations_updated_at_server
  ON interjama_consultations (updated_at_server DESC);

CREATE INDEX IF NOT EXISTS idx_interjama_consultations_priority
  ON interjama_consultations (priority);

CREATE INDEX IF NOT EXISTS idx_interjama_consultations_country
  ON interjama_consultations (country);

CREATE INDEX IF NOT EXISTS idx_interjama_consultations_status
  ON interjama_consultations (status);

CREATE INDEX IF NOT EXISTS idx_interjama_consultations_client_phone
  ON interjama_consultations (client_phone);
