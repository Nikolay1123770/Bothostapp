const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Настройки бота
const token = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc';
const bot = new TelegramBot(token, {polling: true});

// Используем разные порты для избежания конфликта
const port = 4000;

// Используем именно домен
const appUrl = 'https://bothostmanualminiapp.ru';

// Настройка статических файлов
app.use(express.static(__dirname));

// Маршрут для основной страницы и всех подстраниц
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
try {
  const server = app.listen(port, () => {
    console.log(`Сервер успешно запущен на порту ${port}`);
    console.log(`URL для Web App: ${appUrl}`);
  });
} catch (error) {
  console.error('Ошибка запуска сервера:', error);
}

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "👋 Добро пожаловать в Mini App на Bothost!", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Открыть Mini App", web_app: {url: appUrl} }]
      ]
    }
  });
});

// Обработка данных из Mini App
bot.on('web_app_data', (msg) => {
  bot.sendMessage(msg.chat.id, `✅ Получено: ${msg.web_app_data.data}`);
});

console.log('🤖 Бот запущен');
