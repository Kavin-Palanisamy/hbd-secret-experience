import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';
import { ProgressBar } from '../ui/ProgressBar';

interface WishOrbProps {
  onTriggerBurst: () => void;
  onProceed: () => void;
}

export const WishOrb: React.FC<WishOrbProps> = ({
  onTriggerBurst,
  onProceed
}) => {
  const [holding, setHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);

  const startHold = () => {
    if (completed) return;
    setHolding(true);
    audioEngine.startWishHum();

    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds hold

    const loop = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      audioEngine.updateWishHum(pct / 100);

      if (pct < 100) {
        animRef.current = requestAnimationFrame(loop);
      } else {
        // Complete!
        setCompleted(true);
        setHolding(false);
        audioEngine.playWishExplosion();
        onTriggerBurst();
      }
    };

    animRef.current = requestAnimationFrame(loop);
  };

  const endHold = () => {
    if (completed) return;
    setHolding(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    audioEngine.stopWishHum();
    setProgress(0);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono text-center">
      <div className="w-full max-w-xl mx-auto space-y-8">
        
        {/* Narrative Intro */}
        {!completed ? (
          <div className="space-y-3">
            <p className="font-cinzel text-xs text-amber-400/80 uppercase tracking-[0.3em]">
              QUANTUM INTENT SYNTHESIS
            </p>
            <h1 className="font-cormorant text-3xl sm:text-5xl text-white italic font-normal">
              "Okay. Jokes aside. Make one wish."
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
              Hold the celestial orb until the energetic frequency reaches critical threshold. Don't tell anyone.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRANSMISSION ENCRYPTED & SAVED</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wider">
              Wish received.
            </h2>
            <p className="text-zinc-400 font-mono text-xs">
              "We'll pretend the servers can handle it." 😂
            </p>
          </motion.div>
        )}

        {/* The Interactive Wish Orb */}
        {!completed ? (
          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="relative">
              {/* Outer pulsing ring */}
              <motion.div
                animate={{
                  scale: holding ? [1.2, 1.4, 1.2] : [1, 1.05, 1],
                  opacity: holding ? [0.6, 0.9, 0.6] : [0.2, 0.4, 0.2],
                }}
                transition={{ duration: holding ? 0.6 : 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"
              />

              <button
                id="btn-wish-orb"
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-radial from-amber-200 via-amber-400 to-amber-700 shadow-[0_0_60px_rgba(251,191,36,0.6)] cursor-pointer flex flex-col items-center justify-center p-4 transition-transform active:scale-110 select-none group"
              >
                <Sparkles className={`w-8 h-8 text-amber-950 transition-transform duration-300 ${holding ? 'rotate-90 scale-125' : ''}`} />
                <span className="font-cinzel text-[11px] font-bold text-amber-950 tracking-widest uppercase mt-2">
                  {holding ? 'CONCENTRATING...' : 'PRESS & HOLD'}
                </span>
              </button>
            </div>

            {/* Progress gauge */}
            <div className="w-64 space-y-1">
              <ProgressBar progress={progress} color="bg-amber-400" showPercent={false} height="h-1.5" />
              <div className="text-[10px] text-zinc-500 font-mono">
                CHARGE: {Math.round(progress)}%
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-6">
            <SceneButton
              variant="primary"
              onClick={onProceed}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              ENGAGE FINAL BOSS
            </SceneButton>
          </div>
        )}

      </div>
    </div>
  );
};
