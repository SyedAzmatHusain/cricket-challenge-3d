import * as THREE from 'three';

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Add lights - IMPROVED LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(30, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    scene.add(sunLight);

    // Add hemisphere light for better outdoor lighting
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x2F8B1B, 0.6);
    scene.add(hemiLight);

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
    const pitchMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xD2B48C
    });
    pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
    pitch.receiveShadow = true;
    pitch.castShadow = true;
    scene.add(pitch);

    // Grass field
    const fieldGeometry = new THREE.CircleGeometry(60, 32);
    const fieldMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x2F8B1B
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
    const stumpMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    
    // Batsman's stumps
    for (let i = -1; i <= 1; i++) {
        const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.set(i * 0.12, 0.35, -8.5);
        stump.castShadow = true;
        scene.add(stump);
    }
    
    // Bails on batsman's stumps
    const bailGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8);
    const bailMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    
    const bail1 = new THREE.Mesh(bailGeometry, bailMaterial);
    bail1.rotation.z = Math.PI / 2;
    bail1.position.set(-0.06, 0.72, -8.5);
    scene.add(bail1);
    
    const bail2 = new THREE.Mesh(bailGeometry, bailMaterial);
    bail2.rotation.z = Math.PI / 2;
    bail2.position.set(0.06, 0.72, -8.5);
    scene.add(bail2);
    
    // Bowler's stumps
    for (let i = -1; i <= 1; i++) {
        const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.set(i * 0.12, 0.35, 8.5);
        stump.castShadow = true;
        scene.add(stump);
    }
    
    // Bails on bowler's stumps
    const bail3 = new THREE.Mesh(bailGeometry, bailMaterial);
    bail3.rotation.z = Math.PI / 2;
    bail3.position.set(-0.06, 0.72, 8.5);
    scene.add(bail3);
    
    const bail4 = new THREE.Mesh(bailGeometry, bailMaterial);
    bail4.rotation.z = Math.PI / 2;
    bail4.position.set(0.06, 0.72, 8.5);
    scene.add(bail4);
}

function createStadium() {
    // Simple stadium boundary
    const boundaryGeometry = new THREE.TorusGeometry(58, 0.3, 16, 100);
    const boundaryMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    boundary.rotation.x = Math.PI / 2;
    boundary.position.y = 0.1;
    scene.add(boundary);

    // Sight screen (bowler's end)
    const screenGeometry = new THREE.BoxGeometry(8, 6, 0.2);
    const screenMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const sightScreen = new THREE.Mesh(screenGeometry, screenMaterial);
    sightScreen.position.set(0, 3, 12);
    sightScreen.castShadow = true;
    scene.add(sightScreen);
}

function createPlayers() {
    // Batsman body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.0, 8);
    const batsmanMaterial = new THREE.MeshLambertMaterial({ color: 0x0066FF });
    const batsmanBody = new THREE.Mesh(bodyGeometry, batsmanMaterial);
    batsmanBody.position.set(0.5, 0.8, -8);
    batsmanBody.castShadow = true;
    scene.add(batsmanBody);

    // Batsman head
    const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC });
    const batsmanHead = new THREE.Mesh(headGeometry, headMaterial);
    batsmanHead.position.set(0.5, 1.5, -8);
    batsmanHead.castShadow = true;
    scene.add(batsmanHead);

    // Helmet
    const helmetGeometry = new THREE.SphereGeometry(0.28, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmetMaterial = new THREE.MeshLambertMaterial({ color: 0x0066FF });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.set(0.5, 1.6, -8);
    helmet.castShadow = true;
    scene.add(helmet);

    // Bat
    const batGeometry = new THREE.BoxGeometry(0.12, 0.06, 0.9);
    const batMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const bat = new THREE.Mesh(batGeometry, batMaterial);
    bat.position.set(0.8, 0.5, -8);
    bat.rotation.x = Math.PI / 6;
    bat.castShadow = true;
    scene.add(bat);

    // Bowler body
    const bowlerBody = new THREE.Mesh(bodyGeometry, new THREE.MeshLambertMaterial({ color: 0xFF3333 }));
    bowlerBody.position.set(0, 0.8, 6);
    bowlerBody.castShadow = true;
    scene.add(bowlerBody);

    // Bowler head
    const bowlerHead = new THREE.Mesh(headGeometry, headMaterial);
    bowlerHead.position.set(0, 1.5, 6);
    bowlerHead.castShadow = true;
    scene.add(bowlerHead);

    // Bowler cap
    const capGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 8);
    const capMaterial = new THREE.MeshLambertMaterial({ color: 0xFF3333 });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.set(0, 1.72, 6);
    scene.add(cap);
}

function createBall() {
    const ballGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const ballMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFF0000
    });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 1.5, 6);
    ball.castShadow = true;
    scene.add(ball);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate camera slightly for effect
    const time = Date.now() * 0.0002;
    camera.position.x = Math.sin(time) * 3;
    camera.position.z = 25 + Math.cos(time) * 2;
    camera.lookAt(0, 1, 0);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game when page loads
window.addEventListener('load', init);
