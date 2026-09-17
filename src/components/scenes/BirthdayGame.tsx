import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Gift, Moon, DollarSign, Cake, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { SceneButton } from '../ui/SceneButton';

interface BirthdayGameProps {
  onProceed: () => void;
}

export const BirthdayGame: React.FC<BirthdayGameProps> = ({ onProceed }) => {
  const [currentChallenge, setCurrentChallenge] = useState<1 | 2 | 3 | 4>(1);

  // Challenge 1 state: moving star position
  const [starPos, setStarPos] = useState({ top: '35%', left: '50%' });

  // Challenge 2 state: gifts
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [giftFeedback, setGiftFeedback] = useState<string | null>(null);

  // Challenge 3 state: fate choice
  const [fateResponse, setFateResponse] = useState<string | null>(null);

  // Challenge 1: Catch Star
  const handleStarClick = () => {
    audioEngine.playStarCatch();
    setCurrentChallenge(2);
  };

  const handleStarHover = () => {
    // Random position within 20% to 75%
    const newTop = `${Math.floor(Math.random() * 55 + 20)}%`;
    const newLeft = `${Math.floor(Math.random() * 65 + 15)}%`;
    setStarPos({ top: newTop, left: newLeft });
  };

  // Challenge 2: Mystery Gifts
  // Index 2 is the winning gift!
  const handleGiftClick = (idx: number) => {
    if (idx === 2) {
      audioEngine.playGiftOpen();
      setSelectedGift(idx);
      setGiftFeedback("JACKPOT! You found the golden birthday box!");
      setTimeout(() => {
        setCurrentChallenge(3);
      }, 1400);
    } else {
      audioEngine.playGlitch();
      setSelectedGift(idx);
      setGiftFeedback(idx === 0 ? "Just an empty Amazon box filled with bubble wrap 😂" : "A receipt from 2021 for a single iced coffee 😂");
    }
  };

  // Challenge 3: Choose Your Fate
  const handleFateChoice = (choice: 'cake' | 'money' | 'sleep') => {
    audioEngine.playCelebrationChime();
    if (choice === 'money') {
      setFateResponse("Excellent choice. Unfortunately, the website has a budget of ₹0. 😂");
    } else if (choice === 'cake') {
      setFateResponse("Approved! Virtual calories: 0. Satisfaction: 100%. 😂");
    } else {
      setFateResponse("Granted! Your alarm clock has been permanently disabled. Sleep forever. 😂");
    }

    setTimeout(() => {
      setCurrentChallenge(4); // All cleared
    }, 1800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono text-center">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURITY CHALLENGES ({Math.min(3, currentChallenge)} / 3)</span>
          </div>
          <p className="font-cormorant text-xl sm:text-2xl text-zinc-300 italic">
            "Unfortunately, birthday privileges must be unlocked."
          </p>
        </div>

        {/* CHALLENGE 01: Catch the Star */}
        {currentChallenge === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-72 w-full bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col items-center justify-between overflow-hidden"
          >
            <div className="text-xs font-mono text-amber-300 uppercase tracking-wider">
              CHALLENGE 01: CATCH THE ROGUE STAR
            </div>

            <p className="text-xs text-zinc-400 font-sans">
              Tap or click the evasive celestial body to demonstrate quick reflexes.
            </p>

            <motion.button
              id="btn-catch-star"
              onClick={handleStarClick}
              onMouseEnter={handleStarHover}
              onTouchStart={handleStarHover}
              style={{ top: starPos.top, left: starPos.left }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="absolute p-3.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.8)] cursor-pointer hover:scale-125 transition-transform"
            >
              <Star className="w-6 h-6 fill-amber-300" />
            </motion.button>

            <div className="text-[11px] text-zinc-500 font-mono">
              [TIP: BE FASTER THAN THE COSMOS]
            </div>
          </motion.div>
        )}

        {/* CHALLENGE 02: Find the Hidden Gift */}
        {currentChallenge === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
          >
            <div className="text-xs font-mono text-amber-300 uppercase tracking-wider">
              CHALLENGE 02: FIND THE HIDDEN VAULT
            </div>

            <p className="text-xs text-zinc-400 font-sans">
              Three identical encrypted containers. Only one contains the real gift.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[0, 1, 2].map((idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGiftClick(idx)}
                  className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                    selectedGift === idx
                      ? idx === 2
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                        : 'bg-rose-950/40 border-rose-500 text-rose-300'
                      : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-400 hover:border-amber-400/50'
                  }`}
                >
                  <Gift className="w-8 h-8" />
                  <span className="font-mono text-xs">VAULT #{idx + 1}</span>
                </motion.button>
              ))}
            </div>

            {giftFeedback && (
              <p className="text-xs font-mono text-amber-300 animate-bounce">
                {giftFeedback}
              </p>
            )}
          </motion.div>
        )}

        {/* CHALLENGE 03: Choose Your Fate */}
        {currentChallenge === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
          >
            <div className="text-xs font-mono text-amber-300 uppercase tracking-wider">
              CHALLENGE 03: CHOOSE YOUR FATE
            </div>

            <p className="text-xs text-zinc-400 font-sans">
              Select your priority birthday blessing for this upcoming orbit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleFateChoice('cake')}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-400 text-zinc-200 font-cinzel text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Cake className="w-4 h-4 text-rose-400" />
                <span>MORE CAKE</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleFateChoice('money')}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-400 text-zinc-200 font-cinzel text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>MORE MONEY</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleFateChoice('sleep')}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-400 text-zinc-200 font-cinzel text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>MORE SLEEP</span>
              </motion.button>
            </div>

            {fateResponse && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-mono text-amber-300 pt-2"
              >
                {fateResponse}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Challenge Cleared Banner */}
        {currentChallenge === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-cinzel text-base font-bold tracking-wider">
              <CheckCircle2 className="w-5 h-5" />
              <span>ALL BIRTHDAY PRIVILEGES GRANTED</span>
            </div>

            <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto">
              You passed all trials. Your clearance level has been elevated to VIP celebrant.
            </p>

            <div className="pt-2">
              <SceneButton
                variant="primary"
                onClick={onProceed}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                PROCEED TO THE WISH ORB
              </SceneButton>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
