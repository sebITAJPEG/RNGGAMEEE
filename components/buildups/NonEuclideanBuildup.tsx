import React, { useEffect, useRef } from 'react';

export const NonEuclideanBuildup: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        let frameCount = 0;
        let audioCtx: AudioContext | null = null;
        let osc1: OscillatorNode | null = null;
        let osc2: OscillatorNode | null = null;
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

            // Dissonant Cluster
            osc1 = audioCtx.createOscillator();
            osc2 = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();

            osc1.type = 'sawtooth';
            osc1.frequency.value = 60; // Low drone

            osc2.type = 'sine';
            osc2.frequency.value = 87; // Tritone-ish dissonance

            // FM Synthesis LFO
            const lfo = audioCtx.createOscillator();
            lfo.frequency.value = 0.5; // Slow modulation start
            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 50;
            lfo.connect(lfoGain);
            lfoGain.connect(osc2.frequency);
            lfo.start();

            gainNode.gain.value = 0;

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc1.start();
            osc2.start();

            // Riser
            const now = audioCtx.currentTime;
            gainNode.gain.linearRampToValueAtTime(0.3, now + 1);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 3);
            gainNode.gain.linearRampToValueAtTime(0, now + 4);

            osc1.frequency.exponentialRampToValueAtTime(600, now + 4);
            osc2.frequency.exponentialRampToValueAtTime(900, now + 4);
            lfo.frequency.linearRampToValueAtTime(20, now + 4); // Speed up wobbles

        } catch (e) {
            console.error("Audio init failed", e);
        }

        const render = () => {
            frameCount++;
            const width = canvas.width;
            const height = canvas.height;
            const t = frameCount * 0.05;
            const progress = Math.min(1, frameCount / 240); // 4 seconds

            // Clear with accumulation for trails
            ctx.fillStyle = `rgba(0, 0, 0, ${0.1})`;
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = `hsl(${(t * 50) % 360}, 100%, 50%)`;

            const centerX = width / 2;
            const centerY = height / 2;

            // Draw Non-Euclidean warping grid
            ctx.beginPath();

            const lines = 20;
            const radius = Math.min(width, height) * (0.2 + progress * 0.8);

            for (let i = 0; i < lines; i++) {
                const angle = (i / lines) * Math.PI * 2 + t * 0.2;

                // Warped spiral
                for (let r = 0; r < radius; r += 5) {
                    const distortion = Math.sin(r * 0.05 - t) * 50 * progress;
                    const x = centerX + Math.cos(angle) * r + distortion;
                    const y = centerY + Math.sin(angle) * r - distortion;

                    if (r === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            // Glitch Text
            if (frameCount % 10 === 0) {
                const text = "NON-EUCLIDEAN";
                ctx.font = `bold ${50 + progress * 50}px monospace`;
                ctx.fillStyle = `rgba(255, 255, 255, ${progress})`;
                ctx.textAlign = 'center';

                const glitchX = (Math.random() - 0.5) * 50 * progress;
                const glitchY = (Math.random() - 0.5) * 50 * progress;

                ctx.fillText(text, centerX + glitchX, centerY + glitchY);
            }

            // Flash at the end
            if (progress > 0.95 && frameCount % 3 === 0) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, width, height);
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
            if (audioCtx) {
                audioCtx.close().catch(e => console.error("Error closing audio context", e));
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black pointer-events-none">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        </div>
    );
};
