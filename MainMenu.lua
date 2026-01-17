--[[
    Professional Transparent Menu System
    Created for Roblox
    Features: Blur effects, smooth animations, modern UI
]]

local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local MenuModule = {}

local MENU_CONFIG = {
    BackgroundColor = Color3.fromRGB(20, 20, 25),
    BackgroundTransparency = 0.3,
    BorderColor = Color3.fromRGB(100, 200, 255),
    ButtonColor = Color3.fromRGB(40, 40, 50),
    ButtonHoverColor = Color3.fromRGB(60, 120, 200),
    TextColor = Color3.fromRGB(255, 255, 255),
    AccentColor = Color3.fromRGB(100, 200, 255),
    AnimationSpeed = 0.3,
    BlurSize = 24,
}

function MenuModule:CreateMenu()
    local screenGui = Instance.new("ScreenGui")
    screenGui.Name = "ProfessionalMenu"
    screenGui.ResetOnSpawn = false
    screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    screenGui.Parent = playerGui

    local blurEffect = Instance.new("BlurEffect")
    blurEffect.Size = 0
    blurEffect.Parent = game.Lighting

    local mainFrame = Instance.new("Frame")
    mainFrame.Name = "MainFrame"
    mainFrame.Size = UDim2.new(0, 500, 0, 600)
    mainFrame.Position = UDim2.new(0.5, 0, 0.5, 0)
    mainFrame.AnchorPoint = Vector2.new(0.5, 0.5)
    mainFrame.BackgroundColor3 = MENU_CONFIG.BackgroundColor
    mainFrame.BackgroundTransparency = MENU_CONFIG.BackgroundTransparency
    mainFrame.BorderSizePixel = 0
    mainFrame.ClipsDescendants = true
    mainFrame.Parent = screenGui

    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(0, 20)
    uiCorner.Parent = mainFrame

    local uiStroke = Instance.new("UIStroke")
    uiStroke.Color = MENU_CONFIG.BorderColor
    uiStroke.Thickness = 2
    uiStroke.Transparency = 0.5
    uiStroke.Parent = mainFrame

    local glowFrame = Instance.new("Frame")
    glowFrame.Name = "Glow"
    glowFrame.Size = UDim2.new(1, 40, 1, 40)
    glowFrame.Position = UDim2.new(0.5, 0, 0.5, 0)
    glowFrame.AnchorPoint = Vector2.new(0.5, 0.5)
    glowFrame.BackgroundColor3 = MENU_CONFIG.AccentColor
    glowFrame.BackgroundTransparency = 0.9
    glowFrame.BorderSizePixel = 0
    glowFrame.ZIndex = 0
    glowFrame.Parent = mainFrame

    local glowCorner = Instance.new("UICorner")
    glowCorner.CornerRadius = UDim.new(0, 25)
    glowCorner.Parent = glowFrame

    local titleLabel = Instance.new("TextLabel")
    titleLabel.Name = "Title"
    titleLabel.Size = UDim2.new(1, -40, 0, 80)
    titleLabel.Position = UDim2.new(0, 20, 0, 20)
    titleLabel.BackgroundTransparency = 1
    titleLabel.Text = "MAIN MENU"
    titleLabel.Font = Enum.Font.GothamBold
    titleLabel.TextSize = 36
    titleLabel.TextColor3 = MENU_CONFIG.TextColor
    titleLabel.TextXAlignment = Enum.TextXAlignment.Left
    titleLabel.Parent = mainFrame

    local titleGradient = Instance.new("UIGradient")
    titleGradient.Color = ColorSequence.new{
        ColorSequenceKeypoint.new(0, Color3.fromRGB(100, 200, 255)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(200, 100, 255))
    }
    titleGradient.Parent = titleLabel

    local subtitleLabel = Instance.new("TextLabel")
    subtitleLabel.Name = "Subtitle"
    subtitleLabel.Size = UDim2.new(1, -40, 0, 30)
    subtitleLabel.Position = UDim2.new(0, 20, 0, 65)
    subtitleLabel.BackgroundTransparency = 1
    subtitleLabel.Text = "Professional Menu System"
    subtitleLabel.Font = Enum.Font.Gotham
    subtitleLabel.TextSize = 14
    subtitleLabel.TextColor3 = MENU_CONFIG.TextColor
    subtitleLabel.TextTransparency = 0.5
    subtitleLabel.TextXAlignment = Enum.TextXAlignment.Left
    subtitleLabel.Parent = mainFrame

    local buttonContainer = Instance.new("Frame")
    buttonContainer.Name = "ButtonContainer"
    buttonContainer.Size = UDim2.new(1, -60, 0, 400)
    buttonContainer.Position = UDim2.new(0, 30, 0, 130)
    buttonContainer.BackgroundTransparency = 1
    buttonContainer.Parent = mainFrame

    local buttonLayout = Instance.new("UIListLayout")
    buttonLayout.Padding = UDim.new(0, 15)
    buttonLayout.SortOrder = Enum.SortOrder.LayoutOrder
    buttonLayout.Parent = buttonContainer

    local buttons = {
        {Text = "Play Game", Icon = "▶", Color = Color3.fromRGB(50, 200, 100)},
        {Text = "Settings", Icon = "⚙", Color = Color3.fromRGB(100, 150, 255)},
        {Text = "Inventory", Icon = "🎒", Color = Color3.fromRGB(255, 180, 50)},
        {Text = "Shop", Icon = "🛒", Color = Color3.fromRGB(255, 100, 150)},
        {Text = "Leaderboard", Icon = "🏆", Color = Color3.fromRGB(255, 215, 0)},
        {Text = "Exit", Icon = "✕", Color = Color3.fromRGB(255, 80, 80)}
    }

    for i, buttonData in ipairs(buttons) do
        self:CreateButton(buttonContainer, buttonData, i)
    end

    local footerLabel = Instance.new("TextLabel")
    footerLabel.Name = "Footer"
    footerLabel.Size = UDim2.new(1, 0, 0, 40)
    footerLabel.Position = UDim2.new(0, 0, 1, -50)
    footerLabel.BackgroundTransparency = 1
    footerLabel.Text = "Made with Luau | Version 1.0.0"
    footerLabel.Font = Enum.Font.Gotham
    footerLabel.TextSize = 12
    footerLabel.TextColor3 = MENU_CONFIG.TextColor
    footerLabel.TextTransparency = 0.7
    footerLabel.Parent = mainFrame

    mainFrame.Size = UDim2.new(0, 500, 0, 0)
    mainFrame.BackgroundTransparency = 1

    local openTween = TweenService:Create(mainFrame,
        TweenInfo.new(0.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
        {Size = UDim2.new(0, 500, 0, 600), BackgroundTransparency = MENU_CONFIG.BackgroundTransparency}
    )

    local blurTween = TweenService:Create(blurEffect,
        TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        {Size = MENU_CONFIG.BlurSize}
    )

    openTween:Play()
    blurTween:Play()

    self:AnimateGlow(glowFrame)

    return screenGui, blurEffect
end

function MenuModule:CreateButton(parent, buttonData, index)
    local button = Instance.new("TextButton")
    button.Name = buttonData.Text
    button.Size = UDim2.new(1, 0, 0, 60)
    button.BackgroundColor3 = MENU_CONFIG.ButtonColor
    button.BackgroundTransparency = 0.2
    button.BorderSizePixel = 0
    button.Text = ""
    button.AutoButtonColor = false
    button.LayoutOrder = index
    button.Parent = parent

    local buttonCorner = Instance.new("UICorner")
    buttonCorner.CornerRadius = UDim.new(0, 12)
    buttonCorner.Parent = button

    local buttonStroke = Instance.new("UIStroke")
    buttonStroke.Color = buttonData.Color
    buttonStroke.Thickness = 2
    buttonStroke.Transparency = 0.7
    buttonStroke.Parent = button

    local iconLabel = Instance.new("TextLabel")
    iconLabel.Name = "Icon"
    iconLabel.Size = UDim2.new(0, 40, 1, 0)
    iconLabel.Position = UDim2.new(0, 15, 0, 0)
    iconLabel.BackgroundTransparency = 1
    iconLabel.Text = buttonData.Icon
    iconLabel.Font = Enum.Font.GothamBold
    iconLabel.TextSize = 24
    iconLabel.TextColor3 = buttonData.Color
    iconLabel.Parent = button

    local textLabel = Instance.new("TextLabel")
    textLabel.Name = "Label"
    textLabel.Size = UDim2.new(1, -70, 1, 0)
    textLabel.Position = UDim2.new(0, 60, 0, 0)
    textLabel.BackgroundTransparency = 1
    textLabel.Text = buttonData.Text
    textLabel.Font = Enum.Font.GothamBold
    textLabel.TextSize = 18
    textLabel.TextColor3 = MENU_CONFIG.TextColor
    textLabel.TextXAlignment = Enum.TextXAlignment.Left
    textLabel.Parent = button

    local arrowLabel = Instance.new("TextLabel")
    arrowLabel.Name = "Arrow"
    arrowLabel.Size = UDim2.new(0, 30, 1, 0)
    arrowLabel.Position = UDim2.new(1, -40, 0, 0)
    arrowLabel.BackgroundTransparency = 1
    arrowLabel.Text = "→"
    arrowLabel.Font = Enum.Font.GothamBold
    arrowLabel.TextSize = 24
    arrowLabel.TextColor3 = buttonData.Color
    arrowLabel.TextTransparency = 0.5
    arrowLabel.Parent = button

    button.Position = UDim2.new(0, -500, 0, 0)

    task.wait(index * 0.05)

    local slideTween = TweenService:Create(button,
        TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
        {Position = UDim2.new(0, 0, 0, 0)}
    )
    slideTween:Play()

    button.MouseEnter:Connect(function()
        self:OnButtonHover(button, buttonStroke, arrowLabel, buttonData.Color, true)
    end)

    button.MouseLeave:Connect(function()
        self:OnButtonHover(button, buttonStroke, arrowLabel, buttonData.Color, false)
    end)

    button.MouseButton1Click:Connect(function()
        self:OnButtonClick(button, buttonData.Text)
    end)

    return button
end

function MenuModule:OnButtonHover(button, stroke, arrow, color, isHovering)
    local hoverTween = TweenService:Create(button,
        TweenInfo.new(MENU_CONFIG.AnimationSpeed, Enum.EasingStyle.Quad),
        {
            BackgroundColor3 = isHovering and MENU_CONFIG.ButtonHoverColor or MENU_CONFIG.ButtonColor,
            BackgroundTransparency = isHovering and 0.1 or 0.2
        }
    )

    local strokeTween = TweenService:Create(stroke,
        TweenInfo.new(MENU_CONFIG.AnimationSpeed, Enum.EasingStyle.Quad),
        {Transparency = isHovering and 0.3 or 0.7}
    )

    local arrowTween = TweenService:Create(arrow,
        TweenInfo.new(MENU_CONFIG.AnimationSpeed, Enum.EasingStyle.Quad),
        {
            Position = isHovering and UDim2.new(1, -35, 0, 0) or UDim2.new(1, -40, 0, 0),
            TextTransparency = isHovering and 0 or 0.5
        }
    )

    hoverTween:Play()
    strokeTween:Play()
    arrowTween:Play()
end

function MenuModule:OnButtonClick(button, buttonName)
    local clickTween = TweenService:Create(button,
        TweenInfo.new(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        {Size = UDim2.new(1, -10, 0, 55)}
    )

    clickTween:Play()

    task.wait(0.1)

    local returnTween = TweenService:Create(button,
        TweenInfo.new(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.In),
        {Size = UDim2.new(1, 0, 0, 60)}
    )

    returnTween:Play()

    print("Button clicked:", buttonName)

    if buttonName == "Exit" then
        self:CloseMenu()
    end
end

function MenuModule:AnimateGlow(glowFrame)
    local glowTween1 = TweenService:Create(glowFrame,
        TweenInfo.new(2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true),
        {BackgroundTransparency = 0.7}
    )

    glowTween1:Play()
end

function MenuModule:CloseMenu()
    local screenGui = playerGui:FindFirstChild("ProfessionalMenu")
    local blurEffect = game.Lighting:FindFirstChild("BlurEffect")

    if screenGui then
        local mainFrame = screenGui:FindFirstChild("MainFrame")

        local closeTween = TweenService:Create(mainFrame,
            TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.In),
            {Size = UDim2.new(0, 500, 0, 0), BackgroundTransparency = 1}
        )

        closeTween:Play()

        if blurEffect then
            local blurTween = TweenService:Create(blurEffect,
                TweenInfo.new(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.In),
                {Size = 0}
            )
            blurTween:Play()
        end

        task.wait(0.4)
        screenGui:Destroy()
        if blurEffect then
            blurEffect:Destroy()
        end
    end
end

function MenuModule:ToggleMenu()
    local existingMenu = playerGui:FindFirstChild("ProfessionalMenu")

    if existingMenu then
        self:CloseMenu()
    else
        self:CreateMenu()
    end
end

return MenuModule
