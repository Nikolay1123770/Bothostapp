const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Настройки
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4'; 
const bot = new TelegramBot(token, {polling: true});

// Используем порт из переменной окружения или случайный порт
const port = process.env.PORT || Math.floor(3001 + Math.random() * 1000);

// Домен уже настроен в вашем аккаунте
const appUrl = 'https://test.bothost.ru';

// Настройка веб-сервера
app.use(express.static(path.join(__dirname)));

// Обработка всех маршрутов
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ОДИН сервер - без дублирования
const server = app.listen(port, () => {
  console.log(`HTTP server started on port ${port}`);
  console.log(`Web App URL: ${appUrl}`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${port} is busy, trying another one...`);
    setTimeout(() => {
      server.close();
      server.listen(port + 1);
    }, 1000);
  } else {
    console.error('Server error:', error);
  }
});

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "👋 Добро пожаловать! Нажмите кнопку, чтобы открыть Mini App:", {
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
