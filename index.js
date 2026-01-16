const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Настройки бота
const token = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc';
const bot = new TelegramBot(token, {polling: true});

// Домен для Mini App
const appUrl = 'https://bothostmanualminiapp.ru';

// Создаем HTML-файл в корне проекта
const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini App на Bothost</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: var(--tg-theme-bg-color, #ffffff);
            color: var(--tg-theme-text-color, #222222);
            margin: 0;
            padding: 20px;
            line-height: 1.5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding-bottom: 80px;
        }
        h1 {
            font-size: 24px;
            text-align: center;
            margin: 24px 0;
        }
        .card {
            background-color: var(--tg-theme-secondary-bg-color, #f5f5f5);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        .button {
            background-color: var(--tg-theme-button-color, #2481cc);
            color: var(--tg-theme-button-text-color, #ffffff);
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 20px;
        }
        .logo {
            font-size: 48px;
            text-align: center;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀</div>
        <h1>Mini App на Bothost</h1>
        <div class="card">
            <h2>Руководство по созданию Mini App</h2>
            <p>Это простое демонстрационное Mini App, работающее на платформе Bothost.</p>
            <p>Домен приложения: <strong>bothostmanualminiapp.ru</strong></p>
            <p>Mini App успешно запущено! Нажмите кнопку ниже, чтобы отправить данные обратно в бот:</p>
            <button class="button" onclick="sendData()">Отправить тестовые данные</button>
        </div>
    </div>
    <script>
        const tg = window.Telegram.WebApp;
        tg.expand();
        function sendData() {
            tg.sendData("Тест Mini App на bothostmanualminiapp.ru прошел успешно!");
            tg.close();
        }
    </script>
</body>
</html>`;

// Записываем HTML-файл на диск
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
console.log('HTML файл создан');

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

console.log('🤖 Бот запущен и использует домен', appUrl);
