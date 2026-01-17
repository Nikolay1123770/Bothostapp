const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

// Статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
