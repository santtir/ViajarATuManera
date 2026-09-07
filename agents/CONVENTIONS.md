# Conventions

## Regla principal
Antes de escribir código, leer el `.md` correspondiente a la feature.
Si algo no está especificado, usar las convenciones de este archivo.

---

## JavaScript

- **Sin frameworks.** Vanilla JS ES6+.
- **Sin `type="module"`** en los `<script>` tags del HTML (compatibilidad con Vercel static)
- **Funciones globales:** las que se llaman desde atributos `onclick` del HTML
  deben ser explícitamente globales: `window.nombreFuncion = nombreFuncion`
- **`const` por defecto.** `let` solo cuando se reasigna. Nunca `var`.
- **Async/await** para todas las operaciones asíncronas
- **try/catch** obligatorio en todo `fetch()`
- **Sin `alert()`, `confirm()`, `prompt()`.** Los mensajes van en el DOM.

```javascript
// ✓ Correcto
async function enviarFormulario() {
  try {
    const res = await fetch('/api/itinerary', { ... });
    const data = await res.json();
    // usar data
  } catch (error) {
    mostrarError('Ocurrió un error. Intentá de nuevo.');
  }
}
window.enviarFormulario = enviarFormulario;

// ✗ Incorrecto
function enviarFormulario() {
  fetch('/api/itinerary', { ... })
    .then(res => res.json())
    .then(data => { ... });
}
```

---

## CSS

- **Variables CSS siempre.** Nunca valores de color hardcodeados.
- **BEM light** para clases nuevas: `.bloque`, `.bloque__elemento`, `.bloque--modificador`
- **Mobile-first** para media queries: `@media (min-width: 768px) { ... }`
- **No `!important`** salvo en `prefers-reduced-motion`

```css
/* ✓ Correcto */
.itinerary-card {
  border: 1px solid rgba(176, 146, 85, 0.15);
  color: var(--dark);
}

/* ✗ Incorrecto */
.itinerary-card {
  border: 1px solid rgba(176, 146, 85, 0.15);
  color: #111827; /* hardcodeado */
}
```

---

## Nombres

| Caso | Uso |
|------|-----|
| `camelCase` | variables y funciones JS |
| `UPPER_SNAKE_CASE` | constantes globales JS (`WA_NUMERO`) |
| `kebab-case` | clases CSS, archivos, carpetas |
| `camelCase` | atributos `id` del HTML (`itineraryCards`) |
| `kebab-case` | atributos `class` del HTML (`itinerary-card`) |

---

## HTML

- Siempre `alt` en `<img>`
- Siempre `loading="lazy"` en imágenes fuera del viewport inicial
- Usar `hidden` (atributo booleano nativo) en vez de `style="display:none"`
- Los `id` son únicos en la página

---

## Seguridad

- La API key de Anthropic **NUNCA** va en archivos de la carpeta `public/`
- **NUNCA** loguear la API key: `console.log(process.env.ANTHROPIC_API_KEY)` ✗
- El frontend siempre llama a `/api/itinerary`, nunca a `api.anthropic.com`
- `.env` y `.env.local` están en `.gitignore` — verificar antes de cada commit
- El system prompt **NUNCA** se envía desde el frontend — vive en `api/itinerary.js`
- Todo POST a `/api/itinerary` incluye el header `x-page-token` (obtenido de `GET /api/token`)
- El campo `sueno` del planificador tiene `maxlength="300"` en el HTML
- Ver `SECURITY.md` para la estrategia completa contra inference theft

---

## Git

- **Commits en español, modo imperativo:**
  `Agrega función de share WhatsApp`
  `Corrige validación del formulario de cotización`
  `Actualiza pack de destinos Vol. 2`
- **Branch principal:** `main`
- **Nunca commitear** archivos `.env`

---

## Manejo de errores en el DOM

Cada sección tiene su propio elemento de error. No reutilizar entre secciones.

```html
<!-- Planificador -->
<p class="form-error" id="plannerError" hidden></p>

<!-- Cotización -->
<p class="form-error" id="cotizError" hidden></p>
```

```javascript
function mostrarErrorPlanner(msg) {
  const el = document.getElementById('plannerError');
  el.textContent = msg;
  el.hidden = false;
}

function ocultarErrorPlanner() {
  document.getElementById('plannerError').hidden = true;
}
```

---

## Checklist antes de hacer commit

- [ ] No hay `console.log` de datos sensibles
- [ ] No hay `alert()` en el código
- [ ] Los `fetch()` tienen try/catch
- [ ] Las funciones usadas desde HTML son globales (`window.fn = fn`)
- [ ] El archivo `.env` no está entre los cambios del commit
- [ ] El modelo de IA es `claude-sonnet-4-6` (sin sufijo de fecha)
- [ ] El body del POST a `/api/itinerary` no contiene campo `system`
- [ ] El header `x-page-token` está incluido en el POST del planificador
