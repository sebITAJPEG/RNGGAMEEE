import { ORES, GOLD_ORES, PRISM_ORES } from '../constants';
import { Ore } from '../types';
import { scriptedRng } from './rngService';

export const mineOre = (luckMultiplier: number = 1, dimension: 'NORMAL' | 'GOLD' | 'PRISM' = 'NORMAL'): Ore => {
  // Check for scripted find
  let scriptType: any = 'ORE';
  if (dimension === 'GOLD') scriptType = 'GOLD_ORE';
  else if (dimension === 'PRISM') scriptType = 'PRISM_ORE';

  const scriptedName = scriptedRng.checkScript(scriptType);
  if (scriptedName) {
      let sourceOres = ORES;
      if (dimension === 'GOLD') sourceOres = GOLD_ORES;
      else if (dimension === 'PRISM') sourceOres = PRISM_ORES;
      
      const found = sourceOres.find(o => o.name === scriptedName);
      if (found) return found;
      
      // Fallback search in all ores just in case
      const anyFound = [...ORES, ...GOLD_ORES, ...PRISM_ORES].find(o => o.name === scriptedName);
      if(anyFound) return anyFound;
  }

  const rand = Math.random();
  
  // Select the correct ore list based on dimension
  let sourceOres = ORES;
  if (dimension === 'GOLD') sourceOres = GOLD_ORES;
  else if (dimension === 'PRISM') sourceOres = PRISM_ORES;

  // Sort ores by probability (rare to common) to check rarest first
  const sortedOres = [...sourceOres].sort((a, b) => b.probability - a.probability);

  for (const ore of sortedOres) {
    const baseThreshold = 1 / ore.probability;
    const threshold = baseThreshold * luckMultiplier;
    
    if (rand < threshold) {
      return ore;
    }
  }

  // Fallback to lowest tier of the current dimension
  return sortedOres[sortedOres.length - 1];
};
