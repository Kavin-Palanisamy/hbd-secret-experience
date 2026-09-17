import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Swords, Trophy, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { micBlowDetector } from '../../utils/micDetection';

interface Scene9CakeBossProps {
  age: number;
  onProceed: () => void;
}

export const Scene9CakeBoss: React.FC<Scene9CakeBossProps> = ({ age, onProceed }) => {
  // Show 5 candles on top of cake
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'failed'>('idle');
  const [bossDefeated, setBossDefeated] = useState<boolean>(false);

  const remainingCandles = candles.filter(Boolean).length;
  const hpPercent = Math.round((remainingCandles / candles.length) * 100);

  // Attempt microphone detection
  useEffect(() => {
    let unmounted = false;

    micBlowDetector.startListening(
      () => {
        if (unmounted) return;
        setMicState('listening');
      },
      () => {
        // Blow detected! Extinguish one candle at a time
        if (unmounted) return;
        setCandles(prev => {
          const firstLitIndex = prev.findIndex(lit => lit);
          if (firstLitIndex !== -1) {
            audioEngine.playBossHit();
            const next = [...prev];
            next[firstLitIndex] = false;
            return next;
          }
          return prev;
        });
      },
      () => {
        if (unmounted) return;
        setMicState('failed');
      }
    );

    return () => {
      unmounted = true;
      micBlowDetector.stopListening();
    };
  }, []);

  const handleExtinguish = (idx: number) => {
    if (!candles[idx]) return;
    audioEngine.playBossHit();
    const next = [...candles];
    next[idx] = false;
    setCandles(next);
  };

  useEffect(() => {
    if (remainingCandles === 0 && !bossDefeated) {
      setBossDefeated(true);
      audioEngine.playBossDefeat();
    }
  }, [remainingCandles, bossDefeated]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 font-sans">
      <div className="w-full max-w-xl mx-auto bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Boss Fight HUD Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
            <Swords className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>FINAL BOSS ENCOUNTER</span>
          </div>
          <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            PHASE: 21.0
          </span>
        </div>

        {/* Boss Title & HP Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-xl sm:text-2xl text-zinc-100 font-black tracking-wide flex items-center gap-2">
              <span>🎂 THE BIRTHDAY CAKE</span>
            </h2>
            <span className="font-mono text-sm font-bold text-rose-400">
              HP: {hpPercent}%
            </span>
          </div>

          <div className="w-full bg-zinc-900 rounded-full h-3.5 overflow-hidden border border-zinc-800">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-rose-500"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-400 font-mono pt-1">
            <span>Objective: EXTINGUISH ALL CANDLES</span>
            <span>Level {age}</span>
          </div>
        </div>

        {/* Microphone / Tap Hints */}
        <div className="text-center font-mono text-xs">
          {micState === 'listening' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>Microphone detected: Try blowing into your mic! (or tap)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
              <MicOff className="w-3.5 h-3.5" />
              <span>Technology betrayed us (or mic off). Tap the candles! 😂</span>
            </div>
          )}
        </div>

        {/* Interactive Boss Cake Visual */}
        <div className="py-6 flex flex-col items-center justify-center">
          {/* Candles Row */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 mb-2">
            {candles.map((isLit, idx) => (
              <div
                key={`candle-${idx}`}
                onClick={() => handleExtinguish(idx)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Flame or Extinguished Smoke */}
                <div className="h-8 flex items-center justify-center">
                  {isLit ? (
                    <div className="relative">
                      <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 blur-[1px] animate-bounce shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-3 rounded-full bg-white blur-[0.5px]" />
                    </div>
                  ) : (
                    <div className="text-zinc-600 font-mono text-[10px] animate-pulse">
                      💨
                    </div>
                  )}
                </div>

                {/* Candle Stick */}
                <div className="w-3.5 sm:w-4 h-12 sm:h-14 rounded-t bg-gradient-to-r from-amber-200 via-white to-amber-100 border border-amber-300 shadow-sm" />
              </div>
            ))}
          </div>

          {/* Cake Layers */}
          <div className="w-48 sm:w-64 h-16 sm:h-20 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border-2 border-amber-500/50 shadow-2xl relative flex items-center justify-center overflow-hidden">
            {/* Frosting Drips */}
            <div className="absolute top-0 inset-x-0 h-4 bg-amber-200 rounded-t-xl opacity-90 shadow" />
            <span className="font-cinzel text-xs font-bold text-amber-100 tracking-widest uppercase relative z-10">
              MILESTONE {age}
            </span>
          </div>
          {/* Cake Base Plate */}
          <div className="w-56 sm:w-72 h-3.5 rounded-full bg-zinc-800 border border-zinc-700 shadow-xl mt-1" />
        </div>

        {/* Boss Defeated Victory Modal */}
        <AnimatePresence>
          {bossDefeated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-3 font-mono"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-widest">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>BOSS DEFEATED!</span>
              </div>

              <div className="text-xs space-y-1 text-zinc-300">
                <p className="font-bold text-emerald-400 uppercase">QUEST REWARDS UNLOCKED:</p>
                <p>+100 HAPPINESS</p>
                <p>+1 NEW YEAR</p>
                <p>+∞ MEMORIES & LAUGHTER</p>
              </div>

              <div className="pt-2">
                <button
                  id="btn-boss-continue"
                  onClick={() => {
                    audioEngine.playTransition();
                    onProceed();
                  }}
                  className="px-8 py-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-cinzel text-xs tracking-widest uppercase transition-colors flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
                >
                  <span>Enter The Quiet Chamber</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
