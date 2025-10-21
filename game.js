// Cricket Challenge 3D - Game Engine
// Phase 1: Basic 3D Scene Setup

let scene, camera, renderer;
let stadium, pitch, ball;
let batsman, bowler;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 8, 25);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(50, 50, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Create cricket pitch
    createPitch();
    
    // Create stumps
    createStumps();
    
    // Create basic stadium
    createStadium();
    
    // Create players
    createPlayers();
    
    // Create ball
    createBall();

    // Hide loading screen
    document.getElementById('loading').style.display = 'none';

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createPitch() {
    // Main pitch (22 yards)
    const pitchGeometry = new THREE.BoxGeometry(3, 0.1, 20);
    const pitchMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xD2B48C,
        roughness: 0.8 
    });
    pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Grass field
    const fieldGeometry = new THREE.CircleGeometry(60, 32);
    const fieldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2F8B1B,
        roughness: 0.9 
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.position.y = -0.05;
    field.receiveShadow = true;
    scene.add(field);

    // Crease lines
    const creaseMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    // Batting crease
    const creaseGeometry = new THREE.BoxGeometry(3.5, 0.12, 0.1);
    const battingCrease = new THREE.Mesh(creaseGeometry, creaseMaterial);
    battingCrease.position.set(0, 0.11, -8);
    scene.add(battingCrease);
    
    // Bowling crease
    const bowlingCrease = new THREE.Mesh(creaseGeometry, creaseMaterial);
    bowlingCrease.position.set(0, 0.11, 8);
    scene.add(bowlingCrease);
}

function createStumps() {
    const stumpMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    
    // Batsman's stumps
    for (let i = -1; i <= 1; i++) {
        const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7);
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.set(i * 0.12, 0.35, -8.5);
        stump.castShadow = true;
        scene.add(stump);
    }
    
    // Bowler's stumps
    for (let i = -1; i <= 1; i++) {
        const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7);
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.set(i * 0.12, 0.35, 8.5);
        stump.castShadow = true;
        scene.add(stump);
    }
}

function createStadium() {
    // Simple stadium boundary
    const boundaryGeometry = new THREE.TorusGeometry(58, 0.3, 16, 100);
    const boundaryMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    boundary.rotation.x = Math.PI / 2;
    boundary.position.y = 0.1;
    scene.add(boundary);

    // Sight screen (bowler's end)
    const screenGeometry = new THREE.BoxGeometry(8, 6, 0.2);
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const sightScreen = new THREE.Mesh(screenGeometry, screenMaterial);
    sightScreen.position.set(0, 3, 12);
    scene.add(sightScreen);
}

function createPlayers() {
    // Batsman
    const batsmanGeometry = new THREE.CapsuleGeometry(0.4, 1.2);
    const batsmanMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF });
    batsman = new THREE.Mesh(batsmanGeometry, batsmanMaterial);
    batsman.position.set(0.5, 1, -8);
    batsman.castShadow = true;
    scene.add(batsman);

    // Bat
    const batGeometry = new THREE.BoxGeometry(0.15, 0.08, 1);
    const batMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const bat = new THREE.Mesh(batGeometry, batMaterial);
    bat.position.set(0.8, 0.5, -8);
    bat.rotation.x = Math.PI / 4;
    bat.castShadow = true;
    scene.add(bat);

    // Bowler
    const bowlerGeometry = new THREE.CapsuleGeometry(0.4, 1.2);
    const bowlerMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    bowler = new THREE.Mesh(bowlerGeometry, bowlerMaterial);
    bowler.position.set(0, 1, 6);
    bowler.castShadow = true;
    scene.add(bowler);
}

function createBall() {
    const ballGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFF0000,
        roughness: 0.3,
        metalness: 0.2
    });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 1.5, 6);
    ball.castShadow = true;
    scene.add(ball);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate camera slightly for effect
    const time = Date.now() * 0.0001;
    camera.position.x = Math.sin(time) * 2;
    camera.lookAt(0, 2, 0);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game when page loads
window.addEventListener('load', init);
