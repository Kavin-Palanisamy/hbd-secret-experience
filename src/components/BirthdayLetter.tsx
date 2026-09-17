import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MailOpen, ArrowRight, Heart } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { BirthdayData } from '../types';

interface BirthdayLetterProps {
  data: BirthdayData;
  onContinue: () => void;
}

export const BirthdayLetter: React.FC<BirthdayLetterProps> = ({ data, onContinue }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    audioEngine.playEnvelopeOpen();
    setIsOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10">
      
      {/* Scene Header */}
      <div className="text-center mb-6 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-cinzel tracking-[0.3em] uppercase text-amber-400/80 mb-2 flex items-center justify-center gap-2"
        >
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>A Letter For Your 21st Year</span>
        </motion.div>

        {!isOpen && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-cormorant text-2xl sm:text-3xl text-zinc-300 font-light"
          >
            "You have one letter."
          </motion.h2>
        )}
      </div>

      {/* Interactive Envelope & Letter Container */}
      <div className="relative w-full max-w-2xl flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Closed Floating Envelope */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: [0, -10, 0] 
              }}
              transition={{
                y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                default: { duration: 0.8 }
              }}
              className="relative w-72 sm:w-96 h-48 sm:h-64 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-amber-500/30 p-6 flex flex-col items-center justify-between shadow-[0_15px_45px_rgba(0,0,0,0.8)] box-glow-gold"
            >
              {/* Envelope flap aesthetic */}
              <div className="absolute top-0 left-0 right-0 h-24 border-b border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent clip-path-triangle pointer-events-none" />

              <div className="w-full flex justify-between items-center text-[11px] font-mono text-zinc-500 tracking-wider">
                <span>POSTAGE PAID</span>
                <span>CHAPTER 21</span>
              </div>

              {/* Wax Seal */}
              <div className="relative my-auto flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300/40">
                  <span className="font-cinzel text-base font-black text-black">
                    {data.name.charAt(0)}
                  </span>
                </div>
                <span className="text-[11px] font-cinzel text-amber-200/90 tracking-widest uppercase mt-2">
                  For {data.name}
                </span>
              </div>

              {/* Open button */}
              <button
                id="open-letter-btn"
                onClick={handleOpen}
                className="w-full py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 hover:border-amber-300 text-amber-200 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MailOpen className="w-3.5 h-3.5" />
                <span>Open Letter</span>
              </button>
            </motion.div>
          ) : (
            /* Unfolded Open Letter Card */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full bg-[#111116] border border-amber-500/30 rounded-2xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[75vh] overflow-y-auto no-scrollbar"
            >
              {/* Top stationery banner */}
              <div className="border-b border-amber-500/20 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-lg sm:text-xl text-amber-200 tracking-wider">
                    Dear {data.name},
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono tracking-wider mt-0.5">
                    {data.relationship} • Milestone {data.age}
                  </p>
                </div>
                <Heart className="w-4 h-4 text-rose-400/80 fill-rose-500/20" />
              </div>

              {/* Letter Content */}
              <div className="space-y-4 font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed whitespace-pre-line selection:bg-amber-500/30">
                {data.birthdayMessage}
              </div>

              {/* Signoff */}
              <div className="pt-8 border-t border-zinc-800/80 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-handwriting text-2xl sm:text-3xl text-amber-300/90">
                    {data.handwrittenSignoff}
                  </p>
                  <p className="font-cinzel text-xs tracking-widest text-zinc-400 uppercase mt-1">
                    {data.senderName}
                  </p>
                </div>

                <button
                  id="letter-continue-btn"
                  onClick={() => {
                    audioEngine.playTransition();
                    onContinue();
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 border border-amber-400/50 hover:border-amber-300 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Step Into The Wish Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
