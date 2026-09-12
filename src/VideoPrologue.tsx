import React, { useRef, useEffect, useState } from 'react';
import { audioSynth } from './audioSynthesizer';

interface VideoPrologueProps {
  /** Callback fired when video finishes or when skipped by the player */
  onComplete: () => void;
  /** Video file path relative to public/ */
  videoSrc?: string;
}

export const VideoPrologue: React.FC<VideoPrologueProps> = ({
  onComplete,
  videoSrc = '/prologue.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [requiresUserInteraction, setRequiresUserInteraction] = useState(false);

  // Handle ambient drone audio lifecycle and keyboard skip
  useEffect(() => {
    try {
      audioSynth.startAmbientDrone();
    } catch {
      // Audio safety guard
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      try {
        audioSynth.stopAmbientDrone();
      } catch {
        // Audio safety guard
      }
    };
  }, []);

  // Autoplay handler with browser audio safety fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setRequiresUserInteraction(false);
        })
        .catch(() => {
          // Browser blocked unmuted autoplay
          setRequiresUserInteraction(true);
        });
    }
  }, []);

  const handleFinish = () => {
    try {
      audioSynth.stopAmbientDrone();
      audioSynth.playTelemetryPing();
    } catch {
      // Audio safety guard
    }
    onComplete();
  };

  const handleManualStart = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsPlaying(true);
        setRequiresUserInteraction(false);
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000000,
        backgroundColor: '#000000',
        fontFamily: "'Courier New', Courier, monospace",
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 0 15px rgba(0, 229, 255, 0.3); }
          50% { box-shadow: 0 0 30px rgba(0, 229, 255, 0.7); }
        }
        .skip-button {
          animation: pulse-btn 2s infinite ease-in-out;
        }
        .skip-button:hover {
          background: #00e5ff !important;
          color: #000000 !important;
        }
      `}</style>

      {/* Main Fullscreen Video Stream */}
      <video
        ref={videoRef}
        src={videoSrc}
        onEnded={handleFinish}
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Top Banner Indicator */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: '#00e5ff',
          fontSize: '11px',
          letterSpacing: '2px',
          background: 'rgba(2, 6, 23, 0.75)',
          padding: '6px 14px',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          borderRadius: '2px',
          pointerEvents: 'none',
        }}
      >
        TRANSMISSION ARCHIVE // 2K75 MISSION PROLOGUE
      </div>

      {/* Interactive Autoplay Fallback Prompt */}
      {requiresUserInteraction && !isPlaying && (
        <div
          onClick={handleManualStart}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              border: '1px solid #00e5ff',
              padding: '24px 36px',
              background: 'rgba(3, 20, 46, 0.95)',
              boxShadow: '0 0 35px rgba(0, 229, 255, 0.4)',
            }}
          >
            <div style={{ color: '#00e5ff', fontSize: '14px', letterSpacing: '2px', marginBottom: '8px' }}>
              AUDIO/VIDEO CHANNEL READY
            </div>
            <div style={{ color: '#f8fafc', fontSize: '11px', letterSpacing: '1px' }}>
              CLICK ANYWHERE TO ENGAGE NEURAL TRANSMISSION
            </div>
          </div>
        </div>
      )}

      {/* Skip Button */}
      <button
        type="button"
        className="skip-button"
        onClick={handleFinish}
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '32px',
          background: 'rgba(2, 6, 23, 0.85)',
          border: '1px solid #00e5ff',
          color: '#00e5ff',
          padding: '10px 22px',
          fontSize: '11px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          cursor: 'pointer',
          outline: 'none',
          borderRadius: '2px',
          transition: 'all 0.2s ease',
          zIndex: 10,
        }}
      >
        SKIP PROLOGUE [ENTER]
      </button>
    </div>
  );
};

export default VideoPrologue;