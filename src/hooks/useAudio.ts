import { useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../utils/audioEngine';

export function useAudio() {
  const [isMuted, setIsMuted] = useState<boolean>(() => audioEngine.getMuted());
  const [currentTrack, setCurrentTrack] = useState<'ambient' | 'beast' | 'none'>('none');

  const toggleMute = useCallback(() => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  const playMusic = useCallback((track: 'ambient' | 'beast') => {
    audioEngine.startMusic(track);
    setCurrentTrack(track);
  }, []);

  const stopMusic = useCallback(() => {
    audioEngine.stopMusic();
    setCurrentTrack('none');
  }, []);

  return {
    isMuted,
    currentTrack,
    toggleMute,
    playMusic,
    stopMusic,
    audioEngine
  };
}
