#!/bin/bash

# Автоматическая настройка GitHub Pages для GTA-1-Real-HTML
# Этот скрипт поможет настроить GitHub Pages через GitHub CLI

echo "🎮 Настройка GitHub Pages для GTA-1-Real-HTML"
echo "=============================================="

# Проверяем, установлен ли GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI не установлен. Установите его с https://cli.github.com/"
    exit 1
fi

echo "✅ GitHub CLI найден"

# Авторизация (если нужно)
echo "🔐 Проверка авторизации..."
if ! gh auth status &> /dev/null; then
    echo "Необходима авторизация GitHub CLI"
    gh auth login
fi

# Включаем GitHub Pages через CLI
echo "🚀 Включаем GitHub Pages..."
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/vchilina27-design/GTA-1-Real-HTML/pages \
  --field "source[branch]=main" \
  --field "source[path]=/" \
  --jq '.message'

echo "✅ GitHub Pages настроен!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Перейдите на https://github.com/vchilina27-design/GTA-1-Real-HTML/settings/pages"
echo "2. Убедитесь, что Source установлен на 'Deploy from a branch'"
echo "3. Убедитесь, что Branch установлен на 'main'"
echo "4. Убедитесь, что Folder установлен на '/ (root)'"
echo "5. Нажмите Save"
echo ""
echo "🎯 Игра будет доступна по адресу: https://vchilina27-design.github.io/GTA-1-Real-HTML/"
echo ""
echo "⏰ Деплой может занять 1-2 минуты"