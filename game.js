// Basic setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x454545, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
scene.add(floor);

// Add a cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.2 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5; // Place it on top of the floor
scene.add(cube);

// Add some lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Set initial camera position
camera.position.set(0, 1.6, 5); // Eye level, 5 units back

// --- Controls ---
let isDragging = false;
let previousPointerPosition = { x: 0, y: 0 };
const euler = new THREE.Euler(0, 0, 0, 'YXZ'); // Use Euler angles for rotation

function onPointerDown(event) {
    isDragging = true;
    previousPointerPosition.x = event.clientX || event.touches[0].clientX;
    previousPointerPosition.y = event.clientY || event.touches[0].clientY;
}

function onPointerMove(event) {
    if (!isDragging) return;

    const currentX = event.clientX || event.touches[0].clientX;
    const currentY = event.clientY || event.touches[0].clientY;

    const deltaX = currentX - previousPointerPosition.x;
    const deltaY = currentY - previousPointerPosition.y;

    euler.y -= deltaX * 0.004;
    euler.x -= deltaY * 0.004;

    // Clamp vertical rotation to prevent flipping
    const PI_2 = Math.PI / 2;
    euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

    camera.quaternion.setFromEuler(euler);

    previousPointerPosition.x = currentX;
    previousPointerPosition.y = currentY;
}

function onPointerUp() {
    isDragging = false;
}

// Add event listeners for both mouse and touch
document.addEventListener('mousedown', onPointerDown);
document.addEventListener('mousemove', onPointerMove);
document.addEventListener('mouseup', onPointerUp);

document.addEventListener('touchstart', onPointerDown);
document.addEventListener('touchmove', onPointerMove);
document.addEventListener('touchend', onPointerUp);


// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
