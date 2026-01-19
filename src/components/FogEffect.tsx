import { useEffect, useRef, useState } from "react";

interface FogEffectProps {
  onClose?: () => void;
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
}

export default function FogEffect({ onClose, intensity = 'normal' }: FogEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogLayersRef = useRef<FogLayer[]>([]);
  const animationFrameRef = useRef<number>();
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    // Detect theme changes
    const updateThemeState = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', updateThemeState);

    return () => {
      observer.disconnect();
      mql.removeEventListener('change', updateThemeState);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create fog layers
    const createFogLayers = () => {
      const isReduced = intensity === 'reduced';
      const count = isReduced ? 18 : 30; // Slightly fewer fog layers
      fogLayersRef.current = [];
      for (let i = 0; i < count; i++) {
        fogLayersRef.current.push({
          x: Math.random() * (canvas.width + 200) - 100,
          y: Math.random() * canvas.height,
          size: Math.random() * 280 + 150, // Varied patch sizes
          speed: Math.random() * 0.3 + 0.1, // Gentle movement speed
          opacity: isReduced 
            ? Math.random() * 0.10 + 0.05 // Slightly reduced intensity
            : Math.random() * 0.20 + 0.12, // Reduced mist opacity
          drift: (Math.random() - 0.5) * 0.2, // Horizontal drift
          verticalSpeed: Math.random() * 0.08 - 0.04, // Vertical movement
          baseY: Math.random() * canvas.height,
          waveOffset: Math.random() * Math.PI * 2, // Wave phase offset
        });
      }
    };
    createFogLayers();

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.005; // Smooth time progression for mist movement
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fogLayersRef.current.forEach((fog) => {
        // Update position with natural mist movement patterns
        fog.x += (fog.speed + fog.drift) * 1.2;
        
        // Add gentle vertical movement with wave effect for mist
        const waveY = Math.sin(time * 0.25 + fog.waveOffset) * 12;
        fog.y = fog.baseY + waveY + (fog.verticalSpeed * time * 4);

        // Reset if fog goes off screen horizontally
        if (fog.x > canvas.width + fog.size) {
          fog.x = -fog.size;
          fog.baseY = Math.random() * canvas.height;
          fog.waveOffset = Math.random() * Math.PI * 2;
        }
        if (fog.x < -fog.size) {
          fog.x = canvas.width + fog.size;
          fog.baseY = Math.random() * canvas.height;
          fog.waveOffset = Math.random() * Math.PI * 2;
        }

        // Reset if fog goes off screen vertically
        if (fog.y > canvas.height + fog.size) {
          fog.baseY = -fog.size;
          fog.y = fog.baseY;
        }
        if (fog.y < -fog.size) {
          fog.baseY = canvas.height + fog.size;
          fog.y = fog.baseY;
        }

        // Draw fog as gradient circle with multiple layers for depth
        // Dark mode: brighter, more visible fog, Light mode: darker gray fog
        const fogColor = isDarkMode 
          ? `rgba(220, 220, 240, ${fog.opacity})`
          : `rgba(140, 150, 170, ${fog.opacity})`;
        const fogColorTransparent = isDarkMode 
          ? 'rgba(220, 220, 240, 0)'
          : 'rgba(140, 150, 170, 0)';
        
        // Create radial gradient for fog with more solid center
        const gradient = ctx.createRadialGradient(
          fog.x, fog.y, fog.size * 0.25,
          fog.x, fog.y, fog.size
        );
        gradient.addColorStop(0, fogColor);
        gradient.addColorStop(0.5, isDarkMode 
          ? `rgba(220, 220, 240, ${fog.opacity * 0.8})`
          : `rgba(140, 150, 170, ${fog.opacity * 0.8})`);
        gradient.addColorStop(0.8, isDarkMode 
          ? `rgba(220, 220, 240, ${fog.opacity * 0.4})`
          : `rgba(140, 150, 170, ${fog.opacity * 0.4})`);
        gradient.addColorStop(1, fogColorTransparent);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(fog.x - fog.size, fog.y - fog.size, fog.size * 2, fog.size * 2);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDarkMode, intensity]);

  return (
    <div className="fog-effect">
      <canvas
        ref={canvasRef}
        className="fog-canvas"
      />
    </div>
  );
}
