// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;

// Сообщаем Telegram, что приложение загружено
tg.ready();

// Расширяем на весь экран
tg.expand();

// Устанавливаем цвет шапки
if (tg.setHeaderColor) {
    tg.setHeaderColor('secondary_bg_color');
}

// Отключаем свайп назад (опционально)
if (tg.disableSwipeBack) {
    tg.disableSwipeBack(true);
}

// Плавная прокрутка по якорям (для оглавления)
document.addEventListener('DOMContentLoaded', function() {
    // Обработка всех внутренних ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Добавляем тактильную обратную связь
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
    
    // Функция для управления фокусом заголовков при скроллинге
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + 100; // Небольшой отступ сверху
        
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Выделение активного пункта меню
        document.querySelectorAll('.toc a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Следим за скроллом для подсветки текущего раздела
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Заменяем заглушки изображений
    // Эта функция будет заменена, когда вы добавите реальные скриншоты
    document.querySelectorAll('.image-placeholder').forEach(placeholder => {
        placeholder.style.cursor = 'pointer';
        placeholder.title = 'Здесь будет скриншот';
        
        placeholder.addEventListener('click', function() {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('warning');
            }
            alert('Скриншот будет добавлен позже');
        });
    });
    
    // Копирование кода при клике (опционально)
    document.querySelectorAll('.code-block').forEach(block => {
        block.title = 'Нажмите, чтобы скопировать код';
        block.style.cursor = 'pointer';
        
        block.addEventListener('click', function() {
            const text = this.textContent;
            copyToClipboard(text);
            
            // Обратная связь
            if (tg.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
            
            // Визуальное подтверждение
            const originalBackground = this.style.backgroundColor;
            this.style.backgroundColor = 'rgba(156, 50, 255, 0.2)';
            
            setTimeout(() => {
                this.style.backgroundColor = originalBackground;
            }, 300);
        });
    });
    
    // Вспомогательная функция для копирования текста
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            console.log('Код скопирован в буфер обмена');
        } catch (err) {
            console.error('Не удалось скопировать текст:', err);
        }
        
        document.body.removeChild(textarea);
    }
    
    // Открываем первый раздел по умолчанию
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

// Сбор аналитики (можно настроить по вашим требованиям)
function logEvent(eventName, eventData = {}) {
    eventData.timestamp = new Date().toISOString();
    eventData.user_agent = navigator.userAgent;
    eventData.theme = tg.colorScheme;
    
    console.log(`Event: ${eventName}`, eventData);
    // Здесь можно добавить отправку данных на ваш сервер аналитики
}

// Логируем информацию о запуске
logEvent('app_launched', {
    platform: navigator.platform,
    screen_size: `${window.innerWidth}x${window.innerHeight}`
});

// Логи для отладки
console.log('Mini App загружено!');
console.log('Тема Telegram:', tg.colorScheme);
console.log('Версия Telegram WebApp:', tg.version || 'неизвестно');
