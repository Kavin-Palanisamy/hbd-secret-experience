import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface IntroSceneProps {
  onStart: () => void;
}

export const IntroScene: React.FC<IntroSceneProps> = ({ onStart }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 3200);
    const t3 = setTimeout(() => setStep(3), 5200);
    const t4 = setTimeout(() => setStep(4), 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleBegin = () => {
    audioEngine.playTransition();
    onStart();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center select-none z-10">
      <div className="max-w-2xl mx-auto flex flex-col items-center space-y-8">
        
        {/* Line 1 */}
        {step >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-zinc-400 font-light tracking-wide italic"
          >
            "This isn't just another birthday wish."
          </motion.p>
        )}

        {/* Line 2 */}
        {step >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-zinc-300 font-normal tracking-wide"
          >
            "It's a little journey..."
          </motion.p>
        )}

        {/* Line 3 */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2"
          >
            <p className="font-cinzel text-lg sm:text-xl md:text-2xl text-amber-200/90 tracking-[0.25em] uppercase font-light text-glow-gold">
              Made for someone special.
            </p>
          </motion.div>
        )}

        {/* Begin Button */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="pt-10"
          >
            <button
              id="begin-journey-btn"
              onClick={handleBegin}
              className="group relative px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-400/40 hover:border-amber-300/80 text-amber-100 font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase transition-all duration-500 shadow-[0_0_35px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(251,191,36,0.4)] flex items-center gap-3 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '12s' }} />
              <span>Begin The Journey</span>
            </button>
            <p className="text-[11px] text-zinc-500 font-light tracking-widest uppercase mt-4">
              Best experienced with sound
            </p>
          </motion.div>
        )}
      </div>

      {/* Skip button if user wants to proceed immediately without waiting for timeouts */}
      {step < 4 && (
        <button
          onClick={() => setStep(4)}
          className="absolute bottom-6 text-[11px] font-mono text-zinc-600 hover:text-zinc-400 tracking-wider transition-colors cursor-pointer"
        >
          Skip intro pause
        </button>
      )}
    </div>
  );
};
