import React from 'react';

export const SpectrumStyles = () => (
    <style>{`
        @keyframes spectrum-rainbow {
            0% { box-shadow: inset 0 0 0 0 transparent; filter: hue-rotate(0deg) contrast(1); }
            20% { filter: hue-rotate(45deg) contrast(1.1); }
            40% { filter: hue-rotate(90deg) contrast(1.2); }
            60% { filter: hue-rotate(180deg) contrast(1.3) blur(1px); }
            80% { filter: hue-rotate(270deg) contrast(1.5) blur(0.5px) saturate(2); }
            95% { filter: hue-rotate(340deg) contrast(2) blur(0px) invert(0.8); }
            100% { 
                box-shadow: 
                    inset 0 0 100px 20px rgba(255,0,0,0.9), 
                    inset 0 0 200px 40px rgba(255,127,0,0.9), 
                    inset 0 0 300px 60px rgba(255,255,0,0.9), 
                    inset 0 0 400px 80px rgba(0,255,0,0.9), 
                    inset 0 0 500px 100px rgba(0,0,255,0.9);
                filter: hue-rotate(360deg) contrast(3) invert(1) brightness(2);
                background-color: white;
            }
        }
        @keyframes spectrum-shake {
            0% { transform: translate(2px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-spectrum-buildup {
            animation: spectrum-rainbow 4s ease-in forwards, spectrum-shake 0.05s infinite;
            position: relative;
            z-index: 9999;
        }

        @keyframes nightmare-pulse {
            0% { box-shadow: inset 0 0 0 0 transparent; filter: grayscale(0) contrast(1); }
            20% { filter: grayscale(0.5) contrast(1.2); }
            40% { filter: grayscale(1) contrast(1.5) sepia(0.5); }
            60% { box-shadow: inset 0 0 50px 20px rgba(100,0,0,0.5); filter: hue-rotate(-50deg) contrast(2); }
            80% { box-shadow: inset 0 0 100px 40px rgba(50,0,50,0.8); filter: invert(0.1) contrast(2.5); }
            95% { box-shadow: inset 0 0 200px 80px rgba(0,0,0,0.95); filter: invert(0.9); }
            100% { box-shadow: inset 0 0 300px 100px black; filter: brightness(0); background-color: black; }
        }
        @keyframes nightmare-shake {
            0% { transform: translate(0, 0); }
            10% { transform: translate(-2px, 2px); }
            30% { transform: translate(2px, -2px) skewX(2deg); }
            50% { transform: translate(-5px, 5px) skewY(-2deg); }
            70% { transform: translate(5px, -5px) scale(1.05); }
            90% { transform: translate(-10px, 10px) rotate(1deg); }
            100% { transform: translate(0, 0); }
        }
        .animate-nightmare-buildup {
            animation: nightmare-pulse 4s ease-in forwards, nightmare-shake 0.1s infinite;
            position: relative;
            z-index: 9999;
        }
    `}</style>
);
