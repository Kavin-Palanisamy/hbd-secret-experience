import React from 'react';
import { motion } from 'motion/react';
import { audioEngine } from '../../utils/audioEngine';

interface SceneButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyber';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const SceneButton: React.FC<SceneButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  isLoading,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    audioEngine.playClick();
    if (onClick) onClick(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/50 hover:border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.2)]';
      case 'cyber':
        return 'bg-gradient-to-r from-red-600/30 to-amber-600/30 hover:from-red-600/50 hover:to-amber-600/50 text-white border-amber-400 shadow-[0_0_35px_rgba(239,68,68,0.4)]';
      case 'danger':
        return 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
      case 'secondary':
        return 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700/80 hover:border-zinc-500';
      case 'ghost':
        return 'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-200 border-transparent';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full border text-xs sm:text-sm font-cinzel font-semibold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none ${getVariantStyles()} ${className}`}
      {...props as any}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
