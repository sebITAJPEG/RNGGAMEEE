import React, { useMemo } from 'react';

export const WakingLifeView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waking Life</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;500&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #ffffff; font-family: 'Montserrat', sans-serif; color: black; }
        canvas { display: block; }
        
        #ui {
            position: absolute;
            bottom: 50px;
            left: 50px;
            pointer-events: none;
        }
        
        h1 { font-weight: 300; letter-spacing: 5px; margin: 0; font-size: 3rem; }
        p { font-weight: 100; letter-spacing: 2px; margin-top: 10px; font-size: 1rem; }
        
        #hint {
            position: absolute; top: 20px; right: 20px; font-size: 0.8rem; color: #aaa;
        }
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
            }
        }
    </script>
</head>
<body>
    <div id="ui">
        <h1>Waking Life</h1>
        <p>CLASS: REALITY</p>
        <p>RARITY: 1 in 100,000,000</p>
    </div>
    <div id="hint">Drag to Rotate</div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.FogExp2(0xffffff, 0.02);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 10;
        camera.position.y = 1.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // --- GEOMETRY ---
        const group = new THREE.Group();
        scene.add(group);

        // 1. Inner Core (The Soul)
        const coreGeo = new THREE.SphereGeometry(0.8, 64, 64);
        const coreMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0xffffee,
            emissiveIntensity: 0.5,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.9,
            thickness: 1.0,
            ior: 1.5,
            iridescence: 1,
            iridescenceIOR: 1.3,
            clearcoat: 1
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // 2. Wireframe Shell (The Construct)
        const shellGeo = new THREE.IcosahedronGeometry(1.4, 1);
        const shellMat = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.1 
        });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        group.add(shell);

        // 3. Floating Geometric Shards (Fragments of Reality)
        const shardsGroup = new THREE.Group();
        group.add(shardsGroup);
        const shardGeo = new THREE.TetrahedronGeometry(0.1);
        const shardMat = new THREE.MeshPhysicalMaterial({
            color: 0xeeeeee,
            roughness: 0.2,
            metalness: 0.8,
            transmission: 0.5,
            thickness: 0.5
        });

        for(let i=0; i<40; i++) {
            const shard = new THREE.Mesh(shardGeo, shardMat);
            const r = 2 + Math.random() * 1;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            shard.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            shard.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            shard.userData = { 
                speed: Math.random() * 0.01 + 0.005,
                axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize()
            };
            shardsGroup.add(shard);
        }

        // 4. Orbital Rings (Time)
        const ringGeo = new THREE.TorusGeometry(2.5, 0.01, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 });
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        const ring2 = new THREE.Mesh(ringGeo, ringMat);
        
        ring1.rotation.x = Math.PI / 2;
        ring2.rotation.x = Math.PI / 2;
        ring2.rotation.y = Math.PI / 4;
        
        group.add(ring1);
        group.add(ring2);

        // --- LIGHTING ---
        const ambient = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambient);
        
        const light1 = new THREE.PointLight(0xffccaa, 2, 10);
        light1.position.set(3, 3, 3);
        scene.add(light1);
        
        const light2 = new THREE.PointLight(0xaaccff, 2, 10);
        light2.position.set(-3, -3, 3);
        scene.add(light2);

        // --- ANIMATION ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            
            controls.update();

            // Core Pulse
            const pulse = 1 + Math.sin(t * 2) * 0.05;
            core.scale.setScalar(pulse);
            
            // Shell Rotation
            shell.rotation.y = -t * 0.1;
            shell.rotation.x = Math.sin(t * 0.5) * 0.1;
            
            // Shards Orbit
            shardsGroup.rotation.y = t * 0.05;
            shardsGroup.children.forEach(shard => {
                shard.rotation.x += 0.01;
                shard.rotation.y += 0.01;
            });
            
            // Rings
            ring1.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
            ring2.rotation.y = Math.PI / 4 + Math.cos(t * 0.5) * 0.2;
            
            // Floating Group
            group.position.y = Math.sin(t) * 0.1;

            renderer.render(scene, camera);
        }
        animate();
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>`;

    const blobUrl = useMemo(() => {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        return URL.createObjectURL(blob);
    }, []);

    return (
        <iframe
            src={blobUrl}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'white',
                borderRadius: '0.75rem'
            }}
            title="Waking Life"
        />
    );
};
