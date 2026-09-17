import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Mail, ArrowRight, Heart } from 'lucide-react';
import { BirthdayData } from '../../types';
import { audioEngine } from '../../utils/audioEngine';

interface Scene7LetterProps {
  data: BirthdayData;
  onProceed: () => void;
}

export const Scene7Letter: React.FC<Scene7LetterProps> = ({ data, onProceed }) => {
  const [decrypting, setDecrypting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDecrypt = () => {
    setDecrypting(true);
    audioEngine.playGlitch();

    setTimeout(() => {
      setProgress(61);
      audioEngine.playTerminalKey();
    }, 400);

    setTimeout(() => {
      setProgress(91);
      audioEngine.playTerminalKey();
    }, 1000);

    setTimeout(() => {
      setProgress(100);
      audioEngine.playEnvelopeOpen();
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }, 1600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 font-sans">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope-locked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-zinc-950 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl space-y-6"
          >
            {/* Floating Envelope Icon */}
            <div className="relative w-20 h-20 mx-auto rounded-3xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.2)]">
              {decrypting ? (
                <Unlock className="w-9 h-9 text-amber-300 animate-bounce" />
              ) : (
                <Lock className="w-9 h-9 text-amber-400" />
              )}
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono tracking-widest uppercase border border-amber-400/30">
                SECURE TRANSMISSION
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl text-zinc-100 font-bold">
                Personalized Letter
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                "This message has been encrypted for {data.name}'s eyes only."
              </p>
            </div>

            {!decrypting ? (
              <button
                id="btn-decrypt-letter"
                onClick={handleDecrypt}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/30 via-amber-400/40 to-amber-600/30 hover:from-amber-500/50 border border-amber-400/60 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg"
              >
                <Unlock className="w-4 h-4 text-amber-300" />
                <span>DECRYPT MESSAGE</span>
              </button>
            ) : (
              <div className="space-y-2 max-w-xs mx-auto font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Decrypting memories...</span>
                  <span className="text-amber-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="letter-open"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#0f0e0c] border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(251,191,36,0.25)] space-y-6 text-left relative"
          >
            {/* Top Wax Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-mono tracking-widest uppercase">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Confidential Letter • Year 21</span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Decrypted ✓
              </span>
            </div>

            {/* Salutation */}
            <div className="font-cinzel text-xl sm:text-2xl text-amber-200 font-bold">
              Dear {data.name},
            </div>

            {/* Letter Content */}
            <div className="font-cormorant text-lg sm:text-xl text-zinc-300 leading-relaxed space-y-4 font-light whitespace-pre-line">
              {data.birthdayMessage}
            </div>

            {/* Handwritten Signature */}
            <div className="pt-6 border-t border-amber-500/20 space-y-2">
              <p className="font-handwriting text-2xl sm:text-3xl text-amber-300">
                {data.handwrittenSignoff}
              </p>
              <p className="font-cinzel text-xs text-zinc-400 tracking-widest uppercase">
                — {data.senderName}
              </p>
            </div>

            {/* Continue Button */}
            <div className="pt-4 flex justify-end">
              <button
                id="btn-letter-continue"
                onClick={() => {
                  audioEngine.playTransition();
                  onProceed();
                }}
                className="px-8 py-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 font-cinzel text-xs tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>The Wish Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
