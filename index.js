const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Настройки бота
const token = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc';
const bot = new TelegramBot(token, {polling: true});

// Настройки сервера
const port = process.env.PORT || 3000;
const appUrl = 'https://bothostmanualminiapp.ru';

// Настройка статических файлов
app.use(express.static(__dirname));

// Маршрут для основной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Простой тестовый маршрут
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Запуск сервера
const server = app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
  console.log(`WebApp URL: ${appUrl}`);
});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "👋 Добро пожаловать в руководство по Mini App на Bothost!", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Открыть руководство", web_app: {url: appUrl} }]
      ]
    }
  });
});

// Обработка данных из Mini App
bot.on('web_app_data', (msg) => {
  bot.sendMessage(msg.chat.id, `✅ Получено: ${msg.web_app_data.data}`);
});

console.log('Бот запущен и ждет команд');
