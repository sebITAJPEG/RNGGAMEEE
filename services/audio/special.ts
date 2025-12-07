import { AudioCore } from './core';
import { RarityId } from '../../types';
import { playClick, playCoinWin } from './ui';

export const playSpectrumBuildup = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;
        const duration = 4.0;

        // 1. Riser (Sine wave rising pitch)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(50, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + duration);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + duration);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.1);

        osc.start(t);
        osc.stop(t + duration + 0.1);

        // 2. Rumble (Low frequency saw)
        const rumble = ctx.createOscillator();
        const rumbleGain = ctx.createGain();
        const rumbleFilter = ctx.createBiquadFilter();

        rumble.type = 'sawtooth';
        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.setValueAtTime(100, t);
        rumbleFilter.frequency.linearRampToValueAtTime(400, t + duration);

        rumble.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(masterGain);

        rumble.frequency.setValueAtTime(30, t);
        rumble.frequency.linearRampToValueAtTime(8, t + duration);

        rumbleGain.gain.setValueAtTime(0, t);
        rumbleGain.gain.linearRampToValueAtTime(0.2, t + duration);
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.1);

        rumble.start(t);
        rumble.stop(t + duration + 0.1);

        // 3. Spectrum Scatter (Random high notes accelerating)
        const noteCount = 40;
        for (let i = 0; i < noteCount; i++) {
            // Exponential time distribution (more notes at the end)
            const progress = i / noteCount;
            const timeOffset = Math.pow(progress, 2) * duration;
            const noteTime = t + timeOffset;

            const noteOsc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            noteOsc.connect(noteGain);
            noteGain.connect(masterGain);

            noteOsc.type = 'sine';
            noteOsc.frequency.value = 400 + Math.random() * 1000 + (progress * 2000);

            noteGain.gain.setValueAtTime(0, noteTime);
            noteGain.gain.linearRampToValueAtTime(0.1, noteTime + 0.05);
            noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.15);

            noteOsc.start(noteTime);
            noteOsc.stop(noteTime + 0.2);
        }

    } catch (e) { }
};

export const playLunarBuildup = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;
        const duration = 4.0;

        // 1. Ethereal Choir Swell (Multiple detuned sine/triangles)
        const freqs = [110, 164.8, 220, 277.2, 329.6]; // A Major(ish) chord
        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const panner = ctx.createStereoPanner();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t);
            // Pitch bend up an octave
            osc.frequency.exponentialRampToValueAtTime(f * 2, t + duration);

            // Pan spread
            panner.pan.value = (i / freqs.length) * 2 - 1;

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.05, t + duration * 0.8);
            gain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.2);

            osc.connect(gain);
            gain.connect(panner);
            panner.connect(masterGain);

            osc.start(t);
            osc.stop(t + duration + 0.2);
        });

        // 2. High Shimmer (Sparkles)
        const shimmerCount = 30;
        for (let i = 0; i < shimmerCount; i++) {
            const timeOffset = (i / shimmerCount) * duration;
            const noteTime = t + timeOffset;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(masterGain);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800 + Math.random() * 2000, noteTime);
            osc.frequency.exponentialRampToValueAtTime(200, noteTime + 0.2); // Downward chime

            gain.gain.setValueAtTime(0, noteTime);
            gain.gain.linearRampToValueAtTime(0.05, noteTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

            osc.start(noteTime);
            osc.stop(noteTime + 0.2);
        }

        // 3. Deep Resonance (Bass Riser)
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.connect(bassGain);
        bassGain.connect(masterGain);

        bass.type = 'sine';
        bass.frequency.setValueAtTime(55, t);
        bass.frequency.linearRampToValueAtTime(110, t + duration);

        bassGain.gain.setValueAtTime(0, t);
        bassGain.gain.linearRampToValueAtTime(0.3, t + duration);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + duration + 0.1);

        bass.start(t);
        bass.stop(t + duration + 0.1);

    } catch (e) { }
};

export const playLucidSound = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;

        // Dreamy swell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 2.0);

        // Tremolo
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 10;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 50;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + 2.5);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

        osc.start(t);
        osc.stop(t + 2.5);

        // Sparkles
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                if (!ctx || !masterGain) return;
                const spark = ctx.createOscillator();
                const sGain = ctx.createGain();
                spark.connect(sGain);
                sGain.connect(masterGain);

                spark.type = 'triangle';
                spark.frequency.setValueAtTime(1000 + Math.random() * 2000, ctx.currentTime);

                sGain.gain.setValueAtTime(0.05, ctx.currentTime);
                sGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

                spark.start();
                spark.stop(ctx.currentTime + 0.1);
            }, i * 200);
        }

    } catch (e) { }
};

export const playCutsceneAmbience = (core: AudioCore, rarity: RarityId) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(masterGain);

        const startFreq = rarity >= 10 ? 60 : 110;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(startFreq / 2, t + 10);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 12);

        osc.start(t);
        osc.stop(t + 12);
    } catch (e) {
        console.warn("Audio error", e);
    }
};

export const playSlotSpin = (core: AudioCore) => {
    playClick(core);
};

export const playSlotStop = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) { }
};

export const playSlotWin = (core: AudioCore) => {
    playCoinWin(core, 5);
};

// Signal variables
let signalOsc: OscillatorNode | null = null;
let signalGain: GainNode | null = null;

export const setSignalProximity = (core: AudioCore, proximity: number) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        if (!signalOsc) {
            signalOsc = ctx.createOscillator();
            signalGain = ctx.createGain();

            signalOsc.type = 'sine';
            signalOsc.connect(signalGain);
            signalGain.connect(masterGain);

            signalOsc.start();
        }

        if (signalOsc && signalGain) {
            const targetFreq = 200 + (proximity * 800);
            signalOsc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);
            signalGain.gain.setTargetAtTime(proximity * 0.1, ctx.currentTime, 0.1);
        }
    } catch (e) { }
};

export const stopSignalScan = (core: AudioCore) => {
    const { ctx } = core;
    if (!ctx) return;

    try {
        if (signalOsc) {
            if (signalGain && ctx) {
                signalGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
            }
            setTimeout(() => {
                if (signalOsc) {
                    try { signalOsc.stop(); } catch (e) { }
                    signalOsc.disconnect();
                    signalOsc = null;
                }
                if (signalGain) {
                    signalGain.disconnect();
                    signalGain = null;
                }
            }, 200);
        }
    } catch (e) { }
};

export const playSignalLock = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);

        stopSignalScan(core);
    } catch (e) { }
};

export const playNightmareBuildup = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const t = ctx.currentTime;
        const duration = 4.0;

        // 1. Low pulsating drone
        const drone = ctx.createOscillator();
        const droneGain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        drone.type = 'sawtooth';
        drone.frequency.setValueAtTime(55, t); // Low A
        drone.frequency.linearRampToValueAtTime(40, t + duration); // Pitch down

        lfo.frequency.setValueAtTime(4, t);
        lfo.frequency.linearRampToValueAtTime(12, t + duration); // Pulse faster

        lfo.connect(lfoGain);
        lfoGain.connect(droneGain.gain);
        lfoGain.gain.value = 0.5;

        drone.connect(droneGain);
        droneGain.connect(masterGain);

        droneGain.gain.setValueAtTime(0.2, t);
        droneGain.gain.linearRampToValueAtTime(0.4, t + duration);
        droneGain.gain.setValueAtTime(0, t + duration + 0.1);

        lfo.start(t);
        drone.start(t);
        lfo.stop(t + duration + 0.1);
        drone.stop(t + duration + 0.1);

        // 2. High pitched "screams" / metallic noises
        for (let i = 0; i < 8; i++) {
            const time = t + (Math.random() * duration * 0.8);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.setValueAtTime(2000 + Math.random() * 2000, time);
            osc.frequency.exponentialRampToValueAtTime(100, time + 0.3); // rapid drop
            osc.type = 'sawtooth';

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.3);
        }

        // 3. Reverse noise riser
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(100, t);
        filter.frequency.exponentialRampToValueAtTime(3000, t + duration);
        filter.Q.value = 5;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noiseGain.gain.setValueAtTime(0, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.3, t + duration);
        noiseGain.gain.setValueAtTime(0, t + duration + 0.1);

        noise.start(t);
        noise.stop(t + duration + 0.1);

    } catch (e) { }
};

// Non-Euclidean Ambience Controller
const neAudio = {
    drone: null as OscillatorNode | null,
    modulator: null as OscillatorNode | null,
    gain: null as GainNode | null,
    lfo: null as OscillatorNode | null,
    timeoutId: null as any,

    stop(core: AudioCore) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        const ctx = core.ctx;
        if (!ctx) return;

        // Fade out
        if (this.gain) {
            try {
                this.gain.gain.cancelScheduledValues(ctx.currentTime);
                this.gain.gain.setValueAtTime(this.gain.gain.value, ctx.currentTime);
                this.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            } catch (e) { }
        }

        // Hard stop after fade
        this.timeoutId = setTimeout(() => {
            try { if (this.drone) { this.drone.stop(); this.drone.disconnect(); } } catch (e) { }
            try { if (this.modulator) { this.modulator.stop(); this.modulator.disconnect(); } } catch (e) { }
            try { if (this.lfo) { this.lfo.stop(); this.lfo.disconnect(); } } catch (e) { }
            try { if (this.gain) { this.gain.disconnect(); } } catch (e) { }

            this.drone = null;
            this.modulator = null;
            this.lfo = null;
            this.gain = null;
            this.timeoutId = null;
        }, 600);
    },

    start(core: AudioCore) {
        if (!core.ensureContext()) return;
        const { ctx, masterGain } = core;
        if (!ctx || !masterGain) return;

        // Stop any existing sound first (cancels previous timeout)
        this.stop(core);
        if (this.timeoutId) clearTimeout(this.timeoutId); // Double ensure

        try {
            const t = ctx.currentTime;

            this.drone = ctx.createOscillator();
            this.modulator = ctx.createOscillator();
            this.gain = ctx.createGain();
            const modGain = ctx.createGain();
            this.lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            // Connections
            this.drone.connect(this.gain);
            this.gain.connect(masterGain);

            this.modulator.connect(modGain);
            modGain.connect(this.drone.frequency);

            this.lfo.connect(lfoGain);
            lfoGain.connect(modGain.gain);

            // Settings
            this.drone.type = 'sine';
            this.drone.frequency.setValueAtTime(60, t);

            this.modulator.type = 'sawtooth';
            this.modulator.frequency.setValueAtTime(110, t);

            this.lfo.type = 'sine';
            this.lfo.frequency.value = 0.2;

            lfoGain.gain.value = 500;
            modGain.gain.value = 200;

            // Fade in
            this.gain.gain.setValueAtTime(0, t);
            this.gain.gain.linearRampToValueAtTime(0.15, t + 2.0);

            // Start
            this.drone.start(t);
            this.modulator.start(t);
            this.lfo.start(t);

        } catch (e) {
            console.warn("Audio start error", e);
        }
    }
};

export const startNonEuclideanAmbience = (core: AudioCore) => {
    neAudio.start(core);
};

export const stopNonEuclideanAmbience = (core: AudioCore) => {
    neAudio.stop(core);
};
