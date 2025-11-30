import React, { useMemo, useEffect } from 'react';

interface Props {
    onComplete: () => void;
}

export const NightmareEelCutscene: React.FC<Props> = ({ onComplete }) => {
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data === 'NIGHTMARE_EEL_CUTSCENE_COMPLETE') {
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
    <title>Nightmare Eel Cutscene</title>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000000; font-family: 'Share Tech Mono', monospace; }

        /* --- UI --- */
        #intro-screen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #000;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            pointer-events: none;
            transition: opacity 1s;
        }

        #intro-text {
            font-size: 1.5rem;
            color: #aaaaaa;
            text-align: center;
            letter-spacing: 1px;
            z-index: 101;
            white-space: pre-wrap;
            line-height: 1.5;
            max-width: 80%;
        }
        
        #terminal-cursor {
            display: inline-block;
            width: 10px;
            height: 1.2rem;
            background-color: #aaaaaa;
            animation: blink 1s step-end infinite;
            vertical-align: middle;
            margin-left: 5px;
        }
        
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        
        #bsod {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: #0000aa; color: white;
            font-family: 'Lucida Console', Monaco, monospace;
            padding: 50px; box-sizing: border-box;
            z-index: 110; display: none;
            font-size: 1.5rem;
            cursor: none;
        }
        
        #click-to-start {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 300; display: flex; justify-content: center; align-items: center;
            background: rgba(0,0,0,0.5); color: white; font-size: 1.5rem; cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="click-to-start">CLICK TO INITIALIZE</div>
    <div id="bsod">
        <p>A fatal exception 0E has occurred at 0028:C0034B23 in VXD VMM(01) + 00004323.</p>
        <p>System halted.</p>
    </div>

    <div id="intro-screen">
        <div id="intro-container">
            <span id="intro-text"></span><span id="terminal-cursor"></span>
        </div>
    </div>
    
    <script>
        // --- AUDIO ENGINE ---
        let droneSynth, clickSynth;
        let isAudioInit = false;

        async function initAudio() {
            if (isAudioInit) return;
            await Tone.start();
            
            const reverb = new Tone.Reverb(20).toDestination();
            reverb.wet.value = 0.5;

            droneSynth = new Tone.Oscillator(50, "sawtooth").connect(new Tone.Filter(200, "lowpass")).connect(reverb);
            droneSynth.volume.value = -20;
            
            clickSynth = new Tone.MembraneSynth({
                pitchDecay: 0.01, octaves: 2, envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
            }).toDestination();
            clickSynth.volume.value = -10;

            isAudioInit = true;
            document.getElementById('click-to-start').style.display = 'none';
            runScript();
        }

        function playClick() {
            if(isAudioInit) clickSynth.triggerAttackRelease("C6", "32n");
        }

        document.getElementById('click-to-start').addEventListener('click', initAudio);

        // --- ANIMATION STATE ---
        const introText = document.getElementById('intro-text');
        const introScreen = document.getElementById('intro-screen');
        const bsod = document.getElementById('bsod');
        
        function randomChar() {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
            return chars[Math.floor(Math.random() * chars.length)];
        }
        
        async function typeText(text, delay = 50) {
            introText.innerText = "";
            let currentText = "";
            
            for (let i = 0; i < text.length; i++) {
                for(let j=0; j<3; j++) {
                     introText.innerText = currentText + randomChar();
                     await new Promise(r => setTimeout(r, 20));
                }
                currentText += text[i];
                introText.innerText = currentText;
                playClick();
                await new Promise(r => setTimeout(r, delay));
            }
            await new Promise(r => setTimeout(r, 500));
        }

        async function runScript() {
            await typeText("INITIALIZING DREAM PROTOCOL...", 20);
            await typeText("LOADING NEURAL ASSETS...", 20);
            
            // BSOD
            introScreen.style.display = 'none';
            bsod.style.display = 'block';
            if(droneSynth) {
                droneSynth.start();
                droneSynth.frequency.rampTo(200, 0.1); 
                setTimeout(() => droneSynth.stop(), 500); 
            }
            
            await new Promise(r => setTimeout(r, 3000));
            
            // Reboot
            bsod.style.display = 'none';
            introScreen.style.display = 'flex';
            introText.style.color = '#0f0'; 
            introText.style.fontFamily = 'Lucida Console';
            document.body.style.backgroundColor = 'black';
            
            if(droneSynth) {
                droneSynth.frequency.value = 40;
                droneSynth.start();
                droneSynth.volume.rampTo(-5, 10); 
            }
            
            await typeText("> BIOS DATE 2099-12-31", 10);
            await typeText("> MEMORY TEST... OK", 10);
            await typeText("> DETECTING PRIMARY DRIVE... FAILED", 30);
            await typeText("> BOOTING FROM BACKUP... SUCCESS", 10);
            introText.style.color = '#f00'; 
            await typeText("> WARNING: UNAUTHORIZED BIOLOGICAL ENTITY DETECTED", 30);
            await typeText("> CONTAINMENT BREACHED", 30);
            
            introText.innerHTML = "";
            
            window.parent.postMessage('NIGHTMARE_EEL_CUTSCENE_COMPLETE', '*');
        }
        
        // Auto-start if already clicked? No, wait for click
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
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#000000', 
                borderRadius: '0.75rem'
            }}
            title="Nightmare Eel Cutscene"
        />
    );
};
