const DESTINOS_FALLBACK = [
  { id: 'maldivas', nombre: 'Maldivas', region: 'Océano Índico',
    descripcion: 'Bungalows sobre el agua turquesa y arrecifes de coral: la imagen más icónica del paraíso tropical.',
    imagen_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=80', tags: ['lujo','playa','romántico'] },
  { id: 'bali', nombre: 'Bali', region: 'Indonesia · Asia',
    descripcion: "La 'Isla de los Dioses' combina templos milenarios, arrozales en terrazas y una espiritualidad única.",
    imagen_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80', tags: ['espiritual','naturaleza','cultura'] },
  { id: 'santorini', nombre: 'Santorini', region: 'Grecia · Europa',
    descripcion: 'Cúpulas azules sobre acantilados blancos y atardeceres desde Oia que son, literalmente, mágicos.',
    imagen_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80', tags: ['romántico','playa','lujo'] },
  { id: 'holbox', nombre: 'Holbox', region: 'México · Caribe',
    descripcion: 'Una isla sin autos en el norte de Yucatán, con arena blanca suave y flamencos rosados entre los bañistas.',
    imagen_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=80', tags: ['playa','naturaleza'] },
  { id: 'maragogi', nombre: 'Maragogi', region: 'Brasil · Noreste',
    descripcion: "El 'Caribe brasileño': piscinas naturales de agua cristalina formadas por arrecifes de coral.",
    imagen_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80', tags: ['playa','naturaleza'] },
  { id: 'maya-bay', nombre: 'Maya Bay', region: 'Tailandia · Asia',
    descripcion: 'Acantilados de piedra caliza en las islas Phi Phi, hoy más radiante que nunca tras su recuperación.',
    imagen_url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=700&q=80', tags: ['playa','aventura'] },
  { id: 'praga', nombre: 'Praga', region: 'República Checa · Europa',
    descripcion: 'Un cuento de hadas medieval: gótico, barroco y art nouveau en un centro histórico Patrimonio UNESCO.',
    imagen_url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=700&q=80', tags: ['historia','cultura'] },
  { id: 'costa-amalfitana', nombre: 'Costa Amalfitana', region: 'Italia · Europa',
    descripcion: 'Pueblos de colores pegados a acantilados, limoneros perfumados y la Italia más dramática y bella.',
    imagen_url: 'https://images.unsplash.com/photo-1555990793-da11153b6c89?w=700&q=80', tags: ['romántico','gastronomía'] },
  { id: 'bayahibe', nombre: 'Bayahibe', region: 'República Dominicana · Caribe',
    descripcion: 'Playas vírgenes del Caribe auténtico: Playa Dominicus e isla Saona en el sureste dominicano.',
    imagen_url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=700&q=80', tags: ['playa','auténtico'] },
  { id: 'islandia', nombre: 'Auroras en Islandia', region: 'Islandia · Europa',
    descripcion: 'La aurora boreal bailando sobre glaciares y géiseres: luces verdes, violetas y rosas en el cielo.',
    imagen_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=80', tags: ['naturaleza','único'] },
  { id: 'japon', nombre: 'Japón', region: 'Asia',
    descripcion: 'Tradición milenaria y tecnología futurista en armonía: de los templos de Kioto a los neones de Tokio.',
    imagen_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=80', tags: ['cultura','gastronomía'] },
  { id: 'capadocia', nombre: 'Capadocia', region: 'Turquía · Asia',
    descripcion: 'Chimeneas de hadas, iglesias rupestres y el vuelo en globo al amanecer más icónico del mundo.',
    imagen_url: 'https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=700&q=80', tags: ['único','aventura'] },
  { id: 'vietnam', nombre: 'Vietnam', region: 'Asia · Sudeste',
    descripcion: 'La bahía de Halong, arrozales de Sapa, el casco antiguo de Hoi An y la energía de Ho Chi Minh.',
    imagen_url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=700&q=80', tags: ['cultura','naturaleza'] },
  { id: 'galapagos', nombre: 'Galápagos', region: 'Ecuador · Pacífico',
    descripcion: 'El laboratorio vivo de Darwin: iguanas marinas, pingüinos y tortugas gigantes sin miedo a los humanos.',
    imagen_url: 'https://images.unsplash.com/photo-1506799964541-c7117a42cc22?w=700&q=80', tags: ['naturaleza','fauna'] },
  { id: 'nueva-york', nombre: 'Nueva York', region: 'Estados Unidos · América',
    descripcion: 'Arte, gastronomía, cultura y energía pura desde el skyline de Manhattan hasta los mercados de Brooklyn.',
    imagen_url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=700&q=80', tags: ['cultura','moderno'] },
  { id: 'miami', nombre: 'Miami', region: 'Estados Unidos · América',
    descripcion: 'Sol, arte y ritmo latino entre Miami Beach, Wynwood, Little Havana y la arquitectura art déco.',
    imagen_url: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=700&q=80', tags: ['playa','cultura'] },
  { id: 'patagonia', nombre: 'Patagonia Argentina', region: 'Argentina · Sudamérica',
    descripcion: 'Glaciares del Perito Moreno, torres del Chaltén y lagos turquesa en el fin del mundo.',
    imagen_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80', tags: ['naturaleza','aventura'] },
  { id: 'salta-jujuy', nombre: 'Salta y Jujuy', region: 'Argentina · Noroeste',
    descripcion: 'La Quebrada de Humahuaca, montañas ocres y púrpuras, y la cultura andina viva del norte argentino.',
    imagen_url: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=700&q=80', tags: ['cultura','naturaleza'] },
  { id: 'cruceros', nombre: 'Cruceros', region: 'Mediterráneo · Caribe · Fiordos',
    descripcion: 'Un hotel de lujo que cambia de paisaje cada día: Mediterráneo, Caribe o fiordos noruegos.',
    imagen_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=700&q=80', tags: ['lujo','familia'] },
  { id: 'rio-de-janeiro', nombre: 'Río de Janeiro', region: 'Brasil · Sudamérica',
    descripcion: 'El Cristo Redentor, Copacabana, Ipanema y el carnaval más famoso del planeta: la Cidade Maravilhosa.',
    imagen_url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=700&q=80', tags: ['cultura','playa'] },
  { id: 'barcelona', nombre: 'Barcelona', region: 'España · Europa',
    descripcion: 'Gaudí en cada rincón —Sagrada Família, Park Güell, Casa Batlló— y una ciudad que lo tiene todo.',
    imagen_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=700&q=80', tags: ['cultura','gastronomía'] },
  { id: 'paris', nombre: 'París', region: 'Francia · Europa',
    descripcion: 'Museos de clase mundial, bulevares elegantes y la Torre Eiffel iluminándose cada noche como ninguna otra.',
    imagen_url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=700&q=80', tags: ['romántico','cultura'] }
];

const MOSTRAR_DESKTOP = 8;
const PERIODO_DIAS = 5;

function seleccionarDestinosPeriodo(destinos) {
  const msPorPeriodo = PERIODO_DIAS * 24 * 60 * 60 * 1000;
  const periodoIndex = Math.floor(Date.now() / msPorPeriodo);
  const startIndex = (periodoIndex * MOSTRAR_DESKTOP) % destinos.length;
  const seleccionados = [];
  for (let i = 0; i < MOSTRAR_DESKTOP; i++) {
    seleccionados.push(destinos[(startIndex + i) % destinos.length]);
  }
  return seleccionados;
}

async function cargarDestinos() {
  try {
    const res = await fetch('/data/destinations.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderizarDestinos(seleccionarDestinosPeriodo(data.destinos));
  } catch (e) {
    console.warn('No se pudo cargar destinations.json, usando fallback:', e);
    renderizarDestinos(seleccionarDestinosPeriodo(DESTINOS_FALLBACK));
  }
}

function renderizarDestinos(destinos) {
  const grid = document.getElementById('destGrid');
  if (!grid) return;

  grid.innerHTML = '';

  destinos.forEach((d, index) => {
    const card = document.createElement('div');
    card.className = 'destino-card';
    if (index >= 4) card.classList.add('destino-extra');
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
