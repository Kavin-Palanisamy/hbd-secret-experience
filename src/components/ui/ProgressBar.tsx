import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  label?: string;
  showPercent?: boolean;
  className?: string;
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-amber-400',
  label,
  showPercent = true,
  className = '',
  height = 'h-2'
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full space-y-1.5 font-mono ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs text-zinc-400">
          {label && <span>{label}</span>}
          {showPercent && <span className="text-zinc-200 font-semibold">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className={`w-full bg-zinc-900/90 rounded-full overflow-hidden border border-zinc-800 p-0.5 ${height}`}>
        <motion.div
          className={`h-full rounded-full ${color} shadow-[0_0_12px_rgba(251,191,36,0.6)]`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
