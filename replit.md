# GTA-1-Real-HTML

## Overview

A GTA 1-style top-down shooter game built with vanilla HTML5, CSS3, and JavaScript. The game features two detailed maps (City Street and Industrial/Sandstone), enemy AI with patrol and combat behaviors, player controls with WASD movement and mouse aiming, and classic arcade-style gameplay mechanics including health, ammo, and score systems.

The project is designed to be deployed as a static site on GitHub Pages with automatic deployment via GitHub Actions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Pure vanilla JavaScript** - No frameworks or build tools required
- **Canvas-based rendering** - HTML5 Canvas API for all game graphics
- **Class-based design** - Object-oriented architecture with distinct classes:
  - `Game` - Main controller managing state, input, camera, and game loop
  - `CityMap` / `SandstoneMap` - Map rendering with buildings, obstacles, and environmental details
  - `Player` - Player character with health, ammo, and movement
  - Enemy, Bullet, and Pickup systems for gameplay entities

### Game State Management
- Simple state machine with states: `menu`, `playing`, `paused`, `gameOver`
- Delta-time based game loop for consistent gameplay across different frame rates
- Camera system that follows the player with smooth scrolling

### Input Handling
- Keyboard input (WASD/Arrow keys) for movement
- Mouse position tracking for aiming
- Space bar for shooting

### Static File Structure
The game runs entirely client-side with three core files:
- `index.html` - Entry point and UI structure
- `style.css` - Styling for menus, HUD, and overlays
- `game.js` - All game logic, rendering, and entity management

### Flask Server (Development Only)
A minimal Flask server (`main.py`) exists to serve a Lua script file. This appears to be unrelated to the main game and may be for a separate Roblox-related purpose. The game itself does not require any backend.

## External Dependencies

### Deployment
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - Automated deployment workflow on push to main branch

### Runtime Dependencies
- None - The game uses only browser-native APIs (Canvas, DOM, Event handling)
- No external libraries, CDNs, or package managers required

### Development Server (Optional)
- **Flask** - Python web framework used only for serving a separate Lua script file
- Not required for the main game functionality