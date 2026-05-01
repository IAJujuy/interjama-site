# Cambios aplicados - Bandeja interna y trazabilidad

## Objetivo

Implementar la arquitectura minima correcta:

```txt
Formulario IA punita
-> guarda ficha en base de datos
-> abre WhatsApp Business comercial
-> Rafa responde manualmente
-> bandeja interna conserva trazabilidad
```

## Correcciones realizadas

1. `ia_punita.html`
   - Se mantuvo el flujo actual que ya funciona.
   - Se agrego campo obligatorio `Telefono / WhatsApp`.
   - Se agrego campo opcional `Email`.
   - El ID de consulta ahora usa prefijo `IJ`.
   - La ficha digital enviada a la API incluye telefono y email.
   - El mensaje de WhatsApp incluye telefono y email.
   - Si falla la API, WhatsApp igual se abre para no bloquear el contacto comercial.

2. `backend/server.js`
   - Se mantiene `POST /api/consultas` para guardar fichas.
   - Se agrego `GET /api/consultas` para listar la bandeja interna.
   - Se agrego `GET /api/consultas/:consultationId` para leer una consulta puntual.
   - Se agrego `PATCH /api/consultas/:consultationId` para actualizar estado, asignado, notas y acciones.
   - Se agrego proteccion simple para la bandeja con `ADMIN_API_KEY`.

3. `database/schema-postgres.sql`
   - Se conservaron las columnas existentes.
   - Se agregaron columnas minimas para gestion comercial:
     - `client_phone`
     - `email`
     - `status`
     - `assigned_to`
     - `internal_notes`
     - `last_action`
     - `next_action`
     - `updated_at_server`
   - Se agregaron `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para actualizar una base ya creada sin romperla.

4. `bandeja_consultas.html`
   - Nueva interfaz interna tipo email/CRM.
   - Permite buscar consultas.
   - Permite filtrar por estado.
   - Permite abrir una ficha.
   - Permite responder por WhatsApp.
   - Permite marcar pendiente, respondida, oportunidad real o cerrada.
   - Permite guardar notas internas, ultima accion y proxima accion.

5. `docs/PERSISTENCIA_IA_PUNITA.md`
   - Se actualizo la documentacion tecnica y operativa.

## Decisiones de arquitectura

- No se integro WhatsApp API todavia.
- No se automatizaron respuestas.
- No se reemplazo a Rafa.
- Se construyo una bandeja simple para ordenar y medir demanda real.
- Se eligio PostgreSQL como base principal.
