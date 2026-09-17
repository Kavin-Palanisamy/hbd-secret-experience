import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check, Copy, RotateCcw, Play } from 'lucide-react';
import { BirthdayData } from '../types';
import { defaultBirthdayData } from '../data/birthdayData';
import { audioEngine } from '../utils/audioEngine';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: BirthdayData;
  onApplyData: (newData: BirthdayData) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onApplyData
}) => {
  const [formData, setFormData] = useState<BirthdayData>({ ...currentData });
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData({ ...defaultBirthdayData });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playTransition();
    onApplyData(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl text-zinc-100 font-bold tracking-wider">
                Personalize This Universe
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Configure "One More Chapter — Beast Mode" for your birthday friend or loved one
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar">
          {/* Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-cinzel text-zinc-300 tracking-wider uppercase mb-1.5">
                Birthday Person's Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-zinc-300 tracking-wider uppercase mb-1.5">
                Turning Age / Milestone
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 21 })}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-zinc-300 tracking-wider uppercase mb-1.5">
                Relationship
              </label>
              <input
                type="text"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                required
                placeholder="e.g. Best Friend, Partner"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Letter Message */}
          <div>
            <label className="block text-xs font-cinzel text-zinc-300 tracking-wider uppercase mb-1.5">
              Personalized Birthday Letter (Scene 7)
            </label>
            <textarea
              rows={4}
              value={formData.birthdayMessage}
              onChange={(e) => setFormData({ ...formData, birthdayMessage: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
            />
          </div>

          {/* Secret Message */}
          <div>
            <label className="block text-xs font-cinzel text-amber-300 tracking-wider uppercase mb-1.5">
              VIP Secret Vault Message (Scene 12 Easter Egg)
            </label>
            <textarea
              rows={3}
              value={formData.secretMessage}
              onChange={(e) => setFormData({ ...formData, secretMessage: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-amber-200 text-sm focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
            />
          </div>

          {/* Signoff & Sender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-cinzel text-zinc-300 tracking-wider uppercase mb-1.5">
                Signoff Line
              </label>
              <input
                type="text"
                value={formData.handwrittenSignoff}
                onChange={(e) => setFormData({ ...formData, handwrittenSignoff: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-amber-400 font-handwriting text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-zinc-300 tracking-wider uppercase mb-1.5">
                Your Name / Sender
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Quick JSON Copy Helper */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleCopyJson}
              className="text-xs font-mono text-zinc-400 hover:text-amber-300 flex items-center gap-1.5 py-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied birthdayData JSON!' : 'Copy Config as JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 py-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Default</span>
            </button>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-cinzel tracking-wider uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 hover:border-amber-300 text-amber-200 text-xs font-cinzel tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Experience</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
