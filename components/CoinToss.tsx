import React, { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';
import { RarityId } from '../types';
import { RARITY_TIERS } from '../constants';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
    onUpdateBalance: (newBalance: number) => void;
}

type CoinSide = 'HEADS' | 'TAILS';

export const CoinToss: React.FC<Props> = ({ isOpen, onClose, balance, onUpdateBalance }) => {
    const [bet, setBet] = useState(100);
    const [pot, setPot] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState<CoinSide | null>(null);
    const [gameOver, setGameOver] = useState(false);

    // Visual intensity mapping based on streak
    const getVisualRarity = (streak: number): RarityId => {
        if (streak < 3) return RarityId.COMMON;
        if (streak < 5) return RarityId.RARE;
        if (streak < 8) return RarityId.EPIC;
        if (streak < 10) return RarityId.LEGENDARY;
        if (streak < 12) return RarityId.DIVINE;
        return RarityId.THE_ONE;
    };

    const currentRarity = getVisualRarity(streak);
    const tier = RARITY_TIERS[currentRarity];

    const handleFlip = (chosenSide: CoinSide) => {
        if (isFlipping || (streak === 0 && balance < bet)) return;
        
        // Deduct initial bet if starting
        if (streak === 0) {
            onUpdateBalance(balance - bet);
            setPot(bet * 2); // Winning doubles immediately essentially
        }

        setIsFlipping(true);
        audioService.playCoinFlip();

        setTimeout(() => {
            const outcome = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
            setResult(outcome);
            setIsFlipping(false);

            if (outcome === chosenSide) {
                // WIN
                audioService.playCoinWin(streak + 1);
                setStreak(s => s + 1);
                setPot(p => p * 2);
            } else {
                // LOSE
                audioService.playCoinLose();
                setGameOver(true);
            }

        }, 1000); // Flip duration
    };

    const handleCashOut = () => {
        audioService.playRaritySound(RarityId.LEGENDARY); // Success sound
        onUpdateBalance(balance + pot); // Initial bet was already deducted, so we add the whole pot back to CURRENT balance (which is old balance - bet)
        // Wait, logic check:
        // Start: Bal 1000. Bet 100. Bal -> 900. Pot -> 200 (Win).
        // Cash out: Bal (900) + Pot (200) = 1100. Profit 100. Correct.
        resetGame();
    };

    const resetGame = () => {
        setStreak(0);
        setPot(0);
        setGameOver(false);
        setResult(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className={`
                relative w-full max-w-lg p-8 rounded-xl border-2 transition-all duration-500 flex flex-col items-center text-center overflow-hidden
                ${gameOver ? 'border-red-900 bg-red-950/20' : tier.color + ' bg-neutral-900'}
            `}
            style={{
                boxShadow: streak > 5 ? `0 0 50px ${tier.shadowColor}` : 'none'
            }}
            >
                {/* Dynamic Background */}
                {streak > 5 && (
                    <div className={`absolute inset-0 opacity-20 pointer-events-none ${tier.animate ? 'animate-pulse' : ''}`}
                         style={{ backgroundColor: tier.shadowColor }}
                    />
                )}

                <div className="relative z-10 w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold font-mono tracking-widest text-white">DOUBLE OR NOTHING</h2>
                        <button onClick={onClose} className="text-neutral-500 hover:text-white">[CLOSE]</button>
                    </div>

                    {/* Coin Visual */}
                    <div className="h-48 flex items-center justify-center mb-8 perspective-500">
                        <div className={`
                            w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold text-white shadow-xl transition-transform duration-500
                            ${isFlipping ? 'animate-spin-y' : ''}
                            ${gameOver ? 'border-red-600 bg-red-900 text-red-200' : 'border-yellow-500 bg-yellow-600'}
                        `}>
                            {isFlipping ? '?' : (result || (streak === 0 ? '$' : result))}
                        </div>
                    </div>

                    {/* Game State */}
                    {gameOver ? (
                        <div className="animate-shake">
                            <h3 className="text-3xl font-bold text-red-500 mb-2">BUSTED</h3>
                            <p className="text-neutral-400 font-mono mb-6">You lost the pot of {pot.toLocaleString()}.</p>
                            <button 
                                onClick={resetGame}
                                className="px-8 py-3 bg-white text-black font-bold font-mono hover:bg-neutral-200"
                            >
                                TRY AGAIN
                            </button>
                        </div>
                    ) : streak > 0 ? (
                        // Active Streak
                        <div className="space-y-6">
                            <div>
                                <div className="text-xs text-neutral-400 font-mono tracking-widest mb-1">CURRENT POT</div>
                                <div className={`text-4xl font-black ${tier.textColor} drop-shadow-lg`}>
                                    {pot.toLocaleString()}
                                </div>
                            </div>
                            
                            <div className="text-sm font-mono text-neutral-500">
                                STREAK: <span className="text-white">{streak}</span> <span className="text-xs opacity-50">(Multiplier: x{Math.pow(2, streak)})</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleFlip('HEADS')}
                                    disabled={isFlipping}
                                    className="py-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-white font-mono font-bold transition-all active:scale-95 disabled:opacity-50"
                                >
                                    HEADS (Double)
                                </button>
                                <button
                                    onClick={() => handleFlip('TAILS')}
                                    disabled={isFlipping}
                                    className="py-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-white font-mono font-bold transition-all active:scale-95 disabled:opacity-50"
                                >
                                    TAILS (Double)
                                </button>
                            </div>

                            <button 
                                onClick={handleCashOut}
                                disabled={isFlipping}
                                className="w-full py-3 bg-green-900/50 hover:bg-green-800 border border-green-600 text-green-400 font-mono tracking-widest rounded transition-all"
                            >
                                CASH OUT ({pot.toLocaleString()})
                            </button>
                        </div>
                    ) : (
                        // Start Screen
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs text-neutral-500 font-mono mb-2">INITIAL BET</label>
                                <div className="flex items-center justify-center gap-4">
                                    <button onClick={() => setBet(Math.max(100, bet - 100))} className="text-neutral-400 hover:text-white">-</button>
                                    <span className="text-2xl font-bold text-white w-32">{bet}</span>
                                    <button onClick={() => setBet(Math.min(balance, bet + 100))} className="text-neutral-400 hover:text-white">+</button>
                                </div>
                                <div className="text-[10px] text-neutral-600 mt-1">MAX: {balance}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleFlip('HEADS')}
                                    disabled={balance < bet}
                                    className="py-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-white font-mono font-bold transition-all active:scale-95 disabled:opacity-50"
                                >
                                    BET HEADS
                                </button>
                                <button
                                    onClick={() => handleFlip('TAILS')}
                                    disabled={balance < bet}
                                    className="py-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-white font-mono font-bold transition-all active:scale-95 disabled:opacity-50"
                                >
                                    BET TAILS
                                </button>
                            </div>
                            {balance < bet && <div className="text-red-500 text-xs font-mono">INSUFFICIENT FUNDS</div>}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes spin-y {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(720deg); }
                }
                .animate-spin-y {
                    animation: spin-y 1s ease-in-out infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.3s linear;
                }
            `}</style>
        </div>
    );
}