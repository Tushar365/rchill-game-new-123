'use client';

import { useState, useEffect } from 'react';
import styles from './love-tap.module.css';

type Role = 'home' | 'sender' | 'receiver';

export default function LoveTap() {
  const [role, setRole] = useState<Role>('home');
  const [senderData, setSenderData] = useState<{ count: number; linkId: string | null }>({
    count: 0,
    linkId: null,
  });
  const [receiverMessage, setReceiverMessage] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Check if link is expired on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get('link');
    const timestamp = params.get('ts');

    if (linkId && timestamp) {
      const createdTime = parseInt(timestamp);
      const now = Date.now();
      const expiryTime = 7 * 24 * 60 * 60 * 1000; // 7 days

      if (now - createdTime > expiryTime) {
        setIsExpired(true);
        setRole('receiver');
      } else {
        setRole('receiver');
        // Retrieve message from localStorage
        const stored = localStorage.getItem(`love-tap-${linkId}`);
        if (stored) {
          const data = JSON.parse(stored);
          setReceiverMessage(data.message);
        }
      }
    }
  }, []);

  const handleTap = () => {
    setSenderData((prev) => {
      const newCount = prev.count + 1;

      if (newCount === 10) {
        // Generate link
        const linkId = Math.random().toString(36).substring(2, 11);
        const timestamp = Date.now();
        const message = `I sent you ${newCount} taps of love ✨`;

        // Store in localStorage (for demo)
        localStorage.setItem(`love-tap-${linkId}`, JSON.stringify({ message, timestamp }));

        const fullLink = `${window.location.origin}/love-tap?link=${linkId}&ts=${timestamp}`;

        return { count: newCount, linkId };
      }

      return { ...prev, count: newCount };
    });
  };

  const copyLink = () => {
    if (senderData.linkId) {
      const fullLink = `${window.location.origin}/love-tap?link=${senderData.linkId}&ts=${Date.now()}`;
      navigator.clipboard.writeText(fullLink);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    }
  };

  const resetSender = () => {
    setSenderData({ count: 0, linkId: null });
  };

  return (
    <div className={styles.container}>
      {/* Home Screen */}
      {role === 'home' && (
        <div className={styles.screen}>
          <div className={styles.content}>
            <h1 className={styles.title}>Love Tap</h1>
            <p className={styles.subtitle}>Send affection, share moments</p>

            <div className={styles.buttonGroup}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => setRole('sender')}
              >
                Send Love
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sender Screen */}
      {role === 'sender' && (
        <div className={styles.screen}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h2>Send Love</h2>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setRole('home');
                  resetSender();
                }}
              >
                ← Back
              </button>
            </div>

            {!senderData.linkId ? (
              <>
                <div className={styles.tapArea} onClick={handleTap}>
                  <div
                    className={`${styles.tapCircle} ${handleTap ? styles.pulse : ''}`}
                  >
                    ♡
                  </div>
                  <p className={styles.tapLabel}>Tap to send love</p>
                </div>

                <div className={styles.counter}>
                  <span className={styles.count}>{senderData.count}</span>
                  <span className={styles.countLabel}> / 10</span>
                </div>
              </>
            ) : (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3>Love sent!</h3>
                <p>Your link is ready to share.</p>

                <div className={styles.linkBox}>
                  <code className={styles.linkText}>
                    {`${window.location.origin}/love-tap?link=${senderData.linkId}`}
                  </code>
                </div>

                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={copyLink}
                >
                  {copiedFeedback ? 'Copied!' : 'Copy Link'}
                </button>

                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={resetSender}
                >
                  Send Another
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receiver Screen */}
      {role === 'receiver' && (
        <div className={styles.screen}>
          <div className={styles.content}>
            {isExpired ? (
              <div className={styles.expiredState}>
                <div className={styles.expiredIcon}>∅</div>
                <h2>This moment has faded</h2>
                <p>The affection has passed, but the feeling lingers.</p>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => {
                    window.location.href = '/love-tap';
                  }}
                >
                  Send your own
                </button>
              </div>
            ) : (
              <div className={styles.receivedState}>
                <div className={styles.fadeInAnimation}>
                  <div className={styles.heart}>♡</div>
                  <p className={styles.message}>{receiverMessage || 'Someone sent you love'}</p>
                  <div className={styles.shimmer}></div>
                </div>

                <div className={styles.expiryInfo}>
                  <small>This message will fade in 7 days</small>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}