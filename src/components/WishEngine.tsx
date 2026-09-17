import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface WishEngineProps {
  onWishExploded: () => void;
  onContinue: () => void;
}

export const WishEngine: React.FC<WishEngineProps> = ({ onWishExploded, onContinue }) => {
  const [holding, setHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Progressive guidance text
  const getPromptText = () => {
    if (progress < 0.3) return "Think of something you want...";
    if (progress < 0.65) return "Something you hope for...";
    return "Something you never want to lose...";
  };

  const handleExplode = useCallback(() => {
    setIsExploded(true);
    setHolding(false);
    audioEngine.playWishExplosion();
    onWishExploded();
  }, [onWishExploded]);

  const handleStartHold = () => {
    if (isExploded) return;
    setHolding(true);
    startTimeRef.current = Date.now();
    audioEngine.startWishHum();

    const loop = () => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / 3200); // 3.2 seconds charge
      setProgress(currentProgress);
      audioEngine.updateWishHum(currentProgress);

      if (currentProgress < 1) {
        animRef.current = requestAnimationFrame(loop);
      } else {
        handleExplode();
      }
    };

    animRef.current = requestAnimationFrame(loop);
  };

  const handleEndHold = () => {
    if (isExploded) return;
    setHolding(false);
    audioEngine.stopWishHum();
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    // If released before 100%, gently decay
    if (progress < 0.98) {
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
      audioEngine.stopWishHum();
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
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Wish Engine</span>
        </motion.div>

        {!isExploded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            <p className="font-cormorant text-xl sm:text-2xl text-zinc-400 italic">
              "Before we continue..."
            </p>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-zinc-100 font-semibold tracking-wide">
              Make one wish.
            </h2>
          </motion.div>
        )}
      </div>

      {/* Main Orb / Exploded State Container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg min-h-[320px]">
        <AnimatePresence mode="wait">
          {!isExploded ? (
            <motion.div
              key="interactive-orb"
              className="relative flex flex-col items-center"
            >
              {/* Pulsing guidance prompt */}
              <div className="h-10 mb-6 flex items-center justify-center">
                <motion.p
                  key={Math.floor(progress * 3)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-cormorant text-lg sm:text-xl text-amber-200/90 font-light tracking-wide text-center"
                >
                  {holding ? getPromptText() : "Press and hold the celestial core..."}
                </motion.p>
              </div>

              {/* Glowing Orb Touch Area */}
              <div
                id="wish-orb"
                onMouseDown={handleStartHold}
                onMouseUp={handleEndHold}
                onMouseLeave={handleEndHold}
                onTouchStart={handleStartHold}
                onTouchEnd={handleEndHold}
                className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full cursor-pointer flex items-center justify-center transition-transform duration-200 active:scale-95"
              >
                {/* Orbital particles ring */}
                <div
                  className="absolute -inset-4 sm:-inset-6 rounded-full border border-amber-400/30 transition-all duration-300 pointer-events-none"
                  style={{
                    transform: `rotate(${progress * 720}deg) scale(${1 + progress * 0.25})`,
                    borderColor: holding ? 'rgba(251, 191, 36, 0.7)' : 'rgba(251, 191, 36, 0.2)'
                  }}
                />

                {/* Secondary counter-rotating orbital ring */}
                <div
                  className="absolute -inset-8 sm:-inset-10 rounded-full border border-dashed border-amber-300/20 transition-all duration-300 pointer-events-none"
                  style={{
                    transform: `rotate(-${progress * 540}deg) scale(${1 + progress * 0.15})`
                  }}
                />

                {/* The Core Sphere */}
                <div
                  className="w-full h-full rounded-full transition-all duration-150 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, #ffffff 0%, #fbbf24 ${
                      20 + progress * 30
                    }%, #d97706 ${60 + progress * 30}%, #000000 100%)`,
                    boxShadow: `0 0 ${40 + progress * 80}px rgba(251, 191, 36, ${
                      0.4 + progress * 0.6
                    }), 0 0 ${80 + progress * 100}px rgba(245, 158, 11, ${
                      0.2 + progress * 0.4
                    })`
                  }}
                >
                  <div className="text-center pointer-events-none z-10 px-4">
                    <span className="font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-black drop-shadow-sm">
                      {holding ? `${Math.round(progress * 100)}%` : "HOLD"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase mt-6">
                Hold for 3 seconds to ignite
              </p>
            </motion.div>
          ) : (
            /* Post-Explosion Result */
            <motion.div
              key="exploded-message"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-6 max-w-md mx-auto"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                <Sparkles className="w-8 h-8 text-amber-300" />
              </div>

              <div className="space-y-2">
                <h3 className="font-cinzel text-3xl sm:text-4xl text-amber-100 font-bold tracking-wide text-glow-gold">
                  Wish received. ✨
                </h3>
                <p className="font-cormorant text-lg sm:text-xl text-zinc-300 italic">
                  "Held safe in the quiet vault of the universe."
                </p>
                <p className="text-xs text-zinc-500 font-sans tracking-wide pt-1">
                  Some wishes take time, but today the stars are listening.
                </p>
              </div>

              <div className="pt-4">
                <button
                  id="wish-continue-btn"
                  onClick={() => {
                    audioEngine.playTransition();
                    onContinue();
                  }}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 border border-amber-400/50 hover:border-amber-300 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
                >
                  <span>Light The Candles</span>
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
