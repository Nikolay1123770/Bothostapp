const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const path = require('path');

// --- НАСТРОЙКИ ---
const BOT_TOKEN = '8485736332:AAGuRYmRCX248YkFw8elNQKNrL35vyO3hUc'; 
const DOMAIN = 'https://bothostmanualminiapp.ru';
const PORT = process.env.PORT || 3000;

// 1. Настройка Веб-сервера (Express)
const app = express();

// Указываем папку public как статическую (там лежат html, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Web Server running on port ${PORT}`);
});

// 2. Настройка Бота (Telegraf)
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(
        'Привет! Нажми на кнопку ниже, чтобы открыть инструкцию по BotHost:',
        Markup.keyboard([
            [Markup.button.webApp('📖 Открыть мануал', DOMAIN)]
        ]).resize()
    );
});

// Запуск бота
bot.launch().then(() => {
    console.log('Bot is running...');
});

// Плавная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
