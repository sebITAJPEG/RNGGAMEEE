import React, { useEffect, useRef } from 'react';

export const HypercubeBuildup: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let frameCount = 0;
        let audioCtx: AudioContext | null = null;
        let oscillator: OscillatorNode | null = null;
        let gainNode: GainNode | null = null;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Audio initialization
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioCtx = new AudioContext();
            oscillator = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 100;
            
            // Glitchy LFO
            const lfo = audioCtx.createOscillator();
            lfo.type = 'square';
            lfo.frequency.value = 10;
            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 500;
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.start();

            gainNode.gain.value = 0.1;
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();

            // Rising pitch
            oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 4);
            gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 3.5);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 4);
        } catch (e) {
            console.error("Audio init failed", e);
        }

        // 4D Math
        const vertices: number[][] = [];
        for (let i = 0; i < 16; i++) {
            vertices.push([
                (i & 1) ? 1 : -1,
                (i & 2) ? 1 : -1,
                (i & 4) ? 1 : -1,
                (i & 8) ? 1 : -1
            ]);
        }

        const edges: [number, number][] = [];
        for (let i = 0; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                let diff = 0;
                for (let k = 0; k < 4; k++) {
                    if (vertices[i][k] !== vertices[j][k]) diff++;
                }
                if (diff === 1) edges.push([i, j]);
            }
        }

        const rotate4D = (point: number[], theta: number) => {
            // Rotation in XW and YZ planes
            let [x, y, z, w] = point;
            
            // XW
            const tx = x * Math.cos(theta) - w * Math.sin(theta);
            const tw = x * Math.sin(theta) + w * Math.cos(theta);
            x = tx; w = tw;

            // YZ
            const ty = y * Math.cos(theta * 0.5) - z * Math.sin(theta * 0.5);
            const tz = y * Math.sin(theta * 0.5) + z * Math.cos(theta * 0.5);
            y = ty; z = tz;

            return [x, y, z, w];
        };

        const render = () => {
            frameCount++;
            const width = canvas.width;
            const height = canvas.height;

            // Intense strobe effect near the end
            const progress = Math.min(1, frameCount / 240); // Approx 4 seconds at 60fps
            if (progress > 0.8 && frameCount % 4 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(0, 0, width, height);
            } else {
                // Trail
                ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + progress * 0.2})`; 
                ctx.fillRect(0, 0, width, height);
            }

            const t = frameCount * 0.02 + (progress * progress * 10); // Speed up
            const scale = 200 + (progress * 300); // Zoom in

            const projected2D: {x: number, y: number}[] = [];

            // Project Vertices
            for (let i = 0; i < 16; i++) {
                let p = [...vertices[i]];
                p = rotate4D(p, t);

                // 4D to 3D (Perspective)
                const distance = 3;
                const w = 1 / (distance - p[3]);
                const p3 = [p[0] * w, p[1] * w, p[2] * w];

                // 3D to 2D
                const z = 1 / (distance - p3[2]);
                const x2d = p3[0] * z * scale + width / 2;
                const y2d = p3[1] * z * scale + height / 2;

                projected2D.push({ x: x2d, y: y2d });
                
                // Draw vertices
                const size = 3 + Math.random() * 5 * progress;
                ctx.fillStyle = (i % 2 === 0) ? '#00ffff' : '#ff00ff';
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Edges
            ctx.lineWidth = 1 + progress * 5;
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + Math.random() * 0.5})`;
            
            // Glitch offset
            const offsetX = (Math.random() - 0.5) * progress * 50;
            const offsetY = (Math.random() - 0.5) * progress * 50;

            ctx.beginPath();
            edges.forEach(([i, j]) => {
                ctx.moveTo(projected2D[i].x + offsetX, projected2D[i].y + offsetY);
                ctx.lineTo(projected2D[j].x + offsetX, projected2D[j].y + offsetY);
            });
            ctx.stroke();

            // Text Glitch
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
            const text = "DIMENSIONAL BREACH";
            let glitchedText = "";
            for (let i = 0; i < text.length; i++) {
                if (Math.random() < progress) {
                    glitchedText += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    glitchedText += text[i];
                }
            }

            ctx.font = `bold ${40 + progress * 40}px 'Courier New', monospace`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(glitchedText, width / 2 + (Math.random()-0.5)*10, height / 2 + (Math.random()-0.5)*10);

            if (progress > 0.5) {
                ctx.font = "20px monospace";
                ctx.fillStyle = "#ff0000";
                ctx.fillText("REALITY FAILURE IMMINENT", width/2, height/2 + 60);
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
            if (audioCtx) audioCtx.close();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black pointer-events-none">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        </div>
    );
};
