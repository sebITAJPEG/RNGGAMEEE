
import { PLANTS } from '../constants';
import { Plant } from '../types';

export const harvestPlant = (luckMultiplier: number = 1): Plant => {
  const rand = Math.random();
  
  // Sort plants by probability (rare to common)
  const sortedPlants = [...PLANTS].sort((a, b) => b.probability - a.probability);

  for (const plant of sortedPlants) {
    const baseThreshold = 1 / plant.probability;
    const threshold = baseThreshold * luckMultiplier;
    
    if (rand < threshold) {
      return plant;
    }
  }

  // Fallback to lowest tier
  return PLANTS[0];
};
