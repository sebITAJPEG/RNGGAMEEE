
import React, { useEffect, useRef, useState } from 'react';
import { audioService } from '../services/audioService';

interface Props {
    onDecrypt: (multiplier: number, duration: number) => void;
}

export const SignalInterceptor: React.FC<Props> = ({ onDecrypt }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [targetFreq, setTargetFreq] = useState(50);
    const [playerFreq, setPlayerFreq] = useState(50);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("SCANNING...");
    const [isLocked, setIsLocked] = useState(false);

    // Refs for loop state to avoid re-renders
    const stateRef = useRef({
        target: 50,
        player: 50,
        driftDirection: 1,
        driftSpeed: 0.1,
        phase: 0,
        progress: 0,
        isDecrypted: false
    });

    const MESSAGES = [
        "BYPASSING_FIREWALL",
        "INJECTING_PAYLOAD",
        "OVERRIDING_SECURITY",
        "REWRITING_LUCK_MATRIX",
        "ACCESSING_ADMIN_ROOT",
        "DECRYPTING_SHA256",
        "BRUTE_FORCING_KEY"
    ];

    const TARGET_MESSAGE = useRef(MESSAGES[0]);

    useEffect(() => {
        stateRef.current.player = playerFreq;
    }, [playerFreq]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            const state = stateRef.current;

            // 1. Update Logic
            
            // Drift Target
            if (Math.random() < 0.05) {
                state.driftDirection = Math.random() > 0.5 ? 1 : -1;
                state.driftSpeed = Math.random() * 0.3;
            }
            state.target += state.driftDirection * state.driftSpeed;
            // Bounce bounds
            if (state.target < 0) { state.target = 0; state.driftDirection = 1; }
            if (state.target > 100) { state.target = 100; state.driftDirection = -1; }

            // Check Lock
            const diff = Math.abs(state.target - state.player);
            const threshold = 5;
            const isClose = diff < threshold;

            // Audio Feedback (debounced roughly by frame rate)
            if (Math.random() < 0.1) {
                // Calculate proximity 0 to 1
                const proximity = Math.max(0, 1 - (diff / 30));
                audioService.setSignalProximity(proximity);
            }

            // Progress Logic
            if (isClose && !state.isDecrypted) {
                state.progress += 0.4; // Speed of decryption
                if (state.progress >= 100) {
                    state.progress = 100;
                    state.isDecrypted = true;
                    
                    // Trigger Success
                    onDecrypt(2, 5 * 60 * 1000); // 2x Luck for 5 minutes
                    audioService.playSignalLock();
                    
                    // Reset after delay
                    setTimeout(() => {
                        stateRef.current.progress = 0;
                        stateRef.current.isDecrypted = false;
                        stateRef.current.target = Math.random() * 100;
                        stateRef.current.driftSpeed = 0.5; // Jump away
                        TARGET_MESSAGE.current = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
                        setProgress(0);
                        setMessage("SCANNING...");
                        setIsLocked(false);
                    }, 2000);
                }
            } else if (!state.isDecrypted) {
                state.progress = Math.max(0, state.progress - 0.1); // Decay
            }

            // Sync React State for UI (throttled ideally, but simple here)
            if (Math.abs(state.progress - progress) > 1 || state.isDecrypted !== isLocked) {
               setProgress(state.progress);
               setIsLocked(state.isDecrypted);
               
               // Decrypt Message String
               if (state.progress > 0) {
                   const msg = TARGET_MESSAGE.current;
                   const charsToShow = Math.floor((state.progress / 100) * msg.length);
                   const scrambled = msg.split('').map((char, i) => {
                       if (i < charsToShow) return char;
                       return String.fromCharCode(33 + Math.floor(Math.random() * 60)); // Random glpyh
                   }).join('');
                   setMessage(scrambled);
               }
            }

            state.phase += 0.2;

            // 2. Draw visuals
            
            // Grid
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<width; i+=20) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
            for(let i=0; i<height; i+=20) { ctx.moveTo(0, i); ctx.lineTo(width, i); }
            ctx.stroke();

            // Draw Target Wave (Red/Ghost)
            ctx.strokeStyle = isClose ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const y = height/2 + Math.sin((x + state.phase * 5) * (0.01 + state.target/1000)) * (height/3);
                if (x===0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw Player Wave (Green)
            ctx.strokeStyle = isClose ? '#fff' : '#0f0';
            ctx.lineWidth = isClose ? 3 : 2;
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                // Slightly different math to make them visually align only when values match
                const y = height/2 + Math.sin((x + state.phase * 5) * (0.01 + state.player/1000)) * (height/3);
                if (x===0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Locked Effect
            if (state.isDecrypted) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(0, 0, width, height);
                ctx.fillStyle = '#0f0';
                ctx.font = '12px monospace';
                ctx.fillText("ACCESS GRANTED", width/2 - 40, height/2);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [onDecrypt]); // Dependencies (mostly stable)

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerFreq(parseFloat(e.target.value));
    };

    return (
        <div className="w-full border-t border-neutral-800 bg-black/80 backdrop-blur p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex justify-between items-center font-mono text-xs text-green-500 mb-1 relative z-10">
                <span className="animate-pulse">{isLocked ? "SIGNAL LOCKED" : "SIGNAL INTERCEPTOR"}</span>
                <span>{message}</span>
            </div>

            {/* Canvas Container */}
            <div className="relative w-full h-24 bg-black border border-neutral-800 rounded overflow-hidden shadow-inner">
                <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={100} 
                    className="w-full h-full object-cover opacity-80"
                />
                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.1)_50%)] bg-[length:100%_4px]" />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-neutral-900 mt-1">
                <div 
                    className="h-full bg-green-500 transition-all duration-75 shadow-[0_0_10px_#0f0]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Slider */}
            <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] font-mono text-neutral-500">0Hz</span>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    value={playerFreq}
                    onChange={handleSliderChange}
                    className="flex-1 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <span className="text-[10px] font-mono text-neutral-500">100Hz</span>
            </div>
            
            <div className="text-[9px] text-neutral-600 font-mono text-center mt-1 uppercase">
                Match the waveform frequency to decrypt signal
            </div>
        </div>
    );
};
