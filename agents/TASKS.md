# TASKS — Plan de implementación

> Ejecutar en orden. Cada tarea debe completarse y verificarse antes de la siguiente.
> TASK-01 ya fue completada por `KICKSTART.md`.

---

## TASK-02 — Extraer CSS a archivo separado

**Archivo destino:** `public/css/styles.css`

**Qué hacer:**

1. Copiar todo el contenido del bloque `<style>` de `public/index.html`
   al archivo `public/css/styles.css`
2. En `public/index.html`, reemplazar el bloque `<style>...</style>` por:
   ```html
   <link rel="stylesheet" href="/css/styles.css" />
   ```
3. Agregar al final de `styles.css` las clases de animación de scroll
   (ver `FEATURE_ANIMATIONS.md` sección 2 completa)
4. Agregar hover transitions (ver `FEATURE_ANIMATIONS.md` sección 5)
5. Agregar estilos `.nav-scrolled` (ver `FEATURE_ANIMATIONS.md` sección 6)
6. Agregar CSS de itinerary-cards (ver `FEATURE_PLANNER.md` sección CSS)
7. Agregar CSS de cotización éxito/error (ver `FEATURE_COTIZACION.md` sección CSS)

**Verificar:** El sitio se ve idéntico al original. No existe `<style>` en el HTML.

---

## TASK-03 — Implementar `main.js`

**Archivo:** `public/js/main.js`

**Contenido completo:**

```javascript
/**
 * main.js
 * Constantes globales, utilidades y comportamiento del navbar.
 */

// Constante global del número de WhatsApp
// Modificar aquí para cambiar el número en todo el sitio
const WA_NUMERO = //usar numero desde el md de overview;
  // Scroll suave a una sección por selector CSS
  function goTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

// Navbar: agregar sombra al hacer scroll
function initNavScroll() {
  window.addEventListener(
    "scroll",
    () => {
      document
        .querySelector("nav")
        .classList.toggle("nav-scrolled", window.scrollY > 60);
    },
    { passive: true },
  );
}

// Exponer funciones globalmente
window.goTo = goTo;

// Inicializar
document.addEventListener("DOMContentLoaded", initNavScroll);
```

**Verificar:** `window.goTo` funciona desde la consola del navegador.

---

## TASK-04 — Implementar `animations.js`

**Archivo:** `public/js/animations.js`

Implementar el Intersection Observer según `FEATURE_ANIMATIONS.md` sección 3.

**Verificar:**

- `window.initScrollAnimations` es accesible en consola
- Al agregar `data-animate="fade-up"` a un elemento y scrollear, aparece con animación

---

## TASK-05 — Implementar `destinations.js`

**Archivo:** `public/js/destinations.js`

Implementar carga de JSON y render de cards según `FEATURE_DESTINATIONS.md`.

**Verificar:**

- El grid de destinos se llena al cargar la página
- Si se borra temporalmente `data/destinations.json`, aparecen los destinos de fallback
- Las cards reciben `data-animate` y `data-delay`

---

## TASK-06 — Implementar `whatsapp.js`

**Archivo:** `public/js/whatsapp.js`

Implementar las dos funciones según `FEATURE_WHATSAPP.md`.

**Verificar:**

- `window.abrirWhatsAppGeneral()` abre WA con mensaje genérico
- `window.compartirItinerarioPorWA('texto de prueba', 'meta')` abre WA con el texto

---

## TASK-07 — Implementar `cotizacion.js`

**Archivo:** `public/js/cotizacion.js`

Implementar todas las funciones según `FEATURE_COTIZACION.md`.

**Verificar:**

- Sin nombre/email: aparece mensaje de error inline (sin alert)
- Con datos válidos: el botón se deshabilita y muestra "Enviando…"
- (El envío real requiere verificación de Formsubmit — ver TASK-12)

---

## TASK-08 — Implementar `planner.js`

**Archivo:** `public/js/planner.js`

Implementar todas las funciones según `FEATURE_PLANNER.md`.

**Verificar sin API key:**

- Los chips se seleccionan y deseleccionan correctamente
- El range actualiza el display de días
- Sin selecciones completas: el error inline aparece
- Con `/api/itinerary` mockeado: las cards se renderizan y animan

---

## TASK-09 — Refactorizar `public/index.html`

Esta es la tarea de integración. Con todos los JS implementados,
limpiar y actualizar el HTML.

### 9.1 — Reemplazar `<script>` inline

Quitar todo el bloque `<script>` al final del `<body>`.
Agregar antes de `</body>`:

```html
<script src="/js/main.js"></script>
<script src="/js/animations.js"></script>
<script src="/js/destinations.js"></script>
<script src="/js/whatsapp.js"></script>
<script src="/js/cotizacion.js"></script>
<script src="/js/planner.js"></script>
```

### 9.2 — Limpiar el navbar

Quitar el link de WhatsApp del `<nav>` (ver `FEATURE_WHATSAPP.md` sección
"Cambios requeridos — punto 1").
El navbar queda solo con logo y links de navegación.

### 9.3 — Reemplazar el botón flotante

Reemplazar todo el bloque `#chat-bubble` con la versión simplificada
(ver `FEATURE_WHATSAPP.md` sección "punto 2").
Eliminar la `.chat-window` completamente.

### 9.4 — Actualizar el bloque `#result` del planificador

Reemplazar el `<div id="result">` actual con el HTML de resultado mejorado
(ver `FEATURE_PLANNER.md` sección "HTML del resultado").

### 9.5 — Actualizar el formulario de cotización

Reemplazar el contenido de `#cotizacion` con el HTML actualizado
(ver `FEATURE_COTIZACION.md` sección "HTML del formulario").
Incluir los campos hidden de Formsubmit y el div de éxito.

### 9.6 — Agregar `data-animate` a elementos estáticos

Agregar los atributos de animación a elementos del HTML estático
(ver `FEATURE_ANIMATIONS.md` sección 4):

- `.section-top` de cada sección
- `.form-card`
- `.form-grid`

Las cards de destinos e itinerario se manejan desde JS, no desde el HTML.

### 9.7 — Reemplazar `window.onload` del HTML original

El HTML original tiene:

```javascript
window.onload = () => {
  const g = document.getElementById('destGrid');
  destinos.forEach(d => { ... });
};
```

Esto ya fue migrado a `destinations.js`. Confirmar que no quede duplicado.

**Verificar:** El sitio funciona completo: nav, destinos, planificador, cotización, WA.

---

## TASK-10 — Implementar y verificar `api/itinerary.js` y `api/token.js`

Reemplazar el proxy original con la versión segura según `ARCHITECTURE.md`
y `SECURITY.md`. Crear también `api/token.js`.

**Checklist de implementación:**

1. `api/itinerary.js` usa el código completo de `ARCHITECTURE.md`
2. `api/token.js` creado según `ARCHITECTURE.md`
3. El modelo es `claude-sonnet-4-6`
4. Lee `process.env.ANTHROPIC_API_KEY` y `process.env.PAGE_TOKEN_SECRET`
5. Importa `@upstash/redis` y usa `Redis.fromEnv()`
6. El system prompt está hardcodeado — no acepta `system` del body
7. Devuelve 405 para métodos no-POST
8. Devuelve 401 sin token válido
9. Devuelve 429 al superar 5 req/hora por IP
10. Devuelve 400 si el input supera 1500 chars

**Verificar localmente con `vercel dev`:**

```bash
npx vercel dev
```

```bash
# Sin token → debe devolver 401
curl -X POST http://localhost:3000/api/itinerary \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'

# Obtener token y usarlo
TOKEN=$(curl -s http://localhost:3000/api/token | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).token))")
curl -X POST http://localhost:3000/api/itinerary \
  -H "Content-Type: application/json" \
  -H "x-page-token: $TOKEN" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}'
```

---

## TASK-11 — Test de integración manual

Verificar en el navegador:

**Planificador:**

- [ ] Seleccionar destino + estilo + presupuesto → botón activo
- [ ] Sin selecciones → error inline visible
- [ ] Generación → overlay aparece durante la llamada
- [ ] Resultado → cards animadas se muestran
- [ ] Botón "Compartir" → abre WA con itinerario
- [ ] Botón "Crear otro" → resetea correctamente

**Cotización:**

- [ ] Sin nombre/email → error inline visible
- [ ] Con datos → botón se deshabilita durante el envío

**WhatsApp:**

- [ ] Botón flotante → abre WA sin itinerario
- [ ] Número en footer → correcto y funcional
- [ ] Número NO aparece en el navbar

**Animaciones:**

- [ ] Cards de destinos aparecen con stagger al scrollear
- [ ] Cards del itinerario aparecen con stagger al generarse
- [ ] Hover en cards de destinos → elevación suave
- [ ] Nav agrega sombra al scrollear

**Responsive:**

- [ ] Funciona en 375px (móvil)
- [ ] Funciona en 768px (tablet)
- [ ] Funciona en 1440px (desktop)

---

## TASK-12 — Verificar Formsubmit (manual, no automatizable)

1. Con el sitio en Vercel, completar el formulario de cotización y enviarlo
2. Revisar `viajaratumanera.asesoria@gmail.com` por el email de activación
3. Hacer clic en el link de confirmación
4. Enviar el formulario nuevamente
5. Verificar que llega el email a la agencia
6. Verificar que el auto-reply llega al email ingresado en el formulario

---

## TASK-13 — Deploy a Vercel (manual)

1. Crear cuenta en vercel.com con GitHub (el developer)
2. "New Project" → importar el repositorio
3. Instalar dependencias localmente: `npm install`
4. Settings → Environment Variables (agregar todas):
   - `ANTHROPIC_API_KEY` — key de console.anthropic.com
   - `PAGE_TOKEN_SECRET` — generar con `openssl rand -hex 32`
   - `UPSTASH_REDIS_REST_URL` — del dashboard de Upstash (ver `SECURITY.md`)
   - `UPSTASH_REDIS_REST_TOKEN` — del dashboard de Upstash
   - `ALLOWED_ORIGIN` — dominio final (ej: `https://viajaratumanera.tur.ar`)
5. Configurar spending limit en Anthropic Console: $10/mes (ver `SECURITY.md`)
6. Trigger deploy (o push a `main`)
7. Verificar que `GET https://[proyecto].vercel.app/api/token` devuelve un token
8. Verificar que `POST /api/itinerary` sin token devuelve 401
9. Verificar que `POST /api/itinerary` con token devuelve respuesta de Claude

---

## TASK-14 — Configurar dominio (cuando esté disponible)

1. Comprar dominio `.tur.ar` en NIC.AR
2. En Vercel: Project → Settings → Domains → agregar el dominio
3. Vercel muestra los registros DNS necesarios
4. En NIC.AR: panel DNS → agregar los registros
5. Esperar 24–48hs de propagación
6. Verificar que el sitio carga desde el dominio propio
