import { AudioCore } from './core';
import { RarityId } from '../../types';

export const playRaritySound = (core: AudioCore, rarity: RarityId) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(masterGain);

        if (rarity >= RarityId.LEGENDARY) {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, t);
            osc.frequency.linearRampToValueAtTime(880, t + 0.5);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.linearRampToValueAtTime(0, t + 1);
            osc.start();
            osc.stop(t + 1);
        } else if (rarity >= RarityId.RARE) {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, t);
            osc.frequency.exponentialRampToValueAtTime(880, t + 0.1);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.3);
            osc.start();
            osc.stop(t + 0.3);
        }
    } catch (e) { }
};

export const playPrismRaritySound = (core: AudioCore, rarity: RarityId) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;
        // Crystal chime effect
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Add some FM modulation for "shimmer"
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        
        mod.connect(modGain);
        modGain.connect(osc.frequency);
        
        osc.connect(gain);
        gain.connect(masterGain);

        if (rarity >= RarityId.LEGENDARY) {
            osc.type = 'sine';
            mod.type = 'triangle';
            
            // Higher pitch for Prism
            const baseFreq = 1200; 
            osc.frequency.setValueAtTime(baseFreq, t);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, t + 1.5);
            
            mod.frequency.value = 50; // Fast shimmer
            modGain.gain.setValueAtTime(200, t);
            modGain.gain.linearRampToValueAtTime(0, t + 1.5);

            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
            
            mod.start(t);
            osc.start(t);
            mod.stop(t + 2.0);
            osc.stop(t + 2.0);
        } else if (rarity >= RarityId.RARE) {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.5);
            
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            
            osc.start(t);
            osc.stop(t + 0.5);
        }
    } catch (e) { }
};

export const playBoom = (core: AudioCore, rarity: RarityId) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;
        const intensity = Math.pow(rarity / 15, 2.5);
        const duration = 0.3 + (intensity * 5);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        const startFreq = 150 - (intensity * 80);
        osc.frequency.setValueAtTime(Math.max(40, startFreq), t);
        osc.frequency.exponentialRampToValueAtTime(10, t + duration);

        gain.gain.setValueAtTime(0.5 + (intensity * 0.5), t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.start(t);
        osc.stop(t + duration);

        if (rarity >= RarityId.UNCOMMON) {
            const bufferSize = ctx.sampleRate * duration;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - (i / bufferSize), 3);
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.setValueAtTime(500 + (intensity * 8000), t);
            noiseFilter.frequency.exponentialRampToValueAtTime(100, t + (duration * 0.5));

            const noiseGain = ctx.createGain();
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(masterGain);

            noiseGain.gain.setValueAtTime(0.2 + (intensity * 0.6), t);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, t + (duration * 0.8));

            noise.start(t);
        }

        if (rarity >= RarityId.LEGENDARY) {
            const laser = ctx.createOscillator();
            const laserGain = ctx.createGain();

            laser.connect(laserGain);
            laserGain.connect(masterGain);

            laser.type = 'sawtooth';
            laser.frequency.setValueAtTime(1000 + (intensity * 4000), t);
            laser.frequency.exponentialRampToValueAtTime(50, t + 0.4);

            laserGain.gain.setValueAtTime(0.1 * intensity, t);
            laserGain.gain.linearRampToValueAtTime(0, t + 0.4);

            laser.start(t);
            laser.stop(t + 0.4);
        }
    } catch (e) {
        console.error("Boom error", e);
    }
};
