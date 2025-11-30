import React, { useMemo } from 'react';
import { ItemData } from '../../types';

interface Props {
    item: ItemData;
}

export const MoonItemView: React.FC<Props> = ({ item }) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${item.text}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #050510; font-family: 'Cinzel', serif; }
        canvas { display: block; }
        
        #hud {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; display: flex; flex-direction: column;
            justify-content: center; align-items: center; z-index: 20;
        }

        .title-container {
            text-align: center; padding: 40px; color: #ffffff;
            opacity: 0; transform: translateY(20px);
            animation: fadeUp 2s ease forwards 1s;
            background: rgba(5, 10, 20, 0.4);
            border: 1px solid rgba(200, 220, 255, 0.1);
            backdrop-filter: blur(4px);
        }

        h1 {
            font-size: 36px; margin: 0; letter-spacing: 6px;
            background: linear-gradient(135deg, #ffffff 0%, #e0eaff 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(180, 200, 255, 0.4);
        }

        .subtitle {
            font-family: 'Playfair Display', serif; font-style: italic;
            font-size: 14px; color: #dbeeff; margin-top: 10px; letter-spacing: 2px;
        }

        @keyframes fadeUp { to { opacity: 1; transform: translateY(30vh); } }
        
        #vignette {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, transparent 30%, #020205 120%);
            pointer-events: none; z-index: 10;
        }
    </style>
</head>
<body>
    <div id="vignette"></div>
    <div id="hud">
        <div class="title-container">
            <h1>${item.text.toUpperCase()}</h1>
            <div class="subtitle">${item.description}</div>
        </div>
    </div>

    <script type="importmap">
        { "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js", "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/" } }
    </script>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        // SIMPLE AUDIO
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const gain = ctx.createGain(); gain.gain.value = 0.2; gain.connect(ctx.destination);
        function playAmbience() {
            if(ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 110;
            const lfo = ctx.createOscillator(); lfo.frequency.value = 0.1;
            const lfoGain = ctx.createGain(); lfoGain.gain.value = 5;
            lfo.connect(lfoGain); lfoGain.connect(osc.frequency); lfo.start();
            osc.connect(gain); osc.start();
        }
        document.addEventListener('click', playAmbience, {once:true});
        setTimeout(playAmbience, 1000);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 0.8;

        // MOON
        const moonGeo = new THREE.SphereGeometry(3, 64, 64);
        const texLoader = new THREE.TextureLoader();
        // Procedural noise texture generated in canvas for base
        const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
        const c = canvas.getContext('2d');
        c.fillStyle = '#111'; c.fillRect(0,0,512,512);
        for(let i=0; i<5000; i++) {
            c.fillStyle = \`rgba(255,255,255,\${Math.random()*0.1})\`;
            c.beginPath(); c.arc(Math.random()*512, Math.random()*512, Math.random()*2, 0, Math.PI*2); c.fill();
        }
        const tex = new THREE.CanvasTexture(canvas);
        
        const moonMat = new THREE.MeshStandardMaterial({
            map: tex, color: 0xcccccc, roughness: 0.8, metalness: 0.2
        });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        scene.add(moon);

        // LIGHTS
        const ambient = new THREE.AmbientLight(0x404040, 2); scene.add(ambient);
        const dirLight = new THREE.DirectionalLight(0xffffff, 2); dirLight.position.set(5, 3, 5); scene.add(dirLight);
        const blueLight = new THREE.PointLight(0x0044ff, 5, 20); blueLight.position.set(-5, -2, 5); scene.add(blueLight);

        // PARTICLES
        const partGeo = new THREE.BufferGeometry();
        const partPos = [];
        for(let i=0; i<200; i++) {
            partPos.push((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20);
        }
        partGeo.setAttribute('position', new THREE.Float32BufferAttribute(partPos, 3));
        const partMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
        const particles = new THREE.Points(partGeo, partMat);
        scene.add(particles);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            particles.rotation.y += 0.001;
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
    }, [item.text, item.description]);

    return (
        <iframe
            src={blobUrl}
            style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'black', borderRadius: '0.75rem' }}
            title={item.text}
        />
    );
};
