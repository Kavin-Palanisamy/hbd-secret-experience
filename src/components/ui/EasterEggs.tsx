import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Sparkles, Clock, X } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface EasterEggsProps {
  name: string;
}

export const EasterEggs: React.FC<EasterEggsProps> = ({ name }) => {
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string; icon: string } | null>(null);
  const konamiSequence = useRef<string[]>([]);
  const idleTimerRef = useRef<number | null>(null);
  const [hasIdleFired, setHasIdleFired] = useState<boolean>(false);

  const showToast = (title: string, subtitle: string, icon: string = '✨') => {
    audioEngine.playSuccessChime();
    setToastMessage({ title, subtitle, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Konami Code detector: Up Up Down Down Left Right Left Right
  useEffect(() => {
    const konamiTarget = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      konamiSequence.current.push(e.key);
      if (konamiSequence.current.length > konamiTarget.length) {
        konamiSequence.current.shift();
      }

      if (konamiSequence.current.length === konamiTarget.length &&
          konamiSequence.current.every((key, idx) => key === konamiTarget[idx])) {
        audioEngine.playBossDefeat();
        showToast(
          "CHEAT CODE UNLOCKED",
          "WHY ARE YOU TRYING CHEAT CODES ON A BIRTHDAY WEBSITE? 😂",
          "🎮"
        );
        konamiSequence.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Idle 20s detector
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (!hasIdleFired) {
        idleTimerRef.current = window.setTimeout(() => {
          setHasIdleFired(true);
          showToast(
            "ARE YOU STILL THERE?",
            "Don't worry, the universe will wait for you. Take your time.",
            "⏳"
          );
        }, 22000);
      }
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);

    resetIdle();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
    };
  }, [hasIdleFired]);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="pointer-events-auto max-w-sm bg-zinc-950/95 border border-amber-400/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(251,191,36,0.3)] backdrop-blur-xl flex items-start gap-3"
          >
            <span className="text-2xl select-none">{toastMessage.icon}</span>
            <div className="flex-1 text-left font-sans">
              <h4 className="font-cinzel text-xs font-bold text-amber-300 tracking-wider">
                {toastMessage.title}
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                {toastMessage.subtitle}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
