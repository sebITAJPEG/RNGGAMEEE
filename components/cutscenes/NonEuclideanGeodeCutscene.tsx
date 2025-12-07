import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const NonEuclideanGeodeCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'GEODE_CUTSCENE_COMPLETE') {
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
    <title>Non-Euclidean Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@800&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Orbitron', sans-serif; }
        
        #canvas-bg {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1;
        }

        #scanlines {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 5;
            opacity: 0.3;
        }

        #vignette {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, transparent 50%, black 100%);
            z-index: 6;
            pointer-events: none;
        }

        .center-container {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
            width: 100%;
            text-align: center;
        }

        .glitch-text {
            color: #fff;
            font-size: 4rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff;
            opacity: 0;
            position: relative;
        }

        .glitch-text::before, .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background: #000;
        }

        .glitch-text::before {
            left: 2px;
            text-shadow: -1px 0 #ff00c1;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
        }

        .glitch-text::after {
            left: -2px;
            text-shadow: -1px 0 #00fff9;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim2 5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
            0% { clip: rect(12px, 9999px, 81px, 0); transform: skew(0.55deg); }
            5% { clip: rect(65px, 9999px, 50px, 0); transform: skew(0.79deg); }
            10% { clip: rect(98px, 9999px, 5px, 0); transform: skew(0.43deg); }
            15% { clip: rect(7px, 9999px, 60px, 0); transform: skew(0.12deg); }
            20% { clip: rect(32px, 9999px, 12px, 0); transform: skew(0.67deg); }
            100% { clip: rect(54px, 9999px, 45px, 0); transform: skew(0.98deg); }
        }

        @keyframes glitch-anim2 {
            0% { clip: rect(65px, 9999px, 100px, 0); transform: skew(0.55deg); }
            5% { clip: rect(5px, 9999px, 42px, 0); transform: skew(0.79deg); }
            10% { clip: rect(38px, 9999px, 15px, 0); transform: skew(0.43deg); }
            15% { clip: rect(87px, 9999px, 6px, 0); transform: skew(0.12deg); }
            20% { clip: rect(2px, 9999px, 82px, 0); transform: skew(0.67deg); }
            100% { clip: rect(12px, 9999px, 35px, 0); transform: skew(0.98deg); }
        }

        .visible {
            opacity: 1;
        }

        #flash {
            position: absolute; top:0; left:0; width:100%; height:100%;
            background: white; opacity: 0; pointer-events: none; z-index: 100;
            transition: opacity 0.1s cubic-bezier(0.1, 0.9, 0.2, 1);
        }

        #progress-bar {
            position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%);
            width: 300px; height: 4px; background: rgba(255,255,255,0.1);
            z-index: 20; opacity: 0;
            overflow: hidden;
        }
        #progress-fill {
            height: 100%; width: 0%; background: #00ffff;
            box-shadow: 0 0 10px #00ffff;
        }
    </style>
</head>
<body>
    <canvas id="canvas-bg"></canvas>
    <div id="scanlines"></div>
    <div id="vignette"></div>
    
    <div class="center-container">
        <div id="text-display" class="glitch-text" data-text=""></div>
    </div>
    
    <div id="progress-bar"><div id="progress-fill"></div></div>
    <div id="flash"></div>

    <script>
        // --- 1. VISUAL ENGINE (Canvas) ---
        const canvas = document.getElementById('canvas-bg');
        const ctx = canvas.getContext('2d');
        let width, height;
        let time = 0;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Grid Animation state
        const gridLines = [];
        const spacing = 40;
        
        function drawGrid() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            // Perspective / Warping effect
            const centerX = width / 2;
            const centerY = height / 2;
            
            for (let y = -height; y < height * 2; y += spacing) {
                for (let x = -width; x < width * 2; x += spacing) {
                    // Normalize
                    let nx = (x - centerX) / width;
                    let ny = (y - centerY) / height;
                    
                    // Distort based on time and radius
                    let r = Math.sqrt(nx*nx + ny*ny);
                    let angle = Math.atan2(ny, nx);
                    
                    // Spiral twist
                    let twist = Math.sin(time * 2.0 + r * 5.0) * r;
                    let tx = centerX + Math.cos(angle + twist) * r * width;
                    let ty = centerY + Math.sin(angle + twist) * r * height;
                    
                    // Z-depth pulsing
                    let z = 1 + Math.sin(time * 3 + r * 10) * 0.5;
                    
                    if (Math.random() > 0.98) { // Random glitches
                        ctx.fillStyle = Math.random() > 0.5 ? '#ff00ff' : '#ffffff';
                        ctx.fillRect(tx, ty, 4, 4);
                    }
                    
                    ctx.moveTo(tx, ty);
                    ctx.lineTo(tx + 2, ty + 2); // Tiny segments instead of full lines for a "point cloud" feel
                }
            }
            ctx.stroke();
            
            // Vignette overlay via canvas for extra darkness
            const grad = ctx.createRadialGradient(centerX, centerY, height * 0.2, centerX, centerY, height);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,width,height);
            
            time += 0.01;
            requestAnimationFrame(drawGrid);
        }
        requestAnimationFrame(drawGrid);

        // --- 2. AUDIO ENGINE ---
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const actx = new AudioContext();
        const master = actx.createGain();
        master.connect(actx.destination);
        master.gain.value = 0.5;

        // Riser Synth
        let riserOsc = null;
        let riserGain = null;

        function startRiser(duration) {
            riserOsc = actx.createOscillator();
            riserGain = actx.createGain();
            
            riserOsc.type = 'sawtooth';
            riserOsc.frequency.setValueAtTime(50, actx.currentTime);
            riserOsc.frequency.exponentialRampToValueAtTime(800, actx.currentTime + duration);
            
            // LFO for riser texture
            const lfo = actx.createOscillator();
            lfo.frequency.value = 15;
            const lfoGain = actx.createGain();
            lfoGain.gain.value = 100;
            lfo.connect(lfoGain);
            lfoGain.connect(riserOsc.frequency);
            lfo.start();
            
            riserGain.gain.setValueAtTime(0, actx.currentTime);
            riserGain.gain.linearRampToValueAtTime(0.4, actx.currentTime + duration);
            
            riserOsc.connect(riserGain);
            riserGain.connect(master);
            riserOsc.start();
        }

        // Glitch Burst
        function playDataBurst() {
            const t = actx.currentTime;
            const osc = actx.createOscillator();
            const g = actx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(200 + Math.random()*2000, t);
            
            // Random pitch jumps
            osc.frequency.setValueAtTime(Math.random()*2000, t + 0.05);
            osc.frequency.setValueAtTime(Math.random()*2000, t + 0.1);

            g.gain.setValueAtTime(0.2, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            
            osc.connect(g);
            g.connect(master);
            osc.start();
            osc.stop(t + 0.2);
        }

        // --- 3. SEQUENCE LOGIC ---
        const textDisplay = document.getElementById('text-display');
        const progressBar = document.getElementById('progress-bar');
        const progressFill = document.getElementById('progress-fill');
        const flash = document.getElementById('flash');

        const phrases = [
            { text: "INITIALIZING REALITY BREAK...", delay: 0 },
            { text: "GEOMETRY: UNSTABLE", delay: 1500 },
            { text: "DIMENSION: NULL", delay: 3000 },
            { text: "NON-EUCLIDEAN ENTITY FOUND", delay: 4500 }
        ];

        // "Matrix" decoding effect
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
        let decodeInterval;

        function setText(targetText) {
            textDisplay.classList.remove('visible');
            textDisplay.setAttribute('data-text', targetText);
            
            setTimeout(() => {
                textDisplay.classList.add('visible');
                playDataBurst();
                
                let iterations = 0;
                clearInterval(decodeInterval);
                
                decodeInterval = setInterval(() => {
                    textDisplay.innerText = targetText.split("")
                        .map((letter, index) => {
                            if(index < iterations) return targetText[index];
                            return chars[Math.floor(Math.random() * chars.length)]
                        })
                        .join("");
                    
                    if(iterations >= targetText.length) clearInterval(decodeInterval);
                    iterations += 1/2; // Speed of decode
                }, 30);
            }, 100);
        }

        async function runSequence() {
            const totalDuration = 6.0;
            startRiser(totalDuration);
            progressBar.style.opacity = 1;
            progressFill.style.transition = \`width \${totalDuration}s linear\`;
            
            // Force reflow
            progressFill.getBoundingClientRect();
            progressFill.style.width = '100%';

            for(const item of phrases) {
                setTimeout(() => setText(item.text), item.delay);
            }

            // Climax
            setTimeout(() => {
                flash.style.opacity = 1;
                if(riserOsc) riserOsc.stop();
                playDataBurst();
                playDataBurst(); // Double burst for impact
                
                setTimeout(() => {
                    window.parent.postMessage('GEODE_CUTSCENE_COMPLETE', '*');
                }, 800);
            }, totalDuration * 1000);
        }

        // Start
        setTimeout(runSequence, 500);
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
            style={{ width: '100%', height: '100%', border: 'none', background: 'black', borderRadius: '1rem' }}
            title="Geode Cutscene"
        />
    );
};
