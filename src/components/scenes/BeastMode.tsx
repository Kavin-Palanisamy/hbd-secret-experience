import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Flame, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface BeastModeProps {
  name: string;
  age: number;
  onActivateBeast: () => void;
  onProceed: () => void;
}

export const BeastMode: React.FC<BeastModeProps> = ({
  name,
  age,
  onActivateBeast,
  onProceed
}) => {
  const [activated, setActivated] = useState<boolean>(false);

  const handleActivate = () => {
    setActivated(true);
    onActivateBeast();
    audioEngine.startMusic('beast');
    audioEngine.playBeastImpact();

    // Canvas confetti burst
    try {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono text-center overflow-hidden">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        
        <AnimatePresence mode="wait">
          {!activated ? (
            /* Teaser: "You thought that was the ending?" */
            <motion.div
              key="teaser"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="font-mono text-xs text-rose-400 uppercase tracking-[0.3em]">
                  OVERRIDE PROTOCOL // 0xBEAST
                </span>
                <h2 className="font-cormorant text-2xl sm:text-4xl text-zinc-300 italic">
                  "You thought that was the ending?"
                </h2>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-widest">
                  ABSOLUTELY NOT.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <SceneButton
                  variant="cyber"
                  onClick={handleActivate}
                  icon={<Zap className="w-5 h-5 text-yellow-300 fill-current animate-bounce" />}
                  className="text-sm sm:text-base py-4 px-9"
                >
                  ACTIVATE BEAST MODE
                </SceneButton>
              </div>
            </motion.div>
          ) : (
            /* Activated High-Energy Beast Mode Display */
            <motion.div
              key="active-beast"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, type: 'spring', damping: 12 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/30 border border-amber-400 text-amber-200 text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>MAXIMUM POWER CELEBRATION UNLEASHED</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-cinzel font-black text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 tracking-wider uppercase drop-shadow-[0_0_50px_rgba(251,191,36,0.8)]">
                  HAPPY
                </h1>
                <h1 className="font-cinzel font-black text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-300 to-rose-500 tracking-wider uppercase drop-shadow-[0_0_50px_rgba(244,63,94,0.8)]">
                  BIRTHDAY
                </h1>
                <h2 className="font-cinzel font-black text-4xl sm:text-6xl text-amber-300 tracking-widest uppercase drop-shadow-[0_0_40px_rgba(251,191,36,0.7)] pt-2">
                  {name}
                </h2>
              </div>

              <p className="font-cormorant text-xl sm:text-3xl text-zinc-200 italic max-w-xl mx-auto">
                "Level {age} has officially begun. Break all boundaries. Take zero excuses. Make this year unforgettable."
              </p>

              {/* Action Button */}
              <div className="pt-6 flex justify-center">
                <SceneButton
                  variant="primary"
                  onClick={onProceed}
                  icon={<Trophy className="w-4 h-4 text-amber-300" />}
                >
                  VIEW UNLOCKED ACHIEVEMENTS
                </SceneButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
