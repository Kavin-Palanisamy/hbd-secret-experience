import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Hourglass } from 'lucide-react';
import { TimelineItem } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface TimeTunnelProps {
  timeline: TimelineItem[];
  onContinue: () => void;
}

export const TimeTunnel: React.FC<TimeTunnelProps> = ({ timeline, onContinue }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentItem = timeline[currentIndex];
  const isLast = currentIndex === timeline.length - 1;

  const handleNext = () => {
    if (currentIndex < timeline.length - 1) {
      audioEngine.playClick();
      setCurrentIndex(prev => prev + 1);
    } else {
      audioEngine.playTransition();
      onContinue();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      audioEngine.playClick();
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Cosmic color hues depending on timeline period
  const getPeriodStyle = (period: string) => {
    switch (period) {
      case 'PAST':
        return { text: 'text-sky-300', border: 'border-sky-500/40', bg: 'bg-sky-950/20' };
      case 'NOW':
        return { text: 'text-amber-300', border: 'border-amber-500/50', bg: 'bg-amber-950/20' };
      case 'FUTURE':
      default:
        return { text: 'text-rose-300', border: 'border-rose-500/40', bg: 'bg-rose-950/20' };
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 select-none z-10">
      
      {/* Header & Scrubber */}
      <div className="pt-12 sm:pt-14 text-center max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-3 text-amber-400 font-cinzel text-xs tracking-[0.3em] uppercase"
        >
          <Hourglass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>The Time Tunnel</span>
        </motion.div>

        {/* Interactive Scrub Bar */}
        <div className="relative flex items-center justify-between px-2 sm:px-6 py-4 mt-2">
          {/* Connecting Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1px] bg-zinc-800" />
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-sky-500 via-amber-400 to-rose-400 transition-all duration-500"
            style={{ width: `calc(${(currentIndex / (timeline.length - 1)) * 100}% - 3rem)` }}
          />

          {timeline.map((item, idx) => {
            const active = idx === currentIndex;
            const past = idx < currentIndex;
            const style = getPeriodStyle(item.period);

            return (
              <button
                key={item.id}
                onClick={() => {
                  audioEngine.playClick();
                  setCurrentIndex(idx);
                }}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-500 ${
                    active
                      ? `${style.text} bg-zinc-950 border-2 ${style.border} scale-125 shadow-lg`
                      : past
                      ? 'text-zinc-300 bg-zinc-900 border border-zinc-700'
                      : 'text-zinc-600 bg-zinc-950 border border-zinc-800'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`hidden sm:block text-[10px] font-cinzel tracking-wider uppercase mt-2 transition-colors ${
                    active ? style.text : 'text-zinc-500'
                  }`}
                >
                  {item.year}
                </span>
              </button>
            );
          })}
        </div>

        {/* Period Labels */}
        <div className="flex justify-between px-6 text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-1">
          <span>PAST</span>
          <span>NOW</span>
          <span>FUTURE</span>
        </div>
      </div>

      {/* Main Content Card with Motion AnimatePresence */}
      <div className="relative flex-1 flex items-center justify-center my-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-6 sm:gap-8 items-center"
          >
            {/* Image side */}
            <div className="relative w-full md:w-1/2 h-56 sm:h-72 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 flex-shrink-0">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-zinc-700/50 backdrop-blur-md">
                <span className="font-cinzel text-xs text-amber-300 font-bold tracking-widest uppercase">
                  {currentItem.year}
                </span>
              </div>
            </div>

            {/* Content text side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
              <div>
                <span className={`text-xs font-mono tracking-widest uppercase font-semibold ${getPeriodStyle(currentItem.period).text}`}>
                  {currentItem.period} CHAPTER
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl text-zinc-100 font-bold tracking-wide mt-1">
                  {currentItem.title}
                </h3>
                <p className="font-cormorant text-base sm:text-lg text-amber-200/80 italic mt-0.5">
                  "{currentItem.tagline}"
                </p>
              </div>

              <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
                {currentItem.description}
              </p>

              {/* Step indicator on mobile */}
              <div className="pt-2 text-xs text-zinc-500 font-mono">
                Milestone {currentIndex + 1} of {timeline.length}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation & Climax message */}
      <div className="pb-8 max-w-2xl mx-auto w-full flex flex-col items-center gap-4">
        {isLast ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <p className="font-cormorant text-xl sm:text-2xl text-zinc-300 italic font-light">
              "We've come a long way. But the best chapters haven't been written yet."
            </p>
            <button
              id="timeline-finish-btn"
              onClick={() => {
                audioEngine.playTransition();
                onContinue();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-600/20 hover:from-amber-500/40 hover:to-amber-500/40 border border-amber-400/50 hover:border-amber-300 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-lg flex items-center gap-2.5 cursor-pointer"
            >
              <span>Receive Your Letter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between w-full max-w-sm px-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full border transition-colors cursor-pointer ${
                currentIndex === 0
                  ? 'text-zinc-700 border-zinc-800 opacity-40 cursor-not-allowed'
                  : 'text-zinc-300 border-zinc-700 hover:border-amber-400 hover:text-white bg-zinc-900/60'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="time-next-step-btn"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400/50 text-amber-200 font-cinzel text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Next Moment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
