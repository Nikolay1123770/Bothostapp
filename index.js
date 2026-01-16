const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// --- НАСТРОЙКИ ---
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4'; 
const bot = new TelegramBot(token, {polling: true});
const port = process.env.PORT || 3000; 

// ВАША ССЫЛКА (Жестко заданная)
const appUrl = 'https://test.bothost.ru';

app.use(express.json());

// Отдаем index.html из корня
app.get('/', (req, res) => {
    // Пытаемся найти файл в корне
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
  console.log(`🔗 Ссылка для кнопки: ${appUrl}`);
});

// --- ЛОГИКА БОТА ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 
    `👋 **Привет!**\n\n` +
    `Нажмите кнопку ниже, чтобы открыть приложение по адресу:\n${appUrl}`, 
    {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть Mini App 📱", 
            web_app: {url: appUrl}
          }
        ]
      ]
    }
  });
});

bot.on('web_app_data', (msg) => {
  bot.sendMessage(msg.chat.id, `✅ Данные: ${msg.web_app_data.data}`);
});
