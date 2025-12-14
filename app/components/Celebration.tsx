'use client';

import { useEffect, useState } from 'react';

export default function Celebration({ onRestartAction }: { onRestartAction: () => void }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Play the celebration audio on mount
    const audio = new Audio('/i-love.mp3');
    audio.play().catch(e => console.log('Audio play failed (user interaction needed?):', e));

    // Animate content entry
    setTimeout(() => setShowContent(true), 100);

    // Create massive confetti/hearts effect
    const createParticles = () => {
      const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ffff00', '#00ff00', '#00ffff'];
      const emojis = ['💖', '💕', '💘', '💝', '💓', '💗', '💞', '💟', '😍', '😘', '💍'];
      
      const container = document.querySelector('.celebration-particles');
      if (!container) return;

      for (let i = 0; i < 100; i++) {
        const p = document.createElement('div');
        p.className = 'celebration-particle';
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = Math.random() * 3 + 2 + 's';
        p.style.fontSize = Math.random() * 2 + 1 + 'rem';
        p.style.color = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(p);

        // Remove after animation
        setTimeout(() => p.remove(), 5000);
      }
    };

    const interval = setInterval(createParticles, 500);
    createParticles(); // Initial burst

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="celebration-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white overflow-hidden">
        <div className="celebration-particles absolute inset-0 pointer-events-none" />
        
        <div className={`transition-all duration-1000 transform ${showContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} flex flex-col items-center z-10`}>
            <h1 className="text-6xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse mb-8 drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)]">
                I LOVE YOU!
            </h1>
            
            <div className="text-8xl animate-bounce mb-8">
                💑
            </div>

            <p className="text-2xl md:text-4xl text-pink-300 font-serif italic mb-12 text-center px-4">
                You are the best thing that ever happened to me!
            </p>

            <button 
                onClick={onRestartAction}
                className="px-12 py-6 bg-gradient-to-r from-red-600 to-pink-600 rounded-full text-2xl font-bold hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,105,180,0.6)] border-4 border-white/20"
            >
                Play Again 💕
            </button>
        </div>

        <style jsx global>{`
            .celebration-particle {
                position: absolute;
                top: -10vh;
                animation: fall linear forwards;
            }
            @keyframes fall {
                to {
                    transform: translateY(110vh) rotate(360deg);
                }
            }
        `}</style>
    </div>
  );
}
