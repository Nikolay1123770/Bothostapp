const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Настройки
const token = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc'; 
const bot = new TelegramBot(token, {polling: true});

// Выбираем случайный порт, чтобы избежать конфликтов
const port = process.env.PORT || 5000 + Math.floor(Math.random() * 3000);

// Домен вашего сайта
const appUrl = 'https://bothostmanualminiapp.ru';

// Настройка сервера
app.use(express.static(path.join(__dirname)));

// Для всех маршрутов отдаем HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера с обработкой ошибок
const server = app.listen(port, () => {
  console.log(`✅ Сервер запущен на порту ${port}`);
  console.log(`🔗 WebApp URL: ${appUrl}`);
});

// Обработка ошибок сервера
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Порт ${port} занят, пробую другой порт...`);
    server.close();
    // Пробуем запустить на другом порту
    app.listen(port + 1000, () => {
      console.log(`✅ Сервер запущен на резервном порту ${port + 1000}`);
    });
  }
});

// Команда /start
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

// Обработка данных
bot.on('web_app_data', (msg) => {
  bot.sendMessage(msg.chat.id, `✅ Получено: ${msg.web_app_data.data}`);
});

console.log('🤖 Бот запущен и ждет команд');
