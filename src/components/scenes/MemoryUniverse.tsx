import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, X, Compass, Image as ImageIcon, Calendar } from 'lucide-react';
import { MemoryItem } from '../../types';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface MemoryUniverseProps {
  memories: MemoryItem[];
  onProceed: () => void;
}

export const MemoryUniverse: React.FC<MemoryUniverseProps> = ({
  memories,
  onProceed
}) => {
  const [hasTouchedLight, setHasTouchedLight] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [exploredIds, setExploredIds] = useState<string[]>([]);

  const handleTouchLight = () => {
    audioEngine.playWishExplosion();
    setHasTouchedLight(true);
  };

  const handleOpenMemory = (mem: MemoryItem) => {
    audioEngine.playGiftOpen();
    setSelectedMemory(mem);
    if (!exploredIds.includes(mem.id)) {
      setExploredIds((prev) => [...prev, mem.id]);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-sans">
      
      {/* PHASE 3: Touch the light */}
      {!hasTouchedLight ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
          className="text-center space-y-8 max-w-xl mx-auto"
        >
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400/80">
              SECURITY ADVISORY // ANOMALOUS CHRONOLOGY
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 tracking-wider">
              TODAY IS NOT A NORMAL DAY.
            </h1>
            <p className="text-sm text-zinc-400 font-cormorant italic text-lg">
              "The timeline has refracted around a singular coordinate."
            </p>
          </div>

          {/* Glowing Orb: Touch the Light */}
          <div className="pt-6 flex flex-col items-center gap-4">
            <motion.button
              id="btn-touch-light"
              onClick={handleTouchLight}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-20 rounded-full bg-radial from-white via-amber-300 to-amber-600 shadow-[0_0_50px_rgba(251,191,36,0.8)] cursor-pointer flex items-center justify-center group"
            >
              <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/30" />
              <Sparkles className="w-8 h-8 text-amber-950 group-hover:rotate-45 transition-transform duration-500" />
            </motion.button>

            <span className="font-cinzel text-xs text-amber-300/80 tracking-[0.25em] uppercase animate-pulse">
              Touch the light.
            </span>
          </div>
        </motion.div>
      ) : (
        /* PHASE 4: Memory Universe */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>THE FLOATING MEMORY UNIVERSE</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-wider">
              RECOVERED FRAGMENTS
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Explored: {exploredIds.length} / {memories.length} fragments
            </p>
          </div>

          {/* Floating Memory Cards / Celestial Orbs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full pt-4">
            {memories.map((mem, idx) => {
              const isExplored = exploredIds.includes(mem.id);
              return (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handleOpenMemory(mem)}
                  className={`group relative rounded-2xl p-4 bg-zinc-950/80 border transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden ${
                    isExplored
                      ? 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                      : 'border-zinc-800/80 hover:border-amber-400/40'
                  }`}
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-zinc-900 border border-zinc-800">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-zinc-300">
                      {mem.date}
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 font-sans">
                      {mem.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>{isExplored ? '✓ EXAMINED' : 'UNREAD'}</span>
                    <span className="text-amber-400/80 group-hover:translate-x-1 transition-transform">
                      VIEW &rarr;
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="pt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-zinc-500 font-mono">
              "We have compiled enough behavioral fragments."
            </p>
            <SceneButton
              variant="primary"
              onClick={onProceed}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              RUN PERSONALITY REPORT
            </SceneButton>
          </div>
        </motion.div>
      )}

      {/* Memory Modal Detail */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(251,191,36,0.2)] text-left space-y-5"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>MEMORY FOUND</span>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setSelectedMemory(null);
                  }}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedMemory.date}</span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  {selectedMemory.title}
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {selectedMemory.description}
                </p>

                {selectedMemory.quote && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs font-mono italic">
                    "{selectedMemory.quote}"
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setSelectedMemory(null);
                  }}
                  className="px-5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono uppercase transition-colors cursor-pointer"
                >
                  Close Fragment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
