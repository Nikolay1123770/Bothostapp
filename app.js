// Простой HTTP-сервер без Express
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Карта MIME-типов для разных файлов
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

// Создаем HTTP-сервер
const server = http.createServer((req, res) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  
  // Определяем путь к файлу
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  
  // Определяем расширение файла
  const extname = path.extname(filePath);
  
  // Тип контента по умолчанию
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  // Читаем файл
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Если файл не найден
      if (err.code === 'ENOENT') {
        // Если запрашивают корень, но index.html нет, показываем простое сообщение
        if (req.url === '/') {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<html><body><h1>BotHost Manual</h1><p>Mini App готово!</p></body></html>');
          return;
        }
        
        res.writeHead(404);
        res.end(`Файл не найден: ${req.url}`);
      } else {
        // Если другая ошибка сервера
        res.writeHead(500);
        res.end(`Ошибка сервера: ${err.code}`);
      }
    } else {
      // Успешный ответ
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// Запускаем сервер
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
