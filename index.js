const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const localtunnel = require('localtunnel');
const http = require('http');
const app = express();

// ВАШ ТОКЕН
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4'; 
const bot = new TelegramBot(token, {polling: true});

const port = process.env.PORT || 3000; 
let currentAppUrl = '';
let serverIp = '';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Функция для получения IP (пароль для туннеля)
function getPublicIp() {
    http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
        resp.on('data', function(ip) {
            serverIp = ip.toString();
            console.log("🌍 IP СЕРВЕРА: " + serverIp);
        });
    });
}

// Запуск сервера
app.listen(port, async () => {
  console.log(`🚀 Server started on port ${port}`);
  getPublicIp(); // Узнаем IP
  
  try {
    const tunnel = await localtunnel({ port: port });
    currentAppUrl = tunnel.url;
    console.log('✅ HTTPS ССЫЛКА: ' + currentAppUrl);
  } catch (err) {
    console.error('Ошибка туннеля:', err);
  }
});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!currentAppUrl || !serverIp) {
    bot.sendMessage(chatId, "⏳ Бот запускается... Подождите 10 секунд и нажмите /start снова.");
    return;
  }

  bot.sendMessage(chatId, 
    `⚠️ **Важный шаг для первого запуска!**\n\n` +
    `1. Скопируйте этот IP (пароль): \`${serverIp}\` (нажмите на него)\n` +
    `2. Нажмите кнопку "Открыть Mini App" ниже.\n` +
    `3. Вставьте IP в поле "Tunnel Password" и нажмите синюю кнопку "Click to Submit".\n` +
    `\nПосле этого приложение откроется!`, 
    {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть Mini App 📱", 
            web_app: {url: currentAppUrl}
          }
        ]
      ]
    }
  });
});

// Обработка данных из WebApp
bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  bot.sendMessage(msg.chat.id, `✅ Данные получены: ${data}`);
});
