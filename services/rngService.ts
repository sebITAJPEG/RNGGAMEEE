
import { PHRASES, RARITY_TIERS, VARIANTS } from '../constants';
import { Drop, RarityId, VariantId, ItemData } from '../types';

export const generateDrop = (totalRolls: number, luckMultiplier: number = 1): Drop => {
  const rand = Math.random();
  
  // Iterate from highest rarity to lowest
  const tiers = Object.values(RARITY_TIERS).sort((a, b) => b.id - a.id);

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
          // e.g. if Multiplier is 10, chance is 0.1
          // We don't apply luck multiplier to variants to keep them purely RNG prestige
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