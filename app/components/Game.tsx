'use client';

import { useState, useEffect, useRef } from 'react';

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

import Celebration from './Celebration';

export default function Game() {
  const [kissCount, setKissCount] = useState(0);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isCelebration, setIsCelebration] = useState(false);
  const [combo, setCombo] = useState(0);
  
  // Use refs for game state that needs to be accessed in animation loop
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const bearRef = useRef<HTMLDivElement>(null);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cooldownRef = useRef(0);
  const comboTimerRef = useRef<number>(0);
  
  // Constants
  const TARGET_KISSES = 10;
  const HIT_COOLDOWN = 800;
  const PROJECTILE_SPEED = 6;
  const COMBO_WINDOW = 2000; // 2 seconds to maintain combo

  // Sync refs with state
  useEffect(() => {
    projectilesRef.current = projectiles;
  }, [projectiles]);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  // Game loop
  useEffect(() => {
    let animationId: number;
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = lastTimeRef.current ? currentTime - lastTimeRef.current : 0;
      lastTimeRef.current = currentTime;
      
      if (!isCelebration && deltaTime > 0) {
        updateGame(deltaTime);
      }
      
      animationId = requestAnimationFrame(gameLoop);
    };
    
    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isCelebration]);

  // Combo timer
  useEffect(() => {
    if (combo > 0) {
      const timer = setTimeout(() => {
        setCombo(0);
      }, COMBO_WINDOW);
      return () => clearTimeout(timer);
    }
  }, [combo, COMBO_WINDOW]);

  // Update Game Logic (now with delta time for consistent movement)
  const updateGame = (deltaTime: number) => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
    const bearX = screenWidth - 100;
    const bearY = screenHeight / 2;
    
    // Update Projectiles with collision detection
    const updatedProjectiles = projectilesRef.current.map(p => ({
      ...p,
      x: p.x + PROJECTILE_SPEED
    }));
    
    const hitProjectiles: number[] = [];
    const remainingProjectiles = updatedProjectiles.filter((p, index) => {
      // Check collision with bear (circular hitbox)
      const dx = p.x - bearX;
      const dy = p.y - bearY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 60) { // Hit radius
        hitProjectiles.push(index);
        return false;
      }
      
      return p.x < screenWidth;
    });
    
    // Process hits
    if (hitProjectiles.length > 0) {
      handleHit(bearX, bearY);
    }
    
    setProjectiles(remainingProjectiles);
    
    // Update Particles
    const updatedParticles = particlesRef.current.map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.5, // gravity
      life: p.life - 0.015
    })).filter(p => p.life > 0);
    
    setParticles(updatedParticles);
  };

  // Spawn Particles with more variety
  const spawnParticles = (x: number, y: number, isCombo: boolean = false) => {
    const particleCount = isCombo ? 25 : 15;
    const newParticles: Particle[] = [];
    const emojis = isCombo 
      ? ['💖', '💕', '✨', '💋', '🌟', '💫']
      : ['💖', '💕', '✨', '💋'];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random(),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * (isCombo ? 20 : 15),
        vy: (Math.random() - 0.5) * (isCombo ? 20 : 15) - 5, // bias upward
        life: 1.0,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Handle Hit Logic with combo system
  const handleHit = (x: number, y: number) => {
    const now = Date.now();
    if (now - cooldownRef.current < HIT_COOLDOWN) {
      return;
    }
    cooldownRef.current = now;

    // Update combo
    setCombo(prev => prev + 1);

    // Play Hit Sound
    const audio = new Audio('/ohyesh.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed (hit)", e));

    // Update kiss count
    setKissCount(prev => {
      const newCount = prev + 1;
      if (newCount >= TARGET_KISSES) {
        setIsCelebration(true);
      }
      return newCount;
    });

    // Visual feedback based on combo
    if (bearRef.current) {
      const intensity = Math.min(combo, 5);
      bearRef.current.animate([
        { transform: 'translateY(-50%) scale(1) rotate(0deg)' },
        { transform: `translateY(-50%) scale(${1.1 + intensity * 0.05}) translate(-${intensity * 2}px, ${intensity * 2}px) rotate(-${intensity * 2}deg)` },
        { transform: `translateY(-50%) scale(${1.1 + intensity * 0.05}) translate(${intensity * 2}px, -${intensity * 2}px) rotate(${intensity * 2}deg)` },
        { transform: 'translateY(-50%) scale(1) rotate(0deg)' }
      ], {
        duration: 400,
        easing: 'ease-out'
      });
    }

    // Spawn Particles (more for combos)
    spawnParticles(x, y, combo > 2);
  };
  
  const shootKiss = () => {
    if (isCelebration) return;
    
    // Play Kiss Sound
    const audio = new Audio('/kiss.wav');
    audio.volume = 0.4;
    audio.play().catch(e => console.error("Audio play failed (shoot)", e));

    // Spawn projectile at rabbit position
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
    const newProjectile: Projectile = {
      id: Date.now() + Math.random(), // More unique IDs
      x: 150, 
      y: screenHeight / 2
    };
    setProjectiles(prev => [...prev, newProjectile]);
  };

  const restartGame = () => {
    setKissCount(0);
    setCombo(0);
    setIsCelebration(false);
    setProjectiles([]);
    setParticles([]);
    cooldownRef.current = 0;
    lastTimeRef.current = 0;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Celebration Overlay */}
      {isCelebration && (
        <Celebration onRestartAction={restartGame} />
      )}

      {/* Score / Progress */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#ff1493',
          margin: '0 0 0.5rem 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
           Kisses: {kissCount} / {TARGET_KISSES}
        </h2>
        {combo > 1 && (
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#ff6b6b',
            textShadow: '0 0 10px rgba(255, 107, 107, 0.5)',
            animation: 'pulse 0.5s ease-in-out infinite',
            marginTop: '0.5rem'
          }}>
            🔥 {combo}x COMBO!
          </div>
        )}
        <div style={{
          width: '300px',
          height: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '2px solid #ff69b4',
          marginTop: '1rem'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#ff1493',
            width: `${(kissCount / TARGET_KISSES) * 100}%`,
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 10px rgba(255, 20, 147, 0.5)'
          }} />
        </div>
      </div>

      {/* Rabbit (Rinni) */}
      <div 
        onClick={shootKiss}
        style={{
          position: 'absolute',
          left: '100px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '5rem',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'transform 0.1s',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
      >
        🐰
        <div style={{
          fontSize: '1rem',
          textAlign: 'center',
          color: '#ff1493',
          fontWeight: 'bold',
          marginTop: '0.5rem'
        }}>
          Rinni
        </div>
      </div>

      {/* Bear (Tushar) */}
      <div 
        ref={bearRef}
        style={{
          position: 'absolute',
          right: '100px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '5rem',
          userSelect: 'none',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
        }}
      >
        🐻
        <div style={{
          fontSize: '1rem',
          textAlign: 'center',
          color: '#ff1493',
          fontWeight: 'bold',
          marginTop: '0.5rem'
        }}>
          Tushar
        </div>
      </div>

      {/* Projectiles */}
      {projectiles.map(p => (
        <div 
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            fontSize: '2rem',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}
        >
          💋
        </div>
      ))}

      {/* Particles */}
      {particles.map(p => (
        <div 
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            fontSize: '1.5rem',
            opacity: p.life,
            transform: `translate(-50%, -50%) scale(${p.life})`,
            pointerEvents: 'none',
            transition: 'opacity 0.1s, transform 0.1s'
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Mobile Control Button */}
      <div style={{
        position: 'absolute',
        bottom: '3rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}>
        <button 
          onClick={shootKiss}
          disabled={isCelebration}
          style={{
            padding: '1.5rem 3rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backgroundColor: '#ff1493',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: isCelebration ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(255, 20, 147, 0.4)',
            transition: 'all 0.2s',
            opacity: isCelebration ? 0.5 : 1
          }}
          onMouseEnter={(e) => !isCelebration && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          TAP TO KISS 💋
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}