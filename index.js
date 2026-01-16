const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const app = express();

// Ваш токен уже вставлен!
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4'; 
const bot = new TelegramBot(token, {polling: true});

// Bothost передает порт через переменную окружения, либо используем 3000
const port = process.env.PORT || 3000; 

// ВЕБ-СЕРВЕР (Для отображения Mini App)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});

// ЛОГИКА БОТА
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // URL вашего приложения - замените после запуска
  const appUrl = 'http://nodeX.bothost.ru:3000';
  
  bot.sendMessage(chatId, "Привет! Это тест Mini App на Bothost 👇", {
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

// Обработка данных из Mini App
bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  bot.sendMessage(msg.chat.id, `✅ Вы нажали кнопку в приложении! Получено: ${data}`);
});
