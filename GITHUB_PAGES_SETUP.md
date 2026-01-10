# GTA-1-Real-HTML GitHub Pages Setup

Этот проект настроен для автоматического деплоя на GitHub Pages.

## Автоматическая настройка

Проект включает:
- ✅ GitHub Actions workflow для автоматического деплоя
- ✅ Настроенные разрешения для GitHub Pages
- ✅ Автоматический деплой при push в main ветку

## Ручная настройка GitHub Pages

Для завершения настройки необходимо:

1. **Зайти в настройки репозитория:**
   - Перейти на https://github.com/vchilina27-design/GTA-1-Real-HTML/settings/pages

2. **Включить GitHub Pages:**
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Сохранить настройки**

## Файлы для деплоя

Проект готов к деплою со следующими файлами:
- `index.html` - основной HTML файл
- `style.css` - стили игры
- `game.js` - игровая логика
- `.github/workflows/deploy.yml` - workflow для автодеплоя

## Итоговый URL

После настройки игра будет доступна по адресу:
**https://vchilina27-design.github.io/GTA-1-Real-HTML/**

## Статус деплоя

Деплой происходит автоматически при каждом push в main ветку.
Можно отслеживать статус в разделе Actions репозитория.