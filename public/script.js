// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;

// Сообщаем Telegram, что приложение готово
tg.ready();

// Расширяем на весь экран
tg.expand();

// Плавная прокрутка по якорям
document.addEventListener('DOMContentLoaded', function() {
    // Плавный скролл для внутренних ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Тактильная обратная связь (если доступно)
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.impactOccurred('light');
                }
                
                // Плавная прокрутка
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Автоматическое открытие первого раздела
    setTimeout(() => {
        const firstSection = document.querySelector('#intro');
        if (firstSection) {
            firstSection.scrollIntoView({
                behavior: 'smooth', 
                block: 'start'
            });
        }
    }, 500);
});

// Логи для отладки
console.log('Mini App загружено');
console.log('Тема Telegram:', tg.colorScheme);
