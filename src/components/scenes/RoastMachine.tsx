import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Flame, Check, ShieldAlert } from 'lucide-react';
import { RoastStats } from '../../types';
import { audioEngine } from '../../utils/audioEngine';
import { ProgressBar } from '../ui/ProgressBar';
import { SceneButton } from '../ui/SceneButton';

interface RoastMachineProps {
  roastStats: RoastStats;
  onProceed: () => void;
}

export const RoastMachine: React.FC<RoastMachineProps> = ({
  roastStats,
  onProceed
}) => {
  const [revealed, setRevealed] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      audioEngine.playCelebrationChime();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Professional procrastination', value: roastStats.procrastination, color: 'bg-amber-400' },
    { label: 'Random decisions', value: roastStats.randomDecisions, color: 'bg-rose-400' },
    { label: 'Overthinking', value: roastStats.overthinking, color: 'bg-indigo-400' },
    { label: 'Actually listening', value: roastStats.actuallyListening, color: 'bg-emerald-400' },
    { label: 'Being awesome', value: roastStats.beingAwesome, color: 'bg-yellow-400' },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono">
      <div className="w-full max-w-xl mx-auto space-y-6 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="tracking-widest uppercase">DIAGNOSTIC TELEMETRY REPORT</span>
          </div>
          <span className="text-zinc-400 font-bold">ACCURACY: 0.0%</span>
        </div>

        {/* The Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="space-y-1">
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
              <span>BIRTHDAY HUMAN REPORT</span>
              <Flame className="w-5 h-5 text-rose-400" />
            </h1>
            <p className="text-xs text-zinc-400">
              Autonomous neural cross-examination across behavioral data.
            </p>
          </div>

          {/* Stats list with animated bars */}
          <div className="space-y-4 pt-2">
            {stats.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.12 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">{item.label}</span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
                <ProgressBar
                  progress={revealed ? item.value : 0}
                  color={item.color}
                  showPercent={false}
                />
              </motion.div>
            ))}
          </div>

          {/* Punchline */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400 italic">
              "Scientific accuracy: 0%" 😂
            </span>
            <span className="text-emerald-400 font-bold">
              MARGIN OF ERROR: ±100%
            </span>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <SceneButton
            variant="cyber"
            onClick={() => {
              audioEngine.playTransition();
              onProceed();
            }}
            icon={<Check className="w-4 h-4" />}
          >
            [ I ACCEPT MY FATE ]
          </SceneButton>
        </div>

      </div>
    </div>
  );
};
