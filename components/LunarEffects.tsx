import React from 'react';

export const LunarStyles = () => (
    <style>{`
        @keyframes lunar-ascension {
            0% { box-shadow: inset 0 0 0 0 transparent; filter: brightness(1) grayscale(0); transform: scale(1); }
            20% { filter: brightness(0.8) grayscale(0.5) contrast(1.2); box-shadow: inset 0 0 50px 10px rgba(0,0,50,0.5); }
            40% { filter: brightness(1.1) grayscale(0.8); box-shadow: inset 0 0 100px 30px rgba(50,100,150,0.6); }
            60% { filter: brightness(1.5) grayscale(1) drop-shadow(0 0 20px white); box-shadow: inset 0 0 200px 50px rgba(150,200,255,0.8); background-color: #000; }
            80% { filter: brightness(2) contrast(2) invert(0.1); box-shadow: inset 0 0 300px 100px rgba(200,230,255,0.9); transform: scale(1.02); }
            95% { filter: brightness(4) contrast(4); box-shadow: inset 0 0 500px 200px white; }
            100% {
                box-shadow: inset 0 0 100vw 100vh white;
                filter: brightness(10) contrast(10);
                background-color: white;
                transform: scale(1.05);
            }
        }
        
        @keyframes lunar-shiver {
            0% { transform: translate(0, 0); }
            25% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 1px); }
            75% { transform: translate(1px, 1px); }
            100% { transform: translate(-1px, -1px); }
        }

        .animate-lunar-buildup {
            animation: lunar-ascension 4s ease-in forwards, lunar-shiver 0.05s infinite;
            position: relative;
            z-index: 9999;
        }
    `}</style>
);