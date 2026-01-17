const express = require('express');
const path = require('path');

// Берем порт от BotHost или ставим 3000
const PORT = process.env.PORT || 3000;

const app = express();

// Раздаем сайт из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Запускаем сервер ОДИН РАЗ
const server = app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});

// Обработка ошибки, если порт занят
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error('⚠️ ОШИБКА: Порт занят! Попробуйте остановить бота на 1 минуту.');
    } else {
        console.error(e);
    }
});
