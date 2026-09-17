import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Check, AlertTriangle } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene0WatchingProps {
  onProceed: () => void;
}

export const Scene0Watching: React.FC<Scene0WatchingProps> = ({ onProceed }) => {
  const [initStage, setInitStage] = useState<number>(0);
  const [hesitated, setHesitated] = useState<boolean>(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setInitStage(1);
      audioEngine.playTerminalKey();
    }, 600);
    const t2 = setTimeout(() => {
      setInitStage(2);
      audioEngine.playTerminalKey();
    }, 1300);
    const t3 = setTimeout(() => {
      setInitStage(3);
      audioEngine.playTerminalKey();
    }, 2000);
    const t4 = setTimeout(() => {
      setInitStage(4);
      audioEngine.playTerminalKey();
    }, 2700);
    const t5 = setTimeout(() => {
      setInitStage(5);
      audioEngine.playTerminalKey();
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleHesitate = () => {
    audioEngine.playGlitch();
    setHesitated(true);
    // Automatically select YES after a comedic beat
    setTimeout(() => {
      audioEngine.playTransition();
      onProceed();
    }, 1600);
  };

  const handleYes = () => {
    audioEngine.playTransition();
    onProceed();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 font-mono text-zinc-300">
      <div className="w-full max-w-xl bg-black/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-6">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-widest uppercase">SYS_INITIALIZER v4.2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
        </div>

        {/* System Checklist */}
        <div className="space-y-2 text-xs sm:text-sm">
          <p className="text-zinc-500 tracking-wider">SYSTEM STATUS:</p>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span>Loading memories...................</span>
              {initStage >= 1 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> DONE
                </span>
              ) : (
                <span className="text-zinc-600 animate-pulse">...</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span>Preparing surprises..................</span>
              {initStage >= 2 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> DONE
                </span>
              ) : (
                <span className="text-zinc-600 animate-pulse">...</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span>Calibrating chaos...................</span>
              {initStage >= 3 ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100%
                </span>
              ) : (
                <span className="text-zinc-600 animate-pulse">...</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span>Birthday protocol...................</span>
              {initStage >= 4 ? (
                <span className="text-rose-400 font-bold tracking-wider">
                  ACTIVATED 🔥
                </span>
              ) : (
                <span className="text-zinc-600 animate-pulse">...</span>
              )}
            </div>
          </div>
        </div>

        {/* The Prompt */}
        {initStage >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-4 border-t border-zinc-800/80 space-y-4 text-center"
          >
            <p className="text-xs text-amber-400 tracking-widest uppercase">
              Wait. Before we continue...
            </p>
            <h2 className="text-lg sm:text-xl font-cinzel text-zinc-100 font-bold">
              Are you REALLY ready?
            </h2>

            {hesitated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-2 flex items-center justify-center gap-2 text-rose-400 text-sm font-semibold"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Incorrect answer. Auto-selecting YES... 😂</span>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="btn-ready-yes"
                  onClick={handleYes}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 hover:border-emerald-300 text-emerald-300 text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-md"
                >
                  YES, I'M READY
                </button>

                <button
                  id="btn-ready-hesitate"
                  onClick={handleHesitate}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer"
                >
                  I THINK SO...?
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
