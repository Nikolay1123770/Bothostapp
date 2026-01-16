const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Ваш токен
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4';
const bot = new TelegramBot(token, {polling: true});

// Порт и домен
const port = process.env.PORT || 3000;

// Используем фиксированный домен test.bothost.ru для примера в мануале
const appUrl = 'https://test.bothost.ru';

// Настройка веб-сервера
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
  console.log(`✅ Используется URL для Mini App: ${appUrl}`);
});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  
  bot.sendMessage(chatId, `Привет, ${name}! 👋\n\nЭто Mini App демо на Bothost.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Открыть Mini App 📱", web_app: { url: appUrl } }]
      ]
    }
  });
});

// Обработка данных из Mini App
bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  bot.sendMessage(msg.chat.id, `✅ Данные получены: ${data}`);
});

console.log('Бот запущен! Используется URL: ' + appUrl);
