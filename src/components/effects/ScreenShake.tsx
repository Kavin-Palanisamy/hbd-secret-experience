import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ScreenShakeProps {
  children: React.ReactNode;
  trigger?: number; // timestamp or counter
  intensity?: number;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
  children,
  trigger = 0,
  intensity = 8
}) => {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!trigger || trigger <= 0) return;
    setIsShaking(true);
    const timer = setTimeout(() => {
      setIsShaking(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <motion.div
      className="w-full min-h-screen"
      animate={
        isShaking
          ? {
              x: [-intensity, intensity, -intensity * 0.7, intensity * 0.7, -intensity * 0.3, 0],
              y: [intensity * 0.8, -intensity * 0.8, intensity * 0.5, -intensity * 0.5, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};
