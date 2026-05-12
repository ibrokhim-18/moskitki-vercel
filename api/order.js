export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { service, phone, name } = req.body || {};
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('BOT_TOKEN или CHAT_ID не заданы');
    return res.status(500).json({
      error: 'Server config error',
      tokenExists: !!BOT_TOKEN,
      chatIdExists: !!CHAT_ID,
    });
  }

  try {
    const text = `Новая заявка\nУслуга: ${service}\nИмя: ${name}\nТелефон: ${phone}`;
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', data);
      return res.status(502).json({ error: 'Telegram API error', details: data });
    }

    return res.status(200).json({ ok: true, messageId: data.result.message_id });
  } catch (error) {
    console.error('Fetch error:', error.message);
    return res.status(500).json({ error: 'Internal error', message: error.message });
  }
}
