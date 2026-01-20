// ============================================
// 🤖 BotHost Manual - Telegram Bot + Server
// ============================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// ================== НАСТРОЙКИ ==================
// Порт для прослушивания (использует переменную окружения или 3000)
const PORT = process.env.PORT || 3000;

// Токен бота (установите в переменных окружения на BotHost)
const BOT_TOKEN = process.env.BOT_TOKEN || '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc';

// URL вашего Mini App
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://manual.bothost.ru';

// ================== TELEGRAM BOT ==================
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Команда /start - Приветствие
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  const welcomeMessage = `
🎉 <b>Здравствуйте, ${userName}!</b>

━━━━━━━━━━━━━━━━━━━━━━

🤖 Добро пожаловать в <b>BotHost Manual Bot</b>!

Этот бот создан специально для того, чтобы помогать вам в разработке Telegram Mini App. Здесь вы найдёте всё необходимое для успешного старта!

📚 <b>Чем я могу помочь:</b>

   📖 Пошаговые инструкции по созданию Mini App
   💻 Готовые примеры кода на JavaScript
   🛠 Решение типичных проблем и ошибок
   🚀 Советы по размещению на платформе BotHost
   ⚙️ Настройка интеграции с GitHub

━━━━━━━━━━━━━━━━━━━━━━

💡 <b>Совет:</b> Начните с изучения руководства — там есть всё от А до Я!

✨ Нажмите кнопку ниже, чтобы открыть интерактивное руководство 👇
  `;
  
  bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📱 Открыть руководство',
            web_app: { url: WEBAPP_URL }
          }
        ],
        [
          {
            text: '🆘 Техподдержка',
            url: 'https://t.me/BotHostAI_Support_bot'
          },
          {
            text: '🌐 BotHost.ru',
            url: 'https://bothost.ru'
          }
        ]
      ]
    }
  });
  
  console.log(`👤 Новый пользователь: ${userName} (ID: ${msg.from.id})`);
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
📋 <b>Доступные команды:</b>

/start — Главное меню и приветствие
/help — Список всех команд
/manual — Открыть руководство
/support — Связаться с поддержкой

━━━━━━━━━━━━━━━━━━━━━━

❓ <b>Возникли сложности?</b>
Наш AI-бот поддержки работает 24/7:
👉 @BotHostAI_Support_bot
  `;
  
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'HTML' });
});

// Команда /manual
bot.onText(/\/manual/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '📖 <b>Открываю руководство по Mini App...</b>\n\nНажмите кнопку ниже 👇', {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📱 Открыть Mini App',
            web_app: { url: WEBAPP_URL }
          }
        ]
      ]
    }
  });
});

// Команда /support
bot.onText(/\/support/, (msg) => {
  const chatId = msg.chat.id;
  
  const supportMessage = `
🛠 <b>Техническая поддержка</b>

Столкнулись с проблемой? Мы поможем!

━━━━━━━━━━━━━━━━━━━━━━

📌 <b>Как получить помощь:</b>

🤖 <b>AI-бот поддержки</b> — мгновенные ответы на вопросы по коду, настройке и ошибкам

🌐 <b>Документация</b> — подробные инструкции на сайте BotHost.ru

━━━━━━━━━━━━━━━━━━━━━━

Нажмите кнопку ниже, чтобы написать в поддержку 👇
  `;
  
  bot.sendMessage(chatId, supportMessage, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🤖 Написать в поддержку',
            url: 'https://t.me/BotHostAI_Support_bot'
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
  
  console.log('📦 Получены данные из Mini App:', data);
  
  bot.sendMessage(chatId, `✅ <b>Данные получены!</b>\n\n<code>${data}</code>`, {
    parse_mode: 'HTML'
  });
});

// Обработка ошибок бота
bot.on('polling_error', (error) => {
  console.error('❌ Ошибка Telegram бота:', error.message);
});

console.log('🤖 Telegram бот запущен и готов к работе!');

// ================== HTTP СЕРВЕР ==================
// MIME-типы для разных файлов
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Создаем HTTP-сервер
const server = http.createServer((req, res) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  
  // Нормализуем URL
  let url = req.url;
  
  // Для корневого URL отдаем index.html
  if (url === '/' || url === '') {
    url = '/index.html';
  }
  
  // Определяем путь к файлу
  const filePath = path.join(__dirname, 'public', url);
  
  // Получаем расширение файла
  const extname = path.extname(filePath);
  
  // Определяем тип контента по расширению
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Пытаемся прочитать файл
  fs.readFile(filePath, (error, content) => {
    if (error) {
      // Если файл не найден
      if (error.code === 'ENOENT') {
        console.error(`Файл не найден: ${filePath}`);
        
        // Проверяем, существует ли папка public
        if (!fs.existsSync(path.join(__dirname, 'public'))) {
          console.error('ОШИБКА: Папка public не существует!');
        }
        
        // Проверяем содержимое папки public
        try {
          const files = fs.readdirSync(path.join(__dirname, 'public'));
          console.log('Файлы в папке public:', files);
        } catch (e) {
          console.error('Не удалось прочитать папку public:', e);
        }
        
        // Отправляем 404 ошибку
        res.writeHead(404);
        res.end('Файл не найден!');
      } else {
        // Для других ошибок - 500 ошибка сервера
        console.error('Ошибка чтения файла:', error);
        res.writeHead(500);
        res.end(`Ошибка сервера: ${error.code}`);
      }
    } else {
      // Если все хорошо, отдаем файл с правильным типом контента
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Запускаем сервер
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`🌐 Mini App: ${WEBAPP_URL}`);
});
