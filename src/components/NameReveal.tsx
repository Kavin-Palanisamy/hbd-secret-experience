import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface NameRevealProps {
  name: string;
  onContinue: () => void;
}

export const NameReveal: React.FC<NameRevealProps> = ({ name, onContinue }) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    // Stage 1: "Today..."
    const t1 = setTimeout(() => setPhase(1), 600);
    // Stage 2: "the world celebrates..."
    const t2 = setTimeout(() => setPhase(2), 2400);
    // Stage 3: Name reveal + "Happy Birthday"
    const t3 = setTimeout(() => {
      setPhase(3);
      audioEngine.playTransition();
    }, 4500);
    // Stage 4: Show Continue button
    const t4 = setTimeout(() => setPhase(4), 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleNext = () => {
    audioEngine.playClick();
    onContinue();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center select-none z-10">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
        
        {/* Subtitle intro line 1 */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.25em' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="font-cormorant text-xl sm:text-2xl text-zinc-400 uppercase font-light"
          >
            Today...
          </motion.div>
        )}

        {/* Subtitle intro line 2 */}
        {phase >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-300 italic font-light"
          >
            the world celebrates
          </motion.p>
        )}

        {/* Grand Name Reveal */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative py-4 my-2"
          >
            {/* Ambient soft glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-300/20 to-amber-500/10 blur-3xl rounded-full" />

            <h1 className="relative font-cinzel font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.15em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_0_35px_rgba(251,191,36,0.5)]">
              {name.toUpperCase()}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="mt-6 font-cormorant text-2xl sm:text-3xl text-amber-200/80 font-light tracking-[0.2em] uppercase"
            >
              Happy Birthday.
            </motion.p>
          </motion.div>
        )}

        {/* Continue action */}
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="pt-8"
          >
            <button
              id="name-continue-btn"
              onClick={handleNext}
              className="group px-7 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400/50 text-zinc-200 hover:text-amber-200 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>

      {phase < 4 && (
        <button
          onClick={() => setPhase(4)}
          className="absolute bottom-6 text-[11px] font-mono text-zinc-600 hover:text-zinc-400 tracking-wider transition-colors cursor-pointer"
        >
          Skip pause
        </button>
      )}
    </div>
  );
};
