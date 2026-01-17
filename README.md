# Professional Transparent Luau Menu

Профессиональная система меню для Roblox с полупрозрачным дизайном и плавными анимациями.

## Возможности

- Полупрозрачный фон с эффектом размытия
- Плавные анимации появления и исчезновения
- Hover эффекты на кнопках
- Градиентные цвета и свечение
- Современный UI дизайн
- 6 предустановленных кнопок меню
- Полностью настраиваемая конфигурация

## Установка в Roblox Studio

### Вариант 1: LocalScript

1. Откройте Roblox Studio
2. Создайте новый LocalScript в StarterPlayer > StarterPlayerScripts
3. Скопируйте содержимое MainMenu.lua в этот скрипт
4. Добавьте в конец скрипта:

```lua
local MenuModule = require(script)
MenuModule:CreateMenu()
```

### Вариант 2: ModuleScript

1. Создайте ModuleScript в ReplicatedStorage
2. Назовите его "MenuModule"
3. Вставьте код из MainMenu.lua
4. В LocalScript используйте:

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local MenuModule = require(ReplicatedStorage.MenuModule)

-- Создать меню
MenuModule:CreateMenu()

-- Или переключить меню (открыть/закрыть)
MenuModule:ToggleMenu()
```

## Использование

### Открыть меню
```lua
MenuModule:CreateMenu()
```

### Закрыть меню
```lua
MenuModule:CloseMenu()
```

### Переключить меню (toggle)
```lua
MenuModule:ToggleMenu()
```

### Привязать к клавише (например, ESC)
```lua
local UserInputService = game:GetService("UserInputService")

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if not gameProcessed and input.KeyCode == Enum.KeyCode.Escape then
        MenuModule:ToggleMenu()
    end
end)
```

## Настройка

Измените параметры в таблице `MENU_CONFIG`:

```lua
local MENU_CONFIG = {
    BackgroundColor = Color3.fromRGB(20, 20, 25),      -- Цвет фона
    BackgroundTransparency = 0.3,                       -- Прозрачность фона
    BorderColor = Color3.fromRGB(100, 200, 255),       -- Цвет границы
    ButtonColor = Color3.fromRGB(40, 40, 50),          -- Цвет кнопок
    ButtonHoverColor = Color3.fromRGB(60, 120, 200),   -- Цвет при наведении
    TextColor = Color3.fromRGB(255, 255, 255),         -- Цвет текста
    AccentColor = Color3.fromRGB(100, 200, 255),       -- Акцентный цвет
    AnimationSpeed = 0.3,                               -- Скорость анимаций
    BlurSize = 24,                                      -- Размер размытия
}
```

## Кнопки

По умолчанию доступны 6 кнопок:
- Play Game - Начать игру
- Settings - Настройки
- Inventory - Инвентарь
- Shop - Магазин
- Leaderboard - Таблица лидеров
- Exit - Выход (закрывает меню)

### Добавить свою кнопку

Добавьте в массив `buttons`:

```lua
{Text = "Custom Button", Icon = "🎮", Color = Color3.fromRGB(255, 100, 200)}
```

### Обработать нажатие кнопки

Измените функцию `OnButtonClick`:

```lua
function MenuModule:OnButtonClick(button, buttonName)
    -- Ваш код

    if buttonName == "Play Game" then
        -- Начать игру
        game:GetService("ReplicatedStorage").StartGame:FireServer()
    elseif buttonName == "Settings" then
        -- Открыть настройки
    end
end
```

## Технические детали

- Использует TweenService для плавных анимаций
- Эффект размытия через Lighting.BlurEffect
- Адаптивные UICorner и UIStroke для современного вида
- UIGradient для градиентного текста
- Автоматические анимации появления кнопок

## Совместимость

- Roblox Studio
- Luau (Lua 5.1 compatible)
- Все платформы (PC, Mobile, Console)

## Пример полного скрипта

```lua
-- LocalScript в StarterPlayer > StarterPlayerScripts

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")

-- Вставьте сюда весь код из MainMenu.lua
-- ... (код MenuModule) ...

-- Создать меню при загрузке
MenuModule:CreateMenu()

-- Переключение по клавише ESC
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if not gameProcessed and input.KeyCode == Enum.KeyCode.Escape then
        MenuModule:ToggleMenu()
    end
end)
```

## Лицензия

MIT License - свободно используйте в своих проектах!
