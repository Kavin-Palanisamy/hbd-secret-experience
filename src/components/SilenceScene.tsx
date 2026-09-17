import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { audioEngine } from '../utils/audioEngine';

interface SilenceSceneProps {
  onContinue: () => void;
}

export const SilenceScene: React.FC<SilenceSceneProps> = ({ onContinue }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Step 1: "And now..."
    const t1 = setTimeout(() => setStep(1), 1200);
    // Step 2: "For a moment..."
    const t2 = setTimeout(() => setStep(2), 3200);
    // Step 3: "Just remember..."
    const t3 = setTimeout(() => setStep(3), 5400);
    // Step 4: "YOU ARE IMPORTANT."
    const t4 = setTimeout(() => {
      setStep(4);
      audioEngine.playTransition();
    }, 7800);
    // Step 5: "More than you probably realize."
    const t5 = setTimeout(() => setStep(5), 10500);
    // Transition into Final Celebration
    const t6 = setTimeout(() => onContinue(), 13800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onContinue]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 text-center select-none z-10 bg-black">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center space-y-6">
        
        {/* Step 1: And now... */}
        {step >= 1 && step < 4 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-400 italic font-light"
          >
            And now...
          </motion.p>
        )}

        {/* Step 2: For a moment... */}
        {step >= 2 && step < 4 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-300 font-light"
          >
            For a moment...
          </motion.p>
        )}

        {/* Step 3: Just remember... */}
        {step >= 3 && step < 4 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-200 font-light"
          >
            Just remember...
          </motion.p>
        )}

        {/* Step 4: Grand reveal "YOU ARE IMPORTANT." */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h1 className="font-cinzel font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.2em] sm:tracking-[0.25em] text-zinc-100 text-glow-white">
              YOU ARE IMPORTANT.
            </h1>

            {step >= 5 && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="font-cormorant text-xl sm:text-2xl md:text-3xl text-amber-200/90 italic font-light tracking-wide pt-2"
              >
                "More than you probably realize."
              </motion.p>
            )}
          </motion.div>
        )}
      </div>

      {/* Gentle skip if desired */}
      <button
        onClick={onContinue}
        className="absolute bottom-6 text-[11px] font-mono text-zinc-700 hover:text-zinc-500 tracking-wider transition-colors cursor-pointer"
      >
        Skip silence
      </button>
    </div>
  );
};
