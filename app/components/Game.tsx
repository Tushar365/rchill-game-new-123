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
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isCelebration, setIsCelebration] = useState(false);
  const [lastHitTimestamp, setLastHitTimestamp] = useState(0);
  
  // Game loop ref to avoid dependency cycles in useEffect
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const bearRef = useRef<HTMLDivElement>(null);
  
  // Constants
  const TARGET_KISSES = 10;
  const HIT_COOLDOWN = 1000; // Reduced cooldown significantly since projectiles are slow (~1s)

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isCelebration, kissCount]); 

  // Animation Loop
  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      updateGame();
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  // Update Game Logic
  const updateGame = () => {
    if (isCelebration) return; 

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;

    // 1. Update Projectiles
    setProjectiles(prev => {
      return prev.map(p => ({
        ...p,
        x: p.x + 5 // Slow speed (was 15)
      })).filter(p => {
        // Collision check
        if (p.x > screenWidth - 150) { 
          handleHit();
          return false;
        }
        return p.x < screenWidth;
      });
    });

    // 2. Update Particles
    setParticles(prev => prev.map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.5,
      life: p.life - 0.02
    })).filter(p => p.life > 0));
  };

  // Spawn Particles (Moved before handleHit)
  const spawnParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
        newParticles.push({
            id: Math.random(),
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1.0,
            emoji: ['💖', '💕', '✨', '💋'][Math.floor(Math.random() * 4)]
        });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Handle Hit Logic
  const cooldownRef = useRef(0);

  const handleHit = () => {
    const now = Date.now();
    if (now - cooldownRef.current < HIT_COOLDOWN) {
        return;
    }
    cooldownRef.current = now;

    // Play Hit Sound (ohyesh.mp3)
    const audio = new Audio('/ohyesh.mp3');
    audio.play().catch(e => console.error("Audio play failed (hit)", e));

    setKissCount(prev => {
      const newCount = prev + 1;
      if (newCount >= TARGET_KISSES) {
        setIsCelebration(true);
      }
      return newCount;
    });

    // Visual Shake
    if (bearRef.current) {
      bearRef.current.animate([
        { transform: 'translateY(-50%) rotate(0deg)' },
        { transform: 'translateY(-50%) translate(-5px, 5px) rotate(-5deg)' },
        { transform: 'translateY(-50%) translate(5px, -5px) rotate(5deg)' },
        { transform: 'translateY(-50%) rotate(0deg)' }
      ], {
        duration: 500
      });
    }

    // Spawn Particles
    if (typeof window !== 'undefined') {
        spawnParticles(window.innerWidth - 100, window.innerHeight / 2);
    }
  };
  
  const shootKiss = () => {
    if (isCelebration) return;
    
    // Play Kiss Sound (kiss.wav)
    const audio = new Audio('/kiss.wav');
    audio.play().catch(e => console.error("Audio play failed (shoot)", e));

    // Spawn projectile
    const newProjectile: Projectile = {
      id: Date.now(),
      x: 150, 
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300
    };
    setProjectiles(prev => [...prev, newProjectile]);
  };

  const restartGame = () => {
      setKissCount(0);
      setIsCelebration(false);
      setProjectiles([]);
      setParticles([]);
      cooldownRef.current = 0; 
  };

  return (
    <div className="game-container">
      
      {/* Celebration Overlay */}
      {/* Celebration Overlay */}
      {isCelebration && (
        <Celebration onRestartAction={restartGame} />
      )}

      {/* Score / Progress */}
      <div className="score-board">
        <h2 className="score-text">
           Kisses: {kissCount} / {TARGET_KISSES}
        </h2>
        <div className="progress-bar">
            <div 
                className="progress-fill" 
                style={{ width: `${(kissCount / TARGET_KISSES) * 100}%` }}
            />
        </div>
      </div>

      {/* Rabbit (Rinni) */}
      <div 
        className="character rabbit"
        onClick={shootKiss}
      >
        🐰
        <div className="character-label">Rinni</div>
      </div>

      {/* Bear (Tushar) */}
      <div 
        ref={bearRef}
        className="character bear"
      >
        🐻
        <div className="character-label">Tushar</div>
      </div>

      {/* Projectiles */}
      {projectiles.map(p => (
        <div 
          key={p.id}
          className="projectile"
          style={{ left: p.x, top: p.y }}
        >
          💋
        </div>
      ))}

      {/* Particles */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="particle"
          style={{ 
            left: p.x, 
            top: p.y, 
            opacity: p.life,
            transform: `scale(${p.life})` 
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Mobile Control Button */}
      <div className="controls">
        <button 
          onClick={shootKiss}
          className="kiss-button"
        >
          TAP TO KISS 💋
        </button>
      </div>
    </div>
  );
}



// However, I need to ensure `handleHit` correctly references `realHandleHit` logic.
// I'll just inline the logic correction into the component body above.
