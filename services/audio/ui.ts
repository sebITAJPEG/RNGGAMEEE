import { AudioCore } from './core';

export const playClick = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(masterGain);

        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) { }
};

export const playRollSound = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(masterGain);

        // Tech/Data sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) { }
};

export const playCoinWin = (core: AudioCore, intensity: number = 1) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    const count = Math.min(intensity, 5);
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            if (!ctx || !masterGain) return;
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(masterGain);

                osc.frequency.setValueAtTime(1000 + (i * 200), ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);

                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } catch (e) { }
        }, i * 100);
    }
};

export const playCoinLose = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) { }
};

export const playCoinFlip = (core: AudioCore) => {
    if (!core.ensureContext()) return;
    const { ctx, masterGain } = core;
    if (!ctx || !masterGain) return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.frequency.setValueAtTime(1500, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) { }
};
