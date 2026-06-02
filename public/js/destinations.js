const DESTINOS_FALLBACK = [
  {
    id: 'santorini', nombre: 'Santorini', region: 'Grecia · Europa',
    descripcion: 'Atardeceres míticos sobre el Egeo, casas blancas y vinos volcánicos únicos en el mundo.',
    imagen_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80',
    tags: ['romántico', 'playa', 'lujo']
  },
  {
    id: 'bali', nombre: 'Bali', region: 'Indonesia · Asia',
    descripcion: 'Templos entre arrozales, playas de arena negra y una espiritualidad que transforma el alma.',
    imagen_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80',
    tags: ['espiritual', 'naturaleza', 'cultura']
  },
  {
    id: 'patagonia', nombre: 'Patagonia', region: 'Argentina & Chile',
    descripcion: 'Torres de granito, glaciares eternos y una naturaleza que te deja sin palabras.',
    imagen_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80',
    tags: ['naturaleza', 'aventura', 'trekking']
  },
  {
    id: 'kioto', nombre: 'Kioto', region: 'Japón · Asia',
    descripcion: 'Geishas, templos dorados, jardines zen y cerezos en flor: el Japón eterno.',
    imagen_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80',
    tags: ['cultura', 'historia', 'gastronomía']
  },
  {
    id: 'marrakech', nombre: 'Marrakech', region: 'Marruecos · África',
    descripcion: 'Zoco laberíntico, palacios de mosaico y el perfume del jazmín al anochecer.',
    imagen_url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80',
    tags: ['cultura', 'gastronomía', 'historia']
  },
  {
    id: 'maldivas', nombre: 'Maldivas', region: 'Océano Índico',
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

  if (window.initScrollAnimations) {
    window.initScrollAnimations();
  }
}

document.addEventListener('DOMContentLoaded', cargarDestinos);
