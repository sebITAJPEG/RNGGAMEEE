import React, { useEffect, useMemo } from 'react';

interface Props {
    onComplete: () => void;
}

export const TheSpectrumCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'THE_SPECTRUM_CUTSCENE_COMPLETE') {
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
    <title>The Spectrum</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Cinzel', serif; }
        
        #canvas-container {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 0;
        }

        #ui-layer {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }

        .phrase {
            color: #e0e0e0;
            font-size: 2.2rem;
            text-align: center;
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: opacity 2s cubic-bezier(0.2, 0.8, 0.2, 1), transform 2s cubic-bezier(0.2, 0.8, 0.2, 1);
            text-shadow: 0 0 20px rgba(0,0,0,0.8);
            max-width: 80%;
            line-height: 1.6;
            letter-spacing: 0.05em;
        }
        
        .phrase.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .phrase.fade-out {
            opacity: 0;
            transform: translateY(-20px);
            filter: blur(8px);
            transition: opacity 1.5s ease, transform 1.5s ease, filter 1.5s ease;
        }

        .highlight {
            color: #ffd700;
            font-style: italic;
            font-family: 'Playfair Display', serif;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            position: relative;
            display: inline-block;
        }
        
        .highlight::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(120deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%);
            background-size: 200% 100%;
            background-position: 100% 0;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: shine 4s infinite;
        }

        @keyframes shine {
            0% { background-position: 100% 0; }
            20% { background-position: 0% 0; }
            100% { background-position: 0% 0; }
        }

        .rainbow-text {
            background: linear-gradient(to right, #ff9999, #ffcc99, #ffff99, #99ff99, #99ffff, #9999ff, #cc99ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 700;
            font-size: 1.3em;
            filter: drop-shadow(0 0 15px rgba(255,255,255,0.4));
            animation: shimmer 5s infinite linear;
            background-size: 300% auto;
        }

        @keyframes shimmer {
            0% { background-position: 0% center; }
            100% { background-position: 300% center; }
        }

        #final-title {
            font-size: 6rem;
            font-weight: 700;
            letter-spacing: 0.8rem;
            opacity: 0;
            transform: scale(0.9);
            transition: all 3s cubic-bezier(0.2, 0.8, 0.2, 1);
            background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter: drop-shadow(0 0 40px rgba(255,255,255,0.3));
            animation: rainbow-flow 8s linear infinite;
            background-size: 400% 100%;
        }

        @keyframes rainbow-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        #final-title.visible {
            opacity: 1;
            transform: scale(1);
        }

        #flash {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: white;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 2.5s ease-in-out;
            mix-blend-mode: overlay;
        }
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "tone": "https://cdn.jsdelivr.net/npm/tone@14.7.77/+esm"
            }
        }
    </script>
</head>
<body>
    <div id="canvas-container"></div>
    <div id="ui-layer">
        <div id="text-container" class="phrase"></div>
    </div>
    <div id="flash"></div>

    <script type="module">
        import * as THREE from 'three';
        import * as Tone from 'tone';

        // --- AUDIO (ELEGANT & SPATIAL) ---
        class ElegantAudio {
            constructor() {
                this.initialized = false;
            }

            async init() {
                if (this.initialized) return;
                await Tone.start();
                this.initialized = true;

                this.reverb = new Tone.Reverb({ decay: 12, wet: 0.7 }).toDestination();
                this.delay = new Tone.PingPongDelay("4n", 0.3).connect(this.reverb);

                // 1. Choir / Pad (Rich, Stereo)
                this.pad = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: "fatcustom", partials: [0.5, 1, 0.5, 0.2], spread: 30, count: 3 },
                    envelope: { attack: 2, decay: 3, sustain: 0.8, release: 5 }
                }).connect(this.reverb);
                this.pad.volume.value = -14;

                // 2. Glass Chimes (Spatial)
                this.chimes = new Tone.PolySynth(Tone.FMSynth, {
                    harmonicity: 3.01,
                    modulationIndex: 10,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.01, decay: 2, sustain: 0, release: 2 },
                    modulation: { type: "square" },
                    modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.5 }
                });
                this.chimePanner = new Tone.Panner3D({ panningModel: 'HRTF' }).connect(this.delay);
                this.chimes.connect(this.chimePanner);
                this.chimes.volume.value = -12;

                // 3. Deep Bass Swell
                this.bass = new Tone.Synth({
                    oscillator: { type: "sine" },
                    envelope: { attack: 4, decay: 2, sustain: 1, release: 6 }
                }).connect(this.reverb);
                this.bass.volume.value = -6;
                
                // 4. Wind/Texture
                this.noise = new Tone.Noise("pink").connect(new Tone.Filter(200, "lowpass").connect(this.reverb));
                this.noise.volume.value = -25;
                this.noise.start();
            }

            playChord(notes) {
                if(!this.initialized) return;
                this.pad.triggerAttackRelease(notes, "2n");
            }

            playChime(note, pan = 0) {
                if(!this.initialized) return;
                this.chimePanner.positionX.rampTo(pan, 0.1);
                this.chimes.triggerAttackRelease(note, "8n");
            }

            playSwell() {
                if(!this.initialized) return;
                this.bass.triggerAttackRelease("C1", "2n");
            }

            playFinale() {
                if(!this.initialized) return;
                const now = Tone.now();
                const notes = ["C4", "E4", "G4", "B4", "C5", "E5", "G5", "B5", "C6"];
                notes.forEach((n, i) => {
                    const pan = Math.sin(i);
                    this.chimePanner.positionX.setValueAtTime(pan * 2, now + i * 0.15);
                    this.chimes.triggerAttackRelease(n, "8n", now + i * 0.15);
                });
                this.pad.triggerAttackRelease(["C3", "G3", "C4", "E4", "G4", "B4", "C5"], "1n", now);
                this.bass.triggerAttackRelease("C1", "1n", now);
            }
        }
        const audio = new ElegantAudio();

        // --- VISUALS (ENHANCED SHADER) ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        const uniforms = {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(0x000000) }, 
            uColor2: { value: new THREE.Color(0x0f0518) }, // Darker purple
            uColor3: { value: new THREE.Color(0x002233) }, // Deep teal
            uMouse: { value: new THREE.Vector2(0,0) }
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: \`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float uTime;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform vec3 uColor3;
                varying vec2 vUv;

                // FBM Noise
                float rand(vec2 n) { 
                    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
                }
                float noise(vec2 p){
                    vec2 ip = floor(p);
                    vec2 u = fract(p);
                    u = u*u*(3.0-2.0*u);
                    float res = mix(
                        mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
                        mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
                    return res*res;
                }
                float fbm(vec2 x) {
                    float v = 0.0;
                    float a = 0.5;
                    vec2 shift = vec2(100.0);
                    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
                    for (int i = 0; i < 5; ++i) {
                        v += a * noise(x);
                        x = rot * x * 2.0 + shift;
                        a *= 0.5;
                    }
                    return v;
                }

                void main() {
                    vec2 uv = vUv;
                    float time = uTime * 0.05;
                    
                    // Domain Warping
                    vec2 q = vec2(0.);
                    q.x = fbm( uv + 0.00*time );
                    q.y = fbm( uv + vec2(1.0));

                    vec2 r = vec2(0.);
                    r.x = fbm( uv + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
                    r.y = fbm( uv + 1.0*q + vec2(8.3,2.8)+ 0.126*time);

                    float f = fbm(uv+r);

                    vec3 color = mix(uColor1, uColor2, clamp((f*f)*4.0,0.0,1.0));
                    color = mix(color, uColor3, clamp(length(q),0.0,1.0));
                    color = mix(color, vec3(0.1,0.4,0.6), clamp(length(r.x),0.0,1.0));

                    // Subtle Stars
                    float stars = pow(rand(uv * 20.0), 50.0) * (0.5 + 0.5 * sin(uTime * 2.0 + uv.x * 100.0));
                    
                    gl_FragColor = vec4(color + stars, 1.0);
                }
            \`
        });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // --- STARDUST PARTICLES ---
        const particleCount = 1000;
        const posArray = new Float32Array(particleCount * 3);
        const sizesArray = new Float32Array(particleCount);
        
        for(let i=0; i<particleCount; i++) {
            posArray[i*3] = (Math.random() - 0.5) * 5;
            posArray[i*3+1] = (Math.random() - 0.5) * 5;
            posArray[i*3+2] = (Math.random() - 0.5) * 2 + 0.5; // Slight depth
            sizesArray[i] = Math.random();
        }
        
        const starsGeo = new THREE.BufferGeometry();
        starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        starsGeo.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));
        
        const starsMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: \`
                attribute float size;
                varying float vAlpha;
                uniform float uTime;
                void main() {
                    vec3 pos = position;
                    pos.y += sin(uTime * 0.1 + pos.x) * 0.1; 
                    vAlpha = 0.5 + 0.5 * sin(uTime * 2.0 + size * 10.0);
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * 40.0 / -mvPosition.z;
                    gl_Position = projectionMatrix * mvPosition;
                }
            \`,
            fragmentShader: \`
                varying float vAlpha;
                void main() {
                    float d = distance(gl_PointCoord, vec2(0.5));
                    if(d > 0.5) discard;
                    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.5);
                }
            \`,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const stars = new THREE.Points(starsGeo, starsMat);
        scene.add(stars);

        // --- SEQUENCE ---
        const textContainer = document.getElementById('text-container');
        const phrases = [
            { text: "Beneath a billion tonnes of stone...", chord: ["C3", "G3", "C4"] },
            { text: "A legend <span class='highlight'>sleeps</span>.", chord: ["F3", "A3", "C4"] },
            { text: "The air hums with arcane energy.", chord: ["G3", "B3", "D4"] },
            { text: "Pure light, fractured by time.", chord: ["E3", "G3", "B3"] },
            { text: "Behold the <span class='rainbow-text'>infinite</span>...", chord: ["C3", "E3", "G3", "C4", "E4"] }
        ];

        async function playSequence() {
            try { await audio.init(); } catch(e){}
            
            // Initial silence/fade in
            await new Promise(r => setTimeout(r, 1000));
            audio.playSwell();

            for (let i = 0; i < phrases.length; i++) {
                const p = phrases[i];
                textContainer.innerHTML = p.text;
                textContainer.className = 'phrase visible';
                
                audio.playChord(p.chord);
                if (i % 2 === 0) audio.playChime("C6", Math.random()*2-1);
                
                await new Promise(r => setTimeout(r, 3500)); // Read time
                
                textContainer.className = 'phrase fade-out';
                await new Promise(r => setTimeout(r, 1500)); // Fade out time
            }

            // Final Reveal
            await new Promise(r => setTimeout(r, 500));
            textContainer.innerHTML = "<div id='final-title'>THE SPECTRUM</div>";
            textContainer.className = 'phrase visible';
            requestAnimationFrame(() => document.getElementById('final-title').classList.add('visible'));
            
            audio.playFinale();
            
            // Animate background faster
            const flash = document.getElementById('flash');
            
            await new Promise(r => setTimeout(r, 4000));
            
            flash.style.opacity = 1;
            
            await new Promise(r => setTimeout(r, 3000));
            window.parent.postMessage('THE_SPECTRUM_CUTSCENE_COMPLETE', '*');
        }

        // Animation Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            uniforms.uTime.value = t;
            starsMat.uniforms.uTime.value = t;
            renderer.render(scene, camera);
        }
        animate();

        // Start
        setTimeout(playSequence, 100);
        window.addEventListener('click', () => audio.init());
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
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
            title="The Spectrum Cutscene"
        />
    );
};
