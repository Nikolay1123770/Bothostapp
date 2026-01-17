const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

// Добавляем CORS заголовки
app.use((req, res, next) => {
  // Логируем все запросы, чтобы видеть, что приходит
  console.log(`📝 Request: ${req.method} ${req.url}`);
  
  // Разрешаем запросы от Telegram
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Тестовый эндпоинт, чтобы проверить работу сервера
app.get('/test', (req, res) => {
  res.send({ status: 'ok', message: 'Server is working!' });
});

// Запуск с правильной обработкой ошибок
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server error:', err.message);
});
