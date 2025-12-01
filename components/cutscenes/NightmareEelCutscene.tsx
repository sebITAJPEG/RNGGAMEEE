import React, { useEffect, useMemo } from 'react';

interface Props {
    onComplete: () => void;
}

export const NightmareEelCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'NIGHTMARE_EEL_CUTSCENE_COMPLETE') {
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
    <title>SYSTEM ERROR</title>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'VT323', monospace; cursor: none; }
        canvas { display: block; }
        
        /* --- BSOD --- */
        #bsod {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #0000aa;
            color: #ffffff;
            padding: 50px;
            box-sizing: border-box;
            z-index: 200;
            display: none;
            font-size: 24px;
            line-height: 1.5;
            font-family: 'Lucida Console', Monaco, monospace; /* Classic font */
        }
        
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        /* --- BIOS --- */
        #bios {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: #000;
            color: #ccc;
            padding: 50px;
            box-sizing: border-box;
            z-index: 201;
            display: none;
            font-size: 20px;
        }
        
        #bios-logo {
            color: #ff0000;
            font-size: 40px;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 2px 2px #550000;
        }

        /* --- GLITCH OVERLAY --- */
        #glitch-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: transparent;
            z-index: 100;
            pointer-events: none;
            display: none;
            mix-blend-mode: difference;
        }
        
        .glitch-block {
            position: absolute;
            background: white;
        }

    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",
                "tone": "https://cdn.jsdelivr.net/npm/tone@14.7.77/+esm"
            }
        }
    </script>
</head>
<body>
    <div id="bsod">
        <p>A problem has been detected and Windows has been shut down to prevent damage to your computer.</p>
        <br>
        <p>EEL_OOM_ERROR</p>
        <br>
        <p>If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
        <p>Check to be sure you have adequate disk space. If a driver is identified in the Stop message, disable the driver or check with the manufacturer for driver updates. Try changing video adapters.</p>
        <p>Check with your hardware vendor for any BIOS updates. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode.</p>
        <br>
        <p>Technical information:</p>
        <p>*** STOP: 0x0000001E (0xC0000005, 0xF7483921, 0x00000000, 0x00000000)</p>
        <p>*** nightmare.sys - Address F7483921 base at F7483000, DateStamp 432523</p>
        <br>
        <p>Beginning dump of physical memory</p>
        <p>Physical memory dump complete.</p>
        <p>Contact your system administrator or technical support group for further assistance.</p>
    </div>

    <div id="bios">
        <div id="bios-logo">NIGHTMARE BIOS (c) 2025</div>
        <p>Main Processor : EEL-9000 @ 666 MHz</p>
        <p>Memory Testing : <span id="mem-test">0</span> OK</p>
        <br>
        <div id="bios-lines"></div>
    </div>

    <div id="glitch-layer"></div>

    <script type="module">
        import * as THREE from 'three';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
        import * as Tone from 'tone';

        // --- AUDIO ENGINE ---
        class CrashAudio {
            constructor() {
                this.initialized = false;
            }

            async init() {
                if (this.initialized) return;
                await Tone.start();
                this.initialized = true;

                // 1. BSOD Buzz
                this.buzz = new Tone.Oscillator(100, "sawtooth").toDestination();
                this.buzz.volume.value = -5;

                // 2. Glitch Noise
                this.noise = new Tone.Noise("white").connect(new Tone.BitCrusher(2).toDestination());
                this.noise.volume.value = -10;

                // 3. Hard Drive Clicks
                this.click = new Tone.MembraneSynth({
                    pitchDecay: 0.01, octaves: 1, envelope: { attack: 0.001, decay: 0.01, sustain: 0 }
                }).toDestination();
                this.click.volume.value = -5;

                // 4. Beep (BIOS)
                this.beep = new Tone.Oscillator(1000, "square").toDestination();
                this.beep.volume.value = -10;
                
                // 5. Deep Drone (Pre-crash)
                this.drone = new Tone.Oscillator(60, "sine").toDestination();
                this.drone.volume.value = -15;
            }

            playDrone() {
                if(!this.initialized) return;
                this.drone.start();
            }

            playGlitch() {
                if(!this.initialized) return;
                this.noise.start();
                this.noise.stop("+0.1");
            }

            playBuzz() {
                if(!this.initialized) return;
                this.buzz.start();
            }
            
            stopBuzz() {
                if(!this.initialized) return;
                this.buzz.stop();
            }

            playClick() {
                if(!this.initialized) return;
                this.click.triggerAttackRelease("C1", "32n");
            }

            playBeep() {
                if(!this.initialized) return;
                this.beep.start();
                this.beep.stop("+0.2");
            }

            stopAll() {
                if(!this.initialized) return;
                this.drone.stop();
                this.buzz.stop();
                this.noise.stop();
            }
        }
        const audio = new CrashAudio();

        // --- SCENE SETUP (Brief 3D Intro) ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Simple wireframe eel
        const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const eel = new THREE.Mesh(geometry, material);
        scene.add(eel);

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const glitchPass = new GlitchPass();
        composer.addPass(glitchPass);

        // --- SEQUENCE ---
        const bsod = document.getElementById('bsod');
        const bios = document.getElementById('bios');
        const biosLines = document.getElementById('bios-lines');
        const memTest = document.getElementById('mem-test');
        const glitchLayer = document.getElementById('glitch-layer');

        const sequence = [
            { t: 0.5, action: () => {
                audio.init().then(() => audio.playDrone());
            }},
            { t: 2.0, action: () => {
                // Glitching starts
                glitchPass.goWild = true;
                audio.playGlitch();
                // Fake freezes
                const interval = setInterval(() => {
                    document.body.style.transform = \`translate(\${Math.random()*10}px, \${Math.random()*10}px)\`;
                    audio.playClick();
                }, 50);
                setTimeout(() => clearInterval(interval), 1000);
            }},
            { t: 3.0, action: () => {
                // CRASH
                audio.stopAll();
                audio.playBuzz();
                bsod.style.display = 'block';
                document.body.style.transform = 'none';
                renderer.domElement.style.display = 'none';
            }},
            { t: 6.0, action: () => {
                // REBOOT
                audio.stopBuzz();
                bsod.style.display = 'none';
                document.body.style.backgroundColor = 'black';
            }},
            { t: 7.0, action: () => {
                // BIOS POST
                bios.style.display = 'block';
                audio.playBeep();
                
                // Mem test animation
                let mem = 0;
                const memInt = setInterval(() => {
                    mem += 16384;
                    memTest.innerText = mem + " KB";
                    if(mem > 1048576) clearInterval(memInt);
                }, 20);
            }},
            { t: 8.0, action: () => {
                const lines = [
                    "Detecting Primary Master... Nightmare Eel (8TB)",
                    "Detecting Primary Slave... None",
                    "Booting from C:...",
                    "ERROR: SOUL NOT FOUND",
                    "Retrying...",
                    "SUCCESS."
                ];
                let i = 0;
                const typeInt = setInterval(() => {
                    if(i >= lines.length) {
                        clearInterval(typeInt);
                        return;
                    }
                    const p = document.createElement('p');
                    p.innerText = lines[i];
                    biosLines.appendChild(p);
                    audio.playClick();
                    i++;
                }, 500);
            }},
            { t: 12.0, action: () => {
                // FINISH
                window.parent.postMessage('NIGHTMARE_EEL_CUTSCENE_COMPLETE', '*');
            }}
        ];

        let seqIdx = 0;
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            if (seqIdx < sequence.length && elapsed >= sequence[seqIdx].t) {
                sequence[seqIdx].action();
                seqIdx++;
            }

            eel.rotation.x += 0.01;
            eel.rotation.y += 0.02;
            composer.render();
        }

        setTimeout(() => {
            animate();
            audio.init();
        }, 100);
        
        window.addEventListener('click', () => audio.init());
        window.addEventListener('resize', () => {
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
                backgroundColor: 'black',
                borderRadius: '0.75rem'
            }}
            title="Nightmare Eel Cutscene"
        />
    );
};
