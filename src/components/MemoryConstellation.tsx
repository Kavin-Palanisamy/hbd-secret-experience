import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, Calendar, Star } from 'lucide-react';
import { MemoryItem } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface MemoryConstellationProps {
  memories: MemoryItem[];
  onContinue: () => void;
}

export const MemoryConstellation: React.FC<MemoryConstellationProps> = ({
  memories,
  onContinue
}) => {
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  const handleSelectStar = (mem: MemoryItem) => {
    audioEngine.playClick();
    setActiveMemory(mem);
    setViewedIds(prev => new Set(prev).add(mem.id));
  };

  const closeMemory = () => {
    audioEngine.playClick();
    setActiveMemory(null);
  };

  const allExplored = viewedIds.size >= Math.min(3, memories.length);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 select-none z-10 overflow-hidden">
      
      {/* Header */}
      <div className="pt-12 sm:pt-14 text-center max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-2 mb-2 text-amber-400/80 font-cinzel text-xs tracking-[0.3em] uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Memory Constellation</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="font-cormorant text-2xl sm:text-4xl text-zinc-200 font-light"
        >
          "Every life is made of moments."
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-xs font-sans text-zinc-400 mt-2 tracking-wider"
        >
          Tap the glowing stars to uncover remembered chapters ({viewedIds.size}/{memories.length} revealed)
        </motion.p>
      </div>

      {/* Constellation Starfield Area */}
      <div className="relative flex-1 w-full max-w-4xl mx-auto my-6 min-h-[380px] sm:min-h-[460px] rounded-2xl border border-zinc-800/40 bg-radial from-zinc-900/30 via-transparent to-transparent backdrop-blur-[2px]">
        
        {/* SVG Constellation lines connecting stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-500/20 stroke-dasharray-4">
          {memories.map((m, idx) => {
            if (idx === memories.length - 1) return null;
            const next = memories[idx + 1];
            return (
              <line
                key={`line-${m.id}-${next.id}`}
                x1={`${m.x}%`}
                y1={`${m.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                strokeWidth="1"
                stroke="rgba(251, 191, 36, 0.25)"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Stars */}
        {memories.map((mem) => {
          const isViewed = viewedIds.has(mem.id);
          const isSelected = activeMemory?.id === mem.id;

          return (
            <div
              key={mem.id}
              style={{ left: `${mem.x}%`, top: `${mem.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              onClick={() => handleSelectStar(mem)}
            >
              {/* Outer pulsing beacon ring */}
              <div
                className={`absolute -inset-3 rounded-full transition-all duration-700 pointer-events-none ${
                  isSelected
                    ? 'bg-amber-400/30 scale-150 animate-ping'
                    : isViewed
                    ? 'bg-amber-500/15 group-hover:bg-amber-400/30'
                    : 'bg-amber-300/20 group-hover:bg-amber-400/40 animate-pulse'
                }`}
              />

              {/* Core star icon */}
              <div
                className={`relative flex items-center justify-center rounded-full p-2.5 sm:p-3 transition-transform duration-300 group-hover:scale-125 ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(251,191,36,0.9)]'
                    : isViewed
                    ? 'bg-zinc-800/90 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-zinc-900/90 text-amber-200 border border-amber-300/60 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ${!isViewed ? 'animate-spin-slow' : ''}`} />
              </div>

              {/* Star label tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="font-cinzel text-[11px] px-2.5 py-1 rounded bg-black/80 border border-amber-500/30 text-amber-200 tracking-wider">
                  {mem.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom status / Continue notice */}
      <div className="pb-8 text-center flex flex-col items-center">
        {allExplored ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="font-cormorant text-xl sm:text-2xl text-amber-200/90 italic font-light">
              "And somehow... they all led to today."
            </p>
            <button
              id="constellation-continue-btn"
              onClick={() => {
                audioEngine.playClick();
                onContinue();
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-400/50 hover:border-amber-300 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Continue Through Time</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 font-mono tracking-wider">
              Explore at least 3 memories to continue
            </span>
            <button
              onClick={onContinue}
              className="text-xs text-zinc-600 hover:text-zinc-400 underline font-mono tracking-wider transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>
        )}
      </div>

      {/* Memory Card Modal Popup */}
      <AnimatePresence>
        {activeMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-zinc-950/95 border border-amber-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
            >
              {/* Card Photo Header */}
              <div className="relative h-56 sm:h-64 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={activeMemory.image}
                  alt={activeMemory.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized abstract background if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                
                {/* Close button */}
                <button
                  id="close-memory-card"
                  onClick={closeMemory}
                  aria-label="Close memory card"
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-zinc-700/60 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Date & Year badge */}
                <div className="absolute bottom-4 left-5 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-cinzel text-xs tracking-widest font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {activeMemory.date || activeMemory.year}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="font-cinzel text-xl sm:text-2xl text-amber-100 font-bold tracking-wide">
                  {activeMemory.title}
                </h3>

                <p className="font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                  {activeMemory.description}
                </p>

                {activeMemory.quote && (
                  <div className="pt-2 border-l-2 border-amber-500/50 pl-4 py-1">
                    <p className="font-cormorant text-base sm:text-lg text-amber-200/90 italic">
                      "{activeMemory.quote}"
                    </p>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={closeMemory}
                    className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Keep Exploring
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
