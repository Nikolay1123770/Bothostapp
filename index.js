const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const localtunnel = require('localtunnel');
const http = require('http'); // Для определения IP
const app = express();

// ВАШ ТОКЕН
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4'; 
const bot = new TelegramBot(token, {polling: true});

const port = process.env.PORT || 3000; 
let currentAppUrl = '';
let serverIp = '';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Функция для получения внешнего IP (это и есть пароль)
function getPublicIp() {
    http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
        resp.on('data', function(ip) {
            serverIp = ip.toString();
            console.log("🌍 IP СЕРВЕРА (ПАРОЛЬ): " + serverIp);
        });
    });
}

app.listen(port, async () => {
  console.log(`🚀 Server started on port ${port}`);
  getPublicIp(); // Узнаем IP при запуске
  
  try {
    const tunnel = await localtunnel({ port: port });
    currentAppUrl = tunnel.url;
    console.log('✅ HTTPS ССЫЛКА:', currentAppUrl);
  } catch (err) {
    console.error('Ошибка туннеля:', err);
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!currentAppUrl || !serverIp) {
    bot.sendMessage(chatId, "Бот запускается... Попробуйте через 5 секунд.");
    return;
  }

  // Отправляем инструкцию и кнопку
  bot.sendMessage(chatId, 
    `⚠️ **Важный шаг для первого запуска!**\n\n` +
    `1. Скопируйте этот IP: \`${serverIp}\` (нажмите на него)\n` +
    `2. Нажмите кнопку "Открыть Mini App" ниже.\n` +
    `3. Вставьте IP в поле "Tunnel Password" и нажмите "Click to Submit".\n` +
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

bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  bot.sendMessage(msg.chat.id, `✅ Данные получены: ${data}`);
});  if (!currentAppUrl) {
    bot.sendMessage(chatId, "Сервер еще запускается, подождите пару секунд и нажмите /start снова.");
    return;
  }

  bot.sendMessage(chatId, "Привет! Bothost Mini App готов 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть Mini App 📱", 
            web_app: {url: currentAppUrl} // Используем полученную HTTPS ссылку
          }
        ]
      ]
    }
  });
});

bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  bot.sendMessage(msg.chat.id, `✅ Данные получены: ${data}`);
});
