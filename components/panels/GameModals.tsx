import React from 'react';
import { Inventory } from '../Inventory';
import { ResourceInventory } from '../ResourceInventory';
import { DreamInventory } from '../DreamInventory';
import { CraftingPanel } from '../CraftingPanel';
import { GachaTerminal } from '../GachaTerminal';
import { Changelog } from '../Changelog';
import { IndexCatalog } from '../IndexCatalog';
import { Achievements } from '../Achievements';
import { CoinToss } from '../CoinToss';
import { ORES, FISH, PLANTS, GOLD_ORES, MOON_ITEMS, PRISM_ORES } from '../../constants';
import { GameStats, InventoryItem, MoonInventoryItem } from '../../types';

interface Props {
    stats: GameStats;
    inventory: InventoryItem[];
    miningGame: any;
    goldMiningGame: any;
    prismMiningGame: any;
    moonInventory: MoonInventoryItem[];
    fishingGame: any;
    harvestingGame: any;
    dreamingGame: any;
    modalsState: {
        isInventoryOpen: boolean;
        isOreInventoryOpen: boolean;
        isFishInventoryOpen: boolean;
        isPlantInventoryOpen: boolean;
        isDreamInventoryOpen: boolean;
        isMoonInventoryOpen: boolean;
        isCraftingOpen: boolean;
        isGachaOpen: boolean;
        isChangelogOpen: boolean;
        isIndexOpen: boolean;
        isAchievementsOpen: boolean;
        isCoinTossOpen: boolean;
        isAdminOpen: boolean;
    };
    setModalsState: any; 
    handlers: {
        handleInspectItem: (item: any) => void;
        handleInspectResource: (item: any) => void;
        toggleLock: (item: any) => void;
        toggleResourceLock: (type: any, id: number) => void;
        handleSellResources: (type: any) => void;
        handleSellDreams: () => void;
        handleSellMoonItems: () => void;
        handleCraftItem: (item: any) => void;
        handleEquipItem: (item: any) => void;
        handleUnequipItem: (item: any) => void;
        handleIndexSelectItem: (item: any, rarity: any) => void;
        setStats: any;
    };
}

export const GameModals: React.FC<Props> = ({ stats, inventory, miningGame, goldMiningGame, prismMiningGame, moonInventory, fishingGame, harvestingGame, dreamingGame, modalsState, setModalsState, handlers }) => {
    const close = (key: string) => setModalsState((prev: any) => ({ ...prev, [key]: false }));

    const combinedOreInventory = [...miningGame.inventory, ...goldMiningGame.inventory, ...prismMiningGame.inventory];
    const combinedOreDefs = [...ORES, ...GOLD_ORES, ...PRISM_ORES];

    return (
        <>
            <Inventory
                items={inventory}
                isOpen={modalsState.isInventoryOpen}
                onClose={() => close('isInventoryOpen')}
                onInspect={handlers.handleInspectItem}
                onToggleLock={handlers.toggleLock}
            />

            <ResourceInventory
                items={combinedOreInventory}
                definitions={combinedOreDefs}
                isOpen={modalsState.isOreInventoryOpen}
                onClose={() => close('isOreInventoryOpen')}
                onSell={() => { handlers.handleSellResources('ORES'); handlers.handleSellResources('GOLD_ORES'); handlers.handleSellResources('PRISM_ORES'); }}
                onToggleLock={(item) => handlers.toggleResourceLock(item.id > 2000 ? 'PRISM_ORES' : item.id > 1000 ? 'GOLD_ORES' : 'ORES', item.id)}
                onInspect={handlers.handleInspectResource}
                config={{
                    title: "ORE SILO",
                    itemName: "RES",
                    valueDivisor: 5,
                    themeColor: "text-white",
                    borderColor: "border-neutral-700",
                    bgColor: "bg-neutral-900",
                    emptyIcon: "∅",
                    emptyText: "SILO EMPTY. START MINING."
                }}
            />

            <ResourceInventory
                items={fishingGame.inventory}
                definitions={FISH}
                isOpen={modalsState.isFishInventoryOpen}
                onClose={() => close('isFishInventoryOpen')}
                onSell={() => handlers.handleSellResources('FISH')}
                onToggleLock={(item) => handlers.toggleResourceLock('FISH', item.id)}
                onInspect={handlers.handleInspectResource}
                config={{
                    title: "CRYO TANK",
                    itemName: "SPECIMENS",
                    valueDivisor: 4,
                    themeColor: "text-cyan-400",
                    borderColor: "border-cyan-900",
                    bgColor: "bg-cyan-950/20",
                    emptyIcon: "~ ~ ~",
                    emptyText: "TANK EMPTY. CAST NET."
                }}
            />

            <ResourceInventory
                items={harvestingGame.inventory}
                definitions={PLANTS}
                isOpen={modalsState.isPlantInventoryOpen}
                onClose={() => close('isPlantInventoryOpen')}
                onSell={() => handlers.handleSellResources('PLANTS')}
                onToggleLock={(item) => handlers.toggleResourceLock('PLANTS', item.id)}
                onInspect={handlers.handleInspectResource}
                config={{
                    title: "GREENHOUSE",
                    itemName: "PLANTS",
                    valueDivisor: 4.5,
                    themeColor: "text-green-400",
                    borderColor: "border-green-900",
                    bgColor: "bg-green-950/20",
                    emptyIcon: "❀",
                    emptyText: "GREENHOUSE EMPTY. START HARVESTING."
                }}
            />

            <DreamInventory
                items={dreamingGame.inventory}
                isOpen={modalsState.isDreamInventoryOpen}
                onClose={() => close('isDreamInventoryOpen')}
                onSell={handlers.handleSellDreams}
            />

            <ResourceInventory
                items={moonInventory}
                // Mapping text to name here to satisfy ResourceInventory props
                definitions={MOON_ITEMS.map(m => ({
                    id: m.id,
                    name: m.text, 
                    tierName: 'Moon', 
                    color: 'text-slate-300', 
                    glowColor: '#cbd5e1',
                    probability: m.probability,
                    description: m.description,
                    rarityId: m.rarityId
                }))}
                isOpen={modalsState.isMoonInventoryOpen}
                onClose={() => close('isMoonInventoryOpen')}
                onSell={handlers.handleSellMoonItems}
                onToggleLock={(item) => handlers.toggleResourceLock('MOON', item.id)}
                onInspect={handlers.handleInspectResource}
                config={{
                    title: "LUNAR VAULT",
                    itemName: "SAMPLES",
                    valueDivisor: 10,
                    themeColor: "text-slate-200",
                    borderColor: "border-slate-600",
                    bgColor: "bg-slate-900",
                    emptyIcon: "☾",
                    emptyText: "VAULT EMPTY. VISIT THE MOON."
                }}
            />

            <CraftingPanel
                isOpen={modalsState.isCraftingOpen}
                onClose={() => close('isCraftingOpen')}
                stats={stats}
                oreInventory={combinedOreInventory}
                fishInventory={fishingGame.inventory}
                plantInventory={harvestingGame.inventory}
                dreamInventory={dreamingGame.inventory}
                moonInventory={moonInventory}
                onCraft={handlers.handleCraftItem}
                onEquip={handlers.handleEquipItem}
                onUnequip={handlers.handleUnequipItem}
            />

            <GachaTerminal
                isOpen={modalsState.isGachaOpen}
                onClose={() => close('isGachaOpen')}
                stats={stats}
                onUpdateStats={(newStats) => handlers.setStats((prev: any) => ({ ...prev, ...newStats }))}
            />

            <Changelog isOpen={modalsState.isChangelogOpen} onClose={() => close('isChangelogOpen')} />

            <IndexCatalog
                isOpen={modalsState.isIndexOpen}
                onClose={() => close('isIndexOpen')}
                inventory={inventory}
                oreInventory={combinedOreInventory}
                prismInventory={prismMiningGame.inventory}
                fishInventory={fishingGame.inventory}
                plantInventory={harvestingGame.inventory}
                dreamInventory={dreamingGame.inventory}
                moonInventory={moonInventory} 
                onSelectItem={handlers.handleIndexSelectItem}
            />

            <Achievements
                isOpen={modalsState.isAchievementsOpen}
                onClose={() => close('isAchievementsOpen')}
                stats={stats}
                onEquipTitle={(title) => handlers.setStats((prev: any) => ({ ...prev, equippedTitle: title }))}
            />

            <CoinToss
                isOpen={modalsState.isCoinTossOpen}
                onClose={() => close('isCoinTossOpen')}
                balance={stats.balance}
                onUpdateBalance={(newBal) => handlers.setStats((prev: any) => ({ ...prev, balance: newBal }))}
            />
        </>
    );
}
