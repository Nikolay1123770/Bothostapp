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

// Функция для открытия/закрытия шагов
function toggleStep(step) {
    // Вибро-отклик для лучшего UX
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Если этот шаг уже открыт - закрываем его
    if (step.classList.contains('active')) {
        step.classList.remove('active');
        return;
    }
    
    // Закрываем все открытые шаги
    document.querySelectorAll('.step.active').forEach(openStep => {
        openStep.classList.remove('active');
    });
    
    // Открываем текущий шаг
    step.classList.add('active');
}

// Открываем первый шаг по умолчанию
document.addEventListener('DOMContentLoaded', function() {
    const firstStep = document.querySelector('.step');
    if (firstStep) {
        setTimeout(() => {
            firstStep.classList.add('active');
        }, 500);
    }
    
    // Логи для отладки
    console.log('Приложение запущено!');
    console.log('Тема: ' + tg.colorScheme);
});
