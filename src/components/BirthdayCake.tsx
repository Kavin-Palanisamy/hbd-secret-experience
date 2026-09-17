import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, Flame, Sparkles, Wind } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { MicBlowDetector } from '../utils/micDetection';

interface BirthdayCakeProps {
  age: number;
  onCandlesBlown: () => void;
  onContinue: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  age,
  onCandlesBlown,
  onContinue
}) => {
  // Number of visual candles (capped at 5 for clean aesthetics and mobile responsiveness)
  const candleCount = Math.min(5, Math.max(3, age % 10 || 3));
  const [extinguished, setExtinguished] = useState<boolean[]>(new Array(candleCount).fill(false));
  const [allBlown, setAllBlown] = useState<boolean>(false);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'denied'>('idle');
  const [micStatusText, setMicStatusText] = useState<string>('');

  const micDetectorRef = useRef<MicBlowDetector | null>(null);

  const activeCandlesLeft = extinguished.filter(e => !e).length;

  const blowOutCandle = (index: number) => {
    setExtinguished(prev => {
      const next = [...prev];
      if (!next[index]) {
        next[index] = true;
        audioEngine.playCandlePuff();
      }
      return next;
    });
  };

  const blowAllCandles = () => {
    audioEngine.playCandlePuff();
    setExtinguished(new Array(candleCount).fill(true));
  };

  // Check if all candles are blown
  useEffect(() => {
    if (activeCandlesLeft === 0 && !allBlown) {
      setAllBlown(true);
      micDetectorRef.current?.stopListening();
      setMicState('idle');

      // 1-second pause before trigger as requested in specification
      const timer = setTimeout(() => {
        audioEngine.playCelebrationChime();
        onCandlesBlown();
        // Automatically transition into Scene 08 (The Silence)
        const nextTimer = setTimeout(() => {
          onContinue();
        }, 1800);
        return () => clearTimeout(nextTimer);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeCandlesLeft, allBlown, onCandlesBlown, onContinue, candleCount]);

  const handleStartMic = async () => {
    audioEngine.playClick();
    micDetectorRef.current = new MicBlowDetector();
    setMicStatusText('Listening... blow into your microphone!');
    const result = await micDetectorRef.current.startListening(() => {
      // Detected blow!
      blowAllCandles();
    });

    if (result.success) {
      setMicState('listening');
    } else {
      setMicState('denied');
      setMicStatusText('Microphone unavailable or denied. Tap candles or use button below.');
    }
  };

  useEffect(() => {
    return () => {
      micDetectorRef.current?.stopListening();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10">
      
      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-cinzel tracking-[0.3em] uppercase text-amber-400 mb-2 flex items-center justify-center gap-2"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>One More Tradition</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-cormorant text-2xl sm:text-4xl text-zinc-100 font-light"
        >
          "Make a wish and extinguish the flame."
        </motion.h2>

        <p className="text-xs text-zinc-400 font-sans tracking-wide mt-2">
          {activeCandlesLeft > 0
            ? `${activeCandlesLeft} candle${activeCandlesLeft > 1 ? 's' : ''} glowing. Tap each flame or blow them out!`
            : "All flames extinguished..."}
        </p>
      </div>

      {/* 3D Tiered Birthday Cake Visual */}
      <div className="relative w-72 sm:w-88 flex flex-col items-center justify-end my-4">
        
        {/* Candle Row */}
        <div className="flex items-end justify-center gap-5 sm:gap-7 mb-0 z-20">
          {extinguished.map((isExt, idx) => (
            <div
              key={`candle-${idx}`}
              onClick={() => !isExt && blowOutCandle(idx)}
              className="relative flex flex-col items-center cursor-pointer group"
              title="Click flame to extinguish"
            >
              {/* Flame or smoke */}
              {!isExt ? (
                <div className="relative mb-1">
                  {/* Flickering Flame Aura */}
                  <div className="w-4 h-6 sm:w-5 sm:h-7 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-full blur-[1px] animate-pulse shadow-[0_0_18px_rgba(251,191,36,0.9)] transform -translate-y-1 transition-all group-hover:scale-125" />
                  <div className="absolute inset-x-1 bottom-1 h-3 bg-white rounded-full opacity-80" />
                </div>
              ) : (
                /* Smoke whisps */
                <motion.div
                  initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -18, scale: 1.4 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-1.5 h-3 bg-zinc-400/50 rounded-full blur-[1px] mb-1"
                />
              )}

              {/* Wick */}
              <div className="w-[2px] h-2.5 bg-zinc-300" />

              {/* Candle Body */}
              <div className="w-3 sm:w-3.5 h-12 sm:h-16 rounded-t-sm bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 shadow-md border-x border-amber-300/40" />
            </div>
          ))}
        </div>

        {/* Top Cake Tier */}
        <div className="relative w-48 sm:w-56 h-14 rounded-2xl bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border border-amber-500/30 shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center justify-center z-10">
          {/* Icing drip pattern */}
          <div className="absolute top-0 inset-x-0 h-3 bg-amber-200/90 rounded-t-2xl shadow-sm" />
          <span className="font-cinzel text-xs tracking-widest text-amber-300 font-semibold uppercase">
            Chapter 21
          </span>
        </div>

        {/* Bottom Cake Tier */}
        <div className="relative w-64 sm:w-76 h-18 -mt-2 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-amber-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center">
          <div className="absolute top-0 inset-x-0 h-2.5 bg-amber-400/30 rounded-t-2xl" />
          {/* Golden decorative plate rim */}
          <div className="absolute -bottom-3 inset-x-[-12px] h-4 rounded-full bg-gradient-to-r from-amber-600/60 via-amber-400 to-amber-600/60 border border-amber-300/50 shadow-lg" />
        </div>
      </div>

      {/* Interaction Controls */}
      <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-sm">
        {activeCandlesLeft > 0 ? (
          <>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Optional Microphone button */}
              {micState === 'idle' && (
                <button
                  id="mic-blow-btn"
                  onClick={handleStartMic}
                  className="px-5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400 text-amber-200 text-xs font-cinzel tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>Blow the Candles</span>
                </button>
              )}

              {/* Tap to blow fallback button */}
              <button
                id="tap-blow-btn"
                onClick={blowAllCandles}
                className="px-5 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-100 text-xs font-cinzel tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Tap to Blow All</span>
              </button>
            </div>

            {/* Mic listening feedback */}
            {micState === 'listening' && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-mono animate-pulse">
                <Mic className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Listening... blow gently into mic!</span>
              </div>
            )}

            {micStatusText && micState === 'denied' && (
              <p className="text-[11px] text-zinc-500 text-center font-sans">
                {micStatusText}
              </p>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-amber-300 font-cinzel text-xs tracking-widest uppercase"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Candles extinguished. Preparing next chapter...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
