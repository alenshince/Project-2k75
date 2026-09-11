import React, { useEffect, useState } from 'react';
import type { ScriptPhase } from './narrativeScriptEngine';

interface WatcherEyeOverlayProps {
  phase: ScriptPhase;
  isSedated: boolean;
}

export const WatcherEyeOverlay: React.FC<WatcherEyeOverlayProps> = ({
  phase,
  isSedated,
}) => {
  // isBlinking controls whether the eyelids are closed or closing
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isHeavyBlink, setIsHeavyBlink] = useState<boolean>(false);

  // 1. Involuntary Natural Blinking (Every 18–24 seconds)
  useEffect(() => {
    if (isSedated) return;

    const interval = setInterval(() => {
      setIsHeavyBlink(false);
      setIsBlinking(true);

      // Fast natural blink (160ms closed)
      setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    }, 20000);

    return () => clearInterval(interval);
  }, [isSedated]);

  // 2. Scan-Induced Heavy Neural Blinks (Triggered on systemic scans)
  useEffect(() => {
    if (phase === 'SCANNING_SYSTEM') {
      setIsHeavyBlink(true);
      setIsBlinking(true);

      // First hard neural blink
      const timer1 = setTimeout(() => {
        setIsBlinking(false);

        // Secondary flutter blink 300ms later
        const timer2 = setTimeout(() => {
          setIsBlinking(true);
          setTimeout(() => {
            setIsBlinking(false);
            setIsHeavyBlink(false);
          }, 220);
        }, 320);

        return () => clearTimeout(timer2);
      }, 350);

      return () => clearTimeout(timer1);
    }
  }, [phase]);

  if (isSedated) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Upper Eyelid */}
      <div
        className={`absolute top-0 left-0 right-0 bg-black transition-all ease-in-out ${
          isBlinking
            ? 'h-[52%] opacity-100'
            : 'h-0 opacity-0'
        }`}
        style={{
          transitionDuration: isHeavyBlink ? '240ms' : '120ms',
          borderBottomLeftRadius: '50% 120px',
          borderBottomRightRadius: '50% 120px',
          boxShadow: isBlinking ? '0 25px 60px rgba(0,0,0,0.95)' : 'none',
        }}
      />

      {/* Lower Eyelid */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-black transition-all ease-in-out ${
          isBlinking
            ? 'h-[52%] opacity-100'
            : 'h-0 opacity-0'
        }`}
        style={{
          transitionDuration: isHeavyBlink ? '240ms' : '120ms',
          borderTopLeftRadius: '50% 120px',
          borderTopRightRadius: '50% 120px',
          boxShadow: isBlinking ? '0 -25px 60px rgba(0,0,0,0.95)' : 'none',
        }}
      />

      {/* Neural Retinal Peripheral Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 65%, rgba(0, 0, 0, 0.45) 85%, rgba(0, 0, 0, 0.9) 100%)',
        }}
      />

      {/* Optical Distortion Flash on Heavy Blink */}
      {isHeavyBlink && isBlinking && (
        <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color-dodge animate-pulse" />
      )}
    </div>
  );
};