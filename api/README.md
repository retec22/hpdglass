# API / limite de integracion

La web publica y el dashboard nunca deben conectarse directamente a SQL Server, ERP ni a las APIs sociales. El flujo de produccion es:

Navegador -> API HPD -> Neon / Cloudinary

Al iniciar `server.js`, las migraciones SQL se ejecutan automáticamente en orden y se registran en `schema_migrations`. En Render solo es necesario configurar `DATABASE_URL`; no se debe ejecutar la misma migración manualmente.
                                      -> base de datos de conversaciones y leads

## Endpoints internos recomendados

- `POST /api/leads`: valida y registra leads del sitio y del dashboard.
- `GET /api/dashboard/summary`: devuelve KPIs segun el usuario autenticado.
- `GET /api/conversations`: devuelve conversaciones paginadas y filtradas por permisos.
- `POST /api/webhooks/whatsapp`: recibe eventos de WhatsApp Business.
- `POST /api/webhooks/meta`: recibe leads y eventos de Meta Graph API.
- `POST /api/webhooks/tiktok`: recibe eventos de TikTok Business.
- `POST /api/connectors/:channel/oauth/callback`: intercambia codigos OAuth en servidor.

El formulario web ya envia su payload a `POST /api/leads`; la API valida el esquema, limita el cuerpo y persiste la solicitud en PostgreSQL.

## Requisitos de seguridad

- Secretos, refresh tokens y credenciales solo en variables de entorno o secret manager.
- HTTPS obligatorio, CORS con allowlist y cookies `HttpOnly`, `Secure`, `SameSite=Lax`.
- Autenticacion con sesiones rotatorias u OAuth corporativo y RBAC para ventas, ingenieria y administracion.
- Verificacion de firma y timestamp de cada webhook antes de procesarlo.
- Idempotencia por `event_id`, deduplicacion de leads y cola para reintentos controlados.
- Rate limiting, limites de payload y validacion estricta de archivos MIME y extension.
- Cifrado en reposo para tokens y datos personales; auditoria de accesos y cambios.
- Sanitizacion de texto, proteccion CSRF en formularios y politica CSP.
- No mostrar en el dashboard un canal como conectado hasta confirmar un health-check del backend.

## Estado actual

El repositorio ahora incluye un esqueleto ejecutable en `api/`:

- `server.js` y `src/app.js`: servidor HTTPS-ready con middleware de seguridad.
- `src/providers/whatsapp.js`: challenge y firma de WhatsApp Cloud API.
- `src/providers/meta.js`: challenge y firma de Meta Graph API.
- `src/providers/tiktok.js`: adaptador separado; el header y algoritmo final deben confirmarse contra la documentación habilitada para la cuenta TikTok.
- `src/routes/webhooks.js`: endpoints separados y respuesta `202` para procesamiento asíncrono.
- `src/routes/health.js`: health-check que no expone secretos.
- `migrations/001_crm_events.sql`: tablas históricas de eventos y solicitudes con claves únicas para deduplicación.
- `.env.example`: configuración sin credenciales reales.

Para activar cada canal hacen falta credenciales de una cuenta empresarial, URLs públicas de webhook, verificación de Meta/TikTok/WhatsApp, base de datos y un worker que procese la cola. El servidor debe desplegarse detrás de HTTPS y un proxy con secretos gestionados por el proveedor de infraestructura. Nunca se deben colocar esos datos en `dashboard.js` ni en cualquier JavaScript servido al navegador.

La API incluye autenticación de usuarios, perfiles, cotizaciones, mensajería, proyectos y conexión con Neon/Cloudinary.
