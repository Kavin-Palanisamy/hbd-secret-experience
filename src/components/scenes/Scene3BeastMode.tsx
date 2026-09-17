import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene3BeastModeProps {
  onBeastModeActivated: () => void;
  onProceed: () => void;
}

export const Scene3BeastMode: React.FC<Scene3BeastModeProps> = ({
  onBeastModeActivated,
  onProceed
}) => {
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [engineStep, setEngineStep] = useState<number>(0);

  const handleActivate = () => {
    setIsActivated(true);
    audioEngine.playBeastDrop();
    audioEngine.startMusic('beast');
    onBeastModeActivated();

    // Staggered engine activation
    setTimeout(() => { setEngineStep(1); audioEngine.playTerminalKey(); }, 400);
    setTimeout(() => { setEngineStep(2); audioEngine.playTerminalKey(); }, 800);
    setTimeout(() => { setEngineStep(3); audioEngine.playTerminalKey(); }, 1200);
    setTimeout(() => { setEngineStep(4); audioEngine.playTerminalKey(); }, 1600);
    setTimeout(() => { setEngineStep(5); audioEngine.playTerminalKey(); }, 2000);
    setTimeout(() => { setEngineStep(6); audioEngine.playSuccessChime(); }, 2600);
  };

  const engines = [
    "Visual Engine",
    "Particle Engine",
    "Memory Engine",
    "Animation Engine",
    "Chaos Engine"
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 text-center font-sans">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        <AnimatePresence mode="wait">
          {!isActivated ? (
            <motion.div
              key="pre-beast"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-6"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <p className="font-cormorant text-2xl sm:text-3xl text-zinc-300 italic">
                  "Someone else might be watching this."
                </p>
                <p className="font-cinzel text-base sm:text-lg text-amber-300 font-bold tracking-widest uppercase">
                  Let's make this interesting.
                </p>
              </div>

              <div className="pt-4">
                <button
                  id="btn-activate-beast-mode"
                  onClick={handleActivate}
                  className="group relative px-8 sm:px-12 py-4 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 hover:from-red-500 hover:to-amber-400 text-white font-cinzel text-sm tracking-[0.3em] uppercase font-black transition-all duration-300 shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] flex items-center justify-center gap-3 mx-auto cursor-pointer animate-pulse"
                >
                  <Zap className="w-5 h-5 text-yellow-200 fill-current group-hover:scale-125 transition-transform" />
                  <span>ACTIVATE BEAST MODE</span>
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
                Caution: Uncapped frontend horsepower ahead
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="post-beast"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              className="bg-black/90 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(251,191,36,0.4)] backdrop-blur-2xl space-y-6 font-mono text-left"
            >
              {/* Cyber Beast Header */}
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-widest flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400 fill-current animate-bounce" />
                    BEAST MODE ACTIVATED
                  </h2>
                  <p className="text-xs text-zinc-500 tracking-wider">HARDWARE ACCELERATION ENGAGED</p>
                </div>
                <span className="px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold animate-pulse">
                  OVERDRIVE
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (engineStep / 5) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
                />
              </div>

              {/* Staggered Engine Checklist */}
              <div className="space-y-2 text-xs sm:text-sm">
                {engines.map((name, idx) => (
                  <div key={name} className="flex items-center justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-400">{name} .................</span>
                    {engineStep > idx ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> ONLINE
                      </span>
                    ) : (
                      <span className="text-zinc-600 animate-pulse">INITIALIZING</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Final Status */}
              {engineStep >= 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 border-t border-amber-500/30 text-center space-y-4"
                >
                  <p className="font-cinzel text-xl sm:text-2xl text-amber-200 font-black tracking-widest uppercase text-glow-gold">
                    "Okay. Now we're serious."
                  </p>

                  <button
                    id="btn-enter-galaxy"
                    onClick={() => {
                      audioEngine.playTransition();
                      onProceed();
                    }}
                    className="px-8 py-3.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
                  >
                    <span>Launch Galaxy Universe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
