'use client';

import { forwardRef } from 'react';

type CharacterProps = {
  emoji: string;
  name: string;
  position: 'left' | 'right';
  onClick?: () => void;
  imageUrl?: string;
};

const Character = forwardRef<HTMLDivElement, CharacterProps>(
  ({ emoji, name, position, onClick, imageUrl }, ref) => {
    const handleTouch = (e: React.TouchEvent) => {
      e.preventDefault();
      onClick?.();
    };

    return (
      <div 
        ref={ref}
        onClick={onClick}
        onTouchStart={handleTouch}
        style={{
          position: 'absolute',
          [position]: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: onClick ? 'pointer' : 'default',
          zIndex: 5,
          transition: 'transform 0.15s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          width: 'clamp(120px, 30vw, 250px)',
        }}
      >
        <img 
          src={imageUrl} 
          alt={name}
          style={{
            width: '100%',
            height: 'auto',
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))',
            objectFit: 'contain'
          }}
          draggable={false}
        />
        <div style={{
          fontSize: 'clamp(1rem, 4vw, 1.5rem)',
          color: '#ff1493',
          fontWeight: '900',
          textShadow: '2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white',
          marginTop: '-20px',
          zIndex: 1
        }}>
          {name}
        </div>
      </div>
    );
  }
);

Character.displayName = 'Character';

export default Character;