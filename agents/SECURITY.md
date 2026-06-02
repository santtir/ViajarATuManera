# Seguridad — Protección contra Inference Theft

## Concepto

En apps con IA, además de proteger los datos del usuario existe el riesgo de
**inference theft**: alguien usa el endpoint de IA de tu app para consumir tokens
sin autorización mientras vos pagás la cuenta.

El endpoint `/api/itinerary` es el único vector de costo real del proyecto.
Cada request exitoso llama a Claude y consume créditos de Anthropic.

---

## Las 4 capas de defensa

### Capa 1 — Spending limit en Anthropic Console *(la más importante)*

Es la única defensa que no depende de código. Opera a nivel de billing.

**Configurar en:** [console.anthropic.com](https://console.anthropic.com) → Billing → Spending limits

- Setear límite mensual: **$10 USD**
- Costo estimado por itinerario: ~$0.006 (1500 tokens output, Sonnet 4.6)
- $10/mes = ~1.600 itinerarios — más que suficiente para un sitio real
- Si se agota el crédito, la API devuelve `402` y para de cobrar automáticamente

**No se puede bypassear.** Es la red de seguridad final.

---

### Capa 2 — `max_tokens: 1500` fijo en el servidor *(costo controlado por request)*

El límite de tokens de salida está hardcodeado en `api/itinerary.js`.
El frontend no puede modificarlo.

Limita el costo máximo por llamada sin importar qué tan largo sea el prompt.

---

### Capa 3 — Page token HMAC *(bloquea bots que llaman directo al endpoint)*

El problema: un bot puede llamar a `/api/itinerary` directamente con `curl` sin
cargar nunca la página.

**Solución:** el servidor genera un token firmado que solo es válido por 30 minutos.
El frontend lo obtiene al iniciar el planificador y lo incluye en cada request.
Sin token válido, el servidor rechaza la llamada **antes** de contactar a Claude.

**Flujo:**

```
1. planner.js carga → llama GET /api/token
2. /api/token genera HMAC(secret, ventana_temporal) → devuelve token
3. usuario completa el formulario → planner.js llama POST /api/itinerary
4. /api/itinerary verifica el token HMAC antes de llamar a Claude
5. Token inválido / expirado → 401, Claude no es llamado
```

El token es **stateless** — no requiere base de datos. Se verifica matemáticamente.

**Variables de entorno requeridas:**

```
PAGE_TOKEN_SECRET=<string aleatorio de 32+ chars>
```

Generar con: `openssl rand -hex 32`

---

### Capa 4 — Rate limiting por IP con Upstash Redis *(protege contra rotación de bots)*

IP rate limits clásicos son insuficientes porque las IPs rotan (VPNs, proxies).
Sin embargo, combinado con las otras capas, elevan significativamente el costo de un ataque.

**Límite:** 5 requests por hora por IP.

5 itinerarios/hora es más que suficiente para cualquier usuario legítimo.

**Servicio:** [Upstash](https://upstash.com) — Redis serverless, free tier incluido.
- Free tier: 10.000 requests/día
- Compatible con Vercel serverless (HTTP-based, no TCP)

**Variables de entorno requeridas (generadas en el dashboard de Upstash):**

```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Dependencia:**

```json
"@upstash/redis": "^1.34.0"
```

---

### Capas adicionales implementadas en `api/itinerary.js`

| Medida | Descripción |
|--------|-------------|
| CORS / Origin check | Rechaza requests cuyo `Origin` no sea el dominio del sitio |
| Input validation | `messages[0].content` tiene tope de 1500 chars |
| System prompt server-side | El frontend nunca puede modificar el system prompt |
| HTTP method check | Solo acepta `POST`, devuelve `405` para el resto |

---

## System prompt — solo en el servidor

**Problema:** en la arquitectura original, el `system` prompt venía del frontend:

```javascript
// ✗ Antes — el atacante podía reemplazar el system prompt
body: JSON.stringify({ system: SYSTEM_PROMPT, messages })
```

Un atacante podía mandar un system prompt que pida respuestas de 10.000 palabras,
triplicando el costo por llamada.

**Solución:** el system prompt está hardcodeado en `api/itinerary.js`. El frontend
solo manda `messages`. El servidor ignora cualquier campo `system` del body.

---

## Variables de entorno — resumen completo

| Variable | Obligatoria | Descripción |
|----------|------------|-------------|
| `ANTHROPIC_API_KEY` | Sí | Key de Anthropic |
| `PAGE_TOKEN_SECRET` | Sí | Secret para HMAC de page tokens |
| `UPSTASH_REDIS_REST_URL` | Sí | URL REST de Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Sí | Token de Upstash Redis |
| `ALLOWED_ORIGIN` | Recomendada | Dominio del sitio (ej: `https://viajaratumanera.tur.ar`) |

---

## Setup de Upstash Redis (paso a paso)

1. Crear cuenta en [upstash.com](https://upstash.com) con GitHub
2. "Create Database" → tipo: **Redis** → región: **us-east-1** (más cercana a Vercel)
3. Copiar `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` del dashboard
4. Agregar ambas variables en Vercel: Project → Settings → Environment Variables
5. Agregar `PAGE_TOKEN_SECRET` (generar con `openssl rand -hex 32`)
6. Agregar `ALLOWED_ORIGIN` con el dominio final del sitio

---

## Verificación en desarrollo

```bash
# Probar que el token se genera correctamente
curl http://localhost:3000/api/token

# Probar que sin token se rechaza
curl -X POST http://localhost:3000/api/itinerary \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
# → debe devolver 401

# Probar que con token funciona
TOKEN=$(curl -s http://localhost:3000/api/token | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
curl -X POST http://localhost:3000/api/itinerary \
  -H "Content-Type: application/json" \
  -H "x-page-token: $TOKEN" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}'
# → debe devolver respuesta de Claude (o error de validación si el contenido es muy corto)
```

---

## Acceptance criteria de seguridad

- [ ] `PAGE_TOKEN_SECRET` configurada en Vercel
- [ ] `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` configuradas en Vercel
- [ ] `ALLOWED_ORIGIN` configurada con el dominio final
- [ ] Spending limit de $10/mes configurado en Anthropic Console
- [ ] Request sin token → 401 (Claude no es llamado)
- [ ] Request con Origin incorrecto → 403
- [ ] Request con content > 1500 chars → 400
- [ ] Más de 5 requests desde misma IP en 1 hora → 429
- [ ] El frontend no envía campo `system` en el body
