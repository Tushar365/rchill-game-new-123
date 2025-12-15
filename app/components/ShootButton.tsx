'/use client';

type ShootButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function ShootButton({ onClick, disabled = false }: ShootButtonProps) {
  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '8vh',
      left: 0,
      right: 0,
      textAlign: 'center',
      zIndex: 10
    }}>
      <button 
        onClick={onClick}
        onTouchStart={handleTouch}
        disabled={disabled}
        style={{
          padding: 'clamp(12px, 3vw, 18px) clamp(30px, 8vw, 50px)',
          fontSize: 'clamp(1rem, 4vw, 1.3rem)',
          fontWeight: 900,
          background: disabled ? '#ccc' : 'linear-gradient(to right, #ff1493, #ff69b4)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          boxShadow: disabled ? 'none' : '0 4px 20px rgba(255, 20, 147, 0.5)',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'transform 0.1s',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onMouseDown={(e) => {
          if (!disabled) e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        TAP TO KISS 💋
      </button>
    </div>
  );
}