import React from 'react';
import { motion } from 'motion/react';
import { Award, ArrowRight, Sparkles } from 'lucide-react';
import { Achievement } from '../../types';
import { SceneButton } from '../ui/SceneButton';

interface AchievementsProps {
  achievements: Achievement[];
  onProceed: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({
  achievements,
  onProceed
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono text-center">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>HALL OF LEGENDS // UNLOCKED BADGES</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wider">
            EARNED ACHIEVEMENTS
          </h1>
          <p className="text-xs text-zinc-400 font-sans">
            Recognized milestones achieved across your journey around the sun.
          </p>
        </div>

        {/* 6 Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.09, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-zinc-950/80 border border-zinc-800/80 hover:border-amber-400/50 rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-[10px] font-mono text-amber-400/80 tracking-widest uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  UNLOCKED
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-cinzel font-bold text-sm text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proceed Button */}
        <div className="pt-4 flex justify-center">
          <SceneButton
            variant="primary"
            onClick={onProceed}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            SYSTEM CONCLUDING...
          </SceneButton>
        </div>

      </div>
    </div>
  );
};
