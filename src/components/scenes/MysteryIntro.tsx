import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Terminal } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface MysteryIntroProps {
  initialName: string;
  onProceed: (name: string) => void;
}

export const MysteryIntro: React.FC<MysteryIntroProps> = ({
  initialName,
  onProceed
}) => {
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>(initialName);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Timed sequence:
  // Step 0: Blank dark screen (1 sec)
  // Step 1: CONNECTING...
  // Step 2: Connection established.
  // Step 3: Initializing experience...
  // Step 4: Unknown user detected.
  // Step 5: WHO ARE YOU? Input form
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep(1);
      audioEngine.playTypingBeep();
    }, 1000);

    const t2 = setTimeout(() => {
      setStep(2);
      audioEngine.playTypingBeep();
    }, 2200);

    const t3 = setTimeout(() => {
      setStep(3);
      audioEngine.playTypingBeep();
    }, 3400);

    const t4 = setTimeout(() => {
      setStep(4);
      audioEngine.playGlitch();
    }, 4600);

    const t5 = setTimeout(() => {
      setStep(5);
      audioEngine.playSuccessChime();
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    audioEngine.playTransition();
    onProceed(name.trim());
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono">
      <div className="w-full max-w-lg mx-auto text-left space-y-6">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 border-b border-zinc-800/80 pb-3">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="tracking-widest uppercase">SYS_PORT_443 // INITIAL_HANDSHAKE</span>
        </div>

        {/* Boot Sequence Lines */}
        <div className="space-y-3 min-h-[140px] text-sm text-zinc-300">
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-zinc-400"
            >
              <span className="text-zinc-600">&gt;</span>
              <span>CONNECTING...</span>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-emerald-400 font-medium"
            >
              <span className="text-zinc-600">&gt;</span>
              <span>Connection established.</span>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-zinc-300"
            >
              <span className="text-zinc-600">&gt;</span>
              <span>Initializing experience...</span>
            </motion.div>
          )}

          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-amber-300 font-semibold"
            >
              <span className="text-zinc-600">&gt;</span>
              <span>Unknown user detected.</span>
            </motion.div>
          )}
        </div>

        {/* Phase 1 Input: WHO ARE YOU? */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 pt-4 border-t border-zinc-800"
            >
              <div className="space-y-1">
                <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-zinc-100 tracking-wider">
                  WHO ARE YOU?
                </h1>
                <p className="text-xs text-zinc-400">
                  Authentication token required to decrypt this session.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    id="input-recipient-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      audioEngine.playTypingBeep();
                    }}
                    placeholder="Enter your name"
                    autoFocus
                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 hover:border-amber-400/50 focus:border-amber-400 text-white text-base tracking-wide focus:outline-none transition-all duration-200 shadow-inner"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">
                    [ENTER]
                  </div>
                </div>

                <div className="flex justify-end">
                  <SceneButton
                    type="submit"
                    variant="primary"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    CONTINUE
                  </SceneButton>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
