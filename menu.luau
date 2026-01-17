local _0x1 = Instance.new("ScreenGui")
local _0x2 = Instance.new("Frame")
local _0x3 = Instance.new("TextLabel")
local _0x4 = Instance.new("ScrollingFrame")
local _0x5 = Instance.new("UIListLayout")

_0x1.Name = "TranslucentMenu"
_0x1.Parent = game:GetService("CoreGui")
_0x1.ResetOnSpawn = false

_0x2.Name = "MainFrame"
_0x2.Parent = _0x1
_0x2.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
_0x2.BackgroundTransparency = 0.4
_0x2.BorderSizePixel = 0
_0x2.Position = UDim2.new(0.5, -150, 0.5, -200)
_0x2.Size = UDim2.new(0, 300, 0, 400)
_0x2.Active = true
_0x2.Draggable = true

local _0x6 = Instance.new("UICorner")
_0x6.CornerRadius = UDim.new(0, 10)
_0x6.Parent = _0x2

_0x3.Name = "Title"
_0x3.Parent = _0x2
_0x3.BackgroundTransparency = 1
_0x3.Size = UDim2.new(1, 0, 0, 40)
_0x3.Font = Enum.Font.GothamBold
_0x3.Text = "MENU"
_0x3.TextColor3 = Color3.fromRGB(255, 255, 255)
_0x3.TextSize = 20

_0x4.Name = "SettingsContainer"
_0x4.Parent = _0x2
_0x4.BackgroundTransparency = 1
_0x4.BorderSizePixel = 0
_0x4.Position = UDim2.new(0, 10, 0, 50)
_0x4.Size = UDim2.new(1, -20, 1, -60)
_0x4.ScrollBarThickness = 4
_0x4.CanvasSize = UDim2.new(0, 0, 0, 0)
_0x4.AutomaticCanvasSize = Enum.AutomaticSize.Y

_0x5.Parent = _0x4
_0x5.Padding = UDim.new(0, 8)
_0x5.SortOrder = Enum.SortOrder.LayoutOrder

local _0x7 = {Esp = false, Aimbot = false, Speed = false, Jump = false, Fly = false}
local _0x8 = game:GetService("Players").LocalPlayer
local _0x9 = _0x8.Character or _0x8.CharacterAdded:Wait()
local _0x10 = _0x9:WaitForChild("Humanoid")

_0x8.CharacterAdded:Connect(function(_0x11)
	_0x9 = _0x11
	_0x10 = _0x11:WaitForChild("Humanoid")
end)

local function _0x12(_0x13)
	local _0x14 = Instance.new("Frame")
	local _0x15 = Instance.new("TextLabel")
	local _0x16 = Instance.new("TextButton")
	
	_0x14.Name = _0x13
	_0x14.Size = UDim2.new(1, 0, 0, 35)
	_0x14.BackgroundTransparency = 0.8
	_0x14.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
	_0x14.Parent = _0x4
	
	local _0x17 = Instance.new("UICorner")
	_0x17.CornerRadius = UDim.new(0, 6)
	_0x17.Parent = _0x14
	
	_0x15.Parent = _0x14
	_0x15.BackgroundTransparency = 1
	_0x15.Position = UDim2.new(0, 10, 0, 0)
	_0x15.Size = UDim2.new(0.7, 0, 1, 0)
	_0x15.Font = Enum.Font.Gotham
	_0x15.Text = _0x13
	_0x15.TextColor3 = Color3.fromRGB(255, 255, 255)
	_0x15.TextSize = 14
	_0x15.TextXAlignment = Enum.TextXAlignment.Left
	
	_0x16.Parent = _0x14
	_0x16.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
	_0x16.Position = UDim2.new(0.75, 0, 0.15, 0)
	_0x16.Size = UDim2.new(0.2, 0, 0.7, 0)
	_0x16.Font = Enum.Font.Gotham
	_0x16.Text = "OFF"
	_0x16.TextColor3 = Color3.fromRGB(255, 255, 255)
	_0x16.TextSize = 12
	
	local _0x18 = Instance.new("UICorner")
	_0x18.CornerRadius = UDim.new(0, 4)
	_0x18.Parent = _0x16
	
	_0x16.MouseButton1Click:Connect(function()
		_0x7[_0x13] = not _0x7[_0x13]
		_0x16.Text = _0x7[_0x13] and "ON" or "OFF"
		_0x16.BackgroundColor3 = _0x7[_0x13] and Color3.fromRGB(0, 170, 0) or Color3.fromRGB(40, 40, 40)
		
		if _0x13 == "Speed" then
			_0x10.WalkSpeed = _0x7[_0x13] and 50 or 16
		elseif _0x13 == "Jump" then
			_0x10.JumpPower = _0x7[_0x13] and 100 or 50
		elseif _0x13 == "Fly" then
			if _0x7[_0x13] then
				local _0x19 = Instance.new("BodyVelocity")
				_0x19.Name = "FlyVelocity"
				_0x19.Velocity = Vector3.new(0, 0, 0)
				_0x19.MaxForce = Vector3.new(4000, 4000, 4000)
				_0x19.Parent = _0x9:WaitForChild("HumanoidRootPart")
			else
				local _0x19 = _0x9.HumanoidRootPart:FindFirstChild("FlyVelocity")
				if _0x19 then _0x19:Destroy() end
			end
		end
	end)
end

local function _0x20(_0x21)
	if _0x21 ~= _0x8 then
		local _0x22 = Instance.new("Highlight")
		_0x22.Name = "EspHighlight"
		_0x22.FillColor = Color3.fromRGB(255, 0, 0)
		_0x22.OutlineColor = Color3.fromRGB(255, 255, 255)
		_0x22.FillTransparency = 0.5
		_0x22.OutlineTransparency = 0
		_0x22.Enabled = _0x7.Esp
		
		local function _0x23(_0x24)
			if _0x24 then
				_0x22.Parent = _0x24
			end
		end
		
		_0x23(_0x21.Character)
		_0x21.CharacterAdded:Connect(_0x23)
	end
end

for _, _0x25 in pairs(game:GetService("Players"):GetPlayers()) do
	_0x20(_0x25)
end
game:GetService("Players").PlayerAdded:Connect(_0x20)

game:GetService("RunService").RenderStepped:Connect(function()
	if _0x7.Fly then
		local _0x26 = _0x9:FindFirstChild("HumanoidRootPart")
		local _0x19 = _0x26 and _0x26:FindFirstChild("FlyVelocity")
		if _0x19 then
			_0x19.Velocity = _0x10.MoveDirection * 50
		end
	end
	
	for _, _0x25 in pairs(game:GetService("Players"):GetPlayers()) do
		if _0x25.Character then
			local _0x27 = _0x25.Character:FindFirstChild("EspHighlight")
			if _0x27 then
				_0x27.Enabled = _0x7.Esp
			end
		end
	end
end)

local _0x28 = game:GetService("UserInputService")
local _0x29 = Instance.new("TextButton")
local _0x30 = Instance.new("UICorner")

_0x29.Name = "MobileToggleButton"
_0x29.Parent = _0x1
_0x29.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
_0x29.BackgroundTransparency = 0.4
_0x29.Position = UDim2.new(0, 10, 0.5, -20)
_0x29.Size = UDim2.new(0, 40, 0, 40)
_0x29.Font = Enum.Font.GothamBold
_0x29.Text = "M"
_0x29.TextColor3 = Color3.fromRGB(255, 255, 255)
_0x29.TextSize = 20
_0x29.Active = true
_0x29.Draggable = true

_0x30.CornerRadius = UDim.new(0, 8)
_0x30.Parent = _0x29

_0x29.MouseButton1Click:Connect(function()
	_0x2.Visible = not _0x2.Visible
end)

_0x28.InputBegan:Connect(function(_0x31, _0x32)
	if not _0x32 and _0x31.KeyCode == Enum.KeyCode.Insert then
		_0x2.Visible = not _0x2.Visible
	end
end)

_0x12("Esp")
_0x12("Aimbot")
_0x12("Speed")
_0x12("Jump")
_0x12("Fly")
