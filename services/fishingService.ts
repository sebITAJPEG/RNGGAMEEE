
import { FISH } from '../constants';
import { Fish } from '../types';
import { scriptedRng } from './rngService';

export const catchFish = (luckMultiplier: number = 1): Fish => {
  const scriptedName = scriptedRng.checkScript('FISH');
  if (scriptedName) {
      const found = FISH.find(f => f.name === scriptedName);
      if (found) return found;
  }

  const rand = Math.random();
  
  // Sort fish by probability (rare to common)
  const sortedFish = [...FISH].sort((a, b) => b.probability - a.probability);

  for (const fish of sortedFish) {
    const baseThreshold = 1 / fish.probability;
    const threshold = baseThreshold * luckMultiplier;
    
    if (rand < threshold) {
      return fish;
    }
  }

  // Fallback to lowest tier
  return FISH[0];
};
