import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene5WaitWhatProps {
  name: string;
  onExplosion: () => void;
  onProceed: () => void;
}

export const Scene5WaitWhat: React.FC<Scene5WaitWhatProps> = ({
  name,
  onExplosion,
  onProceed
}) => {
  const [phase, setPhase] = useState<'freeze' | 'glowing' | 'collapsing' | 'exploded'>('freeze');

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('glowing');
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  const handleAnomalyClick = () => {
    setPhase('collapsing');
    audioEngine.startWishHum();
    audioEngine.updateWishHum(0.8);

    setTimeout(() => {
      audioEngine.stopWishHum();
      audioEngine.playWishExplosion();
      onExplosion(); // triggers canvas supernova burst
      setPhase('exploded');

      // Stay on the glorious reveal for a few seconds before the fake error occurs!
      setTimeout(() => {
        onProceed();
      }, 4200);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-20 text-center font-sans">
      <AnimatePresence mode="wait">
        {phase === 'freeze' && (
          <motion.div
            key="freeze"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono tracking-widest uppercase border border-rose-400/40">
              TIMELINE DISRUPTION
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-zinc-100 font-bold tracking-widest uppercase">
              "You missed something."
            </h2>
          </motion.div>
        )}

        {phase === 'glowing' && (
          <motion.div
            key="glowing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono tracking-widest uppercase border border-amber-400/40">
                COSMIC ANOMALY DETECTED
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl text-zinc-200 font-bold tracking-wide">
                A Singularity Is Calling You
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Click the luminous singularity core below to breach space-time
              </p>
            </div>

            {/* Glowing Singularity Anomaly */}
            <div
              id="anomaly-core-btn"
              onClick={handleAnomalyClick}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer group"
            >
              <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl group-hover:bg-amber-400/60 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-amber-300 via-rose-400 to-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
              <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.9)] group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'collapsing' && (
          <motion.div
            key="collapsing"
            initial={{ scale: 1 }}
            animate={{ scale: 0, rotate: 720 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full bg-white shadow-[0_0_100px_white]"
          />
        )}

        {phase === 'exploded' && (
          <motion.div
            key="exploded"
            initial={{ opacity: 0, scale: 0.3, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, type: 'spring', damping: 14 }}
            className="space-y-4 max-w-4xl"
          >
            <p className="text-xs sm:text-sm font-mono tracking-[0.4em] text-amber-300 uppercase">
              UNIVERSAL HARMONIC REVEAL
            </p>
            <h1 className="font-cinzel font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-300 to-amber-500 drop-shadow-[0_0_50px_rgba(251,191,36,0.8)]">
              HAPPY BIRTHDAY
            </h1>
            <h2 className="font-cinzel font-black text-5xl sm:text-7xl md:text-8xl tracking-[0.2em] text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.9)]">
              {name.toUpperCase()}
            </h2>
            <p className="font-cormorant text-xl sm:text-2xl text-zinc-300 italic pt-2">
              The universe paused to celebrate the person behind every memory.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
