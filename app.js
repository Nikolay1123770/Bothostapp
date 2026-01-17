const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const path = require('path');

// --- НАСТРОЙКИ ---
// ⚠️ Вставь сюда свой токен!
const BOT_TOKEN = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc'; 
const DOMAIN = 'https://bothostmanualminiapp.ru';

// Используем порт от BotHost или 3000 по умолчанию
const PORT = process.env.PORT || 3000;

// 1. Настройка Веб-сервера (Express)
const app = express();

// Указываем папку для статических файлов (index.html, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// Обработка главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера с обработкой ошибок порта
const server = app.listen(PORT, () => {
    console.log(`✅ Web Server started on port ${PORT}`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`❌ ОШИБКА: Порт ${PORT} занят! Скорее всего, бот уже запущен в фоне.`);
        console.error('Попробуйте остановить бота через кнопку СТОП и подождать минуту.');
    } else {
        console.error('❌ Ошибка сервера:', e);
    }
});

// 2. Настройка Бота (Telegraf)
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(
        'Привет! Вот инструкция по BotHost:',
        Markup.keyboard([
            [Markup.button.webApp('📖 Открыть мануал', DOMAIN)]
        ]).resize()
    );
});

// Запуск бота (Polling)
bot.launch({ dropPendingUpdates: true }) // dropPendingUpdates убирает старые команды, чтобы бот не тупил при старте
    .then(() => console.log('✅ Bot started via Polling'))
    .catch((err) => console.error('❌ Bot launch error:', err));

// Плавная остановка (чтобы не оставлять зависших процессов в будущем)
process.once('SIGINT', () => {
    bot.stop('SIGINT');
    server.close();
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    server.close();
});
