import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface Scene8WishProps {
  onWishExploded: () => void;
  onProceed: () => void;
}

export const Scene8Wish: React.FC<Scene8WishProps> = ({ onWishExploded, onProceed }) => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [charge, setCharge] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const chargeRef = useRef<number>(0);

  const startCharging = () => {
    if (completed) return;
    setIsHolding(true);
    audioEngine.startWishHum();

    const loop = () => {
      chargeRef.current = Math.min(100, chargeRef.current + 0.85);
      setCharge(chargeRef.current);
      audioEngine.updateWishHum(chargeRef.current / 100);

      if (chargeRef.current < 100) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };
    animFrameRef.current = requestAnimationFrame(loop);
  };

  const stopCharging = () => {
    if (completed) return;
    setIsHolding(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (chargeRef.current >= 85) {
      // Complete wish!
      setCompleted(true);
      audioEngine.playWishExplosion();
      onWishExploded();
    } else {
      audioEngine.stopWishHum();
      chargeRef.current = 0;
      setCharge(0);
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      audioEngine.stopWishHum();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 text-center font-sans">
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono tracking-widest uppercase border border-amber-400/30">
            THE WISH ENGINE
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl text-zinc-100 font-bold">
            "Okay. No jokes now."
          </h2>
          <p className="font-cormorant text-xl text-amber-200/90 italic">
            "Make one real wish."
          </p>
        </div>

        {/* The Core Orb */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div
            id="wish-orb-core"
            onMouseDown={startCharging}
            onMouseUp={stopCharging}
            onMouseLeave={stopCharging}
            onTouchStart={startCharging}
            onTouchEnd={stopCharging}
            className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group"
          >
            {/* Outer Pulsing Glow aura */}
            <div
              className="absolute inset-0 rounded-full blur-3xl transition-all duration-200"
              style={{
                backgroundColor: completed ? '#fbbf24' : '#60a5fa',
                opacity: 0.3 + (charge / 100) * 0.6,
                transform: `scale(${1 + (charge / 100) * 0.4})`
              }}
            />

            {/* Orb Sphere Body */}
            <div
              className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 flex items-center justify-center shadow-2xl transition-all duration-150 overflow-hidden"
              style={{
                borderColor: charge > 70 ? '#fbbf24' : '#93c5fd',
                background: `radial-gradient(circle at 35% 35%, ${charge > 70 ? '#fef08a' : '#dbeafe'}, ${charge > 70 ? '#f59e0b' : '#3b82f6'}, #000000)`,
                boxShadow: `0 0 ${30 + charge}px ${charge > 70 ? '#fbbf24' : '#60a5fa'}`
              }}
            >
              <Sparkles className={`w-12 h-12 text-white ${isHolding ? 'animate-spin' : 'animate-pulse'}`} />
            </div>
          </div>

          {/* Dynamic Instructions */}
          {!completed ? (
            <div className="pt-4 space-y-2 font-mono text-xs sm:text-sm">
              <p className="text-zinc-300 font-semibold">
                {charge === 0 && "Press & HOLD the orb to charge your wish"}
                {charge > 0 && charge < 40 && "Keep holding..."}
                {charge >= 40 && charge < 75 && "Don't tell us the wish."}
                {charge >= 75 && charge < 100 && "Almost there... Release now!"}
              </p>

              {/* Charge Bar */}
              <div className="w-48 mx-auto h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-amber-300 to-yellow-200 transition-all duration-75"
                  style={{ width: `${charge}%` }}
                />
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-4 space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-sm font-bold">
                  <Check className="w-4 h-4" />
                  <span>Wish stored in the cosmic archives.</span>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono italic">
                  *Probably. 99.4% quantum probability. 😂
                </p>

                <div className="pt-4">
                  <button
                    id="btn-wish-continue"
                    onClick={() => {
                      audioEngine.playTransition();
                      onProceed();
                    }}
                    className="px-8 py-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-200 font-cinzel text-xs tracking-widest uppercase transition-all flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
                  >
                    <span>Face The Final Boss</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
