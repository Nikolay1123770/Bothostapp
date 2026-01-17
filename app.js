const express = require('express');
const path = require('path');

// Используйте порт 3001 вместо 3000
const PORT = process.env.PORT || 3001;

const app = express();

// Раздаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Добавляем CORS-заголовки
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// Запускаем сервер на порту 3001
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});
