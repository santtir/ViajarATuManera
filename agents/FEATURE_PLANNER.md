# Feature: Planificador de Itinerario con IA

## Archivo principal
`public/js/planner.js`

## Descripción
Formulario interactivo que recopila preferencias del usuario y genera un
itinerario personalizado usando Claude Sonnet 4.6 via proxy serverless.
El resultado se muestra como cards animadas y puede compartirse por WhatsApp.

---

## Estado interno del formulario

```javascript
const sel = {
  dest: [],   // array — selección múltiple
  tipo: [],   // array — selección múltiple
  pres: ''    // string — selección única
};
```

---

## Campos del formulario

### Destino (chips, selección múltiple)
```
🏖️ Playa tropical
🏔️ Montaña / Naturaleza
🏛️ Europa histórica
🏯 Asia exótica
🌵 Desierto / Aventura
🗽 Norteamérica
🌎 Latinoamérica
```

### Estilo de viaje (chips, selección múltiple)
```
🥂 Lujo & relax
🎒 Mochilero
👨‍👩‍👧 Familia
💑 Pareja romántica
🏄 Aventura extrema
🍷 Gastronomía & cultura
```

### Duración
- `<input type="range" min="3" max="21" value="7" id="dur">`
- Display: `<div id="durVal">7 días</div>` — actualizado en tiempo real

### Presupuesto (chips, selección única)
```
💵 Económico (<$800)
💳 Moderado ($800–$2,000)
💎 Premium ($2,000+)
```

### Experiencia soñada
- `<textarea id="sueno" maxlength="300">` — campo libre, opcional, máx 300 caracteres

---

## Funciones de chips

```javascript
// Toggle para selección múltiple (dest, tipo)
function pick(btn, group) {
  btn.classList.toggle('selected');
  const v = btn.textContent.trim();
  if (btn.classList.contains('selected')) {
    sel[group].push(v);
  } else {
    sel[group] = sel[group].filter(x => x !== v);
  }
}

// Selección única (pres) — deselecciona los demás
function pickOne(btn, group) {
  btn.closest('.chip-row')
    .querySelectorAll('.chip')
    .forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  sel[group] = btn.textContent.trim();
}

// Actualiza el display del range de duración
function updDur() {
  const val = document.getElementById('dur').value;
  document.getElementById('durVal').textContent = val + ' días';
}
```

---

## Validación

```javascript
function validarFormulario() {
  if (sel.dest.length === 0) return 'Seleccioná al menos un destino.';
  if (sel.tipo.length === 0) return 'Seleccioná tu estilo de viaje.';
  if (!sel.pres) return 'Seleccioná un rango de presupuesto.';
  return null; // sin error
}
```

Mostrar error en `<p id="plannerError" class="form-error">` (bajo el botón).
No usar `alert()`.

---

## System prompt

**El system prompt vive en `api/itinerary.js`, no en el frontend.**
El frontend nunca lo envía — el servidor lo ignora si llegara en el body.
Ver el texto exacto en `ARCHITECTURE.md` sección `api/itinerary.js`.

## User prompt — función `buildUserPrompt()`

```javascript
function buildUserPrompt() {
  const dur = document.getElementById('dur').value;
  const sueno = document.getElementById('sueno').value.trim();

  return `Mi viaje ideal:
- Destino: ${sel.dest.join(', ')}
- Estilo: ${sel.tipo.join(', ')}
- Duración: ${dur} días
- Presupuesto por persona: ${sel.pres}
${sueno ? `- Experiencia que siempre soñé: ${sueno}` : ''}

Creá un itinerario COMPLETO con estas secciones exactas:

🌍 DESTINO RECOMENDADO
[Por qué es perfecto. 2-3 oraciones.]

🗓️ ITINERARIO DÍA A DÍA
[Día 1: ..., Día 2: ..., etc. Específico con lugares y actividades.]

✨ EXPERIENCIA ESTRELLA
[Una vivencia única que recordará toda la vida. 2-3 oraciones.]

🍽️ GASTRONOMÍA
[3 recomendaciones: nombre del plato y descripción breve.]

💡 CONSEJOS INSIDER
[3 secretos locales numerados.]

💰 PRESUPUESTO ESTIMADO
[Desglose: vuelos, hospedaje/noche, comidas/día, actividades, total estimado.]`;
}
```

---

## Page token — inicialización del planificador

El planificador obtiene el token HMAC al cargar. Sin token válido, el servidor
rechaza el request antes de llamar a Claude (ver `SECURITY.md`).

```javascript
let _pageToken = null;

async function initPlanner() {
  try {
    const res = await fetch('/api/token');
    const data = await res.json();
    _pageToken = data.token || null;
  } catch {
    _pageToken = null;
  }
}

document.addEventListener('DOMContentLoaded', initPlanner);
window.initPlanner = initPlanner;
```

---

## Llamada a la API

El campo `system` **no se envía desde el frontend** — está hardcodeado en el servidor.
El token HMAC se incluye en el header `x-page-token`.

```javascript
async function generarItinerario() {
  const errorMsg = validarFormulario();
  if (errorMsg) {
    mostrarErrorPlanner(errorMsg);
    return;
  }

  // UI: loading state
  const btn = document.getElementById('genBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Diseñando tu aventura…';
  document.getElementById('plannerError').hidden = true;
  document.getElementById('overlay').classList.add('on');
  document.getElementById('result').hidden = true;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (_pageToken) headers['x-page-token'] = _pageToken;

    const response = await fetch('/api/itinerary', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: [{ role: 'user', content: buildUserPrompt() }]
      })
    });

    if (response.status === 429) {
      mostrarErrorPlanner('Generaste demasiados itinerarios seguidos. Intentá en 1 hora.');
      return;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const texto = data.content?.[0]?.text;

    if (!texto) throw new Error('Respuesta vacía de la IA');

    const secciones = parsearItinerario(texto);
    const meta = buildMeta();
    renderItinerario(secciones, meta);

    document.getElementById('result').hidden = false;
    setTimeout(() => {
      document.getElementById('result')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

  } catch (error) {
    console.error('Error generando itinerario:', error);
    mostrarErrorPlanner('Ocurrió un error. Por favor intentá de nuevo.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>✦</span> Crear mi itinerario personalizado';
    document.getElementById('overlay').classList.remove('on');
  }
}
```

---

## Parseo del resultado — `parsearItinerario(texto)`

Divide el texto de Claude en secciones usando los emojis como delimitadores.

```javascript
const SECCIONES_CONFIG = [
  { emoji: '🌍', titulo: 'Destino Recomendado' },
  { emoji: '🗓️', titulo: 'Itinerario Día a Día' },
  { emoji: '✨', titulo: 'Experiencia Estrella' },
  { emoji: '🍽️', titulo: 'Gastronomía' },
  { emoji: '💡', titulo: 'Consejos Insider' },
  { emoji: '💰', titulo: 'Presupuesto Estimado' },
];

function parsearItinerario(texto) {
  const secciones = [];

  SECCIONES_CONFIG.forEach((config, index) => {
    const siguiente = SECCIONES_CONFIG[index + 1];
    const regex = siguiente
      ? new RegExp(`${config.emoji}[^\n]*\n([\s\S]*?)(?=${siguiente.emoji})`, 'i')
      : new RegExp(`${config.emoji}[^\n]*\n([\s\S]*)`, 'i');

    const match = texto.match(regex);
    secciones.push({
      emoji: config.emoji,
      titulo: config.titulo,
      contenido: match ? match[1].trim() : ''
    });
  });

  return secciones;
}
```

---

## Render del resultado — `renderItinerario(secciones, meta)`

```javascript
function renderItinerario(secciones, meta) {
  // Actualizar header del resultado
  document.getElementById('rDestino').textContent =
    sel.dest[0]?.replace(/^\S+\s/, '') || 'Tu destino';
  document.getElementById('rMeta').textContent = meta;

  // Limpiar cards anteriores
  const container = document.getElementById('itineraryCards');
  container.innerHTML = '';

  // Crear una card por sección
  secciones.forEach((seccion, index) => {
    if (!seccion.contenido) return;

    const card = document.createElement('div');
    card.className = 'itinerary-card';
    card.setAttribute('data-animate', 'fade-up');
    card.setAttribute('data-delay', String(index * 100));

    // Convertir saltos de línea en <br> para mejor lectura
    const contenidoHTML = seccion.contenido
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    card.innerHTML = `
      <div class="card-icon">${seccion.emoji}</div>
      <div class="card-content">
        <h3 class="card-title">${seccion.titulo}</h3>
        <div class="card-body"><p>${contenidoHTML}</p></div>
      </div>
    `;

    container.appendChild(card);

    // Observar la card recién creada para animación
    if (window.initScrollAnimations) {
      window.initScrollAnimations();
    }
  });

  // Guardar el texto plano para compartir por WhatsApp
  window._itinerarioTexto = secciones
    .filter(s => s.contenido)
    .map(s => `${s.emoji} ${s.titulo.toUpperCase()}\n${s.contenido}`)
    .join('\n\n');

  window._itinerarioMeta = meta;
}

function buildMeta() {
  const dur = document.getElementById('dur').value;
  return `${dur} días · ${sel.pres} · ${sel.tipo[0]?.replace(/^\S+\s/, '') || ''}`;
}
```

---

## HTML del resultado (reemplaza el bloque `#result` actual)

```html
<div id="result" hidden>
  <div class="result-header">
    <div class="result-badge">🗺️</div>
    <div>
      <h2 class="result-heading">
        Tu itinerario: <span id="rDestino"></span>
      </h2>
      <p class="result-meta" id="rMeta"></p>
    </div>
  </div>

  <div class="itinerary-cards" id="itineraryCards">
    <!-- Cards generadas dinámicamente -->
  </div>

  <div class="result-actions">
    <button class="btn-whatsapp-share" onclick="compartirItinerarioPorWA(window._itinerarioTexto, window._itinerarioMeta)">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Compartir por WhatsApp
    </button>
    <button class="btn-outline btn-nueva" onclick="resetPlanner()">
      ↺ Crear otro itinerario
    </button>
  </div>

  <div class="cta-contact">
    <p>¿Te encantó este itinerario? Un asesor puede hacerlo realidad.</p>
    <button onclick="goTo('#cotizacion')">Solicitar cotización gratuita →</button>
  </div>
</div>
```

---

## Reset del planificador

```javascript
function resetPlanner() {
  // Limpiar estado
  sel.dest = [];
  sel.tipo = [];
  sel.pres = '';

  // Deseleccionar todos los chips
  document.querySelectorAll('.chip.selected')
    .forEach(c => c.classList.remove('selected'));

  // Resetear range y textarea
  document.getElementById('dur').value = 7;
  document.getElementById('durVal').textContent = '7 días';
  document.getElementById('sueno').value = '';

  // Ocultar resultado
  document.getElementById('result').hidden = true;

  // Limpiar variables globales del itinerario
  window._itinerarioTexto = '';
  window._itinerarioMeta = '';

  // Scroll al inicio del planificador
  goTo('#planificador');
}
```

---

## CSS para las itinerary-cards (agregar a `styles.css`)

```css
/* Contenedor de cards */
.itinerary-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

/* Card individual */
.itinerary-card {
  display: flex;
  gap: 1rem;
  background: var(--white);
  border: 1px solid rgba(176, 146, 85, 0.15);
  border-radius: 2px;
  padding: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.itinerary-card:hover {
  box-shadow: 0 4px 20px rgba(28, 35, 64, 0.08);
}

.card-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  width: 2.5rem;
  text-align: center;
  padding-top: 2px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--navy);
  margin-bottom: 0.6rem;
}

.card-body {
  font-size: 0.9rem;
  line-height: 1.8;
  color: #444;
}

.card-body p {
  margin-bottom: 0.5rem;
}

/* Botones de acciones del resultado */
.result-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.btn-whatsapp-share {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #25D366;
  color: #fff;
  border: none;
  padding: 0.85rem 1.8rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 1px;
  transition: background 0.25s ease, transform 0.2s ease;
}

.btn-whatsapp-share:hover {
  background: #128C7E;
  transform: translateY(-2px);
}

.btn-nueva {
  background: transparent;
  color: var(--navy);
  border: 1px solid rgba(28, 35, 64, 0.25);
  padding: 0.85rem 1.8rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 1px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.btn-nueva:hover {
  border-color: var(--gold);
  color: var(--gold);
}

/* Error inline del planificador */
.form-error {
  color: #c0392b;
  font-size: 0.82rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .itinerary-card {
    flex-direction: column;
    gap: 0.5rem;
  }
  .result-actions {
    flex-direction: column;
  }
}
```

---

## Acceptance criteria

- [ ] El formulario valida antes de enviar (error inline, sin `alert()`)
- [ ] La llamada va a `/api/itinerary`, nunca a Anthropic directamente
- [ ] El resultado se muestra como cards separadas por sección
- [ ] Cada card tiene animación de entrada con stagger delay
- [ ] El botón "Compartir por WhatsApp" está visible en el resultado
- [ ] El overlay aparece durante la generación y desaparece al terminar
- [ ] En error de red: mensaje visible sin romper la página
- [ ] Reset limpia selecciones, chips y scroll al formulario
- [ ] `window._itinerarioTexto` contiene el texto plano para WA
- [ ] El body del POST **no contiene** campo `system`
- [ ] El header `x-page-token` se incluye en el POST (obtenido de `GET /api/token`)
- [ ] El textarea `#sueno` tiene `maxlength="300"`
- [ ] Error 429 muestra mensaje amigable sin romper la UI
