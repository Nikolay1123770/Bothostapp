const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

// Создаём сервер Express
const app = express();

// Раздаём файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
