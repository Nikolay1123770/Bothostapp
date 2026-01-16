const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Настройки
const token = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc'; 
const bot = new TelegramBot(token, {polling: true});
const port = process.env.PORT || 3000; 

// Обновленный домен!
const appUrl = 'https://bothostmanualminiapp.ru';

// Настройка веб-сервера
app.use(express.static(path.join(__dirname)));

// Обработка всех маршрутов
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
  console.log(`WebApp URL: ${appUrl}`);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "👋 Добро пожаловать! Нажмите кнопку, чтобы открыть руководство:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Открыть Mini App", web_app: {url: appUrl} }]
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
