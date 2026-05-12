import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { service, phone, name } = req.body || {};
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  // Проверим, есть ли переменные
  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({
      error: 'Config missing',
      tokenExists: !!BOT_TOKEN,
      chatIdExists: !!CHAT_ID,
    });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `Новая заявка\nУслуга: ${service}\nИмя: ${name}\nТелефон: ${phone}`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Возвращаем ошибку от Telegram прямо в браузер
      return res.status(502).json({
        error: 'Telegram API error',
        details: data,
      });
    }

    return res.status(200).json({ ok: true, messageId: data.result.message_id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal error', message: err.message });
  }
}
