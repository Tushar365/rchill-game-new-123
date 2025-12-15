'/use client';

type CelebrationContentProps = {
  showContent: boolean;
  onRestart: () => void;
};

export default function CelebrationContent({ showContent, onRestart }: CelebrationContentProps) {
  return (
    <div style={{
      transition: 'all 1s',
      transform: showContent ? 'scale(1)' : 'scale(0)',
      opacity: showContent ? 1 : 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 10,
      width: '90%',
      maxWidth: '600px',
      textAlign: 'center',
      padding: '20px',
      gap: '20px'
    }}>
      {/* Names */}
      <div style={{
        fontSize: 'clamp(1.5rem, 8vw, 3rem)',
        fontWeight: 900,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <span>Tushar</span>
        <span style={{ 
          color: '#ff69b4', 
          fontSize: '1.2em',
          animation: 'heartBeat 1.5s ease-in-out infinite'
        }}>
          💖
        </span>
        <span>Rinni</span>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 12vw, 5rem)',
        fontWeight: 900,
        background: 'linear-gradient(to right, #ffc0cb, #ff1493, #ffc0cb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: 0,
        lineHeight: 1.2,
        animation: 'glow 3s ease-in-out infinite'
      }}>
        I LOVE YOU!
      </h1>
      
      {/* Couple Emoji */}
      <div style={{
        width: 'clamp(200px, 50vw, 400px)',
        height: 'auto',
        animation: 'heartBeat 1.5s ease-in-out infinite'
      }}>
        <img 
          src="/cute_couple.png" 
          alt="Cute Couple"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px rgba(255,105,180,0.5))'
          }}
          draggable={false}
        />
      </div>

      {/* Message */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '20px',
        width: '100%'
      }}>
        <p style={{
          fontSize: 'clamp(1rem, 4vw, 1.8rem)',
          color: '#ffc0cb',
          fontStyle: 'italic',
          margin: 0
        }}>
          You are the one for me! 
          <span style={{
            display: 'inline-block',
            marginLeft: '8px',
            animation: 'sparkle 2s ease-in-out infinite'
          }}>
            ✨
          </span>
        </p>
      </div>

      {/* Button */}
      <button 
        onClick={onRestart}
        onTouchStart={(e) => { e.preventDefault(); onRestart(); }}
        style={{
          padding: '15px 40px',
          background: 'linear-gradient(to right, #ff1493, #ff69b4, #ff1493)',
          borderRadius: '50px',
          fontSize: 'clamp(1rem, 4vw, 1.5rem)',
          fontWeight: 900,
          color: 'white',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 30px rgba(255,105,180,0.9)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'transform 0.2s',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Play Again 💕
      </button>

      {/* Hearts */}

    </div>
  );
}