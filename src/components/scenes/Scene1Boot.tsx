import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Eye, Terminal } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene1BootProps {
  name: string;
  age: number;
  onProceed: () => void;
}

export const Scene1Boot: React.FC<Scene1BootProps> = ({ name, age, onProceed }) => {
  const [step, setStep] = useState<number>(0);
  const [revealedSecrets, setRevealedSecrets] = useState<boolean>(false);

  useEffect(() => {
    const t1 = setTimeout(() => { setStep(1); audioEngine.playTerminalKey(); }, 500);
    const t2 = setTimeout(() => { setStep(2); audioEngine.playTerminalKey(); }, 1200);
    const t3 = setTimeout(() => { setStep(3); audioEngine.playTerminalKey(); }, 2000);
    const t4 = setTimeout(() => { setStep(4); audioEngine.playGlitch(); }, 2900);
    const t5 = setTimeout(() => { setStep(5); audioEngine.playTerminalKey(); }, 3800);
    const t6 = setTimeout(() => { setStep(6); audioEngine.playGlitch(); }, 4700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  const handleShowMe = () => {
    audioEngine.playClick();
    setRevealedSecrets(true);
    setTimeout(() => {
      audioEngine.playTransition();
      onProceed();
    }, 2800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 font-mono text-zinc-300">
      <div className="w-full max-w-xl bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="text-xs text-amber-400 font-bold tracking-widest flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            BIRTHDAY_OS v2026.09
          </span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            NODE #774-ALPHA
          </span>
        </div>

        {/* Boot Terminal Log */}
        <div className="space-y-3 text-xs sm:text-sm">
          {step >= 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400">
              &gt; Searching for birthday human in sector 21...
            </motion.p>
          )}

          {step >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 space-y-1">
              <p>&gt; Identity match confirmed.</p>
              <p>&gt; Name: <span className="text-white font-bold">{name.toUpperCase()}</span></p>
              <p>&gt; Target Age: <span className="text-white font-bold">{age}</span></p>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
              <p className="text-zinc-400">&gt; Status sync:</p>
              <div className="w-full bg-zinc-900 rounded h-3 overflow-hidden border border-zinc-800">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1 }}
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full"
                />
              </div>
            </motion.div>
          )}

          {step >= 4 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 font-semibold">
              &gt; Personality scan: <span className="text-rose-400">ERROR: TOO AWESOME</span>
            </motion.p>
          )}

          {step >= 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
              <p className="text-zinc-400">&gt; Loading embarrassing memories archive...</p>
              <p className="text-rose-500 font-bold">&gt; ACCESS DENIED</p>
            </motion.div>
          )}

          {step >= 6 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
              <p className="text-zinc-400">&gt; Bypassing firewall with birthday admin privileges...</p>
              <p className="text-emerald-400 font-bold">&gt; ACCESS GRANTED 💀</p>
            </motion.div>
          )}
        </div>

        {/* Prompt Button */}
        {step >= 6 && !revealedSecrets && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-zinc-800/80 text-center space-y-4"
          >
            <p className="text-xs text-amber-200">
              Okay... we found some deeply interesting data.
            </p>
            <button
              id="btn-show-me"
              onClick={handleShowMe}
              className="px-8 py-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 hover:border-amber-300 text-amber-200 text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>SHOW ME</span>
            </button>
          </motion.div>
        )}

        {/* Comedic Reveal */}
        <AnimatePresence>
          {revealedSecrets && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-4 border-t border-zinc-800 text-center space-y-2"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="font-cinzel text-base text-zinc-100 font-bold">
                Relax. Your secrets are safe.
              </p>
              <p className="text-xs text-zinc-500 font-mono italic">
                ...Mostly. 😂
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
