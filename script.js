const tg = window.Telegram.WebApp;

// Сообщаем, что приложение готово
tg.ready();
// Раскрываем на весь экран
tg.expand();

// Красим хедер в цвет фона
tg.setHeaderColor(tg.themeParams.bg_color || '#ffffff');

// Функция копирования текста
function copyCode(element) {
    const text = element.innerText;
    navigator.clipboard.writeText(text).then(() => {
        // Вибрация при успехе
        if(tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        
        // Визуальный эффект
        const oldBg = element.style.background;
        element.style.background = 'var(--tg-theme-button-color, #3390ec)';
        element.style.color = '#fff';
        setTimeout(() => {
            element.style.background = oldBg;
            element.style.color = 'inherit';
        }, 200);
    });
}
