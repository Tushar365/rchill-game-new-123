'use client';

import { useEffect, useState } from 'react';

export default function Celebration({ onRestartAction }: { onRestartAction: () => void }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Play the celebration audio on mount
    const audio = new Audio('/i-love.mp3');
    audio.play().catch(e => console.log('Audio play failed (user interaction needed?):', e));

    // Animate content entry with staggered timing
    setTimeout(() => setShowContent(true), 300);

    // Create massive confetti/hearts effect with more variety
    const createParticles = () => {
      const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ffff00', '#ffd700', '#ff6347', '#ff4500'];
      const emojis = ['💖', '💕', '💘', '💝', '💓', '💗', '💞', '💟', '😍', '😘', '💍', '🌹', '✨', '⭐', '💫'];
      
      const container = document.querySelector('.celebration-particles');
      if (!container) return;

      for (let i = 0; i < 120; i++) {
        const p = document.createElement('div');
        p.className = 'celebration-particle';
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = Math.random() * 4 + 3 + 's';
        p.style.fontSize = Math.random() * 2.5 + 1 + 'rem';
        p.style.animationDelay = Math.random() * 0.5 + 's';
        
        // Add rotating and swaying effects
        const rotation = Math.random() * 720 - 360;
        const sway = Math.random() * 200 - 100;
        p.style.setProperty('--rotation', `${rotation}deg`);
        p.style.setProperty('--sway', `${sway}px`);
        
        container.appendChild(p);

        // Remove after animation
        setTimeout(() => p.remove(), 7000);
      }
    };

    const interval = setInterval(createParticles, 400);
    createParticles(); // Initial burst

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="celebration-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-950 via-purple-950 to-pink-950 text-white overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slower" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl animate-pulse-glow" />
        </div>

        <div className="celebration-particles absolute inset-0 pointer-events-none" />
        
        <div className={`transition-all duration-1000 transform ${showContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} flex flex-col items-center z-10 p-4 max-w-5xl`}>
            {/* Decorative hearts above title */}
            <div className="flex gap-4 mb-4 text-4xl animate-fade-in">
                <span className="animate-float">💕</span>
                <span className="animate-float-delayed">💖</span>
                <span className="animate-float-more-delayed">💕</span>
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-red-300 to-pink-200 mb-8 animate-glow text-center leading-tight tracking-tight">
                I LOVE YOU!
            </h1>
            
            {/* Main couple emoji with glowing effect */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-pink-500/30 blur-2xl rounded-full animate-pulse-glow" />
                <div className="relative text-9xl animate-heart-beat filter drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]">
                   👩🏼‍❤️‍👨🏽 
                </div>
            </div>

            {/* Names with enhanced styling */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent blur-xl" />
                <div className="relative text-4xl md:text-6xl font-black text-white mb-2 animate-fade-in-up text-center tracking-wide">
                    <span className="inline-block hover:scale-110 transition-transform duration-300">Tushar</span>
                    <span className="text-pink-400 mx-4 animate-heart-beat inline-block text-5xl">💖</span>
                    <span className="inline-block hover:scale-110 transition-transform duration-300">Rinni</span>
                </div>
                <div className="text-xl text-pink-200/80 text-center font-light tracking-widest animate-fade-in-up-delayed">
                    Forever & Always
                </div>
            </div>

            {/* Message card */}
            <div className="relative group mb-12 animate-fade-in-up-delayed">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-6 max-w-3xl">
                    <p className="text-2xl md:text-4xl text-pink-50 font-serif italic text-center leading-relaxed">
                        You are the one for me!
                        <span className="inline-block ml-2 animate-sparkle">✨</span>
                    </p>
                </div>
            </div>

            {/* Enhanced button */}
            <button 
                onClick={onRestartAction}
                className="group relative px-14 py-7 bg-gradient-to-r from-red-600 via-pink-500 to-red-600 rounded-full text-3xl font-black text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_50px_rgba(255,105,180,0.9)] hover:shadow-[0_0_80px_rgba(255,105,180,1)] border-4 border-white/30"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/20 to-pink-400/0 rounded-full animate-shimmer" />
                <span className="relative flex items-center gap-3">
                    Play Again 
                    <span className="animate-heart-beat inline-block group-hover:scale-125 transition-transform">💕</span>
                </span>
            </button>

            {/* Decorative hearts below button */}
            <div className="flex gap-6 mt-8 text-3xl animate-fade-in-up-more-delayed">
                <span className="animate-float">💝</span>
                <span className="animate-float-delayed">💘</span>
                <span className="animate-float-more-delayed">💝</span>
            </div>
        </div>

        <style jsx global>{`
            .celebration-particle {
                position: absolute;
                top: -10vh;
                animation: fall linear forwards;
                filter: drop-shadow(0 0 8px currentColor);
            }
            @keyframes fall {
                to {
                    transform: translateY(110vh) translateX(var(--sway)) rotate(var(--rotation));
                    opacity: 0.2;
                }
            }
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