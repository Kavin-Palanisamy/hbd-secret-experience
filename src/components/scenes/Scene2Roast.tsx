import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, ArrowRight, BarChart2, Flame, AlertCircle } from 'lucide-react';
import { RoastStats, DiagnosticStats } from '../../types';
import { audioEngine } from '../../utils/audioEngine';

interface Scene2RoastProps {
  roastStats: RoastStats;
  diagnosticStats: DiagnosticStats;
  onProceed: () => void;
}

export const Scene2Roast: React.FC<Scene2RoastProps> = ({
  roastStats,
  diagnosticStats,
  onProceed
}) => {
  const [analyzed, setAnalyzed] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleRunAnalysis = () => {
    audioEngine.playGlitch();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAnalyzed(true);
      audioEngine.playSuccessChime();
    }, 1800);
  };

  const statEntries = [
    { label: "Sleeping", val: roastStats.sleeping, color: "from-blue-500 to-indigo-600" },
    { label: "Overthinking", val: roastStats.overthinking, color: "from-purple-500 to-pink-600" },
    { label: "Eating snacks", val: roastStats.eating, color: "from-amber-500 to-orange-600" },
    { label: "Actually working", val: roastStats.working, color: "from-emerald-500 to-teal-600" },
    { label: "Pretending to be busy", val: roastStats.pretendingBusy, color: "from-rose-500 to-red-600" }
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 select-none z-10 font-sans">
      <div className="w-full max-w-2xl bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>The Roast Engine</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-4xl text-zinc-100 font-bold tracking-wide">
            BEFORE WE CELEBRATE...
          </h1>
          <p className="font-cormorant text-lg sm:text-xl text-zinc-400 italic">
            "We need to discuss something."
          </p>
        </div>

        {/* Fake Analytics Section */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-3.5 font-mono">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              HUMAN BEHAVIORAL TELEMETRY
            </span>
            <span>ACCURACY: QUESTIONABLE</span>
          </div>

          <div className="space-y-3 pt-1">
            {statEntries.map((stat, idx) => (
              <div key={`stat-${idx}`} className="space-y-1">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-zinc-300">{stat.label}</span>
                  <span className="text-amber-300 font-bold">{stat.val}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.val}%` }}
                    transition={{ duration: 1, delay: idx * 0.15 }}
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 italic text-right pt-1">
            *Source: Completely verified by zero scientists. 😂
          </p>
        </div>

        {/* Deep Analysis Action or Results */}
        {!analyzed ? (
          <div className="text-center pt-2">
            <button
              id="btn-deep-analysis"
              onClick={handleRunAnalysis}
              disabled={isScanning}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-600/20 hover:from-amber-500/40 border border-amber-400/50 hover:border-amber-300 text-amber-100 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
            >
              <Cpu className={`w-4 h-4 text-amber-300 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'SCANNING BRAIN WAVES...' : 'RUN DEEP ANALYSIS'}</span>
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-4 font-mono"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-amber-500/20 pb-2">
                <AlertCircle className="w-4 h-4" />
                <span>DIAGNOSTIC RESULTS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Confidence</div>
                  <div className="text-base text-emerald-400 font-bold">{diagnosticStats.confidence}%</div>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Chaos</div>
                  <div className="text-base text-purple-400 font-bold">{diagnosticStats.chaos}%</div>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Common Sense</div>
                  <div className="text-xs text-amber-400 font-bold mt-1 animate-pulse">{diagnosticStats.commonSense}</div>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500">Patience</div>
                  <div className="text-base text-rose-400 font-bold">{diagnosticStats.patience}%</div>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 col-span-2 sm:col-span-2">
                  <div className="text-zinc-500">Birthday Energy</div>
                  <div className="text-base text-amber-300 font-black tracking-widest">{diagnosticStats.birthdayEnergy}% 🔥</div>
                </div>
              </div>

              <div className="pt-2 text-center space-y-1">
                <p className="text-xs text-zinc-400 uppercase tracking-widest">Diagnosis complete:</p>
                <p className="font-cinzel text-base sm:text-lg text-amber-200 font-bold">
                  "You're officially impossible to replace."
                </p>
              </div>

              <div className="pt-3 flex justify-center">
                <button
                  id="btn-roast-continue"
                  onClick={() => {
                    audioEngine.playTransition();
                    onProceed();
                  }}
                  className="px-8 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-amber-400/50 hover:border-amber-300 text-amber-200 font-cinzel text-xs tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Enter Beast Mode</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
