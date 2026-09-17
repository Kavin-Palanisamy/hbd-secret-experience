import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, ArrowRight, Award } from 'lucide-react';
import { Achievement } from '../../types';
import { audioEngine } from '../../utils/audioEngine';

interface Scene11FinalChaosProps {
  name: string;
  age: number;
  achievements: Achievement[];
  onTriggerSupernova: () => void;
  onProceed: () => void;
}

export const Scene11FinalChaos: React.FC<Scene11FinalChaosProps> = ({
  name,
  age,
  achievements,
  onTriggerSupernova,
  onProceed
}) => {
  const [showAchievements, setShowAchievements] = useState<boolean>(false);

  useEffect(() => {
    // Boom sound + fireworks + resume high energy music
    audioEngine.playCelebrationChime();
    audioEngine.startMusic('beast');
    onTriggerSupernova();

    const t = setTimeout(() => {
      setShowAchievements(true);
    }, 1200);

    return () => clearTimeout(t);
  }, [onTriggerSupernova]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 text-center font-sans">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        
        {/* Massive Celebration Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', damping: 12 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-xs font-mono tracking-widest uppercase mb-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>NEW LEVEL UNLOCKED • LEVEL {age}</span>
          </div>

          <h1 className="font-cinzel font-black text-4xl sm:text-7xl md:text-8xl tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-rose-400 drop-shadow-[0_0_60px_rgba(251,191,36,0.9)]">
            HAPPY BIRTHDAY
          </h1>
          <h2 className="font-cinzel font-black text-3xl sm:text-6xl text-white tracking-widest uppercase">
            {name}
          </h2>
        </motion.div>

        {/* Dynamic Achievements Bento Box */}
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5 text-left"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-cinzel text-sm sm:text-base font-bold tracking-wider">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>UNLOCKED ACHIEVEMENTS ({achievements.length})</span>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-semibold">
                +10,000 XP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-400/40 transition-colors flex items-start gap-3"
                >
                  <span className="text-2xl select-none">{ach.icon}</span>
                  <div>
                    <h3 className="font-cinzel text-xs sm:text-sm font-bold text-zinc-100">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Chapter Button */}
            <div className="pt-4 flex justify-center">
              <button
                id="btn-final-chaos-continue"
                onClick={() => {
                  audioEngine.playTransition();
                  onProceed();
                }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/30 to-amber-600/30 hover:from-amber-500/50 border border-amber-400 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>The Final Threshold</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
