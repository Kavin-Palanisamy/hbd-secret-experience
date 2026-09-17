import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface FinalRevealProps {
  name: string;
  finalQuotes: string[];
  onContinue: () => void;
}

export const FinalReveal: React.FC<FinalRevealProps> = ({
  name,
  finalQuotes,
  onContinue
}) => {
  useEffect(() => {
    audioEngine.playCelebrationChime();

    // Trigger celebratory confetti burst
    const end = Date.now() + 2500;
    const colors = ['#fbbf24', '#f59e0b', '#ec4899', '#6366f1', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
        
        {/* Top celebratory badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-cinzel text-xs tracking-[0.3em] uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The New Chapter Begins</span>
        </motion.div>

        {/* Grand Typography Celebration */}
        <div className="space-y-1 sm:space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-cinzel font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[0.25em] text-zinc-200"
          >
            HAPPY
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-cinzel font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[0.25em] text-amber-300 text-glow-gold"
          >
            BIRTHDAY
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-cinzel font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] pt-2"
          >
            {name.toUpperCase()}
          </motion.h1>
        </div>

        {/* Chapter Wish Lines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="space-y-2 pt-4"
        >
          <p className="font-cormorant text-xl sm:text-2xl text-amber-200 font-normal italic tracking-wide">
            "Here's to another chapter."
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-md mx-auto pt-2 text-zinc-300 font-sans text-xs sm:text-sm tracking-wider uppercase">
            {finalQuotes.map((quote, idx) => (
              <motion.div
                key={`quote-${idx}`}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + idx * 0.2 }}
                className="flex items-center gap-2 justify-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{quote}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="pt-6"
        >
          <button
            id="reveal-continue-btn"
            onClick={() => {
              audioEngine.playTransition();
              onContinue();
            }}
            className="px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-amber-500/25 via-amber-400/35 to-amber-600/25 hover:from-amber-500/40 hover:to-amber-500/40 border border-amber-400/60 hover:border-amber-300 text-amber-100 font-cinzel text-xs sm:text-sm tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center gap-3 cursor-pointer"
          >
            <span>The Final Horizon</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
