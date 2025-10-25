// Cricket Challenge 3D - Phase 3: Batting Mechanics
let scene, camera, renderer;
let ball, bowler, batsman, bat;
let ballVelocity = { x: 0, y: 0, z: 0 };
let isBowling = false;
let ballStartPos = { x: 0, y: 1.5, z: 7 };
let score = 0;
let balls = 0;

// Batting controls
let touchStartX = 0;
let touchStartY = 0;
let isSwinging = false;
let batRotation = 0;

function init() {
    console.log('Starting init...');
    
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
    
    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-10, 10, -10);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
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
    
    // Blue batsman
    const batsmanGeometry = new THREE.BoxGeometry(0.6, 1.5, 0.4);
    const batsmanMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
    batsman = new THREE.Mesh(batsmanGeometry, batsmanMaterial);
    batsman.position.set(0.8, 1, -8);
    scene.add(batsman);
    
    // Red bowler
    const bowlerGeometry = new THREE.BoxGeometry(0.6, 1.5, 0.4);
    const bowlerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    bowler = new THREE.Mesh(bowlerGeometry, bowlerMaterial);
    bowler.position.set(0, 1, 7);
    scene.add(bowler);
    
    // Red cricket ball (LARGE AND VISIBLE)
    const ballGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(ballStartPos.x, ballStartPos.y, ballStartPos.z);
    scene.add(ball);
    
    // Brown bat
    const batGeometry = new THREE.BoxGeometry(0.15, 0.08, 1.2);
    const batMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    bat = new THREE.Mesh(batGeometry, batMaterial);
    bat.position.set(1.3, 0.7, -7.8);
    bat.rotation.x = Math.PI / 6;
    scene.add(bat);
    
    // Boundary rope
    const boundaryGeometry = new THREE.TorusGeometry(45, 0.3, 16, 100);
    const boundaryMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    boundary.rotation.x = Math.PI / 2;
    boundary.position.y = 0.3;
    scene.add(boundary);
    
    updateStatus();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    
    console.log('Starting animation...');
    animate();
}

function updateStatus() {
    document.getElementById('status').innerHTML = 
        `<h2>Cricket Challenge 3D</h2>
        <p>Score: ${score} runs | Balls: ${balls}</p>
        <p>🏏 Swipe UP to hit! | Tap bottom to bowl</p>`;
}

function onTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function onTouchMove(event) {
    event.preventDefault();
}

function onTouchEnd(event) {
    if (!event.changedTouches[0]) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe up to bat
    if (deltaY < -50 && Math.abs(deltaX) < 100) {
        swingBat();
    }
    // Tap bottom area to bowl
    else if (touchStartY > window.innerHeight * 0.7 && !isBowling) {
        bowlBall();
    }
}

function onKeyDown(event) {
    if (event.code === 'Space' && !isBowling) {
        bowlBall();
    } else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        swingBat();
    }
}

function swingBat() {
    if (isSwinging) return;
    
    isSwinging = true;
    batRotation = 0;
    console.log('Bat swung!');
    
    // Reset swing after animation - LONGER SWING TIME
    setTimeout(() => {
        isSwinging = false;
    }, 800);
}
    function bowlBall() {
    if (isBowling) return;
    
    isBowling = true;
    balls++;
    
    document.getElementById('status').innerHTML = 
        `<h2>Cricket Challenge 3D</h2>
        <p>Score: ${score} runs | Balls: ${balls}</p>
        <p>⚠️ GET READY... Ball coming in 2 seconds!</p>`;
    
    // Wait 2 seconds before bowling
    setTimeout(() => {
        // Random line and length
        const randomX = (Math.random() - 0.5) * 0.8;
        const randomSpeed = 0.35 + Math.random() * 0.25;
        
        ballVelocity.x = randomX * 0.1;
        ballVelocity.y = -0.02;
        ballVelocity.z = -randomSpeed;
        
        bowler.position.z = 6;
        
        document.getElementById('status').innerHTML = 
            `<h2>Cricket Challenge 3D</h2>
            <p>Score: ${score} runs | Balls: ${balls}</p>
            <p>🏏 SWIPE UP NOW TO HIT!</p>`;
        
        console.log('Ball bowled!');
    }, 2000); // 2 second delay
}

function updateBall() {
    if (!isBowling) return;
    
    // Update ball position
    ball.position.x += ballVelocity.x;
    ball.position.y += ballVelocity.y;
    ball.position.z += ballVelocity.z;
    
    // Check for bat collision - EASIER TIMING
    if (isSwinging && 
        ball.position.z < -6 && ball.position.z > -9 &&
        Math.abs(ball.position.x - bat.position.x) < 1.5 &&
        ball.position.y < 1.5 && ball.position.y > 0) {
        
        hitBall();
    }
    
    // Bounce on pitch
    if (ball.position.y < 0.3 && ball.position.z > -8 && ball.position.z < 8) {
        ball.position.y = 0.3;
        ballVelocity.y = 0.15;
        ballVelocity.z *= 0.8;
    }
    
    // Apply gravity
    ballVelocity.y -= 0.003;
    
    // Check if ball is out of bounds
    if (ball.position.z < -12 || ball.position.y < -2 || 
        Math.abs(ball.position.x) > 50 || ball.position.z > 50) {
        resetBall();
    }
}

function hitBall() {
    console.log('SHOT!');
    
    // Calculate runs based on power
    const power = Math.abs(ballVelocity.z);
    let runs = 0;
    
    if (power > 0.5) {
        runs = 6; // Six!
        ballVelocity.z = 1.5;
        ballVelocity.y = 0.8;
    } else if (power > 0.4) {
        runs = 4; // Four!
        ballVelocity.z = 1.2;
        ballVelocity.y = 0.3;
    } else {
        runs = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        ballVelocity.z = 0.8;
        ballVelocity.y = 0.2;
    }
    
    // Random direction
    ballVelocity.x = (Math.random() - 0.5) * 0.5;
    
    score += runs;
    updateStatus();
    
    console.log(`${runs} runs scored!`);
}

function updateBat() {
    if (isSwinging) {
        batRotation += 0.3;
        bat.rotation.x = Math.PI / 6 - Math.sin(batRotation) * 0.8;
        bat.position.y = 0.7 + Math.sin(batRotation) * 0.3;
    } else {
        bat.rotation.x = Math.PI / 6;
        bat.position.y = 0.7;
    }
}

function resetBall() {
    ball.position.set(ballStartPos.x, ballStartPos.y, ballStartPos.z);
    ballVelocity = { x: 0, y: 0, z: 0 };
    isBowling = false;
    isSwinging = false;
    bowler.position.z = 7;
    updateStatus();
    console.log('Ball reset');
}

function animate() {
    requestAnimationFrame(animate);
    
    updateBall();
    updateBat();
    
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
