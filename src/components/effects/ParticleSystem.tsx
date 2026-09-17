import React, { useEffect, useRef } from 'react';

interface ParticleSystemProps {
  intensity?: 'low' | 'medium' | 'high' | 'beast' | 'none';
  burstTrigger?: number;
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

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  intensity = 'medium',
  burstTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);

  // Burst trigger
  useEffect(() => {
    if (!burstTrigger || burstTrigger <= 0) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const count = intensity === 'beast' ? 220 : 120;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2.5;
      sparksRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        color: Math.random() > 0.4 ? '#fbbf24' : (Math.random() > 0.5 ? '#ffffff' : '#f43f5e'),
        size: Math.random() * 3 + 1.2
      });
    }
  }, [burstTrigger, intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    let count = 45;
    if (intensity === 'low') count = 20;
    if (intensity === 'high') count = 75;
    if (intensity === 'beast') count = 110;
    if (intensity === 'none') count = 0;
    if (isMobile) count = Math.round(count * 0.55);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const ambientColors = [
      'rgba(251, 191, 36, ',
      'rgba(245, 158, 11, ',
      'rgba(255, 255, 255, ',
      'rgba(224, 231, 255, '
    ];

    const beastColors = [
      'rgba(244, 63, 94, ',
      'rgba(56, 189, 248, ',
      'rgba(251, 191, 36, ',
      'rgba(168, 85, 247, '
    ];

    const particles: Particle[] = [];
    const isBeast = intensity === 'beast';

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isBeast ? 1.6 : 0.45),
        vy: (Math.random() - 0.5) * (isBeast ? 1.6 : 0.45) - 0.2,
        size: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.6 + 0.2,
        color: (isBeast ? beastColors : ambientColors)[Math.floor(Math.random() * 4)],
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // In beast mode render faint grid
      if (isBeast) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.025)';
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

      // Draw floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const twinkle = Math.sin(tick * p.twinkleSpeed + p.twinkleOffset) * 0.3 + 0.7;
        ctx.fillStyle = `${p.color}${p.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw burst sparks
      const sparks = sparksRef.current;
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

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
    />
  );
};
