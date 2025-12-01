import React, { useEffect, useMemo } from 'react';

interface Props {
    onComplete: () => void;
}

export const WakingLifeCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'WAKING_LIFE_CUTSCENE_COMPLETE') {
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
    <title>Waking Life</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #fff; font-family: 'Montserrat', sans-serif; }
        canvas { display: block; filter: blur(2px); transition: filter 5s ease; }
        
        #ui-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 10;
        }

        .phrase {
            color: #000;
            font-size: 2rem;
            font-weight: 100;
            letter-spacing: 0.5rem;
            opacity: 0;
            transition: opacity 2s ease-in-out;
        }
        
        .phrase.visible { opacity: 1; }

        #flash {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            opacity: 1;
            pointer-events: none;
            z-index: 100;
            transition: opacity 2s ease-out;
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
    <div id="ui-layer">
        <div id="text" class="phrase"></div>
    </div>
    <div id="flash"></div>

    <script type="module">
        import * as THREE from 'three';
        import * as Tone from 'tone';

        // --- AUDIO ENGINE ---
        class DreamAudio {
            constructor() {
                this.initialized = false;
            }

            async init() {
                if (this.initialized) return;
                await Tone.start();
                this.initialized = true;

                this.reverb = new Tone.Reverb({ decay: 10, wet: 1 }).toDestination();
                
                // 1. Ethereal Pad
                this.pad = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: "sine" },
                    envelope: { attack: 2, decay: 1, sustain: 1, release: 5 }
                }).connect(this.reverb);
                this.pad.volume.value = -15;

                // 2. Birds (Simulated with FM)
                this.bird = new Tone.Synth({
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
                }).toDestination();
                this.bird.volume.value = -20;

                // 3. Snap
                this.snap = new Tone.MembraneSynth({
                    pitchDecay: 0.01,
                    octaves: 4,
                    envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
                }).toDestination();
            }

            playPad() {
                if(!this.initialized) return;
                this.pad.triggerAttack(["C4", "E4", "G4", "B4"]);
            }

            playBird() {
                if(!this.initialized) return;
                const now = Tone.now();
                this.bird.triggerAttackRelease("C7", "32n", now);
                this.bird.triggerAttackRelease("E7", "32n", now + 0.1);
                this.bird.triggerAttackRelease("G7", "32n", now + 0.2);
            }

            playSnap() {
                if(!this.initialized) return;
                this.snap.triggerAttackRelease("C2", "32n");
            }
            
            stop() {
                if(!this.initialized) return;
                this.pad.releaseAll();
            }
        }
        const audio = new DreamAudio();

        // --- SCENE ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.FogExp2(0xffffff, 0.02);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Clouds
        const cloudGeo = new THREE.SphereGeometry(1, 32, 32);
        const cloudMat = new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.5 });
        const clouds = [];
        
        for(let i=0; i<50; i++) {
            const cloud = new THREE.Mesh(cloudGeo, cloudMat);
            cloud.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 50 - 20
            );
            cloud.scale.setScalar(Math.random() * 2 + 1);
            scene.add(cloud);
            clouds.push(cloud);
        }

        // --- SEQUENCE ---
        const text = document.getElementById('text');
        const flash = document.getElementById('flash');

        const sequence = [
            { t: 0.5, action: () => {
                flash.style.opacity = 0;
                audio.init().then(() => audio.playPad());
                text.innerText = "IS THIS REAL?";
                text.classList.add('visible');
            }},
            { t: 4.0, action: () => {
                text.classList.remove('visible');
                setTimeout(() => {
                    text.innerText = "OR IS IT JUST A DREAM?";
                    text.classList.add('visible');
                }, 2000);
            }},
            { t: 8.0, action: () => {
                text.classList.remove('visible');
                // Bird sounds
                setInterval(() => {
                    if(Math.random() > 0.7) audio.playBird();
                }, 500);
            }},
            { t: 10.0, action: () => {
                text.innerText = "WAKING LIFE";
                text.style.color = "black";
                text.style.fontWeight = "300";
                text.classList.add('visible');
                document.querySelector('canvas').style.filter = 'blur(0px)';
            }},
            { t: 13.0, action: () => {
                audio.playSnap();
                flash.style.opacity = 1; // White out
            }},
            { t: 14.0, action: () => {
                audio.stop();
                window.parent.postMessage('WAKING_LIFE_CUTSCENE_COMPLETE', '*');
            }}
        ];

        let seqIdx = 0;
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const dt = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            if (seqIdx < sequence.length && elapsed >= sequence[seqIdx].t) {
                sequence[seqIdx].action();
                seqIdx++;
            }

            // Camera movement
            camera.position.z -= dt * 0.5;
            camera.rotation.z = Math.sin(elapsed * 0.1) * 0.05;

            clouds.forEach(c => {
                c.rotation.y += dt * 0.1;
            });

            renderer.render(scene, camera);
        }

        setTimeout(() => {
            animate();
            audio.init();
        }, 100);

        window.addEventListener('click', () => audio.init());
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
            title="Waking Life Cutscene"
        />
    );
};
