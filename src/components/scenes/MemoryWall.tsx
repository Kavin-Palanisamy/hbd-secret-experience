import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Sparkles, ArrowRight, Eye, Calendar } from 'lucide-react';
import { MemoryItem } from '../../types';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface MemoryWallProps {
  name: string;
  memories: MemoryItem[];
  onProceed: () => void;
}

export const MemoryWall: React.FC<MemoryWallProps> = ({
  name,
  memories,
  onProceed
}) => {
  const [arrangement, setArrangement] = useState<'wall' | 'name' | 'hbd'>('wall');

  useEffect(() => {
    // Return to ambient soundtrack
    audioEngine.startMusic('ambient');
  }, []);

  const handleMorph = (target: 'wall' | 'name' | 'hbd') => {
    audioEngine.playTransition();
    setArrangement(target);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-sans text-center">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* Header & Arrangement Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>CHRONOLOGICAL MOSAIC</span>
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wider">
              MEMORY GALLERY & ARRANGEMENT
            </h1>
          </div>

          {/* Morph Switcher Buttons */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => handleMorph('wall')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                arrangement === 'wall'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              WALL
            </button>
            <button
              onClick={() => handleMorph('name')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                arrangement === 'name'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {name.toUpperCase()}
            </button>
            <button
              onClick={() => handleMorph('hbd')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                arrangement === 'hbd'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              HBD ✨
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="min-h-[420px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {arrangement === 'wall' ? (
              /* Standard Gallery Grid */
              <motion.div
                key="wall-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full text-left"
              >
                {memories.map((mem, idx) => (
                  <motion.div
                    key={mem.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="group bg-zinc-950/80 border border-zinc-800 hover:border-amber-400/40 rounded-2xl p-4 backdrop-blur-xl transition-all duration-300 shadow-lg"
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden mb-3 bg-zinc-900 relative">
                      <img
                        src={mem.image}
                        alt={mem.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
                        {mem.date}
                      </div>
                    </div>

                    <h3 className="font-cinzel text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans mt-1 line-clamp-2">
                      {mem.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            ) : arrangement === 'name' ? (
              /* Arranged into Name */
              <motion.div
                key="name-view"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-12 space-y-6 flex flex-col items-center justify-center w-full"
              >
                <div className="text-xs font-mono text-amber-400 tracking-[0.3em] uppercase">
                  CONSTELLATION FORMATION // {name.toUpperCase()}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl">
                  {name.split('').map((char, cIdx) => (
                    <div
                      key={cIdx}
                      className="w-16 h-24 sm:w-24 sm:h-36 rounded-2xl bg-zinc-950 border-2 border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.3)] flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      {memories[cIdx % memories.length] && (
                        <img
                          src={memories[cIdx % memories.length].image}
                          alt="Mosaic"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover opacity-25"
                        />
                      )}
                      <span className="font-cinzel font-black text-4xl sm:text-6xl text-white relative z-10 drop-shadow-md">
                        {char}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-zinc-400 font-mono italic">
                  "Every letter built from real shared moments."
                </p>
              </motion.div>
            ) : (
              /* Arranged into HBD */
              <motion.div
                key="hbd-view"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-12 space-y-6 flex flex-col items-center justify-center w-full"
              >
                <div className="text-xs font-mono text-emerald-400 tracking-[0.3em] uppercase">
                  UNIVERSAL SIGNAL // HBD
                </div>

                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  {['H', 'B', 'D'].map((char, cIdx) => (
                    <div
                      key={cIdx}
                      className="w-24 h-36 sm:w-36 sm:h-48 rounded-3xl bg-zinc-950 border-2 border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.4)] flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      <img
                        src={memories[(cIdx * 2) % memories.length].image}
                        alt="HBD mosaic"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                      />
                      <span className="font-cinzel font-black text-5xl sm:text-8xl text-white relative z-10 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                        {char}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-zinc-400 font-mono italic">
                  "All fragments harmonize into one wish."
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Proceed to Beast Mode */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <SceneButton
            variant="cyber"
            onClick={onProceed}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            ENTER THE UNEXPECTED
          </SceneButton>
        </div>

      </div>
    </div>
  );
};
