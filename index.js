const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Базовые настройки
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4'; 
const port = process.env.PORT || 3000;
const bot = new TelegramBot(token, {polling: true});

// Ваш выставленный домен (замените, если указали другой)
const appUrl = 'https://test.bothost.ru';

// Настройка веб-сервера
app.use(express.static(path.join(__dirname)));

// Обрабатываем все маршруты одинаково - отдаем главную страницу
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
  console.log(`Адрес для Telegram Web App: ${appUrl}`);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "👋 Добро пожаловать! Нажмите на кнопку, чтобы открыть Mini App:", {
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: "🚀 Открыть Mini App", 
            web_app: {url: appUrl} 
          }
        ]
      ]
    }
  });
});

// Обработка данных из Mini App
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  
  bot.sendMessage(chatId, `✅ Получены данные: ${data}`);
});

console.log('Бот запущен и готов к работе!');
