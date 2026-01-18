import random
import string
import base64

def get_obfuscated_code():
    with open('menu.luau', 'r') as f:
        content = f.read()
    
    # Simple XOR-like Base64 obfuscation for the loader
    encoded = base64.b64encode(content.encode()).decode()
    
    # This is a template for the loader that the user would actually use
    loader = f"""
-- [[ PREMIUM OBFUSCATED LOADER ]]
-- CEO & OWNER VERSION
local _ = "{encoded}"
local function decode(str)
    local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    str = string.gsub(str, '[^'..b..'=]', '')
    return (str:gsub('.', function(x)
        if (x == '=') then return '' end
        local r,f='',(b:find(x)-1)
        for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end
        return r;
    end):gsub('%d%d%d%d%d%d%d%d', function(x)
        local c=0
        for i=1,8 do c=c+(x:sub(i,i)=='1' and 2^(8-i) or 0) end
        return string.char(c)
    end))
end

local code = decode(_)
local success, err = pcall(function()
    loadstring(code)()
end)

if not success then
    warn("Failed to load: " .. tostring(err))
end
"""
    return loader

if __name__ == "__main__":
    print("Obfuscator Ready.")
    # In a real scenario, this script could be part of a web server 
    # that serves the obfuscated code dynamically.
