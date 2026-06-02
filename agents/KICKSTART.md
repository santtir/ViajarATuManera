# KICKSTART — Viajar A Tu Manera

> **Este es el primer archivo que Codex debe leer.**
> No escribas ninguna línea de código hasta completar todos los pasos de este archivo.
> Una vez terminado el kickstart, continuar con `TASKS.md`.

---

## Contexto del proyecto

Sitio web para agencia de turismo "Viajar A Tu Manera".
El punto de partida es un único archivo `index.html` (HTML + CSS + JS inline).
El objetivo del kickstart es transformar ese archivo en un proyecto estructurado
listo para Vercel, con carpetas separadas para CSS, JS, datos y funciones serverless.

El HTML original se encuentra en la raíz del repositorio como `index.html`.
**No modificar el HTML todavía.** Solo crear la estructura.

---

## Paso 1 — Leer todos los archivos de la carpeta `agents/`

Antes de crear nada, leer en este orden:

1. `OVERVIEW.md`
2. `ARCHITECTURE.md`
3. `CONVENTIONS.md`
4. `FEATURE_PLANNER.md`
5. `FEATURE_COTIZACION.md`
6. `FEATURE_WHATSAPP.md`
7. `FEATURE_ANIMATIONS.md`
8. `FEATURE_DESTINATIONS.md`
9. `TASKS.md`

---

## Paso 2 — Crear la estructura de carpetas

Crear exactamente esta estructura desde la raíz del proyecto:

```
viajar-a-tu-manera/          ← raíz del repo (ya existe)
├── public/
│   ├── css/
│   └── js/
├── data/
├── api/
└── agents/                  ← ya existe (acá están los .md)
```

Comandos:
```bash
mkdir -p public/css
mkdir -p public/js
mkdir -p data
mkdir -p api
```

---

## Paso 3 — Crear archivos de configuración base

### `package.json`
```json
{
  "name": "viajar-a-tu-manera",
  "version": "1.0.0",
  "description": "Sitio web agencia de turismo personalizado",
  "private": true,
  "engines": {
    "node": "20.x"
  }
}
```

### `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "",
  "outputDirectory": "public",
  "functions": {
    "api/*.js": {
      "runtime": "nodejs20.x"
    }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

### `.gitignore`
```
.env
.env.local
.vercel
node_modules/
.DS_Store
Thumbs.db
```

### `.env.example`
```
# Copiar este archivo como .env.local y completar con el valor real
# NUNCA commitear el archivo .env.local
ANTHROPIC_API_KEY=
```

---

## Paso 4 — Crear archivos JS vacíos con comentario de encabezado

Crear cada archivo con solo el comentario de encabezado.
El contenido real se implementa en las tasks correspondientes.

### `public/js/main.js`
```javascript
/**
 * main.js
 * Funciones globales compartidas, constantes e inicialización del nav.
 * Ver: agents/TASKS.md — TASK-05
 */
```

### `public/js/animations.js`
```javascript
/**
 * animations.js
 * Intersection Observer para animaciones de scroll.
 * Expone window.initScrollAnimations()
 * Ver: agents/FEATURE_ANIMATIONS.md — agents/TASKS.md TASK-06
 */
```

### `public/js/destinations.js`
```javascript
/**
 * destinations.js
 * Carga data/destinations.json y renderiza las cards de destinos.
 * Ver: agents/FEATURE_DESTINATIONS.md — agents/TASKS.md TASK-07
 */
```

### `public/js/whatsapp.js`
```javascript
/**
 * whatsapp.js
 * Funciones de integración con WhatsApp.
 * Expone: window.abrirWhatsAppGeneral(), window.compartirItinerarioPorWA()
 * Ver: agents/FEATURE_WHATSAPP.md — agents/TASKS.md TASK-08
 */
```

### `public/js/cotizacion.js`
```javascript
/**
 * cotizacion.js
 * Manejo del formulario de cotización via Formsubmit.
 * Expone: window.enviarCotizacion()
 * Ver: agents/FEATURE_COTIZACION.md — agents/TASKS.md TASK-09
 */
```

### `public/js/planner.js`
```javascript
/**
 * planner.js
 * Planificador de itinerarios con IA (Claude Sonnet 4.6).
 * Llama a /api/itinerary (proxy serverless, nunca a Anthropic directamente).
 * Ver: agents/FEATURE_PLANNER.md — agents/TASKS.md TASK-10
 */
```

---

## Paso 5 — Crear archivo de datos de destinos

### `data/destinations.json`

Usar los 6 destinos que están hardcodeados en el HTML original.
Estructura exacta según `agents/FEATURE_DESTINATIONS.md`.

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
    },
    {
      "id": "bali",
      "nombre": "Bali",
      "region": "Indonesia · Asia",
      "descripcion": "Templos entre arrozales, playas de arena negra y una espiritualidad que transforma el alma.",
      "imagen_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80",
      "tags": ["espiritual", "naturaleza", "cultura", "aventura"]
    },
    {
      "id": "patagonia",
      "nombre": "Patagonia",
      "region": "Argentina & Chile",
      "descripcion": "Torres de granito, glaciares eternos y una naturaleza que te deja sin palabras.",
      "imagen_url": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80",
      "tags": ["naturaleza", "aventura", "trekking", "paisajes"]
    },
    {
      "id": "kioto",
      "nombre": "Kioto",
      "region": "Japón · Asia",
      "descripcion": "Geishas, templos dorados, jardines zen y cerezos en flor: el Japón eterno.",
      "imagen_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80",
      "tags": ["cultura", "historia", "gastronomía", "espiritual"]
    },
    {
      "id": "marrakech",
      "nombre": "Marrakech",
      "region": "Marruecos · África",
      "descripcion": "Zoco laberíntico, palacios de mosaico y el perfume del jazmín al anochecer.",
      "imagen_url": "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80",
      "tags": ["cultura", "gastronomía", "historia", "exótico"]
    },
    {
      "id": "maldivas",
      "nombre": "Maldivas",
      "region": "Océano Índico",
      "descripcion": "Bungalows sobre el agua cristalina, arrecifes de coral y el azul más puro del planeta.",
      "imagen_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=80",
      "tags": ["lujo", "playa", "romántico", "buceo"]
    }
  ]
}
```

---

## Paso 6 — Crear el proxy serverless

### `api/itinerary.js`

```javascript
/**
 * api/itinerary.js
 * Proxy serverless entre el frontend y la API de Anthropic.
 * La API key vive en las variables de entorno de Vercel, nunca en el cliente.
 */

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  // Validación básica
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: system || '',
        messages
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## Paso 7 — Copiar `index.html` a `public/`

```bash
cp index.html public/index.html
```

El archivo original en la raíz se puede dejar como backup o eliminar.
A partir de ahora, el HTML de trabajo es `public/index.html`.

---

## Paso 8 — Verificación del kickstart

Antes de continuar con `TASKS.md`, verificar que existe la siguiente estructura:

```
.
├── public/
│   ├── css/              (vacía)
│   ├── js/
│   │   ├── main.js
│   │   ├── animations.js
│   │   ├── destinations.js
│   │   ├── whatsapp.js
│   │   ├── cotizacion.js
│   │   └── planner.js
│   └── index.html
├── data/
│   └── destinations.json
├── api/
│   └── itinerary.js
├── agents/
│   ├── KICKSTART.md
│   ├── OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── CONVENTIONS.md
│   ├── FEATURE_PLANNER.md
│   ├── FEATURE_COTIZACION.md
│   ├── FEATURE_WHATSAPP.md
│   ├── FEATURE_ANIMATIONS.md
│   ├── FEATURE_DESTINATIONS.md
│   └── TASKS.md
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

Si la estructura es correcta: **continuar con `TASKS.md`, empezando por TASK-02.**
(TASK-01 ya fue completada por este kickstart.)

---

## Notas importantes para Codex

- El modelo de IA a usar es **`claude-sonnet-4-6`** (no versiones anteriores)
- La API key **nunca** va en código cliente ni en el repositorio
- Todas las funciones JS que se llaman desde el HTML deben ser globales (`window.fn = fn`)
- No usar `alert()` en ningún caso — los errores son siempre inline en el DOM
- Respetar el sistema de colores CSS variables definido en `ARCHITECTURE.md`
