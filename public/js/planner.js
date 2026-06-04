const sel = { dest: [], tipo: [], pres: '', pax: '' };
const MAX_CHIPS = { dest: 3, tipo: 3 };
let _pageToken = null;

const SECCIONES_CONFIG = [
  { emoji: '🌍', titulo: 'Destino Recomendado' },
  { emoji: '🗓️', titulo: 'Itinerario Día a Día' },
  { emoji: '✨', titulo: 'Experiencia Estrella' },
  { emoji: '🍽️', titulo: 'Gastronomía' },
  { emoji: '💡', titulo: 'Consejos Insider' },
  // { emoji: '💰', titulo: 'Presupuesto Estimado' }, // desactivado temporalmente
];

// ─── Token de página ──────────────────────────────────────────

async function initPlanner() {
  try {
    const res = await fetch('/api/token');
    const data = await res.json();
    _pageToken = data.token || null;
  } catch {
    _pageToken = null;
  }
}

// ─── Chips ────────────────────────────────────────────────────

function pick(btn, group) {
  const isSelected = btn.classList.contains('selected');
  if (!isSelected && sel[group].length >= (MAX_CHIPS[group] || 5)) {
    const row = btn.closest('.chip-row');
    row.classList.add('chips-max');
    setTimeout(() => row.classList.remove('chips-max'), 600);
    return;
  }
  btn.classList.toggle('selected');
  const v = btn.textContent.trim();
  if (btn.classList.contains('selected')) {
    sel[group].push(v);
  } else {
    sel[group] = sel[group].filter(x => x !== v);
  }
}

function pickOne(btn, group) {
  btn.closest('.chip-row')
    .querySelectorAll('.chip')
    .forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  sel[group] = btn.textContent.trim();
}

function updDur() {
  const input = document.getElementById('dur');
  const min = Number(input.min) || 1;
  const max = Number(input.max) || 30;
  const val = Math.min(max, Math.max(min, Number(input.value) || min));
  input.value = val;
  document.getElementById('durVal').textContent = val === 1 ? '1 día' : val + ' días';
  document.querySelectorAll('.duration-presets button').forEach(btn => {
    btn.classList.toggle('active', Number(btn.textContent) === val);
  });
}

function setDur(value) {
  document.getElementById('dur').value = value;
  updDur();
}

function stepDur(delta) {
  const input = document.getElementById('dur');
  setDur((Number(input.value) || 1) + delta);
}

// ─── Validación ───────────────────────────────────────────────

function validarFormulario() {
  if (sel.dest.length === 0) return 'Seleccioná al menos un destino.';
  if (sel.tipo.length === 0) return 'Seleccioná tu estilo de viaje.';
  if (!sel.pres) return 'Seleccioná un rango de presupuesto.';
  if (!sel.pax) return 'Seleccioná la cantidad de personas.';
  return null;
}

// ─── Prompt ───────────────────────────────────────────────────

function buildUserPrompt() {
  const dur   = document.getElementById('dur').value;
  const sueno = document.getElementById('sueno').value.trim();

  // 💰 PRESUPUESTO ESTIMADO desactivado temporalmente — descomentar cuando se reactive
  return `Mi viaje ideal:
- Destino: ${sel.dest.join(', ')}
- Estilo: ${sel.tipo.join(', ')}
- Duración: ${dur} días
- Personas: ${sel.pax}
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
[3 secretos locales numerados.]`;
}

// ─── Llamada a la API ─────────────────────────────────────────

async function generarItinerario() {
  const errorMsg = validarFormulario();
  if (errorMsg) {
    mostrarErrorPlanner(errorMsg);
    return;
  }

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

// ─── Parseo ───────────────────────────────────────────────────

function parsearItinerario(texto) {
  const secciones = [];

  SECCIONES_CONFIG.forEach((config, index) => {
    const siguiente = SECCIONES_CONFIG[index + 1];
    const regex = siguiente
      ? new RegExp(`${config.emoji}[^\n]*\n([\\s\\S]*?)(?=${siguiente.emoji})`, 'i')
      : new RegExp(`${config.emoji}[^\n]*\n([\\s\\S]*)`, 'i');

    const match = texto.match(regex);
    secciones.push({
      emoji: config.emoji,
      titulo: config.titulo,
      contenido: match ? match[1].trim() : ''
    });
  });

  return secciones;
}

// ─── Render ───────────────────────────────────────────────────

function renderItinerario(secciones, meta) {
  document.getElementById('rDestino').textContent =
    sel.dest[0]?.replace(/^\S+\s/, '') || 'Tu destino';
  document.getElementById('rMeta').textContent = meta;

  const container = document.getElementById('itineraryCards');
  container.innerHTML = '';

  secciones.forEach((seccion, index) => {
    if (!seccion.contenido) return;

    const card = document.createElement('div');
    card.className = 'itinerary-card';
    card.setAttribute('data-animate', 'fade-up');
    card.setAttribute('data-delay', String(index * 100));

    const contenidoHTML = seccion.contenido
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
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
  });

  if (window.initScrollAnimations) {
    window.initScrollAnimations();
  }

  window._itinerarioTexto = secciones
    .filter(s => s.contenido)
    .map(s => `${s.emoji} ${s.titulo.toUpperCase()}\n${s.contenido}`)
    .join('\n\n');

  window._itinerarioMeta  = meta;
  window._itinerarioDest  = sel.dest.map(d => d.replace(/^\S+\s/, '')).join(', ');
  window._itinerarioResumen = secciones.find(s => s.titulo === 'Itinerario Día a Día')?.contenido || '';
}

function buildMeta() {
  const dur = document.getElementById('dur').value;
  return `${dur} días · ${sel.pres} · ${sel.tipo[0]?.replace(/^\S+\s/, '') || ''}`;
}

// ─── Error / Reset ────────────────────────────────────────────

function mostrarErrorPlanner(msg) {
  const el = document.getElementById('plannerError');
  el.textContent = msg;
  el.hidden = false;
}

function resetPlanner() {
  sel.dest = [];
  sel.tipo = [];
  sel.pres = '';

  document.querySelectorAll('.chip.selected')
    .forEach(c => c.classList.remove('selected'));

  document.getElementById('dur').value = 7;
  updDur();
  document.getElementById('sueno').value = '';
  document.getElementById('result').hidden = true;

  window._itinerarioTexto   = '';
  window._itinerarioMeta    = '';
  window._itinerarioDest    = '';
  window._itinerarioResumen = '';

  goTo('#planificador');
}

// ─── Inicialización ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', initPlanner);
document.addEventListener('DOMContentLoaded', updDur);

window.pick              = pick;
window.pickOne           = pickOne;
window.updDur            = updDur;
window.setDur            = setDur;
window.stepDur           = stepDur;
window.generarItinerario = generarItinerario;
window.resetPlanner      = resetPlanner;
window.initPlanner       = initPlanner;
