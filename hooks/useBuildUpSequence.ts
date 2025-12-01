import { useState, useCallback } from 'react';
import { audioService } from '../services/audioService';

export type BuildUpType = 'SPECTRUM' | 'NIGHTMARE' | 'LUNAR' | 'HYPERCUBE' | 'LUCID' | 'WAKING_LIFE';

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
        } else if (type === 'HYPERCUBE') {
            // Audio for Hypercube handled by component or service
        } else if (type === 'LUCID') {
            audioService.playLucidSound();
        } else if (type === 'WAKING_LIFE') {
             // Audio for Waking Life handled by component (optional)
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
