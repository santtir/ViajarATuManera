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
