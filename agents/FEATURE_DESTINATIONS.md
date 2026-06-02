# Feature: Pack de Destinos

## Archivos
- `data/destinations.json` — pack de destinos activo
- `public/js/destinations.js` — carga y renderiza las cards

## Descripción
Los destinos del grid no están hardcodeados en el HTML.
Se cargan desde `destinations.json`, que puede reemplazarse
periódicamente (mensual o por pedido del cliente) sin tocar código.

---

## Estructura de `data/destinations.json`

```json
{
  "pack": {
    "nombre": "Destinos Soñados — Vol. 1",
    "activo_hasta": "2025-09-01",
    "descripcion": "Una selección de destinos para mitad de 2025"
  },
  "destinos": [
    {
      "id": "santorini",
      "nombre": "Santorini",
      "region": "Grecia · Europa",
      "descripcion": "Atardeceres míticos sobre el Egeo, casas blancas y vinos volcánicos únicos en el mundo.",
      "imagen_url": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80",
      "tags": ["romántico", "playa", "lujo", "gastronomía"]
    }
  ]
}
```

El array `destinos` puede tener entre 3 y 9 elementos.
El grid se adapta automáticamente con `auto-fit`.

---

## `destinations.js`

```javascript
/**
 * destinations.js
 * Carga data/destinations.json y renderiza las cards del grid.
 */

// Fallback: los 6 destinos del HTML original
// Se usa si el fetch falla (offline, error de red)
const DESTINOS_FALLBACK = [
  {
    id: 'santorini',
    nombre: 'Santorini',
    region: 'Grecia · Europa',
    descripcion: 'Atardeceres míticos sobre el Egeo, casas blancas y vinos volcánicos únicos en el mundo.',
    imagen_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80',
    tags: ['romántico', 'playa', 'lujo']
  },
  {
    id: 'bali',
    nombre: 'Bali',
    region: 'Indonesia · Asia',
    descripcion: 'Templos entre arrozales, playas de arena negra y una espiritualidad que transforma el alma.',
    imagen_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80',
    tags: ['espiritual', 'naturaleza', 'cultura']
  },
  {
    id: 'patagonia',
    nombre: 'Patagonia',
    region: 'Argentina & Chile',
    descripcion: 'Torres de granito, glaciares eternos y una naturaleza que te deja sin palabras.',
    imagen_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80',
    tags: ['naturaleza', 'aventura', 'trekking']
  },
  {
    id: 'kioto',
    nombre: 'Kioto',
    region: 'Japón · Asia',
    descripcion: 'Geishas, templos dorados, jardines zen y cerezos en flor: el Japón eterno.',
    imagen_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80',
    tags: ['cultura', 'historia', 'gastronomía']
  },
  {
    id: 'marrakech',
    nombre: 'Marrakech',
    region: 'Marruecos · África',
    descripcion: 'Zoco laberíntico, palacios de mosaico y el perfume del jazmín al anochecer.',
    imagen_url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80',
    tags: ['cultura', 'gastronomía', 'historia']
  },
  {
    id: 'maldivas',
    nombre: 'Maldivas',
    region: 'Océano Índico',
    descripcion: 'Bungalows sobre el agua cristalina, arrecifes de coral y el azul más puro del planeta.',
    imagen_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=80',
    tags: ['lujo', 'playa', 'romántico']
  }
];

async function cargarDestinos() {
  try {
    const res = await fetch('/data/destinations.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderizarDestinos(data.destinos);
  } catch (e) {
    console.warn('No se pudo cargar destinations.json, usando fallback:', e);
    renderizarDestinos(DESTINOS_FALLBACK);
  }
}

function renderizarDestinos(destinos) {
  const grid = document.getElementById('destGrid');
  if (!grid) return;

  grid.innerHTML = '';

  destinos.forEach((d, index) => {
    const card = document.createElement('div');
    card.className = 'destino-card';
    card.setAttribute('data-animate', 'fade-up');
    card.setAttribute('data-delay', String(Math.min(index * 100, 500)));

    card.innerHTML = `
      <img
        src="${d.imagen_url}"
        alt="${d.nombre} — ${d.region}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&q=80'"
      >
      <div class="destino-overlay">
        <div class="destino-region">${d.region}</div>
        <div class="destino-name">${d.nombre}</div>
        <div class="destino-desc">${d.descripcion}</div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Registrar las nuevas cards en el IntersectionObserver
  if (window.initScrollAnimations) {
    window.initScrollAnimations();
  }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', cargarDestinos);
```

---

## Workflow para actualizar el pack

1. Editar `data/destinations.json` con los nuevos destinos
2. Commit: `git commit -m "Actualiza pack de destinos Vol. X"`
3. Push a `main`
4. Vercel hace deploy automático en ~30 segundos
5. El sitio muestra los nuevos destinos sin tocar código

---

## Acceptance criteria

- [ ] Los destinos se cargan desde `data/destinations.json` via fetch
- [ ] Si el fetch falla, se muestran los 6 destinos de fallback
- [ ] Las cards reciben `data-animate="fade-up"` y `data-delay` correcto
- [ ] Las imágenes tienen `onerror` con imagen fallback de Unsplash
- [ ] Cambiar el JSON y hacer push actualiza los destinos en producción
- [ ] El grid se adapta a cualquier cantidad de destinos (3 a 9)
- [ ] `window.initScrollAnimations` se llama después de insertar las cards
