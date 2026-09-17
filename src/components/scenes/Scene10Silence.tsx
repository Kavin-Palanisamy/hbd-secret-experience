import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene10SilenceProps {
  name: string;
  onProceed: () => void;
}

export const Scene10Silence: React.FC<Scene10SilenceProps> = ({ name, onProceed }) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Mute or quiet music for profound emotional impact
    audioEngine.stopMusic();

    const t1 = setTimeout(() => setStage(1), 1000); // Okay...
    const t2 = setTimeout(() => setStage(2), 2600); // Enough chaos.
    const t3 = setTimeout(() => setStage(3), 4400); // There's something I actually want you to know.
    const t4 = setTimeout(() => setStage(4), 6500); // YOU MATTER.
    const t5 = setTimeout(() => setStage(5), 8800); // Not because today is your birthday...
    const t6 = setTimeout(() => setStage(6), 11000); // Button appears

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 sm:p-12 select-none z-20 text-center font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Stage 1 */}
        {stage >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-500 italic font-light"
          >
            "Okay..."
          </motion.p>
        )}

        {/* Stage 2 */}
        {stage >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-400 font-light"
          >
            "Enough chaos."
          </motion.p>
        )}

        {/* Stage 3 */}
        {stage >= 3 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="font-cormorant text-xl sm:text-2xl text-amber-200/80 font-light"
          >
            "There's something I actually want you to know."
          </motion.p>
        )}

        {/* Stage 4: Grand Golden Statement */}
        {stage >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.8 }}
            className="py-4"
          >
            <h1 className="font-cinzel font-black text-4xl sm:text-6xl md:text-7xl tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_0_40px_rgba(251,191,36,0.6)]">
              YOU MATTER.
            </h1>
          </motion.div>
        )}

        {/* Stage 5 */}
        {stage >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            className="space-y-3 font-cormorant text-xl sm:text-2xl text-zinc-300 font-light max-w-xl mx-auto leading-relaxed"
          >
            <p>Not simply because today is your birthday.</p>
            <p className="text-amber-200/90 font-normal">
              But because of who you are every single ordinary day.
            </p>
          </motion.div>
        )}

        {/* Stage 6: Quiet Continue Action */}
        {stage >= 6 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="pt-8"
          >
            <button
              id="btn-silence-continue"
              onClick={() => {
                audioEngine.playTransition();
                onProceed();
              }}
              className="px-8 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400 text-zinc-300 hover:text-white font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center gap-2.5 mx-auto cursor-pointer shadow-lg"
            >
              <span>Celebrate {name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {stage < 6 && (
        <button
          onClick={() => setStage(6)}
          className="absolute bottom-6 text-[10px] font-mono text-zinc-800 hover:text-zinc-600 transition-colors"
        >
          Skip pause
        </button>
      )}
    </div>
  );
};
