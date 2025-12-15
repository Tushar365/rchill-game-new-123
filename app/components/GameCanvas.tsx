'/use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Projectile, Particle } from './Game';

type GameCanvasProps = {
  projectilesRef: React.MutableRefObject<Projectile[]>;
  particlesRef: React.MutableRefObject<Particle[]>;
  isCelebration: boolean;
  onHit: (x: number, y: number) => void;
};

const PROJECTILE_SPEED = 8;

export default function GameCanvas({ 
  projectilesRef, 
  particlesRef, 
  isCelebration, 
  onHit 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateAndDrawGame = useCallback((
    ctx: CanvasRenderingContext2D, 
    screenWidth: number, 
    screenHeight: number
  ) => {
    const bearX = screenWidth * 0.85;
    const bearY = screenHeight / 2;
    
    // Update and draw projectiles
    const remainingProjectiles: Projectile[] = [];
    let hitDetected = false;

    projectilesRef.current.forEach(p => {
      p.x += PROJECTILE_SPEED;
      
      // Draw
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💋', p.x, p.y);
      
      // Hit detection
      const dx = p.x - bearX;
      const dy = p.y - bearY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 60 && !hitDetected) {
        hitDetected = true;
        onHit(bearX, bearY);
      } else if (p.x < screenWidth + 50) {
        remainingProjectiles.push(p);
      }
    });
    
    projectilesRef.current = remainingProjectiles;
    
    // Update and draw particles
    const remainingParticles: Particle[] = [];
    
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.life -= 0.02;
      
      if (p.life > 0) {
        ctx.globalAlpha = p.life;
        ctx.font = '28px Arial';
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.life, p.life);
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
        remainingParticles.push(p);
      }
    });
    
    ctx.globalAlpha = 1.0;
    particlesRef.current = remainingParticles;
  }, [projectilesRef, particlesRef, onHit]);

  // Game Loop
  useEffect(() => {
    let animationId: number;
    
    const render = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      
      const deltaTime = lastTimeRef.current ? currentTime - lastTimeRef.current : 0;
      lastTimeRef.current = currentTime;
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Clear with solid color
      ctx.fillStyle = '#ffeef8';
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      
      if (!isCelebration && deltaTime > 0) {
        updateAndDrawGame(ctx, screenWidth, screenHeight);
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isCelebration, updateAndDrawGame]);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}