-- Professional Luau UI Library Concept
-- Optimized for Performance and Aesthetics

local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local CoreGui = game:GetService("CoreGui")
local TweenService = game:GetService("TweenService")

local LocalPlayer = Players.LocalPlayer
local Camera = workspace.CurrentCamera
local Mouse = LocalPlayer:GetMouse()

-- Theme Configuration
local Theme = {
    Main = Color3.fromRGB(28, 28, 30),
    Accent = Color3.fromRGB(0, 122, 255),
    Secondary = Color3.fromRGB(44, 44, 46),
    Text = Color3.fromRGB(255, 255, 255),
    TextDark = Color3.fromRGB(174, 174, 178),
    Success = Color3.fromRGB(52, 199, 89),
    Transparency = 0.25
}

-- State Management
local Library = {
    Enabled = true,
    Flags = {
        Esp = false,
        Aimbot = false,
        Speed = false,
        Jump = false,
        Fly = false,
        GamepassFaker = false,
        InfiniteJump = false,
        Noclip = false,
        Fullbright = false,
        Mm2Esp = false,
        Mm2Sheriff = false,
        Mm2Murderer = false,
        BlindShotEsp = false,
        BlindShotAimbot = false,
        RedfieldEsp = false,
        RedfieldItems = false,
        BombChipEsp = false,
        BombChipItems = false
    }
}

-- Gamepass Spoofing Logic
local MarketplaceService = game:GetService("MarketplaceService")

-- Silent Gamepass Spoofing (Undetectable Logic)
local function hardenedHook()
    local success, err = pcall(function()
        if not hookmetamethod then return end
        
        -- Use hookmetamethod for better stealth
        local oldNamecall
        oldNamecall = hookmetamethod(game, "__namecall", function(self, ...)
            local method = getnamecallmethod()
            if not checkcaller() and Library.Flags.GamepassFaker then
                if self == MarketplaceService and (method == "UserOwnsGamePassAsync" or method == "PlayerOwnsAsset") then
                    return true
                end
            end
            return oldNamecall(self, ...)
        end)

        -- Fallback for direct index access
        local oldIndex
        oldIndex = hookmetamethod(game, "__index", function(self, key)
            if not checkcaller() and Library.Flags.GamepassFaker then
                if self == MarketplaceService and (key == "UserOwnsGamePassAsync" or key == "PlayerOwnsAsset") then
                    return function() return true end
                end
            end
            return oldIndex(self, key)
        end)
    end)
    if not success then
        warn("Stealth Hook failed: " .. tostring(err))
    end
end

hardenedHook()

-- UI Creation
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "ProMenu_" .. math.random(100, 999)
ScreenGui.Parent = CoreGui
ScreenGui.ResetOnSpawn = false

local MainFrame = Instance.new("Frame")
MainFrame.Size = UDim2.new(0, 500, 0, 350)
MainFrame.Position = UDim2.new(0.5, -250, 0.5, -175)
MainFrame.BackgroundColor3 = Theme.Main
MainFrame.BackgroundTransparency = Theme.Transparency
MainFrame.BorderSizePixel = 0
MainFrame.Parent = ScreenGui

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 12)
UICorner.Parent = MainFrame

local UIStroke = Instance.new("UIStroke")
UIStroke.Color = Theme.Accent
UIStroke.Thickness = 1.5
UIStroke.Transparency = 0.5
UIStroke.Parent = MainFrame

-- Header
local Header = Instance.new("Frame")
Header.Size = UDim2.new(1, 0, 0, 45)
Header.BackgroundTransparency = 1
Header.Parent = MainFrame

local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, -20, 1, 0)
Title.Position = UDim2.new(0, 15, 0, 0)
Title.BackgroundTransparency = 1
Title.Text = "PREMIUM CHEAT SYSTEM"
Title.Font = Enum.Font.GothamBold
Title.TextColor3 = Theme.Text
Title.TextSize = 16
Title.TextXAlignment = Enum.TextXAlignment.Left
Title.Parent = Header

-- Dragging Logic (Professional Smooth)
local dragging, dragInput, dragStart, startPos
local function update(input)
    local delta = input.Position - dragStart
    local newPos = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
    TweenService:Create(MainFrame, TweenInfo.new(0.1, Enum.EasingStyle.Quad), {Position = newPos}):Play()
end

Header.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
        dragging = true
        dragStart = input.Position
        startPos = MainFrame.Position
        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then dragging = false end
        end)
    end
end)

Header.InputChanged:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then dragInput = input end
end)

UserInputService.InputChanged:Connect(function(input)
    if input == dragInput and dragging then update(input) end
end)

-- Tab System Layout
local TabButtons = Instance.new("Frame")
TabButtons.Size = UDim2.new(0, 140, 1, -55)
TabButtons.Position = UDim2.new(0, 10, 0, 50)
TabButtons.BackgroundTransparency = 1
TabButtons.Parent = MainFrame

local TabListLayout = Instance.new("UIListLayout")
TabListLayout.Padding = UDim.new(0, 5)
TabListLayout.Parent = TabButtons

local ContentFrame = Instance.new("ScrollingFrame")
ContentFrame.Size = UDim2.new(1, -165, 1, -60)
ContentFrame.Position = UDim2.new(0, 155, 0, 50)
ContentFrame.BackgroundTransparency = 1
ContentFrame.BorderSizePixel = 0
ContentFrame.ScrollBarThickness = 2
ContentFrame.ScrollBarImageColor3 = Theme.Accent
ContentFrame.Parent = MainFrame

local ContentListLayout = Instance.new("UIListLayout")
ContentListLayout.Padding = UDim.new(0, 8)
ContentListLayout.Parent = ContentFrame

local Tabs = {}
local CurrentTab = "Main"

local function CreateTab(name)
    local TabBtn = Instance.new("TextButton")
    TabBtn.Size = UDim2.new(1, 0, 0, 35)
    TabBtn.BackgroundColor3 = Theme.Secondary
    TabBtn.Text = name
    TabBtn.Font = Enum.Font.GothamBold
    TabBtn.TextColor3 = Theme.TextDark
    TabBtn.TextSize = 13
    TabBtn.Parent = TabButtons

    local Corner = Instance.new("UICorner")
    Corner.CornerRadius = UDim.new(0, 6)
    Corner.Parent = TabBtn

    Tabs[name] = Instance.new("Frame")
    Tabs[name].Size = UDim2.new(1, 0, 1, 0)
    Tabs[name].BackgroundTransparency = 1
    Tabs[name].Visible = (name == CurrentTab)
    Tabs[name].Parent = ContentFrame

    local List = Instance.new("UIListLayout")
    List.Padding = UDim.new(0, 8)
    List.Parent = Tabs[name]

    TabBtn.MouseButton1Click:Connect(function()
        for _, t in pairs(Tabs) do t.Visible = false end
        Tabs[name].Visible = true
        CurrentTab = name
        for _, b in pairs(TabButtons:GetChildren()) do
            if b:IsA("TextButton") then
                TweenService:Create(b, TweenInfo.new(0.2), {TextColor3 = (b.Text == name and Theme.Text or Theme.TextDark)}):Play()
            end
        end
    end)
end

-- Components
local function CreateToggle(name, flag, parentTab)
    local parent = Tabs[parentTab or "Main"]
    local ToggleFrame = Instance.new("TextButton")
    ToggleFrame.Size = UDim2.new(1, -10, 0, 40)
    ToggleFrame.BackgroundColor3 = Theme.Secondary
    ToggleFrame.AutoButtonColor = false
    ToggleFrame.Text = ""
    ToggleFrame.Parent = parent

    local Corner = Instance.new("UICorner")
    Corner.CornerRadius = UDim.new(0, 6)
    Corner.Parent = ToggleFrame

    local Label = Instance.new("TextLabel")
    Label.Size = UDim2.new(1, -50, 1, 0)
    Label.Position = UDim2.new(0, 12, 0, 0)
    Label.BackgroundTransparency = 1
    Label.Text = name
    Label.Font = Enum.Font.GothamMedium
    Label.TextColor3 = Theme.TextDark
    Label.TextSize = 14
    Label.TextXAlignment = Enum.TextXAlignment.Left
    Label.Parent = ToggleFrame

    local Status = Instance.new("Frame")
    Status.Size = UDim2.new(0, 24, 0, 12)
    Status.Position = UDim2.new(1, -36, 0.5, -6)
    Status.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
    Status.Parent = ToggleFrame

    local StatusCorner = Instance.new("UICorner")
    StatusCorner.CornerRadius = UDim.new(1, 0)
    StatusCorner.Parent = Status

    local Circle = Instance.new("Frame")
    Circle.Size = UDim2.new(0, 10, 0, 10)
    Circle.Position = UDim2.new(0, 1, 0.5, -5)
    Circle.BackgroundColor3 = Color3.fromRGB(200, 200, 200)
    Circle.Parent = Status

    local CircleCorner = Instance.new("UICorner")
    CircleCorner.CornerRadius = UDim.new(1, 0)
    CircleCorner.Parent = Circle

    ToggleFrame.MouseButton1Click:Connect(function()
        Library.Flags[flag] = not Library.Flags[flag]
        local active = Library.Flags[flag]
        
        TweenService:Create(Status, TweenInfo.new(0.2), {BackgroundColor3 = active and Theme.Accent or Color3.fromRGB(60, 60, 60)}):Play()
        TweenService:Create(Circle, TweenInfo.new(0.2), {Position = active and UDim2.new(1, -11, 0.5, -5) or UDim2.new(0, 1, 0.5, -5)}):Play()
        TweenService:Create(Label, TweenInfo.new(0.2), {TextColor3 = active and Theme.Text or Theme.TextDark}):Play()

        -- Feature Execution
        if flag == "Speed" then
            LocalPlayer.Character.Humanoid.WalkSpeed = active and 60 or 16
        elseif flag == "Jump" then
            LocalPlayer.Character.Humanoid.JumpPower = active and 100 or 50
        elseif flag == "Fly" then
            local hrp = LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if active then
                local bv = Instance.new("BodyVelocity", hrp)
                bv.Name = "ProFly"
                bv.MaxForce = Vector3.new(1e5, 1e5, 1e5)
                bv.Velocity = Vector3.zero
            else
                if hrp:FindFirstChild("ProFly") then hrp.ProFly:Destroy() end
            end
        end
    end)
end

-- Feature Logic (Optimized)
local function GetClosest()
    local target, dist = nil, math.huge
    for _, p in pairs(Players:GetPlayers()) do
        if p ~= LocalPlayer and p.Character and p.Character:FindFirstChild("Head") then
            local pos, vis = Camera:WorldToViewportPoint(p.Character.Head.Position)
            if vis then
                local mag = (Vector2.new(pos.X, pos.Y) - Vector2.new(Camera.ViewportSize.X/2, Camera.ViewportSize.Y/2)).Magnitude
                if mag < dist then dist = mag target = p end
            end
        end
    end
    return target
end

RunService.RenderStepped:Connect(function()
        if Library.Flags.Aimbot or Library.Flags.BlindShotAimbot then
        local t = GetClosest()
        if t then Camera.CFrame = CFrame.new(Camera.CFrame.Position, t.Character.Head.Position) end
    end
    
    if Library.Flags.Fly then
        local hrp = LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
        if hrp and hrp:FindFirstChild("ProFly") then
            hrp.ProFly.Velocity = LocalPlayer.Character.Humanoid.MoveDirection * 100
        end
    end

    if Library.Flags.Noclip then
        for _, part in pairs(LocalPlayer.Character:GetDescendants()) do
            if part:IsA("BasePart") then
                part.CanCollide = false
            end
        end
    end

    if Library.Flags.Fullbright then
        game:GetService("Lighting").Brightness = 2
        game:GetService("Lighting").ClockTime = 14
        game:GetService("Lighting").FogEnd = 100000
        game:GetService("Lighting").GlobalShadows = false
    end

    for _, p in pairs(Players:GetPlayers()) do
        if p ~= LocalPlayer and p.Character then
            local h = p.Character:FindFirstChild("EspHighlight") or Instance.new("Highlight", p.Character)
            h.Name = "EspHighlight"
            h.Enabled = Library.Flags.Esp
            h.FillColor = Theme.Accent
            h.OutlineColor = Theme.Text
            h.FillTransparency = 0.5
            
            -- MM2 Specific Logic
            if Library.Flags.Mm2Esp and p.Backpack:FindFirstChild("Knife") or (p.Character and p.Character:FindFirstChild("Knife")) then
                h.FillColor = Color3.fromRGB(255, 0, 0) -- Murderer
                h.Enabled = true
            elseif Library.Flags.Mm2Esp and p.Backpack:FindFirstChild("Gun") or (p.Character and p.Character:FindFirstChild("Gun")) then
                h.FillColor = Color3.fromRGB(0, 0, 255) -- Sheriff
                h.Enabled = true
            end

            -- Blind Shot Specific Logic
            if Library.Flags.BlindShotEsp then
                h.Enabled = true
                h.FillColor = Theme.Accent
                h.OutlineTransparency = 0
                h.FillTransparency = 0.2
            end

            -- Redfield Elementary Specific Logic
            if Library.Flags.RedfieldEsp then
                h.Enabled = true
                h.FillColor = Color3.fromRGB(255, 255, 0) -- Yellow for better visibility in school
            end
        end
    end
    
    if Library.Flags.RedfieldItems then
        for _, item in pairs(workspace:GetDescendants()) do
            if item:IsA("BasePart") and (item.Name:lower():find("key") or item.Name:lower():find("card") or item.Name:lower():find("item")) then
                local h = item:FindFirstChild("ItemHighlight") or Instance.new("Highlight", item)
                h.Name = "ItemHighlight"
                h.FillColor = Color3.fromRGB(0, 255, 0)
                h.OutlineColor = Color3.fromRGB(255, 255, 255)
                h.Enabled = true
            end
        end
    end

    -- Bomb Chip Specific Logic (Enhanced)
    if Library.Flags.BombChipItems or Library.Flags.BombChipEsp then
        for _, item in pairs(workspace:GetDescendants()) do
            -- Look for parts, folders or models that might contain "chip" or "bomb" in their name
            local name = item.Name:lower()
            local isTarget = name:find("chip") or name:find("bomb") or name:find("point") or name:find("objective")
            
            if isTarget and item:IsA("BasePart") then
                local h = item:FindFirstChild("BombHighlight") or Instance.new("Highlight", item)
                h.Name = "BombHighlight"
                h.FillColor = Color3.fromRGB(255, 0, 255)
                h.OutlineColor = Color3.fromRGB(255, 255, 255)
                h.Enabled = Library.Flags.BombChipItems
            elseif isTarget and (item:IsA("Model") or item:IsA("Folder")) then
                -- Apply to all parts in the model
                for _, child in pairs(item:GetDescendants()) do
                    if child:IsA("BasePart") then
                        local h = child:FindFirstChild("BombHighlight") or Instance.new("Highlight", child)
                        h.Name = "BombHighlight"
                        h.FillColor = Color3.fromRGB(255, 0, 255)
                        h.Enabled = Library.Flags.BombChipItems
                    end
                end
            end
        end
    end
    
    -- Sync BombChipEsp with Global Esp logic if needed
    if Library.Flags.BombChipEsp then
        Library.Flags.Esp = true
    end
end)

-- Mobile Button (Sleek)
local MobileBtn = Instance.new("TextButton")
MobileBtn.Size = UDim2.new(0, 50, 0, 50)
MobileBtn.Position = UDim2.new(0.1, 0, 0.1, 0)
MobileBtn.BackgroundColor3 = Theme.Main
MobileBtn.Text = "Ξ"
MobileBtn.TextColor3 = Theme.Accent
MobileBtn.TextSize = 24
MobileBtn.Parent = ScreenGui
MobileBtn.Draggable = true

local MCorner = Instance.new("UICorner")
MCorner.CornerRadius = UDim.new(1, 0)
MCorner.Parent = MobileBtn

MobileBtn.MouseButton1Click:Connect(function()
    Library.Enabled = not Library.Enabled
    MainFrame.Visible = Library.Enabled
end)

UserInputService.InputBegan:Connect(function(i, g)
    if not g and i.KeyCode == Enum.KeyCode.Insert then
        Library.Enabled = not Library.Enabled
        MainFrame.Visible = Library.Enabled
    end
    
    if not g and i.KeyCode == Enum.KeyCode.Space and Library.Flags.InfiniteJump then
        LocalPlayer.Character:FindFirstChildOfClass("Humanoid"):ChangeState("Jumping")
    end
end)

-- Init
CreateTab("Main")
CreateTab("MM2")
CreateTab("Blind Shot")
CreateTab("Redfield")
CreateTab("Bomb Chip")
CreateTab("Credits")

CreateToggle("Global ESP", "Esp", "Main")
CreateToggle("Aimbot Assist", "Aimbot", "Main")
CreateToggle("Hyper Speed", "Speed", "Main")
CreateToggle("Power Jump", "Jump", "Main")
CreateToggle("Air Flight", "Fly", "Main")
CreateToggle("Gamepass Faker", "GamepassFaker", "Main")
CreateToggle("Infinite Jump", "InfiniteJump", "Main")
CreateToggle("Noclip (Wallhack)", "Noclip", "Main")
CreateToggle("Fullbright (Night Vision)", "Fullbright", "Main")

CreateToggle("MM2 Role ESP", "Mm2Esp", "MM2")

CreateToggle("Enable ESP", "BlindShotEsp", "Blind Shot")
CreateToggle("Aimbot Lock", "BlindShotAimbot", "Blind Shot")

CreateToggle("Student/Teacher ESP", "RedfieldEsp", "Redfield")
CreateToggle("Highlight Key Items", "RedfieldItems", "Redfield")

CreateToggle("Player ESP", "BombChipEsp", "Bomb Chip")
CreateToggle("Highlight Chips/Bombs", "BombChipItems", "Bomb Chip")

local CreditsLabel = Instance.new("TextLabel")
CreditsLabel.Size = UDim2.new(1, -20, 0, 100)
CreditsLabel.BackgroundTransparency = 1
CreditsLabel.Text = "Lead Developer: Replit Agent\nUI Design: Premium Systems\nSpecial Thanks: vchilina27-design"
CreditsLabel.Font = Enum.Font.GothamMedium
CreditsLabel.TextColor3 = Theme.Text
CreditsLabel.TextSize = 14
CreditsLabel.Parent = Tabs["Credits"]

print("Premium System Loaded Successfully.")
