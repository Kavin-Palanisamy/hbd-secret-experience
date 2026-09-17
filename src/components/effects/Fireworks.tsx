import React, { useEffect, useRef } from 'react';

interface FireworksProps {
  active: boolean;
}

interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  color: string;
  exploded: boolean;
  sparks: Spark[];
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

export const Fireworks: React.FC<FireworksProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const fireworks: FireworkRocket[] = [];
    const colors = ['#f59e0b', '#fbbf24', '#ec4899', '#6366f1', '#10b981', '#38bdf8', '#f43f5e', '#a855f7'];
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Launch a new firework periodically
      if (tick % 24 === 0 && fireworks.length < 8) {
        const x = Math.random() * (width * 0.8) + width * 0.1;
        const targetY = Math.random() * (height * 0.45) + height * 0.1;
        const color = colors[Math.floor(Math.random() * colors.length)];

        fireworks.push({
          x,
          y: height,
          targetY,
          color,
          exploded: false,
          sparks: []
        });
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        if (!fw.exploded) {
          fw.y -= 9;
          ctx.fillStyle = fw.color;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            const sparkCount = 65;
            for (let j = 0; j < sparkCount; j++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = Math.random() * 4.8 + 1.5;
              fw.sparks.push({
                x: fw.x,
                y: fw.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.014,
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
            sp.vy += 0.055; // gravity
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

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 block w-full h-full"
    />
  );
};
