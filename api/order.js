export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  // Получаем данные из тела запроса
  const { usluga, name, phone } = req.body || {};

  // Логируем полученные данные (будут видны в логах Vercel)
  console.log('📩 Получены данные:', { usluga, name, phone });

  // Проверяем переменные окружения
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  console.log('🔑 BOT_TOKEN:', BOT_TOKEN ? '✅ задан' : '❌ не задан');
  console.log('🔑 CHAT_ID:', CHAT_ID ? '✅ задан' : '❌ не задан');

  // Если переменные не заданы – возвращаем ошибку
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ Ошибка: BOT_TOKEN или CHAT_ID не заданы');
    return res.status(500).json({
      error: 'Ошибка конфигурации сервера',
      tokenExists: !!BOT_TOKEN,
      chatIdExists: !!CHAT_ID,
    });
  }

  // Проверяем, что все поля заполнены
  if (!usluga || !name || !phone) {
    console.error('❌ Ошибка: не все поля заполнены');
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  try {
    // Формируем текст сообщения
    const text = `🆕 Новая заявка\n📌 Услуга: ${usluga}\n👤 Имя: ${name}\n📞 Телефон: ${phone}`;

    // Отправляем запрос в Telegram API
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Telegram API ошибка:', data);
      return res.status(502).json({ error: 'Ошибка Telegram API', details: data });
    }

    console.log('✅ Сообщение отправлено, messageId:', data.result.message_id);
    return res.status(200).json({ ok: true, messageId: data.result.message_id });
  } catch (error) {
    console.error('❌ Ошибка при отправке:', error.message);
    return res.status(500).json({ error: 'Внутренняя ошибка', message: error.message });
  }
}
