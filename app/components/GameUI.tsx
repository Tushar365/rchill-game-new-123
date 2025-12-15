'use client';

type GameUIProps = {
  kissCount: number;
  targetKisses: number;
  combo: number;
};

export default function GameUI({ kissCount, targetKisses, combo }: GameUIProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '5vh',
      left: 0,
      right: 0,
      textAlign: 'center',
      zIndex: 10,
      pointerEvents: 'none',
      padding: '0 20px'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
        color: '#ff1493',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        margin: 0,
        fontWeight: 900
      }}>
        Kisses: {kissCount} / {targetKisses}
      </h2>
      
      {combo > 1 && (
        <div style={{
          fontSize: 'clamp(1.2rem, 5vw, 2rem)',
          color: '#ff6b6b',
          fontWeight: 'bold',
          marginTop: '10px',
          animation: 'pulse 0.5s infinite'
        }}>
          🔥 {combo}x COMBO!
        </div>
      )}
      
      <div style={{
        width: '80%',
        maxWidth: '300px',
        height: '15px',
        margin: '15px auto 0',
        background: 'rgba(255,255,255,0.5)',
        border: '2px solid #ff69b4',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${(kissCount / targetKisses) * 100}%`,
          background: 'linear-gradient(to right, #ff1493, #ff69b4)',
          transition: 'width 0.3s ease-out'
        }} />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}