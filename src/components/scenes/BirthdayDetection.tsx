import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, ArrowRight, Sparkles, Cake } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface BirthdayDetectionProps {
  name: string;
  onTriggerBurst: () => void;
  onProceed: () => void;
}

export const BirthdayDetection: React.FC<BirthdayDetectionProps> = ({
  name,
  onTriggerBurst,
  onProceed
}) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    // 0: Freeze & Glitch
    audioEngine.playGlitch();

    // 1: "WAIT. Something doesn't make sense."
    const t1 = setTimeout(() => {
      setPhase(1);
      audioEngine.playTypingBeep();
    }, 1200);

    // 2: DATE CHECK (Calendar ✓ Database ✓ Reality ✓)
    const t2 = setTimeout(() => {
      setPhase(2);
      audioEngine.playTypingBeep();
    }, 2800);

    // 3: RESULT: IT'S YOUR BIRTHDAY!
    const t3 = setTimeout(() => {
      setPhase(3);
      audioEngine.playSuccessChime();
      onTriggerBurst();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onTriggerBurst]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono text-center">
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        <AnimatePresence mode="wait">
          {phase < 3 ? (
            <motion.div
              key="detection-scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              className="bg-zinc-950/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest border-b border-zinc-800 pb-3">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>ANOMALY RE-EVALUATION IN PROGRESS</span>
              </div>

              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <h2 className="font-cinzel text-xl sm:text-2xl font-black text-rose-300">
                    WAIT.
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Something doesn't make sense.
                  </p>
                </motion.div>
              )}

              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 border-t border-zinc-800/80 space-y-2.5 text-xs sm:text-sm font-mono text-zinc-300"
                >
                  <div className="text-zinc-500 uppercase tracking-wider pb-1">
                    DATE CHECK:
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Calendar: CONFIRMED</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Database: SYNCHRONIZED</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reality: ALIGNED</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Phase 3: The Revelation! */
            <motion.div
              key="detection-reveal"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: 'spring', damping: 14 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>RESULT: IT'S YOUR BIRTHDAY.</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-cinzel font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-widest uppercase drop-shadow-[0_0_40px_rgba(251,191,36,0.6)]">
                  HAPPY BIRTHDAY
                </h1>
                <h2 className="font-cinzel font-black text-3xl sm:text-5xl text-amber-400 tracking-wider">
                  {name}
                </h2>
              </div>

              <p className="font-cormorant text-xl sm:text-2xl text-zinc-300 italic max-w-md mx-auto">
                "The system finally caught up. Today belongs exclusively to you."
              </p>

              {/* Action Button */}
              <div className="pt-6">
                <SceneButton
                  variant="primary"
                  onClick={onProceed}
                  icon={<Cake className="w-4 h-4 text-amber-300" />}
                >
                  UNLOCK BIRTHDAY PRIVILEGES
                </SceneButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
