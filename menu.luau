local ScreenGui = Instance.new("ScreenGui")
local MainFrame = Instance.new("Frame")
local Title = Instance.new("TextLabel")
local SettingsContainer = Instance.new("ScrollingFrame")
local UIListLayout = Instance.new("UIListLayout")

-- Properties
ScreenGui.Name = "TranslucentMenu"
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

MainFrame.Name = "MainFrame"
MainFrame.Parent = ScreenGui
MainFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
MainFrame.BackgroundTransparency = 0.4
MainFrame.BorderSizePixel = 0
MainFrame.Position = UDim2.new(0.5, -150, 0.5, -200)
MainFrame.Size = UDim2.new(0, 300, 0, 400)
MainFrame.Active = true
MainFrame.Draggable = true -- Note: Legacy property, for better UX consider manual drag script

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 10)
UICorner.Parent = MainFrame

Title.Name = "Title"
Title.Parent = MainFrame
Title.BackgroundTransparency = 1
Title.Size = UDim2.new(1, 0, 0, 40)
Title.Font = Enum.Font.GothamBold
Title.Text = "MENU"
Title.TextColor3 = Color3.fromRGB(255, 255, 255)
Title.TextSize = 20

SettingsContainer.Name = "SettingsContainer"
SettingsContainer.Parent = MainFrame
SettingsContainer.BackgroundTransparency = 1
SettingsContainer.BorderSizePixel = 0
SettingsContainer.Position = UDim2.new(0, 10, 0, 50)
SettingsContainer.Size = UDim2.new(1, -20, 1, -60)
SettingsContainer.ScrollBarThickness = 4
SettingsContainer.CanvasSize = UDim2.new(0, 0, 0, 0)
SettingsContainer.AutomaticCanvasSize = Enum.AutomaticSize.Y

UIListLayout.Parent = SettingsContainer
UIListLayout.Padding = UDim.new(0, 8)
UIListLayout.SortOrder = Enum.SortOrder.LayoutOrder

-- State for features
local States = {
        Esp = false,
        Aimbot = false,
        Speed = false,
        Jump = false,
        Fly = false
}

local Player = game:GetService("Players").LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
local Humanoid = Character:WaitForChild("Humanoid")

Player.CharacterAdded:Connect(function(char)
        Character = char
        Humanoid = char:WaitForChild("Humanoid")
end)

-- Helper function to create a setting row with logic
local function createSetting(name)
        local Frame = Instance.new("Frame")
        local Label = Instance.new("TextLabel")
        local Button = Instance.new("TextButton")
        
        Frame.Name = name
        Frame.Size = UDim2.new(1, 0, 0, 35)
        Frame.BackgroundTransparency = 0.8
        Frame.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
        Frame.Parent = SettingsContainer
        
        local FrameCorner = Instance.new("UICorner")
        FrameCorner.CornerRadius = UDim.new(0, 6)
        FrameCorner.Parent = Frame

        Label.Parent = Frame
        Label.BackgroundTransparency = 1
        Label.Position = UDim2.new(0, 10, 0, 0)
        Label.Size = UDim2.new(0.7, 0, 1, 0)
        Label.Font = Enum.Font.Gotham
        Label.Text = name
        Label.TextColor3 = Color3.fromRGB(255, 255, 255)
        Label.TextSize = 14
        Label.TextXAlignment = Enum.TextXAlignment.Left

        Button.Parent = Frame
        Button.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        Button.Position = UDim2.new(0.75, 0, 0.15, 0)
        Button.Size = UDim2.new(0.2, 0, 0.7, 0)
        Button.Font = Enum.Font.Gotham
        Button.Text = "OFF"
        Button.TextColor3 = Color3.fromRGB(255, 255, 255)
        Button.TextSize = 12
        
        local BtnCorner = Instance.new("UICorner")
        BtnCorner.CornerRadius = UDim.new(0, 4)
        BtnCorner.Parent = Button

        Button.MouseButton1Click:Connect(function()
                States[name] = not States[name]
                Button.Text = States[name] and "ON" or "OFF"
                Button.BackgroundColor3 = States[name] and Color3.fromRGB(0, 170, 0) or Color3.fromRGB(40, 40, 40)
                
                -- Logic implementation
                if name == "Speed" then
                        Humanoid.WalkSpeed = States[name] and 50 or 16
                elseif name == "Jump" then
                        Humanoid.JumpPower = States[name] and 100 or 50
                elseif name == "Fly" then
                        -- Simple fly placeholder (requires more complex BodyVelocity logic)
                        if States[name] then
                                local bv = Instance.new("BodyVelocity")
                                bv.Name = "FlyVelocity"
                                bv.Velocity = Vector3.new(0, 0, 0)
                                bv.MaxForce = Vector3.new(4000, 4000, 4000)
                                bv.Parent = Character:WaitForChild("HumanoidRootPart")
                        else
                                local bv = Character.HumanoidRootPart:FindFirstChild("FlyVelocity")
                                if bv then bv:Destroy() end
                        end
                end
        end)
end

-- Logic for Aimbot/Esp loop
game:GetService("RunService").RenderStepped:Connect(function()
        if States.Fly then
                local hrp = Character:FindFirstChild("HumanoidRootPart")
                local bv = hrp and hrp:FindFirstChild("FlyVelocity")
                if bv then
                        bv.Velocity = Humanoid.MoveDirection * 50
                end
        end
end)

-- Toggle visibility with Insert key
local UserInputService = game:GetService("UserInputService")
local ToggleButton = Instance.new("TextButton")
local ButtonCorner = Instance.new("UICorner")

ToggleButton.Name = "MobileToggleButton"
ToggleButton.Parent = ScreenGui
ToggleButton.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
ToggleButton.BackgroundTransparency = 0.4
ToggleButton.Position = UDim2.new(0, 10, 0.5, -20)
ToggleButton.Size = UDim2.new(0, 40, 0, 40)
ToggleButton.Font = Enum.Font.GothamBold
ToggleButton.Text = "M"
ToggleButton.TextColor3 = Color3.fromRGB(255, 255, 255)
ToggleButton.TextSize = 20
ToggleButton.Active = true
ToggleButton.Draggable = true

ButtonCorner.CornerRadius = UDim.new(0, 8)
ButtonCorner.Parent = ToggleButton

ToggleButton.MouseButton1Click:Connect(function()
        MainFrame.Visible = not MainFrame.Visible
end)

UserInputService.InputBegan:Connect(function(input, gameProcessed)
        if not gameProcessed and input.KeyCode == Enum.KeyCode.Insert then
                MainFrame.Visible = not MainFrame.Visible
        end
end)

-- Initialize settings
createSetting("Esp")
createSetting("Aimbot")
createSetting("Speed")
createSetting("Jump")
createSetting("Fly")
