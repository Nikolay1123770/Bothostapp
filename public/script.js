// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;

// Сообщаем Telegram, что приложение загружено
tg.ready();

// Расширяем приложение на весь экран
tg.expand();

// Если поддерживается, устанавливаем цвет шапки
if (tg.setHeaderColor) {
    tg.setHeaderColor('secondary_bg_color');
}

// Добавляем плавную прокрутку для ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Вибрация (тактильная обратная связь)
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
            
            // Прокрутка
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Когда вы добавите скриншоты, удалите эту функцию
document.addEventListener('DOMContentLoaded', function() {
    // Заменяем заполнители изображений на реальные изображения
    // Это будет сделано позже, когда вы получите скриншоты
    document.querySelectorAll('.image-placeholder').forEach(placeholder => {
        placeholder.style.cursor = 'pointer';
        placeholder.title = 'Здесь будет скриншот';
        
        placeholder.addEventListener('click', function() {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('error');
            }
            // Вы можете показать сообщение о том, что скриншоты будут добавлены позже
        });
    });
    
    // Открываем первый раздел
    const firstSection = document.querySelector('#intro');
    if (firstSection) {
        setTimeout(() => {
            firstSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 500);
    }
});

// Логи для отладки
console.log('Mini App загружено!');
console.log('Тема: ' + tg.colorScheme);
