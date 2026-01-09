// GTA-1 Style Top-Down Shooter Game

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.state = 'menu';
        this.selectedMap = 'city';
        this.paused = false;
        
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.pickups = [];
        this.currentMap = null;
        
        this.camera = { x: 0, y: 0 };
        this.keys = {};
        this.mouse = { x: 0, y: 0, worldX: 0, worldY: 0 };
        
        this.score = 0;
        this.lastTime = 0;
        
        this.setupEventListeners();
        this.createMapSelector();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    createMapSelector() {
        const menu = document.getElementById('menu');
        const menuButtons = menu.querySelector('.menu-buttons');
        
        const mapSelector = document.createElement('div');
        mapSelector.id = 'map-selector';
        mapSelector.style.cssText = 'margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;';
        mapSelector.innerHTML = `
            <p style="margin-bottom: 10px; font-size: 18px; color: #ffd700;">Выберите карту:</p>
            <select id="map-select" style="padding: 10px; font-size: 16px; border-radius: 5px; background: #2d2d30; color: #fff; border: 2px solid #ffd700; cursor: pointer; width: 100%;">
                <option value="city">🏙️ Городская улица</option>
                <option value="sandstone">🏭 Sandstone (Industrial)</option>
            </select>
        `;
        
        menuButtons.parentNode.insertBefore(mapSelector, menuButtons);
        
        const select = document.getElementById('map-select');
        select.addEventListener('change', (e) => {
            this.selectedMap = e.target.value;
        });
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn').addEventListener('click', () => this.showScreen('instructions'));
        document.getElementById('about-btn').addEventListener('click', () => this.showScreen('about'));
        document.getElementById('back-btn').addEventListener('click', () => this.showScreen('menu'));
        document.getElementById('back-about-btn').addEventListener('click', () => this.showScreen('menu'));
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        document.getElementById('main-menu-btn').addEventListener('click', () => this.showScreen('menu'));
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space' && this.state === 'playing' && !this.paused) {
                e.preventDefault();
                this.player.shoot();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.worldX = this.mouse.x + this.camera.x;
            this.mouse.worldY = this.mouse.y + this.camera.y;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'playing' && !this.paused) {
                this.player.shoot();
            }
        });
    }
    
    showScreen(screen) {
        ['menu', 'instructions', 'about', 'game', 'game-over'].forEach(s => {
            document.getElementById(s).classList.add('hidden');
        });
        document.getElementById(screen).classList.remove('hidden');
    }
    
    startGame() {
        this.showScreen('game');
        this.state = 'playing';
        this.paused = false;
        this.score = 0;
        this.updateScore();
        
        this.currentMap = this.selectedMap === 'city' ? new CityMap() : new SandstoneMap();
        
        this.player = new Player(this.currentMap.playerSpawn.x, this.currentMap.playerSpawn.y, this);
        
        this.enemies = [];
        this.currentMap.enemySpawns.forEach(spawn => {
            this.enemies.push(new Enemy(spawn.x, spawn.y, this));
        });
        
        this.bullets = [];
        this.pickups = [];
        
        this.currentMap.pickupSpawns.forEach(spawn => {
            this.pickups.push(new Pickup(spawn.x, spawn.y, spawn.type));
        });
        
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pause-btn').textContent = this.paused ? 'Продолжить' : 'Пауза';
    }
    
    gameLoop(currentTime = 0) {
        if (this.state !== 'playing') return;
        
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        if (!this.paused) {
            this.update(deltaTime);
        }
        
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.player.update(deltaTime);
        
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.enemies = this.enemies.filter(enemy => enemy.health > 0);
        
        if (this.enemies.length === 0 && Math.random() < 0.01) {
            this.spawnEnemy();
        }
        
        this.bullets.forEach(bullet => bullet.update(deltaTime));
        this.bullets = this.bullets.filter(bullet => bullet.active);
        
        this.checkCollisions();
        
        this.updateCamera();
        
        if (this.player.health <= 0) {
            this.gameOver();
        }
    }
    
    spawnEnemy() {
        const spawn = this.currentMap.enemySpawns[Math.floor(Math.random() * this.currentMap.enemySpawns.length)];
        this.enemies.push(new Enemy(spawn.x, spawn.y, this));
    }
    
    checkCollisions() {
        this.bullets.forEach(bullet => {
            if (bullet.fromPlayer) {
                this.enemies.forEach(enemy => {
                    const dx = bullet.x - enemy.x;
                    const dy = bullet.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < enemy.radius + bullet.radius) {
                        bullet.active = false;
                        enemy.takeDamage(bullet.damage);
                        
                        if (enemy.health <= 0) {
                            this.addScore(100);
                            if (Math.random() < 0.3) {
                                this.pickups.push(new Pickup(enemy.x, enemy.y, 'ammo'));
                            }
                        }
                    }
                });
            } else {
                const dx = bullet.x - this.player.x;
                const dy = bullet.y - this.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.player.radius + bullet.radius) {
                    bullet.active = false;
                    this.player.takeDamage(bullet.damage);
                }
            }
        });
        
        this.pickups.forEach((pickup, index) => {
            const dx = pickup.x - this.player.x;
            const dy = pickup.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.radius + pickup.radius) {
                pickup.collect(this.player, this);
                this.pickups.splice(index, 1);
            }
        });
    }
    
    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 2;
        const targetY = this.player.y - this.canvas.height / 2;
        
        this.camera.x = Math.max(0, Math.min(targetX, this.currentMap.width - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(targetY, this.currentMap.height - this.canvas.height));
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        this.currentMap.render(this.ctx);
        
        this.pickups.forEach(pickup => pickup.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        this.player.render(this.ctx);
        
        this.ctx.restore();
    }
    
    addScore(points) {
        this.score += points;
        this.updateScore();
    }
    
    updateScore() {
        document.getElementById('score').textContent = `💰 Деньги: ${this.score}`;
    }
    
    gameOver() {
        this.state = 'gameOver';
        this.showScreen('game-over');
        document.getElementById('final-score').textContent = this.score;
    }
}

class CityMap {
    constructor() {
        this.width = 3000;
        this.height = 2000;
        this.playerSpawn = { x: 1500, y: 1000 };
        this.enemySpawns = [
            { x: 300, y: 300 },
            { x: 2700, y: 300 },
            { x: 300, y: 1700 },
            { x: 2700, y: 1700 },
            { x: 1500, y: 300 },
            { x: 1500, y: 1700 }
        ];
        this.pickupSpawns = [
            { x: 500, y: 500, type: 'money' },
            { x: 2500, y: 500, type: 'money' },
            { x: 1500, y: 1500, type: 'ammo' },
            { x: 800, y: 1200, type: 'health' }
        ];
        
        this.obstacles = this.createCityObstacles();
    }
    
    createCityObstacles() {
        const obstacles = [];
        
        obstacles.push({ x: 100, y: 100, width: 400, height: 300, type: 'building', color: '#4a4a4a' });
        obstacles.push({ x: 600, y: 100, width: 300, height: 400, type: 'building', color: '#5a5a5a' });
        obstacles.push({ x: 1000, y: 100, width: 250, height: 350, type: 'building', color: '#4a4a4a' });
        obstacles.push({ x: 1350, y: 100, width: 400, height: 300, type: 'building', color: '#555555' });
        obstacles.push({ x: 1850, y: 100, width: 300, height: 400, type: 'building', color: '#4a4a4a' });
        obstacles.push({ x: 2250, y: 100, width: 500, height: 350, type: 'building', color: '#5a5a5a' });
        
        obstacles.push({ x: 100, y: 600, width: 300, height: 400, type: 'building', color: '#555555' });
        obstacles.push({ x: 500, y: 700, width: 200, height: 250, type: 'building', color: '#4a4a4a' });
        obstacles.push({ x: 2250, y: 600, width: 400, height: 400, type: 'building', color: '#555555' });
        
        obstacles.push({ x: 100, y: 1200, width: 350, height: 300, type: 'building', color: '#4a4a4a' });
        obstacles.push({ x: 550, y: 1300, width: 300, height: 400, type: 'building', color: '#5a5a5a' });
        obstacles.push({ x: 950, y: 1200, width: 400, height: 350, type: 'building', color: '#555555' });
        obstacles.push({ x: 1450, y: 1300, width: 300, height: 400, type: 'building', color: '#4a4a4a' });
        obstacles.push({ x: 1850, y: 1200, width: 350, height: 300, type: 'building', color: '#5a5a5a' });
        obstacles.push({ x: 2300, y: 1300, width: 400, height: 400, type: 'building', color: '#555555' });
        
        obstacles.push({ x: 200, y: 550, width: 50, height: 50, type: 'car', color: '#ff4444' });
        obstacles.push({ x: 700, y: 550, width: 50, height: 50, type: 'car', color: '#4444ff' });
        obstacles.push({ x: 1200, y: 550, width: 50, height: 50, type: 'car', color: '#44ff44' });
        obstacles.push({ x: 1700, y: 550, width: 50, height: 50, type: 'car', color: '#ffff44' });
        obstacles.push({ x: 2200, y: 550, width: 50, height: 50, type: 'car', color: '#ff44ff' });
        
        obstacles.push({ x: 300, y: 1100, width: 40, height: 40, type: 'box', color: '#8B4513' });
        obstacles.push({ x: 350, y: 1100, width: 40, height: 40, type: 'box', color: '#8B4513' });
        obstacles.push({ x: 800, y: 1100, width: 40, height: 40, type: 'box', color: '#8B4513' });
        obstacles.push({ x: 1600, y: 1100, width: 40, height: 40, type: 'box', color: '#8B4513' });
        obstacles.push({ x: 1650, y: 1100, width: 40, height: 40, type: 'box', color: '#8B4513' });
        obstacles.push({ x: 2100, y: 1100, width: 40, height: 40, type: 'box', color: '#8B4513' });
        
        for (let i = 0; i < 15; i++) {
            obstacles.push({
                x: 150 + i * 180,
                y: 50,
                width: 15,
                height: 15,
                type: 'lamp',
                color: '#FFD700'
            });
        }
        
        return obstacles;
    }
    
    render(ctx) {
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(0, 650, this.width, 400);
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.setLineDash([30, 20]);
        ctx.beginPath();
        ctx.moveTo(0, 850);
        ctx.lineTo(this.width, 850);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 650);
        ctx.lineTo(this.width, 650);
        ctx.moveTo(0, 1050);
        ctx.lineTo(this.width, 1050);
        ctx.stroke();
        
        for (let i = 0; i < 10; i++) {
            ctx.fillStyle = '#222222';
            ctx.fillRect(Math.random() * this.width, 650 + Math.random() * 400, 30, 3);
        }
        
        this.obstacles.forEach(obs => {
            if (obs.type === 'building') {
                ctx.fillStyle = obs.color;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 3;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                
                const windowRows = Math.floor(obs.height / 40);
                const windowCols = Math.floor(obs.width / 40);
                ctx.fillStyle = Math.random() > 0.5 ? '#ffff88' : '#444444';
                for (let row = 0; row < windowRows; row++) {
                    for (let col = 0; col < windowCols; col++) {
                        if (Math.random() > 0.3) {
                            ctx.fillRect(
                                obs.x + 10 + col * 40,
                                obs.y + 10 + row * 40,
                                20, 25
                            );
                        }
                    }
                }
            } else if (obs.type === 'car') {
                ctx.fillStyle = obs.color;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 2;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.fillStyle = '#88ccff';
                ctx.fillRect(obs.x + 5, obs.y + 5, obs.width - 10, obs.height * 0.3);
            } else if (obs.type === 'box') {
                ctx.fillStyle = obs.color;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 2;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'lamp') {
                ctx.fillStyle = '#666666';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height * 3);
                
                ctx.fillStyle = obs.color;
                ctx.beginPath();
                ctx.arc(obs.x + obs.width / 2, obs.y, 8, 0, Math.PI * 2);
                ctx.fill();
                
                const gradient = ctx.createRadialGradient(
                    obs.x + obs.width / 2, obs.y, 5,
                    obs.x + obs.width / 2, obs.y, 50
                );
                gradient.addColorStop(0, 'rgba(255, 255, 200, 0.2)');
                gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(obs.x + obs.width / 2, obs.y, 50, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        for (let i = 0; i < 20; i++) {
            const x = 100 + Math.random() * (this.width - 200);
            const y = Math.random() < 0.5 ? Math.random() * 600 : 1100 + Math.random() * 900;
            
            ctx.fillStyle = '#2d5016';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#4a3728';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 15);
            ctx.stroke();
        }
    }
    
    checkCollision(x, y, radius) {
        if (x - radius < 0 || x + radius > this.width || 
            y - radius < 0 || y + radius > this.height) {
            return true;
        }
        
        for (const obs of this.obstacles) {
            if (obs.type === 'lamp') continue;
            
            const closestX = Math.max(obs.x, Math.min(x, obs.x + obs.width));
            const closestY = Math.max(obs.y, Math.min(y, obs.y + obs.height));
            
            const distanceX = x - closestX;
            const distanceY = y - closestY;
            
            if (distanceX * distanceX + distanceY * distanceY < radius * radius) {
                return true;
            }
        }
        
        return false;
    }
}

class SandstoneMap {
    constructor() {
        this.width = 2800;
        this.height = 2000;
        this.playerSpawn = { x: 1400, y: 1000 };
        this.enemySpawns = [
            { x: 400, y: 400 },
            { x: 2400, y: 400 },
            { x: 400, y: 1600 },
            { x: 2400, y: 1600 },
            { x: 1400, y: 400 },
            { x: 1400, y: 1600 }
        ];
        this.pickupSpawns = [
            { x: 600, y: 600, type: 'money' },
            { x: 2200, y: 600, type: 'ammo' },
            { x: 1400, y: 1400, type: 'health' },
            { x: 900, y: 1200, type: 'money' }
        ];
        
        this.obstacles = this.createSandstoneObstacles();
    }
    
    createSandstoneObstacles() {
        const obstacles = [];
        
        obstacles.push({ x: 200, y: 200, width: 400, height: 300, type: 'concrete', color: '#6b6b6b' });
        obstacles.push({ x: 700, y: 150, width: 350, height: 350, type: 'concrete', color: '#5f5f5f' });
        obstacles.push({ x: 1150, y: 200, width: 300, height: 300, type: 'concrete', color: '#6b6b6b' });
        obstacles.push({ x: 1550, y: 150, width: 400, height: 350, type: 'metal', color: '#4a4a4a' });
        obstacles.push({ x: 2050, y: 200, width: 500, height: 400, type: 'metal', color: '#555555' });
        
        obstacles.push({ x: 200, y: 700, width: 300, height: 350, type: 'container', color: '#8B4513' });
        obstacles.push({ x: 600, y: 750, width: 250, height: 300, type: 'container', color: '#A0522D' });
        obstacles.push({ x: 2200, y: 700, width: 400, height: 400, type: 'metal', color: '#4a4a4a' });
        
        obstacles.push({ x: 200, y: 1250, width: 400, height: 400, type: 'concrete', color: '#6b6b6b' });
        obstacles.push({ x: 700, y: 1300, width: 300, height: 350, type: 'metal', color: '#555555' });
        obstacles.push({ x: 1100, y: 1250, width: 350, height: 400, type: 'concrete', color: '#5f5f5f' });
        obstacles.push({ x: 1550, y: 1300, width: 400, height: 350, type: 'container', color: '#8B4513' });
        obstacles.push({ x: 2050, y: 1250, width: 500, height: 400, type: 'metal', color: '#4a4a4a' });
        
        obstacles.push({ x: 150, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        obstacles.push({ x: 200, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        obstacles.push({ x: 250, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        obstacles.push({ x: 900, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        obstacles.push({ x: 950, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        obstacles.push({ x: 1700, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        obstacles.push({ x: 1750, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        obstacles.push({ x: 2600, y: 650, width: 30, height: 30, type: 'barrel', color: '#8B0000' });
        
        obstacles.push({ x: 300, y: 1150, width: 50, height: 50, type: 'crate', color: '#654321' });
        obstacles.push({ x: 360, y: 1150, width: 50, height: 50, type: 'crate', color: '#654321' });
        obstacles.push({ x: 800, y: 1150, width: 50, height: 50, type: 'crate', color: '#654321' });
        obstacles.push({ x: 860, y: 1150, width: 50, height: 50, type: 'crate', color: '#654321' });
        obstacles.push({ x: 1500, y: 1150, width: 50, height: 50, type: 'crate', color: '#654321' });
        obstacles.push({ x: 1560, y: 1150, width: 50, height: 50, type: 'crate', color: '#654321' });
        
        for (let i = 0; i < 8; i++) {
            obstacles.push({
                x: 100 + i * 350,
                y: 100,
                width: 20,
                height: 80,
                type: 'pipe',
                color: '#7a7a7a'
            });
        }
        
        for (let i = 0; i < 8; i++) {
            obstacles.push({
                x: 100 + i * 350,
                y: 1920,
                width: 20,
                height: 80,
                type: 'pipe',
                color: '#7a7a7a'
            });
        }
        
        return obstacles;
    }
    
    render(ctx) {
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.fillStyle = '#7a6347';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = Math.random() * 3 + 1;
            ctx.fillRect(x, y, size, size);
        }
        
        ctx.strokeStyle = '#6b5a45';
        ctx.lineWidth = 2;
        for (let i = 0; i < 30; i++) {
            const x1 = Math.random() * this.width;
            const y1 = Math.random() * this.height;
            const length = Math.random() * 50 + 20;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + length, y1);
            ctx.stroke();
        }
        
        this.obstacles.forEach(obs => {
            if (obs.type === 'concrete') {
                ctx.fillStyle = obs.color;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 4;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 2;
                for (let i = 0; i < obs.height; i += 30) {
                    ctx.beginPath();
                    ctx.moveTo(obs.x, obs.y + i);
                    ctx.lineTo(obs.x + obs.width, obs.y + i);
                    ctx.stroke();
                }
            } else if (obs.type === 'metal') {
                const gradient = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y);
                gradient.addColorStop(0, obs.color);
                gradient.addColorStop(0.5, '#666666');
                gradient.addColorStop(1, obs.color);
                ctx.fillStyle = gradient;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 3;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.fillStyle = '#333333';
                for (let i = 0; i < 4; i++) {
                    ctx.beginPath();
                    ctx.arc(obs.x + 20, obs.y + 20 + i * (obs.height / 4), 5, 0, Math.PI * 2);
                    ctx.arc(obs.x + obs.width - 20, obs.y + 20 + i * (obs.height / 4), 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (obs.type === 'container') {
                ctx.fillStyle = obs.color;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 3;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#5a3a1a';
                ctx.lineWidth = 2;
                for (let i = 0; i < obs.height; i += 40) {
                    ctx.beginPath();
                    ctx.moveTo(obs.x, obs.y + i);
                    ctx.lineTo(obs.x + obs.width, obs.y + i);
                    ctx.stroke();
                }
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 30px Arial';
                ctx.fillText('CARGO', obs.x + obs.width / 2 - 50, obs.y + obs.height / 2);
            } else if (obs.type === 'barrel') {
                const gradient = ctx.createRadialGradient(
                    obs.x + obs.width / 2, obs.y + obs.height / 2, 5,
                    obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2
                );
                gradient.addColorStop(0, '#ff4444');
                gradient.addColorStop(1, obs.color);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (obs.type === 'crate') {
                ctx.fillStyle = obs.color;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#4a3118';
                ctx.lineWidth = 3;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.beginPath();
                ctx.moveTo(obs.x, obs.y);
                ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                ctx.moveTo(obs.x + obs.width, obs.y);
                ctx.lineTo(obs.x, obs.y + obs.height);
                ctx.stroke();
            } else if (obs.type === 'pipe') {
                const gradient = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
                gradient.addColorStop(0, '#555555');
                gradient.addColorStop(0.5, obs.color);
                gradient.addColorStop(1, '#555555');
                ctx.fillStyle = gradient;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                
                ctx.strokeStyle = '#444444';
                ctx.lineWidth = 2;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                
                for (let i = 0; i < obs.height; i += 10) {
                    ctx.fillStyle = '#666666';
                    ctx.fillRect(obs.x, obs.y + i, obs.width, 2);
                }
            }
        });
    }
    
    checkCollision(x, y, radius) {
        if (x - radius < 0 || x + radius > this.width || 
            y - radius < 0 || y + radius > this.height) {
            return true;
        }
        
        for (const obs of this.obstacles) {
            if (obs.type === 'pipe') continue;
            
            const closestX = Math.max(obs.x, Math.min(x, obs.x + obs.width));
            const closestY = Math.max(obs.y, Math.min(y, obs.y + obs.height));
            
            const distanceX = x - closestX;
            const distanceY = y - closestY;
            
            if (distanceX * distanceX + distanceY * distanceY < radius * radius) {
                return true;
            }
        }
        
        return false;
    }
}

class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.radius = 15;
        this.speed = 200;
        this.angle = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.ammo = 30;
        this.maxAmmo = 100;
        this.shootCooldown = 0;
        this.shootDelay = 0.2;
    }
    
    update(deltaTime) {
        this.shootCooldown = Math.max(0, this.shootCooldown - deltaTime);
        
        let dx = 0;
        let dy = 0;
        
        if (this.game.keys['KeyW'] || this.game.keys['ArrowUp']) dy -= 1;
        if (this.game.keys['KeyS'] || this.game.keys['ArrowDown']) dy += 1;
        if (this.game.keys['KeyA'] || this.game.keys['ArrowLeft']) dx -= 1;
        if (this.game.keys['KeyD'] || this.game.keys['ArrowRight']) dx += 1;
        
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
            
            const newX = this.x + dx * this.speed * deltaTime;
            const newY = this.y + dy * this.speed * deltaTime;
            
            if (!this.game.currentMap.checkCollision(newX, this.y, this.radius)) {
                this.x = newX;
            }
            if (!this.game.currentMap.checkCollision(this.x, newY, this.radius)) {
                this.y = newY;
            }
        }
        
        const worldMouseX = this.game.mouse.worldX;
        const worldMouseY = this.game.mouse.worldY;
        this.angle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);
    }
    
    shoot() {
        if (this.shootCooldown <= 0 && this.ammo > 0) {
            this.ammo--;
            this.shootCooldown = this.shootDelay;
            
            const bulletX = this.x + Math.cos(this.angle) * (this.radius + 5);
            const bulletY = this.y + Math.sin(this.angle) * (this.radius + 5);
            
            this.game.bullets.push(new Bullet(bulletX, bulletY, this.angle, true, this.game));
            
            this.updateAmmoDisplay();
        }
    }
    
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        this.updateHealthDisplay();
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateHealthDisplay();
    }
    
    addAmmo(amount) {
        this.ammo = Math.min(this.maxAmmo, this.ammo + amount);
        this.updateAmmoDisplay();
    }
    
    updateHealthDisplay() {
        const healthPercent = (this.health / this.maxHealth) * 100;
        document.getElementById('health-fill').style.width = healthPercent + '%';
    }
    
    updateAmmoDisplay() {
        document.getElementById('ammo').textContent = `🔫 Патроны: ${this.ammo}`;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = '#4444ff';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#0000aa';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.radius - 5, -3, 15, 6);
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.arc(5, 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - 20, this.y - this.radius - 10, 40, 4);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 20, this.y - this.radius - 10, 40 * (this.health / this.maxHealth), 4);
    }
}

class Enemy {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.radius = 15;
        this.speed = 100;
        this.angle = 0;
        this.health = 50;
        this.maxHealth = 50;
        this.shootCooldown = 0;
        this.shootDelay = 2;
        this.detectionRange = 400;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderTimer = 0;
        this.wanderDelay = 2;
    }
    
    update(deltaTime) {
        this.shootCooldown = Math.max(0, this.shootCooldown - deltaTime);
        this.wanderTimer += deltaTime;
        
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceToPlayer < this.detectionRange) {
            this.angle = Math.atan2(dy, dx);
            
            if (distanceToPlayer > 200) {
                const moveX = this.x + Math.cos(this.angle) * this.speed * deltaTime;
                const moveY = this.y + Math.sin(this.angle) * this.speed * deltaTime;
                
                if (!this.game.currentMap.checkCollision(moveX, this.y, this.radius)) {
                    this.x = moveX;
                }
                if (!this.game.currentMap.checkCollision(this.x, moveY, this.radius)) {
                    this.y = moveY;
                }
            }
            
            if (this.shootCooldown <= 0) {
                this.shoot();
            }
        } else {
            if (this.wanderTimer >= this.wanderDelay) {
                this.wanderAngle = Math.random() * Math.PI * 2;
                this.wanderTimer = 0;
            }
            
            const moveX = this.x + Math.cos(this.wanderAngle) * this.speed * 0.5 * deltaTime;
            const moveY = this.y + Math.sin(this.wanderAngle) * this.speed * 0.5 * deltaTime;
            
            if (!this.game.currentMap.checkCollision(moveX, this.y, this.radius)) {
                this.x = moveX;
            } else {
                this.wanderAngle = Math.random() * Math.PI * 2;
            }
            
            if (!this.game.currentMap.checkCollision(this.x, moveY, this.radius)) {
                this.y = moveY;
            } else {
                this.wanderAngle = Math.random() * Math.PI * 2;
            }
        }
    }
    
    shoot() {
        this.shootCooldown = this.shootDelay;
        
        const bulletX = this.x + Math.cos(this.angle) * (this.radius + 5);
        const bulletY = this.y + Math.sin(this.angle) * (this.radius + 5);
        
        this.game.bullets.push(new Bullet(bulletX, bulletY, this.angle, false, this.game));
    }
    
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#aa0000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.radius - 5, -3, 15, 6);
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.arc(5, 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - 20, this.y - this.radius - 10, 40, 4);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 20, this.y - this.radius - 10, 40 * (this.health / this.maxHealth), 4);
    }
}

class Bullet {
    constructor(x, y, angle, fromPlayer, game) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.fromPlayer = fromPlayer;
        this.game = game;
        this.speed = 600;
        this.radius = 4;
        this.damage = 25;
        this.active = true;
        this.lifetime = 2;
        this.age = 0;
    }
    
    update(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * deltaTime;
        this.y += Math.sin(this.angle) * this.speed * deltaTime;
        
        this.age += deltaTime;
        
        if (this.age >= this.lifetime) {
            this.active = false;
        }
        
        if (this.game.currentMap.checkCollision(this.x, this.y, this.radius)) {
            this.active = false;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = this.fromPlayer ? '#ffff00' : '#ff8800';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = this.fromPlayer ? '#ffaa00' : '#ff0000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Pickup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 15;
        this.rotation = 0;
    }
    
    collect(player, game) {
        if (this.type === 'money') {
            game.addScore(50);
        } else if (this.type === 'ammo') {
            player.addAmmo(15);
        } else if (this.type === 'health') {
            player.heal(30);
        }
    }
    
    render(ctx) {
        this.rotation += 0.05;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'money') {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
        } else if (this.type === 'ammo') {
            ctx.fillStyle = '#888888';
            ctx.fillRect(-this.radius, -this.radius / 2, this.radius * 2, this.radius);
            
            ctx.strokeStyle = '#444444';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.radius, -this.radius / 2, this.radius * 2, this.radius);
            
            ctx.fillStyle = '#ffff00';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(-this.radius + 5 + i * 8, -this.radius / 3, 5, this.radius / 1.5);
            }
        } else if (this.type === 'health') {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(-this.radius / 3, -this.radius, this.radius / 1.5, this.radius * 2);
            ctx.fillRect(-this.radius, -this.radius / 3, this.radius * 2, this.radius / 1.5);
            
            ctx.strokeStyle = '#aa0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.radius / 3, -this.radius, this.radius / 1.5, this.radius * 2);
            ctx.strokeRect(-this.radius, -this.radius / 3, this.radius * 2, this.radius / 1.5);
        }
        
        ctx.restore();
    }
}

const game = new Game();
