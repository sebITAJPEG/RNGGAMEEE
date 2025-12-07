import React, { useEffect, useRef } from 'react';

export const InfraredBuildup: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- AUDIO SETUP ---
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ac = new AudioContext();
            audioCtxRef.current = ac;
            const now = ac.currentTime;

            // 1. Turbine Spool (Low Drone Rising)
            const spoolOsc = ac.createOscillator();
            spoolOsc.type = 'sawtooth';
            spoolOsc.frequency.setValueAtTime(40, now);
            spoolOsc.frequency.exponentialRampToValueAtTime(400, now + 4);
            const spoolFilter = ac.createBiquadFilter();
            spoolFilter.type = 'lowpass';
            spoolFilter.frequency.setValueAtTime(100, now);
            spoolFilter.frequency.exponentialRampToValueAtTime(2000, now + 4);
            const spoolGain = ac.createGain();
            spoolGain.gain.setValueAtTime(0, now);
            spoolGain.gain.linearRampToValueAtTime(0.4, now + 3);
            spoolGain.gain.linearRampToValueAtTime(0, now + 4);
            spoolOsc.connect(spoolFilter).connect(spoolGain).connect(ac.destination);
            spoolOsc.start(now);
            spoolOsc.stop(now + 4.1);

            // 2. Alarm / Klaxon (Dual Tone)
            const alarmOsc1 = ac.createOscillator();
            const alarmOsc2 = ac.createOscillator();
            alarmOsc1.type = 'square';
            alarmOsc2.type = 'square';
            // Alternating pitch
            const alarmLFO = ac.createOscillator();
            alarmLFO.type = 'square';
            alarmLFO.frequency.value = 2; // 2 Hz alert speed
            const alarmGain = ac.createGain();
            alarmGain.gain.setValueAtTime(0, now);
            alarmGain.gain.linearRampToValueAtTime(0.3, now + 1); // Fade in alarm
            alarmGain.gain.setValueAtTime(0.3, now + 3.5);
            alarmGain.gain.linearRampToValueAtTime(0, now + 4);

            // Apply pitch modulation manually or via simple scheduling for better control
            // Let's use scheduling for that "European Siren" Hi-Lo-Hi-Lo
            for (let i = 0; i < 8; i++) {
                const t = now + i * 0.5 + 1; // Start alarm at 1s
                if (t > now + 4) break;
                alarmOsc1.frequency.setValueAtTime(800, t);
                alarmOsc1.frequency.setValueAtTime(600, t + 0.25);
                alarmOsc2.frequency.setValueAtTime(810, t); // Slightly detuned
                alarmOsc2.frequency.setValueAtTime(605, t + 0.25);
            }
            alarmOsc1.connect(alarmGain);
            alarmOsc2.connect(alarmGain);
            alarmGain.connect(ac.destination);
            alarmOsc1.start(now + 1);
            alarmOsc2.start(now + 1);
            alarmOsc1.stop(now + 4);
            alarmOsc2.stop(now + 4);

            // 3. Geiger Counter (Random Clicks)
            const geigerGain = ac.createGain();
            geigerGain.gain.value = 0.2;
            geigerGain.connect(ac.destination);

            const scheduleClick = (time: number) => {
                const clickOsc = ac.createOscillator();
                clickOsc.type = 'square';
                clickOsc.frequency.setValueAtTime(1000, time);
                clickOsc.start(time);
                clickOsc.stop(time + 0.005); // Short click
                clickOsc.connect(geigerGain);
            };

            // Increasing density
            for (let t = 0; t < 4; t += 0.05) { // coarse steps
                const density = t / 4; // 0 to 1
                const clicksInStep = Math.floor(Math.random() * density * 10);
                for (let j = 0; j < clicksInStep; j++) {
                    scheduleClick(now + t + Math.random() * 0.05);
                }
            }

        } catch (e) { console.error(e); }

        // --- VISUALS ---
        let animationFrame: number;
        let startTime = Date.now();

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            maxLife: number;
            size: number;
            color: string;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = h + Math.random() * 50;
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = -(Math.random() * 5 + 2);
                this.maxLife = 60 + Math.random() * 60;
                this.life = this.maxLife;
                this.size = Math.random() * 3 + 1;
                // Orange to Red palette
                const r = 255;
                const g = Math.floor(Math.random() * 100);
                const b = 0;
                this.color = `rgba(${r},${g},${b},`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx += (Math.random() - 0.5) * 0.5; // Jitter
                this.life--;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const alpha = this.life / this.maxLife;
                ctx.fillStyle = this.color + alpha + ')';
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        const particles: Particle[] = [];
        const MAX_PARTICLES = 300;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / 4, 1);
            const w = canvas.width;
            const h = canvas.height;

            // 1. Clear with Trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, w, h);

            // 2. Shake Calculation
            const shakeIntensity = Math.pow(progress, 3) * 50; // Exponential shake
            const dx = (Math.random() - 0.5) * shakeIntensity;
            const dy = (Math.random() - 0.5) * shakeIntensity;

            ctx.save();
            ctx.translate(dx, dy);

            // 3. Red Overlay Intensity
            const redAlpha = progress * 0.4;
            ctx.fillStyle = `rgba(255, 0, 0, ${redAlpha})`;
            ctx.fillRect(0, 0, w, h);

            // 4. Particles (Embers)
            // Spawn new
            if (particles.length < MAX_PARTICLES * progress + 50) {
                for (let i = 0; i < 5; i++) particles.push(new Particle(w, h));
            }
            // Update & Draw
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0) particles.splice(i, 1);
            }

            // 5. Glitch Text
            if (elapsed > 1) {
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const fontSize = Math.min(w, h) * 0.15;
                ctx.font = `900 ${fontSize}px "Courier New", monospace`;

                const texts = ["WARNING", "CRITICAL TEMP", "MELTDOWN", "SYSTEM FAILURE"];
                const textIndex = Math.floor(elapsed * 2) % texts.length;
                const text = texts[textIndex];

                // Draw Glitched offsets (Chromatic Aberration)
                if (Math.random() < progress) {
                    ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
                    ctx.fillText(text, w / 2 + 10 * progress, h / 2);
                    ctx.fillStyle = 'rgba(255, 0, 255, 0.7)';
                    ctx.fillText(text, w / 2 - 10 * progress, h / 2);
                }

                ctx.fillStyle = '#ff0000';
                // Random slice
                if (Math.random() > 0.8) {
                    const sliceH = 20;
                    const sliceY = h / 2 - fontSize / 2 + Math.random() * fontSize;
                    const sliceOff = (Math.random() - 0.5) * 50;
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(0, sliceY, w, sliceH);
                    ctx.clip();
                    ctx.translate(sliceOff, 0);
                    ctx.fillText(text, w / 2, h / 2);
                    ctx.restore();
                    // Draw rest normal
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(0, 0, w, sliceY);
                    ctx.rect(0, sliceY + sliceH, w, h);
                    ctx.clip();
                    ctx.fillText(text, w / 2, h / 2);
                    ctx.restore();
                } else {
                    ctx.fillText(text, w / 2, h / 2);
                }

                // Subtext
                ctx.font = `700 ${fontSize * 0.2}px "Courier New", monospace`;
                ctx.fillStyle = '#ffaa00';
                ctx.fillText(`TEMP: ${(1000 + elapsed * 5000).toFixed(0)} K`, w / 2, h / 2 + fontSize);
            }

            ctx.restore();

            // 6. Flash White at end
            if (progress > 0.9) {
                const flash = (progress - 0.9) * 10; // 0 to 1
                ctx.fillStyle = `rgba(255, 255, 255, ${flash})`;
                ctx.fillRect(0, 0, w, h);
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[100] pointer-events-none"
        />
    );
};
