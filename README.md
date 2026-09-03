# HPD Glassgroup Web 3.1

Portal estático B2B orientado a:
- SEO técnico y arquitectura por intención de búsqueda.
- UX/UI premium y responsive.
- Generación y calificación de leads.
- Catálogo de productos con URL individual.
- Casos de éxito con URL individual.
- Soluciones por segmento.
- Centro Técnico.
- Blog técnico para estrategia SEO.
- Preparación para Analytics / Search Console / Tag Manager.
- Preparación para integración futura con CRM/WhatsApp/API.

## URLs limpias

La versión 3 usa rutas como:
- /productos/vidrio-templado/
- /productos/vidrio-laminado/
- /productos/vidrio-low-e/
- /productos/muro-cortina-mcs035/
- /proyectos/pardo-200/
- /soluciones/constructoras/
- /soluciones/arquitectos/
- /centro-tecnico/bim/
- /blog/que-es-vidrio-low-e/

## Imágenes

El logo entregado por el usuario está en:
assets/images/brand/hpd-logo.png

Las imágenes de proyectos/productos de esta maqueta son placeholders SVG y deben sustituirse por fotografías oficiales de HPD. No se deben publicar como si fueran obras reales.

## SEO

Incluye:
- title y description únicos por página.
- canonical.
- Open Graph.
- robots.txt.
- sitemap.xml.
- Schema.org para organización, productos, proyectos y artículos.
- HTML semántico.
- alt text descriptivo.
- enlaces internos entre producto -> proyecto -> Centro Técnico -> contacto.
- URLs individuales.

## Conversión

El formulario incluye los campos recomendados por el análisis:
- tipo de cliente
- proyecto
- ubicación
- etapa
- área aproximada
- fecha prevista
- necesidad
- documentación
- canal preferido

Actualmente funciona en modo demo. La integración real requiere backend/API.

## IMPORTANTE: ERP local + Kommo

No conectar:
Web -> SQL Server / ERP local

Sí conectar:
Web -> API pública -> integración segura -> Kommo / servicios internos controlados

La API pública puede vivir en una nube/VPS y comunicarse con el ERP mediante un mecanismo seguro de salida desde la red local, VPN o agente/servicio intermedio, según la arquitectura que se defina.

## Producción

1. Cambiar dominio/canonical si corresponde.
2. Cargar fotografías oficiales y optimizarlas WebP/AVIF.
3. Cargar fichas, CAD, BIM, manuales y certificaciones reales.
4. Revisar textos técnicos con Ingeniería.
5. Configurar Google Search Console.
6. Configurar GA4 y/o GTM.
7. Configurar endpoint backend.
8. Configurar WhatsApp real.
9. Probar Core Web Vitals, accesibilidad, formularios y redirecciones.
10. Publicar sitemap en Search Console.

## Nota sobre SEO

El código prepara el sitio para posicionamiento, pero no garantiza posiciones en Google. El resultado depende también de contenido útil, autoridad del dominio, enlaces, competencia, rendimiento, indexación y mejora continua.

## HPD Web 3.3 — Visual/UX pass

This build adds a premium editorial design layer on top of the existing information architecture:

- Large photographic hero with restrained architectural grid overlay.
- Local transparent HPD logo to avoid the rectangular image background.
- Consistent SVG icon system in `assets/icons/ui.svg` (no emoji/glyph UI controls).
- Brand WhatsApp SVG icon for floating/contact actions.
- Refined typography, spacing, buttons, cards, page heroes and mobile navigation.
- `prefers-reduced-motion` support for accessibility.
- Canonical and Open Graph URL repair for real route pages.
- Inner pages receive photographic page headers and stronger visual hierarchy.

The photographic URLs are visual references for the prototype. Replace them with HPD-owned/licensed project photography before production.
