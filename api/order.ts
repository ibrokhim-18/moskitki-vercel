import default async function handler(req, res) {
    const { service, phone, name } = req.body;

    const text = `Новая заявка
Услуга: ${service}
Имя: ${name || "без имени"}
Телефон: ${phone}`;

    const BOT_TOKEN = process.env.BOT_TOKEN || '';
    const CHAT_ID = process.env.CHAT_ID || '';

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
        }),
    });
    
    res.status(200).json({ ok: true });
}
