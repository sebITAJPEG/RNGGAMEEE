import React, { useEffect, useRef } from 'react';

interface Props {
    onComplete: () => void;
}

export const InfraredIngotCutscene: React.FC<Props> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- AUDIO ENGINE ---
        const playSound = (type: 'chirp' | 'alert' | 'scan' | 'lock' | 'flush') => {
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const ac = audioContextRef.current || new AudioContext();
                audioContextRef.current = ac;
                ac.resume(); // Ensure context is running
                const now = ac.currentTime;

                if (type === 'chirp') {
                    const osc = ac.createOscillator();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(2000 + Math.random() * 1000, now);
                    const gain = ac.createGain();
                    gain.gain.setValueAtTime(0.3, now); // Boosted
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    osc.connect(gain).connect(ac.destination);
                    osc.start(now);
                    osc.stop(now + 0.05);
                } else if (type === 'alert') {
                    const osc = ac.createOscillator();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.linearRampToValueAtTime(800, now + 0.2);
                    const gain = ac.createGain();
                    gain.gain.setValueAtTime(0.5, now); // Boosted
                    gain.gain.linearRampToValueAtTime(0, now + 0.5);
                    osc.connect(gain).connect(ac.destination);
                    osc.start(now);
                    osc.stop(now + 0.5);
                } else if (type === 'scan') {
                    const osc = ac.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.linearRampToValueAtTime(200, now + 2);
                    const gain = ac.createGain();
                    gain.gain.setValueAtTime(0.0, now);
                    gain.gain.linearRampToValueAtTime(0.3, now + 1); // Boosted
                    osc.connect(gain).connect(ac.destination);
                    osc.start(now);
                    osc.stop(now + 2);
                } else if (type === 'lock') {
                    const osc = ac.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, now);
                    const gain = ac.createGain();
                    gain.gain.setValueAtTime(0.4, now); // Boosted
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
                    osc.connect(gain).connect(ac.destination);
                    osc.start(now);
                    osc.stop(now + 1);
                } else if (type === 'flush') {
                    // White noise burst
                    const bufferSize = ac.sampleRate * 2.0;
                    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    const noise = ac.createBufferSource();
                    noise.buffer = buffer;
                    const gain = ac.createGain();
                    gain.gain.setValueAtTime(0.8, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
                    noise.connect(gain).connect(ac.destination);
                    noise.start(now);
                }
            } catch (e) { }
        };

        const logs: string[] = [];
        let logIndex = 0;
        let lastLogTime = 0;

        const fullLogs = [
            "INITIALIZING SENSOR ARRAY...",
            "CALIBRATING SPECTROMETER...",
            "BACKGROUND RADIATION: NORMAL",
            "SCANNING TARGET...",
            "...",
            "WARNING: ANOMALY DETECTED",
            "SIGNATURE: > 700nm (INFRARED)",
            "TEMPERATURE DETECTED: 3,000 K",
            "ANALYZING COMPOSITION...",
            "STATE: PLASMA-SOLID HYBRID",
            "WARNING: THERMAL RUNAWAY IMMINENT",
            "TEMP: 6,000 K",
            "TEMP: 9,000 K",
            "CRITICAL WARNING: CONTAINMENT BREACH",
            "ENGAGING EMERGENCY COOLING...",
            "NITROGEN FLUSH: ACTIVE",
            "TEMP DROPPING...",
            "STABILIZING...",
            "ITEM SECURED: INFRARED INGOT"
        ];

        let startTime = Date.now();
        let frame = 0;
        let animationFrame: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            frame++;
            const now = Date.now();
            const elapsed = (now - startTime) / 1000;
            const w = canvas.width;
            const h = canvas.height;

            // BG
            ctx.fillStyle = '#110000';
            ctx.fillRect(0, 0, w, h);

            // Grid
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            const gridSize = 50;
            ctx.beginPath();
            for (let x = 0; x < w; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
            for (let y = 0; y < h; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
            ctx.stroke();

            // --- SCAN PHASE & LOGS ---
            // Add logs over time
            if (logIndex < fullLogs.length) {
                // Determine speed based on urgency
                let speed = 150; // ms
                if (logIndex > 10) speed = 80;

                if (now - lastLogTime > speed) {
                    logs.push(fullLogs[logIndex]);
                    logIndex++;
                    lastLogTime = now;
                    playSound('chirp');
                    if (fullLogs[logIndex - 1]?.includes("WARNING")) playSound('alert');
                    if (fullLogs[logIndex - 1]?.includes("FLUSH")) playSound('flush');
                    if (fullLogs[logIndex - 1]?.includes("SECURED")) playSound('lock');
                }
            } else {
                // Scan complete
                if (elapsed > 4.5) {
                    onComplete();
                    return;
                }
            }

            // Draw Logs
            ctx.font = '16px "Share Tech Mono", monospace';
            ctx.textAlign = 'left';
            const logX = 50;
            let logY = 100;
            const maxVisible = Math.floor((h - 200) / 20);
            const visibleLogs = logs.slice(Math.max(0, logs.length - maxVisible));

            visibleLogs.forEach((log, i) => {
                const alpha = (i + 1) / visibleLogs.length;
                if (log.includes("WARNING") || log.includes("CRITICAL")) {
                    ctx.fillStyle = `rgba(255, 50, 50, ${alpha})`;
                } else if (log.includes("SECURED")) {
                    ctx.fillStyle = `rgba(50, 255, 50, ${alpha})`;
                } else {
                    ctx.fillStyle = `rgba(255, 150, 50, ${alpha})`;
                }
                ctx.fillText(`> ${log}`, logX, logY + i * 25);
            });

            // --- GRAPHS & HUD ---

            // Temperature Graph
            const graphW = 300;
            const graphH = 150;
            const graphX = w - graphW - 50;
            const graphY = 100;

            ctx.strokeStyle = '#ff3300';
            ctx.lineWidth = 2;
            ctx.strokeRect(graphX, graphY, graphW, graphH);

            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            ctx.fillRect(graphX, graphY, graphW, graphH);

            ctx.beginPath();
            ctx.moveTo(graphX, graphY + graphH);
            for (let i = 0; i < graphW; i += 5) {
                // Simulate temp curve
                let val = 0;
                const relativeT = elapsed * 100; // Fake x axis scroll
                const xInLog = i + relativeT;

                // Curve logic: Rise then Fall
                if (elapsed < 3.0) {
                    val = Math.pow(elapsed / 3.0, 3) * graphH * 0.9;
                } else {
                    val = Math.max(0, (graphH * 0.9) - (elapsed - 3.0) * graphH * 2);
                }
                // Add noise
                val += (Math.random() - 0.5) * 10;

                const y = graphY + graphH - Math.min(graphH, Math.max(0, val));
                ctx.lineTo(graphX + i, y);
            }
            ctx.stroke();

            ctx.fillStyle = '#ffaa00';
            ctx.fillText("TEMP KELVIN", graphX, graphY - 10);

            // Spectrum Bar
            const specX = graphX;
            const specY = graphY + graphH + 50;
            const specH = 30;

            // Gradient
            const grad = ctx.createLinearGradient(specX, 0, specX + graphW, 0);
            grad.addColorStop(0, '#0000ff');
            grad.addColorStop(0.5, '#00ff00');
            grad.addColorStop(0.8, '#ffff00');
            grad.addColorStop(1, '#ff0000');
            ctx.fillStyle = grad;
            ctx.fillRect(specX, specY, graphW, specH);

            // Marker
            const markerX = specX + graphW * 0.9; // Infrared end
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(markerX, specY - 5);
            ctx.lineTo(markerX, specY + specH + 5);
            ctx.stroke();

            // Flicker effect on critical
            if (elapsed > 1.5 && elapsed < 3.0) {
                if (frame % 4 === 0) {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
                    ctx.fillRect(0, 0, w, h);
                }
            }

            // CRT Scanlines
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            for (let i = 0; i < h; i += 4) {
                ctx.fillRect(0, i, w, 2);
            }

            animationFrame = requestAnimationFrame(render);
        };

        playSound('scan');
        render();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-50 bg-black cursor-none"
        />
    );
};
