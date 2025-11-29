import { PHRASES, RARITY_TIERS, VARIANTS, MOON_ITEMS } from '../constants';
import { Drop, RarityId, VariantId, ItemData, MoonItem } from '../types';

// --- SCRIPTED RNG SINGLETON ---
class ScriptedRng {
    private targetItemName: string | null = null;
    private targetType: 'ORE' | 'FISH' | 'PLANT' | 'DREAM' | 'NORMAL' | 'GOLD_ORE' | 'PRISM_ORE' | 'MOON' | null = null;
    private rollsRemaining: number = 0;

    setScript(name: string, type: 'ORE' | 'FISH' | 'PLANT' | 'DREAM' | 'NORMAL' | 'GOLD_ORE' | 'PRISM_ORE' | 'MOON', rolls: number) {
        this.targetItemName = name;
        this.targetType = type;
        this.rollsRemaining = rolls;
    }

    // Called by services. If returns name, force that drop.
    checkScript(type: 'ORE' | 'FISH' | 'PLANT' | 'DREAM' | 'NORMAL' | 'GOLD_ORE' | 'PRISM_ORE' | 'MOON'): string | null {
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
  // Check for Scripted Drop first
  const scriptedName = scriptedRng.checkScript('NORMAL');
  if (scriptedName) {
      // Find the item in PHRASES
      for (const [rId, items] of Object.entries(PHRASES['en'])) {
          const found = (items as ItemData[]).find(i => i.text === scriptedName);
          if (found) {
              return {
                  text: found.text,
                  description: found.description,
                  cutscenePhrase: found.cutscenePhrase,
                  rarityId: parseInt(rId) as RarityId,
                  variantId: VariantId.NONE,
                  timestamp: Date.now(),
                  rollNumber: totalRolls + 1
              };
          }
      }
      // If not found, fall back to normal generation
  }

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
    // Sort tiers descending to find correct rarity for the item
    const sortedTiers = Object.values(RARITY_TIERS).sort((a, b) => b.probability - a.probability);

    const getRarityForProbability = (prob: number): RarityId => {
        for(const tier of sortedTiers) {
            // Find the highest tier that this item's probability qualifies for (item prob >= tier prob)
            // e.g. item 200M >= tier 200M (Infinite)
            if (prob >= tier.probability && tier.id !== RarityId.MOON) {
                return tier.id;
            }
        }
        return RarityId.COMMON;
    };

    const scriptedName = scriptedRng.checkScript('MOON');
    if (scriptedName) {
        const found = MOON_ITEMS.find(i => i.text === scriptedName);
        if (found) {
            return {
                text: found.text,
                description: found.description,
                rarityId: getRarityForProbability(found.probability),
                variantId: VariantId.NONE,
                timestamp: Date.now(),
                rollNumber: totalRolls + 1
            };
        }
    }

    const rand = Math.random();
    
    // Sort Moon items by probability (Highest 1-in-X first)
    const sortedItems = [...MOON_ITEMS].sort((a, b) => b.probability - a.probability);

    for (const item of sortedItems) {
        const baseThreshold = 1 / item.probability;
        const threshold = baseThreshold * luckMultiplier; // Luck helps find rare moon items

        if (rand < threshold) {
            return {
                text: item.text,
                description: item.description,
                rarityId: getRarityForProbability(item.probability),
                variantId: VariantId.NONE,
                timestamp: Date.now(),
                rollNumber: totalRolls + 1
            };
        }
    }

    // Fallback to the most common item
    const fallbackItem = sortedItems[sortedItems.length - 1];
    return {
        text: fallbackItem.text,
        description: fallbackItem.description,
        rarityId: getRarityForProbability(fallbackItem.probability),
        variantId: VariantId.NONE,
        timestamp: Date.now(),
        rollNumber: totalRolls + 1
    };
};
