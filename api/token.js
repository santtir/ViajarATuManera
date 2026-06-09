import crypto from 'crypto';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const TOKEN_WINDOW_MIN = 30;
const MINT_LIMIT  = 20;   // máximo de tokens por IP por ventana
const MINT_WINDOW = 3600; // 1 hora

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.PAGE_TOKEN_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  // Rate limit del minteo de tokens por IP — evita que se "minen" tokens
  // ilimitados para alimentar el abuso de /api/itinerary.
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    const key = `mint:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, MINT_WINDOW);
    if (count > MINT_LIMIT) {
      return res.status(429).json({ error: 'Demasiadas solicitudes' });
    }
  } catch (e) {
    // Si Redis falla, no bloqueamos el token (la verificación real y el
    // rate limit de costo viven en /api/itinerary). Logueamos y seguimos.
    console.error('Error en rate limit de token:', e);
  }

  const w = Math.floor(Date.now() / (TOKEN_WINDOW_MIN * 60 * 1000));
  const token = crypto.createHmac('sha256', secret).update(String(w)).digest('hex');

  return res.status(200).json({ token });
}
