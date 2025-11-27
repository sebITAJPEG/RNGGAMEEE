import { PHRASES, RARITY_TIERS, VARIANTS, MOON_ITEMS } from '../constants';
import { Drop, RarityId, VariantId, ItemData, MoonItem } from '../types';

// --- SCRIPTED RNG SINGLETON ---
class ScriptedRng {
    private targetItemName: string | null = null;
    private targetType: 'ORE' | 'FISH' | 'PLANT' | 'DREAM' | null = null;
    private rollsRemaining: number = 0;

    setScript(name: string, type: 'ORE' | 'FISH' | 'PLANT' | 'DREAM', rolls: number) {
        this.targetItemName = name;
        this.targetType = type;
        this.rollsRemaining = rolls;
    }

    // Called by services. If returns name, force that drop.
    checkScript(type: 'ORE' | 'FISH' | 'PLANT' | 'DREAM'): string | null {
        if (!this.targetItemName || this.targetType !== type || this.rollsRemaining <= 0) return null;

        this.rollsRemaining--;
        
        if (this.rollsRemaining === 0) {
            const name = this.targetItemName;
            // Clear script
            this.targetItemName = null;
            this.targetType = null;
            this.rollsRemaining = 0;
            return name;
        }
        
        return null;
    }
    
    // Debug info
    getStatus() {
        if (!this.targetItemName) return "No script active.";
        return `Finding [${this.targetItemName}] in ${this.rollsRemaining} rolls.`;
    }
}

export const scriptedRng = new ScriptedRng();

// --- STANDARD RNG ---

export const generateDrop = (totalRolls: number, luckMultiplier: number = 1): Drop => {
  const rand = Math.random();
  
  // Iterate from highest rarity to lowest
  const tiers = Object.values(RARITY_TIERS).sort((a, b) => b.id - a.id).filter(t => t.id !== RarityId.MOON);

  let selectedTier = RARITY_TIERS[RarityId.COMMON];

  for (const tier of tiers) {
    const baseThreshold = 1 / tier.probability;
    const threshold = baseThreshold * luckMultiplier;
    
    if (rand < threshold) {
      selectedTier = tier;
      break;
    }
  }

  const potentialItems = PHRASES['en'][selectedTier.id];
  const item = potentialItems[Math.floor(Math.random() * potentialItems.length)] as ItemData;

  // Variant Logic (Only for EPIC+)
  let selectedVariantId = VariantId.NONE;
  if (selectedTier.id >= RarityId.EPIC) {
      const variantRand = Math.random();
      // Sort variants by multiplier (highest first -> rarest)
      const variants = Object.values(VARIANTS)
        .filter(v => v.id !== VariantId.NONE)
        .sort((a, b) => b.multiplier - a.multiplier);

      for (const variant of variants) {
          // 1 in X chance based on multiplier
          const chance = 1 / variant.multiplier; 
          if (variantRand < chance) {
              selectedVariantId = variant.id;
              break;
          }
      }
  }

  return {
    text: item.text,
    description: item.description,
    cutscenePhrase: item.cutscenePhrase,
    rarityId: selectedTier.id,
    variantId: selectedVariantId,
    timestamp: Date.now(),
    rollNumber: totalRolls + 1
  };
};

// NEW: Moon Drop Logic
export const generateMoonDrop = (totalRolls: number, luckMultiplier: number = 1): Drop => {
    const rand = Math.random();
    
    // Sort Moon items by probability (Highest probability first, but logic is inverse: rarest is 1/small)
    // Actually, items like 1 in 250,000,000 have VERY LOW chance.
    // We iterate from RAREST (highest 1-in-X value) to COMMON.
    // probability field is "1 in X". 
    
    const sortedItems = [...MOON_ITEMS].sort((a, b) => b.probability - a.probability);

    for (const item of sortedItems) {
        const baseThreshold = 1 / item.probability;
        const threshold = baseThreshold * luckMultiplier; // Luck helps find rare moon items

        if (rand < threshold) {
            return {
                text: item.text,
                description: item.description,
                rarityId: RarityId.MOON,
                variantId: VariantId.NONE, // No variants on Moon for simplicity, or add if desired
                timestamp: Date.now(),
                rollNumber: totalRolls + 1
            };
        }
    }

    // Fallback to the most common item (last in sorted list if we sorted Descending by prob? No wait.)
    // If sorted Descending by 'probability' value (e.g. 250m first, 10 last), 
    // then we checked rarest first. If loop finishes, we get the common one.
    return {
        text: sortedItems[sortedItems.length - 1].text,
        description: sortedItems[sortedItems.length - 1].description,
        rarityId: RarityId.MOON,
        variantId: VariantId.NONE,
        timestamp: Date.now(),
        rollNumber: totalRolls + 1
    };
};
