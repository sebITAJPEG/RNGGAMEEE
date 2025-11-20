
import React, { useState, useEffect, useRef } from 'react';
import { GameStats } from '../types';
import { GACHA_CONFIG, GACHA_CREDIT_COST } from '../constants';
import { audioService } from '../services/audioService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onUpdateStats: (newStats: Partial<GameStats>) => void;
}

export const GachaTerminal: React.FC<Props> = ({ isOpen, onClose, stats, onUpdateStats }) => {
  const [reels, setReels] = useState<string[]>(['-', '-', '-']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState("INSERT CREDIT");

  if (!isOpen) return null;

  const getRandomSymbol = () => {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const sym of GACHA_CONFIG.SYMBOLS) {
        sum += sym.weight;
        if (rand <= sum) return sym;
    }
    return GACHA_CONFIG.SYMBOLS[GACHA_CONFIG.SYMBOLS.length - 1];
  };

  const handleSpin = () => {
    if (isSpinning) return;
    if (stats.gachaCredits < 1) {
        setMessage("INSUFFICIENT CREDITS");
        return;
    }

    // Deduct credit
    onUpdateStats({ gachaCredits: stats.gachaCredits - 1 });
    setIsSpinning(true);
    setMessage("SPINNING...");
    setLastWin(0);
    
    // Start Animation Loop
    const interval = setInterval(() => {
        setReels(prev => [
            getRandomSymbol().char,
            getRandomSymbol().char,
            getRandomSymbol().char
        ]);
        audioService.playSlotSpin();
    }, 100);

    // Stop Reel 1
    setTimeout(() => {
        const s1 = getRandomSymbol();
        // Stop Reel 2
        setTimeout(() => {
            const s2 = getRandomSymbol();
            // Stop Reel 3
            setTimeout(() => {
                clearInterval(interval);
                const s3 = getRandomSymbol();
                setReels([s1.char, s2.char, s3.char]);
                setIsSpinning(false);
                audioService.playSlotStop();
                checkWin(s1, s2, s3);
            }, GACHA_CONFIG.DELAY_BETWEEN_REELS);
        }, GACHA_CONFIG.DELAY_BETWEEN_REELS);
    }, GACHA_CONFIG.SPIN_DURATION);
  };

  const checkWin = (s1: any, s2: any, s3: any) => {
      // Logic: 
      // 3 of a kind = Jackpot of that symbol
      // If Skull is present = Lose (unless 3 skulls, but skull multiplier is 0)
      
      let winAmount = 0;

      if (s1.id === s2.id && s2.id === s3.id) {
          // 3 Match
          winAmount = 1000 * s1.multiplier;
      } else if (s1.id !== 'SKULL' && s2.id !== 'SKULL' && s3.id !== 'SKULL') {
          // Any 3 non-skull symbols
          // Small consolation prize
          winAmount = 50;
      }

      if (winAmount > 0) {
          setMessage(`WIN: ${winAmount.toLocaleString()}`);
          setLastWin(winAmount);
          audioService.playSlotWin();
          onUpdateStats({ balance: stats.balance + winAmount });
      } else {
          setMessage("NO WIN");
      }
  };

  const buyCredit = () => {
      if (stats.balance >= GACHA_CREDIT_COST) {
          onUpdateStats({ 
              balance: stats.balance - GACHA_CREDIT_COST,
              gachaCredits: stats.gachaCredits + 1
          });
          audioService.playClick();
      }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="w-full max-w-md bg-neutral-900 border-2 border-purple-500 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col overflow-hidden relative">
         
         {/* Header */}
         <div className="bg-purple-900/20 p-4 border-b border-purple-800 flex justify-between items-center">
             <h2 className="text-xl font-bold font-mono text-purple-400 tracking-widest animate-pulse">GACHA TERMINAL</h2>
             <button onClick={onClose} className="text-purple-500 hover:text-white">[X]</button>
         </div>

         {/* Screen */}
         <div className="bg-black p-8 flex flex-col items-center justify-center relative">
             <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
             
             {/* Reels */}
             <div className="flex gap-4 mb-8">
                 {reels.map((char, i) => (
                     <div key={i} className="w-20 h-24 bg-neutral-900 border border-neutral-700 rounded flex items-center justify-center text-5xl font-mono text-white shadow-inner relative overflow-hidden">
                         <span className={`relative z-10 ${isSpinning ? 'blur-sm' : ''}`}>{char}</span>
                         <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                     </div>
                 ))}
             </div>

             {/* Message Display */}
             <div className="w-full bg-purple-900/30 border border-purple-600 p-2 text-center text-purple-300 font-mono text-lg font-bold mb-4">
                 {message}
             </div>
         </div>

         {/* Controls */}
         <div className="p-6 bg-neutral-800 border-t border-neutral-700 flex flex-col gap-4">
             <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                 <span>BALANCE: <span className="text-yellow-500">{stats.balance.toLocaleString()}</span></span>
                 <span>CREDITS: <span className="text-purple-400 text-lg font-bold">{stats.gachaCredits}</span></span>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={buyCredit}
                    disabled={stats.balance < GACHA_CREDIT_COST || isSpinning}
                    className="py-4 bg-neutral-900 border border-neutral-600 hover:border-white text-neutral-400 hover:text-white font-mono text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50"
                 >
                     <span>BUY CREDIT</span>
                     <span className="text-yellow-500">-{GACHA_CREDIT_COST.toLocaleString()}</span>
                 </button>

                 <button 
                    onClick={handleSpin}
                    disabled={stats.gachaCredits < 1 || isSpinning}
                    className={`
                        py-4 border font-mono font-bold text-lg tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isSpinning ? 'bg-purple-900 border-purple-700 text-purple-300' : 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'}
                    `}
                 >
                     SPIN
                 </button>
             </div>
             
             <div className="text-[10px] text-neutral-500 text-center font-mono">
                 JACKPOT: 500,000 PTS + 7-7-7
             </div>
         </div>

      </div>
    </div>
  );
};
