
import { ORES } from '../constants';
import { Ore } from '../types';

export const mineOre = (luckMultiplier: number = 1): Ore => {
  const rand = Math.random();
  
  // Sort ores by probability (rare to common) to check rarest first
  const sortedOres = [...ORES].sort((a, b) => b.probability - a.probability);

  for (const ore of sortedOres) {
    const baseThreshold = 1 / ore.probability;
    const threshold = baseThreshold * luckMultiplier;
    
    if (rand < threshold) {
      return ore;
    }
  }

  // Fallback to lowest tier (Stone)
  return ORES[0];
};
