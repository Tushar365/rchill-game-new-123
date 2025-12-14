'use client';

import { useState, useEffect, useRef } from 'react';
import Celebration from './Celebration';

// Types for our game objects
type Projectile = {
  id: number;
  x: number;
  y: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  emoji: string;
};

export default function Game() {
  const [kissCount, setKissCount] = useState(0);
  const [isCelebration, setIsCelebration] = useState(false);
  const [combo, setCombo] = useState(0);
  
  // Canvas & Game State Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  const lastTimeRef = useRef<number>(0);
  const cooldownRef = useRef(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Constants
  const TARGET_KISSES = 10;
  const HIT_COOLDOWN = 800;
  const PROJECTILE_SPEED = 6;
  const COMBO_WINDOW = 2000;
  
  // Initialize Canvas & Preload Assets
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    
    // Preload Audio Assets
    const audioFiles = ['/kiss.wav', '/OHYESH.mp3', '/i-love.mp3'];
    audioFiles.forEach(src => {
      const audio = new Audio(src);
      audio.load();
    });
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game Loop
  useEffect(() => {
    let animationId: number;
    
    const render = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const deltaTime = lastTimeRef.current ? currentTime - lastTimeRef.current : 0;
      lastTimeRef.current = currentTime; // Always update lastTime
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isCelebration && deltaTime > 0) {
        updateAndDrawGame(ctx);
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isCelebration]); // Re-bind if celebration state changes

  // Combo Timer Logic
  useEffect(() => {
    if (combo > 0) {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setCombo(0);
      }, COMBO_WINDOW);
    }
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, [combo]);

  const updateAndDrawGame = (ctx: CanvasRenderingContext2D) => {
    const screenWidth = ctx.canvas.width;
    const screenHeight = ctx.canvas.height;
    
    // Positioning logic (must match CSS)
    // Bear is at right: 15%. so x ≈ width * 0.85
    const bearX = screenWidth * 0.85; 
    const bearY = screenHeight / 2;
    
    // --- UPDATE PROJECTILES ---
    const updatedProjectiles = projectilesRef.current.map(p => ({
      ...p,
      x: p.x + PROJECTILE_SPEED
    }));
    
    const hitProjectiles: number[] = [];
    const remainingProjectiles: Projectile[] = [];

    updatedProjectiles.forEach((p, index) => {
      // Draw Projectile
      ctx.font = '32px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💋', p.x, p.y);
      
      // Hit Detection
      const dx = p.x - bearX;
      const dy = p.y - bearY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Bear radius approx 60px (since font size is 2.5rem - 5rem depending on screen)
      // Let's assume a generous hit box
      if (distance < 80) {
         hitProjectiles.push(index);
      } else if (p.x < screenWidth + 50) {
        // Keep if on screen
        remainingProjectiles.push(p);
      }
    });
    
    // Process Hits
    if (hitProjectiles.length > 0) {
      // Only process the first hit per frame/group to avoid double counting if multiple hit at once
      handleHit(bearX, bearY);
    }
    
    projectilesRef.current = remainingProjectiles;
    
    // --- UPDATE PARTICLES ---
    const updatedParticles: Particle[] = [];
    
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5; // Gravity
      p.life -= 0.015;
      
      if (p.life > 0) {
        ctx.globalAlpha = p.life;
        ctx.font = '24px serif';
        
        // Save context to rotate/scale
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.life, p.life);
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
        
        updatedParticles.push(p);
      }
    });
    ctx.globalAlpha = 1.0;
    particlesRef.current = updatedParticles;
  };

  const spawnParticles = (x: number, y: number, isComboHit: boolean = false) => {
    const particleCount = isComboHit ? 25 : 15;
    const newParticles: Particle[] = [];
    const emojis = isComboHit 
      ? ['💖', '💕', '✨', '💋', '🌟', '💫']
      : ['💖', '💕', '✨', '💋'];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 6;
        
      newParticles.push({
        id: Math.random(),
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2, // Slight upward bias
        life: 1.0,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  const handleHit = (x: number, y: number) => {
    const now = Date.now();
    if (now - cooldownRef.current < HIT_COOLDOWN) return;
    
    cooldownRef.current = now;
    
    // Update State
    setCombo(prev => prev + 1);
    setKissCount(prev => {
      const newCount = prev + 1;
      if (newCount >= TARGET_KISSES) {
        setIsCelebration(true);
      }
      return newCount;
    });

    // Audio
    const audio = new Audio('/OHYESH.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed", e));
    
    // Animate Bear
    if (bearRef.current) {
        const el = bearRef.current;
        el.style.transform = 'translateY(-50%) scale(1.2) rotate(10deg)';
        setTimeout(() => {
            el.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
        }, 200);
    }

    spawnParticles(x, y, combo > 2);
  };
  
  const shootKiss = () => {
    if (isCelebration) return;
    
    const audio = new Audio('/kiss.wav');
    audio.volume = 0.4;
    audio.play().catch(() => {});

    // Spawn projectile from Rabbit Position
    // Rabbit is at left: 15%. 
    const startX = window.innerWidth * 0.15 + 40; // Approx offset
    const startY = window.innerHeight / 2;
    
    projectilesRef.current.push({
      id: Date.now() + Math.random(),
      x: startX,
      y: startY
    });
  };

  const restartGame = () => {
    setKissCount(0);
    setCombo(0);
    setIsCelebration(false);
    projectilesRef.current = [];
    particlesRef.current = [];
    cooldownRef.current = 0;
    lastTimeRef.current = 0;
  };

  return (
    <div className="game-container" style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      touchAction: 'none' // Prevent scrolling/zooming gestures
    }}>
      
      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef}
        style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1
        }}
      />
      
      {/* Celebration Overlay */}
      {isCelebration && <Celebration onRestartAction={restartGame} />}

      {/* UI Layer */}
      <div style={{ position: 'absolute', top: '2rem', left: 0, right: 0, 
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#ff1493', 
                     textShadow: '2px 2px 4px rgba(0,0,0,0.1)', margin: 0 }}>
           Kisses: {kissCount} / {TARGET_KISSES}
        </h2>
        {combo > 1 && (
          <div style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', color: '#ff6b6b', fontWeight: 'bold',
                        animation: 'pulse 0.5s infinite' }}>
            🔥 {combo}x COMBO!
          </div>
        )}
        
        {/* Progress Bar */}
        <div style={{
            width: '60%', maxWidth: '300px', height: '20px',
            margin: '1rem auto',
            background: 'rgba(255,255,255,0.5)',
            border: '2px solid #ff69b4', borderRadius: '10px',
            overflow: 'hidden'
        }}>
           <div style={{
             height: '100%',
             width: `${(kissCount / TARGET_KISSES) * 100}%`,
             background: '#ff1493',
             transition: 'width 0.3s ease-out'
           }} />
        </div>
      </div>

      {/* Characters Layer */}
      
      {/* Rinni (Rabbit) */}
      <div 
        onClick={shootKiss}
        onTouchStart={(e) => { e.preventDefault(); shootKiss(); }}
        style={{
          position: 'absolute',
          left: '15%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(3rem, 10vw, 5rem)',
          cursor: 'pointer',
          zIndex: 5,
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        className="character"
      >
        🐰
        <div style={{ fontSize: '1rem', textAlign: 'center', color: '#ff1493', fontWeight: 'bold' }}>
            Rinni
        </div>
      </div>

      {/* Tushar (Bear) */}
      <div 
        ref={bearRef}
        style={{
          position: 'absolute',
          right: '15%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(3rem, 10vw, 5rem)',
          zIndex: 5,
          transition: 'transform 0.2s',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        className="character"
      >
        🐻
        <div style={{ fontSize: '1rem', textAlign: 'center', color: '#ff1493', fontWeight: 'bold' }}>
           Tushar
        </div>
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: '10%', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
         <button 
           onClick={shootKiss}
           onTouchStart={(e) => { e.preventDefault(); shootKiss(); }}
           disabled={isCelebration}
           style={{
             padding: '1rem 2rem',
             fontSize: '1.2rem',
             fontWeight: 'bold',
             backgroundColor: '#ff1493',
             color: 'white',
             border: 'none',
             borderRadius: '50px',
             boxShadow: '0 4px 12px rgba(255, 20, 147, 0.4)',
             opacity: isCelebration ? 0.5 : 1
           }}
         >
           TAP TO KISS 💋
         </button>
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        body {
            overscroll-behavior: none;
        }
      `}</style>
    </div>
  );
}
