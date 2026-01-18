import base64
import random
import string

def get_random_string(length):
    return ''.join(random.choice(string.ascii_letters) for i in range(length))

def obfuscate_luau(code):
    # Step 1: Base64 encode the whole script
    encoded = base64.b64encode(code.encode()).decode()
    
    # Step 2: Create a multi-layered loader with junk code and random variables
    v1 = get_random_string(8)
    v2 = get_random_string(8)
    v3 = get_random_string(8)
    junk = f"local {get_random_string(5)} = {random.randint(100, 999)}; " * 5
    
    loader = f"""
--[[
    ENCRYPTED BY DANminga SYSTEM v2
    SECTOR: {get_random_string(4).upper()}
    BUILD: {random.randint(1000, 9999)}
]]
{junk}
local {v1} = "{encoded}"
local function {v2}({v3})
    local _j = {{}}
    for i=1, 10 do table.insert(_j, i) end
    return game:GetService("HttpService"):GetBase64Decoded({v3})
end
local _exec = loadstring({v2}({v1}))
{junk}
_exec()
"""
    return loader

def get_obfuscated_code():
    with open('menu.luau', 'r') as f:
        content = f.read()
    return obfuscate_luau(content)

if __name__ == "__main__":
    print("Obfuscator Ready.")
    with open("menu.luau", "r") as f:
        code = f.read()
    
    obfuscated = obfuscate_luau(code)
    
    with open("menu_obfuscated.luau", "w") as f:
        f.write(obfuscated)
    
    print("Obfuscation complete: menu_obfuscated.luau created.")
