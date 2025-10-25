// Cricket Challenge 3D - Simple Test Version
let scene, camera, renderer;

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
    camera.position.set(0, 10, 30);
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
    console.log('Field added');
    
    document.getElementById('status').textContent = 'Creating pitch...';
    
    // Brown pitch
    const pitchGeometry = new THREE.BoxGeometry(3, 0.2, 20);
    const pitchMaterial = new THREE.MeshBasicMaterial({ color: 0xD2B48C });
    const pitch = new THREE.Mesh(pitchGeometry, pitchMaterial);
    pitch.position.y = 0.1;
    scene.add(pitch);
    console.log('Pitch added');
    
    document.getElementById('status').textContent = 'Creating stumps...';
    
    // White stumps at batting end
    for (let i = -1; i <= 1; i++) {
        const stumpGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
        const stumpMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const stump = new THREE.Mesh(stumpGeometry, stumpMaterial);
        stump.position.set(i * 0.15, 0.45, -9);
        scene.add(stump);
        console.log('Stump added at', i);
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
    const batsman = new THREE.Mesh(batsmanGeometry, batsmanMaterial);
    batsman.position.set(1, 1, -8);
    scene.add(batsman);
    console.log('Batsman added');
    
    // Red bowler
    const bowlerGeometry = new THREE.BoxGeometry(0.6, 1.5, 0.4);
    const bowlerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const bowler = new THREE.Mesh(bowlerGeometry, bowlerMaterial);
    bowler.position.set(0, 1, 7);
    scene.add(bowler);
    console.log('Bowler added');
    
    // Red cricket ball
    const ballGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 1.5, 7);
    scene.add(ball);
    console.log('Ball added');
    
    // Brown bat
    const batGeometry = new THREE.BoxGeometry(0.15, 0.08, 1);
    const batMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const bat = new THREE.Mesh(batGeometry, batMaterial);
    bat.position.set(1.5, 0.7, -8);
    scene.add(bat);
    console.log('Bat added');
    
    document.getElementById('status').textContent = 'Scene ready! Objects: ' + scene.children.length;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    console.log('Starting animation...');
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Slowly rotate camera
    const time = Date.now() * 0.0003;
    camera.position.x = Math.sin(time) * 5;
    camera.position.z = 30 + Math.cos(time) * 3;
    camera.lookAt(0, 1, 0);
    
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
