'/use client';

import { useEffect, useState } from 'react';
import CelebrationCanvas from './CelebrationCanvas';
import CelebrationContent from './CelebrationContent';

type CelebrationProps = {
  onRestart: () => void;
};

export default function Celebration({ onRestart }: CelebrationProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <CelebrationCanvas />
      <CelebrationContent showContent={showContent} onRestart={onRestart} />
    </div>
  );
}