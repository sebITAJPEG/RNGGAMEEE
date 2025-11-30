import React, { useMemo } from 'react';

export const LucidLobsterView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lucid Lobster</title>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500;700&family=Comfortaa:wght@300;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
    <style>
        body { margin: 0; overflow: hidden; background-color: #050a14; font-family: 'Comfortaa', cursive; }
        canvas { display: block; position: absolute; top: 0; left: 0; z-index: 1; }

        .crt-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 90;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            opacity: 0.3;
        }
        
        #flash-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: white; pointer-events: none; z-index: 200; opacity: 1;
            transition: opacity 2s ease-out;
        }

        /* --- HUD (Improved Glassmorphism) --- */
        #hud {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            opacity: 1;
            transition: opacity 2s ease-in;
            z-index: 50;
            box-sizing: border-box;
        }
        
        .header { 
            max-width: 500px;
            background: rgba(10, 20, 40, 0.6);
            backdrop-filter: blur(10px);
            padding: 25px;
            border-radius: 16px;
            border: 1px solid rgba(147, 197, 253, 0.2);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            pointer-events: auto;
            transform-origin: top left;
            transition: transform 0.3s;
        }
        .header:hover { transform: scale(1.02); }
        
        .header h1 {
            margin: 0; font-size: 2.5rem;
            background: linear-gradient(to right, #93c5fd, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(147, 197, 253, 0.4);
            letter-spacing: 2px;
            font-weight: 700;
        }
        
        .rarity {
            font-size: 0.9rem; color: #93c5fd; letter-spacing: 3px; margin-top: 5px; 
            text-transform: uppercase; font-weight: 600;
            display: flex; align-items: center; gap: 10px;
        }
        .rarity::before { content: ''; width: 20px; height: 2px; background: #93c5fd; }
        
        .description {
            margin-top: 15px; font-size: 0.95rem; color: #e0f2fe; line-height: 1.6;
            font-family: 'Quicksand', sans-serif;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 15px;
        }

        .stats-panel { 
            text-align: right; 
            background: rgba(10, 20, 40, 0.6);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(192, 132, 252, 0.2);
            display: inline-block;
            align-self: flex-end;
            pointer-events: auto;
            min-width: 300px;
            transform-origin: bottom right;
            transition: transform 0.3s;
        }
        .stats-panel:hover { transform: scale(1.05); }
        
        .stat-row { margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .stat-label { font-size: 0.8rem; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; }
        .stat-value { font-size: 1rem; color: #c084fc; font-weight: bold; text-shadow: 0 0 10px rgba(192,132,252,0.4); }
        
        .awareness-meter {
            width: 100%; height: 6px; background: rgba(255,255,255,0.1); margin-top: 5px;
            position: relative; overflow: hidden; border-radius: 3px;
        }
        
        .awareness-fill {
            position: absolute; top: 0; left: 0; bottom: 0; width: 100%;
            background: linear-gradient(90deg, #93c5fd, #c084fc);
            animation: awarenessPulse 3s infinite ease-in-out;
        }
        @keyframes awarenessPulse { 0% { width: 90%; opacity: 0.8; } 50% { width: 98%; opacity: 1; box-shadow: 0 0 10px #c084fc; } 100% { width: 90%; opacity: 0.8; } }

        #audio-hint {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 201; display: flex; justify-content: center; align-items: center;
            color: white; font-size: 1.2rem; cursor: pointer; transition: opacity 0.5s;
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
    <div id="audio-hint">CLICK TO ENABLE AUDIO</div>
    <div id="flash-overlay"></div>
    <div class="crt-overlay"></div>
    
    <div id="hud">
        <div class="header">
            <h1>LUCID LOBSTER</h1>
            <div class="rarity">1 in 4,000,000,000</div>
            <div class="description">
                "I perceive the cursor. Therefore, I am."<br><br>
                A crustacean that has achieved consciousness within the dreamscape. 
                It knows it is a digital entity in a fishing game, and it finds this mildly amusing.
                Its shell is made of crystallized thoughts and starlight.
            </div>
        </div>
        <div class="stats-panel">
            <div class="stat-row">
                <span class="stat-label">Awareness</span>
                <span class="stat-value">OMNISCIENT</span>
            </div>
            <div class="awareness-meter" style="margin-bottom: 10px;"><div class="awareness-fill"></div></div>
            <div class="stat-row">
                <span class="stat-label">Reality Anchor</span>
                <span class="stat-value" style="color: #f87171;">UNSTABLE</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Dream Depth</span>
                <span class="stat-value">LAYER 4</span>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
        import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';

        // --- AUDIO ENGINE (TONE.JS) ---
        let ambientSynth, delay, chorus;
        let isAudioInit = false;

        async function initAudio() {
            if (isAudioInit) return;
            await Tone.start();
            
            const reverb = new Tone.Reverb(3).toDestination();
            reverb.wet.value = 0.5;
            
            delay = new Tone.PingPongDelay("8n", 0.2).connect(reverb);
            
            ambientSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "fatsine" },
                envelope: { attack: 2, decay: 1, sustain: 0.5, release: 2 }
            }).connect(delay);
            
            chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
            ambientSynth.connect(chorus);
            
            isAudioInit = true;
            document.getElementById('audio-hint').style.opacity = 0;
            setTimeout(() => document.getElementById('audio-hint').style.display = 'none', 500);
            
            playAmbience();
        }
        
        function playAmbience() {
            if (!isAudioInit) return;
            const now = Tone.now();
            ambientSynth.triggerAttackRelease(["C3", "E3", "G3", "B3"], 4, now);
            setInterval(() => {
                const notes = ["C4", "E4", "G4", "B4", "D5", "F#5"];
                const note = notes[Math.floor(Math.random() * notes.length)];
                ambientSynth.triggerAttackRelease(note, 2);
            }, 3000);
        }

        document.getElementById('audio-hint').addEventListener('click', initAudio);

        // --- THREE JS SETUP ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050a14, 0.03);
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // --- V1 ENVIRONMENT ---
        // V1 Particles
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 2000;
        const pArray = new Float32Array(particleCount * 3);
        for(let i=0; i<particleCount * 3; i++) pArray[i] = (Math.random() - 0.5) * 20;
        particleGeo.setAttribute('position', new THREE.BufferAttribute(pArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.05, color: 0xc084fc, transparent: true, opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // V1 Geo Shapes
        const geoShapes = [];
        const geoms = [
            new THREE.IcosahedronGeometry(0.5, 0),
            new THREE.OctahedronGeometry(0.5, 0),
            new THREE.TetrahedronGeometry(0.5, 0)
        ];
        for(let i=0; i<10; i++) {
            const mesh = new THREE.Mesh(
                geoms[Math.floor(Math.random() * geoms.length)],
                new THREE.MeshBasicMaterial({ color: 0x93c5fd, wireframe: true, transparent: true, opacity: 0.3 }) 
            );
            mesh.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
            scene.add(mesh);
            geoShapes.push({ mesh, speed: Math.random() * 0.02, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() });
        }

        // V1 Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xc084fc, 5, 20);
        pointLight.position.set(2, 5, 5);
        scene.add(pointLight);
        const blueLight = new THREE.PointLight(0x93c5fd, 5, 20);
        blueLight.position.set(-2, -5, 5);
        scene.add(blueLight);


        // --- LOBSTER ---
        const lobsterGroup = new THREE.Group();
        scene.add(lobsterGroup);

        // -- Construct Lobster (Original V1 Model) --
        const shellMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x93c5fd, emissive: 0x4f46e5, emissiveIntensity: 0.5,
            metalness: 0.1, roughness: 0.1, transmission: 0.6, thickness: 1.0,
            clearcoat: 1.0, transparent: true, opacity: 0.8
        });

        // Body segments
        const bodyGeo = new THREE.CapsuleGeometry(0.8, 2, 4, 8);
        const body = new THREE.Mesh(bodyGeo, shellMaterial);
        body.rotation.x = Math.PI / 2;
        lobsterGroup.add(body);

        // Tail segments
        const tailGroup = new THREE.Group(); tailGroup.position.z = 1.5; lobsterGroup.add(tailGroup);
        for(let i=0; i<5; i++) {
            const segGeo = new THREE.CylinderGeometry(0.7 - i*0.1, 0.6 - i*0.1, 0.6, 8);
            const seg = new THREE.Mesh(segGeo, shellMaterial);
            seg.rotation.x = Math.PI / 2; seg.position.z = i * 0.5; seg.rotation.x += i * 0.1;
            tailGroup.add(seg);
        }
        
        // Tail Fan
        const fanGeo = new THREE.CylinderGeometry(0.8, 0.2, 0.1, 8, 1, false, 0, Math.PI);
        const fan = new THREE.Mesh(fanGeo, shellMaterial);
        fan.position.z = 2.5; fan.rotation.x = -Math.PI / 4;
        tailGroup.add(fan);

        // Head/Carapace
        const headGeo = new THREE.ConeGeometry(0.9, 2, 8);
        const head = new THREE.Mesh(headGeo, shellMaterial);
        head.rotation.x = -Math.PI / 2; head.position.z = -1.5;
        lobsterGroup.add(head);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat); leftEye.position.set(0.4, 0.5, -2.2); lobsterGroup.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat); rightEye.position.set(-0.4, 0.5, -2.2); lobsterGroup.add(rightEye);

        // Antennae
        function createAntenna(mirror) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(mirror * 0.2, 0.5, -2.5),
                new THREE.Vector3(mirror * 1.5, 2.0, -3.5),
                new THREE.Vector3(mirror * 2.0, 1.0, -5.0),
                new THREE.Vector3(mirror * 0.5, 3.0, -6.0)
            ]);
            const geo = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
            return new THREE.Mesh(geo, shellMaterial);
        }
        lobsterGroup.add(createAntenna(1)); lobsterGroup.add(createAntenna(-1));

        // Claws
        function createClaw(mirror) {
            const armGroup = new THREE.Group();
            const s1Geo = new THREE.CylinderGeometry(0.2, 0.3, 1.5);
            const s1 = new THREE.Mesh(s1Geo, shellMaterial);
            s1.position.set(mirror * 1.0, 0, -1.0); s1.rotation.z = mirror * -0.5; s1.rotation.x = Math.PI / 4;
            armGroup.add(s1);
            const clawGeo = new THREE.SphereGeometry(0.6, 16, 16); clawGeo.scale(1, 1.5, 0.5);
            const claw = new THREE.Mesh(clawGeo, shellMaterial);
            claw.position.set(mirror * 1.8, 0, -2.0); claw.rotation.y = mirror * 0.5;
            armGroup.add(claw);
            const pincerGeo = new THREE.ConeGeometry(0.2, 1.0);
            const pincer = new THREE.Mesh(pincerGeo, shellMaterial);
            pincer.position.set(mirror * 2.0, 0, -2.5); pincer.rotation.z = mirror * -0.5;
            armGroup.add(pincer);
            return armGroup;
        }
        lobsterGroup.add(createClaw(1)); lobsterGroup.add(createClaw(-1));

        // Legs
        for(let i=0; i<4; i++) {
            const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
            const leftLeg = new THREE.Mesh(legGeo, shellMaterial);
            leftLeg.position.set(1.5, -0.5, i * 0.5 - 0.5); leftLeg.rotation.z = Math.PI / 3; leftLeg.rotation.x = -0.2;
            lobsterGroup.add(leftLeg);
            const rightLeg = new THREE.Mesh(legGeo, shellMaterial);
            rightLeg.position.set(-1.5, -0.5, i * 0.5 - 0.5); rightLeg.rotation.z = -Math.PI / 3; rightLeg.rotation.x = -0.2;
            lobsterGroup.add(rightLeg);
        }

        // --- COMPOSER ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85); // V1 bloom settings
        composer.addPass(bloomPass);
        
        const afterimagePass = new AfterimagePass();
        afterimagePass.uniforms['damp'].value = 0.9;
        composer.addPass(afterimagePass);

        // --- CONTROLS ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 2.0;
        controls.maxDistance = 30.0;
        controls.enablePan = true;

        let frame = 0;
        
        // Fade out flash overlay
        setTimeout(() => {
            document.getElementById('flash-overlay').style.opacity = 0;
            // Try auto-init (might fail without interaction)
            try { initAudio(); } catch(e){}
        }, 100);

        // --- RENDER LOOP ---
        function animate() {
            requestAnimationFrame(animate);
            frame++;
            
            lobsterGroup.position.y = Math.sin(frame * 0.01) * 0.2; 
            lobsterGroup.rotation.x = Math.sin(frame * 0.005) * 0.1;
            lobsterGroup.rotation.z = Math.cos(frame * 0.003) * 0.05;
            
            tailGroup.rotation.x = Math.sin(frame * 0.05) * 0.05; 
            
            particles.rotation.y = frame * 0.001; 
            
            geoShapes.forEach(item => {
                item.mesh.rotation.x += item.speed;
                item.mesh.rotation.y += item.speed;
                item.mesh.position.y += Math.sin(frame*0.01 + item.mesh.position.x) * 0.005;
            });

            pointLight.intensity = 5 + Math.sin(frame * 0.05) * 2;
            
            controls.update();
            composer.render();
        }
        animate();

        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
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
                backgroundColor: '#050a14', 
                borderRadius: '0.75rem'
            }}
            title="Lucid Lobster View"
        />
    );
};
