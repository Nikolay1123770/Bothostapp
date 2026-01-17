// Одновременно запускаем и бота, и веб-сервер
const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. НАСТРОЙКА TELEGRAM БОТА
// Вам нужно заменить BOT_TOKEN на ваш токен от @BotFather
const BOT_TOKEN = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc';
const DOMAIN = 'https://bothostmanualminiapp.ru';

// Минимальная реализация Telegram Bot API
function sendTelegramMessage(chatId, text, keyboard = null) {
  const data = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };
  
  if (keyboard) {
    data.reply_markup = keyboard;
  }
  
  // Отправляем запрос к Telegram Bot API
  const https = require('https');
  const payload = JSON.stringify(data);
  
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };
  
  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      console.log('✅ Сообщение отправлено');
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Ошибка отправки: ', e);
  });
  
  req.write(payload);
  req.end();
}

// Обработчик обновлений от Telegram
function processTelegramUpdate(update) {
  if (update.message && update.message.text === '/start') {
    const chatId = update.message.chat.id;
    const keyboard = {
      keyboard: [
        [{ text: '📖 Открыть мануал', web_app: { url: DOMAIN } }]
      ],
      resize_keyboard: true
    };
    
    sendTelegramMessage(
      chatId, 
      'Привет! Нажми на кнопку ниже, чтобы открыть мануал по BotHost:', 
      keyboard
    );
  }
}

// Настройка Webhook для бота
function setupTelegramWebhook() {
  const port = process.env.PORT || 3000;
  const webhookUrl = `${DOMAIN}/webhook`;
  
  console.log(`Установка вебхука: ${webhookUrl}`);
  
  const https = require('https');
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`,
    method: 'GET'
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Статус вебхука:', data);
    });
  });
  
  req.on('error', (e) => {
    console.error('Ошибка установки вебхука:', e);
  });
  
  req.end();
}

// 2. НАСТРОЙКА ВЕБ-СЕРВЕРА
// Карта MIME-типов для файлов
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Обработка HTTP-запросов
function handleHttpRequest(req, res) {
  const url = req.url;
  console.log(`📝 ${req.method} ${url}`);
  
  // Особая обработка для вебхука от Telegram
  if (url === '/webhook' && req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });
    
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        processTelegramUpdate(update);
      } catch (e) {
        console.error('Ошибка обработки вебхука:', e);
      }
      
      res.writeHead(200);
      res.end('OK');
    });
    
    return;
  }
  
  // Для всех остальных запросов - отдаем статические файлы
  let filePath = path.join(__dirname, 'public', url === '/' ? 'index.html' : url);
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        if (url === '/') {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<html><body><h1>BotHost Manual</h1><p>Mini App готово!</p></body></html>');
          return;
        }
        
        res.writeHead(404);
        res.end('Файл не найден');
      } else {
        res.writeHead(500);
        res.end(`Ошибка сервера: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Запуск сервера
const PORT = process.env.PORT || 3000;
const server = http.createServer(handleHttpRequest);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  // Настраиваем вебхук для Telegram
  setupTelegramWebhook();
});
