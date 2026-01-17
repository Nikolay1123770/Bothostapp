// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;

// Сообщаем Telegram, что приложение готово
tg.ready();

// Расширяем на весь экран
tg.expand();

// Настраиваем цвет шапки
if (tg.setHeaderColor) {
    tg.setHeaderColor('secondary_bg_color');
}

// Отключаем свайп назад
if (tg.disableSwipeBack) {
    tg.disableSwipeBack(true);
}

// Для всего интерактива на странице
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Тактильная обратная связь
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.impactOccurred('light');
                }
                
                // Плавная прокрутка к разделу
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Подсветка активной ссылки
                document.querySelectorAll('.toc a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Копирование кода при клике
    document.querySelectorAll('.code-block, .command').forEach(block => {
        block.title = 'Нажмите, чтобы скопировать';
        block.style.cursor = 'pointer';
        
        block.addEventListener('click', function() {
            const text = this.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                // Вибрация при успешном копировании
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
                
                // Визуальный эффект
                const originalBackground = this.style.backgroundColor;
                this.style.backgroundColor = 'rgba(156, 50, 255, 0.2)';
                
                setTimeout(() => {
                    this.style.backgroundColor = originalBackground;
                }, 300);
            }).catch(err => {
                console.error('Не удалось скопировать текст:', err);
            });
        });
    });
    
    // Открываем первый раздел автоматически
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

// Анимация при прокрутке (эффект появления)
const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% элемента должно быть видимо
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Наблюдаем за всеми блоками секций
document.querySelectorAll('.info-block').forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(20px)';
    block.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(block);
});

// Добавляем класс для анимации появления
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.info-block.visible').forEach(block => {
        block.style.opacity = '1';
        block.style.transform = 'translateY(0)';
    });
});

// Логи для отладки
console.log('Mini App загружено!');
console.log('Тема Telegram:', tg.colorScheme);
console.log('Версия WebApp:', tg.version || 'неизвестно');
