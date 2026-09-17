import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface EmotionalMessageProps {
  name: string;
  birthdayMessage: string;
  handwrittenSignoff: string;
  senderName: string;
  onProceed: () => void;
}

export const EmotionalMessage: React.FC<EmotionalMessageProps> = ({
  name,
  birthdayMessage,
  handwrittenSignoff,
  senderName,
  onProceed
}) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    // Silence audio completely for pure intimacy and focus
    audioEngine.stopMusic();

    // Typographic pacing
    const t1 = setTimeout(() => setPhase(1), 1200); // "Okay."
    const t2 = setTimeout(() => setPhase(2), 2600); // "Now seriously."
    const t3 = setTimeout(() => setPhase(3), 4200); // "Behind all the jokes..."
    const t4 = setTimeout(() => setPhase(4), 5800); // The full letter reveal

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-sans text-center">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        
        {/* Typographic Prelude */}
        <AnimatePresence mode="wait">
          {phase < 4 ? (
            <div className="min-h-[160px] flex flex-col items-center justify-center space-y-3">
              {phase >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-cormorant text-2xl sm:text-3xl text-zinc-400 italic"
                >
                  "Okay."
                </motion.p>
              )}

              {phase >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-cormorant text-2xl sm:text-3xl text-zinc-300 italic"
                >
                  "Now seriously."
                </motion.p>
              )}

              {phase >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-cormorant text-2xl sm:text-3xl text-amber-200/90 italic"
                >
                  "Behind all the jokes..."
                </motion.p>
              )}
            </div>
          ) : (
            /* Full emotional heartfelt reveal */
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl text-left space-y-8"
            >
              <div className="space-y-2 border-b border-zinc-800/80 pb-6 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-mono tracking-widest uppercase">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>UNFILTERED TRUTH</span>
                </div>
                <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide">
                  YOU ARE IMPORTANT.
                </h1>
                <p className="font-cormorant text-zinc-400 italic text-lg">
                  To {name}, from the bottom of my heart.
                </p>
              </div>

              {/* Message Body */}
              <div className="space-y-4 font-sans text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-line">
                {birthdayMessage}
              </div>

              {/* Signoff */}
              <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="font-cormorant text-lg italic text-amber-300/80">
                    {handwrittenSignoff}
                  </div>
                  <div className="font-cinzel font-bold text-sm text-zinc-200 tracking-wider mt-1">
                    {senderName}
                  </div>
                </div>

                <SceneButton
                  variant="primary"
                  onClick={onProceed}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  EXPLORE MEMORY WALL
                </SceneButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
