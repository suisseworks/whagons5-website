'use client';

import { useEffect, useRef } from "react";

interface FogEffectProps {
  intensity?: 'normal' | 'reduced';
}

interface FogLayer {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  verticalSpeed: number;
  baseY: number;
  waveOffset: number;
  colorIndex: number; // 0=purple, 1=teal, 2=gold
}

// Aurora color palette for magic mode
const AURORA_COLORS = [
  { r: 147, g: 51, b: 234 },  // purple
  { r: 6, g: 182, b: 212 },   // teal
  { r: 251, g: 191, b: 36 },  // gold
];

export default function FogEffect({ intensity = 'reduced' }: FogEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogLayersRef = useRef<FogLayer[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create fog layers with aurora colors
    const createFogLayers = () => {
      const isReduced = intensity === 'reduced';
      const count = isReduced ? 14 : 24;
      fogLayersRef.current = [];
      for (let i = 0; i < count; i++) {
        fogLayersRef.current.push({
          x: Math.random() * (canvas.width + 200) - 100,
          y: Math.random() * canvas.height,
          size: Math.random() * 320 + 180,
          speed: Math.random() * 0.25 + 0.08,
          opacity: isReduced
            ? Math.random() * 0.06 + 0.02
            : Math.random() * 0.1 + 0.04,
          drift: (Math.random() - 0.5) * 0.15,
          verticalSpeed: Math.random() * 0.06 - 0.03,
          baseY: Math.random() * canvas.height,
          waveOffset: Math.random() * Math.PI * 2,
          colorIndex: Math.floor(Math.random() * AURORA_COLORS.length),
        });
      }
    };
    createFogLayers();

    let time = 0;
    let paused = false;

    const onVisibilityChange = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = () => {
      if (paused) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      time += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fogLayersRef.current.forEach((fog) => {
        fog.x += (fog.speed + fog.drift) * 1.1;

        const waveY = Math.sin(time * 0.2 + fog.waveOffset) * 15;
        fog.y = fog.baseY + waveY + (fog.verticalSpeed * time * 3);

        if (fog.x > canvas.width + fog.size) {
          fog.x = -fog.size;
          fog.baseY = Math.random() * canvas.height;
          fog.waveOffset = Math.random() * Math.PI * 2;
          fog.colorIndex = Math.floor(Math.random() * AURORA_COLORS.length);
        }
        if (fog.x < -fog.size) {
          fog.x = canvas.width + fog.size;
          fog.baseY = Math.random() * canvas.height;
          fog.waveOffset = Math.random() * Math.PI * 2;
        }

        if (fog.y > canvas.height + fog.size) {
          fog.baseY = -fog.size;
          fog.y = fog.baseY;
        }
        if (fog.y < -fog.size) {
          fog.baseY = canvas.height + fog.size;
          fog.y = fog.baseY;
        }

        const c = AURORA_COLORS[fog.colorIndex];
        const fogColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${fog.opacity})`;
        const fogMid = `rgba(${c.r}, ${c.g}, ${c.b}, ${fog.opacity * 0.5})`;
        const fogOuter = `rgba(${c.r}, ${c.g}, ${c.b}, ${fog.opacity * 0.2})`;
        const fogTransparent = `rgba(${c.r}, ${c.g}, ${c.b}, 0)`;

        const gradient = ctx.createRadialGradient(
          fog.x, fog.y, fog.size * 0.15,
          fog.x, fog.y, fog.size
        );
        gradient.addColorStop(0, fogColor);
        gradient.addColorStop(0.35, fogMid);
        gradient.addColorStop(0.65, fogOuter);
        gradient.addColorStop(1, fogTransparent);

        ctx.fillStyle = gradient;
        ctx.fillRect(fog.x - fog.size, fog.y - fog.size, fog.size * 2, fog.size * 2);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <div className="fog-effect">
      <canvas
        ref={canvasRef}
        className="fog-canvas"
      />
    </div>
  );
}
