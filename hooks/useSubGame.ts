import { useState, useEffect, useRef, useCallback } from 'react';
import { RarityId } from '../types';

interface SubGameConfig<T> {
    storageKey: string;
    dropFn: (luck: number) => T;
    playSound: () => void;
    speed: number;
    luck: number;
    multi: number;
    thresholds: { boom: number; rare: number; boomDivisor: number };
    // New: Allow disabling rarity sounds if needed, or handled externally
    isMuted?: boolean;
}

interface GlobalCallbacks {
    onUpdate: (count: number, bestId: number, gachaCredits: number) => void;
    playBoom: (rarity: RarityId) => void;
    playRare: (rarity: RarityId) => void;
    playCoinWin: (amount: number) => void;
}

// FIX: Added "locked?: boolean" to the InvItem generic constraint below
export function useSubGame<
    T extends { id: number; probability: number },
    InvItem extends { id: number; count: number; discoveredAt: number; locked?: boolean }
>(
    config: SubGameConfig<T>,
    callbacks: GlobalCallbacks
) {
    const [inventory, setInventory] = useState<InvItem[]>(() => {
        try {
            const s = localStorage.getItem(config.storageKey);
            return s ? JSON.parse(s) : [];
        } catch { return []; }
    });

    const [lastBatch, setLastBatch] = useState<T[]>([]);
    const [isAuto, setIsAuto] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        localStorage.setItem(config.storageKey, JSON.stringify(inventory));
    }, [inventory, config.storageKey]);

    const performAction = useCallback(() => {
        // Always play the base action sound (mining/fishing/etc)
        // The parent handles muting this via the function passed in config.playSound
        config.playSound();

        const count = config.multi;
        const batch: T[] = [];
        const updates = new Map<number, number>();

        for (let i = 0; i < count; i++) {
            const item = config.dropFn(config.luck);
            batch.push(item);
            updates.set(item.id, (updates.get(item.id) || 0) + 1);
        }

        setLastBatch(batch);

        setInventory(prev => {
            const next = [...prev];
            updates.forEach((qty, id) => {
                const idx = next.findIndex(x => x.id === id);
                if (idx >= 0) {
                    next[idx].count += qty;
                } else {
                    next.push({ id, count: qty, discoveredAt: Date.now(), locked: false } as any);
                }
            });
            return next;
        });

        let bestItem = batch[0];
        batch.forEach(i => { if (i.probability > bestItem.probability) bestItem = i; });

        const foundGacha = Math.random() < 0.0025;
        callbacks.onUpdate(count, bestItem.id, foundGacha ? 1 : 0);

        if (foundGacha && !config.isMuted) callbacks.playCoinWin(3);

        // Only play rarity sounds if NOT muted
        if (!config.isMuted) {
            if (bestItem.id >= config.thresholds.boom) {
                const estRarity = Math.min(15, Math.floor(bestItem.id / config.thresholds.boomDivisor));
                callbacks.playBoom(estRarity as RarityId);
            } else if (bestItem.id >= config.thresholds.rare) {
                callbacks.playRare(RarityId.RARE);
            }
        }

    }, [config.luck, config.multi, config.dropFn, callbacks, config.playSound, config.thresholds, config.isMuted]);

    const savedCallback = useRef(performAction);

    useEffect(() => {
        savedCallback.current = performAction;
    }, [performAction]);

    useEffect(() => {
        if (isAuto) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = window.setInterval(() => {
                if (savedCallback.current) savedCallback.current();
            }, config.speed);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isAuto, config.speed]);

    return {
        inventory,
        setInventory,
        lastBatch,
        isAuto,
        toggleAuto: () => setIsAuto(p => !p),
        performAction
    };
}