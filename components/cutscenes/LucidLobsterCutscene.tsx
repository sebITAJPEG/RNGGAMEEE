import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const LucidLobsterCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'LUCID_LOBSTER_CUTSCENE_COMPLETE') {
                onComplete();
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [onComplete]);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lucid Lobster Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500;700&family=Comfortaa:wght@300;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
    <style>
        body { margin: 0; overflow: hidden; background-color: #050a14; font-family: 'Comfortaa', cursive; }
        canvas { display: block; position: absolute; top: 0; left: 0; z-index: 1; }

        /* --- UI --- */
        #intro-screen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5, 10, 20, 0.9);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            pointer-events: none;
        }

        #intro-text {
            font-family: 'Quicksand', sans-serif;
            font-size: 3.5rem;
            color: #b0c4de;
            text-align: center;
            letter-spacing: 2px;
            z-index: 101;
            text-shadow: 0 0 10px rgba(176, 196, 222, 0.5);
            min-height: 4rem;
        }
        
        .char {
            display: inline-block;
            opacity: 0;
            transform: scale(2);
            filter: blur(10px);
            transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .char.visible {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
        }

        .shake-screen {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-4px, 0, 0) rotate(-1deg); }
            20%, 80% { transform: translate3d(8px, 0, 0) rotate(2deg); }
            30%, 50%, 70% { transform: translate3d(-16px, 0, 0) rotate(-2deg); }
            40%, 60% { transform: translate3d(16px, 0, 0) rotate(1deg); }
        }

        #flash-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: white; pointer-events: none; z-index: 200; opacity: 0;
        }
        
        #click-to-start {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 300; display: flex; justify-content: center; align-items: center;
            background: rgba(0,0,0,0.5); color: white; font-size: 1.5rem; cursor: pointer;
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
    <div id="click-to-start">CLICK TO INITIALIZE</div>
    <div id="flash-overlay"></div>
    <div id="intro-screen">
        <div id="intro-text"></div>
    </div>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
        import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

        // --- AUDIO ENGINE (TONE.JS) ---
        let boomSynth, glitchSynth, riseSynth, typeSynth, reverb, delay;
        let isAudioInit = false;

        async function initAudio() {
            if (isAudioInit) return;
            await Tone.start();
            
            reverb = new Tone.Reverb(3).toDestination();
            reverb.wet.value = 0.5;
            
            delay = new Tone.PingPongDelay("8n", 0.2).connect(reverb);
            
            boomSynth = new Tone.MembraneSynth({
                pitchDecay: 0.05,
                octaves: 10,
                oscillator: { type: "sine" },
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: "exponential" }
            }).connect(reverb);
            
            glitchSynth = new Tone.NoiseSynth({
                noise: { type: "pink" },
                envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
            }).connect(new Tone.BitCrusher(4).toDestination());
            
            riseSynth = new Tone.MonoSynth({
                oscillator: { type: "sawtooth" },
                envelope: { attack: 0.1, decay: 0.1, sustain: 1, release: 1 },
                filterEnvelope: { attack: 3, decay: 0, sustain: 1, release: 0.5, baseFrequency: 200, octaves: 4 }
            }).toDestination();
            
            typeSynth = new Tone.MembraneSynth({
                pitchDecay: 0.01, octaves: 2, envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
            }).toDestination();
            
            isAudioInit = true;
            document.getElementById('click-to-start').style.display = 'none';
            runScript();
        }

        function playSound(type) {
            if (!isAudioInit) return;
            
            if (type === 'type') {
                typeSynth.triggerAttackRelease("C6", "32n");
            } else if (type === 'glitch') {
                glitchSynth.triggerAttackRelease("16n");
            } else if (type === 'boom') {
                boomSynth.triggerAttackRelease("C1", "1n");
            } else if (type === 'rise') {
                riseSynth.triggerAttackRelease("C2", "3m");
                riseSynth.frequency.rampTo("C5", 3);
            }
        }

        document.getElementById('click-to-start').addEventListener('click', initAudio);

        // --- THREE JS SETUP ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050a14, 0.03);
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // --- WARP TUNNEL ---
        const tunnelGeo = new THREE.CylinderGeometry(10, 2, 200, 32, 32, true);
        const tunnelMat = new THREE.MeshBasicMaterial({ 
            color: 0x4400ff, wireframe: true, transparent: true, opacity: 0.3, side: THREE.DoubleSide 
        });
        const tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
        tunnel.rotation.x = Math.PI / 2;
        scene.add(tunnel);

        // --- STARS ---
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 5000;
        const posArray = new Float32Array(starsCount * 3);
        for(let i=0; i<starsCount*3; i++) posArray[i] = (Math.random() - 0.5) * 400;
        starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const starsMat = new THREE.PointsMaterial({ size: 0.2, color: 0xffffff });
        const stars = new THREE.Points(starsGeo, starsMat);
        scene.add(stars);

        // --- BINARY RAIN ---
        const binaryGroup = new THREE.Group();
        scene.add(binaryGroup);
        const zeroGeo = new THREE.TorusGeometry(0.5, 0.1, 4, 8);
        const oneGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
        const binaryMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        const binaries = [];
        
        for(let i=0; i<100; i++) {
            const isZero = Math.random() > 0.5;
            const mesh = new THREE.Mesh(isZero ? zeroGeo : oneGeo, binaryMat);
            mesh.position.set((Math.random()-0.5)*50, (Math.random()-0.5)*50, Math.random()*200 - 100);
            mesh.userData = { speed: Math.random() * 2 + 1 };
            binaryGroup.add(mesh);
            binaries.push(mesh);
        }

        // --- COMPOSER ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        composer.addPass(bloomPass);
        
        const glitchPass = new GlitchPass();
        glitchPass.enabled = false;
        composer.addPass(glitchPass);

        // --- ANIMATION STATE ---
        let frame = 0;
        let speed = 20.0;

        // --- CUTSCENE SCRIPT ---
        const introText = document.getElementById('intro-text');
        const flashOverlay = document.getElementById('flash-overlay');
        const phrases = ["WAKE UP.", "THE SIMULATION IS BREAKING.", "AWARENESS DETECTED.", "PREPARE FOR ASCENSION.", "LUCID LOBSTER"];

        function scrambleText(element, finalString) {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
            let iterations = 0;
            const interval = setInterval(() => {
                element.innerText = finalString.split("").map((letter, index) => {
                    if(index < iterations) return finalString[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("");
                
                if(iterations >= finalString.length) clearInterval(interval);
                iterations += 1/2; 
            }, 30);
        }

        async function runScript() {
            playSound('rise');
            
            for(let i=0; i<phrases.length; i++) {
                introText.innerHTML = '';
                const p = phrases[i];
                
                const wrapper = document.createElement('span');
                introText.appendChild(wrapper);
                scrambleText(wrapper, p);
                
                for(let k=0; k<5; k++) setTimeout(() => playSound('type'), k*100);

                document.body.classList.add('shake-screen');
                setTimeout(() => document.body.classList.remove('shake-screen'), 200);
                
                tunnel.material.color.setHex(0xff00ff);
                setTimeout(() => tunnel.material.color.setHex(0x4400ff), 200);

                speed += 30; 
                
                if (i === phrases.length - 2) {
                    glitchPass.enabled = true;
                    playSound('glitch');
                }
                await new Promise(r => setTimeout(r, 1500));
                
                if (i < phrases.length - 1) {
                    introText.style.transform = "scale(1.5)";
                    introText.style.opacity = "0";
                    introText.style.filter = "blur(20px)";
                    introText.style.transition = "all 0.3s";
                    
                    await new Promise(r => setTimeout(r, 300));
                    introText.innerHTML = '';
                    introText.style.transform = "scale(1)";
                    introText.style.opacity = "1";
                    introText.style.filter = "none";
                    introText.style.transition = "none";
                }
            }
            
            // --- THE DROP ---
            flashOverlay.style.transition = 'opacity 0.1s';
            flashOverlay.style.opacity = 1;
            playSound('boom');
            
            setTimeout(() => {
                window.parent.postMessage('LUCID_LOBSTER_CUTSCENE_COMPLETE', '*');
            }, 500);
        }
        
        // --- RENDER LOOP ---
        function animate() {
            requestAnimationFrame(animate);
            frame++;
            
            tunnel.rotation.y += 0.05;
            tunnel.rotation.z += 0.01;
            tunnel.material.opacity = 0.3 + Math.sin(frame * 0.1) * 0.2;
            
            const positions = stars.geometry.attributes.position.array;
            for(let i=0; i<starsCount; i++) {
                positions[i*3 + 2] += speed;
                if(positions[i*3 + 2] > 200) positions[i*3 + 2] = -400;
            }
            stars.geometry.attributes.position.needsUpdate = true;
            
            binaries.forEach(b => {
                b.position.z += speed * 1.5 * b.userData.speed;
                if(b.position.z > 100) b.position.z = -200;
                b.rotation.x += 0.1;
                b.rotation.y += 0.1;
            });

            camera.position.x = (Math.random() - 0.5) * (speed * 0.01);
            camera.position.y = (Math.random() - 0.5) * (speed * 0.01);
            camera.rotation.z = Math.sin(frame * 0.05) * 0.1;
            
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
                backgroundColor: 'black',
                borderRadius: '0.75rem'
            }}
            title="Lucid Lobster Cutscene"
        />
    );
};
