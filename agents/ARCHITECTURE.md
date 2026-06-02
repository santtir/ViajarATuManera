# Architecture

## Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | HTML5 + CSS3 + JS Vanilla | Sin framework, portfolio simple |
| Serverless | Vercel Functions (Node.js 20) | Proxy seguro para API key |
| IA | Claude Sonnet 4.6 (`claude-sonnet-4-6`) | Ya contratado |
| Email | Formsubmit (AJAX mode) | Sin backend propio necesario |
| Hosting | Vercel (free tier) | Deploy automático desde GitHub |
| Repositorio | GitHub (público) | Portfolio del developer |
| Dominio | NIC.AR `.tur.ar` | Apuntar DNS a Vercel post-compra |

---

## Estructura de archivos final

```
viajar-a-tu-manera/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── main.js
│       ├── animations.js
│       ├── destinations.js
│       ├── whatsapp.js
│       ├── cotizacion.js
│       └── planner.js
├── data/
│   └── destinations.json
├── api/
│   └── itinerary.js
├── agents/
│   └── *.md
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

---

## Variables de entorno

```
ANTHROPIC_API_KEY=sk-ant-...
PAGE_TOKEN_SECRET=<openssl rand -hex 32>
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
ALLOWED_ORIGIN=https://viajaratumanera.tur.ar
```

- Se configuran en: Vercel Dashboard → Project → Settings → Environment Variables
- **Nunca** van en código fuente ni en el repositorio
- `.env.example` contiene solo los nombres (sin valores reales)
- `.gitignore` incluye `.env` y `.env.local`
- Ver `SECURITY.md` para el setup completo de cada variable

---

## Proxy serverless — `api/itinerary.js`

El frontend llama a `/api/itinerary` (ruta relativa, nunca a Anthropic directamente).
Vercel enruta `/api/*` a las funciones serverless.

El sistema prompt está **hardcodeado en el servidor** — el frontend nunca lo envía.
Cada request pasa por 5 validaciones antes de llegar a Claude (ver `SECURITY.md`).

```javascript
// api/itinerary.js
import crypto from 'crypto';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const SYSTEM_PROMPT = `Eres el asesor experto de "Viajar A Tu Manera", agencia de turismo personalizado.
Respondés siempre en español. Sos cálido, inspirador y experto.
Generás itinerarios detallados y realistas con el tono de un guía de viajes de lujo.
No uses asteriscos para negrita. Separar secciones con el emoji y título indicado.`;

const RATE_LIMIT = 5;
const RATE_WINDOW = 3600;       // segundos (1 hora)
const MAX_INPUT_CHARS = 1500;
const TOKEN_WINDOW_MIN = 30;    // minutos de validez del page token

function verifyPageToken(token) {
  const secret = process.env.PAGE_TOKEN_SECRET;
  if (!secret || !token || typeof token !== 'string' || token.length !== 64) return false;
  const w = Math.floor(Date.now() / (TOKEN_WINDOW_MIN * 60 * 1000));
  for (const win of [w, w - 1]) {
    const expected = crypto.createHmac('sha256', secret).update(String(win)).digest('hex');
    try {
      if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) return true;
    } catch { /* ignorar */ }
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. CORS / Origin check
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '';
  const origin = req.headers['origin'];
  if (allowedOrigin && origin && origin !== allowedOrigin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // 2. Verificar page token HMAC
  const token = req.headers['x-page-token'];
  if (!verifyPageToken(token)) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  // 3. Rate limit por IP (5 req / hora)
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const key = `rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, RATE_WINDOW);
  if (count > RATE_LIMIT) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intentá en 1 hora.' });
  }

  // 4. Validar body
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // 5. Validar longitud del input
  const userContent = messages.find(m => m.role === 'user')?.content || '';
  if (typeof userContent !== 'string' || userContent.length > MAX_INPUT_CHARS) {
    return res.status(400).json({ error: 'Input demasiado largo' });
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
        system: SYSTEM_PROMPT,
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

## Token de página — `api/token.js`

Genera el HMAC que el frontend necesita para poder llamar a `/api/itinerary`.
El token es válido durante 30 minutos y no requiere base de datos.

```javascript
// api/token.js
import crypto from 'crypto';

const TOKEN_WINDOW_MIN = 30;

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.PAGE_TOKEN_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const w = Math.floor(Date.now() / (TOKEN_WINDOW_MIN * 60 * 1000));
  const token = crypto.createHmac('sha256', secret).update(String(w)).digest('hex');

  return res.status(200).json({ token });
}
```

---

## `vercel.json`

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

---

## `package.json`

```json
{
  "name": "viajar-a-tu-manera",
  "version": "1.0.0",
  "description": "Sitio web agencia de turismo personalizado",
  "private": true,
  "engines": {
    "node": "20.x"
  },
  "dependencies": {
    "@upstash/redis": "^1.34.0"
  }
}
```

---

## `.gitignore`

```
.env
.env.local
.vercel
node_modules/
.DS_Store
Thumbs.db
```

---

## CSS Variables del proyecto (no modificar)

```css
:root {
  --navy:       #1C2340;
  --gold:       #B09255;
  --gold-light: #C8AB72;
  --cream:      #FAF8F4;
  --white:      #FFFFFF;
  --muted:      #8A8A8A;
  --dark:       #111827;
}
```

Todos los estilos nuevos usan estas variables. Nunca hardcodear colores.

---

## Carga de scripts en `index.html`

El orden de carga importa. Al final del `<body>`, antes de `</body>`:

```html
<script src="/js/main.js"></script>
<script src="/js/animations.js"></script>
<script src="/js/destinations.js"></script>
<script src="/js/whatsapp.js"></script>
<script src="/js/cotizacion.js"></script>
<script src="/js/planner.js"></script>
```

`main.js` primero porque define `WA_NUMERO` y `goTo()` que usan los demás.

---

## Deploy inicial — pasos para el developer

1. Crear cuenta en vercel.com usando GitHub
2. "New Project" → seleccionar el repositorio
3. Vercel detecta `vercel.json` automáticamente
4. Settings → Environment Variables → agregar `ANTHROPIC_API_KEY`
5. Deploy automático en cada push a `main`

## Configuración de dominio NIC.AR → Vercel

Una vez comprado el dominio en NIC.AR:

1. En Vercel: Project → Settings → Domains → agregar `nombre.tur.ar`
2. Vercel muestra los valores DNS a agregar
3. En NIC.AR: panel de gestión → DNS → agregar los registros indicados por Vercel
4. Propagación DNS: 24–48 horas
