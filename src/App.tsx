import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { defaultBirthdayData } from './data/birthdayData';
import { BirthdayData, SceneId } from './types';
import { audioEngine } from './utils/audioEngine';

// Effects & Ambient UI
import { ParticleSystem } from './components/effects/ParticleSystem';
import { Fireworks } from './components/effects/Fireworks';
import { ScreenShake } from './components/effects/ScreenShake';
import { CursorEffects } from './components/effects/CursorEffects';
import { AudioController } from './components/ui/AudioController';
import { EasterEggs } from './components/ui/EasterEggs';
import { CustomizerModal } from './components/CustomizerModal';

// 14 Sequential Scenes
import { MysteryIntro } from './components/scenes/MysteryIntro';
import { IdentityScan } from './components/scenes/IdentityScan';
import { MemoryUniverse } from './components/scenes/MemoryUniverse';
import { RoastMachine } from './components/scenes/RoastMachine';
import { BirthdayDetection } from './components/scenes/BirthdayDetection';
import { BirthdayGame } from './components/scenes/BirthdayGame';
import { WishOrb } from './components/scenes/WishOrb';
import { CakeBoss } from './components/scenes/CakeBoss';
import { EmotionalMessage } from './components/scenes/EmotionalMessage';
import { MemoryWall } from './components/scenes/MemoryWall';
import { BeastMode } from './components/scenes/BeastMode';
import { Achievements } from './components/scenes/Achievements';
import { SecretEnding } from './components/scenes/SecretEnding';

const SCENE_FLOW: SceneId[] = [
  'mystery-intro',
  'identity-scan',
  'memory-universe',
  'roast-machine',
  'birthday-detection',
  'birthday-game',
  'wish-orb',
  'cake-boss',
  'emotional-message',
  'memory-wall',
  'beast-mode',
  'achievements',
  'secret-ending'
];

export default function App() {
  const [data, setData] = useState<BirthdayData>(() => {
    try {
      const saved = localStorage.getItem('unexpected_hbd_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultBirthdayData;
  });

  const [currentScene, setCurrentScene] = useState<SceneId>('mystery-intro');
  const [isBeastMode, setIsBeastMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [burstTrigger, setBurstTrigger] = useState<number>(0);
  const [shakeTrigger, setShakeTrigger] = useState<number>(0);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  const sceneIndex = SCENE_FLOW.indexOf(currentScene) + 1;
  const totalScenes = SCENE_FLOW.length;

  // Keyboard shortcut (M to toggle mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        const nextMuted = audioEngine.toggleMute();
        setIsMuted(nextMuted);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = audioEngine.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const goToScene = useCallback((scene: SceneId) => {
    setCurrentScene(scene);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTriggerBurst = useCallback(() => {
    setBurstTrigger(Date.now());
    setShakeTrigger(Date.now());
  }, []);

  const handleApplyData = (newData: BirthdayData) => {
    setData(newData);
    try {
      localStorage.setItem('unexpected_hbd_data', JSON.stringify(newData));
    } catch {}
    setIsBeastMode(false);
    goToScene('mystery-intro');
  };

  const handleReplay = () => {
    setIsBeastMode(false);
    audioEngine.startMusic('ambient');
    goToScene('mystery-intro');
  };

  return (
    <ScreenShake trigger={shakeTrigger} intensity={isBeastMode ? 14 : 7}>
      <div className={`relative min-h-screen w-full bg-black text-white selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans transition-colors duration-1000 ${isBeastMode ? 'border-t-2 border-amber-400' : ''}`}>
        
        {/* Dynamic Background Particle System */}
        <ParticleSystem
          intensity={
            currentScene === 'mystery-intro'
              ? 'low'
              : isBeastMode
              ? 'beast'
              : currentScene === 'emotional-message'
              ? 'none'
              : 'medium'
          }
          burstTrigger={burstTrigger}
        />

        {/* Beast Mode Fireworks Celebration */}
        <Fireworks active={isBeastMode} />

        {/* Ambient Mouse Radial Glow */}
        <CursorEffects />

        {/* Radial Depth Vignette */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-radial from-transparent via-black/40 to-black/90" />

        {/* Top Floating Protocol Controller */}
        <AudioController
          currentScene={currentScene}
          sceneIndex={sceneIndex}
          totalScenes={totalScenes}
          isBeastMode={isBeastMode}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* Hidden Easter Eggs Listener */}
        <EasterEggs name={data.name} />

        {/* Main Scene Viewport */}
        <main className="relative z-10 w-full min-h-screen flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {currentScene === 'mystery-intro' && (
              <motion.div
                key="mystery-intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <MysteryIntro
                  initialName={data.name}
                  onProceed={(enteredName) => {
                    setData((prev) => ({ ...prev, name: enteredName }));
                    goToScene('identity-scan');
                  }}
                />
              </motion.div>
            )}

            {currentScene === 'identity-scan' && (
              <motion.div
                key="identity-scan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <IdentityScan
                  name={data.name}
                  age={data.age}
                  personalityScan={data.personalityScan}
                  onProceed={() => goToScene('memory-universe')}
                />
              </motion.div>
            )}

            {currentScene === 'memory-universe' && (
              <motion.div
                key="memory-universe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.7 }}
                className="w-full"
              >
                <MemoryUniverse
                  memories={data.memories}
                  onProceed={() => goToScene('roast-machine')}
                />
              </motion.div>
            )}

            {currentScene === 'roast-machine' && (
              <motion.div
                key="roast-machine"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <RoastMachine
                  roastStats={data.roastStats}
                  onProceed={() => goToScene('birthday-detection')}
                />
              </motion.div>
            )}

            {currentScene === 'birthday-detection' && (
              <motion.div
                key="birthday-detection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <BirthdayDetection
                  name={data.name}
                  onTriggerBurst={handleTriggerBurst}
                  onProceed={() => goToScene('birthday-game')}
                />
              </motion.div>
            )}

            {currentScene === 'birthday-game' && (
              <motion.div
                key="birthday-game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <BirthdayGame
                  onProceed={() => goToScene('wish-orb')}
                />
              </motion.div>
            )}

            {currentScene === 'wish-orb' && (
              <motion.div
                key="wish-orb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <WishOrb
                  onTriggerBurst={handleTriggerBurst}
                  onProceed={() => goToScene('cake-boss')}
                />
              </motion.div>
            )}

            {currentScene === 'cake-boss' && (
              <motion.div
                key="cake-boss"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <CakeBoss
                  onProceed={() => goToScene('emotional-message')}
                />
              </motion.div>
            )}

            {currentScene === 'emotional-message' && (
              <motion.div
                key="emotional-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="w-full"
              >
                <EmotionalMessage
                  name={data.name}
                  birthdayMessage={data.birthdayMessage}
                  handwrittenSignoff={data.handwrittenSignoff}
                  senderName={data.senderName}
                  onProceed={() => goToScene('memory-wall')}
                />
              </motion.div>
            )}

            {currentScene === 'memory-wall' && (
              <motion.div
                key="memory-wall"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <MemoryWall
                  name={data.name}
                  memories={data.memories}
                  onProceed={() => goToScene('beast-mode')}
                />
              </motion.div>
            )}

            {currentScene === 'beast-mode' && (
              <motion.div
                key="beast-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <BeastMode
                  name={data.name}
                  age={data.age}
                  onActivateBeast={() => {
                    setIsBeastMode(true);
                    handleTriggerBurst();
                  }}
                  onProceed={() => goToScene('achievements')}
                />
              </motion.div>
            )}

            {currentScene === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <Achievements
                  achievements={data.achievements}
                  onProceed={() => goToScene('secret-ending')}
                />
              </motion.div>
            )}

            {currentScene === 'secret-ending' && (
              <motion.div
                key="secret-ending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full"
              >
                <SecretEnding
                  name={data.name}
                  secretMessage={data.secretMessage}
                  onReplay={handleReplay}
                  onOpenCustomizer={() => setIsCustomizerOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* In-App Personalizer Modal */}
        <CustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          currentData={data}
          onApplyData={handleApplyData}
        />
      </div>
    </ScreenShake>
  );
}
