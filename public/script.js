// Инициализация Telegram Mini App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Дебаг-информация
console.log("Mini App загружена!");
console.log("Тема: " + (tg.colorScheme || "не определена"));
