import React from 'react';
import { Volume2, VolumeX, Sparkles, Zap } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';
import { SceneId } from '../../types';

interface AudioControllerProps {
  currentScene: SceneId;
  sceneIndex: number;
  totalScenes: number;
  isBeastMode?: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCustomizer?: () => void;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  currentScene,
  sceneIndex,
  totalScenes,
  isBeastMode = false,
  isMuted,
  onToggleMute,
  onOpenCustomizer
}) => {
  // During mystery intro or emotional silence, keep header completely stealth
  const isMinimal = currentScene === 'mystery-intro' || currentScene === 'emotional-message';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-4 md:p-6 flex items-center justify-between">
      {/* Brand / Chapter title */}
      <div 
        className={`flex items-center gap-2.5 transition-opacity duration-700 ${
          isMinimal ? 'opacity-0' : 'opacity-80 hover:opacity-100'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isBeastMode ? 'bg-rose-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
        <span className="font-cinzel text-xs tracking-[0.25em] uppercase text-zinc-300 font-medium">
          {isBeastMode ? (
            <span className="text-amber-300 font-bold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-300 fill-current" />
              Beast Mode • Phase {sceneIndex} / {totalScenes}
            </span>
          ) : (
            <span>Protocol • {sceneIndex} <span className="text-zinc-500">/ {totalScenes}</span></span>
          )}
        </span>
      </div>

      {/* Controls container */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {onOpenCustomizer && !isMinimal && (
          <button
            id="customize-header-btn"
            onClick={() => {
              audioEngine.playClick();
              onOpenCustomizer();
            }}
            title="Personalize Experience"
            className="text-xs tracking-wider uppercase font-cinzel text-zinc-300 hover:text-amber-300 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Personalize</span>
          </button>
        )}

        <button
          id="music-toggle-btn"
          onClick={() => {
            audioEngine.playClick();
            onToggleMute();
          }}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Unmute (M)" : "Mute (M)"}
          className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-200 flex items-center justify-center cursor-pointer ${
            isMuted
              ? 'bg-zinc-900/60 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              : 'bg-zinc-900/80 text-amber-300 border-amber-500/30 hover:border-amber-400 hover:text-amber-200 shadow-md'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
