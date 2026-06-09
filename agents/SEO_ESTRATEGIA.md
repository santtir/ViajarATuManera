# Estrategia SEO — Viajar A Tu Manera

> Objetivo: que al buscar **"Viajar A Tu Manera"** en Google, el sitio
> `viajaratumanera.tur.ar` aparezca **primero**.

## Diagnóstico: por qué hoy no aparece

Una búsqueda por el **nombre de la marca** (búsqueda "branded") es la más fácil
de ganar… pero solo si Google ya conoce el sitio. Hoy no aparece por estas razones,
en orden de impacto:

1. **El sitio no está en Google Search Console** → puede que Google ni siquiera lo
   haya indexado todavía. _(Bloqueante #1)_
2. **No existe Perfil de Empresa (Google Business Profile)** → es lo que genera la
   ficha lateral y el refuerzo más fuerte para búsquedas de marca. _(Bloqueante #2)_
3. **Faltaban señales on-page** (meta description, datos estructurados, `<h1>` con
   el nombre, Open Graph, sitemap, robots). ✅ **Resuelto en este commit.**
4. **Sin backlinks ni perfiles sociales** que apunten al dominio → Google necesita
   "votos de confianza" externos para asociar la marca al dominio.
5. **Sitio nuevo**: aunque hagas todo bien, la indexación y el ranking de marca
   tardan típicamente entre **3 días y 3 semanas**.

---

## ✅ Parte 1 — Hecho en el código (este commit)

- `<title>` y **meta description** optimizados con el nombre de marca primero.
- **`<h1>` con el nombre de la agencia** en el hero (antes solo existía como imagen).
- **Datos estructurados Schema.org `TravelAgency`** (nombre, contacto, ubicación, logo).
- **Open Graph + Twitter Cards** → vista previa correcta al compartir en WhatsApp/redes.
- **`canonical`** apuntando a `https://viajaratumanera.tur.ar/`.
- **`robots.txt`** y **`sitemap.xml`** para facilitar el rastreo e indexación.

---

## 🔧 Parte 2 — Acciones manuales (las decisivas, fuera del código)

> Estas tareas **no se pueden hacer por código**: requieren tu cuenta de Google.
> Son las que realmente destraban el ranking de marca.

### Paso 1 — Google Search Console _(prioridad máxima, ~15 min)_

1. Entrá a <https://search.google.com/search-console> con tu cuenta de Google.
2. Agregá una propiedad de tipo **"Prefijo de URL"**: `https://viajaratumanera.tur.ar/`.
3. Verificá la propiedad. La forma más simple en Vercel es el método de
   **etiqueta HTML**: Google te da un `<meta name="google-site-verification" ...>`.
   → Pegámelo y yo lo agrego al `<head>` (o lo agregás vos antes de `</head>`).
4. Una vez verificado: **Sitemaps → agregar** `sitemap.xml`.
5. Usá **"Inspección de URLs"** con `https://viajaratumanera.tur.ar/` y tocá
   **"Solicitar indexación"**.

### Paso 2 — Perfil de Empresa de Google _(prioridad máxima, ~20 min)_

1. Entrá a <https://www.google.com/business/>.
2. Creá el perfil con el nombre **exacto** "Viajar A Tu Manera".
3. Completá: categoría **"Agencia de viajes"**, teléfono **+54 9 2284 648973**,
   sitio web `https://viajaratumanera.tur.ar/`, zona de servicio (Argentina),
   horarios, fotos del logo y de destinos.
4. Verificá el perfil (Google envía un código por teléfono, email o video).

> Cuando esté verificado, el perfil hace que aparezca la **ficha lateral** al
> buscar tu marca — es lo que más mueve la aguja para búsquedas branded.

### Paso 3 — Coherencia NAP + perfiles sociales _(refuerzo)_

Usá **siempre los mismos datos** (Nombre, dirección/zona, teléfono) en todos lados:

- Instagram / Facebook con el nombre "Viajar A Tu Manera" y el link al sitio en la bio.
- Cuando tengas redes, pasámelas y las agrego al campo `sameAs` del JSON-LD
  (`agents/SEO_ESTRATEGIA.md` y el `<script type="application/ld+json">` del `index.html`).

### Paso 4 — Primeros backlinks _(refuerzo, semanas siguientes)_

- Cargá la agencia en directorios locales y de turismo.
- Si tenés acuerdos con hoteles/operadores, pediles un link.
- Compartí el sitio desde las redes (genera tráfico y señales de marca).

---

## 📅 Expectativa de tiempos

| Acción | Efecto | Plazo |
|---|---|---|
| Search Console + indexación | El sitio empieza a aparecer | 3 días – 3 semanas |
| Perfil de Empresa verificado | Ficha lateral por marca | 1 – 4 semanas |
| Backlinks + redes | Consolida el #1 por marca | 1 – 3 meses |

> Para búsquedas que **no** son de marca (ej. "agencia de viajes en Olavarría"),
> el plazo es mayor y depende de contenido y competencia — eso es una fase 2.

---

## ⚙️ Mantenimiento

- Cada vez que se agregue una página/sección nueva → actualizar `sitemap.xml`.
- Mantener `og:image` y el logo apuntando a URLs absolutas del dominio final.
- Revisar Search Console 1×/semana las primeras semanas (errores de cobertura).
