import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, PenTool, Sparkles, Heart } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface FutureSceneProps {
  name: string;
  onReplay: () => void;
  onCreateAnother: () => void;
}

export const FutureScene: React.FC<FutureSceneProps> = ({
  name,
  onReplay,
  onCreateAnother
}) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2600);
    const t3 = setTimeout(() => setPhase(3), 4800);
    const t4 = setTimeout(() => setPhase(4), 7000);
    const t5 = setTimeout(() => setPhase(5), 9200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 text-center">
      
      {/* Ethereal Sunrise/Horizon glow background element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-t from-amber-500/10 via-amber-700/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center space-y-7 z-10">
        
        {/* Phase 1: "The past is already a story." */}
        {phase >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-400 italic font-light"
          >
            "The past is already a story."
          </motion.p>
        )}

        {/* Phase 2: "Today is a new page." */}
        {phase >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-2xl sm:text-3xl text-amber-200/90 font-light"
          >
            "Today is a new page."
          </motion.p>
        )}

        {/* Phase 3: Grand Climax Title */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="py-2"
          >
            <h1 className="font-cinzel font-black text-3xl sm:text-5xl md:text-6xl tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
              WRITE SOMETHING AMAZING.
            </h1>
          </motion.div>
        )}

        {/* Phase 4: Personal Signoff */}
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex items-center gap-2 text-zinc-200 font-cinzel text-base sm:text-xl tracking-widest uppercase"
          >
            <span>Happy Birthday, {name}.</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-500" />
          </motion.div>
        )}

        {/* Phase 5: Final Two Options Only */}
        {phase >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            {/* Replay the Journey */}
            <button
              id="replay-journey-btn"
              onClick={() => {
                audioEngine.playClick();
                onReplay();
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400/50 text-zinc-300 hover:text-white font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay the Journey</span>
            </button>

            {/* Create Another Wish */}
            <button
              id="create-another-wish-btn"
              onClick={() => {
                audioEngine.playClick();
                onCreateAnother();
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 hover:border-amber-300 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Another Wish</span>
            </button>
          </motion.div>
        )}
      </div>

      {phase < 5 && (
        <button
          onClick={() => setPhase(5)}
          className="absolute bottom-6 text-[11px] font-mono text-zinc-700 hover:text-zinc-500 tracking-wider transition-colors cursor-pointer"
        >
          Skip to end
        </button>
      )}
    </div>
  );
};
