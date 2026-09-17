import React, { useEffect, useRef } from 'react';
import { SceneId } from '../types';

interface ParticleBackgroundProps {
  currentScene: SceneId;
  isBeastMode?: boolean;
  supernovaTrigger?: number; // timestamp to trigger supernova burst
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  color: string;
  sparks: Spark[];
  exploded: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  currentScene,
  isBeastMode = false,
  supernovaTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const supernovaSparksRef = useRef<Spark[]>([]);

  // Trigger supernova sparks
  useEffect(() => {
    if (!supernovaTrigger || supernovaTrigger <= 0) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const isMobile = width < 768;
    const burstCount = isMobile ? 120 : 260;

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2.5;
      supernovaSparksRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        color: Math.random() > 0.4 ? '#fbbf24' : (Math.random() > 0.5 ? '#ffffff' : '#f43f5e'),
        size: Math.random() * 3.5 + 1.5
      });
    }
  }, [supernovaTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 85;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Color palettes
    const ambientColors = [
      'rgba(251, 191, 36, ',  // Amber gold
      'rgba(245, 158, 11, ',  // Warm honey
      'rgba(255, 255, 255, ', // Starlight white
      'rgba(224, 231, 255, '  // Soft periwinkle
    ];

    const beastColors = [
      'rgba(244, 63, 94, ',   // Rose laser
      'rgba(56, 189, 248, ',  // Cyan laser
      'rgba(251, 191, 36, ',  // Neon amber
      'rgba(168, 85, 247, '   // Cyber purple
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isFast = isBeastMode;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isFast ? 1.5 : 0.4),
        vy: (Math.random() - 0.5) * (isFast ? 1.5 : 0.4) - 0.2,
        size: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.6 + 0.2,
        color: (isBeastMode ? beastColors : ambientColors)[Math.floor(Math.random() * 4)],
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    const fireworks: Firework[] = [];
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // In Scene 10 (Silence), fade particles almost completely
      const globalOpacity = currentScene === 10 ? 0.04 : 0.85;

      // Render Cyber Grid in Beast Mode
      if (isBeastMode && currentScene !== 10) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        const offset = (tick * 0.5) % gridSize;

        for (let x = offset; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = offset; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Render floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const twinkle = Math.sin(tick * p.twinkleSpeed + p.twinkleOffset) * 0.3 + 0.7;
        const currentAlpha = p.alpha * twinkle * globalOpacity;

        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Supernova sparks
      const sparks = supernovaSparksRef.current;
      if (sparks.length > 0) {
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.98;
          s.vy *= 0.98;
          s.alpha -= s.decay;

          if (s.alpha <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // Render Fireworks in Scene 11 (Final Chaos)
      if (currentScene === 11) {
        if (tick % (isMobile ? 50 : 30) === 0 && fireworks.length < 6) {
          const fireworkX = Math.random() * (width * 0.8) + width * 0.1;
          const targetY = Math.random() * (height * 0.45) + height * 0.1;
          const fwColors = ['#f59e0b', '#fbbf24', '#ec4899', '#6366f1', '#10b981', '#38bdf8'];
          const fwColor = fwColors[Math.floor(Math.random() * fwColors.length)];

          fireworks.push({
            x: fireworkX,
            y: height,
            targetY,
            color: fwColor,
            sparks: [],
            exploded: false
          });
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
          const fw = fireworks[i];
          if (!fw.exploded) {
            fw.y -= 8;
            ctx.fillStyle = fw.color;
            ctx.beginPath();
            ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
            ctx.fill();

            if (fw.y <= fw.targetY) {
              fw.exploded = true;
              const sparkCount = isMobile ? 35 : 65;
              for (let j = 0; j < sparkCount; j++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * 4.5 + 1.2;
                fw.sparks.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  alpha: 1,
                  decay: Math.random() * 0.02 + 0.015,
                  color: fw.color,
                  size: Math.random() * 2.2 + 1
                });
              }
            }
          } else {
            for (let j = fw.sparks.length - 1; j >= 0; j--) {
              const sp = fw.sparks[j];
              sp.x += sp.vx;
              sp.y += sp.vy;
              sp.vy += 0.05; // gravity
              sp.vx *= 0.98;
              sp.alpha -= sp.decay;

              if (sp.alpha <= 0) {
                fw.sparks.splice(j, 1);
                continue;
              }

              ctx.fillStyle = sp.color;
              ctx.globalAlpha = sp.alpha;
              ctx.beginPath();
              ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1.0;
            }

            if (fw.sparks.length === 0) {
              fireworks.splice(i, 1);
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentScene, isBeastMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      style={{ opacity: currentScene === 10 ? 0.08 : 1, transition: 'opacity 1.5s ease' }}
    />
  );
};
