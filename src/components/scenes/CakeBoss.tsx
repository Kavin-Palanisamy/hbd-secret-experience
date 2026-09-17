import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Flame, Skull, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { useMicrophone } from '../../hooks/useMicrophone';
import { ProgressBar } from '../ui/ProgressBar';
import { SceneButton } from '../ui/SceneButton';

interface CakeBossProps {
  onProceed: () => void;
}

export const CakeBoss: React.FC<CakeBossProps> = ({ onProceed }) => {
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [bossDefeated, setBossDefeated] = useState<boolean>(false);
  const [micTried, setMicTried] = useState<boolean>(false);

  // Extinguish next available candle
  const extinguishCandle = (index?: number) => {
    setCandles((prev) => {
      let targetIdx = index;
      if (targetIdx === undefined) {
        // Find first lit candle
        targetIdx = prev.findIndex((lit) => lit);
      }
      if (targetIdx === -1 || targetIdx === undefined || !prev[targetIdx]) return prev;

      const next = [...prev];
      next[targetIdx] = false;
      audioEngine.playCandlePuff();

      const remaining = next.filter((lit) => lit).length;
      if (remaining === 0) {
        setTimeout(() => {
          setBossDefeated(true);
          audioEngine.playBossDefeat();
        }, 500);
      }
      return next;
    });
  };

  const { isListening, hasPermission, errorMessage, startListening, stopListening } = useMicrophone(() => {
    extinguishCandle();
  });

  const handleToggleMic = () => {
    setMicTried(true);
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const litCount = candles.filter(Boolean).length;
  const hp = (litCount / candles.length) * 100;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono text-center">
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Header / Boss HP */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider">
              <Skull className="w-4 h-4" />
              <span>FINAL BOSS: THE BIRTHDAY CAKE</span>
            </div>
            <span className="text-zinc-400 font-mono">LVL 99 CALORIES</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">BOSS HEALTH</span>
              <span className="text-rose-400 font-bold">{Math.round(hp)}%</span>
            </div>
            <ProgressBar progress={hp} color="bg-rose-500" showPercent={false} height="h-2.5" />
          </div>
        </div>

        {/* The Birthday Cake Centerpiece */}
        <div className="relative py-6 flex flex-col items-center justify-center">
          
          {/* Candles */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 mb-2">
            {candles.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => extinguishCandle(idx)}
                className="flex flex-col items-center cursor-pointer group"
                title="Click/Tap or Blow to extinguish"
              >
                {/* Flame */}
                <div className="h-8 flex items-center justify-center">
                  <AnimatePresence>
                    {isLit ? (
                      <motion.div
                        key="flame"
                        animate={{
                          scale: [1, 1.15, 0.95, 1],
                          y: [0, -2, 1, 0],
                        }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="w-4 h-6 rounded-full bg-radial from-yellow-200 via-amber-400 to-rose-500 shadow-[0_0_16px_rgba(245,158,11,0.9)]"
                      />
                    ) : (
                      <motion.div
                        key="smoke"
                        initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: -20, scale: 1.5 }}
                        className="w-2 h-2 rounded-full bg-zinc-400 blur-xs"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Candle Stick */}
                <div className="w-3.5 h-12 rounded-t-sm bg-gradient-to-b from-amber-100 to-amber-300 border border-amber-400/40 shadow-sm relative">
                  <div className="absolute inset-x-0 top-1/3 h-1 bg-rose-400/30" />
                  <div className="absolute inset-x-0 top-2/3 h-1 bg-rose-400/30" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Layers */}
          <div className="w-64 sm:w-80 flex flex-col items-center">
            {/* Top Tier */}
            <div className="w-48 h-10 rounded-t-2xl bg-zinc-900 border border-zinc-700/80 shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-2 bg-amber-400/30" />
              <span className="font-cinzel text-[10px] text-zinc-400 tracking-widest uppercase">
                SWEET YEAR AHEAD
              </span>
            </div>
            {/* Base Tier */}
            <div className="w-full h-14 rounded-b-3xl bg-zinc-950 border-x border-b border-zinc-700/80 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-2.5 bg-rose-500/20" />
              <span className="font-mono text-xs text-zinc-500 tracking-wider">
                EXTINGUISH ALL TO DEFEAT
              </span>
            </div>
          </div>
        </div>

        {/* Boss Defeated State */}
        {bossDefeated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950/90 border border-amber-400/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BOSS DEFEATED</span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm font-mono text-zinc-300 text-left bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
              <div className="text-zinc-500 font-bold uppercase pb-1">REWARDS UNLOCKED:</div>
              <div className="text-emerald-400">+1 YEAR OF UNSTOPPABLE WISDOM</div>
              <div className="text-amber-300">+100 HAPPINESS LEVEL</div>
              <div className="text-indigo-400">+∞ UNFORGETTABLE MEMORIES</div>
            </div>

            <div className="pt-2">
              <SceneButton
                variant="primary"
                onClick={onProceed}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                PROCEED TO SPECIAL MESSAGE
              </SceneButton>
            </div>
          </motion.div>
        ) : (
          /* Controls: Mic & Manual Instructions */
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-3">
              <button
                id="btn-toggle-mic"
                onClick={handleToggleMic}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isListening ? 'BLOW INTO MIC NOW' : 'USE REAL BREATH (MIC)'}</span>
              </button>
            </div>

            {hasPermission === false && (
              <p className="text-xs text-zinc-400 font-mono italic">
                "Fine. Technology failed. Use your finger." 😂
              </p>
            )}

            <p className="text-[11px] text-zinc-500 font-sans">
              Click or tap any burning candle directly to blow it out manually.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
