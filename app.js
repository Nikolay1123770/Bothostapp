const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const path = require('path');

// --- НАСТРОЙКИ ---
const BOT_TOKEN = process.env.BOT_TOKEN || '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc'; 
const DOMAIN = 'https://bothostmanualminiapp.ru';
const PORT = process.env.PORT || 8080;

// 1. Настройка Веб-сервера (Express)
const app = express();

// Логируем запуск
console.log(`Пытаемся запустить сервер на порту ${PORT}`);

// Указываем папку public как статическую (там лежат html, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    console.log('Получен запрос к главной странице');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Веб-сервер запущен на порту ${PORT}`);
});

// 2. Настройка Бота (Telegraf)
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    console.log('Кто-то запустил бота');
    ctx.reply(
        'Привет! Нажми на кнопку ниже, чтобы открыть инструкцию по BotHost:',
        Markup.keyboard([
            [Markup.button.webApp('📖 Открыть мануал', DOMAIN)]
        ]).resize()
    );
});

// Общий обработчик текста
bot.on('text', (ctx) => {
    ctx.reply('Нажми на кнопку ниже, чтобы открыть мануал:', 
        Markup.keyboard([
            [Markup.button.webApp('📖 Открыть мануал', DOMAIN)]
        ]).resize()
    );
});

// Запуск бота
bot.launch().then(() => {
    console.log('✅ Бот запущен успешно!');
}).catch(err => {
    console.error('❌ Ошибка запуска бота:', err);
});

// Плавная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
