const TelegramBot = require('node-telegram-bot-api');
const token = '8593344199:AAGUtMmFoEuzPTa-2hO33Dq9afiwk9jB8J4';
const bot = new TelegramBot(token, {polling: true});

// Домен уже настроен в аккаунте
const appUrl = 'https://test.bothost.ru';

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Нажмите кнопку:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Открыть Mini App", web_app: {url: appUrl} }]
      ]
    }
  });
});

// Обработка данных
bot.on('web_app_data', (msg) => {
  bot.sendMessage(msg.chat.id, `Получено: ${msg.web_app_data.data}`);
});

console.log('Бот запущен!');
