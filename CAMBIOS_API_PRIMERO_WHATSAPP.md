# Cambio CAP - Persistir antes de abrir WhatsApp

Objetivo: no romper la version operativa actual, pero mejorar `ia_punita.html` para que el flujo sea:

```txt
Usuario completa formulario
        ↓
Aprieta Enviar formulario
        ↓
Frontend genera ficha + ID
        ↓
POST a backend/API
        ↓
Backend inserta en PostgreSQL
        ↓
Solo si la API responde ok:true, se abre WhatsApp
```

## Archivos tocados en esta copia

- `ia_punita.html`
- `backend/.env.example`
- `docs/PERSISTENCIA_IA_PUNITA.md`

## Cambio importante en `ia_punita.html`

Antes se usaba `sendBeacon` y/o timeout corto. Eso servia para no frenar WhatsApp, pero no confirmaba que PostgreSQL hubiera guardado.

Ahora se usa `fetch` con confirmacion real:

```js
const persistenceResult = await persistConsultation(commercialEventPayload);
```

Si la API no responde con `ok:true`, WhatsApp no se abre.

## API elegida automaticamente

- Si se abre la pagina desde archivo local, localhost o 127.0.0.1:

```txt
http://localhost:3000/api/consultas
```

- Si se abre publicada en dominio real:

```txt
https://api.interjama.com/api/consultas
```

Esto permite probar localmente antes de publicar `api.interjama.com`.

## Prueba minima local

1. PostgreSQL funcionando.
2. Tabla `interjama_consultations` creada.
3. Backend encendido:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

4. Verificar backend:

```bash
curl http://localhost:3000/health
```

5. Abrir `ia_punita.html` desde Live Server o navegador.
6. Completar formulario.
7. Apretar enviar.
8. Resultado esperado:
   - primero guarda en PostgreSQL;
   - despues abre WhatsApp.

## Consulta SQL de control

```sql
SELECT
  id,
  consultation_id,
  created_at_server,
  full_name,
  company,
  client_phone,
  email,
  service,
  status
FROM interjama_consultations
ORDER BY created_at_server DESC
LIMIT 10;
```
