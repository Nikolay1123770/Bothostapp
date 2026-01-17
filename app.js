// Простой сервер для статических файлов
const http = require('http');
const fs = require('fs');
const path = require('path');

// Порт для прослушивания (использует переменную окружения или 3000)
const PORT = process.env.PORT || 3000;

// MIME-типы для разных файлов
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Создаем HTTP-сервер
const server = http.createServer((req, res) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  
  // Нормализуем URL
  let url = req.url;
  
  // Для корневого URL отдаем index.html
  if (url === '/' || url === '') {
    url = '/index.html';
  }
  
  // Определяем путь к файлу
  const filePath = path.join(__dirname, 'public', url);
  
  // Получаем расширение файла
  const extname = path.extname(filePath);
  
  // Определяем тип контента по расширению
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Пытаемся прочитать файл
  fs.readFile(filePath, (error, content) => {
    if (error) {
      // Если файл не найден
      if (error.code === 'ENOENT') {
        console.error(`Файл не найден: ${filePath}`);
        
        // Проверяем, существует ли папка public
        if (!fs.existsSync(path.join(__dirname, 'public'))) {
          console.error('ОШИБКА: Папка public не существует!');
        }
        
        // Проверяем содержимое папки public
        try {
          const files = fs.readdirSync(path.join(__dirname, 'public'));
          console.log('Файлы в папке public:', files);
        } catch (e) {
          console.error('Не удалось прочитать папку public:', e);
        }
        
        // Отправляем 404 ошибку
        res.writeHead(404);
        res.end('Файл не найден!');
      } else {
        // Для других ошибок - 500 ошибка сервера
        console.error('Ошибка чтения файла:', error);
        res.writeHead(500);
        res.end(`Ошибка сервера: ${error.code}`);
      }
    } else {
      // Если все хорошо, отдаем файл с правильным типом контента
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Запускаем сервер
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT} (локально)`);
  console.log(`🌐 URL: https://manual.bothost.ru (если настроен DNS)`);
});
