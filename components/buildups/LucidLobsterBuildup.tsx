import React, { useEffect, useRef } from 'react';

export const LucidLobsterBuildup: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // --- AUDIO (Native Web Audio API) ---
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const master = ctx.createGain();
        master.gain.value = 0.3;
        master.connect(ctx.destination);

        let isRunning = true;

        const playGlitch = () => {
            if(!isRunning) return;
            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
            osc.frequency.setValueAtTime(Math.random() * 1000 + 200, t);
            osc.frequency.exponentialRampToValueAtTime(Math.random() * 100 + 50, t + 0.1);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            
            osc.connect(gain);
            gain.connect(master);
            osc.start(t);
            osc.stop(t + 0.1);

            // Schedule next glitch
            setTimeout(playGlitch, Math.random() * 100 + 50);
        };

        const playNoise = () => {
            const bufferSize = ctx.sampleRate * 4; // 4 seconds
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1000;
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 3.5); // Rise

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            noise.start();
            return noise;
        };

        const playDrone = () => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(50, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 4); // Rise
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 3.5);

            osc.connect(gain);
            gain.connect(master);
            osc.start();
            return osc;
        };

        playGlitch();
        const noiseNode = playNoise();
        const droneNode = playDrone();

        // --- VISUALS ---
        const canvas = canvasRef.current;
        if (!canvas) return;
        const c2d = canvas.getContext('2d');
        if (!c2d) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Glitch slices
        const slices: { y: number; h: number; offset: number; speed: number }[] = [];
        for(let i=0; i<20; i++) {
            slices.push({
                y: Math.random() * canvas.height,
                h: Math.random() * 50 + 10,
                offset: 0,
                speed: (Math.random() - 0.5) * 50
            });
        }

        const render = () => {
            time += 1;
            
            const w = canvas.width;
            const h = canvas.height;
            
            // Clear
            c2d.fillStyle = 'rgba(0, 0, 0, 0.2)';
            c2d.fillRect(0, 0, w, h);

            // Random color fills
            if (Math.random() > 0.8) {
                c2d.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
                c2d.fillRect(Math.random() * w, Math.random() * h, Math.random() * 100, Math.random() * 100);
            }

            // Draw text
            c2d.save();
            c2d.translate(w/2, h/2);
            if (Math.random() > 0.9) c2d.translate((Math.random()-0.5)*20, (Math.random()-0.5)*20);
            c2d.textAlign = 'center';
            c2d.font = '900 100px "Courier New", monospace';
            
            // RGB Split
            c2d.globalCompositeOperation = 'screen';
            c2d.fillStyle = '#ff0000';
            c2d.fillText("WAKE UP", -5, 0);
            c2d.fillStyle = '#00ff00';
            c2d.fillText("WAKE UP", 0, 0);
            c2d.fillStyle = '#0000ff';
            c2d.fillText("WAKE UP", 5, 0);
            c2d.restore();

            // Glitch Slices
            c2d.globalCompositeOperation = 'source-over';
            slices.forEach(s => {
                s.offset += s.speed;
                try {
                    const imgData = c2d.getImageData(0, s.y, w, s.h);
                    c2d.putImageData(imgData, s.offset % 20, s.y);
                } catch(e) {}
                
                c2d.fillStyle = '#ffffff';
                if(Math.random() > 0.95) c2d.fillRect(0, s.y, w, 2);
            });

            if (time % 20 < 5) {
                c2d.globalCompositeOperation = 'difference';
                c2d.fillStyle = 'white';
                c2d.fillRect(0, 0, w, h);
            }
            c2d.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
            isRunning = false;
            if(noiseNode) noiseNode.stop();
            if(droneNode) droneNode.stop();
            if(ctx.state !== 'closed') ctx.close();
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none mix-blend-hard-light" />;
};
