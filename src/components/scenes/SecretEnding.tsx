import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, RotateCcw, Sparkles, Heart, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface SecretEndingProps {
  name: string;
  secretMessage: string;
  onReplay: () => void;
  onOpenCustomizer: () => void;
}

export const SecretEnding: React.FC<SecretEndingProps> = ({
  name,
  secretMessage,
  onReplay,
  onOpenCustomizer
}) => {
  const [showWarningButton, setShowWarningButton] = useState<boolean>(false);
  const [vaultOpened, setVaultOpened] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWarningButton(true);
    }, 3800); // Fades in after brief quiescent silence
    return () => clearTimeout(timer);
  }, []);

  const handleOpenVault = () => {
    audioEngine.playWishExplosion();
    setVaultOpened(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono text-center">
      <div className="w-full max-w-xl mx-auto space-y-8">
        
        <AnimatePresence mode="wait">
          {!vaultOpened ? (
            /* Calm "That's it." state */
            <motion.div
              key="closure"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-[0.3em]">
                  END OF PROTOCOL
                </span>
                <h1 className="font-cormorant text-3xl sm:text-5xl text-zinc-300 italic font-normal">
                  "That's it."
                </h1>
                <p className="text-xs text-zinc-500 font-sans">
                  The chapter has concluded. Today is yours to conquer.
                </p>
              </div>

              {/* Replay Option */}
              <div className="pt-4 flex justify-center">
                <button
                  onClick={onReplay}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-mono uppercase transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REPLAY EXPERIENCE</span>
                </button>
              </div>

              {/* Secret tiny button after 4s */}
              {showWarningButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="pt-12"
                >
                  <button
                    id="btn-secret-vault"
                    onClick={handleOpenVault}
                    className="group inline-flex items-center gap-2 text-[11px] font-mono text-zinc-600 hover:text-amber-400 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-zinc-900/60"
                  >
                    <Lock className="w-3 h-3 group-hover:hidden" />
                    <Unlock className="w-3 h-3 hidden group-hover:inline text-amber-400" />
                    <span>Definitely don't click.</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Revealed VIP Secret Vault */
            <motion.div
              key="vault"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-950/95 border border-amber-400/50 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(251,191,36,0.3)] space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>YOU WERE WARNED. 😂 // SECRET VAULT</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  TOP SECRET
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  ONE LAST THING, {name.toUpperCase()}
                </h2>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {secretMessage}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={onOpenCustomizer}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-400/30 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>EDIT DETAILS</span>
                </button>

                <SceneButton
                  variant="primary"
                  onClick={onReplay}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  RESTART JOURNEY
                </SceneButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
