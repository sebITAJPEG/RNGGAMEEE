import React, { useMemo } from 'react';

export const NightmareEelView = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nightmare Eel</title>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000000; font-family: 'Share Tech Mono', monospace; }
        canvas { display: block; position: absolute; top: 0; left: 0; z-index: 1; filter: contrast(1.1) brightness(0.9); }

        /* --- HUD --- */
        #hud {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            opacity: 1;
            transition: opacity 3s ease-in;
            z-index: 50;
            box-sizing: border-box;
        }
        
        .header { 
            max-width: 500px;
            background: rgba(0, 0, 0, 0.8);
            border-left: 2px solid #ef4444;
            padding: 25px;
            backdrop-filter: blur(5px);
            pointer-events: auto;
        }
        
        .header h1 {
            margin: 0; font-size: 2.5rem;
            color: #f87171;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        
        .rarity {
            font-size: 0.9rem; color: #ef4444; letter-spacing: 3px; margin-top: 5px; 
            text-transform: uppercase; font-weight: 700;
            display: flex; align-items: center; gap: 10px;
        }
        
        .description {
            margin-top: 15px; font-size: 0.95rem; color: #d1d5db; line-height: 1.6;
            padding-top: 15px;
            border-top: 1px solid #333;
        }

        .stats-panel { 
            text-align: right; 
            background: rgba(0, 0, 0, 0.8);
            border-right: 2px solid #ef4444;
            padding: 20px;
            display: inline-block;
            align-self: flex-end;
            pointer-events: auto;
            min-width: 300px;
        }
        
        .stat-row { margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .stat-label { font-size: 0.8rem; color: #9ca3af; letter-spacing: 1px; text-transform: uppercase; }
        .stat-value { font-size: 1rem; color: #f87171; font-weight: bold; }

        #mute-btn {
            position: absolute;
            right: 20px;
            top: 20px;
            background: transparent;
            border: 1px solid #555;
            color: #555;
            padding: 10px 15px;
            font-family: 'Share Tech Mono', monospace;
            cursor: pointer;
            z-index: 200;
            pointer-events: auto;
            transition: all 0.2s;
        }
        #mute-btn:hover { border-color: #fff; color: #fff; }
        
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
    <button id="mute-btn">MUTE AUDIO</button>
    
    <div id="hud">
        <div class="header">
            <h1>NIGHTMARE EEL</h1>
            <div class="rarity">1 in 3.5B // PARALYSIS ENTITY</div>
            <div class="description">
                "It slithers through the cracks of your mind."<br><br>
                A manifestation of sleep paralysis. It binds you in place, watching from the darkness.
                Its gaze induces pure dread. You cannot scream. You cannot wake up.
            </div>
        </div>
        <div class="stats-panel">
            <div class="stat-row">
                <span class="stat-label">Subject Status</span>
                <span class="stat-value">PARALYZED</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Sanity</span>
                <span class="stat-value" style="color: #4b5563;">CRITICAL</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Origin</span>
                <span class="stat-value">THE VOID</span>
            </div>
        </div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
        import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';

        // --- AUDIO ENGINE ---
        let droneSynth, deepBass, clickSynth;
        let isAudioInit = false;
        let isMuted = false;

        async function initAudio() {
            if (isAudioInit) return;
            await Tone.start();
            
            const reverb = new Tone.Reverb(20).toDestination();
            reverb.wet.value = 0.5;

            // Deep, unsettling drone
            droneSynth = new Tone.Oscillator(50, "sawtooth").connect(new Tone.Filter(200, "lowpass")).connect(reverb);
            droneSynth.volume.value = -20;
            
            // Sub-bass pulse
            deepBass = new Tone.MembraneSynth({
                pitchDecay: 0.1, octaves: 2, oscillator: { type: "sine" }
            }).connect(reverb);
            
            // Computer click
            clickSynth = new Tone.MembraneSynth({
                pitchDecay: 0.01, octaves: 2, envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
            }).toDestination();
            clickSynth.volume.value = -10;

            isAudioInit = true;
            document.getElementById('audio-hint').style.opacity = 0;
            setTimeout(() => document.getElementById('audio-hint').style.display = 'none', 500);
            
            droneSynth.start();
            setInterval(() => {
                if(!isMuted) deepBass.triggerAttackRelease("C1", "8n");
            }, 1500);
        }

        function playClick() {
            if(isAudioInit && !isMuted) clickSynth.triggerAttackRelease("C6", "32n");
        }
        
        document.getElementById('audio-hint').addEventListener('click', initAudio);
        
        document.getElementById('mute-btn').addEventListener('click', () => {
            isMuted = !isMuted;
            const btn = document.getElementById('mute-btn');
            btn.innerText = isMuted ? "UNMUTE AUDIO" : "MUTE AUDIO";
            if(isAudioInit) Tone.Destination.mute = isMuted;
        });

        // --- THREE JS SETUP ---
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 3, 10);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable AA for better model look
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // --- EEL MODEL ---
        const eelGroup = new THREE.Group();
        scene.add(eelGroup);

        const segmentMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444, 
            emissive: 0x220000, 
            emissiveIntensity: 0.4,
            roughness: 0.3,
            metalness: 0.7,
        });
        
        const plateMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.8,
            metalness: 0.8 // More metallic
        });
        
        const spikeMaterial = new THREE.MeshStandardMaterial({
            color: 0x220000,
            emissive: 0x550000,
            roughness: 0.5,
            metalness: 0.5
        });
        
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const neonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.8 }); // New Neon

        const segments = 60;
        const eelSegments = [];
        
        for (let i = 0; i < segments; i++) {
            let size = 0.8;
            if (i < 10) size = 0.4 + (i * 0.04);
            if (i > 45) size = 0.8 - ((i - 45) * 0.05);
            size = Math.max(0.1, size);

            // Body Segment
            const geometry = new THREE.CylinderGeometry(size, size * 0.95, 0.4, 16);
            geometry.rotateX(Math.PI / 2); 
            
            const mesh = new THREE.Mesh(geometry, segmentMaterial);
            mesh.position.z = -i * 0.35;
            
            // Armor Plates (More Techy)
            if (i % 2 === 0) {
                const plateGeo = new THREE.CylinderGeometry(size * 1.05, size * 1.02, 0.3, 6, 1, true); // Hexagonal plates
                plateGeo.rotateX(Math.PI / 2);
                const plate = new THREE.Mesh(plateGeo, plateMaterial);
                mesh.add(plate);
            }
            
            // Neon Rings (Every 5th)
            if (i % 5 === 0 && i < 55) {
                const ringGeo = new THREE.TorusGeometry(size * 1.1, 0.02, 8, 32);
                const ring = new THREE.Mesh(ringGeo, neonMaterial);
                ring.rotation.x = Math.PI / 2; // Flat against body
                mesh.add(ring);
            }
            
            // Structural Ribs (Every segment that is NOT neon)
            if (i % 5 !== 0 && i < 55) {
                const ribGeo = new THREE.TorusGeometry(size * 1.02, 0.01, 4, 16);
                const rib = new THREE.Mesh(ribGeo, plateMaterial);
                rib.rotation.x = Math.PI / 2;
                mesh.add(rib);
            }
            
            // Cybernetic Spine Cable
            if (i < 55) {
                const spineGeo = new THREE.BoxGeometry(0.2, 0.2, 0.5);
                const spine = new THREE.Mesh(spineGeo, spikeMaterial);
                spine.position.y = size * 0.9;
                mesh.add(spine);
            }
            
            // Bioluminescent dots
            if (i % 4 === 0 && i > 5 && i < 55) {
                const dotGeo = new THREE.BoxGeometry(0.1, 0.05, 0.05);
                const leftDot = new THREE.Mesh(dotGeo, glowMaterial);
                leftDot.position.set(size, 0, 0);
                mesh.add(leftDot);
                
                const rightDot = new THREE.Mesh(dotGeo, glowMaterial);
                rightDot.position.set(-size, 0, 0);
                mesh.add(rightDot);
            }
            
            // Pectoral Fins (near head)
            if (i === 8) {
                const finGeo = new THREE.BoxGeometry(0.1, 1.5, 0.8);
                const leftFin = new THREE.Mesh(finGeo, segmentMaterial);
                leftFin.position.set(size + 0.5, -0.2, 0.2);
                leftFin.rotation.z = -Math.PI / 4;
                leftFin.rotation.y = 0.5;
                mesh.add(leftFin);
                
                const rightFin = new THREE.Mesh(finGeo, segmentMaterial);
                rightFin.position.set(-(size + 0.5), -0.2, 0.2);
                rightFin.rotation.z = Math.PI / 4;
                rightFin.rotation.y = -0.5;
                mesh.add(rightFin);
            }

            eelGroup.add(mesh);
            eelSegments.push({ mesh, baseZ: -i * 0.35, index: i });
            
            // HEAD DETAIL
            if (i === 0) {
                // Main Skull
                const skullGeo = new THREE.BoxGeometry(0.7, 0.5, 0.9);
                const skull = new THREE.Mesh(skullGeo, plateMaterial);
                skull.position.z = 0.2;
                mesh.add(skull);
                
                // Cheek Plates
                const cheekGeo = new THREE.BoxGeometry(0.2, 0.4, 0.6);
                const leftCheek = new THREE.Mesh(cheekGeo, segmentMaterial);
                leftCheek.position.set(0.4, -0.1, 0.2);
                leftCheek.rotation.y = -0.2;
                mesh.add(leftCheek);
                const rightCheek = new THREE.Mesh(cheekGeo, segmentMaterial);
                rightCheek.position.set(-0.4, -0.1, 0.2);
                rightCheek.rotation.y = 0.2;
                mesh.add(rightCheek);

                // Jaw (Mandibles)
                const mandibleGeo = new THREE.ConeGeometry(0.1, 0.8, 4);
                
                const leftMandible = new THREE.Mesh(mandibleGeo, spikeMaterial);
                leftMandible.position.set(0.3, -0.4, 0.8);
                leftMandible.rotation.x = Math.PI / 2;
                leftMandible.rotation.z = -0.2;
                mesh.add(leftMandible);
                
                const rightMandible = new THREE.Mesh(mandibleGeo, spikeMaterial);
                rightMandible.position.set(-0.3, -0.4, 0.8);
                rightMandible.rotation.x = Math.PI / 2;
                rightMandible.rotation.z = 0.2;
                mesh.add(rightMandible);
                
                // Tech Eyes (Multiple)
                const eyeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
                eyeGeo.rotateX(Math.PI/2);
                const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                
                // Main Eyes
                const leftEye = new THREE.Mesh(eyeGeo, eyeMat); leftEye.position.set(0.35, 0.1, 0.5); mesh.add(leftEye);
                const rightEye = new THREE.Mesh(eyeGeo, eyeMat); rightEye.position.set(-0.35, 0.1, 0.5); mesh.add(rightEye);
                
                // Head Light
                const light = new THREE.PointLight(0xff0000, 3, 10);
                light.position.z = 1;
                mesh.add(light);
            }
        }
        
        // --- SENSORY TENDRILS (EPIC UPGRADE V2) ---
        const tendrils = [];
        const head = eelSegments[0].mesh;
        const tendrilCount = 8;
        const tendrilLen = 40; // Even Longer
        
        for(let t=0; t<tendrilCount; t++) {
            const tendrilSegments = [];
            const root = new THREE.Group();
            
            // Position around head mouth
            const angle = (t / tendrilCount) * Math.PI * 2;
            const radius = 0.4;
            // Point forward (Z+) and spread out
            root.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0.8);
            
            // Use lookAt to point forward-ish
            const target = new THREE.Vector3(Math.cos(angle)*radius*4, Math.sin(angle)*radius*4, 10); 
            root.lookAt(target);
            
            head.add(root);
            
            // Tapering segments
            const neonMat = new THREE.MeshBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.9 });
            
            for(let k=0; k<tendrilLen; k++) {
                const segSize = 0.06 * (1 - k/tendrilLen); 
                const segGeo = new THREE.CylinderGeometry(segSize, segSize, 0.2, 4);
                // Rotate cylinder to point along Z
                segGeo.rotateX(Math.PI/2);
                
                const seg = new THREE.Mesh(segGeo, neonMat);
                seg.position.z = 0.1; // Grow along Z
                
                const joint = new THREE.Group();
                joint.position.z = 0.2; 
                seg.add(joint);
                
                tendrilSegments.push({ mesh: seg, joint: joint, idx: k });
                
                // Glowing tip
                if(k === tendrilLen - 1) {
                    const tipGeo = new THREE.SphereGeometry(0.08, 8, 8);
                    const tip = new THREE.Mesh(tipGeo, new THREE.MeshBasicMaterial({ color: 0xffaaaa }));
                    tip.position.z = 0.1;
                    seg.add(tip);
                }
            }
            
            // Build hierarchy
            let currentParent = root;
            tendrilSegments.forEach(ts => {
                currentParent.add(ts.mesh);
                currentParent = ts.joint;
            });
            
            // Slower speed for "menacing" feel
            tendrils.push({ segments: tendrilSegments, offset: Math.random() * 10, speed: Math.random() * 1.5 + 0.5 });
        }

        // --- EYES IN THE DARK ---
        const bgEyesGroup = new THREE.Group();
        scene.add(bgEyesGroup);
        
        const bgEyeGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const bgEyeMat = new THREE.MeshBasicMaterial({ color: 0x555555 }); 
        
        for(let i=0; i<150; i++) { 
            const eye = new THREE.Mesh(bgEyeGeo, bgEyeMat);
            eye.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60 - 20
            );
            eye.userData = { 
                blinkSpeed: Math.random() * 0.05 + 0.01, 
                blinkOffset: Math.random() * 10 
            };
            bgEyesGroup.add(eye);
        }
        
        // --- AMBIENCE ---
        
        // Floating Glyphs
        const glyphGroup = new THREE.Group();
        scene.add(glyphGroup);
        const glyphGeo = new THREE.TorusGeometry(0.2, 0.02, 2, 4); // Diamond shapes
        const glyphMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); // RED GLYPHS
        
        for(let i=0; i<50; i++) { // MORE GLYPHS
            const glyph = new THREE.Mesh(glyphGeo, glyphMat);
            glyph.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*40);
            glyph.userData = { rotSpeed: Math.random() * 0.05 };
            glyphGroup.add(glyph);
        }
        
        // Digital Rain
        const rainGroup = new THREE.Group();
        scene.add(rainGroup);
        const rainGeo = new THREE.BoxGeometry(0.05, 1, 0.05);
        const rainMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        
        for(let i=0; i<200; i++) {
            const drop = new THREE.Mesh(rainGeo, rainMat);
            drop.position.set((Math.random()-0.5)*60, (Math.random()-0.5)*60, (Math.random()-0.5)*60);
            drop.userData = { speed: Math.random() * 0.5 + 0.1 };
            rainGroup.add(drop);
        }

        // Volumetric Light Beams
        const beamGeo = new THREE.ConeGeometry(2, 40, 32, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({ 
            color: 0xaa0000, 
            transparent: true, 
            opacity: 0.05, 
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        for(let i=0; i<5; i++) {
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.set((Math.random()-0.5)*40, 20, (Math.random()-0.5)*20);
            beam.rotation.x = -Math.PI / 2; 
            beam.rotation.z = (Math.random()-0.5) * 0.5;
            scene.add(beam);
        }

        // --- LIGHTING ---
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5); 
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 10);
        scene.add(dirLight);
        
        const redLight = new THREE.PointLight(0xff0000, 2, 40);
        redLight.position.set(0, -10, 5);
        scene.add(redLight);
        
        const camLight = new THREE.PointLight(0xffffff, 1, 30);
        camera.add(camLight);
        scene.add(camera);

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        const glitchPass = new GlitchPass();
        glitchPass.goWild = false;
        glitchPass.enabled = false;
        composer.addPass(glitchPass);
        
        const filmPass = new FilmPass(0.6, 0.1, 1024, false); 
        composer.addPass(filmPass);

        // --- CONTROLS ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.minDistance = 5;
        controls.maxDistance = 25;

        // --- RENDER LOOP ---
        let frame = 0;
        
        // Try auto-init (might fail without interaction)
        setTimeout(() => {
            try { initAudio(); } catch(e){}
        }, 500);

        function animate() {
            requestAnimationFrame(animate);
            frame++;
            const time = frame * 0.01;
            
            // Slow, heavy eel movement
            eelSegments.forEach((seg, i) => {
                const waveX = Math.sin(time + i * 0.1) * 2;
                const waveY = Math.cos(time * 0.5 + i * 0.1) * 0.5;
                
                seg.mesh.position.x = waveX;
                seg.mesh.position.y = waveY;
                seg.mesh.position.z = seg.baseZ + Math.sin(time * 0.2) * 1;
                
                // Rotate each segment slightly to follow the curve
                seg.mesh.rotation.z = Math.sin(time * 0.5 + i * 0.05) * 0.2;
                
                // Pulse Emissive
                seg.mesh.material.emissiveIntensity = 0.4 + Math.sin(time * 2 + i * 0.1) * 0.2;
            });
            
            // SWIGGLE SWIGGLE
            tendrils.forEach((t) => {
                t.segments.forEach((seg, k) => {
                    // Apply sine wave rotation to each joint for chain wave effect
                    seg.mesh.rotation.x = Math.sin(time * t.speed + t.offset + k * 0.5) * 0.4; 
                    // Secondary wave for more complexity
                    seg.mesh.rotation.y = Math.cos(time * t.speed * 0.5 + t.offset) * 0.1;
                });
            });
            
            bgEyesGroup.children.forEach(eye => {
                eye.lookAt(camera.position);
                const blink = Math.sin(time * eye.userData.blinkSpeed + eye.userData.blinkOffset);
                eye.visible = blink > -0.8; 
            });
            
            glyphGroup.children.forEach(g => {
                g.rotation.x += g.userData.rotSpeed;
                g.rotation.y += g.userData.rotSpeed;
            });
            
            rainGroup.children.forEach(d => {
                d.position.y -= d.userData.speed;
                if(d.position.y < -30) d.position.y = 30;
            });
            
            if (Math.random() > 0.995) {
                glitchPass.enabled = true;
                setTimeout(() => glitchPass.enabled = false, 200);
            }
            
            controls.update();
            composer.render();
        }
        
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
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
                backgroundColor: '#000000', 
                borderRadius: '0.75rem'
            }}
            title="Nightmare Eel View"
        />
    );
};
