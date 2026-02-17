import * as THREE from 'three';

let scene, camera, renderer;
let car, carBody;
let buildings = [];
let roads = [];
let keys = {};
let carSpeed = 0;
let carRotation = 0;
let maxSpeed = 0.5;
let acceleration = 0.02;
let friction = 0.98;
let turnSpeed = 0.03;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    createGround();
    createCar();
    createCity();

    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    animate();
}

function createGround() {
    const groundSize = 500;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a5a2a,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    createRoads();
}

function createRoads() {
    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9
    });

    for (let i = -200; i <= 200; i += 40) {
        const roadGeometry = new THREE.PlaneGeometry(20, 500);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(i, 0.01, 0);
        road.receiveShadow = true;
        scene.add(road);
        roads.push(road);
    }

    for (let i = -200; i <= 200; i += 40) {
        const roadGeometry = new THREE.PlaneGeometry(500, 20);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0.01, i);
        road.receiveShadow = true;
        scene.add(road);
        roads.push(road);
    }

    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    for (let i = -200; i <= 200; i += 40) {
        for (let j = -200; j <= 200; j += 10) {
            const lineGeometry = new THREE.PlaneGeometry(0.3, 4);
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(i, 0.02, j);
            scene.add(line);
        }
    }
}

function createCar() {
    car = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.8,
        roughness: 0.2
    });
    carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carBody.position.y = 0.5;
    carBody.castShadow = true;
    car.add(carBody);

    const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
    const roofMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.8,
        roughness: 0.2
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 1.4, -0.3);
    roof.castShadow = true;
    car.add(roof);

    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.5
    });

    const frontWindowGeometry = new THREE.PlaneGeometry(1.6, 0.6);
    const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
    frontWindow.position.set(0, 1.4, 0.7);
    frontWindow.rotation.x = -0.2;
    car.add(frontWindow);

    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });

    const wheelPositions = [
        { x: -1, z: 1.3 },
        { x: 1, z: 1.3 },
        { x: -1, z: -1.3 },
        { x: 1, z: -1.3 }
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, 0.4, pos.z);
        wheel.castShadow = true;
        car.add(wheel);
    });

    car.position.set(0, 0, 0);
    car.castShadow = true;
    scene.add(car);
}

function createCity() {
    const buildingMaterials = [
        new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
        new THREE.MeshStandardMaterial({ color: 0xA0522D }),
        new THREE.MeshStandardMaterial({ color: 0x696969 }),
        new THREE.MeshStandardMaterial({ color: 0x808080 }),
        new THREE.MeshStandardMaterial({ color: 0xD2691E })
    ];

    for (let x = -200; x <= 200; x += 40) {
        for (let z = -200; z <= 200; z += 40) {
            if (Math.random() > 0.3) {
                const height = Math.random() * 30 + 10;
                const width = Math.random() * 8 + 6;
                const depth = Math.random() * 8 + 6;

                const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
                const material = buildingMaterials[Math.floor(Math.random() * buildingMaterials.length)];
                const building = new THREE.Mesh(buildingGeometry, material);

                const offsetX = (Math.random() - 0.5) * 15;
                const offsetZ = (Math.random() - 0.5) * 15;

                building.position.set(x + offsetX, height / 2, z + offsetZ);
                building.castShadow = true;
                building.receiveShadow = true;
                scene.add(building);
                buildings.push(building);

                for (let i = 0; i < height / 3; i++) {
                    const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
                    const windowMaterial = new THREE.MeshStandardMaterial({
                        color: Math.random() > 0.5 ? 0xffff99 : 0x333333,
                        emissive: Math.random() > 0.5 ? 0xffff66 : 0x000000,
                        emissiveIntensity: 0.3
                    });

                    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window1.position.set(width/2 + 0.01, i * 3 + 2, 0);
                    window1.rotation.y = Math.PI / 2;
                    building.add(window1);

                    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window2.position.set(-width/2 - 0.01, i * 3 + 2, 0);
                    window2.rotation.y = -Math.PI / 2;
                    building.add(window2);
                }
            }
        }
    }
}

function updateCar() {
    let isAccelerating = false;

    if (keys['KeyW'] || keys['ArrowUp']) {
        carSpeed += acceleration;
        isAccelerating = true;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        carSpeed -= acceleration;
        isAccelerating = true;
    }

    if (!isAccelerating) {
        carSpeed *= friction;
    }

    carSpeed = Math.max(-maxSpeed, Math.min(maxSpeed, carSpeed));

    if (Math.abs(carSpeed) > 0.01) {
        if (keys['KeyA'] || keys['ArrowLeft']) {
            carRotation += turnSpeed;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            carRotation -= turnSpeed;
        }
    }

    if (keys['Space']) {
        carSpeed *= 0.95;
    }

    car.rotation.y = carRotation;
    car.position.x += Math.sin(carRotation) * carSpeed;
    car.position.z += Math.cos(carRotation) * carSpeed;

    car.position.x = Math.max(-230, Math.min(230, car.position.x));
    car.position.z = Math.max(-230, Math.min(230, car.position.z));

    const speedKmh = Math.abs(carSpeed * 200).toFixed(0);
    document.getElementById('speed').textContent = speedKmh;
}

function updateCamera() {
    const cameraDistance = 15;
    const cameraHeight = 8;

    const targetX = car.position.x - Math.sin(carRotation) * cameraDistance;
    const targetZ = car.position.z - Math.cos(carRotation) * cameraDistance;
    const targetY = car.position.y + cameraHeight;

    camera.position.x += (targetX - camera.position.x) * 0.1;
    camera.position.y += (targetY - camera.position.y) * 0.1;
    camera.position.z += (targetZ - camera.position.z) * 0.1;

    camera.lookAt(car.position);
}

function animate() {
    requestAnimationFrame(animate);

    updateCar();
    updateCamera();

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
