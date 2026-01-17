// Инициализация WebApp
const tg = window.Telegram.WebApp;

// 1. Сообщаем, что приложение загрузилось
tg.ready();

// 2. Раскрываем на весь экран
tg.expand(); 

// 3. Красим верхний бар в цвет фона (чтобы сливалось)
tg.setHeaderColor(tg.themeParams.secondary_bg_color || '#f4f4f5');

// Функция открытия/закрытия шагов
function toggleStep(card) {
    // Вибрация (Haptic Feedback) для ощущения нативности
    if(tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
    }

    // Если кликнули на уже открытый - закрываем
    if (card.classList.contains('active')) {
        card.classList.remove('active');
        return;
    }

    // Закрываем все остальные (аккордеон)
    document.querySelectorAll('.step-card').forEach(item => {
        item.classList.remove('active');
    });

    // Открываем текущий
    card.classList.add('active');
}

// Функция копирования текста при клике на код
function copyText(element) {
    const textToCopy = element.innerText;
    
    // Используем Clipboard API или fallback
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Успех
        if(tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        
        // Визуальный эффект
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = 'var(--tg-theme-button-color, #3390ec)';
        element.style.color = '#fff';
        
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
            element.style.color = 'var(--tg-theme-text-color, #000)';
        }, 300);

    }).catch(err => {
        console.error('Ошибка копирования', err);
    });
}

// Создаем большую кнопку "Закрыть" внизу интерфейса Telegram
tg.MainButton.setText("ЗАКРЫТЬ МАНУАЛ");
tg.MainButton.show();

tg.MainButton.onClick(function(){
    tg.close();
});
