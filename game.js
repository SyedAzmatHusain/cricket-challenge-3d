// Cricket Challenge 3D - Phase 2: Bowling Mechanics
let scene, camera, renderer;
let ball, bowler, batsman;
let ballVelocity = { x: 0, y: 0, z: 0 };
let isBowling = false;
let ballStartPos = { x: 0, y: 1.5, z: 7 };

function init() {
    console.log('Starting init...');
    document.getElementById('status').textContent = 'Creating scene...';
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(5, 5, 20);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    document.getElementById('status').textContent = 'Adding lights...';
    
    // Simple bright lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-10, 10, -10);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    document.getElementById('status').textContent = 'Creating field...';
    
    // Green field
    const fieldGeometry = new THREE.PlaneGeometry(100, 100);
    const fieldMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x228B22,
        side: THREE.DoubleSide
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    scene.add(field);
    
    // Brown pitch
    const pitchGeometry = new THREE.BoxGeometry(3, 0.2, 20);
    const pitchMaterial = new THREE.MeshBasicMaterial({ color: 0xD2B48C });
    const pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
    pitch.position.y = 0.1;
    scene.add(pitch);
    
    // White crease lines
    const creaseGeometry = new THREE.BoxGeometry(3.5, 0.05, 0.1);
    const creaseMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    const battingCrease = new THREE.Mesh(creaseGeometry, creaseMaterial);
    battingCrease.position.set(0, 0.21, -8);
    scene.add(battingCrease);
    
    const bowlingCrease = new THREE.Mesh(creaseGeometry, creaseMaterial);
    bowlingCrease.position.set(0, 0.21, 8);
    scene.add(bowlingCrease);
    
    document.getElementById('status').textContent = 'Creating stumps...';
    
    // White stumps at batting end
    for (let i = -1; i <= 1; i++) {
        const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
        const stumpMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.set(i * 0.15, 0.45, -9);
        scene.add(stump);
    }
    
    // White stumps at bowling end
    for (let i = -1; i <= 1; i++) {
        const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
        const stumpMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.set(i * 0.15, 0.45, 9);
        scene.add(stump);
    }
    
    document.getElementById('status').textContent = 'Creating players...';
    
    // Blue batsman
    const batsmanGeometry = new THREE.BoxGeometry(0.6, 1.5, 0.4);
    const batsmanMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
    batsman = new THREE.Mesh(batsmanGeometry, batsmanMaterial);
    batsman.position.set(1, 1, -8);
    scene.add(batsman);
    
    // Red bowler
    const bowlerGeometry = new THREE.BoxGeometry(0.6, 1.5, 0.4);
    const bowlerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    bowler = new THREE.Mesh(bowlerGeometry, bowlerMaterial);
    bowler.position.set(0, 1, 7);
    scene.add(bowler);
    
    // Red cricket ball (LARGER AND BRIGHTER)
    const ballGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(ballStartPos.x, ballStartPos.y, ballStartPos.z);
    scene.add(ball);
    console.log('Ball added at', ball.position);
    
    // Brown bat
    const batGeometry = new THREE.BoxGeometry(0.15, 0.08, 1);
    const batMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const bat = new THREE.Mesh(batGeometry, batMaterial);
    bat.position.set(1.5, 0.7, -8);
    scene.add(bat);
    
    // Boundary rope
    const boundaryGeometry = new THREE.TorusGeometry(45, 0.3, 16, 100);
    const boundaryMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    boundary.rotation.x = Math.PI / 2;
    boundary.position.y = 0.3;
    scene.add(boundary);
    
    document.getElementById('status').textContent = 'Tap screen or press SPACE to bowl! 🏏';
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle keyboard input
    window.addEventListener('keydown', onKeyDown);

    // Handle touch input for mobile
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('click', onClick);
    
    console.log('Starting animation...');
    animate();
}

function onKeyDown(event) {
    if (event.code === 'Space' && !isBowling) {
        bowlBall();
    }
}

function onTouchStart(event) {
    event.preventDefault();
    if (!isBowling) {
        bowlBall();
    }
}

function onClick(event) {
    if (!isBowling) {
        bowlBall();
    }
}

function bowlBall() {
    isBowling = true;
    
    // Bowl towards the batsman
    ballVelocity.x = 0;
    ballVelocity.y = -0.02; // Slight drop
    ballVelocity.z = -0.5;  // Speed towards batsman
    
    // Animate bowler
    bowler.position.z = 6;
    
    document.getElementById('status').textContent = '🏏 Bowling... Press SPACE for next ball';
    console.log('Ball bowled!');
}

function updateBall() {
    if (!isBowling) return;
    
    // Update ball position
    ball.position.x += ballVelocity.x;
    ball.position.y += ballVelocity.y;
    ball.position.z += ballVelocity.z;
    
    // Bounce on pitch
    if (ball.position.y < 0.3 && ball.position.z > -8 && ball.position.z < 8) {
        ball.position.y = 0.3;
        ballVelocity.y = 0.15; // Bounce up
        ballVelocity.z *= 0.8; // Slow down after bounce
    }
    
    // Apply gravity
    ballVelocity.y -= 0.003;
    
    // Check if ball reached batsman or went past
    if (ball.position.z < -10 || ball.position.y < 0) {
        resetBall();
    }
}

function resetBall() {
    ball.position.set(ballStartPos.x, ballStartPos.y, ballStartPos.z);
    ballVelocity = { x: 0, y: 0, z: 0 };
    isBowling = false;
    bowler.position.z = 7;
    document.getElementById('status').textContent = 'Touch screen or Press SPACE to bowl! 🏏';
    console.log('Ball reset');
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update ball physics
    updateBall();
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start when loaded
window.addEventListener('load', () => {
    console.log('Page loaded, starting init...');
    init();
});
