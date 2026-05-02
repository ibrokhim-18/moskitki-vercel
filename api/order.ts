export default async function handler(req, res) {
  const { service, phone, name } = req.body;

  const text = `📥 Новая заявка
Услуга: ${service}
Имя: ${name || "без имени"}
Телефон: ${phone}`;

  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: process.env.CHAT_ID,
      text,
    }),
  });

  res.status(200).json({ ok: true });
}
