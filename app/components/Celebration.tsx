'use client';

import { useEffect, useRef, useState } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  emoji?: string;
};

export default function Celebration({ onRestartAction }: { onRestartAction: () => void }) {
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Audio
    const audio = new Audio('/i-love.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));

    // UI Entry
    setTimeout(() => setShowContent(true), 300);

    // Canvas Setup
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle System
    const particles: Particle[] = [];
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ffff00', '#ffd700', '#ff6347', '#ff4500'];
    const emojis = ['💖', '💕', '💘', '💝', '💓', '💗', '💞', '💟', '😍', '😘', '💍', '🌹', '✨', '⭐', '💫'];

    // Create massive amount of particles
    for (let i = 0; i < 300; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height, // Start above
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 30 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        emoji: Math.random() > 0.3 ? emojis[Math.floor(Math.random() * emojis.length)] : undefined
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.01) + p.vx;
        p.rotation += p.rotationSpeed;

        // Reset if off bottom
        if (p.y > canvas.height + 50) {
          p.y = -50;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.emoji) {
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          // Draw heart shape approx or separate confetti rect
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      audio.pause(); 
    };
  }, []);

  return (
    <div className="celebration-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-950 via-purple-950 to-pink-950 text-white overflow-hidden">
        
        {/* Canvas Background */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />
        
        {/* Animated background orbs (CSS is fine for these few items) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
            <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slower" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl animate-pulse-glow" />
        </div>
        
        <div className={`transition-all duration-1000 transform ${showContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} flex flex-col items-center z-10 w-full max-w-md md:max-w-5xl text-center h-[90vh] md:h-auto justify-evenly md:justify-center overflow-y-auto`}>
            
            {/* Names (Top Priority) */}
            <div className="relative w-full flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent blur-xl" />
                <div className="relative text-2xl md:text-6xl font-black text-white mb-1 animate-fade-in-up tracking-wide flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4">
                    <span className="inline-block hover:scale-110 transition-transform duration-300">Tushar</span>
                    <span className="text-pink-400 animate-heart-beat inline-block text-3xl md:text-5xl">💖</span>
                    <span className="inline-block hover:scale-110 transition-transform duration-300">Rinni</span>
                </div>
                <div className="text-sm md:text-xl text-pink-200/80 font-light tracking-widest animate-fade-in-up-delayed">
                    Forever & Always
                </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-[8rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-red-300 to-pink-200 animate-glow leading-tight tracking-tight break-words w-full flex-shrink-0">
                I LOVE YOU!
            </h1>
            
            {/* Couple Emoji */}
            <div className="relative flex-shrink-0 my-2">
                <div className="absolute inset-0 bg-pink-500/30 blur-2xl rounded-full animate-pulse-glow" />
                <div className="relative text-7xl md:text-9xl animate-heart-beat filter drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]">
                   👩🏼‍❤️‍👨🏽 
                </div>
            </div>

            {/* Message Card */}
            <div className="relative group w-full animate-fade-in-up-delayed px-4 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 md:px-8 md:py-8">
                    <p className="text-lg md:text-4xl text-pink-50 font-serif italic leading-relaxed">
                        You are the one for me!
                        <span className="inline-block ml-2 animate-sparkle">✨</span>
                    </p>
                </div>
            </div>

            {/* Button */}
            <button 
                onClick={onRestartAction}
                className="group relative px-8 py-3 md:px-14 md:py-7 bg-gradient-to-r from-red-600 via-pink-500 to-red-600 rounded-full text-xl md:text-3xl font-black text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_50px_rgba(255,105,180,0.9)] hover:shadow-[0_0_80px_rgba(255,105,180,1)] border-4 border-white/30 flex-shrink-0 my-2"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/20 to-pink-400/0 rounded-full animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2 md:gap-3">
                    Play Again 
                    <span className="animate-heart-beat inline-block group-hover:scale-125 transition-transform">💕</span>
                </span>
            </button>

            {/* Decorative hearts */}
            <div className="flex gap-4 text-2xl md:text-3xl animate-fade-in-up-more-delayed justify-center flex-shrink-0">
                <span className="animate-float">💝</span>
                <span className="animate-float-delayed">💘</span>
                <span className="animate-float-more-delayed">💝</span>
            </div>
        </div>

        <style jsx global>{`
            @keyframes glow {
                0%, 100% { 
                    filter: drop-shadow(0 0 30px rgba(255,105,180,0.9)) drop-shadow(0 0 15px rgba(255,105,180,0.6));
                }
                50% { 
                    filter: drop-shadow(0 0 50px rgba(255,105,180,1)) drop-shadow(0 0 80px rgba(255,105,180,0.7));
                }
            }
            .animate-glow {
                animation: glow 3s ease-in-out infinite;
            }
            @keyframes heart-beat {
                0%, 100% { transform: scale(1); }
                10%, 30% { transform: scale(1.15); }
                20%, 40% { transform: scale(1.05); }
            }
            .animate-heart-beat {
                animation: heart-beat 1.5s ease-in-out infinite;
            }
            @keyframes fade-in-up {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-fade-in {
                animation: fade-in-up 0.8s ease-out forwards;
            }
            .animate-fade-in-up {
                animation: fade-in-up 1s ease-out 0.3s forwards;
                opacity: 0;
            }
            .animate-fade-in-up-delayed {
                animation: fade-in-up 1s ease-out 0.6s forwards;
                opacity: 0;
            }
            .animate-fade-in-up-more-delayed {
                animation: fade-in-up 1s ease-out 0.9s forwards;
                opacity: 0;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(10deg); }
            }
            .animate-float {
                animation: float 3s ease-in-out infinite;
            }
            .animate-float-delayed {
                animation: float 3s ease-in-out 0.3s infinite;
            }
            .animate-float-more-delayed {
                animation: float 3s ease-in-out 0.6s infinite;
            }
            @keyframes float-slow {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(30px, 30px) scale(1.1); }
            }
            .animate-float-slow {
                animation: float-slow 8s ease-in-out infinite;
            }
            .animate-float-slower {
                animation: float-slow 10s ease-in-out infinite reverse;
            }
            @keyframes pulse-glow {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.1); }
            }
            .animate-pulse-glow {
                animation: pulse-glow 4s ease-in-out infinite;
            }
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
            .animate-shimmer {
                animation: shimmer 3s ease-in-out infinite;
            }
            @keyframes sparkle {
                0%, 100% { 
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
                50% { 
                    transform: scale(1.3) rotate(180deg);
                    opacity: 0.8;
                }
            }
            .animate-sparkle {
                animation: sparkle 2s ease-in-out infinite;
            }
        `}</style>
    </div>
  );
}
