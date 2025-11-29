import { useState, useCallback } from 'react';
import { audioService } from '../services/audioService';

export type BuildUpType = 'SPECTRUM' | 'NIGHTMARE' | 'LUNAR';

export const useBuildUpSequence = () => {
    const [activeSequence, setActiveSequence] = useState<BuildUpType | null>(null);

    const triggerSequence = useCallback((type: BuildUpType, onComplete: () => void) => {
        setActiveSequence(type);
        if (type === 'SPECTRUM') {
            audioService.playSpectrumBuildup();
        } else if (type === 'NIGHTMARE') {
            audioService.playNightmareBuildup();
        } else if (type === 'LUNAR') {
            audioService.playLunarBuildup();
        }
        
        setTimeout(() => {
            setActiveSequence(null);
            onComplete();
        }, 4000);
    }, []);

    return {
        activeSequence,
        triggerSequence
    };
};