// GTA 3D Game - Main Game Logic

class GTA3DGame {
    constructor() {
        this.init();
    }

    async init() {
        this.setupDOM();
        this.showLoading();
        
        await this.initThreeJS();
        await this.initPhysics();
        await this.initGameObjects();
        this.setupEventListeners();
        
        this.hideLoading();
        this.showMenu();
        
        this.gameLoop();
    }

    setupDOM() {
        this.menu = document.getElementById('menu');
        this.instructions = document.getElementById('instructions');
        this.hud = document.getElementById('hud');
        this.loading = document.getElementById('loading');
        this.mobileControls = document.getElementById('mobile-controls');
        
        // Event listeners for UI
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn').addEventListener('click', () => this.showInstructions());
        document.getElementById('back-btn').addEventListener('click', () => this.showMenu());
        
        // Mobile controls
        if (this.isMobile()) {
            this.mobileControls.classList.remove('hidden');
            this.setupMobileControls();
        }
    }

    showLoading() {
        this.loading.classList.remove('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showMenu() {
        this.menu.classList.remove('hidden');
        this.instructions.classList.add('hidden');
        this.hud.classList.add('hidden');
    }

    showInstructions() {
        this.menu.classList.add('hidden');
        this.instructions.classList.remove('hidden');
    }

    startGame() {
        this.menu.classList.add('hidden');
        this.hud.classList.remove('hidden');
        
        this.isPlaying = true;
        this.resetGame();
    }

    isMobile() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    async initThreeJS() {
        // Сцена
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 2000);

        // Камера
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.camera.position.set(0, 10, 20);

        // Рендерер
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // Освещение
        this.setupLighting();
        
        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Солнце
        this.sun = new THREE.DirectionalLight(0xffffff, 1);
        this.sun.position.set(100, 100, 50);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 2048;
        this.sun.shadow.mapSize.height = 2048;
        this.sun.shadow.camera.near = 0.5;
        this.sun.shadow.camera.far = 500;
        this.sun.shadow.camera.left = -200;
        this.sun.shadow.camera.right = 200;
        this.sun.shadow.camera.top = 200;
        this.sun.shadow.camera.bottom = -200;
        this.scene.add(this.sun);

        // Окружающий свет
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(this.ambientLight);

        // Дополнительное освещение для улиц
        this.streetLights = [];
        for (let i = 0; i < 20; i++) {
            const light = new THREE.PointLight(0xffff88, 0.5, 50);
            light.position.set(
                (Math.random() - 0.5) * 800,
                10,
                (Math.random() - 0.5) * 800
            );
            light.castShadow = true;
            this.scene.add(light);
            this.streetLights.push(light);
        }
    }

    async initPhysics() {
        // Настройка физического мира
        this.world = new CANNON.World();
        this.world.gravity.set(0, -30, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        // Материалы для физики
        this.groundMaterial = new CANNON.Material('ground');
        this.vehicleMaterial = new CANNON.Material('vehicle');
        this.playerMaterial = new CANNON.Material('player');

        // Контакты между материалами
        const groundVehicleContact = new CANNON.ContactMaterial(this.groundMaterial, this.vehicleMaterial, {
            friction: 0.4,
            restitution: 0.3,
        });
        const groundPlayerContact = new CANNON.ContactMaterial(this.groundMaterial, this.playerMaterial, {
            friction: 0.6,
            restitution: 0.1,
        });
        
        this.world.addContactMaterial(groundVehicleContact);
        this.world.addContactMaterial(groundPlayerContact);
    }

    async initGameObjects() {
        // Создание города
        this.city = new City(this.scene, this.world);
        await this.city.generate();

        // Создание персонажа
        this.player = new Player(this.scene, this.world);
        this.player.position.set(0, 5, 0);

        // Создание машин
        this.vehicles = [];
        
        // Седан (быстрая)
        const sedan = new Vehicle(this.scene, this.world, 'sedan');
        sedan.position.set(50, 5, 50);
        this.vehicles.push(sedan);
        
        // Внедорожник (медленнее, крепче)
        const suv = new Vehicle(this.scene, this.world, 'suv');
        suv.position.set(-50, 5, 50);
        this.vehicles.push(suv);

        // Настройка камеры
        this.cameraController = new CameraController(this.camera, this.player);
        
        // Игровые переменные
        this.playerHealth = 100;
        this.currentVehicle = null;
        this.isInVehicle = false;
        this.actionLog = 'Готов к действию';
        
        // Начальные позиции
        this.spawnPoint = { x: 0, y: 5, z: 0 };
    }

    setupEventListeners() {
        // Клавиатура
        this.keys = {};
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'KeyF' && this.canEnterVehicle()) {
                this.enterOrExitVehicle();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Мышь (для ПК)
        document.addEventListener('mousemove', (e) => {
            if (!this.isMobile()) {
                this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            }
        });

        // Сенсорные события
        if (this.isMobile()) {
            this.setupTouchControls();
        }

        // Контекстное меню
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setupMobileControls() {
        const joystickBase = document.getElementById('joystick-base');
        const joystickKnob = document.getElementById('joystick-knob');
        
        let isDragging = false;
        let joystickCenter = { x: 0, y: 0 };

        const updateJoystickCenter = () => {
            const rect = joystickBase.getBoundingClientRect();
            joystickCenter.x = rect.left + rect.width / 2;
            joystickCenter.y = rect.top + rect.height / 2;
        };

        const handleStart = (e) => {
            e.preventDefault();
            isDragging = true;
            updateJoystickCenter();
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const touch = e.touches[0] || e.changedTouches[0];
            const deltaX = touch.clientX - joystickCenter.x;
            const deltaY = touch.clientY - joystickCenter.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 35;
            
            if (distance <= maxDistance) {
                joystickKnob.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                this.mobileInput = {
                    x: deltaX / maxDistance,
                    y: deltaY / maxDistance
                };
            } else {
                const angle = Math.atan2(deltaY, deltaX);
                const clampedX = Math.cos(angle) * maxDistance;
                const clampedY = Math.sin(angle) * maxDistance;
                joystickKnob.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
                this.mobileInput = {
                    x: clampedX / maxDistance,
                    y: clampedY / maxDistance
                };
            }
        };

        const handleEnd = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            isDragging = false;
            joystickKnob.style.transform = 'translate(-50%, -50%)';
            this.mobileInput = { x: 0, y: 0 };
        };

        // Добавление событий
        joystickBase.addEventListener('touchstart', handleStart, { passive: false });
        joystickBase.addEventListener('touchmove', handleMove, { passive: false });
        joystickBase.addEventListener('touchend', handleEnd, { passive: false });
        joystickBase.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);

        // Кнопки действий
        document.getElementById('punch-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.player.punch();
            this.updateActionLog('Бьет кулаками');
        });

        document.getElementById('enter-vehicle-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.canEnterVehicle()) {
                this.enterOrExitVehicle();
            }
        });

        document.getElementById('brake-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.currentVehicle) {
                this.currentVehicle.brake();
                this.updateActionLog('Тормозит');
            }
        });
    }

    canEnterVehicle() {
        if (this.isInVehicle) return false;
        
        // Проверяем близость к машинам
        for (let vehicle of this.vehicles) {
            const distance = this.player.position.distanceTo(vehicle.position);
            if (distance < 5) return true;
        }
        return false;
    }

    enterOrExitVehicle() {
        if (this.isInVehicle) {
            // Выход из машины
            const exitOffset = new THREE.Vector3(0, 0, -5);
            exitOffset.applyQuaternion(this.currentVehicle.mesh.quaternion);
            const exitPos = this.currentVehicle.position.clone().add(exitOffset);
            
            this.player.mesh.position.copy(exitPos);
            this.player.isInVehicle = false;
            this.currentVehicle.driver = null;
            this.isInVehicle = false;
            this.currentVehicle = null;
            
            this.updateActionLog('Вышел из машины');
            document.getElementById('vehicle-section').classList.add('hidden');
            document.getElementById('vehicle-info').classList.add('hidden');
        } else {
            // Поиск ближайшей машины
            let nearestVehicle = null;
            let minDistance = Infinity;
            
            for (let vehicle of this.vehicles) {
                if (!vehicle.driver) {
                    const distance = this.player.position.distanceTo(vehicle.position);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestVehicle = vehicle;
                    }
                }
            }
            
            if (nearestVehicle && minDistance < 5) {
                this.currentVehicle = nearestVehicle;
                this.currentVehicle.driver = this.player;
                this.isInVehicle = true;
                this.player.isInVehicle = true;
                
                this.updateActionLog(`Се${nearestVehicle.type === 'suv' ? 'л в внедорожник' : 'л в седан'}`);
                this.showVehicleInfo(nearestVehicle);
            }
        }
    }

    showVehicleInfo(vehicle) {
        const vehicleSection = document.getElementById('vehicle-section');
        const vehicleInfo = document.getElementById('vehicle-info');
        
        vehicleSection.classList.remove('hidden');
        vehicleInfo.classList.remove('hidden');
        
        if (vehicle.type === 'suv') {
            vehicleInfo.textContent = 'Внедорожник (медленнее, но прочнее)';
        } else {
            vehicleInfo.textContent = 'Седан (быстрее, но слабее)';
        }
    }

    resetGame() {
        this.playerHealth = 100;
        this.player.reset();
        
        // Сброс позиций машин
        this.vehicles[0].position.set(50, 5, 50);
        this.vehicles[0].reset();
        this.vehicles[1].position.set(-50, 5, 50);
        this.vehicles[1].reset();
        
        this.updateHealthBar();
    }

    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isPlaying) {
            this.update(deltaTime);
            this.updateFPS();
        }
        
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        // Обновление физики
        this.world.step(deltaTime);

        // Обновление персонажа
        if (!this.player.isInVehicle) {
            this.updatePlayerMovement(deltaTime);
        }

        // Обновление машин
        for (let vehicle of this.vehicles) {
            vehicle.update(deltaTime);
        }

        // Обновление камеры
        this.cameraController.update(deltaTime);

        // Проверка коллизий
        this.checkCollisions();

        // Обновление HUD
        this.updateHUD();

        // Обновление света фонарей
        this.updateStreetLights();
    }

    updatePlayerMovement(deltaTime) {
        const speed = this.isMobile() ? 15 : 20;
        let moveX = 0;
        let moveZ = 0;

        // ПК управление
        if (!this.isMobile()) {
            if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
            if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
            if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
        }

        // Мобильное управление
        if (this.isMobile() && this.mobileInput) {
            moveX = this.mobileInput.x;
            moveZ = this.mobileInput.y;
        }

        // Нормализация движения
        if (moveX !== 0 || moveZ !== 0) {
            const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX /= length;
            moveZ /= length;
        }

        // Применение движения
        if (moveX !== 0 || moveZ !== 0) {
            const moveVector = new THREE.Vector3(moveX, 0, moveZ);
            moveVector.multiplyScalar(speed * deltaTime);
            
            // Поворот в сторону движения
            const targetRotation = Math.atan2(moveX, -moveZ);
            this.player.mesh.rotation.y = targetRotation;
            
            // Применение к физическому телу
            this.player.body.velocity.x = moveVector.x * 50;
            this.player.body.velocity.z = moveVector.z * 50;
            
            this.updateActionLog('Идет');
        } else {
            this.player.body.velocity.x *= 0.8;
            this.player.body.velocity.z *= 0.8;
            
            if (this.player.body.velocity.length() < 1) {
                this.updateActionLog('Готов к действию');
            }
        }

        // Атака
        if ((this.keys['Space'] && !this.isMobile()) || this.player.isPunching) {
            this.player.punch();
            this.updateActionLog('Бьет кулаками');
        }
    }

    updateVehicleMovement(deltaTime) {
        if (!this.currentVehicle || !this.isInVehicle) return;

        const vehicle = this.currentVehicle;
        let moveX = 0;
        let moveZ = 0;
        let turning = 0;

        // ПК управление
        if (!this.isMobile()) {
            if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
            if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) turning -= 1;
            if (this.keys['KeyD'] || this.keys['ArrowRight']) turning += 1;
        }

        // Мобильное управление
        if (this.isMobile() && this.mobileInput) {
            moveZ = this.mobileInput.y;
            turning = this.mobileInput.x;
        }

        // Тормоз
        if (this.keys['ShiftLeft'] || this.keys['ShiftRight']) {
            vehicle.brake();
        }

        vehicle.control(moveX, moveZ, turning, deltaTime);
        this.updateActionLog('Едет на машине');
    }

    checkCollisions() {
        // Проверка коллизий между игроком и машинами
        for (let vehicle of this.vehicles) {
            const distance = this.player.position.distanceTo(vehicle.position);
            if (distance < 3) {
                // Нанесение урона от столкновения
                const damage = Math.min(vehicle.speed * 0.1, 10);
                if (damage > 1) {
                    this.playerHealth -= damage;
                    vehicle.health -= damage * 0.5;
                    this.updateActionLog(`Столкновение! -${Math.round(damage)} HP`);
                    this.updateHealthBars();
                }
            }
        }

        // Проверка здоровья игрока
        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    updateHUD() {
        this.updateHealthBars();
    }

    updateHealthBars() {
        const healthFill = document.getElementById('health-fill');
        const vehicleHealthFill = document.getElementById('vehicle-health-fill');
        const fuelFill = document.getElementById('fuel-fill');

        healthFill.style.width = `${Math.max(0, this.playerHealth)}%`;

        if (this.currentVehicle) {
            vehicleHealthFill.style.width = `${Math.max(0, this.currentVehicle.health)}%`;
            fuelFill.style.width = `${Math.max(0, this.currentVehicle.fuel)}%`;
        }
    }

    updateActionLog(text) {
        document.getElementById('action-log').textContent = text;
    }

    updateStreetLights() {
        // Добавляем мерцание уличным фонарям
        this.streetLights.forEach((light, index) => {
            const time = Date.now() * 0.001 + index;
            light.intensity = 0.4 + Math.sin(time) * 0.1;
        });
    }

    updateFPS() {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFPSUpdate > 1000) {
            const fps = Math.round((this.frameCount * 1000) / (now - this.lastFPSUpdate));
            document.getElementById('fps-counter').textContent = `FPS: ${fps}`;
            this.frameCount = 0;
            this.lastFPSUpdate = now;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    gameOver() {
        this.isPlaying = false;
        this.updateActionLog('Игра окончена');
        // Показать экран Game Over
        alert(`Игра окончена!\nВаше здоровье: ${Math.max(0, this.playerHealth)}`);
        this.showMenu();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

// Класс города
class City {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.buildings = [];
        this.objects = [];
    }

    async generate() {
        this.generateGround();
        this.generateBuildings();
        this.generateStreetObjects();
    }

    generateGround() {
        // Физическая земля
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0, material: this.world.groundMaterial });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.add(groundBody);

        // Визуальная земля
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d5a27,
            wireframe: false
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Дороги
        this.generateRoads();
    }

    generateRoads() {
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        // Горизонтальные дороги
        for (let z = -200; z <= 200; z += 100) {
            const roadGeometry = new THREE.PlaneGeometry(800, 20);
            const road = new THREE.Mesh(roadGeometry, roadMaterial);
            road.rotation.x = -Math.PI / 2;
            road.position.y = 0.1;
            road.position.z = z;
            road.receiveShadow = true;
            this.scene.add(road);
        }

        // Вертикальные дороги
        for (let x = -200; x <= 200; x += 100) {
            const roadGeometry = new THREE.PlaneGeometry(20, 800);
            const road = new THREE.Mesh(roadGeometry, roadMaterial);
            road.rotation.x = -Math.PI / 2;
            road.position.y = 0.1;
            road.position.x = x;
            road.receiveShadow = true;
            this.scene.add(road);
        }
    }

    generateBuildings() {
        const buildingTypes = [
            { width: 20, height: 30, depth: 20, color: 0x888888 },
            { width: 15, height: 25, depth: 15, color: 0x666666 },
            { width: 25, height: 40, depth: 25, color: 0x999999 },
            { width: 18, height: 35, depth: 18, color: 0x777777 }
        ];

        for (let x = -400; x <= 400; x += 80) {
            for (let z = -400; z <= 400; z += 80) {
                // Пропускаем центральную область
                if (Math.abs(x) < 60 && Math.abs(z) < 60) continue;
                
                // Пропускаем дороги
                if (Math.abs(x % 100) < 20 || Math.abs(z % 100) < 20) continue;

                const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
                
                const building = this.createBuilding(
                    x + (Math.random() - 0.5) * 40,
                    buildingType.height / 2,
                    z + (Math.random() - 0.5) * 40,
                    buildingType
                );
                
                this.buildings.push(building);
            }
        }
    }

    createBuilding(x, y, z, type) {
        // Физическое тело здания
        const buildingShape = new CANNON.Box(new CANNON.Vec3(type.width/2, type.height/2, type.depth/2));
        const buildingBody = new CANNON.Body({ mass: 0 });
        buildingBody.addShape(buildingShape);
        buildingBody.position.set(x, y, z);
        this.world.add(buildingBody);

        // Визуальная модель здания
        const buildingGeometry = new THREE.BoxGeometry(type.width, type.height, type.depth);
        const buildingMaterial = new THREE.MeshLambertMaterial({ color: type.color });
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.set(x, y, z);
        buildingMesh.castShadow = true;
        buildingMesh.receiveShadow = true;
        this.scene.add(buildingMesh);

        return { body: buildingBody, mesh: buildingMesh };
    }

    generateStreetObjects() {
        // Деревья
        for (let i = 0; i < 50; i++) {
            this.createTree(
                (Math.random() - 0.5) * 800,
                0,
                (Math.random() - 0.5) * 800
            );
        }

        // Уличные фонари
        for (let x = -200; x <= 200; x += 40) {
            for (let z = -200; z <= 200; z += 40) {
                if (Math.random() > 0.7) {
                    this.createStreetLight(x, 0, z);
                }
            }
        }
    }

    createTree(x, y, z) {
        // Ствол
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, y + 4, z);
        trunk.castShadow = true;
        this.scene.add(trunk);

        // Крона
        const leavesGeometry = new THREE.SphereGeometry(4);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(x, y + 8, z);
        leaves.castShadow = true;
        this.scene.add(leaves);
    }

    createStreetLight(x, y, z) {
        // Столб
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, y + 4, z);
        pole.castShadow = true;
        this.scene.add(pole);

        // Лампа
        const lampGeometry = new THREE.SphereGeometry(0.5);
        const lampMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffff88,
            emissive: 0xffff88,
            emissiveIntensity: 0.3
        });
        const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
        lamp.position.set(x, y + 8.5, z);
        lamp.castShadow = true;
        this.scene.add(lamp);
    }
}

// Класс персонажа
class Player {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.isInVehicle = false;
        this.isPunching = false;
        this.health = 100;
        
        this.createMesh();
        this.createPhysics();
    }

    createMesh() {
        // Простая модель персонажа (цилиндр)
        const geometry = new THREE.CylinderGeometry(1, 1.2, 4);
        const material = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 2, 0);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        // Голова
        const headGeometry = new THREE.SphereGeometry(0.8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 3, 0);
        head.castShadow = true;
        this.mesh.add(head);
    }

    createPhysics() {
        const shape = new CANNON.Cylinder(1, 1.2, 4, 8);
        this.body = new CANNON.Body({ 
            mass: 5, 
            material: this.world.playerMaterial 
        });
        this.body.addShape(shape);
        this.body.position.set(0, 2, 0);
        this.body.fixedRotation = true;
        this.world.add(this.body);

        // Связываем физику и визуал
        this.updateMeshFromPhysics();
    }

    punch() {
        if (this.isPunching) return;
        
        this.isPunching = true;
        setTimeout(() => {
            this.isPunching = false;
        }, 500);
    }

    updateMeshFromPhysics() {
        this.mesh.position.copy(this.body.position);
    }

    reset() {
        this.body.position.set(0, 2, 0);
        this.body.velocity.set(0, 0, 0);
        this.health = 100;
        this.isInVehicle = false;
    }

    update(deltaTime) {
        this.updateMeshFromPhysics();
    }
}

// Класс машины
class Vehicle {
    constructor(scene, world, type) {
        this.scene = scene;
        this.world = world;
        this.type = type;
        this.driver = null;
        this.health = 100;
        this.fuel = 100;
        this.speed = 0;
        this.maxSpeed = type === 'suv' ? 25 : 40;
        this.acceleration = type === 'suv' ? 15 : 25;
        this.brakePower = type === 'suv' ? 0.8 : 0.9;
        
        this.createMesh();
        this.createPhysics();
    }

    createMesh() {
        let geometry, material, color;
        
        if (this.type === 'suv') {
            geometry = new THREE.BoxGeometry(4, 2, 6);
            color = 0x8B4513;
        } else {
            geometry = new THREE.BoxGeometry(3.5, 1.5, 5);
            color = 0xFF0000;
        }
        
        material = new THREE.MeshLambertMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.scene.add(this.mesh);

        // Добавляем колеса
        this.createWheels();
    }

    createWheels() {
        const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            { x: 1.5, y: -0.5, z: 2 },
            { x: -1.5, y: -0.5, z: 2 },
            { x: 1.5, y: -0.5, z: -2 },
            { x: -1.5, y: -0.5, z: -2 }
        ];

        this.wheels = [];
        for (let pos of wheelPositions) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.castShadow = true;
            this.mesh.add(wheel);
            this.wheels.push(wheel);
        }
    }

    createPhysics() {
        const shape = new CANNON.Box(new CANNON.Vec3(2, 1, 3));
        this.body = new CANNON.Body({ 
            mass: this.type === 'suv' ? 1500 : 1000, 
            material: this.world.vehicleMaterial 
        });
        this.body.addShape(shape);
        this.body.position.set(0, 2, 0);
        this.body.angularDamping = 0.4;
        this.world.add(this.body);

        this.updateMeshFromPhysics();
    }

    control(moveX, moveZ, turning, deltaTime) {
        if (!this.driver) return;

        // Ускорение/торможение
        if (moveZ < 0 && this.fuel > 0) {
            this.speed = Math.min(this.speed + this.acceleration * deltaTime, this.maxSpeed);
            this.fuel = Math.max(0, this.fuel - deltaTime * 5);
        } else if (moveZ > 0) {
            this.speed = Math.max(this.speed - this.acceleration * deltaTime, -this.maxSpeed * 0.5);
        } else {
            this.speed *= 0.95; // Трение
        }

        // Поворот
        if (turning !== 0 && Math.abs(this.speed) > 1) {
            this.body.angularVelocity.y = turning * this.speed * 0.02;
        }

        // Движение вперед/назад
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.mesh.quaternion);
        const force = forward.multiplyScalar(this.speed * 50);
        
        this.body.velocity.x = force.x;
        this.body.velocity.z = force.z;

        // Урон от высокой скорости
        if (Math.abs(this.speed) > this.maxSpeed * 0.8) {
            this.health = Math.max(0, this.health - deltaTime * 2);
        }
    }

    brake() {
        this.speed *= this.brakePower;
    }

    updateMeshFromPhysics() {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }

    reset() {
        this.body.position.set(0, 2, 0);
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0, 0, 0);
        this.health = 100;
        this.fuel = 100;
        this.speed = 0;
        this.driver = null;
    }

    update(deltaTime) {
        this.updateMeshFromPhysics();
        
        // Анимация колес
        if (this.wheels) {
            this.wheels.forEach(wheel => {
                wheel.rotation.x += this.speed * deltaTime * 2;
            });
        }
    }

    get position() {
        return this.mesh.position;
    }

    set position(vec3) {
        this.mesh.position.copy(vec3);
        this.body.position.copy(vec3);
    }
}

// Класс камеры
class CameraController {
    constructor(camera, target) {
        this.camera = camera;
        this.target = target;
        this.offset = new THREE.Vector3(0, 10, 20);
        this.smooth = 0.1;
        this.rotationY = 0;
        this.rotationX = 0.3;
    }

    update(deltaTime) {
        if (!this.target) return;

        // Поворот камеры мышью
        if (typeof this.mouseX !== 'undefined' && typeof this.mouseY !== 'undefined') {
            this.rotationY = this.mouseX * Math.PI * 0.5;
            this.rotationX = Math.max(0.1, Math.min(1.0, this.mouseY * 0.5 + 0.3));
        }

        // Вычисление позиции камеры
        const targetPos = this.target.mesh.position.clone();
        const rotatedOffset = this.offset.clone();
        
        // Применяем поворот
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(this.rotationX, this.rotationY, 0));
        rotatedOffset.applyQuaternion(quaternion);

        const desiredPos = targetPos.clone().add(rotatedOffset);
        
        // Плавное движение камеры
        this.camera.position.lerp(desiredPos, this.smooth);
        
        // Направляем камеру на цель
        this.camera.lookAt(targetPos);
    }
}

// Инициализация игры при загрузке страницы
let game;
window.addEventListener('load', () => {
    game = new GTA3DGame();
});