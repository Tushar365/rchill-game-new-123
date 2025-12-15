'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Celebration from './Celebration';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import Character from './Character';
import ShootButton from './ShootButton';

export type Projectile = {
  id: number;
  x: number;
  y: number;
};

export type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  emoji: string;
};

import { gameConfig } from '../game.config';

export default function Game() {
  const [kissCount, setKissCount] = useState(0);
  const [isCelebration, setIsCelebration] = useState(false);
  const [combo, setCombo] = useState(0);
  
  const bearRef = useRef<HTMLDivElement>(null);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cooldownRef = useRef(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio Refs
  const shootSoundRef = useRef<HTMLAudioElement | null>(null);
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const TARGET_KISSES = gameConfig.targetKisses;
  const HIT_COOLDOWN = 800;
  const COMBO_WINDOW = 2000;

  // Initialize Audio
  useEffect(() => {
    shootSoundRef.current = new Audio('/kiss.wav');
    hitSoundRef.current = new Audio('/OHYESH.mp3');
    winSoundRef.current = new Audio('/i-love.mp3');

    // Preload
    shootSoundRef.current.load();
    hitSoundRef.current.load();
    winSoundRef.current.load();

    return () => {
        if (winSoundRef.current) {
            winSoundRef.current.pause();
            winSoundRef.current.currentTime = 0;
        }
    };
  }, []);

  // Combo Timer
  useEffect(() => {
    if (combo > 0) {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => setCombo(0), COMBO_WINDOW);
    }
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, [combo]);

  // Celebration Music Trigger
  useEffect(() => {
    if (isCelebration && winSoundRef.current) {
        winSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [isCelebration]);

  const spawnParticles = useCallback((x: number, y: number, isCombo: boolean) => {
    const count = isCombo ? 20 : 12;
    const emojis = ['💖', '💕', '✨', '💋', '⭐'];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 5;
      
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2,
        life: 1.0,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, []);

  const handleHit = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - cooldownRef.current < HIT_COOLDOWN) return;
    
    cooldownRef.current = now;

    // Play Hit Sound
    if (hitSoundRef.current) {
        hitSoundRef.current.currentTime = 0;
        hitSoundRef.current.play().catch(e => console.log('Hit sound failed:', e));
    }
    
    setCombo(prev => prev + 1);
    setKissCount(prev => {
      const newCount = prev + 1;
      if (newCount >= TARGET_KISSES) {
        setIsCelebration(true);
      }
      return newCount;
    });

    if (bearRef.current) {
      bearRef.current.style.transform = 'translateY(-50%) scale(1.3)';
      setTimeout(() => {
        if (bearRef.current) {
          bearRef.current.style.transform = 'translateY(-50%) scale(1)';
        }
      }, 150);
    }

    spawnParticles(x, y, combo > 2);
  }, [combo, spawnParticles]);
  
  const shootKiss = useCallback(() => {
    if (isCelebration) return;

    // Play Shoot Sound
    if (shootSoundRef.current) {
        shootSoundRef.current.currentTime = 0;
        shootSoundRef.current.play().catch(e => console.log('Shoot sound failed:', e));
    }
    
    const startX = window.innerWidth * 0.15;
    const startY = window.innerHeight / 2;
    
    projectilesRef.current.push({
      id: Date.now() + Math.random(),
      x: startX,
      y: startY
    });
  }, [isCelebration]);

  const restartGame = useCallback(() => {
    setKissCount(0);
    setCombo(0);
    setIsCelebration(false);
    projectilesRef.current = [];
    particlesRef.current = [];
    cooldownRef.current = 0;

    // Stop celebration music
    if (winSoundRef.current) {
        winSoundRef.current.pause();
        winSoundRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      
      <GameCanvas 
        projectilesRef={projectilesRef}
        particlesRef={particlesRef}
        isCelebration={isCelebration}
        onHit={handleHit}
      />
      
      {isCelebration && <Celebration onRestart={restartGame} />}

      <GameUI 
        kissCount={kissCount}
        targetKisses={TARGET_KISSES}
        combo={combo}
      />

      <Character
        emoji={gameConfig.player1.emoji}
        name={gameConfig.player1.name}
        position="left"
        onClick={shootKiss}
        imageUrl={gameConfig.player1.image}
      />

      <Character
        emoji={gameConfig.player2.emoji}
        name={gameConfig.player2.name}
        position="right"
        ref={bearRef}
        imageUrl={gameConfig.player2.image}
      />

      <ShootButton 
        onClick={shootKiss}
        disabled={isCelebration}
      />
    </div>
  );
}