const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const localtunnel = require('localtunnel'); // Подключаем туннель
const app = express();

// ВАШ ТОКЕН
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4'; 
const bot = new TelegramBot(token, {polling: true});

const port = process.env.PORT || 3000; 
let currentAppUrl = ''; // Сюда запишем HTTPS ссылку

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Запускаем сервер и туннель
app.listen(port, async () => {
  console.log(`🚀 Server started on port ${port}`);
  
  // Создаем HTTPS туннель
  try {
    const tunnel = await localtunnel({ port: port });
    currentAppUrl = tunnel.url;
    console.log('✅ ВАША HTTPS ССЫЛКА:', currentAppUrl);
  } catch (err) {
    console.error('Ошибка создания туннеля:', err);
    currentAppUrl = 'https://google.com'; // Заглушка, если туннель не сработал
  }
});

// ЛОГИКА БОТА
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // Если туннель еще не создался, предупреждаем
  if (!currentAppUrl) {
    bot.sendMessage(chatId, "Сервер еще запускается, подождите пару секунд и нажмите /start снова.");
    return;
  }

  bot.sendMessage(chatId, "Привет! Bothost Mini App готов 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть Mini App 📱", 
            web_app: {url: currentAppUrl} // Используем полученную HTTPS ссылку
          }
        ]
      ]
    }
  });
});

bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  bot.sendMessage(msg.chat.id, `✅ Данные получены: ${data}`);
});
