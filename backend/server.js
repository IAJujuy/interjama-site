require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.DATABASE_URL) {
  console.warn('Advertencia: falta DATABASE_URL. La API no podra conectarse a PostgreSQL.');
}

if (!process.env.ADMIN_API_KEY) {
  console.warn('Advertencia: falta ADMIN_API_KEY. La bandeja interna quedara bloqueada hasta configurar una clave.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origen no permitido por la API de Interjama.'));
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Key']
}));
app.use(express.json({ limit: '64kb', type: ['application/json', 'application/*+json'] }));
app.use(express.text({ limit: '64kb', type: ['text/plain'] }));

app.use((req, res, next) => {
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      return res.status(400).json({ ok: false, error: 'JSON invalido.' });
    }
  }

  next();
});

function cleanText(value, maxLength = 2000) {
  if (value === null || value === undefined) return null;

  const text = String(value).trim();
  if (!text) return null;

  return text.slice(0, maxLength);
}

function cleanPhone(value) {
  const text = cleanText(value, 80);
  if (!text) return null;
  return text.replace(/[^0-9+()\-\s.]/g, '').slice(0, 80);
}

function parseClientDate(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function requireAdmin(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  if (!configuredKey) {
    return res.status(503).json({ ok: false, error: 'Falta configurar ADMIN_API_KEY en el backend.' });
  }

  const providedKey = req.get('X-Admin-Key') || '';
  if (providedKey !== configuredKey) {
    return res.status(401).json({ ok: false, error: 'Clave interna invalida.' });
  }

  next();
}

function normalizeStatus(value) {
  const status = cleanText(value, 80) || 'Nueva';
  const allowed = new Set([
    'Nueva',
    'Pendiente de respuesta',
    'Respondida',
    'Oportunidad real',
    'No calificada',
    'Derivada',
    'Cerrada'
  ]);

  return allowed.has(status) ? status : 'Nueva';
}

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, service: 'interjama-consultas-api' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'La base de datos no responde.' });
  }
});

app.post('/api/consultas', async (req, res) => {
  const payload = req.body || {};

  const consultationId = cleanText(payload.consultationId, 64);
  if (!consultationId) {
    return res.status(400).json({ ok: false, error: 'Falta consultationId.' });
  }

  const values = {
    consultationId,
    eventType: cleanText(payload.eventType, 120) || 'interjama.consultation.created',
    source: cleanText(payload.source, 120) || 'Web Interjama',
    agent: cleanText(payload.agent, 120) || 'IA punita',
    createdAtClient: parseClientDate(payload.createdAt),
    needType: cleanText(payload.needType, 1000),
    service: cleanText(payload.service, 500),
    clientType: cleanText(payload.clientType, 300),
    priority: cleanText(payload.priority, 300),
    fullName: cleanText(payload.name, 300),
    company: cleanText(payload.company, 300),
    city: cleanText(payload.city, 300),
    country: cleanText(payload.country, 300),
    phone: cleanPhone(payload.phone),
    email: cleanText(payload.email, 300),
    details: cleanText(payload.details, 4000),
    suggestedAction: cleanText(payload.suggestedAction, 2000),
    whatsappTarget: cleanText(payload.whatsappTarget, 32),
    pageUrl: cleanText(payload.pageUrl, 1000),
    userAgent: cleanText(payload.userAgent, 1000),
    language: cleanText(payload.language, 32),
    status: 'Nueva',
    rawPayload: payload
  };

  try {
    const result = await pool.query(
      `INSERT INTO interjama_consultations (
        consultation_id,
        event_type,
        source,
        agent,
        created_at_client,
        need_type,
        service,
        client_type,
        priority,
        full_name,
        company,
        city,
        country,
        client_phone,
        email,
        details,
        suggested_action,
        whatsapp_target,
        page_url,
        user_agent,
        language,
        status,
        raw_payload
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23::jsonb
      )
      ON CONFLICT (consultation_id) DO UPDATE SET
        event_type = EXCLUDED.event_type,
        source = EXCLUDED.source,
        agent = EXCLUDED.agent,
        created_at_client = EXCLUDED.created_at_client,
        need_type = EXCLUDED.need_type,
        service = EXCLUDED.service,
        client_type = EXCLUDED.client_type,
        priority = EXCLUDED.priority,
        full_name = EXCLUDED.full_name,
        company = EXCLUDED.company,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        client_phone = EXCLUDED.client_phone,
        email = EXCLUDED.email,
        details = EXCLUDED.details,
        suggested_action = EXCLUDED.suggested_action,
        whatsapp_target = EXCLUDED.whatsapp_target,
        page_url = EXCLUDED.page_url,
        user_agent = EXCLUDED.user_agent,
        language = EXCLUDED.language,
        raw_payload = EXCLUDED.raw_payload,
        updated_at_server = NOW()
      RETURNING id, consultation_id, status, created_at_server, updated_at_server`,
      [
        values.consultationId,
        values.eventType,
        values.source,
        values.agent,
        values.createdAtClient,
        values.needType,
        values.service,
        values.clientType,
        values.priority,
        values.fullName,
        values.company,
        values.city,
        values.country,
        values.phone,
        values.email,
        values.details,
        values.suggestedAction,
        values.whatsappTarget,
        values.pageUrl,
        values.userAgent,
        values.language,
        values.status,
        JSON.stringify(values.rawPayload)
      ]
    );

    res.status(201).json({ ok: true, consulta: result.rows[0] });
  } catch (error) {
    console.error('Error guardando consulta Interjama:', error);
    res.status(500).json({ ok: false, error: 'No se pudo guardar la consulta.' });
  }
});

app.get('/api/consultas', requireAdmin, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit || 80), 1), 200);
  const offset = Math.max(Number(req.query.offset || 0), 0);
  const status = cleanText(req.query.status, 80);
  const q = cleanText(req.query.q, 200);

  const filters = [];
  const params = [];

  if (status && status !== 'Todas') {
    params.push(status);
    filters.push(`status = $${params.length}`);
  }

  if (q) {
    params.push(`%${q}%`);
    filters.push(`(
      consultation_id ILIKE $${params.length}
      OR COALESCE(full_name, '') ILIKE $${params.length}
      OR COALESCE(company, '') ILIKE $${params.length}
      OR COALESCE(country, '') ILIKE $${params.length}
      OR COALESCE(city, '') ILIKE $${params.length}
      OR COALESCE(client_phone, '') ILIKE $${params.length}
      OR COALESCE(email, '') ILIKE $${params.length}
      OR COALESCE(details, '') ILIKE $${params.length}
    )`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  params.push(limit);
  const limitParam = params.length;
  params.push(offset);
  const offsetParam = params.length;

  try {
    const [consultasResult, countsResult] = await Promise.all([
      pool.query(
        `SELECT
          consultation_id,
          status,
          priority,
          source,
          service,
          client_type,
          full_name,
          company,
          city,
          country,
          client_phone,
          email,
          details,
          suggested_action,
          assigned_to,
          internal_notes,
          last_action,
          next_action,
          created_at_client,
          created_at_server,
          updated_at_server
        FROM interjama_consultations
        ${whereClause}
        ORDER BY created_at_server DESC
        LIMIT $${limitParam} OFFSET $${offsetParam}`,
        params
      ),
      pool.query(
        `SELECT status, COUNT(*)::int AS total
         FROM interjama_consultations
         GROUP BY status
         ORDER BY status ASC`
      )
    ]);

    res.json({
      ok: true,
      consultas: consultasResult.rows,
      counts: countsResult.rows,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error listando consultas Interjama:', error);
    res.status(500).json({ ok: false, error: 'No se pudo cargar la bandeja interna.' });
  }
});

app.get('/api/consultas/:consultationId', requireAdmin, async (req, res) => {
  const consultationId = cleanText(req.params.consultationId, 64);

  try {
    const result = await pool.query(
      `SELECT *
       FROM interjama_consultations
       WHERE consultation_id = $1
       LIMIT 1`,
      [consultationId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ ok: false, error: 'Consulta no encontrada.' });
    }

    res.json({ ok: true, consulta: result.rows[0] });
  } catch (error) {
    console.error('Error leyendo consulta Interjama:', error);
    res.status(500).json({ ok: false, error: 'No se pudo leer la consulta.' });
  }
});

app.patch('/api/consultas/:consultationId', requireAdmin, async (req, res) => {
  const consultationId = cleanText(req.params.consultationId, 64);
  const payload = req.body || {};

  const values = {
    status: normalizeStatus(payload.status),
    assignedTo: cleanText(payload.assignedTo, 300),
    internalNotes: cleanText(payload.internalNotes, 4000),
    lastAction: cleanText(payload.lastAction, 2000),
    nextAction: cleanText(payload.nextAction, 2000)
  };

  try {
    const result = await pool.query(
      `UPDATE interjama_consultations
       SET status = $2,
           assigned_to = $3,
           internal_notes = $4,
           last_action = $5,
           next_action = $6,
           updated_at_server = NOW()
       WHERE consultation_id = $1
       RETURNING consultation_id, status, assigned_to, internal_notes, last_action, next_action, updated_at_server`,
      [
        consultationId,
        values.status,
        values.assignedTo,
        values.internalNotes,
        values.lastAction,
        values.nextAction
      ]
    );

    if (!result.rowCount) {
      return res.status(404).json({ ok: false, error: 'Consulta no encontrada.' });
    }

    res.json({ ok: true, consulta: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando consulta Interjama:', error);
    res.status(500).json({ ok: false, error: 'No se pudo actualizar la consulta.' });
  }
});

app.use((error, req, res, next) => {
  if (error && error.message && error.message.includes('Origen no permitido')) {
    return res.status(403).json({ ok: false, error: error.message });
  }

  console.error(error);
  res.status(500).json({ ok: false, error: 'Error interno de la API.' });
});

app.listen(port, () => {
  console.log(`Interjama consultas API escuchando en puerto ${port}`);
});
