export class AudioCore {
    public ctx: AudioContext | null = null;
    public masterGain: GainNode | null = null;
    public globalVolume: number = 0.4;

    constructor() {}

    public init() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = this.globalVolume;
            } catch (e) {
                console.error("AudioContext init failed", e);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(e => console.warn("Audio resume failed", e));
        }
    }

    public setVolume(volume: number) {
        this.globalVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.globalVolume;
        }
        if (volume > 0) this.init();
    }

    public getVolume(): number {
        return this.globalVolume;
    }

    public ensureContext(): boolean {
        if (this.globalVolume <= 0) return false;
        this.init();
        return !!(this.ctx && this.masterGain);
    }
}

export const audioCore = new AudioCore();
