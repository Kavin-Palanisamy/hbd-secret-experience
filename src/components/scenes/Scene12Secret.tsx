import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Gift, RotateCcw, PenTool, Heart, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene12SecretProps {
  name: string;
  secretMessage: string;
  onReplay: () => void;
  onOpenCustomizer: () => void;
}

export const Scene12Secret: React.FC<Scene12SecretProps> = ({
  name,
  secretMessage,
  onReplay,
  onOpenCustomizer
}) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  const handleSecretClick = () => {
    audioEngine.playGlitch();
    setClicked(true);

    setTimeout(() => {
      setRevealed(true);
      audioEngine.playSuccessChime();
    }, 1800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 text-center font-sans">
      <div className="w-full max-w-xl mx-auto space-y-8">
        
        <AnimatePresence mode="wait">
          {!clicked ? (
            <motion.div
              key="secret-prompt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <p className="font-cormorant text-2xl sm:text-3xl text-zinc-400 italic">
                  "The journey has drawn to a gentle close."
                </p>
                <p className="font-cinzel text-xs text-zinc-500 uppercase tracking-widest">
                  Nothing else remains here. Absolutely nothing.
                </p>
              </div>

              {/* The Forbidden Button */}
              <div className="pt-6">
                <button
                  id="btn-forbidden-secret"
                  onClick={handleSecretClick}
                  className="px-6 py-2.5 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer shadow-sm hover:scale-105"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>Don't click this.</span>
                </button>
              </div>
            </motion.div>
          ) : !revealed ? (
            <motion.div
              key="secret-chiding"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="font-cinzel text-2xl sm:text-3xl text-amber-300 font-bold">
                "I literally told you." 😂
              </h2>
              <p className="font-mono text-xs text-zinc-400">
                Opening unauthorized vault compartment...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="secret-vault-revealed"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-zinc-950/90 border border-amber-400/50 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(251,191,36,0.3)] space-y-6 text-left"
            >
              {/* Secret Vault Header */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-zinc-100">
                      The VIP Secret Vault
                    </h3>
                    <p className="font-mono text-[11px] text-amber-300">
                      Top Secret Protocol • Unlocked by Curiosity
                    </p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>

              {/* Secret Message */}
              <div className="font-cormorant text-lg sm:text-xl text-zinc-200 leading-relaxed font-light whitespace-pre-line italic">
                "{secretMessage}"
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-amber-400/80 pt-2 border-t border-zinc-800">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Happy 21st Birthday, {name}. May your year be legendary.</span>
              </div>

              {/* Final Actions */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="btn-secret-replay"
                  onClick={() => {
                    audioEngine.playClick();
                    onReplay();
                  }}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400 text-zinc-300 hover:text-white font-cinzel text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Beast Journey</span>
                </button>

                <button
                  id="btn-secret-customize"
                  onClick={() => {
                    audioEngine.playClick();
                    onOpenCustomizer();
                  }}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-100 font-cinzel text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
                >
                  <PenTool className="w-3.5 h-3.5 text-amber-300" />
                  <span>Personalize / Create Another Wish</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
