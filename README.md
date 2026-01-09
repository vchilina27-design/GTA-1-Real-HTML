# GTA-1-Real-HTML

A GTA 1-style top-down shooter game built with HTML5, CSS3, and JavaScript. Features two detailed maps, enemy AI, and classic arcade-style gameplay.

## Features

### 🗺️ Two Detailed Maps

#### Map 1: City Street
- Detailed urban environment with buildings of various sizes
- Roads with lane markings and crosswalks
- Trees, streetlamps, and benches
- Parked cars scattered around the map
- Boxes and containers for tactical cover
- Road cracks and realistic details

#### Map 2: Sandstone (Industrial)
- Industrial-themed environment inspired by Standoff 2
- Concrete structures with realistic textures
- Metal buildings (garages, hangars)
- Steel platforms and stairs
- Shipping containers and crates
- Pipes and technical elements
- Rooftop structures

### 🎮 Gameplay Features

- **Player Controls**: WASD or Arrow keys for movement, Mouse for aiming
- **Combat System**: Space bar to shoot, ammo management
- **Enemy AI**: Enemies patrol, detect player, and engage in combat
- **Health System**: Visual health bar with damage feedback
- **Score System**: Earn money by defeating enemies and collecting pickups
- **Collision Detection**: Realistic collisions with buildings, walls, and obstacles
- **Camera System**: Smooth camera that follows the player
- **Map Boundaries**: Players and enemies cannot leave the map

### 🎯 Game Mechanics

- **Pickups**: Collect money, ammo, and health packs
- **Enemy Behavior**: 
  - Patrol when player is far away
  - Chase and shoot when player is detected
  - Intelligent movement avoiding obstacles
- **Bullet Physics**: Fast-moving projectiles with lifetime
- **Damage System**: Different damage values for hits
- **Game Over**: Death screen with final score display

### 🎨 Visual Features

- Detailed map rendering with multiple object types
- Health bars for both player and enemies
- Smooth animations and rotations
- Particle effects (light halos from lamps)
- Textured buildings and obstacles
- Color-coded bullets (yellow for player, orange for enemies)

## How to Play

1. Open `index.html` in a modern web browser
2. Select your preferred map from the dropdown menu
3. Click "Начать игру" (Start Game)
4. Use **WASD** or **Arrow Keys** to move
5. Move your **mouse** to aim
6. Press **Space** or **Click** to shoot
7. Survive, defeat enemies, and collect pickups to increase your score!

## Controls

- **W / ↑**: Move up
- **S / ↓**: Move down
- **A / ←**: Move left
- **D / →**: Move right
- **Mouse**: Aim direction
- **Space / Click**: Shoot
- **Pause Button**: Pause/Resume game

## Installation

No installation required! Simply:

1. Clone this repository
2. Open `index.html` in your browser
3. Start playing!

Or use a local server:
```bash
python3 -m http.server 8080
# Then open http://localhost:8080 in your browser
```

## Technical Details

- **HTML5 Canvas** for rendering
- **Vanilla JavaScript** (no frameworks)
- **CSS3** for UI styling
- **Responsive design** adapts to window size
- **Optimized rendering** for smooth 60 FPS gameplay

## Game Statistics

- **2 Unique Maps**: City and Sandstone
- **6 Enemy Spawn Points** per map
- **3 Types of Pickups**: Money, Ammo, Health
- **100 HP** starting health
- **30 Rounds** starting ammo
- **Multiple Obstacle Types** per map (10+ different types)

## Browser Compatibility

Works best on modern browsers:
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Credits

Inspired by the classic GTA 1 top-down gameplay and Standoff 2's Sandstone map design.

## License

See LICENSE file for details.
