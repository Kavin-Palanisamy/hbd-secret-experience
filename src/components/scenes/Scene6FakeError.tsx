import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, Terminal, ArrowRight } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene6FakeErrorProps {
  onProceed: () => void;
}

export const Scene6FakeError: React.FC<Scene6FakeErrorProps> = ({ onProceed }) => {
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    audioEngine.playGlitch();

    const t1 = setTimeout(() => {
      setProgress(78);
      setStage(1);
      audioEngine.playTerminalKey();
    }, 600);

    const t2 = setTimeout(() => {
      setProgress(94);
      setStage(2);
      audioEngine.playTerminalKey();
    }, 1400);

    const t3 = setTimeout(() => {
      setProgress(99);
      setStage(3);
      audioEngine.playGlitch();
    }, 2200);

    const t4 = setTimeout(() => {
      setStage(4); // PERSON IS TOO AWESOME
      audioEngine.playTerminalKey();
    }, 3200);

    const t5 = setTimeout(() => {
      setStage(5); // Just kidding
      audioEngine.playSuccessChime();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 font-mono text-zinc-300">
      <div className="w-full max-w-lg bg-black/90 border-2 border-red-500/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.35)] space-y-6">
        
        {/* Error Header */}
        <div className="flex items-center justify-between border-b border-red-500/40 pb-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm tracking-wider">
            <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />
            <span>CRITICAL_SYSTEM_ERROR</span>
          </div>
          <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded text-red-300 border border-red-800">
            KERNEL_HALT
          </span>
        </div>

        {/* Error Terminal Log */}
        <div className="space-y-3 text-xs sm:text-sm">
          <p className="text-red-300 font-bold">
            &gt; CRITICAL ALERT: Too much birthday energy detected in memory buffer!
          </p>
          <p className="text-zinc-400">
            &gt; Attempting automatic system recovery...
          </p>

          {/* Recovery Progress Bar */}
          <div className="w-full bg-zinc-900 rounded h-3 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Buffer Recovery</span>
            <span className="text-red-400 font-bold">{progress}%</span>
          </div>

          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl space-y-1 text-center"
            >
              <p className="text-red-400 font-black text-sm tracking-widest uppercase">
                FATAL REASON:
              </p>
              <p className="text-base sm:text-lg text-white font-black tracking-widest">
                PERSON IS TOO AWESOME TO HANDLE.
              </p>
              <p className="text-[11px] text-red-300/80 italic">
                System initiating emergency shut down...
              </p>
            </motion.div>
          )}
        </div>

        {/* The Relief Reveal */}
        {stage >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4 border-t border-zinc-800 text-center space-y-4 font-sans"
          >
            <p className="font-cinzel text-xl sm:text-2xl text-emerald-300 font-bold">
              Just kidding. 😂
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              The servers survived. But we have something heartfelt for you.
            </p>

            <button
              id="btn-error-continue"
              onClick={() => {
                audioEngine.playTransition();
                onProceed();
              }}
              className="px-8 py-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/60 text-emerald-200 font-cinzel text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
            >
              <span>Decrypt Personal Letter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
