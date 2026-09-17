import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, ArrowRight, Scan, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { ProgressBar } from '../ui/ProgressBar';
import { SceneButton } from '../ui/SceneButton';

interface IdentityScanProps {
  name: string;
  age: number;
  personalityScan: {
    overthinking: number;
    chaos: number;
    sleep: number;
    productivity: string;
    happiness: number;
  };
  onProceed: () => void;
}

export const IdentityScan: React.FC<IdentityScanProps> = ({
  name,
  age,
  personalityScan,
  onProceed
}) => {
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [narrativeStep, setNarrativeStep] = useState<number>(0);

  useEffect(() => {
    // Start ambient soundtrack
    audioEngine.startMusic('ambient');

    // Simulate futuristic progress scan
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          audioEngine.playSuccessChime();
          return 100;
        }
        audioEngine.playTypingBeep();
        return prev + 12;
      });
    }, 160);

    return () => clearInterval(interval);
  }, []);

  // Timed narrative reveal after scan completes
  useEffect(() => {
    if (scanProgress < 100) return;

    const t1 = setTimeout(() => {
      setNarrativeStep(1); // "Interesting."
      audioEngine.playTypingBeep();
    }, 900);

    const t2 = setTimeout(() => {
      setNarrativeStep(2); // "Very interesting."
      audioEngine.playTypingBeep();
    }, 2200);

    const t3 = setTimeout(() => {
      setNarrativeStep(3); // "We found something."
      audioEngine.playGlitch();
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [scanProgress]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 select-none z-10 font-mono">
      <div className="w-full max-w-xl mx-auto space-y-6 text-left">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="tracking-widest uppercase">QUANTUM BIOMETRICS & NEURAL TELEMETRY</span>
          </div>
          <span className="text-amber-400 font-bold">{Math.min(100, scanProgress)}%</span>
        </div>

        {/* Identity Analysis Block */}
        <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-amber-300 tracking-wider">
              IDENTITY ANALYSIS
            </h2>
            <Fingerprint className="w-5 h-5 text-amber-400/80" />
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-zinc-300 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Name ........................</span>
              <span className="text-white font-bold tracking-wider">{name.toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Birthday ....................</span>
              <span className="text-emerald-400 font-semibold tracking-wider">DETECTED</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Age .........................</span>
              <span className="text-amber-300 font-bold">{age}</span>
            </div>
          </div>

          {/* Personality scan bar */}
          <div className="pt-2 border-t border-zinc-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Personality scan...</span>
              <span className="text-amber-400 font-mono font-bold">
                {scanProgress >= 100 ? '100% COMPLETE' : `${scanProgress}%`}
              </span>
            </div>
            <ProgressBar progress={scanProgress} color="bg-amber-400" showPercent={false} />
          </div>

          {/* Fake results revealed after scan */}
          {scanProgress >= 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-3 border-t border-zinc-800/80 space-y-2.5 text-xs"
            >
              <div className="flex justify-between items-center text-zinc-400">
                <span>OVERTHINKING</span>
                <span className="text-amber-300 font-bold">{personalityScan.overthinking}%</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>CHAOS</span>
                <span className="text-rose-400 font-bold">{personalityScan.chaos}%</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>SLEEP</span>
                <span className="text-indigo-400 font-bold">{personalityScan.sleep}%</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>PRODUCTIVITY</span>
                <span className="text-red-400 font-mono font-bold animate-pulse">{personalityScan.productivity}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>HAPPINESS</span>
                <span className="text-emerald-400 font-bold">{personalityScan.happiness}%</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Narrative progression */}
        <div className="min-h-[70px] space-y-2 pt-2">
          {narrativeStep >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-zinc-400 font-cormorant text-lg italic"
            >
              "Interesting."
            </motion.p>
          )}

          {narrativeStep >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-zinc-300 font-cormorant text-lg italic"
            >
              "Very interesting."
            </motion.p>
          )}

          {narrativeStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-3 flex items-center justify-between"
            >
              <p className="text-amber-300 font-cinzel text-sm font-semibold tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>"We found something."</span>
              </p>

              <SceneButton
                variant="primary"
                onClick={onProceed}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                INVESTIGATE
              </SceneButton>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};
