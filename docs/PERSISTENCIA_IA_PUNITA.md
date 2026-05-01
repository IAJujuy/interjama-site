# Persistencia y bandeja interna - IA punita

## Que se agrego

La pantalla `ia_punita.html` conserva el flujo actual: el boton **enviar formulario** sigue abriendo WhatsApp con el mensaje armado.

Antes de redirigir a WhatsApp, el navegador prepara una ficha digital y la envia a una API:

```txt
Usuario completa formulario
        ↓
Boton enviar formulario
        ↓
Se genera ID + fecha + ficha digital
        ↓
POST /api/consultas
        ↓
Se abre WhatsApp Business comercial de Interjama
        ↓
La ficha queda visible en la bandeja interna
```

## Arquitectura implementada

```txt
www.interjama.com              api.interjama.com                 PostgreSQL
Frontend HTML/CSS/JS   →   Backend Node/Express API     →   Tabla interjama_consultations
      ↓                         ↑
IA punita formulario            |
                                |
bandeja_consultas.html ---------|
```

## Archivos clave

- `ia_punita.html`: formulario publico. Agrega telefono/WhatsApp y email. Guarda ficha y abre WhatsApp.
- `bandeja_consultas.html`: bandeja interna tipo email/CRM para Rafa o gestor.
- `backend/server.js`: API para crear, listar y actualizar consultas.
- `backend/package.json`: dependencias del backend.
- `backend/.env.example`: variables de entorno necesarias.
- `database/schema-postgres.sql`: tabla, indices y columnas de seguimiento.

## Por que hace falta backend

La pagina publica no debe conectarse directo a PostgreSQL porque expondria usuario, password y host de la base de datos.

La pagina publica habla con una API. La API habla con PostgreSQL.

## Base recomendada

Usar **PostgreSQL**. No hace falta usar PostgreSQL y MySQL al mismo tiempo. Para este producto conviene PostgreSQL porque permite guardar columnas normales y tambien el `raw_payload` completo en JSONB.

## Campos nuevos importantes

La bandeja interna necesita conservar trazabilidad comercial, por eso se agregaron campos minimos:

```txt
client_phone
email
status
assigned_to
internal_notes
last_action
next_action
updated_at_server
```

Estos campos no rompen la base anterior. Si la tabla ya existe, el script usa `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.

## Configuracion del frontend publico

En `ia_punita.html`:

```js
const PERSISTENCE_API_URL = "https://api.interjama.com/api/consultas";
```

Si la API se despliega en otro dominio, cambiar solo esa constante.

## Configuracion de la bandeja interna

En `bandeja_consultas.html`:

```js
const ADMIN_API_BASE_URL = "https://api.interjama.com";
```

Si la API se despliega en otro dominio, cambiar solo esa constante.

La bandeja pide una clave interna. Esa clave se compara contra `ADMIN_API_KEY` en el backend. No debe publicarse.

## Instalacion local del backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Crear o actualizar tabla en PostgreSQL

Ejecutar el contenido de:

```txt
database/schema-postgres.sql
```

en la base PostgreSQL elegida.

## Variables de entorno del backend

```txt
PORT=3000
DATABASE_URL=postgresql://usuario:password@host:5432/interjama
ALLOWED_ORIGINS=https://www.interjama.com,https://interjama.com
ADMIN_API_KEY=una_clave_larga_privada
```

Si la base exige SSL, agregar:

```txt
DATABASE_SSL=true
```

## Prueba rapida de alta de consulta

Con el backend encendido:

```bash
curl -X POST http://localhost:3000/api/consultas \
  -H "Content-Type: application/json" \
  -d '{
    "consultationId":"IJ-PRUEBA-001",
    "eventType":"interjama.consultation.created",
    "source":"Web Interjama",
    "agent":"IA punita",
    "createdAt":"2026-04-30T12:00:00.000Z",
    "needType":"Consulta institucional",
    "service":"Importacion / Exportacion",
    "clientType":"Empresa",
    "priority":"Media / Comercial",
    "name":"Cliente de prueba",
    "company":"Empresa de prueba",
    "phone":"+54 9 388 0000000",
    "email":"cliente@empresa.com",
    "city":"San Salvador de Jujuy",
    "country":"Argentina",
    "details":"Consulta de prueba",
    "suggestedAction":"Responder contacto inicial"
  }'
```

## Prueba rapida de bandeja

```bash
curl http://localhost:3000/api/consultas \
  -H "X-Admin-Key: una_clave_larga_privada"
```

## Flujo operativo

```txt
1. El visitante entra desde web, LinkedIn, QR o publicidad.
2. IA punita ordena la consulta.
3. El visitante deja datos minimos, incluido telefono/WhatsApp.
4. Se guarda la ficha digital.
5. Se abre WhatsApp Business comercial de Interjama.
6. Rafa o gestor entra a bandeja_consultas.html.
7. Ve nuevas, pendientes y oportunidades.
8. Responde por WhatsApp y actualiza el estado.
9. La consulta conserva trazabilidad.
```

## Nota operativa

Si la API o la base fallan, WhatsApp igual se abre. Esto protege el flujo comercial actual: la persistencia suma trazabilidad, pero no debe bloquear el contacto con Interjama.
