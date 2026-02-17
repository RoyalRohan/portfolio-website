(function() {
    'use strict';

    const CONFIG = {
        particleCount: 150,
        connectionDistance: 120,
        maxConnections: 3,
        mouseInfluence: 150,
        colors: {
            primary: 0x00d9ff,
            secondary: 0x00a8cc,
            accent: 0x00ff88
        },
        cameraSpeed: 0.0003
    };

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  
    if (isTouchDevice) {
        CONFIG.particleCount = 80;
        CONFIG.connectionDistance = 80;
    }

    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
 
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(CONFIG.particleCount * 3);
    const particleVelocities = [];
    const particleSizes = new Float32Array(CONFIG.particleCount);


    for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3;
  
        particlePositions[i3] = (Math.random() - 0.5) * 300;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 300;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 200;
        

        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
            z: (Math.random() - 0.5) * 0.1
        });
        
        
        particleSizes[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        color: CONFIG.colors.primary,
        size: 2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    
    const floatingObjects = [];
    const objectCount = isTouchDevice ? 3 : 5;

    for (let i = 0; i < objectCount; i++) {
        let geometry, material, mesh;
        
        const type = i % 3;
        const size = Math.random() * 8 + 4;
        
        switch (type) {
            case 0: // Cube
                geometry = new THREE.BoxGeometry(size, size, size);
                break;
            case 1: // Octahedron
                geometry = new THREE.OctahedronGeometry(size * 0.8);
                break;
            case 2: // Tetrahedron
                geometry = new THREE.TetrahedronGeometry(size * 0.9);
                break;
        }
        
        material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.secondary,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });
        
        mesh = new THREE.Mesh(geometry, material);
    
        mesh.position.set(
            (Math.random() - 0.5) * 250,
            (Math.random() - 0.5) * 250,
            (Math.random() - 0.5) * 150 - 50
        );
 
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.005
            },
            floatSpeed: Math.random() * 0.5 + 0.3,
            floatAmplitude: Math.random() * 10 + 5,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: mesh.position.y
        };
        
        floatingObjects.push(mesh);
        scene.add(mesh);
        
        const glowGeometry = geometry.clone();
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? CONFIG.colors.primary : CONFIG.colors.secondary,
            transparent: true,
            opacity: 0.05,
            wireframe: false
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.scale.set(0.8, 0.8, 0.8);
        mesh.add(glowMesh);
    }

    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: CONFIG.colors.primary,
        transparent: true,
        opacity: 0.15
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    
    const mouse = new THREE.Vector2();
    const targetCamera = new THREE.Vector3();
    let mouseX = 0;
    let mouseY = 0;

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
    }

    if (!isTouchDevice) {
        document.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    
    let frameCount = 0;
    const updateInterval = isTouchDevice ? 2 : 1; 

    function animate() {
        requestAnimationFrame(animate);
        
        frameCount++;
        if (frameCount % updateInterval !== 0) return;

        const time = Date.now() * 0.001;
        const positions = particleGeometry.attributes.position.array;
      
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] += particleVelocities[i].x;
            positions[i3 + 1] += particleVelocities[i].y;
            positions[i3 + 2] += particleVelocities[i].z;
    
            if (positions[i3] > 150) positions[i3] = -150;
            if (positions[i3] < -150) positions[i3] = 150;
            if (positions[i3 + 1] > 150) positions[i3 + 1] = -150;
            if (positions[i3 + 1] < -150) positions[i3 + 1] = 150;
            if (positions[i3 + 2] > 100) positions[i3 + 2] = -100;
            if (positions[i3 + 2] < -100) positions[i3 + 2] = 100;
            
            if (!isTouchDevice && i % 5 === 0) {
                const dx = positions[i3] - mouse.x * 100;
                const dy = positions[i3 + 1] - mouse.y * 100;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < CONFIG.mouseInfluence) {
                    const force = (CONFIG.mouseInfluence - dist) / CONFIG.mouseInfluence;
                    positions[i3] += dx * force * 0.02;
                    positions[i3 + 1] += dy * force * 0.02;
                }
            }
        }

        particleGeometry.attributes.position.needsUpdate = true;

        floatingObjects.forEach((obj, index) => {
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;
            
            obj.position.y = obj.userData.originalY + 
                Math.sin(time * obj.userData.floatSpeed + obj.userData.floatOffset) * 
                obj.userData.floatAmplitude;
        });

        if (!isTouchDevice && frameCount % 2 === 0) {
            updateConnections();
        }

        if (!isTouchDevice) {
            targetCamera.x = mouseX * 5;
            targetCamera.y = -mouseY * 5;
            camera.position.x += (targetCamera.x - camera.position.x) * 0.05;
            camera.position.y += (targetCamera.y - camera.position.y) * 0.05;
        }
        
        camera.rotation.z = Math.sin(time * 0.1) * 0.002;

        renderer.render(scene, camera);
    }
    function updateConnections() {
        const positions = particleGeometry.attributes.position.array;
        const linePositions = [];
        
        for (let i = 0; i < CONFIG.particleCount; i++) {
            let connections = 0;
            const i3 = i * 3;
            
            for (let j = i + 1; j < CONFIG.particleCount; j++) {
                if (connections >= CONFIG.maxConnections) break;
                
                const j3 = j * 3;
                const dx = positions[i3] - positions[j3];
                const dy = positions[i3 + 1] - positions[j3 + 1];
                const dz = positions[i3 + 2] - positions[j3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < CONFIG.connectionDistance) {
                    linePositions.push(
                        positions[i3], positions[i3 + 1], positions[i3 + 2],
                        positions[j3], positions[j3 + 1], positions[j3 + 2]
                    );
                    connections++;
                }
            }
        }
        
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    }
    
    let resizeTimeout;
    function onWindowResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 100);
    }

    window.addEventListener('resize', onWindowResize, { passive: true });

    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
           
            cancelAnimationFrame(animate);
        } else {
         
            animate();
        }
    });

    animate();

    
    let scrollY = 0;
    let targetScrollY = 0;

    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    }, { passive: true });

    function updateScrollEffect() {
        scrollY += (targetScrollY - scrollY) * 0.1;
        

        const scrollFactor = scrollY * 0.02;
        particleSystem.position.y = -scrollFactor * 0.5;
        
        floatingObjects.forEach((obj, index) => {
            obj.rotation.y += scrollY * 0.0001 * (index + 1);
        });
        
        requestAnimationFrame(updateScrollEffect);
    }
    
    updateScrollEffect();
    
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            particleMaterial.size = 3;
            particleMaterial.opacity = 1;
        });
        
        card.addEventListener('mouseleave', () => {
            particleMaterial.size = 2;
            particleMaterial.opacity = 0.8;
        });
    });

    console.log('🎮 Three.js Background Initialized');
    console.log(`📊 Particles: ${CONFIG.particleCount}`);
    console.log(`🎯 Floating Objects: ${objectCount}`);
    console.log(`📱 Touch Device: ${isTouchDevice}`);

})();
