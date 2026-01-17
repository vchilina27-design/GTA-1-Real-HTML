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
local _0x11 = game:GetService("Workspace").CurrentCamera

_0x8.CharacterAdded:Connect(function(_0x12)
	_0x9 = _0x12
	_0x10 = _0x12:WaitForChild("Humanoid")
end)

local function _0x13(_0x14)
	local _0x15 = Instance.new("Frame")
	local _0x16 = Instance.new("TextLabel")
	local _0x17 = Instance.new("TextButton")
	
	_0x15.Name = _0x14
	_0x15.Size = UDim2.new(1, 0, 0, 35)
	_0x15.BackgroundTransparency = 0.8
	_0x15.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
	_0x15.Parent = _0x4
	
	local _0x18 = Instance.new("UICorner")
	_0x18.CornerRadius = UDim.new(0, 6)
	_0x18.Parent = _0x15
	
	_0x16.Parent = _0x15
	_0x16.BackgroundTransparency = 1
	_0x16.Position = UDim2.new(0, 10, 0, 0)
	_0x16.Size = UDim2.new(0.7, 0, 1, 0)
	_0x16.Font = Enum.Font.Gotham
	_0x16.Text = _0x14
	_0x16.TextColor3 = Color3.fromRGB(255, 255, 255)
	_0x16.TextSize = 14
	_0x16.TextXAlignment = Enum.TextXAlignment.Left
	
	_0x17.Parent = _0x15
	_0x17.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
	_0x17.Position = UDim2.new(0.75, 0, 0.15, 0)
	_0x17.Size = UDim2.new(0.2, 0, 0.7, 0)
	_0x17.Font = Enum.Font.Gotham
	_0x17.Text = "OFF"
	_0x17.TextColor3 = Color3.fromRGB(255, 255, 255)
	_0x17.TextSize = 12
	
	local _0x19 = Instance.new("UICorner")
	_0x19.CornerRadius = UDim.new(0, 4)
	_0x19.Parent = _0x17
	
	_0x17.MouseButton1Click:Connect(function()
		_0x7[_0x14] = not _0x7[_0x14]
		_0x17.Text = _0x7[_0x14] and "ON" or "OFF"
		_0x17.BackgroundColor3 = _0x7[_0x14] and Color3.fromRGB(0, 170, 0) or Color3.fromRGB(40, 40, 40)
		
		if _0x14 == "Speed" then
			_0x10.WalkSpeed = _0x7[_0x14] and 50 or 16
		elseif _0x14 == "Jump" then
			_0x10.JumpPower = _0x7[_0x14] and 100 or 50
		elseif _0x14 == "Fly" then
			if _0x7[_0x14] then
				local _0x20 = Instance.new("BodyVelocity")
				_0x20.Name = "FlyVelocity"
				_0x20.Velocity = Vector3.new(0, 0, 0)
				_0x20.MaxForce = Vector3.new(4000, 4000, 4000)
				_0x20.Parent = _0x9:WaitForChild("HumanoidRootPart")
			else
				local _0x20 = _0x9.HumanoidRootPart:FindFirstChild("FlyVelocity")
				if _0x20 then _0x20:Destroy() end
			end
		end
	end)
end

local function _0x21(_0x22)
	if _0x22 ~= _0x8 then
		local _0x23 = Instance.new("Highlight")
		_0x23.Name = "EspHighlight"
		_0x23.FillColor = Color3.fromRGB(255, 0, 0)
		_0x23.OutlineColor = Color3.fromRGB(255, 255, 255)
		_0x23.FillTransparency = 0.5
		_0x23.OutlineTransparency = 0
		_0x23.Enabled = _0x7.Esp
		
		local function _0x24(_0x25)
			if _0x25 then
				_0x23.Parent = _0x25
			end
		end
		
		_0x24(_0x22.Character)
		_0x22.CharacterAdded:Connect(_0x24)
	end
end

local function _0x26()
	local _0x27 = nil
	local _0x28 = math.huge
	
	for _, _0x29 in pairs(game:GetService("Players"):GetPlayers()) do
		if _0x29 ~= _0x8 and _0x29.Character and _0x29.Character:FindFirstChild("Head") then
			local _0x30, _0x31 = _0x11:WorldToViewportPoint(_0x29.Character.Head.Position)
			if _0x31 then
				local _0x32 = (Vector2.new(_0x30.X, _0x30.Y) - Vector2.new(_0x11.ViewportSize.X/2, _0x11.ViewportSize.Y/2)).Magnitude
				if _0x32 < _0x28 then
					_0x28 = _0x32
					_0x27 = _0x29
				end
			end
		end
	end
	return _0x27
end

for _, _0x29 in pairs(game:GetService("Players"):GetPlayers()) do
	_0x21(_0x29)
end
game:GetService("Players").PlayerAdded:Connect(_0x21)

game:GetService("RunService").RenderStepped:Connect(function()
	if _0x7.Fly then
		local _0x33 = _0x9:FindFirstChild("HumanoidRootPart")
		local _0x20 = _0x33 and _0x33:FindFirstChild("FlyVelocity")
		if _0x20 then
			_0x20.Velocity = _0x10.MoveDirection * 50
		end
	end
	
	if _0x7.Aimbot then
		local _0x34 = _0x26()
		if _0x34 and _0x34.Character and _0x34.Character:FindFirstChild("Head") then
			_0x11.CFrame = CFrame.new(_0x11.CFrame.Position, _0x34.Character.Head.Position)
		end
	end
	
	for _, _0x29 in pairs(game:GetService("Players"):GetPlayers()) do
		if _0x29.Character then
			local _0x35 = _0x29.Character:FindFirstChild("EspHighlight")
			if _0x35 then
				_0x35.Enabled = _0x7.Esp
			end
		end
	end
end)

local _0x36 = game:GetService("UserInputService")
local _0x37 = Instance.new("TextButton")
local _0x38 = Instance.new("UICorner")

_0x37.Name = "MobileToggleButton"
_0x37.Parent = _0x1
_0x37.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
_0x37.BackgroundTransparency = 0.4
_0x37.Position = UDim2.new(0, 10, 0.5, -20)
_0x37.Size = UDim2.new(0, 40, 0, 40)
_0x37.Font = Enum.Font.GothamBold
_0x37.Text = "M"
_0x37.TextColor3 = Color3.fromRGB(255, 255, 255)
_0x37.TextSize = 20
_0x37.Active = true
_0x37.Draggable = true

_0x38.CornerRadius = UDim.new(0, 8)
_0x38.Parent = _0x37

_0x37.MouseButton1Click:Connect(function()
	_0x2.Visible = not _0x2.Visible
end)

_0x36.InputBegan:Connect(function(_0x39, _0x40)
	if not _0x40 and _0x39.KeyCode == Enum.KeyCode.Insert then
		_0x2.Visible = not _0x2.Visible
	end
end)

_0x13("Esp")
_0x13("Aimbot")
_0x13("Speed")
_0x13("Jump")
_0x13("Fly")
