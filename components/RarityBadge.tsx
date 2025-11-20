import React from 'react';
import { RARITY_TIERS, VARIANTS } from '../constants';
import { RarityId, VariantId } from '../types';

interface Props {
  rarityId: RarityId;
  variantId?: VariantId;
  size?: 'sm' | 'md' | 'lg';
  label?: string; // Optional override for localization
}

export const RarityBadge: React.FC<Props> = ({ rarityId, variantId = VariantId.NONE, size = 'md', label }) => {
  const tier = RARITY_TIERS[rarityId];
  const variant = VARIANTS[variantId];
  
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-lg px-4 py-2"
  };

  const style = {
    color: tier.id >= RarityId.LEGENDARY ? tier.textColor.replace('text-', '') : undefined, 
    textShadow: tier.id >= RarityId.MYTHICAL ? `0 0 10px ${tier.shadowColor}, 0 0 20px ${tier.shadowColor}` : 'none',
  };

  // If variant exists, it overrides/adds to the name
  const displayText = variantId !== VariantId.NONE 
      ? `${variant.name.toUpperCase()} ${label || tier.name}` 
      : (label || tier.name);

  // If variant exists, use its border color if possible or keep rarity
  const borderColor = variantId !== VariantId.NONE ? variant.borderClass : tier.color;

  return (
    <span 
      className={`
        ${sizeClasses[size]} 
        border ${borderColor} 
        ${tier.textColor} 
        font-bold uppercase tracking-widest
        bg-black/50 backdrop-blur-sm
        rounded flex items-center gap-2
        ${tier.animate ? 'animate-pulse' : ''}
      `}
      style={{
        boxShadow: tier.id >= RarityId.DIVINE ? `0 0 15px ${tier.shadowColor}` : 'none',
        ...style
      }}
    >
      {variantId !== VariantId.NONE && (
          <span className="text-[10px] bg-white text-black px-1 rounded font-mono">
              x{variant.multiplier}
          </span>
      )}
      {displayText}
    </span>
  );
};