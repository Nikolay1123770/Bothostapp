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

// --- ИСПРАВЛЕНИЕ: ЯВНО ОТДАЕМ ФАЙЛ ---
// Теперь сервер точно знает, что отдавать на главной странице
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Функция получения IP
function getPublicIp() {
    http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
        resp.on('data', function(ip) {
            serverIp = ip.toString();
            console.log("🌍 IP СЕРВЕРА: " + serverIp);
        });
    });
}

app.listen(port, async () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
  getPublicIp();
  
  try {
    const tunnel = await localtunnel({ port: port });
    currentAppUrl = tunnel.url;
    console.log('✅ HTTPS ССЫЛКА: ' + currentAppUrl);
  } catch (err) {
    console.error('Ошибка туннеля:', err);
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!currentAppUrl || !serverIp) {
    bot.sendMessage(chatId, "⏳ Загрузка... Нажмите /start через 5 секунд.");
    return;
  }

  bot.sendMessage(chatId, 
    `⚠️ **Важно для запуска:**\n\n` +
    `1. Твой пароль (IP): \`${serverIp}\` (копируй нажатием)\n` +
    `2. Жми кнопку ниже\n` +
    `3. Вставь пароль и жми "Click to Submit"`, 
    {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Открыть Mini App 📱", web_app: {url: currentAppUrl} }]
      ]
    }
  });
});

bot.on('web_app_data', (msg) => {
  bot.sendMessage(msg.chat.id, `✅ Данные: ${msg.web_app_data.data}`);
});
