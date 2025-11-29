import { RarityId } from '../types';
import { audioCore } from './audio/core';
import * as ui from './audio/ui';
import * as gameplay from './audio/gameplay';
import * as rarity from './audio/rarity';
import * as special from './audio/special';

class AudioService {
    constructor() { }

    public setVolume(volume: number) {
        audioCore.setVolume(volume);
    }

    public getVolume(): number {
        return audioCore.getVolume();
    }

    // UI Sounds
    public playClick() { ui.playClick(audioCore); }
    public playRollSound() { ui.playRollSound(audioCore); }
    public playCoinWin(intensity: number = 1) { ui.playCoinWin(audioCore, intensity); }
    public playCoinLose() { ui.playCoinLose(audioCore); }
    public playCoinFlip() { ui.playCoinFlip(audioCore); }

    // Gameplay Sounds
    public playMineSound() { gameplay.playMineSound(audioCore); }
    public playGoldMineSound() { gameplay.playGoldMineSound(audioCore); }
    public playPrismMineSound() { gameplay.playPrismMineSound(audioCore); }
    public playFishSound() { gameplay.playFishSound(audioCore); }
    public playHarvestSound() { gameplay.playHarvestSound(audioCore); }

    // Rarity Sounds
    public playRaritySound(r: RarityId) { rarity.playRaritySound(audioCore, r); }
    public playPrismRaritySound(r: RarityId) { rarity.playPrismRaritySound(audioCore, r); }
    public playBoom(r: RarityId) { rarity.playBoom(audioCore, r); }

    // Special Sounds
    public playSpectrumBuildup() { special.playSpectrumBuildup(audioCore); }
    public playNightmareBuildup() { special.playNightmareBuildup(audioCore); }
    public playLunarBuildup() { special.playLunarBuildup(audioCore); }
    public playLucidSound() { special.playLucidSound(audioCore); }
    public playCutsceneAmbience(r: RarityId) { special.playCutsceneAmbience(audioCore, r); }
    public playSlotSpin() { special.playSlotSpin(audioCore); }
    public playSlotStop() { special.playSlotStop(audioCore); }
    public playSlotWin() { special.playSlotWin(audioCore); }
    public setSignalProximity(p: number) { special.setSignalProximity(audioCore, p); }
    public stopSignalScan() { special.stopSignalScan(audioCore); }
    public playSignalLock() { special.playSignalLock(audioCore); }
}

export const audioService = new AudioService();