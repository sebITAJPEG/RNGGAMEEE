import React, { useEffect, useRef } from 'react';

export const WakingLifeBuildup: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let startTime = Date.now();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const w = canvas.width;
            const h = canvas.height;

            let eyeOpen = 0;
            if (elapsed < 1) eyeOpen = 0;
            else if (elapsed < 3) eyeOpen = (elapsed - 1) / 2;
            else eyeOpen = 1;

            // White flash at end
            let whiteout = 0;
            if (elapsed > 3.5) whiteout = (elapsed - 3.5) * 2;

            // Draw World (Blurry)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);
            
            // Draw Eyelids
            ctx.fillStyle = '#000000';
            const lidHeight = (h / 2) * (1 - eyeOpen);
            ctx.fillRect(0, 0, w, lidHeight); // Top
            ctx.fillRect(0, h - lidHeight, w, lidHeight); // Bottom

            // Blur effect using semi-transparent rects
            if(eyeOpen > 0 && eyeOpen < 1) {
                 ctx.fillStyle = `rgba(255, 255, 255, ${1 - eyeOpen})`;
                 ctx.fillRect(0, lidHeight, w, h - 2*lidHeight);
            }

            // Text
            if (elapsed > 1.5 && elapsed < 3.5) {
                ctx.font = '100 40px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = `rgba(0, 0, 0, ${Math.sin(elapsed * 5) * 0.5 + 0.5})`;
                ctx.fillText("WAKE UP", w/2, h/2 + 10);
            }

            if (whiteout > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${whiteout})`;
                ctx.fillRect(0, 0, w, h);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />;
};
